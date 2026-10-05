// Rebuild the share image from the provided vector artwork; no AI-generated branding.
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const asset = (name) => new URL('../public/assets/brand/' + name, import.meta.url);
const symbol = await readFile(asset('bldnex-symbol.svg'), 'utf8');
const wordmark = (await readFile(asset('bldnex-wordmark.svg'), 'utf8')).replaceAll('#090e15', '#f2f1ec');
const image = (svg, x, y, width, height) =>
  `<image x="${x}" y="${y}" width="${width}" height="${height}" href="data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}" />`;
const artwork = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#0a0b0d"/>
  ${image(symbol, 80, 65, 54.34, 72)}
  ${image(wordmark, 146.34, 81, 251.81, 40)}
  <path d="M80 175H1120" stroke="#2b3037"/>
  <text x="80" y="282" font-family="Arial, sans-serif" font-size="17" letter-spacing="3" fill="#35a9ff">PRODUCT DEVELOPMENT STUDIO</text>
  <text x="74" y="390" font-family="Arial, sans-serif" font-size="91" font-weight="300" letter-spacing="1" fill="#f2f1ec">BUILD WHAT’S NEXT.</text>
  <text x="80" y="472" font-family="Apple SD Gothic Neo, sans-serif" font-size="28" fill="#a0a5ae">웹사이트 · SaaS · 모바일 앱</text>
  <path d="M80 538H1120" stroke="#2b3037"/>
  <text x="80" y="578" font-family="Arial, sans-serif" font-size="17" fill="#a0a5ae">bldnex.com</text>
  <path d="M1080 582l28-28m-28 0h28v28" fill="none" stroke="#35a9ff" stroke-width="2"/>
</svg>`;
await sharp(Buffer.from(artwork)).png().toFile(fileURLToPath(asset('og-bldnex.png')));
console.log('Generated public/assets/brand/og-bldnex.png (1200 × 630)');
