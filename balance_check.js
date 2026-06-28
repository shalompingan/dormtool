const fs = require('fs');
const base = 'C:\\Users\\shalom\\Desktop\\dormtool';
const names = ['dorm-laundry-hub', 'move-out-checklist', 'moving-cost-calculator', 'rent-affordability', 'bill-splitter'];

names.forEach(name => {
  const src = fs.readFileSync(base + '\\' + name + '\\index.html', 'utf8');
  const scriptTags = src.match(/<script>([\s\S]*?)<\/script>/g);
  if (!scriptTags) return;

  scriptTags.forEach((tag, i) => {
    const code = tag.replace('<script>', '').replace('</script>', '');
    if (code.length < 10 || code.includes('window.dataLayer') || code.includes('serviceWorker')) return;

    // Check paren/brace balance
    let parens = 0, braces = 0, brackets = 0;
    let inStr = false, strChar = '';
    let minParens = 0, errPos = -1;

    for (let i = 0; i < code.length; i++) {
      const ch = code[i];
      const prev = i > 0 ? code[i-1] : '';

      if (inStr) {
        if (ch === strChar && prev !== '\\') inStr = false;
        continue;
      }
      if (ch === "'") { inStr = true; strChar = ch; continue; }
      if (ch === '"') { inStr = true; strChar = ch; continue; }
      if (ch === '`') { inStr = true; strChar = ch; continue; }

      if (ch === '(') parens++;
      else if (ch === ')') { parens--; if (parens < minParens) { minParens = parens; errPos = i; } }
      else if (ch === '{') braces++;
      else if (ch === '}') braces--;
      else if (ch === '[') brackets++;
      else if (ch === ']') brackets--;
    }

    console.log(name + ':');
    console.log('  parens=' + parens + ' braces=' + braces + ' brackets=' + brackets);
    console.log('  min paren=' + minParens + ' at pos=' + errPos);
    if (errPos > 0) {
      console.log('  context: ' + JSON.stringify(code.substring(Math.max(0,errPos-80), errPos+20)));
    }
    console.log('');
  });
});
