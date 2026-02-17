import { useEffect, useMemo, useRef, useState } from 'react';
import SERVICE_FEES_FULL from '../mocks/serviceFeesFull';

const SERVICE_FEE_TYPES = [
  'ครอสออกกำลังการ',
  'ค่าหัถการ',
  'การบริการแลป',
  'ค่าบริการให้วิตามิน',
];

const toCurrency = (n) => {
  const value = Number(n);
  if (!Number.isFinite(value)) return '-';
  return value.toLocaleString('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const normalizeFees = (src) => {
  const list = Array.isArray(src) ? src : [];
  const used = new Set();
  return list.map((row, i) => {
    const rawCode = String(row?.code || '').trim();
    let code = rawCode || `SV${String(i + 1).padStart(3, '0')}`;
    while (used.has(code)) {
      code = `SV${String(i + 1 + used.size).padStart(3, '0')}`;
    }
    used.add(code);

    return {
      code,
      name: String(row?.name || '').trim(),
      type: String(row?.type || '').trim(),
      price: Number(row?.price),
    };
  });
};

export default function ServiceFees({
  title = 'รายการค่าบริการ',
  items,
  onCreateNew,
  onOpenTrainersOperators,
  onBackToRecord,
}) {
  const stickyRef = useRef(null);
  const [selectedType, setSelectedType] = useState('ทั้งหมด');
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
    () => normalizeFees(items ?? SERVICE_FEES_FULL),
    [items]
  );

  const filtered = useMemo(() => {
    const q = String(query || '')
      .trim()
      .toLowerCase();
    const typeFiltered =
      !selectedType || selectedType === 'ทั้งหมด'
        ? base
        : base.filter((row) => row.type === selectedType);

    if (!q) return typeFiltered;

    return typeFiltered.filter((row) => {
      const hay = `${row.code} ${row.name} ${row.type}`.toLowerCase();
      return hay.includes(q);
    });
  }, [base, query, selectedType]);

  const totalPages = useMemo(() => {
    const size = Math.max(1, Number(pageSize) || 10);
    return Math.max(1, Math.ceil(filtered.length / size));
  }, [filtered.length, pageSize]);

  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const paged = filtered.slice(start, end);

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

  useEffect(() => {
    setPage(1);
  }, [selectedType, pageSize, query]);

  return (
    <section className="service-fees-page">
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
          <h1 className="page-title">{title}</h1>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              flexWrap: 'wrap',
            }}
          >
            <label style={{ fontWeight: 700 }} htmlFor="serviceFeeType">
              ประเภทค่าบริการ
            </label>
            <select
              id="serviceFeeType"
              className="select"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              aria-label="เลือกประเภทค่าบริการ"
            >
              <option value="ทั้งหมด">ทั้งหมด</option>
              {SERVICE_FEE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            <label style={{ fontWeight: 700 }} htmlFor="serviceFeePageSize">
              จำนวนแถว
            </label>
            <select
              id="serviceFeePageSize"
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

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 8,
            flexWrap: 'wrap',
            marginBottom: 10,
          }}
        >
          {onCreateNew ? (
            <button
              type="button"
              className="button"
              onClick={() => onCreateNew?.()}
            >
              สร้างรายการค่าบริการ
            </button>
          ) : null}

          <button
            type="button"
            className="button"
            onClick={() => onOpenTrainersOperators?.()}
            disabled={!onOpenTrainersOperators}
          >
            ผู้ฝึกสอน/ผู้ดำเนินการ
          </button>

          {onBackToRecord ? (
            <button
              type="button"
              className="button button--solid"
              onClick={() => onBackToRecord?.()}
            >
              กลับไปหน้าบันทึกรายการ
            </button>
          ) : null}
        </div>

        <div
          className="toolbar"
          style={{ display: 'flex', gap: 8, marginBottom: 12 }}
        >
          <input
            aria-label="ค้นหารายการค่าบริการ"
            placeholder="ค้นหา รหัส / รายการค่าบริการ / ประเภท"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ flex: 1, padding: '8px 10px' }}
          />
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
              <th>รายการค่าบริการ</th>
              <th style={{ width: 220 }}>ประเภท</th>
              <th style={{ width: 140, textAlign: 'right' }}>ราคา (บาท)</th>
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
                <td>{row.type || '-'}</td>
                <td style={{ textAlign: 'right' }}>{toCurrency(row.price)}</td>
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
