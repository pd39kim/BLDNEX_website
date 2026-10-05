# BLDNEX 공식 웹사이트 기획서

> 내부 바이브코딩 개발용 · v0.2 · 2026-10-02

## 최신 적용 기준 — 2026-10-05

사용자의 “업데이트 진행” 지시에 따라 [콘텐츠 업데이트 계획](BLDNEX_CONTENT_UPDATE_PLAN_2026-10-03.md)과 [카피 원고](BLDNEX_WEBSITE_COPY_DRAFT_2026-10-03.md)의 일반 콘텐츠를 로컬 웹사이트에 적용했습니다. 아래 v0.2 원문은 장기 목표와 초기 제안을 포함하므로, 충돌할 때는 이 절과 [Wiki 결정 기록](wiki/decisions.md)을 우선합니다.

- Home: Hero → Works → Services → Process → Studio → FAQ → CTA.
- About·Services·Works·두 제품 상세·Contact의 실제 원고와 링크를 보강.
- 3개 주력 서비스 + 3개 연계 역량, 4단계 프로세스와 산출물 예시, 공통 FAQ.
- 현재 전환은 이메일 문의. 정식 폼·Workers/D1/R2·관리자는 운영 준비 후 별도 구현.
- Privacy는 완성된 방침이 아니라 준비 안내. noindex와 sitemap 제외 유지, 이메일 문의의 정보 처리까지 공개 전 검토.
- PreviewLog 자료 경로는 현재 Mac의 `/Users/macsk/Projects/previewlog-landing/deploy/index.html`. 소개 자료 기반 설명과 실제 앱 검증을 구분하며 출시 배지·다운로드·외부 CTA는 보류.
- Shuffo는 보유 세로 화면과 공식 App Store 링크 사용. 두 제품을 모두 출시했다고 묶어 표현하지 않음.
- 공식 SVG, 심볼 36px / 워드마크 20px / 간격 6px, 푸터 70% 비율과 기존 폰트·컬러 유지.
- Blog·추가 고객 사례는 실제 콘텐츠와 공개 허가 확보 후 추가.

[구현·검증 결과 및 남은 사항](BLDNEX_UPDATE_REPORT_2026-10-05.md). 외부 배포는 하지 않았으며 원문 전체의 최종 완료 조건이 충족된 상태는 아닙니다.

## 0. 한 줄 정의

BLDNEX는 아이디어를 빠르게 검증 가능한 제품으로 만들고, 기획부터 디자인·개발·출시까지 함께하는 제품 개발 스튜디오다.

핵심 슬로건은 **BUILD WHAT'S NEXT**이며, 웹사이트의 1차 전환 목표는 **프로젝트 문의 접수**다.

## 1. 확정된 사업·브랜드 정보

| 항목 | 내용 |
| --- | --- |
| 회사명 | 빌드넥스 / BLDNEX |
| 슬로건 | BUILD WHAT'S NEXT |
| 사업자등록번호 | 374-02-03692 |
| 대표 이메일 | BLDNEX.DEV@GMAIL.COM |
| 포지션 | 제품 개발 스튜디오 |
| 핵심 고객 | 스타트업, 중소기업, 개인창업자 |
| 주력 서비스 | 기업·브랜드 웹사이트, 웹앱/SaaS, 모바일 앱 |
| 제공 가능 범위 | 데스크톱 클라이언트, 모바일 게임, 백엔드/API, UI/UX 디자인 |
| 핵심 가치 | 빠른 실행, 높은 완성도, 기획부터 개발까지 일괄 진행 |
| 운영 형태 | 1인 개발사 중심, 협업 개발자 2인 |
| 시장 | 한국 중심 |
| 1차 CTA | 프로젝트 문의 |
| 대표 자체 제품 | PreviewLog |
| 게임 레퍼런스 | Shuffo |

## 2. 웹사이트 목표

### 사업 목표

1. BLDNEX를 단순 외주 개발사가 아닌 제품 개발 파트너로 인식시킨다.
2. PreviewLog와 Shuffo를 통해 실제 제품을 기획·개발·출시한 역량을 증명한다.
3. 개발을 맡기려는 잠재 고객이 1~2분 안에 서비스 범위와 협업 방식을 이해하게 한다.
4. 프로젝트 문의에 필요한 정보를 구조화해 상담 전환율과 초기 미팅의 질을 높인다.

### 사용자가 가져가야 할 인상

- 작지만 빠르게 움직인다.
- 개발만 하는 사람이 아니라 제품을 끝까지 생각한다.
- 결과물의 디테일을 중요하게 여긴다.
- 복잡한 아이디어도 함께 구조화할 수 있다.
- 실제 제품을 만들어 출시해본 팀이다.

## 3. 핵심 메시지와 카피 방향

### 3.1 메인 메시지

영문을 주목도 높은 헤드라인으로 쓰고, 한글로 의미를 설명한다.

```text
BUILD WHAT'S NEXT.
다음 제품을, 빠르게 현실로 만듭니다.
```

보조 설명:

```text
BLDNEX는 아이디어를 웹사이트, 앱, SaaS, 데스크톱 제품으로 설계하고 개발하는 제품 개발 스튜디오입니다.
기획부터 디자인·개발·출시까지 하나의 흐름으로 함께합니다.
```

CTA:

- `Start a project` / `프로젝트 문의`
- `See our work` / `만든 제품 보기`

### 3.2 반복해서 사용할 세 가지 증명

```text
MOVE FAST
빠르게 핵심을 만들고 검증합니다.

MAKE IT SOLID
보이는 화면부터 데이터와 운영까지 완성도를 챙깁니다.

FROM IDEA TO LAUNCH
기획·디자인·개발·출시를 한 흐름으로 연결합니다.
```

