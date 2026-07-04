#!/usr/bin/env bash
# ── Elastropy local development server ───────────────────────────────────────
# Usage:
#   bash jekyll-serve.sh              — build + serve at localhost:4000
#   bash jekyll-serve.sh --comments   — also start Remark42 via Docker
#   bash jekyll-serve.sh --build-only — build + index search, no server
#   PORT=4001 bash jekyll-serve.sh    — custom port
set -euo pipefail

# ── PATH: include common Ruby gem bin locations ───────────────────────────────
for _d in \
  "$HOME/.local/share/gem/ruby/3.0.0/bin" \
  "$HOME/.local/share/gem/ruby/3.1.0/bin" \
  "$HOME/.local/share/gem/ruby/3.2.0/bin" \
  "$HOME/.rbenv/shims" \
  "$HOME/.rbenv/bin" \
  "$HOME/.rvm/bin"; do
  [ -d "$_d" ] && export PATH="$_d:$PATH"
done

PORT="${PORT:-4000}"
COMMENTS=false
BUILD_ONLY=false

for arg in "$@"; do
  case "$arg" in
    --comments)   COMMENTS=true ;;
    --build-only) BUILD_ONLY=true ;;
    --port=*)     PORT="${arg#*=}" ;;
  esac
done

# ── colour helpers ────────────────────────────────────────────────────────────
blue()  { printf '\033[34m→\033[0m %s\n' "$*"; }
green() { printf '\033[32m✓\033[0m %s\n' "$*"; }
warn()  { printf '\033[33m⚠\033[0m %s\n' "$*"; }
err()   { printf '\033[31m✗\033[0m %s\n' "$*" >&2; }

echo ""
echo "  ╔══════════════════════════════════════╗"
echo "  ║   Elastropy · Local Dev Server       ║"
echo "  ╚══════════════════════════════════════╝"
echo ""

# ── guard: must run from repo root ───────────────────────────────────────────
if [ ! -f "_config.yml" ]; then
  err "Run this script from the repository root (where _config.yml lives)."
  exit 1
fi

# ── 1. check Ruby + Bundler ───────────────────────────────────────────────────
if ! command -v ruby &>/dev/null; then
  err "Ruby not found. Follow specs/00-environment-setup.md to install rbenv + Ruby."
  exit 1
fi
if ! command -v bundle &>/dev/null; then
  err "Bundler not found. Run: gem install bundler"
  exit 1
fi
blue "Ruby $(ruby --version | awk '{print $2}') · Bundler $(bundle --version | awk '{print $3}')"

# ── 2. install gems ────────────────────────────────────────────────────────────
if [ ! -f "Gemfile.lock" ] || [ "Gemfile" -nt "Gemfile.lock" ]; then
  blue "Installing gems (first run may take a few minutes)..."
  bundle install --quiet
  green "Gems installed"
else
  green "Gems up to date"
fi

# ── 3. optional: Remark42 comments via Docker ─────────────────────────────────
if [ "$COMMENTS" = true ]; then
  if ! command -v docker &>/dev/null; then
    warn "Docker not found — comments disabled. Install Docker Desktop to enable."
  elif ! docker info &>/dev/null 2>&1; then
    warn "Docker not running — comments disabled. Start Docker Desktop first."
  else
    blue "Starting Remark42..."
    docker compose -f docker-compose.dev.yml up -d remark42
    green "Remark42 running at http://localhost:8080"
  fi
fi

# ── 4. build ──────────────────────────────────────────────────────────────────
blue "Building site..."
JEKYLL_ENV=development bundle exec jekyll build \
  --config _config.yml,_config.dev.yml \
  --quiet
green "Site built → _site/"

# ── 5. search index (Pagefind) ────────────────────────────────────────────────
if command -v npx &>/dev/null; then
  blue "Building search index..."
  if npx --yes pagefind --site _site --output-path _site/pagefind --quiet 2>/dev/null; then
    green "Search index ready"
  else
    warn "Pagefind indexing failed — search will not work this session"
  fi
else
  warn "npx not found — search disabled. Install Node.js to enable: https://nodejs.org"
fi

# ── 6. serve ──────────────────────────────────────────────────────────────────
if [ "$BUILD_ONLY" = true ]; then
  echo ""
  green "Build complete. Open: http://localhost:${PORT}"
  exit 0
fi

echo ""
echo "  ┌─────────────────────────────────────────────┐"
echo "  │  Local:   http://localhost:${PORT}              │"
echo "  │  LiveReload active — saves auto-refresh     │"
echo "  │  Press Ctrl+C to stop                       │"
echo "  └─────────────────────────────────────────────┘"
echo ""

# --force-polling is essential for WSL (inotify events are unreliable)
# --skip-initial-build reuses the _site/ we just built (with Pagefind index intact)
bundle exec jekyll serve \
  --config _config.yml,_config.dev.yml \
  --port "$PORT" \
  --livereload \
  --force-polling \
  --skip-initial-build
