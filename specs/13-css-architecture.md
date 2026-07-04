# 13 — CSS Architecture

## Principle: Token-First, Category-Organized

Every value in every CSS rule comes from a token (CSS custom property). No magic numbers, no raw hex colors, no hardcoded sizes anywhere in component files. Tokens are defined once; components reference them.

The SCSS is organized into **5 numbered layers** that mirror the cascade: tokens → base → layout → components → utilities. Imports flow in one direction only — lower layers never import from higher ones.

---

## Directory Structure

```
_sass/
├── 1-tokens/                   ← CSS custom property definitions (no output alone)
│   ├── _color.scss             ← all color role variables (light + dark values)
│   ├── _typography.scss        ← type scale variables
│   ├── _spacing.scss           ← 4px-grid spacing scale
│   ├── _elevation.scss         ← shadow levels + tint opacities
│   ├── _shape.scss             ← border-radius scale
│   └── _motion.scss            ← duration and easing tokens
│
├── 2-base/                     ← low-specificity foundational styles
│   ├── _reset.scss             ← modern CSS reset (box-sizing, margins, etc.)
│   ├── _root.scss              ← injects all tokens into :root and dark mode
│   ├── _typography.scss        ← h1–h6, p, a, code, blockquote element styles
│   ├── _prose.scss             ← .prose class for long-form blog post content
│   └── _accessibility.scss    ← focus rings, sr-only, skip nav, reduced motion
│
├── 3-layout/                   ← page-level containers and regions
│   ├── _grid.scss              ← content-width containers (.container, .container--wide)
│   ├── _app-bar.scss           ← top navigation bar layout and scroll behaviour
│   ├── _drawer.scss            ← mobile navigation drawer
│   └── _footer.scss            ← site footer layout
│
├── 4-components/               ← individual UI components (alphabetical)
│   ├── _author-card.scss
│   ├── _badge.scss
│   ├── _breadcrumb.scss        ← full Material 3 breadcrumb spec
│   ├── _button.scss            ← all 5 button variants
│   ├── _card.scss              ← elevated, filled, outlined variants
│   ├── _chip.scss              ← tag chips, filter chips
│   ├── _code-block.scss
│   ├── _comments.scss          ← Remark42 wrapper styles
│   ├── _course-card.scss
│   ├── _course-hero.scss
│   ├── _course-pricing.scss
│   ├── _cta-box.scss
│   ├── _math.scss              ← KaTeX display/inline styles
│   ├── _nav-link.scss          ← individual nav link with active indicator
│   ├── _newsletter-form.scss
│   ├── _pagination.scss
│   ├── _post-card.scss
│   ├── _post-meta.scss         ← date, reading time, category line
│   ├── _reading-progress.scss  ← optional scroll progress bar
│   ├── _ripple.scss            ← Material ripple effect
│   ├── _search-bar.scss
│   ├── _search-results.scss    ← Pagefind result card styles
│   ├── _share-buttons.scss
│   ├── _snackbar.scss
│   ├── _state-layer.scss       ← reusable hover/press/focus overlay mixin
│   ├── _table.scss             ← prose table styles
│   └── _toc.scss               ← sticky table of contents
│
└── 5-utilities/
    └── _utilities.scss         ← display, gap, text-align, color override helpers

assets/css/
└── main.scss                   ← entry point — only @forward / @use statements
```

---

## `assets/css/main.scss` — Entry Point

The single file that produces the compiled CSS. Order matters: tokens → base → layout → components → utilities.

