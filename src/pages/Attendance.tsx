import { useState, useEffect } from 'react';

type RecordData = {
  id: string;
  time: number;
  name: string;
  site: string;
  distance: number;
  accuracy: number;
  score: number;
  status: string;
  type: string;
};

export default function Attendance() {
  const [records, setRecords] = useState<RecordData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [siteFilter, setSiteFilter] = useState('ALL');

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || 'https://kehadiran-backend.onrender.com';
    fetch(`${apiUrl}/api/v1/admin/attendance`)
      .then(r => r.json())
      .then(json => {
        if (json.success) setRecords(json.data);
      })
      .catch(e => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  const filtered = records.filter((r) => {
    if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
    if (siteFilter !== 'ALL' && r.site !== siteFilter) return false;
    if (search && !r.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  };

  return (
    <div>
      <div className="page-header">
        <h2>Rekod Kehadiran</h2>
        <p>Semua rekod clock-in dan clock-out</p>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <input
          className="filter-input"
          placeholder="🔍 Cari nama pekerja..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ minWidth: 220 }}
        />
        <input className="filter-input" type="date" defaultValue="2026-04-09" />
        <input className="filter-input" type="date" defaultValue="2026-04-09" />
        <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="ALL">Semua Status</option>
          <option value="APPROVED">Lulus</option>
          <option value="APPROVED_FLAGGED">Ditanda</option>
          <option value="REJECTED">Ditolak</option>
        </select>
        <select className="filter-select" value={siteFilter} onChange={(e) => setSiteFilter(e.target.value)}>
          <option value="ALL">Semua Tapak</option>
          <option value="Tapak Alpha">Tapak Alpha</option>
          <option value="Tapak Beta">Tapak Beta</option>
          <option value="Tapak Gamma">Tapak Gamma</option>
        </select>
        <button className="btn btn-outline btn-sm" style={{ marginLeft: 'auto' }}>
          📥 Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Masa</th>
              <th>Tarikh</th>
              <th>Nama</th>
              <th>Jenis</th>
              <th>Tapak</th>
              <th>Jarak (m)</th>
              <th>GPS (m)</th>
              <th>Score</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr
                key={r.id}
                className={
                  r.status === 'APPROVED' ? 'row-approved' :
                  r.status === 'APPROVED_FLAGGED' ? 'row-flagged' : 'row-rejected'
                }
                style={{ cursor: 'pointer' }}
              >
                <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{formatTime(r.time)}</td>
                <td>{formatDate(r.time)}</td>
                <td style={{ fontWeight: 600 }}>{r.name}</td>
                <td>
                  <span style={{ color: r.type === 'CLOCK_IN' ? '#10b981' : '#ef4444', fontWeight: 600 }}>
                    {r.type === 'CLOCK_IN' ? '→ Masuk' : '← Keluar'}
                  </span>
                </td>
                <td>{r.site}</td>
                <td>{r.distance}</td>
                <td style={{ color: r.accuracy > 20 ? '#ef4444' : '#10b981' }}>{r.accuracy}</td>
                <td>
                  <span style={{
                    fontWeight: 700,
                    color: r.score >= 70 ? '#ef4444' : r.score >= 30 ? '#f59e0b' : '#10b981',
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

      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', color: '#64748b', fontSize: 13 }}>
        <span>Menunjukkan {filtered.length} dari {records.length} rekod {loading && '(Loading...)'}</span>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-outline btn-sm">← Sebelum</button>
          <button className="btn btn-outline btn-sm">Seterusnya →</button>
        </div>
      </div>
    </div>
  );
}
