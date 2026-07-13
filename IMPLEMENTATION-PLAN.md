# Elastropy — Redesign & Polish Implementation Plan

> **Goal:** Take the current working-but-rough Jekyll build to a **top-class, deploy-ready** website.
> **Scope:** Visual/design overhaul, typographic system, component polish, 20 blog posts, 5 courses, and a set of "premium" enhancements.
> **Status of current build:** Functionally complete (builds clean, serves at `localhost:4000`), but the design execution diverges from `specs/06-design-system.md` and has the glitches catalogued below.

---

## 0. How to use this document

Work **top to bottom by phase**. Each phase has:
- **Why** — the problem it fixes
- **Files** — exactly what to touch
- **Acceptance** — how to know it's done

Phases 1–4 are the design correction (do these first, in order). Phase 5 is content. Phase 6 is premium enhancements. Phase 7 is pre-deploy QA.

Check each item off as you go. Nothing here requires changing the *architecture* (the template/content separation and 5-layer SCSS are sound) — this is about **execution quality**.

---

## 1. Design Audit — What's Actually Wrong

These are concrete defects found by reading every source file against the spec, not vibes.

### 1.1 Typography — the single biggest weakness
| Problem | Evidence | Impact |
|---|---|---|
| **One font for everything.** `head.html` loads only `Inter` + `JetBrains Mono`. There is no display/brand face, so headlines and body look identical except in size. | `_includes/head.html` font link | Site reads "generic Bootstrap-y," not "top class." A maths-and-ideas blog needs a distinctive headline voice. |
| **No type tracking or per-role line-heights.** `_root.scss` defines sizes only; the spec specifies letter-spacing + line-height per role. | `_sass/1-tokens/_root.scss` type tokens | Loses MD3 refinement; large headings feel loose, small labels feel cramped. |
| **Reading measure not tuned.** Body line-height is `1.625`; spec calls for `1.8` in long-form post body. | `_sass/2-base/_typography.scss` | Long posts are less comfortable to read. |

### 1.2 Color — palette drift & hard-coded values
| Problem | Evidence |
|---|---|
| **Surfaces flattened to plain greys.** Built `--color-background: #FAFAFA`, `--color-surface-container: #EDEDF7` instead of the spec's warm-neutral tonal values (`#FEFBFF`, `#F0ECF1`). The harmonious "tinted neutral" feel is lost. | `_root.scss` vs spec §Color Roles |
| **Secondary role wrong.** Built `#595E7E`; spec `#525A89`. | `_root.scss` |
| **Hard-coded status colors break the single-seed rule.** Green chips use `#DCFCE7 / #166534 / #14532D / #BBF7D0` — colors from *outside* the palette, explicitly forbidden by the design system. | `_sass/4-components/_chips.scss:30,31,50,51` |
| **Hard-coded focus-ring rgba.** `rgba(26,95,192,.2)` literal instead of a token. | `_sass/4-components/_forms.scss:36,80` |
| **No elevation surface-tint.** Spec requires `color-mix(in srgb, var(--color-surface-tint) N%, var(--color-surface))` for cards; build uses flat container colors. | grep: `color-mix` → none |

### 1.3 Component & layout glitches
| Problem | Evidence | Fix preview |
|---|---|---|
| **Duplicated, hand-inlined breadcrumb.** `post.html` contains a `{% capture %}` breadcrumb hack *plus* an empty `{% include breadcrumbs.html %}` call above it. Dead code + divergence from the reusable include. | `_layouts/post.html` top | Make `breadcrumbs.html` accept a clean param list; call it once. |
| **Breadcrumb separator is a `/` glyph,** spec wants the `chevron_right` Material symbol. | `_sass/4-components/_breadcrumb.scss` | Use icon separator. |
| **Hero is flat & generic** — centered text on a plain surface, no visual interest. | `_layouts/home.html`, `.hero` | Add gradient/mesh + subtle math motif; refine scale & rhythm. |
| **Home is missing the "About blurb" section** the spec lists (section 4). | `home.html` vs spec §Home | Add short bio strip with portrait + "Read more." |
| **Card hover relies on `:has()` state-layer** that's fragile and double-paints with the link's own state. | `_sass/4-components/_cards.scss` | Simplify to a single hover elevation + one state layer. |
| **TOC sidebar fixed at 240px** crowds content on mid widths and vanishes abruptly < 1024px with no fallback (no inline TOC on mobile). | `_sass/3-layout/_page-sections.scss` | Add collapsible inline TOC for narrow screens. |
| **Footer is 3 columns; spec & nav data imply 4** (Site / Content / Legal / Connect) with social column. | `_data/navigation.yml`, `footer.html` | Add Connect column with social + RSS. |
| **Newsletter form unstyled vs spec** — spec wants it in a `--color-primary-container` panel with generous padding; build is a bare row. | `_sass/4-components/_forms.scss` | Add the container treatment. |
| **No real images** — every post/course points at missing JPGs (404s in server log). | server log | Ship generated SVG cover system (see 6.1). |
| **Reading time is manual frontmatter,** easy to forget / wrong. | posts | Auto-compute from word count. |

