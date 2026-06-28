const fs = require('fs');
const s = fs.readFileSync('C:\\Users\\shalom\\Desktop\\dormtool\\dorm-checklist\\index.html', 'utf8');
const sc1e = s.indexOf('</script>', s.indexOf('<script>window.dataLayer')) + 9;
const s2 = s.indexOf('<script>', sc1e + 9);
const s2e = s.indexOf('</script>', s2);
const ms = s.substring(s2 + 8, s2e);

// Just get the last 500 chars to see the original structure
console.log('Last 500:', JSON.stringify(ms.substring(ms.length - 500)));
