import { useState } from 'react';

const EMPLOYEES = [
  { id: 'E001', name: 'Ahmad bin Ali', ic: 'XXXXXX-XX-1234', dept: 'Pembinaan', status: 'ACTIVE', devices: 1 },
  { id: 'E002', name: 'Siti Aminah', ic: 'XXXXXX-XX-5678', dept: 'Pembinaan', status: 'ACTIVE', devices: 1 },
  { id: 'E003', name: 'Razak bin Ismail', ic: 'XXXXXX-XX-9012', dept: 'Elektrik', status: 'ACTIVE', devices: 2 },
  { id: 'E004', name: 'Fatimah binti Hassan', ic: 'XXXXXX-XX-3456', dept: 'Pembinaan', status: 'ACTIVE', devices: 1 },
  { id: 'E005', name: 'Kumar a/l Raju', ic: 'XXXXXX-XX-7890', dept: 'Mekanikal', status: 'INACTIVE', devices: 0 },
  { id: 'E006', name: 'Lim Wei Ming', ic: 'XXXXXX-XX-2345', dept: 'Pembinaan', status: 'ACTIVE', devices: 1 },
  { id: 'E007', name: 'Muthu a/l Samy', ic: 'XXXXXX-XX-6789', dept: 'Am', status: 'ACTIVE', devices: 1 },
  { id: 'E008', name: 'Norhayati binti Osman', ic: 'XXXXXX-XX-0123', dept: 'Elektrik', status: 'ACTIVE', devices: 1 },
];

export default function Employees() {
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');

  const filtered = EMPLOYEES.filter((e) => {
    if (deptFilter !== 'ALL' && e.dept !== deptFilter) return false;
    if (search && !e.name.toLowerCase().includes(search.toLowerCase()) && !e.id.includes(search)) return false;
    return true;
  });

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2>Pengurusan Pekerja</h2>
          <p>Senarai semua pekerja dan peranti mereka</p>
        </div>
        <button className="btn btn-primary">+ Tambah Pekerja</button>
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
            {filtered.map((emp) => (
              <tr key={emp.id}>
                <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{emp.id}</td>
                <td style={{ fontWeight: 600 }}>{emp.name}</td>
                <td style={{ fontFamily: 'monospace', color: '#64748b', fontSize: 12 }}>{emp.ic}</td>
                <td>{emp.dept}</td>
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
                    <button className="btn btn-outline btn-sm">Edit</button>
                    <button className="btn btn-outline btn-sm" style={{ color: '#ef4444', borderColor: '#fca5a5' }}>
                      Revoke
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