### 1.4 Polish gaps (present but flat)
- No scroll-to-top, no reading-progress indicator, no active-section animation beyond the basic observer.
- No empty-state / loading states for search beyond default Pagefind.
- Code blocks: no language label, copy button only appears on hover (not keyboard reachable in a discoverable way).
- No print stylesheet.
- No `prefers-reduced-motion` handling (spec explicitly lists it).
- Dark-mode toggle has no transition; theme flips harshly.

---

## 2. Phase 1 — Typographic System (highest visual ROI)

**Why:** Fixing type alone moves the site ~60% of the way to "top class."

### Decisions
- **Display/brand face:** `Fraunces` (a soft-modern serif with optical sizing) for `h1`/hero/post titles — gives editorial gravitas fitting "mathematical depth." *Alternative if you prefer sans:* `Space Grotesk`.
- **Body/plain face:** keep `Inter` (excellent for UI + long body).
- **Code:** keep `JetBrains Mono`.
- Pairing rationale: serif display + neutral sans body is the classic "smart publication" combination (Stripe Press, Quanta, Distill.pub all use a variant).

### Files
1. `_includes/head.html` — replace font link:
   ```
   Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700
   Inter:wght@300;400;500;600;700
   JetBrains+Mono:wght@400;500
   ```
2. `_sass/1-tokens/_root.scss`:
   - Add `--font-brand: 'Fraunces', Georgia, serif;`
   - Keep `--font-sans` (Inter), `--font-mono`.
   - Add **tracking** + **line-height** tokens per type role from spec table (display tight `-0.016em`, labels `+0.03em`, etc.).
3. `_sass/2-base/_typography.scss`:
   - Headings (`h1–h3`, `.hero__title`, `.post-header__title`, `.page-header__title`, `.section__title`) → `font-family: var(--font-brand)`, weight 600, optical sizing on.
   - Post body measure: `max-width: 68ch`, `line-height: 1.8`.
   - Tighten heading margins to a vertical rhythm (use `--space-*` multiples).
4. `_sass/2-base/_reset.scss` — set `font-optical-sizing: auto;` on `html`.

### Acceptance
- Headlines visibly distinct (serif) from body (sans).
- No layout shift on font load (add `&display=swap`, already present; consider `size-adjust` later).
- Lighthouse "Best Practices" unaffected.

---

## 3. Phase 2 — Color System Correction

**Why:** Restore the single-seed tonal harmony and kill palette violations.

### Files
1. `_sass/1-tokens/_root.scss` — **replace** light + dark color blocks with the *exact* values from `specs/06-design-system.md` §Color Roles (the warm-neutral surfaces: `#FEFBFF`, `#F6F2F7`, `#F0ECF1`, `#EBE7EC`, `#E5E1E6`; secondary `#525A89`; etc.). Add:
   - `--color-surface-container-lowest/highest`
   - `--color-inverse-primary`, `--color-scrim`, `--color-surface-tint`
   - `--color-focus-ring: color-mix(in srgb, var(--color-primary) 40%, transparent);`
2. `_sass/4-components/_chips.scss` — **remove all hex literals.** Map statuses to palette roles:
   - `available` → tertiary container (`--color-tertiary-container` / `--color-on-tertiary-container`) **or** a derived success token if you want green; if green is required, define it once as a documented exception token `--color-success*` in `_root.scss` (like Error), not inline in a component.
   - `coming-soon` → primary container
   - `archived` → surface-container + outline
3. `_sass/4-components/_forms.scss` — replace `rgba(26,95,192,.2)` with `var(--color-focus-ring)` (both occurrences).
4. `_sass/4-components/_cards.scss` — add MD3 elevation tint:
   ```scss
   &--elevated { background: color-mix(in srgb, var(--color-surface-tint) 5%, var(--color-surface)); }
   ```
   (levels 1/2/3 → 5%/8%/11%).
