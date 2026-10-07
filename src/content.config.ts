import { defineCollection, reference } from 'astro:content'
import { file, glob } from 'astro/loaders'
import { z } from 'astro/zod'

const issues = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/issues' }),
  schema: z.object({
    last_updated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    created: z.string().regex(/^\d{4}(?:-\d{2}(?:-\d{2})?)?$/).optional(),
    image: z.string().optional(),
    number: z.number(),
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    topics: z.array(z.string()).default([]),
  }),
})

const resources = defineCollection({
  loader: file('src/data/resources.yaml'),
  schema: z.object({
    last_updated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    created: z.string().regex(/^\d{4}(?:-\d{2}(?:-\d{2})?)?$/).optional(),
    image: z.string().optional(),
    name: z.string(),
    url: z.url(),
    category: z.enum([
      'community',
      'newsletters',
      'ai',
      'editor',
      'workflow',
      'quality',
      'jobs',
      'learning',
    ]),
    description: z.string(),
    featured: z.boolean().default(false),
    // People with a page here who made or lead it.
    people: z.array(reference('people')).default([]),
  }),
})

const events = defineCollection({
  loader: file('src/data/events.yaml'),
  schema: z.object({
    last_updated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    created: z.string().regex(/^\d{4}(?:-\d{2}(?:-\d{2})?)?$/).optional(),
    image: z.string().optional(),
    name: z.string(),
    url: z.url(),
    kind: z.enum(['conference', 'meetup']),
    location: z.string(),
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional(),
    when: z.string().optional(),
    description: z.string(),
  }),
})

const people = defineCollection({
  loader: file('src/data/people.yaml'),
  schema: z.object({
    last_updated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    created: z.string().regex(/^\d{4}(?:-\d{2}(?:-\d{2})?)?$/).optional(),
    image: z.string().optional(),
    name: z.string(),
    github: z.string().default(''),
    role: z.string(),
    known_for: z.array(z.object({ name: z.string(), url: z.url() })),
    links: z
      .array(
        z.object({
          type: z.enum([
            'twitter',
            'linkedin',
            'bluesky',
            'mastodon',
            'youtube',
            'website',
          ]),
          url: z.url(),
          label: z.string().optional(),
        }),
      )
      .default([]),
    bio: z.string(),
    profile: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    // Where they work, if the company has a page here.
    company: reference('companies').optional(),
  }),
})

const books = defineCollection({
  loader: file('src/data/books.yaml'),
  schema: z.object({
    last_updated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    created: z.string().regex(/^\d{4}(?:-\d{2}(?:-\d{2})?)?$/).optional(),
    image: z.string().optional(),
    title: z.string(),
    author: z.string(),
    // The authors who have a page here. `author` above is the full display text.
    authors: z.array(reference('people')).default([]),
    publisher: z.string(),
    url: z.url(),
    level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
    year: z.number().optional(),
    note: z.string().optional(),
    hue: z.number().min(0).max(360),
  }),
})

const youtube = defineCollection({
  loader: file('src/data/youtube.yaml'),
  schema: z.object({
    last_updated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    created: z.string().regex(/^\d{4}(?:-\d{2}(?:-\d{2})?)?$/).optional(),
    image: z.string().optional(),
    title: z.string(),
    handle: z.string(),
    url: z.url(),
    description: z.string(),
    channel_id: z.string().optional(),
    videos: z.number().optional(),
    last_video: z.coerce.date().optional(),
    checked: z.coerce.date().optional(),
    // People with a page here who run or regularly appear on the channel.
    people: z.array(reference('people')).default([]),
  }),
})

const podcasts = defineCollection({
  loader: file('src/data/podcasts.yaml'),
  schema: z.object({
    last_updated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    created: z.string().regex(/^\d{4}(?:-\d{2}(?:-\d{2})?)?$/).optional(),
    image: z.string().optional(),
    title: z.string(),
    hosts: z.string(),
    url: z.url(),
    hue: z.number().min(0).max(360),
    description: z.string(),
    feed: z.url().optional(),
    episodes: z.number().optional(),
    last_episode: z.coerce.date().optional(),
    checked: z.coerce.date().optional(),
    // Hosts with a page here.
    people: z.array(reference('people')).default([]),
  }),
})

const companies = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/companies' }),
  schema: z.object({
    last_updated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    created: z.string().regex(/^\d{4}(?:-\d{2}(?:-\d{2})?)?$/).optional(),
    image: z.string().optional(),
    name: z.string(),
    url: z.url(),
    industry: z.string(),
    about: z.string(),
    order: z.number(),
    // Brand colour for the logo on hover. Only set where it reads well in light and dark mode.
    color: z.string().optional(),
    reading: z.array(z.object({ label: z.string(), url: z.url() })).default([]),
  }),
})

const jobs = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/jobs' }),
  schema: z.object({
    last_updated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    created: z.string().regex(/^\d{4}(?:-\d{2}(?:-\d{2})?)?$/).optional(),
    image: z.string().optional(),
    title: z.string(),
    // id of an entry in the companies collection
    company: z.string(),
    url: z.url(),
    location: z.string(),
    type: z.enum(['Full-time', 'Part-time', 'Contract']),
    posted: z.coerce.date().optional(),
    checked: z.coerce.date(),
  }),
})

export const collections = {
  issues,
  resources,
  events,
  people,
  books,
  youtube,
  podcasts,
  companies,
  jobs,
}
