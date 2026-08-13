# I built a student tools site as plain static HTML — no framework, no build step

I run [DormTool](https://dormtool.com), a set of free tools for college students — a dorm packing checklist, a rent affordability calculator, a roommate bill splitter, a GPA calculator, a moving cost estimator, and a bunch more. 13 tools now, 20+ blog posts.

Not here to pitch the product — wanted to talk about the stack, and an SEO mistake I caught this week that might be useful if you're running a content-heavy site solo.

**The stack is deliberately boring**

Plain static HTML/CSS/JS. Every tool is a single file — no framework, no backend, no database. Whatever a user types in stays in their browser, nothing gets uploaded. Deployed on Cloudflare Pages. Before each deploy I minify every HTML file in place (strip comments, collapse whitespace) — that's the only "build step" there is.

The upside is real: nothing to maintain dependency-wise, no server to babysit, pages load close to instantly. The cost is that editing gets more primitive, especially once a file is minified down to one line — a careless string replace can silently mangle adjacent code. So now every edit to a minified file gets verified immediately afterward with small scripts: JSON-LD validated with `json.loads`, section counts checked against the table of contents, div/tag counts checked for balance. One file at a time, verify right after — never batch a bunch of edits and check at the end.

**This week's actual lesson**

Going through Search Console, I found two pairs of articles quietly competing for the same keywords — one pair on calculating GPA, another on cleaning a dorm room. Same search terms, traffic split across two pages, neither ranking well.

Fix: read both articles in full, side by side — titles looking similar doesn't mean the content actually overlaps. I almost merged two other articles about rent budgeting because the titles looked like twins; read them fully and realized they served completely different audiences, left those alone. For the two pairs that were genuinely redundant: pulled whatever was unique from the weaker page into the stronger one, 301-redirected the weaker page, then tracked down and updated every internal link pointing to it.

Checked two more pairs that looked suspicious by title — this time pulled the real query data *before* touching anything, and both turned out to have zero keyword overlap. Would've burned an afternoon merging content that didn't need it. Also found one article sitting at zero impressions in Search Console — turned out it had just never been submitted for indexing. Fixed with a manual index request. Dumb, easy to miss.

The process that's emerged for a solo content site: suspect overlap → pull real query data before guessing from titles → read full text to confirm → merge + redirect + fix internal links → verify each step immediately, not all at once at the end.

Curious to hear from others running static/no-framework sites, or who've hit similar content-cannibalization issues.
