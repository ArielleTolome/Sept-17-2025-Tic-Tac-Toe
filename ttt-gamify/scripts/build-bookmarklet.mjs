import { build } from 'vite';
import fs from 'fs';
import path from 'path';

const outDir = path.resolve('dist');
await build({ configFile: 'vite.config.ts' });
const iife = fs.readFileSync(path.join(outDir, 'ttt-gamify.iife.js'), 'utf-8');
const encoded = encodeURIComponent('(function(){' + iife + '})()');
const bookmarklet = `javascript:(()=>{var s=document.createElement('script');s.defer=true;s.src='data:text/javascript;charset=utf-8,${encoded}';document.body.appendChild(s);})();`;
fs.writeFileSync(path.join(outDir, 'bookmarklet.txt'), bookmarklet, 'utf-8');
console.log('Wrote', path.join(outDir, 'bookmarklet.txt'));

