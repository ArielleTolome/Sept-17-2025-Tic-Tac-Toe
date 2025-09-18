import fs from 'fs'
import path from 'path'

const dist = path.resolve('dist')
const srcFile = path.join(dist, 'ttt-ui-enhancer.iife.js')
const outFile = path.join(dist, 'bookmarklet.txt')

if (!fs.existsSync(srcFile)) {
  console.error('Build input missing:', srcFile)
  process.exit(1)
}

const code = fs.readFileSync(srcFile, 'utf8')
// Minify trivially by stripping comments and whitespace newlines where safe
const min = code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\n+/g, '\n')
const url = 'javascript:' + encodeURIComponent(`(function(){${min}})();`)
fs.writeFileSync(outFile, url, 'utf8')
console.log('Wrote', outFile)
