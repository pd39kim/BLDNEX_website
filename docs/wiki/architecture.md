# 현재 구조

## 현재 단계

이 저장소는 BLDNEX 공식 웹사이트를 구현하는 Astro + TypeScript 프로젝트입니다. 이전 위키메모리 브라우저 프로토타입(`index.html`, `app.js`, `styles.css`)은 제거했습니다.

현재 정적 페이지 8개가 빌드됩니다: Home, About, Services, Works 목록, PreviewLog, Shuffo, Contact, Privacy Policy.

2026-10-05 콘텐츠 업데이트 적용. Privacy는 미완성 방침을 대신하는 준비 안내이며 noindex입니다. Contact는 이메일 문의만 제공하고 API·서버 저장·첨부파일은 없습니다. 별도 React 런타임 없이 Astro와 작은 클라이언트 스크립트를 사용합니다.

## 파일 역할

| 경로 | 역할 |
| --- | --- |
| `docs/BLDNEX_WEBSITE_PLAN.md` | BLDNEX 공식 웹사이트의 상세 기획 |
| `public/assets/shuffo/` | Shuffo 포트폴리오 이미지와 출처 메모 |
| `docs/wiki/` | 프로젝트 지속 메모리 |
| `src/data/site.ts` | 회사 정보와 공통 외부 링크 |
| `src/data/works.ts` | 공개 Works 콘텐츠 모델과 데이터 |
| `src/data/services.ts` | 홈/상세 서비스 원고와 연계 역량 |
| `src/data/process.ts`, `src/data/faq.ts` | 공통 4단계 진행 방식·7개 FAQ |
| `src/components/` | Header/Footer, PageHero, SectionHeading, WorkCard, Process, FAQ, CallToAction |
| `src/layouts/` | 공통 HTML, SEO, Header/Footer 조합 |
| `src/pages/` | Home·About·Services·Works·Contact·Privacy 라우트 |
| `src/styles/global.css` | 다크 디자인 토큰, 반응형 레이아웃, 접근성 기본 스타일 |
| `src/styles/brand.css` | 공식 심볼·워드마크 크기와 브랜드 색상 |
| `src/styles/typography.css` | Inter Tight 헤드라인, Pretendard 한글 헤드라인, 본문 폰트 |
| `public/assets/brand/` | BLDNEX 공식 SVG 심볼·워드마크·로고·슬로건 |
| `src/pages/sitemap.xml.ts`, `src/pages/robots.txt.ts` | 실제 공개 대상 7개 경로. 미완성 Privacy는 sitemap 제외 |
| `scripts/check-site.mjs` | 빌드 HTML·링크·앵커·SEO·이미지·문의 공개 제한 검사 |
| `scripts/generate-og.mjs` | 공식 SVG 기반 1200×630 공유 PNG 생성 |

## 에셋·동작

- 원본 Shuffo 이미지를 보존하고 Astro Image + Sharp로 WebP/srcset을 생성합니다. Sharp는 직접 의존성으로 고정합니다.
- 모바일 메뉴와 FAQ는 native details/summary이므로 JavaScript 없이도 열립니다. 메뉴에는 Escape/외부 클릭/포커스 이동/리사이즈 닫기를 추가했습니다.
- 이메일 복사는 Clipboard API가 있을 때만 노출합니다. 성공·실패를 live region으로 알리고 이메일 발송/접수 완료를 가장하지 않습니다.
- 회사 정보, 페이지 메타데이터, 이메일 제목, 사이트맵 경로는 `src/data/site.ts`에서 관리합니다.
- 모든 페이지는 공통 브랜드 OG PNG를 사용합니다. PreviewLog 외부 URL은 설정에만 남기고 UI에서는 활성화하지 않습니다.

## 검증 명령

- `pnpm check`: Astro/TypeScript 검사
- `pnpm test`: 정적 빌드 + 내부 링크·콘텐츠 기본 제약 검사
- `pnpm assets:og`: 공유 이미지 재생성
- 실제 브라우저 검수 기록은 [2026-10-05 업데이트 보고](../BLDNEX_UPDATE_REPORT_2026-10-05.md)를 확인합니다.

## 변경 시 주의점

- 공개 사이트 구현은 [기획서의 권장 프로젝트 구조](../BLDNEX_WEBSITE_PLAN.md)를 기준으로 합니다.
- 확정 콘텐츠가 없는 고객 포트폴리오는 지어내지 않고 `draft` 또는 placeholder로 둡니다.
- 회사명, 도메인, 이메일, 외부 링크는 공통 설정에서 관리해 여러 파일에 복사하지 않습니다.
- 공식 워드마크는 텍스트로 재현하지 않고 `public/assets/brand/bldnex-wordmark.svg`를 사용합니다.
- 브랜드 에셋의 표시 크기는 `src/styles/brand.css`에서 조정하고 SVG 원본의 비율을 유지합니다.
