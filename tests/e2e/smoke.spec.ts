import { test, expect } from '@playwright/test';
import { expectCleanPageLoad } from './helpers';

// Baseline "did the redesign break something" check: every core page must
// still return successfully, with no JS errors and no broken same-origin
// requests. Intentionally shallow — this is a tripwire, not a full audit.

const STATIC_PAGES = [
  { path: '/', name: 'Home' },
  { path: '/blog/', name: 'Blog index' },
  { path: '/courses/', name: 'Courses index' },
  { path: '/contact/', name: 'Contact' },
];

for (const { path, name } of STATIC_PAGES) {
  test(`${name} loads cleanly`, async ({ page, baseURL }) => {
    await expectCleanPageLoad(page, path, baseURL!);
  });
}

test('a blog post loads cleanly and shows a breadcrumb', async ({ page, baseURL }) => {
  await page.goto('/blog/');
  const firstPost = page.locator('.post-card__title-link').first();
  await expect(firstPost).toBeVisible();
  const href = await firstPost.getAttribute('href');
  expect(href).toBeTruthy();

  await expectCleanPageLoad(page, href!, baseURL!);
  await expect(page.locator('.breadcrumb')).toBeVisible();
});

test('the archived course page loads cleanly (exercises a non-default card state)', async ({
  page,
  baseURL,
}) => {
  // Most course cards link out to an external purchase platform (course-link),
  // so this hits the internal /courses/:name/ page directly rather than via a
  // card click — the archived course is the one guaranteed to stay on-site.
  await expectCleanPageLoad(page, '/courses/numerical-computing/', baseURL!);
  await expect(page.locator('.course-header__title')).toHaveText('Numerical Computing with Python');
  await expect(page.locator('.chip--status')).toHaveText(/Archived/i);
});

test('an unknown URL renders the custom 404 page', async ({ page }) => {
  const response = await page.goto('/this-page-does-not-exist/');
  expect(response?.status()).toBe(404);
  await expect(page.locator('.error-page__title')).toHaveText('Page not found');
  await expect(page.locator('.error-page__actions a[href="/"]')).toBeVisible();
});

test('the announcement bar renders when enabled', async ({ page }) => {
  await page.goto('/');
  // Presence only — the exact copy is editorial content, not something a
  // template/theme change should be judged against.
  await expect(page.locator('.alert-bar')).toBeVisible();
});
