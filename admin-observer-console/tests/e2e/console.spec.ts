import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from '@axe-core/playwright';

test('renders tables and filters', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Admin Observer Console' })).toBeVisible();
  await page.getByPlaceholder('Search…').fill('Alice');
  await injectAxe(page);
  await checkA11y(page);
});

