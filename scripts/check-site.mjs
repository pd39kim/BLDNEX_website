import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { resolve, join } from 'node:path';

const root = resolve('dist');
const routes = ['/', '/about', '/services', '/works', '/works/previewlog', '/works/shuffo', '/contact', '/privacy'];
const documents = new Map();
for (const route of routes) {
  documents.set(route, await readFile(join(root, route, 'index.html'), 'utf8'));
}
const titles = new Set();
let linkCount = 0;
for (const [route, html] of documents) {
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  assert(title, route + ': missing title');
  assert(!titles.has(title), route + ': duplicate title');
  titles.add(title);
  assert.equal((html.match(/<h1[\s>]/g) ?? []).length, 1, route + ': expected one h1');
  assert.match(html, /<html lang="ko">/, route + ': Korean document language');
  assert.match(html, /name="description" content="[^"]+"/);
  assert.match(html, /property="og:image" content="https:\/\/bldnex.com\/assets\/brand\/og-bldnex.png"/);
  assert.match(html, /id="main"/);
  assert.match(html, /href="#main"/);
  const organization = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
  assert.equal(JSON.parse(organization)['@type'], 'Organization');
  assert(!html.includes('SEOUL'), route + ': unverified location');
  assert(!html.includes('href="https://previewlog.bldnex.com'), route + ': unverified product CTA');
  for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const url = new URL(match[1].replaceAll('&amp;', '&'), 'https://bldnex.com' + route);
    if (url.origin !== 'https://bldnex.com') continue;
    const target = url.pathname.replace(/\/$/, '') || '/';
    if (documents.has(target)) {
      if (url.hash) assert(documents.get(target).includes('id="' + decodeURIComponent(url.hash.slice(1)) + '"'), route + ': missing anchor ' + url.href);
    } else {
      await access(join(root, target));
    }
    linkCount++;
  }
  for (const match of html.matchAll(/<img\b[^>]*>/g)) {
    assert.match(match[0], /\balt="/, route + ': image alt missing');
    assert.match(match[0], /\bwidth="\d+"/, route + ': image width missing');
    assert.match(match[0], /\bheight="\d+"/, route + ': image height missing');
  }
}
assert.match(documents.get('/privacy'), /name="robots" content="noindex, follow"/);
assert(!documents.get('/contact').includes('<form'), 'Email-only contact must not expose an inert form');
assert.equal((documents.get('/contact').match(/class="faq-item"/g) ?? []).length, 7);
assert.equal((documents.get('/').match(/class="faq-item"/g) ?? []).length, 3);
const sitemap = await readFile(join(root, 'sitemap.xml'), 'utf8');
assert(!sitemap.includes('/privacy'), 'Unfinished privacy page should be excluded from sitemap');
assert.equal((sitemap.match(/<loc>/g) ?? []).length, 7);
for (const route of routes.filter((path) => path !== '/privacy')) assert(sitemap.includes('https://bldnex.com' + route + '</loc>'));
assert.match(await readFile(join(root, 'robots.txt'), 'utf8'), /Sitemap: https:\/\/bldnex.com\/sitemap.xml/);
const ogImage = await readFile(join(root, 'assets/brand/og-bldnex.png'));
assert.equal(ogImage.readUInt32BE(16), 1200);
assert.equal(ogImage.readUInt32BE(20), 630);
console.log(`PASS: ${routes.length} pages, ${linkCount} internal references, metadata, anchors, images, FAQ, sitemap and privacy guardrails.`);
