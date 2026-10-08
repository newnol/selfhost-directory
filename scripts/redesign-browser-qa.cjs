// Production UI regression: QA_BASE=http://127.0.0.1:4321 PLAYWRIGHT_MODULE=/path/to/playwright node scripts/redesign-browser-qa.cjs
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const base = process.env.QA_BASE || 'http://127.0.0.1:4321';
const output = process.env.QA_OUTPUT || '/home/newnol/.hermes/cache/scratch';
(async () => {
 const browser = await chromium.launch({ args: ['--no-sandbox'] });
 try {
  const page = await browser.newPage(); const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  for (const theme of ['light', 'dark']) for (const width of [360, 768, 1440]) for (const locale of ['en', 'vi']) {
   await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' });
   await page.setViewportSize({ width, height: 1000 });
   for (const route of ['', '/projects/immich', '/compare?projects=immich,jellyfin', '/advisor', '/submit-project', '/categories/media', '/alternatives/google-photos']) {
    await page.goto(`${base}/${locale}${route}`); await page.waitForLoadState('networkidle');
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${theme} ${width} ${locale}${route}: overflow`);
    if (locale === 'en' && ['', '/projects/immich', '/compare?projects=immich,jellyfin', '/advisor'].includes(route)) {
     await page.screenshot({ path: `${output}/ui-after-${theme}-${width}-${route === '' ? 'home' : route.split('/')[1].split('?')[0]}.png`, fullPage: true });
    }
   }
   console.log(`No document overflow: ${theme} ${width}px ${locale}, 7 routes`);
  }
  await page.goto(`${base}/en`); await page.waitForLoadState('networkidle');
  await page.keyboard.press('Tab'); assert.equal(await page.locator('.skip-link').evaluate(e => e === document.activeElement), true);
  await page.keyboard.press('Enter'); assert.equal(await page.locator('main').evaluate(e => e === document.activeElement), true);
  assert.equal(await page.locator('.project-card').count(), 28);
  await page.getByLabel('Search projects', {exact:true}).fill('immich'); assert.equal(await page.locator('.project-card').count(), 1);
  await page.getByLabel('Search projects', {exact:true}).fill('not-a-real-project'); await page.getByText('No projects found', {exact:true}).waitFor();
  await page.getByRole('button', {name:'Reset filters'}).focus(); await page.keyboard.press('Enter'); assert.equal(await page.locator('.project-card').count(), 28);
  await page.locator('select[name=category]').selectOption('media'); assert.equal(await page.locator('.project-card').count(), 5);
  await page.locator('select[name=category]').selectOption('');
  await page.locator('select[name=deploy]').selectOption('Docker Compose');
  assert.ok(await page.locator('.project-card').count() > 0);
  await page.getByRole('button', {name:'Reset filters'}).click();
  await page.locator('input[name=compare-project]').nth(0).check();
  await page.locator('input[name=compare-project]').nth(1).check();
  await page.getByRole('link', {name:'Compare selected',exact:true}).click();
  await page.locator('table').waitFor();
  await page.setViewportSize({width:360,height:1000});
  await page.goto(`${base}/en`);
  const menu = page.locator('.menu-toggle');
  await menu.focus(); await page.keyboard.press('Enter');
  assert.equal(await menu.getAttribute('aria-expanded'), 'true');
  await page.locator('#mobile-navigation a').first().focus(); await page.keyboard.press('Escape');
  assert.equal(await menu.getAttribute('aria-expanded'), 'false');
  assert.equal(await menu.evaluate(e => e === document.activeElement), true);
  await page.goto(`${base}/en/compare?projects=immich,jellyfin`); await page.locator('.compare-scroll').focus(); await page.keyboard.press('ArrowRight');
  await page.waitForFunction(() => document.querySelector('.compare-scroll').scrollLeft > 0);
  assert.deepEqual(errors, []);
  console.log('Keyboard skip link, catalog search/empty/reset/category and table scrolling passed; zero page errors.');
 } finally { await browser.close(); }
})().catch(e => {console.error(e);process.exitCode=1;});
