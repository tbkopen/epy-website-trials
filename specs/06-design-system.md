# 06 — Design System (Material Design 3)

## Design System: Material Design 3 (Material You)

The site uses **Material Design 3** as its design system. All visual decisions — colors, typography, elevation, shape, motion — are derived from a single source color through MD3's tonal palette algorithm. No color from any other palette is ever mixed in.

---

## Source Color

```
Seed: #1A5FC0
```

**All colors in this design system are algorithmically derived from this single seed.** The HCT (Hue-Chroma-Tone) color space generates five tonal palettes from the seed; all color roles are assigned from those palettes.

To change the entire site's color scheme, change only this seed. Everything else follows.

---

## Tonal Palettes (Single Source)

MD3 generates five tonal palettes from the seed. Each palette is a 13-stop scale from tone 0 (black) to tone 100 (white).

### Primary Palette — from seed #1A5FC0 (Blue, high chroma)

| Token | Tone | Hex |
|-------|------|-----|
| `--md-ref-palette-primary0` | 0 | `#000000` |
| `--md-ref-palette-primary10` | 10 | `#001257` |
| `--md-ref-palette-primary20` | 20 | `#002088` |
| `--md-ref-palette-primary30` | 30 | `#0031AC` |
| `--md-ref-palette-primary40` | 40 | `#1A5FC0` ← **seed** |
| `--md-ref-palette-primary50` | 50 | `#3878DC` |
| `--md-ref-palette-primary60` | 60 | `#5593F8` |
| `--md-ref-palette-primary70` | 70 | `#82ACFF` |
| `--md-ref-palette-primary80` | 80 | `#AFC7FF` |
| `--md-ref-palette-primary90` | 90 | `#DAE2FF` |
| `--md-ref-palette-primary95` | 95 | `#EEF0FF` |
| `--md-ref-palette-primary99` | 99 | `#FEFBFF` |
| `--md-ref-palette-primary100` | 100 | `#FFFFFF` |

### Secondary Palette — same hue, low chroma (muted companion)

| Token | Tone | Hex |
|-------|------|-----|
| `--md-ref-palette-secondary10` | 10 | `#0F1740` |
| `--md-ref-palette-secondary20` | 20 | `#242B58` |
| `--md-ref-palette-secondary30` | 30 | `#3B4270` |
| `--md-ref-palette-secondary40` | 40 | `#525A89` |
| `--md-ref-palette-secondary50` | 50 | `#6B73A4` |
| `--md-ref-palette-secondary60` | 60 | `#858DBF` |
| `--md-ref-palette-secondary70` | 70 | `#A0A8DB` |
| `--md-ref-palette-secondary80` | 80 | `#BCC3F8` |
| `--md-ref-palette-secondary90` | 90 | `#DDE1FF` |
| `--md-ref-palette-secondary95` | 95 | `#EEF0FF` |
| `--md-ref-palette-secondary99` | 99 | `#FEFBFF` |

### Tertiary Palette — hue shifted +60°, medium chroma (accent complement)

| Token | Tone | Hex |
|-------|------|-----|
| `--md-ref-palette-tertiary10` | 10 | `#2D1130` |
| `--md-ref-palette-tertiary20` | 20 | `#452648` |
| `--md-ref-palette-tertiary30` | 30 | `#5D3C60` |
| `--md-ref-palette-tertiary40` | 40 | `#775379` |
| `--md-ref-palette-tertiary50` | 50 | `#926C93` |
| `--md-ref-palette-tertiary60` | 60 | `#AD86AE` |
| `--md-ref-palette-tertiary70` | 70 | `#C9A1CA` |
| `--md-ref-palette-tertiary80` | 80 | `#E5BBE7` |
| `--md-ref-palette-tertiary90` | 90 | `#FFD6FF` |
| `--md-ref-palette-tertiary95` | 95 | `#FFECFF` |

