"use client";
import useSWR from 'swr';
import { AnalyticsCharts } from '../components/Charts';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function Page() {
  const { data } = useSWR('/cache/analytics.json', fetcher);
  return (
    <section>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>Analytics Dashboard</h1>
      {!data ? <p>Loading…</p> : <AnalyticsCharts data={data} />}
      <p style={{ color: '#94a3b8', marginTop: 12 }}>Data is cached server‑side to avoid hammering the core API.</p>
    </section>
  );
}

