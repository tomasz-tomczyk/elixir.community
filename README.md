# elixir.community

An Astro static resource directory and newsletter signup, deployed on Cloudflare Pages.

## Build

Use Node 22. `npm ci`, `npm run build`, and `node --test test/signup.test.mjs test/clicks.test.mjs`.
The build output is `dist`. Pushes to `main` automatically deploy through the Pages GitHub integration.

## Newsletter configuration

The build-time public variable is `PUBLIC_TURNSTILE_SITE_KEY`.
Production runtime encrypted secrets: `PLUNK_SECRET_KEY`, `TURNSTILE_SECRET_KEY`, `CONFIRM_TOKEN_SECRET`.
Never set production secrets as `PUBLIC_*` variables or commit them.

Only `/api/*` invokes Pages Functions, as defined in `public/_routes.json`.
Signup validates email, verifies Turnstile action/hostname, and requires a fresh Turnstile token for each request. There is no local per-email cooldown or token store. Confirmation tokens are HMAC-SHA256 signed, purpose-bound, expire after 24 hours, and require an explicit POST. GET never subscribes anyone. Tokens are passed in the URL fragment and removed from the address bar on load.

Plunk `/v1/send` creates new contacts unsubscribed and preserves existing subscription state when `subscribed` is omitted. The subsequent `/contacts` upsert also omits the flag. Only explicit confirmation PATCHes the exact contact to subscribed. Plunk email tracking is disabled. No welcome workflow or campaign is configured.

Plunk is the only store of newsletter emails and consent state. Signed confirmation links cannot be individually revoked or consumed: they may be reused until they expire. Already-subscribed contacts return success without changing consent metadata. Removing the contact in Plunk makes confirmation fail; an unsubscribed existing contact can be resubscribed by an explicit confirmation while the link is valid. Rotating `CONFIRM_TOKEN_SECRET` invalidates all outstanding links. Contact deletion requests are handled in Plunk. Unsubscribe links are provided by Plunk for marketing sends.

## Outbound click counts

`BaseLayout.astro` sends a beacon to `/api/click` when a visitor clicks a link to another site. It sends only the destination (`host/path`, no query string or fragment) and the current page path. No cookies, IDs or IPs.
`npm run build` runs `scripts/outbound-links.mjs`, which writes `dist/outbound-links.json` with every external link and page in the build. `functions/api/click.js` rejects anything not in that list, ignores obvious bots, and writes one data point to the `CLICKS` Analytics Engine binding.

Cloudflare setup (dashboard, not a Wrangler file, so the existing bindings and secrets stay editable there):
- Pages project > Settings > Bindings > Analytics engine: variable `CLICKS`, dataset `elixir_community_clicks`, production only. Previews without the binding record nothing.
- Security > WAF > Rate limiting rule: path equals `/api/click`, more than 10 requests per 10 seconds per IP, block for 10 seconds. This stops floods before they use the shared Workers Free quota of 100,000 requests per day.

Report: `CF_ACCOUNT_ID=... CF_API_TOKEN=... npm run clicks -- 30`. The token needs Account > Account Analytics > Read. Data is kept for three months.
Counts can be faked by anyone who scripts requests. Compare them with page views in Cloudflare Web Analytics before trusting a spike.

## Sources and maintenance

Directory content traces to the research checked on 7 October 2026. Historical or unconfirmed activity is labelled rather than invented. Images are stored locally; source attribution accompanies the asset records.
