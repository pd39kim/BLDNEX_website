import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://bldnex.com',
  // Cloudflare Pages는 디렉터리 형식(/about/index.html)을 올리면 /about 요청을
  // /about/ 으로 308 리다이렉트합니다(2026-10-05 실제 배포로 확인).
  // canonical·og:url·sitemap이 슬래시 없는 주소를 쓰므로 파일 형식으로 내보내
  // /about.html 이 /about 에서 리다이렉트 없이 그대로 응답하도록 맞춥니다.
  trailingSlash: 'never',
  build: { format: 'file' },
});
