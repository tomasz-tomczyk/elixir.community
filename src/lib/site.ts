export const site = {
  name: 'Elixir Community',
  description:
    'The best of the Elixir community: resources, events, people, books, YouTube, podcasts, and jobs. One short email now and then.',
  github: 'https://github.com/tomasz-tomczyk/elixir.community',
  subscribers: '4,200',
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
