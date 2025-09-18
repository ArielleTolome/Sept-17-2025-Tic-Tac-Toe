import React, { useEffect, useRef, useState } from 'react';

export const App: React.FC = () => {
  const [url, setUrl] = useState<string>(localStorage.getItem('companion_url') || 'https://example.org');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => { localStorage.setItem('companion_url', url); }, [url]);

  const injectOverlay = () => {
    const frame = iframeRef.current;
    if (!frame) return;
    try {
      const doc = frame.contentDocument || frame.contentWindow?.document;
      if (!doc) return;
      const s = doc.createElement('script');
      s.src = new URL('../../dist/ttt-gamify.iife.js', window.location.href).toString();
      s.defer = true;
      doc.documentElement.appendChild(s);
    } catch (e) {
      alert('Unable to inject overlay due to cross-origin restrictions. Use the extension or userscript instead.');
    }
  };

  return (
    <div style={{ height: '100vh', display: 'grid', gridTemplateRows: 'auto 1fr' }}>
      <header style={{ padding: 8, display: 'flex', gap: 8, alignItems: 'center', borderBottom: '1px solid #ddd' }}>
        <strong>TTT Companion Hub</strong>
        <input style={{ flex: 1, padding: '6px 8px' }} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://host-app.example" />
        <button onClick={injectOverlay}>Inject Overlay</button>
      </header>
      <iframe ref={iframeRef} src={url} style={{ width: '100%', height: '100%', border: '0' }} title="Host App" />
    </div>
  );
};

