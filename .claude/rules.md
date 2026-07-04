# Project Rules

These rules apply every time Claude works in this repository. Read before touching any file.

---

## Content vs Theme Separation (Most Important Rule)

**Content files (`_posts/`, `_courses/`, `_pages/`) must NEVER contain:**
- CSS class names
- JavaScript configuration or inline scripts
- Stylesheet references
- Visual layout instructions
- Colors, fonts, or sizes

**All theme/visual decisions live exclusively in:**
- `_layouts/` — page structure and feature injection
- `_includes/` — reusable UI components
- `_sass/` — all styles
- `assets/js/` — all scripts

A post author writes title, content, and a few content flags (`math: true`, `comments: true`). They should never need to know HOW math renders or HOW comments load. See `specs/12-template-architecture.md` for the full model.

---

## Always Do

- Use templates in `.claude/templates/` when creating new posts, courses, or pages
- Check the relevant `specs/` file before implementing any feature
- Run `bundle exec jekyll build` and confirm zero errors after structural changes
- Use CSS custom properties (`var(--color-primary)`) — never hardcode hex values in SCSS
- Follow the frontmatter schemas exactly as defined in `.claude/context/conventions.md`
- Set `math: true` in post frontmatter when and only when the post contains LaTeX
- Write `excerpt:` for every post and course (150–160 chars for SEO)
- Use the image path format: `/assets/images/{type}/YYYY-MM-DD-name.jpg`
- Ask before changing any URL structure — permalink changes break SEO and must have redirects

## Never Do

- Commit `_site/`, `.jekyll-cache/`, `vendor/`, `.bundle/`, or `.env`
- Put secrets, API keys, or tokens in any file tracked by Git
- Add `<script>` or `<link>` tags inside `_posts/` or `_courses/` files
- Change `url:` in `_config.yml` without confirming the target environment
- Use `!important` in SCSS except in `.u-` utility overrides
- Add render-blocking scripts in `<head>` — everything loads async/deferred
- Skip `bundle exec` when running Jekyll — run it in its bundle context

---

## Layout Rules

- Each layout is responsible for injecting all features its content type needs
- Layouts check `page.math`, `page.comments`, `page.toc` and include the relevant partials
- No layout should assume a feature is enabled without checking its flag
- When adding a new include, always make its injection conditional (`{% if ... %}`)

---

## SCSS Rules

- One partial per component in `_sass/components/`
- Variables only in `_sass/variables.scss` — no magic numbers elsewhere
- Mobile-first: base = mobile, then `min-width` media queries
- BEM naming: `.block__element--modifier`
- Dark mode via CSS custom properties under `@media (prefers-color-scheme: dark)` — not via class toggling

---

## JavaScript Rules

- Vanilla JS only — no framework unless explicitly decided
- One feature per file under `assets/js/`
- All `<script>` tags use `defer` — injected by layouts/includes, never by content files
- No inline event handlers — use `addEventListener`
- Guard against null: always check element exists before accessing it

---

## Git Rules

- Never commit on `main` without a working build
- Commit messages: imperative mood, present tense (`Add`, `Fix`, `Update` — not `Added`)
- Never force-push `main`

---

## Before Marking Any Task Done

1. `bundle exec jekyll build` produces zero errors and zero warnings
2. Math renders on a test post with `math: true`
3. No broken internal links
4. Responsive at 320px, 768px, 1024px, 1440px
5. `JEKYLL_ENV=production bundle exec jekyll build` also passes (analytics conditional, etc.)
