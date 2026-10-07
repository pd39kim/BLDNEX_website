# 결정 기록

## 2026-10-02 — BLDNEX 콘텐츠의 단일 원문

상세한 브랜드 카피와 사이트 섹션 설계는 [`docs/BLDNEX_WEBSITE_PLAN.md`](../BLDNEX_WEBSITE_PLAN.md)를 원문으로 둡니다. Wiki Memory에는 요약과 링크만 기록해 내용이 분기되지 않게 합니다.

## 2026-10-02 — 위키메모리 프로토타입 제거

위키메모리 프로토타입은 BLDNEX 웹사이트 프로젝트의 본체가 아니므로 루트의 `index.html`, `app.js`, `styles.css`를 제거했습니다. 이 저장소는 BLDNEX 공식 웹사이트 구현에 집중합니다.

## 2026-10-03 — Astro 정적 사이트 기반

공개 사이트는 Astro + TypeScript로 구성하고, 현재 공개 페이지는 정적 생성합니다. 공통 레이아웃·SEO 기본값은 `BaseLayout.astro`에서 관리합니다.

## 2026-10-03 — 공식 브랜드 에셋 사용

심볼과 워드마크는 `/Users/macsk/Projects/BLDNEX/BI_CI/BLDNEX-vector-assets-2/`의 공식 SVG를 `public/assets/brand/`에 복사해 사용합니다. 회사명은 일반 텍스트로 대체하지 않습니다. 다크 배경에서 워드마크가 보이도록 표시 단계에서 흰색으로 처리합니다.

## 2026-10-03 — 헤드라인 타이포그래피

영문 헤드라인은 `Inter Tight`, 굵기 `300`, 자간 `0.025em`을 사용합니다. 한글 헤드라인은 `Pretendard`, 굵기 `600`, 자간 `-0.045em`을 사용하며 `ko-heading` 클래스로 지정합니다.

## 2026-10-05 — 콘텐츠 업데이트 실행

사용자의 “업데이트 진행” 지시로 [업데이트 계획](../BLDNEX_CONTENT_UPDATE_PLAN_2026-10-03.md)과 [원고](../BLDNEX_WEBSITE_COPY_DRAFT_2026-10-03.md)의 일반 콘텐츠를 적용했습니다. 홈은 Hero → Works → Services → Process → Studio → FAQ → CTA 순서입니다. 서비스·산출물·운영 안내는 프로젝트별 협의 범위로 표현하고 고정 가격·납기·무료 유지보수를 약속하지 않습니다.

## 2026-10-05 — 브랜드 세부 설정 유지

헤더 심볼 높이 36px, 워드마크 높이 20px, 간격 6px. 푸터는 높이 25.2px / 14px로 기존 70% 축소 비율을 유지합니다. 공식 SVG의 종횡비, 흰색 워드마크, 기존 #35a9ff 포인트 컬러와 영문/한글 글꼴 설정은 변경하지 않습니다.

## 2026-10-05 — 문의와 공개 범위

현재 Contact는 작동하는 이메일 링크·주소 복사·준비 정보·FAQ로 완성합니다. 서버 저장 폼·첨부·자동 알림·관리자는 별도 운영 준비 후 구현합니다. 개인정보 운영값은 지어내지 않습니다. Privacy는 준비 안내와 noindex를 유지하며 이메일 문의 처리도 방침 검토 대상입니다. 이번 작업은 로컬 구현이며 외부 배포가 아닙니다.

## 2026-10-05 — 제품 설명과 증거 구분

