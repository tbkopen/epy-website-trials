# 12 — Template Architecture (Theme Separation)

## Core Principle

**Content files are dumb. Layouts are smart.**

A post author opens a markdown file, writes content, and sets a few content-level flags. They never touch CSS, never configure scripts, never decide which sidebar widgets appear. All visual and structural decisions are owned by the layout system.

This means:
- Changing the entire site's look means editing `_layouts/`, `_includes/`, `_sass/` — never touching `_posts/`
- A new contributor can write posts correctly after reading the template once
- A redesign can happen without modifying a single piece of content

---

## The Three Zones

```
┌────────────────────────────────────────────────────────┐
│  ZONE 1: CONTENT (what you write)                     │
│  _posts/, _courses/, _pages/                          │
│                                                        │
│  Contains: title, date, body text, excerpt            │
│  Content flags: math, comments, toc, course_cta       │
│  NEVER contains: CSS classes, JS config, style hints  │
└────────────────────────────────────────────────────────┘
                        ↓ frontmatter is read by
┌────────────────────────────────────────────────────────┐
│  ZONE 2: LAYOUTS & INCLUDES (how it's structured)     │
│  _layouts/, _includes/                                │
│                                                        │
│  Reads content flags → decides what to inject         │
│  Owns: page structure, feature toggling, partials     │
│  Calls into: CSS variables, data files, plugins       │
└────────────────────────────────────────────────────────┘
                        ↓ applies classes defined by
┌────────────────────────────────────────────────────────┐
│  ZONE 3: THEME (how it looks)                         │
│  _sass/, assets/js/, assets/css/                      │
│                                                        │
│  CSS custom properties, SCSS partials, vanilla JS     │
│  NEVER referenced by name in content files            │
└────────────────────────────────────────────────────────┘
```

---

## Layout Inheritance Chain

```
_layouts/default.html         ← skeleton: <html>, <head>, header, footer
  └── _layouts/page.html      ← extends default; adds breadcrumbs
  └── _layouts/post.html      ← extends default; adds reading time, math,
  │                              comments, related posts, course CTA, TOC
  └── _layouts/course.html    ← extends default; adds hero, pricing, modules
  └── _layouts/blog-index.html ← extends default; adds post grid, pagination
  └── _layouts/home.html      ← extends default; full-width landing sections
```

Each layout uses `{% layout "default" %}` and fills in `{{ content }}`. Liquid's layout inheritance handles the nesting cleanly.

---

## `_layouts/default.html` — The Skeleton

Owns:
- `<html lang>`, `<head>`, `<body>` wrapper
- `{% include head.html %}` — all `<meta>` tags, CSS, analytics
- `{% include header.html %}` — site navigation
- `{{ content }}` — injected by child layouts
- `{% include footer.html %}` — site footer

Nothing visual or feature-specific here. It's purely structural.

---

## `_layouts/post.html` — Feature Matrix

This is the most important layout. It reads frontmatter flags and conditionally injects features:

```liquid
---
layout: default
---

{% include breadcrumbs.html %}

<article class="post" data-pagefind-body
  data-pagefind-filter="category:{{ page.categories | first }}">

  <header class="post__header">
    {% include post-meta.html %}   <!-- date, reading time, categories -->
    <h1 class="post__title">{{ page.title }}</h1>
    {% if page.excerpt %}
      <p class="post__lead">{{ page.excerpt }}</p>
    {% endif %}
  </header>

  {% if page.toc %}
    {% include toc.html %}
  {% endif %}

  <div class="post__body">
    {{ content }}
  </div>

  <footer class="post__footer">
    {% include tags.html %}
    {% include share-buttons.html %}
  </footer>

</article>

{% include related-posts.html %}

{% if page.course_cta %}
  {% include course-cta.html slug=page.course_cta %}
{% endif %}

{% include newsletter-form.html context="post" %}

{% if page.comments != false %}
  {% include comments.html %}
{% endif %}

{% if page.math %}
  {% include math.html %}
{% endif %}
```

**Key behavior**:
- `comments` defaults to **true** — a post must explicitly set `comments: false` to disable
- `math` defaults to **false** — must be opted in (avoids loading KaTeX on every page)
- `toc`, `course_cta` are opt-in, default off
- `related-posts` always appears (no flag needed — the include handles the "no related posts" case gracefully)

---

## `_layouts/course.html` — Sales Page Structure

```liquid
---
layout: default
---

<!-- Hero: pulled from frontmatter, not from body content -->
{% include course-hero.html %}

<!-- Body content = sales copy sections (problem, outcomes, curriculum, FAQ) -->
<div class="course__body">
  {{ content }}
</div>

<!-- Instructor bio from _data/authors.yml — not duplicated in content -->
{% include author-bio.html %}

<!-- Pricing section — price/purchase_url from frontmatter -->
{% include course-pricing.html %}

<!-- Related blog posts (by shared tags) -->
{% include related-posts.html context="course" %}
```

The course author writes only the sales copy body. Title, price, tagline, purchase button, instructor bio, and pricing section are all assembled by the layout from frontmatter + data files.

