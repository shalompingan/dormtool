const fs = require('fs');

const PAGES = [
  {
    file: 'C:\\Users\\shalom\\Desktop\\dormtool\\index.html',
    url: 'https://dormtool.com/',
    type: 'WebSite',
    name: 'DormTool – Your Complete College Transition Toolkit',
    desc: 'Free interactive tools for college students: dorm checklist, laundry timer, move-out checklist, moving cost calculator, rent affordability calculator, bill splitter, and first apartment checklist.'
  },
  {
    file: 'C:\\Users\\shalom\\Desktop\\dormtool\\dorm-checklist\\index.html',
    url: 'https://dormtool.com/dorm-checklist/',
    type: 'WebApplication',
    name: 'College Dorm Checklist – The Ultimate Interactive Packing List',
    desc: 'Never forget a thing! Check off every dorm essential — bedding, bath, desk, electronics & more. Print your list and shop with one click.'
  },
  {
    file: 'C:\\Users\\shalom\\Desktop\\dormtool\\dorm-laundry-hub\\index.html',
    url: 'https://dormtool.com/dorm-laundry-hub/',
    type: 'WebApplication',
    name: 'Dorm Laundry Hub – Free Timer, Checklist & Guide for College Students',
    desc: 'Free dorm laundry timer with preset washer/dryer countdowns, laundry room checklist, and college laundry 101 guide. No signup, no download — works on any device.'
  },
  {
    file: 'C:\\Users\\shalom\\Desktop\\dormtool\\move-out-checklist\\index.html',
    url: 'https://dormtool.com/move-out-checklist/',
    type: 'WebApplication',
    name: 'Dorm Move-Out Checklist: Avoid Fines & Get Your Deposit Back (2026)',
    desc: 'Moving out of your dorm? Avoid $50-$1,000 in fines with our interactive checklist. Print, pack & pass inspection. Get your full deposit back.'
  },
  {
    file: 'C:\\Users\\shalom\\Desktop\\dormtool\\moving-cost-calculator\\index.html',
    url: 'https://dormtool.com/moving-cost-calculator/',
    type: 'WebApplication',
    name: 'Moving Cost Calculator for College Students: Estimate Your Move-Out Budget (2026)',
    desc: 'Free moving cost calculator for college students. Estimate truck rental, packing supplies, cleaning costs, and security deposit returns. No signup — print your budget.'
  },
  {
    file: 'C:\\Users\\shalom\\Desktop\\dormtool\\first-apartment-checklist\\index.html',
    url: 'https://dormtool.com/first-apartment-checklist/',
    type: 'WebApplication',
    name: 'First Apartment Essentials Checklist – Interactive Moving List',
    desc: 'Never forget a thing when moving into your first apartment! Interactive checklist with budget tracker — bedroom, kitchen, bathroom & more. Shop smart with one click.'
  },
  {
    file: 'C:\\Users\\shalom\\Desktop\\dormtool\\rent-affordability\\index.html',
    url: 'https://dormtool.com/rent-affordability/',
    type: 'WebApplication',
    name: 'Rent Affordability Calculator for College Students: How Much Rent Can You Afford? (2026)',
    desc: 'Calculate how much rent you can afford based on your income, student loans, and expenses. 30% rule, 50-30-20, and DTI methods. Free — no signup.'
  },
  {
    file: 'C:\\Users\\shalom\\Desktop\\dormtool\\bill-splitter\\index.html',
    url: 'https://dormtool.com/bill-splitter/',
    type: 'WebApplication',
    name: 'Roommate Bill Splitter: Split Rent & Utility Costs Easily (2026)',
    desc: 'Free roommate bill splitter calculator. Split rent, utilities, internet, and shared expenses equally or by income. No signup needed. Print your bill breakdown.'
  }
];

const TOOL_LINKS = [
  { name: 'DormTool Hub', url: 'https://dormtool.com/' },
  { name: 'Dorm Checklist', url: 'https://dormtool.com/dorm-checklist/' },
  { name: 'Dorm Laundry Hub', url: 'https://dormtool.com/dorm-laundry-hub/' },
  { name: 'Move-Out Checklist', url: 'https://dormtool.com/move-out-checklist/' },
  { name: 'Moving Cost Calculator', url: 'https://dormtool.com/moving-cost-calculator/' },
  { name: 'First Apartment Checklist', url: 'https://dormtool.com/first-apartment-checklist/' },
  { name: 'Rent Affordability Calculator', url: 'https://dormtool.com/rent-affordability/' },
  { name: 'Roommate Bill Splitter', url: 'https://dormtool.com/bill-splitter/' }
];

function buildJsonLd(page) {
  var typeStr = page.type === 'WebSite'
    ? '"@type": "WebSite"'
    : '"@type": ["WebApplication", "ItemPage"]';

  var extra = page.type === 'WebApplication'
    ? ',\n  "applicationCategory": "UtilityApplication",\n  "operatingSystem": "All",\n  "browserRequirements": "Requires JavaScript",\n  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }'
    : '';

  var mentions = TOOL_LINKS.map(function(t) {
    return '    { "@type": "WebPage", "name": ' + JSON.stringify(t.name) + ', "url": ' + JSON.stringify(t.url) + ' }';
  }).join(',\n');

  return '\n' + [
    '<script type="application/ld+json">',
    '{',
    '  "@context": "https://schema.org",',
    '  ' + typeStr + ',',
    '  "name": ' + JSON.stringify(page.name) + ',',
    '  "description": ' + JSON.stringify(page.desc) + ',',
    '  "url": ' + JSON.stringify(page.url) + extra + ',',
    '',
    '  "author": { "@type": "Organization", "name": "SettleList Labs", "url": "https://dormtool.com" },',
    '  "mainEntityOfPage": { "@type": "WebPage", "@id": ' + JSON.stringify(page.url) + ' },',
    '  "mentions": [',
    mentions,
    '  ]',
    '}',
    '</script>'
  ].join('\n') + '\n';
}

var count = 0;
PAGES.forEach(function(page) {
  var html = fs.readFileSync(page.file, 'utf8');
  var shortName = page.file.split('\\').pop();

  if (html.indexOf('application/ld+json') !== -1) {
    console.log('SKIP (has JSON-LD): ' + page.file);
    return;
  }

  var jsonld = buildJsonLd(page);

  // Find the position after </script> that closes the GA tag
  // Look for: gtag('config', 'G-C7V3YR4WTZ'); followed by </script>
  var gaEnd = html.indexOf("gtag('config', 'G-C7V3YR4WTZ');");
  if (gaEnd === -1) {
    console.log('FAIL (no GA config line): ' + page.file);
    return;
  }
  // Find the closing </script> after the GA config
  var scriptEnd = html.indexOf('</script>', gaEnd);
  if (scriptEnd === -1) {
    console.log('FAIL (no </script> after GA): ' + page.file);
    return;
  }

  var insertPos = scriptEnd + '</script>'.length;
  html = html.slice(0, insertPos) + jsonld + html.slice(insertPos);
  fs.writeFileSync(page.file, html, 'utf8');
  console.log('OK: ' + page.file);
  count++;
});

console.log('\nDone. Modified ' + count + ' file(s).');