### 3.3 피해야 할 표현

- “무엇이든 최저가로 제작”
- “AI가 모두 만들어주는 개발”
- 실적이 확정되지 않은 숫자형 과장 문구
- 고객사 이름·성과를 허가 없이 노출하는 표현
- 기능 목록만 나열하는 기술 중심 카피

## 4. 사이트맵

```text
/
├── About
├── Services
├── Works / Portfolio
│   ├── PreviewLog
│   ├── Shuffo
│   └── 추후 고객 프로젝트
├── Blog / Insights
│   └── /blog/:slug
├── Contact
├── previewlog.bldnex.com (별도 제품 사이트)
├── Shuffo App Store 링크
└── Privacy Policy
```

상단 네비게이션:

```text
[BLDNEX 로고]  About  Services  Works  Blog  Contact  [Start a project ↗]
```

로고 클릭은 Home으로 이동한다. 모바일에서는 햄버거 메뉴와 고정 문의 CTA를 사용한다.

푸터:

```text
BLDNEX / BUILD WHAT'S NEXT
PreviewLog · Shuffo · Privacy Policy
About · Services · Works · Blog · Contact
사업자등록번호 374-02-03692 · BLDNEX.DEV@GMAIL.COM
© BLDNEX. All rights reserved.
```

## 5. 홈 페이지 상세 설계

홈은 별도 소개 페이지의 모음이 아니라 “왜 BLDNEX인가 → 무엇을 만들었나 → 무엇을 만들 수 있나 → 어떻게 문의하나”의 흐름으로 구성한다.

### Section 01 — Hero

목적: 첫 화면에서 포지션과 CTA를 전달한다.

```text
BUILD WHAT'S NEXT.
아이디어를 실제 제품으로.

BLDNEX는 스타트업과 팀의 다음 제품을 기획하고 디자인하고 개발합니다.
웹사이트부터 SaaS, 모바일 앱, 데스크톱 제품까지.

[프로젝트 문의 ↗] [만든 제품 보기 ↓]
```

화면:

- 다크 배경, 큰 영문 타이포그래피
- 마우스 이동에 따라 아주 약하게 반응하는 그리드/노이즈/제품 카드
- 과도한 3D, 무작위 글리치, AI 생성 이미지 사용 금지
- 실제 PreviewLog 제품 UI 일부를 추상화한 카드 또는 실제 스크린샷 사용

### Section 02 — Positioning

```text
Not just a dev shop.
제품을 함께 만드는 개발 파트너입니다.
```

설명:

```text
좋은 결과물은 코드만으로 만들어지지 않습니다.
무엇을 만들지 정리하고, 사용자가 어떻게 쓰는지 설계하고,
출시 후에도 개선할 수 있는 구조까지 생각합니다.
```

세 가지 카드: `Fast execution`, `High craft`, `End-to-end ownership`

### Section 03 — Featured Work

목적: 자체 제품을 통한 신뢰 증명.

첫 카드:

```text
01 / PRODUCT
PreviewLog
촬영본을 편집 가능한 로그로.
```

설명은 PreviewLog 랜딩 시안의 확정 내용과 일치시킨다.

> PreviewLog는 프록시 영상을 로컬에서 분석해 대표 컷, 장면 설명, 음성 전사와 편집용 프리뷰 로그를 만들어주는 데스크톱 앱이다. 현재 M1 이상 Mac을 지원하며 Windows 버전은 준비 중이다.

액션: `Explore PreviewLog ↗` → `https://previewlog.bldnex.com`

PreviewLog 회사 사이트 콘텐츠 기준은 `/Users/sangkim/Desktop/BLDNEX/previewlog-landing/deploy/index.html`을 사용한다. `site/index.html`의 이전 문구나 구조를 기준으로 재작성하지 않는다.

두 번째 카드:

```text
02 / GAME
Shuffo
BLDNEX가 직접 개발하고 App Store에 출시한 모바일 게임.
```

액션: `View on App Store ↗` → `https://apps.apple.com/kr/app/shuffo/id6814380886`

### Section 04 — Services

```text
From first sketch to shipped product.
```

서비스 카드:

1. **Websites & Brand Experiences** — 기업·브랜드 웹사이트, 랜딩페이지, 인터랙티브 웹 경험
2. **Web Apps & SaaS** — 업무 도구, 관리자 시스템, 구독형 서비스, MVP
3. **Mobile Apps** — iOS/Android 제품 설계와 개발
4. **Product Design** — UX 구조, UI 시스템, 프로토타이핑
5. **Backend & API** — 인증, 데이터 모델, 외부 서비스 연동, 운영 API
6. **Desktop & Games** — 데스크톱 클라이언트와 모바일 게임

각 카드는 기술 스택 나열보다 “어떤 문제를 해결하는지” 중심으로 작성한다.

### Section 05 — Process

```text
01 Understand — 문제와 목표를 정리합니다.
02 Shape — 기능, 사용자 흐름, 화면을 구체화합니다.
03 Build — 작동하는 제품을 빠르게 만들고 검증합니다.
04 Ship — 출시와 운영에 필요한 기반까지 연결합니다.
```

각 단계에 산출물을 표시한다.

- Understand: 목표·사용자·범위
- Shape: 정보 구조·와이어프레임·기술 방향
- Build: 디자인 시스템·기능 구현·QA
- Ship: 배포·분석·운영 문서

### Section 06 — About / Studio

```text
Small team. Serious about the details.
```

현재 공개 가능한 사실만 사용한다.

```text
BLDNEX는 대표 개발자를 중심으로, 필요에 따라 전문 개발자들과 협업하는 제품 개발 스튜디오입니다.
작은 팀의 빠른 의사결정과 제품을 직접 출시해본 경험을 바탕으로,
아이디어를 실제로 사용할 수 있는 결과물까지 연결합니다.
```

