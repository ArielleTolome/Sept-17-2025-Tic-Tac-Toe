import { z } from 'zod';

export const gameMoveSchema = z.object({
  player: z.union([z.literal('X'), z.literal('O')]),
  index: z.number().int().min(0).max(8),
  ts: z.number().int().nonnegative()
});

export const gameSchema = z.object({
  id: z.string(),
  startedAt: z.string(),
  finishedAt: z.string(),
  winner: z.union([z.literal('X'), z.literal('O'), z.literal('Draw')]),
  moves: z.array(gameMoveSchema)
});

export const wsMessageSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('state'),
    payload: z.object({
      board: z.array(z.union([z.literal('X'), z.literal('O'), z.literal('')])).length(9),
      next: z.union([z.literal('X'), z.literal('O')]).optional()
    })
  }),
  z.object({
    type: z.literal('presence'),
    payload: z.object({ players: z.object({ X: z.string().optional(), O: z.string().optional() }) })
  }),
  z.object({
    type: z.literal('chat'),
    payload: z.object({ user: z.string(), message: z.string(), ts: z.number() })
  }),
  z.object({
    type: z.literal('error'),
    payload: z.object({ code: z.string(), message: z.string() })
  })
]);

export type WSMessage = z.infer<typeof wsMessageSchema>;

