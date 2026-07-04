# 00 — Environment Setup (WSL Reproducibility Guide)

This document takes anyone from a fresh Windows machine with WSL2 installed to a fully working local development environment. Follow every step in order.

**Assumed starting point**: Windows 10/11 with WSL2 already installed. If WSL2 is not installed, run `wsl --install` in PowerShell (as Administrator) and restart first.

---

## 1. Update WSL System Packages

Open your WSL terminal (Ubuntu) and run:

```bash
sudo apt update && sudo apt upgrade -y
```

---

## 2. Install System Build Dependencies

Ruby extensions and native gems require C build tools:

```bash
sudo apt install -y \
  build-essential \
  curl \
  git \
  libssl-dev \
  libreadline-dev \
  zlib1g-dev \
  libyaml-dev \
  libffi-dev \
  libgdbm-dev \
  libncurses5-dev \
  libxml2-dev \
  libxslt1-dev
```

These are one-time system dependencies — install them before installing Ruby.

---

## 3. Install rbenv (Ruby Version Manager)

rbenv lets you install and switch between Ruby versions without affecting system Ruby.

```bash
# Install rbenv
curl -fsSL https://github.com/rbenv/rbenv-installer/raw/HEAD/bin/rbenv-installer | bash

# Add rbenv to your shell (for bash)
echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bashrc
echo 'eval "$(rbenv init - bash)"' >> ~/.bashrc
source ~/.bashrc

# Verify installation
rbenv --version
```

If you use **zsh** instead of bash, replace `~/.bashrc` with `~/.zshrc` in the commands above.

---

## 4. Install Ruby

The project uses Ruby 3.2. The exact version is pinned in `.ruby-version` at the repo root.

```bash
# Install ruby-build plugin (gives rbenv the "install" command)
mkdir -p "$(rbenv root)"/plugins
git clone https://github.com/rbenv/ruby-build.git "$(rbenv root)"/plugins/ruby-build

# Install Ruby 3.2 (this takes 5–10 minutes)
rbenv install 3.2.4

# Set it as the global default
rbenv global 3.2.4

# Verify
ruby --version    # should show ruby 3.2.4
```

---

## 5. Install Bundler

Bundler manages the project's gem dependencies (listed in `Gemfile`):

```bash
gem install bundler

# Verify
bundler --version
```

Bundler is the only gem you install globally. All project gems install locally via `bundle install`.

---

## 6. Clone the Repository

```bash
# Navigate to your preferred working directory
cd ~   # or wherever you keep projects

# Clone the repo
git clone https://github.com/[YOUR_USERNAME]/elastropy.git
cd elastropy
```

Replace `[YOUR_USERNAME]` with your GitHub username. Repository name will be `elastropy`.

---

## 7. Install Project Gems

```bash
# From inside the repo directory:
bundle install
```

This reads `Gemfile` and installs all required gems (Jekyll, plugins, KaTeX, etc.) into the project's local bundle. This takes 1–3 minutes on first run.

If you see a `Could not find gem` error, check that you ran `bundle install` from inside the repo directory.

---

## 8. Verify Jekyll Works

```bash
bundle exec jekyll --version   # should show jekyll 4.3.x
```

---

## 9. Run the Development Server

```bash
bundle exec jekyll serve --livereload --drafts
```

Open `http://localhost:4000` in your browser. The site rebuilds automatically when you save files.

To run with dev overrides (disables analytics, comment widget, etc.):
```bash
bundle exec jekyll serve --config _config.yml,_config.dev.yml --livereload --drafts
```

**Note on WSL + browser**: The dev server binds to `localhost:4000` inside WSL. Open that URL in your Windows browser — WSL2 automatically bridges the network.

---

## 10. Install Docker (for Remark42)

Remark42 (the comment server) runs in Docker. You need Docker only if you're setting up comments locally or deploying the Remark42 VPS.

### Option A: Docker Desktop for Windows (Recommended for WSL)
1. Download Docker Desktop from `https://www.docker.com/products/docker-desktop/`
2. Install it on Windows
3. In Docker Desktop settings → Resources → WSL Integration → enable your WSL distro
4. Verify in WSL: `docker --version`

