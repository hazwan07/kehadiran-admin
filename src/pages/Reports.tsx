import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const monthlyData = [
  { month: 'Jan', kehadiran: 95, anomali: 12 },
  { month: 'Feb', kehadiran: 92, anomali: 18 },
  { month: 'Mac', kehadiran: 97, anomali: 8 },
  { month: 'Apr', kehadiran: 94, anomali: 15 },
];

const topAnomalies = [
  { name: 'Kumar a/l Raju', avgScore: 42, count: 8 },
  { name: 'Razak bin Ismail', avgScore: 35, count: 5 },
  { name: 'Lim Wei Ming', avgScore: 28, count: 3 },
  { name: 'Muthu a/l Samy', avgScore: 25, count: 3 },
  { name: 'Tan Ah Kow', avgScore: 22, count: 2 },
];

export default function Reports() {
  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2>Laporan</h2>
          <p>Ringkasan kehadiran bulanan dan analisis anomali</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-primary">📥 Export Payroll (CSV)</button>
          <button className="btn btn-outline">📄 Export PDF</button>
        </div>
      </div>

      {/* Monthly Stats */}
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-card-label" style={{ marginBottom: 8 }}>Purata Kehadiran (Bulan Ini)</div>
          <div className="stat-card-value" style={{ color: '#10b981' }}>94.2%</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label" style={{ marginBottom: 8 }}>Jumlah Hari Kerja</div>
          <div className="stat-card-value">22</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label" style={{ marginBottom: 8 }}>Rekod Ditolak</div>
          <div className="stat-card-value" style={{ color: '#ef4444' }}>7</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label" style={{ marginBottom: 8 }}>Purata Score Anomali</div>
          <div className="stat-card-value" style={{ color: '#f59e0b' }}>12.4</div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <div className="chart-container">
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Trend Kehadiran Bulanan (%)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis domain={[80, 100]} fontSize={12} />
              <Tooltip />
              <Line type="monotone" dataKey="kehadiran" stroke="#10b981" strokeWidth={3} dot={{ r: 5 }} name="Kehadiran %" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Trend Anomali Bulanan</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="anomali" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Jumlah Anomali" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Anomaly Workers */}
      <div className="data-table-container" style={{ marginTop: 24 }}>
        <div className="table-header">
          <span className="table-title">⚠️ Pekerja dengan Anomali Tertinggi</span>
          <span style={{ color: '#64748b', fontSize: 12 }}>30 hari lepas</span>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Nama Pekerja</th>
              <th>Purata Score</th>
              <th>Jumlah Flagged</th>
              <th>Risiko</th>
              <th>Tindakan</th>
            </tr>
          </thead>
          <tbody>
            {topAnomalies.map((worker, i) => (
              <tr key={worker.name}>
                <td style={{ fontWeight: 700 }}>{i + 1}</td>
                <td style={{ fontWeight: 600 }}>{worker.name}</td>
                <td>
                  <span style={{
                    fontWeight: 700, fontFamily: 'monospace',
                    color: worker.avgScore >= 40 ? '#ef4444' : worker.avgScore >= 25 ? '#f59e0b' : '#64748b',
                  }}>
                    {worker.avgScore}
                  </span>
                </td>
                <td>{worker.count}x</td>
                <td>
                  <span className={
                    worker.avgScore >= 40 ? 'badge badge-danger' :
                    worker.avgScore >= 25 ? 'badge badge-warning' : 'badge badge-info'
                  }>
                    {worker.avgScore >= 40 ? 'Tinggi' : worker.avgScore >= 25 ? 'Sederhana' : 'Rendah'}
                  </span>
                </td>
                <td>
                  <button className="btn btn-outline btn-sm">Semak</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Payroll Export Section */}
      <div className="data-table-container" style={{ marginTop: 24, padding: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>📊 Export untuk Payroll</h3>
        <p style={{ color: '#64748b', fontSize: 13, marginBottom: 16 }}>
          Muat turun ringkasan kehadiran bulanan dalam format CSV yang compatible dengan sistem HR.
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <select className="filter-select">
            <option>April 2026</option>
            <option>Mac 2026</option>
            <option>Februari 2026</option>
            <option>Januari 2026</option>
          </select>
          <select className="filter-select">
            <option value="ALL">Semua Tapak</option>
            <option>Tapak Alpha</option>
            <option>Tapak Beta</option>
            <option>Tapak Gamma</option>
          </select>
          <button className="btn btn-primary">📥 Muat Turun CSV</button>
        </div>
      </div>
    </div>
  );
}
