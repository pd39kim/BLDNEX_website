# 현재 구조

최종 갱신: 2026-10-05

## 현재 단계

BLDNEX 공식 웹사이트를 구현하는 Astro + TypeScript 프로젝트입니다. 이전 위키메모리 브라우저 프로토타입(`index.html`, `app.js`, `styles.css`)은 제거했습니다.

정적 페이지 **9개**가 빌드됩니다: Home, About, Services, Works 목록, PreviewLog, Shuffo, bldnex.com, Contact, Privacy Policy.

**2026-10-05 Cloudflare Pages로 공개**했습니다(https://bldnex.com). 별도 런타임 없이 Astro와 작은 인라인 스크립트만 사용합니다. Contact는 이메일 문의만 제공하고 API·서버 저장·첨부파일은 없습니다. Privacy는 운영값을 모두 채웠지만 법률 검토 전까지 noindex를 유지합니다.

## 파일 역할

| 경로 | 역할 |
| --- | --- |
| `src/data/site.ts` | 회사 정보, 페이지별 메타·OG 이미지, 공개 경로 목록 |
| `src/data/works.ts` | Works 콘텐츠 모델과 데이터 (PreviewLog · Shuffo · bldnex.com) |
| `src/data/services.ts` | 홈/상세 서비스 원고와 연계 역량 |
| `src/data/process.ts`, `src/data/faq.ts` | 공통 4단계 진행 방식 · 7개 FAQ |
| `src/data/privacy.ts` | 개인정보처리방침 운영값과 9개 섹션 본문 |
| `src/data/app-store.json` | Shuffo의 App Store 공개 정보 (스크립트가 갱신) |
| `src/components/` | Header/Footer, PageHero, SectionHeading, WorkCard, Process, FAQ, CallToAction |
| `src/layouts/BaseLayout.astro` | 공통 HTML, SEO 메타, OG, JSON-LD, 폰트 preload |
| `src/pages/` | 라우트. `works/[slug].astro`는 제품 2종, `works/bldnex-website.astro`는 전용 |
| `src/styles/global.css` | 다크 디자인 토큰, 반응형 레이아웃, 접근성 기본 |
| `src/styles/brand.css` | 공식 심볼·워드마크 크기와 브랜드 색상 |
| `src/styles/typography.css` | 셀프호스팅 `@font-face` 선언과 폰트 스택 |
| `src/pages/sitemap.xml.ts`, `robots.txt.ts` | 공개 8개 경로. Privacy는 sitemap 제외 |
| `assets/fonts-src/` | 원본 웹폰트와 OFL 라이선스 전문 (커밋) |
| `public/assets/brand/` | 공식 SVG + 페이지별 OG PNG 7종 |
| `public/assets/shuffo/` | Shuffo 스크린샷, 앱 아이콘, App Store 배지 |
| `public/_headers` | Cloudflare Pages 응답 헤더 (보안·캐시) |
| `wrangler.toml` | Pages 배포 설정 |

## 빌드 파이프라인

```
pnpm build
  ├─ astro build              dist/ 에 정적 HTML 생성 (build.format: 'file')
  ├─ scripts/subset-fonts.mjs dist 의 글리프만 추려 폰트 서브셋
  └─ scripts/measure-site.mjs dist 를 실측해 페이지의 수치 토큰 치환
```

`pnpm test` = `pnpm build` + `scripts/check-site.mjs`.

| 스크립트 | 실행 시점 | 역할 |
| --- | --- | --- |
| `subset-fonts.mjs` | 빌드마다 자동 | 쓰인 글자만 남긴 woff2 생성 → [문서](fonts.md) |
| `measure-site.mjs` | 빌드마다 자동 | 용량·JS·외부 요청·라우트 수 실측 후 토큰 치환 → [문서](proof-points.md) |
| `check-site.mjs` | `pnpm test` | 링크·SEO·구조화 데이터·폰트 커버리지·실측 일치 검사 |
| `generate-og.mjs` | 수동 (`pnpm assets:og`) | 페이지별 1200×630 공유 PNG 7종 생성 |
| `fetch-fonts.mjs` | 수동 (`pnpm fonts:fetch`) | 원본 폰트·라이선스 내려받기 |
| `fetch-appstore.mjs` | 수동 (`pnpm assets:appstore`) | App Store 정보·앱 아이콘 갱신 |

자동 생성물은 커밋하지 않고, 원본(`assets/fonts-src/`, `src/data/app-store.json`)만 커밋해 빌드가 네트워크에 의존하지 않게 합니다.

## 에셋·동작

- **폰트**: 외부 CDN을 쓰지 않습니다. 빌드할 때 쓰인 글자만 서브셋해 자체 호스팅합니다(3,292 KB → 202 KB). 서드파티 요청 0건.
- **이미지**: 원본을 보존하고 Astro Image + Sharp로 WebP/srcset을 생성합니다. Sharp는 직접 의존성으로 고정합니다.
- **OG**: 페이지마다 전용 공유 이미지를 씁니다. 공통 이미지 1장을 돌려쓰지 않습니다.
- **구조화 데이터**: 전역 `Organization` + `WebSite`, 작업물 상세에 `BreadcrumbList` + `SoftwareApplication`(앱) 또는 `CreativeWork`(웹사이트).
- 모바일 메뉴와 FAQ는 native `details`/`summary`라 JavaScript 없이 열립니다. 메뉴에 Escape·외부 클릭·포커스 이동·리사이즈 닫기를 추가했습니다.
- 이메일 복사는 Clipboard API가 있을 때만 노출하고, 성공·실패를 live region으로 알립니다. 발송·접수 완료를 가장하지 않습니다.
- PreviewLog 외부 URL은 `site.ts`에만 남기고 UI에서 활성화하지 않습니다. 배포 상태가 확인되지 않았기 때문입니다.

## 검증 명령

- `pnpm check` — Astro/TypeScript 검사
- `pnpm test` — 빌드 + 전체 검사 (실패하면 배포하지 않습니다)
- `npx wrangler pages deploy dist --project-name bldnex-website --branch main` — 배포 → [문서](deploy.md)

## 변경 시 주의점

- 공개 사이트 구현은 [기획서의 권장 프로젝트 구조](../BLDNEX_WEBSITE_PLAN.md)를 기준으로 합니다.
- 확정 콘텐츠가 없는 고객 포트폴리오는 지어내지 않습니다.
- 회사명·도메인·이메일·외부 링크는 `src/data/site.ts`에서 관리해 여러 파일에 복사하지 않습니다.
- 공식 워드마크는 텍스트로 재현하지 않고 `public/assets/brand/bldnex-wordmark.svg`를 사용합니다.
- 브랜드 에셋의 표시 크기는 `src/styles/brand.css`에서 조정하고 SVG 원본 비율을 유지합니다.
- **새 글꼴 굵기를 쓰려면** `subset-fonts.mjs`의 `faces`에 추가해야 합니다. 없는 굵기는 브라우저가 가짜 볼드를 합성하므로 빌드가 막습니다.
- **사이트에 공개하는 수치는 손으로 적지 않습니다.** `measure-site.mjs`의 토큰을 쓰고, `check-site.mjs`가 배포본과 일치하는지 확인합니다.
- **호스트 동작은 추측하지 않습니다.** `build.format`과 www 처리에서 두 번 틀렸습니다. 실제 배포해 확인한 뒤 [배포 문서](deploy.md)에 적습니다.
