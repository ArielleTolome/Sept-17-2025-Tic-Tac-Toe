import { h, render } from 'preact'

import { discover } from '../dom/discovery'
import { observeDom } from '../dom/observers'
import { createStore, initPreferences } from '../store/prefs'
import { ensureStyles } from '../styles/inject'
import { RootOverlay } from '../ui/RootOverlay'

let mounted = false

export function attachEnhancer() {
  if (mounted) return
  mounted = true

  const rootId = 'ttt-ui-enhancer-root'
  const styleId = 'ttt-ui-enhancer-styles'
  const existing = document.getElementById(rootId)
  if (existing) existing.remove()

  // Ensure styles
  ensureStyles(styleId)

  // Root container
  const root = document.createElement('div')
  root.id = rootId
  root.className = 'ttt-enhancer-root ttt-enhancer'
  root.style.position = 'fixed'
  root.style.inset = '0'
  root.style.pointerEvents = 'none'
  root.setAttribute('aria-hidden', 'true')
  document.body.appendChild(root)

  // Live region
  const live = document.createElement('div')
  live.id = 'ttt-ui-enhancer-live'
  live.className = 'ttt-enhancer'
  live.setAttribute('aria-live', 'polite')
  live.setAttribute('role', 'status')
  live.style.position = 'fixed'
  live.style.left = '-9999px'
  live.style.top = 'auto'
  live.style.width = '1px'
  live.style.height = '1px'
  document.body.appendChild(live)

  const store = createStore(initPreferences())

  const initial = discover()
  const unobserve = observeDom(() => {
    const d = discover()
    store.setState({ discovery: d })
  })

  store.setState({ discovery: initial })

  render(h(RootOverlay, { store, liveRegionId: live.id }), root)

  // Cleanup on page hide (not strictly needed, extension disable unloads page)
  window.addEventListener('pagehide', () => {
    try {
      unobserve()
    } catch {
      /* ignore cleanup chain failures */
    }
    try {
      render(null, root)
    } catch {
      /* ignore cleanup chain failures */
    }
    try {
      root.remove()
    } catch {
      /* ignore cleanup chain failures */
    }
    try {
      live.remove()
    } catch {
      /* ignore cleanup chain failures */
    }
    mounted = false
  })
}

export type { Store } from '../store/prefs'
