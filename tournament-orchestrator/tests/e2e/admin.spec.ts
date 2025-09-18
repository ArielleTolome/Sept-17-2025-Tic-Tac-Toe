import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from '@axe-core/playwright';

test('create tournament and view bracket', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'New Tournament' }).click();
  await page.getByRole('textbox', { name: 'Name' }).fill('E2E Cup');
  await page.getByRole('combobox', { name: 'Type' }).selectOption('single-elim');
  await page.getByRole('button', { name: 'Create' }).click();
  await expect(page.getByRole('heading', { name: 'E2E Cup' })).toBeVisible();

  await injectAxe(page);
  await checkA11y(page);
});

