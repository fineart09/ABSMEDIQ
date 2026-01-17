import { useEffect, useMemo, useRef, useState } from 'react';
import MOCK_CUSTOMERS_FULL from '../mocks/customersFull';

// --- 1.displayName (ของทีม - ห้ามแก้) ---
const displayName = (c) => {
  // ✅ ตรวจสอบก่อน: ถ้า c.name เป็นข้อความ (String) มาอยู่แล้ว ให้คืนค่าได้เลย
  // นี่คือส่วนที่รองรับข้อมูล 1,462 row จาก Java ของคุณ
  if (typeof c.name === 'string') return c.name;

  // 📦 ส่วนด้านล่างนี้คือของทีม (Mockup) ที่เก็บชื่อเป็น Object
  const thPrefix = c?.name?.prefixTh || '';
  const thFirst = c?.name?.firstTh || '';
  const thLast = c?.name?.lastTh || '';
  const enFirst = c?.name?.firstEn || '';
  const enLast = c?.name?.lastEn || '';
  const nick = c?.name?.nickname || '';

  if (thPrefix || thFirst || thLast)
    return `${thPrefix} ${thFirst} ${thLast}`.trim().replace(/\s+/g, ' ');
  if (enFirst || enLast) return `${enFirst} ${enLast}`.trim();
  if (nick) return nick;

  return 'ไม่ระบุ';
};

// --- 2. FULL_INDEX (ของทีม - สำหรับข้อมูล Mockup) ---
const FULL_INDEX_MOCK = new Map(
  (Array.isArray(MOCK_CUSTOMERS_FULL) ? MOCK_CUSTOMERS_FULL : []).map((c) => [
    c.hn,
    c,
  ])
);

// --- 3. CustomerModal (ของทีม - ห้ามแก้) ---
function CustomerModal({ customer, fullIndex, onClose }) {
  if (!customer) return null;
  // ดึงข้อมูลตัวเต็มจาก Index ที่ส่งมา (อาจจะเป็น Mock หรือ Backend)
  const full = fullIndex.get(customer.id);

  const addressTh = [
    full?.address?.addressTh,
    full?.address?.subdistrictTh,
    full?.address?.districtTh,
    full?.address?.provinceTh,
    full?.address?.postalCode,
  ].filter(Boolean).join(' ');

  const nickname = full?.name?.nickname || '';
  const birthDate = full?.details?.birthDate || '';
  const gender = full?.details?.genderTh || '';
  const bloodGroup = full?.details?.bloodGroup || '';
  const age = full?.details?.age || '';
  const email = full?.details?.email || customer.email || '';
  const notes = full?.details?.notes || '';
  const registeredAt = full?.lastVisit || customer.lastVisit || '';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal--customer-details" role="dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header"><h3>รายละเอียดลูกค้า</h3></div>
        <div className="modal-body">
          <div style={{ display: 'block', marginBottom: '0.75rem' }}>
            <div className="photo-box">
              {full?.photoUrl ? <img src={full.photoUrl} alt="รูป" /> : <span className="photo-box__placeholder">ยังไม่มีรูปภาพ</span>}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '8px 12px' }}>
            <div>HN</div><div>{customer.id}</div>
            <div>ชื่อ-นามสกุล</div><div>{customer.name}</div>
            <div>ที่อยู่</div><div>{addressTh || '-'}</div>
            <div>ชื่อเล่น</div><div>{nickname || '-'}</div>
            <div>วันเกิด</div><div>{birthDate || '-'}</div>
            <div>เพศ</div><div>{gender || '-'}</div>
            <div>อายุ</div><div>{age || '-'}</div>
            <div>อีเมล</div><div>{email || '-'}</div>
            <div>วันที่ลงทะเบียน</div><div>{registeredAt || '-'}</div>
          </div>
        </div>
        <div className="modal-actions">
          <button type="button" className="button" onClick={onClose}>ปิด</button>
        </div>
      </div>
    </div>
  );
}

