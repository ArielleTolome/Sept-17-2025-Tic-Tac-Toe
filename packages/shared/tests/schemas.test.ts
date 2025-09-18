import { describe, expect, it } from 'vitest';
import { moveSchema, stateEventSchema } from '../src/schemas';

describe('schemas', () => {
  it('validates move payloads', () => {
    expect(moveSchema.parse({ index: 4 })).toEqual({ index: 4 });
    expect(() => moveSchema.parse({ index: 10 })).toThrowError();
  });

  it('validates state events', () => {
    const payload = {
      board: [null, null, null, null, null, null, null, null, null],
      turn: 'X',
      players: [
        { id: '1', name: 'Alice', mark: 'X', isReady: true },
        { id: '2', name: 'Bob', mark: 'O', isReady: true },
      ],
      spectators: [],
      winner: null,
      line: null,
      moves: [],
      status: 'active',
    };
    expect(() => stateEventSchema.parse(payload)).not.toThrow();
  });
});
