// 원본 웹폰트를 내려받아 assets/fonts-src/에 보관합니다.
// 빌드 때마다 네트워크를 타지 않도록 원본은 저장소에 커밋하고, 이 스크립트는
// 폰트를 처음 받거나 상위 버전으로 갱신할 때만 수동으로 실행합니다 (pnpm fonts:fetch).
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const dir = new URL('../assets/fonts-src/', import.meta.url);

const PRETENDARD = 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard/packages/pretendard/dist/web/static/woff2';
const GOOGLE = 'https://raw.githubusercontent.com/google/fonts/main/ofl';

// 모두 SIL Open Font License 1.1. 라이선스 전문도 함께 보관합니다.
const sources = [
  { file: 'Pretendard-Light.woff2', url: `${PRETENDARD}/Pretendard-Light.woff2` },
  { file: 'Pretendard-Regular.woff2', url: `${PRETENDARD}/Pretendard-Regular.woff2` },
  { file: 'Pretendard-SemiBold.woff2', url: `${PRETENDARD}/Pretendard-SemiBold.woff2` },
  { file: 'InterTight[wght].ttf', url: `${GOOGLE}/intertight/InterTight%5Bwght%5D.ttf` },
  { file: 'DMSans[opsz,wght].ttf', url: `${GOOGLE}/dmsans/DMSans%5Bopsz,wght%5D.ttf` },
  { file: 'OFL-Pretendard.txt', url: 'https://raw.githubusercontent.com/orioncactus/pretendard/main/LICENSE' },
  { file: 'OFL-InterTight.txt', url: `${GOOGLE}/intertight/OFL.txt` },
  { file: 'OFL-DMSans.txt', url: `${GOOGLE}/dmsans/OFL.txt` },
];

await mkdir(dir, { recursive: true });
for (const { file, url } of sources) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${file}: ${response.status} ${url}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  await writeFile(new URL(file, dir), bytes);
  console.log(`${String(bytes.length).padStart(9)} B  assets/fonts-src/${file}`);
}
console.log('\n원본 폰트를 받았습니다. 저장소에 커밋한 뒤 pnpm build로 서브셋을 생성하세요.');
console.log(fileURLToPath(dir));
