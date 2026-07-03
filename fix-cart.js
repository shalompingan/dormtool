const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'move-out-checklist', 'index.html');
let html = fs.readFileSync(filePath, 'utf8');

// 1. Replace drawer CSS with sidebar CSS (inside @media(min-width:1024px) block)
// The drawer CSS is inside @media(min-width:1024px) block
const drawerCssBlock = `.cart-drawer,.cart-drawer-tab{display:none}@media(min-width:1024px){.cart-floating-bar{display:none!important}.cart-drawer{display:flex;flex-direction:column;position:fixed;right:0;top:60px;width:320px;max-height:calc(100vh - 60px);z-index:100;background:var(--card);box-shadow:-4px 0 20px rgba(0,0,0,.12);transform:translateX(100%);transition:transform .3s cubic-bezier(.22,1,.36,1);overflow:hidden;border-radius:0 0 0 var(--radius)}.cart-drawer.is-open{transform:translateX(0)}.cart-drawer-tab{display:flex;position:fixed;right:0;top:50%;transform:translateY(-50%);z-index:99;width:32px;height:48px;background:var(--primary);color:#fff;border:none;border-radius:6px 0 0 6px;cursor:pointer;font-size:.85rem;align-items:center;justify-content:center;flex-direction:column;gap:2px;box-shadow:-2px 2px 8px rgba(0,0,0,.15);transition:right .3s cubic-bezier(.22,1,.36,1);font-family:var(--font);line-height:1}.cart-drawer-tab:hover{background:var(--primary-dark);width:36px}.cart-drawer.is-open ~ .cart-drawer-tab{right:320px}.cart-drawer-tab .tab-count{font-size:.58rem;font-weight:700;background:rgba(255,255,255,.2);padding:0 4px;border-radius:6px;min-width:16px;text-align:center;line-height:1.4}.cart-drawer-header{padding:14px 16px 10px;font-size:.95rem;font-weight:700;border-bottom:2px solid var(--border);display:flex;align-items:center;justify-content:space-between;flex-shrink:0}.cart-drawer-close{background:none;border:none;font-size:1rem;cursor:pointer;color:var(--text-light);padding:2px 6px;border-radius:4px;line-height:1}.cart-drawer-close:hover{background:var(--bg);color:var(--text)}.cart-drawer-items{flex:1;overflow-y:auto;padding:8px 12px;min-height:60px}.cart-drawer-items .cart-empty{text-align:center;color:var(--text-light);font-size:.8rem;padding:30px 10px}.cart-drawer-items .cart-item{display:flex;align-items:center;gap:8px;padding:7px 6px;border-radius:6px;transition:background .15s}.cart-drawer-items .cart-item:hover{background:var(--bg)}.cart-drawer-items .ci-emoji{font-size:.9rem;flex-shrink:0}.cart-drawer-items .ci-name{font-size:.8rem;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.cart-drawer-items .ci-remove{background:none;border:none;cursor:pointer;font-size:.7rem;color:var(--text-light);padding:3px 5px;border-radius:3px;transition:all .12s;flex-shrink:0}.cart-drawer-items .ci-remove:hover{color:#FECACA;background:var(--risk-common-bg)}.cart-drawer-footer{padding:10px 14px 14px;border-top:2px solid var(--border);flex-shrink:0}.cart-drawer-count{font-size:.78rem;color:var(--text-light);margin-bottom:8px}.cart-drawer-checkout{width:100%;padding:11px 0;border:none;border-radius:var(--radius-sm);background:var(--primary);color:#fff;font-family:var(--font);font-size:.85rem;font-weight:700;cursor:pointer;transition:all .2s;display:flex;align-items:center;justify-content:center;gap:6px}.cart-drawer-checkout:hover{background:var(--primary-dark);box-shadow:0 4px 12px rgba(217,119,6,.35)}.cart-drawer-checkout:disabled{opacity:.4;cursor:not-allowed}}`;

