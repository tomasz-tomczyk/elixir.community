import {
  reply,
  plunk,
  verify,
  sameOrigin,
  configured,
} from '../../server/signup.js'
export async function onRequestPost({ request, env }) {
  if (!sameOrigin(request))
    return reply('Please confirm from elixir.community.', 403)
  if (!configured(env))
    return reply('Confirmation is temporarily unavailable.', 503)
  try {
    const raw = await request.text()
    if (raw.length > 4096) return reply('Invalid link.', 400)
    let data
    try {
      data = JSON.parse(raw)
    } catch {
      return reply('Invalid link.', 400)
    }
    const payload = await verify(data?.token, env.CONFIRM_TOKEN_SECRET)
    if (!payload)
      return reply(
        'This link is invalid or expired. Please subscribe again for a new link.',
        400,
      )
    const found = await plunk(
      env,
      '/contacts?search=' + encodeURIComponent(payload.email) + '&limit=100',
    )
    const contact = found.data?.find(
      (c) => c.email.toLowerCase() === payload.email,
    )
    if (!contact)
      return reply(
        'We could not find this signup. Please subscribe again.',
        400,
      )
    if (contact.subscribed === true)
      return reply(
        'Your subscription is already confirmed. Thanks for joining Elixir Community.',
      )
    await plunk(env, '/contacts/' + encodeURIComponent(contact.id), 'PATCH', {
      subscribed: true,
      data: {
        newsletter_confirmed_at: new Date().toISOString(),
        consent_source: 'elixir.community/confirm',
        consent_version: '2026-10-07',
      },
    })
    return reply(
      'Your subscription is confirmed. Thanks for joining Elixir Community.',
    )
  } catch {
    return reply(
      'Confirmation could not be completed. Please try again later.',
      503,
    )
  }
}
export function onRequestGet() {
  return reply(
    'Open the confirmation page and press Confirm subscription.',
    405,
  )
}
