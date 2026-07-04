---
name: decisions
description: Architecture Decision Records (ADRs) — key technology and design choices with rationale
metadata:
  type: project
---

# Architecture Decision Records

Each ADR has a **Status**: `Decided` (locked in) or `Open` (needs your input before build).

---

## ADR-001 · Jekyll as Static Site Generator
**Status**: Decided

**Decision**: Use Jekyll over alternatives (Hugo, Astro, Next.js, Gatsby).

**Rationale**:
- Mature ecosystem; large plugin library (`jekyll-seo-tag`, `jekyll-sitemap`, `jekyll-feed`, etc.)
- Markdown-first workflow with collections — ideal for blog + courses structure
- Easy to start from existing themes; no JS framework required
- Wide hosting support (Netlify, Cloudflare Pages, GitHub Actions)

**Trade-offs**:
- Slower builds than Hugo on very large sites (not a concern at launch)
- Ruby dependency (vs Go for Hugo) — requires `bundle install`
- Must bypass GitHub Pages' native build to use third-party plugins

---

## ADR-002 · KaTeX for Math Rendering
**Status**: Decided

**Decision**: Use KaTeX (not MathJax) for LaTeX rendering.

**Rationale**:
- Renders ~5–10× faster than MathJax in the browser
- Option to pre-render server-side with `jekyll-katex` plugin (zero client-side JS for math)
- Smaller JS payload when used client-side via auto-render extension

**Trade-offs**:
- Less complete LaTeX macro coverage than MathJax (advanced commands may not render)
- If a macro is unsupported, the fallback is visible source text — test posts carefully

**Implementation**:
- Use `jekyll-katex` gem for server-side rendering (preferred — no JS needed)
- Fallback: load KaTeX CSS + auto-render JS only on pages where `math: true`

---

## ADR-003 · Remark42 for Blog Comments
**Status**: Decided

**Decision**: Self-host Remark42 instead of Disqus, Giscus, or other solutions.

**Rationale**:
- No ads, no tracking, fully privacy-respecting
- Free and open source (MIT)
- Supports OAuth login via GitHub, Google, Twitter, etc.
- Comment data stays under your control
- Telegram notifications support built-in

**Trade-offs**:
- Requires a small VPS to self-host (cheapest tier works — ~$4–6/month)
- You maintain the server; occasional updates needed

**Hosting**:
- Single Docker container on a small VPS (DigitalOcean, Hetzner, Fly.io)
- Reverse-proxied behind Caddy or Nginx with auto-HTTPS
- See `specs/08-integrations.md` and `specs/09-deployment.md` for setup detail

---

## ADR-004 · Course Sales Platform
**Status**: Open — **Decision needed before build**

**Decision needed**: Where will course purchases happen?

| Option | Fee | Pros | Cons |
|--------|-----|------|------|
| **Gumroad** | 10% per sale | Simplest setup, instant payouts | Higher fee, limited customization |
| **LemonSqueezy** | 5% + $0.50 | EU VAT handled automatically, good UI | Newer platform |
| **Teachable** | $39–$119/mo | Full LMS (videos, quizzes, certificates) | Monthly cost, less control |
| **Thinkific** | Free–$99/mo | Full LMS, free tier available | Limited free tier |
| **Gumroad + Notion/PDF** | 10% | Quick to launch, no hosting needed | Manual delivery |
| **Self-hosted (Stripe)** | 2.9% + $0.30 | Full control, lowest fees | Significant dev work |

**Recommendation**: Start with **LemonSqueezy** — lower fees than Gumroad, handles VAT globally, and you just embed a link on your course pages. Migrate to a full LMS only if you need video hosting or quizzes.

> **Action**: Confirm your choice and add `purchase_url` to each course's frontmatter.

---

## ADR-005 · Hosting for the Static Site
**Status**: Open — **Decision needed before build**

| Option | Cost | Pros | Cons |
|--------|------|------|------|
| **Netlify** | Free (generous limits) | Easy CI/CD, form handling, deploy previews | Bandwidth limits on free tier |
| **Cloudflare Pages** | Free | Fastest CDN globally, unlimited bandwidth | Slightly less mature CI/CD |
| **GitHub Pages + Actions** | Free | Zero cost, fully integrated with GitHub | No server-side processing |
| **Vercel** | Free | Fast, excellent DX | Not optimized for Jekyll |

