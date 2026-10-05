# 현재 구조

최종 갱신: 2026-10-05

## 현재 단계

BLDNEX 공식 웹사이트를 구현하는 Astro + TypeScript 프로젝트입니다. 이전 위키메모리 브라우저 프로토타입(`index.html`, `app.js`, `styles.css`)은 제거했습니다.

공개용 정적 페이지 **9개**와 비공개 관리자 셸 **1개**가 빌드됩니다: Home, About, Services, Works 목록, PreviewLog, Shuffo, bldnex.com, Contact, Privacy Policy + `/admin/inquiries`.

기존 사이트는 **2026-10-05 Cloudflare Pages로 공개**했습니다(https://bldnex.com). 이후 문의 폼·Pages Functions/D1·Access 관리자·Resend 알림/파기 Worker를 구현했으며 접수 OFF 상태로 Pages 배포까지 완료했습니다. 실제 도메인에서 Contact 화면 200·접수 config disabled·관리자 unconfigured 차단을 확인했습니다. 기존 이메일 경로는 남습니다. Privacy는 기존 운영값을 보존하고 폼 개정 초안을 추가했으며 검토 전까지 noindex를 유지합니다. [구현·운영 연결](../BLDNEX_CONTACT_IMPLEMENTATION_2026-10-05.md)

후속 승인으로 운영/검수 D1 두 개를 생성·마이그레이션했고 환경별 Turnstile 및 Pages 비밀 키를 등록했습니다. Pages의 기본 설정은 로컬 DB이며 `production`/`preview`를 명시해야 원격 DB를 선택합니다. 예약 Worker도 운영/검수 DB를 분리했으며 아직 배포하지 않았습니다. 관리자·Resend 사용·보관 기간은 확정됐고 실제 Resend/Access 연결 및 정책 검토는 별도입니다.

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
| `src/pages/404.astro` | 오류 페이지. 없으면 소프트 404가 발생합니다 |
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
| `shared/contact.ts` | 공통 검증·필드·동의 버전·승인된 보관 기간 |
| `src/components/ContactForm.astro`, `src/scripts/contact.ts` | 접수 폼·입력 유지·동일 요청 재시도 |
| `functions/`, `server/` | 접수/관리자 API, JWT 검증, D1 저장, 알림·파기 로직 |
| `migrations/` | 문의·알림·감사·요청 제한·작업 상태·동시성 버전 |
| `src/pages/admin/inquiries.astro`, `src/scripts/admin.ts` | 비공개 문의 관리 |
| `workers/contact-jobs/` | 5분 예약 실행 Worker, 메일 재시도와 파기 |
| `public/_routes.json` | Functions 실행 범위 `/api/*`, `/admin*` |
| `wrangler.local.toml`, `tests/` | 로컬 전용 DB·격리 테스트. 원격 바인딩 금지 |

## 빌드 파이프라인

```
pnpm build
  ├─ astro build              dist/ 에 정적 HTML 생성 (build.format: 'file')
  ├─ scripts/subset-fonts.mjs dist 의 글리프만 추려 폰트 서브셋
  └─ scripts/measure-site.mjs dist 를 실측해 페이지의 수치 토큰 치환
```

`pnpm test` = 로컬 D1 서버 테스트 + `pnpm build` + `scripts/check-site.mjs`. 브라우저 검수는 `pnpm test:browser`, Functions/Worker 컴파일은 `pnpm contact:check`입니다.

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

- **폰트**: 외부 CDN을 쓰지 않습니다. HTML·번들 JS의 동적 문구까지 서브셋합니다. 입력 필드와 관리자 원문은 시스템 글꼴로 임의의 사용자 문자를 표시합니다. 홈의 외부 요청은 0건이며, 활성 문의에는 Turnstile 연결이 별도로 있습니다.
- **이미지**: 원본을 보존하고 Astro Image + Sharp로 WebP/srcset을 생성합니다. Sharp는 직접 의존성으로 고정합니다.
- **OG**: 페이지마다 전용 공유 이미지를 씁니다. 공통 이미지 1장을 돌려쓰지 않습니다.
- **구조화 데이터**: 전역 `Organization` + `WebSite`, 작업물 상세에 `BreadcrumbList` + `SoftwareApplication`(앱) 또는 `CreativeWork`(웹사이트).
- 모바일 메뉴와 FAQ는 native `details`/`summary`라 JavaScript 없이 열립니다. 메뉴에 Escape·외부 클릭·포커스 이동·리사이즈 닫기를 추가했습니다.
- 이메일 복사는 Clipboard API가 있을 때만 노출하고, 성공·실패를 live region으로 알립니다. 발송·접수 완료를 가장하지 않습니다.
- 문의 성공은 D1의 원문+알림 작업 저장 완료 기준입니다. 전송 결과가 불명확하면 동일 키·동일 원문으로 재시도합니다.
- 관리자 페이지/변경 API는 JWT 서명·허용 이메일·Origin을 검사합니다. 키 미설정 시 차단하며 개발용 인증 우회는 없습니다.
- 메일은 예약 Worker만 발송합니다. 최근 15분간 작업 기록이 없으면 신규 접수를 닫습니다. 원문 파기는 접수 중지와 별개로 유지합니다.
- PreviewLog 외부 URL은 `site.ts`에만 남기고 UI에서 활성화하지 않습니다. 배포 상태가 확인되지 않았기 때문입니다.

## 검증 명령

- `pnpm check` — Astro/TypeScript 검사
- `pnpm test` — 빌드 + 전체 검사 (실패하면 배포하지 않습니다)
- `pnpm contact:check` — Functions 및 예약 Worker 컴파일 (dry-run)
- `pnpm contact:migrate:local`, `pnpm contact:dev` — 로컬 DB와 Functions, 포트 8788
- `pnpm test:browser` — Chrome 회귀 검사. 실제 메일 수신 검증과 구분
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
