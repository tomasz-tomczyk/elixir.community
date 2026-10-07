import rss from '@astrojs/rss'
import type { APIContext } from 'astro'
import { getCollection } from 'astro:content'

import { site } from '@/lib/site'

export async function GET(context: APIContext) {
  // An empty feed until the first issue goes out.
  const issues = site.newsletterSent
    ? (await getCollection('issues')).sort(
        (a, b) => b.data.number - a.data.number,
      )
    : []

  return rss({
    title: `${site.name} newsletter`,
    description: site.description,
    site: context.site!,
    items: issues.map((issue) => ({
      title: `#${issue.data.number}: ${issue.data.title}`,
      description: issue.data.summary,
      pubDate: issue.data.date,
      link: `/newsletter/${issue.id}/`,
    })),
  })
}
