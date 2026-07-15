---
# ─────────────────────────────────────────────────────────────────────────────
# Site-wide variables — common values reused across the project.
#
# This file is CONFIG ONLY. It is not a visible page (layout: null, nothing links
# to it). Because it lives in the "pages" collection, its front matter is read via
# site.collections from any template — a direct site.pages lookup collides with
# Jekyll's built-in pages list and would not find it. See _includes/course-cta.html
# for a usage example. Add more shared variables below as needed.
# ─────────────────────────────────────────────────────────────────────────────
ref: site-variables        # stable id templates match on — do not change
layout: null               # config-only file; don't render it as a page
sitemap: false

# ── Featured course ───────────────────────────────────────────────────────────
# uid of the course shown in the "Featured course" widget (blog index sidebar).
# Change this to any course's `uid` (see _courses/*.md) to feature that course —
# the widget then shows THAT course's details and links to ITS external course-link.
featured_course: linear-algebra-ml
---