인원·경력·설립연도·사업자 정보는 공개 결정 후 추가한다.

### Section 07 — Blog Preview

최신 글 3개를 노출한다.

- 개발 과정
- 제품 업데이트
- 문제를 해결하며 배운 것

초기 게시글이 없으면 섹션을 숨기거나 `Coming soon`으로 처리한다. 빈 블로그 목록을 메인에 노출하지 않는다.

### Section 08 — Final CTA

```text
Have something worth building?
다음 제품을 함께 만들어보세요.

[프로젝트 문의하기 ↗]
```

## 6. 내부 페이지 설계

### About

목적: 회사 소개와 협업 방식에 대한 신뢰 형성.

필수 블록:

- BLDNEX의 정의
- `BUILD WHAT'S NEXT` 의미
- 자체 제품을 만드는 이유
- 협업 개발자 네트워크 소개
- 일하는 방식
- 문의 CTA

### PreviewLog 제품 정보 기준

PreviewLog의 공식 제품 페이지는 다음 메시지와 기능 구조를 사용한다.

```text
프리뷰부터 편집용 자료까지 더 빠르게.

프록시 촬영본을 로컬에서 분석해 대표 컷, 한국어 전사,
타임코드와 촬영 품질 경고를 정리합니다.
감독·PD·편집자에게 전달할 프리뷰 자료를 더 빠르게 준비하세요.
```

핵심 기능:

- 장면별 대표 컷
- 한국어 대사와 타임코드
- 장면 설명과 검토 정보
- 컷 선택 및 정리
- 대사·비디오 로그 직접 수정
- 무음·흐림·노출 등 검토 경고
- HTML, PDF, CSV, SRT, VTT, JSON, SQLite 내보내기
- 로컬 우선 처리와 원본 파일 읽기 전용 관리

제품 페이지의 사용자 흐름은 `DRAFT YOUR PREVIEW → REVIEW & REFINE → DELIVER TO EDITING` 순서로 반영한다.

지원 환경 및 가격은 제품 페이지 기준을 따른다.

- Apple Silicon M1 이상
- macOS 13 이상
- 최소 8GB RAM, 16GB 권장
- 앱과 기본 모델 약 2GB
- 480p 이상 프록시 영상 권장
- Windows 버전 출시 예정
- 14일 또는 고유 원본 5시간 체험
- 연간 구독 ₩120,000 + VAT
- 출시 전에는 대기자 등록 폼을 사용

PreviewLog 지원 이메일은 `BLDNEX.DEV@GMAIL.COM`으로 연결한다.

### Services

각 서비스 페이지는 다음 템플릿을 공유한다.

1. 문제 중심 헤드라인
2. 제공 범위
3. 작업 결과물
4. 적합한 고객
5. 진행 프로세스
6. 관련 Works
7. 프로젝트 문의 CTA

### Works / Portfolio

초기에는 실제 콘텐츠가 준비된 자체 제품부터 게시한다.

카드 필드:

- 제목
- 카테고리
- 한 줄 설명
- 대표 이미지/영상
- 사용 기술(선택)
- 공개 링크
- 상세 설명

고객 프로젝트 3건(인테리어 회사 웹사이트, 영상 제작사 웹사이트, 무선전력송수신기 관리자 페이지)은 콘텐츠 정리 후 추가한다. 빈 칸을 추정해서 채우지 않는다.

### Blog / Insights

초기 콘텐츠 유형:

- 개발 과정
- PreviewLog 업데이트
- Shuffo 업데이트

목록 필터는 `All / Development / Product updates`로 시작한다. 글 상세에는 제목, 발행일, 카테고리, 본문, 관련 글, 문의 CTA를 둔다.

### Contact

페이지 상단 카피:

```text
Tell us what you're building.
아이디어 단계여도 괜찮습니다. 현재 상황과 만들고 싶은 것을 알려주세요.
```

폼 필드:

| 필드 | 타입 | 필수 | 규칙 |
| --- | --- | --- | --- |
| 이름/담당자명 | text | 예 | 2~50자 |
| 회사명 | text | 예 | 개인이면 `개인` 허용 |
| 이메일 | email | 예 | 이메일 형식 검증 |
| 연락처 | tel | 아니오 | 한국 전화번호 허용 |
| 예산 | select | 예 | 협의 필요 / 1천만 원 미만 / 1천~3천 / 3천 이상 |
| 희망 일정 | select | 예 | 1개월 이내 / 1~3개월 / 3개월 이후 / 미정 |
| 프로젝트 설명 | textarea | 예 | 최소 20자, 최대 5000자 |
| 첨부파일 | file | 아니오 | 최대 3개, 파일당 10MB |
| 개인정보 동의 | checkbox | 예 | 동의하지 않으면 제출 불가 |

예산 선택지는 실제 영업 정책에 맞춰 최종 확정한다. 가격을 공개하지 않는 원칙은 유지한다.

## 7. 디자인 시스템

### 방향

키워드: `dark / precise / editorial / product-minded / quiet confidence`

똑똑한개발자 사이트에서 참고할 것은 정보 흐름, 명확한 CTA, 서비스·제품·신뢰의 연결 구조다. BLDNEX는 더 작은 제품 스튜디오답게 콘텐츠 밀도를 줄이고 실제 제품 화면과 타이포그래피를 중심으로 차별화한다. 참고: https://www.toktokhan.dev/

### 컬러 제안

```css
--bg: #0A0B0D;
--surface: #111317;
--surface-raised: #171A1F;
--line: #292D33;
--text: #F2F1EC;
--muted: #92979F;
--accent: #C8FF5A; /* 최종 로고와 조정 */
--accent-warm: #FF8B68; /* 제품별 보조색, 선택 */
```

