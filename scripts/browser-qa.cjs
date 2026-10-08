// Run after build: PLAYWRIGHT_MODULE=/path/to/playwright node scripts/browser-qa.cjs
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { spawn } = require('node:child_process');
const assert = require('node:assert/strict');
const port = process.env.QA_PORT || '4312';
const base = `http://127.0.0.1:${port}`;
async function run(configured) {
  const env = { ...process.env, ADVISOR_CLAUDE_ENABLED: 'false' };
  delete env.ADVISOR_ALLOWED_ORIGINS;
  if (configured) env.ADVISOR_ALLOWED_ORIGINS = base;
  const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '0.0.0.0', '--port', port], { env, stdio: 'inherit' });
  let browser;
  try {
    for (let i = 0; i < 100; i++) {
      assert.equal(server.exitCode, null);
      try { if ((await fetch(base + '/en/advisor')).ok) break; } catch {}
      await new Promise(r => setTimeout(r, 100));
    }
    browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    for (const locale of ['en', 'vi']) {
      await page.goto(`${base}/${locale}/advisor`);
      await page.waitForLoadState('networkidle');
      await page.locator('.advisor-step').nth(1).locator('summary').click();
      await page.locator('button[type=submit]').click();
      assert.equal(await page.locator('.advisor-step').nth(1).evaluate(e => e.open), true);
      assert.equal(await page.locator('[name=cpu]').evaluate(e => e.validity.valid), false);
      for (const [name, value] of Object.entries({ cpu: '4', ramGiB: '8', diskGiB: '100' })) await page.locator(`[name=${name}]`).fill(value);
      await page.locator('.advisor-step').nth(2).locator('summary').click();
      for (const consent of [false, true]) {
        await page.locator('[name=useClaude]').setChecked(consent);
        const response = page.waitForResponse(r => r.url().endsWith('/api/advisor'));
        await page.locator('button[type=submit]').click();
        const r = await response;
        assert.equal(r.status(), configured ? 200 : 403);
        if (configured) {
          await page.locator('a[href*="/compare?projects="]').waitFor();
          assert.match(await page.locator('body').innerText(), /deterministic/);
          assert.equal(await page.locator('.resource-checks').count(), 3);
        } else await page.locator('p[role=alert]').waitFor();
        console.log(`${locale} advisor consent=${consent}: HTTP ${r.status()}`);
      }
      if (!configured) continue;
      await page.locator('a[href*="/compare?projects="]').click();
      await page.locator('table').waitFor();
      assert.equal(await page.locator('input[name=projects]').count(), 28);
      await page.getByRole('button', { name: locale === 'en' ? 'Clear selection' : 'Đặt lại', exact: true }).click();
      assert.equal(await page.locator('button[type=submit]').isDisabled(), true);
      await page.locator('input[name=projects][value=immich]').check();
      assert.equal(await page.locator('button[type=submit]').isDisabled(), true);
      await page.locator('input[name=projects][value=jellyfin]').check();
      await page.locator('input[name=projects][value=nextcloud]').check();
      assert.equal(await page.locator('input[name=projects][value=grafana]').isDisabled(), true);
      await page.locator('input[name=projects][value=nextcloud]').uncheck();
      await page.locator('#compare-search').fill('missing-project');
      assert.equal(await page.locator('.compare-options label:visible').count(), 0);
      await page.locator('#compare-search').fill('');
      await page.locator('button[type=submit]').click();
      await page.locator('table').waitFor();
      assert.equal(await page.locator('table [data-resource=cpu]').count(), 2);
      const compare = await page.locator('table').innerText();
      assert.ok(!compare.includes('"minimum"'));
      if (locale === 'vi') assert.ok(compare.includes('GB được làm tròn lên GiB') && !compare.includes('Upstream: 2 cores'));
      await page.locator('input[name=projects][value=jellyfin]').uncheck();
      assert.equal(await page.locator('button[type=submit]').isDisabled(), true);
      await page.goto(`${base}/${locale}/compare?projects=immich,missing`);
      await page.locator('p[role=alert]').waitFor();
      assert.equal(await page.locator('table').count(), 0);
      await page.goto(`${base}/${locale}/projects/immich`);
      for (const [name, value] of Object.entries({ cpu: '1', ramGiB: '1', diskGiB: '1' })) await page.locator(`[name=${name}]`).fill(value);
      await page.locator('.planning-panel button[type=submit]').click();
      assert.match(await page.locator('.planning-panel').innerText(), locale === 'en' ? /Below recorded minimum/ : /Thấp hơn mức tài nguyên tối thiểu/);
      for (const [name, value] of Object.entries({ cpu: '8', ramGiB: '16', diskGiB: '1000' })) await page.locator(`[name=${name}]`).fill(value);
      await page.locator('[name=architecture]').selectOption('arm64');
      await page.locator('.planning-panel button[type=submit]').click();
      assert.match(await page.locator('.planning-panel').innerText(), /Unknown|Chưa rõ/);
      await page.goto(`${base}/${locale}/projects/file-browser`);
      await page.locator('[data-lifecycle=archived]').waitFor();
      console.log(`${locale}: compare, localized provenance, partial calculator, archived warning passed`);
    }
    assert.deepEqual(errors, []);
    if (configured) {
      const rejected = await fetch(base + '/api/advisor', { method: 'POST', headers: { origin: 'https://evil.example', 'x-forwarded-host': 'evil.example', 'content-type': 'application/json' }, body: '{}' });
      assert.equal(rejected.status, 403);
      console.log('Spoofed cross-origin HTTP request: 403');
    }
  } finally {
    if (browser) await browser.close();
    server.kill('SIGTERM');
    await new Promise(resolve => server.exitCode !== null ? resolve() : server.once('exit', resolve));
  }
}
(async () => { await run(false); await run(true); console.log('Real Chromium production QA passed (unconfigured reproduction + explicit-origin fix).'); })().catch(e => { console.error(e); process.exitCode = 1; });
