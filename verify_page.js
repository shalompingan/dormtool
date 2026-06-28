const fs = require('fs');
const { execSync } = require('child_process');

function verify(filePath) {
  const s = fs.readFileSync(filePath, 'utf8');
  const sc1e = s.indexOf('</script>', s.indexOf('<script>window.dataLayer')) + 9;
  const s2 = s.indexOf('<script>', sc1e + 9);
  const s2e = s.indexOf('</script>', s2);
  const ms = s.substring(s2 + 8, s2e);

  const tmp = 'C:\\Users\\shalom\\Desktop\\dormtool\\_tmp_v.js';
  fs.writeFileSync(tmp, ms, 'utf8');
  try { execSync('node -c "' + tmp + '"', { stdio: 'pipe', encoding: 'utf8' }); console.log('Syntax: OK'); }
  catch(e) { console.log('Syntax: FAIL -', e.stderr.split('\n').find(l => l.includes('SyntaxError'))); }

  let depth = 0, inStr = false, sc = '';
  for (let i = 0; i < ms.length; i++) {
    const c = ms[i], p = i > 0 ? ms[i-1] : '';
    if (inStr) { if (c === sc && p !== '\\') inStr = false; continue; }
    if (c === "'") { inStr = true; sc = c; continue; }
    if (c === '"') { inStr = true; sc = c; continue; }
    if (c === '`') { inStr = true; sc = c; continue; }
    if (c === '{') depth++;
    else if (c === '}') depth--;
  }
  console.log('Brace depth:', depth);
  console.log(':root has hub vars:', s.match(/:root\{[^}]*--hub-primary[^}]*--hub-accent[^}]*\}/) ? 'YES' : 'NO');
  fs.unlinkSync(tmp);
}

verify(process.argv[2]);