포인트 컬러는 로고 제공 후 로고 색상과 충돌하지 않도록 확정한다. 형광색을 넓은 면적에 사용하지 않는다.

### 타이포그래피

- 영문 헤드라인: `Space Grotesk`, `Inter Tight` 또는 라이선스가 명확한 대체 폰트
- 한글 본문: `Pretendard` 또는 `SUIT`
- 본문은 읽기 편하게, 헤드라인은 짧고 크게
- 영문 대문자 레이블은 자간을 넓혀 시스템적 인상 부여

### 모션

- 페이지 진입 시 섹션 단위 fade-up, 400~700ms
- Works 카드 hover 시 이미지 확대 1.02배와 메타 정보 이동
- Hero의 배경 그래픽은 저주기·저대비로만 반응
- `prefers-reduced-motion: reduce` 대응 필수
- 로딩 스플래시, 과도한 커서 효과, 무작위 글리치 금지

### 이미지 규칙

- AI 생성 이미지로 회사를 설명하지 않는다.
- 실제 제품 스크린샷, 실제 작업 결과물, 추상화된 UI 그래픽을 우선한다.
- 사진이 필요하면 팀/작업 환경의 실제 사진을 촬영해 사용한다.
- 모든 이미지에 alt 텍스트를 작성한다.

## 8. 기술 구현 제안

### 확정 구성

```text
Public site: Astro + TypeScript
Interactive islands: React + TypeScript (@astrojs/react)
Admin: React + TypeScript (별도 앱 또는 /admin island)
Styling: vanilla CSS tokens, CSS Modules 선택
Hosting: Cloudflare Pages
API: Cloudflare Workers
Database: Cloudflare D1
Files: Cloudflare R2
Admin auth: Cloudflare Access (대표 1명)
Spam protection: Cloudflare Turnstile
Email: Resend 또는 Cloudflare Email Routing + Worker 연동
Analytics: Cloudflare Web Analytics 또는 별도 privacy-friendly analytics
```

Astro는 공개 사이트의 페이지·콘텐츠·SEO·정적 생성을 담당한다. React는 모바일 메뉴, 문의 폼, 포트폴리오 필터, 관리자 에디터처럼 브라우저 상태가 필요한 영역에만 사용한다. Vite는 Astro 내부 개발 도구로 사용되며, 공개 사이트 전체를 Vite + React SPA로 구성하지 않는다. 관리자 기능이 커지면 `/admin`을 별도의 React 앱으로 분리한다.

이 결정의 이유:

- BLDNEX 공개 사이트는 회사 소개·제품·포트폴리오·블로그 중심이다.
- 첫 로딩과 검색 노출이 중요하다.
- 모든 화면을 React로 hydration할 필요가 없다.
- 향후 관리자와 SaaS 제품에는 React의 상태 관리·컴포넌트 생태계를 활용할 수 있다.
- 기존 HTML 시안은 Astro 컴포넌트로 옮기기 쉽고, PreviewLog 시안의 실제 콘텐츠도 재사용할 수 있다.

### Cloudflare 구성

#### Pages

- `bldnex.com`: BLDNEX 회사 사이트
- `previewlog.bldnex.com`: PreviewLog 제품 페이지
- PreviewLog 제품 사이트는 별도 프로젝트로 유지하고 BLDNEX Works에서 연결

#### Workers

권장 라우트:

```text
POST /api/contact
POST /api/contact/upload-url
GET  /api/blog
GET  /api/blog/:slug
POST /api/admin/blog
PUT  /api/admin/blog/:id
DELETE /api/admin/blog/:id
```

#### D1 스키마 초안

```sql
CREATE TABLE blog_posts (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL DEFAULT '',
  content_markdown TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'development',
  cover_r2_key TEXT,
  status TEXT NOT NULL DEFAULT 'draft', -- draft | published
  published_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE inquiries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  budget TEXT NOT NULL,
  schedule TEXT NOT NULL,
  description TEXT NOT NULL,
  consent_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new', -- new | reviewing | contacted | closed
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE inquiry_files (
  id TEXT PRIMARY KEY,
  inquiry_id TEXT NOT NULL REFERENCES inquiries(id),
  r2_key TEXT NOT NULL,
  original_name TEXT NOT NULL,
  content_type TEXT NOT NULL,
  size_bytes INTEGER NOT NULL,
  created_at TEXT NOT NULL
);
```

#### R2 파일 처리

1. 클라이언트가 파일명·타입·크기를 API에 보낸다.
2. Worker가 파일 수 3개, 파일당 10MB, 허용 타입을 검증한다.
3. Worker가 짧은 만료시간의 presigned upload URL을 발급한다.
4. 브라우저가 R2에 직접 업로드한다.
5. 문의 제출 시 파일 key만 D1에 저장한다.
6. 관리자 화면은 인증된 사용자만 다운로드 URL을 발급받는다.

허용 타입은 초기 기준 `pdf, doc, docx, ppt, pptx, xls, xlsx, zip, png, jpg, jpeg, webp`로 시작하고 필요에 따라 확장한다. 실행 파일은 차단한다.

#### 관리자 인증

- 관리자 사용자는 대표 1명.
- 관리자 경로는 `/admin`.
- Cloudflare Access로 이메일 allowlist를 구성한다.
- 앱 내부에 비밀번호를 저장하지 않는다.
- Worker에서도 Access JWT를 검증한다.
- 문의 상태 변경·글 작성·파일 다운로드 API는 모두 인증을 요구한다.

### 문의 이메일

문의 저장 성공 후 이메일 알림을 발송한다.

