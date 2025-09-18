import { test, expect } from '@playwright/test';
import { injectAxe } from '@axe-core/playwright';
import fs from 'node:fs';
import path from 'node:path';

test('axe audit home', async ({ page }) => {
  const base = process.env.PUBLIC_WEB_URL || 'http://localhost:5173';
  const outDir = process.env.REPORT_DIR || 'reports';
  fs.mkdirSync(outDir, { recursive: true });
  await page.goto(base);
  await injectAxe(page);
  // run axe and collect violations
  const results = await page.evaluate(async () => {
    // @ts-ignore
    const r = await window.axe.run();
    return r;
  });
  fs.writeFileSync(path.join(outDir, 'axe-results.json'), JSON.stringify(results, null, 2));
  const threshold = Number(process.env.THRESHOLD_VIOLATIONS || '0');
  expect(results.violations.length, JSON.stringify(results.violations, null, 2)).toBeLessThanOrEqual(threshold);
});

