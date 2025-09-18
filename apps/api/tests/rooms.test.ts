import request from 'supertest';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

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

const createGameMock = vi.fn();
const joinGameMock = vi.fn();

vi.mock('../src/services/game-service', () => ({
  createGame: createGameMock,
  joinGame: joinGameMock,
}));

describe('rooms routes', () => {
  let app: ReturnType<typeof import('../src/app')['createApp']>;

  beforeAll(async () => {
    const { createApp } = await import('../src/app');
    app = createApp();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('creates a room', async () => {
    createGameMock.mockResolvedValue({
      game: { id: 'game1' },
      user: { id: 'user1', name: 'Alice' },
    });

    const response = await request(app).post('/api/rooms').send({ name: 'Alice' }).expect(201);

    expect(response.body.roomId).toBeTruthy();
    expect(response.body.token).toBeTruthy();
    expect(response.body.wsUrl).toBe('http://localhost:4000');
    expect(createGameMock).toHaveBeenCalledOnce();
  });

  it('joins a room', async () => {
    joinGameMock.mockResolvedValue({
      game: { id: 'game2' },
      seat: 'O',
      user: { id: 'user2', name: 'Bob' },
    });

    const response = await request(app).post('/api/rooms/room123/join').send({ name: 'Bob' }).expect(200);

    expect(response.body.token).toBeTruthy();
    expect(joinGameMock).toHaveBeenCalledWith('room123', 'Bob');
  });

  it('rejects invalid payloads', async () => {
    const response = await request(app)
      .post('/api/rooms')
      .send({ name: 'x'.repeat(80) })
      .expect(400);
    expect(response.body.code).toBe('invalid_input');
  });
});
