import { useState } from 'react';

const INITIAL_SITES = [
  { id: 'S001', name: 'Tapak Alpha', address: 'Lot 123, Jalan Pembinaan, KL', lat: 3.139003, lon: 101.686855, radius: 150, workers: 30, active: 25 },
  { id: 'S002', name: 'Tapak Beta', address: 'Lot 456, Jalan Industri, PJ', lat: 3.107200, lon: 101.654300, radius: 200, workers: 15, active: 12 },
  { id: 'S003', name: 'Tapak Gamma', address: 'Lot 789, Jalan Baru, Shah Alam', lat: 3.089600, lon: 101.576800, radius: 100, workers: 8, active: 5 },
];

function SiteCard({ site }: { site: typeof INITIAL_SITES[0] }) {
  const [radius, setRadius] = useState(site.radius);

  return (
    <div className="data-table-container" style={{ padding: 20 }}>
      {/* Map Placeholder */}
      <div style={{
        height: 160, background: '#f1f5f9', borderRadius: 12,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', marginBottom: 16,
        border: '1px dashed #cbd5e1',
      }}>
        <span style={{ fontSize: 32 }}>🗺️</span>
        <span style={{ color: '#64748b', fontSize: 11, marginTop: 4 }}>
          Peta + Geofence Circle
        </span>
        <code style={{ fontSize: 10, color: '#94a3b8', marginTop: 4 }}>
          {site.lat.toFixed(6)}, {site.lon.toFixed(6)}
        </code>
      </div>

      {/* Site Info */}
      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{site.name}</h3>
      <p style={{ color: '#64748b', fontSize: 13, marginBottom: 16 }}>{site.address}</p>

      {/* Stats Row */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <div style={{
          flex: 1, background: '#f8fafc', borderRadius: 8, padding: 12, textAlign: 'center',
        }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#10b981' }}>{site.active}</div>
          <div style={{ fontSize: 10, color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
            Dalam Kawasan
          </div>
        </div>
        <div style={{
          flex: 1, background: '#f8fafc', borderRadius: 8, padding: 12, textAlign: 'center',
        }}>
          <div style={{ fontSize: 22, fontWeight: 800 }}>{site.workers}</div>
          <div style={{ fontSize: 10, color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
            Jumlah Pekerja
          </div>
        </div>
      </div>

      {/* Geofence Radius */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
          <span style={{ fontWeight: 600 }}>Radius Geofence</span>
          <span style={{ fontWeight: 700, color: '#f59e0b' }}>{radius}m</span>
        </div>
        <input
          type="range"
          min="50"
          max="500"
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
          style={{ width: '100%', accentColor: '#f59e0b' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#94a3b8' }}>
          <span>50m</span>
          <span>500m</span>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn btn-outline btn-sm" style={{ flex: 1 }} onClick={() => alert('Fungsi Edit Lokasi akan ditambah.')}>✏️ Edit</button>
        <button className="btn btn-outline btn-sm" style={{ flex: 1 }} onClick={() => alert('Fungsi Laporan Lokasi akan ditambah.')}>📊 Laporan</button>
      </div>
    </div>
  );
}

export default function Sites() {
  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2>Pengurusan Lokasi Kerja</h2>
          <p>Setup dan pengurusan tapak pembinaan dengan kawasan geofence</p>
        </div>
        <button className="btn btn-primary" onClick={() => alert('Fungsi Tambah Lokasi akan ditambah pada fasa seterusnya.')}>+ Tambah Lokasi</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 20 }}>
        {INITIAL_SITES.map((site) => (
          <SiteCard key={site.id} site={site} />
        ))}
      </div>
    </div>
  );
}
