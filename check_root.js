const fs = require('fs');
let s = fs.readFileSync('C:\\Users\\shalom\\Desktop\\dormtool\\dorm-checklist\\index.html', 'utf8');
const m = s.match(/:root\{([^}]+)\}/);
if (m) console.log(':root ends with:', m[1].substring(m[1].length - 60));
else console.log(':root not found');

const idx = s.indexOf("DOMContentLoaded',init");
console.log('DCL:', JSON.stringify(s.substring(idx - 20, idx + 30)));
console.log('Has --hub-primary:', s.includes('--hub-primary'));
console.log('Has --hub-accent:', s.includes('--hub-accent'));
