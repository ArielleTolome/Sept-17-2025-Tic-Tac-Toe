import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const playerMarkSchema = z.enum(['X', 'O']);
export const cellSchema = z.union([playerMarkSchema, z.null()]);
export const boardSchema = z
  .array(cellSchema)
  .length(9, 'Board must contain exactly 9 cells')
  .openapi({ description: 'Flattened tic-tac-toe board', example: Array(9).fill(null) });

export const moveSchema = z
  .object({
    index: z
      .number()
      .int()
      .min(0)
      .max(8)
      .openapi({ description: 'Zero-based board index for the move', example: 4 }),
  })
  .openapi({ description: 'Client submitted move payload' });

export const moveRecordSchema = z.object({
  order: z.number().int().nonnegative(),
  index: z
    .number()
    .int()
    .min(-1)
    .max(8)
    .openapi({ description: 'Move index; -1 denotes a timeout pass' }),
  player: playerMarkSchema,
  timestamp: z.number().int().nonnegative(),
});

export const winningLineSchema = z.object({
  cells: z.array(z.number().int().min(0).max(8)).length(3),
  player: playerMarkSchema,
});

export const scoreboardSchema = z.object({
  wins: z.number().int().nonnegative(),
  losses: z.number().int().nonnegative(),
  draws: z.number().int().nonnegative(),
});

export const chatMessageSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  text: z.string().min(1).max(280),
  timestamp: z.number().int().nonnegative(),
});

export const playerSlotSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(32),
  mark: playerMarkSchema,
  isReady: z.boolean(),
});

export const spectatorSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
});

export const presenceSchema = z.object({
  players: z.array(playerSlotSchema),
  spectators: z.array(spectatorSchema),
});

export const timerSchema = z
  .object({
    remainingMs: z.number().int().nonnegative(),
    expiresAt: z.number().int().nonnegative(),
  })
  .nullable();

export const gameStateSchema = z.object({
  id: z.string(),
  board: boardSchema,
  turn: playerMarkSchema,
  status: z.enum(['pending', 'active', 'finished']),
  mode: z.enum(['single', 'local', 'online']),
  winner: playerMarkSchema.nullable(),
  winningLine: winningLineSchema.nullable(),
  moves: z.array(moveRecordSchema),
  createdAt: z.number().int(),
  updatedAt: z.number().int(),
  chat: z.array(chatMessageSchema),
  timer: timerSchema.optional(),
});

export const stateEventSchema = z.object({
  board: boardSchema,
  turn: playerMarkSchema,
  players: z.array(playerSlotSchema),
  spectators: z.array(spectatorSchema),
  winner: playerMarkSchema.nullable(),
  line: z.array(z.number().int()).length(3).nullable(),
  moves: z.array(moveRecordSchema),
  status: z.enum(['pending', 'active', 'finished']),
  timer: timerSchema.optional(),
});

export const presenceEventSchema = presenceSchema;

export const chatEventSchema = z.object({
  id: z.string(),
  name: z.string(),
  text: z.string(),
  ts: z.number().int(),
});

export const errorEventSchema = z.object({
  code: z.string(),
  message: z.string(),
});

export const rematchEventSchema = z.object({
  accepted: z.boolean(),
});

export const createRoomResponseSchema = z.object({
  roomId: z.string(),
  wsUrl: z.string().url(),
  token: z.string(),
});

export const joinRoomResponseSchema = z.object({
  token: z.string(),
});

export const leaderboardEntrySchema = z.object({
  userId: z.string(),
  name: z.string(),
  wins: z.number().int().nonnegative(),
  losses: z.number().int().nonnegative(),
  draws: z.number().int().nonnegative(),
  winRate: z.number().min(0).max(1),
});

export const leaderboardResponseSchema = z.array(leaderboardEntrySchema);

export const apiErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
});

export type MovePayload = z.infer<typeof moveSchema>;
export type GameStateDto = z.infer<typeof gameStateSchema>;
export type StateEventDto = z.infer<typeof stateEventSchema>;
export type ChatMessageDto = z.infer<typeof chatMessageSchema>;
export type CreateRoomResponseDto = z.infer<typeof createRoomResponseSchema>;
export type JoinRoomResponseDto = z.infer<typeof joinRoomResponseSchema>;
