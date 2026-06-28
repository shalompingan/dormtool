const fs = require('fs');
const path = require('path');

const TOOLS_DIR = 'C:\\Users\\shalom\\Desktop\\dormtool';

const PAGES = [
  { file: 'rent-affordability/index.html',         current: 'rent-affordability' },
  { file: 'bill-splitter/index.html',              current: 'bill-splitter' },
];

const NAV_CSS = `.hub-header{background:var(--hub-primary);color:#fff;padding:20px 20px 16px;position:sticky;top:0;z-index:200;box-shadow:0 2px 16px rgba(0,0,0,.2)}.hub-header .hub-inner{max-width:var(--max-w);margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:14px}.hub-logo{font-weight:800;font-size:1.35rem;letter-spacing:-.5px;display:flex;align-items:center;gap:8px;color:#fff}.hub-logo span{color:var(--hub-accent)}.hub-tagline{font-size:.78rem;color:rgba(255,255,255,.6);display:none}@media(min-width:640px){.hub-tagline{display:block}}.hub-hamburger{display:none}@media(max-width:767px){.hub-hamburger{display:flex;align-items:center;justify-content:center;background:none;border:none;color:#fff;font-size:1.3rem;cursor:pointer;padding:4px;margin-left:auto}}.hub-tools-btn{display:none;align-items:center;gap:4px;padding:4px 12px;border:1px solid rgba(255,255,255,.2);border-radius:6px;background:rgba(255,255,255,.08);color:rgba(255,255,255,.9);font-family:var(--font);font-size:.88rem;font-weight:700;cursor:pointer;white-space:nowrap;transition:all .15s}.hub-tools-btn:hover{background:rgba(255,255,255,.15);border-color:rgba(255,255,255,.3)}.hub-tools-dropdown{position:relative;display:none}@media(min-width:768px){.hub-tools-btn{display:flex}.hub-tools-dropdown{display:block}}.hub-tools-menu{display:none;position:absolute;top:calc(100%+6px);right:0;min-width:200px;background:var(--hub-primary);border:1px solid rgba(255,255,255,.12);border-radius:var(--radius-sm);box-shadow:0 12px 32px rgba(0,0,0,.3);padding:6px;z-index:300}.hub-tools-menu.is-open{display:block}.hub-tools-menu a{display:flex;align-items:center;gap:8px;padding:7px 10px;border-radius:6px;color:rgba(255,255,255,.85);text-decoration:none;font-size:.85rem;font-weight:500;transition:all .12s}.hub-tools-menu a:hover{background:rgba(255,255,255,.1);color:#fff}.hub-side-overlay{display:none;position:fixed;inset:0;z-index:400;background:rgba(0,0,0,.4)}.hub-side-overlay.is-open{display:block}.hub-side-panel{position:fixed;top:0;right:0;bottom:0;width:280px;max-width:80vw;background:var(--hub-primary);z-index:401;transform:translateX(100%);transition:transform .25s cubic-bezier(.22,1,.36,1);padding:24px 16px;overflow-y:auto;box-shadow:-4px 0 24px rgba(0,0,0,.2)}.hub-side-overlay.is-open .hub-side-panel{transform:translateX(0)}.hub-side-panel .hsp-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;padding-bottom:12px;border-bottom:1px solid rgba(255,255,255,.1)}.hub-side-panel .hsp-header .hsp-logo{font-weight:800;font-size:1.1rem;color:#fff}.hub-side-panel .hsp-close{background:none;border:none;color:rgba(255,255,255,.6);font-size:1.3rem;cursor:pointer;padding:4px;line-height:1}.hub-side-panel .hsp-item{display:flex;align-items:center;gap:10px;padding:14px 10px;border-radius:var(--radius-sm);color:rgba(255,255,255,.8);text-decoration:none;font-size:.9rem;font-weight:500;transition:all .15s}.hub-side-panel .hsp-item:hover{background:rgba(255,255,255,.1);color:#fff}.hub-side-panel .hsp-item .hsp-emoji{font-size:1.2rem;flex-shrink:0}`;

const TOOL_NAV_JS = `var TOOL_NAV_DATA={'dorm-checklist':{emoji:'🛏️',title:'Dorm Essentials Checklist',url:'../dorm-checklist/index.html'},'dorm-laundry-hub':{emoji:'🧺',title:'Dorm Laundry Hub',url:'../dorm-laundry-hub/index.html'},'move-out-checklist':{emoji:'📋',title:'Dorm Move-Out Checklist',url:'../move-out-checklist/index.html'},'moving-cost-calculator':{emoji:'🚚',title:'Moving Cost Calculator',url:'../moving-cost-calculator/index.html'},'first-apartment-checklist':{emoji:'🏢',title:'First Apartment Checklist',url:'../first-apartment-checklist/index.html'},'rent-affordability':{emoji:'💰',title:'Rent Affordability Calculator',url:'../rent-affordability/index.html'},'bill-splitter':{emoji:'💰',title:'Roommate Bill Splitter',url:'../bill-splitter/index.html'}};`;

