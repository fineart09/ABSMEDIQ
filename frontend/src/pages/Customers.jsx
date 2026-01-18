import { useEffect, useMemo, useRef, useState } from 'react';
import MOCK_CUSTOMERS_FULL from '../mocks/customersFull';

/**
 * 1. displayName Logic (ปรับปรุงตาม Requirement)
 * ดึงค่า name จาก backend มาแสดง ถ้าไม่มีให้แสดง 'ไม่ระบุ'
 */
const displayName = (c) => {
  /* --- คอมเมนต์ส่วนเก่าของทีมออกตามต้องการ ---
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
  */

  // --- ส่วนที่แก้ไขใหม่: รับ name ตรงๆ จาก Backend ---
  if (typeof c?.name === 'string' && c.name.trim() !== '') {
    return c.name;
  }
  return 'ไม่ระบุ';
};

/**
 * 2. Status Mapping
 * แปลงค่าจาก Backend (Active/Deactive) เป็นภาษาไทย
 */
const STATUS_LABELS = {
  'active': 'ใช้งาน',
  'inactive': 'ไม่ใช้งาน'
};

/**
 * 3. CustomerModal Component
 * ปรับให้รับ fullIndex เข้ามาเพื่อให้ดึงข้อมูลตัวเต็มได้ถูกต้อง
 */
function CustomerModal({ customer, onClose }) {
  if (!customer) return null;

  // ฟังก์ชันรวมที่อยู่จาก DTO (Flat structure)
  const fullAddress = [
    customer.address,
    customer.tumbon,
    customer.amphur,
    customer.province
  ].filter(val => val && val !== '-').join(' ');

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal--customer-details" role="dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header"><h3>รายละเอียดลูกค้า</h3></div>
        <div className="modal-body">
          <div style={{ display: 'block', marginBottom: '0.75rem' }}>
            <div className="photo-box">
              {customer.photoUrl ? <img src={customer.photoUrl} alt="รูป" /> : <span className="photo-box__placeholder">ยังไม่มีรูปภาพ</span>}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '8px 12px' }}>
            <div style={{ fontWeight: 600 }}>HN</div><div>{customer.hn}</div>
            <div style={{ fontWeight: 600 }}>ชื่อ-นามสกุล</div>
            <div>{`${customer.title || ''} ${customer.name || ''} ${customer.surname || ''}`.trim()}</div>
            <div style={{ fontWeight: 600 }}>ที่อยู่</div><div>{fullAddress || '-'}</div>
            <div style={{ fontWeight: 600 }}>ชื่อเล่น</div><div>{customer.nickname || '-'}</div>
            <div style={{ fontWeight: 600 }}>อายุ</div><div>{customer.age || '0'} ปี</div>
            <div style={{ fontWeight: 600 }}>วันเกิด</div><div>{customer.birthDate || '-'}</div>
            <div style={{ fontWeight: 600 }}>เบอร์โทร</div><div>{customer.phone || '-'}</div>
            <div style={{ fontWeight: 600 }}>อีเมล</div><div>{customer.email || '-'}</div>
            <div style={{ fontWeight: 600 }}>หมายเหตุ</div><div>{customer.remark || '-'}</div>
            <div style={{ fontWeight: 600 }}>สถานะ</div>
            <div>
              <span className={`badge badge--${customer.status === 'ใช้งาน' || customer.status === 'active' ? 'active' : 'inactive'}`}>
                {customer.status}
              </span>
            </div>
          </div>
        </div>
        <div className="modal-actions">
          <button type="button" className="button" onClick={onClose}>ปิด</button>
        </div>
      </div>
    </div>
  );
}

/**
 * Main Component
 */
