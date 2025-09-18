import fs from 'node:fs';
import path from 'node:path';

const outDir = process.env.REPORT_DIR || 'reports';
const inFile = path.join(outDir, 'axe-results.json');
const outFile = path.join(outDir, 'a11y-report.html');

function main() {
  if (!fs.existsSync(inFile)) {
    console.error('No axe-results.json found');
    process.exit(1);
  }
  const json = JSON.parse(fs.readFileSync(inFile, 'utf-8'));
  const html = toHTML(json);
  fs.writeFileSync(outFile, html, 'utf-8');
  console.log('Report written to', outFile);
}

function toHTML(results: any) {
  const v = results.violations || [];
  const count = v.length;
  const body = v.map((vi: any) => `<section><h3>${escape(vi.id)} — ${escape(vi.help)}</h3><p>${escape(vi.description)}</p><ul>${vi.nodes.map((n:any)=>`<li><code>${escape(n.target.join(' '))}</code>: ${escape(n.failureSummary||'')}</li>`).join('')}</ul></section>`).join('');
  return `<!doctype html><meta charset=utf-8><title>A11y Report</title><style>body{font:14px system-ui;background:#0b0f19;color:#f4f7ff;padding:16px}section{border:1px solid #334155;background:#0f172a;border-radius:8px;padding:8px;margin:8px 0}code{background:#111827;padding:2px 4px;border-radius:4px}</style><h1>Accessibility Report</h1><p>Violations: <strong>${count}</strong></p>${body}`;
}

function escape(s: string) { return s.replace(/[&<>]/g, (c)=> ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c] as string)); }

main();

