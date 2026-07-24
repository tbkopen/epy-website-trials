import { Page, expect } from '@playwright/test';

/**
 * Navigates to `path` and asserts the page came back healthy: a 2xx/3xx
 * response, no thrown JS errors, and no failed requests to the site itself
 * (third-party calls — Google Fonts, YouTube, etc. — are ignored; they're not
 * this codebase's responsibility and their availability is environment noise).
 */
export async function expectCleanPageLoad(page: Page, path: string, baseURL: string) {
  const consoleErrors: string[] = [];
  const failedRequests: string[] = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => consoleErrors.push(err.message));
  page.on('requestfailed', (request) => {
    if (request.url().startsWith(baseURL)) {
      failedRequests.push(`${request.url()} — ${request.failure()?.errorText}`);
    }
  });

  const response = await page.goto(path);
  expect(response, `no response for ${path}`).not.toBeNull();
  expect(response!.ok(), `${path} responded with ${response!.status()}`).toBeTruthy();
  await page.waitForLoadState('networkidle');

  expect(consoleErrors, `console errors on ${path}:\n${consoleErrors.join('\n')}`).toEqual([]);
  expect(
    failedRequests,
    `failed same-origin requests on ${path}:\n${failedRequests.join('\n')}`
  ).toEqual([]);

  return response!;
}
