import { useEffect, useMemo, useRef, useState } from 'react';
import TRAINERS_OPERATORS_FULL from '../mocks/trainersOperatorsFull';

const normalizeText = (v) =>
  String(v || '')
    .trim()
    .toLowerCase();

const normalizeTrainersOperators = (src) => {
  const list = Array.isArray(src) ? src : [];
  const used = new Set();
  return list.map((row, i) => {
    const rawCode = String(row?.code || '').trim();
    let code = rawCode || `TO${String(i + 1).padStart(3, '0')}`;
    while (used.has(code)) {
      code = `TO${String(i + 1 + used.size).padStart(3, '0')}`;
    }
    used.add(code);

    return {
      code,
      name: String(row?.name || '').trim(),
      role: String(row?.role || '').trim(),
    };
  });
};

export default function TrainersOperators({ onBack, onCreateNew, items }) {
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
    () => normalizeTrainersOperators(items ?? TRAINERS_OPERATORS_FULL),
    [items]
  );

  const filtered = useMemo(() => {
    const q = normalizeText(query);
    if (!q) return base;
    return base.filter((row) => {
      const haystack = [row.code, row.name, row.role].filter(Boolean).join(' ');
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
            flexWrap: 'wrap',
          }}
        >
          <h1 className="page-title">ผู้ฝึกสอน/ผู้ดำเนินการ</h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              type="button"
              className="button"
              onClick={() => onCreateNew?.()}
              disabled={!onCreateNew}
            >
              สร้างผู้ฝึกสอน/ผู้ดำเนินการ
            </button>
            <button
              type="button"
              className="button button--solid"
              onClick={() => onBack?.()}
            >
              กลับไปหน้ารายการค่าบริการ
            </button>
          </div>
        </div>

        <div
          className="toolbar"
          style={{
            display: 'flex',
            gap: 8,
            marginBottom: 12,
            flexWrap: 'wrap',
          }}
        >
          <input
            aria-label="ค้นหารายชื่อผู้ฝึกสอน/ผู้ดำเนินการ"
            placeholder="ค้นหา รหัส / ชื่อ-นามสกุล / บทบาท"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ flex: 1, padding: '8px 10px', minWidth: 260 }}
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

        <div style={{ color: '#6b7280', marginBottom: 6 }}>
          ทั้งหมด {filtered.length} รายการ
        </div>
      </div>

      <div className="table-card" style={{ overflowX: 'auto' }}>
        <table className="customers-table">
          <thead>
            <tr>
              <th style={{ width: 120 }}>รหัส</th>
              <th>ชื่อ-นามสกุล</th>
              <th style={{ width: 220 }}>บทบาท</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((row) => (
              <tr key={row.code}>
                <td>
                  <span className="badge badge--hn">{row.code}</span>
                </td>
                <td style={{ whiteSpace: 'normal', overflowWrap: 'anywhere' }}>
                  {row.name || '-'}
                </td>
                <td>{row.role || '-'}</td>
              </tr>
            ))}

            {paged.length === 0 ? (
              <tr>
                <td colSpan={3} style={{ padding: 16, color: '#6b7280' }}>
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
          flexWrap: 'wrap',
        }}
      >
        <div style={{ color: '#6b7280' }}>
          หน้า {currentPage} / {totalPages}
        </div>

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
