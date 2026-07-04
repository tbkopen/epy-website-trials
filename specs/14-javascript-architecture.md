# 14 — JavaScript Architecture

## Principles

1. **Vanilla JS only** — no framework, no build step required
2. **One feature, one file** — each file in `assets/js/features/` handles exactly one concern
3. **Layouts inject, features initialize** — layouts decide which scripts load; scripts never load themselves
4. **Deferred everywhere** — all `<script>` tags use `defer`; nothing blocks HTML parsing
5. **Guard every DOM access** — always check `element !== null` before calling methods; broken scripts must not break the page
6. **No global namespace pollution** — each feature module is an IIFE or uses a named function that attaches to one global object

---

## Directory Structure

```
assets/js/
├── main.js                  ← entry: initializes always-on features
├── features/
│   ├── nav.js               ← mobile navigation drawer open/close + keyboard trap
│   ├── theme.js             ← dark/light mode toggle + system preference sync
│   ├── search.js            ← Pagefind UI initialization
│   ├── math.js              ← KaTeX auto-render initialization
│   ├── comments.js          ← Remark42 widget initialization + theme matching
│   ├── toc.js               ← table of contents scroll spy + active highlighting
│   ├── ripple.js            ← Material ripple effect on buttons/cards
│   ├── reading-progress.js  ← scroll-based reading progress bar
│   └── copy-code.js         ← copy button for code blocks
└── utils/
    ├── dom.js               ← querySelector helpers with null safety
    └── media.js             ← matchMedia helpers for breakpoints + prefers-*
```

---

## How Scripts Are Injected

Layouts decide which scripts load. Scripts never self-inject.

### Always loaded (via `_layouts/default.html`)

```html
<!-- Bottom of <body>, before </body> -->
<script src="/assets/js/main.js" defer></script>
```

`main.js` imports and initializes only always-on features:
- `nav.js` (mobile drawer — needed on every page)
- `ripple.js` (Material ripple — needed on every page with buttons)
- `theme.js` (dark/light sync — always active)

### Conditionally loaded by child layouts

In `_layouts/post.html`:
```liquid
{% if page.math %}
  <script src="/assets/js/features/math.js" defer></script>
{% endif %}

{% if page.comments != false %}
  <script src="/assets/js/features/comments.js" defer></script>
{% endif %}

{% if page.toc %}
  <script src="/assets/js/features/toc.js" defer></script>
{% endif %}

<script src="/assets/js/features/reading-progress.js" defer></script>
<script src="/assets/js/features/copy-code.js" defer></script>
```

In `_layouts/default.html` (all pages, for search):
```html
<script src="/assets/js/features/search.js" defer></script>
```

---

## File Specifications

### `assets/js/utils/dom.js`

Null-safe wrappers so feature scripts don't repeat null checks:

```js
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const on = (el, event, handler, opts) => el?.addEventListener(event, handler, opts);

export { $, $$, on };
```

### `assets/js/utils/media.js`

```js
const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const prefersDark   = () => matchMedia('(prefers-color-scheme: dark)').matches;
const isCompact     = () => matchMedia('(max-width: 599px)').matches;

export { reducedMotion, prefersDark, isCompact };
```

### `assets/js/main.js`

```js
// Always-on features: initialize after DOM is ready
// (defer guarantees DOM is parsed when this runs)

import { initNav }    from './features/nav.js';
import { initTheme }  from './features/theme.js';
import { initRipple } from './features/ripple.js';

initNav();
initTheme();
initRipple();
```

### `assets/js/features/nav.js`

Mobile navigation drawer with keyboard trap and focus management:

```js
export function initNav() {
  const trigger  = document.getElementById('nav-open');
  const close    = document.getElementById('nav-close');
  const drawer   = document.getElementById('nav-drawer');
  const scrim    = document.getElementById('nav-scrim');

  if (!trigger || !drawer) return;   // not on a page with nav drawer

  const open  = () => {
    drawer.setAttribute('aria-hidden', 'false');
    drawer.removeAttribute('inert');
    scrim?.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    close?.focus();
  };

  const closeDrawer = () => {
    drawer.setAttribute('aria-hidden', 'true');
    drawer.setAttribute('inert', '');
    scrim?.setAttribute('hidden', '');
    document.body.style.overflow = '';
    trigger.focus();
  };

  trigger.addEventListener('click', open);
  close?.addEventListener('click', closeDrawer);
  scrim?.addEventListener('click', closeDrawer);

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.getAttribute('aria-hidden') === 'false') {
      closeDrawer();
    }
  });

  // Trap focus inside drawer when open
  drawer.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const focusable = [...drawer.querySelectorAll('a, button, [tabindex="0"]')];
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  });
}
```

### `assets/js/features/theme.js`

Dark/light mode — respects OS preference, allows manual toggle with localStorage persistence:

