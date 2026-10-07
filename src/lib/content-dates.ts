import { getCollection } from 'astro:content'

const kinds = [
  'resources',
  'books',
  'podcasts',
  'youtube',
  'people',
  'companies',
  'events',
  'jobs',
] as const
export async function pageDates(path: string) {
  const [section, id] = path.split('/').filter(Boolean)
  const kind = kinds.find((value) => value === section)
  if (!kind) return { entries: [], modified: undefined }
  let entries = await getCollection(kind)
  if (id && id !== 'archive')
    entries = entries.filter((entry) => entry.id === id)
  if (kind === 'events') {
    const today = new Date().toISOString().slice(0, 10)
    entries = entries.filter((entry) => {
      const data = entry.data as any
      const archived =
        data.kind === 'conference' &&
        data.date &&
        data.date < today &&
        !data.when
      return id === 'archive' ? archived : !archived
    })
  }
  return {
    entries,
    modified: entries
      .map((entry) =>
        'last_updated' in entry.data ? entry.data.last_updated : undefined,
      )
      .filter(Boolean)
      .sort()
      .at(-1),
  }
}

export function entryMetadata(kind: string, entry: any, archive = false) {
  const data = entry.data
  const name = data.name ?? data.title
  const recordUrl = ['people', 'companies', 'jobs'].includes(kind)
    ? `https://elixir.community/${kind}/${entry.id}/`
    : `https://elixir.community/${kind}/${archive ? 'archive/' : ''}#${entry.id}`
  const subject: Record<string, unknown> = {
    '@type': (
      {
        books: 'Book',
        podcasts: 'PodcastSeries',
        youtube: 'CreativeWork',
        people: 'Person',
        companies: 'Organization',
        events: 'CreativeWork',
        jobs: 'CreativeWork',
        resources: 'CreativeWork',
      } as Record<string, string>
    )[kind],
    name,
    url: data.url,
    ...(data.image && {
      image: new URL(data.image, 'https://elixir.community').href,
    }),
  }
  const created =
    data.created ??
    (kind === 'books' && data.year ? String(data.year) : undefined)
  if (
    created &&
    ['books', 'podcasts', 'youtube', 'resources', 'jobs'].includes(kind)
  )
    subject.datePublished = created
  if (created && kind === 'companies') subject.foundingDate = created
  // Directory group/city listings are not complete event instances. A verified
  // date plus an explicitly sourced venue is required before emitting Event.
  if (
    kind === 'events' &&
    data.date &&
    data.venue?.name &&
    data.venue?.address
  ) {
    subject['@type'] = 'Event'
    subject.startDate = data.date
    subject.location = {
      '@type': 'Place',
      name: data.venue.name,
      address: data.venue.address,
    }
  }
  if (kind === 'books') {
    if (data.author) subject.author = { '@type': 'Person', name: data.author }
    if (data.publisher)
      subject.publisher = { '@type': 'Organization', name: data.publisher }
  }
  return {
    '@type': 'CreativeWork',
    '@id': recordUrl,
    name: `${name} - directory entry`,
    url: recordUrl,
    dateModified: data.last_updated,
    about: subject,
  }
}
