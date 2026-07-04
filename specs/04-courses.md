# 04 — Courses System

## Overview

The courses section serves as the commercial layer of the site. Each course has:
- A dedicated sales/landing page (built in Jekyll, no external CMS)
- A listing on the `/courses/` index page
- Purchase handled by an external platform (Gumroad, LemonSqueezy, etc.)

The Jekyll site is responsible for marketing and conversion. Actual payment, delivery, and student management live on the external platform.

---

## Planned Courses

> **[TBD]** — List your courses here before build.

```
Course 1:
  Title: 
  Slug: 
  Price: 
  Status: coming-soon | available
  One-line pitch: 

Course 2:
  ...
```

---

## URL Structure

```
/courses/                        → Course catalog / listing page
/courses/course-slug/            → Individual course sales page
```

The `/courses/` page is a static page (`_pages/courses.md`) that loops over the `_courses/` collection.

---

## Jekyll Course Collection

`_config.yml` collection configuration:
```yaml
collections:
  courses:
    output: true
    permalink: /courses/:name/
```

Each course file: `_courses/course-slug.md`

---

## Course Page Sections

Each course sales page (layout: `course`) should include the following sections in order:

| Section | Purpose | Notes |
|---------|---------|-------|
| **Hero** | Title, tagline, price, primary CTA button | Above the fold |
| **Problem** | Pain point the course solves | 2–3 short paragraphs |
| **What you'll learn** | Bullet list of outcomes | 5–8 bullets |
| **Curriculum** | Module/lesson breakdown | Accordion or table |
| **Who it's for** | Audience fit + prerequisites | Short list |
| **About the instructor** | Your bio, credibility | From `_data/authors.yml` |
| **FAQ** | 4–6 common questions | Accordion |
| **Pricing** | Price, what's included, CTA | Repeat purchase button |
| **Related blog posts** | 2–3 posts that preview course content | Auto-pulled by tag |

---

## Course Status States

| Status | Behavior on Listing | Behavior on Course Page |
|--------|--------------------|-----------------------|
| `available` | Show with price and buy button | Show full buy button |
| `coming-soon` | Show with "Notify me" email form | Show waitlist form |
| `archived` | Hidden from listing by default | Show "No longer available" |

In `_pages/courses.md` (listing loop):
```liquid
{% assign available = site.courses | where: "status", "available" | sort: "order" %}
{% assign coming = site.courses | where: "status", "coming-soon" | sort: "order" %}
```

---

## Course Card (on Listing Page)

Each course card displays:
- Thumbnail image
- Title
- Tagline
- Price (or "Coming Soon")
- CTA: "Learn More" → links to course page

---

## Purchase Flow

```
User lands on blog post
  → reads CTA block at bottom
  → clicks "Learn more about [Course]"
  → lands on /courses/course-slug/ (Jekyll sales page)
  → reads sales page, decides to buy
  → clicks "Buy Now" button
  → redirected to external platform (Gumroad / LemonSqueezy)
  → completes payment externally
  → receives course access via email (handled by platform)
  → [optional] redirected back to a thank-you page on your site
```

### Thank-You Page

A static page at `/thanks/course-slug/` displayed after purchase (redirect from course platform).
- Thanks the student
- Gives next steps (check email, join community, etc.)
- Suggests related blog posts or other courses

---

## Email Integration with Courses

- Course platform should add buyers to a specific tag/list in your email tool
- Set up a post-purchase email sequence (welcome, tips, checkpoints)
- "Coming soon" course pages should collect emails directly (via email platform embed form)

---

## Free Content Strategy

Consider offering:
- **Free first lesson**: unlocked on the course page or as a blog post
- **Free resource**: a PDF, cheatsheet, or template that previews course content
- **Free mini-course**: a 3–5 email sequence introducing the topic

These go into the course frontmatter as `preview_url:` and are surfaced on the course page.

---

## Course Ordering on Listing

Add an `order:` field to course frontmatter (1, 2, 3...) to control display order:
```yaml
order: 1   # appears first on /courses/
```

---

## Future Considerations

- If you switch to a full LMS (Teachable, Thinkific) later, the sales pages can stay on Jekyll while linking to the LMS for the actual content
- Bundle pricing (multiple courses together) can be handled on the payment platform without changes to Jekyll
- Student community (Discord, Circle, etc.) is separate from this site — link from the thank-you page and course description
