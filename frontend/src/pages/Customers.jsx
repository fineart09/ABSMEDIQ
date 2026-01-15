import { useEffect, useMemo, useRef, useState } from 'react';

//transform backend data
const transformBackendData = (data, statusOverrides) => {
  return data.map((c) => ({
    id: String(c.id ?? ''),
    hn: String(c.id ?? ''),
    name: c.name || 'ไม่ระบุชื่อ',
    phone: c.phone || '-',
    email: c.email || '-',
    status: statusOverrides?.[c.id] || c.status || 'ใช้งาน',
    lastVisit: c.lastVisit || '-',
    segment: c.segment || 'ทั่วไป',
    discount: c.discount || '0%',
  }));
};

//frontend customer modal
function CustomerModal({ customer, onClose }) {
  if (!customer) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" role="dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header"><h3>รายละเอียดลูกค้า</h3></div>
        <div className="modal-body">
          <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '8px 12px' }}>
            <div>HN</div><div>{customer.hn}</div>
            <div>ชื่อ-นามสกุล</div><div>{customer.name}</div>
            <div>สถานะ</div><div>{customer.status}</div>
            <div>โทรศัพท์</div><div>{customer.phone}</div>
          </div>
        </div>
        <div className="modal-actions">
          <button type="button" className="button" onClick={onClose}>ปิด</button>
        </div>
      </div>
    </div>
  );
}

//main
export default function Customers({ onEdit, onCreateNew, statusOverrides }) {

  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const stickyRef = useRef(null);

  //backend java
  useEffect(() => {
    const fetchBackend = async () => {
      try {
        setIsLoading(true);
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

  // --- Sticky Header Logic (คงเดิมตาม Mockup) ---
  useEffect(() => {
    const update = () => {
      if (stickyRef.current) {
        const h = stickyRef.current.getBoundingClientRect().height;
        document.documentElement.style.setProperty('--page-sticky-height', `${Math.ceil(h)}px`);
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  //get transformBackendData
  const base = useMemo(() => {
    return transformBackendData(customers, statusOverrides);
  }, [customers, statusOverrides]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return base;
    return base.filter((c) =>
      c.name.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q)
    );
  }, [query, base]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  //loading or error
  if (isLoading) return <div className="p-8">กำลังดึงข้อมูลลูกค้าจาก SQL Server...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  //return frontend
  return (
    <section className="customers-page">
      <div className="page-sticky-header" ref={stickyRef}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <h1 className="page-title">รายชื่อลูกค้า</h1>
          <button type="button" className="button" onClick={onCreateNew}>สร้างลูกค้าใหม่</button>
        </div>
        <div className="toolbar" style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <input
            placeholder="ค้นหาชื่อ / รหัสลูกค้า (HN)"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            style={{ flex: 1, padding: '8px' }}
          />
        </div>
      </div>

      <div className="table-card">
        <table className="customers-table" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>HN</th><th>ชื่อ</th><th>โทรศัพท์</th><th>สถานะ</th><th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((c) => (
              <tr key={c.id}>
                <td>{c.hn}</td>
                <td>{c.name}</td>
                <td>{c.phone}</td>
                <td>
                  <span className={`badge badge--${c.status === 'ใช้งาน' ? 'active' : 'inactive'}`}>
                    {c.status}
                  </span>
                </td>
                <td>
                  <button className="button" onClick={() => setSelected(c)}>ดูข้อมูล</button>
                  <button className="button" onClick={() => onEdit?.(c)} style={{marginLeft: 8}}>แก้ไข</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination (Simplified) */}
      <div className="pagination" style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between' }}>
        <span>ทั้งหมด {filtered.length} รายการ</span>
        <div>
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>ก่อนหน้า</button>
          <span style={{ margin: '0 10px' }}>หน้า {page} จาก {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>ถัดไป</button>
        </div>
      </div>

      {selected && <CustomerModal customer={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}