// --- 4. Main Component ---
export default function Customers({ onEdit, onCreateNew, statusOverrides }) {
  // --- ส่วนที่เพิ่มใหม่สำหรับ Backend ---
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMockup, setIsMockup] = useState(false);

  // --- ส่วนเดิมของทีม ---
  const [query, setQuery] = useState('');
  const stickyRef = useRef(null);
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // --- เพิ่ม useEffect ดึงข้อมูลจาก Java API ---
  useEffect(() => {
    const fetchBackend = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch('/api/customers');
        if (!response.ok) throw new Error(`Server Error: ${response.status}`);
        const data = await response.json();
        setCustomers(data);
      } catch (err) {
        console.error("API Error:", err);
        setError("ไม่สามารถดึงข้อมูลจากระบบ ABSMediQ ได้");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBackend();
  }, []);

  // Sticky Header Logic (ของทีม)
  useEffect(() => {
    const el = stickyRef.current;
    if (!el) return;
    const update = () => {
      const h = el.getBoundingClientRect().height;
      document.documentElement.style.setProperty('--page-sticky-height', `${Math.ceil(h)}px`);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // สร้าง Index สำหรับข้อมูล Backend
    const fullIndexBackend = useMemo(() => {
      return new Map(customers.map((c) => [String(c.id || c.hn), c]));
    }, [customers]);

    const base = useMemo(() => {
      // แก้ไข: เลือกแหล่งข้อมูลตามสถานะ isMockup
      const src = isMockup
        ? (Array.isArray(MOCK_CUSTOMERS_FULL) ? MOCK_CUSTOMERS_FULL : [])
        : customers;

      return src.map((c, i) => ({
        id: c.hn || String(c.id ?? '') || `HN${String(i + 1).padStart(3, '0')}`,
        name: displayName(c),
        phone: c?.details?.phone || c.phone || '',
        email: c?.details?.email || c.email || '',
        status: statusOverrides?.[c.hn || c.id] || c.status || 'ใช้งาน',
        lastVisit: c.lastVisit || '',
        segment: c?.segment || c?.conditions?.segment || c?.cond?.segment || '',
        discount: c.discount || '',
      }));
    }, [isMockup, customers, statusOverrides]);

  // Logic การ Filter และ Pagination (ของทีม - ห้ามแก้)
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return base;
    return base.filter((c) => (
      c.name.toLowerCase().includes(q) || c.phone.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q) || String(c.segment || '').toLowerCase().includes(q)
    ));
  }, [query, base]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const paged = filtered.slice(start, end);

  const visiblePages = useMemo(() => {
    const pages = [];
    const total = totalPages;
    const current = currentPage;
    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
      return pages;
    }
    pages.push(1);
    let s = Math.max(2, current - 2);
    let e = Math.min(total - 1, current + 2);
    if (s > 2) pages.push('…');
    for (let i = s; i <= e; i++) pages.push(i);
    if (e < total - 1) pages.push('…');
    pages.push(total);
    return pages;
  }, [currentPage, totalPages]);

  useEffect(() => { setPage(1); }, [query, pageSize]);

  if (isLoading && !isMockup) return <div className="p-8">กำลังดึงข้อมูลลูกค้าจาก SQL Server...</div>;
  if (error && !isMockup) return <div className="p-8 text-red-500">{error} <button onClick={() => setIsMockup(true)}>ใช้ข้อมูล Mockup แทน</button></div>;

  return (
    <section className="customers-page">
      <div className="page-sticky-header" ref={stickyRef}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <h1 className="page-title">รายชื่อลูกค้า ({isMockup ? 'Mockup' : 'Backend'})</h1>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" className="button" onClick={() => onCreateNew?.()}>สร้างรายชื่อลูกค้าใหม่</button>
          </div>
        </div>

        <div className="toolbar" style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <input
            placeholder="ค้นหาชื่อ / เบอร์ / กลุ่มลูกค้า / สถานะ / HN"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ flex: 1, padding: '8px 10px' }}
          />
          <button type="button" className="button" onClick={() => setQuery('')}>ล้าง</button>
        </div>
      </div>

      <div className="table-card" style={{ overflowX: 'auto' }}>
        <table className="customers-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: 8 }}>HN</th>
              <th style={{ padding: 8 }}>ชื่อ-นามสกุล</th>
              <th style={{ padding: 8 }}>เบอร์โทร</th>
              <th style={{ padding: 8 }}>กลุ่มลูกค้า</th>
              <th style={{ padding: 8 }}>สถานะ</th>
              <th style={{ padding: 8 }}>ดูข้อมูล / แก้ไขข้อมูล</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((c) => (
              <tr key={c.id} style={{ borderTop: '1px solid #eaeaea' }}>
                <td style={{ padding: 8 }}>{c.id}</td>
                <td style={{ padding: 8 }}>{c.name}</td>
                <td style={{ padding: 8 }}>{c.phone}</td>
                <td style={{ padding: 8 }}>{c.segment || '-'}</td>
                <td style={{ padding: 8 }}>
                  <span className={`badge badge--${c.status === 'ใช้งาน' ? 'active' : 'inactive'}`}>
                    {c.status}
                  </span>
                </td>
                <td style={{ padding: 8 }}>
                  <button type="button" className="button" onClick={() => setSelected(c)} style={{ marginRight: 8 }}>ดูข้อมูล</button>
                  <button type="button" className="button" onClick={() => onEdit?.((isMockup ? FULL_INDEX_MOCK : fullIndexBackend).get(c.id) || c)}>แก้ไขข้อมูล</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination (ของทีม) */}
      <div className="pagination-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
        <div style={{ color: '#6b7280' }}>แสดง {paged.length ? start + 1 : 0}-{Math.min(end, filtered.length)} จาก {filtered.length} รายการ</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))} className="select">
            <option value={5}>5</option><option value={10}>10</option><option value={20}>20</option><option value={50}>50</option>
          </select>
          <button className="button" disabled={currentPage <= 1} onClick={() => setPage(p => p - 1)}>ก่อนหน้า</button>
          <div style={{ display: 'flex', gap: 4 }}>
            {visiblePages.map((p, idx) => (
              <button key={idx} className={`button ${p === currentPage ? 'button--active' : ''}`} onClick={() => typeof p === 'number' && setPage(p)} disabled={p === '…'}>{p}</button>
            ))}
          </div>
          <button className="button" disabled={currentPage >= totalPages} onClick={() => setPage(p => p + 1)}>ถัดไป</button>
        </div>
      </div>

      {selected && <CustomerModal customer={selected} fullIndex={isMockup ? FULL_INDEX_MOCK : fullIndexBackend} onClose={() => setSelected(null)} />}
    </section>
  );
}