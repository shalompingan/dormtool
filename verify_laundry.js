const fs = require('fs');
const { execSync } = require('child_process');
const src = fs.readFileSync('C:\\Users\\shalom\\Desktop\\dormtool\\dorm-laundry-hub\\index.html', 'utf8');
const sc1end = src.indexOf('</script>', src.indexOf('<script>window.dataLayer')) + 9;
const script2 = src.indexOf('<script>', sc1end + 9);
const sc2end = src.indexOf('</script>', script2);
const mainScript = src.substring(script2 + 8, sc2end);

const tmpFile = 'C:\\Users\\shalom\\Desktop\\dormtool\\_tmp_check.js';
fs.writeFileSync(tmpFile, mainScript, 'utf8');
try {
  execSync('node -c "' + tmpFile + '"', { stdio: 'pipe', encoding: 'utf8' });
  console.log('Syntax: OK');
} catch(e) {
  const err = e.stderr.split('\n').find(l => l.includes('SyntaxError'));
  console.log('Syntax: FAIL -', err);
}
fs.unlinkSync(tmpFile);

// Quick brace check
let depth = 0, inStr = false, strChar = '';
for (let i = 0; i < mainScript.length; i++) {
  const ch = mainScript[i], prev = i > 0 ? mainScript[i-1] : '';
  if (inStr) { if (ch === strChar && prev !== '\\') inStr = false; continue; }
  if (ch === "'") { inStr = true; strChar = ch; continue; }
  if (ch === '"') { inStr = true; strChar = ch; continue; }
  if (ch === '`') { inStr = true; strChar = ch; continue; }
  if (ch === '{') depth++;
  else if (ch === '}') depth--;
}
console.log('Brace depth:', depth);

// Browser check
console.log('Has TOOL_NAV_DATA:', src.includes('TOOL_NAV_DATA'));
console.log('Has hub-header:', src.includes('hub-header'));
