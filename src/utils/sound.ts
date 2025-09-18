let ctx: AudioContext | null = null

export function playPlace(volume = 0.2) {
  beep(440, 0.05, volume)
}

export function playWin(volume = 0.25) {
  beep(660, 0.08, volume)
  setTimeout(() => beep(880, 0.12, volume), 90)
}

export function playDraw(volume = 0.25) {
  beep(330, 0.06, volume)
}

function beep(freq: number, duration: number, volume: number) {
  if (!ctx) { try { ctx = new AudioContext() } catch { return } }
  const o = ctx.createOscillator()
  const g = ctx.createGain()
  o.connect(g)
  g.connect(ctx.destination)
  o.type = 'sine'
  o.frequency.value = freq
  g.gain.value = volume
  o.start()
  o.stop(ctx.currentTime + duration)
}
