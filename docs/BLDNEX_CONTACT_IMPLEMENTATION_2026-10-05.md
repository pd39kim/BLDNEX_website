# 문의 접수 구현·운영 연결 초안

작성·갱신: 2026-10-05 · 상태: **구현·검증 및 운영 연결 완료 / Pages·Worker 배포 완료 / 운영 접수 활성**

사용자의 구현 지시에 따라 [접수 계획](BLDNEX_CONTACT_FORM_PLAN_2026-10-05.md)을 구현했습니다. 후속 “제안대로 진행 후 커밋, 푸시, 빌드” 지시로 관리자·Resend 사용·보관 기준을 확정하고 D1/Turnstile, Access, 발신 도메인, 운영 Worker 연결을 완료했습니다. 현재 Pages는 Direct Upload이므로 Git 푸시가 자동 배포를 유발하지 않습니다.

## 1. 지금 확인할 화면

- 문의 폼: http://127.0.0.1:8788/contact (`pnpm contact:dev` 실행 시)
- 기존 Astro 개발 화면: http://localhost:4321/contact (UI만 제공, Functions API 없음)
- 관리자: `/admin/inquiries`. Pages에서는 인증 설정이 없으면 화면·API 모두 차단합니다. 테스트용 인증 우회 코드는 없습니다.
- 개인정보 개정 초안: `/privacy`

준비 상태에서는 제출 버튼이 비활성이고 이메일 문의를 안내합니다. 브라우저 테스트의 가상 성공 응답을 실제 접수로 취급하지 않습니다.

실제 배포 확인: `https://bldnex.com/contact` 200, `/api/contact/config`는 `enabled:true`와 운영 Turnstile 사이트 키를 반환하며, `/admin/inquiries`는 Cloudflare Access 로그인으로 리다이렉트됩니다. 운영 Worker가 `system_health.jobs`를 기록하는 것도 확인했습니다. 실제 Gmail 도착 여부와 스테이징 실접수는 별도 검수 대상입니다.

## 2. 구현 범위

```text
문의 작성 + 필수/선택 동의
    ↓ 서버 검증 · 보안 확인 · 요청 제한
D1 트랜잭션: 문의 원문 + 알림 작업 저장
    ├─ 접수번호 반환 → 화면 완료
    ├─ Access 인증 관리자 → 조회·상태·삭제
    └─ 예약 Worker → Resend → 대표 Gmail (운영 연결 필요)
```

- 폼: 프로젝트 유형, 예산, 일정, 내용, 이름, 이메일. 회사·팀과 전화번호는 선택입니다.
- 선택정보는 별도 선택 동의를 받습니다. 비워두면 선택 동의 없이 접수할 수 있습니다.
- 필수 동의는 기본 미선택이며 버전·서버 시각을 저장합니다. 마케팅 동의는 없습니다.
- 검증: 필드 오류·첫 오류 포커스, 글자 수, 이메일/문자/길이 검증, 본문 최대 24,000바이트.
- 보안: Turnstile 서버 검증, 호스트·action 검증, honeypot, 동일 출처 제한, D1 요청 제한.
- 중복 방지: 요청 UUID의 해시를 고유 키로 저장합니다. 같은 키·같은 입력은 같은 접수번호, 다른 입력은 409입니다.
- 응답이 불확실하면 입력을 잠그고 동일 원문·동일 키로 재시도합니다. 이미 저장됐으면 사용된 CAPTCHA 토큰 없이도 접수번호를 다시 받습니다.
- 입력값을 localStorage·sessionStorage에 저장하지 않습니다. 새로고침/이탈 시 사라지며 작성 중 이탈 경고가 있습니다.
- 메일 장애는 접수 성공을 취소하지 않습니다. 알림 작업은 DB에 남습니다.
- 첨부파일, 고객 계정/조회, 고객 자동 회신, 자동 견적, 분석/광고 도구는 제외했습니다.

## 3. 실제 화면 원고

