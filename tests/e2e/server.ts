import { createServer, Server } from 'http'
import fs from 'fs'
import path from 'path'

export async function startMockServer(): Promise<{ server: Server, url: string }> {
  const html = fs.readFileSync(path.resolve('tests/e2e/mock-app/index.html'), 'utf8')
  const server = createServer((req, res) => {
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

