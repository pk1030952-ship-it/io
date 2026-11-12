'use strict';
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const home = read('index.html');
const admin = read('admin.html');
const publicJs = read('assets/js/main.js');
const adminJs = read('assets/js/admin.js');
const config = read('assets/js/supabase-config.js');

function auditPage(name, html, js) {
  const allIds = [...html.matchAll(/\bid=["']([^"']+)["']/g)].map(m => m[1]);
  const ids = new Set(allIds);
  assert.equal(ids.size, allIds.length, name + ': duplicate HTML IDs');
  for (const match of js.matchAll(/\$\(["']#([\w-]+)["']\)/g)) {
    assert(ids.has(match[1]), name + ': missing HTML element #' + match[1]);
  }
  for (const match of html.matchAll(/\bhref="#([^"]+)"/g)) {
    assert(ids.has(match[1]), name + ': broken in-page anchor #' + match[1]);
  }
  for (const match of html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/g)) {
    const src = match[1];
    if (!src.startsWith('http://') && !src.startsWith('https://')) {
      assert(fs.existsSync(path.join(root, src)), name + ': missing local script ' + src);
    }
  }
  for (const match of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) {
    assert(/\brel="[^"]*\bnoopener\b/.test(match[0]), name + ': external link lacks noopener');
  }
}

auditPage('index.html', home, publicJs);
auditPage('admin.html', admin, adminJs);
assert(home.includes('id="publicContactForm"'), 'Contact form missing');
assert(home.includes('name="website"'), 'Contact honeypot missing');
assert(admin.includes('content="noindex,nofollow"'), 'Admin should not be indexed');
assert(!publicJs.includes("});$('.desktop-nav a').forEach("), 'Navigation selector regression');
assert(adminJs.includes('function safeHttpUrl('), 'Admin URL safety helper missing');
assert(publicJs.includes("db.functions.invoke('submit-contact'"), 'Contact form must call protected Edge Function');
assert(!publicJs.includes("db.from('contact_messages').insert"), 'Direct public contact INSERT must not return');
assert(read('supabase/functions/submit-contact/index.ts').includes('/rest/v1/rpc/submit_portfolio_contact'), 'Protected contact RPC is missing');
assert(read('supabase/contact-security.sql').includes('revoke insert on public.contact_messages from anon, authenticated;'), 'Direct INSERT revocation missing');
assert(publicJs.includes('const safeHttpUrl=value=>'), 'Public URL safety helper missing');
assert(publicJs.includes('socials.data.filter(s=>safeHttpUrl(s.url))'), 'Social URL scheme filtering missing');
assert(publicJs.includes('safeHttpUrl(p.project_url)'), 'Project URL scheme filtering missing');
assert(publicJs.includes('.finally(setupAnalyticsConsent)'), 'Analytics consent must initialize even if content loading fails');
assert(!/sb_secret_[A-Za-z0-9_-]+|AIza[0-9A-Za-z_-]{20,}/.test(config + publicJs + adminJs), 'Browser code contains a secret-looking value');
console.log('Static portfolio validation passed.');
