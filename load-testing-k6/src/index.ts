import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

type Mode = 'smoke' | 'rps' | 'ws' | 'soak';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080';
const WS_BASE_URL = process.env.WS_BASE_URL || 'ws://localhost:8080/ws';
const OUT_DIR = resolve(process.env.OUT_DIR || './results');

const envDefaults: Record<Mode, Record<string, string>> = {
  smoke: { DURATION: process.env.SMOKE_DURATION || '10s', VUS: process.env.SMOKE_VUS || '2' },
  rps: { TARGET: process.env.RPS_TARGET || '50', DURATION: process.env.RPS_DURATION || '1m' },
  ws: { USERS: process.env.WS_USERS || '20', DURATION: process.env.WS_DURATION || '1m' },
  soak: { DURATION: process.env.SOAK_DURATION || '2h', VUS: process.env.SOAK_VUS || '20' }
};

function buildArgs(mode: Mode) {
  const base = ['run'];
  const script = mode === 'smoke' ? 'k6/rest_smoke.js'
    : mode === 'rps' ? 'k6/rest_rps.js'
    : mode === 'ws' ? 'k6/ws_multiplayer.js'
    : 'k6/soak.js';
  const outJson = join(OUT_DIR, `${mode}-summary.json`);
  const args = base.concat([script]);
  return { args, outJson };
}

function toHTML(summary: any, title: string): string {
  const pass = Object.values(summary.metrics).every((m: any) => !m.thresholds || Object.values(m.thresholds).every((t: any) => t.ok !== false));
  const json = JSON.stringify(summary);
  return `<!doctype html><meta charset=utf-8><title>${title}</title><style>body{font:14px system-ui;background:#0b0f19;color:#f4f7ff;padding:16px}pre{background:#0f172a;border:1px solid #334155;padding:12px;border-radius:8px;overflow:auto} .ok{color:#34d399}.fail{color:#f87171}</style><h1>${title}</h1><p>Status: <strong class="${pass?'ok':'fail'}">${pass?'PASS':'FAIL'}</strong></p><h2>Summary JSON</h2><pre>${json}</pre>`;
}

async function main() {
  const mode = (process.argv[2] as Mode) || 'smoke';
  mkdirSync(OUT_DIR, { recursive: true });
  const { args, outJson } = buildArgs(mode);
  const htmlPath = join(OUT_DIR, `${mode}-summary.html`);
  const env = { ...process.env, API_BASE_URL, WS_BASE_URL, ...envDefaults[mode] };

  const k6Path = process.env.K6_PATH || 'k6';
  console.log(`Running k6: ${k6Path} ${args.join(' ')} ...`);
  const child = spawn(k6Path, args, { stdio: 'inherit', env: { ...env, K6_SUMMARY_EXPORT: outJson } });
  child.on('exit', (code) => {
    try {
      if (existsSync(outJson)) {
        const json = JSON.parse(readFileSync(outJson, 'utf-8'));
        const html = toHTML(json, `k6 report: ${mode}`);
        writeFileSync(htmlPath, html);
        console.log(`Summary written to ${htmlPath}`);
      } else {
        console.warn('No summary JSON produced');
      }
    } catch (e) {
      console.error('Failed to build HTML summary:', e);
    }
    process.exit(code || 0);
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

export { buildArgs, toHTML };

