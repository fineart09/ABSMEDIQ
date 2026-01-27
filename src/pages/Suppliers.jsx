import { useEffect, useMemo, useRef, useState } from 'react';
import SUPPLIERS_FULL from '../mocks/suppliersFull';

const normalizeText = (v) =>
  String(v || '')
    .trim()
    .toLowerCase();

const normalizeSuppliers = (src) => {
  const list = Array.isArray(src) ? src : [];
  return list.map((s, i) => ({
    id: String(s?.id || `SUP${String(i + 1).padStart(3, '0')}`).trim(),
    name: String(s?.name || '').trim(),
    address: String(s?.address || '').trim(),
    taxId: String(s?.taxId || '').trim(),
  }));
};

export default function Suppliers({ suppliers, onCreateNew, onBack }) {
  const stickyRef = useRef(null);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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

  const base = useMemo(
    () =>
      normalizeSuppliers(Array.isArray(suppliers) ? suppliers : SUPPLIERS_FULL),
    [suppliers]
  );

  const filtered = useMemo(() => {
    const q = normalizeText(query);
    if (!q) return base;
    return base.filter((s) => {
      const haystack = [s.id, s.name, s.address, s.taxId]
        .filter(Boolean)
        .join(' ');
      return normalizeText(haystack).includes(q);
    });
  }, [base, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  useEffect(() => {
    setPage(1);
  }, [query, pageSize]);

  const paged = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  const pageNumbers = useMemo(() => {
    const pages = [];
    const total = totalPages;
    const current = currentPage;
    const maxSimple = 7;
    if (total <= maxSimple) {
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

  return (
    <section>
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
          <h1 className="page-title">รายการผู้จำหน่าย</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              type="button"
              className="button"
              onClick={() => onCreateNew?.()}
            >
              สร้างรายการผู้จำหน่าย
            </button>

            <button
              type="button"
              className="button button--solid"
              onClick={() => onBack?.()}
            >
              กลับไปหน้ารายการสั่งซื้อสินค้า
            </button>
          </div>
        </div>

        <div
          className="toolbar"
          style={{ display: 'flex', gap: 8, marginBottom: 12 }}
        >
          <input
            aria-label="ค้นหารายการผู้จำหน่าย"
            placeholder="ค้นหา ID / ผู้จำหน่าย / ที่อยู่ / เลขผู้เสียภาษี"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ flex: 1, padding: '8px 10px' }}
          />
          <button type="button" className="button" onClick={() => setQuery('')}>
            ล้าง
          </button>

          <select
            className="select"
            aria-label="จำนวนแถวต่อหน้า"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value) || 10)}
          >
            {[10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n} แถว
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="table-card" style={{ overflowX: 'auto' }}>
        <table
          className="customers-table"
          style={{ width: '100%', borderCollapse: 'collapse' }}
        >
          <thead>
            <tr>
              <th style={{ padding: 8, width: 120 }}>ID</th>
              <th style={{ padding: 8 }}>ผู้จำหน่าย</th>
              <th style={{ padding: 8 }}>ที่อยู่</th>
              <th style={{ padding: 8, width: 180 }}>เลขประจำตัวผู้เสียภาษี</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((s) => (
              <tr
                key={s.id || s.name}
                style={{ borderTop: '1px solid #eaeaea' }}
              >
                <td style={{ padding: 8 }}>{s.id || '-'}</td>
                <td style={{ padding: 8 }}>{s.name || '-'}</td>
                <td style={{ padding: 8 }}>{s.address || '-'}</td>
                <td style={{ padding: 8 }}>{s.taxId || '-'}</td>
              </tr>
            ))}

            {paged.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: 16, color: '#6b7280' }}>
                  ไม่พบรายการ
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 8,
          marginTop: 12,
        }}
      >
        <div style={{ color: '#6b7280' }}>ทั้งหมด {filtered.length} รายการ</div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            type="button"
            className="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
          >
            ก่อนหน้า
          </button>

          {pageNumbers.map((p, idx) =>
            p === '…' ? (
              <span key={`ellipsis-${idx}`} style={{ padding: '0 6px' }}>
                …
              </span>
            ) : (
              <button
                key={p}
                type="button"
                className={
                  'button ' + (p === currentPage ? 'button--solid' : '')
                }
                onClick={() => setPage(p)}
                style={{ minWidth: 44 }}
              >
                {p}
              </button>
            )
          )}

          <button
            type="button"
            className="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
          >
            ถัดไป
          </button>
        </div>
      </div>
    </section>
  );
}
