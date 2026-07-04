# 09 — Deployment

## Two Separate Deployments

| Component | What it is | Where it runs |
|-----------|-----------|--------------|
| Jekyll static site | HTML/CSS/JS | CDN (Cloudflare Pages / Netlify) |
| Remark42 comment server | Go app in Docker | Small VPS |

These are independent — the static site can be deployed without Remark42, and vice versa.

---

## Static Site Hosting

**Decision**: [TBD — see ADR-005 in `.claude/context/decisions.md`]

### Option A: Cloudflare Pages (Recommended)

1. Connect GitHub repo in Cloudflare Pages dashboard
2. Build settings:
   - Build command: `bundle exec jekyll build`
   - Output directory: `_site`
   - Environment variables: `JEKYLL_ENV=production`
3. Custom domain: set in Cloudflare Pages > Custom domains
4. Deploy triggers: auto-deploy on push to `main`

**Why**: Unlimited bandwidth on free tier, very fast global CDN, no config file needed (UI-driven CI).

### Option B: Netlify

1. Connect GitHub repo in Netlify dashboard
2. Build settings:
   - Build command: `bundle exec jekyll build`
   - Publish directory: `_site`
3. Environment variables: set `JEKYLL_ENV=production` in Netlify UI
4. `netlify.toml` at repo root (optional but recommended):
   ```toml
   [build]
     command = "bundle exec jekyll build"
     publish = "_site"

   [build.environment]
     JEKYLL_ENV = "production"
     RUBY_VERSION = "3.2"

   [[redirects]]
     from = "/feed"
     to = "/feed.xml"
     status = 301
   ```
5. Custom domain: set in Netlify UI
6. Forms: set `data-netlify="true"` on contact form (see `08-integrations.md`)

### Option C: GitHub Actions + GitHub Pages

`_github/workflows/deploy.yml`:
```yaml
name: Deploy Jekyll Site

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: ruby/setup-ruby@v1
        with:
          ruby-version: '3.2'
          bundler-cache: true
      - name: Build Jekyll
        run: bundle exec jekyll build
        env:
          JEKYLL_ENV: production
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./_site
```

Limitation: GitHub Pages serves from a `github.io` domain by default; custom domain requires DNS setup.

---

## Domain Configuration

**Recommended DNS setup** (using Cloudflare DNS regardless of host):

| Record | Type | Value | Notes |
|--------|------|-------|-------|
| `@` | A / CNAME | Host's IP or CNAME | Apex domain |
| `www` | CNAME | `@` or host value | www redirect |
| `comments` | CNAME / A | VPS IP | Remark42 subdomain |

Set `url: "https://elastropy.com"` in `_config.yml` once domain is confirmed.

---

## Remark42 Server Setup (VPS)

### VPS Requirements
- 1 vCPU, 512MB–1GB RAM is sufficient
- Ubuntu 22.04 LTS
- ~$4–6/month (Hetzner CX11, DigitalOcean $4, Fly.io free tier)

### Step-by-Step Setup

#### 1. Provision VPS
- Create an Ubuntu 22.04 server
- SSH in as root, create a non-root user:
  ```bash
  adduser deploy
  usermod -aG sudo deploy
  # copy your SSH key to the new user
  ```

#### 2. Install Docker and Docker Compose
```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker deploy
```

#### 3. Install Caddy (reverse proxy with auto-HTTPS)
```bash
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update && sudo apt install caddy
```

#### 4. `docker-compose.yml` for Remark42
```yaml
services:
  remark42:
    image: umputun/remark42:latest
    container_name: remark42
    restart: always
    environment:
      - REMARK_URL=https://comments.elastropy.com
      - SITE=elastropy
      - SECRET=${REMARK42_SECRET}
      - AUTH_ANON=true
      - AUTH_GITHUB_CID=${REMARK42_GITHUB_CID}
      - AUTH_GITHUB_CSEC=${REMARK42_GITHUB_CSEC}
      - AUTH_GOOGLE_CID=${REMARK42_GOOGLE_CID}
      - AUTH_GOOGLE_CSEC=${REMARK42_GOOGLE_CSEC}
      - NOTIFY_TELEGRAM_TOKEN=${TELEGRAM_TOKEN}
      - NOTIFY_TELEGRAM_CHAN=${TELEGRAM_CHANNEL}
    volumes:
      - ./var:/srv/var
    ports:
      - "8080:8080"
```

Store secrets in `.env` (not committed to Git):
```
REMARK42_SECRET=<random-64-char-string>
REMARK42_GITHUB_CID=...
REMARK42_GITHUB_CSEC=...
REMARK42_GOOGLE_CID=...
REMARK42_GOOGLE_CSEC=...
```

#### 5. `/etc/caddy/Caddyfile`
```caddyfile
comments.elastropy.com {
    reverse_proxy localhost:8080
}
```

Start/reload Caddy: `sudo systemctl reload caddy`
Start Remark42: `docker compose up -d`

#### 6. DNS
Point `comments.elastropy.com` A record to the VPS IP.

---

## CI/CD Environment Variables

Set these in your hosting platform's dashboard (not in Git):

| Variable | Where to set | Value |
|----------|-------------|-------|
| `JEKYLL_ENV` | Host CI settings | `production` |

That's it for the Jekyll build — all other service credentials are on the Remark42 VPS, not in CI.

---

## .gitignore

```gitignore
_site/
.jekyll-cache/
.jekyll-metadata
vendor/
.bundle/
Gemfile.lock    # optional: commit this for reproducible builds
.env
*.log
.DS_Store
```

---

## Pre-Launch Checklist

### Static Site
- [ ] Custom domain configured and HTTPS working
- [ ] `url:` in `_config.yml` matches production domain
- [ ] `JEKYLL_ENV=production` set in CI
- [ ] `_site/` not committed to Git
- [ ] 404 page exists
- [ ] RSS feed at `/feed.xml` works
- [ ] Sitemap at `/sitemap.xml` works
- [ ] Google Search Console: sitemap submitted
- [ ] OG tags verified with Facebook Sharing Debugger or opengraph.xyz

### Remark42
- [ ] VPS provisioned and SSH accessible
- [ ] Docker Compose running, container healthy
- [ ] Caddy serving `comments.elastropy.com` with valid HTTPS
- [ ] GitHub and Google OAuth apps created with correct callback URLs
- [ ] Test comment posted successfully
- [ ] Admin user ID configured

### Analytics
- [ ] Analytics script only fires in production (not dev)
- [ ] Test page view registered in analytics dashboard

### Email
- [ ] Signup form posts correctly to email platform
- [ ] Test subscription and welcome email received
- [ ] Thank-you redirect works after signup

### Course
- [ ] At least one course page live at `/courses/:slug/`
- [ ] Purchase link tested (goes to payment platform)
- [ ] Thank-you page at `/thanks/:slug/` exists

---

## Ongoing Maintenance

| Task | Frequency |
|------|-----------|
| Update Remark42 Docker image | Monthly |
| Update Jekyll gems (`bundle update`) | Monthly |
| Review and respond to comments | As needed |
| Backup Remark42 SQLite data | Weekly (cron on VPS) |
| Review analytics + Search Console | Monthly |
| Renew domain | Annually |
