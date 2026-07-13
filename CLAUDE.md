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

- **Home hero** (`_layouts/home.html`, `_sass/3-layout/_page-sections.scss`): redesigned as a
  two-column layout — `<h1 class="hero__title">AI/ML &amp; Scientific Computing</h1>` followed
  by `<p class="hero__subtext">` (Expert-led courses… description) and the buttons on the left,
  a hand-built inline-SVG illustration (`.hero__art*`) on the right. The 3-item feature strip
  (`.hero__stats`) that was originally added below the hero was removed by request — do not
  reintroduce it without checking with the user first. Buttons kept their original labels/links
  ("Browse Courses" → `/courses/`, "Read the Blog" → `/blog/`); only their variant changed
  (filled + outlined). See `IMPLEMENTATION-PLAN.md` §4.2 for full detail.

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
