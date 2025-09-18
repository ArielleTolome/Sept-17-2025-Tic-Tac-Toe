import { createServer, Server } from 'http'
import fs from 'fs'
import path from 'path'

export async function startMockServer(): Promise<{ server: Server, url: string }> {
  const html = fs.readFileSync(path.resolve('tests/e2e/mock-app/index.html'), 'utf8')
  const bundle = fs.readFileSync(path.resolve('dist/ttt-ui-enhancer.iife.js'), 'utf8')
  let axe: string | null = null
  try { axe = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8') } catch {}
  const server = createServer((req, res) => {
    if (req.url?.startsWith('/bundle.js')) {
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8')
      res.end(bundle)
      return
    }
    if (req.url?.startsWith('/axe.min.js') && axe) {
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8')
      res.end(axe)
      return
    }
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.end(html)
  })
  await new Promise<void>((resolve) => server.listen(0, resolve))
  const address = server.address()
  if (!address || typeof address === 'string') throw new Error('Server did not bind')
  const url = `http://127.0.0.1:${address.port}`
  return { server, url }
}
