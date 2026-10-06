// 배포된 사이트를 실제로 받아 공개 중인 수치와 대조합니다.
//
// 빌드 검사(check-site.mjs)로는 잡을 수 없는 것을 봅니다. Cloudflare는 Web Analytics
// 비컨 같은 스크립트를 엣지에서 HTML에 주입하므로 dist에도 저장소에도 흔적이 없고,
// 브라우저처럼 Accept: text/html 로 요청해야만 드러납니다.
//
//   pnpm verify:live                  https://bldnex.com 검사
//   pnpm verify:live https://...      다른 주소 검사
import assert from 'node:assert/strict';

const base = (process.argv[2] ?? 'https://bldnex.com').replace(/\/$/, '');

// 엣지 주입은 브라우저처럼 보이는 요청에만 일어납니다. 기본 fetch 헤더로는 놓칩니다.
const headers = {
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'ko-KR,ko;q=0.9',
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
};

const routes = ['/', '/about', '/services', '/works', '/works/previewlog', '/works/shuffo', '/works/bldnex-website', '/contact', '/privacy'];

const get = async (path) => {
  const response = await fetch(base + path, { headers, redirect: 'manual' });
  return { status: response.status, location: response.headers.get('location'), html: await response.text() };
};

/**
 * 페이지를 열 때 브라우저가 실제로 요청하는 외부 출처만 모읍니다.
 * `<a href>`는 사용자가 누르기 전에는 요청이 일어나지 않으므로 세지 않습니다.
 * App Store 링크처럼 의도된 외부 링크를 외부 요청으로 오해하지 않기 위함입니다.
 */
