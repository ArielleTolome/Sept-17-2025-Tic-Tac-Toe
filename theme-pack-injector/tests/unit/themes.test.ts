import { describe, expect, test } from 'vitest';
import { THEMES, varsToStyle } from '../../src/extension/themes';

describe('themes', () => {
  test('varsToStyle formats CSS variables', () => {
    const css = varsToStyle({ '--bg': '#000', '--fg': '#fff' });
    expect(css).toContain('--bg: #000;');
    expect(css).toContain('--fg: #fff;');
  });
  test('have key labels', () => {
    expect(THEMES['high-contrast'].label).toMatch(/High/);
  });
});

