import { useEffect, useMemo, useRef, useState } from 'react';

type ServerMsg =
  | { type: 'queued' }
  | { type: 'matched'; roomId: string; url: string }
  | { type: 'error'; message: string };

export default function App() {
  const [name, setName] = useState('Player ' + Math.floor(Math.random()*1000));
  const [status, setStatus] = useState('idle');
  const [roomUrl, setRoomUrl] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const wsUrl = useMemo(() => {
    const loc = window.location;
    const proto = loc.protocol === 'https:' ? 'wss' : 'ws';
    return `${proto}://${loc.host}/lobby`;
  }, []);

  useEffect(() => () => wsRef.current?.close(), []);

  function connectAndFind() {
    setStatus('connecting');
    setRoomUrl(null);
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;
    ws.onopen = () => {
      ws.send(JSON.stringify({ type: 'hello', name }));
      ws.send(JSON.stringify({ type: 'find' }));
      setStatus('queued');
    };
    ws.onmessage = (ev) => {
      const msg = JSON.parse(ev.data) as ServerMsg;
      if (msg.type === 'queued') setStatus('queued');
      if (msg.type === 'matched') {
        setStatus('matched');
        setRoomUrl(msg.url);
      }
      if (msg.type === 'error') {
        setStatus('error');
      }
    };
    ws.onclose = () => setStatus('idle');
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">TTT Matchmaking Lobby</h1>
      <div className="card max-w-xl space-y-3">
        <label className="flex flex-col gap-1">
          <span className="text-sm">Display Name</span>
          <input className="input" value={name} onChange={(e)=>setName(e.target.value)} />
        </label>
        <button className="btn" onClick={connectAndFind} aria-label="Find Match">Find Match</button>
        <p>Status: {status}</p>
        {roomUrl && (
          <p>
            Matched! <a className="underline text-primary" href={roomUrl} target="_blank" rel="noreferrer">Open Room</a>
          </p>
        )}
      </div>
    </div>
  );
}