| 위치 | 문구 |
| --- | --- |
| 제목 | 프로젝트에 대해 알려주세요. |
| 설명 | 만들고 싶은 것과 현재 상황을 적어주세요. 구체적인 기획서가 없어도 괜찮습니다. |
| 준비 상태 | 온라인 접수는 아직 준비 중이거나 일시 중지된 상태입니다. 지금은 이메일로 문의해주세요. 입력 중인 내용은 이 화면에 남아 있습니다. |
| 활성 상태 | 사이트에서 바로 접수할 수 있습니다. 저장이 완료되면 이 화면에 접수번호가 표시됩니다. |
| 제출 | 프로젝트 문의 보내기 ↗ |
| 전송 중 | 문의를 보내는 중입니다… |
| 완료 | 프로젝트 문의가 접수되었습니다. |
| 완료 설명 | 보내주신 내용을 확인한 뒤 입력하신 이메일로 연락드리겠습니다. |
| 접수번호 안내 | 이 화면의 접수번호를 보관해주세요. 접수 확인 메일은 별도로 발송하지 않습니다. |
| 결과 불확실 | 접수 결과를 확인하지 못했습니다. 입력 내용을 유지하고 있습니다. 아래 버튼으로 같은 문의의 접수 여부를 다시 확인해주세요. |
| 재확인 버튼 | 접수 확인·재시도 ↗ |
| 이메일 대안 | 이메일이 더 편하시다면. 폼을 이용하기 어렵거나 자료를 함께 보내고 싶다면 이메일로 연락해주세요. |

응답 소요 시간·무료 상담·확정 가격은 약속하지 않았습니다. 예산 선택지는 견적표가 아니라 상담 준비 항목입니다.

동의 고지 초안:

> 목적: 프로젝트 문의 접수·검토 및 답변
>
> 필수 항목: 이름, 이메일, 프로젝트 유형·예산·일정·내용, 동의 기록
>
> 보관 기간: 처리 종료 후 1년 / 미종결 문의는 접수 후 최대 2년
>
> 필수 동의를 거부할 수 있으나 온라인 접수는 제한됩니다. 선택정보는 제공하지 않아도 문의할 수 있습니다.

