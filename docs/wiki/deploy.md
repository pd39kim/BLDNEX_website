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

**문의 기능 추가 후 현재 상태:** Pages Functions와 D1 마이그레이션이 포함된 Contact 화면을 `CONTACT_ENABLED=false` 상태로 배포했습니다. 2026-10-05 확인 시 `https://bldnex.com/contact`는 200, `/api/contact/config`는 `enabled:false`, `/admin/inquiries`는 Access 미설정으로 503 `admin_unconfigured`를 반환했습니다. 예약 Worker는 배포하지 않았습니다. 아래 명령만으로 DB·Access·메일·예약 작업이 자동으로 만들어지지는 않습니다. [운영 연결 순서](../BLDNEX_CONTACT_IMPLEMENTATION_2026-10-05.md)를 먼저 따라야 합니다.

운영/검수 D1 생성·마이그레이션, Turnstile과 Pages 비밀 키 등록, Resend 발송 전용 키의 Worker 비밀값 등록은 완료했습니다. Resend 발신 도메인 인증·Access·개정 방침·실제 수신 검증은 남아 있습니다. 루트 `wrangler.toml`의 기본 설정은 로컬 전용이며 `env.production`은 운영 DB, `env.preview`는 검수 DB입니다. Pages에는 `account_id`를 넣을 수 없습니다. Worker 설정의 `account_id`와는 다릅니다.

검수용 origin은 `https://staging.bldnex-website.pages.dev`로 예약했으며 아직 해당 브랜치를 배포하지 않았습니다. 임의 해시 preview URL은 이 호스트용 CAPTCHA/origin과 일치하지 않으므로 접수 검수에 사용하지 않습니다. DB 작업은 반드시 `--env production` 또는 `--env preview`와 대상 DB 이름을 명시합니다. `workers/contact-jobs/wrangler.toml`은 기본이 운영, `--env staging`이 검수 DB이며 두 환경 모두 예약 작업 OFF입니다.

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
