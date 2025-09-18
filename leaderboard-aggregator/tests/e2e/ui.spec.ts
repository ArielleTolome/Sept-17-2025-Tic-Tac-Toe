import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from '@axe-core/playwright';

test('renders leaderboard and allows CSV', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Leaderboard (ELO)' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Export CSV' })).toBeVisible();
  await injectAxe(page);
  await checkA11y(page);
});