메일 제목:

```text
[BLDNEX 문의] {회사명} - {이름}
```

본문에는 모든 폼 값, 첨부파일 목록, 관리자 바로가기, 접수 시각을 포함한다. 이메일 발송 실패가 문의 DB 저장 실패로 이어지지 않도록 저장과 알림을 분리하고 실패 로그를 남긴다.

대표 이메일은 `BLDNEX.DEV@GMAIL.COM`을 사용하며, 실제 코드에는 `CONTACT_NOTIFICATION_EMAIL` 환경변수로 주입한다. 이메일 주소를 소스 코드에 직접 하드코딩하지 않는다.

## 9. SEO·접근성·운영

### SEO

- Home title: `BLDNEX — BUILD WHAT'S NEXT`
- Home description: `BLDNEX는 기획부터 개발까지 웹사이트, SaaS, 앱과 디지털 제품을 만드는 제품 개발 스튜디오입니다.`
- Open Graph 이미지: 실제 BLDNEX 로고 + 다크 배경 + 대표 문구
- `/works/previewlog`, `/works/shuffo`, `/blog/:slug`에 고유 metadata
- sitemap.xml, robots.txt 생성
- 구조화 데이터: Organization, SoftwareApplication(PreviewLog), VideoGame(Shuffo) 검토

### 접근성

- 키보드로 모든 네비게이션·모달·폼 사용 가능
- 명확한 focus-visible 스타일
- 명도 대비 WCAG AA 이상
- 이미지 alt, 폼 label, 오류 메시지 제공
- reduced-motion 지원
- 모바일에서 최소 44px 터치 영역

### 개인정보·보안

- 문의 폼에 개인정보 수집·이용 동의 문구와 Privacy Policy 링크 제공
- 문의 데이터 보존 기간을 정책에 명시
- R2 파일 URL을 공개 URL로 만들지 않음
- 파일 타입과 실제 MIME, 크기 모두 서버에서 재검증
- Turnstile과 rate limit 적용
- 입력값을 HTML로 렌더링할 때 escape
- 관리자 API에 CORS를 필요한 origin으로 제한

## 10. 구현 순서

### Phase 1 — 브랜드·정적 사이트

1. 로고·컬러·법적 공개 정보 확정
2. Astro + TypeScript 프로젝트 초기화
3. 공통 layout, nav, footer, design tokens
4. Home, About, Services, Works 목록
5. PreviewLog/Shuffo 상세 페이지
6. Contact 폼 UI와 유효성 검사
7. Cloudflare Pages 배포

### Phase 2 — 문의 운영

1. Worker API 초기화
2. D1 migrations 적용
3. Turnstile 검증
4. R2 presigned upload
5. 문의 DB 저장
6. 이메일 알림
7. `/admin/inquiries` 목록·상세·상태 변경

### Phase 3 — Blog

1. D1 blog schema
2. 공개 목록·상세
3. Cloudflare Access 관리자 인증
4. 글 작성·수정·발행·비공개
5. Markdown 렌더링 및 XSS 방어
6. OG 이미지와 sitemap 갱신

### Phase 4 — 디테일과 운영

1. 실제 포트폴리오 콘텐츠 추가
2. 로고와 실제 제품 이미지 교체
3. 인터랙션 polish
4. SEO/접근성 점검
5. 문의 테스트·첨부파일 테스트
6. 모바일·저속 네트워크 QA
7. Analytics 및 오류 모니터링 추가

## 11. 바이브코딩용 개발 프롬프트

아래 프롬프트를 구현 에이전트의 첫 요청으로 사용한다.

```text
너는 BLDNEX 공식 웹사이트를 구현하는 시니어 프론트엔드 엔지니어다.

목표:
- BLDNEX를 한국의 제품 개발 스튜디오로 소개한다.
- 슬로건은 “BUILD WHAT'S NEXT”다.
- 핵심 메시지는 빠른 실행, 높은 완성도, 기획부터 개발까지 일괄 진행이다.
- 주 고객은 스타트업, 중소기업, 개인창업자다.
- 첫 전환은 프로젝트 문의다.

브랜드 방향:
- 다크톤, 전문적이고 신뢰감 있는 분위기
- AI가 만든 듯한 무작위 그라디언트, 과도한 3D, 글리치는 사용하지 않는다.
- 실제 제품 화면과 타이포그래피를 중심으로 설계한다.
- 영문 headline + 자연스러운 한글 설명을 사용한다.
- 참고 구조는 https://www.toktokhan.dev/ 이지만 시각적·문구적으로 복제하지 않는다.

사이트:
- Home, About, Services, Works, Blog, Contact, Privacy Policy
- 로고 클릭은 Home
- Footer에 PreviewLog, Shuffo 링크 포함
- PreviewLog는 대표 Works이자 별도 제품 사이트 링크다.
- Shuffo는 App Store 출시작이며 https://apps.apple.com/kr/app/shuffo/id6814380886 로 연결한다.

기술:
- TypeScript 기반 Astro 우선
- Cloudflare Pages 배포
- API는 Cloudflare Workers
- D1은 blog_posts, inquiries, inquiry_files 저장
- R2는 포트폴리오 이미지와 문의 첨부파일 저장
- 관리자 1명은 Cloudflare Access로 보호
- 문의 첨부파일은 최대 3개, 파일당 10MB
- 모든 입력 검증은 서버에서 다시 수행

작업 방식:
1. 먼저 파일 구조와 실행 명령을 제안한다.
2. design tokens와 공통 layout을 먼저 구현한다.
3. Home의 콘텐츠 구조를 완성한 뒤 내부 페이지로 확장한다.
4. 실제 자료가 없는 포트폴리오 내용은 지어내지 말고 placeholder를 사용한다.
5. 각 단계마다 모바일, 키보드 접근성, reduced-motion을 확인한다.
6. 마지막에 로컬 실행·빌드·링크·폼 유효성 검증 명령을 실행한다.
```