5. `_sass/4-components/_search.scss` — scrim → `color-mix(in srgb, var(--color-scrim) 32%, transparent)`.

### Acceptance
- `grep -rn '#[0-9A-Fa-f]\{6\}' _sass/ | grep -v _root.scss` → **empty**.
- `grep -rn 'rgba(' _sass/` → only inside `_root.scss` shadow tokens.
- Light theme surfaces have the subtle warm tint; cards lift with primary-tinted elevation.

---

## 4. Phase 3 — Component & Layout Fixes

### 4.1 Breadcrumbs (remove duplication)
- Rewrite `_includes/breadcrumbs.html` to accept a simple list param (already does) and render `chevron_right` icon separators per spec.
- In `_layouts/post.html`, `course.html`, `page.html`: **delete the inline `{% capture %}` blocks** and call the include once with the right crumb list.
- `_sass/4-components/_breadcrumb.scss`: separator via icon, not `/`.

### 4.2 Hero redesign (`home.html` + `_page-sections.scss`) — DONE (branch `feature/hero-redesign`)

Superseded the original plan (gradient-mesh, centered layout) with a two-column
"product hero" layout, matching a supplied reference design:

- **Layout**: `.hero__inner` is a 2-col grid ≥960px (content | illustration),
  single column + illustration hidden below that.
- **Content**: `.hero__title` is `<h1>AI/ML &amp; Scientific Computing</h1>`
  and `.hero__subtext` is the "Expert-led courses and corporate training for
  engineers…" description — both new copy (not the site tagline). Brand serif
  (`--font-brand`) kept on `.hero__title` for consistency with the rest of the
  type system, at heavier weight/tighter clamp than before. There is no
  separate badge/eyebrow element — the heading/subtext text carries what was
  originally split across a badge + separate headline.
- **Buttons unchanged**: still "Browse Courses" → `/courses/` (now `btn--filled`
  with an `arrow_forward` icon) and "Read the Blog" → `/blog/` (now
  `btn--outlined` instead of `btn--tonal`) — same labels/links as before the
  redesign, only the button variant changed to match the reference.
- **Background**: kept the original tinted radial-gradient background on
  `.hero` (primary/tertiary tint over `--color-surface`) — do not flatten this
  to plain white, that was explicitly reverted once already.
- **Illustration** (`.hero__art`, ≥960px only): hand-authored inline SVG —
  a dot-grid pattern, a 5×5 wireframe "surface" mesh (quadratic-bezier rows +
  computed column verticals) sitting on a platform ellipse, with dashed
  connector lines out to four floating `.hero__art-card` labels (Neural
  Operators, PDE Modeling, Scientific ML, Simulation) positioned absolutely
  by percentage. No binary/external image assets. (This was removed once by
  request and has since been restored — treat it as intentional/current.)
- **No feature strip**: the 3-column panel below the hero (`.hero__stats` —
  Strong Fundamentals / Practical Implementation / Real-world R&D) was built,
  then removed by request. The `<section class="hero">` now ends right after
  `.hero__inner` — do not re-add a stats/feature strip without checking first.

### 4.3 Home: add About strip
- New section between Newsletter and Courses: portrait (rounded), 2–3 sentence bio pulled from `_data/authors.yml`, "More about me →" link. New include `_includes/about-strip.html`.

### 4.4 Cards
- Collapse the `:has()` state-layer logic to: card has `transition: box-shadow, transform`; on `:hover`/`:focus-within` raise elevation + `translateY(-2px)`. Keep one subtle state layer, not two.
- Enforce `aspect-ratio: 16/9` on card media (spec), top-corner radius only.
- Line-clamp excerpts to 3 lines (`-webkit-line-clamp`).

### 4.5 TOC responsive
- < 1024px: render TOC as a `<details>` "On this page" disclosure above the article body instead of hiding it.
- Active link: animate the left marker with a transform, not a color jump.

### 4.6 Footer 4-column
- `_data/navigation.yml`: add `connect` column (Twitter, GitHub, LinkedIn, RSS, Email).
- `footer.html` + `_footer.scss`: 4 columns → 2 on tablet → 1 on mobile.

### 4.7 Newsletter panel
- Wrap `newsletter-form.html` markup in a `--color-primary-container` panel (`--shape-large`, `--space-8` padding) per spec; ensure input + button share height (48px) and the row collapses < 600px.

