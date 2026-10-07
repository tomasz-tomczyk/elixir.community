import {test} from 'node:test';
import assert from 'node:assert/strict';
import {linkKey, recordClick} from '../server/clicks.js';
const links = {links: new Set(['hexdocs.pm/elixir', 'github.com']), pages: new Set(['/', '/resources/'])};
const browser = 'Mozilla/5.0 (Macintosh) Firefox/140.0';
const request = (data, headers = {}) => new Request('https://elixir.community/api/click', {method: 'POST', headers: {'Sec-Fetch-Site': 'same-origin', 'User-Agent': browser, ...headers}, body: typeof data === 'string' ? data : JSON.stringify(data)});
const sink = () => { const points = []; return {points, env: {CLICKS: {writeDataPoint: (p) => points.push(p)}}}; };

test('linkKey strips query, fragment and trailing slash and skips internal links', () => {
 assert.equal(linkKey('https://hexdocs.pm/elixir/?token=abc#top'), 'hexdocs.pm/elixir');
 assert.equal(linkKey('https://GitHub.com/'), 'github.com');
 assert.equal(linkKey('/books/'), null);
 assert.equal(linkKey('https://elixir.community/books/'), null);
 assert.equal(linkKey('http://localhost:4321/books/', 'http://localhost:4321/'), null);
 assert.equal(linkKey('mailto:hello@elixir.community'), null);
});
test('a known click from a known page is recorded without personal data', async () => {
 const {points, env} = sink();
 assert.equal((await recordClick(request({to: 'hexdocs.pm/elixir', from: '/resources/'}), env, links)).status, 204);
 assert.deepEqual(points, [{indexes: ['hexdocs.pm'], blobs: ['hexdocs.pm', '/elixir', '/resources/']}]);
 await recordClick(request({to: 'github.com', from: '/'}), env, links);
 assert.deepEqual(points[1].blobs, ['github.com', '/', '/']);
});
test('unknown destinations, pages and malformed bodies are rejected', async () => {
 const {points, env} = sink();
 for (const body of [{to: 'evil.example/spam', from: '/'}, {to: 'github.com', from: '/made-up/'}, {to: 1, from: '/'}, 'not json', 'x'.repeat(2000)]) assert.notEqual((await recordClick(request(body), env, links)).status, 204);
 assert.equal(points.length, 0);
});
test('cross-site requests are refused and bots are ignored', async () => {
 const {points, env} = sink();
 const body = {to: 'github.com', from: '/'};
 assert.equal((await recordClick(request(body, {'Sec-Fetch-Site': 'cross-site'}), env, links)).status, 403);
 assert.equal((await recordClick(new Request('https://elixir.community/api/click', {method: 'POST', headers: {Origin: 'https://evil.invalid', 'User-Agent': browser}, body: JSON.stringify(body)}), env, links)).status, 403);
 assert.equal((await recordClick(request(body, {'User-Agent': 'curl/8.0'}), env, links)).status, 204);
 assert.equal(points.length, 0);
});
test('missing binding or allowlist records nothing and does not throw', async () => {
 assert.equal((await recordClick(request({to: 'github.com', from: '/'}), {}, links)).status, 204);
 assert.equal((await recordClick(request({to: 'github.com', from: '/'}), {}, null)).status, 400);
});
