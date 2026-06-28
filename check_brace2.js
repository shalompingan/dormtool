const fs = require('fs');
const s = fs.readFileSync('C:\\Users\\shalom\\Desktop\\dormtool\\dorm-checklist\\index.html', 'utf8');
const sc1e = s.indexOf('</script>', s.indexOf('<script>window.dataLayer')) + 9;
const s2 = s.indexOf('<script>', sc1e + 9);
const s2e = s.indexOf('</script>', s2);
const ms = s.substring(s2 + 8, s2e);

// Find DCL
const dcl = ms.indexOf("DOMContentLoaded',init");
console.log('DCL at:', dcl);
console.log('Context (40 before, 20 after):', JSON.stringify(ms.substring(dcl - 40, dcl + 20)));

// Find the } that makes depth -1
let depth = 0, inStr = false, sc = '';
for (let i = 0; i < ms.length; i++) {
  const c = ms[i], p = i > 0 ? ms[i-1] : '';
  if (inStr) { if (c === sc && p !== '\\') inStr = false; continue; }
  if (c === "'") { inStr = true; sc = c; continue; }
  if (c === '"') { inStr = true; sc = c; continue; }
  if (c === '`') { inStr = true; sc = c; continue; }
  if (c === '{') depth++;
  else if (c === '}') { depth--; if (depth < 0) { console.log('First negative at', i, 'ctx:', JSON.stringify(ms.substring(Math.max(0,i-60), i+20))); break; } }
}