```scss
// ─── 1. Tokens (no CSS output — only Sass variables and maps) ────────────────
@use '../_sass/1-tokens/color'      as color;
@use '../_sass/1-tokens/typography' as type;
@use '../_sass/1-tokens/spacing'    as space;
@use '../_sass/1-tokens/elevation'  as elev;
@use '../_sass/1-tokens/shape'      as shape;
@use '../_sass/1-tokens/motion'     as motion;

// ─── 2. Base (low specificity, element selectors only) ───────────────────────
@use '../_sass/2-base/root';           // injects :root custom props + dark mode
@use '../_sass/2-base/reset';
@use '../_sass/2-base/typography';
@use '../_sass/2-base/prose';
@use '../_sass/2-base/accessibility';

// ─── 3. Layout ────────────────────────────────────────────────────────────────
@use '../_sass/3-layout/grid';
@use '../_sass/3-layout/app-bar';
@use '../_sass/3-layout/drawer';
@use '../_sass/3-layout/footer';

// ─── 4. Components ────────────────────────────────────────────────────────────
@use '../_sass/4-components/state-layer';   // mixin — must come first
@use '../_sass/4-components/ripple';
@use '../_sass/4-components/badge';
@use '../_sass/4-components/button';
@use '../_sass/4-components/card';
@use '../_sass/4-components/chip';
@use '../_sass/4-components/nav-link';
@use '../_sass/4-components/breadcrumb';
@use '../_sass/4-components/post-card';
@use '../_sass/4-components/post-meta';
@use '../_sass/4-components/course-card';
@use '../_sass/4-components/course-hero';
@use '../_sass/4-components/course-pricing';
@use '../_sass/4-components/author-card';
@use '../_sass/4-components/cta-box';
@use '../_sass/4-components/newsletter-form';
@use '../_sass/4-components/search-bar';
@use '../_sass/4-components/search-results';
@use '../_sass/4-components/pagination';
@use '../_sass/4-components/toc';
@use '../_sass/4-components/comments';
@use '../_sass/4-components/math';
@use '../_sass/4-components/code-block';
@use '../_sass/4-components/table';
@use '../_sass/4-components/share-buttons';
@use '../_sass/4-components/snackbar';
@use '../_sass/4-components/reading-progress';

// ─── 5. Utilities (highest specificity — last in cascade) ────────────────────
@use '../_sass/5-utilities/utilities';
```

---

## Token Layer Detail (`_sass/1-tokens/`)

### `_color.scss`

This file defines SCSS maps for light and dark roles. `_sass/2-base/_root.scss` reads these maps and outputs the CSS custom properties into `:root`. Components never reference SCSS variables directly — they always use `var(--color-*)`.

```scss
// _sass/1-tokens/_color.scss

$light: (
  'primary':                  #1A5FC0,
  'on-primary':               #FFFFFF,
  'primary-container':        #DAE2FF,
  'on-primary-container':     #001257,
  'inverse-primary':          #AFC7FF,

  'secondary':                #525A89,
  'on-secondary':             #FFFFFF,
  'secondary-container':      #DDE1FF,
  'on-secondary-container':   #0F1740,

  'tertiary':                 #775379,
  'on-tertiary':              #FFFFFF,
  'tertiary-container':       #FFD6FF,
  'on-tertiary-container':    #2D1130,

  'error':                    #BA1A1A,
  'on-error':                 #FFFFFF,
  'error-container':          #FFDAD6,
  'on-error-container':       #410002,

  'background':               #FEFBFF,
  'on-background':            #1B1B1F,
  'surface':                  #FEFBFF,
  'on-surface':               #1B1B1F,
  'surface-variant':          #E3E1F4,
  'on-surface-variant':       #45464F,
  'surface-inverse':          #303034,
  'on-surface-inverse':       #F3EFF4,

  'surface-container-lowest': #FFFFFF,
  'surface-container-low':    #F6F2F7,
  'surface-container':        #F0ECF1,
  'surface-container-high':   #EBE7EC,
  'surface-container-highest':#E5E1E6,

  'outline':                  #767685,
  'outline-variant':          #C7C5D7,
  'scrim':                    #000000,
  'surface-tint':             #1A5FC0,
);

$dark: (
  'primary':                  #AFC7FF,
  'on-primary':               #002088,
  'primary-container':        #0031AC,
  'on-primary-container':     #DAE2FF,
  'inverse-primary':          #1A5FC0,

  'secondary':                #BCC3F8,
  'on-secondary':             #242B58,
  'secondary-container':      #3B4270,
  'on-secondary-container':   #DDE1FF,

  'tertiary':                 #E5BBE7,
  'on-tertiary':              #452648,
  'tertiary-container':       #5D3C60,
  'on-tertiary-container':    #FFD6FF,

  'error':                    #FFB4AB,
  'on-error':                 #690005,
  'error-container':          #93000A,
  'on-error-container':       #FFDAD6,

  'background':               #1B1B1F,
  'on-background':            #E5E1E6,
  'surface':                  #131316,
  'on-surface':               #E5E1E6,
  'surface-variant':          #45464F,
  'on-surface-variant':       #C7C5D7,
  'surface-inverse':          #E5E1E6,
  'on-surface-inverse':       #303034,

  'surface-container-lowest': #0E0E11,
  'surface-container-low':    #1B1B1F,
  'surface-container':        #1F1F23,
  'surface-container-high':   #29292D,
  'surface-container-highest':#303034,

  'outline':                  #90909F,
  'outline-variant':          #45464F,
  'scrim':                    #000000,
  'surface-tint':             #AFC7FF,
);
```

