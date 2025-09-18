import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { OpenAPIGenerator, OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import {
  apiErrorSchema,
  chatEventSchema,
  createRoomResponseSchema,
  gameStateSchema,
  joinRoomResponseSchema,
  leaderboardResponseSchema,
  moveSchema,
  presenceEventSchema,
  stateEventSchema,
} from '@tic-tac-toe/shared';

const registry = new OpenAPIRegistry();

const nameSchema = z.object({
  name: z.string().min(1).max(32).optional().openapi({ description: 'Optional display name' }),
});

registry.registerPath({
  method: 'get',
  path: '/api/health',
  responses: {
    200: {
      description: 'Health check',
      content: {
        'application/json': {
          schema: z.object({ status: z.string(), time: z.string() }),
        },
      },
    },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/rooms',
  request: {
    body: {
      content: {
        'application/json': {
          schema: nameSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Room created',
      content: {
        'application/json': {
          schema: createRoomResponseSchema,
        },
      },
    },
    400: {
      description: 'Invalid request',
      content: {
        'application/json': {
          schema: apiErrorSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/rooms/{roomId}/join',
  request: {
    params: z.object({
      roomId: z.string().openapi({ description: 'Room identifier' }),
    }),
    body: {
      content: {
        'application/json': {
          schema: nameSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Joined room',
      content: {
        'application/json': {
          schema: joinRoomResponseSchema,
        },
      },
    },
    404: {
      description: 'Room not found',
      content: {
        'application/json': {
          schema: apiErrorSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/games/{id}',
  request: {
    params: z.object({ id: z.string().openapi({ description: 'Game identifier' }) }),
  },
  responses: {
    200: {
      description: 'Game snapshot',
      content: {
        'application/json': {
          schema: gameStateSchema,
        },
      },
    },
    404: {
      description: 'Game not found',
      content: {
        'application/json': {
          schema: apiErrorSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/leaderboard',
  responses: {
    200: {
      description: 'Leaderboard entries',
      content: {
        'application/json': {
          schema: leaderboardResponseSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: 'get',
  path: '/ws/docs',
  responses: {
    200: {
      description: 'WebSocket events',
      content: {
        'application/json': {
          schema: z.object({
            clientEvents: z.object({
              join: z.object({ roomId: z.string(), token: z.string(), name: z.string().optional() }),
              move: moveSchema,
              chat: z.object({ text: z.string() }),
              rematch: z.object({}).optional(),
            }),
            serverEvents: z.object({
              state: stateEventSchema,
              chat: chatEventSchema,
              presence: presenceEventSchema,
            }),
          }),
        },
      },
    },
  },
});

const generator = new OpenAPIGenerator(registry.definitions, '3.1.0');

const document = generator.generateDocument({
  info: {
    title: 'Tic-Tac-Toe API',
    version: '1.0.0',
    description: 'REST and WebSocket API for Tic-Tac-Toe multiplayer service',
  },
  servers: [
    {
      url: 'http://localhost:4000',
      description: 'Local development server',
    },
  ],
});

const outputPath = resolve(process.cwd(), 'openapi.json');
writeFileSync(outputPath, JSON.stringify(document, null, 2));
console.log(`OpenAPI spec written to ${outputPath}`);