### Neutral Palette — same hue, near-zero chroma (surfaces, backgrounds)

| Token | Tone | Hex |
|-------|------|-----|
| `--md-ref-palette-neutral6` | 6 | `#0F1014` |
| `--md-ref-palette-neutral10` | 10 | `#1B1B1F` |
| `--md-ref-palette-neutral12` | 12 | `#1F1F23` |
| `--md-ref-palette-neutral17` | 17 | `#29292D` |
| `--md-ref-palette-neutral20` | 20 | `#303034` |
| `--md-ref-palette-neutral22` | 22 | `#343438` |
| `--md-ref-palette-neutral24` | 24 | `#38383C` |
| `--md-ref-palette-neutral87` | 87 | `#DEDAD0` |
| `--md-ref-palette-neutral90` | 90 | `#E5E1E6` |
| `--md-ref-palette-neutral92` | 92 | `#EBE7EC` |
| `--md-ref-palette-neutral94` | 94 | `#F0ECF1` |
| `--md-ref-palette-neutral95` | 95 | `#F3EFF4` |
| `--md-ref-palette-neutral96` | 96 | `#F6F2F7` |
| `--md-ref-palette-neutral98` | 98 | `#FCF8FD` |
| `--md-ref-palette-neutral99` | 99 | `#FEFBFF` |

### Neutral Variant Palette — same hue, slight chroma (dividers, text variants)

| Token | Tone | Hex |
|-------|------|-----|
| `--md-ref-palette-neutral-variant10` | 10 | `#1A1C27` |
| `--md-ref-palette-neutral-variant20` | 20 | `#2E303D` |
| `--md-ref-palette-neutral-variant30` | 30 | `#454654` |
| `--md-ref-palette-neutral-variant40` | 40 | `#5D5E6C` |
| `--md-ref-palette-neutral-variant50` | 50 | `#767685` |
| `--md-ref-palette-neutral-variant60` | 60 | `#90909F` |
| `--md-ref-palette-neutral-variant70` | 70 | `#ABAABC` |
| `--md-ref-palette-neutral-variant80` | 80 | `#C7C5D7` |
| `--md-ref-palette-neutral-variant90` | 90 | `#E3E1F4` |
| `--md-ref-palette-neutral-variant95` | 95 | `#F2EFFF` |

### Error Palette — fixed (MD3 standard, not derived from seed)

| Token | Tone | Hex |
|-------|------|-----|
| `--md-ref-palette-error10` | 10 | `#410002` |
| `--md-ref-palette-error20` | 20 | `#690005` |
| `--md-ref-palette-error30` | 30 | `#93000A` |
| `--md-ref-palette-error40` | 40 | `#BA1A1A` |
| `--md-ref-palette-error80` | 80 | `#FFB4AB` |
| `--md-ref-palette-error90` | 90 | `#FFDAD6` |
| `--md-ref-palette-error100` | 100 | `#FFFFFF` |

> The Error palette is standardized in MD3 — it is NOT derived from the seed color. It is the only exception to the single-palette rule.

---

## Color Roles (Semantic Assignments)

Color roles map semantic meaning to specific tones. Changing light/dark mode swaps the tone assignments — the palette itself never changes.

### Light Theme Color Roles

