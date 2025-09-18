import { h } from 'preact'
import { useEffect, useMemo, useRef, useState } from 'preact/hooks'
import type { Store } from '../store/prefs'
import { getGameStatus } from '../store/state'
import { liveSay, isTypingInTextField } from '../utils/a11y'
import { burstConfetti } from '../utils/confetti'
import { playDraw, playPlace, playWin } from '../utils/sound'
import { vibrate } from '../utils/haptics'
import { Settings } from './SettingsPanel'
import { Toasts, showToast } from './Toasts'
import { ShortcutsOverlay } from './ShortcutsOverlay'
import { CoachMarks } from './CoachMarks'

type Props = { store: Store, liveRegionId: string }

export function RootOverlay({ store, liveRegionId }: Props) {
  const [status, setStatus] = useState(() => getGameStatus(store))
  const [attached, setAttached] = useState(false)
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
  }, [])

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
  }, [status.winner, status.draw, status.board, status.next])

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
        const active = document.activeElement
        if (!cells.includes(active as any) && cells[0]) cells[0].focus?.()
      }
    }
    window.addEventListener('keydown', onKey, { capture: true })
    return () => window.removeEventListener('keydown', onKey, { capture: true } as any)
  }, [])

  // Maintain overlay position relative to board
  const style = useMemo(() => {
    const b = store.getState().discovery.board
    if (!b) return { display: 'none' } as any
    const r = b.getBoundingClientRect()
    return { position: 'fixed', left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px` }
  }, [store.getState().discovery.board, status.board])

  return (
    <div class="ttt-enhancer">
      {!attached && (
        <div class="ttt-toast" style="position:fixed; right:12px; bottom:12px; pointer-events:none;">UI Enhancer idle—app not detected.</div>
      )}
      <div ref={overlayRef} class="ttt-overlay" style={style as any} aria-hidden="true">
        <GridDecoration store={store} statusKey={`${status.board.join('')}-${status.winLine?.join('-') || 'none'}`} />
      </div>
      <Settings store={store} />
      <ShortcutsOverlay store={store} />
      <CoachMarks store={store} />
      <Toasts />
    </div>
  )
}

function GridDecoration({ store, statusKey }: { store: Store, statusKey: string }) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    draw()
    const ro = new ResizeObserver(draw)
    const root = canvasRef.current?.parentElement
    if (root) ro.observe(root)
    return () => ro.disconnect()
  }, [statusKey])

  useEffect(() => {
    const c = store.getState().discovery.cells || []
    const enter = (i: number) => () => setHoverIdx(i)
    const leave = () => setHoverIdx(null)
    c.forEach((el, i) => { el.addEventListener('mouseenter', enter(i)); el.addEventListener('mouseleave', leave); el.addEventListener('focus', enter(i)); el.addEventListener('blur', leave) })
    return () => c.forEach((el, i) => { el.removeEventListener('mouseenter', enter(i)); el.removeEventListener('mouseleave', leave); el.removeEventListener('focus', enter(i)); el.removeEventListener('blur', leave) })
  }, [store.getState().discovery.cells])

  function draw() {
    const canvas = canvasRef.current
    if (!canvas) return
    const parent = canvas.parentElement as HTMLElement
    canvas.width = parent.clientWidth
    canvas.height = parent.clientHeight
    const ctx = canvas.getContext('2d')!
    ctx.clearRect(0,0,canvas.width,canvas.height)

    // draw crisp grid
    const w = canvas.width, h = canvas.height
    const cs = Math.min(w, h) / 3
    const ox = (w - cs*3) / 2
    const oy = (h - cs*3) / 2
    ctx.strokeStyle = 'rgba(255,255,255,0.18)'
    ctx.lineWidth = 2
    for (let i=1;i<3;i++) {
      const x = Math.round(ox + cs*i) + 0.5
      const y = Math.round(oy + cs*i) + 0.5
      ctx.beginPath(); ctx.moveTo(x, oy); ctx.lineTo(x, oy + cs*3); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(ox, y); ctx.lineTo(ox + cs*3, y); ctx.stroke()
    }

    // winning line
    const status = getGameStatus(store)
    if (status.winLine) {
      ctx.strokeStyle = getComputedStyle(document.querySelector('.ttt-enhancer-root') || document.body).getPropertyValue('--color-win').trim() || '#30d158'
      ctx.lineWidth = 6
      ctx.lineCap = 'round'
      const [a,b,c] = status.winLine
      const p = (i: number) => ({
        x: ox + cs*(i%3) + cs/2,
        y: oy + cs*Math.floor(i/3) + cs/2,
      })
      const p0 = p(a), p1 = p(c)
      animateLine(ctx, p0.x, p0.y, p1.x, p1.y)
    }

    // ghost mark
    const prefs = store.getState().prefs
    if (prefs.ghostMarks && hoverIdx != null) {
      const status = getGameStatus(store)
      const i = hoverIdx
      const cx = ox + cs*(i%3) + cs/2
      const cy = oy + cs*Math.floor(i/3) + cs/2
      // focus ring around the hovered/focused cell
      ctx.save()
      ctx.strokeStyle = 'rgba(106,169,255,0.75)'
      ctx.lineWidth = 2
      ctx.setLineDash([6,4])
      ctx.strokeRect(ox + cs*(i%3) + 6, oy + cs*Math.floor(i/3) + 6, cs - 12, cs - 12)
      ctx.restore()
      ctx.save()
      ctx.globalAlpha = 0.35
      ctx.strokeStyle = getComputedStyle(document.querySelector('.ttt-enhancer-root') || document.body).getPropertyValue('--color-accent').trim() || '#6aa9ff'
      ctx.lineWidth = 3
      if (status.next === 'X') {
        const s = cs*0.28
        ctx.beginPath(); ctx.moveTo(cx - s, cy - s); ctx.lineTo(cx + s, cy + s); ctx.stroke()
        ctx.beginPath(); ctx.moveTo(cx + s, cy - s); ctx.lineTo(cx - s, cy + s); ctx.stroke()
      } else {
        ctx.beginPath(); ctx.arc(cx, cy, cs*0.32, 0, Math.PI*2); ctx.stroke()
      }
      ctx.restore()
    }
  }

  return <canvas ref={canvasRef} class="ttt-canvas" aria-hidden="true"></canvas>
}

function animateLine(ctx: CanvasRenderingContext2D, x0: number, y0: number, x1: number, y1: number) {
  const dist = Math.hypot(x1-x0, y1-y0)
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
