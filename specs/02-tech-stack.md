# 02 — Technology Stack

## Core Stack

| Layer | Technology | Version | Notes |
|-------|-----------|---------|-------|
| Static Site Generator | **Jekyll** | 4.3.x | Ruby-based SSG |
| Ruby runtime | Ruby | 3.2.x+ | Managed via `.ruby-version` |
| Dependency manager | Bundler | 2.x | `Gemfile` + `Gemfile.lock` |
| Stylesheet language | **SCSS** (via Jekyll's Sass) | built-in | No PostCSS needed |
| JavaScript | **Vanilla JS** (ES2020+) | — | No framework |
| Markup | **Markdown** (Kramdown) | built-in | Jekyll default renderer |
| Math rendering | **KaTeX** | latest | Via `jekyll-katex` gem |
| Comment system | **Remark42** | latest | Self-hosted on VPS |
| Version control | Git + **GitHub** | — | Source of truth |

---

## Jekyll Plugins (Gemfile)

```ruby
group :jekyll_plugins do
  gem "jekyll-feed"         # RSS/Atom feed at /feed.xml
  gem "jekyll-sitemap"      # Auto sitemap.xml
  gem "jekyll-seo-tag"      # <meta> tags, OG, Twitter Card
  gem "jekyll-paginate-v2"  # Pagination for blog index (v2 supports categories)
  gem "jekyll-katex"        # Server-side KaTeX rendering (optional but recommended)
  gem "jekyll-last-modified-time"  # last_modified_at for structured data
end
```

### Why these plugins?
- `jekyll-seo-tag` + `jekyll-sitemap` + `jekyll-feed` are the standard SEO trifecta for Jekyll
- `jekyll-paginate-v2` over the built-in paginator because it supports category/tag pagination
- `jekyll-katex` pre-renders math at build time — zero client-side JS needed for math pages
- `jekyll-last-modified-time` provides accurate `dateModified` for JSON-LD structured data

---

## KaTeX Setup Options

### Option A: Server-side (Recommended)
- Use `jekyll-katex` gem
- Math renders to HTML at build time — no client-side JS required
- Syntax in posts: `{% katex %}E = mc^2{% endkatex %}` (inline) and `{% katexmm %}...{% endkatexmm %}` (block)
- Pro: fastest possible; math works even if JS is disabled
- Con: slightly different Liquid syntax than raw LaTeX

### Option B: Client-side Auto-render
- Load KaTeX CSS + `auto-render.js` only on pages with `math: true`
- Syntax in posts: standard `$...$` and `$$...$$` delimiters
- Pro: standard LaTeX delimiters; no build-time dependency
- Con: requires JS; brief flash before math renders

> **Recommendation**: Start with Option B (simpler setup, standard syntax). Switch to Option A if performance becomes a concern.

---

## Remark42 Stack (on VPS)

| Component | Technology |
|-----------|-----------|
| Comment engine | Remark42 (Go binary in Docker) |
| Reverse proxy | Caddy (auto-HTTPS via Let's Encrypt) |
| Container runtime | Docker + Docker Compose |
| VPS OS | Ubuntu 22.04 LTS |
| Storage | SQLite (embedded in Remark42) |

Remark42 minimal `docker-compose.yml` pattern:
```yaml
services:
  remark42:
    image: umputun/remark42:latest
    environment:
      - REMARK_URL=https://comments.elastropy.com
      - SITE=elastropy
      - SECRET=${REMARK42_SECRET}
      - AUTH_GITHUB_CID=...
      - AUTH_GITHUB_CSEC=...
    volumes:
      - ./var:/srv/var
```

---

## Build & Deployment Stack

| Component | Technology | Notes |
|-----------|-----------|-------|
| CI/CD | GitHub Actions | Triggers on push to `main` |
| Hosting | Cloudflare Pages / Netlify | TBD (see ADR-005) |
| Domain DNS | Cloudflare | Recommended regardless of host |
| SSL/TLS | Automatic (host-provided or Cloudflare) | |

---

## Third-Party Services

| Service | Purpose | Decision Status |
|---------|---------|----------------|
| LemonSqueezy / Gumroad | Course payment processing | TBD (ADR-004) |
| Kit / Buttondown / Beehiiv | Email marketing | TBD (ADR-006) |
| Plausible / Umami | Analytics | TBD (ADR-007) |
| GitHub OAuth (via Remark42) | Comment login | Decided |
| Google OAuth (via Remark42) | Comment login | Decided |

---

## Local Development Requirements

```
Ruby >= 3.2
Bundler >= 2.0
Node.js (optional, only if adding build tooling later)
```

Setup:
```bash
bundle install
bundle exec jekyll serve --livereload --drafts
```

Dev config at `_config.dev.yml` overrides:
```yaml
url: "http://localhost:4000"
remark42_host: ""   # disable comments in local dev
analytics: false
```

Run with dev config:
```bash
bundle exec jekyll serve --config _config.yml,_config.dev.yml
```
