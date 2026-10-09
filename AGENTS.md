# BLDNEX AI 에이전트 운영 지침 (Wiki Memory 연동)

이 저장소는 **BLDNEX 공식 웹사이트** 프로젝트입니다. 이 창과 모든 후속 AI 세션은 아래의 위키 메모리(Wiki Memory) 운영 규칙을 최우선으로 따릅니다.

---

## 1. 위키 메모리(Wiki Memory) 필수 참조 및 운영 원칙

작업을 시작하기 전과 완료한 후에는 반드시 `docs/wiki/` 디렉터리의 문서를 확인하고 갱신합니다.

* **사전 확인 (`docs/wiki/README.md`)**:
  * [context.md](docs/wiki/context.md): 사업·브랜드·고객·전환 목표
  * [decisions.md](docs/wiki/decisions.md): 이미 합의된 제품·콘텐츠·기술 결정 이력
  * [architecture.md](docs/wiki/architecture.md): 현재 웹사이트 구현 구조 및 파이프라인
  * [roadmap.md](docs/wiki/roadmap.md): 최신 상태 및 남은 작업
  * [proof-points.md](docs/wiki/proof-points.md): 사이트 스스로 증명하는 장치 (실측 스탬프 등)
  * [fonts.md](docs/wiki/fonts.md): 웹폰트 서브셋 셀프호스팅 원리 및 빌드 검사

* **사후 갱신 의무**:
  * 새로운 기술적 결정, 콘텐츠 합의, 설계 변경이 발생하면 즉시 `docs/wiki/decisions.md`에 `YYYY-MM-DD` 형식으로 기록합니다.
  * 파일 구조나 동작 방식이 바뀌면 `docs/wiki/architecture.md`를 같은 작업에서 갱신합니다.
  * 진행 상태나 다음 과제가 변경되면 `docs/wiki/roadmap.md`를 최신화합니다.

---

## 2. 핵심 개발 및 설계 제약 사항 (절대 준수)

1. **단일 진실 공급원 (Single Source of Truth)**:
   * 상세 브랜드 카피와 사이트 설계의 원문은 `docs/BLDNEX_WEBSITE_PLAN.md`입니다.
   * 임의로 가짜 성과 수치, 인원 규모, 고객 후기, 무료 유지보수 등의 근거 없는 주장을 지어내지 않습니다.
   * PreviewLog와 Shuffo 등 실제 자체 제품에 근거한 사실만 기술합니다.

2. **브랜드 및 타이포그래피 규칙**:
   * 공식 워드마크는 텍스트가 아닌 `public/assets/brand/bldnex-wordmark.svg`를 사용합니다.
   * 영문 헤드라인: `Inter Tight` 300, `0.025em` 자간.
   * 한글 헤드라인: `Pretendard` 600, `-0.045em` 자간 (`ko-heading` 클래스).
   * 보조용언 띄어쓰기는 원칙(`-해 보다`, `-해 주다`: 예: `정리해 보세요`, `문의해 주세요`)을 통일 적용합니다.
   * 새 폰트 굵기 추가 시 `scripts/subset-fonts.mjs`의 `faces`에 반드시 등록해야 합니다.

3. **호스팅 및 배포 (`Cloudflare Pages`)**:
   * `build.format: 'file'`을 유지합니다 (슬래시 없는 정규화 URL 보존).
   * 공개 수치(`__PAGE_WEIGHT__` 등)는 손으로 적지 않고 `measure-site.mjs`의 자동 실측 치환을 따릅니다.
   * 호스트 동작은 추측하지 않고 배포 및 실측으로 확인합니다.

4. **검증 및 무결성 검사**:
   * 모든 수정 후에는 반드시 `pnpm test` 및 `pnpm test:browser`를 실행하여 폰트 커버리지, 링크, 실측 수치, 브라우저 상호작용 검증을 통과해야 합니다.

<!-- wiki-memory:start -->
## Wiki Memory

Read "/Users/macsk/Projects/BLDNEX_website/.wiki-memory/START.md" at session start/resume and when the user asks to enable Wiki Memory.
The canonical project root is "/Users/macsk/Projects/BLDNEX_website". Check its current memory.config.json; do not use a stale worktree copy.
This instruction installs the workflow, not permission to enable it. Do not broadcast unless the user has explicitly selected use.
<!-- wiki-memory:end -->
