import { test, expect } from '@playwright/test';

// Two client-side features that are easy to regress silently (no build error,
// just broken JS): the dark/light theme toggle and the courses segmented filter.

test.describe('theme toggle', () => {
  test('switches data-theme and persists it across reload', async ({ page }) => {
    await page.goto('/');
    const html = page.locator('html');

    const initial = await html.getAttribute('data-theme');
    expect(['light', 'dark']).toContain(initial);

    await page.locator('#theme-toggle').click();
    const toggled = await html.getAttribute('data-theme');
    expect(toggled).not.toBe(initial);

    await page.reload();
    await expect(html).toHaveAttribute('data-theme', toggled!);
  });
});

test.describe('courses segmented filter', () => {
  test('filtering to "Available" hides Coming Soon cards, and back to "All" restores them', async ({
    page,
  }) => {
    await page.goto('/courses/');

    const grid = page.locator('[data-course-grid]');
    const availableCards = grid.locator('.course-card[data-status="available"]');
    const comingCards = grid.locator('.course-card[data-status="coming-soon"]');

    await expect(availableCards.first()).toBeVisible();
    await expect(comingCards.first()).toBeVisible();

    await page.locator('.course-seg__btn[data-filter="available"]').click();
    await expect(page.locator('.course-seg__btn[data-filter="available"]')).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    await expect(comingCards.first()).toBeHidden();
    await expect(availableCards.first()).toBeVisible();
    await expect(page).toHaveURL(/[?&]show=available/);

    await page.locator('.course-seg__btn[data-filter="all"]').click();
    await expect(comingCards.first()).toBeVisible();
    await expect(availableCards.first()).toBeVisible();
  });
});
