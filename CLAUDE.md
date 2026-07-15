# Elastropy — Blog & Course Platform

## Project Purpose
A Jekyll-based personal site where blog posts are the primary lead-generation channel and a Courses section handles product sales. The blog supports LaTeX math rendering (KaTeX) and community comments via self-hosted Remark42.

See `specs/README.md` for the full planning index and open decisions checklist.
See `.claude/rules.md` for all rules that apply when working in this repo.

---

## Quick Commands

| Command | Description |
|---------|-------------|
| `bundle exec jekyll serve` | Dev server at `http://localhost:4000` |
| `bundle exec jekyll serve --drafts` | Include posts in `_drafts/` |
| `bundle exec jekyll serve --livereload` | Auto-refresh on file save |
| `bundle exec jekyll serve --config _config.yml,_config.dev.yml` | With dev overrides |
| `bundle exec jekyll serve --force-polling` | Fix LiveReload in WSL if events don't fire |
| `bundle exec jekyll build` | Build to `_site/` |
| `JEKYLL_ENV=production bundle exec jekyll build` | Production build |
| `bundle exec jekyll build && npx pagefind --site _site` | Build + generate search index |
| `bundle install` | Install Ruby gem dependencies |
| `bundle update` | Update gems |

### Claude Code Commands (slash commands)

| Command | What it does |
|---------|-------------|
| `/new-post` | Creates a new blog post from template |
| `/new-course` | Creates a new course page from template |
| `/new-page` | Creates a new static page from template |
| `/build` | Runs production build and reports any errors |

---

## Directory Structure

```
.
├── _posts/           # Published blog posts (YYYY-MM-DD-slug.md)
├── _draftsposts/     # Archived posts moved out of _posts — NOT a Jekyll collection, so not built/published (restore by moving files back to _posts/)
├── _drafts/          # Unpublished drafts (no date prefix needed)
├── _courses/         # Course collection (one .md per course)
├── _pages/           # Static pages (about, contact, courses index, etc.)
├── _layouts/         # Page templates — OWN ALL VISUAL DECISIONS
├── _includes/        # Reusable partials (header, footer, math, comments, etc.)
├── _sass/            # SCSS partials (all styles live here)
├── _data/            # YAML data files (navigation, authors, site settings)
├── assets/
│   ├── css/          # Compiled stylesheet entry point (main.scss)
│   ├── js/           # JavaScript files — one feature per file
│   └── images/       # Site images (posts/, courses/, ui/ subdirectories)
├── _config.yml       # Main Jekyll configuration
├── _config.dev.yml   # Dev overrides (disables analytics, comments widget, etc.)
├── 404.html          # Custom 404 page
├── Gemfile           # Ruby dependencies
├── Gemfile.lock      # Locked gem versions (commit this)
├── .ruby-version     # Pins Ruby version for rbenv
├── .gitignore        # Excludes _site/, vendor/, .env, etc.
└── .claude/          # Claude Code project configuration
    ├── rules.md      # Rules for Claude when working in this project
    ├── settings.json # Allowed CLI commands
    ├── commands/     # Custom slash commands (/new-post, /new-course, etc.)
    ├── templates/    # Starter templates for posts, courses, pages
    └── context/      # Business context, conventions, architecture decisions
```

---

## Core Architecture Principle

**Content files (`_posts/`, `_courses/`, `_pages/`) only contain content.**
**`_layouts/` and `_includes/` own all theme and visual decisions.**

A post author sets `math: true` if they use LaTeX. The layout decides HOW to load KaTeX.
A post author sets `comments: true` (default). The layout decides HOW to embed Remark42.
No CSS classes, JS config, or visual settings ever appear in content files.

Full explanation: `specs/12-template-architecture.md`

---

## Creating New Content

Always use a template — never write frontmatter from scratch:

| Content type | Template | Command |
|-------------|----------|---------|
| Blog post | `.claude/templates/post.md` | `/new-post` |
| Course page | `.claude/templates/course.md` | `/new-course` |
| Static page | `.claude/templates/page.md` | `/new-page` |

---

## Recent Design Changes

