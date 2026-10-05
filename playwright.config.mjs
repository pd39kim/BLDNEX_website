import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests', testMatch: '**/*.browser.spec.mjs', workers: 1, timeout: 30_000,
  use: { baseURL: 'http://127.0.0.1:8788', channel: 'chrome', headless: true, trace: 'retain-on-failure' },
  webServer: { command: 'pnpm contact:dev', url: 'http://127.0.0.1:8788/contact', reuseExistingServer: true, timeout: 30_000 },
});
