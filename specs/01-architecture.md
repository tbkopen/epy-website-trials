# 01 — System Architecture

## Overview

The site is a **static Jekyll site** served from a CDN. There is no application server for the main site — all HTML is pre-built at deploy time. The only live server component is Remark42 (for comments), which runs on a separate small VPS and is called asynchronously from the browser.

---

## Component Map

```
┌─────────────────────────────────────────────────────────────────┐
│  BROWSER                                                        │
│                                                                 │
│   Static HTML/CSS/JS  ◄── CDN (Cloudflare Pages / Netlify)    │
│        │                                                        │
│        ├── [async] KaTeX CSS/JS ── renders math in-browser     │
│        │   (or pre-rendered server-side, no JS needed)         │
│        │                                                        │
│        ├── [async] Remark42 widget ──────────────────────────┐ │
│        │                                          ▼           │ │
│        │                             Remark42 Server (VPS)   │ │
│        │                             Docker + Caddy HTTPS     │ │
│        │                             your-domain.com/api/     │ │
│        │                                                       │ │
│        └── [click] Purchase link ──► External Course Platform  │ │
│                                     (Gumroad / LemonSqueezy)  │ │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  BUILD PIPELINE                                                 │
│                                                                 │
│  GitHub Repo                                                    │
│       │                                                         │
│       └── Push to main ──► CI (GitHub Actions / Netlify CI)    │
│                               │                                 │
│                               └── bundle exec jekyll build      │
│                                   (JEKYLL_ENV=production)       │
│                                        │                        │
│                                        └── Deploy _site/ ──►   │
│                                            CDN Edge Network     │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  EMAIL MARKETING (separate SaaS)                               │
│                                                                 │
│  Signup form embedded in blog layout                           │
│       │                                                         │
│       └──► Kit / Buttondown / Beehiiv (external)               │
│                 Handles: list storage, sequences, broadcasts    │
└─────────────────────────────────────────────────────────────────┘
```

---

## Key Boundaries

| Boundary | What crosses it | Direction |
|----------|-----------------|-----------|
| Browser ↔ CDN | HTML, CSS, JS, images (static) | CDN → Browser |
| Browser ↔ Remark42 | Comment reads/writes, OAuth tokens | Both |
| Browser ↔ Course platform | Redirect on purchase click | Browser → External |
| Browser ↔ Email platform | Signup form POST | Browser → External |
| GitHub ↔ CI | Git push triggers build | Push event |
| CI ↔ CDN | Built `_site/` upload | CI → CDN |

---

## Data Ownership

| Data type | Where it lives | Your control |
|-----------|----------------|-------------|
| Blog content | Git repository | Full |
| Course content | Git repository | Full |
| Comment data | Remark42 SQLite on VPS | Full (you can export) |
| Email subscriber list | External email platform | Partial (exportable CSV) |
| Purchase records | Course platform | Partial (exportable) |
| Analytics | Plausible / Umami | Full (self-hosted) or SaaS |

---

## Performance Considerations

- Static HTML = instant TTFB from CDN edge
- Math: pre-render with `jekyll-katex` = zero JS needed for math pages → fastest
- Comments: Remark42 widget loads after page paint (deferred) — does not affect LCP
- Images: use responsive `srcset` and WebP format; lazy-load below-fold images
- No JavaScript frameworks in the critical path — page is usable before any JS runs

---

## Security Boundaries

- No server-side code on the main site — attack surface is minimal
- Remark42 is the only exposed server; keep it updated and behind HTTPS
- Course platform and email platform are third-party SaaS — their security is their responsibility
- Never put API keys or secrets in the Jekyll codebase (it becomes public HTML)
- Remark42 secret and site ID belong in CI environment variables and `_config.yml` (site ID only — not the secret)
