import { test, expect } from '@playwright/test';

// Covers the two things a "hero/layout redesign" branch is most likely to
// quietly break: the primary nav links, and the mobile overlay menu.

test('primary nav links go to the right pages', async ({ page }) => {
  await page.goto('/');

  const nav = page.locator('#primary-nav');
  await expect(nav.locator('.site-nav__link', { hasText: 'Blog' })).toHaveAttribute('href', '/blog/');
  await expect(nav.locator('.site-nav__link', { hasText: 'Courses' })).toHaveAttribute('href', '/courses/');
  await expect(nav.locator('.site-nav__link', { hasText: 'Contact' })).toHaveAttribute('href', '/contact/');

  await page.locator('.site-header__logo').click();
  await expect(page).toHaveURL('/');
});

test('footer renders its four link columns', async ({ page }) => {
  await page.goto('/');
  const footer = page.locator('.site-footer');
  await expect(footer).toBeVisible();
  await expect(footer.locator('.site-footer__col')).toHaveCount(4);
});

test('subpages render a breadcrumb back to Home', async ({ page }) => {
  await page.goto('/blog/');
  const crumb = page.locator('.breadcrumb');
  await expect(crumb).toBeVisible();
  await expect(crumb.locator('.breadcrumb__link').first()).toHaveAttribute('href', '/');
});

test('mobile menu opens and closes via the hamburger and close buttons', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'hamburger menu only renders at <=768px');

  await page.goto('/');
  const nav = page.locator('#primary-nav');
  await expect(nav).not.toHaveClass(/site-nav--open/);

  await page.locator('#nav-toggle').click();
  await expect(nav).toHaveClass(/site-nav--open/);

  await page.locator('#nav-close').click();
  await expect(nav).not.toHaveClass(/site-nav--open/);
});

test('mobile menu closes on Escape', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'hamburger menu only renders at <=768px');

  await page.goto('/');
  const nav = page.locator('#primary-nav');

  await page.locator('#nav-toggle').click();
  await expect(nav).toHaveClass(/site-nav--open/);

  await page.keyboard.press('Escape');
  await expect(nav).not.toHaveClass(/site-nav--open/);
});