### `_typography.scss`

```scss
// _sass/1-tokens/_typography.scss

$scale: (
  'display-large':   (size: 3.5625rem, line-height: 4rem,    weight: 400, tracking: -0.016em),
  'display-medium':  (size: 2.8125rem, line-height: 3.25rem, weight: 400, tracking: 0),
  'display-small':   (size: 2.25rem,   line-height: 2.75rem, weight: 400, tracking: 0),
  'headline-large':  (size: 2rem,      line-height: 2.5rem,  weight: 400, tracking: 0),
  'headline-medium': (size: 1.75rem,   line-height: 2.25rem, weight: 400, tracking: 0),
  'headline-small':  (size: 1.5rem,    line-height: 2rem,    weight: 400, tracking: 0),
  'title-large':     (size: 1.375rem,  line-height: 1.75rem, weight: 400, tracking: 0),
  'title-medium':    (size: 1rem,      line-height: 1.5rem,  weight: 500, tracking: 0.009em),
  'title-small':     (size: 0.875rem,  line-height: 1.25rem, weight: 500, tracking: 0.006em),
  'body-large':      (size: 1rem,      line-height: 1.75rem, weight: 400, tracking: 0.031em),
  'body-medium':     (size: 0.875rem,  line-height: 1.5rem,  weight: 400, tracking: 0.016em),
  'body-small':      (size: 0.75rem,   line-height: 1.25rem, weight: 400, tracking: 0.025em),
  'label-large':     (size: 0.875rem,  line-height: 1.25rem, weight: 500, tracking: 0.006em),
  'label-medium':    (size: 0.75rem,   line-height: 1rem,    weight: 500, tracking: 0.031em),
  'label-small':     (size: 0.6875rem, line-height: 1rem,    weight: 500, tracking: 0.031em),
);

$font-brand: "'Roboto', system-ui, sans-serif";
$font-plain: "'Roboto', system-ui, sans-serif";
$font-code:  "'JetBrains Mono', 'Fira Code', monospace";
```

### `_spacing.scss`

```scss
// _sass/1-tokens/_spacing.scss
$scale: (1: 4px, 2: 8px, 3: 12px, 4: 16px, 5: 20px, 6: 24px,
         7: 28px, 8: 32px, 10: 40px, 12: 48px, 14: 56px,
         16: 64px, 20: 80px, 24: 96px);
```

### `_shape.scss`

```scss
// _sass/1-tokens/_shape.scss
$scale: (
  'none':        0,
  'extra-small': 4px,
  'small':       8px,
  'medium':      12px,
  'large':       16px,
  'extra-large': 28px,
  'full':        9999px,
);
```

### `_elevation.scss`

```scss
// _sass/1-tokens/_elevation.scss
$shadows: (
  0: none,
  1: '0 1px 2px rgba(0,0,0,.30), 0 1px 3px 1px rgba(0,0,0,.15)',
  2: '0 1px 2px rgba(0,0,0,.30), 0 2px 6px 2px rgba(0,0,0,.15)',
  3: '0 4px 8px 3px rgba(0,0,0,.15), 0 1px 3px rgba(0,0,0,.30)',
  4: '0 6px 10px 4px rgba(0,0,0,.15), 0 2px 3px rgba(0,0,0,.30)',
  5: '0 8px 12px 6px rgba(0,0,0,.15), 0 4px 4px rgba(0,0,0,.30)',
);
$tint-opacities: (0: 0%, 1: 5%, 2: 8%, 3: 11%, 4: 12%, 5: 14%);
```

### `_motion.scss`

