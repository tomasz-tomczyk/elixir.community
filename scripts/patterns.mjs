// Draws the doodle patterns behind the Slack, Discord, Forum and Reddit cards (src/components/CommunityCards.astro).
// Run: node scripts/patterns.mjs. Writes public/patterns/{slack,discord,forum,reddit}.svg.
import { mkdirSync, writeFileSync } from 'node:fs'

// Line icons on a 24x24 grid.
const bubble = 'M4 5h16v11H9l-5 4Z'
const I = {
  bubble: `<path d="${bubble}"/>`,
  dots: `<path d="${bubble}"/><path d="M8.5 10.5h.01M12 10.5h.01M15.5 10.5h.01" stroke-width="2.6"/>`,
  lines: `<path d="${bubble}"/><path d="M8 9h8M8 12h5"/>`,
  long: `<path d="M3 3h18v14H10l-5 4v-4H3Z"/><path d="M7 7h10M7 10h10M7 13h6"/>`,
  two: `<path d="M3 4h12v8H7l-4 3Z"/><path d="M18 9h3v10l-3-2.5h-8V15"/>`,
  person: `<circle cx="12" cy="8" r="3.5"/><path d="M5 20c0-4 3-6 7-6s7 2 7 6"/>`,
  people: `<circle cx="8.5" cy="9" r="2.8"/><circle cx="16" cy="8" r="2.4"/><path d="M3 19c0-3.2 2.4-5 5.5-5s5.5 1.8 5.5 5M14.5 13.2c3 0 5.5 1.6 5.5 4.8"/>`,
  smile: `<circle cx="12" cy="12" r="9"/><path d="M8.5 14.5c1 1.2 2.2 1.8 3.5 1.8s2.5-.6 3.5-1.8M9 9.5h.01M15 9.5h.01" stroke-width="2"/>`,
  hash: `<path d="M9.5 4 8 20M16.5 4 15 20M4 9h16M4 15h16"/>`,
  at: `<circle cx="12" cy="12" r="3.5"/><path d="M15.5 12v1.5a2.5 2.5 0 0 0 5 0V12a8.5 8.5 0 1 0-3.4 6.8"/>`,
  thread: `<path d="M6 3v9a4 4 0 0 0 4 4h9M16 13l3 3-3 3"/>`,
  heart: `<path d="M12 20s-7.5-4.4-7.5-10A4 4 0 0 1 12 7.7 4 4 0 0 1 19.5 10C19.5 15.6 12 20 12 20Z"/>`,
  sparkle: `<path d="M12 3c.6 4.6 2.4 6.4 7 7-4.6.6-6.4 2.4-7 7-.6-4.6-2.4-6.4-7-7 4.6-.6 6.4-2.4 7-7Z"/>`,
  pad: `<path d="M7.5 7h9a4.5 4.5 0 0 1 4.5 4.5v3a2.8 2.8 0 0 1-5.1 1.6L14.5 14h-5l-1.4 2.1A2.8 2.8 0 0 1 3 14.5v-3A4.5 4.5 0 0 1 7.5 7Z"/><path d="M7.5 10v3.5M5.8 11.8h3.4M15.5 11h.01M17.5 13h.01" />`,
  phones: `<path d="M4 15v-3a8 8 0 0 1 16 0v3"/><path d="M4 14h3v6H5a1 1 0 0 1-1-1ZM20 14h-3v6h2a1 1 0 0 0 1-1Z"/>`,
  mic: `<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M9 21h6"/>`,
  play: `<path d="${bubble}"/><path d="M10.5 8v5l4-2.5Z"/>`,
  screen: `<rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M12 16v4M8 20h8"/><path d="M8 8.5h.01M12 8.5h.01M16 8.5h.01" stroke-width="2.4"/>`,
  laptop: `<rect x="5" y="5" width="14" height="10" rx="1"/><path d="M2.5 18.5h19"/><path d="M8 9h8M8 11.5h5"/>`,
  quote: `<path d="M5 8h5v5c0 2.4-1.4 4-3.5 4.5M14 8h5v5c0 2.4-1.4 4-3.5 4.5"/>`,
  check: `<path d="${bubble}"/><path d="m8.5 10.5 2.3 2.2 4.7-4.7"/>`,
  drop: `<path d="M12 2.5C10.2 6 6 10.6 6 14.8a6 6 0 0 0 12 0C18 10.6 13.8 6 12 2.5Z"/>`,
  up: `<path d="M12 4 5 12h4v7h6v-7h4Z"/>`,
  down: `<path d="M12 20 5 12h4V5h6v7h4Z"/>`,
  book: `<path d="M4 5.5C6.5 4.5 9.5 4.5 12 6c2.5-1.5 5.5-1.5 8-.5V19c-2.5-1-5.5-1-8 .5-2.5-1.5-5.5-1.5-8-.5Z"/><path d="M12 6v13.5"/>`,
  // small filler shapes
  ring: `<circle cx="12" cy="12" r="4"/>`,
  sq: `<rect x="8" y="8" width="8" height="8"/>`,
  tri: `<path d="m12 7 5 9H7Z"/>`,
  star: `<path d="m12 6 1.7 3.6 3.8.5-2.8 2.7.7 3.8-3.4-1.8-3.4 1.8.7-3.8-2.8-2.7 3.8-.5Z"/>`,
}

