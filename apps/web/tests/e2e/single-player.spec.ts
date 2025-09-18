import { test, expect } from '@playwright/test';

const startSinglePlayer = async (page) => {
  await page.goto('/');
  await page.getByRole('button', { name: /Start game/i }).first().click();
  await expect(page.getByRole('grid', { name: /Tic-Tac-Toe board/i })).toBeVisible();
};

test('single-player board accepts moves', async ({ page }) => {
  await startSinglePlayer(page);
  const firstCell = page.getByRole('gridcell').first();
  await firstCell.click();
  await expect(firstCell).toHaveText('X');
});
