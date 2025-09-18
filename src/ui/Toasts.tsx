import { useEffect, useState } from 'preact/hooks'

type Toast = { id: number, text: string }
let nextId = 1
const listeners = new Set<(t: Toast) => void>()
export function showToast(text: string) { const t = { id: nextId++, text }; listeners.forEach(l => l(t)) }

export function Toasts() {
  const [items, setItems] = useState<Toast[]>([])
  useEffect(() => {
    const on = (t: Toast) => {
      setItems(prev => [...prev, t])
      setTimeout(() => setItems(prev => prev.filter(i => i.id !== t.id)), 2400)
    }
    listeners.add(on)
    return () => { listeners.delete(on) }
  }, [])
  return (
    <div aria-live="polite" class="ttt-toasts">
      {items.map(it => (
        <div key={it.id} class="ttt-toast" role="status">{it.text}</div>
      ))}
    </div>
  )
}
