import { test, expect } from '@playwright/test'
import path from 'path'

test('axe-core reports no critical violations', async ({ page }) => {
  const mock = path.resolve('tests/e2e/mock-app/index.html')
  await page.goto('file://' + mock)
  await page.addScriptTag({ path: path.resolve('dist/ttt-ui-enhancer.iife.js') })
  // inject axe-core
  // @ts-ignore
  const axePath = require.resolve('axe-core/axe.min.js')
  await page.addScriptTag({ path: axePath })
  const result = await page.evaluate(async () => {
    // @ts-ignore
    return await (window as any).axe.run(document)
  })
  const critical = (result.violations || []).filter((v: any) => v.impact === 'critical')
  expect(critical.length).toBe(0)
})