// One scattered layout on a 280px tile: x, y, scale, rotation. Big icons first, filler after.
const big = [
  [18, 14, 2.3, -12],
  [118, 6, 1.7, 8],
  [200, 40, 2.1, 14],
  [60, 96, 1.6, 10],
  [150, 110, 2.4, -8],
  [8, 176, 2.0, 6],
  [226, 170, 1.6, -16],
  [96, 200, 2.2, 12],
  [180, 222, 1.5, -6],
]
const small = [
  [92, 58, 0.6, 0],
  [176, 14, 0.55, 20],
  [250, 112, 0.6, 0],
  [24, 132, 0.55, 15],
  [128, 176, 0.5, 0],
  [70, 258, 0.6, 30],
  [250, 254, 0.5, 0],
  [212, 92, 0.5, 10],
]
const tile = (bigIcons, smallIcons, color, accents = {}) => {
  const place = ([x, y, s, r], name, i, pool) => {
    const stroke = accents[i + pool] || color
    return `<g transform="translate(${x} ${y}) rotate(${r} ${12 * s} ${12 * s}) scale(${s})" stroke="${stroke}" stroke-width="${(1.7 / s).toFixed(2)}">${I[name]}</g>`
  }
  const g = [
    ...big.map((p, i) => place(p, bigIcons[i % bigIcons.length], i, 'b')),
    ...small.map((p, i) => place(p, smallIcons[i % smallIcons.length], i, 's')),
  ].join('')
  return `<svg xmlns="http://www.w3.org/2000/svg" width="280" height="280" viewBox="0 0 280 280"><g fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${g}</g></svg>`
}

const white = 'rgba(255,255,255,.26)'
const ink = 'rgba(42,10,64,.22)'
const slack = tile(
  ['dots', 'hash', 'thread', 'at', 'two', 'smile', 'hash', 'lines', 'heart'],
  ['ring', 'sq', 'tri', 'star'],
  white,
  // Two hashes and two small shapes pick up the Slack colours.
  {
    '1b': 'rgba(54,197,240,.55)',
    '6b': 'rgba(236,178,46,.55)',
    '2s': 'rgba(46,182,125,.6)',
    '5s': 'rgba(224,30,90,.6)',
  },
)
const discord = tile(
  [
    'pad',
    'dots',
    'phones',
    'sparkle',
    'screen',
    'mic',
    'smile',
    'play',
    'people',
  ],
  ['sparkle', 'ring', 'tri', 'sq'],
  white,
)
const forum = tile(
  [
    'long',
    'person',
    'quote',
    'check',
    'book',
    'drop',
    'lines',
    'people',
    'bubble',
  ],
  ['ring', 'sq', 'star', 'tri'],
  ink,
)

const reddit = tile(
  ['up', 'thread', 'lines', 'smile', 'down', 'quote', 'dots', 'up', 'bubble'],
  ['ring', 'star', 'sq', 'tri'],
  white,
)

mkdirSync('public/patterns', { recursive: true })
for (const [name, svg] of Object.entries({ slack, discord, forum, reddit }))
  writeFileSync(`public/patterns/${name}.svg`, svg + '\n')