const NAV_JS = `function renderToolNav(){var menu=document.getElementById('hubToolsMenu'),side=document.getElementById('hubSideItems');if(!menu&&!side)return;var mhtml='',shtml='';Object.keys(TOOL_NAV_DATA).forEach(function(id){var t=TOOL_NAV_DATA[id],href,trg;if(id===CURRENT_TOOL){href='javascript:;';trg='';}else{href=t.url;trg=' target="_blank" rel="noopener"';}mhtml+='<a href="'+href+'"'+trg+'>'+t.title+'</a>';shtml+='<a class="hsp-item" href="'+href+'"'+trg+'><span class="hsp-emoji">'+t.emoji+'</span>'+t.title+'</a>';});if(menu)menu.innerHTML=mhtml;if(side)side.innerHTML=shtml;}function toggleSide(open){var o=document.getElementById('hubSideOverlay');if(!o)return;o.classList.toggle('is-open',open);document.body.style.overflow=open?'hidden':'';}`;

const NAV_INIT = `renderToolNav();(function(){var h=document.getElementById('hubHamburger'),c=document.getElementById('hubSideClose'),o=document.getElementById('hubSideOverlay');if(h)h.addEventListener('click',function(){toggleSide(true);});if(c)c.addEventListener('click',function(){toggleSide(false);});if(o){o.addEventListener('click',function(e){if(e.target===this)toggleSide(false);});Array.from(o.querySelectorAll('.hsp-item')).forEach(function(a){a.addEventListener('click',function(){toggleSide(false);});});}var tb=document.getElementById('hubToolsBtn'),tm=document.getElementById('hubToolsMenu');if(tb&&tm){tb.addEventListener('click',function(e){e.stopPropagation();tm.classList.toggle('is-open');});Array.from(tm.querySelectorAll('a')).forEach(function(a){a.addEventListener('click',function(){tm.classList.remove('is-open');});});}document.addEventListener('click',function(){var x=document.getElementById('hubToolsMenu');if(x)x.classList.remove('is-open');});})();`;

const SIDE_PANEL = '<div class="hub-side-overlay" id="hubSideOverlay"><div class="hub-side-panel"><div class="hsp-header"><span class="hsp-logo">🛠 DormTool</span><button class="hsp-close" id="hubSideClose" aria-label="Close menu">✕</button></div><div id="hubSideItems"></div></div></div>';