```css
/* _sass/1-tokens/_color.scss  →  injected in :root by _sass/2-base/_root.scss */

/* Primary */
--color-primary:                  #1A5FC0;  /* P-40 */
--color-on-primary:               #FFFFFF;  /* P-100 */
--color-primary-container:        #DAE2FF;  /* P-90 */
--color-on-primary-container:     #001257;  /* P-10 */
--color-inverse-primary:          #AFC7FF;  /* P-80 */

/* Secondary */
--color-secondary:                #525A89;  /* S-40 */
--color-on-secondary:             #FFFFFF;  /* S-100 */
--color-secondary-container:      #DDE1FF;  /* S-90 */
--color-on-secondary-container:   #0F1740;  /* S-10 */

/* Tertiary */
--color-tertiary:                 #775379;  /* T-40 */
--color-on-tertiary:              #FFFFFF;  /* T-100 */
--color-tertiary-container:       #FFD6FF;  /* T-90 */
--color-on-tertiary-container:    #2D1130;  /* T-10 */

/* Error */
--color-error:                    #BA1A1A;  /* E-40 */
--color-on-error:                 #FFFFFF;  /* E-100 */
--color-error-container:          #FFDAD6;  /* E-90 */
--color-on-error-container:       #410002;  /* E-10 */

/* Surface & Background */
--color-background:               #FEFBFF;  /* N-99 */
--color-on-background:            #1B1B1F;  /* N-10 */
--color-surface:                  #FEFBFF;  /* N-99 */
--color-on-surface:               #1B1B1F;  /* N-10 */
--color-surface-variant:          #E3E1F4;  /* NV-90 */
--color-on-surface-variant:       #45464F;  /* NV-40 (approx) */
--color-surface-inverse:          #303034;  /* N-20 */
--color-on-surface-inverse:       #F3EFF4;  /* N-95 */

/* Containers (elevated surfaces — tinted) */
--color-surface-container-lowest: #FFFFFF;  /* N-100 */
--color-surface-container-low:    #F6F2F7;  /* N-96 */
--color-surface-container:        #F0ECF1;  /* N-94 */
--color-surface-container-high:   #EBE7EC;  /* N-92 */
--color-surface-container-highest:#E5E1E6;  /* N-90 */

/* Outline */
--color-outline:                  #767685;  /* NV-50 */
--color-outline-variant:          #C7C5D7;  /* NV-80 */

/* Scrim */
--color-scrim:                    #000000;

/* Surface tint (primary at opacity — used for elevation) */
--color-surface-tint:             #1A5FC0;  /* P-40 */
```

### Dark Theme Color Roles

```css
/* Injected inside @media (prefers-color-scheme: dark) { :root { ... } } */

/* Primary */
--color-primary:                  #AFC7FF;  /* P-80 */
--color-on-primary:               #002088;  /* P-20 */
--color-primary-container:        #0031AC;  /* P-30 */
--color-on-primary-container:     #DAE2FF;  /* P-90 */
--color-inverse-primary:          #1A5FC0;  /* P-40 */

/* Secondary */
--color-secondary:                #BCC3F8;  /* S-80 */
--color-on-secondary:             #242B58;  /* S-20 */
--color-secondary-container:      #3B4270;  /* S-30 */
--color-on-secondary-container:   #DDE1FF;  /* S-90 */

/* Tertiary */
--color-tertiary:                 #E5BBE7;  /* T-80 */
--color-on-tertiary:              #452648;  /* T-20 */
--color-tertiary-container:       #5D3C60;  /* T-30 */
--color-on-tertiary-container:    #FFD6FF;  /* T-90 */

/* Error */
--color-error:                    #FFB4AB;  /* E-80 */
--color-on-error:                 #690005;  /* E-20 */
--color-error-container:          #93000A;  /* E-30 */
--color-on-error-container:       #FFDAD6;  /* E-90 */

/* Surface & Background */
--color-background:               #1B1B1F;  /* N-10 */
--color-on-background:            #E5E1E6;  /* N-90 */
--color-surface:                  #131316;  /* N-6 */
--color-on-surface:               #E5E1E6;  /* N-90 */
--color-surface-variant:          #45464F;  /* NV-30 */
--color-on-surface-variant:       #C7C5D7;  /* NV-80 */
--color-surface-inverse:          #E5E1E6;  /* N-90 */
--color-on-surface-inverse:       #303034;  /* N-20 */

/* Containers */
--color-surface-container-lowest: #0E0E11;
--color-surface-container-low:    #1B1B1F;  /* N-10 */
--color-surface-container:        #1F1F23;  /* N-12 */
--color-surface-container-high:   #29292D;  /* N-17 */
--color-surface-container-highest:#303034;  /* N-20 */

/* Outline */
--color-outline:                  #90909F;  /* NV-60 */
--color-outline-variant:          #45464F;  /* NV-30 */

/* Surface tint */
--color-surface-tint:             #AFC7FF;  /* P-80 */
```

