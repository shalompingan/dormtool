// Pure static analysis of the site's HTML files -- no browser needed.
// Checks that navigation data, the blog ARTICLES list, _redirects targets,
// and sitemap.xml stay in sync with what actually exists on disk.
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');

const CANONICAL_TOOL_SLUGS = [
  'dorm-checklist',
  'dorm-laundry-hub',
  'move-out-checklist',
  'moving-cost-calculator',
  'first-apartment-checklist',
  'rent-affordability',
  'bill-splitter',
  'dorm-budget-calculator',
  'student-loan-calculator',
  'gpa-calculator',
  'final-grade-calculator',
  'college-acceptance-calculator',
  'roommate-agreement',
];

const SKIP_DIRS = new Set(['node_modules', '.git', '.wrangler', 'test-results', 'playwright-report']);

function listHtmlFiles(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      listHtmlFiles(path.join(dir, entry.name), out);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      out.push(path.join(dir, entry.name));
    }
  }
  return out;
}

// Finds the balanced {...} or [...] block starting at `startIdx` (which must
// point at the opening bracket), skipping over bracket-like characters that
// appear inside quoted strings.
function findBalanced(text, startIdx, openCh, closeCh) {
  let depth = 0;
  let inStr = null;
  let escaped = false;
  for (let i = startIdx; i < text.length; i++) {
    const ch = text[i];
    if (inStr) {
      if (escaped) escaped = false;
      else if (ch === '\\') escaped = true;
      else if (ch === inStr) inStr = null;
      continue;
    }
    if (ch === "'" || ch === '"') { inStr = ch; continue; }
    if (ch === openCh) depth++;
    else if (ch === closeCh) {
      depth--;
      if (depth === 0) return text.slice(startIdx, i + 1);
    }
  }
  return null;
}

// Finds `varName = {...}` or `varName = [...]` anywhere in `text` and returns
// { kind: 'object'|'array', block } or null if the variable isn't present.
function extractVarBlock(text, varName) {
  const re = new RegExp('\\b' + varName + '\\s*=\\s*([{[])');
  const m = re.exec(text);
  if (!m) return null;
  const openCh = m[1];
  const closeCh = openCh === '{' ? '}' : ']';
  const startIdx = m.index + m[0].length - 1;
  const block = findBalanced(text, startIdx, openCh, closeCh);
  if (!block) return null;
  return { kind: openCh === '{' ? 'object' : 'array', block };
}

