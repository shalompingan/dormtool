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

    try {
      new Function(code);
    } catch(e) {
      const msg = e.message;
      // Try to get position from error
      const posMatch = msg.match(/position (\d+)/);
      if (posMatch) {
        const pos = parseInt(posMatch[1]);
        console.log(name + ' script[' + i + '] error at ' + pos);
        console.log('  Context: ' + JSON.stringify(code.substring(Math.max(0,pos-60), pos+60)));
      } else {
        // For V8, check stack
        console.log(name + ' script[' + i + ']: ' + msg);
        // Try Function constructor with detailed position
        try {
          // Attempt to zero in on the error by binary search
          for (let start = 0; start < code.length; start += 5000) {
            const chunk = code.substring(start, start + 5000);
            try { new Function(chunk); }
            catch(e2) { console.log('  Around ' + start + ': ' + e2.message); break; }
          }
        } catch(e3) {}
      }
    }
  });
});