### Option B: Docker Engine directly in WSL (no Docker Desktop)
```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
# Log out and back in, then verify:
docker --version
docker compose version
```

---

## 11. Git Configuration (first time only)

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
git config --global core.autocrlf false   # important for WSL — prevent CRLF issues
```

---

## 12. Recommended VS Code Setup

Install VS Code on Windows (not in WSL). Then install the **Remote - WSL** extension so VS Code opens files from WSL natively.

In WSL, open the project:
```bash
code .
```

**Recommended VS Code extensions for this project:**

| Extension | ID | Purpose |
|-----------|-----|---------|
| Remote - WSL | `ms-vscode-remote.remote-wsl` | Edit WSL files from Windows VS Code |
| Jekyll Run | `Dedsec727.jekyll-run` | Run Jekyll from VS Code |
| YAML | `redhat.vscode-yaml` | Frontmatter validation |
| Markdown All in One | `yzhang.markdown-all-in-one` | Markdown editing |
| LaTeX Workshop | `james-yu.latex-workshop` | Math preview in editor |
| Prettier | `esbenp.prettier-vscode` | Format HTML/CSS/JS |
| GitLens | `eamodio.gitlens` | Enhanced git history |

---

## 13. Environment Variables (Local Dev)

Create a `.env` file in the repo root (never committed to Git — it's in `.gitignore`):

```bash
# .env — local development secrets
# These are only needed locally if testing Remark42 integration

REMARK42_SECRET=any-local-dev-secret
REMARK42_GITHUB_CID=your-github-oauth-client-id
REMARK42_GITHUB_CSEC=your-github-oauth-client-secret
```

For the static Jekyll site itself, no secrets are needed locally — the `_config.dev.yml` disables the comment widget in development.

---

## Full Setup Summary (Quick Reference)

```bash
# 1. System deps
sudo apt update && sudo apt upgrade -y
sudo apt install -y build-essential curl git libssl-dev libreadline-dev zlib1g-dev libyaml-dev libffi-dev

# 2. rbenv + Ruby
curl -fsSL https://github.com/rbenv/rbenv-installer/raw/HEAD/bin/rbenv-installer | bash
echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bashrc
echo 'eval "$(rbenv init - bash)"' >> ~/.bashrc
source ~/.bashrc
mkdir -p "$(rbenv root)"/plugins
git clone https://github.com/rbenv/ruby-build.git "$(rbenv root)"/plugins/ruby-build
rbenv install 3.2.4
rbenv global 3.2.4
gem install bundler

# 3. Project
git clone https://github.com/[YOUR_USERNAME]/elastropy.git && cd elastropy
bundle install
bundle exec jekyll serve --livereload --drafts
```

---

## Troubleshooting

### `bundle install` fails with "mkmf" or native extension error
```bash
sudo apt install -y build-essential ruby-dev
bundle install
```

### Jekyll serve fails: `Address already in use`
Another process is using port 4000:
```bash
bundle exec jekyll serve --port 4001
```

### Files saved in VS Code don't trigger LiveReload
WSL file system events sometimes don't propagate to `inotify`. Add to `_config.dev.yml`:
```yaml
livereload: true
```
And restart the server with `--force-polling`:
```bash
bundle exec jekyll serve --livereload --force-polling
```

### `rbenv: command not found` after install
```bash
source ~/.bashrc   # reload shell config
```
Or close and reopen the terminal.

### Ruby version mismatch
The `.ruby-version` file pins the version. rbenv reads it automatically when you `cd` into the repo:
```bash
cat .ruby-version   # should show 3.2.4
ruby --version      # should match
```
If they don't match: `rbenv install $(cat .ruby-version)`

### Docker: "Got permission denied" in WSL
```bash
sudo usermod -aG docker $USER
# Then close and reopen WSL terminal
```

---

## Project File Reference

| File | Purpose |
|------|---------|
| `Gemfile` | Ruby gem dependencies |
| `Gemfile.lock` | Locked gem versions (commit this for reproducibility) |
| `.ruby-version` | Pins the Ruby version for rbenv |
| `_config.yml` | Main Jekyll configuration |
| `_config.dev.yml` | Local dev overrides (not deployed) |
| `.gitignore` | Files excluded from Git |
| `.env` | Local secrets (NOT in Git) |
