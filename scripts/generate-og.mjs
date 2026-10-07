// Rebuild the share images from the provided vector artwork; no AI-generated branding.
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const asset = (name) => new URL('../public/assets/brand/' + name, import.meta.url);
const symbol = await readFile(asset('bldnex-symbol.svg'), 'utf8');
const wordmark = (await readFile(asset('bldnex-wordmark.svg'), 'utf8')).replaceAll('#090e15', '#f2f1ec');
const image = (svg, x, y, width, height) =>
  `<image x="${x}" y="${y}" width="${width}" height="${height}" href="data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}" />`;
const escape = (value) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * 페이지별 공유 이미지. headlineSize는 1040px 폭 안에 들어가도록 직접 지정합니다.
 * 문구는 각 페이지에 실제로 쓰인 카피에서 가져오며, 성과·수치를 새로 만들지 않습니다.
 */
const cards = [
  { file: 'og-bldnex.png', path: '', eyebrow: 'PRODUCT DEVELOPMENT STUDIO', headline: 'BUILD WHAT’S NEXT.', headlineSize: 91, sub: '웹사이트 · SaaS · 모바일 앱' },
  { file: 'og-about.png', path: '/about', eyebrow: 'ABOUT BLDNEX', headline: 'We build our own.', headlineSize: 82, sub: '직접 만들고 운영해 본 경험으로 고객의 제품을 만듭니다.' },
  { file: 'og-services.png', path: '/services', eyebrow: 'SERVICES', headline: 'Websites. Apps. SaaS.', headlineSize: 72, sub: '웹사이트 · 웹앱/SaaS · 모바일 앱 개발' },
  { file: 'og-works.png', path: '/works', eyebrow: 'SELECTED WORKS', headline: 'Our own products.', headlineSize: 84, sub: 'PreviewLog · Shuffo' },
  { file: 'og-previewlog.png', path: '/works/previewlog', eyebrow: 'DESKTOP PRODUCT', headline: 'PreviewLog.', headlineSize: 91, sub: '촬영본을 편집용 프리뷰 자료로.' },
  { file: 'og-shuffo.png', path: '/works/shuffo', eyebrow: 'MOBILE GAME', headline: 'Shuffo.', headlineSize: 91, sub: '좋아하는 사진이 작은 퍼즐이 됩니다.' },
  { file: 'og-contact.png', path: '/contact', eyebrow: 'START A PROJECT', headline: 'Tell us what you’re building.', headlineSize: 60, sub: 'BLDNEX.DEV@GMAIL.COM' },
  { file: 'og-bldnex-website.png', path: '/works/bldnex-website', eyebrow: 'WEBSITE / BLDNEX OWN PRODUCT', headline: 'bldnex.com', headlineSize: 91, sub: '만든 제품을 보시려면, 지금 보고 계신 이 사이트를 확인해 주세요.' },
];

const render = ({ eyebrow, headline, headlineSize, sub, path }) => `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#0a0b0d"/>
  ${image(symbol, 80, 65, 54.34, 72)}
  ${image(wordmark, 146.34, 81, 251.81, 40)}
  <path d="M80 175H1120" stroke="#2b3037"/>
  <text x="80" y="282" font-family="Arial, sans-serif" font-size="17" letter-spacing="3" fill="#35a9ff">${escape(eyebrow)}</text>
  <text x="74" y="390" font-family="Arial, sans-serif" font-size="${headlineSize}" font-weight="300" letter-spacing="1" fill="#f2f1ec">${escape(headline)}</text>
  <text x="80" y="472" font-family="Apple SD Gothic Neo, sans-serif" font-size="28" fill="#a0a5ae">${escape(sub)}</text>
  <path d="M80 538H1120" stroke="#2b3037"/>
  <text x="80" y="578" font-family="Arial, sans-serif" font-size="17" fill="#a0a5ae">bldnex.com${escape(path)}</text>
  <path d="M1080 582l28-28m-28 0h28v28" fill="none" stroke="#35a9ff" stroke-width="2"/>
</svg>`;

for (const card of cards) {
  await sharp(Buffer.from(render(card))).png({ compressionLevel: 9 }).toFile(fileURLToPath(asset(card.file)));
  console.log(`Generated public/assets/brand/${card.file} (1200 × 630)`);
}
