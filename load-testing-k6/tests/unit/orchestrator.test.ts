import { describe, expect, test } from 'vitest';
import { buildArgs, toHTML } from '../../src/index';

describe('orchestrator', () => {
  test('buildArgs produces script paths', () => {
    const smoke = buildArgs('smoke');
    expect(smoke.args[1]).toContain('rest_smoke.js');
    const rps = buildArgs('rps');
    expect(rps.args[1]).toContain('rest_rps.js');
    const ws = buildArgs('ws');
    expect(ws.args[1]).toContain('ws_multiplayer.js');
    const soak = buildArgs('soak');
    expect(soak.args[1]).toContain('soak.js');
  });
  test('toHTML embeds JSON and status', () => {
    const html = toHTML({ metrics: {} }, 'title');
    expect(html).toContain('title');
    expect(html).toContain('Summary JSON');
  });
});

