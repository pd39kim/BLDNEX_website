// 빌드된 dist에서 실제로 쓰인 글자만 추려 웹폰트를 서브셋합니다.
// astro build 다음에 실행되며(pnpm build), 결과물은 dist/assets/fonts/에 들어갑니다.
//
// 글리프 추출은 HTML·번들 JS 원문을 훑습니다. 본문 텍스트뿐 아니라
// aria-label·alt 같은 속성값과 스크립트 안의 동적 문자열도 화면이나
// 보조기기에 노출되므로 전부 포함해야 합니다. 태그 이름과 클래스명이 섞여
// 들어가지만 모두 ASCII라 결과 크기에는 영향이 없습니다.
import { readdir, readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import subsetFont from 'subset-font';

const dist = new URL('../dist/', import.meta.url);
const src = new URL('../assets/fonts-src/', import.meta.url);

// dist는 배포본, public은 astro dev가 서빙하는 사본입니다. 글리프 목록이 빌드된
// HTML에서 나오므로 서브셋은 빌드 뒤에 돌고, public 사본 덕에 다음 dev 실행부터
// 개발 화면도 같은 폰트로 보입니다. public/assets/fonts/는 git에서 제외합니다.
const outDirs = [new URL('assets/fonts/', dist), new URL('../public/assets/fonts/', import.meta.url)];

/** 서브셋할 폰트. weight는 CSS가 실제로 요청할 수 있는 값만 둡니다. */
export const faces = [
  { family: 'Pretendard', weight: 300, source: 'Pretendard-Light.woff2', out: 'pretendard-300.woff2' },
  { family: 'Pretendard', weight: 400, source: 'Pretendard-Regular.woff2', out: 'pretendard-400.woff2' },
  { family: 'Pretendard', weight: 600, source: 'Pretendard-SemiBold.woff2', out: 'pretendard-600.woff2' },
  { family: 'Inter Tight', weight: 300, source: 'InterTight[wght].ttf', out: 'inter-tight-300.woff2', variation: { wght: 300 } },
  { family: 'DM Sans', weight: 400, source: 'DMSans[opsz,wght].ttf', out: 'dm-sans-400.woff2', variation: { wght: 400 } },
  { family: 'DM Sans', weight: 600, source: 'DMSans[opsz,wght].ttf', out: 'dm-sans-600.woff2', variation: { wght: 600 } },
];

const htmlEntities = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', '#39': "'" };
const decode = (html) => html.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (match, ref) => {
  if (ref[0] === '#') {
    const code = ref[1] === 'x' || ref[1] === 'X' ? parseInt(ref.slice(2), 16) : Number(ref.slice(1));
    return Number.isFinite(code) ? String.fromCodePoint(code) : match;
  }
  return htmlEntities[ref.toLowerCase()] ?? match;
});

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else if (['.html', '.js'].includes(extname(entry.name))) yield path;
  }
}

/** HTML와 번들 JS의 동적 안내/오류 문구를 모두 포함합니다. 사용자 입력은 시스템 폰트를 씁니다. */
export async function collectGlyphs(root = new URL('.', dist).pathname) {
  const glyphs = new Set();
  for await (const file of walk(root)) {
    const source = decode(await readFile(file, 'utf8')).replace(/\\u\{([0-9a-f]{1,6})\}|\\u([0-9a-f]{4})/gi,
      (_, wide, short) => String.fromCodePoint(parseInt(wide ?? short, 16)));
    for (const char of source) {
      if (char.codePointAt(0) > 31) glyphs.add(char);
    }
  }
  // 폰트가 비는 일이 없도록 기본 문장부호와 공백은 항상 포함합니다.
  for (const char of '  !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~·…—–‘’“”') {
    glyphs.add(char);
  }
  return glyphs;
}

// 이 파일은 check-site.mjs가 faces/collectGlyphs를 가져다 쓰므로,
// 직접 실행했을 때만 서브셋을 만듭니다.
if (process.argv[1] !== fileURLToPath(import.meta.url)) {
  // imported as a module — no side effects
} else {
await main();
}

async function main() {
const glyphs = await collectGlyphs();
const text = [...glyphs].sort().join('');
for (const dir of outDirs) await mkdir(dir, { recursive: true });

let before = 0;
let after = 0;
for (const face of faces) {
  const original = await readFile(new URL(face.source, src));
  const subset = await subsetFont(original, text, {
    targetFormat: 'woff2',
    // 커닝·합자 등 OpenType 기능을 보존해 원본과 같은 모양으로 그려지게 합니다.
    preserveNameIds: [0, 1, 2, 3, 4, 5, 6, 13, 14],
    ...(face.variation ? { variationAxes: face.variation } : {}),
  });
  for (const dir of outDirs) await writeFile(new URL(face.out, dir), subset);
  before += original.length;
  after += subset.length;
  console.log(`${String(subset.length).padStart(8)} B  ${face.out.padEnd(22)} (원본 ${String(original.length).padStart(8)} B)`);
}

// 재배포 시 OFL 라이선스 전문을 함께 제공해야 합니다.
for (const license of ['OFL-Pretendard.txt', 'OFL-InterTight.txt', 'OFL-DMSans.txt']) {
  for (const dir of outDirs) await copyFile(new URL(license, src), new URL(license, dir));
}

console.log(`\n글리프 ${glyphs.size}자 · 폰트 ${(before / 1024).toFixed(0)} KB → ${(after / 1024).toFixed(0)} KB (${(100 * (1 - after / before)).toFixed(1)}% 감소)`);
}
