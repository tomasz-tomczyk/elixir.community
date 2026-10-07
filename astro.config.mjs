// @ts-check
import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import { readFileSync, readdirSync } from 'node:fs'
import { parse } from 'yaml'

const contentDates = Object.fromEntries(['books', 'events', 'people', 'podcasts', 'resources', 'youtube'].map((kind) => [kind, parse(readFileSync(`src/data/${kind}.yaml`, 'utf8'))]))
for (const kind of ['companies', 'jobs']) contentDates[kind] = readdirSync(`src/content/${kind}`).filter((file) => file.endsWith('.md')).map((file) => ({ id: file.slice(0, -3), ...parse(readFileSync(`src/content/${kind}/${file}`, 'utf8').split('---')[1]) }))
/** @param {string} url */
const entryDate = (url) => {
  const [kind, id] = new URL(url).pathname.split('/').filter(Boolean)
  /** @type {{ id: string, last_updated?: string, kind?: string, date?: string, when?: string }[] | undefined} */
  let entries = contentDates[kind]
  if (!entries) return undefined
  if (id && id !== 'archive') entries = entries.filter((entry) => entry.id === id)
  if (kind === 'events') {
    const today = new Date().toISOString().slice(0, 10)
    entries = entries.filter((entry) => {
      const archived = entry.kind === 'conference' && entry.date && entry.date < today && !entry.when
      return id === 'archive' ? archived : !archived
    })
  }
  return entries.map((entry) => entry.last_updated).filter(Boolean).sort().at(-1)
}

export default defineConfig({
  site: 'https://elixir.community',
  // Inline all CSS so pages make no render-blocking stylesheet requests.
  build: { inlineStylesheets: 'always' },
  integrations: [mdx(), sitemap({ filter: (page) => !['/confirm/', '/thank-you/', '/404/'].includes(new URL(page).pathname), serialize: (item) => ({ ...item, ...(entryDate(item.url) && { lastmod: entryDate(item.url) }) }) })],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    shikiConfig: {
      theme: 'css-variables',
    },
  },
})
