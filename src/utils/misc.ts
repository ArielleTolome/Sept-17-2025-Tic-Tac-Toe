type ElementTag = keyof globalThis.HTMLElementTagNameMap

export function clamp(n: number, min: number, max: number) { return Math.min(max, Math.max(min, n)) }
export function el<K extends ElementTag>(tag: K, cls?: string, text?: string) {
  const element = document.createElement(tag) as globalThis.HTMLElementTagNameMap[K]
  if (cls) element.className = cls
  if (text) element.textContent = text
  return element
}

export function isVisible(el: Element | null): boolean {
  if (!el) return false
  const rect = (el as HTMLElement).getBoundingClientRect()
  return rect.width > 0 && rect.height > 0
}
