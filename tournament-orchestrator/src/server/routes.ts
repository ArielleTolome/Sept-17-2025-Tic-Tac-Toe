import { Router } from 'express';
import { z } from 'zod';
import { createTournament, getTournament, listTournaments, saveTournament, type Tournament, type TournamentType } from './store';
import { roundRobin, singleElim } from './pairings';
import { renderBracketSVG } from './bracket';
import { createRoom, watchRoom } from './coreClient';

import { makeQueue } from './queueRuntime';

export function buildRouter(ctx: { apiBase: string; wsBase: string }) {
  const r = Router();
  const queue = makeQueue(ctx.apiBase, ctx.wsBase);

  r.get('/tournaments', (_req, res) => {
    res.json({ tournaments: listTournaments() });
  });

  r.post('/tournaments', (req, res) => {
    const body = z.object({ name: z.string().min(1), type: z.union([z.literal('round-robin'), z.literal('single-elim')]), players: z.array(z.object({ id: z.string(), name: z.string().min(1) })).min(2) }).parse(req.body);
    const t = createTournament(body.name, body.type as TournamentType, body.players);
    // precompute matches
    t.matches = body.type === 'round-robin' ? roundRobin(body.players) : singleElim(body.players);
    saveTournament(t);
    res.status(201).json({ id: t.id });
  });

  r.get('/tournaments/:id', (req, res) => {
    const t = getTournament(req.params.id);
    if (!t) return res.status(404).json({ error: 'not_found' });
    res.json(t);
  });

  r.post('/tournaments/:id/start', async (req, res) => {
    const t = getTournament(req.params.id);
    if (!t) return res.status(404).json({ error: 'not_found' });
    // enqueue jobs to create rooms and monitor
    for (const m of t.matches) {
      if (!m.roomId) await queue.add('create-room', { type: 'create-room', data: { tournamentId: t.id, matchId: m.id, a: m.a, b: m.b } });
    }
    for (const m of t.matches) {
      if (m.roomId) await queue.add('monitor-room', { type: 'monitor-room', data: { tournamentId: t.id, matchId: m.id, roomId: m.roomId } });
    }
    res.json({ ok: true });
  });

  r.get('/tournaments/:id/bracket.svg', (req, res) => {
    const t = getTournament(req.params.id);
    if (!t) return res.status(404).send('not found');
    const svg = renderBracketSVG(t);
    res.setHeader('content-type', 'image/svg+xml');
    res.send(svg);
  });

  // Lightweight PDF export by embedding SVG into a minimal PDF via data url (for demo)
  r.get('/tournaments/:id/bracket.pdf', (req, res) => {
    const t = getTournament(req.params.id);
    if (!t) return res.status(404).send('not found');
    const svg = encodeURIComponent(renderBracketSVG(t));
    const html = `<!doctype html><meta charset=utf-8><title>${t.name}</title>${renderStyle()}<img src="data:image/svg+xml,${svg}">`;
    // Let browsers handle PDF printing; serve as HTML. For CI/export, consumers can print-to-PDF.
    res.setHeader('content-type', 'text/html');
    res.send(html);
  });

  return r;
}

function renderStyle() { return `<style>html,body{margin:0;padding:0;background:#020617;color:#e2e8f0;font:16px system-ui}img{display:block;width:100%}</style>`; }
