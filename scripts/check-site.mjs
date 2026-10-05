import assert from 'node:assert/strict';
import { readFile, readdir, access } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { openSync as openFont } from 'fontkit';
import { faces, collectGlyphs } from './subset-fonts.mjs';

const root = resolve('dist');
const routes = ['/', '/about', '/services', '/works', '/works/previewlog', '/works/shuffo', '/works/bldnex-website', '/contact', '/privacy'];
const documents = new Map();
for (const route of routes) {
  // build.format: 'file' — 홈은 index.html, 나머지는 <경로>.html 입니다.
  documents.set(route, await readFile(join(root, route === '/' ? 'index.html' : route + '.html'), 'utf8'));
}
const titles = new Set();
const shareImages = new Map();
let linkCount = 0;
for (const [route, html] of documents) {
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  assert(title, route + ': missing title');
  assert(!titles.has(title), route + ': duplicate title');
  titles.add(title);
  assert.equal((html.match(/<h1[\s>]/g) ?? []).length, 1, route + ': expected one h1');
  assert.match(html, /<html lang="ko">/, route + ': Korean document language');
  assert.match(html, /name="description" content="[^"]+"/);
  assert.match(html, /id="main"/);
  assert.match(html, /href="#main"/);

  const share = html.match(/property="og:image" content="([^"]+)"/)?.[1];
  assert(share?.startsWith('https://bldnex.com/'), route + ': og:image must be an absolute URL');
  assert.equal(share, html.match(/name="twitter:image" content="([^"]+)"/)?.[1], route + ': og:image and twitter:image must match');
  shareImages.set(route, share);
  for (const tag of ['og:image:width', 'og:image:height', 'og:image:type', 'og:image:alt', 'og:url', 'og:title', 'og:description', 'og:site_name', 'og:locale', 'og:type']) {
    assert.match(html, new RegExp(`property="${tag}" content="[^"]+"`), route + ': missing ' + tag);
  }
  assert.match(html, /name="twitter:card" content="summary_large_image"/, route + ': missing twitter card type');
  assert.match(html, /name="twitter:image:alt" content="[^"]+"/, route + ': missing twitter image alt');
  assert.equal(
    html.match(/property="og:url" content="([^"]+)"/)?.[1],
    html.match(/<link rel="canonical" href="([^"]+)"/)?.[1],
    route + ': og:url must match canonical',
  );

  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
  const types = blocks.map((block) => block['@type']);
  assert(types.includes('Organization'), route + ': missing Organization JSON-LD');
  assert(types.includes('WebSite'), route + ': missing WebSite JSON-LD');
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
assert.equal((sitemap.match(/<loc>/g) ?? []).length, 8);
for (const route of routes.filter((path) => path !== '/privacy')) assert(sitemap.includes('https://bldnex.com' + route + '</loc>'));
assert.match(await readFile(join(root, 'robots.txt'), 'utf8'), /Sitemap: https:\/\/bldnex.com\/sitemap.xml/);
// 공유 이미지: 색인되는 페이지마다 고유해야 하고, 파일이 실제로 1200×630이어야 합니다.
const indexed = routes.filter((path) => path !== '/privacy');
assert.equal(new Set(indexed.map((route) => shareImages.get(route))).size, indexed.length, 'each indexed page needs its own share image');
for (const [route, url] of shareImages) {
  const file = await readFile(join(root, new URL(url).pathname));
  assert.equal(file.toString('latin1', 1, 4), 'PNG', route + ': share image must be a PNG');
  assert.equal(file.readUInt32BE(16), 1200, route + ': share image width');
  assert.equal(file.readUInt32BE(20), 630, route + ': share image height');
  assert(file.length < 5_000_000, route + ': share image too large for messenger crawlers');
}

