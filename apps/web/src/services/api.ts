import {
  createRoomResponseSchema,
  joinRoomResponseSchema,
  gameStateSchema,
  leaderboardResponseSchema,
  type CreateRoomResponseDto,
  type GameStateDto,
  type JoinRoomResponseDto,
} from '@tic-tac-toe/shared';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000';

const request = async <T>(path: string, init?: RequestInit, parser?: (data: unknown) => T): Promise<T> => {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || response.statusText);
  }

  const data = await response.json();
  return parser ? parser(data) : (data as T);
};

export const createRoom = (name?: string): Promise<CreateRoomResponseDto> =>
  request(
    '/api/rooms',
    {
      method: 'POST',
      body: JSON.stringify({ name }),
    },
    (data) => createRoomResponseSchema.parse(data),
  );

export const joinRoom = (roomId: string, name?: string): Promise<JoinRoomResponseDto> =>
  request(
    `/api/rooms/${roomId}/join`,
    {
      method: 'POST',
      body: JSON.stringify({ name }),
    },
    (data) => joinRoomResponseSchema.parse(data),
  );

export const fetchGameState = (id: string): Promise<GameStateDto> =>
  request(`/api/games/${id}`, undefined, (data) => gameStateSchema.parse(data));

export const fetchLeaderboard = () =>
  request('/api/leaderboard', undefined, (data) => leaderboardResponseSchema.parse(data));
