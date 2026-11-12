'use strict';
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const root = 'http://127.0.0.1:8765';
(async () => {
  const browser=await chromium.launch({headless:true});
  try {
    for (const vp of [{width:1280,height:900}, {width:390,height:844}]) {
      const page=await browser.newPage({viewport:vp,reducedMotion:'reduce'});
      const errors=[];
      page.on('pageerror', e=>errors.push(e.message));
      await page.goto(root+'/index.html',{waitUntil:'domcontentloaded',timeout:30000});
      await page.locator('#loader').waitFor({state:'hidden',timeout:30000});
      assert.equal(await page.locator('#mainContent').count(),1,'Main landmark missing');
      assert((await page.locator('.hero h1').textContent()).includes('Pankaj'),'Hero name missing');
      await page.locator('#languageToggle').click();
      assert.equal(await page.locator('html').getAttribute('lang'),'hi','Hindi switch failed');
      await page.locator('#languageToggle').click();
      assert.equal(await page.locator('html').getAttribute('lang'),'en','English switch failed');
      const oldTheme=await page.locator('html').getAttribute('data-theme');
      await page.locator('#themeToggle').click();
      assert.notEqual(await page.locator('html').getAttribute('data-theme'),oldTheme,'Theme toggle failed');
      await page.locator('#aishaToggle').click();
      assert.equal(await page.locator('#aishaToggle').getAttribute('aria-expanded'),'true','Chat toggle not opened');
      assert(await page.locator('#aishaPanel').isVisible(),'Chat panel not visible');
      if(vp.width<850){
        await page.locator('#menuToggle').click();
        assert(await page.locator('body').evaluate(el=>el.classList.contains('menu-open')),'Mobile navigation failed');
        await page.locator('.desktop-nav a[href="#about"]').click();
        assert(!(await page.locator('body').evaluate(el=>el.classList.contains('menu-open'))),'Mobile navigation did not close');
      }
      const horizontal=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
      assert(horizontal<16,'Unexpected horizontal overflow: '+horizontal+'px at '+vp.width+'px');
      assert.deepEqual(errors,[],'Runtime JavaScript errors');
      console.log('Public page UI passed at '+vp.width+'px');
      await page.close();
    }
    const admin=await browser.newPage({viewport:{width:1180,height:900}});
    const errors=[];
    admin.on('pageerror',e=>errors.push(e.message));
    await admin.goto(root+'/admin.html',{waitUntil:'domcontentloaded',timeout:30000});
    assert(await admin.locator('#loginForm').count()===1,'Admin login form missing');
    await admin.waitForTimeout(1000);
    assert.deepEqual(errors,[],'Admin JavaScript errors');
    console.log('Admin login view loaded without JavaScript exceptions');
    await admin.close();
  } finally {await browser.close()}
})().catch(error=>{console.error('UI smoke failed:',error.message);process.exitCode=1});
