import { test, expect } from '@playwright/test'
import path from 'path'
import { createRequire } from 'module'
import fs from 'fs'
import { startMockServer } from './server'

test('axe-core reports no critical violations', async ({ page }) => {
  const srv = await startMockServer()
  const code = fs.readFileSync(path.resolve('dist/ttt-ui-enhancer.iife.js'), 'utf8')
  await page.addInitScript({ content: code })
  await page.goto(srv.url)
  await page.waitForLoadState('domcontentloaded')
  // inject axe-core from local dependency
  const require = createRequire(import.meta.url)
  const axePath = require.resolve('axe-core/axe.min.js')
  const axeCode = fs.readFileSync(axePath, 'utf8')
  await page.evaluate((c) => { const s = document.createElement('script'); s.textContent = c; document.documentElement.appendChild(s); }, axeCode)
  const result = await page.evaluate(async () => {
    // @ts-ignore
    const root = document.querySelector('#ttt-ui-enhancer-root') || document.body
    // @ts-ignore
    return await (window as any).axe.run(root)
  })
  const critical = (result.violations || []).filter((v: any) => v.impact === 'critical')
  expect(critical.length).toBe(0)
})
