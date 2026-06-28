const fs = require('fs');
const { execSync } = require('child_process');
const src = fs.readFileSync('C:\\Users\\shalom\\Desktop\\dormtool\\dorm-checklist\\index.html', 'utf8');

// Find main script
const sc1end = src.indexOf('</script>', src.indexOf('<script>window.dataLayer')) + 9;
const script2 = src.indexOf('<script>', sc1end + 9);
const sc2end = src.indexOf('</script>', script2);
const mainScript = src.substring(script2 + 8, sc2end);

// Check syntax
const tmpFile = 'C:\\Users\\shalom\\Desktop\\dormtool\\_tmp_check.js';
fs.writeFileSync(tmpFile, mainScript, 'utf8');
try {
  execSync('node -c "' + tmpFile + '"', { stdio: 'pipe', encoding: 'utf8' });
  console.log('Syntax: OK');
} catch(e) {
  console.log('Syntax: FAIL');
}
fs.unlinkSync(tmpFile);

// Check TOOL_NAV_DATA
console.log('Has TOOL_NAV_DATA:', src.includes('TOOL_NAV_DATA'));
console.log('Has renderToolNav:', src.includes('renderToolNav'));
console.log('Has hub-header:', src.includes('hub-header'));
console.log('Has hubToolsMenu:', src.includes('hubToolsMenu'));
