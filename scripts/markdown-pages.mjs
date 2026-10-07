// After `astro build`: write a Markdown copy of each page next to its HTML (dist/books/index.html -> dist/books/index.md), for AI agents.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import TurndownService from 'turndown'

const dist = 'dist',
  site = 'https://elixir.community'
const turndown = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
})
turndown.remove(['script', 'style', 'svg', 'button', 'form', 'noscript'])
// Icons, arrows and initials that only matter visually.
const hidden = (node) =>
  node.getAttribute('aria-hidden') === 'true' ||
  (node.getAttribute('role') === 'img' && node.nodeName !== 'IMG')
turndown.addRule('hidden', { filter: hidden, replacement: () => '' })
// Card links stack several pieces of text with CSS (title, place, date).
// Without that layout they run together, so join them with " · ".
const textParts = (node, parts = []) => {
  for (const child of node.childNodes) {
    if (child.nodeType === 3) {
      const text = child.nodeValue.replace(/\s+/g, ' ').trim()
      if (text) parts.push({ text, parent: node })
    } else if (
      child.nodeType === 1 &&
      !hidden(child) &&
      !['svg', 'SVG', 'SCRIPT', 'STYLE'].includes(child.nodeName)
    ) {
      textParts(child, parts)
    }
  }
  return parts
}
turndown.addRule('card-links', {
  filter: (node) =>
    node.nodeName === 'A' &&
    node.getAttribute('href') &&
    new Set(
      textParts(node)
        .map((part) => part.parent)
        .filter((parent) => parent !== node),
    ).size > 1,
  replacement: (_content, node) => {
    const text = textParts(node)
      .filter((part) => part.text !== '·')
      .map(({ text, parent }) =>
        /^(H\d|B|STRONG)$/.test(parent.nodeName) ? `**${text}**` : text,
      )
      // "Published:" and "Haarlem ·" already lead into the next part.
      .reduce((all, text) =>
        /[·:]$/.test(all) ? `${all} ${text}` : `${all} · ${text}`,
      )
    const link = `[${text}](${node.getAttribute('href')})`
    // Card grids aren't always lists; make each card its own list item.
    return node.parentNode.nodeName === 'LI' ? link : `\n- ${link}\n`
  },
})
// Drop decorative images; keep ones with alt text.
turndown.addRule('decorative-images', {
  filter: (node) => node.nodeName === 'IMG' && !node.getAttribute('alt'),
  replacement: () => '',
})

const decode = (text) =>
  text
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)],
  )

let count = 0
for (const file of walk(dist).filter((f) => f.endsWith('/index.html'))) {
  const html = readFileSync(file, 'utf8')
  if (/<meta name="robots" content="noindex/.test(html)) continue
  const main = html.match(/<main\b[^>]*>([\s\S]*)<\/main>/)?.[1]
  if (!main) continue
  const title = decode(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '')
  const description = decode(
    html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '',
  )
  const path =
    '/' +
    relative(dist, file).split(sep).join('/').slice(0, -'index.html'.length)
  const body = turndown
    .turndown(main)
    // Make site links absolute so they work outside the page.
    .replace(/\]\((\/[^)]*)\)/g, `](${site}$1)`)
    .replace(/\n{3,}/g, '\n\n')
  const frontmatter = [
    '---',
    `title: ${JSON.stringify(title)}`,
    `description: ${JSON.stringify(description)}`,
    `url: ${site}${path}`,
    '---',
  ].join('\n')
  writeFileSync(file.replace(/\.html$/, '.md'), `${frontmatter}\n\n${body}\n`)
  count++
}
console.log(`markdown pages: ${count}`)