// 제품 상세는 BreadcrumbList와 SoftwareApplication을 함께 노출합니다.
for (const route of ['/works/previewlog', '/works/shuffo', '/works/bldnex-website']) {
  const types = [...documents.get(route).matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .map((match) => JSON.parse(match[1])['@type']);
  assert(types.includes('BreadcrumbList'), route + ': missing BreadcrumbList');
  // 앱은 SoftwareApplication, 웹사이트 자체는 CreativeWork로 기술합니다.
  assert(types.some((type) => type === 'SoftwareApplication' || type === 'CreativeWork'), route + ': missing work schema');
}
assert(!documents.get('/works/previewlog').includes('installUrl'), 'PreviewLog has no confirmed public download');
assert.match(documents.get('/'), /content="index, follow, max-image-preview:large/, 'indexable pages should allow large image previews');

// 폰트: 서브셋이 실제로 쓰인 글자를 모두 담고 있는지 확인합니다.
// 하나라도 빠지면 그 글자만 시스템 폰트로 떨어져 자간·굵기가 튀므로 빌드를 실패시킵니다.
{
  const used = await collectGlyphs(root);
  const declared = new Set();
  for (const match of documents.get('/').matchAll(/<link rel="preload" as="font"[^>]*href="([^"]+)"/g)) {
    await access(join(root, match[1]));
  }
  const cssFile = (await readdir(join(root, '_astro'))).find((name) => name.endsWith('.css'));
  const css = await readFile(join(root, '_astro', cssFile), 'utf8');
  // 라틴 폰트는 한글을 담지 않는 것이 정상이므로, 폰트마다 "원본이 그릴 수 있던 글자 중
  // 서브셋에서 사라진 것"이 없는지를 봅니다. 전체 커버리지는 스택 합집합으로 따로 확인합니다.
  const union = new Set();
  for (const face of faces) {
    const path = join(root, 'assets/fonts', face.out);
    const file = await readFile(path);
    assert.equal(file.toString('latin1', 0, 4), 'wOF2', face.out + ': expected woff2');
    const covered = new Set(openFont(path).characterSet);
    const origin = new Set(openFont(resolve('assets/fonts-src', face.source)).characterSet);
    const dropped = [...used].filter((char) => origin.has(char.codePointAt(0)) && !covered.has(char.codePointAt(0)));
    assert.equal(dropped.length, 0, `${face.out}: 서브셋에서 빠진 글자 ${JSON.stringify(dropped.join(''))}`);
    for (const code of covered) union.add(code);
    declared.add(`${face.family}/${face.weight}`);
    assert.match(css, new RegExp(`url\\(["']?/assets/fonts/${face.out}`), face.out + ': not referenced by the stylesheet');
  }
  // 폰트 스택 전체가 쓰인 글자를 빠짐없이 덮어야 합니다.
  const uncovered = [...used].filter((char) => !union.has(char.codePointAt(0)));
  assert.equal(uncovered.length, 0, `어느 폰트에도 없는 글자: ${JSON.stringify(uncovered.join(''))}`);
  // CSS가 요청할 수 있는 모든 family/weight 조합에 파일이 있어야 합니다.
  // 없으면 브라우저가 가짜 볼드를 합성하거나 다른 굵기를 늘여 그립니다.
  for (const [, family, weight] of css.matchAll(/font-family: ?'([^']+)'[^}]*?font-weight: ?(\d+)/g)) {
    if (['Pretendard', 'Inter Tight', 'DM Sans'].includes(family)) {
      assert(declared.has(`${family}/${weight}`), `${family} ${weight}: 선언된 굵기에 해당하는 서브셋 파일이 없습니다`);
    }
  }
  assert(!css.includes('fonts.googleapis.com') && !css.includes('cdn.jsdelivr.net'), 'stylesheet must not call third-party font hosts');
  for (const html of documents.values()) {
    assert(!/https:\/\/(fonts\.|cdn\.jsdelivr)/.test(html), 'pages must not reference third-party font hosts');
  }
}

// 실측 스탬프: 토큰이 남아 있으면 measure-site가 돌지 않은 것이고,
// 표시된 수치는 dist를 다시 재서 나온 값과 일치해야 합니다. 사이트에 공개하는
// 숫자이므로 배포본과 어긋난 채 나가지 않도록 막습니다.
{
  for (const [route, html] of documents) {
    assert(!/__(PAGE_WEIGHT|JS_WEIGHT|THIRD_PARTY|ROUTES|FONT_WEIGHT|BUILD_DATE)__/.test(html), route + ': 실측 토큰이 치환되지 않았습니다');
  }
  const stamp = documents.get('/').match(/<aside class="build-stamp"[\s\S]*?<\/aside>/)?.[1 - 1];
  assert(stamp, '홈에 실측 스탬프가 없습니다');
  assert.match(stamp, /외부 요청<\/dt><dd>0건/, '외부 요청 수치는 0이어야 합니다');

  const detail = documents.get('/works/bldnex-website');
  const shown = detail.match(/<p class="metric-value">([\d.]+) KB<\/p>/)?.[1];
  assert(shown, '상세 페이지에 용량 수치가 없습니다');
  assert.equal(
    documents.get('/').match(/용량<\/dt><dd>([\d.]+) KB/)?.[1],
    shown,
    '홈과 상세의 용량 수치가 다릅니다',
  );
  const routeCount = Number(detail.match(/<p class="metric-value">(\d+)개<\/p>/)?.[1]);
  assert.equal(routeCount, routes.length, '표시된 페이지 수가 실제 라우트 수와 다릅니다');
}

// App Store 배지: 공개된 앱 정보와 실제 에셋이 함께 있어야 합니다.
{
  const home = documents.get('/');
  const app = JSON.parse(await readFile(resolve('src/data/app-store.json'), 'utf8'));
  assert(home.includes(app.url), '홈에 App Store 링크가 없습니다');
  assert.match(home, /target="_blank" rel="noopener noreferrer"/, 'App Store 링크는 새 창으로 열려야 합니다');
  for (const file of ['assets/shuffo/app-icon.webp', 'assets/shuffo/app-store-badge-ko.svg']) {
    await access(join(root, file));
  }
  assert(home.includes(`iOS ${app.minimumOs} 이상`), '홈의 iOS 요구 버전이 app-store.json과 다릅니다');
  assert(home.includes(`최신 버전 ${app.version}`), '홈의 앱 버전이 app-store.json과 다릅니다');
}

// Cloudflare Pages 배포 설정이 dist에 함께 올라가야 합니다.
const headers = await readFile(join(root, '_headers'), 'utf8');
assert.match(headers, /^\/_astro\/\*$/m, '_headers must cache hashed assets');
assert.match(headers, /Cache-Control: public, max-age=31536000, immutable/, '_headers must mark hashed assets immutable');
assert.match(headers, /X-Content-Type-Options: nosniff/, '_headers must set nosniff');

// canonical·og:url·sitemap이 모두 슬래시 없는 주소를 써야 Cloudflare Pages의 정규화와 어긋나지 않습니다.
for (const [route, html] of documents) {
  const url = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  // 공개 주소는 확장자도 끝 슬래시도 없어야 합니다. build.format을 바꾸면 쉽게 어긋납니다.
  assert.equal(url, 'https://bldnex.com' + (route === '/' ? '/' : route), route + ': canonical must match the public URL exactly');
  assert(!url.includes('.html'), route + ': canonical must not expose the .html file name');
}

console.log(`PASS: ${routes.length} pages, ${linkCount} internal references, ${shareImages.size} share images, metadata, structured data, anchors, FAQ, sitemap and privacy guardrails.`);
