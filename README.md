# elixir.community

An Astro static resource directory and newsletter signup, deployed on Cloudflare Pages.

## Build

Use Node 22. `npm ci`, `npm run build`, and `node --test test/signup.test.mjs`.
The build output is `dist`. Pushes to `main` automatically deploy through the Pages GitHub integration.

## Newsletter configuration

The build-time public variable is `PUBLIC_TURNSTILE_SITE_KEY`.
Production runtime encrypted secrets: `PLUNK_SECRET_KEY`, `TURNSTILE_SECRET_KEY`, `CONFIRM_TOKEN_SECRET`.
Production D1 binding: `SIGNUP_DB` (database `elixir-community-signups`).
Never set production secrets as `PUBLIC_*` variables or commit them.

Only `/api/*` invokes Pages Functions, as defined in `public/_routes.json`.
Signup validates email, verifies Turnstile action/hostname, and atomically enforces a ten-minute per-email cooldown in D1. Confirmation tokens are HMAC-SHA256 signed, purpose-bound, expire after 24 hours, and require an explicit POST. GET never subscribes anyone. Tokens are passed in the URL fragment and removed from the address bar on load.

Plunk `/v1/send` creates new contacts unsubscribed and preserves existing subscription state when `subscribed` is omitted. The subsequent `/contacts` upsert also omits the flag. Only explicit confirmation PATCHes the exact contact to subscribed. Plunk email tracking is disabled. No welcome workflow or campaign is configured.

D1 request records older than 30 days are cleared on the next valid signup. Contact deletion requests must be handled in Plunk as well as D1. Unsubscribe links are provided by Plunk for marketing sends.

## Sources and maintenance

Directory content traces to the research checked on 7 October 2026. Historical or unconfirmed activity is labelled rather than invented. Images are stored locally; source attribution accompanies the asset records.
