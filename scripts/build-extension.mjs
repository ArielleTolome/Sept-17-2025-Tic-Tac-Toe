import fs from 'fs-extra'
import path from 'path'

const dist = path.resolve('dist')
const extDir = path.resolve('extension')
const src = path.join(dist, 'ttt-ui-enhancer.iife.js')
const dst = path.join(extDir, 'content.js')

await fs.copy(src, dst)
console.log('Copied content script to extension/content.js')
