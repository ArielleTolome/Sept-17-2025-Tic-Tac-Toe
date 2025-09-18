import type { Match, Tournament } from './store';

export function renderBracketSVG(t: Tournament): string {
  // simple columns by round
  const rounds = Math.max(0, ...t.matches.map((m) => m.round));
  const colWidth = 240;
  const rowHeight = 70;
  const padding = 20;
  const width = (rounds + 1) * colWidth + padding * 2;
  const maxRows = Math.max(1, ...Array.from({ length: rounds + 1 }, (_, r) => t.matches.filter((m) => m.round === r).length));
  const height = maxRows * rowHeight + padding * 2 + 40;

  const groups = Array.from({ length: rounds + 1 }, (_, r) => t.matches.filter((m) => m.round === r));
  let content = '';
  groups.forEach((ms, r) => {
    ms.forEach((m, i) => {
      const x = padding + r * colWidth;
      const y = padding + i * rowHeight;
      const color = m.winner ? '#16a34a' : '#64748b';
      content += `\n<g transform="translate(${x},${y})">`;
      content += `<rect x="0" y="0" width="220" height="60" rx="8" fill="#0f172a" stroke="#334155"/>`;
      content += `<text x="10" y="25" font-family="system-ui" font-size="14" fill="#e2e8f0">${escapeXML(m.a)}</text>`;
      content += `<text x="10" y="45" font-family="system-ui" font-size="14" fill="#e2e8f0">${escapeXML(m.b)}</text>`;
      if (m.winner) content += `<circle cx="205" cy="30" r="8" fill="${color}" />`;
      content += `</g>`;
    });
  });
  return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">\n<rect width="100%" height="100%" fill="#020617"/>\n<text x="${padding}" y="${padding}" font-family="system-ui" font-size="18" fill="#e2e8f0">${escapeXML(t.name)} — ${t.type}</text>\n${content}\n</svg>`;
}

function escapeXML(s: string) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

export function computeStandings(matches: Match[]): Record<string, number> {
  const w: Record<string, number> = {};
  for (const m of matches) {
    if (!m.winner) continue;
    w[m.winner] = (w[m.winner] || 0) + 1;
  }
  return w;
}

