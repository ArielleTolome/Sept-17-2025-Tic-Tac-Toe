import { useCallback, useEffect, useMemo, useRef, useState } from 'preact/hooks'

import type { Store } from '../store/prefs'
import { Arrow, Close } from './Icons'

type Step = { key: string; title: string; body: string; anchor?: HTMLElement | null }

const KEY = 'ttt-ui-enhancer:coach-dismissed'

export function CoachMarks({ store }: { store: Store }) {
  const [open, setOpen] = useState(false)
  const [idx, setIdx] = useState(0)
  const highlight = useRef<HTMLDivElement>(null)
  const panel = useRef<HTMLDivElement>(null)

  const { prefs, discovery } = store.getState()

  const steps = useMemo<Step[]>(() => {
    const newGameAnchor = findHostElement(['[data-new]', '.new-game', 'button'])
    return [
      { key: 'board', title: 'Game Board', body: 'Overlay adds focus rings, previews, and winning animations.', anchor: discovery.board || undefined },
      { key: 'new', title: 'New Game', body: 'Use the host app’s new game button to restart. We never replace controls.', anchor: newGameAnchor || undefined },
      { key: 'outcome', title: 'Outcome', body: 'Wins show an animated line and optional confetti.', anchor: discovery.outcome || discovery.board || undefined },
    ]
  }, [discovery.board, discovery.outcome])

  useEffect(() => {
    if (!prefs.tipsOnStart) return
    if (localStorage.getItem(KEY) === '1') return
    const timer = window.setTimeout(() => setOpen(true), 800)
    return () => window.clearTimeout(timer)
  }, [prefs.tipsOnStart])

  const place = useCallback(() => {
    if (!open) return
    const current = steps[idx]
    if (!current?.anchor) return
    const rect = current.anchor.getBoundingClientRect()
    const highlightEl = highlight.current
    const panelEl = panel.current
    if (!highlightEl || !panelEl) return

    highlightEl.style.left = `${rect.left - 6}px`
    highlightEl.style.top = `${rect.top - 6}px`
    highlightEl.style.width = `${rect.width + 12}px`
    highlightEl.style.height = `${rect.height + 12}px`

    const px = Math.min(window.innerWidth - panelEl.offsetWidth - 12, Math.max(12, rect.left + rect.width + 10))
    const py = Math.min(window.innerHeight - panelEl.offsetHeight - 12, Math.max(12, rect.top))
    panelEl.style.left = `${px}px`
    panelEl.style.top = `${py}px`
  }, [idx, open, steps])

  useEffect(() => {
    if (!open) return
    place()
    const anchor = steps[idx]?.anchor || document.documentElement
    const ro = new ResizeObserver(() => place())
    if (anchor) ro.observe(anchor)
    window.addEventListener('scroll', place, true)
    return () => {
      ro.disconnect()
      window.removeEventListener('scroll', place, true)
    }
  }, [idx, open, place, steps])

  function next() { setIdx(i => Math.min(i+1, steps.length-1)) }
  function prev() { setIdx(i => Math.max(i-1, 0)) }
  function close() { setOpen(false) }
  function dontShow() { localStorage.setItem(KEY, '1'); setOpen(false) }

  if (!open) return null
  const s = steps[idx]
  return (
    <div class="ttt-enhancer" aria-live="polite">
      <div class={"ttt-coach-scrim open"} />
      <div class="ttt-coach-highlight" ref={highlight} />
      <div class="ttt-coach-panel" ref={panel} role="dialog" aria-label={s.title}>
        <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; margin-bottom:6px;">
          <div style="font-weight:600">{s.title}</div>
          <button class="ttt-enhancer" aria-label="Close" onClick={close} style="pointer-events:auto;background:none;border:none;color:inherit;cursor:pointer"><Close/></button>
        </div>
        <div style="opacity:.9; margin-bottom:8px;">{s.body}</div>
        <div style="display:flex; justify-content:space-between; align-items:center; gap:8px;">
          <button class="ttt-enhancer" onClick={dontShow} style="pointer-events:auto;background:none;border:none;color:inherit;opacity:.8;cursor:pointer">Don’t show again</button>
          <div style="display:flex; align-items:center; gap:6px;">
            <button disabled={idx===0} class="ttt-enhancer" onClick={prev} style="pointer-events:auto;background:none;border:1px solid rgba(255,255,255,.15);border-radius:8px;padding:4px 8px;color:inherit;opacity:${idx===0?'.5':'1'};cursor:${idx===0?'not-allowed':'pointer'}">Prev</button>
            <button disabled={idx===steps.length-1} class="ttt-enhancer" onClick={next} style="pointer-events:auto;background:var(--color-accent);border:none;border-radius:8px;padding:4px 10px;color:black;cursor:${idx===steps.length-1?'not-allowed':'pointer'}">Next <Arrow/></button>
          </div>
        </div>
        <div style="margin-top:6px; font-size:12px; opacity:.7">Step {idx+1} of {steps.length}</div>
      </div>
    </div>
  )
}

function findHostElement(selectors: string[]): HTMLElement | null {
  for (const selector of selectors) {
    const nodes = document.querySelectorAll<HTMLElement>(selector)
    for (const node of nodes) {
      if (!node.closest('.ttt-enhancer')) return node
    }
  }
  return null
}
