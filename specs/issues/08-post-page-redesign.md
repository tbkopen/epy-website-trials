# Issue #8 — Post Page: Clarity Redesign & Fixes

> Source: [tbkopen/epy-website-trials#8](https://github.com/tbkopen/epy-website-trials/issues/8)
> "Many issues in the post page, please take a deep look and redesign with more clarity."
> Reference post in screenshots: `_posts/2026-02-01-backpropagation-is-the-chain-rule.md`

This plan breaks the issue into **7 discrete problems**, each with a confirmed root
cause (file + line), the exact fix, robustness notes, and how to verify. It
respects the core architecture rule: **content files stay content-only; all visual
decisions live in `_layouts/`, `_includes/`, and `_sass/`.**

## Summary of problems

| # | Problem | Type | Needs decision? |
|---|---------|------|-----------------|
| P1 | Huge empty gap between TOC and article body | CSS layout | No |
| P2 | Article text column too narrow | CSS layout | No |
| P3 | Related-posts row is asymmetric (empty right slot) | CSS layout | No |
| P4 | Missing course promotion CTA (opt-in per post) | Data + template + CSS | No |
| P5 | TOC font size too small | CSS | No |
| P6 | Redundant author card; want optional inline author name | Template + CSS | No |
| P7 | Comments not rendering on many posts | JS + config | **Yes (infra)** |

Only **P7** still needs an infra decision (the production Remark42 host) — see
[Open Decisions](#open-decisions) at the end. Everything else can proceed now.

### Author & course behaviour (agreed)
- **Course CTA is opt-in and explicit.** Each course gets a stable `uid`. A post
  opts in by setting `related_course: <uid>` in its frontmatter. If present, that
  course's card renders in the post; if the variable is absent, **no card renders**.
  No automatic category/tag matching.
- **No separate author card at the bottom.** The author name is shown inline in the
  post meta line (`date · X min read · Author Name · tags`), in a colour distinct
  from the category chips. It is driven by the optional `author` frontmatter
  variable: present → name shows; absent → no author name on that post.

---

## P1 + P2 — Layout gap and narrow text column

These are the same root cause, so they are fixed together.

### Root cause
`_layouts/post.html:41`:
```html
<div class="post__content{% unless page.toc %} post__content--full{% endunless %} container--narrow">
```
The content lives in a CSS grid cell (`_sass/3-layout/_page-sections.scss:215`,
`.post__layout { grid-template-columns: 240px 1fr; }`). That `1fr` cell is
~1000px wide on desktop. But the element **also** carries `container--narrow`,
which applies `max-width: 720px; margin-inline: auto` (`_sass/3-layout/_container.scss:12`).
Result: the article is capped to 720px **and centered inside the 1000px cell**,
producing (a) a large dead gap between the 240px TOC and the text, and (b) a text
column that looks unnecessarily narrow.

### Fix
1. **`_layouts/post.html`** — remove `container--narrow` from the *TOC branch*.
   Keep the narrow, centered treatment only for the no-TOC full-width case
   (which already uses `.post__content--full` with its own `max-width`).

   ```html
   <div class="post__content{% unless page.toc %} post__content--full{% endunless %}">
   ```

2. **`_sass/3-layout/_page-sections.scss`** — in `.post__layout`:
   - Widen the content column and tighten the rail so the text starts right
     after the TOC. Change `grid-template-columns: 240px 1fr;` to
     `grid-template-columns: 220px minmax(0, 1fr);` and bump the gap to
     `var(--space-12)`.
   - Constrain readability on `.post__content` itself with a **left-aligned**
     measure instead of a centered container:
     ```scss
     &__content {
       min-width: 0;
       max-width: 74ch;   // readable measure, left-aligned (no auto margins)
       padding-bottom: var(--space-16);
       &--full { grid-column: 1 / -1; max-width: var(--container-narrow); margin-inline: auto; }
     }
     ```
   - `74ch` at `--type-body-large` lands ~760–800px — wider than today's 720px
     (addresses P2) while staying within a comfortable reading measure.

3. Verify the `@media (max-width: 1024px)` block still collapses to a single
   column (it does — `.post__content` max-width just caps width, and the mobile
   rule sets `max-width: var(--container-narrow)` on the layout wrapper).

### Robustness
- Do **not** hardcode pixel widths on the content; `ch` scales with font size so
  the measure stays correct if body type changes.
- `minmax(0, 1fr)` prevents long code blocks / KaTeX overflow from blowing out
  the grid track (a real risk on math posts).

### Verify
`bundle exec jekyll serve` → open the backprop post → confirm: no gap between TOC
and text; text column visibly wider; no horizontal scroll on wide code/math blocks;
resize to <1024px collapses cleanly.

---

## P3 — Related-posts row asymmetry

### Root cause
`_includes/related-posts.html` renders 3 cards into `.post-grid`
(`_sass/3-layout/_page-sections.scss:279`):
```scss
.post-grid { grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); }
```
Inside the full-width `.container` (max 1280px) this fits **4** columns, but only
3 cards exist → an empty 4th track on the right → the asymmetry called out in the
screenshot.

### Fix (chosen: dedicated 3-up grid)
Give related posts its own modifier rather than reusing the auto-fill blog grid.

1. **`_includes/related-posts.html`** — change the grid class:
   ```html
   <div class="post-grid post-grid--related">
   ```
2. **`_sass/3-layout/_page-sections.scss`** — add:
   ```scss
   .post-grid--related {
     grid-template-columns: repeat(3, 1fr);
     @media (max-width: 900px) { grid-template-columns: repeat(2, 1fr); }
     @media (max-width: 640px) { grid-template-columns: 1fr; }
   }
   ```
   Three equal columns fill the row symmetrically at any width; the cards get
   wider (satisfying "increase the width of the existing cards").

### Alternative considered
Show 4 related posts (bump `maxRelated` to 4 in `related-posts.html:1`). Rejected
as default because many posts won't have 4 topically-related siblings, which would
reintroduce an empty slot. The 3-up fixed grid is robust regardless of count 1–3.
(If `related.size` is 1 or 2, `repeat(3,1fr)` leaves trailing empty tracks — add a
`&:has(...)` count guard only if that looks bad in practice; most posts return 3.)

### Verify
Open a well-connected post (backprop returns 3) → row is symmetric, cards wider.
Open a sparsely-tagged post → check 1–2 card case is acceptable.

---

## P4 — Opt-in course promotion CTA (referenced by UID)

### Root cause
The post layout (`_layouts/post.html`) includes no course CTA. `course-cta.html`
exists but only picks a *featured* course and is used solely in the blog-index
sidebar (`_layouts/blog-index.html:36`). Courses also have **no stable
identifier** today — they are addressable only by their filename-derived slug
(`_courses/mathematical-foundations.md` → slug `mathematical-foundations`), which
is fragile if a file is ever renamed.

### Design (agreed)
A post explicitly names the course it wants to promote, via a stable UID. Absent
variable → no card. No automatic matching.

### Fix

1. **Give every course a stable `uid`.** Add a `uid:` field to the frontmatter of
   each file in `_courses/` (5 files). Keep it short, kebab-case, and permanent —
   decoupled from the filename so renames don't break references. Example:
   ```yaml
   # _courses/mathematical-foundations.md
   title: "Mathematical Foundations of Machine Learning"
   uid: math-foundations
   status: available
   ```
   Suggested UIDs: `math-foundations`, `linear-algebra-ml`, `probability-inference`,
   `numerical-computing`, `algorithms-in-depth`. Document the field in
   `.claude/context/conventions.md` and add it to `.claude/templates/course.md`
   so new courses always get one.

2. **Post opts in via frontmatter.** A post that wants a CTA sets:
   ```yaml
   # e.g. _posts/2026-02-01-backpropagation-is-the-chain-rule.md
   related_course: math-foundations
   ```
   No variable = no card. Add the (empty) key to `.claude/templates/post.md` with a
   comment so authors know it exists.

3. **New include `_includes/post-course-cta.html`** — look the course up by UID and
   render only on an exact hit:
   ```liquid
   {% if page.related_course %}
     {% assign course = site.courses | where: "uid", page.related_course | first %}
     {% if course %}
     <aside class="post-cta card" aria-label="Related course">
       <div class="post-cta__body">
         <p class="post-cta__eyebrow">Go deeper</p>
         <h3 class="post-cta__title">{{ course.title }}</h3>
         {% if course.description %}<p class="post-cta__desc">{{ course.description | truncate: 120 }}</p>{% endif %}
       </div>
       <a class="btn btn--filled" href="{{ course.url | relative_url }}">Explore the course →</a>
     </aside>
     {% endif %}
   {% endif %}
   ```
   Note the double guard: nothing renders if `related_course` is unset **or** if it
   points at a UID that no course matches (typo / retired course) — so a bad
   reference fails safe instead of erroring or showing a broken card.

4. **`_layouts/post.html`** — include it right after the prose, before share
   buttons (the author bio include is being removed in P6):
   ```html
   </div> <!-- .prose -->
   {% include post-course-cta.html %}
   {% include share-buttons.html %}
   ```

5. **New SCSS `_sass/4-components/_post-cta.scss`** (register it in the components
   layer of `assets/css/main.scss`): a horizontal card, primary-tinted background
   (`color-mix(in srgb, var(--color-primary) 8%, transparent)`), title + one-line
   desc on the left, filled button on the right; stacks vertically under 640px.
   Reuse existing `.btn--filled`, card radius, and spacing tokens — **no new colour
   values**.

### Robustness / notes
- UID lookup is O(courses) per post — trivial at this scale.
- Because matching is exact-UID, a post can promote *any* course regardless of
  topic overlap (e.g. a probability post can still promote the flagship course) —
  full editorial control, which is the point.
- Keep it a **single** CTA to avoid a salesy feel; it should read as a helpful next
  step, matching the lead-gen goal in `CLAUDE.md`.
- Optional later: validate at build time that every `related_course` resolves, to
  catch typos. Not required for v1 (fails safe already).

### Verify
- Post with `related_course: math-foundations` → that course's card renders with
  correct title/description/link.
- Post with no `related_course` → no card.
- Post with `related_course: does-not-exist` → no card, no build error.

---

## P5 — TOC font size too small

### Root cause
`_sass/4-components/_toc.scss:42`: `.toc__list a { font-size: var(--type-body-small); }`
= `0.75rem` / 12px (`_sass/1-tokens/_root.scss:99`) — too small to scan.

### Fix
Bump to `--type-body-medium` (0.875rem / 14px) and give the nested heading levels
a touch more room:
```scss
.toc__list a {
  font-size: var(--type-body-medium);
  line-height: 1.4;
  padding-block: var(--space-2);          // was --space-1, improves tap/scan target
  &.toc-h4 { font-size: var(--type-body-small); } // keep deepest level compact
}
```

### Verify
TOC entries are comfortably legible; active-item highlight still aligns; the
sidebar still fits the 220px rail without wrapping most titles (long headings
already wrap gracefully).

---

## P6 — Remove end-of-post author card; optional inline author name

### Root cause / current state
Two separate things render the author today:
- **The end-of-post card** — `_layouts/post.html:50` includes `author-bio.html`,
  which reads `_data/authors.yml`. That file still holds starter placeholders
  (`name: "[Your Name]"`, `github: ".../[your-handle]"`), so the card shows
  `[Your Name]` on every post. **This card is being removed entirely.**
- **The inline meta name** — `_includes/post-meta.html:5-8` *already* renders
  `page.author` inline in the meta row, gated by `{% if page.author %}`:
  ```html
  {% if page.author %}
  <span class="post-meta__sep" aria-hidden="true">·</span>
  <span class="post-meta__author">{{ page.author }}</span>
  {% endif %}
  ```
  So the mechanism the user wants already exists — it is just (a) unused (no post
  sets `author`) and (b) unstyled: `.post-meta__author` has **no** SCSS rule, so it
  inherits the muted `--color-on-surface-variant` and is indistinguishable from the
  date/reading-time.

### Design (agreed)
No separate author card. Author name is optional and shown inline in the meta line
(`date · X min read · Author Name · tags`), in a colour distinct from the category
chips. Driven by the optional `author` frontmatter variable.

### Fix
1. **Remove the end card.** Delete the `{% include author-bio.html %}` line from
   `_layouts/post.html:50`. (Leave `_includes/author-bio.html` and
   `_sass/4-components/_author-bio.scss` in place but unused, or delete them — they
   have no other consumers. Recommend deleting to avoid dead code, and drop the
   `@use` for the author-bio partial from `assets/css/main.scss`.)

2. **Style the inline author name** so it reads as a distinct element. In
   `_sass/4-components/_post-meta.scss` add:
   ```scss
   &__author {
     color: var(--color-primary);   // distinct from muted date and from chips
     font-weight: 600;
   }
   ```
   The category chips use the outlined `.chip--filter` treatment, so a solid
   primary-coloured name is clearly differentiated (matches the screenshot intent:
   author name in a different colour than the `machine-learning` tag). If primary
   reads too close to the chip border, fall back to `var(--color-secondary)` — pick
   during review against both light and dark themes.

3. **Variable stays `author`** (already wired into `post-meta.html`). It is a plain
   display string, e.g. `author: "Aditya"`. Absent → no author shown. Document it in
   `.claude/context/conventions.md` and add an optional `author:` line (commented)
   to `.claude/templates/post.md`.
   - Note: removing `author-bio.html` also removes the only place that treated
     `page.author` as a *data key* into `authors.yml`. After this change `author` is
     unambiguously a display name — cleaner semantics, no conflict.

4. **JSON-LD (optional, recommended).** `_layouts/post.html:77` hardcodes the author
   as `site.data.authors['site-author'].name`. Change it to prefer the post's
   author when present:
   ```liquid
   "name": {{ page.author | default: site.data.authors['site-author'].name | jsonify }}
   ```
   Keeps structured data consistent with the visible byline.

### Robustness
- Fully optional and content-only: authors opt in with one frontmatter line; no
  CSS or markup in content.
- No more dependency on `_data/authors.yml` placeholders on the post page, so the
  `[Your Name]` string can never ship from here again.

### Verify
- Post with `author: "Aditya"` → name appears inline after reading-time, in the
  accent colour, visually distinct from the `machine-learning` chip, in both light
  and dark themes.
- Post with no `author` → meta line reads `date · X min read · tags`, no gap or
  stray separator.
- No author card at the bottom of any post.

---

## P7 — Comments not rendering on many posts

### Root cause (confirmed)
- `comments: true` is the site default (`_config.yml:93`), so `page.comments` is
  truthy on every post — comments are *supposed* to show everywhere.
- `_includes/comments.html:1` gates on `page.comments and site.remark42_host`.
  `remark42_host` is set to `http://localhost:8080` in **both** `_config.yml:18`
  **and** `_config.dev.yml`.
- Consequences:
  - **Production (HTTPS):** the "Comments" heading renders, then `comments.js`
    injects `http://localhost:8080/web/embed.js` → blocked as mixed content /
    unreachable → widget never appears. Users see an empty "Comments" section →
    exactly the screenshot.
  - **Local without Docker:** same empty section.
- `assets/js/features/comments.js` has **no failure or loading state**, so a failed
  embed leaves a bare heading with nothing under it.

### Fix
This has an infra decision (real Remark42 host — see below) plus code hardening
that should land regardless:

1. **Config** — replace the localhost placeholder in `_config.yml:18` with the real
   production Remark42 origin (HTTPS). Keep `_config.dev.yml` pointing at
   `http://localhost:8080` for local Docker, and **gate the widget on an explicit
   flag** so dev/CI without a server don't render a broken section. Add
   `comments_enabled: true` to `_config.yml` and `false` to `_config.dev.yml`
   (matches the `CLAUDE.md` note that dev disables the comments widget).

2. **`_includes/comments.html`** — gate on the new flag and add a loading
   placeholder the JS can replace:
   ```html
   {% if page.comments and site.comments_enabled and site.remark42_host %}
   <section class="comments" aria-label="Comments">
     <h2 class="comments__title">Comments</h2>
     <div id="remark42" data-host="..." data-site-id="..." data-url="...">
       <p class="comments__status" data-comments-status>Loading comments…</p>
     </div>
   </section>
   <script defer src="{{ '/assets/js/features/comments.js' | relative_url }}"></script>
   {% endif %}
   ```

3. **`assets/js/features/comments.js`** — add success/failure handling:
   - On `script.onerror`, replace the status node with a graceful message
     ("Comments are temporarily unavailable.") instead of leaving it blank.
   - Remove the "Loading comments…" node once `window.REMARK42` initialises
     (poll or listen), so a successful load isn't left with stale placeholder text.
   - Guard against injecting the embed twice.

### Robustness
- The explicit `comments_enabled` flag decouples "this post allows comments" from
  "a comment server is reachable in this environment", which is the actual bug.
- The error/loading states mean a future server outage degrades gracefully instead
  of looking broken.

### Verify
- Dev build (`_config.dev.yml`, no Docker): comments section hidden entirely.
- Dev with Remark42 Docker running + `comments_enabled: true`: widget loads.
- Simulate failure (bad host): status text shows the unavailable message, not a
  blank gap.
- Production build with the real host: widget renders on posts.

---

## Suggested implementation order

1. **P1+P2** (post.html + page-sections.scss) — biggest visual win, low risk.
2. **P5** (toc.scss) — one-line, independent.
3. **P3** (related-posts grid) — independent.
4. **P6** (remove author card, style inline author) — independent, no decision needed.
5. **P4** (course `uid`s + opt-in CTA include + SCSS) — additive.
6. **P7** — after the Remark42 host decision; ship JS/flag hardening regardless.

Group 1–5 into one commit ("Post page layout redesign & author/course refinements"),
P7 as its own commit since it touches config and behaviour.

## Files touched

| File | P1/2 | P3 | P4 | P5 | P6 | P7 |
|------|:--:|:--:|:--:|:--:|:--:|:--:|
| `_layouts/post.html` | ● | | ● | | ● | |
| `_sass/3-layout/_page-sections.scss` | ● | ● | | | | |
| `_sass/3-layout/_container.scss` | (read) | | | | | |
| `_sass/4-components/_toc.scss` | | | | ● | | |
| `_includes/related-posts.html` | | ● | | | | |
| `_courses/*.md` (add `uid`, ×5) | | | ● | | | |
| `_includes/post-course-cta.html` (new) | | | ● | | | |
| `_sass/4-components/_post-cta.scss` (new) | | | ● | | | |
| `assets/css/main.scss` (register/unregister partials) | | | ● | | ● | |
| `_includes/post-meta.html` (already wired) | | | | | (uses) | |
| `_sass/4-components/_post-meta.scss` (style author) | | | | | ● | |
| `_includes/author-bio.html` (delete) | | | | | ● | |
| `_sass/4-components/_author-bio.scss` (delete) | | | | | ● | |
| `.claude/templates/post.md` / `course.md` | | | ● | | ● | |
| `.claude/context/conventions.md` (document vars) | | | ● | | ● | |
| `_includes/comments.html` | | | | | | ● |
| `assets/js/features/comments.js` | | | | | | ● |
| `_config.yml` / `_config.dev.yml` | | | | | | ● |

## Verification (whole issue)
After all changes: `JEKYLL_ENV=production bundle exec jekyll build` must pass, then
serve locally and walk the backprop post top-to-bottom against the five screenshots.
Check a math-heavy post for grid overflow, and a short post (no related siblings)
for the related-grid empty-track edge case.

## Open Decisions

1. **Remark42 host (P7):** what is the real production Remark42 origin (HTTPS URL)?
   Needed to make comments work in production. Until provided, ship the flag +
   graceful-failure hardening so posts don't show a broken empty "Comments" section.

### Resolved (per discussion)
- **Course CTA (P4):** opt-in via `related_course: <course-uid>` in post frontmatter;
  courses get a stable `uid`. Absent variable → no card. No auto-matching.
- **Author (P6):** remove the end-of-post author card; show an optional inline author
  name in the meta line via the `author` frontmatter variable, styled in an accent
  colour distinct from the category chips.
