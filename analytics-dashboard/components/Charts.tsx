"use client";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

export function AnalyticsCharts({ data }: { data: any }) {
  const colors = ['#60a5fa', '#34d399', '#fbbf24', '#f87171', '#a78bfa'];
  return (
    <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
      <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8, padding: 12 }}>
        <h2 style={{ margin: 0, marginBottom: 8 }}>Games per day</h2>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data.days}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="day" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Line type="monotone" dataKey="games" stroke="#60a5fa" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8, padding: 12 }}>
        <h2 style={{ margin: 0, marginBottom: 8 }}>Outcome distribution</h2>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={data.outcome} dataKey="value" nameKey="label" outerRadius={80} label>
              {data.outcome.map((_: any, i: number) => (
                <Cell key={i} fill={colors[i % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8, padding: 12 }}>
        <h2 style={{ margin: 0, marginBottom: 8 }}>Game durations (sec)</h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data.durations}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="bin" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Bar dataKey="count" fill="#34d399" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8, padding: 12 }}>
        <h2 style={{ margin: 0, marginBottom: 8 }}>Active hours</h2>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data.hours}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="hour" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Line type="monotone" dataKey="active" stroke="#a78bfa" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8, padding: 12 }}>
        <h2 style={{ margin: 0, marginBottom: 8 }}>AI difficulty usage</h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data.ai}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="difficulty" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Bar dataKey="count" fill="#fbbf24" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

