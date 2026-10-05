// Shuffo의 App Store 공개 정보를 받아 src/data/app-store.json에 고정합니다.
// 빌드가 네트워크에 의존하지 않도록 결과는 저장소에 커밋하고, 앱을 업데이트했을 때만
// 수동으로 실행합니다 (pnpm assets:appstore).
//
// 여기 적히는 값은 전부 Apple이 공개하는 앱 정보입니다. 성과 수치나 평점처럼
// 맥락에 따라 달라지는 값은 가져오지 않습니다.
import { writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const APP_ID = '6814380886';
const endpoint = `https://itunes.apple.com/lookup?id=${APP_ID}&country=kr`;

const response = await fetch(endpoint);
if (!response.ok) throw new Error(`App Store lookup failed: ${response.status}`);
const [app] = (await response.json()).results;
if (!app) throw new Error('App Store lookup returned no results');

const data = {
  name: app.trackName,
  seller: app.sellerName,
  genre: app.primaryGenreName,
  minimumOs: app.minimumOsVersion,
  releaseDate: app.releaseDate.slice(0, 10),
  updatedDate: app.currentVersionReleaseDate.slice(0, 10),
  version: app.version,
  url: `https://apps.apple.com/kr/app/shuffo/id${APP_ID}`,
  checkedAt: new Date().toISOString().slice(0, 10),
};

await writeFile(new URL('../src/data/app-store.json', import.meta.url), JSON.stringify(data, null, 2) + '\n');

const icon = await fetch(app.artworkUrl512);
await sharp(Buffer.from(await icon.arrayBuffer()))
  .resize(192, 192)
  .webp({ quality: 88 })
  .toFile(new URL('../public/assets/shuffo/app-icon.webp', import.meta.url).pathname);

console.log(JSON.stringify(data, null, 2));
console.log('\nsrc/data/app-store.json과 public/assets/shuffo/app-icon.webp를 갱신했습니다.');
