import ws from 'k6/ws';
import { check, sleep } from 'k6';

export const options = {
  vus: Number(__ENV.USERS || 20),
  duration: String(__ENV.DURATION || '1m'),
  thresholds: {
    checks: ['rate>0.95']
  }
};

const WS_URL = `${__ENV.WS_BASE_URL || 'ws://localhost:8080/ws'}`;

export default function () {
  const room = `ROOM-${__VU}-${Date.now()}`;
  const res = ws.connect(WS_URL, {}, function (socket) {
    socket.setTimeout(function () {
      socket.close();
    }, 5000);

    socket.on('open', function () {
      socket.send(JSON.stringify({ type: 'join', roomId: room }));
      // legal move
      socket.send(JSON.stringify({ type: 'move', index: 0 }));
      // illegal move (same cell)
      socket.send(JSON.stringify({ type: 'move', index: 0 }));
      // chat
      socket.send(JSON.stringify({ type: 'chat', message: 'hi' }));
    });

    socket.on('message', function (data) {
      // noop
    });
  });
  check(res, { 'connected': (r) => r && r.status === 101 });
  sleep(1);
}

export function handleSummary(data) {
  return { [__ENV.K6_SUMMARY_EXPORT || 'summary.json']: JSON.stringify(data, null, 2) };
}

