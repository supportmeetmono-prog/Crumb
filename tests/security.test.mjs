import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const read=(p)=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('security headers defend document and browser permissions',()=>{
  const data=JSON.parse(read('vercel.json'));
  const headers=Object.fromEntries(data.headers[0].headers.map(h=>[h.key.toLowerCase(),h.value]));
  for(const key of ['content-security-policy','strict-transport-security','x-frame-options','x-content-type-options','referrer-policy','permissions-policy'])assert.ok(headers[key],key);
  const csp=headers['content-security-policy'];
  for(const required of ["object-src 'none'","frame-ancestors 'none'","base-uri 'self'","script-src 'self'","https://challenges.cloudflare.com"])assert.ok(csp.includes(required),required);
  assert.ok(!csp.includes("'unsafe-eval'"));
});
test('both HTML pages keep scripts and CSS outside HTML',()=>{
  for(const path of ['index.html','hero-lab.html']){
    const html=read(path);
    assert.ok(!/<script(?![^>]*\bsrc=)[^>]*>/i.test(html),'unexpected inline script: '+path);
    assert.ok(!/<style[\s>]/i.test(html),'unexpected inline style: '+path);
    assert.ok(html.includes('/assets/'));
  }
});
test('translations and features remain in the published scripts',()=>{
  const js=read('assets/app.js');
  for(const lang of ['en','es','it','pt','fr','zh','hi','ar','ru'])assert.ok(js.includes('"'+lang+'":{'),'missing '+lang);
  assert.ok(js.includes('aiOfficialReference'));
  const lab=read('assets/hero-lab.js');assert.ok(lab.includes('renderPreview'));
});
test('image API enforces authentication, quotas and request size',()=>{
  const js=read('api/ai-image.js');
  for(const marker of ['AI_STUDIO_ENABLED', 'TURNSTILE_SECRET_KEY', 'verifyMessage', 'RESERVE_SCRIPT', '1900000', 'unrecognized_host'])assert.ok(js.includes(marker),marker);
});
test('retired endpoints stay retired',()=>{
  assert.ok(read('api/counter.js').includes('status(410)'));
  assert.ok(read('api/mission.js').includes('status(410)'));
});

test('SEO: public pages have canonical metadata and are indexable',()=>{
  const pages=[['index.html','https://crumb.vision/'],['hero-lab.html','https://crumb.vision/hero-lab.html']];
  for(const [file,canonical] of pages){
    const html=read(file);
    assert.ok(html.includes('rel="canonical" href="'+canonical+'"'),file+' canonical');
    assert.ok(html.includes('name="description"'),file+' description');
    assert.ok(html.includes('name="robots" content="index, follow'),file+' robots');
    assert.ok(!/noindex/i.test(html),file+' should be indexable');
  }
});
test('SEO: sitemap is valid XML-shaped with only canonical HTTPS URLs',()=>{
  const sitemap=read('sitemap.xml'),robots=read('robots.txt');
  assert.match(sitemap,/^<\?xml version="1.0" encoding="UTF-8"\?>/);
  for(const url of ['https://crumb.vision/','https://crumb.vision/hero-lab.html'])assert.ok(sitemap.includes('<loc>'+url+'</loc>'),url);
  assert.ok(!sitemap.includes('vercel.app'));
  assert.ok(robots.includes('Sitemap: https://crumb.vision/sitemap.xml'));
  assert.ok(!robots.split('\n').includes('Disallow: /'));
});

test('pre-launch: tokenomics hidden from public site and client bundles',()=>{
 const html=read('index.html'),js=read('assets/app.js'),css=read('assets/app.css');
 assert.ok(html.includes('499 MILLION TOKENS'));
 assert.ok(html.includes('COMING SOON'));
 assert.ok(html.includes('id="token"'));
 assert.ok(!html.includes('tokenomics-explainer'),'allocation cards are removed from DOM');
 assert.ok(!html.includes('token-security'),'security plan not published on site');
 for(const forbidden of ['399,200,000','49,900,000','24,950,000','399.200.000','49.900.000','24.950.000','399 200 000','49 900 000','24 950 000','3-of-5 multisig','365-day','allocation-track','allocation-grid']){
  assert.ok(!html.includes(forbidden),'HTML still contains '+forbidden);
  assert.ok(!js.includes(forbidden),'translated client bundle contains '+forbidden);
 }
 const translations=JSON.parse(js.slice('const translations='.length,js.indexOf(';\n')));
 for(const lang of ['en','es','it','pt','fr','zh','hi','ar','ru']){
  assert.ok(translations[lang].coinComingSoon,lang+' missing coming soon label');
  assert.ok(translations[lang].coinTitle,lang+' missing token count');
  assert.ok(translations[lang].faq6A,lang+' missing community FAQ');
  for(const key of Object.keys(translations[lang]))assert.ok(!/^(?:alloc|security|distributionLabel|faq7|faq8|faq2)/.test(key),lang+' stale key '+key);
 }
 assert.ok(css.includes('.token-coming-soon'));
});
test('private planning reminder: Solidity draft remains non-deployed',()=>{
 const c=read('contracts/CRUMB.sol');
 assert.ok(c.includes('DRAFT ONLY'));
});

test('Meme Lab gallery: four original downloadable images and nine translations',()=>{
 const html=read('index.html'),js=read('assets/app.js'),css=read('assets/app.css');
 assert.ok(html.includes('id="studio"')&&html.includes('id="officialDownloads"'));
 const gallery=html.slice(html.indexOf('id="officialDownloads"'),html.indexOf('</section>',html.indexOf('id="officialDownloads"')));
 assert.equal((gallery.match(/data-gallery-download=/g)||[]).length,4);
 for(let i=1;i<=4;i++){
  const n=String(i).padStart(2,'0');
  assert.ok(gallery.includes('/assets/meme-gallery/crumb-message-'+n+'.avif'));
  assert.ok(gallery.includes('data-i18n="downloadName'+i+'"'));
  assert.ok(js.includes('downloadAlt'+i));
 }
 assert.ok(js.includes("canvas.toBlob(resolve,'image/png')"));
 const translations=JSON.parse(js.slice('const translations='.length,js.indexOf(';\\n')));
 for(const lang of ['en','es','it','pt','fr','zh','hi','ar','ru']){
  for(const key of ['downloadsTitle','downloadsDesc','downloadButton','downloadName1','downloadName2','downloadName3','downloadName4'])assert.ok(translations[lang][key],lang+'/'+key);
 }
 assert.ok(css.includes('.official-download-grid'));
});
