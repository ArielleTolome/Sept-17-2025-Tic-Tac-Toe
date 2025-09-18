import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import pinoHttp from 'pino-http';
import { randomUUID } from 'node:crypto';
import fetch from 'node-fetch';
import { createCanvas } from 'canvas';
import GIFEncoder from 'gifencoder';
import { logger } from './logger';

type GameMove = { player: 'X'|'O'; index: number; ts: number };
type Game = { id: string; moves: GameMove[]; startedAt: string; finishedAt: string; winner: 'X'|'O'|'Draw' };

const app = express();
app.use(helmet());
app.disable('x-powered-by');
app.use((req, res, next) => { const id = (req.headers['x-request-id'] as string) || randomUUID(); res.setHeader('x-request-id', id); (req as any).id = id; next(); });
app.use(pinoHttp({ logger, customProps: (req) => ({ requestId: (req as any).id }) }));
app.use('/api', cors({ origin: process.env.ALLOWED_ORIGIN || 'http://localhost:5173' }));

app.get('/healthz', (_req, res) => res.json({ ok: true }));

// Render GIF endpoint
app.get('/render/:gameId.gif', async (req, res) => {
  try {
    const gameId = req.params.gameId;
    const apiBase = process.env.API_BASE_URL || '';
    const game = await fetchGame(apiBase, gameId);
    res.setHeader('content-type', 'image/gif');
    await renderGif(game, res);
  } catch (e: any) {
    res.status(500).send(String(e?.message || e));
  }
});

async function fetchGame(apiBase: string, id: string): Promise<Game> {
  if (process.env.MOCK === '1') {
    return { id, startedAt: new Date(Date.now()-60000).toISOString(), finishedAt: new Date().toISOString(), winner: 'X', moves: [ { player:'X', index:0, ts:0 }, { player:'O', index:3, ts:1 }, { player:'X', index:1, ts:2 }, { player:'O', index:4, ts:3 }, { player:'X', index:2, ts:4 } ] };
  }
  const res = await fetch(`${apiBase}/api/games/${encodeURIComponent(id)}`);
  if (!res.ok) throw new Error(`Failed to fetch game ${id}`);
  return await res.json() as Game;
}

async function renderGif(game: Game, outStream: NodeJS.WritableStream) {
  const frames = buildFrames(game.moves);
  const size = 300; const cell = size/3;
  const encoder = new (GIFEncoder as any)(size, size);
  encoder.createReadStream().pipe(outStream);
  encoder.start();
  encoder.setRepeat(0);
  encoder.setDelay(500);
  encoder.setQuality(10);

  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  for (const board of frames) {
    // background
    ctx.fillStyle = '#0b0f19';
    ctx.fillRect(0,0,size,size);
    // grid
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 4;
    for (let i=1;i<3;i++) {
      ctx.beginPath(); ctx.moveTo(i*cell, 0); ctx.lineTo(i*cell, size); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i*cell); ctx.lineTo(size, i*cell); ctx.stroke();
    }
    // pieces
    for (let i=0;i<9;i++) {
      const r = Math.floor(i/3), c = i%3;
      const x = c*cell + cell/2; const y = r*cell + cell/2;
      if (board[i] === 'X') {
        ctx.strokeStyle = '#60a5fa'; ctx.lineWidth = 8;
        const d = cell*0.3;
        ctx.beginPath(); ctx.moveTo(x-d, y-d); ctx.lineTo(x+d, y+d); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x+d, y-d); ctx.lineTo(x-d, y+d); ctx.stroke();
      } else if (board[i] === 'O') {
        ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 8;
        ctx.beginPath(); ctx.arc(x, y, cell*0.3, 0, Math.PI*2); ctx.stroke();
      }
    }

    (encoder as any).addFrame(ctx);
  }
  encoder.finish();
}

function buildFrames(moves: GameMove[]): ((''|'X'|'O')[])[] {
  const frames: ((''|'X'|'O')[])[] = [Array(9).fill('')];
  let cur = frames[0].slice();
  for (const m of moves) {
    cur = cur.slice();
    cur[m.index] = m.player;
    frames.push(cur.slice());
  }
  return frames;
}

const port = Number(process.env.PORT || 4900);
app.listen(port, () => logger.info({ port }, 'gif renderer started'));