function externalOrigins(html) {
  const found = new Set();
  const add = (url) => {
    try {
      const origin = new URL(url, base).origin;
      if (origin !== base) found.add(origin);
    } catch { /* 상대경로나 data: 는 무시 */ }
  };
  // 로드를 유발하는 태그의 src
  for (const [, url] of html.matchAll(/<(?:script|img|iframe|source|video|audio|embed)\b[^>]*\bsrc="([^"]+)"/gi)) add(url);
  // <link> 는 rel 에 따라 요청이 생깁니다
  for (const [tag] of html.matchAll(/<link\b[^>]*>/gi)) {
    const rel = tag.match(/\brel="([^"]*)"/i)?.[1]?.toLowerCase() ?? '';
    if (!/stylesheet|preload|preconnect|dns-prefetch|prefetch|modulepreload|icon/.test(rel)) continue;
    const href = tag.match(/\bhref="([^"]+)"/i)?.[1];
    if (href) add(href);
  }
  // CSS 안의 url()
  for (const m of html.matchAll(/url\((["']?)(https?:\/\/[^)"']+)\1\)/gi)) add(m[2]);
  return found;
}

// 사이트가 스스로 외부로 요청하지 않는다고 적어 둔 곳들. 여기 어긋나면 공개 문구가 거짓이 됩니다.
const allowed = new Set();

/**
 * Cloudflare 가 엣지에서 끼워 넣는 것들. 같은 출처(/cdn-cgi/...)라 외부 출처 검사에
 * 걸리지 않으므로 따로 봅니다. 저장소에는 없는 코드가 페이지에서 실행되는 상태이고,
 * Email Obfuscation 은 JS 가 꺼진 방문자에게서 연락 수단을 없앱니다.
 */
function edgeInjections(html) {
  const found = [];
  if (/\/cdn-cgi\/scripts\/[^"']*email-decode/.test(html)) found.push('Email Obfuscation (email-decode.min.js)');
  if (/\/cdn-cgi\/l\/email-protection/.test(html)) found.push('Email Obfuscation (mailto 링크 치환)');
  if (/__cf_email__/.test(html)) found.push('Email Obfuscation (이메일 표시 가림)');
  if (/static\.cloudflareinsights\.com/.test(html)) found.push('Web Analytics 비컨');
  if (/\/cdn-cgi\/scripts\/[^"']*rocket-loader/.test(html)) found.push('Rocket Loader');
  return [...new Set(found)];
}

let failures = 0;
const fail = (message) => { console.error('  FAIL ' + message); failures++; };

console.log(`검사 대상: ${base}\n`);

const home = await get('/');
assert.equal(home.status, 200, '홈이 200이 아닙니다');

// 1) 공개 중인 "외부 요청" 수치와 실제가 맞는지
const claimed = home.html.match(/외부 요청<\/dt><dd>(\d+)건/)?.[1];
if (claimed === undefined) fail('홈에서 외부 요청 수치를 찾지 못했습니다');

const seen = new Map();
const injected = new Map();
const mailtoCounts = new Map();
for (const route of routes) {
  const { status, html } = await get(route);
  if (status !== 200) { fail(`${route}: ${status}`); continue; }
  for (const origin of externalOrigins(html)) {
    if (allowed.has(origin)) continue;
    if (!seen.has(origin)) seen.set(origin, []);
    seen.get(origin).push(route);
  }
  for (const injection of edgeInjections(html)) {
    if (!injected.has(injection)) injected.set(injection, []);
    injected.get(injection).push(route);
  }
  mailtoCounts.set(route, (html.match(/href="mailto:/g) ?? []).length);
}

// 엣지 주입은 dist 에 없으므로 빌드 검사로는 영영 잡히지 않습니다.
for (const [injection, where] of injected) {
  fail(`Cloudflare 엣지 주입 — ${injection} (${where.length}개 페이지)`);
}
if (injected.size > 0) {
  console.error('  대시보드에서 해당 기능을 끄세요. 저장소를 고쳐도 사라지지 않습니다.');
}

// 연락 경로: mailto 가 평문으로 남아야 JS 가 꺼져도 연락할 수 있습니다.
const contactMailto = mailtoCounts.get('/contact') ?? 0;
if (contactMailto === 0) fail('/contact 에 평문 mailto 링크가 없습니다 (JS 없는 환경에서 연락 불가)');

if (seen.size === 0) {
  console.log(`  OK   외부 출처 없음 (공개 수치: ${claimed}건)`);
} else {
  for (const [origin, where] of seen) {
    fail(`외부 출처 ${origin} — ${where.length}개 페이지 (${where.slice(0, 3).join(', ')}${where.length > 3 ? ' 외' : ''})`);
  }
  if (claimed === '0') {
    fail(`홈은 "외부 요청 0건"이라고 공개하고 있습니다. 문구를 고치거나 해당 요청을 제거해야 합니다.`);
  }
  console.error('\n  dist에 없는데 여기서 잡혔다면 Cloudflare가 엣지에서 주입한 것입니다.');
  console.error('  Workers & Pages → 프로젝트 → Settings → Web Analytics 를 확인하세요.');
}

// 2) 개인정보처리방침이 "분석 도구 미사용"이라고 적고 있는지와 실제 대조
const privacy = (await get('/privacy')).html;
if (/분석 도구는 사용하지 않습니다|분석도구를 사용하지 않습니다/.test(privacy) && seen.size > 0) {
  fail('개인정보처리방침은 분석 도구 미사용이라고 적고 있는데 외부 출처가 있습니다');
}

// 3) 주소 정규화: canonical 이 가리키는 주소가 리다이렉트 없이 열려야 합니다
for (const route of routes) {
  const { status } = await get(route);
  if (status !== 200) fail(`${route}: canonical 주소가 ${status}`);
}
const slash = await get('/about/');
if (slash.status !== 308) fail(`/about/ 이 308이 아니라 ${slash.status}`);

// 4) 없는 주소는 404 여야 합니다 (소프트 404 재발 방지)
const missing = await get('/this-path-does-not-exist-' + Date.now());
if (missing.status !== 404) fail(`없는 주소가 ${missing.status} 입니다 (소프트 404)`);

// 5) 보안 헤더
const secured = await fetch(base + '/', { headers });
for (const [header, expected] of [['x-content-type-options', 'nosniff'], ['x-frame-options', 'DENY']]) {
  if (secured.headers.get(header) !== expected) fail(`${header} 헤더가 ${secured.headers.get(header)}`);
}

console.log();
if (failures > 0) {
  console.error(`실패 ${failures}건`);
  process.exit(1);
}
console.log(`PASS: ${routes.length}개 경로, 외부 출처 ${seen.size}곳, 404·리다이렉트·보안 헤더 확인.`);