---

## `_includes/` Inventory

Every include is self-contained and defensive (handles missing data gracefully):

| Include | Inputs | Outputs | Notes |
|---------|--------|---------|-------|
| `head.html` | `page.*`, `site.*` | `<head>` content | Meta, CSS, analytics (production-gated) |
| `header.html` | `_data/navigation.yml` | Site nav bar | Marks current page active |
| `footer.html` | `_data/navigation.yml`, `site.*` | Site footer | |
| `breadcrumbs.html` | `page.url`, `page.title` | `<nav>` breadcrumb | Auto-generates from URL segments |
| `post-meta.html` | `page.date`, `page.categories`, `page.content` | Date, reading time, category badge | Reading time calculated in Liquid |
| `math.html` | *(none)* | KaTeX `<link>` + `<script>` | Only injected when `page.math == true` |
| `comments.html` | `site.remark42_host`, `site.remark42_site_id` | Remark42 widget div + script | Only injected when `page.comments != false` |
| `toc.html` | `page.content` | Table of contents | Only injected when `page.toc == true` |
| `related-posts.html` | `page.tags`, `page.categories`, `site.posts` | 3 related post cards | Falls back to recent posts if no tag match |
| `course-cta.html` | `slug` (param) | CTA box for one course | Looks up course from `site.courses` |
| `newsletter-form.html` | `context` (param) | Email signup form | Same form, different surrounding copy based on context |
| `share-buttons.html` | `page.url`, `page.title` | Twitter, LinkedIn share links | Plain `<a>` tags, no JS |
| `search.html` | *(none)* | Pagefind search UI | Loads Pagefind JS deferred |
| `course-hero.html` | `page.*` | Hero section (title, tagline, price, CTA) | Reads frontmatter directly |
| `course-pricing.html` | `page.price`, `page.purchase_url`, `page.status` | Buy button or waitlist form | Conditional on `page.status` |
| `author-bio.html` | `page.author` or `site.author`, `_data/authors.yml` | Author card | |
| `analytics.html` | `site.plausible_domain` | Analytics script | Only injected in production |
| `post-card.html` | `post` (param) | Post preview card | Used in blog index, home, related posts |
| `course-card.html` | `course` (param) | Course preview card | Used in courses listing, home, 404 |
| `tags.html` | `page.tags` | Tag badge list | |
| `pagination.html` | `paginator` | Prev/next page links | Only shown when paginator is active |

---

## Data Files Drive Navigation and Global Content

Content files and layouts reference `_data/` — they never hardcode navigation links, author info, or site-wide settings:

### `_data/navigation.yml`
```yaml
main:
  - title: Blog
    url: /blog/
  - title: Courses
    url: /courses/
  - title: About
    url: /about/
  - title: Contact
    url: /contact/

footer_col_site:
  - title: Home
    url: /
  - title: About
    url: /about/
  - title: Contact
    url: /contact/

footer_col_content:
  - title: Blog
    url: /blog/
  - title: Courses
    url: /courses/
  - title: Resources
    url: /resources/

footer_col_legal:
  - title: Privacy Policy
    url: /privacy/
  - title: Terms of Use
    url: /terms/

footer_col_connect:
  - title: Twitter/X
    url: https://twitter.com/[your-handle]
    external: true
  - title: GitHub
    url: https://github.com/[your-handle]
    external: true
  - title: RSS Feed
    url: /feed.xml
    external: false
```

### `_data/authors.yml`
```yaml
site-author:
  name: "[Your Full Name — TBD]"
  bio: "Two sentence bio. What you do and what you write about."
  avatar: /assets/images/ui/avatar.jpg
  twitter: "[your-handle — TBD]"
  github: "[your-handle — TBD]"
  linkedin: "[your-handle — TBD]"
```

### `_config.yml` (site-wide feature settings)
```yaml
# These drive conditional behavior in layouts — not in content files
comments_default: true     # global default; individual posts can override
show_reading_time: true
show_author_bio: true
posts_per_page: 10
related_posts_count: 3
```

---

## What Content Authors Need to Know

**Everything they need is in `.claude/templates/`.**

A blog post author only needs to know:
1. Copy `post.md` template to `_posts/YYYY-MM-DD-slug.md`
2. Fill in the frontmatter fields shown in the template
3. Write the body content in Markdown
4. Set `math: true` if they use LaTeX

They do not need to know:
- How KaTeX is loaded or initialized
- How Remark42 is configured
- How the nav bar works
- How reading time is calculated
- How SEO meta tags are generated
- What CSS classes exist

This isolation means a non-technical content contributor can write and publish posts without ever touching the theme.

---

## Separation Enforcement (Claude Rules Reminder)

From `.claude/rules.md`:
> Content files (`_posts/`, `_courses/`, `_pages/`) must NEVER contain CSS class names, JavaScript configuration, inline scripts, or stylesheet references.

If you find yourself adding a class name to a post's frontmatter — stop. The feature should be moved to the layout.