function processFile(filePath, currentTool) {
  let content = fs.readFileSync(filePath, 'utf8');
  let mod = false;
  const rel = path.relative(TOOLS_DIR, filePath);

  console.log(`\n--- ${rel} ---`);

  // 1. Add --hub-primary/--hub-accent to :root
  const rootMatch = content.match(/:root\{([^}]+)\}/);
  if (rootMatch && !rootMatch[1].includes('--hub-primary')) {
    content = content.replace(':root{' + rootMatch[1] + '}', ':root{' + rootMatch[1] + ';--hub-primary:#0F172A;--hub-accent:#6366F1}');
    mod = true;
    console.log('  + :root vars');
  }

  // 2. Replace old header HTML with new
  const hdrStart = content.indexOf('<header class="site-header">');
  const hdrEnd = content.indexOf('</header>', hdrStart) + 9;
  if (hdrStart === -1 || hdrEnd < hdrStart) {
    console.log('  ! old header not found, skipping');
    return;
  }

  const oldHdr = content.substring(hdrStart, hdrEnd);
  const tagStart = oldHdr.indexOf('<div class="tagline">');
  const tagEnd = tagStart > -1 ? oldHdr.indexOf('</div>', tagStart) : -1;
  let rawTag = tagStart > -1 ? oldHdr.substring(tagStart + 19, tagEnd) : '';
  // Clean up: remove any leading garbage (minification sometimes merges > into the text)
  const gtIdx = rawTag.indexOf('>');
  const cleanTagline = gtIdx > -1 ? rawTag.substring(gtIdx + 1) : rawTag;

  const newHdr = '<header class="hub-header"><div class="hub-inner"><a href="../index.html" class="hub-logo">🛠 <span>Dorm</span>Tool</a><div class="hub-tagline">' + cleanTagline + '</div><nav class="hub-tools-dropdown"><button class="hub-tools-btn" id="hubToolsBtn">▾ Tools</button><div class="hub-tools-menu" id="hubToolsMenu"></div></nav><button class="hub-hamburger" id="hubHamburger" aria-label="Open tools menu">☰</button></div></header>';

  if (oldHdr !== newHdr) {
    content = content.substring(0, hdrStart) + newHdr + content.substring(hdrEnd);
    mod = true;
    console.log('  + header replaced: "' + cleanTagline + '"');
  }

  // 3. Remove old nav CSS, inject nav CSS
  const shPos = content.indexOf('.site-header{background:var(--primary)');
  const contPos = content.indexOf('.container{');
  const introPos = content.indexOf('.intro{');

  let oldNavEnd = -1;
  if (contPos > shPos) oldNavEnd = contPos;
  else if (introPos > shPos) oldNavEnd = introPos;

  if (shPos > -1 && oldNavEnd > shPos) {
    content = content.substring(0, shPos) + NAV_CSS + content.substring(oldNavEnd);
    mod = true;
    console.log('  + CSS replaced');
  } else {
    console.log('  ! CSS boundaries not found (shPos=' + shPos + ', contPos=' + contPos + ')');
  }

  // 4. Replace old nav init JS (handles multiple patterns)
  const oldNavIdx = content.indexOf("var navToggle=document.getElementById('navToggle')");
  const oldNavIdx2 = content.indexOf("var navToggle = document.getElementById('navToggle')");
  const oldNavIdx3 = content.indexOf("document.getElementById('navToggle').addEventListener");
  const oldNavIdx4 = content.indexOf("getElementById('navToggle').addEventListener('click'");

  let navIdx = -1;
  if (oldNavIdx > -1) navIdx = oldNavIdx;
  else if (oldNavIdx2 > -1) navIdx = oldNavIdx2;
  else if (oldNavIdx3 > -1) navIdx = oldNavIdx3;
  else if (oldNavIdx4 > -1) navIdx = oldNavIdx4;

  if (navIdx > -1) {
    // Find the end of the nav block by looking for the second }); pattern
    // (navToggle click handler ends with }); and document click handler ends with });)
    // Or for the "var" pattern, it's the var block ending with navLinks.addEventListener})
    let searchStart = content.indexOf('});', navIdx);
    if (searchStart === -1) searchStart = navIdx + 50;
    let navBlockEnd = content.indexOf('});', searchStart + 3);
    if (navBlockEnd === -1) navBlockEnd = content.indexOf('});', searchStart + 100);
    if (navBlockEnd === -1) navBlockEnd = content.length;

    // Extend: the nav block might end with });  or }  or );
    // Let's search for the expected ending pattern
    let blockEnd = navBlockEnd + 3;

    // Handle the "var" pattern: find the closing } of the if block
    if (oldNavIdx > -1 || oldNavIdx2 > -1) {
      // The var pattern ends with: navLinks.addEventListener('click',function(e){e.stopPropagation();});  or similar
      // Find the last }); before function openModal etc
      const lookAhead = content.indexOf('function openModal', navIdx);
      const endMark = (lookAhead > navIdx) ? content.lastIndexOf('});', lookAhead) : content.lastIndexOf('});', navIdx + 500);
      if (endMark > navIdx) blockEnd = endMark + 3;
    }

    content = content.substring(0, navIdx) + NAV_INIT + content.substring(blockEnd);
    mod = true;
    console.log('  + nav JS replaced');
  } else {
    console.log('  - old nav JS not found (may already be replaced or different format)');
  }

  // 5. Add TOOL_NAV_DATA, CURRENT_TOOL, NAV_JS before the main app script
  // Find the main app script by looking for the first <script> after the last </style>
  const styleEnd = content.indexOf('</style>');
  let scriptStart = -1;

  if (styleEnd > -1) {
    // Find the first <script> that's not GA and not SW (has substantial content)
    let pos = styleEnd;
    while ((scriptStart = content.indexOf('<script>', pos)) !== -1) {
      const scriptEnd = content.indexOf('</script>', scriptStart);
      const scriptLen = scriptEnd - scriptStart - 8;
      // Skip GA scripts (short) and SW scripts
      if (scriptLen > 500 && !content.substring(scriptStart + 8, scriptStart + 120).includes('window.dataLayer')) {
        break;
      }
      pos = scriptEnd + 9;
    }
  }

  if (scriptStart > -1 && !content.includes('TOOL_NAV_DATA')) {
    const navVars = TOOL_NAV_JS + "var CURRENT_TOOL='" + currentTool + "';" + NAV_JS;
    content = content.substring(0, scriptStart + 8) + navVars + content.substring(scriptStart + 8);
    mod = true;
    console.log('  + nav data/funcs added');
  } else if (content.includes('TOOL_NAV_DATA')) {
    console.log('  - nav data/funcs already present');
  } else {
    console.log('  ! script entry point not found');
  }

  // 6. Add side panel before </body>
  if (!content.includes('hubSideOverlay')) {
    content = content.replace('</body>', SIDE_PANEL + '</body>');
    mod = true;
    console.log('  + side panel added');
  }

  if (mod) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('  ✓ saved');
  } else {
    console.log('  - no changes');
  }
}

PAGES.forEach(p => {
  const fp = path.join(TOOLS_DIR, p.file);
  if (fs.existsSync(fp)) processFile(fp, p.current);
  else console.log(`\n! NOT FOUND: ${p.file}`);
});

console.log('\nDone!');
