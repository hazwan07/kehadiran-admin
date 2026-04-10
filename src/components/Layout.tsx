import { NavLink, Outlet } from 'react-router-dom';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/attendance', label: 'Kehadiran', icon: '📋' },
  { path: '/flagged', label: 'Ditanda', icon: '⚠️', badge: 5 },
  { path: '/employees', label: 'Pekerja', icon: '👥' },
  { path: '/sites', label: 'Tapak', icon: '📍' },
  { path: '/reports', label: 'Laporan', icon: '📈' },
];

export default function Layout() {
  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <h1>🛡️ Kehadiran</h1>
          <p>Panel Admin</p>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              <span>{item.label}</span>
              {item.badge && <span className="nav-badge">{item.badge}</span>}
            </NavLink>
          ))}
        </nav>

        <div style={{
          padding: '16px 20px',
          borderTop: '1px solid #1e293b',
          color: '#475569',
          fontSize: 11,
        }}>
          <div style={{ fontWeight: 600, color: '#94a3b8' }}>Admin</div>
          <div style={{ marginTop: 2 }}>admin@syarikat.com</div>
          <div style={{ marginTop: 8, fontSize: 10, color: '#334155' }}>
            Sistem Kehadiran v1.0
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
