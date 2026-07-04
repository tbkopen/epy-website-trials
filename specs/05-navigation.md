# 05 — Site Navigation & Page Structure

## Site Map

```
/                          Home
├── /blog/                 Blog index (paginated)
│   ├── /blog/page/2/      Pagination
│   ├── /category/:name/   Category archive
│   └── /tag/:name/        Tag archive
├── /courses/              Course catalog
│   └── /courses/:slug/    Individual course sales page
├── /about/                About page
├── /contact/              Contact page
├── /newsletter/           Newsletter signup landing page  (optional)
├── /resources/            Free resources / lead magnets  (optional)
├── /thanks/:slug/         Post-purchase thank-you pages  (optional)
├── /feed.xml              RSS feed (auto-generated)
├── /sitemap.xml           Sitemap (auto-generated)
└── /404.html              Custom 404 page
```

> **[TBD]**: Confirm which optional pages to include at launch.
> Recommended minimal launch set: Home, Blog, Courses, About, Contact.

---

## Primary Navigation Bar

Displayed on every page. Sticky on scroll (optional).

```
[Logo / Site Name]    Blog    Courses    About    [Contact]    [Newsletter CTA]
```

| Item | URL | Notes |
|------|-----|-------|
| Logo / Site Name | `/` | Left-aligned; links to home |
| Blog | `/blog/` | |
| Courses | `/courses/` | |
| About | `/about/` | |
| Contact | `/contact/` | Can be text link or ghost button |
| Newsletter CTA | `/newsletter/` | Highlighted button (filled style) |

### Optional Additional Nav Items
- Resources → `/resources/` (if you have free downloads)
- Add these only at launch if the page exists

### Mobile Navigation
- Hamburger menu on small screens (< 768px breakpoint)
- Full-screen or drawer overlay
- Same items as desktop nav
- Close on outside click or ESC key

---

## Secondary / Utility Nav

Small links in the top-right corner or inside a thin banner bar (optional):
- RSS icon → `/feed.xml`
- Dark mode toggle (if implemented)
- Social media icons (Twitter/X, GitHub, LinkedIn)

---

## Footer Navigation

Four-column footer (collapses to 2 on tablet, 1 on mobile):

```
Column 1: Site                Column 2: Content
  Home                          Blog
  About                         Courses
  Contact                       Resources (optional)
  Newsletter

Column 3: Legal               Column 4: Connect
  Privacy Policy                Twitter/X
  Terms of Use                  GitHub
  Affiliate Disclosure          LinkedIn
  (optional)                    RSS Feed
                                Email
```

Footer bottom bar: `© YYYY Elastropy. All rights reserved.`

---

## Breadcrumbs

Show breadcrumbs on:
- Individual blog posts: `Home → Blog → Post Title`
- Individual course pages: `Home → Courses → Course Title`
- Category archives: `Home → Blog → [Category Name]`

Do NOT show breadcrumbs on: home, top-level section pages (Blog, Courses), about, contact.

Breadcrumb Liquid snippet for post layout:
```liquid
<nav aria-label="breadcrumb">
  <ol>
    <li><a href="/">Home</a></li>
    <li><a href="/blog/">Blog</a></li>
    <li aria-current="page">{{ page.title }}</li>
  </ol>
</nav>
```

Include breadcrumb JSON-LD in `<head>` for SEO (see `07-seo.md`).

---

## Page Specifications

### Home (`/`)
- **Purpose**: First impression; convert visitors to blog readers or course browsers
- **Sections**:
  1. Hero: headline, subheadline, primary CTA ("Read the Blog" or "See My Courses")
  2. Featured Posts: 3 latest or hand-picked blog posts
  3. Courses Teaser: 2–3 course cards with a "See all courses" link
  4. About blurb: 2–3 sentences + photo + "Read more" link
  5. Newsletter signup: simple inline form
- **No sidebar** — full-width sections

### Blog Index (`/blog/`)
- Paginated list of post cards (10 per page)
- Each card: thumbnail (optional), title, excerpt, date, category badge, reading time
- Sidebar (desktop): category list, tag cloud, newsletter signup, recent posts
- No hero needed — clean list view

### Individual Post
- Layout: post
- Full-width content area + sidebar (or no sidebar — to decide in design)
- Sections after post content: related posts, course CTA (if set), comments
- Reading progress bar (optional — can be added later)

### Courses Index (`/courses/`)
- **Purpose**: Show all available courses; convert visitors to buyers
- Grid of course cards (2–3 columns)
- Brief intro paragraph at top
- Filter by status (available / coming soon) — can be simple CSS toggle or full JS filter

### Course Page (`/courses/:slug/`)
- See `04-courses.md` for full section breakdown
- No sidebar — full-width sales page layout
- Sticky purchase CTA bar on scroll for long pages (optional, add later)

### About (`/about/`)
- Your story, background, why you teach this subject
- Photo
- Links to best blog posts and courses
- Newsletter signup at the bottom

### Contact (`/contact/`)
- Simple form (name, email, message)
- Form handled by: Netlify Forms / Formspree / Cloudflare Turnstile + custom handler
- [TBD: confirm form backend — Netlify Forms is easiest if hosted on Netlify]
- Alternative: just display your email address (less spam, less setup)

### 404 Page
- Friendly message
- Search box or list of popular posts
- Link back to home and blog
