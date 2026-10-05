// 빌드된 dist를 실측해 페이지에 박힌 토큰을 실제 수치로 바꿉니다.
// astro build → subset-fonts → measure-site 순서로 돌며, 사이트에 공개하는 숫자가
// 배포본과 어긋나지 않게 합니다.
//
// 치환하면 HTML 크기가 수십 바이트 달라지므로, 치환한 결과를 다시 재어
// 표시값이 바뀌지 않을 때까지 반복합니다. 그래서 화면의 숫자는 그 파일 자체의 값입니다.
import { readdir, readFile, writeFile, stat } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { gzipSync } from 'node:zlib';

const root = new URL('../dist/', import.meta.url).pathname;

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else yield path;
  }
}

const gzipped = async (path) => gzipSync(await readFile(path), { level: 9 }).length;
const raw = async (path) => (await stat(path)).size;

/**
 * 첫 방문자가 홈을 열 때 받는 용량입니다.
 * HTML·CSS는 서버가 gzip으로 보내므로 압축 후 크기를, woff2·webp·png는
 * 이미 압축된 형식이라 파일 크기를 그대로 씁니다. 폰트는 홈에서 쓰지 않는
 * 굵기까지 전부 더해 실제보다 보수적으로(크게) 잡습니다.
 */
async function measure() {
  const cssDir = join(root, '_astro');
  const cssFiles = (await readdir(cssDir)).filter((name) => name.endsWith('.css'));
  const fontDir = join(root, 'assets/fonts');
  const fonts = (await readdir(fontDir)).filter((name) => name.endsWith('.woff2'));

  const home = await readFile(join(root, 'index.html'), 'utf8');

  let bytes = await gzipped(join(root, 'index.html'));
  for (const file of cssFiles) bytes += await gzipped(join(cssDir, file));
  for (const file of fonts) bytes += await raw(join(fontDir, file));

  // 홈이 참조하는 이미지. srcset은 가장 큰 후보를 골라 보수적으로 잡습니다.
  const assets = new Set();
  for (const [, value] of home.matchAll(/(?:src|href)="(\/assets\/[^"]+|\/_astro\/[^"]+\.(?:webp|png|jpg|svg))"/g)) assets.add(value);
  for (const [, set] of home.matchAll(/srcset="([^"]+)"/g)) {
    const widest = set.split(',').map((part) => part.trim().split(/\s+/)[0]).filter(Boolean).pop();
    if (widest?.startsWith('/')) assets.add(widest);
  }
  for (const asset of assets) {
    if (asset.endsWith('.css') || asset.endsWith('.woff2')) continue;
    try {
      bytes += asset.endsWith('.svg') ? await gzipped(join(root, asset)) : await raw(join(root, asset));
    } catch { /* 외부 또는 생성 전 경로는 건너뜁니다 */ }
  }

  const inlineJs = [...home.matchAll(/<script(?![^>]*ld\+json)[^>]*>([\s\S]*?)<\/script>/g)]
    .reduce((total, match) => total + Buffer.byteLength(match[1]), 0);

  let routes = 0;
  // Public pages only; the authenticated admin shell is not a public portfolio route.
  for await (const file of walk(root)) if (extname(file) === '.html' && !file.startsWith(join(root, 'admin') + '/')) routes++;

  let fontBytes = 0;
  for (const file of fonts) fontBytes += await raw(join(fontDir, file));

  return {
    pageWeight: `${Math.round(bytes / 1024)} KB`,
    js: inlineJs === 0 ? '0 KB' : `${(inlineJs / 1024).toFixed(1)} KB`,
    thirdParty: '0',
    routes: String(routes),
    fontWeight: `${Math.round(fontBytes / 1024)} KB`,
    buildDate: new Date().toISOString().slice(0, 10),
  };
}

const tokens = ['PAGE_WEIGHT', 'JS_WEIGHT', 'THIRD_PARTY', 'ROUTES', 'FONT_WEIGHT', 'BUILD_DATE'];
const keys = { PAGE_WEIGHT: 'pageWeight', JS_WEIGHT: 'js', THIRD_PARTY: 'thirdParty', ROUTES: 'routes', FONT_WEIGHT: 'fontWeight', BUILD_DATE: 'buildDate' };

// 토큰이 박힌 원본을 먼저 보관해 두고, 매 반복마다 원본에서 다시 치환합니다.
const originals = new Map();
for await (const file of walk(root)) {
  if (extname(file) !== '.html') continue;
  const html = await readFile(file, 'utf8');
  if (tokens.some((token) => html.includes(`__${token}__`))) originals.set(file, html);
}

if (originals.size === 0) {
  console.log('measure-site: 치환할 토큰이 없습니다.');
} else {
  let metrics;
  let settled = false;
  for (let pass = 1; pass <= 5 && !settled; pass++) {
    metrics = await measure();
    for (const [file, html] of originals) {
      let output = html;
      for (const token of tokens) output = output.replaceAll(`__${token}__`, metrics[keys[token]]);
      await writeFile(file, output);
    }
    const next = await measure();
    settled = tokens.every((token) => next[keys[token]] === metrics[keys[token]]);
    if (settled) metrics = next;
  }
  if (!settled) throw new Error('measure-site: 수치가 수렴하지 않았습니다.');
  console.log(
    `measure-site: 홈 ${metrics.pageWeight} · JS ${metrics.js} · 폰트 ${metrics.fontWeight} · ` +
    `서드파티 ${metrics.thirdParty}건 · ${metrics.routes} routes · ${metrics.buildDate}`,
  );
}
