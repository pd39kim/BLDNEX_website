# 배포 — Cloudflare Pages

최종 갱신: 2026-10-05

## 현재 상태

| 항목 | 값 |
| --- | --- |
| 프로젝트 | `bldnex-website` |
| 계정 | pd39kim@gmail.com (`95ea5a60382544303b01bb3210df93a2`) |
| 프로덕션 브랜치 | `main` |
| 배포 방식 | Direct Upload (`Git Provider: No`). Git 푸시와 빌드는 배포가 아님 |
| 배포 URL | https://bldnex-website.pages.dev |
| 공개 주소 | **https://bldnex.com** (연결 완료) |
| www | apex로 301 리다이렉트 |
| 도메인 네임서버 | 이미 Cloudflare (`thaddeus` / `norah`.ns.cloudflare.com) |

## 배포하기

**문의 기능 현재 상태:** Pages Functions와 D1 마이그레이션을 운영에 배포했고, `https://bldnex.com/api/contact/config`는 `enabled:true`와 운영 Turnstile 사이트 키를 반환합니다. `/admin/inquiries`는 Cloudflare Access 로그인으로 보호됩니다. 예약 Worker는 5분 주기로 실행되며 운영 D1의 `system_health.jobs` 기록을 확인했습니다. 실제 Gmail 도착 여부와 스테이징 실접수는 별도 검수 대상입니다. [운영 연결 순서](../BLDNEX_CONTACT_IMPLEMENTATION_2026-10-05.md)를 참고합니다.

운영/검수 D1 생성·마이그레이션, Turnstile과 Pages 비밀 키 등록, Resend 발송 전용 키의 Worker 비밀값 등록, `notify.bldnex.com` 발신 도메인 인증, 운영 Access 앱 연결은 완료했습니다. 실제 Gmail 수신·스테이징 실접수·개정 방침 검증은 남아 있습니다. 루트 `wrangler.toml`의 기본 설정은 로컬 전용이며 `env.production`은 운영 DB, `env.preview`는 검수 DB입니다. Pages에는 `account_id`를 넣을 수 없습니다. Worker 설정의 `account_id`와는 다릅니다.

검수용 origin은 `https://staging.bldnex-website.pages.dev`로 예약했으며 아직 해당 브랜치를 배포하지 않았습니다. 임의 해시 preview URL은 이 호스트용 CAPTCHA/origin과 일치하지 않으므로 접수 검수에 사용하지 않습니다. DB 작업은 반드시 `--env production` 또는 `--env preview`와 대상 DB 이름을 명시합니다. `workers/contact-jobs/wrangler.toml`은 기본이 운영(`JOBS_ENABLED=true`), `--env staging`이 검수 DB입니다.

```sh
pnpm check
pnpm test                       # 로컬 D1 테스트 + 빌드 + 정적 검사
pnpm contact:check              # Functions 컴파일 + 예약 Worker dry-run
pnpm test:browser               # Chrome 검사. 실제 발송 검증은 별도
npx wrangler pages deploy dist --project-name bldnex-website --branch main
```

`pnpm test`가 `pnpm build`를 포함하므로 따로 빌드할 필요는 없습니다. 작업 중인 변경이 커밋되지 않은 상태라면 `--commit-dirty=true`를 붙입니다.

## 도메인 구성 (완료)

| 호스트 | 구성 | 동작 |
| --- | --- | --- |
| `bldnex.com` | Pages 커스텀 도메인 | 사이트를 직접 서비스 |
| `www.bldnex.com` | Proxied CNAME → `bldnex.com` + Redirect Rule | apex로 **301** |

인증서는 Google Trust Services가 자동 발급했습니다(2026-10-05 발급). 네임서버가 이미 Cloudflare라 DNS 이관은 필요 없었습니다.

### www 는 Pages 커스텀 도메인으로 붙이면 안 됩니다

**처음에 `www`도 Pages 커스텀 도메인으로 추가했다가 리다이렉트가 동작하지 않았습니다.** 어떤 호스트가 Pages 커스텀 도메인이면 그 호스트는 Pages 가 직접 응답하므로, 같은 호스트를 대상으로 한 Redirect Rule 이 적용되지 않습니다. 둘은 함께 쓸 수 없습니다.

올바른 구성은 이렇습니다.

1. Pages **Custom domains** 에는 `bldnex.com` 만 둡니다.
2. DNS 에 `www` → `bldnex.com` **CNAME** 을 만들고 **Proxied(주황 구름)** 로 둡니다. 회색(DNS only)이면 Cloudflare 가 요청을 가로채지 못해 규칙이 적용되지 않습니다.
3. **Rules → Redirect Rules** 에 아래 규칙을 둡니다.