```js
export function initTheme() {
  const toggle = document.getElementById('theme-toggle');
  const stored = localStorage.getItem('theme');           // 'light' | 'dark' | null
  const system = matchMedia('(prefers-color-scheme: dark)');

  const apply = (dark) => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    toggle?.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    // Sync Remark42 theme if loaded
    if (window.__remark42) {
      window.REMARK42.changeTheme(dark ? 'dark' : 'light');
    }
  };

  // Initial state: stored preference wins, then system
  apply(stored === 'dark' || (stored === null && system.matches));

  // Manual toggle
  toggle?.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
    apply(!isDark);
  });

  // Follow system changes (if no manual override stored)
  system.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) apply(e.matches);
  });
}
```

`_sass/2-base/_root.scss` uses `[data-theme="dark"]` in addition to `@media (prefers-color-scheme: dark)`:
```scss
[data-theme="dark"] {
  @each $name, $value in c.$dark {
    --color-#{$name}: #{$value};
  }
}
```

### `assets/js/features/math.js`

KaTeX auto-render — only runs on pages where `layout: post` injects this script (`page.math == true`):

```js
// Assumes KaTeX JS is already loaded via <script defer> in _includes/math.html
// This file fires after KaTeX is ready (both are deferred — DOM order guarantees sequence)

export function initMath() {
  if (typeof renderMathInElement === 'undefined') return;
  renderMathInElement(document.body, {
    delimiters: [
      { left: '$$', right: '$$', display: true  },
      { left: '$',  right: '$',  display: false },
    ],
    throwOnError: false,   // render partial math rather than crashing on bad syntax
    trust: false,          // disallow \url{} and other network-accessing commands
  });
}

// Auto-init (this file is only injected when needed)
initMath();
```

`_includes/math.html` (injected by post layout when `page.math == true`):
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16/dist/katex.min.css" crossorigin>
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16/dist/katex.min.js" crossorigin></script>
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16/dist/contrib/auto-render.min.js"
  crossorigin></script>
<script src="/assets/js/features/math.js" defer></script>
```

### `assets/js/features/comments.js`

Remark42 initialization with theme matching:

```js
export function initComments() {
  const container = document.getElementById('remark42');
  if (!container) return;

  const isDark = document.documentElement.getAttribute('data-theme') === 'dark'
    || (!localStorage.getItem('theme') && matchMedia('(prefers-color-scheme: dark)').matches);

  window.remark_config = {
    host:        container.dataset.host,       // read from data attribute (set by _includes/comments.html)
    site_id:     container.dataset.siteId,
    components:  ['embed'],
    theme:        isDark ? 'dark' : 'light',
    locale:      'en',
    show_email_subscription: false,
  };

  const script = document.createElement('script');
  script.src = `${window.remark_config.host}/web/embed.js`;
  script.defer = true;
  document.head.appendChild(script);
}

initComments();
```

`_includes/comments.html`:
```html
<section class="comments-section">
  <h2 class="comments-section__title">Comments</h2>
  <div id="remark42"
    data-host="{{ site.remark42_host }}"
    data-site-id="{{ site.remark42_site_id }}">
  </div>
</section>
```

### `assets/js/features/toc.js`

Scroll spy: highlights the active section in the table of contents as the user scrolls:

```js
export function initToc() {
  const toc  = document.querySelector('.toc');
  const links = [...(toc?.querySelectorAll('a[href^="#"]') ?? [])];
  if (!links.length) return;

  const headings = links.map(link => document.querySelector(link.getAttribute('href')))
                        .filter(Boolean);

  const setActive = (id) => {
    links.forEach(l => l.classList.toggle('toc__link--active', l.getAttribute('href') === `#${id}`));
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries.filter(e => e.isIntersecting);
      if (visible.length) setActive(visible[0].target.id);
    },
    { rootMargin: '-10% 0% -80% 0%' }
  );

  headings.forEach(h => observer.observe(h));
}

initToc();
```

### `assets/js/features/search.js`

Pagefind UI initialization:

```js
export function initSearch() {
  const container = document.getElementById('search');
  if (!container) return;

  // Pagefind UI assets are at /pagefind/ (generated at build time)
  if (typeof PagefindUI === 'undefined') return;

  new PagefindUI({
    element: '#search',
    showImages: false,
    showSubResults: false,
    resetStyles: false,
    translations: {
      placeholder: 'Search posts and courses...',
      zero_results: 'No results for "[SEARCH_TERM]".',
    },
  });

  // Keyboard shortcut: Ctrl+K / Cmd+K
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      container.querySelector('input')?.focus();
    }
  });
}

