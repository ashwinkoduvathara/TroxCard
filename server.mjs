import { createServer } from 'node:http'
import path from 'node:path'
import fs from 'node:fs'
import handler from './dist/server/server.js'

const PORT = process.env.PORT || 3000
const HOST = process.env.HOST || '0.0.0.0'
const CLIENT_DIR = path.resolve('dist/client')

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
}

const server = createServer(async (req, res) => {
  try {
    const rawUrl = req.url || '/'
    const parsedUrl = new URL(rawUrl, `http://${req.headers.host || 'localhost'}`)
    const filePath = path.join(CLIENT_DIR, parsedUrl.pathname)

    // Serve static client assets if file exists in dist/client
    if (parsedUrl.pathname !== '/' && fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase()
      const contentType = mimeTypes[ext] || 'application/octet-stream'
      res.writeHead(200, { 'Content-Type': contentType })
      fs.createReadStream(filePath).pipe(res)
      return
    }

    // SSR request handling via TanStack Start handler
    const protocol = req.headers['x-forwarded-proto'] || 'http'
    const host = req.headers.host || `${HOST}:${PORT}`
    const url = new URL(rawUrl, `${protocol}://${host}`)

    const headers = new Headers()
    for (const [key, value] of Object.entries(req.headers)) {
      if (Array.isArray(value)) {
        for (const v of value) headers.append(key, v)
      } else if (value) {
        headers.set(key, value)
      }
    }

    const init = {
      method: req.method,
      headers,
    }

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      init.body = req
      init.duplex = 'half'
    }

    const webReq = new Request(url.href, init)
    const webRes = await handler.fetch(webReq)

    res.statusCode = webRes.status
    webRes.headers.forEach((val, key) => {
      if (key.toLowerCase() === 'set-cookie') {
        const existing = res.getHeader('set-cookie')
        if (existing) {
          if (Array.isArray(existing)) {
            res.setHeader('set-cookie', [...existing, val])
          } else {
            res.setHeader('set-cookie', [existing, val])
          }
        } else {
          res.setHeader(key, val)
        }
      } else {
        res.setHeader(key, val)
      }
    })

    if (webRes.body) {
      const reader = webRes.body.getReader()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        res.write(value)
      }
    }
    res.end()
  } catch (err) {
    console.error('Server error:', err)
    if (!res.headersSent) {
      res.statusCode = 500
      res.end('Internal Server Error')
    }
  }
})

server.listen(PORT, HOST, () => {
  console.log(`TroxCard Server running at http://${HOST}:${PORT}`)
})
