const fs = require('fs');
const { execSync } = require('child_process');
const s = fs.readFileSync('C:\\Users\\shalom\\Desktop\\dormtool\\dorm-checklist\\index.html', 'utf8');
const sc1e = s.indexOf('</script>', s.indexOf('<script>window.dataLayer')) + 9;
const s2 = s.indexOf('<script>', sc1e + 9);
const s2e = s.indexOf('</script>', s2);
const ms = s.substring(s2 + 8, s2e);
fs.writeFileSync('C:\\Users\\shalom\\Desktop\\dormtool\\_tmp_c.js', ms, 'utf8');
try { execSync('node -c "C:\\Users\\shalom\\Desktop\\dormtool\\_tmp_c.js"', { stdio: 'pipe', encoding: 'utf8' }); console.log('Syntax: OK'); }
catch(e) { console.log('Syntax: FAIL'); }
fs.unlinkSync('C:\\Users\\shalom\\Desktop\\dormtool\\_tmp_c.js');