### Acceptance
- No `{% capture %}` breadcrumb hacks remain (`grep -rn 'capture' _layouts/`).
- Hero looks intentional and branded at 360px, 768px, 1280px.
- Footer shows 4 columns on desktop with working social links.

---

## 5. Phase 4 — Motion, A11y & Cross-cutting Polish

- `_sass/` new `5-utilities/_motion.scss`: add the full `prefers-reduced-motion` reset from spec.
- Theme toggle: animate `color`/`background` on `:root` with a 200ms transition (guarded by reduced-motion); persist already works.
- Add **skip-link** target check (`#main-content` exists ✓) and visible focus rings audit (spec focus style).
- Add **print stylesheet** (`5-utilities/_print.scss`): hide header/footer/comments/sidebars, black-on-white, show link URLs after anchors in articles.
- Code blocks: add language label chip (from Rouge's class) top-left; make copy button focusable and labelled.
- Add `loading="lazy"` + `decoding="async"` everywhere images render (cards already lazy; verify post/course hero uses eager only for LCP image).

### Acceptance
- `prefers-reduced-motion: reduce` disables transitions/animations.
- Tab through every page: visible focus on all interactive elements.
- Print preview of a post is clean and readable.

---

## 6. Phase 5 — Content: 20 Blog Posts + 5 Courses

This populates the theme enough to surface real design behavior (related posts, pagination across pages, category/tag archives, math, code, tables, long vs short).

### 6.0 Content engineering prerequisites
- **Auto reading-time**: add a small include `_includes/reading-time.html` computing `words / 200` and use it in `post-meta.html`; drop manual `reading_time` from frontmatter.
- **Category & tag archive pages**: enable `jekyll-paginate-v2` autopages OR add `_layouts/archive.html` + generator includes so category/tag chips link somewhere real (currently they link to `/blog/?category=` which does nothing).
- **Excerpt control**: ensure `excerpt_separator: <!--more-->` in `_config.yml` and place markers.
- **Cover image system**: see 6.1 — generate deterministic SVG covers so every post/course has art with zero binary assets.

### 6.1 Generative SVG cover system (no binary images needed)
- Add `assets/js`-free, build-time approach: a Liquid include `_includes/cover.html` that renders an inline SVG using the post's title hash → gradient angle + two palette-tone stops + a faint formula/glyph. Deterministic, theme-aware, zero 404s, infinitely scalable. Use for cards and post/course headers when no `image:` is set.

### 6.2 Blog post plan (20 posts)

Categories: `linear-algebra`, `probability`, `algorithms`, `machine-learning`, `analysis`, `computing`, `meta`.
Each row notes flags to exercise the system. Filenames `YYYY-MM-DD-slug.md`, spaced ~weekly so pagination spans 4 pages (6/page).

| # | Title | Category | Tags | math | toc | code | Length |
|---|-------|----------|------|:---:|:---:|:---:|------|
| 1 | Welcome to Elastropy *(exists — keep, restyle)* | meta | introduction | ✓ | ✓ | – | S |
| 2 | What Eigenvectors Actually Are *(exists — keep)* | linear-algebra | eigenvectors, geometry | ✓ | ✓ | – | L |
| 3 | The Singular Value Decomposition, Visually | linear-algebra | svd, geometry, pca | ✓ | ✓ | ✓ | L |
| 4 | Why Matrix Multiplication Is Defined "That Way" | linear-algebra | matrices, intuition | ✓ | ✓ | – | M |
| 5 | The Four Fundamental Subspaces | linear-algebra | rank, null-space | ✓ | ✓ | – | M |
| 6 | Bayes' Theorem as a Change of Belief | probability | bayes, inference | ✓ | ✓ | ✓ | M |
| 7 | The Central Limit Theorem from Scratch | probability | clt, distributions | ✓ | ✓ | ✓ | L |
| 8 | Concentration Inequalities You Should Know | probability | hoeffding, chebyshev | ✓ | ✓ | – | M |
| 9 | Markov Chains and the Stationary Distribution | probability | markov, pagerank | ✓ | ✓ | ✓ | L |
| 10 | Big-O Is About Growth, Not Speed | algorithms | complexity, intuition | ✓ | ✓ | ✓ | M |
| 11 | Dynamic Programming: The Two Questions | algorithms | dp, recursion | ✓ | ✓ | ✓ | L |
| 12 | How Quicksort Really Works (and When It Doesn't) | algorithms | sorting, analysis | ✓ | ✓ | ✓ | M |
| 13 | Gradient Descent, Step by Step | machine-learning | optimization, calculus | ✓ | ✓ | ✓ | L |
| 14 | The Bias–Variance Tradeoff, Demystified | machine-learning | generalization | ✓ | ✓ | ✓ | M |
| 15 | What a Neural Network Is Actually Computing | machine-learning | deep-learning, functions | ✓ | ✓ | ✓ | L |
| 16 | Backpropagation Is Just the Chain Rule | machine-learning | autodiff, calculus | ✓ | ✓ | ✓ | L |
| 17 | The ε–δ Definition, Finally Intuitive | analysis | limits, rigor | ✓ | ✓ | – | M |
| 18 | Taylor Series: Approximating Anything | analysis | series, calculus | ✓ | ✓ | ✓ | M |
| 19 | Floating Point: The Numbers Lie | computing | ieee754, numerics | ✓ | ✓ | ✓ | M |
| 20 | Vectorization: Why NumPy Is Fast | computing | numpy, performance | ✓ | – | ✓ | M |

> S ≈ 400–600 words, M ≈ 900–1400, L ≈ 1800–2600. Each post ends with a "Further reading" list and at least one cross-link to a related post (drives the related-posts module via shared category/tags).

**Authoring checklist per post:** frontmatter via `/new-post` template → intro hook → `<!--more-->` → sections with `##` (feeds TOC) → at least one display equation and one inline `$…$` → code block where flagged → a table or blockquote in ≥6 of them → closing CTA include.

### 6.3 Course plan (5 courses)

Statuses chosen to exercise all three card/page states; varied levels & prices.

| Slug | Title | Status | Level | Price | Notes |
|------|-------|--------|-------|------:|------|
| mathematical-foundations *(exists)* | Mathematical Foundations of Machine Learning | coming-soon | Intermediate | 149 | keep; expand modules |
| linear-algebra-for-ml | Linear Algebra for Machine Learning | available | Beginner | 99 | full sales page + `purchase_url` placeholder, features list, curriculum, FAQ, testimonials block |
| probability-and-inference | Probability & Statistical Inference | available | Intermediate | 129 | available state, full curriculum |
| algorithms-in-depth | Algorithms in Depth | coming-soon | Advanced | 179 | waitlist via newsletter |
| numerical-computing | Numerical Computing with Python | archived | Intermediate | – | exercises the archived state & "no longer available" copy |

**Each course page includes:** hero (status+level chips, price, CTA), "What you'll learn," curriculum (modules→lessons), "Who it's for," prerequisites, instructor bio, FAQ (`<details>`), testimonials, and a sticky purchase card (already in layout — verify states render).

### 6.4 New components needed for rich course pages
- `_includes/faq.html` (accessible `<details>` list, schema.org FAQPage JSON-LD).
- `_includes/curriculum.html` (modules + lessons from frontmatter `curriculum:` list).
- `_includes/testimonials.html`.
- Add styles `4-components/_faq.scss`, `_curriculum.scss`, `_testimonials.scss`; register in `main.scss`.

### Acceptance
- Blog index paginates to 4 pages; related-posts shows real matches; category chips lead to working archives.
- All five course states render correctly (available CTA, coming-soon waitlist, archived notice).
- Zero image 404s in the server log (covers generated).

---

## 7. Phase 6 — Premium Enhancements ("top class")

Ordered by impact. Pick all for a flagship feel.

1. **Reading-progress bar** — slim primary bar under the header that fills with scroll on post pages (`assets/js/features/progress.js`, `defer`, respects reduced-motion).
2. **Scroll-to-top FAB** — appears after 1 screen; MD3 small FAB, tertiary container.
3. **Estimated reading time + word count** — auto (6.0).
4. **Animated theme transition** + **system-sync** (already syncs; add View Transitions API progressive enhancement for the toggle).
5. **Generative SVG covers** (6.1) — signature visual identity, zero asset weight.
6. **KaTeX polish** — copy-as-LaTeX on click of a display equation; numbered equations with `\tag`; ensure dark-mode contrast.
7. **Code blocks** — language label, line highlighting via `{: .highlight-lines}`, accessible copy button with toast.
8. **Command palette (Ctrl/⌘-K)** — already opens search; extend to also jump to nav destinations and toggle theme.
9. **Related posts by score** — weight shared tags > shared category; show top 3 with covers.
10. **"Series" support** — frontmatter `series:`; auto "Part N of M" nav between posts in a series (great for the multi-part linear-algebra/ML arcs above).
11. **Social/OG images** — generate per-post OG card (SVG→PNG at build via a small script, or reuse the SVG cover); wire into `jekyll-seo-tag` `image`.
12. **Active-section TOC + smooth anchor scrolling** with offset for sticky header (partially present; refine).
13. **Search result previews** with category facets (Pagefind filters via `data-pagefind-filter`).
14. **Accessibility pass** — landmark roles, `aria-current`, color-contrast AA verified, focus order, skip link (mostly present; verify & document).
15. **Performance budget** — inline critical CSS for above-the-fold, `font-display: swap` + preconnect (present), lazy-load below-fold, defer all JS (present). Target Lighthouse ≥95 across the board.
16. **404 polish** — add the generative cover motif + popular posts (popular = most tags overlap or a manual `featured:` flag).
17. **RSS/JSON feed + "subscribe" affordances**, sitemap (present), `robots.txt` per-env (present).
18. **Analytics gate** (present, off in dev) — verify Plausible only loads in prod.

---

## 8. Phase 7 — Pre-Deploy QA Checklist

- [ ] `bash jekyll-serve.sh` → zero build warnings, zero 404s in log.
- [ ] `JEKYLL_ENV=production bundle exec jekyll build` succeeds; Pagefind index generated.
- [ ] Every page validates (no broken Liquid, no missing includes).
- [ ] Lighthouse (mobile + desktop) ≥ 95 Performance / 100 A11y / 100 Best-Practices / 100 SEO on Home, a post, a course.
- [ ] Visual check at 360 / 768 / 1024 / 1440 px, light **and** dark.
- [ ] Keyboard-only walkthrough of nav, search, TOC, theme toggle, forms.
- [ ] Screen-reader smoke test (VoiceOver/NVDA) on a post.
- [ ] All external placeholders documented in one place (`[Your Name]`, `[KIT_FORM_ID]`, `[FORMSPREE_FORM_ID]`, `purchase_url`s, social handles, avatar).
- [ ] `prefers-reduced-motion` and `prefers-color-scheme` both honored.
- [ ] Print preview of a post is clean.
- [ ] Links: internal (no 404s), external (`rel="noopener"`), feed, sitemap.

---

## 9. Suggested Execution Order (so the site always looks better, never broken)

1. **Phase 1 (Type)** → instant visible upgrade.
2. **Phase 2 (Color)** → harmony + kills violations.
3. **Phase 3 (Components/Layout)** → fixes the glitches you noticed.
4. **Phase 5 §6.0–6.1 (content infra + covers)** → removes 404s, unlocks rich content.
5. **Phase 5 content** → write posts/courses in batches of ~5; rebuild and eyeball pagination/related each batch.
6. **Phase 4 (Motion/A11y/Print)** → polish layer.
7. **Phase 6 (Enhancements)** → pick by impact; ship the flagship set.
8. **Phase 7 (QA)** → gate to deploy.

---

## 10. File-Change Index (quick reference)

**Tokens/base:** `_sass/1-tokens/_root.scss`, `_sass/2-base/_typography.scss`, `_sass/2-base/_reset.scss`, `_includes/head.html`
**Components:** `_sass/4-components/{_chips,_cards,_forms,_breadcrumb,_search,_toc,_pagination,_buttons}.scss` + new `{_faq,_curriculum,_testimonials,_progress,_fab}.scss`
**Utilities:** new `_sass/5-utilities/{_motion,_print}.scss`
**Layouts:** `_layouts/{home,post,course,page,blog-index}.html`
**Includes:** new `{about-strip,cover,reading-time,faq,curriculum,testimonials}.html`; edit `{breadcrumbs,footer,header,newsletter-form,post-meta,post-card,course-card,related-posts}.html`
**Data:** `_data/navigation.yml` (4th footer column), `_data/authors.yml` (bio/avatar)
**Config:** `_config.yml` (excerpt separator, autopages/archives), `main.scss` (register new partials)
**JS:** new `assets/js/features/{progress,fab,palette}.js`; refine `{toc,theme,search,copy-code,math}.js`
**Content:** 18 new `_posts/*.md`, 4 new `_courses/*.md`, archive layout/pages

---

*Owner: you. This plan is intentionally sequenced so the site is shippable after Phase 3 and flagship-grade after Phase 6.*
