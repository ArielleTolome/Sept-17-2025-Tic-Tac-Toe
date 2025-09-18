import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from '@axe-core/playwright';

test('two clients get matched', async ({ browser }) => {
  const c1 = await browser.newContext();
  const c2 = await browser.newContext();
  const p1 = await c1.newPage();
  const p2 = await c2.newPage();
  await p1.goto('/');
  await p2.goto('/');
  await p1.getByRole('button', { name: 'Find Match' }).click();
  await p2.getByRole('button', { name: 'Find Match' }).click();
  await expect(p1.getByText('Matched!')).toBeVisible();
  await expect(p2.getByText('Matched!')).toBeVisible();

  await injectAxe(p1); await checkA11y(p1);
  await injectAxe(p2); await checkA11y(p2);
});

