import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  vus: Number(__ENV.VUS || 2),
  duration: String(__ENV.DURATION || '10s'),
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<500']
  }
};

const API = `${__ENV.API_BASE_URL || 'http://localhost:8080'}`;

export default function () {
  const r1 = http.get(`${API}/api/health`);
  check(r1, { 'health ok': (r) => r.status === 200 });
  sleep(1);
}

export function handleSummary(data) {
  return { [__ENV.K6_SUMMARY_EXPORT || 'summary.json']: JSON.stringify(data, null, 2) };
}

