const fs = require('fs');
const s = fs.readFileSync('C:\\Users\\shalom\\Desktop\\dormtool\\dorm-checklist\\index.html', 'utf8');
const sc1e = s.indexOf('</script>', s.indexOf('<script>window.dataLayer')) + 9;
const s2 = s.indexOf('<script>', sc1e + 9);
const s2e = s.indexOf('</script>', s2);
const ms = s.substring(s2 + 8, s2e);

// Find the contact form end and what follows
const cf = ms.indexOf('cfSubmit');
const cfEnd = ms.indexOf("cfMessage", cf) + 20;
const afterCf = ms.substring(cf, cfEnd + 200);
console.log('Full contact form to end:', JSON.stringify(afterCf.substring(afterCf.length - 300)));