```
expression : http.host eq "www.bldnex.com"
action     : 301 redirect
target     : concat("https://bldnex.com", http.request.uri.path)
option     : preserve_query_string = true
```

`www` 를 Pages 에서 떼고 규칙을 넣기 전까지는 `www` 가 **522** 로 끊깁니다. 보낼 곳이 없기 때문입니다. 작업 순서상 잠깐 생기는 상태이고, apex 는 영향을 받지 않습니다.

### API 로 설정할 때

`wrangler` 에는 Pages 커스텀 도메인·DNS·Redirect Rule 명령이 모두 없습니다. 대시보드나 REST API 를 써야 합니다. 토큰 권한은 세 가지입니다.

| 구분 | 항목 | 권한 |
| --- | --- | --- |
| Account | Cloudflare Pages | Edit |
| Zone | DNS | Edit |
| Zone | **Single Redirect** | Edit |

대시보드 메뉴 이름은 *Redirect Rules*, 토큰 권한 이름은 *Single Redirect*, API 단계 이름은 `http_request_dynamic_redirect` 로 셋 다 다릅니다. 모두 같은 기능입니다.

Redirect Rule 을 API 로 넣을 때 `PUT /zones/{zone}/rulesets/phases/http_request_dynamic_redirect/entrypoint` 는 **그 phase 의 규칙 전체를 교체**합니다. 먼저 GET 으로 현재 규칙을 확인하고, 조회에 실패하면 쓰지 않아야 합니다. 규칙이 하나도 없으면 GET 이 `10003 could not find entrypoint ruleset` 로 실패하는데, 이것은 "비어 있음"이므로 생성해도 덮어쓸 것이 없습니다. 권한 부족으로 인한 실패와 구분해야 합니다.

### 확인 명령

```sh
curl -s -o /dev/null -w '%{http_code}\n' https://bldnex.com/about        # 200 (리다이렉트 없음)
curl -s -o /dev/null -w '%{redirect_url}\n' https://bldnex.com/about/    # /about 으로 308
curl -s -o /dev/null -w '%{redirect_url}\n' https://www.bldnex.com/about # apex 로 301
curl -sL -o /dev/null -w '%{num_redirects}\n' https://www.bldnex.com/about  # 1
```

## URL 형식 — 추측하지 말고 확인할 것

`astro.config.mjs`는 `build.format: 'file'`입니다. **실제 배포로 확인한 결과**이며, 처음 가정은 틀렸습니다.

| 형식 | Cloudflare Pages 동작 | canonical과의 관계 |
| --- | --- | --- |
| `directory` (`/about/index.html`) | `/about` → **308** → `/about/` | canonical이 리다이렉트를 가리킴 ✗ |
| `file` (`/about.html`) | `/about` → **200**, `/about/` → 308 → `/about` | 일치 ✓ |

canonical·`og:url`·sitemap이 모두 슬래시 없는 주소를 쓰므로 `file`이 맞습니다. `check-site.mjs`도 이 형식(`<경로>.html`)을 기준으로 읽습니다.

## 배포 후 검증 — `pnpm verify:live`

빌드 검사로는 잡을 수 없는 것이 있습니다. Cloudflare는 일부 스크립트를 **엣지에서 HTML에 주입**하므로 `dist`에도 저장소에도 흔적이 없고, `Accept: text/html` 과 브라우저 User-Agent 로 요청해야만 드러납니다.

```sh
pnpm verify:live                 # https://bldnex.com
pnpm verify:live https://...     # 다른 주소
```

확인 항목:

1. **외부 출처** — 실제 요청을 유발하는 것만 셉니다(`script`/`img`/`iframe`/`link[rel]`/CSS `url()`). `<a href>` 는 누르기 전까지 요청이 없으므로 제외합니다.
2. **공개 수치 대조** — 홈이 "외부 요청 0건"이라고 공개하는데 외부 출처가 있으면 실패합니다.
3. **개인정보처리방침 대조** — "분석 도구 미사용"이라고 적고 있는데 외부 출처가 있으면 실패합니다.
4. **주소 정규화** — canonical 주소 200, `/about/` 308, 없는 주소 404.
5. **보안 헤더** — `nosniff`, `X-Frame-Options`.

### Web Analytics 는 켜지 않습니다

2026-10-05 공개 직후 Cloudflare Web Analytics 비컨(`static.cloudflareinsights.com`)이 9개 페이지 전부에 주입되고 있었습니다. 홈 스탬프와 `/works/bldnex-website` 의 "외부 요청 0건", 개인정보처리방침의 "방문 분석 도구는 사용하지 않습니다"가 모두 사실이 아닌 상태였습니다. 2026-10-06 비활성화해 해소했습니다.