```scss
// _sass/1-tokens/_motion.scss
$durations: (
  'short1': 50ms,  'short2': 100ms, 'short3': 150ms, 'short4': 200ms,
  'medium1': 250ms,'medium2': 300ms,'medium3': 350ms,'medium4': 400ms,
  'long1': 450ms,  'long2': 500ms,
);
$easings: (
  'standard':         cubic-bezier(0.2, 0, 0, 1.0),
  'standard-decel':   cubic-bezier(0, 0, 0, 1),
  'standard-accel':   cubic-bezier(0.3, 0, 1, 1),
  'emphasized-decel': cubic-bezier(0.05, 0.7, 0.1, 1.0),
  'emphasized-accel': cubic-bezier(0.3, 0, 0.8, 0.15),
  'legacy':           cubic-bezier(0.4, 0, 0.2, 1),
);
```

---

## Base Layer Detail (`_sass/2-base/`)

### `_root.scss` — Token Injection

This is the only place where tokens become CSS custom properties:

```scss
// _sass/2-base/_root.scss
@use '../1-tokens/color' as c;
@use '../1-tokens/typography' as t;
@use '../1-tokens/spacing' as sp;
@use '../1-tokens/elevation' as e;
@use '../1-tokens/shape' as sh;
@use '../1-tokens/motion' as m;

:root {
  // Colors (light)
  @each $name, $value in c.$light {
    --color-#{$name}: #{$value};
  }

  // Typography
  --font-brand: #{t.$font-brand};
  --font-plain: #{t.$font-plain};
  --font-code:  #{t.$font-code};
  @each $role, $props in t.$scale {
    --typescale-#{$role}-size:        #{map-get($props, 'size')};
    --typescale-#{$role}-line-height: #{map-get($props, 'line-height')};
    --typescale-#{$role}-weight:      #{map-get($props, 'weight')};
    --typescale-#{$role}-tracking:    #{map-get($props, 'tracking')};
  }

  // Spacing
  @each $step, $value in sp.$scale {
    --space-#{$step}: #{$value};
  }

  // Elevation
  @each $level, $shadow in e.$shadows {
    --elevation-#{$level}: #{$shadow};
  }
  @each $level, $opacity in e.$tint-opacities {
    --elevation-tint-#{$level}: #{$opacity};
  }

  // Shape
  @each $name, $value in sh.$scale {
    --shape-#{$name}: #{$value};
  }

  // Motion
  @each $key, $value in m.$durations {
    --motion-duration-#{$key}: #{$value};
  }
  @each $key, $value in m.$easings {
    --motion-easing-#{$key}: #{$value};
  }
}

// Dark mode overrides (only color tokens change)
@media (prefers-color-scheme: dark) {
  :root {
    @each $name, $value in c.$dark {
      --color-#{$name}: #{$value};
    }
  }
}
```

### `_reset.scss`

```scss
// _sass/2-base/_reset.scss
*, *::before, *::after { box-sizing: border-box; }
* { margin: 0; }
body { line-height: 1.5; -webkit-font-smoothing: antialiased; }
img, picture, video, canvas, svg { display: block; max-width: 100%; }
input, button, textarea, select { font: inherit; }
p, h1, h2, h3, h4, h5, h6 { overflow-wrap: break-word; }
```

### `_typography.scss`

Element-level type styles. Uses tokens only — no raw values.

```scss
// _sass/2-base/_typography.scss
body {
  font-family: var(--font-plain);
  font-size: var(--typescale-body-large-size);
  line-height: var(--typescale-body-large-line-height);
  color: var(--color-on-background);
  background-color: var(--color-background);
}

h1 { font-family: var(--font-brand); font-size: var(--typescale-headline-large-size);
     line-height: var(--typescale-headline-large-line-height); font-weight: 400; }
h2 { font-family: var(--font-brand); font-size: var(--typescale-headline-medium-size);
     line-height: var(--typescale-headline-medium-line-height); font-weight: 400; }
h3 { font-family: var(--font-brand); font-size: var(--typescale-headline-small-size);
     line-height: var(--typescale-headline-small-line-height); font-weight: 400; }
h4 { font-size: var(--typescale-title-large-size);
     line-height: var(--typescale-title-large-line-height); font-weight: 500; }
h5 { font-size: var(--typescale-title-medium-size); font-weight: 500; }
h6 { font-size: var(--typescale-title-small-size); font-weight: 500; }

a {
  color: var(--color-primary);
  text-decoration: underline;
  text-underline-offset: 3px;
}
a:hover { color: var(--color-primary); text-decoration: none; }

code, pre { font-family: var(--font-code); }
```

