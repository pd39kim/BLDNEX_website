# 로드맵

최종 갱신: 2026-10-05

## 최신 상태

사용자의 “업데이트 진행” 지시에 따라 2026-10-03 콘텐츠 업데이트 제안과 원고를 웹사이트에 적용했습니다. 일반 콘텐츠와 로컬 UI 구현에 대한 진행 지시이며, 미제공 개인정보 운영값·제품 배포 상태까지 승인·확인된 것으로 간주하지 않습니다. 외부 배포는 하지 않았습니다.

- [업데이트·검증 결과](../BLDNEX_UPDATE_REPORT_2026-10-05.md)
- [콘텐츠 업데이트 계획](../BLDNEX_CONTENT_UPDATE_PLAN_2026-10-03.md)
- [카피 원고와 별도 검수 항목](../BLDNEX_WEBSITE_COPY_DRAFT_2026-10-03.md)

## 완료

- [x] Astro + TypeScript 정적 8페이지 구현
- [x] 공식 SVG 브랜드 적용, 헤더 36px / 20px / 간격 6px, 푸터 70% 유지
- [x] Inter Tight 300 / 0.025em, 한글 Pretendard 600 / -0.045em 유지
- [x] 홈 구성: Hero → Works → Services → Process → Studio → FAQ → CTA
- [x] Services: 3개 주력 서비스의 적합 상황·범위·산출물 예시·준비 정보, 연계 역량 3개
- [x] About: 정체성·자체 제품·협업 방식·작업 원칙
- [x] 모바일 메뉴, 현재 위치, Escape·키보드·건너뛰기 링크
- [x] Process 4열 / 2열 / 1열 반응형
- [x] Works 전체 카드 링크와 제품별 상세
- [x] PreviewLog 소개 원본 확인, 작업 흐름·결과물 설명. 실제 캡처/출시 배지/외부 다운로드는 보류
- [x] Shuffo 원본 비율 갤러리 3장, WebP·srcset·크기 속성·지연 로딩
- [x] Contact 이메일 제목·주소 복사·실패 안내·준비 정보, 홈 FAQ 3개 / 문의 FAQ 7개
- [x] title·description·canonical·OG·favicon·sitemap·robots·Organization
- [x] 미완성 Privacy 안내에 noindex, sitemap 제외, 준비 상태 명시
- [x] 타입 검사·빌드·내부 링크 검사·5개 화면 폭 40개 조합·주요 상호작용 검수

## 다음 우선순위 — 공개 전 실제 자료 필요

1. **PreviewLog 제품 검수**
   - 실제 앱 화면과 내보낸 결과물 샘플 확보, 기능 설명 대조.
   - 현재 공개·배포·지원 환경 확인. 2026-10-03 외부 주소 HEAD 404 기록만으로 출시 여부를 단정하지 않습니다.
   - 정상 공개 주소가 확인되면 외부 CTA 추가. 미연결 대기자 폼/다운로드 링크 노출 금지.
2. **개인정보 및 법적 운영 정보**
   - 방침 초안은 `src/pages/privacy.astro`와 `src/data/privacy.ts`에 작성했습니다. 개인정보 보호법 제30조 필수 기재사항 9개 항목을 갖췄습니다.
   - `privacyConfig`에 남은 미확인 값: 대표자명(보호책임자), 사업장 주소, 문의 이메일 보유 기간, 시행일. 호스팅 제공자는 Cloudflare, Inc.로 확정했습니다.
   - 값이 모두 채워지면 `privacyPending`이 false가 되어 초안 안내가 사라집니다. 그때 noindex 해제, sitemap 추가, 푸터 "(준비 중)" 표기 해제를 함께 진행합니다.
   - 이메일 방식이라는 이유로 개인정보 검토가 끝난 것으로 취급하지 않습니다. 게시 전 법률 검토를 권장합니다.
3. **실제 공개 준비**
   - 호스팅은 Cloudflare Pages로 확정. 빌드 `pnpm build`, 출력 `dist`, 응답 헤더는 `public/_headers`.
   - Cloudflare Pages 프로젝트 `bldnex-website` 생성·배포 완료 (https://bldnex-website.pages.dev). 절차는 [배포 문서](deploy.md).
   - `bldnex.com` 연결 완료. www는 apex로 301 리다이렉트. 사이트가 공개 접근 가능한 상태입니다.
   - 남은 작업: 실기기(iOS Safari·Android Chrome) 점검, Search Console 등록과 사이트맵 제출, 공유 디버거(Facebook·X·카카오)로 OG 카드 수집 확인.
   - 실제 iOS Safari·Android Chrome 기기 점검. 현재 모바일 검수는 Chrome의 반응형 viewport이며 실기기 검수가 아닙니다.
   - 실제 배포 후 확인: HTTPS, `/about/` → `/about` 리다이렉트 동작, 공유 디버거(Facebook·X·카카오)로 페이지별 OG 카드 수집, Google Search Console 색인 및 구조화 데이터, 운영 이메일 수신.

## 정식 문의 폼을 도입할 때

이메일 문의 경로는 현재 구현으로 사용할 수 있습니다. 아래 기능은 아직 만들지 않았으며 함께 준비해야 합니다.

- [ ] 필드·선택정보·첨부파일 공개 범위 확정
- [ ] 클라이언트/서버 검증, 중복·스팸·요청 제한
- [ ] Cloudflare Workers / D1 저장 / 필요 시 R2 업로드
- [ ] 실제 저장 확인 뒤 성공 처리, 실패·불확실 응답 복구
- [ ] 메일 알림과 인증된 운영자 조회 / Cloudflare Access
- [ ] 개인정보 고지·동의와 실제 보관/파기 일치

## 후속 콘텐츠

- [x] 개발사 증거 요소 — 빌드 실측 스탬프, bldnex.com 작업물, App Store 배지 ([문서](proof-points.md))
- [ ] 공개 허가가 있는 고객 프로젝트 자료 확보
- [ ] 실제 자료 기반 Blog / Insights 원고 및 라우트
- [x] 페이지별 전용 OG 이미지 — `scripts/generate-og.mjs`가 7종 생성
- [x] 웹폰트 서브셋 셀프호스팅 — 1.59 MB → 152 KB, 서드파티 0건 ([문서](fonts.md))
- [ ] 브랜드 컬러 최종 가이드 — 화면에는 기존 #35a9ff 유지

성과 수치, 고객 후기, 가격, 고정 납기, 팀 경력, 무료 유지보수 조건은 근거 없이 추가하지 않습니다.
