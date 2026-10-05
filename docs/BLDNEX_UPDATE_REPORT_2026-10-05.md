# BLDNEX 콘텐츠 업데이트 결과

작업일: 2026-10-05 · 요청: “업데이트 진행” · 상태: 로컬 구현·검수 완료, 외부 배포 안 함

## 적용 내용

| 영역 | 반영 내용 |
| --- | --- |
| Home | Hero → Works → Services → Process → Studio → FAQ → CTA. 첫 화면의 서비스·대상 고객·문의 메시지 구체화 |
| About | 슬로건의 의미, 자체 제품을 만드는 이유, 협업 방식, 3가지 작업 원칙 |
| Services | 3개 서비스마다 적합 상황·제공 범위·산출물 예시·준비 정보. 3개 연계 역량과 범위 협의 안내 |
| Works | 카드 전체 링크, 제품별 설명·태그, 자체 제품임을 명시 |
| PreviewLog | 촬영본 정리 문제, 초안→검토→내보내기, 결과물 설명. 소개 자료 기반임을 명시, 앱 화면으로 오인할 목업이나 출시 배지 없음 |
| Shuffo | 실제 세로 화면 3장, 사진 선택·플레이·공유 기능 소개, 공식 App Store 링크 |
| Contact | 준비 정보 4가지, 제목이 채워진 mailto, 이메일 복사·실패 메시지, 공통 FAQ 7개 |
| Header/Footer | 모바일 메뉴, 현재 위치, 한글 문의 CTA, 주요 메뉴·제품 상세·연락처 연결 |
| SEO | 페이지별 title/description/canonical/OG, 브랜드 공유 PNG, favicon, sitemap/robots, Organization JSON-LD |
| Privacy | 완성된 방침이 아닌 준비 안내로 표시, noindex, sitemap 제외 |

## 유지한 사용자 결정

- 공식 심볼·워드마크 SVG 사용. 텍스트로 회사 로고를 재현하지 않음.
- 헤더 심볼 36px, 워드마크 20px, 간격 6px. 푸터는 25.2px / 14px로 70% 비율 유지.
- 영문 제목과 Works 타이틀: Inter Tight 300, 자간 0.025em.
- 한글 제목: Pretendard 600, 자간 -0.045em.
- 기존 다크 배경과 #35a9ff 포인트 유지.

## 구현·성능

- 서비스·프로세스·FAQ 원고를 공통 데이터로 분리하고 페이지 간 재사용.
- 모바일 메뉴/FAQ는 native details/summary. JavaScript가 없어도 기본 탐색 가능.
- 메뉴 Escape·외부 클릭·포커스 이동·데스크톱 전환 닫기, skip link와 focus-visible.
- Clipboard API 지원 시에만 복사 버튼 노출. 실제 발송·접수 완료 UI는 만들지 않음.
- Shuffo 원본 JPG는 보존. Astro Image + Sharp 0.34.5 직접 의존성으로 반응형 WebP 11종 생성.
- 예: 홈 카드 598KB 원본 대신 13KB/34KB 크기별 파일, 상세는 29~157KB 파일 제공. 화면 종횡비 보존.
- 공유 PNG는 제공 SVG를 조합해 생성. 회사/제품 이미지나 성과를 AI로 만들어 넣지 않음.

## 검증 결과

| 검증 | 결과 |
| --- | --- |
| `pnpm check` | 27개 파일, 오류 0 / 경고 0 / 힌트 0 |
| `pnpm test` | 8페이지 빌드 + 내부 참조 246개 검사 통과 |
| 내부 검사 | 페이지 고유 제목, 설명·OG·JSON-LD, 경로·앵커·이미지 크기/alt, FAQ 수, 문의 폼 미노출, Privacy noindex/sitemap 제외 |
| 반응형 | Chrome headless, 320/375/768/1280/1440px × 8페이지 = 40개 조합. 가로 넘침·제목/본문 오버플로·이미지 로드 실패·스크립트 오류 0 |
| 브랜드 | 화면별 로고 높이/간격, 영문 폰트/굵기/자간 확인 |
| 이미지 | 모든 이미지 decode 완료, Shuffo 표시 종횡비 확인. 원본 이미지가 크롭되지 않음 |
| 상호작용 | skip link, 모바일 메뉴 키보드/탭/Escape/외부 클릭, 서비스 이동/현재 위치/앵커, FAQ 키보드 토글 |
| 문의 | 격리된 Chrome 컨텍스트에서 실제 주소 복사와 권한 거절 시 오류/재시도 확인. mailto 확인만 하고 실제 이메일은 발송하지 않음 |
| 기본 접근성 | reduced-motion, native disclosure, live region, JavaScript 미사용 시 메뉴·FAQ·이메일 경로 확인 |
| 시각 확인 | Orca 내장 브라우저의 데스크톱 화면 및 Chrome의 모바일·데스크톱 홈/서비스/소개/문의/제품 화면 검토 |

실제 휴대폰, 전용 스크린리더, 모든 브라우저·접근성 기준에 대한 전체 인증 검수는 아닙니다. 개발 서버/로컬 프로덕션 프리뷰에서 확인했으며 운영 배포·실제 문의 수신은 검증하지 않았습니다.

## 근거 및 공개 전 남은 사항

- 원고 기준: [콘텐츠 업데이트 계획](BLDNEX_CONTENT_UPDATE_PLAN_2026-10-03.md), [게재용 원고](BLDNEX_WEBSITE_COPY_DRAFT_2026-10-03.md).
- Shuffo 공개 앱·기능: [공식 App Store](https://apps.apple.com/kr/app/shuffo/id6814380886), 2026-10-05 재확인. 앱의 iPhone 출시 사실을 Android 출시로 확대하지 않음.
- PreviewLog: `/Users/macsk/Projects/previewlog-landing/deploy/index.html`의 소개 자료. 실제 앱 기능, 최신 배포/지원 환경, 화면·출력 샘플은 소유자 확인 필요. 공개 상태와 가격을 임의 확정하지 않음.
- 개인정보: 담당 정보·보관/파기 기준·사용 서비스 등 실제 운영값을 받아 이메일 문의까지 포함한 방침을 완성해야 함.
- 정식 폼: 클라이언트/서버 검증·저장·알림·인증된 운영자 조회·개인정보 고지를 갖추기 전 노출하지 않음.
- 배포: 현재 로컬 확인 주소는 http://localhost:4321. 도메인 공개 작업은 별도 승인과 운영 정보 확인 후 진행.

다음 작업은 [Wiki 로드맵](wiki/roadmap.md)에 기록했습니다.