---

## Typography

Material 3 uses a structured type scale. The font stack uses Google Fonts loaded from `_includes/head.html`.

### Font Families

```css
/* Three roles, one source per role — no mixing */
--font-brand:    'Google Sans', 'Product Sans', sans-serif;   /* Display, Headlines */
--font-plain:    'Roboto', system-ui, sans-serif;             /* Body, Title, Label */
--font-code:     'JetBrains Mono', 'Fira Code', monospace;   /* Code blocks, math labels */
```

Google Fonts import (in `_includes/head.html`):
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
```

> **Note**: "Google Sans" is not available on Google Fonts (it's Google's proprietary font). Use `'Roboto Flex'` or simply `'Roboto'` for the brand role, or substitute with `'Nunito'` for a friendlier feel while staying sans-serif.

### Type Scale

All sizes in rem (16px base). Letter-spacing in em.

| Role | Size | Line Height | Weight | Tracking | Font |
|------|------|-------------|--------|---------|------|
| `--typescale-display-large` | 3.5625rem (57px) | 4rem | 400 | -0.016em | brand |
| `--typescale-display-medium` | 2.8125rem (45px) | 3.25rem | 400 | 0 | brand |
| `--typescale-display-small` | 2.25rem (36px) | 2.75rem | 400 | 0 | brand |
| `--typescale-headline-large` | 2rem (32px) | 2.5rem | 400 | 0 | brand |
| `--typescale-headline-medium` | 1.75rem (28px) | 2.25rem | 400 | 0 | brand |
| `--typescale-headline-small` | 1.5rem (24px) | 2rem | 400 | 0 | brand |
| `--typescale-title-large` | 1.375rem (22px) | 1.75rem | 400 | 0 | brand |
| `--typescale-title-medium` | 1rem (16px) | 1.5rem | 500 | +0.009em | plain |
| `--typescale-title-small` | 0.875rem (14px) | 1.25rem | 500 | +0.006em | plain |
| `--typescale-body-large` | 1rem (16px) | 1.75rem | 400 | +0.031em | plain |
| `--typescale-body-medium` | 0.875rem (14px) | 1.5rem | 400 | +0.016em | plain |
| `--typescale-body-small` | 0.75rem (12px) | 1.25rem | 400 | +0.025em | plain |
| `--typescale-label-large` | 0.875rem (14px) | 1.25rem | 500 | +0.006em | plain |
| `--typescale-label-medium` | 0.75rem (12px) | 1rem | 500 | +0.031em | plain |
| `--typescale-label-small` | 0.6875rem (11px) | 1rem | 500 | +0.031em | plain |

**Blog content reading line-height override**: Body text inside `.post__body` uses `1.8` line-height (overrides typescale default) for comfortable long-form reading.

---

## Elevation

Material 3 elevation uses **both shadow and primary-color tinting** on surfaces. The tint makes surfaces visually distinct while preserving color harmony.

### Elevation Levels

| Level | Shadow | Surface Tint Opacity | Usage |
|-------|--------|----------------------|-------|
| 0 | none | 0% | Default surface, page background |
| 1 | `0 1px 2px rgba(0,0,0,.30), 0 1px 3px 1px rgba(0,0,0,.15)` | 5% | Cards, navigation rail |
| 2 | `0 1px 2px rgba(0,0,0,.30), 0 2px 6px 2px rgba(0,0,0,.15)` | 8% | Top app bar (scrolled), filled card |
| 3 | `0 4px 8px 3px rgba(0,0,0,.15), 0 1px 3px rgba(0,0,0,.30)` | 11% | FAB, navigation bar |
| 4 | `0 6px 10px 4px rgba(0,0,0,.15), 0 2px 3px rgba(0,0,0,.30)` | 12% | Navigation drawer |
| 5 | `0 8px 12px 6px rgba(0,0,0,.15), 0 4px 4px rgba(0,0,0,.30)` | 14% | Dialogs, modals |

```css
--md-elevation-0: none;
--md-elevation-1: 0 1px 2px rgba(0,0,0,.30), 0 1px 3px 1px rgba(0,0,0,.15);
--md-elevation-2: 0 1px 2px rgba(0,0,0,.30), 0 2px 6px 2px rgba(0,0,0,.15);
--md-elevation-3: 0 4px 8px 3px rgba(0,0,0,.15), 0 1px 3px rgba(0,0,0,.30);
--md-elevation-4: 0 6px 10px 4px rgba(0,0,0,.15), 0 2px 3px rgba(0,0,0,.30);
--md-elevation-5: 0 8px 12px 6px rgba(0,0,0,.15), 0 4px 4px rgba(0,0,0,.30);
```

Surface tint applied via CSS `background` using `color-mix()`:
```css
/* Level 1 example */
.card {
  background: color-mix(in srgb, var(--color-surface-tint) 5%, var(--color-surface));
  box-shadow: var(--md-elevation-1);
}
```

---

## Shape (Corner Rounding)

| Token | Value | Used On |
|-------|-------|---------|
| `--shape-none` | 0 | Dividers, images |
| `--shape-extra-small` | 4px | Tooltips, menus, text fields, chips |
| `--shape-small` | 8px | Snackbars, small cards |
| `--shape-medium` | 12px | Cards, content containers |
| `--shape-large` | 16px | Sheets, large containers |
| `--shape-extra-large` | 28px | Dialogs, FABs, large FABs |
| `--shape-full` | 9999px | Pill buttons, badges, avatars |

---

## Motion

Material 3 uses standardized easing and duration tokens.

```css
/* Duration */
--motion-duration-short1:  50ms;
--motion-duration-short2:  100ms;
--motion-duration-short3:  150ms;
--motion-duration-short4:  200ms;
--motion-duration-medium1: 250ms;
--motion-duration-medium2: 300ms;
--motion-duration-medium3: 350ms;
--motion-duration-medium4: 400ms;
--motion-duration-long1:   450ms;
--motion-duration-long2:   500ms;

