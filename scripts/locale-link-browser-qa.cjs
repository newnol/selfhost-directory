// Local-only regression smoke; no submissions, installs or external writes.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const base = process.env.QA_BASE || 'http://127.0.0.1:4348';
(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const errors = [];
  try {
    const context = await browser.newContext();
    context.on('page', page => page.on('pageerror', error => errors.push(error.message)));
    const page = await context.newPage();
    const source = '/en/compare?projects=immich,jellyfin#main-content';
    const target = '/vi/compare?projects=immich,jellyfin#main-content';
    const ssrContext = await browser.newContext({ javaScriptEnabled: false });
    const ssrPage = await ssrContext.newPage();
    await ssrPage.goto(base + source);
    const ssrHref = await ssrPage.locator('.locale-switch').getAttribute('href');
    assert.equal(new URL(ssrHref, base).searchParams.get('projects'), 'immich,jellyfin');
    assert.equal(new URL(ssrHref, base).pathname, '/vi/compare');
    await ssrContext.close();
    console.log('PASS: SSR link includes comparison query without JavaScript (hash is browser-only)');
    await page.goto(base + source);
    const link = page.locator('.locale-switch');
    // Inspect/copy href before any click handler can mutate it.
    await page.waitForLoadState('networkidle');
    assert.equal(await link.getAttribute('href'), target);
    const popupPromise = context.waitForEvent('page');
    await link.click({ button: 'middle' });
    const popup = await popupPromise;
    await popup.waitForLoadState('networkidle');
    assert.equal(popup.url(), base + target);
    assert.equal(await popup.locator('table').count(), 1);
    await popup.close();
    await link.click();
    await page.waitForURL(base + target);
    await page.locator('table').waitFor();
    console.log('PASS: pre-interaction/copied href, middle-click new tab, normal click retain comparison query/hash');
    await page.goto(base + '/en');
    // Next client navigation must update the same shell, including query-only changes.
    await page.evaluate(() => { window.__shell = document.querySelector('.site-shell'); });
    await page.locator('.nav-links a[href="/en/compare"]').click();
    await page.waitForURL(base + '/en/compare');
    await page.evaluate(() => history.pushState(null, '', '/en/compare?projects=immich,jellyfin#main-content'));
    await page.waitForFunction(() => document.querySelector('.locale-switch').getAttribute('href') === '/vi/compare?projects=immich,jellyfin#main-content');
    assert.ok(await page.evaluate(() => window.__shell === document.querySelector('.site-shell')));
    await page.evaluate(() => { location.hash = 'comparison'; });
    await page.waitForFunction(() => document.querySelector('.locale-switch').getAttribute('href').endsWith('#comparison'));
    await page.evaluate(() => history.replaceState(null, '', '/en/compare?projects=jellyfin,immich#main-content'));
    await page.waitForFunction(() => document.querySelector('.locale-switch').getAttribute('href') === '/vi/compare?projects=jellyfin,immich#main-content');
    await page.goBack();
    await page.waitForFunction(() => document.querySelector('.locale-switch').getAttribute('href') === '/vi/compare?projects=immich,jellyfin#main-content');
    console.log('PASS: client pathname/query navigation, push/replaceState, hashchange, back update actual href');
    for (const slug of ['immich', 'uptime-kuma']) {
      await page.goto(base + '/en/projects/' + slug);
      await page.locator('a[href="#deployment"]').click();
      const section = page.locator('#deployment');
      assert.ok(await section.locator(slug === 'immich' ? '.deploy-steps' : '.installer-panel').count());
      await page.waitForFunction(() => Math.abs(document.querySelector('#deployment').getBoundingClientRect().top) < 200);
    }
    assert.deepEqual(errors, []);
    console.log('PASS: deployment anchor covers complete section (Immich + Uptime Kuma); zero page errors');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
