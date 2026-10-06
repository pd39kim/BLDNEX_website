import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
const policyVersion = 'contact-2026-10-05-v1';
const receipt = 'BN-11111111-1111-4111-8111-111111111111';
// Browser tests use labelled fixtures. Real D1/validation/auth behavior is tested in contact.test.mjs.
// No real CAPTCHA or email network request is made.
async function enable(page) {
  await page.route('**/api/contact/config', (route) => route.fulfill({ json: { enabled: true, policyVersion, siteKey: 'fixture' } }));
  await page.route('https://challenges.cloudflare.com/**', (route) => route.fulfill({ contentType: 'application/javascript', body: `
    let callback, n = 0;
    window.turnstile = {
      render(el, options) { callback = options.callback; el.textContent = '보안 확인 (자동 테스트용)'; setTimeout(() => callback('fixture-' + ++n), 0); return 'widget'; },
      reset() { setTimeout(() => callback('fixture-' + ++n), 0); }
    };` }));
}
async function fill(page) {
  await page.locator('#projectType').selectOption('website');
  await page.locator('#budget').selectOption('undecided');
  await page.locator('#schedule').selectOption('quarter');
  await page.locator('#description').fill('브랜드의 이야기를 소개할 반응형 웹사이트를 만들고 싶습니다. 구체적인 범위는 상담하며 정하고 싶습니다.');
  await page.locator('#name').fill('테스트 담당자');
  await page.locator('#email').fill('test@example.test');
  await page.locator('#consent').check();
}

