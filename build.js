/**
 * DormTool Build Script — Minify all HTML files for production.
 * Strips comments, collapses whitespace, minifies inline CSS/JS.
 * Supports --inplace mode (backup originals as *.orig) and dist/ mode.
 *
 * Usage:  node build.js            # minify to dist/
 *         node build.js --inplace  # minify in-place (Cloudflare Pages)
 *         node build.js --serve    # minify + start server on port 3000
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = __dirname;
const DIST = path.join(ROOT, 'dist');

// ─── CSS Minifier ───

function minifyCSS(css) {
    return css
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\s+/g, ' ')
        .replace(/\s*([{}:;,])\s*/g, '$1')
        .replace(/;\}/g, '}')
        .replace(/^\s+|\s+$/g, '')
        .replace(/\s*([{;])\s*/g, '$1');
}

// ─── JS Minifier ───

function minifyJS(js) {
    let out = '';
    let i = 0;
    let inStr = null;

    while (i < js.length) {
        let c = js[i];

        if (inStr) {
            out += c;
            if (c === '\\' && i + 1 < js.length) { i++; out += js[i]; }
            else if (c === inStr) inStr = null;
            i++;
            continue;
        }

        if (c === '`') { inStr = '`'; out += c; i++; continue; }
        if (c === "'" || c === '"') { inStr = c; out += c; i++; continue; }

        if (c === '/' && js[i + 1] === '/') {
            i += 2;
            while (i < js.length && js[i] !== '\n') i++;
            continue;
        }

        if (c === '/' && js[i + 1] === '*') {
            i += 2;
            while (i < js.length && !(js[i] === '*' && js[i + 1] === '/')) i++;
            i += 2;
            continue;
        }

        if (c === ' ' || c === '\t' || c === '\n' || c === '\r') {
            if (out.length > 0 && out[out.length - 1] !== ' ') out += ' ';
            i++;
            continue;
        }

        out += c;
        i++;
    }

    out = out.replace(/\s*([=+\-*\/%&|^!<>,;{}()\[\]])\s*/g, '$1');
    out = out.replace(/\+\s\+/g, '++');
    out = out.replace(/-\s-/g, '--');
    out = out.replace(/\b(function|if|for|while|switch|catch|return|typeof|new|delete|void)\s*\(/g, '$1(');
    out = out.replace(/\b(else|do|try|finally)\s*\{/g, '$1{');
    out = out.replace(/\s+;/g, ';');

    return out.trim();
}

// ─── HTML Minifier ───

function minifyHTML(html) {
    html = html.replace(/<style([^>]*)>([\s\S]*?)<\/style>/g, (m, attrs, content) => {
        return `<style${attrs}>${minifyCSS(content)}</style>`;
    });

    html = html.replace(/<script([^>]*)>([\s\S]*?)<\/script>/g, (m, attrs, content) => {
        if (/src\s*=|src="/.test(attrs)) return m;
        if (/ld\+json|application\/ld\+json/.test(attrs)) {
            try { return `<script${attrs}>${JSON.stringify(JSON.parse(content), null, 0)}</script>`; }
            catch (e) { return m; }
        }
        return `<script${attrs}>${minifyJS(content)}</script>`;
    });

    html = html.replace(/<!--(?!\[)[\s\S]*?-->/g, '');
    html = html.replace(/>\s+</g, '><');
    html = html.replace(/\s{2,}/g, ' ');
    html = html.split('\n').map(l => l.trim()).join('\n');
    html = html.replace(/\n\s*\n/g, '\n');

    return html.trim();
}

// ─── Static assets to copy (dist/ mode only) ───

const STATIC_FILES = [
    'robots.txt', 'sitemap.xml', 'CNAME'
];

// ─── File helpers ───

function getAllFiles(dir, ext) {
    const results = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            if (entry.name === 'dist' || entry.name === '.git') continue;
            results.push(...getAllFiles(full, ext));
        } else if (entry.name.endsWith(ext)) {
            results.push(full);
        }
    }
    return results;
}

// ─── Build ───

function build() {
    const inplace = process.argv.includes('--inplace');

    console.log(`🔨 DormTool Build — Minifying all HTML files...${inplace ? ' (in-place)' : ''}\n`);

    if (!inplace && fs.existsSync(DIST)) fs.rmSync(DIST, { recursive: true });
    if (!inplace) fs.mkdirSync(DIST, { recursive: true });

    const htmlFiles = getAllFiles(ROOT, '.html');

    let totalOrig = 0;
    let totalMin = 0;

    for (const srcPath of htmlFiles) {
        const relPath = path.relative(ROOT, srcPath);
        const original = fs.readFileSync(srcPath, 'utf-8');
        const minified = minifyHTML(original);

        if (inplace) {
            const bakPath = srcPath + '.orig';
            if (!fs.existsSync(bakPath)) fs.copyFileSync(srcPath, bakPath);
            fs.writeFileSync(srcPath, minified, 'utf-8');
        } else {
            const dstPath = path.join(DIST, relPath);
            fs.mkdirSync(path.dirname(dstPath), { recursive: true });
            fs.writeFileSync(dstPath, minified, 'utf-8');
        }

        const oSize = Buffer.byteLength(original, 'utf-8');
        const mSize = Buffer.byteLength(minified, 'utf-8');
        totalOrig += oSize;
        totalMin += mSize;
        const savings = ((1 - mSize / oSize) * 100).toFixed(0);

        console.log(`  ${relPath}`);
        console.log(`    ${(oSize/1024).toFixed(1)} KB → ${(mSize/1024).toFixed(1)} KB  (${savings}%)`);
    }

    if (!inplace) {
        for (const fname of STATIC_FILES) {
            const src = path.join(ROOT, fname);
            if (fs.existsSync(src)) {
                fs.copyFileSync(src, path.join(DIST, fname));
                console.log(`  ${fname} — copied`);
            }
        }
    }

    console.log(`\n📊 Total: ${(totalOrig/1024).toFixed(0)} KB → ${(totalMin/1024).toFixed(0)} KB  (saved ${((totalOrig-totalMin)/1024).toFixed(0)} KB, ${(((totalOrig-totalMin)/totalOrig)*100).toFixed(0)}%)`);

    if (inplace) {
        console.log('📝 Source files updated in-place. Originals saved as *.orig');
        console.log('💡 To restore: rename .html.orig back to .html');
    } else {
        console.log(`📁 Output: ${DIST}`);
    }

    return true;
}

// ─── Main ───

if (build()) {
    if (process.argv.includes('--serve')) {
        console.log('\n🚀 Starting preview server at http://localhost:3000');
        const serveDir = process.argv.includes('--inplace') ? ROOT : DIST;
        execSync(`npx serve "${serveDir}" -p 3000 --no-clipboard`, { stdio: 'inherit' });
    }
}
