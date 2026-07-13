---
# ─────────────────────────────────────────────────────────────────────────────
# Site-wide alert / announcement bar (rendered above the header on every page).
#
# Edit the values below to change the banner. Set `enabled: false` to hide it.
# This file holds configuration only — it is not a visible page (layout: null,
# nothing links to it). The banner markup lives in _includes/notification.html
# and its styling in _sass/4-components/_alert-bar.scss.
# ─────────────────────────────────────────────────────────────────────────────
ref: notification          # stable id the include matches on — do not change
layout: null               # config-only file; don't render it as a page
sitemap: false

enabled: true              # master on/off switch for the banner
text: "Please Subscribe 🔔 🔔 🔔"          # alert bar notification text
button_text: "Elastropy YouTube Channel"  # button label (omit to hide button)
button_url: "https://www.youtube.com/@elastropy?sub_confirmation=1"  # button link
---
