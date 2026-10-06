import { projectTypes, budgets, schedules, statuses, type Status } from '../../shared/contact';
const byId = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
const message = byId('admin-message');
const list = byId('inquiry-list');
const filter = byId<HTMLSelectElement>('status-filter');
const more = byId<HTMLButtonElement>('load-more');
const placeholder = byId('detail-placeholder');
const detailPanel = byId('inquiry-detail');
type Inquiry = { id: string; name: string; email: string; company: string; phone: string; project_type: keyof typeof projectTypes; budget: keyof typeof budgets; schedule: keyof typeof schedules; status: Status; version: number; description: string; created_at: number; purge_after: number; consent_version: string; consent_at: number; optional_consent: number; notification_state?: string };
type Notification = { state: string; attempts: number; first_attempt_at: number | null; error_code: string | null };
const notificationLabels: Record<string, string> = {
  pending: '관리자 알림 대기',
  processing: '관리자 알림 발송 중',
  retry: '관리자 알림 재시도 대기',
  provider_accepted: '관리자 메일 발송 완료',
  failed: '관리자 메일 발송 실패 · 확인 필요'
};
let cursor: string | null = null, current: Inquiry | null = null, notification: Notification | null = null, mutating = false;
let listGeneration = 0, detailGeneration = 0;
const date = (value: number) => new Date(value).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
class ApiError extends Error { constructor(public code: string, public status: number) { super(code); } }
async function api(path: string, method = 'GET', body?: unknown) {
  const response = await fetch(path, { method, credentials: 'same-origin', cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(15000),
    ...(body === undefined ? {} : { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }),
  });
  const result = await response.json();
  if (!response.ok) throw new ApiError(result.error ?? 'unavailable', response.status);
  return result;
}
function report(error: unknown) {
  if (error instanceof ApiError && [401, 403].includes(error.status)) message.textContent = '관리자 인증이 필요하거나 접근 권한이 없습니다. 로그인 상태와 허용 계정을 확인해 주세요.';
  else if (error instanceof ApiError && error.code === 'admin_unconfigured') message.textContent = '관리자 인증 설정이 아직 완료되지 않았습니다. 운영 계정과 Cloudflare Access 연결 후 사용할 수 있습니다.';
  else if (error instanceof ApiError && error.status === 409) message.textContent = '다른 처리와 겹쳤거나 이미 종료·발송된 문의입니다. 새로고침 후 다시 확인해 주세요.';
  else message.textContent = '요청 결과를 확인하지 못했습니다. 새로고침해 현재 상태를 확인한 뒤 다시 시도해 주세요.';
  message.focus();
}
function closeDetail() {
  current = null;
  detailGeneration++;
  detailPanel.hidden = true;
  if (placeholder) placeholder.hidden = false;
  list.querySelectorAll('button').forEach((button) => button.setAttribute('aria-pressed', 'false'));
  history.replaceState(null, '', location.pathname);
  if (window.innerWidth <= 850) {
    list.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
async function loadList(append = false) {
  const generation = ++listGeneration;
  more.disabled = true;
  try {
    const query = new URLSearchParams({ status: filter.value });
    if (append && cursor) query.set('cursor', cursor);
    const result = await api(`/api/admin/inquiries?${query}`);
    if (generation !== listGeneration) return;
    if (!append) list.replaceChildren();
    for (const item of result.items as Inquiry[]) {
      const li = document.createElement('li'), button = document.createElement('button');
      button.type = 'button'; button.dataset.id = item.id;
      button.setAttribute('aria-pressed', String(current?.id === item.id));

      const header = document.createElement('div');
      header.className = 'inquiry-item-header';
      const title = document.createElement('strong');
      title.textContent = `${item.name} · ${projectTypes[item.project_type]}`;
      const badge = document.createElement('span');
      badge.className = 'status-badge';
      badge.dataset.status = item.status;
      badge.textContent = statuses[item.status];
      header.append(title, badge);

      const meta = document.createElement('div');
      meta.className = 'inquiry-item-meta';
      const dateSpan = document.createElement('span');
      dateSpan.textContent = date(item.created_at);
      const mailSpan = document.createElement('span');
      mailSpan.textContent = notificationLabels[item.notification_state ?? ''] ?? '알림 상태 미확인';
      meta.append(dateSpan, mailSpan);

      button.append(header, meta);
      button.addEventListener('click', () => { if (!mutating) void loadDetail(item.id); });
      li.append(button); list.append(li);
    }
    cursor = result.nextCursor; more.hidden = !cursor;
    message.textContent = list.children.length ? `${list.children.length}건의 문의를 표시합니다.` : '아직 접수된 문의가 없습니다.';
    const heartbeat = result.health?.checked_at;
    byId('admin-health').textContent = `예약 작업: ${heartbeat ? date(heartbeat) : '실행 기록 없음'}${!heartbeat || Date.now() - heartbeat > 900_000 ? ' · 작동 확인 필요' : ''} / 알림 실패 ${result.failed}건`;
  } catch (error) { if (generation === listGeneration) report(error); }
  finally { if (generation === listGeneration) more.disabled = false; }
}
async function loadDetail(id: string) {
  const generation = ++detailGeneration;
  try {
    const result = await api(`/api/admin/inquiries/${encodeURIComponent(id)}`);
    if (generation !== detailGeneration) return;
    current = result.inquiry; notification = result.notification;
    const inquiry = current!;
    if (placeholder) placeholder.hidden = true;
    byId('detail-receipt').textContent = inquiry.id;

    const badge = byId('detail-status-badge');
    if (badge) {
      badge.dataset.status = inquiry.status;
      badge.textContent = statuses[inquiry.status];
    }
    const feedback = byId('status-save-feedback');
    if (feedback) feedback.textContent = '';

    const fields: [string, string][] = [
      ['이름', inquiry.name], ['이메일', inquiry.email], ['회사 · 팀', inquiry.company || '미입력'], ['연락처', inquiry.phone || '미입력'],
      ['프로젝트', projectTypes[inquiry.project_type]], ['예산', budgets[inquiry.budget]], ['일정', schedules[inquiry.schedule]],
      ['접수', date(inquiry.created_at)], ['파기 예정', date(inquiry.purge_after)], ['필수 동의', `${inquiry.consent_version} / ${date(inquiry.consent_at)}`], ['선택 동의', inquiry.optional_consent ? '동의' : '동의하지 않음'],
    ];
    byId('detail-fields').replaceChildren(...fields.map(([label, value]) => {
      const row = document.createElement('div'), dt = document.createElement('dt'), dd = document.createElement('dd');
      dt.textContent = label; dd.textContent = value; row.append(dt, dd); return row;
    }));
    byId('detail-description').textContent = inquiry.description;
    byId<HTMLSelectElement>('detail-status').value = inquiry.status;
    byId<HTMLSelectElement>('detail-status').disabled = inquiry.status === 'closed';
    byId<HTMLButtonElement>('save-status').disabled = inquiry.status === 'closed';
    byId('detail-notification').textContent = notification ? `관리자 알림: ${notificationLabels[notification.state]} / 시도 ${notification.attempts}회${notification.error_code ? ` / ${notification.error_code}` : ''}` : '관리자 알림 작업 없음';
    byId<HTMLButtonElement>('retry-notification').disabled = !notification || ['provider_accepted', 'processing'].includes(notification.state);
    byId('detail-audit').replaceChildren(...(result.audit as { actor: string; action: string; created_at: number }[]).map((event) => {
      const li = document.createElement('li'); li.textContent = `${date(event.created_at)} / ${event.actor} / ${event.action}`; return li;
    }));
    detailPanel.hidden = false; detailPanel.focus();
    list.querySelectorAll('button').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.id === id)));
    history.replaceState(null, '', `${location.pathname}?id=${encodeURIComponent(id)}`);
    if (window.innerWidth <= 850) {
      detailPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  } catch (error) { report(error); }
}
async function change(action: 'status' | 'retry' | 'delete') {
  if (!current || mutating) return;
  const id = current.id;
  let body: Record<string, unknown>, method: string, suffix: string;
  if (action === 'status') {
    const status = byId<HTMLSelectElement>('detail-status').value as Status;
    if (status === 'closed' && !confirm('처리를 종료할까요? 종료는 되돌릴 수 없으며 이 시점부터 1년 후 파기됩니다.')) return;
    body = { status, version: current.version }; method = 'PATCH'; suffix = '/status';
    const feedback = byId('status-save-feedback');
    if (feedback) feedback.textContent = '상태 저장 중…';
  } else if (action === 'retry') {
    const expired = notification?.first_attempt_at != null && Date.now() - notification.first_attempt_at >= 23 * 3_600_000;
    if (!confirm(expired ? '이전 발송의 중복 방지 기간이 지났습니다. 관리자 알림이 중복 수신될 수 있음을 확인하고 다시 발송할까요?' : '관리자 알림 메일을 다시 발송할까요?')) return;
    body = { acknowledgeDuplicateRisk: expired }; method = 'POST'; suffix = '/retry';
  } else {
    const confirmed = prompt(`문의를 삭제하면 되돌릴 수 없습니다. 삭제하려면 아래 접수번호를 그대로 입력해 주세요.\n${id}`);
    if (confirmed !== id) return;
    body = { confirmId: confirmed }; method = 'DELETE'; suffix = '';
  }
  mutating = true;
  detailPanel.setAttribute('aria-busy', 'true');
  try {
    await api(`/api/admin/inquiries/${id}${suffix}`, method, body);
    if (action === 'delete') {
      closeDetail();
    } else {
      await loadDetail(id);
      if (action === 'status') {
        const savedStatus = (body as { status: Status }).status;
        const feedback = byId('status-save-feedback');
        if (feedback) {
          feedback.textContent = `✓ 상태가 '${statuses[savedStatus]}'(으)로 저장되었습니다.`;
          feedback.classList.remove('flash');
          void feedback.offsetWidth;
          feedback.classList.add('flash');
        }
      }
    }
    await loadList();
    message.textContent = action === 'delete' ? '데이터베이스의 문의와 대기 알림을 삭제했습니다.' : '요청을 반영했습니다.';
  } catch (error) { report(error); }
  finally { mutating = false; detailPanel.removeAttribute('aria-busy'); }
}
byId('save-status').addEventListener('click', () => void change('status'));
byId('retry-notification').addEventListener('click', () => void change('retry'));
byId('delete-inquiry').addEventListener('click', () => void change('delete'));
byId('close-detail')?.addEventListener('click', closeDetail);
filter.addEventListener('change', () => void loadList());
byId('admin-refresh').addEventListener('click', async () => { if (!mutating) { await loadList(); if (current) await loadDetail(current.id); } });
more.addEventListener('click', () => void loadList(true));
void loadList().then(() => { const id = new URLSearchParams(location.search).get('id'); if (id && /^BN-[0-9a-f-]{36}$/.test(id)) void loadDetail(id); });
