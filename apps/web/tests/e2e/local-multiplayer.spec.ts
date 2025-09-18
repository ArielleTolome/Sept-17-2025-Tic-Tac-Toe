import { test, expect } from '@playwright/test';

test('local multiplayer records a win for X', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /Start game/i }).nth(1).click();
  const cells = page.getByRole('gridcell');
  await cells.nth(0).click();
  await cells.nth(3).click();
  await cells.nth(1).click();
  await cells.nth(4).click();
  await cells.nth(2).click();
  await expect(page.getByText(/wins/i)).toBeVisible();
});
