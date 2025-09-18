import http from 'k6/http';
import ws from 'k6/ws';
import { sleep, check } from 'k6';

export const options = {
  vus: Number(__ENV.VUS || 20),
  duration: String(__ENV.DURATION || '2h'),
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<1000'],
    checks: ['rate>0.95']
  }
};

const API = `${__ENV.API_BASE_URL || 'http://localhost:8080'}`;
const WS_URL = `${__ENV.WS_BASE_URL || 'ws://localhost:8080/ws'}`;

export default function () {
  // mix of REST and WS
  const r = http.get(`${API}/api/health`);
  check(r, { 'health 200': (x) => x.status === 200 });

  const room = `ROOM-${__VU}-${Date.now()}`;
  const res = ws.connect(WS_URL, {}, function (socket) {
    socket.setTimeout(function () { socket.close(); }, 3000);
    socket.on('open', function () {
      socket.send(JSON.stringify({ type: 'join', roomId: room }));
      socket.send(JSON.stringify({ type: 'move', index: Math.floor(Math.random()*9) }));
    });
  });
  check(res, { 'ws ok': (r) => r && r.status === 101 });
  sleep(1);
}

export function handleSummary(data) {
  return { [__ENV.K6_SUMMARY_EXPORT || 'summary.json']: JSON.stringify(data, null, 2) };
}

