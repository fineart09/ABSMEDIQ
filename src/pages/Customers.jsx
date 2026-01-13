import { useEffect, useMemo, useRef, useState } from 'react';
import MOCK_CUSTOMERS_FULL from '../mocks/customersFull';
const displayName = (c) => {
  const thFirst = c?.name?.firstTh || '';
  const thLast = c?.name?.lastTh || '';
  const enFirst = c?.name?.firstEn || '';
  const enLast = c?.name?.lastEn || '';
  const nick = c?.name?.nickname || '';
  if (thFirst || thLast) return `${thFirst} ${thLast}`.trim();
  if (enFirst || enLast) return `${enFirst} ${enLast}`.trim();
  if (nick) return nick;
  return 'ไม่ระบุ';
};

const MOCK_CUSTOMERS = (
  Array.isArray(MOCK_CUSTOMERS_FULL) ? MOCK_CUSTOMERS_FULL : []
).map((c, i) => ({
  id: c.hn || `HN${String(i + 1).padStart(3, '0')}`,
  name: displayName(c),
  phone: c?.details?.phone || '',
  email: c?.details?.email || '',
  status: c.status || 'ใช้งาน',
  lastVisit: c.lastVisit || '',
  segment: c.segment || '',
  discount: c.discount || '',
}));

const FULL_INDEX = new Map(
  (Array.isArray(MOCK_CUSTOMERS_FULL) ? MOCK_CUSTOMERS_FULL : []).map((c) => [
    c.hn,
    c,
  ])
);

function CustomerModal({ customer, onClose }) {
  if (!customer) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={`รายละเอียดลูกค้า ${customer.name} (${customer.id})`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>รายละเอียดลูกค้า</h3>
        </div>
        <div className="modal-body">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '160px 1fr',
              gap: '8px 12px',
            }}
          >
            <div>HN</div>
            <div>{customer.id}</div>
            <div>ชื่อ</div>
            <div>{customer.name}</div>
            <div>โทรศัพท์</div>
            <div>{customer.phone}</div>
            <div>อีเมล</div>
            <div>{customer.email}</div>
            <div>สถานะ</div>
            <div>{customer.status}</div>
            <div>วันที่ลงทะเบียน</div>
            <div>{customer.lastVisit}</div>
          </div>
        </div>
        <div className="modal-actions">
          <button type="button" className="button" onClick={onClose}>
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Customers({ onEdit, onCreateNew, statusOverrides }) {
  const [query, setQuery] = useState('');
  const stickyRef = useRef(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const el = stickyRef.current;
    if (!el) return;

    const update = () => {
      const h = el.getBoundingClientRect().height;
      document.documentElement.style.setProperty(
        '--page-sticky-height',
        `${Math.ceil(h)}px`
      );
    };

    update();

    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(() => update());
      ro.observe(el);
      return () => ro.disconnect();
    }

    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const base = useMemo(() => {
    const src = Array.isArray(MOCK_CUSTOMERS_FULL) ? MOCK_CUSTOMERS_FULL : [];
    return src.map((c, i) => ({
      id: c.hn || `HN${String(i + 1).padStart(3, '0')}`,
      name: displayName(c),
      phone: c?.details?.phone || '',
      email: c?.details?.email || '',
      status: statusOverrides?.[c.hn] || c.status || 'ใช้งาน',
      lastVisit: c.lastVisit || '',
      segment: c.segment || '',
      discount: c.discount || '',
    }));
  }, [statusOverrides]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return base;
    return base.filter((c) => {
      return (
        c.name.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q)
      );
    });
  }, [query, base]);

  return (
    <section className="customers-page">
      <div className="page-sticky-header" ref={stickyRef}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
            marginBottom: 12,
          }}
        >
          <h1 className="page-title">รายชื่อลูกค้า</h1>
          <button
            type="button"
            className="button"
            onClick={() => onCreateNew?.()}
          >
            สร้างรายชื่อลูกค้าใหม่
          </button>
        </div>

        <div
          className="toolbar"
          style={{ display: 'flex', gap: 8, marginBottom: 12 }}
        >
          <input
            aria-label="ค้นหารายชื่อลูกค้า"
            placeholder="ค้นหาชื่อ / เบอร์ / อีเมล / รหัสลูกค้า"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ flex: 1, padding: '8px 10px' }}
          />
          <button type="button" className="button" onClick={() => setQuery('')}>
            ล้าง
          </button>
        </div>
      </div>

      <div className="table-card" style={{ overflowX: 'auto' }}>
        <table
          className="customers-table"
          style={{ width: '100%', borderCollapse: 'collapse' }}
        >
          <thead>
            <tr>
              <th style={{ padding: 8 }}>HN</th>
              <th style={{ padding: 8 }}>ชื่อ</th>
              <th style={{ padding: 8 }}>โทรศัพท์</th>
              <th style={{ padding: 8 }}>อีเมล</th>
              <th style={{ padding: 8 }}>สถานะ</th>
              <th style={{ padding: 8 }}>วันที่ลงทะเบียน</th>
              <th style={{ padding: 8 }}> </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} style={{ borderTop: '1px solid #eaeaea' }}>
                <td style={{ padding: 8 }}>{c.id}</td>
                <td style={{ padding: 8 }}>{c.name}</td>
                <td style={{ padding: 8 }}>{c.phone}</td>
                <td style={{ padding: 8 }}>{c.email}</td>
                <td style={{ padding: 8 }}>
                  <span
                    className={
                      'badge badge--' +
                      (c.status === 'ใช้งาน'
                        ? 'active'
                        : c.status === 'ไม่ใช้งาน'
                        ? 'inactive'
                        : String(c.status || '').toLowerCase())
                    }
                  >
                    {c.status}
                  </span>
                </td>
                <td style={{ padding: 8 }}>{c.lastVisit}</td>
                <td style={{ padding: 8 }}>
                  <button
                    type="button"
                    className="button"
                    onClick={() => setSelected(c)}
                    style={{ marginRight: 8 }}
                  >
                    ดูข้อมูล
                  </button>
                  <button
                    type="button"
                    className="button"
                    onClick={() => onEdit?.(FULL_INDEX.get(c.id) || c)}
                  >
                    แก้ไขข้อมูล
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selected && (
        <CustomerModal customer={selected} onClose={() => setSelected(null)} />
      )}
    </section>
  );
}
