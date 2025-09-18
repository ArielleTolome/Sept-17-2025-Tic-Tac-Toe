import { build } from 'vite';
import fs from 'fs';
import path from 'path';

const distRoot = path.resolve('dist/extension');
fs.rmSync(distRoot, { recursive: true, force: true });
fs.mkdirSync(distRoot, { recursive: true });

// Build overlay bundle (IIFE)
await build({ configFile: 'vite.config.ts' });
const overlayCode = fs.readFileSync('dist/ttt-gamify.iife.js');
fs.mkdirSync(distRoot, { recursive: true });
fs.writeFileSync(path.join(distRoot, 'overlay.iife.js'), overlayCode);

// Copy extension files
fs.copyFileSync('extension/manifest.json', path.join(distRoot, 'manifest.json'));
fs.copyFileSync('extension/content.js', path.join(distRoot, 'content.js'));

// Decode icons
const iconDir = path.join(distRoot, 'icons');
fs.mkdirSync(iconDir, { recursive: true });
for (const size of [16,32,48,128]) {
  const src = `extension/icons/icon-${size}.png.base64`;
  const dst = path.join(iconDir, `icon-${size}.png`);
  const b64 = fs.readFileSync(src, 'utf-8');
  fs.writeFileSync(dst, Buffer.from(b64, 'base64'));
}

console.log('Extension packaged at', distRoot);
