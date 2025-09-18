export function burstConfetti(container: HTMLElement, reduceMotion: boolean) {
  if (reduceMotion) return
  const canvas = document.createElement('canvas')
  canvas.width = container.clientWidth
  canvas.height = container.clientHeight
  canvas.style.position = 'absolute'
  canvas.style.inset = '0'
  canvas.style.pointerEvents = 'none'
  container.appendChild(canvas)

  const ctx = canvas.getContext('2d')!
  const particles = Array.from({ length: 120 }, () => (
    {
      x: Math.random() * canvas.width,
      y: -10,
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * 2 + 2,
      size: Math.random() * 6 + 3,
      color: randomColor(),
      life: Math.random() * 120 + 60
    }
  ))
  let frame = 0
  function tick() {
    frame++
    ctx.clearRect(0,0,canvas.width,canvas.height)
    let alive = 0
    for (const p of particles) {
      p.x += p.vx
      p.y += p.vy
      p.vy += 0.05
      p.life -= 1
      if (p.life > 0 && p.y < canvas.height + 20) {
        alive++
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(((p.x + p.y + frame) % 360) * Math.PI/180)
        ctx.fillStyle = p.color
        ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size)
        ctx.restore()
      }
    }
    if (alive > 0 && frame < 600) requestAnimationFrame(tick)
    else canvas.remove()
  }
  requestAnimationFrame(tick)
}

function randomColor() {
  const colors = ['#6aa9ff', '#30d158', '#ff453a', '#ffd60a', '#f97316', '#22c55e']
  return colors[Math.floor(Math.random()*colors.length)]
}