// Extracts tool slugs from a TOOL_NAV_DATA/TOOL_DATA block regardless of
// whether it's an object keyed by slug (`{'slug':{...}, ...}`) or an array
// of entries with an `id` field (`[{id:'slug',...}, ...]`).
function extractSlugs({ kind, block }) {
  const slugs = new Set();
  const re = kind === 'object'
    ? /['"]([a-z0-9-]+)['"]\s*:\s*\{/g
    : /\bid\s*:\s*['"]([a-z0-9-]+)['"]/g;
  let m;
  while ((m = re.exec(block))) slugs.add(m[1]);
  return slugs;
}

test('navigation tool lists (TOOL_NAV_DATA / TOOL_DATA) include all 13 tools', () => {
  const files = listHtmlFiles(ROOT);
  const failures = [];

  for (const file of files) {
    const rel = path.relative(ROOT, file);
    const text = fs.readFileSync(file, 'utf8');

    const navData = extractVarBlock(text, 'TOOL_NAV_DATA');
    const toolData = extractVarBlock(text, 'TOOL_DATA');
    const found = navData || toolData;
    if (!found) continue; // page has no JS nav-data object (e.g. tools/index.html) -- not this check's concern

    const slugs = extractSlugs(found);
    const missing = CANONICAL_TOOL_SLUGS.filter((s) => !slugs.has(s));
    if (missing.length > 0) {
      failures.push(`${rel}: missing [${missing.join(', ')}] (has ${slugs.size}/${CANONICAL_TOOL_SLUGS.length})`);
    }
  }

  assert.equal(
    failures.length,
    0,
    `${failures.length} page(s) have an incomplete tool nav list:\n` + failures.join('\n')
  );
});

test('blog ARTICLES array matches the actual blog/ folders', () => {
  const blogIndex = path.join(ROOT, 'blog', 'index.html');
  const text = fs.readFileSync(blogIndex, 'utf8');
  const found = extractVarBlock(text, 'ARTICLES');
  assert.ok(found, 'ARTICLES array not found in blog/index.html');

  const ids = new Set();
  const idRe = /id\s*:\s*['"]([^'"]+)['"]/g;
  let m;
  while ((m = idRe.exec(found.block))) ids.add(m[1]);

  const blogDir = path.join(ROOT, 'blog');
  const folders = new Set(
    fs.readdirSync(blogDir, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => e.name)
  );

  const inArrayNotOnDisk = [...ids].filter((id) => !folders.has(id));
  const onDiskNotInArray = [...folders].filter((f) => !ids.has(f));

  assert.equal(
    inArrayNotOnDisk.length,
    0,
    `ARTICLES has id(s) with no matching blog/ folder: ${inArrayNotOnDisk.join(', ')}`
  );
  assert.equal(
    onDiskNotInArray.length,
    0,
    `blog/ folder(s) missing from ARTICLES (orphaned -- unreachable from the blog index): ${onDiskNotInArray.join(', ')}`
  );
});

test('_redirects targets all point to real pages', () => {
  const redirectsFile = path.join(ROOT, '_redirects');
  const lines = fs.readFileSync(redirectsFile, 'utf8')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'));

  const failures = [];
  for (const line of lines) {
    const parts = line.split(/\s+/);
    const dst = parts[1];
    if (!dst) continue;
    const relPath = dst.replace(/^\//, '').replace(/\/$/, '');
    const target = relPath
      ? path.join(ROOT, relPath, 'index.html')
      : path.join(ROOT, 'index.html');
    if (!fs.existsSync(target)) {
      failures.push(`${line}  ->  ${path.relative(ROOT, target)} does not exist`);
    }
  }

  assert.equal(failures.length, 0, `_redirects has broken target(s):\n${failures.join('\n')}`);
});

test('sitemap.xml URLs point to real pages, and no real page is missing from it', () => {
  const sitemapPath = path.join(ROOT, 'sitemap.xml');
  const xml = fs.readFileSync(sitemapPath, 'utf8');
  const locRe = /<loc>([^<]+)<\/loc>/g;
  const sitemapPaths = new Set();
  let m;
  while ((m = locRe.exec(xml))) {
    const url = m[1].trim();
    const urlPath = url.replace(/^https?:\/\/[^/]+/, '');
    sitemapPaths.add(urlPath.replace(/\/$/, '') || '/');
  }

  // 1) every sitemap URL must resolve to a real file on disk
  const broken = [];
  for (const p of sitemapPaths) {
    const relPath = p === '/' ? '' : p.replace(/^\//, '');
    const target = relPath ? path.join(ROOT, relPath, 'index.html') : path.join(ROOT, 'index.html');
    if (!fs.existsSync(target)) broken.push(p);
  }
  assert.equal(broken.length, 0, `sitemap.xml has URL(s) with no matching page:\n${broken.join('\n')}`);

  // 2) every real page (tool pages, static pages, blog articles) should be listed
  const expectedPaths = new Set(['/']);
  for (const slug of CANONICAL_TOOL_SLUGS) expectedPaths.add(`/${slug}`);
  for (const p of ['about', 'contact', 'privacy', 'terms', 'tools', 'blog']) expectedPaths.add(`/${p}`);
  const blogDir = path.join(ROOT, 'blog');
  for (const entry of fs.readdirSync(blogDir, { withFileTypes: true })) {
    if (entry.isDirectory()) expectedPaths.add(`/blog/${entry.name}`);
  }

  const missingFromSitemap = [...expectedPaths].filter((p) => !sitemapPaths.has(p));
  assert.equal(
    missingFromSitemap.length,
    0,
    `Page(s) exist on disk but are missing from sitemap.xml:\n${missingFromSitemap.join('\n')}`
  );
});
