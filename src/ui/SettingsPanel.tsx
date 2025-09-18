import type { JSX } from 'preact'
import { useEffect, useRef, useState } from 'preact/hooks'

import type { Preferences, Store } from '../store/prefs'
import { clamp } from '../utils/misc'
import { Close, Gear, Help, Info } from './Icons'
import { showToast } from './Toasts'

type Props = { store: Store }

export function Settings({ store }: Props) {
  const { prefs, panelOpen } = store.getState()
  const panelRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(panelOpen)

  useEffect(() => {
    const unsub = store.subscribe(s => setOpen(s.panelOpen))
    return () => unsub()
  }, [store])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') store.setState({ panelOpen: false })
    }
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, store])

  function update<K extends keyof Preferences>(key: K, value: Preferences[K]) {
    const current = store.getState().prefs
    store.setState({ prefs: { ...current, [key]: value } })
  }

  function exportPrefs() {
    const data = JSON.stringify({ prefs: store.getState().prefs }, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'ttt-ui-enhancer-preferences.json'
    a.click()
    URL.revokeObjectURL(a.href)
  }
  function importPrefs(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return
    file
      .text()
      .then(t => {
        try {
          const parsed = JSON.parse(t) as { prefs?: Partial<Preferences> } | Partial<Preferences>
          const current = store.getState().prefs
          if ('prefs' in parsed && parsed.prefs) {
            store.setState({ prefs: { ...current, ...parsed.prefs } })
            showToast('Preferences imported')
          } else if (parsed && Object.keys(parsed).length > 0) {
            store.setState({ prefs: { ...current, ...parsed } })
            showToast('Preferences imported')
          } else {
            showToast('Preferences file is empty')
          }
        } catch {
          showToast('Unable to import preferences')
        }
      })
      .catch(() => showToast('Unable to import preferences'))
  }

  return (
    <div class="ttt-enhancer" aria-live="polite">
      <button type="button" class="ttt-skip" onClick={() => store.getState().discovery.board?.focus?.()}>Skip to Game Board</button>
      <button class="ttt-gear" aria-label="Open settings" onClick={() => store.setState({ panelOpen: !open })}>
        <Gear/>
      </button>
      <div ref={panelRef} class={"ttt-panel" + (open ? ' open' : '')} role="dialog" aria-modal="false" aria-label="UI Enhancer Settings">
        <div class="ttt-panel-header"><div class="ttt-panel-title">UI Enhancer</div><button class="ttt-enhancer" aria-label="Close" onClick={() => store.setState({ panelOpen: false })} style="pointer-events:auto;background:none;border:none;color:inherit;cursor:pointer"><Close/></button></div>
        <div class="ttt-panel-body">
          <div class="ttt-panel-controls">
            <div class="ttt-row"><label htmlFor="theme">Theme</label><select id="theme" class="ttt-select" value={prefs.theme} onChange={(event: JSX.TargetedEvent<HTMLSelectElement>) => update('theme', event.currentTarget.value as Preferences['theme'])}>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="high-contrast">High Contrast</option>
              <option value="protanopia">Protanopia-safe</option>
              <option value="deuteranopia">Deuteranopia-safe</option>
              <option value="tritanopia">Tritanopia-safe</option>
            </select></div>

            <div class="ttt-row"><label htmlFor="font">Font Size</label><input id="font" class="ttt-input" type="range" min="0.9" max="1.3" step="0.05" value={prefs.fontScale} onInput={(event: JSX.TargetedEvent<HTMLInputElement>) => update('fontScale', clamp(parseFloat(event.currentTarget.value), 0.9, 1.3))}/> <span>{Math.round(prefs.fontScale*100)}%</span></div>

            <div class="ttt-row"><label htmlFor="rm">Reduce Motion</label><input id="rm" class="ttt-checkbox" type="checkbox" checked={prefs.reduceMotion} onChange={(event: JSX.TargetedEvent<HTMLInputElement>) => update('reduceMotion', event.currentTarget.checked)}/></div>

            <div class="ttt-row"><label htmlFor="gm">Ghost Marks</label><input id="gm" class="ttt-checkbox" type="checkbox" checked={prefs.ghostMarks} onChange={(event: JSX.TargetedEvent<HTMLInputElement>) => update('ghostMarks', event.currentTarget.checked)}/></div>

            <div class="ttt-row"><label htmlFor="snd">Sounds</label><input id="snd" class="ttt-checkbox" type="checkbox" checked={prefs.sounds} onChange={(event: JSX.TargetedEvent<HTMLInputElement>) => update('sounds', event.currentTarget.checked)}/></div>

            <div class="ttt-row"><label htmlFor="vol">Volume</label><input id="vol" class="ttt-input" type="range" min="0" max="1" step="0.05" value={prefs.volume} onInput={(event: JSX.TargetedEvent<HTMLInputElement>) => update('volume', clamp(parseFloat(event.currentTarget.value), 0, 1))}/> <span>{Math.round(prefs.volume*100)}%</span></div>

            <div class="ttt-row"><label htmlFor="hap">Haptics</label><input id="hap" class="ttt-checkbox" type="checkbox" checked={prefs.haptics} onChange={(event: JSX.TargetedEvent<HTMLInputElement>) => update('haptics', event.currentTarget.checked)}/></div>

            <div class="ttt-row"><label htmlFor="tts">Tooltips</label><input id="tts" class="ttt-checkbox" type="checkbox" checked={prefs.tooltips} onChange={(event: JSX.TargetedEvent<HTMLInputElement>) => update('tooltips', event.currentTarget.checked)}/></div>

            <div class="ttt-row"><label htmlFor="tips">Tips on Start</label><input id="tips" class="ttt-checkbox" type="checkbox" checked={prefs.tipsOnStart} onChange={(event: JSX.TargetedEvent<HTMLInputElement>) => update('tipsOnStart', event.currentTarget.checked)}/></div>

            <div class="ttt-row"><label htmlFor="dys">Dyslexia-friendly Font</label><input id="dys" class="ttt-checkbox" type="checkbox" checked={prefs.dyslexiaFont} onChange={(event: JSX.TargetedEvent<HTMLInputElement>) => update('dyslexiaFont', event.currentTarget.checked)}/></div>

            <div style="display:flex; gap:8px; align-items:center;">
              <button class="ttt-enhancer" onClick={exportPrefs} style="pointer-events:auto;background:var(--color-surface);border:1px solid rgba(255,255,255,.15);border-radius:8px;padding:6px 10px;color:inherit;cursor:pointer">Export</button>
              <label class="ttt-enhancer" style="pointer-events:auto;background:var(--color-surface);border:1px solid rgba(255,255,255,.15);border-radius:8px;padding:6px 10px;color:inherit;cursor:pointer">
                Import <input type="file" accept="application/json" style="display:none" onChange={importPrefs}/>
              </label>
              <span style="display:inline-flex; align-items:center; gap:6px; opacity:.8"><Info/> Preferences stored locally</span>
            </div>
          </div>
          <div style="margin-top:10px; display:flex; gap:8px; align-items:center; opacity:.8"><Help/>Press ? for keyboard shortcuts</div>
        </div>
      </div>
    </div>
  )
}
