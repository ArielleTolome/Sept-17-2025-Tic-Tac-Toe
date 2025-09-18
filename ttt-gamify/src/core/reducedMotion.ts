export function getReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

