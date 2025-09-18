import { h } from 'preact'
import { useEffect } from 'preact/hooks'
import type { Store } from '../store/prefs'
import { Close } from './Icons'

export function ShortcutsOverlay({ store }: { store: Store }) {
  const { shortcutsOpen } = store.getState()
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    if (shortcutsOpen) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [shortcutsOpen])

  function close() { store.setState({ shortcutsOpen: false }) }
  return (
    <div class={"ttt-shortcuts" + (shortcutsOpen ? ' open' : '')} role="dialog" aria-modal="false" aria-label="Keyboard Shortcuts">
      <div class="ttt-shortcuts-panel">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:8px;">
          <div style="font-weight:600">Keyboard Shortcuts</div>
          <button class="ttt-enhancer" aria-label="Close" onClick={close} style="pointer-events:auto;background:none;border:none;color:inherit;cursor:pointer"><Close/></button>
        </div>
        <ul style="line-height:1.8">
          <li>?: Open this help</li>
          <li>Arrow keys: Navigate squares</li>
          <li>Enter/Space: Activate square</li>
          <li>Esc: Close panels or overlays</li>
        </ul>
        <p style="opacity:.8; font-size:13px">Note: We do not override the host app’s handlers; navigation hints are additive.</p>
      </div>
    </div>
  )
}

