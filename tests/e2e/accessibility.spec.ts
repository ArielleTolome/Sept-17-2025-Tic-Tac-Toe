import { test, expect } from '@playwright/test'
import path from 'path'
import { createRequire } from 'module'
import fs from 'fs'
import { startMockServer } from './server'

test('axe-core reports no critical violations', async ({ page }) => {
  const srv = await startMockServer()
  await page.goto(srv.url)
  await page.addScriptTag({ url: srv.url + '/bundle.js' })
  await page.waitForLoadState('domcontentloaded')
  // inject axe-core from local dependency
  await page.addScriptTag({ url: srv.url + '/axe.min.js' })
  const result = await page.evaluate(async () => {
    // @ts-ignore
    const root = document.querySelector('#ttt-ui-enhancer-root') || document.body
    // @ts-ignore
    return await (window as any).axe.run(root)
  })
  const critical = (result.violations || []).filter((v: any) => v.impact === 'critical')
  expect(critical.length).toBe(0)
})
