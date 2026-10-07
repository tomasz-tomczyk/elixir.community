// After `astro build`: list every external link and every page in dist, for the click endpoint's allowlist.
import {readdirSync, readFileSync, writeFileSync} from 'node:fs';
import {join, relative, sep} from 'node:path';
import {linkKey} from '../server/clicks.js';

const dist = 'dist', links = new Set(), pages = new Set();
const walk = (dir) => readdirSync(dir, {withFileTypes: true}).flatMap((e) => e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]);
for (const file of walk(dist).filter((f) => f.endsWith('.html'))) {
 const path = '/' + relative(dist, file).split(sep).join('/');
 pages.add(path.endsWith('/index.html') ? path.slice(0, -'index.html'.length) : path.replace(/\.html$/, ''));
 for (const [, href] of readFileSync(file, 'utf8').matchAll(/<a\b[^>]*?\shref="([^"]+)"/g)) {
  const key = linkKey(href.replaceAll('&amp;', '&'));
  if (key) links.add(key);
 }
}
writeFileSync(join(dist, 'outbound-links.json'), JSON.stringify({links: [...links].sort(), pages: [...pages].sort()}));
console.log(`outbound-links.json: ${links.size} links, ${pages.size} pages`);
