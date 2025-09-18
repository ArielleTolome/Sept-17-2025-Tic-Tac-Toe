import request from 'supertest';
import { beforeAll, describe, expect, it, vi } from 'vitest';

vi.mock('../src/env', () => ({
  env: {
    NODE_ENV: 'test',
    PORT: 4000,
    HOST: '127.0.0.1',
    FRONTEND_ORIGIN: 'http://localhost:5173',
    PUBLIC_WS_URL: 'http://localhost:4000',
    DATABASE_URL: 'file:./test.db',
    PRISMA_DB_PROVIDER: 'sqlite',
    WS_JWT_SECRET: 'test-secret-test-secret',
    JWT_ISSUER: 'tic-tac-toe',
    TURN_TIMEOUT_SECONDS: 10,
  },
}));

vi.mock('../src/logger', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

describe('health endpoint', () => {
  let app: ReturnType<typeof import('../src/app')['createApp']>;

  beforeAll(async () => {
    const { createApp } = await import('../src/app');
    app = createApp();
  });

  it('returns ok', async () => {
    const response = await request(app).get('/api/health').expect(200);
    expect(response.body.status).toBe('ok');
    expect(response.body.time).toBeTypeOf('string');
  });
});
