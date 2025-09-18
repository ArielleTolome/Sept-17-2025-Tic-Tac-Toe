import fs from 'fs'
import path from 'path'

const dist = path.resolve('dist')
const srcFile = path.join(dist, 'ttt-ui-enhancer.iife.js')
const outFile = path.join(dist, 'ttt-ui-enhancer.user.js')

if (!fs.existsSync(srcFile)) {
  console.error('Build input missing:', srcFile)
  process.exit(1)
}

const code = fs.readFileSync(srcFile, 'utf8')
const meta = `// ==UserScript==\n`+
`// @name         Tic-Tac-Toe UI Enhancer\n`+
`// @namespace    ttt-enhancer\n`+
`// @version      1.0.0\n`+
`// @description  Zero-touch UI/UX & a11y enhancer for Tic-Tac-Toe apps\n`+
`// @author       UI Enhancer\n`+
`// @match        *://*/*\n`+
`// @grant        none\n`+
`// @run-at       document-idle\n`+
`// ==/UserScript==\n\n`

fs.writeFileSync(outFile, meta + code, 'utf8')
console.log('Wrote', outFile)