Shuffo는 보유 화면 3장과 [공식 App Store](https://apps.apple.com/kr/app/shuffo/id6814380886) 설명을 사용합니다(2026-10-05 재확인). PreviewLog는 로컬 소개 자료에 기반한 작업 흐름만 안내하며 실제 앱 캡처·출시 배지·가격·다운로드·대기자 폼은 노출하지 않습니다. 기능 설명 도식은 앱 화면이 아니라고 표시합니다. 자체 제품을 고객 외주 실적으로 소개하지 않습니다.

## 2026-10-05 — 호스팅은 Cloudflare Pages

공개 사이트는 Cloudflare Pages로 배포합니다. canonical·`og:url`·sitemap은 모두 슬래시 없는 주소로 통일했습니다.

**정정(2026-10-05 실제 배포로 확인):** 처음에는 Cloudflare Pages가 `/about/`을 `/about`으로 떼는 줄 알고 `build.format: 'directory'`를 유지했으나, 실제 배포해 보니 반대였습니다. 디렉터리 형식으로 올리면 `/about` 요청이 `/about/`으로 **308 리다이렉트**되어 모든 canonical이 리다이렉트를 가리켰습니다. `build.format: 'file'`로 바꿔 `/about.html`을 내보내니 `/about`이 리다이렉트 없이 200으로 응답하고, 슬래시가 붙은 주소가 308로 정규화됩니다. 호스트 동작은 추측하지 말고 배포해서 확인해야 합니다. 응답 헤더는 `public/_headers`에서 관리합니다. 해시 파일명을 쓰는 `/_astro/*`는 영구 캐시, 공유 이미지는 크롤러 재수집을 고려해 1일 캐시입니다.

개인정보처리방침의 호스팅 제공자 항목은 Cloudflare, Inc. (Cloudflare Pages)로 확정했습니다. 나머지 운영값은 여전히 미확인 상태입니다.

## 2026-10-05 — 팀 소개 표현 변경

"Small team. / Thoughtful products.", "대표 개발자 중심 / 협업 개발자", "개발자 배치" 표현을 모두 사용하지 않습니다. 앞의 둘은 인원 규모를 드러내고, "배치"는 개발 에이전시처럼 읽혀 BLDNEX의 강점을 가립니다.

인원 수, 전담 팀 보유, 경력 같은 근거 없는 주장은 추가하지 않습니다. 실제로 만들고 운영 중인 자체 제품만 근거로 씁니다. 2026-10-03 원고 문서는 작성 당시 기록이므로 수정하지 않고, 현재 기준은 이 결정과 `src/` 구현을 따릅니다.

## 2026-10-05 — 웹폰트 서브셋 셀프호스팅

Pretendard·Inter Tight·DM Sans를 CDN에서 통째로 받던 것을, 빌드 때 실제로 쓰인 글자만 추려 자체 호스팅하는 방식으로 바꿨습니다. 폰트 전송량 1,634 KB → 194 KB (94.1% 감소), 홈 1회 로드 약 1.59 MB → 약 152 KB, 서드파티 요청 3건 → 0건입니다.

계기는 "홈 11 KB · JS 0 KB" 같은 성능 수치를 사이트에 노출하자는 제안이었습니다. 검증해 보니 HTML만 11 KB일 뿐 실제 로드는 1.59 MB였고, 그중 98%가 Pretendard static 전체 폰트였습니다. 수치를 그대로 공개했다면 DevTools를 여는 순간 반박되는 주장이 됐을 것입니다. 수치 공개는 폰트를 고친 뒤에 합니다.

글리프 추출은 HTML 원문 전체를 훑습니다. 본문만 추출하면 `aria-label`과 인라인 스크립트 문자열의 글자(`홈`·`푸`·`못`)가 빠집니다. `check-site.mjs`가 매 빌드마다 글리프 누락, 폰트 스택 합집합 커버리지, 선언된 굵기의 파일 존재, 서드파티 폰트 호스트 부재를 검사해 조용히 깨지는 것을 막습니다.

원본 폰트와 OFL 라이선스 전문은 `assets/fonts-src/`에 커밋해 빌드가 네트워크에 의존하지 않게 했습니다. 상세 내용은 [웹폰트 문서](fonts.md)를 참고하세요.

## 2026-10-05 — 사이트가 스스로 증명하게 하는 장치 3가지

"개발사의 웹사이트"임을 문장으로 주장하는 대신 사이트가 직접 보여주도록 세 가지를 넣었습니다. 홈 히어로의 빌드 실측 스탬프, `/works`에 올린 bldnex.com 자신, 홈의 App Store 출시 배지입니다. 모두 이미 가진 사실을 드러내는 것이고 새 주장을 만들지 않습니다.

수치는 손으로 적지 않습니다. `scripts/measure-site.mjs`가 빌드된 dist를 실측해 토큰을 치환하고, 치환이 파일 크기를 바꾸므로 값이 변하지 않을 때까지 재측정을 반복합니다. 홈이 쓰지 않는 글꼴 굵기까지 더해 실제보다 크게 잡으므로(표시 265 KB, 브라우저 실측 237 KB) 확인하는 쪽에서 더 적게 나옵니다.

App Store 정보는 Apple 공개 lookup API에서 받아 `src/data/app-store.json`에 커밋합니다. 평점이나 다운로드 수처럼 맥락에 따라 달라지는 값은 가져오지 않습니다. 배지는 Apple 공식 한국어 배포본을 그대로 쓰고 임의로 그리지 않습니다.

상세 내용은 [증거 요소 문서](proof-points.md)를 참고하세요.

## 2026-10-05 — Cloudflare Pages 배포

Pages 프로젝트 `bldnex-website`를 만들고 프로덕션 브랜치를 `main`으로 두었습니다. 계정은 pd39kim@gmail.com, 배포 URL은 https://bldnex-website.pages.dev 입니다.

`wrangler 4.147`은 `pages project create`를 새 Workers 정적 자산 방식으로 위임하려다 실패하므로, 최초 1회만 `--force`로 기존 Pages에 직접 만들었습니다. 이후 명령에는 붙이지 않습니다. 커스텀 도메인 연결 명령은 wrangler에 없어 대시보드나 REST API를 써야 합니다.

`bldnex.com`의 네임서버는 이미 Cloudflare(thaddeus/norah.ns.cloudflare.com)라 DNS 이관은 필요 없습니다.

## 2026-10-05 — 도메인 연결과 www 처리

`bldnex.com`을 Pages 커스텀 도메인으로 연결하고 공개했습니다. 인증서는 자동 발급됐습니다.

`www`는 **Pages 커스텀 도메인으로 두지 않습니다.** 처음에 apex와 www를 모두 커스텀 도메인으로 추가했더니, www가 Pages에서 직접 응답해 Redirect Rule이 적용되지 않았습니다. www는 Proxied CNAME + Redirect Rule 조합으로 apex에 301 리다이렉트합니다. 경로와 쿼리스트링을 보존하며 리다이렉트는 1회입니다.

호스트 동작을 추측해서 설정한 뒤 배포로 뒤집힌 일이 두 번 있었습니다(`build.format`, www 처리). 앞으로 호스트 쪽 동작은 실제 배포해서 확인한 뒤 문서에 적습니다.

## 2026-10-05 — 직접 접수형 문의 기능 계획 요청

사용자가 이메일 앱 전달 방식이 아닌 “사이트에서 바로 접수”를 위한 계획 수립을 요청했습니다. [상세 계획](../BLDNEX_CONTACT_FORM_PLAN_2026-10-05.md)을 작성했으며 웹사이트 구현·외부 설정은 변경하지 않았습니다.

권장안은 기존 Cloudflare Pages 유지 + Pages Functions/D1/Turnstile/Resend/Access, 별도 예약 Worker의 알림 재시도·파기입니다. DB 저장 확인을 접수 완료 기준으로 두고 이메일 실패와 분리합니다. 이 구성·선택 필드·첨부 후속 적용은 구현 계획이며 서비스 가입/실제 배포까지 승인된 것으로 취급하지 않습니다.

## 2026-10-05 — 문의 기능 구현 승인 및 로컬 적용

사용자가 “그렇게 구현하자. 최대한 네가 초안을 작성하고 추가로 필요한 정보 있으면 물어봐”라고 지시했습니다. [구현·운영 연결 초안](../BLDNEX_CONTACT_IMPLEMENTATION_2026-10-05.md)에 따라 폼, D1 저장, Access JWT 관리자, 예약 Worker 알림/파기를 로컬 구현했습니다. 이전 “Contact는 이메일만” 기록은 공개본 당시 상태이며 현재 소스에는 정식 폼이 있습니다.

DB 저장 성공을 접수 기준으로 삼고 문의와 outbox를 트랜잭션으로 함께 저장합니다. 메일에는 원문·문의자 개인정보를 복사하지 않습니다. 회사/전화는 선택+별도 동의, 첨부/자동 고객 회신은 제외합니다. 입력이 불확실하게 전송됐으면 같은 키·같은 원문으로 확인합니다.

관리자 계정·Resend 사용·보관 기준(종료 후 365일, 미종결 최대 730일)은 사용자에게 질문했고 아직 답변 전입니다. 이 값들은 초안이며 임의로 확정하지 않습니다. 기존 책임자·주소 등은 유지합니다. 실제 접수는 `CONTACT_ENABLED=false`; 운영 키·정책 승인·D1·인증·예약 작업 기록이 없으면 서버도 접수하지 않습니다. 이번 구현 과정에서 가입·DNS 변경·원격 DB 생성·실제 메일 발송·배포는 하지 않았습니다.

## 2026-10-05 — 운영 제안 승인 및 Git 반영 지시

사용자가 “제안대로 진행 후 커밋, 푸시, 빌드”를 지시했습니다. 직전 질문 3개를 승인한 것으로 적용합니다: 관리자는 `BLDNEX.DEV@GMAIL.COM` 하나, Resend로 같은 Gmail에 알림, 종료 후 365일/미종결 접수 후 최대 730일 보관. 앞의 답변 대기 기록은 이 결정으로 갱신됩니다. 보관 값 자체는 기존 초안과 같고 접수를 공개한 적이 없어 동의 버전을 바꾸지 않았습니다.

기존 Cloudflare 계정에 운영/검수 D1을 분리 생성해 마이그레이션 2개를 적용하고, 환경별 Turnstile과 Pages 비밀 키를 등록했습니다. 공개 사이트·예약 Worker는 배포하지 않았고 `CONTACT_ENABLED=false`, `JOBS_ENABLED=false`를 유지합니다. Git 커밋/푸시와 빌드는 사이트 배포·실제 접수 활성화 또는 법적 검토 완료를 뜻하지 않습니다. Direct Upload 프로젝트여서 푸시만으로 자동 배포되지 않습니다.

Resend 연결 수단을 확인했고 발송 전용 API 키는 Worker에 등록했습니다. 발신 도메인 `notifications@notify.bldnex.com`은 설정 초안이며 DNS 인증 전에는 발송 가능하다고 주장하지 않습니다. 현재 Cloudflare 인증에 Access 설정 권한이 없어 관리자 도메인/audience를 임의로 만들지 않습니다. 실제 인증·Gmail 수신·공급자 처리와 개정 방침 검토 후에만 접수를 활성화합니다.

Resend 대시보드가 로그인된 상태에서 발송 전용 권한의 `bldnex-contact-jobs` API 키를 생성했고, 값은 노출하지 않은 채 운영·검수 Worker 비밀값 `RESEND_API_KEY`로 등록했습니다. Worker 코드 배포와 `notify.bldnex.com` 도메인 인증은 아직 하지 않았습니다. 발송 전용 키는 도메인 관리 API 조회에는 사용할 수 없으므로, 도메인/DNS 상태는 대시보드와 Cloudflare 권한이 확인된 뒤 검수합니다.

## 2026-10-05 — 문의 운영 연결 완료

운영 Pages 변수에 문의 활성화, 운영 정책 버전, Turnstile, Resend 발신·수신 주소, Cloudflare Access 도메인·audience를 반영했습니다. 운영 D1 `system_health.jobs` 기록을 확인한 뒤 `https://bldnex.com/api/contact/config`가 `enabled:true`를 반환하는 것을 검증했습니다. 실제 사용자 문의를 대신 제출하거나 Gmail 도착을 확인한 것은 아닙니다.

`notify.bldnex.com`의 Resend 발신 도메인과 DKIM/CNAME 레코드는 인증 완료 상태입니다. `bldnex-contact-jobs` Worker는 `JOBS_ENABLED=true`, 5분 cron, 운영 D1, Resend 시크릿으로 배포했습니다. 관리자 앱 `BLDNEX Contact Admin`은 `/admin/inquiries` 및 `/api/admin/*`를 보호하고 `BLDNEX.DEV@GMAIL.COM`, `pd39kim@gmail.com`을 허용합니다.

## 2026-10-06 — 사이트 전 페이지 카피 정돈 및 띄어쓰기 규범 통일

전 페이지 문구 검토를 거쳐 부자연스러운 문장 구조를 개선하고 맞춤법 및 띄어쓰기 규범을 통일했습니다.

1. **문맥 및 문장 구조 개선**:
   - 404 페이지: 두 문장에 걸쳐 반복되던 접속 표현("하지만 찾으시는 페이지가 없습니다 / 하지만 아래 링크에서...")을 해소하고 하나의 자연스러운 안내로 정리했습니다.
   - Services 페이지: 모바일 앱 서비스의 '이런 상황에 맞습니다' 목록이 명사형과 서술형으로 혼용되던 문제를 병렬형 종결 구조로 정돈했습니다.
   - Contact 폼: 선택정보 동의 에러 문구(`shared/contact.ts`)가 코드 조건식(`if (company || phone) && !optionalConsent`)을 그대로 노출하던 방식에서, 사용자가 선택할 수 있는 행동을 친절하게 제시하는 문구("선택 항목(회사·연락처)을 입력하신 경우 동의가 필요합니다. 동의하지 않으시려면 입력을 비워 주세요.")로 개선했습니다.
2. **보조용언 띄어쓰기 통일**:
   - 한글 맞춤법 제47항의 띄어쓰기 원칙(`-해 보다`, `-해 주다`)에 맞춰 사이트 전반의 보조용언을 일관되게 띄어 썼습니다 (`정리해 보세요`, `문의해 주세요`, `확인해 주세요`, `연락해 주세요`).

## 2026-10-06 — 문의 폼 실시간 에러 해제(Live Error Clearing) UX 적용

문의 폼에서 유효성 검사 오류(예: 프로젝트 내용 20자 미만)가 발생한 뒤, 사용자가 입력창을 수정해 기준을 충족해도 재제출 전까지 하단 경고와 `aria-invalid`가 사라지지 않던 문제를 해결했습니다.

- **원칙 (Reward Early, Punish Late)**: 오류 검증은 제출 시점에만 표시하되, 이미 표시된 오류는 사용자가 올바른 값을 입력(`input`, `change`)하는 즉시 실시간으로 해제합니다.
- `src/scripts/contact.ts`의 `clearResolvedErrors` 함수를 통해 필드별 유효성 조건을 검사하고, 오류 조건이 해소되면 에러 메시지 텍스트 제거 및 `aria-invalid="false"`로 복구하도록 이벤트 리스너를 연동했습니다.
- Playwright 브라우저 테스트(`tests/contact.browser.spec.mjs`)에 20자 미만 에러 표시 후 20자 도달 시 즉시 에러가 사라지는 시나리오를 추가했습니다 (총 13개 브라우저 테스트 통과).

## 2026-10-06 — AI 에이전트 위키 메모리(Wiki Memory) 연동 규칙 수립

세션 단절이나 컨텍스트 압축 이후에도 저장소의 핵심 설계 제약과 결정 사항이 일관되게 보존되도록 루트에 [`AGENTS.md`](../../AGENTS.md)를 정의했습니다.

- 작업 시작 전 `docs/wiki/`의 문서(맥락, 결정, 아키텍처, 폰트, 실측 증거)를 필독하고, 작업 완료 후 즉시 변경 사항을 위키에 동기화하는 것을 필수 의무로 규정했습니다.
- 가짜 지표나 허위 성과 날조 금지, 공식 SVG 워드마크 및 타이포그래피 준수, `build.format: 'file'` 유지, 배포 전 `pnpm test` 및 `pnpm test:browser` 자동 검증 무결성을 에이전트 운영 규범으로 명문화했습니다.

## 2026-10-06 — PreviewLog 공식 사이트 배포 및 bldnex.com 연동

`previewlog-landing`의 신규 랜딩페이지(다크 NLE 목업, 14일 무료 체험 스펙, 법적 정책 문서 완비)를 Cloudflare Pages(`previewlog-landing.pages.dev`)에 배포하고, `previewlog.bldnex.com`을 서빙하는 Cloudflare Worker(`previewlog-license-server`)에서 정적 라우트를 투명 역방향 프록시하도록 구성했습니다.

1. **아키텍처 및 도메인 연동**:
   - `previewlog.bldnex.com`은 데스크톱 앱의 인증/라이선스 D1 DB, R2 릴리스 업데이트, Paddle 웹훅을 처리하는 기존 Worker를 유지하면서, 웹 요청(`/`, `/privacy`, `/terms`, `/refund`, `/styles.css` 등)을 Pages로 프록시하여 데스크톱 API 기능과 웹 브라우징을 완전 공존시켰습니다.
   - 루트 도메인(`bldnex.com`)의 HSTS `includeSubDomains` 제약에 부합하도록 서브도메인 HTTPS SSL 연결을 검증했습니다.
2. **bldnex.com 제품 페이지(`works/previewlog`) 연동**:
   - `src/pages/works/[slug].astro`에서 PreviewLog 공식 웹사이트 연결 버튼(`PreviewLog 웹사이트 보기 ↗`)을 활성화했습니다.
   - Schema.org `productSchema`에 `operatingSystem: 'macOS'`, `installUrl`, `sameAs`를 정식 반영했습니다.
   - `scripts/check-site.mjs`의 미검증 링크 차단 단언문을 갱신하여 정적 가드레일 테스트를 통과시켰습니다.

## 2026-10-06 — PreviewLog 프록시 캐시(304 Not Modified) 및 대기자 폼 2단 레이아웃 개선

1. **프록시 캐시(304 Not Modified) 처리**:
   - 새로고침 시 브라우저가 전송하는 `If-None-Match` 조건부 요청에 대해 업스트림 Pages가 `304 Not Modified`를 응답할 때, `proxyRes.ok`(200~299만 true) 검사로 인해 304가 404로 탈락되어 스타일시트(`styles.css`)가 깨지던 문제를 `proxyRes.status < 400` 조건으로 수정해 완전 해소했습니다.
2. **다운로드 대기자 등록 카드 레이아웃 정돈**:
   - `.download-card` 내부를 좌측 안내 정보(`.download-info`)와 우측 독립 카드 형태의 대기자 등록창(`.waitlist-card`)으로 분리하고, `minmax(0, 1.15fr) minmax(360px, 440px)` 2단 그리드로 재정의하여 브라우저 폭 변화에도 우측 카드 레이아웃이 흩어지지 않도록 고정했습니다.

## 2026-10-06 — 문의 접수 알림 실서비스 E2E 수신 검증 완료 및 개인정보 방침 문구 현실화

운영 중인 `bldnex.com/contact`의 실제 파이프라인(입력 → Turnstile → Pages Functions → D1 트랜잭션 → 예약 Worker cron → Resend → Gmail 수신)이 완전하게 작동함을 실측 검증했습니다.

1. **실제 수신 확인**:
   - 접수 건 `#BN-3c66d6f8-ed53-475a-805a-8abbfd1c3279`에 대해 Resend 트랜잭션 ID `01a10c5d-87ae-7f01-9a0d-c31cb24b8919`로 발송된 알림 메일이 관리자 계정(`BLDNEX.DEV@GMAIL.COM`)에 정상 도착했음을 사용자가 확인했습니다.
   - 메일 본문에 문의자 개인정보(이름·이메일·연락처·내용)가 노출되지 않고, 오직 접수번호·유형·시각 및 Cloudflare Access로 보호되는 관리자 상세 링크(`/admin/inquiries?id=...`)만 포함되는 보안 규칙을 확인했습니다.
2. **개인정보처리방침 안내 문구 현실화**:
   - 온라인 접수가 이미 실서비스로 활성화되어 검증까지 완료되었으므로, `src/pages/privacy.astro` 및 `src/data/privacy.ts`에 남아 있던 "접수를 활성화하지 않습니다/비활성 상태로 유지합니다"라는 과거 대기 문구를 "온라인 접수가 활성화되어 운영 중이며, 외부 공급자 세부 사항 검토를 병행하고 있습니다"로 실제 운영 사실에 맞게 정돈했습니다.
   - 단, 외부 공급자 정식 계약 및 법률 검토 완료 전까지 보호용 가드레일(`noindex, follow` 및 사이트맵 제외)은 유지합니다.

## 2026-10-06 — 관리자 화면(Admin) 상태 변경 피드백 및 상세 패널 인터랙션 개선

관리자 화면(`/admin/inquiries`)의 상태 변경 확인 불가 문제와 우측 상세 패널 고정 노출에 따른 불편을 개선했습니다.

1. **상태 표시 및 저장 피드백 보강**:
   - 목록 카드와 상세 헤더에 4개 상태별 전용 컬러 배지(`status-badge`: `new` 파랑, `reviewing` 노랑, `contacted` 녹색, `closed` 회색)를 도입해 한눈에 상태 구분이 가능하게 했습니다.
   - 상태 변경 저장 시, "상태 저장" 버튼 바로 옆에 `✓ 상태가 '[상태]'(으)로 저장되었습니다.`라는 즉각적인 피드백(`status-save-feedback`)을 플래시 애니메이션과 함께 노출하도록 수정했습니다.
2. **우측 상세 패널 인터랙션 및 반응형 정돈**:
   - 선택된 문의가 없을 때는 우측에 깔끔한 안내 플레이스홀더(`detail-placeholder`)를 표시해 2열 그리드 균형을 유지합니다.
   - 상세 패널 우측 상단에 `&times; 닫기` 버튼을 추가하여, 조회를 마친 후 언제든 상세를 닫고 URL 파라미터를 정리(`location.pathname`)할 수 있게 했습니다.
   - 화면 폭 850px 이하(모바일/태블릿)에서는 상세 열림 시 상세 영역으로 부드럽게 스크롤되고, 닫기 클릭 시 다시 목록 상단으로 복귀하도록 반응형 사용성을 개선했습니다.
3. **관리자 수신 알림 용어 직관화**:
   - `발송 서비스 승인 (수신 확인 아님)` 등 모호한 내부 기술 문구를 `관리자 알림: 관리자 메일 발송 완료`로 변경하여, 고객 자동 회신이 아닌 "관리자 전용 수신 알림"임을 운영자가 명확히 인지할 수 있게 했습니다. 버튼 역시 `관리자 알림 재발송`으로 변경했습니다.

## 2026-10-06 — 방문 분석은 비컨 없이

Cloudflare Web Analytics 를 끄고, 방문 통계는 zone Analytics(엣지 집계)로 봅니다.

공개 직후 비컨이 전 페이지에 엣지 주입되어, 홈 스탬프와 제품 상세의 "외부 요청 0건", 개인정보처리방침의 "방문 분석 도구는 사용하지 않습니다"가 모두 사실과 달랐습니다. 사이트 전체가 외부 요청 0건을 근거로 설득하는 구조이므로 문구를 고치기보다 비컨을 끄는 쪽을 택했습니다. 호스팅 접속 로그는 이미 방침에 적혀 있어 추가 고지가 필요 없습니다.

포기하는 것은 Core Web Vitals 와 화면 해상도이며, 성능 지표는 Search Console 의 CrUX 로 대체합니다.

이 종류의 불일치는 빌드 검사로 잡히지 않습니다(엣지 주입이라 dist 에 없음). `scripts/verify-live.mjs` 가 배포본을 브라우저처럼 받아 공개 수치·방침 문구와 대조합니다. 배포 후에는 `pnpm verify:live` 를 돌립니다.

## 2026-10-06 — Email Address Obfuscation 끄기

Cloudflare Scrape Shield 의 Email Address Obfuscation 을 껐습니다.

켜져 있는 동안 `/contact` 의 `mailto:` 링크 3개가 모두 `/cdn-cgi/l/email-protection` 으로 바뀌고 화면의 이메일 2곳이 `[email protected]` 으로 가려졌습니다. JS 가 꺼진 방문자는 주소를 볼 수도, 링크를 누를 수도 없었습니다. 문의 폼은 Turnstile 때문에 JS 가 필요하므로 이메일이 유일한 대안인데 그마저 막힌 상태였습니다.

보호 효과도 약했습니다. 같은 페이지의 JSON-LD `email` 과 복사 버튼 `data-email` 에는 평문이 그대로 남아 있었고, 인코딩은 첫 바이트 XOR 이라 쉽게 복원됩니다.

같은 종류의 엣지 주입(Web Analytics, Rocket Loader 포함)을 `scripts/verify-live.mjs` 가 탐지합니다. `/cdn-cgi/` 는 같은 출처라 외부 출처 검사에 걸리지 않으므로 별도로 봅니다.

## 2026-10-06 — 상단 네비게이션 스티키(Sticky Header) 고정 적용

스크롤 시에도 주 네비게이션과 문의 CTA에 즉시 접근할 수 있도록 헤더를 뷰포트 상단에 고정(`position: sticky; top: 0;`)했습니다.

1. **시각적 완성도 및 심미성 유지**:
   - 투명도(`rgba(10, 11, 13, 0.88)`)와 배경 블러 필터(`backdrop-filter: blur(14px)`)를 적용하여, 스크롤되는 하단 콘텐츠와 자연스럽게 어우러지면서도 텍스트 가독성을 온전하게 유지합니다.
   - 뷰포트 전체 너비에 걸친 1px 하단 경계선(`border-bottom: 1px solid var(--line)`)을 `.header-shell`에 부여하고 내부 `.site-header`의 중복 경계선을 제거해 이중선이 생기지 않도록 정돈했습니다.
2. **레이어 및 레이아웃 안정성**:
   - `z-index: 50`으로 본문 및 카드 요소 위에 안전하게 배치하고, 접근성 건너뛰기 링크(`.skip-link`, `z-index: 100`) 아래에 두어 키보드 네비게이션 순서를 보존했습니다.
   - 기존 `html`에 정의된 `scroll-padding-top: 112px`가 고정 헤더 높이(데스크톱 88px, 모바일 80px)를 충분히 상쇄하므로 앵커 점프 시 헤더 뒤로 제목이 가려지지 않습니다.
   - 모바일 드롭다운 메뉴(`.mobile-nav`)는 헤더 바로 밑에 붙되, 화면 높이가 작은 기기에서도 스크롤이 가능하도록 `max-height: calc(100dvh - 100%); overflow-y: auto;`를 적용했습니다.

## 2026-10-07 — 가독성 기준 기반 최소 폰트 사이즈(14px) 토큰화 및 상향 적용

사람이 '읽어야 하는' 의미 있는 텍스트는 최소 14px(`0.88rem`, 브라우저 기본 16px 기준) 이상을 보장하고, 14px 미만은 읽지 않아도 사이트 이용과 맥락 이해에 지장이 없는 순수 메타/장식/인덱스에만 제한하도록 타이포그래피 체계를 재정의했습니다.

1. **디자인 토큰 도입 (`src/styles/global.css`)**:
   - `--text-meta: 0.65rem;` (~10.4px): 순번 인덱스, 장식 라벨
   - `--text-eyebrow: 0.70rem;` (11.2px): 영문 카테고리 태그
   - `--text-badge: 0.75rem;` (12px): 상태 뱃지, 도식 각주
   - `--text-readable-min: 0.88rem;` (14.08px): **사람이 읽어야 하는 최소 가독 기준선 (≥ 14px)**
   - `--text-sub: 0.94rem;` (15px): 보조 본문, FAQ 답변, 설명문
   - `--text-base: 1rem;` (16px): 기본 본문 표준
2. **필독 텍스트 상향 적용**:
   - 헤더 최우선 전환 버튼(`.header-cta`: 12.5px → 14px)
   - 문의 폼 핵심 요소(`.form-field label`, `::placeholder`, `.field-caption`, `.field-error`, `.consent-summary`, `.consent-label`, `.receipt-label`: 11.7~13.6px → 14px)
   - 본문 및 설명문(`.metric-grid .body-copy`, `.store-copy .body-copy`, `.section-tail`, `.tag-list li`, `.screenshot-grid figcaption`, `.contact-help`, `.copy-status`: 11.7~13.6px → 14px~15px)
   - 내비게이션 및 방침(`.anchor-nav a`, `.privacy-toc a`, `.privacy-table thead th`, `.site-footer`, `.footer-links a`: 11.5~13.6px → 14px)
3. **가독성 및 회귀 검증**:
   - 모바일 360px부터 데스크톱 1440px까지 뷰포트 오버플로우 및 요소 깨짐 없이 안정적으로 표시됨을 단위 및 브라우저 E2E 테스트(`pnpm test`, `pnpm test:browser`)로 검증 완료.

## 2026-10-07 — 태그리스트 시인성 개선 및 잔여 텍스트 14px 전면 상향

1. **태그리스트(`.tag-list li`) 칩 디자인 및 대비 강화**:
   - 다크 배경에서 텍스트와 테두리가 묻히던 문제를 해결하기 위해, 글자색을 고대비 본문색(`var(--text)`), 배경색을 한 단계 밝은 레이어(`var(--raised)`), 테두리를 가시적인 회색(`1px solid #3d444e`), 굵기를 `500(Medium)`, 라운딩을 `4px`로 설정하여 명확한 칩/뱃지 형태로 시인성을 극대화했습니다.
2. **사람이 읽는 잔여 텍스트(산출물, 푸터, 도식, 각주) 14px 전면 상향**:
   - 홈 프로세스 카드 산출물 안내(`.step-output` 및 `.step-output span`): 10.6~11.2px → **14.08px (`var(--text-readable-min)`)**
   - 푸터 슬로건(`.footer-tagline`), 소제목(`.footer-label`), 하단 저작권(`.footer-bottom`): 9.6~10.9px → **14.08px**
   - 제품 카드 작업 흐름 도식(`.cover-flow`): 12.8px → **14.08px**
   - 제품 상세 각주 고지문(`.figure-note`): 12px → **14.08px**
   - 문의 폼 섹션 라벨(`.form-section-label`): 12px → **14.08px**
   - 관리자 상태 뱃지(`.status-badge`): 12px → **14.08px**

## 2026-10-07 — 마이크로 타이포그래피(순번 인덱스·라벨) 0.70rem(11.2px) 단일 토큰 표준화

14px 미만 보조 요소(순번 인덱스, 카테고리 아이브로우, 메타 라벨)에 산재해 있던 파편화된 수치 체계를 단일 토큰으로 통합 표준화했습니다.

1. **파편화 제거 및 토큰 단일화**:
   - 기존에 0.60rem(9.6px)부터 0.72rem(11.5px)까지 6가지로 나뉘어 있던 마이크로 폰트 크기를 폐기하고, 단일 디자인 토큰 `--text-micro: 0.70rem;` (11.2px)으로 통합했습니다 (`src/styles/global.css`).
2. **표준화 적용 범위**:
   - **순번 및 인덱스 (Category 1)**: `.step-number` (0.72rem → 0.70rem), `.faq-number` (0.65rem → 0.70rem), 모바일 메뉴 인덱스(`.mobile-nav > a > span:first-child`: 0.65rem → 0.70rem).
   - **아이브로우 및 메타 라벨 (Category 2)**: `.eyebrow` (0.70rem 표준 유지), `.hero-footnote` (0.68rem → 0.70rem), 카드 비주얼 라벨/각주(`.visual-label`, `.visual-footnote`: 0.60rem → 0.70rem), 실측 스탬프 라벨/용어(`.build-stamp-label`, `.build-stamp dt`: 0.60~0.68rem → 0.70rem), 제품 메타 라벨(`.product-meta > div > span`: 0.62rem → 0.70rem), 연관 제품/흐름 라벨(`.related-product .eyebrow`, `.product-flow .eyebrow`: 0.60~0.62rem → 0.70rem), 관리자 영수증 번호(`#detail-receipt`: 0.65rem → 0.70rem).
3. **모바일 축소 오버라이드 제거**:
   - 모바일 미디어 쿼리(`@media (max-width: 600px)`)에서 `.eyebrow`와 `.hero-footnote`를 0.60~0.62rem(9.6~9.9px)으로 강제 축소하던 코드를 제거했습니다. 작은 모바일 화면에서도 최소 11.2px을 유지하여 폰트 뭉개짐과 시각적 파편화를 방지했습니다.
4. **품질 검증**:
   - Astro 정적 빌드, 웹폰트 서브셋 무결성, 실측 스탬프 자동 측정, Playwright 브라우저 E2E(360/390/768/1440px 뷰포트 오버플로우 검사 포함) 전체 통과.

## 2026-10-07 — 네비게이션 Contact 제거 및 선택 메뉴 활성 상태(Active State) 시각적 차별화

네비게이션 바에서 중복되던 Contact 링크를 정리하고, 현재 머무르고 있는 메뉴가 시각적으로 분명하게 드러나도록 활성 상태 렌더링 및 스타일을 개편했습니다.

1. **헤더 네비게이션 Contact 제거**:
   - 헤더에 이미 눈에 띄는 "프로젝트 문의 ↗" 버튼(`.header-cta`)이 항상 우측에 배치되어 있으므로, 텍스트 메뉴의 'Contact'는 중복을 피하기 위해 제거했습니다 (`src/data/site.ts`의 `navigation`을 About, Services, Works 3개로 정리).
   - 단, 푸터의 사이트맵 탐색 편의와 404 페이지를 위해 `EXPLORE` 영역의 Contact 링크는 명시적으로 유지했습니다 (`Footer.astro`, `404.astro`).
2. **정적 빌드 경로 정규화 버그 수정 (`Header.astro`)**:
   - `build.format: 'file'` 환경에서 `Astro.url.pathname`이 `/about.html`처럼 확장자를 포함하여, 기존 메뉴 활성 판단(`pathname === item.href`)이 항상 false가 되어 어떤 메뉴도 선택 상태로 표시되지 않던 결함을 수정했습니다 (`replace(/index\.html$/, '').replace(/\.html$/, '').replace(/\/$/, '')` 적용).
3. **선택한 메뉴(Active Menu)의 시각적 차별화**:
   - **데스크톱 주 메뉴(`.desktop-nav a[aria-current]`)**: 선택된 메뉴 텍스트를 브랜드 포인트 컬러인 `var(--accent)` (#35a9ff)와 `font-weight: 600`으로 강조하고, 하단에 2px의 블루 인디케이터 바(`::after`)를 표시해 현재 페이지를 즉각 인지할 수 있도록 했습니다.
   - **프로젝트 문의 버튼(`.header-cta[aria-current]`)**: `/contact` 페이지 진입 시, 아웃라인 버튼이 채워진 솔리드 블루 배경(`background: var(--accent); color: var(--bg); font-weight: 600`)으로 반전되어 선택 상태를 명확히 알립니다.
   - **모바일 드롭다운 메뉴(`.mobile-nav > a[aria-current]`)**: 선택된 항목의 텍스트와 번호 인덱스(`01/02/03`)가 모두 `var(--accent)`로 밝게 표시되고 볼드 처리됩니다.
4. **검증**:
   - Astro 정적 빌드 HTML 실측 검사(페이지별 `aria-current="page"` 정상 주입 확인) 및 Playwright E2E 브라우저 회귀 테스트 통과.

## 2026-10-07 — 홈·서브 페이지 콘텐츠 중복 해소 및 역할 분리 (feat/page-differentiation)

홈과 서브 페이지(About, Works, Services) 간의 심한 내용·디자인 유사성과 기시감을 해소하기 위해, 홈은 쇼케이스(Teaser)로 경량화하고 서브 페이지는 고유한 심화 정보(Deep Dive)를 제공하도록 역할을 명확히 분리했습니다.

1. **홈 Selected Works 선별 축소 및 /works 차별화**:
   - 홈에는 자체 개발 소프트웨어 제품 2종(`PreviewLog`, `Shuffo`)만 선별하여 좌우 2열 카드로 균형감 있게 배치했습니다.
   - `bldnex.com` 카드는 히어로의 실측 스탬프에서 바로 연결되므로 홈 카드 중복을 없앴으며, `/works` 페이지로 이동했을 때 비로소 전체 제품 아카이브 3종을 확인할 수 있도록 역할을 분리했습니다.
2. **자체 제품 운영 철학 About 집중 및 홈 Studio 경량화**:
   - 홈의 Studio 섹션은 핵심 메시지(“직접 만들고 운영하며 축적한 실전 기준”)와 한 줄 요약으로 가볍게 압축하고 About 링크로 유도했습니다.
   - PreviewLog와 Shuffo의 구체적인 개발·운영 비하인드는 About 페이지에 집중시켜, About을 방문할 명확한 이유를 부여했습니다.
3. **프로세스 홈 요약 vs About 협업 운영 기준 분리**:
   - 홈의 Process는 4단계의 핵심 맥락(`Understand → Shape → Build → Ship`)만 간결하게 보여주고, 산출물 박스 반복을 제거해 스캔 속도를 높였습니다.
   - About의 Working Together 섹션에는 실제 외주 의뢰 시 신뢰를 주는 4가지 실무 협업 기준(`collaborationStandards`: 시작 기준 합의, 작동 화면 기반 검토, 투명한 변경 관리, 출시 후 인수 운영 준비)을 신설하여 실질적 콘텐츠 가치를 제공했습니다.
4. **페이지별 하단 CallToAction 문구 맥락 맞춤화**:
   - 모든 페이지에 동일하게 복제되어 있던 하단 CTA 카피를 각 페이지의 주제와 맥락에 맞게 차별화했습니다 (홈: 제품 시작 정리, About: 일하는 방식 공감 및 협업 제안, Services: 서비스 범위 및 준비 상태 문의, Works: 제품 파트너십 문의).

## 2026-10-07 — 홈 App Store 콜아웃 헤드라인 정돈 (작위적 대조법 해소)

홈의 Shuffo App Store 콜아웃 헤드라인에서 AI 특유의 작위적 부정-긍정 대조법과 어색한 수사("만들어 본 것이 아니라, 출시해 운영 중입니다.")를 폐기하고, 담백하면서도 개발·배포 완결성을 신뢰감 있게 전달하는 문구로 정돈했습니다.

- **변경 전**: `만들어 본 것이 아니라, 출시해 운영 중입니다.` (불필요한 가상 반론 대조 및 캐주얼 게임에 어울리지 않는 '운영' 표현)
- **변경 후**: `기획부터 스토어 심사 통과까지, 실제 제품으로 완성했습니다.` (Apple 심사 통과 및 정식 스토어 론칭 실체 증명)
- 관련 문서(`docs/wiki/proof-points.md`)의 설명도 작위적 대조 표현을 걷어내고 실물 배포 증명 맥락으로 일치시켰습니다.

## 2026-10-07 — 사이트 전반 AI 문체 패턴 정밀 진단 및 실무 빌더 보이스로 전면 개선

사이트 전반의 카피를 정밀 분석하여 AI 작성 특유의 결함(작위적 Not A but B 대조법, 기계적 3단 병렬 대구, '지금 필요한 것과 나중에 해도 되는 것' 등의 앵무새식 복붙 표현, 번역투 쉼표 남발, 공허한 추상 동사)을 걷어내고, 숙련된 프로덕트 빌더의 담백하고 전문적인 보이스로 전면 개선했습니다.

1. **메인 홈 (`index.astro`)**:
   - 히어로: 타깃 나열 및 상투적 종결을 걷어내고, 제품 개발 전 과정을 직접 완성한다는 명확한 역량 서술로 개선.
   - Services/Process/Studio: 기계적 댓구(`~할 A, ~할 B, ~할 C`)와 '막연한 아이디어' 등 고객 평가절하 표현 제거, 앵무새식 중복 어구 정돈.
2. **소개 (`about.astro`)**:
   - 히어로 및 본문: 에세이풍의 감상적 수사("화면 하나와 기능 하나가...")와 부정-긍정 대조법을 제거하고, 자체 서비스 런칭에서 축적한 실전 기준 서술로 차별화.
3. **서비스 (`services.astro` & `services.ts`)**:
   - 헤어로: 클라이언트의 구상을 부정하는 대립 구도("만들고 싶은 것과 실제로 필요한 것을 연결합니다")를 지양하고 목적 지향적 완성도 표현으로 개선.
   - 모바일 앱: 감상적 수사("손안에서 이어지는 흐름") 대신 불필요한 터치를 줄인 직관적인 네이티브 경험 중심으로 정돈.
4. **작업물 (`bldnex-website.astro`, `[slug].astro`)**:
   - bldnex.com: 훈계조 문장 및 반말성 의문문 CTA를 정중하고 신뢰감 있는 문장으로 개선.
   - Shuffo App Store 섹션: 방어적인 수사("실제로 플레이할 수 있는 결과물")를 자연스러운 초대형 문구로 전환.
5. **FAQ (`faq.ts`) & 메타데이터 (`site.ts`, `generate-og.mjs`)**:
   - 진행 상황 확인 답변을 동작하는 프리뷰 화면 공유 기반으로 명확화하고, 페이지별 메타 설명 및 OG 이미지 카피를 개선 내용에 맞춰 완전 동기화.

## 2026-10-07 — About 페이지 WORKING TOGETHER와 OUR PRINCIPLES 중복 해소 및 WORKING STANDARDS 통합

About 페이지에서 사실상 동일한 내용(핵심 우선순위 정의, 동작 화면 검증, 출시 후 운영 대비)을 위아래로 반복하던 `OUR PRINCIPLES` 3개 카드를 완전히 삭제하고, 구체적 실전 협업 4원칙을 담은 `WORKING STANDARDS` 섹션으로 단일 통합했습니다.

1. **중복 섹션 제거 및 통합**:
   - `OUR PRINCIPLES` (MOVE FAST, MAKE IT SOLID, FROM IDEA TO LAUNCH)를 폐기하고, 실무 규칙(Rule)이 명시된 4대 카드(`collaborationStandards`)를 회사의 일하는 기준이자 협업 원칙으로 일원화했습니다.
2. **섹션 네이밍 및 앵커 변경**:
   - Eyebrow: `WORKING STANDARDS` (일하는 기준과 협업 원칙)
   - Headline: `['만드는 과정에서도,', '협업의 기준은 분명하게.']`
   - Description: `자체 제품을 만들고 운영하며 검증한 기준을 고객의 프로젝트에도 그대로 적용합니다. 기획부터 배포, 인수인계까지 신뢰를 만드는 4가지 실무 원칙입니다.`
   - HTML Anchor: `#working-together` → `#working-standards`로 변경하고, 이를 참조하는 홈(`/about#working-standards`) 및 Services(`/about#working-standards`)의 링크와 라벨을 일치시켰습니다.



