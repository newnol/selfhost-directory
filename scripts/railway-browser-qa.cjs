// Local production QA. External API effects are never triggered: submission errors use a transport failure.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const AxeBuilder = require(process.env.AXE_MODULE || '@axe-core/playwright').default;
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const base = process.env.QA_BASE || 'http://127.0.0.1:4338';
const output = path.resolve(process.env.QA_OUTPUT || 'docs/qa/railway');
(async () => {
 fs.mkdirSync(output,{recursive:true});
 const browser = await chromium.launch({args:['--no-sandbox']});
 const results=[]; const errors=[];
 try {
  const context = await browser.newContext(); const page = await context.newPage(); page.on('pageerror', e=>errors.push(e.message));
  for (const width of [360,768,1440]) for (const locale of ['vi','en']) {
   await page.setViewportSize({width,height:1000});
   await page.emulateMedia({colorScheme:'light',reducedMotion:'reduce'});
   const routes=['','/categories/media','/alternatives/google-photos','/projects/immich','/projects/uptime-kuma','/projects/file-browser','/compare','/compare?projects=immich,jellyfin','/compare?projects=immich,missing','/advisor','/submit-project'];
   for (const route of routes) {
    const response=await page.goto(`${base}/${locale}${route}`); await page.waitForLoadState('networkidle'); await page.evaluate(()=>document.fonts.ready);
    assert.equal(response.status(),200);
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    assert.equal(await page.locator('.site-shell').getAttribute('lang'),locale);
    const axe = await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
    const violations=axe.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}));
    const name=route===''?'home':route.slice(1).replaceAll(/[/?=,]/g,'-');
    if(width!==768) await page.screenshot({path:`${output}/${locale}-${width}-${name}.png`,fullPage:true});
    results.push({locale,width,route,status:response.status(),violations});
   }
  }
  for (const locale of ['vi','en']) {
   const missing = await page.goto(`${base}/${locale}/projects/not-a-project`);
   assert.equal(missing.status(),404);
   await page.locator('.route-state .button').waitFor();
   assert.equal(await page.locator('.route-state .button').getAttribute('href'),`/${locale}#projects`);
  }
  await page.setViewportSize({width:360,height:1000}); await page.goto(`${base}/en`);
  await page.locator('.catalog-filter-group summary').click();
  assert.ok(await page.locator('#catalog-search').isVisible());
  await page.locator('#catalog-search').fill('immich'); assert.equal(await page.locator('.project-card').count(),1);
  await page.locator('.catalog-filter-group summary').click();
  await page.locator('[name=category]').selectOption('media');
  await page.getByRole('button',{name:'Reset filters',exact:true}).click();
  await page.locator('[name=compare-project]').nth(0).check(); await page.locator('[name=compare-project]').nth(1).check(); await page.locator('[name=compare-project]').nth(2).check();
  assert.ok(await page.locator('[name=compare-project]').nth(3).isDisabled());
  assert.equal(await page.locator('#catalog-compare-help').count(),1);
  await page.setViewportSize({width:1440,height:1000});
  await page.goto(`${base}/en/compare?projects=immich,jellyfin`);
  await page.locator('.nav-links .locale-switch').click(); await page.waitForURL('**/vi/compare?projects=immich,jellyfin'); await page.locator('table').waitFor();
  await page.goto(`${base}/en/projects/immich`); await page.locator('.detail-jump-links a').first().click(); assert.match(page.url(),/#requirements$/);
  await page.goto(`${base}/en/submit-project`);
  await page.locator('button[type=submit]').click(); assert.ok(await page.locator('[name=projectName]').evaluate(e=>!e.validity.valid));
  await page.route('**/api/submit-project', route=>route.abort('failed'));
  for(const [key,value] of Object.entries({projectName:'UI QA',url:'https://example.com',category:'Monitoring',description:'Transport-error QA with no server writes.',submitterName:'UI Reviewer',submitterEmail:'review@example.com'})) await page.locator(`.submit-form [name=${key}]`).fill(value);
  await page.locator('button[type=submit]').click(); await page.locator('.form-error').waitFor();
  assert.deepEqual(errors,[]);
  fs.writeFileSync(`${output}/route-evidence.json`,JSON.stringify({base,results,errors,interactions:['collapsible filters retain search','filter reset','comparison cap and persistent instructions','locale retains compare query','detail jump links','native submit validation','submission network error (aborted transport; no writes)']},null,2));
  const failures=results.filter(r=>r.violations.length);
  console.log(`Route cases: ${results.length}; axe cases with violations: ${failures.length}; page errors: ${errors.length}`);
  if(failures.length) console.log(JSON.stringify(failures,null,2));
  assert.equal(failures.length,0);
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