const sidebarCssBlock = `.cart-sidebar{display:none}@media(min-width:1024px){.cart-floating-bar{display:none!important}.cart-sidebar{display:flex;flex-direction:column;background:var(--card);border-radius:var(--radius);box-shadow:var(--shadow);position:sticky;top:76px;max-height:calc(100vh - 90px);overflow:hidden}.cart-sidebar .cs-header{padding:14px 16px 10px;font-size:.95rem;font-weight:700;border-bottom:2px solid var(--bg);display:flex;align-items:center;gap:6px}.cart-sidebar .cs-header .cs-header-title{display:flex;align-items:center;gap:6px}.cart-sidebar .cs-items{flex:1;overflow-y:auto;padding:8px 12px;min-height:60px}.cart-sidebar .cs-empty{text-align:center;color:var(--text-light);font-size:.8rem;padding:30px 10px}.cart-sidebar .cs-item{display:flex;align-items:center;gap:8px;padding:7px 6px;border-radius:6px;transition:background .15s}.cart-sidebar .cs-item:hover{background:var(--bg)}.cart-sidebar .cs-item .ci-emoji{font-size:.9rem;flex-shrink:0}.cart-sidebar .cs-item .ci-name{font-size:.8rem;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.cart-sidebar .cs-item .ci-remove{background:none;border:none;cursor:pointer;font-size:.7rem;color:var(--text-light);padding:3px 5px;border-radius:3px;transition:all .12s;flex-shrink:0}.cart-sidebar .cs-item .ci-remove:hover{color:#DC2626;background:#FEE2E2}.cart-sidebar .cs-footer{padding:10px 14px 14px;border-top:2px solid var(--bg)}.cart-sidebar .cs-count{font-size:.78rem;color:var(--text-light);margin-bottom:8px}.cart-sidebar .cs-checkout{width:100%;padding:11px 0;border:none;border-radius:var(--radius-sm);background:var(--primary);color:#fff;font-family:var(--font);font-size:.85rem;font-weight:700;cursor:pointer;transition:all .2s;display:flex;align-items:center;justify-content:center;gap:6px}.cart-sidebar .cs-checkout:hover{background:var(--primary-dark);transform:translateY(-1px);box-shadow:0 4px 12px rgba(217,119,6,.35)}.cart-sidebar .cs-checkout:active{transform:translateY(0)}.cart-sidebar .cs-checkout:disabled{opacity:.4;cursor:not-allowed;transform:none;box-shadow:none}}`;

if (html.includes(drawerCssBlock)) {
  html = html.replace(drawerCssBlock, sidebarCssBlock);
  console.log('✅ Replaced drawer CSS with sidebar CSS');
} else {
  console.log('❌ Could not find drawer CSS block');
  // Try to find partial match
  if (html.includes('.cart-drawer,.cart-drawer-tab{display:none}')) {
    console.log('  - Found cart-drawer display:none rule');
  }
  if (html.includes('.cart-drawer{display:flex')) {
    console.log('  - Found cart-drawer flex rule');
  }
}

// 2. Update app-layout CSS to add desktop grid
const oldLayout = `.app-layout{display:block;margin-top:10px}`;
const newLayout = `.app-layout{display:block;gap:16px;margin-top:10px}@media(min-width:1024px){.app-layout{display:grid;grid-template-columns:1fr 320px}}`;
if (html.includes(oldLayout)) {
  html = html.replace(oldLayout, newLayout);
  console.log('✅ Updated app-layout CSS');
} else {
  console.log('❌ Could not find app-layout CSS');
}

// 3. Replace drawer HTML with sidebar HTML
const drawerHtml = `<div class="cart-drawer" id="cartDrawer"><div class="cart-drawer-header"><span>🛒 Packing Supplies</span><button class="cart-drawer-close" id="cartDrawerClose">✕</button></div><div class="cart-drawer-items" id="cartDrawerItems"><div class="cart-empty">Add packing supplies to get started</div></div><div class="cart-drawer-footer"><div class="cart-drawer-count" id="cartDrawerCount">0 items</div><button class="cart-drawer-checkout" id="cartDrawerCheckout" disabled>🛒 Shop All (0) on Amazon ↗</button></div></div><button class="cart-drawer-tab" id="cartDrawerTab" title="Shopping Cart">🛒<span class="tab-count" id="cartDrawerTabCount">0</span></button>`;

