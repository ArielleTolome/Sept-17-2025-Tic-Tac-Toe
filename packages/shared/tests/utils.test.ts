import { describe, expect, it } from 'vitest';
import { sanitizeChatText } from '../src/utils/chat';

describe('chat sanitiser', () => {
  it('escapes HTML characters', () => {
    expect(sanitizeChatText('<b>Hello</b>')).toBe('&lt;b&gt;Hello&lt;/b&gt;');
  });

  it('trims and limits length', () => {
    expect(sanitizeChatText('   Hello world   ', 5)).toBe('Hello');
  });
});
