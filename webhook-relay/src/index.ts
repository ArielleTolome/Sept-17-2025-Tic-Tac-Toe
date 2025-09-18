import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import pinoHttp from 'pino-http';
import { randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import fetch from 'node-fetch';
import nodemailer from 'nodemailer';
import { logger } from './logger';
import { startWatchers, subscribeRoom, parseRules, renderTemplate } from './relay';

const app = express();
app.use(helmet());
app.disable('x-powered-by');
app.use((req, res, next) => {
  const id = (req.headers['x-request-id'] as string) || randomUUID();
  res.setHeader('x-request-id', id);
  (req as any).id = id;
  next();
});
app.use(pinoHttp({ logger, customProps: (req) => ({ requestId: (req as any).id }) }));
app.use('/api', cors({ origin: process.env.ALLOWED_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

const limiter = rateLimit({ windowMs: 60_000, limit: 120, standardHeaders: 'draft-7' });
app.use(['/api'], (req, res, next) => { if (req.method === 'GET' || req.method === 'OPTIONS') return next(); return limiter(req, res, next); });

app.get('/healthz', (_req, res) => res.json({ ok: true, ts: Date.now() }));

app.post('/api/subscribe', (req, res) => {
  const roomId = String(req.body?.roomId || '');
  if (!roomId) return res.status(400).json({ error: 'roomId required' });
  subscribeRoom(roomId);
  res.json({ ok: true });
});

const rulesPath = process.env.RULES_PATH || './rules.json';
let rules = { rules: [] as any[] };
try {
  const txt = readFileSync(rulesPath, 'utf-8');
  rules = parseRules(JSON.parse(txt));
} catch {
  logger.warn({ rulesPath }, 'rules file missing or invalid; using defaults');
}

const integrations = buildIntegrations();
startWatchers(process.env.WS_BASE_URL || '', rules, integrations);

const port = Number(process.env.PORT || 4700);
app.listen(port, () => logger.info({ port }, 'webhook relay started'));

function buildIntegrations() {
  const slackUrl = process.env.SLACK_WEBHOOK_URL || '';
  const discordUrl = process.env.DISCORD_WEBHOOK_URL || '';
  const smtpHost = process.env.SMTP_HOST || '';
  const smtpUser = process.env.SMTP_USER || '';
  const smtpPass = process.env.SMTP_PASS || '';
  const smtpFrom = process.env.SMTP_FROM || '';
  const twilioSid = process.env.TWILIO_ACCOUNT_SID || '';
  const twilioToken = process.env.TWILIO_AUTH_TOKEN || '';
  const twilioFrom = process.env.TWILIO_FROM || '';

  const mailer = smtpHost ? nodemailer.createTransport({ host: smtpHost, port: Number(process.env.SMTP_PORT||587), secure: false, auth: smtpUser ? { user: smtpUser, pass: smtpPass } : undefined }) : null;

  return {
    async slack(message: string) {
      if (!slackUrl) return;
      await fetch(slackUrl, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ text: message }) });
    },
    async discord(message: string) {
      if (!discordUrl) return;
      await fetch(discordUrl, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ content: message }) });
    },
    async email(message: string) {
      if (!mailer || !smtpFrom) return;
      await mailer.sendMail({ from: smtpFrom, to: smtpFrom, subject: 'TTT Notification', text: message });
    },
    async sms(message: string) {
      if (!twilioSid || !twilioToken || !twilioFrom || !process.env.TWILIO_TO) return;
      const to = process.env.TWILIO_TO as string;
      const url = `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`;
      const body = new URLSearchParams({ From: twilioFrom, To: to, Body: message });
      const auth = Buffer.from(`${twilioSid}:${twilioToken}`).toString('base64');
      await fetch(url, { method: 'POST', headers: { Authorization: `Basic ${auth}`, 'content-type': 'application/x-www-form-urlencoded' }, body });
    }
  };
}

