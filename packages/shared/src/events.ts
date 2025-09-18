export const ClientEvents = {
  Join: 'join',
  Move: 'move',
  Chat: 'chat',
  Rematch: 'rematch',
} as const;

export const ServerEvents = {
  State: 'state',
  Chat: 'chat',
  Presence: 'presence',
  Error: 'error',
  Rematch: 'rematch',
} as const;

export type ClientEventName = (typeof ClientEvents)[keyof typeof ClientEvents];
export type ServerEventName = (typeof ServerEvents)[keyof typeof ServerEvents];
