import type { JSX } from 'preact'
import { useCallback, useEffect, useMemo, useRef, useState } from 'preact/hooks'

import type { Store } from '../store/prefs'
import { type GameStatus, getGameStatus } from '../store/state'
import { isTypingInTextField, liveSay } from '../utils/a11y'
import { burstConfetti } from '../utils/confetti'
import { vibrate } from '../utils/haptics'
import { playDraw, playPlace, playWin } from '../utils/sound'
import { CoachMarks } from './CoachMarks'
import { Settings } from './SettingsPanel'
import { ShortcutsOverlay } from './ShortcutsOverlay'
import { showToast, Toasts } from './Toasts'

type Props = { store: Store, liveRegionId: string }

export function RootOverlay({ store, liveRegionId }: Props) {
  const [status, setStatus] = useState(() => getGameStatus(store))
  const [attached, setAttached] = useState(() => !!store.getState().discovery.board)
  const overlayRef = useRef<HTMLDivElement>(null)
  const lastBoard = useRef<("X"|"O"|null)[]>(status.board)

  useEffect(() => {
    const unsub = store.subscribe(() => {
      const s = getGameStatus(store)
      setStatus(s)
      setAttached(!!store.getState().discovery.board)
    })
    setAttached(!!store.getState().discovery.board)
    return () => unsub()
  }, [store])

  // Announce status changes
  useEffect(() => {
    const p = store.getState().prefs
    // detect placement
    const before = lastBoard.current
    const after = status.board
    const placedIndex = after.findIndex((v, i) => v && v !== before[i])
    if (placedIndex >= 0) {
      if (p.sounds) playPlace(p.volume)
      if (p.haptics) vibrate(8)
    }
    lastBoard.current = status.board.slice()

    if (status.winner) {
      liveSay(liveRegionId, `${status.winner} wins!`)
      const pref = store.getState().prefs
      if (!pref.reduceMotion && overlayRef.current) burstConfetti(overlayRef.current, pref.reduceMotion)
      if (pref.sounds) playWin(pref.volume)
      showToast(`${status.winner} wins!`)
    } else if (status.draw) {
      liveSay(liveRegionId, `Game is a draw`)
      const pref = store.getState().prefs
      if (pref.sounds) playDraw(pref.volume)
      showToast('Draw game')
    } else {
      liveSay(liveRegionId, `${status.next}'s turn`)
    }
  }, [liveRegionId, status.board, status.draw, status.next, status.winner, store])

  // Keyboard shortcuts listener (non-invasive)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isTypingInTextField(e) || e.defaultPrevented) return
      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        store.setState({ shortcutsOpen: true })
      }
      // Arrow hinting: focus next cell if none focused
      if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) {
        const cells = store.getState().discovery.cells || []
        const active = document.activeElement as HTMLElement | null
        if (!cells.includes(active as HTMLElement) && cells[0]) cells[0].focus?.()
      }
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [store])

  // Maintain overlay position relative to board
  const boardElement = store.getState().discovery.board
  const overlayStyle = useMemo<JSX.CSSProperties>(() => {
    if (!boardElement) {
      return { display: 'none' }
    }
    const rect = boardElement.getBoundingClientRect()
    return {
      position: 'fixed',
      left: `${rect.left}px`,
      top: `${rect.top}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
    }
  }, [boardElement])

  return (
    <div class="ttt-enhancer">
      {!attached && (
        <div class="ttt-toast" style="position:fixed; right:12px; bottom:12px; pointer-events:none;">UI Enhancer idle—app not detected.</div>
      )}
      <div ref={overlayRef} class="ttt-overlay" style={overlayStyle} aria-hidden="true">
        <GridDecoration store={store} status={status} />
      </div>
      <Settings store={store} />
      <ShortcutsOverlay store={store} />
      <CoachMarks store={store} />
      <Toasts />
    </div>
  )
}

function GridDecoration({ status, store }: { status: GameStatus; store: Store }) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    const parent = canvas?.parentElement as HTMLElement | null
    if (!canvas || !parent) return

    canvas.width = parent.clientWidth
    canvas.height = parent.clientHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const w = canvas.width
    const h = canvas.height
    const cs = Math.min(w, h) / 3
    const ox = (w - cs * 3) / 2
    const oy = (h - cs * 3) / 2
    ctx.strokeStyle = 'rgba(255,255,255,0.18)'
    ctx.lineWidth = 2
    for (let i = 1; i < 3; i++) {
      const x = Math.round(ox + cs * i) + 0.5
      const y = Math.round(oy + cs * i) + 0.5
      ctx.beginPath()
      ctx.moveTo(x, oy)
      ctx.lineTo(x, oy + cs * 3)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(ox, y)
      ctx.lineTo(ox + cs * 3, y)
      ctx.stroke()
    }

    if (status.winLine) {
      ctx.strokeStyle = getComputedStyle(document.querySelector('.ttt-enhancer-root') || document.body).getPropertyValue('--color-win').trim() || '#30d158'
      ctx.lineWidth = 6
      ctx.lineCap = 'round'
      const [a, , c] = status.winLine
      const point = (index: number) => ({
        x: ox + cs * (index % 3) + cs / 2,
        y: oy + cs * Math.floor(index / 3) + cs / 2,
      })
      const start = point(a)
      const end = point(c)
      animateLine(ctx, start.x, start.y, end.x, end.y)
    }

    const prefs = store.getState().prefs
    if (prefs.ghostMarks && hoverIdx != null) {
      const index = hoverIdx
      const cx = ox + cs * (index % 3) + cs / 2
      const cy = oy + cs * Math.floor(index / 3) + cs / 2
      ctx.save()
      ctx.strokeStyle = 'rgba(106,169,255,0.75)'
      ctx.lineWidth = 2
      ctx.setLineDash([6, 4])
      ctx.strokeRect(ox + cs * (index % 3) + 6, oy + cs * Math.floor(index / 3) + 6, cs - 12, cs - 12)
      ctx.restore()
      ctx.save()
      ctx.globalAlpha = 0.35
      ctx.strokeStyle = getComputedStyle(document.querySelector('.ttt-enhancer-root') || document.body).getPropertyValue('--color-accent').trim() || '#6aa9ff'
      ctx.lineWidth = 3
      if (status.next === 'X') {
        const size = cs * 0.28
        ctx.beginPath()
        ctx.moveTo(cx - size, cy - size)
        ctx.lineTo(cx + size, cy + size)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(cx + size, cy - size)
        ctx.lineTo(cx - size, cy + size)
        ctx.stroke()
      } else {
        ctx.beginPath()
        ctx.arc(cx, cy, cs * 0.32, 0, Math.PI * 2)
        ctx.stroke()
      }
      ctx.restore()
    }
  }, [hoverIdx, status, store])

  useEffect(() => {
    draw()
    const ro = new ResizeObserver(draw)
    const parent = canvasRef.current?.parentElement
    if (parent) ro.observe(parent)
    return () => ro.disconnect()
  }, [draw])

  useEffect(() => {
    const currentCells = store.getState().discovery.cells ?? []
    if (!currentCells.length) return undefined
    const leave = () => setHoverIdx(null)
    const enterHandlers = currentCells.map((_, i) => () => setHoverIdx(i))
    currentCells.forEach((el, i) => {
      const enter = enterHandlers[i]
      el.addEventListener('mouseenter', enter)
      el.addEventListener('focus', enter)
      el.addEventListener('mouseleave', leave)
      el.addEventListener('blur', leave)
    })
    return () => {
      currentCells.forEach((el, i) => {
        const enter = enterHandlers[i]
        el.removeEventListener('mouseenter', enter)
        el.removeEventListener('focus', enter)
        el.removeEventListener('mouseleave', leave)
        el.removeEventListener('blur', leave)
      })
    }
  }, [status, store])

  return <canvas ref={canvasRef} class="ttt-canvas" aria-hidden="true"></canvas>
}

function animateLine(ctx: CanvasRenderingContext2D, x0: number, y0: number, x1: number, y1: number) {
  const steps = 24
  let t = 0
  const rm = matchMedia('(prefers-reduced-motion: reduce)').matches
  const drawSeg = () => {
    t++
    const p = rm ? 1 : Math.min(1, t/steps)
    const ex = x0 + (x1-x0)*p
    const ey = y0 + (y1-y0)*p
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(ex, ey); ctx.stroke()
    if (!rm && p < 1) requestAnimationFrame(drawSeg)
  }
  drawSeg()
}
