import { POLICY_VERSION, validateContact, type ContactInput, type FieldErrors } from '../../shared/contact';

interface Turnstile {
  render(container: HTMLElement, options: Record<string, unknown>): string;
  reset(id: string): void;
}
declare global { interface Window { turnstile?: Turnstile } }
const form = document.querySelector<HTMLFormElement>('#project-inquiry')!;
const fields = form.querySelector<HTMLFieldSetElement>('fieldset')!;
const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
const notice = document.querySelector<HTMLElement>('#intake-notice')!;
const status = document.querySelector<HTMLElement>('#form-status')!;
const retryConfig = document.querySelector<HTMLButtonElement>('.config-retry')!;
const textarea = form.querySelector<HTMLTextAreaElement>('#description')!;
let token = '', widget: string | undefined, enabled = false, busy = false, saved = false;
let pending: { key: string; data: ContactInput; website: string } | undefined;
let scriptPromise: Promise<void> | undefined;

function showErrors(errors: FieldErrors) {
  form.querySelectorAll('.field-error').forEach((node) => { node.textContent = ''; });
  form.querySelectorAll('[aria-invalid]').forEach((node) => node.removeAttribute('aria-invalid'));
  for (const [key, error] of Object.entries(errors)) {
    const message = document.getElementById(`error-${key}`);
    if (message) message.textContent = error ?? '';
    document.getElementById(key)?.setAttribute('aria-invalid', 'true');
  }
  const first = Object.keys(errors)[0];
  if (first) document.getElementById(first)?.focus();
}
function clearError(key: string) {
  const message = document.getElementById(`error-${key}`);
  if (message) message.textContent = '';
  document.getElementById(key)?.removeAttribute('aria-invalid');
  if (!form.querySelector('.field-error:not(:empty)')) {
    if (status.textContent === '표시된 항목을 확인해 주세요.') status.textContent = '';
  }
}
function clearResolvedErrors() {
  const activeErrors = form.querySelectorAll<HTMLElement>('.field-error:not(:empty)');
  if (!activeErrors.length) return;
  const values = new FormData(form);
  const { errors } = validateContact({
    ...Object.fromEntries(values),
    consent: values.has('consent'),
    optionalConsent: values.has('optionalConsent'),
  });
  activeErrors.forEach((node) => {
    const key = node.id.replace(/^error-/, '');
    if (!errors[key as keyof ContactInput]) clearError(key);
  });
}
function loadTurnstile() {
  if (window.turnstile) return Promise.resolve();
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    const timer = window.setTimeout(() => { script.remove(); scriptPromise = undefined; reject(new Error()); }, 12000);
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.onload = () => { clearTimeout(timer); resolve(); };
    script.onerror = () => { clearTimeout(timer); script.remove(); scriptPromise = undefined; reject(new Error()); };
    document.head.append(script);
  });
  return scriptPromise;
}
function resetChallenge() { token = ''; if (widget !== undefined) window.turnstile?.reset(widget); }
async function configure() {
  enabled = false; submit.disabled = true; retryConfig.hidden = true;
  try {
    const response = await fetch('/api/contact/config', { cache: 'no-store', signal: AbortSignal.timeout(6000) });
    const config = await response.json();
    if (!response.ok || !config.enabled || config.policyVersion !== POLICY_VERSION || !config.siteKey) {
      notice.textContent = '온라인 접수는 아직 준비 중이거나 일시 중지된 상태입니다. 지금은 이메일로 문의해 주세요. 입력 중인 내용은 이 화면에 남아 있습니다.';
      retryConfig.hidden = false; return;
    }
    await loadTurnstile();
    if (!window.turnstile) throw new Error();
    if (widget === undefined) widget = window.turnstile.render(document.getElementById('contact-challenge')!, {
      sitekey: config.siteKey, action: 'contact', theme: 'dark', size: 'flexible',
      callback: (value: string) => { token = value; submit.disabled = busy; },
      'expired-callback': () => { token = ''; },
      'error-callback': () => { token = ''; status.textContent = '보안 확인을 완료하지 못했습니다. 연결을 다시 확인하거나 이메일로 문의해 주세요.'; retryConfig.hidden = false; },
    });
    else resetChallenge();
    enabled = true; submit.disabled = false;
    notice.textContent = '사이트에서 바로 접수할 수 있습니다. 저장이 완료되면 이 화면에 접수번호가 표시됩니다.';
  } catch {
    notice.textContent = '온라인 접수 연결을 확인하지 못했습니다. 연결을 다시 확인하거나 이메일로 문의해 주세요.';
    retryConfig.hidden = false;
  }
}
const projectTypeSelect = form.querySelector<HTMLSelectElement>('#projectType');
const typeChips = form.querySelectorAll<HTMLButtonElement>('.chip-btn');
function syncChips(val: string) {
  typeChips.forEach((btn) => {
    btn.setAttribute('aria-pressed', btn.dataset.value === val ? 'true' : 'false');
  });
}
typeChips.forEach((btn) => {
  btn.addEventListener('click', () => {
    if (!projectTypeSelect) return;
    const targetVal = btn.dataset.value || '';
    projectTypeSelect.value = projectTypeSelect.value === targetVal ? '' : targetVal;
    syncChips(projectTypeSelect.value);
    projectTypeSelect.dispatchEvent(new Event('change', { bubbles: true }));
  });
});
projectTypeSelect?.addEventListener('change', () => {
  syncChips(projectTypeSelect.value);
});
function applyPreselectedType() {
  const params = new URLSearchParams(window.location.search);
  const rawType = params.get('type') || params.get('projectType');
  if (!rawType || !projectTypeSelect) return;
  const clean = rawType.toLowerCase().trim();
  let mapped = '';
  if (clean === 'website' || clean === 'websites') mapped = 'website';
  else if (clean === 'webapp' || clean === 'web-apps' || clean === 'web-app' || clean === 'webapps') mapped = 'webapp';
  else if (clean === 'mobile' || clean === 'mobile-apps' || clean === 'mobile-app' || clean === 'mobileapps') mapped = 'mobile';
  else if (clean === 'other') mapped = 'other';
  if (mapped && projectTypeSelect) {
    projectTypeSelect.value = mapped;
    syncChips(mapped);
    clearError('projectType');
    const targetCard = document.getElementById('inquiry') || form;
    targetCard?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
applyPreselectedType();
window.addEventListener('popstate', applyPreselectedType);
textarea.addEventListener('input', () => { document.getElementById('description-count')!.textContent = `${textarea.value.length.toLocaleString('ko-KR')} / 5,000`; });
form.addEventListener('input', clearResolvedErrors);
form.addEventListener('change', clearResolvedErrors);
retryConfig.addEventListener('click', configure);
window.addEventListener('beforeunload', (event) => {
  if (!saved && (pending || textarea.value.trim())) event.preventDefault();
});
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (busy || !enabled || saved) return;
  if (!pending) {
    const values = new FormData(form);
    const { data, errors } = validateContact({ ...Object.fromEntries(values), consent: values.has('consent'), optionalConsent: values.has('optionalConsent') });
    showErrors(errors);
    if (Object.keys(errors).length) { status.textContent = '표시된 항목을 확인해 주세요.'; return; }
    if (!token) { status.textContent = '보안 확인이 완료될 때까지 잠시 기다려 주세요.'; resetChallenge(); return; }
    // The honeypot remains in the DOM for direct/bot requests, but browser autofill
    // must not turn an otherwise valid human submission into a false positive.
    pending = { key: crypto.randomUUID(), data, website: '' };
  }
  // Freeze the snapshot after submission: ambiguous failures must retry identical data with the same key.
  fields.disabled = true; busy = true; submit.disabled = true;
  form.setAttribute('aria-busy', 'true');
  submit.textContent = '문의를 보내는 중입니다…';
  status.textContent = '';
  let fieldValidationFailed = false;
  try {
    const response = await fetch('/api/contact', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Idempotency-Key': pending.key },
      body: JSON.stringify({ ...pending.data, website: pending.website, token }), signal: AbortSignal.timeout(20000),
    });
    const result = await response.json();
    if (response.ok && typeof result.receipt === 'string' && /^BN-[0-9a-f-]{36}$/.test(result.receipt)) {
      saved = true;
      form.hidden = true;
      notice.hidden = true;
      retryConfig.hidden = true;
      document.getElementById('inquiry-receipt')!.textContent = result.receipt;
      const success = document.getElementById('inquiry-success')!;
      success.hidden = false; success.focus();
      return;
    }
    if (response.status === 422 && result.error === 'validation' && result.fields) {
      fieldValidationFailed = true;
      fields.disabled = false; pending = undefined; showErrors(result.fields);
      status.textContent = '표시된 항목을 확인해 주세요.';
    } else if (result.error === 'captcha') {
      status.textContent = '보안 확인이 만료되었거나 완료되지 않았습니다. 보안 확인을 마친 후 아래 버튼을 눌러 다시 시도해 주세요.';
    } else if (response.status === 429) {
      status.textContent = '요청이 많아 잠시 접수가 제한되었습니다. 입력 내용은 유지됩니다. 잠시 후 같은 문의를 재시도하거나 이메일로 문의해 주세요.';
    } else {
      status.textContent = '접수 결과를 확인하지 못했습니다. 입력 내용을 유지하고 있습니다. 아래 버튼으로 같은 문의의 접수 여부를 다시 확인해 주세요. 계속 실패하면 이메일로 문의해 주세요.';
    }
  } catch {
    status.textContent = '접수 결과를 확인하지 못했습니다. 입력 내용을 유지하고 있습니다. 아래 버튼으로 같은 문의의 접수 여부를 다시 확인해 주세요. 새로고침하면 입력 내용이 사라집니다.';
  } finally {
    busy = false; form.removeAttribute('aria-busy');
    if (!saved) {
      submit.disabled = false;
      submit.textContent = pending ? '접수 확인·재시도 ↗' : '프로젝트 문의 보내기 ↗';
      resetChallenge(); if (!fieldValidationFailed) status.focus();
    }
  }
});
void configure();
