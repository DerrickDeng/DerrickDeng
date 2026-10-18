// Run with Node.js and Playwright installed: node scripts/render-test-process.cjs
const { chromium } = require('playwright');
const path=require('path');
const root=path.resolve(__dirname,'..');
require('fs').mkdirSync(path.join(root,'assets/test-process'),{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:900,height:1000},deviceScaleFactor:2});
 await page.goto('file://'+root+'/docs/test-process.html');
 await page.evaluate(()=>document.fonts.ready);
 await page.locator('.actions').evaluate(el=>el.style.display='none');
 const files=['01-test-design','02-sprint-development','03-sprint-sit','04-uat','05-uat-regression','06-release-readiness','07-live-verification','08-regression-suites'];
 for(let i=0;i<files.length;i++)await page.locator('.phase').nth(i).screenshot({path:path.join(root,'assets/test-process',files[i]+'.png')});
 await page.evaluate(()=>{
  const section=document.querySelector('section[aria-labelledby="ownership-heading"]');
  const note=document.querySelector('.note');
  const wrap=document.createElement('div');wrap.id='ownership-export';section.before(wrap);wrap.append(section,note);
 });
 await page.locator('#ownership-export').screenshot({path:path.join(root,'assets/test-process/09-ownership.png')});
 await page.screenshot({path:path.join(root,'assets/test-process.png'),fullPage:true});
 const checks=await page.evaluate(()=>({paragraphSize:getComputedStyle(document.querySelector('.inner p')).fontSize,overflow:[...document.querySelectorAll('main, .phase, .inner, .ownership-card')].filter(el=>el.scrollWidth>el.clientWidth+1).map(el=>el.className)}));
 if(checks.overflow.length)throw new Error(JSON.stringify(checks));
 await page.pdf({path:path.join(root,'docs/test-process.pdf'),format:'A4',printBackground:true,preferCSSPageSize:true});
 await page.setViewportSize({width:390,height:900});
 if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw new Error('Mobile overflow');
 console.log(JSON.stringify(checks));
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
