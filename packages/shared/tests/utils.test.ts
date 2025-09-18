import { describe, expect, it } from 'vitest';
import { sanitizeChatText } from '../src/utils/chat';

describe('chat sanitiser', () => {
  it('collapses whitespace and trims', () => {
    expect(sanitizeChatText('   Hello   world   ', 11)).toBe('Hello world');
  });

  it('strips control characters', () => {
    expect(sanitizeChatText('Hello\u0007World')).toBe('HelloWorld');
  });
});