## 12. 확정 전 확인 항목

구현 시작 전에 다음 세 가지만 확정한다.

- 회사 공식 도메인: `bldnex.com` 확정
- PreviewLog 연결 주소: `https://previewlog.bldnex.com` 확정
- 문의 알림 수신 이메일: `BLDNEX.DEV@GMAIL.COM`
- 사업자등록번호: `374-02-03692`
- Privacy Policy에 대표자명, 사업장 주소, 개인정보 보호책임자 정보 추가 필요

추가로 로고를 받으면 포인트 컬러, favicon, OG 이미지, 헤더 대비를 확정한다.

## 13. 완료 기준

- 첫 화면에서 BLDNEX의 정체성과 문의 CTA가 5초 안에 이해된다.
- PreviewLog와 Shuffo가 대표 자체 제품으로 보인다.
- 모든 주요 페이지가 모바일에서 사용 가능하다.
- 문의가 D1에 저장되고 이메일 알림이 발송된다.
- 첨부파일 제한과 보안 검증이 서버에서 동작한다.
- 대표가 관리자 페이지에서 문의를 확인하고 상태를 바꿀 수 있다.
- 대표가 Markdown 기반 블로그 글을 작성·발행할 수 있다.
- 빌드, 링크, 접근성, 폼, R2 업로드 테스트가 통과한다.

## 14. 페이지·라우트 구현 명세

| 경로 | 페이지 | 렌더링 | 핵심 데이터 | 1차 CTA |
| --- | --- | --- | --- | --- |
| `/` | Home | 정적/사전 생성 | 사이트 설정, Featured Works | 프로젝트 문의 |
| `/about` | About | 정적/사전 생성 | 회사 소개 설정 | 프로젝트 문의 |
| `/services` | Services | 정적/사전 생성 | 서비스 목록 | 상담 시작 |
| `/works` | Works 목록 | 정적/사전 생성 | Work 콘텐츠 | 상세 보기 |
| `/works/previewlog` | PreviewLog 상세 | 정적/사전 생성 | PreviewLog 콘텐츠 | 제품 사이트 방문 |
| `/works/shuffo` | Shuffo 상세 | 정적/사전 생성 | App Store 자료 | App Store 방문 |
| `/blog` | Blog 목록 | D1/API 또는 사전 생성 | 발행 글 목록 | 글 읽기 |
| `/blog/[slug]` | Blog 상세 | 동적/사전 생성 | 발행 글 본문 | 프로젝트 문의 |
| `/contact` | Contact | 정적 + React island | 문의 폼 | 문의 제출 |
| `/privacy` | Privacy Policy | 정적 | 법적 고지 | 없음 |
| `/admin/inquiries` | 문의 관리자 | React 앱 | D1 inquiries | 상태 변경 |
| `/admin/posts` | 블로그 관리자 | React 앱 | D1 blog_posts | 발행/수정 |

초기 공개 릴리스에는 `/`, `/about`, `/services`, `/works`, `/works/previewlog`, `/works/shuffo`, `/contact`, `/privacy`를 포함한다. Blog와 Admin은 API 안정화 후 활성화한다.

### 페이지별 콘텐츠 우선순위

#### Home

1. Hero: BLDNEX가 무엇을 만드는지와 프로젝트 문의 CTA
2. Proof: PreviewLog·Shuffo 실제 제품
3. Services: 주력 3개를 먼저, 전체 서비스는 보조 노출
4. Process: Understand → Shape → Build → Ship
5. Studio: 작은 팀, 높은 완성도
6. Blog: 글이 있을 때만 노출
7. Final CTA

#### Works

자체 제품을 먼저 보여주고 고객 프로젝트는 공개 승인된 자료만 추가한다. 각 상세 페이지는 “문제 → 만든 것 → 핵심 경험 → 결과물 → 링크” 순서를 사용한다.

#### Contact

폼 자체가 영업 자료가 되도록 “무엇을 만들고 싶은지”와 “현재 어디까지 진행했는지”를 자연스럽게 묻는다. 서버 검증 오류와 성공 상태를 사용자가 명확히 이해할 수 있어야 한다.

## 15. 콘텐츠 데이터 모델

### 정적 사이트 설정

`src/data/site.ts`에 다음을 둔다.

```ts
export const site = {
  name: 'BLDNEX',
  legalName: '빌드넥스',
  tagline: "BUILD WHAT'S NEXT",
  email: 'BLDNEX.DEV@GMAIL.COM',
  businessNumber: '374-02-03692',
  siteUrl: 'https://bldnex.com',
  previewlogUrl: 'https://previewlog.bldnex.com',
  shuffoUrl: 'https://apps.apple.com/kr/app/shuffo/id6814380886',
} as const;
```

이 정보는 화면·SEO·푸터·문의 완료 화면에서 공통으로 사용하고 여러 파일에 문자열을 복사하지 않는다.

### Work 모델

```ts
type Work = {
  slug: string;
  title: string;
  category: 'product' | 'game' | 'website' | 'webapp' | 'mobile';
  summary: string;
  description: string;
  cover: string;
  gallery: string[];
  role: string[];
  stack?: string[];
  externalUrl?: string;
  status: 'published' | 'draft';
};
```

PreviewLog와 Shuffo는 먼저 `published`로 넣고, 고객 프로젝트는 실제 자료가 등록될 때까지 `draft`로 둔다.

### Blog 모델

블로그 본문은 Markdown으로 작성하고 D1에는 검증된 Markdown을 저장한다.

