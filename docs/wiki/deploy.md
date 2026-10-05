# 배포 — Cloudflare Pages

최종 갱신: 2026-10-05

## 현재 상태

| 항목 | 값 |
| --- | --- |
| 프로젝트 | `bldnex-website` |
| 계정 | pd39kim@gmail.com (`95ea5a60382544303b01bb3210df93a2`) |
| 프로덕션 브랜치 | `main` |
| 배포 URL | https://bldnex-website.pages.dev |
| 공개 주소 | **https://bldnex.com** (연결 완료) |
| www | apex로 301 리다이렉트 |
| 도메인 네임서버 | 이미 Cloudflare (`thaddeus` / `norah`.ns.cloudflare.com) |

## 배포하기

```sh
pnpm test                       # 빌드 + 전체 검사 (실패하면 배포하지 않습니다)
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

- `pnpm test` 통과 (9페이지, 내부 참조 306개, 폰트 커버리지, 실측 수치 일치 등)
- 개인정보처리방침은 현재 `noindex` + sitemap 제외 + 푸터 "(준비 중)" 유지 상태입니다. 법률 검토 후 [방침 해제](roadmap.md)를 함께 진행합니다.
- PreviewLog는 공개 배포 상태가 확인되지 않아 외부 링크·다운로드를 노출하지 않습니다.

## 롤백

대시보드의 **Deployments**에서 이전 배포의 **Rollback**을 누릅니다. 배포마다 고유 URL(`<해시>.bldnex-website.pages.dev`)이 남아 있어 비교한 뒤 되돌릴 수 있습니다.