/* Easing */
--motion-easing-standard:          cubic-bezier(0.2, 0, 0, 1.0);
--motion-easing-standard-decel:    cubic-bezier(0, 0, 0, 1);
--motion-easing-standard-accel:    cubic-bezier(0.3, 0, 1, 1);
--motion-easing-emphasized:        cubic-bezier(0.2, 0, 0, 1.0);
--motion-easing-emphasized-decel:  cubic-bezier(0.05, 0.7, 0.1, 1.0);
--motion-easing-emphasized-accel:  cubic-bezier(0.3, 0, 0.8, 0.15);
--motion-easing-legacy:            cubic-bezier(0.4, 0, 0.2, 1);
```

Reduced motion:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Spacing Scale

```css
--space-1:   4px;
--space-2:   8px;
--space-3:   12px;
--space-4:   16px;
--space-5:   20px;
--space-6:   24px;
--space-7:   28px;
--space-8:   32px;
--space-10:  40px;
--space-12:  48px;
--space-14:  56px;
--space-16:  64px;
--space-20:  80px;
--space-24:  96px;
```

Material 3 uses a 4px base grid — all spacing values are multiples of 4.

---

## Breakpoints

```css
--bp-compact:  0px;       /* phones (<600px) */
--bp-medium:   600px;     /* tablets */
--bp-expanded: 840px;     /* desktops and large tablets */
--bp-large:    1200px;    /* wide desktop */
--bp-xlarge:   1600px;    /* ultra-wide */
```

MD3 layout adapts at Compact / Medium / Expanded — these are the three canonical window size classes.

---

## Component Specifications

### Top App Bar

```
Height: 64px (expanded state), 56px (scrolled/compact)
Background: --color-surface  (elevation-0)
Scrolled: --color-surface-container (elevation-2 tint + shadow)
Logo/Title: --typescale-title-large, --color-on-surface
Nav links: --typescale-label-large, --color-on-surface-variant
Active link: --color-primary, underline indicator
Padding: 0 --space-4 (compact), 0 --space-6 (expanded)
```

### Navigation (Mobile Drawer)

```
Width: 360px (or full screen on compact)
Background: --color-surface-container
Active item: --color-secondary-container background, --color-on-secondary-container text
Item shape: --shape-full (pill)
Elevation: 1 (behind scrim)
Scrim: --color-scrim at 32% opacity
```

### Breadcrumb

```
Font: --typescale-label-large
Link color: --color-primary
Link hover bg: color-mix(primary 8%, transparent)
Link border-radius: --shape-extra-small
Separator: chevron_right icon, --color-on-surface-variant, 1.25rem
Current page: --color-on-surface-variant, not linked
Container padding: --space-4 vertical, 0 horizontal
```

Breadcrumb HTML structure (in `_includes/breadcrumbs.html`):
```html
<nav class="breadcrumb" aria-label="Breadcrumb">
  <ol class="breadcrumb__list">
    <li class="breadcrumb__item">
      <a class="breadcrumb__link" href="/">Home</a>
    </li>
    <li class="breadcrumb__separator" aria-hidden="true">›</li>
    <li class="breadcrumb__item">
      <a class="breadcrumb__link" href="/blog/">Blog</a>
    </li>
    <li class="breadcrumb__separator" aria-hidden="true">›</li>
    <li class="breadcrumb__item breadcrumb__item--current" aria-current="page">
      {{ page.title }}
    </li>
  </ol>
