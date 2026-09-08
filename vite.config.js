import fs from 'node:fs'
import path from 'node:path'
import { defineConfig, mergeConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { gestaltDevQuest } from './vendor/gestalt/ui/dev-quest/vite-gestalt.js'

const rootDir = path.dirname(fileURLToPath(import.meta.url))

// In the monorepo, resolve the shared @gestalt packages from ui/*. When this
// repo is checked out standalone (e.g. Vercel), fall back to the committed
// vendor/gestalt copy that `scripts/sync-vendor.mjs` keeps in sync.
function resolveGestaltRoot(webRootDir) {
  const monorepoRoot = path.resolve(webRootDir, '../..')
  if (fs.existsSync(path.join(monorepoRoot, 'ui/auth/index.js'))) {
    return monorepoRoot
  }

  const vendorRoot = path.resolve(webRootDir, 'vendor/gestalt')
  if (fs.existsSync(path.join(vendorRoot, 'ui/auth/index.js'))) {
    return vendorRoot
  }

  throw new Error(
    'Gestalt shared packages not found. Run from the monorepo or keep vendor/gestalt in the repo.',
  )
}

const gestaltRoot = resolveGestaltRoot(rootDir)

export default mergeConfig(
  defineConfig({
    plugins: [react()],
    server: {
      port: 5174,
      strictPort: true,
      host: true,
      allowedHosts: ['flashbrix.com', 'www.flashbrix.com', '.alander.io'],
    },
  }),
  defineConfig(gestaltDevQuest(rootDir, gestaltRoot)),
)
