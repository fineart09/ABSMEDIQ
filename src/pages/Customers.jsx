import { useEffect, useMemo, useRef, useState } from 'react';

const MOCK_CUSTOMERS = [
  {
    id: 'HN001',
    name: 'สมชาย ใจดี',
    phone: '081-234-5678',
    email: 'somchai@example.com',
    status: 'Active',
    lastVisit: '2025-12-10',
  },
  {
    id: 'HN002',
    name: 'นางสาว สุกัญญา มั่นคง',
    phone: '082-345-6789',
    email: 'sukanya@example.com',
    status: 'Active',
    lastVisit: '2025-11-05',
  },
  {
    id: 'HN003',
    name: 'นาย ปรีชา เกษมสุข',
    phone: '083-456-7890',
    email: 'preecha@example.com',
    status: 'Inactive',
    lastVisit: '2024-09-20',
  },
  {
    id: 'HN004',
    name: 'นางสาว กาญจนา ประเสริฐ',
    phone: '084-567-8901',
    email: 'kanjana@example.com',
    status: 'Active',
    lastVisit: '2025-10-01',
  },
  {
    id: 'HN005',
    name: 'นาย สมศักดิ์ หาญกล้า',
    phone: '085-678-9012',
    email: 'somsak@example.com',
    status: 'Delinquent',
    lastVisit: '2023-06-12',
  },
  {
    id: 'HN006',
    name: 'บริษัท ทดสอบ จำกัด',
    phone: '02-123-4567',
    email: 'corp@example.com',
    status: 'Active',
    lastVisit: '2025-01-15',
  },
];

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

export default function Customers({ onEdit }) {
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

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return MOCK_CUSTOMERS;
    return MOCK_CUSTOMERS.filter((c) => {
      return (
        c.name.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q)
      );
    });
  }, [query]);

  return (
    <section className="customers-page">
      <div className="page-sticky-header" ref={stickyRef}>
        <h1 className="page-title">รายชื่อลูกค้า</h1>

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
                  <span className={`badge badge--${c.status.toLowerCase()}`}>
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
                    onClick={() => onEdit?.(c)}
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
