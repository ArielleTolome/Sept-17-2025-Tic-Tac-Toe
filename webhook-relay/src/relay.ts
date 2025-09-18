import fetch from 'node-fetch';
import { logger } from './logger';

export type Rules = { rules: Array<{ event: 'start'|'turn'|'win'|'draw'; channels: string[]; template: string }> };

export function parseRules(json: any): Rules { return { rules: Array.isArray(json?.rules) ? json.rules : [] }; }

const watchers = new Map<string, WebSocket>();

export function startWatchers(wsBase: string, rules: Rules, integrations: Record<string, (message: string)=>Promise<void>>) {
  const preset = (process.env.SUBSCRIBE_ROOMS || '').split(',').map(s=>s.trim()).filter(Boolean);
  for (const r of preset) subscribeRoom(r, wsBase, rules, integrations);
}

export function subscribeRoom(roomId: string, wsBase?: string, rules?: Rules, integrations?: Record<string, (message: string)=>Promise<void>>) {
  const base = wsBase || (process.env.WS_BASE_URL || '');
  if (!base) return;
  if (watchers.has(roomId)) return;
  const ws = new WebSocket(base);
  ws.onopen = () => {
    ws.send(JSON.stringify({ type: 'join', roomId }));
    logger.info({ roomId }, 'ws joined');
  };
  ws.onmessage = (ev) => {
    try {
      const msg = JSON.parse(ev.data as string);
      handleEvent(roomId, msg, rules!, integrations!);
    } catch {}
  };
  ws.onclose = () => {
    watchers.delete(roomId);
    setTimeout(() => subscribeRoom(roomId, base, rules, integrations), 2000);
  };
  watchers.set(roomId, ws);
}

export async function handleEvent(roomId: string, msg: any, rules: Rules, integrations: Record<string, (message: string)=>Promise<void>>) {
  let event: 'start'|'turn'|'win'|'draw'|null = null;
  if (msg.type === 'state' && msg.payload?.moveNumber === 1) event = 'start';
  if (msg.type === 'state' && msg.payload?.turn) event = 'turn';
  if (msg.type === 'state' && msg.payload?.finished && msg.payload?.winner) event = 'win';
  if (msg.type === 'state' && msg.payload?.finished && !msg.payload?.winner) event = 'draw';
  if (!event) return;
  const vars = { roomId, player: msg.payload?.turn, winner: msg.payload?.winner } as Record<string, string>;
  const matching = rules.rules.filter(r => r.event === event);
  for (const r of matching) {
    const message = renderTemplate(r.template, vars);
    for (const ch of r.channels) {
      const send = integrations[ch]; if (!send) continue;
      await retry(() => send(message));
    }
  }
}

export function renderTemplate(tpl: string, vars: Record<string,string>) {
  return tpl.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] ?? '');
}

export async function retry(fn: () => Promise<void>, attempts = 5, base = 200) {
  let i = 0;
  while (true) {
    try { await fn(); return; } catch (e) {
      i++; if (i >= attempts) throw e;
      await new Promise(r => setTimeout(r, base * Math.pow(2, i)));
    }
  }
}

