import { h } from 'preact'
import { useEffect, useRef, useState } from 'preact/hooks'

type Props = { text: string; children: any }
export function Tooltip({ text, children }: Props) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current?.firstElementChild as HTMLElement | null
    if (!el) return
    let tid: any
    const onEnter = (e: MouseEvent) => { clearTimeout(tid); tid = setTimeout(() => setOpen(true), 300); setPos({ x: e.clientX + 8, y: e.clientY + 8 }) }
    const onLeave = () => { clearTimeout(tid); setOpen(false) }
    const onMove = (e: MouseEvent) => setPos({ x: e.clientX + 8, y: e.clientY + 8 })
    el.addEventListener('mouseenter', onEnter)
    el.addEventListener('mouseleave', onLeave)
    el.addEventListener('mousemove', onMove)
    el.addEventListener('focus', () => setOpen(true))
    el.addEventListener('blur', () => setOpen(false))
    return () => {
      el.removeEventListener('mouseenter', onEnter)
      el.removeEventListener('mouseleave', onLeave)
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('focus', () => setOpen(true))
      el.removeEventListener('blur', () => setOpen(false))
    }
  }, [])

  return (
    <div ref={ref} class="ttt-enhancer" style="display:inline-block; position:relative;">
      {children}
      <div class={"ttt-tooltip" + (open ? ' show' : '')} style={`left:${pos.x}px; top:${pos.y}px;`} role="tooltip">{text}</div>
    </div>
  )
}