</nav>
```

### Cards

Three variants following MD3:

| Variant | Background | Border | Elevation | Usage |
|---------|-----------|--------|-----------|-------|
| Elevated | `--color-surface-container-low` | none | 1 | Post cards, default |
| Filled | `--color-surface-container-highest` | none | 0 | Course cards, callouts |
| Outlined | `--color-surface` | 1px `--color-outline-variant` | 0 | Info boxes, secondary content |

All cards: `border-radius: --shape-medium (12px)`, padding: `--space-4`.
Hover state: elevation increases by 1 level, transition `--motion-duration-short4`.

### Buttons

| Variant | Background | Text color | Shape | Usage |
|---------|-----------|-----------|-------|-------|
| Filled | `--color-primary` | `--color-on-primary` | `--shape-full` | Primary CTA (Buy, Sign up) |
| Filled Tonal | `--color-secondary-container` | `--color-on-secondary-container` | `--shape-full` | Secondary CTAs |
| Outlined | transparent + `--color-outline` border | `--color-primary` | `--shape-full` | Medium emphasis |
| Text | transparent | `--color-primary` | `--shape-full` | Low emphasis, inline |
| Elevated | `--color-surface-container-low` (elev-1) | `--color-primary` | `--shape-full` | Separated from surface |

Height: 40px (standard), 56px (large). Min-width: 48px. Padding: 0 24px.
State layers: `+8%` primary on hover, `+12%` on pressed.

### Chips (Tags)

```
Background: --color-surface-container-low
Border: 1px --color-outline
Text: --color-on-surface-variant, --typescale-label-large
Border-radius: --shape-small (8px)
Height: 32px
Padding: 0 12px
```

### Post Card

```
Layout: vertical stack
Image: aspect-ratio 16/9, border-radius top corners only
Category chip: above title
Title: --typescale-title-large, --color-on-surface
Meta (date, reading time): --typescale-label-medium, --color-on-surface-variant
Excerpt: --typescale-body-medium, --color-on-surface-variant, 3 lines max
```

### Course Card

```
Layout: vertical stack
Thumbnail: aspect-ratio 16/9
Status badge: top-right corner chip (Available / Coming Soon)
Title: --typescale-title-large
Tagline: --typescale-body-medium
Price: --typescale-headline-small, --color-primary
CTA button: Filled Tonal
```

### Search Bar

```
Shape: --shape-full (pill)
Background: --color-surface-container-high
Height: 48px (standard) / 56px (hero)
Leading icon: search, --color-on-surface-variant
Placeholder: --color-on-surface-variant
Focused: --color-primary outline 2px
```

### Code Blocks

```
Background: --color-surface-container-highest
Border-radius: --shape-small (8px)
Font: --font-code, --typescale-body-medium
Padding: --space-4
Overflow: auto (horizontal scroll)
Line numbers: --color-on-surface-variant, opacity 60%
Copy button: appears on hover, Text variant button
```

### Math Blocks (KaTeX)

```
Display math container:
  Overflow-x: auto
  Padding: --space-4 0
  Border-left: 3px solid --color-primary-container  (display block only)
  
