const ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

const ESCAPE_REGEX = /[&<>"']/g;

export const escapeHtml = (input: string): string => input.replace(ESCAPE_REGEX, (char) => ESCAPE_MAP[char]);

export const sanitizeChatText = (text: string, maxLength = 280): string => {
  const trimmed = text.trim().slice(0, maxLength);
  return escapeHtml(trimmed);
};
