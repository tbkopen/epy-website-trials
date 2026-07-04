# 11 — 404 Page & Redirects

## Overview

A well-designed 404 page recovers lost visitors instead of sending them away. This spec defines the 404 page layout, its content, and the full redirect strategy for the site.

---

## 404 Page

### File Location
`404.html` (or `404.md`) at the repo root.

Jekyll automatically serves this page for any URL that doesn't match a generated file, on hosts that support custom 404 pages (Netlify, Cloudflare Pages, GitHub Pages — all do).

### 404 Page Frontmatter
```yaml
---
layout: default
title: "Page Not Found"
permalink: /404.html
sitemap: false
---
```

### Required Sections

| Section | Purpose |
|---------|---------|
| **Clear message** | "This page doesn't exist" — not cryptic technical language |
| **Search box** | Most useful recovery path — let them search for what they wanted |
| **Popular links** | Links to Blog, Courses, About — escape hatches |
| **Featured posts** | 3–5 recent or popular posts — keeps them on the site |
| **Featured courses** | 2–3 available courses — commercial recovery opportunity |

### 404 Page Layout (`_layouts/default.html` with 404 content)

The layout renders identically to any other page — full nav, footer, search. The 404 content block:

```html
<section class="error-404">
  <div class="error-404__code">404</div>
  <h1 class="error-404__title">Page Not Found</h1>
  <p class="error-404__message">
    The page you're looking for doesn't exist or may have been moved.
  </p>

  <!-- Search — primary recovery path -->
  <div class="error-404__search">
    {% include search.html %}
  </div>

  <!-- Quick links -->
  <nav class="error-404__links" aria-label="Recovery links">
    <a href="/blog/" class="btn btn--secondary">Browse All Posts</a>
    <a href="/courses/" class="btn btn--secondary">See My Courses</a>
    <a href="/" class="btn btn--ghost">Go Home</a>
  </nav>

  <!-- Recent posts -->
  <section class="error-404__posts">
    <h2>Recent Posts</h2>
    <ul>
      {% for post in site.posts limit:5 %}
      <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
        <span class="post-meta__date">{{ post.date | date: "%b %-d, %Y" }}</span>
      </li>
      {% endfor %}
    </ul>
  </section>

  <!-- Available courses -->
  {% assign available_courses = site.courses | where: "status", "available" | limit: 3 %}
  {% if available_courses.size > 0 %}
  <section class="error-404__courses">
    <h2>Or explore my courses</h2>
    <div class="course-grid">
      {% for course in available_courses %}
        {% include course-card.html course=course %}
      {% endfor %}
    </div>
  </section>
  {% endif %}
</section>
```

---

## Hosting-Level 404 Configuration

### Netlify
Create `_site/404.html` (auto-handled by Jekyll) — Netlify serves it automatically for unmatched routes.

No extra configuration needed. Netlify reads `404.html` at the root of the publish directory.

### Cloudflare Pages
Same — `404.html` at root of `_site/` is automatically served for 404s.

### GitHub Pages
Same — `404.html` at repo root (or `_site/` root) is automatically served.

---

## Redirect Strategy

Redirects prevent link rot and preserve SEO equity when URLs change.

### When to Use Redirects
- Post slug changed
- Category or tag URL restructured
- Page moved to a different path
- Old URL from a previous site/platform

### Method 1: `jekyll-redirect-from` gem (Recommended)

Add to `Gemfile`:
```ruby
gem "jekyll-redirect-from"
```

Add `redirect_from:` to any post or page frontmatter:
```yaml
---
layout: post
title: "Understanding Backpropagation"
redirect_from:
  - /2023/old-slug/
  - /blog/backprop-old-title/
---
```

This generates a static redirect HTML page at each old URL. Works on any host, no server config needed.

### Method 2: Netlify `_redirects` File

Create `_redirects` at the repo root (Netlify reads this, Jekyll copies it to `_site/`):
```
# Syntax: /old-path  /new-path  status-code

/blog/old-post-slug/          /2024/01/15/new-post-slug/    301
/courses/old-course/          /courses/new-course-slug/     301
/feed                         /feed.xml                     301
/rss                          /feed.xml                     301

# Catch-all: any unmatched URL → 404 page
/*                            /404.html                     404
```

### Method 3: Cloudflare Pages `_redirects` File

Same syntax as Netlify — place `_redirects` in the repo root.

### Method 4: Cloudflare Rules (Dashboard)

For a small number of redirects, configure them in the Cloudflare dashboard under Rules → Redirect Rules. No file changes needed.

---

## Redirect Catalog (Maintain This)

Add every redirect here when you create one. This is the authoritative record.

| Old URL | New URL | Reason | Date Added |
|---------|---------|--------|------------|
| *(none yet)* | | | |

---

## Common Redirect Patterns

### RSS feed aliases
```
/rss         /feed.xml    301
/rss.xml     /feed.xml    301
/feed        /feed.xml    301
/atom.xml    /feed.xml    301
```

### www ↔ apex redirect
Handle at the DNS/hosting level — not in Jekyll:
- Cloudflare: set `www` CNAME to `@`, then in Page Rules redirect `www.domain.com/*` → `https://domain.com/$1`
- Netlify: set primary domain in dashboard; it handles www redirect automatically

### Post URL format change
If you switch permalink format (e.g., from `/:year/:month/:day/:title/` to `/blog/:title/`):
1. Change `permalink:` in `_config.yml`
2. Add `redirect_from:` to every existing post with its old URL
3. Submit updated sitemap to Google Search Console

---

## 404 Tracking

Set up a custom event in your analytics to track 404 hits:

**Plausible** — add a custom event when the 404 page loads:
```html
<!-- In 404.html layout block, after analytics loads -->
<script>
  plausible('404', { props: { path: document.location.pathname } });
</script>
```

This surfaces in your Plausible dashboard under "Custom Events" → "404", showing you exactly which URLs people are trying to access — useful for discovering missing redirects.

---

## Soft 404s to Avoid

Avoid creating pages that return HTTP 200 but show "no results" — these confuse Google:
- Category pages with zero posts → redirect to `/blog/` or hide until populated
- Search with no results → show the empty state inline (not a redirect)
- Coming-soon course URLs → return the actual page with a waitlist form (not a redirect to 404)