방문 통계는 **Cloudflare zone Analytics(엣지 집계)** 로 봅니다. 도메인이 프록시를 통하므로 비컨 없이 요청 수·인기 경로·유입 referrer·국가·브라우저·상태 코드를 얻을 수 있고, 방문자 브라우저로 아무것도 보내지 않습니다. 호스팅 제공자의 접속 로그는 이미 개인정보처리방침의 제3자 제공 항목에 적혀 있어 문구를 고칠 필요가 없습니다.

비컨이 주는 것 중 포기하는 것은 **Core Web Vitals(LCP·INP·CLS)** 와 화면 해상도입니다. 성능 지표가 필요하면 Google Search Console 의 CrUX 데이터로 대체합니다.

다시 켜려면 홈 스탬프 수치, `/works/bldnex-website` 설명, 개인정보처리방침 세 곳을 함께 고쳐야 합니다. `pnpm verify:live` 가 이 불일치를 막습니다.

## 404 — 반드시 404.html 이 있어야 합니다

Cloudflare Pages 는 정적 자산에 매칭되지 않는 요청에 `dist/404.html` 을 **404 상태**로 돌려줍니다. 이 파일이 없으면 **모든 없는 주소가 홈 HTML 을 200 으로 반환**합니다(소프트 404). 검색엔진이 오타 주소와 끊긴 외부 링크를 전부 중복 페이지로 수집하게 됩니다.

2026-10-05 공개 직후 실제로 이 상태였고(`/nonexistent-xyz` → 200), `src/pages/404.astro` 를 추가해 해소했습니다. `check-site.mjs` 가 `404.html` 존재·noindex·사이트맵 제외·제목 중복·내부 링크 유효성을 확인합니다.

404 페이지는 공개 페이지 수에 넣지 않습니다. `measure-site.mjs` 가 라우트를 셀 때 `404.html` 과 관리자 셸을 제외합니다.

## 응답 헤더

`public/_headers`에서 관리하며 빌드 때 `dist`로 복사됩니다. 배포본에서 적용을 확인했습니다.

Functions 응답에는 `_headers`를 의존하지 않습니다. 문의/관리자 API와 관리자 HTML에는 `server/http.ts`가 `no-store`, `nosniff`, `X-Frame-Options: DENY`, `no-referrer`, `X-Robots-Tag`를 설정합니다. `_routes.json`은 `/api/*`와 `/admin*`만 Functions로 보냅니다.

| 경로 | 헤더 |
| --- | --- |
| `/*` | `nosniff`, `Referrer-Policy`, `X-Frame-Options: DENY`, HSTS 1년 |
| `/_astro/*` | `max-age=31536000, immutable` (파일명에 내용 해시가 있어 안전) |
| `/assets/fonts/*` | `max-age=2592000` (30일) |
| `/assets/brand/og-*.png` | `max-age=86400` (크롤러 재수집 고려) |

## wrangler 주의점

`wrangler 4.147`은 `pages project create`를 새 Workers 정적 자산 방식으로 위임하려다 실패합니다. **최초 생성 때만** `--force`로 기존 Pages 경로를 썼습니다.

```sh
npx wrangler pages project create bldnex-website --production-branch main --force
```

프로젝트가 이미 있으므로 **이후 명령에는 `--force`를 붙이지 않습니다.**

## 배포 전 점검

- `pnpm test` 통과 (공개 9페이지, 내부 참조 308개, 폰트 커버리지, 실측 수치 일치 등)
- 현재 문의 변경: 공개 9페이지 + 관리자 셸 1개, 서버/브라우저 검수 별도. 실제 접수는 운영 연결·방침 검토 후에만 활성화합니다.
- 개인정보처리방침은 현재 `noindex` + sitemap 제외 + 푸터 "(준비 중)" 유지 상태입니다. 법률 검토 후 [방침 해제](roadmap.md)를 함께 진행합니다.
- PreviewLog는 공개 배포 상태가 확인되지 않아 외부 링크·다운로드를 노출하지 않습니다.

## 롤백

대시보드의 **Deployments**에서 이전 배포의 **Rollback**을 누릅니다. 배포마다 고유 URL(`<해시>.bldnex-website.pages.dev`)이 남아 있어 비교한 뒤 되돌릴 수 있습니다.

문의 도입 후에는 먼저 `CONTACT_ENABLED=false`로 신규 접수를 닫습니다. 롤백은 D1 데이터·예약 Worker를 되돌리거나 삭제하지 않습니다. 기존 문의 관리와 만료 파기는 계속해야 합니다. 원격 DB를 임의 초기화하지 않습니다.
