export function ensureOverlayRoot(): HTMLElement {
  const id = 'ttt-gamify-root';
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement('div');
    el.id = id;
    el.className = 'ttt-gamify-root ttt-gamify';
    const style = document.createElement('style');
    style.textContent = `
      .ttt-gamify-root { position: fixed; inset: 0; pointer-events: none; z-index: 2147483000; }
      .ttt-gamify * { box-sizing: border-box; }
      .ttt-gamify [data-ui] { pointer-events: auto; }
      .ttt-gamify .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }
      @media (prefers-reduced-motion: reduce) {
        .ttt-gamify .animated { transition: none !important; animation: none !important; }
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(el);
  }
  return el;
}

