import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const weeklyData = [
  { day: 'Isn', hadir: 45, tidak_hadir: 3 },
  { day: 'Sel', hadir: 42, tidak_hadir: 6 },
  { day: 'Rab', hadir: 47, tidak_hadir: 1 },
  { day: 'Kha', hadir: 44, tidak_hadir: 4 },
  { day: 'Jum', hadir: 40, tidak_hadir: 8 },
  { day: 'Sab', hadir: 20, tidak_hadir: 0 },
  { day: 'Ahd', hadir: 0, tidak_hadir: 0 },
];

type RecordData = {
  id: string;
  time: number;
  name: string;
  site: string;
  score: number;
  status: string;
};

import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const [recentClockIns, setRecentClockIns] = useState<RecordData[]>([]);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    fetch(`${apiUrl}/api/v1/admin/attendance`)
      .then(r => r.json())
      .then(json => {
        if (json.success) setRecentClockIns(json.data.slice(0, 5));
      })
      .catch(e => console.error(e));
  }, []);

  const formatTime = (ts: number | string) => {
    if (typeof ts === 'string') return ts;
    const d = new Date(ts);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };
  return (
    <div>
      <div className="page-header">
        <h2>Dashboard</h2>
        <p>Gambaran keseluruhan kehadiran hari ini</p>
      </div>

      {/* Alert Banner */}
      <div className="alert-banner alert-warning">
        ⚠️ <strong>5 rekod</strong> memerlukan semakan segera.
        <button onClick={() => navigate('/flagged')} style={{ marginLeft: 'auto', color: '#92400e', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', fontSize: 14 }}>Semak →</button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">Hadir Hari Ini</span>
            <div className="stat-card-icon" style={{ background: '#ecfdf5' }}>✅</div>
          </div>
          <div className="stat-card-value">42</div>
          <div className="stat-card-change positive">↑ 5% dari semalam</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">Tidak Hadir</span>
            <div className="stat-card-icon" style={{ background: '#fef2f2' }}>❌</div>
          </div>
          <div className="stat-card-value">6</div>
          <div className="stat-card-change negative">↑ 2 orang</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">Ditanda</span>
            <div className="stat-card-icon" style={{ background: '#fffbeb' }}>⚠️</div>
          </div>
          <div className="stat-card-value" style={{ color: '#f59e0b' }}>5</div>
          <div className="stat-card-change negative">Perlu semakan</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">Lewat</span>
            <div className="stat-card-icon" style={{ background: '#eff6ff' }}>🕐</div>
          </div>
          <div className="stat-card-value">3</div>
          <div className="stat-card-change">Selepas 08:00</div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <div className="chart-container">
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>
            Kehadiran 7 Hari Lepas
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="hadir" fill="#10b981" radius={[4, 4, 0, 0]} name="Hadir" />
              <Bar dataKey="tidak_hadir" fill="#ef4444" radius={[4, 4, 0, 0]} name="Tidak Hadir" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>
            Statistik Tapak Projek
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { name: 'Tapak Alpha', count: 25, total: 30, pct: 83 },
              { name: 'Tapak Beta', count: 12, total: 15, pct: 80 },
              { name: 'Tapak Gamma', count: 5, total: 8, pct: 63 },
            ].map((site) => (
              <div key={site.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                  <span style={{ fontWeight: 600 }}>{site.name}</span>
                  <span style={{ color: '#64748b' }}>{site.count}/{site.total} ({site.pct}%)</span>
                </div>
                <div style={{ height: 8, background: '#e2e8f0', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${site.pct}%`,
                    background: site.pct >= 80 ? '#10b981' : site.pct >= 60 ? '#f59e0b' : '#ef4444',
                    borderRadius: 4,
                    transition: 'width 0.6s ease',
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Clock-Ins Table */}
      <div className="data-table-container">
        <div className="table-header">
          <span className="table-title">Clock-In Terkini</span>
          <span style={{ color: '#64748b', fontSize: 12 }}>Auto-refresh setiap 30 saat</span>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Masa</th>
              <th>Nama</th>
              <th>Tapak</th>
              <th>Anomaly Score</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentClockIns.map((r) => (
              <tr key={r.id} className={
                r.status === 'APPROVED' ? 'row-approved' :
                r.status === 'APPROVED_FLAGGED' ? 'row-flagged' : 'row-rejected'
              }>
                <td style={{ fontWeight: 600, fontFamily: 'monospace' }}>{formatTime(r.time)}</td>
                <td>{r.name}</td>
                <td>{r.site}</td>
                <td>
                  <span style={{
                    color: r.score >= 70 ? '#ef4444' : r.score >= 30 ? '#f59e0b' : '#10b981',
                    fontWeight: 700,
                  }}>
                    {r.score}
                  </span>
                </td>
                <td>
                  <span className={
                    r.status === 'APPROVED' ? 'badge badge-success' :
                    r.status === 'APPROVED_FLAGGED' ? 'badge badge-warning' : 'badge badge-danger'
                  }>
                    {r.status === 'APPROVED' ? 'Lulus' :
                     r.status === 'APPROVED_FLAGGED' ? 'Ditanda' : 'Ditolak'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