- **Home hero** (`_layouts/home.html`, `_sass/3-layout/_page-sections.scss`): two-column layout —
  `<h1 class="hero__title">AI/ML &amp; Scientific Computing</h1>` followed by
  `<p class="hero__subtext">` (Expert-led courses… description) and the buttons on the left; the
  right side is now **image-based**, not hand-drawn SVG. `.hero__art-graphic` (`aspect-ratio:
  807/462`, `max-width: 600px`, centered; the right grid column is widened to `600px` to match
  and fill the vertical empty space beside the text) layers `base-clean.png` (the base 3D
  graphic) under four
  `.hero__art-overlay--*` PNGs (`box-pde.png`, `box-sciml.png`, `box-sim.png`,
  `center-graphic.png`), each absolutely positioned by percentage and given a subtle
  `floatCard` keyframe animation. **Dark mode**: each slot has a **light/dark `<img>` pair**
  (`.hero__art-media--light` / `--dark`); CSS shows one based on the `[data-theme]` attribute on
  `<html>` (set by `theme.js`), so the PNGs swap on the manual toggle, not just
  `prefers-color-scheme`. The dark variants are the same filenames with a `-dark` suffix
  (`base-clean-dark.png`, `box-pde-dark.png`, `box-sciml-dark.png`, `box-sim-dark.png`,
  `center-graphic-dark.png`) and must be supplied in `assets/uploads/` — the light PNGs have a
  baked-in white background so they can't be recolored in CSS. (This is keyed off `[data-theme]`
  rather than CSS `background-image` because the SCSS partials aren't Liquid-processed and can't
  use `relative_url`, and gh-pages sets a non-empty `baseurl`, so hardcoded CSS asset paths would
  404 there — `<img src="{{ … | relative_url }}">` is the baseurl-safe path.) **Important**: the
  files in `assets/uploads/` are mislabeled relative to their actual content (verified by cropping
  + aspect ratio, not filename) — the markup deliberately points each position slot at the file
  that visually matches, with a comment explaining this; do not "fix" the `src` values to match
  filenames. The 3-item feature
  strip (`.hero__stats`) that was originally added below the hero was removed by request — do
  not reintroduce it without checking with the user first. Buttons kept their original
  labels/links ("Browse Courses" → `/courses/`, "Read the Blog" → `/blog/`); only their variant
  changed (filled + outlined). Both `.hero__art-base` and the four `.hero__art-overlay` cards are
  edge-feathered with a `mask-image` (two intersected axis gradients — 7% on the base, 5% on the
  cards) so their opaque rectangular PNG backgrounds dissolve into the hero surface in both themes
  instead of showing hard borders. See `IMPLEMENTATION-PLAN.md` §4.2 for full detail.

- **Announcement / alert bar** (`_includes/notification.html`, `_sass/4-components/_alert-bar.scss`,
  `assets/js/features/notification.js`): a site-wide banner rendered above the header on every page
  (included in `_layouts/default.html` before `header.html`). Its content is configured in
  **`_pages/notification.md`** front matter (`enabled`, `text`, `button_text`, `button_url`); set
  `enabled: false` to hide it. That file is config-only (`layout: null`, not a visible page) and is
  read from the **`pages` collection via `site.collections`** — a direct `site.pages` lookup collides
  with Jekyll's built-in pages list and won't find it. The bar is theme-aware (primary fill +
  on-primary text, outlined button), so it blends in light and dark rather than a hard-coded blue.
  The **dismiss (X) button and the `notification.js` script are both commented out** in
  `notification.html` by request, so the bar is **not dismissible and always visible** on every page
  until `enabled: false`. Note: the script had to be disabled too, not just the button — its
  load-time check hid the bar for anyone with a prior dismissal stored in `localStorage`, which is
  what made the bar stop displaying. To restore dismissal, un-comment **both** the button and the
  script; `notification.js` then hides the bar on close and stores the dismissal in `localStorage`,
  keyed to the banner content (`data-alert-key`), so editing the text/button re-shows it to everyone.

- **Contact page** (`_pages/contact.md`, `_includes/contact-channels.html`,
  `_sass/4-components/_contact.scss`): the `/contact/` page is a **"How To Reach Us"** intro block
  followed by a **channel card grid** (Email, Telegram, WhatsApp, YouTube & Community). It is
  **data-driven**: the channel content (`icon`, `title`, `description`, `links[]`) and the `intro`
  paragraph live in **`contact.md` front matter**; the page body is just
  `{% include contact-channels.html %}`, and the include reads `page.channels` / `page.intro` and
  owns the markup (no CSS classes in the content file). To add/edit a channel, edit the front
  matter — `icon` is a **Material Symbols** name (`mail`, `send`, `chat`, `smart_display`). A link
  whose `url` contains `://` opens in a new tab (`target="_blank" rel="noopener"`); `mailto:`/`tel:`
  stay in-page. The page is **`wide: true`** so the header (breadcrumb + title) and the grid share
  the full `.container` width. Cards use an MD3 icon badge and all-token colours → **light/dark
  automatic**; the grid is **responsive 4 → 2 → 1** (1024px / 560px). See `IMPLEMENTATION-PLAN.md`
  §4.8.

