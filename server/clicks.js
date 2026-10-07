// Outbound link click counting. Shared by the client script, the build scan and the Pages Function.
export const SITE_HOST = 'elixir.community'
const BOT =
  /bot|crawl|spider|slurp|headless|curl|wget|python|httpclient|go-http/i

// "host/path" without query string, fragment or trailing slash. Returns null for non-external links.
export function linkKey(href, base = 'https://' + SITE_HOST + '/') {
  let url
  try {
    url = new URL(href, base)
  } catch {
    return null
  }
  if (
    !/^https?:$/.test(url.protocol) ||
    url.hostname === SITE_HOST ||
    url.hostname === new URL(base).hostname
  )
    return null
  const path = url.pathname.length > 1 ? url.pathname.replace(/\/+$/, '') : ''
  return url.hostname.toLowerCase() + path
}

// links: {links: string[], pages: string[]} generated at build time by scripts/outbound-links.mjs.
export async function recordClick(request, env, links) {
  const site = request.headers.get('Sec-Fetch-Site')
  if (
    site
      ? site !== 'same-origin'
      : request.headers.get('Origin') !== 'https://' + SITE_HOST
  )
    return new Response(null, { status: 403 })
  const agent = request.headers.get('User-Agent') || ''
  if (!agent || BOT.test(agent)) return new Response(null, { status: 204 })
  const raw = await request.text()
  if (raw.length > 1024) return new Response(null, { status: 413 })
  let data
  try {
    data = JSON.parse(raw)
  } catch {
    return new Response(null, { status: 400 })
  }
  if (
    !links ||
    typeof data?.to !== 'string' ||
    typeof data?.from !== 'string' ||
    !links.links.has(data.to) ||
    !links.pages.has(data.from)
  )
    return new Response(null, { status: 400 })
  // Previews without the binding accept the click but record nothing.
  const host = data.to.split('/')[0]
  env.CLICKS?.writeDataPoint({
    indexes: [host.slice(0, 96)],
    blobs: [host, data.to.slice(host.length) || '/', data.from],
  })
  return new Response(null, { status: 204 })
}