test('unconfigured deployed runtime disables intake but email and FAQ work', async ({ page, request }) => {
  await page.goto('/contact');
  await expect(page.locator('#intake-notice')).toContainText('준비 중');
  await expect(page.locator('.inquiry-submit')).toBeDisabled();
  await expect(page.locator('a[href^="mailto:"]').first()).toBeVisible();
  expect(await page.locator('.faq-item').count()).toBe(7);
  expect((await request.get('/api/contact/config')).status()).toBe(200);
  for (const path of ['/admin/inquiries', '/admin/inquiries.html', '/admin/inquiries/', '/api/admin/inquiries']) {
    const response = await request.get(path);
    expect([401, 403, 503]).toContain(response.status()); expect(response.headers()['cache-control']).toBe('no-store');
  }
});
test('client validates before sending and focuses first invalid field', async ({ page }) => {
  await enable(page); await page.goto('/contact');
  await page.locator('.inquiry-submit').click();
  await expect(page.locator('#projectType')).toBeFocused();
  await expect(page.locator('#error-consent')).toContainText('동의');
  await expect(page.locator('#consent')).not.toBeChecked();
  await expect(page.locator('#optionalConsent')).not.toBeChecked();
});
test('optional fields are genuinely optional; successful receipt is announced and shown safely', async ({ page }) => {
  await enable(page); let posts = 0;
  await page.route('**/api/contact', (route) => { posts++; const data = route.request().postDataJSON(); expect(data.company).toBe(''); expect(data.optionalConsent).toBe(false); return route.fulfill({ status: 201, json: { receipt } }); });
  await page.goto('/contact'); await fill(page); await page.locator('.inquiry-submit').click();
  await expect(page.locator('#inquiry-success')).toBeVisible();
  await expect(page.locator('#inquiry-success')).toBeFocused();
  await expect(page.locator('#inquiry-receipt')).toHaveText(receipt);
  expect(posts).toBe(1);
  expect(await page.evaluate(() => [localStorage.length, sessionStorage.length])).toEqual([0, 0]);
});
test('company/phone requires separate optional consent without blocking an empty optional section', async ({ page }) => {
  await enable(page); await page.goto('/contact'); await fill(page);
  await page.locator('#company').fill('테스트 회사'); await page.locator('.inquiry-submit').click();
  await expect(page.locator('#optionalConsent')).toBeFocused();
  await expect(page.locator('#error-optionalConsent')).toContainText('동의가 필요');
});
test('unknown network result preserves a frozen snapshot and retries the SAME request key', async ({ page }) => {
  await enable(page); const requests = [];
  await page.route('**/api/contact', async (route) => {
    requests.push({ key: route.request().headers()['idempotency-key'], data: route.request().postDataJSON() });
    if (requests.length === 1) return route.abort('failed');
    return route.fulfill({ status: 200, json: { receipt } });
  });
  await page.goto('/contact'); await fill(page); const description = await page.locator('#description').inputValue();
  await page.locator('.inquiry-submit').click();
  await expect(page.locator('#form-status')).toContainText('접수 결과를 확인하지 못했습니다');
  await expect(page.locator('#description')).toHaveValue(description); await expect(page.locator('#description')).toBeDisabled();
  await page.getByRole('button', { name: '접수 확인·재시도' }).click();
  await expect(page.locator('#inquiry-success')).toBeVisible();
  expect(requests).toHaveLength(2); expect(requests[0].key).toBe(requests[1].key);
  expect(requests[0].data.description).toBe(requests[1].data.description);
});
test('double clicks cannot create parallel requests', async ({ page }) => {
  await enable(page); let posts = 0;
  await page.route('**/api/contact', async (route) => {
    posts++; await new Promise((resolve) => setTimeout(resolve, 200)); await route.fulfill({ status: 201, json: { receipt } });
  });
  await page.goto('/contact'); await fill(page);
  await page.evaluate(() => { const form = document.querySelector('form'); form.requestSubmit(); form.requestSubmit(); });
  await expect(page.locator('#inquiry-success')).toBeVisible(); expect(posts).toBe(1);
});
test('server validation keeps input, unlocks it and displays field errors', async ({ page }) => {
  await enable(page);
  await page.route('**/api/contact', (route) => route.fulfill({ status: 422, json: { error: 'validation', fields: { email: '이메일 주소를 확인해 주세요.' } } }));
  await page.goto('/contact'); await fill(page); await page.locator('.inquiry-submit').click();
  await expect(page.locator('#email')).toBeEnabled(); await expect(page.locator('#email')).toHaveValue('test@example.test');
  await expect(page.locator('#email')).toBeFocused();
  await expect(page.locator('#error-email')).toHaveText('이메일 주소를 확인해 주세요.');
  await expect(page.locator('#inquiry-success')).not.toBeVisible();
});
test('clears field error in real-time when description reaches 20 chars', async ({ page }) => {
  await enable(page); await page.goto('/contact'); await fill(page);
  await page.locator('#description').fill('짧은 내용');
  await page.locator('.inquiry-submit').click();
  await expect(page.locator('#error-description')).toHaveText('프로젝트 내용을 20–5,000자로 입력해 주세요.');
  await expect(page.locator('#description')).toHaveAttribute('aria-invalid', 'true');

  await page.locator('#description').fill('20자 이상으로 프로젝트 내용을 충분히 작성합니다.');
  await expect(page.locator('#error-description')).toBeEmpty();
  await expect(page.locator('#description')).not.toHaveAttribute('aria-invalid');
  await expect(page.locator('#form-status')).toBeEmpty();
});
test('CAPTCHA script failure keeps intake disabled and provides fallback', async ({ page }) => {
  await enable(page); await page.route('https://challenges.cloudflare.com/**', (route) => route.abort());
  await page.goto('/contact'); await expect(page.locator('#intake-notice')).toContainText('연결을 확인하지 못했습니다');
  await expect(page.locator('.inquiry-submit')).toBeDisabled(); await expect(page.locator('.config-retry')).toBeVisible();
});
test('no JavaScript still offers working email fallback', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage(); await page.goto('http://127.0.0.1:8788/contact');
  await expect(page.locator('noscript p')).toContainText('JavaScript'); await expect(page.locator('.inquiry-submit')).toBeDisabled();
  await expect(page.locator('a[href^="mailto:"]').first()).toBeVisible(); await context.close();
});
test('contact stays within viewport at 360/390/768/1440 and preserves logo sizes', async ({ page }, testInfo) => {
  const errors = []; page.on('pageerror', (error) => errors.push(error.message));
  for (const width of [360, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 }); await page.goto('/contact'); await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(await page.locator('.site-header .wordmark-symbol').evaluate((el) => Math.round(el.getBoundingClientRect().height))).toBe(36);
    expect(await page.locator('.site-header .wordmark-type').evaluate((el) => Math.round(el.getBoundingClientRect().height))).toBe(20);
    if ([390, 1440].includes(width)) await page.screenshot({ path: testInfo.outputPath(`contact-${width}.png`), fullPage: true });
  }
  expect(errors).toEqual([]);
});
test('admin fixture safely renders stored HTML as text and supports state updates', async ({ page }) => {
  // Only the public-free shell is supplied here; actual JWT authorization is tested separately.
  await page.route('**/admin/inquiries', async (route) => route.fulfill({ contentType: 'text/html', body: await readFile('dist/admin/inquiries.html', 'utf8') }));
  let state = 'new', version = 1;
  const item = () => ({ id: receipt, name: '<img src=x onerror=alert(1)>', email: 'test@example.test', company: '', phone: '', project_type: 'website', budget: 'undecided', schedule: 'quarter', description: '<script>alert(1)</script>', status: state, version, created_at: Date.now(), purge_after: Date.now() + 730 * 86400000, consent_at: Date.now(), consent_version: policyVersion, optional_consent: 0, notification_state: 'failed' });
  await page.route('**/api/admin/inquiries**', (route) => {
    const url = new URL(route.request().url());
    if (url.pathname.endsWith('/status')) { state = route.request().postDataJSON().status; version++; return route.fulfill({ json: { ok: true } }); }
    if (url.pathname.endsWith(receipt)) return route.fulfill({ json: { inquiry: item(), notification: { state: 'failed', attempts: 1, error_code: 'provider_503' }, audit: [] } });
    return route.fulfill({ json: { items: [item()], nextCursor: null, health: { checked_at: Date.now() }, failed: 1 } });
  });
  await page.goto('/admin/inquiries'); await page.locator('#inquiry-list button').click();
  await expect(page.locator('#detail-description')).toHaveText('<script>alert(1)</script>');
  expect(await page.locator('#inquiry-list img').count()).toBe(0);
  await page.locator('#detail-status').selectOption('reviewing'); await page.locator('#save-status').click();
  await expect(page.locator('#admin-message')).toContainText('요청을 반영했습니다'); expect(state).toBe('reviewing');
});
test('home does not load contact CAPTCHA or contact/admin bundles', async ({ page }) => {
  const urls = []; page.on('request', (request) => urls.push(request.url()));
  await page.goto('/'); await page.waitForLoadState('networkidle');
  expect(urls.some((url) => /challenges.cloudflare|ContactForm|inquiries\.astro|\/api\/contact/.test(url))).toBe(false);
});