- **Courses page filter** (`_includes/course-filter-control.html`, `_includes/course-filter.html`,
  `_sass/4-components/_course-filter.scss`, `assets/js/features/course-filter.js`, `_layouts/page.html`):
  the `/courses/` filter is a **segmented pill control** (`All N` / `Available N` / `Coming Soon N`)
  in the **page header**, not a dropdown above the grid. It's placed there via a **generic, opt-in
  header slot**: `page.html` renders `.page-header__row` (`__text` + `__actions`) **only when a page
  sets `header_include` in front matter** (`courses.md` → `header_include: course-filter-control.html`),
  resolved with Jekyll's dynamic `{% include {{ page.header_include }} %}`; every other page hits the
  unchanged `else` branch and renders **exactly as before** — do not assume the header changed
  site-wide. The control markup (segmented buttons) lives in `course-filter-control.html`; the grid +
  group dividers + filter `<script>` stay in `course-filter.html`. `course-filter.js` toggles
  `.is-active`/`aria-pressed`, shows/hides cards by `data-status`, hides the group dividers when a
  single status is selected, and persists the choice in the URL (`?show=…`). Button counts are static
  totals. Active pill = `--color-primary` fill; all-token colours → **light/dark automatic**. The
  filter `<script>` src carries a `?v={{ site.time | date: '%s' }}` cache-buster so a browser holding
  the pre-redesign cached copy (which queried the removed `<select>`) can't silently no-op. See
  `IMPLEMENTATION-PLAN.md` §4.9.

- **Breadcrumbs** (`_includes/breadcrumbs.html`, `_sass/4-components/_breadcrumb.scss`): one reusable
  include used by every header (`page.html`, `blog-index.html`, `post.html`, `course.html`,
  `archive.html`). `Home` is always prepended; callers pass `l1_*`/`current`. Separators are a **`/`
  slash** (not a Material icon). **Alignment rule**: every page header renders the breadcrumb inside
  the **full `.container`** so the crumb left-edge lines up across Blog, Courses, Contact, and posts.
  `post.html` in particular uses `.container` (not `.container--narrow`) for its header for exactly
  this reason — so its breadcrumb/title/cover align with the other pages and with the post body
  below. If you add a header, use `.container` (or `.container` when `wide`, per `page.html`), never
  `.container--narrow`, or the breadcrumb will be misaligned. See `IMPLEMENTATION-PLAN.md` §4.1.

- **Post header image removed** (`_layouts/post.html`): the post header **cover/hero image is
  commented out** by request, so no post shows a header image (the header is breadcrumb → title →
  meta only). This disables both branches — an uploaded `page.image` **and** the generated
  `cover.html` Σ banner. `page.image` is still emitted in the post's JSON-LD for SEO/social cards.
  **Post card thumbnails are also removed** (`post-card.html`): the card image block is commented
  out, so blog-index / home / related-posts cards are **text-only** (date · category, title,
  excerpt). This required dropping the `200px` image column from `.post-card--row` in
  `_cards.scss` (now `display: block`, full-width body) — otherwise row cards showed an empty
  gap. To restore thumbnails, un-comment the block in `post-card.html` **and** revert that
  `.post-card--row` grid change. Un-comment the block in `post.html` to restore the post hero.

## Key Files to Read First

| File | Why read it |
|------|------------|
| `specs/00-environment-setup.md` | New contributor setup from scratch (WSL) |
| `specs/12-template-architecture.md` | Understand the layout/content separation before touching any template |
| `.claude/context/conventions.md` | Frontmatter schemas, file naming, SCSS/JS rules |
| `.claude/context/decisions.md` | Why specific tech choices were made (ADRs) |
| `specs/README.md` | Full specs index + open decisions checklist |

---

## What NOT to Do

- Do not commit `_site/`, `.jekyll-cache/`, `vendor/`, `.bundle/`, `.env`
- Do not add `<script>` or `<style>` tags inside `_posts/` or `_courses/` files
- Do not hardcode Remark42 host, site ID, or any external service URL in templates — use `_config.yml` values
- Do not build with GitHub Pages' native Jekyll (it blocks required plugins) — always use CI
- Do not change any post's URL after publishing without setting up a redirect (see `specs/11-404-and-redirects.md`)
- Do not put secrets or API keys in any file tracked by Git
