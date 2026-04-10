import { useState, useEffect } from 'react';

type Site = {
  siteId: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  geofenceRadius: number;
  workers: number;
  active: number;
};

function SiteCard({ site, onEdit, onRadiusChange }: { site: Site; onEdit: (s: Site) => void; onRadiusChange: (id: string, radius: number) => void }) {
  const [radius, setRadius] = useState(site.geofenceRadius || 150);

  const handleSliderRelease = () => {
    if (radius !== site.geofenceRadius) {
      onRadiusChange(site.siteId, radius);
    }
  };

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
          {site.latitude?.toFixed(6) || 0}, {site.longitude?.toFixed(6) || 0}
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
          onMouseUp={handleSliderRelease}
          onTouchEnd={handleSliderRelease}
          style={{ width: '100%', accentColor: '#f59e0b' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#94a3b8' }}>
          <span>50m</span>
          <span>500m</span>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn btn-outline btn-sm" style={{ flex: 1 }} onClick={() => onEdit(site)}>✏️ Edit</button>
        <button className="btn btn-outline btn-sm" style={{ flex: 1 }} onClick={() => alert('Fungsi Laporan terperinci untuk Lokasi ini akan ditambah.')}>📊 Laporan</button>
      </div>
    </div>
  );
}

export default function Sites() {
  const [sites, setSites] = useState<Site[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'ADD' | 'EDIT'>('ADD');
  const [editingId, setEditingId] = useState('');
  const [formData, setFormData] = useState({ name: '', address: '', latitude: 3.1390, longitude: 101.6868, geofenceRadius: 150 });
  const [loading, setLoading] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL || 'https://kehadiran-backend.onrender.com';

  const fetchSites = async () => {
    try {
      const r = await fetch(`${apiUrl}/api/v1/admin/sites`);
      const json = await r.json();
      if (json.success) setSites(json.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchSites();
  }, []);

  const handleRadiusChange = async (id: string, newRadius: number) => {
    try {
      await fetch(`${apiUrl}/api/v1/admin/sites/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ geofenceRadius: newRadius }),
      });
      fetchSites();
    } catch (err) {
      alert('Gagal mengemaskini radius.');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const isEdit = modalMode === 'EDIT';
      const endpoint = isEdit ? `${apiUrl}/api/v1/admin/sites/${editingId}` : `${apiUrl}/api/v1/admin/sites`;
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setShowModal(false);
        fetchSites();
      } else {
        alert('Gagal menyimpan lokasi.');
      }
    } catch (err) {
      alert('Ralat pelayan.');
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setModalMode('ADD');
    setFormData({ name: '', address: '', latitude: 3.1390, longitude: 101.6868, geofenceRadius: 150 });
    setShowModal(true);
  };

  const openEdit = (site: Site) => {
    setModalMode('EDIT');
    setEditingId(site.siteId);
    setFormData({ name: site.name, address: site.address, latitude: site.latitude || 0, longitude: site.longitude || 0, geofenceRadius: site.geofenceRadius || 150 });
    setShowModal(true);
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2>Pengurusan Lokasi Kerja</h2>
          <p>Setup dan pengurusan tapak pembinaan dengan kawasan geofence</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Tambah Lokasi</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 20 }}>
        {sites.length === 0 ? (
          <div style={{ color: '#64748b', padding: 20 }}>Tiada rekod lokasi. Sila tambah baru.</div>
        ) : sites.map((site) => (
          <SiteCard key={site.siteId} site={site} onEdit={openEdit} onRadiusChange={handleRadiusChange} />
        ))}
      </div>

      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{ background: '#fff', padding: 30, borderRadius: 12, width: 400, maxWidth: '90%' }}>
            <h3 style={{ marginBottom: 20 }}>{modalMode === 'ADD' ? 'Tambah Lokasi Baru' : 'Edit Lokasi'}</h3>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Nama Lokasi</label>
                <input required className="filter-input" style={{ width: '100%' }} value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Alamat Penuh</label>
                <textarea required className="filter-input" style={{ width: '100%', minHeight: 60 }} value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Latitude</label>
                  <input required type="number" step="any" className="filter-input" style={{ width: '100%' }} value={formData.latitude} onChange={e => setFormData({ ...formData, latitude: Number(e.target.value) })} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Longitude</label>
                  <input required type="number" step="any" className="filter-input" style={{ width: '100%' }} value={formData.longitude} onChange={e => setFormData({ ...formData, longitude: Number(e.target.value) })} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Batal</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>{loading ? 'Menyimpan...' : 'Simpan'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
