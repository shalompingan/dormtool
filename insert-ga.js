const fs = require('fs');
const path = require('path');

const GA_TAG = `<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-C7V3YR4WTZ"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-C7V3YR4WTZ');
</script>`;

const files = [
  'C:\\Users\\shalom\\Desktop\\dormtool\\index.html',
  'C:\\Users\\shalom\\Desktop\\dormtool\\dorm-checklist\\index.html',
  'C:\\Users\\shalom\\Desktop\\dormtool\\dorm-laundry-hub\\index.html',
  'C:\\Users\\shalom\\Desktop\\dormtool\\move-out-checklist\\index.html',
  'C:\\Users\\shalom\\Desktop\\dormtool\\moving-cost-calculator\\index.html',
  'C:\\Users\\shalom\\Desktop\\dormtool\\first-apartment-checklist\\index.html',
  'C:\\Users\\shalom\\Desktop\\dormtool\\rent-affordability\\index.html',
  'C:\\Users\\shalom\\Desktop\\dormtool\\bill-splitter\\index.html',
];

let count = 0;
for (const file of files) {
  let html = fs.readFileSync(file, 'utf8');
  // Check if GA tag already exists
  if (html.includes('G-C7V3YR4WTZ')) {
    console.log(`SKIP (already has GA): ${file}`);
    continue;
  }
  // Insert after </title>
  html = html.replace('</title>', '</title>\n  ' + GA_TAG);
  fs.writeFileSync(file, 'utf8');
  console.log(`OK: ${file}`);
  count++;
}

console.log(`\nDone. Modified ${count} file(s).`);
