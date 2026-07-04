# 08 — Integrations

## Overview

The site integrates with several external services. This file documents what each integration does, what configuration it needs, and where that configuration lives.

---

## 1. Remark42 (Comments)

**Purpose**: Self-hosted comment system on blog posts.
**Type**: Self-hosted on a VPS (you own the server).

### What it needs
- A VPS running the Remark42 Docker container (see `09-deployment.md` for setup)
- A domain/subdomain for Remark42: e.g., `comments.elastropy.com`
- OAuth app credentials for each login method you want to support

### Jekyll Configuration (`_config.yml`)
```yaml
remark42_host: "https://comments.elastropy.com"
remark42_site_id: "elastropy"
```

### OAuth Apps to Create

| Provider | Where to create | What you get |
|----------|----------------|-------------|
| GitHub | github.com → Settings → Developer settings → OAuth Apps | Client ID + Secret |
| Google | console.cloud.google.com → APIs → Credentials → OAuth 2.0 | Client ID + Secret |
| Twitter/X | developer.twitter.com | API Key + Secret |

**Callback URL for all providers**: `https://comments.elastropy.com/auth/<provider>/callback`

### Remark42 Environment Variables (on VPS)
```env
REMARK_URL=https://comments.elastropy.com
SITE=elastropy
SECRET=<random-64-char-string>
AUTH_GITHUB_CID=<github-client-id>
AUTH_GITHUB_CSEC=<github-client-secret>
AUTH_GOOGLE_CID=<google-client-id>
AUTH_GOOGLE_CSEC=<google-client-secret>
ADMIN_SHARED_ID=<your-remark42-user-id>   # set yourself as admin after first login
```

### Post-Launch Admin Setup
1. Deploy Remark42
2. Go to your blog, log in via GitHub/Google on the comment widget
3. Copy your user ID from the Remark42 admin panel or from the URL
4. Set `ADMIN_SHARED_ID` in the environment and redeploy Remark42

### Notification Options
- Email notifications: set `AUTH_EMAIL_...` env vars in Remark42
- Telegram notifications: set `TELEGRAM_TOKEN` and `TELEGRAM_CHANNEL` env vars

---

## 2. Email Marketing

**Purpose**: Capture email subscribers from blog posts; send newsletters and course sequences.
**Decision**: [TBD — see ADR-006 in `.claude/context/decisions.md`]

### Kit (ConvertKit) Integration
- Create a form in Kit dashboard
- Embed the form HTML in `_includes/newsletter-form.html`
- The form posts to Kit's servers — no backend needed

```html
<!-- _includes/newsletter-form.html -->
<form action="https://app.kit.com/forms/[KIT_FORM_ID]/subscriptions" method="post">
  <input type="email" name="email_address" placeholder="Your email" required>
  <button type="submit">Subscribe</button>
</form>
```

- **Tagging**: Tag subscribers by which post they signed up from (use hidden `tags[]` fields)
- **Automations**: Set up a welcome sequence in Kit for new subscribers
- **Course tags**: When a course is purchased, buyer is added to a course-specific tag

### Buttondown Integration
```html
<form action="https://buttondown.email/api/emails/embed-subscribe/[your-buttondown-username]" method="post">
  <input type="email" name="email" placeholder="Your email" required>
  <button type="submit">Subscribe</button>
</form>
```

### Newsletter Form Placement
The `_includes/newsletter-form.html` partial is included in:
- `_layouts/post.html` — after post content, before comments
- `_includes/sidebar.html` — sidebar widget
- `_pages/newsletter.md` — dedicated landing page
- `_layouts/home.html` — home page section

---

## 3. Analytics

**Purpose**: Understand which posts and pages attract readers; track conversion paths.
**Decision**: [TBD — see ADR-007 in `.claude/context/decisions.md`]

### Plausible Analytics
```html
<!-- _includes/analytics.html -->
<script defer data-domain="{{ site.plausible_domain }}"
  src="https://plausible.io/js/script.js"></script>
```

`_config.yml`:
```yaml
plausible_domain: "elastropy.com"
analytics: true   # set false in _config.dev.yml to avoid tracking dev visits
```

Inject conditionally in `_includes/head.html`:
```liquid
{% if site.analytics and jekyll.environment == "production" %}
  {% include analytics.html %}
{% endif %}
```

### Umami (self-hosted)
Same pattern — swap the script src and add your `data-website-id`.

### Google Analytics 4
Requires a cookie consent banner for GDPR compliance — adds complexity.
If using GA4, use `gtag.js` or Google Tag Manager.

---

## 4. Course Payment Platform

**Purpose**: Process course purchases and deliver access.
**Decision**: [TBD — see ADR-004 in `.claude/context/decisions.md`]

### LemonSqueezy Integration
- Create a product on LemonSqueezy
- Set the product's `purchase_url` (e.g., `https://elastropy.lemonsqueezy.com/buy/[product-slug]`)
- Add the URL to each course's frontmatter as `purchase_url:`
- The "Buy Now" button in `_layouts/course.html` links to this URL

No backend integration needed for basic sales. Optional webhook integration to:
- Tag buyers in your email platform
- Unlock a private course page or redirect to thank-you page

### Gumroad Integration
Same approach — paste product URL into `purchase_url:` frontmatter.
Gumroad also offers an overlay widget (popup checkout on the same page):
```html
<script src="https://gumroad.com/js/gumroad.js"></script>
<a class="gumroad-button" href="https://gum.co/your-product">Buy on Gumroad</a>
```

---

## 5. Contact Form

**Purpose**: Allow visitors to send you messages.

### Netlify Forms (if hosting on Netlify — easiest)
```html
<form name="contact" method="POST" data-netlify="true">
  <input type="hidden" name="form-name" value="contact">
  <input type="text" name="name" required>
  <input type="email" name="email" required>
  <textarea name="message" required></textarea>
  <button type="submit">Send</button>
</form>
```
No backend needed — Netlify intercepts the POST and emails you.

### Formspree (if not on Netlify)
```html
<form action="https://formspree.io/f/[FORMSPREE_FORM_ID]" method="POST">
  ...
</form>
```

### Simple Email Link (lowest friction alternative)
```html
<a href="mailto:hello@elastropy.com">Email me directly</a>
```

---

## 6. Social Sharing

Add sharing buttons at the bottom of posts (no external JS needed — plain links):
```html
<!-- Twitter/X share -->
<a href="https://twitter.com/intent/tweet?text={{ page.title | url_encode }}&url={{ site.url }}{{ page.url }}">
  Share on Twitter
</a>

<!-- LinkedIn share -->
<a href="https://www.linkedin.com/sharing/share-offsite/?url={{ site.url | append: page.url | url_encode }}">
  Share on LinkedIn
</a>
```

No tracking, no external JS, works without cookies.

---

## Integration Environment Variables

Summary of variables to set in CI/deployment environment (never in Git):

| Variable | Used by | Notes |
|----------|---------|-------|
| `REMARK42_SECRET` | Remark42 Docker | Random 64-char string |
| `REMARK42_GITHUB_CID` | Remark42 Docker | GitHub OAuth client ID |
| `REMARK42_GITHUB_CSEC` | Remark42 Docker | GitHub OAuth secret |
| `REMARK42_GOOGLE_CID` | Remark42 Docker | Google OAuth client ID |
| `REMARK42_GOOGLE_CSEC` | Remark42 Docker | Google OAuth secret |

Jekyll config values (in `_config.yml` — these are public, no secrets):
- `remark42_host`
- `remark42_site_id`
- `plausible_domain` (or analytics ID)
