const fs = require('fs');
const s = fs.readFileSync('C:\\Users\\shalom\\Desktop\\dormtool\\dorm-checklist\\index.html', 'utf8');
const sc1e = s.indexOf('</script>', s.indexOf('<script>window.dataLayer')) + 9;
const s2 = s.indexOf('<script>', sc1e + 9);
const s2e = s.indexOf('</script>', s2);
const ms = s.substring(s2 + 8, s2e);

// Check what's right before DOMContentLoaded
const dcl = ms.indexOf("DOMContentLoaded',init");
console.log('Before DCL:', JSON.stringify(ms.substring(dcl - 80, dcl + 5)));
console.log();

// Find renderToolNav
const rtn = ms.indexOf('renderToolNav');
console.log('renderToolNav at:', rtn);
console.log('After renderToolNav:', JSON.stringify(ms.substring(rtn, rtn + 200)));
console.log();

// Find what's between the IIFE end and function openModal
const iifeEnd = ms.indexOf('})();', rtn);
if (iifeEnd > -1) {
  console.log('IIFE end at:', iifeEnd);
  const after = ms.substring(iifeEnd, Math.min(iifeEnd + 100, ms.length));
  console.log('After IIFE:', JSON.stringify(after));
}

// Check function openModal position
const om = ms.indexOf('function openModal');
console.log('\nfunction openModal at:', om);
console.log('After openModal context:', JSON.stringify(ms.substring(om - 20, om + 40)));
