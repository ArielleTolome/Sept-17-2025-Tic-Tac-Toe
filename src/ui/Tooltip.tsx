import type { ComponentChildren } from 'preact'
import { useEffect, useRef, useState } from 'preact/hooks'

type Props = { text: string; children: ComponentChildren }

export function Tooltip({ text, children }: Props) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current?.firstElementChild as HTMLElement | null
    if (!el) return undefined

    let timer: ReturnType<typeof setTimeout> | undefined
    const updatePosition = (event: MouseEvent) => {
      setPos({ x: event.clientX + 8, y: event.clientY + 8 })
    }
    const handleEnter = (event: MouseEvent) => {
      clearTimeout(timer)
      updatePosition(event)
      timer = setTimeout(() => setOpen(true), 300)
    }
    const handleLeave = () => {
      clearTimeout(timer)
      setOpen(false)
    }
    const handleFocus = () => setOpen(true)
    const handleBlur = () => setOpen(false)

    el.addEventListener('mouseenter', handleEnter)
    el.addEventListener('mouseleave', handleLeave)
    el.addEventListener('mousemove', updatePosition)
    el.addEventListener('focus', handleFocus)
    el.addEventListener('blur', handleBlur)

    return () => {
      clearTimeout(timer)
      el.removeEventListener('mouseenter', handleEnter)
      el.removeEventListener('mouseleave', handleLeave)
      el.removeEventListener('mousemove', updatePosition)
      el.removeEventListener('focus', handleFocus)
      el.removeEventListener('blur', handleBlur)
    }
  }, [])

  return (
    <div ref={ref} class="ttt-enhancer" style="display:inline-block; position:relative;">
      {children}
      <div class={"ttt-tooltip" + (open ? ' show' : '')} style={`left:${pos.x}px; top:${pos.y}px;`} role="tooltip">{text}</div>
    </div>
  )
}
