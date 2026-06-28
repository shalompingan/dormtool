const fs = require('fs');
const s = fs.readFileSync('C:\\Users\\shalom\\Desktop\\dormtool\\dorm-checklist\\index.html', 'utf8');
const sc1e = s.indexOf('</script>', s.indexOf('<script>window.dataLayer')) + 9;
const s2 = s.indexOf('<script>', sc1e + 9);
const s2e = s.indexOf('</script>', s2);
const ms = s.substring(s2 + 8, s2e);

// Find the cfSubmit reference to locate the contact form code
const cf = ms.indexOf('cfSubmit');
console.log('cfSubmit area:', JSON.stringify(ms.substring(cf - 10, cf + 300)));
