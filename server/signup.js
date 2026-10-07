const encoder = new TextEncoder()
export const ORIGIN = 'https://elixir.community'
export function reply(message, status = 200) {
  return Response.json(
    { message },
    { status, headers: { 'Cache-Control': 'no-store' } },
  )
}
export async function plunk(env, path, method = 'GET', body, key) {
  const res = await fetch('https://next-api.useplunk.com' + path, {
    method,
    headers: {
      Authorization: `Bearer ${env.PLUNK_SECRET_KEY}`,
      'Content-Type': 'application/json',
      ...(key ? { 'Idempotency-Key': key } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
    signal: AbortSignal.timeout(15000),
  })
  if (!res.ok) throw new Error('Email service unavailable')
  return await res.json()
}
function b64(bytes) {
  return btoa(String.fromCharCode(...bytes))
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '')
}
function unb64(text) {
  return Uint8Array.from(
    atob(
      text.replaceAll('-', '+').replaceAll('_', '/') +
        '='.repeat((4 - (text.length % 4)) % 4),
    ),
    (c) => c.charCodeAt(0),
  )
}
async function hmac(secret) {
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  )
}
export async function sign(payload, secret) {
  const body = b64(encoder.encode(JSON.stringify(payload)))
  return (
    body +
    '.' +
    b64(
      new Uint8Array(
        await crypto.subtle.sign(
          'HMAC',
          await hmac(secret),
          encoder.encode(body),
        ),
      ),
    )
  )
}
export async function verify(token, secret) {
  try {
    if (typeof token !== 'string' || token.length > 2000) return null
    const [body, sig, extra] = token.split('.')
    if (
      !body ||
      !sig ||
      extra ||
      !(await crypto.subtle.verify(
        'HMAC',
        await hmac(secret),
        unb64(sig),
        encoder.encode(body),
      ))
    )
      return null
    const p = JSON.parse(new TextDecoder().decode(unb64(body)))
    if (
      p.purpose !== 'newsletter-confirm' ||
      typeof p.email !== 'string' ||
      p.email.length > 254 ||
      !EMAIL.test(p.email) ||
      p.email !== p.email.trim().toLowerCase() ||
      !Number.isInteger(p.iat) ||
      !Number.isInteger(p.exp) ||
      p.exp !== p.iat + 86400 ||
      p.iat > Math.floor(Date.now() / 1000) ||
      p.exp <= Math.floor(Date.now() / 1000)
    )
      return null
    return p
  } catch {
    return null
  }
}
export function sameOrigin(request) {
  return request.headers.get('Origin') === ORIGIN
}
export const EMAIL = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/
export function configured(env) {
  return (
    env.PLUNK_SECRET_KEY && env.CONFIRM_TOKEN_SECRET && env.TURNSTILE_SECRET_KEY
  )
}
