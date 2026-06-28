const fs = require('fs');
let src = fs.readFileSync('C:\\Users\\shalom\\Desktop\\dormtool\\dorm-laundry-hub\\index.html', 'utf8');
const idx = src.indexOf("DOMContentLoaded',init");
console.log('Before fix context:', JSON.stringify(src.substring(Math.max(0, idx - 30), idx + 30)));

// Fix: add missing brace (braces=1 issue)
// Current: ;}document.addEventListener  → Need: ;}}document.addEventListener
const old = ";}document.addEventListener('DOMContentLoaded',init)";
const neu = ";}}document.addEventListener('DOMContentLoaded',init)";
if (src.includes(old) && !src.includes(neu)) {
  src = src.replace(old, neu);
  fs.writeFileSync('C:\\Users\\shalom\\Desktop\\dormtool\\dorm-laundry-hub\\index.html', src, 'utf8');
  console.log('Fixed: added missing }');
} else if (src.includes(neu)) {
  console.log('Already fixed');
} else {
  console.log('Pattern not found');
}
