'use strict';
// Live smoke test; the browser publishable key is public and does not bypass RLS.
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const browser = { window: {} };
vm.runInNewContext(fs.readFileSync('assets/js/supabase-config.js', 'utf8'), browser, {timeout:1000});
const project = String(browser.window.PJ_SUPABASE_URL || '');
const publishable = String(browser.window.PJ_SUPABASE_ANON_KEY || '');
const origin = 'https://pk1030952-ship-it.github.io';
assert(/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(project), 'Invalid project URL');
assert(publishable.startsWith('sb_publishable_'), 'Expected public publishable key');
const headers = {origin, apikey:publishable, 'content-type':'application/json'};
async function request(slug, method='POST', body=undefined, extraHeaders={}) {
  const res = await fetch(project + '/functions/v1/' + slug, {
    method, headers:{...headers, ...extraHeaders},
    body:body===undefined?undefined:JSON.stringify(body),
    signal:AbortSignal.timeout(slug==='ask-to-aisha'?140000:20000)
  });
  const text = await res.text();
  let parsed={};
  try { parsed=JSON.parse(text); } catch {}
  console.log(slug + ' ' + method + ': HTTP ' + res.status);
  return {status:res.status,body:parsed};
}
async function run() {
  const preflight = await request('submit-contact','OPTIONS');
  assert.equal(preflight.status,204,'Contact CORS preflight must allow the final site');
  const forbidden = await request('submit-contact','OPTIONS',undefined,{origin:'https://not-allowed.example'});
  assert.equal(forbidden.status,403,'Untrusted origin must be denied');
  const invalid = await request('submit-contact','POST',{name:'QA',email:'invalid',message:'hello'});
  assert.equal(invalid.status,400,'Malformed contact must be rejected');
  const email = 'portfolio-smoke-' + (process.env.GITHUB_RUN_ID || Date.now()) + '@example.invalid';
  console.log('QA_EMAIL=' + email);
  const qa = {name:'Portfolio CI QA',email,subject:'Automated integration smoke test',
    message:'Automated test message for integration validation. This record will be removed after the test.',website:''};
  const good = await request('submit-contact','POST',qa);
  assert.equal(good.status,200,'Valid contact submission must succeed');
  assert.equal(good.body.ok,true,'Expected contact success');
  const repeated = await request('submit-contact','POST',qa);
  assert.equal(repeated.status,429,'Repeated contact must be throttled');
  const ai = await request('ask-to-aisha','POST',{message:'Did Pankaj complete ADCA, and when?',history:[]});
  assert.equal(ai.status,200,'AI chat must respond successfully');
  assert.equal(typeof ai.body.answer,'string','AI response missing answer');
  const answer = ai.body.answer.toLowerCase();
  assert(answer.length > 8,'AI answer too short');
  assert(/2026|अप्रैल|april/i.test(answer),'AI answer should reflect completed ADCA');
  console.log('AI factual answer verified; not printing full answer');
  console.log('Remote smoke checks passed');
}
run().catch(e=>{console.error('Remote smoke check failed:',e.message);process.exitCode=1});
