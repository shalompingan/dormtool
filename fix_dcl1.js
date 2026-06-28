const fs = require('fs');
let s = fs.readFileSync('C:\\Users\\shalom\\Desktop\\dormtool\\dorm-checklist\\index.html', 'utf8');
const idx = s.indexOf("DOMContentLoaded',init");
console.log('Before:', JSON.stringify(s.substring(idx - 30, idx + 30)));
s = s.replace(";});}}document.addEventListener('DOMContentLoaded',init)", ";});}document.addEventListener('DOMContentLoaded',init)");
fs.writeFileSync('C:\\Users\\shalom\\Desktop\\dormtool\\dorm-checklist\\index.html', s, 'utf8');
const idx2 = s.indexOf("DOMContentLoaded',init");
console.log('After:', JSON.stringify(s.substring(idx2 - 30, idx2 + 30)));
