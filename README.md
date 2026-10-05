# BLDNEX 공식 웹사이트

BLDNEX의 브랜드, 서비스, 자체 제품과 프로젝트 문의를 소개하는 Astro + TypeScript 정적 웹사이트입니다.

2026-10-05 콘텐츠 업데이트를 적용했습니다. Home → 제품 사례 → 서비스 → 협업 방식 → 문의로 이어지는 8개 페이지를 제공합니다. 문의는 이메일 방식이며, 정식 문의 서버와 개인정보처리방침은 아직 운영 준비가 필요합니다. 외부 배포는 하지 않았습니다.

## 실행과 검증

```sh
pnpm install
pnpm dev
pnpm check
pnpm test
```

- 개발 주소: http://localhost:4321
- `pnpm test`: 프로덕션 빌드 후 8개 페이지, 내부 링크·앵커·이미지·SEO·FAQ·Privacy 공개 제한을 검사합니다.
- `pnpm preview`: 빌드 결과를 로컬에서 확인합니다.
- `pnpm assets:og`: 제공된 공식 SVG에서 1200×630 공유 이미지를 다시 생성합니다. 한글 렌더링은 로컬 시스템 폰트를 사용하므로 재생성 후 이미지를 확인하세요.

## 주요 구현

- Home, About, Services, Works, PreviewLog, Shuffo, Contact, Privacy 안내
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
- [남은 작업](docs/wiki/roadmap.md)