```ts
type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: 'development' | 'product-update';
  contentMarkdown: string;
  coverR2Key?: string;
  status: 'draft' | 'published';
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
};
```

초기에는 글이 없으면 Home의 Blog 섹션을 렌더링하지 않는다. `Coming soon` 카드는 실제 운영 의지가 확정된 경우에만 사용한다.

## 16. 권장 프로젝트 구조

이 저장소에 있던 `index.html`, `app.js`, `styles.css` 위키메모리 프로토타입은 BLDNEX 공개 사이트와 무관하므로 제거했다. 공개 사이트는 아래 Astro 구조로 새로 구현한다.

```text
BLDNEX_website/
├── public/
│   ├── assets/
│   │   ├── brand/
│   │   ├── previewlog/
│   │   └── shuffo/
│   ├── favicon.svg
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── components/
│   │   ├── common/
│   │   ├── home/
│   │   ├── works/
│   │   └── contact/
│   ├── content/
│   │   ├── works/
│   │   └── config.ts
│   ├── data/site.ts
│   ├── layouts/BaseLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── about.astro
│   │   ├── services.astro
│   │   ├── works/index.astro
│   │   ├── works/[slug].astro
│   │   ├── blog/index.astro
│   │   ├── blog/[slug].astro
│   │   ├── contact.astro
│   │   └── privacy.astro
│   ├── styles/tokens.css
│   └── lib/
│       ├── api.ts
│       ├── seo.ts
│       └── validation.ts
├── worker/
│   ├── src/index.ts
│   ├── migrations/
│   └── wrangler.toml
├── docs/
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

컴포넌트 원칙:

- `.astro`: 정적 레이아웃·콘텐츠·SEO
- `.tsx`: 상태·이벤트·브라우저 API가 필요한 UI
- `src/data`: 사이트 전체에서 공유하는 확정 정보
- `src/content`: Markdown 기반 공개 콘텐츠
- `worker/`: 공개 페이지 코드와 분리된 API·보안 로직

## 17. 인터랙션 명세

### Header

- 데스크톱: 로고, 5개 네비게이션, 문의 CTA
- 모바일: 로고, 메뉴 버튼, 열린 상태에서 화면 전체 또는 패널 메뉴
- 스크롤 방향에 따라 숨기는 효과는 사용하지 않는다. 문의 CTA 접근성을 유지한다.
- 현재 경로 또는 섹션을 active 상태로 표시한다.

### Hero

- 최초 로드 시 텍스트·제품 그래픽이 순차적으로 나타난다.
- 제품 그래픽은 실제 제품 정보를 보조하는 수준으로만 움직인다.
- `prefers-reduced-motion`에서는 정적인 화면으로 제공한다.

### Works

- 카드 hover: 이미지 1.02배 확대, 제목/화살표 위치만 미세 이동
- 카드 클릭: 상세 페이지 또는 외부 링크
- 이미지가 없으면 무작위 그래픽 대신 제품명·카테고리 중심의 텍스트 커버 사용

### Contact

상태는 다음 네 가지로 정의한다.

```text
idle → editing → submitting → success
                         ↘ error
```

- 제출 중 버튼 비활성화와 진행 문구 표시
- 성공 시 접수 번호와 대표 이메일을 표시
- 실패 시 입력값을 보존하고 재시도 가능
- 첨부파일은 파일명·크기·삭제 버튼을 미리 표시
- 서버 오류 내용을 그대로 노출하지 않고 사용자용 메시지로 변환

## 18. API·데이터 흐름 명세

### 문의 제출

```text
Contact React island
  → Turnstile token 발급
  → POST /api/contact/upload-url (첨부파일이 있을 때)
  → R2 직접 업로드
  → POST /api/contact
  → D1 inquiries / inquiry_files 저장
  → 이메일 알림
  → 접수 완료 응답
