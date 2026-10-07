export const site = {
  name: 'Elixir Community',
  description:
    'The best of the Elixir community: resources, events, people, books, YouTube, podcasts, and jobs. One short email now and then.',
  github: 'https://github.com/tomasz-tomczyk/elixir.community',
  subscribers: '',
  // False until the first issue goes out. The home page then shows the
  // "not sent yet" hero and hides the sample issues.
  newsletterSent: false,
}

export const nav = [
  { href: '/events', label: 'Events' },
  { href: '/jobs', label: 'Jobs' },
  { href: '/resources', label: 'Resources' },
  { href: '/youtube', label: 'YouTube' },
  { href: '/podcasts', label: 'Podcasts' },
  { href: '/books', label: 'Books' },
  { href: '/people', label: 'People' },
  { href: '/companies', label: 'Companies' },
] as const

export const newsletterAction =
  import.meta.env.PUBLIC_NEWSLETTER_ACTION || '/thank-you'

export function formatDate(date: Date, style: 'long' | 'short' = 'long') {
  return date.toLocaleDateString('en-US', {
    timeZone: 'UTC',
    month: style === 'long' ? 'long' : 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function issueNumber(n: number) {
  return `#${String(n).padStart(3, '0')}`
}

const today = new Date()

// A job's posted date, as a Date for formatting.
export const postedOn = (job: { created: string }) =>
  new Date(`${job.created}T00:00:00Z`)

// "2026-10-21" -> "Oct 2026". Also says if that day is already over.
export function conferenceDate(date?: string) {
  if (!date) return { label: 'Dates TBA', past: false }
  const day = new Date(`${date}T00:00:00Z`)
  const label = day.toLocaleDateString('en-US', {
    timeZone: 'UTC',
    month: 'short',
    year: 'numeric',
  })
  return { label, past: day < today }
}

// Editions that have not started yet.
export function isUpcoming(date?: string) {
  return !!date && !conferenceDate(date).past
}

// "Haarlem, Netherlands". Leaves out the city when the name already says it.
export function place(data: { city?: string; country: string; name?: string }) {
  const city = data.city && data.city !== data.name ? data.city : undefined
  return [city, data.country].filter(Boolean).join(', ')
}

const countryCodes: Record<string, string> = {
  Australia: 'AU',
  Austria: 'AT',
  Brazil: 'BR',
  Canada: 'CA',
  France: 'FR',
  Germany: 'DE',
  Japan: 'JP',
  Kenya: 'KE',
  Mexico: 'MX',
  Netherlands: 'NL',
  Nigeria: 'NG',
  Portugal: 'PT',
  'South Africa': 'ZA',
  Spain: 'ES',
  Sweden: 'SE',
  Taiwan: 'TW',
  UK: 'GB',
  Uruguay: 'UY',
  US: 'US',
}
// Flag emoji for a country, built from its two regional indicator letters.
export function flagOf(country: string) {
  const code = countryCodes[country]
  return (
    code &&
    String.fromCodePoint(...[...code].map((c) => 0x1f1a5 + c.charCodeAt(0)))
  )
}

const continents: Record<string, string> = {
  Austria: 'Europe',
  France: 'Europe',
  Germany: 'Europe',
  Netherlands: 'Europe',
  Portugal: 'Europe',
  Spain: 'Europe',
  Sweden: 'Europe',
  UK: 'Europe',
  Canada: 'North America',
  Mexico: 'North America',
  US: 'North America',
  Brazil: 'South America',
  Uruguay: 'South America',
  Kenya: 'Africa',
  Nigeria: 'Africa',
  'South Africa': 'Africa',
  Japan: 'Asia',
  Taiwan: 'Asia',
  Australia: 'Oceania',
}
export const continentOrder = [
  'Europe',
  'North America',
  'South America',
  'Africa',
  'Asia',
  'Oceania',
  'Online',
]
export function continentOf(country: string) {
  return continents[country] ?? 'Online'
}
