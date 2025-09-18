import http from 'k6/http';
import { check } from 'k6';

export const options = {
  scenarios: {
    constant_request_rate: {
      executor: 'constant-arrival-rate',
      rate: Number(__ENV.TARGET || 50),
      timeUnit: '1s',
      duration: String(__ENV.DURATION || '1m'),
      preAllocatedVUs: 50,
      maxVUs: 200
    }
  },
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<800']
  }
};

const API = `${__ENV.API_BASE_URL || 'http://localhost:8080'}`;

export default function () {
  const r = http.get(`${API}/api/health`);
  check(r, { '200': (x) => x.status === 200 });
}

export function handleSummary(data) {
  return { [__ENV.K6_SUMMARY_EXPORT || 'summary.json']: JSON.stringify(data, null, 2) };
}