선택 항목은 회사·팀, 연락처이며 목적·보관 기간은 필수 항목과 동일하게 제안했습니다. 개인정보 관련 문구는 운영·법률 검토 전 초안입니다. 동의 고지의 목적·항목·기간·거부 안내는 [개인정보 보호법 제15조](https://www.law.go.kr/LSW/lsLinkCommonInfo.do?chrClsCd=010202&lsJoLnkSeq=1033214947)를 참고했으며, 이것만으로 적법성 검토가 끝난 것은 아닙니다.

## 4. 승인된 결정과 남은 연결

| 결정 | 값 | 상태 |
| --- | --- | --- |
| 관리자 | `BLDNEX.DEV@GMAIL.COM`, `pd39kim@gmail.com` 허용 | 승인, Access 정책과 `ADMIN_EMAILS` 반영 |
| 발송 서비스 | Resend, `notifications@notify.bldnex.com` 발신 | 서비스 선택 승인. 계정 연결·도메인 인증·API 키 등록 대기 |
| 알림 수신 | `BLDNEX.DEV@GMAIL.COM` | 승인, `NOTIFY_TO` 반영 |
| 폼 보관 | 처리 종료 후 365일, 미종결은 접수 후 최대 730일 | 승인, 화면·방침·서버 동일 값 반영 |
| 개정 방침 | 실제 공급자/국외 이전/백업·메일 삭제 범위/시행일 확정 | 검토 전, noindex 유지 |

기존 책임자·주소·이메일 방침 시행일은 변경하거나 재질문하지 않았습니다. 비밀 키를 채팅이나 저장소에 넣지 않습니다.

### 원격 준비 결과

| 환경 | D1 이름 / ID | Turnstile 공개 사이트 키 / 허용 호스트 |
| --- | --- | --- |
| 운영 | `bldnex-contact-production` / `5028c5cb-3bd2-4d83-a228-4fe5b2b7adf3` | `0x4AAAAAAFOIqbFEGmqDXJKm` / `bldnex.com` |
| 검수 | `bldnex-contact-staging` / `7a84b42d-6620-4c93-ad1f-7a034d5a41b9` | `0x4AAAAAAFOI0E6VVZNyt2v8` / `staging.bldnex-website.pages.dev` |

- 기존 계정 `95ea5a60382544303b01bb3210df93a2`에 새 문의 전용 DB만 생성했습니다. 다른 프로젝트 DB는 변경하지 않았습니다.
- 두 환경 모두 `0001_contact.sql`, `0002_notification_revision.sql` 적용 완료. 읽기 전용 조회로 테이블·마이그레이션 2개·문의 0건을 확인했습니다. 원격 DB에 가상 문의를 넣지 않았습니다.
- D1 생성의 APAC 옵션은 위치 힌트이며 특정 국가 내 처리/보관 보증으로 취급하지 않습니다.
- Pages의 `production`/`preview`에 각각 `TURNSTILE_SECRET_KEY`, 독립된 랜덤 `RATE_LIMIT_SECRET`을 등록했습니다. 값은 문서·Git·채팅에 기록하지 않았습니다. 사이트 키와 DB ID는 공개 설정입니다.
- Turnstile은 managed 모드이며 호스트를 환경별로 제한했습니다. 실제 브라우저 검증은 운영 연결 후 별도 수행합니다.
- 검수 호스트는 `staging` 브랜치 배포에 사용할 예정이며 아직 배포하지 않았습니다. 임의 해시 URL이나 다른 preview 브랜치를 이 설정으로 접수 활성화하지 않습니다.
- `wrangler.toml`의 기본 DB는 로컬 전용, `env.production`/`env.preview`는 각각 위 원격 DB입니다. 예약 Worker는 기본 운영/`env.staging` 검수이며 모두 OFF입니다.
- Resend 대시보드에서 발송 전용 권한의 `bldnex-contact-jobs` 키를 생성해 운영·검수 Worker에 `RESEND_API_KEY`로 등록했습니다. 키 값은 문서·Git·채팅에 기록하지 않았습니다. 발신 도메인 `notify.bldnex.com`과 DKIM/CNAME 인증 상태를 확인했습니다.
- Cloudflare Access 앱 `BLDNEX Contact Admin`을 `/admin/inquiries`와 관리자 API 경로에 연결하고 `BLDNEX.DEV@GMAIL.COM`만 허용했습니다. `ACCESS_TEAM_DOMAIN`/`ACCESS_AUD`는 운영 Pages 변수에 반영했습니다.
- 운영 Pages의 `CONTACT_POLICY_APPROVED`는 `contact-2026-10-05-v1`로 반영했습니다. 이는 구현 승인 버전이며 공급자 처리·국외 이전·복원/삭제·개정 시행일에 대한 법률 검토 완료를 뜻하지 않습니다.

## 5. 관리자 동작

- 인증: Access JWT의 **서명·issuer·audience·만료**를 검증하고 이메일 허용 목록을 다시 검사합니다. 헤더가 있다는 이유만으로 통과시키지 않습니다. [Cloudflare JWT 검증](https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/authorization-cookie/validating-json/)
- 목록은 최근 순 50건, 상태 필터와 다음 페이지가 있습니다. 목록에는 상세 원문·이메일을 노출하지 않습니다.
- 상세에서 원문·연락처·동의·파기 예정일·알림 상태·처리 기록을 확인합니다.
- 상태: 새 문의 → 검토 중 → 연락 완료 → 처리 종료. 종료 이전 상태 간 이동은 허용합니다. **처리 종료는 되돌리지 않습니다.** 반복 종료로 보관 기간이 늘어나지 않게 했습니다.
- 상태/알림 재시도는 버전 검사로 동시 수정을 보호합니다. 만료된 원문의 보관 기간을 늦은 상태 변경으로 연장할 수 없습니다.
- 삭제는 접수번호를 직접 입력해야 합니다. 발송 처리 중이면 끝난 뒤 다시 시도합니다.
- 원문을 HTML로 렌더링하지 않고 텍스트로 표시합니다. 동적 사용자 입력은 시스템 글꼴을 사용합니다.
- 로그인 쿠키는 Access가 관리합니다. 로컬 환경만을 위한 암호나 인증 우회는 없습니다.

## 6. 알림·재시도·파기 규칙

- 예약 Worker는 5분마다 실행, 한 번에 최대 10건을 처리합니다. 알림은 즉시 메일이 아니라 예약 처리입니다.
- 메일에는 접수번호·유형·시각·관리자 링크만 넣고 문의자 이름·이메일·전화·원문은 복사하지 않습니다. `reply_to`도 넣지 않습니다.
- 큐 작업에 고정된 메일 본문과 발송 키를 저장해 재시도 때 내용이 달라지지 않습니다.
- DB에서 작업을 원자적으로 가져오며 120초 임대와 10초 HTTP 시간 제한을 둡니다. 중단된 작업은 만료 후 재개합니다.
- 자동 재시도는 최대 8회, 최초 시도부터 23시간 이내. 간격은 2분부터 증가해 최대 1시간이며 실제 실행 시점은 5분 주기에 따릅니다.
- Resend의 중복 방지 유효 기간은 24시간입니다. 23시간 이후 수동 재시도는 **중복 메일 가능성 확인** 후 새 발송 키를 만듭니다. [Resend 전송 API](https://resend.com/docs/api-reference/emails/send-email)
- `provider_accepted`는 발송 서비스 승인이지 Gmail 도착 확인이 아닙니다. 반송/스팸 여부는 운영 검수에서 실제 확인해야 합니다.
- Worker가 15분 이상 동작 기록을 남기지 않으면 신규 접수를 비활성화합니다. 이 확인은 작업 실행 여부이지 메일 도착 보증이 아닙니다.
- 접수 OFF 상태에서도 예약 Worker는 원문·알림·요청 제한·감사 기록의 만료 삭제를 계속합니다.
- 문의 삭제 시 알림 작업은 FK cascade로 함께 삭제합니다. 내용 없는 감사 기록은 별도 365일 후 삭제합니다.
- IP/이메일 요청 제한 키는 비밀 키로 HMAC 처리하고 시간 버킷마다 달라집니다. 원문 IP는 별도 테이블에 저장하지 않습니다. 현재 제한은 IP당 10분에 10요청, 이메일당 1시간에 3접수, 전체 하루 200개 신규 접수 시도입니다.
- D1 원문 삭제가 Gmail·Resend·Cloudflare 백업의 동시 삭제를 뜻하지 않습니다. 해당 서비스의 보관 설정/수동 처리와 복구 사본 삭제 절차는 별도입니다.

## 7. 개발·검증 명령

Node 22.12 이상이 필요합니다. 이번 검증은 Node 26, Chrome에서 실행했습니다.

```sh
pnpm install
pnpm check
pnpm test                  # 로컬 workerd D1 테스트 + 빌드 + 정적 검수
pnpm contact:check         # Pages Functions + 운영/검수 Worker dry-run (배포 아님)
pnpm contact:migrate:local # 로컬 DB에만 마이그레이션
pnpm contact:dev           # http://127.0.0.1:8788 — 실제 접수 OFF
pnpm test:browser          # Chrome 필요. 서버가 없으면 자동 실행
```

- `pnpm dev`는 UI 편집용이며 Functions는 실행하지 않습니다.
- Pages dev는 별도 `--config` 경로를 받지 않습니다. `contact:dev`는 루트 설정과 **CLI 로컬 D1 바인딩**을 사용합니다. `wrangler.local.toml`은 로컬 마이그레이션·격리 테스트용입니다.
- 로컬 DB는 `.wrangler/state`에 저장됩니다. 테스트 DB는 `getPlatformProxy({persist:false, remoteBindings:false})`로 별도 메모리에 만들고 종료 시 폐기합니다. 실제 문의/운영 DB를 테스트에 연결하지 않습니다. [Wrangler 테스트 바인딩](https://developers.cloudflare.com/workers/wrangler/api/)
- 외부 Turnstile·Resend는 테스트 응답으로 대체합니다. 브라우저 성공 화면 검수도 가상 응답이며 실제 발송 검증과 구분합니다.

검수 범위:

- 서버 26개: D1 저장·원자성·중복·변조·입력 오류·요청 제한·CAPTCHA·JWT·CSRF·알림 장애·동시 실행·종료/파기·재시도 버전.
- 브라우저 12개: 활성/비활성·검증·선택 동의·중복 클릭·네트워크 불확실 재시도·실패 보존·JS 없음·CAPTCHA 장애·XSS 안전 표시·홈 번들 분리.
- 360 / 390 / 768 / 1440px 가로 넘침과 로고 36px/20px 확인, 390/1440 스크린샷 검수.
- 공개 9개 + 비공개 관리자 HTML 1개. 공개 메타·링크·폰트·사이트맵 기존 검사 유지.
- 실제 iOS/Android 기기, 운영 Access 로그인, 실제 Turnstile, Gmail 도착은 **미검증**입니다.

## 8. 실제 운영 연결 순서 — 완료 항목과 후속 작업

1. **사용자 선택 3개 승인 완료.** 개인정보 개정안의 나머지 항목은 검토해야 합니다. 향후 보관 기간을 바꾸면 `shared/contact.ts`, 화면/방침/문서, 동의 버전을 함께 변경합니다. 이미 저장된 데이터에는 별도 이관 판단이 필요합니다.
2. **운영/검수 D1 생성·마이그레이션 완료.** 후속 원격 작업 전에도 DB 이름·ID·계정을 재확인합니다. DB나 기존 Pages 프로젝트를 재생성하지 않습니다.
3. **Pages/Worker 환경별 `CONTACT_DB` 소스 설정 완료, 미배포.** 운영 DB는 preview에 상속시키지 않습니다. 비밀 키·공개 설정이 실제 배포 환경에 연결됐는지는 배포 후 다시 검수합니다.
4. **Turnstile 생성·호스트 제한·키 등록 완료, 실제 챌린지 미검증.** action은 `contact`. 테스트 키나 로컬 우회를 프로덕션에서 쓰지 않습니다.
5. **Resend 발송 전용 키 생성·Worker 비밀값 등록 완료.** `notify.bldnex.com` 발신 도메인 인증 상태를 확인합니다. 필요한 DNS 레코드는 기존 메일 수신 MX를 변경하지 않는 범위로 별도 확인·승인합니다.
6. Cloudflare Access 애플리케이션 한 개에 운영 호스트의 `/admin*`, `/api/admin/*`를 모두 보호하고 허용 이메일만 지정합니다. 같은 audience로 앱/서버를 맞춥니다. 개발·preview는 별도 정책/DB를 사용하거나 비활성 상태로 둡니다.
7. `.dev.vars.example`의 변수를 운영 설정으로 등록합니다. 비밀 키는 Pages/Worker 각각 필요한 곳에만 등록합니다. 파일을 커밋하거나 채팅에 붙이지 않습니다.
8. 개인정보 개정안의 공급자 처리 국가·연락처·항목·보관·이전 근거/거부·시행일을 확인합니다. 폼의 “초안” 표기와 고지 내용을 확정한 뒤 빌드의 `PUBLIC_CONTACT_POLICY_VERSION`과 서버의 `CONTACT_POLICY_APPROVED`를 확정 버전으로 맞춥니다. 단순히 환경변수만 켜서 검토를 대체하면 안 됩니다.
9. 접수 OFF 상태로 배포합니다. Access의 실제 로그인과 직접 URL/`.html`/Pages 기본 도메인/preview의 접근 제한을 확인합니다. Pages 장애 시 Functions를 우회해 정적 관리자 파일이 제공되지 않도록 fail-closed 설정도 확인합니다.
10. 예약 Worker에 `JOBS_ENABLED=true`, 발송 키를 넣고 배포합니다. `system_health` 갱신과 권한·만료 삭제를 확인합니다. 외부 실행 감시를 별도 설정합니다.
11. 사용자 동의하에 스테이징의 접수를 켜고 **테스트 문의 1건**을 접수해 DB·관리자·Gmail 받은편지함/스팸함·답변 경로를 확인합니다. 테스트 원문·알림과 실제 발송된 메일은 확인 뒤 삭제합니다.
12. `CONTACT_ENABLED=true`로 공개합니다. 변경 후 `/api/contact/config`와 정상/실패 UI를 다시 확인합니다. 호스트·www·기존 URL 형식은 변경하지 않습니다.

### 환경변수 구분

| 위치 | 값 |
| --- | --- |
| Pages 공개 설정 | `CONTACT_ENABLED`, `CONTACT_ORIGIN`, `CONTACT_POLICY_APPROVED`, `TURNSTILE_SITE_KEY`, `NOTIFY_FROM`, `NOTIFY_TO`, `ACCESS_TEAM_DOMAIN`, `ACCESS_AUD`, `ADMIN_EMAILS` |
| Pages 비밀 설정 | `TURNSTILE_SECRET_KEY`, `RATE_LIMIT_SECRET` (랜덤 32자 이상) |
| 예약 Worker | `JOBS_ENABLED`, `CONTACT_DB`, 비밀 설정 `RESEND_API_KEY` |
| Astro 빌드 | `PUBLIC_CONTACT_POLICY_VERSION` — 비밀 정보 아님, 검토 완료 표시용 |

Pages 요청은 메일을 직접 발송하지 않고 예약 Worker만 발송합니다. 발송 키는 Worker에만 둡니다. heartbeat는 작업 실행 기록일 뿐 발송 도메인 인증·Gmail 도착 검사 대신이 아닙니다.

## 9. 장애·삭제·복구 운영 초안

- 매 영업일 관리자 화면의 새 문의·알림 실패·예약 작업 갱신 시간을 확인합니다. 장애를 같은 메일 알림에만 의존해 탐지하지 않습니다.
- 메일 장애: 원문은 남습니다. 관리자에서 확인하고 발송 설정을 고친 뒤 재시도합니다.
- 접수 장애: `CONTACT_ENABLED=false`로 **서버와 화면 모두** 닫고 이메일 대안을 유지합니다. 기존 문의를 삭제하지 않습니다.
- 사이트 롤백: 문의 DB/예약 Worker는 독립적으로 남습니다. 기존 이메일 페이지로 롤백해도 파기 작업은 중단하지 않습니다.
- 개인정보 삭제 요청: 본인 확인 후 원문·대기 알림 삭제, 관련 상담 메일/발송 사본/백업 범위를 따로 확인합니다. 감사 로그에는 원문을 복사하지 않습니다.
- 복구: 오래된 DB를 곧바로 공개하지 않습니다. 외부에 따로 보관한 최소 삭제 이력과 보관 기준을 대조해 재삭제·만료 처리를 마친 뒤 재개합니다. 복구 절차/백업 보유기간 확정은 공개 전 필수입니다.
- 운영 키 유출 시 접수를 닫고 키 폐기·교체 및 접근 기록 검토를 먼저 합니다.

## 10. 소스 지도

| 경로 | 역할 |
| --- | --- |
| `shared/contact.ts` | 필드 선택지·공통 검증·동의 버전·보관 기간 |
| `src/components/ContactForm.astro`, `src/scripts/contact.ts` | 실제 폼·상태·재시도 UI |
| `functions/`, `server/` | Pages 라우팅, 인증, 저장, 관리자 API, 알림/파기 |
| `migrations/` | D1 원문·outbox·감사·요청 제한·heartbeat·동시성 버전 |
| `src/pages/admin/inquiries.astro`, `src/scripts/admin.ts` | 관리자 화면 |
| `workers/contact-jobs/` | 예약 실행 Worker와 비활성 배포 템플릿 |
| `tests/`, `playwright.config.mjs` | 로컬 D1 및 브라우저 회귀 테스트 |
| `src/data/privacy.ts` | 기존 운영값을 보존한 폼 개인정보 개정 초안 |

참고: [Pages Functions/D1 바인딩](https://developers.cloudflare.com/pages/functions/bindings/), [D1 트랜잭션 배치](https://developers.cloudflare.com/d1/worker-api/d1-database/), [Turnstile 서버 검증](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/). 실제 공급자 계정/설정 확인을 이 문서가 대신하지 않습니다.
