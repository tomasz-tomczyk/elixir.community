# elixir.community

A directory of Elixir events, jobs, resources, YouTube channels, podcasts, books, people and companies, plus a newsletter signup. Built with Astro and deployed on Cloudflare Pages.

## Run it

Tool versions (Node and pnpm) are pinned in `mise.toml`. Run `mise install` to get them.

```sh
pnpm install
pnpm dev           # http://localhost:4321
pnpm build         # type check, build to dist/, then write dist/outbound-links.json
node --test test/signup.test.mjs test/clicks.test.mjs
```

pnpm only runs dependency build scripts that are allowed in `pnpm-workspace.yaml` (`allowBuilds`). If an install fails with `ERR_PNPM_IGNORED_BUILDS`, run `pnpm approve-builds <package>`.

Pushes to `main` deploy automatically through the Cloudflare Pages GitHub integration.

If `pnpm dev` shows stale data after a schema change, stop it, delete `.astro/data-store.json`, and start it again.

## Where things live

| What                                                                  | Where                                                                  |
| --------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Events, resources, books, YouTube, podcasts                           | `src/data/*.yaml`                                                      |
| People, companies and jobs (one Markdown file each, with a page each) | `src/content/people/`, `src/content/companies/`, `src/content/jobs/`   |
| Schemas for all of the above                                          | `src/content.config.ts`                                                |
| Pages                                                                 | `src/pages/`                                                           |
| Images                                                                | `src/assets/images/`, with sources in `src/assets/images/sources.json` |
| Newsletter and click API (Pages Functions)                            | `functions/api/`, logic in `server/`                                   |

### Adding or editing entries

The schema in `src/content.config.ts` is the reference. Some rules that are easy to miss:

- People, companies and jobs have `last_updated`: the date you last edited the entry. Update it when you change one. It feeds the page's modified date for search engines. Other collections don't have it.
- `created` is optional and must come from a source (a founding date, a launch date). Leave it out when unknown. Don't guess a day or month you don't have.
- **Jobs:** `created` is required. It is the date the job was posted here, and job lists sort by it.
- **People:** facts go in the frontmatter. The longer profile goes in the Markdown body. To connect a person to a book, show, channel, resource or event, add their id to that entry's `people` list (`authors` for books). Their page then lists it. Keep `known_for` for things that have no entry of their own here.
- **Companies:** `url` is the company's own homepage. `description` says what the company does. `about` says how it uses Elixir. `reading` lists sources, labelled by publisher (for example "Elixir Wizards podcast").
- **Events:** use `city` (optional) and `country`, or `country: Online`. A conference `date` is its first day. A meetup `date` is its next confirmed meeting; leave it out when unknown. A new country also needs an entry in the continent and flag maps in `src/lib/site.ts`.
- **YouTube and podcasts:** don't edit video and episode counts by hand. Run `pnpm refresh`, which reads the YouTube channel pages and podcast RSS feeds. The `Refresh stats` workflow does this every Monday and opens a PR when numbers change.

## Newsletter

Signup uses double opt-in through [Plunk](https://www.useplunk.com). Plunk is the only place emails and consent state are stored. Plunk tracks opens and link clicks.

Configuration:

- Build time, public: `PUBLIC_TURNSTILE_SITE_KEY`.
- Runtime, encrypted secrets: `PLUNK_SECRET_KEY`, `TURNSTILE_SECRET_KEY`, `CONFIRM_TOKEN_SECRET`. Never set these as `PUBLIC_*` variables or commit them.

Only `/api/*` runs Pages Functions (see `public/_routes.json`).

How it works:

1. `POST /api/subscribe` validates the email and the Turnstile token (action and hostname). Each request needs a fresh token.
2. Plunk `/v1/send` sends the confirmation email. New contacts are created unsubscribed. The `/contacts` upsert after it leaves the existing subscription state alone.
3. The confirmation link carries an HMAC-SHA256 token in the URL fragment. The token is tied to its purpose and expires after 24 hours. The page removes it from the address bar on load.
4. Only an explicit `POST /api/confirm` subscribes the contact. A GET request never does.

Things to know:

- Confirmation links can't be revoked one at a time, and they can be reused until they expire. Rotating `CONFIRM_TOKEN_SECRET` invalidates all outstanding links.
- A contact who is already subscribed gets a success response, and their consent data stays as it was.
- A deleted contact can't be confirmed. An unsubscribed contact can subscribe again with a link that is still valid.
- Deletion requests are handled in Plunk. Plunk adds unsubscribe links to marketing sends.

## Outbound click counts

`src/layouts/BaseLayout.astro` sends a beacon to `/api/click` when someone clicks a link to another site. The beacon holds only the destination (`host/path`, no query string or fragment) and the current page path. There are no cookies, IDs or IPs.

`pnpm build` writes `dist/outbound-links.json`, a list of every external link in the build. `functions/api/click.js` drops clicks to links not in that list, ignores obvious bots, and writes one data point to the `CLICKS` Analytics Engine binding.

Cloudflare setup is in the dashboard, not a Wrangler file, so the existing bindings and secrets can still be edited there:

- **Pages project > Settings > Bindings > Analytics engine:** variable `CLICKS`, dataset `elixir_community_clicks`, production only. Previews without the binding record nothing.
- **Security > WAF > Rate limiting rule:** path equals `/api/click`, more than 10 requests per 10 seconds per IP, block for 10 seconds. This keeps floods from using up the shared Workers Free quota (100,000 requests a day).

To see a report, run `CF_ACCOUNT_ID=... CF_API_TOKEN=... pnpm clicks 30`. The number is how many days back to look. The token needs Account > Account Analytics > Read. Data is kept for three months.

Anyone can fake counts with a script. Before trusting a spike, compare it with page views in Cloudflare Web Analytics.