### `_prose.scss`

The `.prose` class wraps post body content and adds comfortable reading styles:

```scss
// _sass/2-base/_prose.scss
.prose {
  max-width: 72ch;              // optimal reading measure
  color: var(--color-on-surface);

  p, li { line-height: 1.8; margin-bottom: var(--space-4); }

  h2 { margin-top: var(--space-12); margin-bottom: var(--space-4); }
  h3 { margin-top: var(--space-8);  margin-bottom: var(--space-3); }
  h4 { margin-top: var(--space-6);  margin-bottom: var(--space-2); }

  blockquote {
    border-left: 4px solid var(--color-primary-container);
    padding-left: var(--space-4);
    color: var(--color-on-surface-variant);
    font-style: italic;
  }

  hr {
    border: none;
    border-top: 1px solid var(--color-outline-variant);
    margin: var(--space-12) 0;
  }

  img {
    border-radius: var(--shape-medium);
    margin: var(--space-6) auto;
  }

  ul, ol { padding-left: var(--space-6); }
  li + li { margin-top: var(--space-2); }
}
```

### `_accessibility.scss`

```scss
// _sass/2-base/_accessibility.scss
.sr-only {
  position: absolute; width: 1px; height: 1px;
  padding: 0; margin: -1px; overflow: hidden;
  clip: rect(0,0,0,0); white-space: nowrap; border: 0;
}

:focus-visible {
  outline: 3px solid var(--color-primary);
  outline-offset: 2px;
}
:focus:not(:focus-visible) { outline: none; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Component Layer — Breadcrumb Detail

Full implementation spec for the breadcrumb component:

```scss
// _sass/4-components/_breadcrumb.scss

.breadcrumb {
  padding: var(--space-3) 0;
}

.breadcrumb__list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  list-style: none;
  padding: 0;
  margin: 0;
  gap: var(--space-1);
}

.breadcrumb__item {
  display: flex;
  align-items: center;
}

.breadcrumb__link {
  display: inline-flex;
  align-items: center;
  padding: var(--space-1) var(--space-2);
  border-radius: var(--shape-extra-small);
  font-size: var(--typescale-label-large-size);
  font-weight: var(--typescale-label-large-weight);
  letter-spacing: var(--typescale-label-large-tracking);
  color: var(--color-primary);
  text-decoration: none;
  position: relative;
  transition: background-color var(--motion-duration-short2) var(--motion-easing-standard);

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: var(--color-primary);
    opacity: 0;
    transition: opacity var(--motion-duration-short2) var(--motion-easing-standard);
  }

  &:hover::after  { opacity: 0.08; }
  &:active::after { opacity: 0.12; }
}

.breadcrumb__separator {
  color: var(--color-on-surface-variant);
  font-size: 1.25rem;
  line-height: 1;
  user-select: none;
  flex-shrink: 0;
}

