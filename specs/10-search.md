# 10 — Site Search

## Overview

Static sites don't have a server to run queries against, so search must be handled client-side using a pre-built index, or delegated to a third-party service. This spec defines the implementation using **Pagefind** — a modern, fast, zero-config static search tool that integrates naturally with Jekyll.

---

## Technology Choice: Pagefind

| Option | How it works | Pros | Cons |
|--------|-------------|------|------|
| **Pagefind** (chosen) | Indexes `_site/` at build time; tiny WASM-based client searches locally | Very fast, zero JS framework, free, works offline | Requires build-time indexing step |
| Lunr.js | Build a JSON index; client-side JS searches it | Mature, no external service | Larger index file for big sites; slower on many posts |
| Algolia DocSearch | External service indexes your site; JS client calls API | Best UX, handles typos | External dependency, requires approval for free tier |
| Simple Jekyll Search | JSON index, tiny JS | Very lightweight | No fuzzy matching, limited features |

**Why Pagefind**: indexes the rendered HTML (so it searches rendered math, code, etc.); the client bundle is ~15kB; returns excerpt highlights; supports filters (by category/tag); entirely offline after first load.

---

## How Pagefind Works

```
Build step:
  1. Jekyll builds _site/ normally
  2. Pagefind CLI scans _site/ → generates _site/pagefind/ (search index + WASM)

Client side:
  User types in search box
  → Pagefind JS (loaded deferred) queries the index locally
  → Results returned with excerpt highlights
  → No server call
```

---

## Build Integration

### Step 1: Install Pagefind

Pagefind is an npm package. One-time global install in WSL:
```bash
npm install -g pagefind
```

Or pin to the project (add `package.json`):
```json
{
  "devDependencies": {
    "pagefind": "^1.0.0"
  }
}
```
Then: `npm install && npm run index`

### Step 2: Add Indexing to Build Command

In CI (`GitHub Actions` / Netlify / Cloudflare Pages), the build command becomes:
```bash
bundle exec jekyll build && npx pagefind --site _site
```

Netlify `netlify.toml`:
```toml
[build]
  command = "bundle exec jekyll build && npx pagefind --site _site"
  publish = "_site"
```

### Step 3: Local Development

Run indexing after each Jekyll build locally:
```bash
bundle exec jekyll build && npx pagefind --site _site
bundle exec jekyll serve  # serve the already-built _site
```

Or just add it to `.claude/commands/build.md` (already references the full build step).

---

## Controlling What Gets Indexed

Pagefind indexes by default. Use `data-pagefind-*` attributes to control:

### Exclude from index (in `_layouts/` and `_includes/`):
```html
<nav data-pagefind-ignore>...</nav>
<footer data-pagefind-ignore>...</footer>
<aside class="course-cta" data-pagefind-ignore>...</aside>
<div id="remark42" data-pagefind-ignore></div>
```

### Mark main content body:
```html
<article data-pagefind-body>
  {{ content }}
</article>
```

### Add filter metadata (for filtering results by category):
```html
<!-- In _layouts/post.html -->
<article
  data-pagefind-body
  data-pagefind-filter="category:{{ page.categories | first }}"
>
```

---

## Search UI Component

### Where search appears
1. **Header**: a search icon that expands to an input on click (desktop)
2. **Mobile nav**: full-width search bar inside the hamburger menu
3. **Blog index sidebar**: search widget (desktop sidebar)
4. **404 page**: prominent search box with message "Can't find what you're looking for?"

### `_includes/search.html`

```html
<div class="search" id="search">
  <input
    type="search"
    id="search-input"
    class="search__input"
    placeholder="Search posts and courses..."
    aria-label="Search"
    autocomplete="off"
  >
  <div id="search-results" class="search__results" aria-live="polite"></div>
</div>

<link rel="stylesheet" href="/pagefind/pagefind-ui.css">
<script src="/pagefind/pagefind-ui.js" defer></script>
<script defer>
  window.addEventListener('DOMContentLoaded', () => {
    const search = new PagefindUI({
      element: '#search',
      showImages: false,
      showSubResults: false,
      resetStyles: false,   // use our own CSS instead of Pagefind's default
      translations: {
        placeholder: 'Search posts and courses...',
        zero_results: 'No results for "[SEARCH_TERM]"',
      }
    });
  });
</script>
```

### Search Result Card Display

Pagefind returns: URL, title, excerpt with highlight, meta (date, category). Style these via `.pagefind-ui__result` classes in `_sass/components/_search.scss`.

---

## Keyboard Shortcut (Optional)

Open search on `Ctrl+K` / `Cmd+K` (standard convention):
```js
// assets/js/search-shortcut.js
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    document.getElementById('search-input')?.focus();
  }
});
```

---

## Search Index Size Estimates

| Posts | Estimated index size |
|-------|---------------------|
| 50 | ~200kB |
| 200 | ~600kB |
| 500 | ~1.2MB |

The index is split into chunks by Pagefind and loaded on demand (only chunks needed for the current query are fetched) — so large sites stay fast.

---

## `.gitignore` Addition

```gitignore
# Pagefind index — generated at build time, not committed
_site/pagefind/
```

Do not commit the `pagefind/` directory — it's regenerated on every build.
