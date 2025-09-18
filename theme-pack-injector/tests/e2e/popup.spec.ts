import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from '@axe-core/playwright';

test('popup renders and buttons exist', async ({ page }) => {
  await page.goto('/popup.html');
  await expect(page.getByRole('heading', { name: 'TTT Theme Pack' })).toBeVisible();
  await expect(page.getByRole('button', { name: /High Contrast/i })).toBeVisible();
  await injectAxe(page);
  await checkA11y(page);
});