initSearch();
```

### `assets/js/features/ripple.js`

Material ripple effect for buttons and cards:

```js
export function initRipple() {
  const trigger = (e) => {
    const el = e.currentTarget;
    const circle = document.createElement('span');
    const rect   = el.getBoundingClientRect();
    const size   = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top  - size / 2;

    circle.style.cssText = `
      width: ${size}px; height: ${size}px;
      left: ${x}px; top: ${y}px;
    `;
    circle.classList.add('ripple__wave');
    el.querySelector('.ripple')?.appendChild(circle);
    circle.addEventListener('animationend', () => circle.remove(), { once: true });
  };

  // Attach to all elements that should ripple
  document.querySelectorAll('[data-ripple]').forEach(el => {
    el.style.position = 'relative';
    el.style.overflow = 'hidden';
    const container = document.createElement('span');
    container.classList.add('ripple');
    container.style.cssText = 'position:absolute;inset:0;pointer-events:none;overflow:hidden;';
    el.appendChild(container);
    el.addEventListener('click', trigger);
  });
}
```

CSS in `_sass/4-components/_ripple.scss`:
```scss
.ripple__wave {
  position: absolute;
  border-radius: var(--shape-full);
  background: currentColor;
  opacity: 0.12;
  transform: scale(0);
  animation: ripple var(--motion-duration-medium2) var(--motion-easing-standard) forwards;
}

@keyframes ripple {
  to { transform: scale(4); opacity: 0; }
}
```

### `assets/js/features/copy-code.js`

Adds a copy button to every `<pre><code>` block:

```js
export function initCopyCode() {
  document.querySelectorAll('pre > code').forEach(code => {
    const pre = code.parentElement;
    const btn = document.createElement('button');
    btn.className = 'code-block__copy-btn';
    btn.setAttribute('aria-label', 'Copy code');
    btn.innerHTML = '<span class="material-symbols-outlined">content_copy</span>';
    pre.style.position = 'relative';
    pre.appendChild(btn);

    btn.addEventListener('click', async () => {
      await navigator.clipboard.writeText(code.innerText);
      btn.innerHTML = '<span class="material-symbols-outlined">check</span>';
      setTimeout(() => {
        btn.innerHTML = '<span class="material-symbols-outlined">content_copy</span>';
      }, 2000);
    });
  });
}

initCopyCode();
```

### `assets/js/features/reading-progress.js`

Scroll-progress bar at the top of post pages:

```js
export function initReadingProgress() {
  const bar = document.getElementById('reading-progress');
  if (!bar) return;

  const update = () => {
    const scrolled = window.scrollY;
    const total    = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.setProperty('--progress', `${Math.min(100, (scrolled / total) * 100)}%`);
  };

  window.addEventListener('scroll', update, { passive: true });
  update();
}

initReadingProgress();
```

CSS in `_sass/4-components/_reading-progress.scss`:
```scss
#reading-progress {
  position: fixed;
  top: 0;
  left: 0;
  width: var(--progress, 0%);
  height: 3px;
  background: var(--color-primary);
  z-index: 1000;
  transition: width var(--motion-duration-short1) linear;
}
```

---

## External Script Dependencies

| Script | Version | Load Point | Injected By | Condition |
|--------|---------|-----------|------------|-----------|
| KaTeX (main) | 0.16.x | `<head>` bottom | `_includes/math.html` | `page.math == true` |
| KaTeX auto-render | 0.16.x | `<head>` bottom | `_includes/math.html` | `page.math == true` |
| Remark42 embed | latest | created in JS at runtime | `comments.js` | `page.comments != false` |
| Pagefind UI | build-generated | `_includes/search.html` | `_layouts/default.html` | All pages |

All external scripts use `defer` or are created programmatically (Remark42). None block HTML parsing.

---

## No-JS Fallback

The site must be functional without JavaScript for all core reading use cases:

| Feature | JS enabled | JS disabled |
|---------|-----------|------------|
| Blog posts (text) | Full | Full |
| Math rendering | KaTeX renders | LaTeX source visible in `$...$` delimiters |
| Code blocks | Syntax highlighted (Rouge/CSS) + copy button | Syntax highlighted, no copy button |
| Navigation | Animated drawer | Native links work, drawer hidden |
| Comments | Remark42 loads | Section header visible, widget absent |
| Search | Pagefind UI | Input field present but non-functional |
| Reading progress | Animated bar | No bar (no visible degradation) |
| Dark mode | Toggle works | OS preference only (CSS `prefers-color-scheme`) |

Math and comments are the only features with meaningful degradation. Document both in the FAQ or an "about this site" section.

---

## Performance Budgets

| Script | Max size (gzipped) |
|--------|-------------------|
| `main.js` | 5kB |
| `features/*.js` (total) | 20kB |
| KaTeX (only on math pages) | ~70kB (CDN, cached) |
| Pagefind UI | ~15kB (served locally) |
| Remark42 embed | ~50kB (served from Remark42 host, deferred) |

Total JS on a non-math, non-comment page: **< 25kB gzipped**. This stays well within Core Web Vitals INP targets.
