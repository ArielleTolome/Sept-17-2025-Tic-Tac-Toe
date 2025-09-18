import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from '@axe-core/playwright';

test('demo replay deep link loads and plays', async ({ page }) => {
  await page.goto('/#/replay/DEMO?autoPlay=1');
  await expect(page.getByRole('heading', { name: 'Replay' })).toBeVisible();
  // Board present
  await expect(page.getByRole('grid', { name: 'Replay board' })).toBeVisible();
  // Wait a bit for autoplay to advance
  await page.waitForTimeout(1500);
  // Slider should be > 0
  const slider = page.locator('input[type="range"]');
  const value = await slider.evaluate((el) => (el as HTMLInputElement).valueAsNumber);
  expect(value).toBeGreaterThan(0);

  await injectAxe(page);
  await checkA11y(page, undefined, {
    detailedReport: true,
    detailedReportOptions: { html: true }
  });
});

