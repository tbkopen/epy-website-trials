# Specs — Architecture & Implementation Documents

Complete planning documents for the blog & course platform. Review and annotate each file before implementation begins.

## Files

| # | File | Topic | Open Decisions |
|---|------|-------|----------------|
| 00 | [environment-setup.md](00-environment-setup.md) | WSL setup, Ruby, Jekyll, Docker, VS Code | — |
| 01 | [architecture.md](01-architecture.md) | System overview, component map, data flow | — |
| 02 | [tech-stack.md](02-tech-stack.md) | Technology choices with versions | — |
| 03 | [blog.md](03-blog.md) | Posts, math, comments, RSS, pagination, related posts | — |
| 04 | [courses.md](04-courses.md) | Course pages, sales funnel, payment | **Course platform TBD** |
| 05 | [navigation.md](05-navigation.md) | Site map, nav bar, footer, page specs | Pages TBD |
| 06 | [design-system.md](06-design-system.md) | Material 3 theme: palettes, type, elevation, components | — |
| 07 | [seo.md](07-seo.md) | Meta, structured data, sitemap, OG | — |
| 08 | [integrations.md](08-integrations.md) | Remark42, email, analytics, payment | **Email/analytics TBD** |
| 09 | [deployment.md](09-deployment.md) | Hosting, CI/CD, Remark42 server | **Hosting TBD** |
| 10 | [search.md](10-search.md) | Pagefind site search, index build, UI | — |
| 11 | [404-and-redirects.md](11-404-and-redirects.md) | 404 page, redirect strategy, catalog | — |
| 12 | [template-architecture.md](12-template-architecture.md) | Theme/content separation, layout chain | — |
| 13 | [css-architecture.md](13-css-architecture.md) | SCSS layers, token system, component naming | — |
| 14 | [javascript-architecture.md](14-javascript-architecture.md) | JS file structure, feature modules, dependencies | — |

## .claude Directory

| File/Dir | Purpose |
|----------|---------|
| `.claude/rules.md` | Rules Claude follows when working in this repo |
| `.claude/commands/new-post.md` | `/new-post` — create a blog post from template |
| `.claude/commands/new-course.md` | `/new-course` — create a course page from template |
| `.claude/commands/new-page.md` | `/new-page` — create a static page from template |
| `.claude/commands/build.md` | `/build` — production build with error reporting |
| `.claude/templates/post.md` | Blog post starter template |
| `.claude/templates/course.md` | Course page starter template |
| `.claude/templates/page.md` | Static page starter template |
| `.claude/context/project-overview.md` | Business goals, audience, funnel |
| `.claude/context/conventions.md` | Naming, frontmatter schemas, SCSS/JS rules |
| `.claude/context/decisions.md` | 12 ADRs with rationale (ADR-009–012 are new) |

## Open Decisions Checklist

All design and tech decisions have been made. Only business and infrastructure choices remain:

**Business (must define before build)**
- [ ] Target audience definition (`context/project-overview.md`)
- [ ] Course topics / initial course list (`04-courses.md`)
- [ ] Domain name(s)

**Infrastructure (must choose before deployment)**
- [ ] ADR-004: Course sales platform (Gumroad vs LemonSqueezy vs LMS)
- [ ] ADR-005: Static site hosting (Cloudflare Pages vs Netlify vs GitHub Pages)
- [ ] ADR-006: Email marketing platform (Kit vs Buttondown vs Beehiiv)
- [ ] ADR-007: Analytics (Plausible vs Umami vs GA4)
- [ ] Remark42 VPS provider (Hetzner / DigitalOcean / Fly.io)
- [ ] Contact form backend (Netlify Forms / Formspree / email link)

## Decided

| Decision | Spec |
|----------|------|
| Jekyll 4.3 as SSG | `02-tech-stack.md` |
| KaTeX for math (client-side) | `02-tech-stack.md` |
| Remark42 for comments (self-hosted) | `08-integrations.md` |
| Pagefind for site search | `10-search.md` |
| Material Design 3 as design system | `06-design-system.md` |
| Single seed color #1A5FC0 (all colors derived) | `06-design-system.md` |
| Token-first 5-layer SCSS architecture | `13-css-architecture.md` |
| Vanilla JS, one-feature-per-file, all deferred | `14-javascript-architecture.md` |
| System-preference dark mode + manual toggle | `14-javascript-architecture.md` |
