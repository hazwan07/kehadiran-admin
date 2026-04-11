import { useState, useEffect } from 'react';

type Employee = {
  employeeId: string;
  name: string;
  icNumber: string;
  department: string;
  status: string;
  devices: number;
};

export default function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'ADD' | 'EDIT'>('ADD');
  const [editingId, setEditingId] = useState('');
  const [formData, setFormData] = useState({ name: '', icNumber: '', department: '', pin: '123456', status: 'ACTIVE' });
  const [loading, setLoading] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL || 'https://kehadiran-backend.onrender.com';

  const fetchEmployees = async () => {
    try {
      const r = await fetch(`${apiUrl}/api/v1/admin/employees`);
      const json = await r.json();
      if (json.success) setEmployees(json.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const isEdit = modalMode === 'EDIT';
      const endpoint = isEdit ? `${apiUrl}/api/v1/admin/employees/${editingId}` : `${apiUrl}/api/v1/admin/employees`;
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setShowModal(false);
        fetchEmployees();
      } else {
        alert('Gagal menyimpan pekerja.');
      }
    } catch (err) {
      alert(`Ralat rangkaian/pelayan: ${String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async (id: string) => {
    if (!confirm('Adakah anda pasti untuk menyekat pekerja ini dan revoke semua peranti mereka?')) return;
    try {
      const res = await fetch(`${apiUrl}/api/v1/admin/employees/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'INACTIVE', revokeDevices: true }),
      });
      if (res.ok) fetchEmployees();
    } catch (e) {
      alert('Gagal revoke pekerja.');
    }
  };

  const openEdit = (emp: Employee) => {
    setModalMode('EDIT');
    setEditingId(emp.employeeId);
    setFormData({ name: emp.name, icNumber: emp.icNumber, department: emp.department, pin: '', status: emp.status });
    setShowModal(true);
  };

  const openAdd = () => {
    setModalMode('ADD');
    setFormData({ name: '', icNumber: '', department: 'Am', pin: '123456', status: 'ACTIVE' });
    setShowModal(true);
  };

  const filtered = employees.filter((e) => {
    if (deptFilter !== 'ALL' && e.department !== deptFilter) return false;
    if (search && !e.name.toLowerCase().includes(search.toLowerCase()) && !e.employeeId.includes(search)) return false;
    return true;
  });

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2>Pengurusan Pekerja</h2>
          <p>Senarai semua pekerja dan peranti mereka</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Tambah Pekerja</button>
      </div>

      <div className="filters-bar">
        <input
          className="filter-input"
          placeholder="🔍 Cari nama atau ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ minWidth: 250 }}
        />
        <select className="filter-select" value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}>
          <option value="ALL">Semua Jabatan</option>
          <option value="Pembinaan">Pembinaan</option>
          <option value="Elektrik">Elektrik</option>
          <option value="Mekanikal">Mekanikal</option>
          <option value="Am">Am</option>
        </select>
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nama</th>
              <th>No. IC</th>
              <th>Jabatan</th>
              <th>Status</th>
              <th>Peranti</th>
              <th>Tindakan</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: 20 }}>Tiada rekod.</td></tr>
            ) : filtered.map((emp) => (
              <tr key={emp.employeeId}>
                <td style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: 11 }}>{emp.employeeId.slice(0, 8)}...</td>
                <td style={{ fontWeight: 600 }}>{emp.name}</td>
                <td style={{ fontFamily: 'monospace', color: '#64748b', fontSize: 12 }}>{emp.icNumber}</td>
                <td>{emp.department}</td>
                <td>
                  <span className={emp.status === 'ACTIVE' ? 'badge badge-success' : 'badge badge-danger'}>
                    {emp.status === 'ACTIVE' ? 'Aktif' : 'Tidak Aktif'}
                  </span>
                </td>
                <td>
                  <span style={{
                    background: emp.devices > 1 ? '#fffbeb' : '#f1f5f9',
                    padding: '2px 10px', borderRadius: 10, fontSize: 12, fontWeight: 600,
                    color: emp.devices > 1 ? '#92400e' : '#475569',
                  }}>
                    {emp.devices} peranti
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-outline btn-sm" onClick={() => openEdit(emp)}>Edit</button>
                    <button className="btn btn-outline btn-sm" style={{ color: '#ef4444', borderColor: '#fca5a5' }} onClick={() => handleRevoke(emp.employeeId)}>
                      Revoke
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{ background: '#fff', padding: 30, borderRadius: 12, width: 400, maxWidth: '90%' }}>
            <h3 style={{ marginBottom: 20 }}>{modalMode === 'ADD' ? 'Tambah Pekerja Baru' : 'Edit Pekerja'}</h3>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Nama Penuh</label>
                <input required className="filter-input" style={{ width: '100%' }} value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Nombor IC / Passport</label>
                <input required className="filter-input" style={{ width: '100%' }} value={formData.icNumber} onChange={e => setFormData({ ...formData, icNumber: e.target.value })} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Jabatan</label>
                <select className="filter-select" style={{ width: '100%' }} value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })}>
                  <option>Pembinaan</option>
                  <option>Elektrik</option>
                  <option>Mekanikal</option>
                  <option>Am</option>
                </select>
              </div>
              {modalMode === 'ADD' && (
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>PIN Log Masuk (6-digit)</label>
                  <input required className="filter-input" style={{ width: '100%' }} value={formData.pin} onChange={e => setFormData({ ...formData, pin: e.target.value })} />
                </div>
              )}
              {modalMode === 'EDIT' && (
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Status</label>
                  <select className="filter-select" style={{ width: '100%' }} value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                    <option value="ACTIVE">Aktif</option>
                    <option value="INACTIVE">Tidak Aktif</option>
                  </select>
                </div>
              )}
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
