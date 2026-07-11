---
name: conventions
description: File naming, frontmatter schemas, SCSS conventions, and JS standards
metadata:
  type: project
---

## Blog Post Conventions

### File Naming
```
_posts/YYYY-MM-DD-slug-in-kebab-case.md
```
- Date must match the `date:` frontmatter field
- Slug should be short, lowercase, hyphen-separated, SEO-friendly
- Avoid stop words in slug (a, the, of, etc.)

### Required Frontmatter
```yaml
---
layout: post
title: "Full Post Title Here"
date: YYYY-MM-DD HH:MM:SS +0000
categories: [primary-category]
tags: [tag1, tag2, tag3]
excerpt: "One or two sentence summary for SEO and social cards."
math: false        # set true only when post uses LaTeX — avoids loading KaTeX elsewhere
comments: true     # set false to disable Remark42 on this post
---
```

### Optional Frontmatter
```yaml
image: /assets/images/posts/YYYY-MM-DD-cover.jpg  # OG/Twitter card image
toc: true                  # render auto table of contents
show-authors: true         # show the end-of-post "Written by" block (requires author; default: off)
author: "Your Name"        # byline: inline meta line + end-of-post block; omit for none
author_bio: "Short bio."   # optional; shown under the byline in the end-of-post block
author-link: "https://..." # optional; links the author name to a profile (LinkedIn, etc.)
related_course: course-uid # opt-in course CTA in the post; value is a course `uid` (see below). Omit for no card
last_modified_at: YYYY-MM-DD
```

`author` is a plain display string (the byline), not a key into `_data/authors.yml`.
The end-of-post author block renders only when `show-authors: true` **and** an
`author` name is set. Within it, `author_bio` and `author-link` are each optional
— with neither, it shows just the name; `author-link` makes the name a hyperlink.
`related_course` must match a `uid:` on a file in `_courses/`; an unset or
non-matching value renders no card (fails safe).

### Math Usage in Posts
- **Inline math: use `$$...$$`** (on the same line as text) — kramdown emits it as
  `\(...\)` and KaTeX renders it inline. Do **not** use single `$...$`: kramdown
  does not treat single `$` as math, so any `_` or `*` inside is parsed as
  markdown emphasis (`<em>`), which shreds the expression and the surrounding text.
- Display/block math: `$$...$$` on its own lines (kramdown emits `\[...\]`).
- Always set `math: true` in frontmatter when using math.
- Avoid mixing display math inside lists — KaTeX can mis-render it.

---

## Course Conventions

### File Location
```
_courses/course-slug.md
```

### Required Frontmatter
```yaml
---
layout: course
title: "Course Title"
uid: course-uid           # stable id posts reference via `related_course` to promote this course
slug: course-slug
tagline: "One benefit-focused sentence."
description: "Two to three sentences for SEO meta and course card."
price: 99
currency: USD
status: available         # available | coming-soon | archived
thumbnail: /assets/images/courses/course-slug.jpg
purchase_url: "https://..."   # Gumroad / LemonSqueezy / etc.
---
```

### Optional Frontmatter
```yaml
original_price: 149       # show a crossed-out price
modules:
  - title: "Module 1"
    lessons: 8
  - title: "Module 2"
    lessons: 6
preview_url: "https://..."    # free preview lesson link
---
```

---

## Static Pages Convention

### File Location
```
_pages/page-slug.md
```

### Required Frontmatter
```yaml
---
layout: page
title: "Page Title"
permalink: /page-slug/
description: "SEO meta description."
---
```

---

## Data Files

| File | Purpose |
|------|---------|
| `_data/navigation.yml` | Primary nav links |
| `_data/authors.yml` | Author profiles (name, bio, avatar, social) |
| `_data/site.yml` | Overridable site-wide settings (email, social handles) |

### `_data/navigation.yml` schema
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
```

---

## SCSS Conventions

- **Naming**: BEM — `.block__element--modifier`
- **Variables**: defined in `_sass/variables.scss` (colors, fonts, spacing, breakpoints)
- **Structure**:
  ```
  _sass/
  ├── variables.scss
  ├── mixins.scss
  ├── base/
  │   ├── _reset.scss
  │   ├── _typography.scss
  │   └── _utilities.scss
  ├── layout/
  │   ├── _header.scss
  │   ├── _footer.scss
  │   └── _grid.scss
  └── components/
      ├── _post-card.scss
      ├── _course-card.scss
      ├── _math.scss
      ├── _comments.scss
      └── _cta-box.scss
  ```
- Mobile-first: base styles for mobile, then `@media (min-width: $breakpoint)` for larger
- No `!important` except in utility overrides

---

## JavaScript Conventions

- Vanilla JS — no framework unless strictly necessary
- All scripts use `defer` or are placed before `</body>` — nothing blocking in `<head>`
- One file per feature:
  ```
  assets/js/
  ├── math.js        # KaTeX auto-render init (only injected on pages with math: true)
  ├── comments.js    # Remark42 init (only injected on pages with comments: true)
  └── theme.js       # Dark/light mode toggle (if implemented)
  ```
- No inline `<script>` tags in layouts — use `_includes/` partials that layouts conditionally include
