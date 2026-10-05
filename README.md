# BLDNEX 공식 웹사이트

BLDNEX의 브랜드, 서비스, 자체 제품과 프로젝트 문의를 소개하는 Astro + TypeScript 웹사이트입니다. 공개 페이지는 정적 HTML, 문의·관리자 API는 Cloudflare Pages Functions로 분리합니다.

기존 사이트는 Cloudflare Pages로 공개되어 있습니다. 2026-10-05 문의 폼·D1 저장·관리자·알림/파기 예약 작업을 구현했습니다. 관리자 Gmail·Resend 사용·보관 기간은 사용자 승인 완료, 운영/검수 D1 생성·마이그레이션과 Turnstile 키 등록도 완료했습니다. **이번 변경은 미배포이며 실제 접수는 OFF**입니다. Resend 계정·발신 도메인, Access 인증, 개인정보 검토와 실제 수신 검수가 남아 있습니다. [구현 결과와 운영 연결](docs/BLDNEX_CONTACT_IMPLEMENTATION_2026-10-05.md)을 먼저 확인하세요. 현재 Pages는 Direct Upload이므로 Git 푸시만으로 배포되지 않습니다.

## 실행과 검증

```sh
pnpm install
pnpm dev
pnpm check
pnpm test
```

- 개발 주소: http://localhost:4321
- `pnpm test`: 격리된 로컬 workerd D1 서버 테스트 + 빌드 + 공개 9페이지의 링크·SEO·폰트·Privacy/관리자 공개 제한 검사.
- `pnpm contact:check`: Pages Functions 컴파일 + 예약 Worker dry-run (배포하지 않음).
- `pnpm contact:migrate:local && pnpm contact:dev`: 로컬 D1/Functions 포함 http://127.0.0.1:8788. 접수는 준비 상태로 유지합니다.
- `pnpm test:browser`: 로컬 Chrome 브라우저 회귀 검사. 외부 메일·CAPTCHA는 가상 응답이며 실제 수신 검증이 아닙니다.
- `pnpm preview`: 빌드 결과를 로컬에서 확인합니다.
- `pnpm assets:og`: 제공된 공식 SVG에서 1200×630 공유 이미지를 다시 생성합니다. 한글 렌더링은 로컬 시스템 폰트를 사용하므로 재생성 후 이미지를 확인하세요.

## 주요 구현

- Home, About, Services, Works, PreviewLog, Shuffo, bldnex.com, Contact, Privacy + 비공개 관리자
- 문의 검증·선택 동의·저장 확인·중복 방지·오류 재시도·메일 대안
- Access JWT 관리자 보호, 알림 outbox/재시도, 보관 기간 만료 삭제
- 3개 주력 서비스와 3개 연계 역량, 4단계 프로세스, 공통 FAQ
- 모바일 메뉴·현재 위치·키보드 이동·이메일 복사와 실패 안내
- 공식 로고, Inter Tight / Pretendard 타이포그래피
- 세로 비율을 보존한 Shuffo 갤러리와 반응형 WebP
- 페이지별 검색·공유 메타데이터, OG 이미지, favicon, sitemap, robots, Organization 데이터

## 프로젝트 메모리

새 작업 전 [Orca Wiki Memory](docs/wiki/README.md)를 확인하고, 구현 구조나 결정이 바뀌면 관련 메모를 함께 갱신합니다.

- [기획 원문과 최신 적용 기준](docs/BLDNEX_WEBSITE_PLAN.md)
- [콘텐츠 업데이트 계획](docs/BLDNEX_CONTENT_UPDATE_PLAN_2026-10-03.md)
- [페이지별 원고](docs/BLDNEX_WEBSITE_COPY_DRAFT_2026-10-03.md)
- [업데이트·검증 결과](docs/BLDNEX_UPDATE_REPORT_2026-10-05.md)
- [문의 구현·운영 연결 초안](docs/BLDNEX_CONTACT_IMPLEMENTATION_2026-10-05.md)
- [남은 작업](docs/wiki/roadmap.md)