export default function Customers({ onEdit, onCreateNew, statusOverrides }) {
  // --- States สำหรับ Backend ---
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMockup, setIsMockup] = useState(false);

  // --- States เดิมของทีม ---
  const [query, setQuery] = useState('');
  const stickyRef = useRef(null);
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 2. ประกาศ handleView ให้อยู่ในระดับเดียวกับ State
      const handleView = async (customerSummary) => {
        const hn = customerSummary.hn;

        // ดักค่าแบบ Strict ตามที่เราคุยกัน (เพราะ hn อาจเป็น 0)
        if (hn === undefined || hn === null) return;

        try {
          const response = await fetch(`/api/customers/${hn}`);
          if (!response.ok) throw new Error("Fetch error");
          const fullData = await response.json();

          // เรียกใช้ setSelected ที่ประกาศไว้ด้านบน
          setSelected(fullData);
        } catch (err) {
          console.error(err);
        }
      };

  // --- [จุดที่ 1] Fetch Data จาก Java Backend ---
  useEffect(() => {
    const fetchBackend = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/customers');
        if (!response.ok) throw new Error("Backend Connection Error");
        const data = await response.json();

        // --- จุดดักค่าก่อนเข้า State ---
        console.log("Raw Backend Data:", data); // ตรวจสอบว่ามี field 'hn' หรือไม่
        const validatedData = data.map((c, index) => {
          if (!c.hn && !c.id) {
            console.error(`Record at index ${index} is missing both hn and id!`, c);
          }
          return c;
        });

        setCustomers(validatedData);
      } catch (err) {
        console.warn("API Error:", err);
        setIsMockup(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBackend();
  }, []);

  // Sticky Header Logic (คงเดิม)
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

  // --- [จุดที่ 2] สร้าง Index สำหรับดึงข้อมูลตัวเต็ม ---
  const dynamicFullIndex = useMemo(() => {
    const src = isMockup ? (Array.isArray(MOCK_CUSTOMERS_FULL) ? MOCK_CUSTOMERS_FULL : []) : customers;
    return new Map(src.map((c) => [String(c.hn || c.id), c]));
  }, [customers, isMockup]);

  // --- [จุดที่ 3] จัดเตรียมข้อมูลและแปลงสถานะ (Data Mapping) ---
  const base = useMemo(() => {
    const src = isMockup ? MOCK_CUSTOMERS_FULL : customers;

    return src.map((c, i) => {
      // ดักหาค่า HN: ลองเช็คหลายที่เผื่อ Backend เปลี่ยนชื่อ field
      const hnValue = c.hn || c.id;

      if (!hnValue) {
        console.error(`[Data Mapping] Missing HN/ID for customer at index ${i}`, c);
      }

      return {
        id: String(c.id || i),
        hn: hnValue, // ส่งค่าที่ดักมาได้ลงไปใน field 'hn' โดยเฉพาะ
        name: displayName(c),
        phone: c?.details?.phone || c.phone || '-',
        status: STATUS_LABELS[c.status?.toLowerCase()] || c.status || 'ใช้งาน',
        segment: c?.segment || c?.conditions?.segment || '-',
      };
    });
  }, [customers, isMockup, statusOverrides]);

  // Logic การ Filter และ Pagination (คงเดิม)
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

  return (
    <section className="customers-page">
      <div className="page-sticky-header" ref={stickyRef}>
        {/* ส่วน Header และ Toolbar คงเดิม */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 12 }}>
          <h1 className="page-title">รายชื่อลูกค้า</h1>
          <button type="button" className="button" onClick={() => onCreateNew?.()}>สร้างรายชื่อลูกค้าใหม่</button>
        </div>

        <div className="toolbar" style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <input
            aria-label="ค้นหารายชื่อลูกค้า"
            placeholder="ค้นหาชื่อ / เบอร์ / กลุ่มลูกค้า / สถานะ / HN"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ flex: 1, padding: '8px 10px' }}
          />
          <button type="button" className="button" onClick={() => setQuery('')}>ล้าง</button>
        </div>
      </div>

      <div className="table-card" style={{ overflowX: 'auto' }}>
        <table className="customers-table" style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
          <thead>
            <tr style={{ backgroundColor: '#f9fafb' }}>
              {/* HN: เพิ่มพื้นที่และจัดกึ่งกลาง */}
              <th style={{ padding: 8, width: '15%', textAlign: 'center' }}>HN</th>
              {/* ชื่อ และ เบอร์โทร: ลดพื้นที่ลง 20% และอนุญาตให้ Wrap ข้อความ */}
              <th style={{ padding: 8, width: '24%', textAlign: 'left' }}>ชื่อ-นามสกุล</th>
              <th style={{ padding: 8, width: '16%', textAlign: 'left' }}>เบอร์โทร</th>
              <th style={{ padding: 8, width: '15%', textAlign: 'left' }}>กลุ่มลูกค้า</th>
              <th style={{ padding: 8, width: '10%', textAlign: 'center' }}>สถานะ</th>
              <th style={{ padding: 8, width: '20%', textAlign: 'center' }}>ดูข้อมูล / แก้ไขข้อมูล</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((c) => (
              <tr key={c.id} style={{ borderTop: '1px solid #eaeaea' }}>
                <td style={{ padding: 8, textAlign: 'center', verticalAlign: 'top' }}>{c.id}</td>
                <td style={{
                  padding: 8,
                  verticalAlign: 'top',
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                  lineHeight: '1.4'
                }}>
                  {c.name}
                </td>
                <td style={{
                  padding: 8,
                  verticalAlign: 'top',
                  whiteSpace: 'normal',
                  wordBreak: 'break-word'
                }}>
                  {c.phone}
                </td>
                <td style={{ padding: 8, verticalAlign: 'top' }}>{c.segment}</td>
                <td style={{ padding: 8, textAlign: 'center', verticalAlign: 'top' }}>
                  <span className={`badge badge--${c.status === 'ใช้งาน' ? 'active' : 'inactive'}`}>
                    {c.status}
                  </span>
                </td>
                <td style={{ padding: 8, textAlign: 'center', verticalAlign: 'top' }}>
                  <button
                    type="button"
                    className="button"
                    onClick={() => handleView(c)} // เรียก handleView แทน setSelected(c)
                    style={{ marginRight: 8 }}
                  >
                    ดูข้อมูล
                  </button>
                  <button
                    type="button"
                    className="button"
                    onClick={() => onEdit?.(dynamicFullIndex.get(c.id) || c)}
                  >
                    แก้ไขข้อมูล
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Section (คงเดิมตาม HTML ใหม่) */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginTop: 12 }}>
              <div style={{ color: '#6b7280' }}>แสดง {paged.length ? start + 1 : 0}-{Math.min(end, filtered.length)} จาก {filtered.length} รายการ</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))} className="select">
                  <option value={10}>10</option><option value={20}>20</option><option value={50}>50</option>
                </select>
                <button className="button" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={currentPage <= 1}>ก่อนหน้า</button>
                <div style={{ display: 'flex', gap: 4 }}>
                  {visiblePages.map((p, idx) => (
                    <button key={idx} className="button" onClick={() => typeof p === 'number' && setPage(p)} disabled={p === currentPage || p === '…'}>{p}</button>
                  ))}
                </div>
                <button className="button" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages}>ถัดไป</button>
              </div>
            </div>

            {selected && (
              <CustomerModal
                customer={selected}
                fullIndex={dynamicFullIndex}
                onClose={() => setSelected(null)}
              />
            )}
          </section>
        );


}