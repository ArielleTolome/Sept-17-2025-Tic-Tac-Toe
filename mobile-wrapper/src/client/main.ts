import { App } from '@capacitor/app';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Network } from '@capacitor/network';

const PUBLIC_WEB_URL = (import.meta as any).env.VITE_PUBLIC_WEB_URL as string;
const WS_BASE_URL = (import.meta as any).env.VITE_WS_BASE_URL as string;

const web = document.getElementById('web') as HTMLIFrameElement;
const statusEl = document.getElementById('status')!;
const offlineEl = document.getElementById('offline')!;

function setOnline(online: boolean) {
  statusEl.textContent = online ? 'Online' : 'Offline';
  offlineEl.classList.toggle('hidden', online);
}

async function init() {
  // Load home
  navigate(PUBLIC_WEB_URL);

  // Buttons
  document.getElementById('refresh')!.addEventListener('click', () => web.contentWindow?.location.reload());
  document.getElementById('home')!.addEventListener('click', () => navigate(PUBLIC_WEB_URL));

  // Network
  const net = await Network.getStatus();
  setOnline(net.connected);
  Network.addListener('networkStatusChange', (s) => setOnline(s.connected));

  // Deep links: ttt://game/:id
  App.addListener('appUrlOpen', (data) => {
    try {
      const url = new URL(data.url);
      if (url.protocol.startsWith('ttt')) {
        const parts = url.pathname.split('/').filter(Boolean);
        if (parts[0] === 'game' && parts[1]) {
          navigate(`${PUBLIC_WEB_URL}/#/replay/${encodeURIComponent(parts[1])}?autoPlay=1`);
        }
      }
    } catch {}
  });

  // Request notification permission for "your turn"
  await LocalNotifications.requestPermissions();
}

function navigate(url: string) {
  web.src = url;
}

// Example: subscribe to WS and notify on "your turn"
// This is a minimal demo; actual implementation depends on server protocol.
function watchYourTurn(roomId: string) {
  if (!WS_BASE_URL) return;
  const ws = new WebSocket(WS_BASE_URL);
  ws.onopen = () => ws.send(JSON.stringify({ type: 'join', roomId }));
  ws.onmessage = (ev) => {
    try {
      const msg = JSON.parse(ev.data as string);
      if (msg.type === 'state' && msg.payload?.yourTurn) {
        LocalNotifications.schedule({
          notifications: [
            {
              id: Date.now() % 100000,
              title: 'Your move!',
              body: 'It\'s your turn in Tic-Tac-Toe.',
              schedule: { at: new Date(Date.now() + 10) }
            }
          ]
        });
      }
    } catch {}
  };
}

init();

export { navigate, watchYourTurn };