const sidebarHtml = `<aside class="cart-sidebar" id="cartSidebar"><div class="cs-header"><span class="cs-header-title">🛒 Packing Supplies</span></div><div class="cs-items" id="csItems"><div class="cs-empty">Click <strong>Shop ↗</strong> on packing supplies to add them here</div></div><div class="cs-footer"><div class="cs-count" id="csCount">0 items</div><button class="cs-checkout" id="csCheckout" disabled>🛒 Shop All (0) on Amazon ↗</button></div></aside>`;

if (html.includes(drawerHtml)) {
  html = html.replace(drawerHtml, sidebarHtml);
  console.log('✅ Replaced drawer HTML with sidebar HTML');
} else {
  console.log('❌ Could not find drawer HTML');
  // Try shorter unique string
  if (html.includes('cart-drawer-header')) {
    console.log('  - Found cart-drawer-header in HTML');
  }
  if (html.includes('cartDrawerItems')) {
    console.log('  - Found cartDrawerItems ID');
  }
}

// 4. Update JS: replace drawer-related variable references with sidebar IDs
// renderCart function references
html = html.replace(/document\.getElementById\('cartDrawerItems'\)/g, "document.getElementById('csItems')");
html = html.replace(/document\.getElementById\('cartDrawerCount'\)/g, "document.getElementById('csCount')");
html = html.replace(/document\.getElementById\('cartDrawerCheckout'\)/g, "document.getElementById('csCheckout')");
html = html.replace(/document\.getElementById\('cartDrawerTabCount'\)/g, "document.getElementById('csCount')"); // fallback
console.log('✅ Updated renderCart references');

// 5. Update init event listeners
// Remove drawer tab click handler and drawer close click handler
// cartDrawerTab click → remove
// cartDrawerClose click → remove
// cartDrawerCheckout click → change to csCheckout
html = html.replace(
  `document.getElementById('cartDrawerTab').addEventListener('click',toggleCartDrawer);document.getElementById('cartDrawerClose').addEventListener('click',function(){document.getElementById('cartDrawer').classList.remove('is-open');});document.getElementById('cartDrawerCheckout').addEventListener('click',shopAll);`,
  `document.getElementById('csCheckout').addEventListener('click',shopAll);`
);
console.log('✅ Updated event listeners');

// 6. Remove toggleCartDrawer function if it exists
html = html.replace(/function toggleCartDrawer\(\)\{[^}]+}/g, '');
console.log('✅ Removed toggleCartDrawer function');

// 7. Update the cart-modal floating bar label to match
html = html.replace(
  `id="cartFloatingBar"><span class="cfb-label">🛒 <span id="cartCountMobile">0</span> Items</span>`,
  `id="cartFloatingBar"><span class="cfb-label">🛒 <span id="cartCountMobile">0</span> Items</span>`
);
// (Already says "Items" which is fine)

// 8. Fix app-layout in print media query
const oldPrintLayout = `.app-layout{display:block}`;
// Already has this in print section, but there might be a duplicate
html = html.replace(
  `@media print{@page{margin:1.5cm .8cm}body{background:#fff;font-size:11pt;color:#000;display:block!important;min-height:auto!important}.container{flex:none!important}.modal-overlay,.hub-header,.site-header,.tabs-wrap,.bottom-bar,.site-footer,.ad-placeholder,.cat-actions,.item-shop,.item-meta,.intro p,.intro .fine-warning,.item-remove,.add-item-form,.filter-bar,.cart-floating-bar,.cart-modal-overlay,.cart-drawer,.cart-drawer-tab,.category-panel,.deposit-cta{display:none!important}`,
  `@media print{@page{margin:1.5cm .8cm}body{background:#fff;font-size:11pt;color:#000;display:block!important;min-height:auto!important}.container{flex:none!important}.modal-overlay,.hub-header,.site-header,.tabs-wrap,.bottom-bar,.site-footer,.ad-placeholder,.cat-actions,.item-shop,.item-meta,.intro p,.intro .fine-warning,.item-remove,.add-item-form,.filter-bar,.cart-floating-bar,.cart-modal-overlay,.cart-sidebar,.category-panel,.deposit-cta{display:none!important}`
);
console.log('✅ Updated print CSS');

fs.writeFileSync(filePath, html, 'utf8');
console.log('✅ File saved');