.breadcrumb__current {
  padding: var(--space-1) var(--space-2);
  font-size: var(--typescale-label-large-size);
  font-weight: var(--typescale-label-large-weight);
  letter-spacing: var(--typescale-label-large-tracking);
  color: var(--color-on-surface-variant);
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

// Compact on small screens — show only parent + current
@media (max-width: 599px) {
  .breadcrumb__item:not(:nth-last-child(-n+3)),
  .breadcrumb__separator:not(:nth-last-child(-n+2)) {
    display: none;
  }
}
```

---

## Naming Conventions

| Pattern | Usage | Example |
|---------|-------|---------|
| `--color-{role}` | Color token | `--color-primary` |
| `--typescale-{role}-{prop}` | Type scale token | `--typescale-body-large-size` |
| `--space-{n}` | Spacing token | `--space-4` |
| `--shape-{name}` | Border radius token | `--shape-medium` |
| `--elevation-{n}` | Shadow token | `--elevation-2` |
| `--motion-duration-{key}` | Duration token | `--motion-duration-short2` |
| `--motion-easing-{key}` | Easing token | `--motion-easing-standard` |
| `.{block}___{element}` | BEM element | `.breadcrumb__link` |
| `.{block}--{modifier}` | BEM modifier | `.card--outlined` |
| `.u-{property}` | Utility class | `.u-text-center` |

---

## What Belongs Where

| What | Where | Example |
|------|-------|---------|
| Color definitions | `1-tokens/_color.scss` | SCSS maps |
| Color usage | Component files via `var(--color-*)` | `background: var(--color-surface)` |
| Font declarations | `1-tokens/_typography.scss` | SCSS variables |
| Font loading | `_includes/head.html` | Google Fonts `<link>` |
| Element defaults | `2-base/_typography.scss` | `h1 { ... }` |
| Reading layout | `2-base/_prose.scss` | `.prose p { ... }` |
| Page regions | `3-layout/` | `.container`, `.app-bar` |
| UI widgets | `4-components/` | `.card`, `.button`, `.breadcrumb` |
| Overrides | `5-utilities/` | `.u-visually-hidden` |

**Never**: raw hex values in component files. **Never**: token definitions inside component files. **Never**: component styles in base files.

---

## KaTeX CSS Integration

KaTeX ships its own CSS file. Load it from CDN in `_includes/math.html` (injected only when `page.math == true`):

```html
<link rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/katex@0.16/dist/katex.min.css"
  crossorigin="anonymous">
```

Then override KaTeX variables in `_sass/4-components/_math.scss` to harmonize with site tokens:
```scss
// _sass/4-components/_math.scss
.katex-display {
  overflow-x: auto;
  overflow-y: hidden;
  padding: var(--space-4) 0;
  border-left: 3px solid var(--color-primary-container);
  padding-left: var(--space-4);
  margin: var(--space-6) 0;
}
.katex { font-size: 1.1em; }
```

## Pagefind CSS Integration

Pagefind generates its own `pagefind-ui.css`. Override it in `_sass/4-components/_search-results.scss` using Pagefind's CSS variables:

```scss
// _sass/4-components/_search-results.scss
.pagefind-ui {
  --pagefind-ui-primary:        var(--color-primary);
  --pagefind-ui-text:           var(--color-on-surface);
  --pagefind-ui-background:     var(--color-surface-container);
  --pagefind-ui-border:         var(--color-outline-variant);
  --pagefind-ui-tag:            var(--color-secondary-container);
  --pagefind-ui-border-radius:  var(--shape-small);
  --pagefind-ui-font:           var(--font-plain);
}
```

## Remark42 CSS Integration

Remark42 renders inside an iframe and applies its own styles. The only thing we control is the container wrapper:

```scss
// _sass/4-components/_comments.scss
.comments-section {
  margin-top: var(--space-16);
  padding-top: var(--space-8);
  border-top: 1px solid var(--color-outline-variant);
}

.comments-section__title {
  font-size: var(--typescale-headline-small-size);
  font-weight: 400;
  color: var(--color-on-surface);
  margin-bottom: var(--space-6);
}

#remark42 {
  // Remark42 handles internal styles via its own CSS bundle
  // Do NOT attempt to style inside the iframe
  min-height: 200px;
}
```

To match Remark42's theme with the site: set `theme: "light"` or `theme: "dark"` in the Remark42 init script based on `prefers-color-scheme`. See `assets/js/features/comments.js`.

---

## Dependencies Summary

All external CSS dependencies, where they load, and how they're controlled:

| Library | Version | Load Point | Controlled By |
|---------|---------|-----------|--------------|
| Google Fonts (Roboto) | latest | `_includes/head.html` | Always loaded |
| Material Symbols | latest | `_includes/head.html` | Always loaded |
| KaTeX CSS | 0.16.x | `_includes/math.html` | Only when `page.math == true` |
| Pagefind UI CSS | auto | `_includes/search.html` | Loaded from `/pagefind/pagefind-ui.css` (generated at build) |
| Remark42 CSS | auto | Inside Remark42 iframe | Not controlled — Remark42 self-loads |

Site's own CSS is a single compiled file: `assets/css/main.css` (from `main.scss`).