```

`POST /api/contact` 요청에는 파일 자체가 아니라 검증된 R2 key만 전달한다. 이메일 발송 실패는 문의 저장 실패로 처리하지 않으며, 재전송 가능한 로그를 남긴다.

### Blog 공개 조회

- 공개 API는 `status = 'published'`만 반환한다.
- 목록에는 `id`, `slug`, `title`, `excerpt`, `category`, `publishedAt`, `coverUrl`만 반환한다.
- 본문은 상세 요청에서만 반환한다.
- `Cache-Control`을 설정해 공개 글 목록과 상세의 불필요한 D1 요청을 줄인다.
- 관리자 API는 Cloudflare Access JWT가 없으면 401을 반환한다.

## 19. 환경변수와 시크릿

값은 GitHub에 커밋하지 않는다.

```text
PUBLIC_SITE_URL=https://bldnex.com
PUBLIC_PREVIEWLOG_URL=https://previewlog.bldnex.com
PUBLIC_SHUFFO_URL=https://apps.apple.com/kr/app/shuffo/id6814380886
PUBLIC_TURNSTILE_SITE_KEY=...
TURNSTILE_SECRET_KEY=...
RESEND_API_KEY=...
CONTACT_NOTIFICATION_EMAIL=BLDNEX.DEV@GMAIL.COM
R2_PUBLIC_BASE_URL=...
```

D1·R2 바인딩 이름은 `DB`, `ASSETS`처럼 짧고 일관되게 유지한다. 로컬 개발에서는 `.dev.vars` 또는 Wrangler secret을 사용하고 `.gitignore`에 등록한다.

## 20. 테스트와 검수 기준

### 기능

- 모든 공개 라우트가 200 응답을 반환한다.
- 로고 클릭이 Home으로 이동한다.
- PreviewLog와 Shuffo 외부 링크가 정확하다.
- 문의 필수값·이메일·동의·파일 제한을 검증한다.
- 중복 제출을 방지한다.
- D1 저장 후 이메일 알림이 발송된다.
- 관리자만 문의와 블로그 데이터를 볼 수 있다.

### 화면

- 375px, 768px, 1280px 이상에서 레이아웃이 깨지지 않는다.
- 스크린샷과 텍스트가 과도하게 잘리지 않는다.
- 다크 배경의 본문·보조 텍스트 대비를 확인한다.
- hover만으로 핵심 정보가 사라지지 않는다.
- 키보드 Tab 순서가 시각적 순서와 일치한다.

### 성능·SEO

- 공개 페이지의 JavaScript는 필요한 island만 포함한다.
- 이미지에는 적절한 width/height와 lazy loading을 적용한다.
- `title`, description, canonical, OG image가 페이지별로 존재한다.
- sitemap과 robots가 실제 도메인을 가리킨다.
- Lighthouse 또는 동등한 도구로 모바일 성능을 확인한다.

### 보안

- 서버에서도 모든 입력과 파일 타입·용량을 재검증한다.
- R2 파일이 공개 URL로 노출되지 않는다.
- Markdown HTML을 sanitize한다.
- 관리자 API에 Access JWT 검증과 rate limit을 적용한다.
- 개인정보처리방침과 동의 문구가 실제 저장 필드와 일치한다.

## 21. 구현 마일스톤

### Milestone 0 — 정리

- [ ] 로고 원본 수령
- [ ] 법적 공개 정보(대표자명·주소·보호책임자) 확정
- [x] 기존 위키메모리 프로토타입 제거
- [ ] Astro 프로젝트 초기화
- [ ] 도메인·Cloudflare Pages 프로젝트 연결

### Milestone 1 — 공개 사이트 뼈대

- [ ] BaseLayout·Header·Footer
- [ ] 디자인 토큰과 다크 테마
- [ ] Home·About·Services
- [ ] Works 목록·상세
- [ ] 모바일 메뉴와 기본 모션

### Milestone 2 — 제품 신뢰 증명

- [ ] PreviewLog 상세에 `deploy/index.html` 기준 콘텐츠 반영
- [ ] Shuffo 공식 App Store 이미지 반영
- [ ] 실제 로고·favicon·OG 이미지 적용
- [ ] 외부 링크·이미지 alt 검수

### Milestone 3 — 문의 운영

- [ ] Contact island
- [ ] Workers `/api/contact`
- [ ] D1 migration
- [ ] Turnstile·R2·이메일
- [ ] 대표용 문의 관리자

### Milestone 4 — 블로그·출시

- [ ] Blog 공개 목록·상세
- [ ] Cloudflare Access 관리자
- [ ] Markdown 편집·발행
- [ ] SEO·접근성·모바일·보안 QA
- [ ] bldnex.com 실서비스 배포

## 22. 현재 확정 상태와 보류 상태

### 확정

- 회사명: 빌드넥스 / BLDNEX
- 슬로건: `BUILD WHAT'S NEXT`
- 회사 사이트: `https://bldnex.com`
- PreviewLog: `https://previewlog.bldnex.com`
- 대표 이메일: `BLDNEX.DEV@GMAIL.COM`
- 사업자등록번호: `374-02-03692`
- 공개 사이트 기술 방향: Astro + TypeScript + 선택적 React
- 인프라 방향: Cloudflare Pages / Workers / D1 / R2

### 보류

- 로고 파일 및 실제 브랜드 컬러
- 대표자명·사업장 주소·개인정보 보호책임자
- PreviewLog와 SHUFFO 외 추가 포트폴리오 상세
- 대표 이메일의 발송 서비스(Resend 등)
- 블로그 1차 게시글과 공개 시점
- 문의 데이터 보존 기간

## 23. 구현 시작 프롬프트 v0.2

```text
BLDNEX 공식 웹사이트를 Astro + TypeScript로 구현한다.

중요한 기술 결정:
- 공개 사이트는 Astro를 사용한다.
- 정적 콘텐츠와 SEO는 Astro가 담당한다.
- React는 모바일 메뉴, 문의 폼, 필터, 관리자처럼 상태가 필요한 영역에만 사용한다.
- 공개 사이트 전체를 Vite + React SPA로 만들지 않는다.
- Cloudflare Pages에 정적 배포하고, API는 별도 Cloudflare Workers로 둔다.

브랜드:
- 회사명: 빌드넥스 / BLDNEX
- 슬로건: BUILD WHAT'S NEXT
- 메시지: 빠른 실행, 높은 완성도, 기획부터 개발까지
- 다크톤, 전문적이고 조용한 자신감
- AI 생성물처럼 보이는 무작위 그라디언트·3D·글리치 금지
- 영문 headline + 자연스러운 한글 설명

페이지:
- /, /about, /services, /works, /works/previewlog, /works/shuffo
- /blog, /blog/[slug], /contact, /privacy
- Footer에 PreviewLog·Shuffo·Privacy Policy 링크

자료 기준:
- PreviewLog는 /Users/sangkim/Desktop/BLDNEX/previewlog-landing/deploy/index.html을 기준으로 한다.
- SHUFFO 자료는 public/assets/shuffo/의 App Store 공식 이미지와 README를 사용한다.
- 자료가 없는 고객 포트폴리오는 내용을 만들지 않고 draft/placeholder로 둔다.

완료 조건:
- 공개 라우트와 모바일 레이아웃 완성
- 문의 폼의 클라이언트·서버 검증
- D1 저장·R2 업로드·이메일 알림
- Cloudflare Access 관리자
- SEO·접근성·reduced-motion·보안 검증
- pnpm build, typecheck, lint, 링크 검사 통과
```