Inline math: no container styling, flows with text
```

### Table of Contents

```
Position: sticky top (desktop sidebar)
Background: --color-surface-container
Border-radius: --shape-medium
Padding: --space-4
Font: --typescale-body-medium
Active item: --color-primary, font-weight 500
Track: 2px --color-outline-variant on left
Active marker: 2px --color-primary on left
```

### Pagination

```
Previous/Next: Outlined button variant
Page numbers: Text button variant
Current page: Filled button variant (--color-primary)
Gap: --space-2 between items
```

### Newsletter Form

```
Layout: horizontal (label + input + button) on ≥600px, stacked on <600px
Input: Outlined text field style (MD3)
  - Border: 1px --color-outline
  - Focused border: 2px --color-primary
  - Background: --color-surface
  - Shape: --shape-extra-small (4px corners)
Button: Filled variant, same height as input (56px)
Container: --color-primary-container background, --shape-medium, --space-6 padding
```

### Comment Section (Remark42 wrapper)

```
Container: separated from post by --space-12 top margin + --color-outline-variant divider
Title "Comments": --typescale-headline-small
Background: inherits surface
```

---

## Icons

Material Symbols (variable font — single file, adjustable weight/fill/grade):
```html
<link rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
```

Usage:
```html
<span class="material-symbols-outlined">search</span>
<span class="material-symbols-outlined">chevron_right</span>
<span class="material-symbols-outlined">arrow_back</span>
```

Standard icon sizes: 20dp (label contexts), 24dp (default), 40dp (large), 48dp (hero).

---

## State Layers (Interactivity)

MD3 uses color-tinted overlays for interactive states — never just darkening:

| State | Overlay | Opacity |
|-------|---------|---------|
| Hover | container's content color | 8% |
| Pressed | container's content color | 12% |
| Focused | container's content color | 12% |
| Dragged | container's content color | 16% |
| Disabled text | --color-on-surface | 38% |
| Disabled container | --color-on-surface | 12% |

```css
/* Example — button hover state layer */
.btn--filled::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: var(--color-on-primary);
  opacity: 0;
  transition: opacity var(--motion-duration-short2) var(--motion-easing-standard);
}
.btn--filled:hover::after  { opacity: 0.08; }
.btn--filled:active::after { opacity: 0.12; }
```

---

## Focus Indicators

All interactive elements must have a visible focus ring for keyboard navigation:

```css
:focus-visible {
  outline: 3px solid var(--color-primary);
  outline-offset: 2px;
  border-radius: inherit;
}
```

Remove default outline only via `:focus-visible` (not `:focus`) — keyboard users always see the indicator.