**Recommendation**: **Cloudflare Pages** — unlimited bandwidth on free tier, very fast CDN, and straightforward GitHub integration. Netlify is a close second with better form handling.

> **Action**: Confirm hosting choice. This determines the CI/CD steps in `specs/09-deployment.md`.

---

## ADR-006 · Email Marketing
**Status**: Open — **Decision needed before build**

| Option | Cost | Notes |
|--------|------|-------|
| **Kit (ConvertKit)** | Free up to 10k subscribers | Creator-focused, good automation, tag-based |
| **Buttondown** | Free up to 100 subscribers | Minimal, markdown-native, $9/mo after |
| **Mailchimp** | Free up to 500 | Feature-rich but complex |
| **Beehiiv** | Free up to 2.5k | Newsletter-first, built-in referral program |

**Recommendation**: **Kit (ConvertKit)** for its creator-focused automation (tag subscribers by which course topic they clicked) or **Beehiiv** for its growth features. Buttondown if you want maximum simplicity.

> **Action**: Confirm choice. Embeds a signup form in post layouts and sidebar.

---

## ADR-007 · Analytics
**Status**: Open

| Option | Cost | Privacy |
|--------|------|---------|
| **Plausible** | $9/mo | Privacy-first, GDPR compliant, no cookies |
| **Umami** | Free (self-host) | Privacy-first, open source |
| **Google Analytics 4** | Free | Full-featured but requires cookie consent banner |
| **Cloudflare Web Analytics** | Free | Basic, privacy-respecting |

**Recommendation**: **Plausible** (paid) or **Umami** (self-hosted on same VPS as Remark42). Avoids cookie consent banners, which hurt UX and conversion on a blog.

---

## ADR-008 · Dark Mode
**Status**: Decided

**Decision**: System preference (`prefers-color-scheme`) as the base, plus a manual toggle stored in `localStorage`. Toggle managed by `assets/js/features/theme.js`; the `[data-theme]` attribute on `<html>` overrides system preference when set.

---

## ADR-009 · Design System
**Status**: Decided

**Decision**: **Material Design 3** (Material You) as the design system.

**Rationale**:
- Complete, well-documented system with defined tokens for color, type, elevation, shape, and motion
- Single-seed tonal palette system ensures all colors are harmonious by construction — no mixing palettes
- State layers (hover/press overlays) provide consistent interactivity across all components
- Dark mode is a first-class concern in MD3 — not an afterthought

**Trade-offs**:
- MD3's full web implementation (Material Web Components) is in JS — we do not use it; we implement MD3 visually in SCSS only
- No JS component library; everything is hand-crafted in vanilla JS + SCSS

**Full spec**: `specs/06-design-system.md`

---

## ADR-010 · CSS Architecture
**Status**: Decided

**Decision**: **Token-first, category-organized SCSS** in 5 numbered layers: tokens → base → layout → components → utilities.

**Rationale**:
- Tokens as CSS custom properties means dark mode, theming, and redesigns require changing one file
- Numbered layers enforce cascade discipline — lower layers never import from higher ones
- Single `main.scss` entry point; one compiled CSS file shipped to users

**Full spec**: `specs/13-css-architecture.md`

---

## ADR-011 · Color Palette Source
**Status**: Decided

**Decision**: Single seed color **#1A5FC0** (professional royal blue) for Elastropy's theme. All color roles derived from this seed via Material 3's HCT tonal palette algorithm. No colors from any other palette are used.

**Rationale**:
- Ensures perceptual harmony across all color roles in both light and dark themes
- Error palette (#BA1A1A) is the sole MD3 standardized exception

To change the entire theme: change only this seed in `specs/06-design-system.md` and rederive all tonal palette values.

---

## ADR-012 · JavaScript Strategy
**Status**: Decided

**Decision**: Vanilla JavaScript, no framework, one feature per file, all deferred.

**Rationale**:
- A blog-primary static site does not need a JS framework
- Smaller payload → better Core Web Vitals → better SEO rankings
- Each feature file is independent: breaking one does not break others

**Full spec**: `specs/14-javascript-architecture.md`
