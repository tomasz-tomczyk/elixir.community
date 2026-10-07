import { recordClick } from '../../server/clicks.js'
let links
// The allowlist is a static asset written after the build. Cache it per isolate.
async function load(env, request) {
  if (!links) {
    const res = await env.ASSETS.fetch(
      new URL('/outbound-links.json', request.url),
    )
    if (!res.ok) return null
    const data = await res.json()
    links = { links: new Set(data.links), pages: new Set(data.pages) }
  }
  return links
}
export async function onRequestPost({ request, env }) {
  try {
    return await recordClick(request, env, await load(env, request))
  } catch {
    return new Response(null, { status: 204 })
  }
}
export function onRequestGet() {
  return new Response(null, { status: 405 })
}
