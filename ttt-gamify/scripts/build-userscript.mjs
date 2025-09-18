import { build } from 'vite';
import fs from 'fs';
import path from 'path';

const outDir = path.resolve('dist');
await build({ configFile: 'vite.config.ts' });
const iife = fs.readFileSync(path.join(outDir, 'ttt-gamify.iife.js'), 'utf-8');
const header = `// ==UserScript==\n`+
`// @name         TTT Gamify Overlay\n`+
`// @namespace    ttt-gamify\n`+
`// @version      0.1.0\n`+
`// @description  Non-destructive gamification overlay for Tic-Tac-Toe\n`+
`// @author       anon\n`+
`// @match        *://*/*\n`+
`// @grant        none\n`+
`// @run-at       document-end\n`+
`// ==/UserScript==\n`;
const wrapped = header + '\n(function(){\n' + iife + '\n})();\n';
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'ttt-gamify.user.js'), wrapped, 'utf-8');
console.log('Wrote', path.join(outDir, 'ttt-gamify.user.js'));

