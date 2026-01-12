import { useMemo, useState } from 'react';

const MOCK_CUSTOMERS = [
  {
    id: 'CUST-001',
    name: 'สมชาย ใจดี',
    phone: '081-234-5678',
    email: 'somchai@example.com',
    status: 'Active',
    lastVisit: '2025-12-10',
  },
  {
    id: 'CUST-002',
    name: 'นางสาว สุกัญญา มั่นคง',
    phone: '082-345-6789',
    email: 'sukanya@example.com',
    status: 'Active',
    lastVisit: '2025-11-05',
  },
  {
    id: 'CUST-003',
    name: 'นาย ปรีชา เกษมสุข',
    phone: '083-456-7890',
    email: 'preecha@example.com',
    status: 'Inactive',
    lastVisit: '2024-09-20',
  },
  {
    id: 'CUST-004',
    name: 'นางสาว กาญจนา ประเสริฐ',
    phone: '084-567-8901',
    email: 'kanjana@example.com',
    status: 'Active',
    lastVisit: '2025-10-01',
  },
  {
    id: 'CUST-005',
    name: 'นาย สมศักดิ์ หาญกล้า',
    phone: '085-678-9012',
    email: 'somsak@example.com',
    status: 'Delinquent',
    lastVisit: '2023-06-12',
  },
  {
    id: 'CUST-006',
    name: 'บริษัท ทดสอบ จำกัด',
    phone: '02-123-4567',
    email: 'corp@example.com',
    status: 'Active',
    lastVisit: '2025-01-15',
  },
];

export default function Customers() {
  const [query, setQuery] = useState('');

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
      <h1>รายชื่อลูกค้า</h1>

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

      <div style={{ overflowX: 'auto' }}>
        <table
          className="customers-table"
          style={{ width: '100%', borderCollapse: 'collapse' }}
        >
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: 8 }}>รหัส</th>
              <th style={{ textAlign: 'left', padding: 8 }}>ชื่อ</th>
              <th style={{ textAlign: 'left', padding: 8 }}>โทรศัพท์</th>
              <th style={{ textAlign: 'left', padding: 8 }}>อีเมล</th>
              <th style={{ textAlign: 'left', padding: 8 }}>สถานะ</th>
              <th style={{ textAlign: 'left', padding: 8 }}>เข้าใช้ล่าสุด</th>
              <th style={{ textAlign: 'left', padding: 8 }}>การกระทำ</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} style={{ borderTop: '1px solid #eaeaea' }}>
                <td style={{ padding: 8 }}>{c.id}</td>
                <td style={{ padding: 8 }}>{c.name}</td>
                <td style={{ padding: 8 }}>{c.phone}</td>
                <td style={{ padding: 8 }}>{c.email}</td>
                <td style={{ padding: 8 }}>{c.status}</td>
                <td style={{ padding: 8 }}>{c.lastVisit}</td>
                <td style={{ padding: 8 }}>
                  <button
                    type="button"
                    className="button"
                    onClick={() => alert(`ดูข้อมูล: ${c.name} (${c.id})`)}
                    style={{ marginRight: 8 }}
                  >
                    ดู
                  </button>
                  <button
                    type="button"
                    className="button"
                    onClick={() => alert(`แก้ไข: ${c.name} (${c.id})`)}
                  >
                    แก้ไข
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
