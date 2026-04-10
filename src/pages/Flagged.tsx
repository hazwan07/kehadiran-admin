import { useState } from 'react';

const FLAGGED_RECORDS = [
  {
    id: 'F001', name: 'Razak bin Ismail', time: '08:02', date: '09/04/2026',
    site: 'Tapak Beta', score: 35, distance: 180,
    reasons: ['NEAR_BOUNDARY: 180m', 'LOW_ACCURACY: 22m'],
    gps: '3.139003, 101.686855', reviewed: false,
  },
  {
    id: 'F002', name: 'Lim Wei Ming', time: '07:48', date: '09/04/2026',
    site: 'Tapak Alpha', score: 45, distance: 210,
    reasons: ['NEAR_BOUNDARY: 210m', 'LOW_READING_COUNT: 2'],
    gps: '3.141592, 101.689100', reviewed: false,
  },
  {
    id: 'F003', name: 'Muthu a/l Samy', time: '08:22', date: '09/04/2026',
    site: 'Tapak Gamma', score: 55, distance: 195,
    reasons: ['NEAR_BOUNDARY: 195m', 'BEHAVIORAL_DEVIATION', 'LOW_ACCURACY: 18m'],
    gps: '3.150100, 101.710200', reviewed: false,
  },
  {
    id: 'F004', name: 'Norhayati binti Osman', time: '07:35', date: '08/04/2026',
    site: 'Tapak Alpha', score: 40, distance: 165,
    reasons: ['NEAR_BOUNDARY: 165m', 'LOW_ACCURACY: 19m'],
    gps: '3.138500, 101.685900', reviewed: true,
  },
  {
    id: 'F005', name: 'Tan Ah Kow', time: '08:45', date: '08/04/2026',
    site: 'Tapak Beta', score: 60, distance: 220,
    reasons: ['NEAR_BOUNDARY: 220m', 'IMPOSSIBLE_TRAVEL: 180km/j', 'LOW_READING_COUNT: 2'],
    gps: '3.142000, 101.688000', reviewed: true,
  },
];

export default function Flagged() {
  const [filter, setFilter] = useState<'unreviewed' | 'all'>('unreviewed');
  const [reviewNote, setReviewNote] = useState<Record<string, string>>({});
  const [actionTaken, setActionTaken] = useState<Record<string, string>>({});

  const filtered = FLAGGED_RECORDS.filter((r) => {
    if (filter === 'unreviewed') return !r.reviewed;
    return true;
  });

  const handleAction = (id: string, action: 'APPROVE' | 'REJECT') => {
    if (!reviewNote[id]?.trim()) {
      alert('Sila masukkan nota review sebelum membuat keputusan.');
      return;
    }
    setActionTaken({ ...actionTaken, [id]: action });
  };

  return (
    <div>
      <div className="page-header">
        <h2>⚠️ Rekod Ditanda</h2>
        <p>Semak rekod kehadiran yang memerlukan tindakan</p>
      </div>

      {/* Alert */}
      <div className="alert-banner alert-warning">
        ⚠️ <strong>{FLAGGED_RECORDS.filter(r => !r.reviewed).length} rekod</strong> belum disemak.
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <button
          className={`btn btn-sm ${filter === 'unreviewed' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setFilter('unreviewed')}
        >
          Belum Disemak
        </button>
        <button
          className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setFilter('all')}
        >
          Semua
        </button>
      </div>

      {/* Flagged Records */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {filtered.map((record) => (
          <div key={record.id} className="data-table-container" style={{ padding: 20 }}>
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
              {/* Left: Photo placeholder */}
              <div style={{
                width: 120, height: 150, background: '#f1f5f9',
                borderRadius: 12, display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 40, border: '1px solid #e2e8f0',
              }}>
                👤
              </div>

              {/* Center: Details */}
              <div style={{ flex: 1, minWidth: 250 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700 }}>{record.name}</h3>
                  <span className="badge badge-warning">Score: {record.score}</span>
                  {actionTaken[record.id] && (
                    <span className={`badge ${actionTaken[record.id] === 'APPROVE' ? 'badge-success' : 'badge-danger'}`}>
                      {actionTaken[record.id] === 'APPROVE' ? '✓ Diluluskan' : '✗ Ditolak'}
                    </span>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px', fontSize: 13 }}>
                  <div><span style={{ color: '#64748b' }}>Masa:</span> <strong>{record.time}</strong></div>
                  <div><span style={{ color: '#64748b' }}>Tarikh:</span> {record.date}</div>
                  <div><span style={{ color: '#64748b' }}>Tapak:</span> {record.site}</div>
                  <div><span style={{ color: '#64748b' }}>Jarak:</span> <strong>{record.distance}m</strong></div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <span style={{ color: '#64748b' }}>GPS:</span>{' '}
                    <code style={{ fontSize: 11, background: '#f1f5f9', padding: '2px 6px', borderRadius: 4 }}>
                      {record.gps}
                    </code>
                  </div>
                </div>

                {/* Reasons */}
                <div style={{ marginTop: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: 6 }}>
                    Sebab Ditanda
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {record.reasons.map((reason, i) => (
                      <span key={i} style={{
                        background: '#fffbeb', color: '#92400e',
                        fontSize: 11, padding: '3px 8px', borderRadius: 6,
                        fontFamily: 'monospace',
                      }}>
                        {reason}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Actions */}
              {!actionTaken[record.id] && !record.reviewed && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 200 }}>
                  <textarea
                    placeholder="Nota review (wajib)..."
                    value={reviewNote[record.id] || ''}
                    onChange={(e) => setReviewNote({ ...reviewNote, [record.id]: e.target.value })}
                    style={{
                      padding: 10, border: '1px solid #e2e8f0', borderRadius: 8,
                      fontSize: 12, resize: 'vertical', minHeight: 60,
                      fontFamily: 'inherit',
                    }}
                  />
                  <button className="btn btn-success btn-sm" onClick={() => handleAction(record.id, 'APPROVE')}>
                    ✓ Luluskan
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleAction(record.id, 'REJECT')}>
                    ✗ Tolak
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
