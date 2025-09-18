export function isTypingInTextField(e: KeyboardEvent): boolean {
  const t = e.target as HTMLElement | null
  if (!t) return false
  const tag = t.tagName
  const editable = (t.getAttribute('contenteditable') || '').toLowerCase() === 'true'
  return editable || tag === 'INPUT' || tag === 'TEXTAREA' || (t as HTMLInputElement).type === 'text'
}

export function liveSay(id: string, text: string) {
  const el = document.getElementById(id)
  if (!el) return
  el.textContent = text
}
