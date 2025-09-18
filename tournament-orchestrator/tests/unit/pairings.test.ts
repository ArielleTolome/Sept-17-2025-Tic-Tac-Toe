import { describe, expect, test } from 'vitest';
import { roundRobin, singleElim } from '../../src/server/pairings';

const players = ['A','B','C','D'].map((n,i)=>({id:String(i+1), name:n}));

describe('roundRobin', () => {
  test('generates n(n-1)/2 matches without byes', () => {
    const ms = roundRobin(players);
    expect(ms.length).toBe(6);
    const pairs = new Set(ms.map(m=>`${m.a}-${m.b}`));
    expect(pairs.has('A-B') || pairs.has('B-A')).toBeTruthy();
  });
});

describe('singleElim', () => {
  test('handles power-of-two with 4 players', () => {
    const ms = singleElim(players);
    // first round: 2 matches, second: 1 placeholder TBD
    expect(ms.filter(m=>m.round===0).length).toBe(2);
    expect(ms.length).toBeGreaterThanOrEqual(2);
  });
  test('pads byes and advances winners', () => {
    const three = ['A','B','C'].map((n,i)=>({id:String(i+1), name:n}));
    const ms = singleElim(three);
    expect(ms.some(m=>m.winner)).toBe(true);
  });
});

