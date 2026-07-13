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

---

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
