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
