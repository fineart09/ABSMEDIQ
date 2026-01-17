import { useEffect, useMemo, useRef, useState } from 'react';
import MOCK_PURCHASE_ORDERS_FULL from '../mocks/purchaseOrdersFull';

const toCurrency = (n) => {
  const value = Number(n);
  if (!Number.isFinite(value)) return '-';
  return value.toLocaleString('th-TH', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

const toDateTH = (iso) => {
  if (!iso) return '-';
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return String(iso);
    return d.toLocaleDateString('th-TH');
  } catch {
    return String(iso);
  }
};

const sumTotal = (order) => {
  const items = Array.isArray(order?.items) ? order.items : [];
  return items.reduce((acc, it) => {
    const qty = Number(it?.qty);
    const price = Number(it?.price);
    if (!Number.isFinite(qty) || !Number.isFinite(price)) return acc;
    return acc + qty * price;
  }, 0);
};

const countItems = (order) => {
  const items = Array.isArray(order?.items) ? order.items : [];
  return items.reduce((acc, it) => {
    const qty = Number(it?.qty);
    return acc + (Number.isFinite(qty) ? qty : 0);
  }, 0);
};

const badgeClassForStatus = (status) => {
  if (status === 'รับของแล้ว') return 'badge badge--active';
  if (status === 'ร่าง') return 'badge badge--inactive';
  return 'badge badge--hn';
};

export default function PurchaseOrders({
  purchaseOrders,
  onEdit,
  onCreateNew,
}) {
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

  const base = useMemo(() => {
    const src = Array.isArray(purchaseOrders)
      ? purchaseOrders
      : Array.isArray(MOCK_PURCHASE_ORDERS_FULL)
      ? MOCK_PURCHASE_ORDERS_FULL
      : [];

    return src.slice();
  }, [purchaseOrders]);

  const filtered = useMemo(() => {
    const q = String(query || '')
      .trim()
      .toLowerCase();
    if (!q) return base;
    return base.filter((o) => {
      const text = [o?.poNo, o?.supplier, o?.status]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return text.includes(q);
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
          <h1 className="page-title">รายการสั่งซื้อสินค้า</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              type="button"
              className="button"
              onClick={() => onCreateNew?.()}
            >
              สร้างรายการสั่งซื้อ
            </button>
          </div>
        </div>

        <div
          className="toolbar"
          style={{ display: 'flex', gap: 8, marginBottom: 12 }}
        >
          <input
            aria-label="ค้นหารายการสั่งซื้อสินค้า"
            placeholder="ค้นหาเลขที่ / ผู้จำหน่าย / สถานะ"
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
              <th style={{ padding: 8 }}>เลขที่</th>
              <th style={{ padding: 8 }}>วันที่สั่งซื้อ</th>
              <th style={{ padding: 8 }}>ผู้จำหน่าย</th>
              <th style={{ padding: 8 }}>จำนวน</th>
              <th style={{ padding: 8 }}>ยอดรวม</th>
              <th style={{ padding: 8 }}>สถานะ</th>
              <th style={{ padding: 8 }}>ดูข้อมูล / แก้ไข</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((o) => (
              <tr
                key={o.id || o.poNo}
                style={{ borderTop: '1px solid #eaeaea' }}
              >
                <td style={{ padding: 8 }}>{o.poNo || '-'}</td>
                <td style={{ padding: 8 }}>{toDateTH(o.orderedAt)}</td>
                <td style={{ padding: 8 }}>{o.supplier || '-'}</td>
                <td style={{ padding: 8 }}>{countItems(o)}</td>
                <td style={{ padding: 8 }}>{toCurrency(sumTotal(o))}</td>
                <td style={{ padding: 8 }}>
                  <span className={badgeClassForStatus(o.status)}>
                    {o.status || '-'}
                  </span>
                </td>
                <td style={{ padding: 8 }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      type="button"
                      className="button"
                      onClick={() => onEdit?.(o)}
                    >
                      แก้ไขรายการสั่งซื้อ
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {paged.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: 16, color: '#6b7280' }}>
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
              <span
                key={`ellipsis-${idx}`}
                style={{ padding: '0 6px', color: '#6b7280' }}
              >
                …
              </span>
            ) : (
              <button
                key={p}
                type="button"
                className="button"
                onClick={() => setPage(Number(p))}
                aria-current={Number(p) === currentPage ? 'page' : undefined}
                style={
                  Number(p) === currentPage
                    ? { background: 'rgba(21, 137, 144, 0.18)' }
                    : undefined
                }
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
