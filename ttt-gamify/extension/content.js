(() => {
  try {
    const s = document.createElement('script');
    s.src = chrome.runtime.getURL('overlay.iife.js');
    s.defer = true;
    (document.head || document.documentElement).appendChild(s);
  } catch (e) {
    console.warn('[Gamify] Failed to inject overlay', e);
  }
})();

