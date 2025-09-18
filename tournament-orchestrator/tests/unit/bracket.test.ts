import { describe, expect, test } from 'vitest';
import { renderBracketSVG, computeStandings } from '../../src/server/bracket';
import type { Tournament } from '../../src/server/store';

const t: Tournament = {
  id: 't1',
  name: 'Test',
  type: 'single-elim',
  players: [{id:'1',name:'A'},{id:'2',name:'B'}],
  matches: [ { id:'m1', round:0, a:'A', b:'B', winner:'A' } ],
  createdAt: Date.now()
};

describe('bracket', () => {
  test('renders svg', () => {
    const svg = renderBracketSVG(t);
    expect(svg).toContain('<svg');
    expect(svg).toContain('Test');
  });
  test('standings', () => {
    const s = computeStandings(t.matches);
    expect(s['A']).toBe(1);
  });
});

