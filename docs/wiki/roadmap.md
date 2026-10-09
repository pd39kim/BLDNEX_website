# 로드맵

최종 갱신: 2026-10-09

## 최신 상태

콘텐츠 업데이트 이후 사이트는 Cloudflare Pages(bldnex.com)에 배포되어 운영 중입니다. 문의 폼·D1 트랜잭션·Turnstile·예약 Worker·Resend 알림·Access 관리자 셸을 모두 구현·검증했고, **실제 접수 활성화(CONTACT_ENABLED=true) 및 관리자 Gmail 수신 E2E 검증까지 완료**되었습니다. 외부 공급자(Cloudflare, Resend) 상세 처리 및 국외 이전 등 법률 방침 최종 확정을 병행하고 있으며, 방침 검토 완료 전까지 방침 페이지는 보호 가드레일(noindex, sitemap 제외)을 유지합니다.

- [문의 구현·운영 연결 및 질문 목록](../BLDNEX_CONTACT_IMPLEMENTATION_2026-10-05.md)

- [업데이트·검증 결과](../BLDNEX_UPDATE_REPORT_2026-10-05.md)
- [콘텐츠 업데이트 계획](../BLDNEX_CONTENT_UPDATE_PLAN_2026-10-03.md)
- [카피 원고와 별도 검수 항목](../BLDNEX_WEBSITE_COPY_DRAFT_2026-10-03.md)

## 완료

