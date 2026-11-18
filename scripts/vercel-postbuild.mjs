#!/usr/bin/env node
// Production on flashbrix.com: the landing page is a separate deployment that is
// proxied for every path the app does not own (see vercel.json). Keep only the
// app's own files in dist so nothing here shadows the landing's paths.
import fs from 'node:fs'
import path from 'node:path'

const dist = path.resolve('dist')
fs.renameSync(path.join(dist, 'index.html'), path.join(dist, 'app.html'))
for (const name of ['brand', 'fonts', 'favicon.svg', 'icons.svg']) {
  fs.rmSync(path.join(dist, name), { recursive: true, force: true })
}
console.log('[vercel-postbuild] dist ready: app.html + assets/ + app-assets/')
