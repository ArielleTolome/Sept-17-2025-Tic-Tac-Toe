export function vibrate(ms = 10) {
  if (!('vibrate' in navigator)) return
  try {
    navigator.vibrate(ms)
  } catch {
    /* vibration support is optional; ignore failures */
  }
}
