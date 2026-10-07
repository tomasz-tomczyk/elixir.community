// @ts-check
import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import { readFileSync, readdirSync } from 'node:fs'
import { parse } from 'yaml'

// Sitemap lastmod: the newest `last_updated` among the entries on a page.
// Only people, companies and jobs have that field.
const contentDates = Object.fromEntries(
  ['people', 'companies', 'jobs'].map((kind) => [
    kind,
    readdirSync(`src/content/${kind}`)
      .filter((file) => file.endsWith('.md'))
      .map((file) => ({
        id: file.slice(0, -3),
        ...parse(
          readFileSync(`src/content/${kind}/${file}`, 'utf8').split('---')[1],
        ),
      })),
  ]),
)
/** @param {string} url */
const entryDate = (url) => {
  const [kind, id] = new URL(url).pathname.split('/').filter(Boolean)
  /** @type {{ id: string, last_updated?: string }[] | undefined} */
  let entries = contentDates[kind]
  if (!entries) return undefined
  if (id) entries = entries.filter((entry) => entry.id === id)
  return entries
    .map((entry) => entry.last_updated)
    .filter(Boolean)
    .sort()
    .at(-1)
}

export default defineConfig({
  site: 'https://elixir.community',
  // Inline all CSS so pages make no render-blocking stylesheet requests.
  build: { inlineStylesheets: 'always' },
  integrations: [
    mdx(),
    sitemap({
      filter: (page) =>
        !['/confirm/', '/thank-you/', '/404/'].includes(new URL(page).pathname),
      serialize: (item) => ({
        ...item,
        ...(entryDate(item.url) && { lastmod: entryDate(item.url) }),
      }),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    shikiConfig: {
      theme: 'css-variables',
    },
  },
})
