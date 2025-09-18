export function clamp(n: number, min: number, max: number) { return Math.min(max, Math.max(min, n)) }
export function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls?: string, text?: string) { const e = document.createElement(tag); if (cls) e.className = cls; if (text) e.textContent = text; return e }

export function isVisible(el: Element | null): boolean {
  if (!el) return false
  const rect = (el as HTMLElement).getBoundingClientRect()
  return rect.width > 0 && rect.height > 0
}