- [x] Astro + TypeScript 공개 9페이지 + 비공개 관리자 셸 구현
- [x] 공식 SVG 브랜드 적용, 헤더 36px / 20px / 간격 6px, 푸터 70% 유지
- [x] Inter Tight 300 / 0.025em, 한글 Pretendard 600 / -0.045em 유지
- [x] 홈 구성: Hero → Works → Services → Process → Studio → FAQ → CTA
- [x] Services: 3개 주력 서비스의 적합 상황·범위·산출물 예시·준비 정보, 연계 역량 3개
- [x] About: 정체성·자체 제품·협업 방식·작업 원칙
- [x] 모바일 메뉴, 현재 위치, Escape·키보드·건너뛰기 링크
- [x] Process 4열 / 2열 / 1열 반응형
- [x] Works 전체 카드 링크와 제품별 상세
- [x] PreviewLog 공식 사이트 배포(previewlog.bldnex.com) 및 bldnex.com/works/previewlog 공식 웹사이트 링크·스키마 연동 완료
- [x] Shuffo 원본 비율 갤러리 3장, WebP·srcset·크기 속성·지연 로딩
- [x] Contact 이메일 제목·주소 복사·실패 안내·준비 정보, 홈 FAQ 3개 / 문의 FAQ 7개
- [x] title·description·canonical·OG·favicon·sitemap·robots·Organization
- [x] 미완성 Privacy 안내에 noindex, sitemap 제외, 준비 상태 명시
- [x] 사이트 전 페이지 카피 검토, 문장 구조 정돈, 보조용언 띄어쓰기 규범 통일
- [x] 문의 폼 오류 실시간 해제(Reward Early UX) 및 브라우저 회귀 테스트(15개) 추가
- [x] AI 에이전트 위키 메모리 지속 운영 지침(AGENTS.md) 수립
- [x] 사이트 전반 AI 문체 패턴 정밀 분석 및 실무 빌더 보이스로 전면 정돈
- [x] About 페이지 중복 원칙 제거 및 WORKING STANDARDS 4대 실무 원칙 단일 통합
- [x] PreviewLog 실제 제품 UI 쇼케이스(카드 목업 프레임 및 상세 갤러리 2종) & 비주얼 뎁스/글로우 고도화
- [x] Contact 폼 프로젝트 유형 퀵 셀렉션 칩(Quick Chips) 단독 노출 및 드롭다운 은닉 양방향 동기화
- [x] 서비스 페이지 분야별 프로젝트 문의 버튼과 Contact 폼 칩/드롭다운 사전 선택(Preselection) 및 폼 위치(#inquiry) 자동 스크롤 연동
- [x] mailto 문의 링크 제목 간소화 (`[프로젝트 문의]`)
- [x] PreviewLog 법률 및 랜딩 페이지 카피 "녹화본" → "촬영본" 전사 통일 및 라이선스 서버(Workers) 배포
- [x] 타입 검사·빌드·내부 링크 검사·5개 화면 폭 40개 조합·주요 상호작용 검수

## 다음 우선순위 — 공개 전 실제 자료 필요

1. **개인정보 및 법적 운영 정보**
   - 방침 초안은 `src/pages/privacy.astro`와 `src/data/privacy.ts`에 작성했습니다. 개인정보 보호법 제30조 필수 기재사항 9개 항목을 갖췄습니다.
   - 기존 책임자·주소·이메일 보유 기간·시행일·호스팅 값은 모두 채워져 있습니다. 폼 보관 기간도 사용자 승인 완료입니다. 남은 검토는 **수집 범위와 실제 외부 공급자 처리·국외 이전·백업 및 메일 삭제·개정 시행일**입니다.
   - 새 방침 검토 전에는 `privacyPending`, noindex, sitemap 제외, 푸터 "(준비 중)"을 유지합니다. 기존 운영값이 채워졌다는 이유만으로 폼의 방침 검토가 완료된 것은 아닙니다.
   - 이메일 방식이라는 이유로 개인정보 검토가 끝난 것으로 취급하지 않습니다. 게시 전 법률 검토를 권장합니다.
3. **실제 공개 준비**
   - 호스팅은 Cloudflare Pages로 확정. 빌드 `pnpm build`, 출력 `dist`, 응답 헤더는 `public/_headers`.
   - Cloudflare Pages 프로젝트 `bldnex-website` 생성·배포 완료 (https://bldnex-website.pages.dev). 절차는 [배포 문서](deploy.md).
   - `bldnex.com` 연결 완료. www는 apex로 301 리다이렉트. 사이트가 공개 접근 가능한 상태입니다.
   - 남은 작업: 실기기(iOS Safari·Android Chrome) 점검, Search Console 등록과 사이트맵 제출, 공유 디버거(Facebook·X·카카오)로 OG 카드 수집 확인.
   - 실제 iOS Safari·Android Chrome 기기 점검. 현재 모바일 검수는 Chrome의 반응형 viewport이며 실기기 검수가 아닙니다.
   - 실제 배포 후 확인: HTTPS, `/about/` → `/about` 리다이렉트 동작, 공유 디버거(Facebook·X·카카오)로 페이지별 OG 카드 수집, Google Search Console 색인 및 구조화 데이터, 운영 이메일 수신.

## 문의 폼 — 로컬 구현 완료, 운영 연결 필요

2026-10-05 [직접 접수형 문의 폼 계획](../BLDNEX_CONTACT_FORM_PLAN_2026-10-05.md) 수립 후 구현, 이어 운영 선택 승인을 받았습니다. 로컬 소스·검증과 D1·Turnstile 준비까지 적용했습니다. 서비스 가입·DNS 변경·실제 메일 발송·사이트/Worker 배포는 하지 않았습니다.

기존 Pages를 유지하고 Pages Functions + D1 + Turnstile + Resend + Access를 추가하는 안입니다. 별도 예약 Worker로 알림 재시도·파기를 처리합니다. 이메일 문의는 장애/JS 미지원 시 대안으로 남깁니다.

- [x] 직접 접수형 폼의 필드·저장·알림·인증·개인정보·검증·롤백 계획 수립
- [x] 폼·필드 검증·필수/선택 동의·이메일 대안, 첨부 제외
- [x] D1 원문+outbox 트랜잭션·동일 요청 복구·Turnstile·요청 제한
- [x] Access JWT 관리자·상태/종료·확인 삭제·알림 재시도
- [x] 예약 Worker·동시 실행 보호·메일 실패 보존·만료 파기
- [x] 기존 form 금지 조건 교체·번들 동적 한글 서브셋·홈 기준 수치 표현
- [x] 서버 26개 / 브라우저 13개 / 타입·빌드·Functions·Worker 컴파일 검증
- [x] 관리자: `BLDNEX.DEV@GMAIL.COM`만 허용 승인 및 설정 반영
- [x] Resend 사용 및 대표 Gmail 알림 수신 승인
- [x] 보관 기간 승인: 종료 후 365일 / 미종결 접수 후 최대 730일
- [x] 운영/검수 D1 분리 생성, 두 환경에 마이그레이션 2개 적용·빈 문의 테이블 확인
- [x] 환경별 Turnstile 생성, Pages의 CAPTCHA 비밀 키·요청 제한 비밀 키 등록
- [x] Resend 발송 전용 API 키 생성 및 운영·검수 Worker 비밀값 등록
- [x] `notify.bldnex.com` 발신 도메인 인증/DNS 확인

기존 개인정보 운영값은 `src/data/privacy.ts`에서 유지했습니다. 폼 도입에 맞게 수정한 본문은 검토용 초안입니다. 코드/테스트 통과를 개인정보 검토 완료 또는 실제 접수 공개로 간주하지 않습니다.

- [x] 운영 환경변수/키 연결: Access 도메인·audience, 문의 정책 승인 버전
- [x] Turnstile 운영 호스트 및 Access 보호 경로 설정 검수
- [ ] 공급자 처리/국외 이전/백업·복원 후 재삭제·메일 삭제·개정 시행일 확정
- [x] 사용자 동의하에 실제 테스트 문의 1건·Gmail 수신 검수 완료 (`#BN-3c66d6f8...` 수신 확인)
- [x] 예약 Worker 실제 실행·운영 헬스체크 기록 확인
- [x] 접수 ON 상태로 Pages 배포 및 운영 도메인 응답·수신 E2E 검증 완료
- [x] Resend Gmail 실제 수신 확인 완료 (접수 알림 본문 개인정보 미포함 확인)

## 후속 콘텐츠

- [ ] **홈·상세 페이지 콘텐츠 중복 정리 검토** — 2026-10-06 검토 제안만 기록했으며, 현재 사이트에는 적용하지 않았습니다. [제안 문서](../BLDNEX_CONTENT_DEDUPLICATION_PROPOSAL_2026-10-06.md)
- [x] 개발사 증거 요소 — 빌드 실측 스탬프, bldnex.com 작업물, App Store 배지 ([문서](proof-points.md))
- [x] 404 페이지 — 없는 주소가 홈을 200으로 반환하던 소프트 404 해소
- [x] Cloudflare Web Analytics 비활성화 — 공개 중이던 "외부 요청 0건"과 방침 문구를 사실로 복원 ([배포 문서](deploy.md))
- [ ] 공개 허가가 있는 고객 프로젝트 자료 확보
- [ ] 실제 자료 기반 Blog / Insights 원고 및 라우트
- [x] 페이지별 전용 OG 이미지 — `scripts/generate-og.mjs`가 7종 생성
- [x] 웹폰트 서브셋 셀프호스팅 — 폰트 1,634 KB → 206 KB, 서드파티 0건 ([문서](fonts.md))
- [ ] 브랜드 컬러 최종 가이드 — 화면에는 기존 #35a9ff 유지

성과 수치, 고객 후기, 가격, 고정 납기, 팀 경력, 무료 유지보수 조건은 근거 없이 추가하지 않습니다.
