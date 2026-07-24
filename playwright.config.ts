import { defineConfig, devices } from '@playwright/test';

const PORT = process.env.PORT || 4000;
const BASE_URL = `http://localhost:${PORT}`;

// Runs against the documented local-dev workflow (see jekyll-serve.sh / CLAUDE.md
// "Quick Commands"): build, then generate the Pagefind search index, then serve
// with --skip-initial-build so the index survives. `jekyll serve` alone never runs
// Pagefind, so every page's <link> to pagefind-ui.css 404s (and fails the "no
// console errors" check) without this. The dev config turns off comments/analytics
// so tests aren't tripped up by third-party calls that have nothing to do with
// this codebase.
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: [
      'bundle exec jekyll build --config _config.yml,_config.dev.yml',
      'npx --yes pagefind --site _site --output-path _site/pagefind',
      `bundle exec jekyll serve --config _config.yml,_config.dev.yml --port ${PORT} --skip-initial-build`,
    ].join(' && '),
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
