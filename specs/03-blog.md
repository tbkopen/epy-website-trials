# 03 — Blog System

## Overview

The blog is the core of the site. It must support:
- Long-form technical/educational posts
- LaTeX math rendering (inline and display)
- Syntax-highlighted code blocks
- Community comments via Remark42
- Category and tag organization
- Pagination on the blog index
- RSS feed for subscribers and readers
- Related post suggestions

---

## Post Types

| Type | Description | Typical Length |
|------|-------------|----------------|
| **Tutorial** | Step-by-step guide | 1,500–4,000 words |
| **Deep Dive** | Rigorous explanation of a concept, heavy math | 2,000–6,000 words |
| **Short Note** | Quick insight, tip, or reference | 300–800 words |
| **Course Preview** | Free excerpt or overview of a paid course | 1,000–2,000 words |

All types use the same `post` layout. The `course_cta:` frontmatter field connects a post to a course CTA block.

---

## URL Structure

```
/blog/                           → Paginated blog index
/blog/page/2/                    → Second page of index
/category/machine-learning/      → Posts filtered by category
/tag/gradient-descent/           → Posts filtered by tag
/YYYY/MM/DD/post-slug/           → Individual post (date-based permalink)
```

Permalink format in `_config.yml`:
```yaml
permalink: /:year/:month/:day/:title/
```

> Alternative: `/blog/:title/` (no date in URL). Better for evergreen content — easier to update posts without breaking URLs. **Recommended** if posts are regularly updated.

---

## Categories & Tags Strategy

**Categories** (broad, use 1–2 per post):
- Define these before launch — they become nav/filter items
- Examples: `mathematics`, `machine-learning`, `programming`, `statistics`
- [TBD: define your category list]

**Tags** (specific, use 3–8 per post):
- Fine-grained topics — used for related posts and discovery
- Examples: `linear-algebra`, `gradient-descent`, `python`, `pytorch`

---

## Math Rendering

Using **KaTeX client-side** (Option B from `02-tech-stack.md`):

In `_includes/math.html` (conditionally injected when `math: true`):
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16/dist/katex.min.css">
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16/dist/katex.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16/dist/contrib/auto-render.min.js"
  onload="renderMathInElement(document.body, {
    delimiters: [
      {left: '$$', right: '$$', display: true},
      {left: '$', right: '$', display: false}
    ]
  });"></script>
```

Post layout (`_layouts/post.html`) includes this partial conditionally:
```liquid
{% if page.math %}
  {% include math.html %}
{% endif %}
```

### Math Usage in Posts
- Inline: `$E = mc^2$`
- Display block: `$$\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}$$`
- Wrap display math in blank lines (Kramdown requirement)
- Test all math locally before publishing

---

## Code Syntax Highlighting

Jekyll uses **Rouge** by default — no extra setup needed.
Fenced code blocks with language identifier:
````
```python
def gradient_descent(f, grad_f, x0, lr=0.01, n_steps=100):
    x = x0
    for _ in range(n_steps):
        x = x - lr * grad_f(x)
    return x
```
````

Highlighting theme: set in `_config.yml`:
```yaml
highlighter: rouge
markdown: kramdown
kramdown:
  syntax_highlighter: rouge
  syntax_highlighter_opts:
    css_class: 'highlight'
```

Recommended Rouge theme: `github` (light) or `monokai` (dark). Can be changed by swapping the generated CSS.

---

## Remark42 Comments

Comments appear at the bottom of every post where `comments: true`.

In `_includes/comments.html`:
```html
<div id="remark42"></div>
<script>
  var remark_config = {
    host: "{{ site.remark42_host }}",
    site_id: "{{ site.remark42_site_id }}",
    components: ["embed"],
    theme: "light",   // or "dark" — match site theme
    locale: "en",
    show_email_subscription: false,
  };
</script>
<script defer src="{{ site.remark42_host }}/web/embed.js"></script>
```

In `_config.yml`:
```yaml
remark42_host: "https://comments.elastropy.com"
remark42_site_id: "elastropy"
```

Post layout injects this partial only when `comments: true`:
```liquid
{% if page.comments %}
  {% include comments.html %}
{% endif %}
```

**OAuth providers to enable in Remark42**: GitHub, Google (at minimum). More options: Twitter/X, Facebook, email-based anonymous.

**Moderation**: Remark42 admin panel at `https://comments.elastropy.com/web/admin.html`. You can approve, delete, and pin comments.

---

## Pagination

Using `jekyll-paginate-v2` (more flexible than built-in):

`_config.yml`:
```yaml
pagination:
  enabled: true
  per_page: 10
  permalink: '/page/:num/'
  title: ':title - page :num'
  sort_field: 'date'
  sort_reverse: true
```

Blog index at `_pages/blog.md`:
```yaml
---
layout: blog-index
title: Blog
permalink: /blog/
pagination:
  enabled: true
---
```

---

## RSS Feed

Provided automatically by `jekyll-feed` plugin.
- Output: `/feed.xml`
- Configured via `_config.yml`:
  ```yaml
  feed:
    path: feed.xml
    posts_limit: 20
  ```
- Include `<link>` tag in `<head>` (handled by `jekyll-feed` automatically when using `{% feed_meta %}`)

---

## Related Posts

**Option A** (Jekyll built-in): `site.related_posts` — uses category overlap, limited accuracy.

**Option B** (Manual): `related:` frontmatter field listing post slugs explicitly — most accurate.

**Option C** (Tag-based): Custom Liquid logic showing posts that share the most tags.

> **Recommendation**: Start with Option B (manual) for featured posts, fall back to tag-based for the rest.

---

## Course CTA Block

Each post can promote one related course via the `course_cta:` frontmatter field.

In `_includes/course-cta.html`:
```liquid
{% assign course = site.courses | where: "slug", page.course_cta | first %}
{% if course %}
<aside class="course-cta">
  <h3>Want to go deeper?</h3>
  <p>{{ course.tagline }}</p>
  <a href="{{ course.url }}" class="btn">Learn more →</a>
</aside>
{% endif %}
```

Post layout injects this above the comments section.

---

## Table of Contents

For long posts where `toc: true`, generate a TOC from headings using a Liquid snippet or the `jekyll-toc` plugin. TOC should:
- Appear as a sticky sidebar on desktop, collapsible at top on mobile
- Only include H2 and H3 headings
- Show a reading-time estimate near the TOC

---

## Reading Time Estimate

In `_includes/reading-time.html`:
```liquid
{% assign words = page.content | number_of_words %}
{% assign minutes = words | divided_by: 200 %}
{% if minutes < 1 %}< 1{% else %}{{ minutes }}{% endif %} min read
```

Displayed in post meta (date, category, reading time).
