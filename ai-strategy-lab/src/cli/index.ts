#!/usr/bin/env node
import { emptyBoard, applyMove, winner, availableMoves } from '../lib/game';
import { HeuristicBot, MinimaxBot, NegaMaxBot, MCTSBot, type Bot, playGame } from '../lib/bots';
import { writeFileSync } from 'node:fs';

function pickBot(name: string): Bot {
  if (name.startsWith('minimax')) return MinimaxBot(9);
  if (name.startsWith('negamax')) return NegaMaxBot(9);
  if (name.startsWith('mcts')) return MCTSBot(300);
  return HeuristicBot;
}

function usage() {
  console.log('Usage: ttt-ai <command> [options]');
  console.log('Commands:');
  console.log('  match --x minimax --o heuristic           Run single match');
  console.log('  league --bots minimax,negamax,heuristic   Round-robin league');
  console.log('  heatmap --bot minimax --out heatmap.svg   Export opening heatmap');
}

async function main() {
  const [cmd, ...rest] = process.argv.slice(2);
  const args = parseArgs(rest);
  if (!cmd) { usage(); process.exit(1); }
  if (cmd === 'match') {
    const x = pickBot(String(args['--x'] || 'minimax'));
    const o = pickBot(String(args['--o'] || 'heuristic'));
    const res = playGame(x, o);
    console.log(`Winner: ${res.winner}`);
    process.exit(res.winner === 'X' || res.winner === 'O' || res.winner === 'Draw' ? 0 : 1);
  } else if (cmd === 'league') {
    const list = String(args['--bots'] || 'minimax,negamax,heuristic').split(',').map(pickBot);
    const table = new Map<string, { w: number; l: number; d: number }>();
    for (const a of list) for (const b of list) if (a !== b) {
      const res = playGame(a, b);
      table.set(a.name, table.get(a.name) || { w:0,l:0,d:0 });
      table.set(b.name, table.get(b.name) || { w:0,l:0,d:0 });
      if (res.winner === 'X') table.get(a.name)!.w++; else if (res.winner === 'O') table.get(b.name)!.w++; else table.get(a.name)!.d++, table.get(b.name)!.d++;
    }
    console.table(Object.fromEntries(table));
  } else if (cmd === 'heatmap') {
    const bot = pickBot(String(args['--bot'] || 'minimax'));
    const svg = generateHeatmapSVG(bot);
    const out = String(args['--out'] || 'heatmap.svg');
    writeFileSync(out, svg, 'utf-8');
    console.log(`Wrote ${out}`);
  } else {
    usage();
    process.exit(1);
  }
}

function parseArgs(arr: string[]): Record<string, string | boolean> {
  const out: Record<string, string | boolean> = {};
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].startsWith('--')) {
      const key = arr[i];
      const val = arr[i+1] && !arr[i+1].startsWith('--') ? arr[i+1] : 'true';
      out[key] = val;
      if (val !== 'true') i++;
    }
  }
  return out;
}

function generateHeatmapSVG(bot: Bot): string {
  const scores: number[] = Array(9).fill(0);
  for (let i = 0; i < 9; i++) {
    const b = emptyBoard();
    if (!availableMoves(b).includes(i)) continue;
    const nb = applyMove(b, i, 'X');
    // Evaluate outcome after bot replies as O
    const reply = bot.move(nb, 'O');
    const nb2 = applyMove(nb, reply, 'O');
    // simplistic score: 1 if X can still force win, 0 draw, -1 loss (minimax assumption)
    const w = winner(nb2);
    scores[i] = w === 'X' ? 1 : w === 'Draw' ? 0 : -1;
  }
  // Render as 3x3 grid
  const size = 300; const cell = 100;
  let rects = '';
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const idx = r*3+c;
      const s = scores[idx];
      const color = s > 0 ? '#34d399' : s < 0 ? '#f87171' : '#94a3b8';
      rects += `<rect x="${c*cell}" y="${r*cell}" width="${cell}" height="${cell}" fill="${color}" stroke="#0f172a"/>`;
    }
  }
  return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">${rects}</svg>`;
}

main().catch((e) => { console.error(e); process.exit(1); });

export { generateHeatmapSVG };

