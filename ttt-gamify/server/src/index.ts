import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import { z } from 'zod';

const app = Fastify({ logger: true });

await app.register(cors, { origin: process.env.CORS_ORIGIN || '*', credentials: false });
await app.register(rateLimit, { max: Number(process.env.RATE_LIMIT_RPS || 5), timeWindow: '1 second' });

// In-memory store for demo; swap with Prisma in production
type User = { id: string; anonToken: string; displayName?: string; avatar?: string; xp: number; level: number; stars: number };
const users = new Map<string, User>();

function uid() { return Math.random().toString(36).slice(2); }

app.get('/healthz', async () => ({ ok: true }));

app.post('/v1/identify', async (req) => {
  const userId = uid();
  const anonToken = uid();
  users.set(userId, { id: userId, anonToken, xp: 0, level: 1, stars: 0 });
  return { anonToken, userId };
});

app.get('/v1/profile', async (req) => {
  const userId = (req.headers['x-user'] as string) || '';
  const u = users.get(userId);
  if (!u) return { error: 'not_found' };
  return u;
});

app.patch('/v1/profile', async (req) => {
  const userId = (req.headers['x-user'] as string) || '';
  const body = z.object({ displayName: z.string().optional(), avatar: z.string().optional() }).parse(req.body);
  const u = users.get(userId);
  if (!u) return { error: 'not_found' };
  Object.assign(u, body);
  return u;
});

app.post('/v1/event', async (req) => {
  const items = z.array(z.object({ t: z.string(), p: z.any() })).max(100).parse(req.body);
  return { accepted: items.length };
});

app.get('/v1/summary', async (req) => {
  const out = [...users.values()].map(u => ({ userId: u.id, xp: u.xp, level: u.level, stars: u.stars }));
  return { users: out };
});

app.get('/v1/leaderboard', async (req) => {
  const q = z.object({ metric: z.enum(['level','winrate','streak','stars']).default('level'), limit: z.coerce.number().default(50) }).parse((req as any).query);
  const list = [...users.values()].sort((a,b) => (b.level-a.level) || (b.xp-a.xp)).slice(0, q.limit);
  return { rows: list };
});

app.post('/v1/referrals/claim', async () => ({ ok: true }));

const port = Number(process.env.PORT || 8787);
app.listen({ port, host: '0.0.0.0' }).catch((e) => { app.log.error(e); process.exit(1); });

