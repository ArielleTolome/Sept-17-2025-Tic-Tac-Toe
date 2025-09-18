export function observeDom(onChange: () => void) {
  const mo = new MutationObserver(() => onChange())
  mo.observe(document.documentElement, { childList: true, subtree: true, attributes: true, characterData: true })
  const ro = new ResizeObserver(() => onChange())
  ro.observe(document.documentElement)
  const cleanup = () => {
    try {
      mo.disconnect()
    } catch (err) {
      /* observer already disposed */
    }
    try {
      ro.disconnect()
    } catch (err) {
      /* observer already disposed */
    }
  }
  window.addEventListener('hashchange', onChange)
  window.addEventListener('popstate', onChange)
  return () => {
    cleanup()
    window.removeEventListener('hashchange', onChange)
    window.removeEventListener('popstate', onChange)
  }
}
