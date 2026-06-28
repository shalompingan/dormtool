const fs = require('fs');
let src = fs.readFileSync('C:\\Users\\shalom\\Desktop\\dormtool\\dorm-checklist\\index.html', 'utf8');
const idx = src.indexOf("DOMContentLoaded',init");
console.log('Context:', JSON.stringify(src.substring(Math.max(0, idx - 30), idx + 30)));

// Fix: remove one extra }
const old = ";}}document.addEventListener('DOMContentLoaded',init)";
const neu = ";}document.addEventListener('DOMContentLoaded',init)";
if (src.includes(old)) {
  src = src.replace(old, neu);
  fs.writeFileSync('C:\\Users\\shalom\\Desktop\\dormtool\\dorm-checklist\\index.html', src, 'utf8');
  console.log('Fixed: removed stray }');
} else {
  console.log('Pattern not found');
}
