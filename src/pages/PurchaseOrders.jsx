import { useEffect, useMemo, useRef, useState } from 'react';
import MOCK_PURCHASE_ORDERS_FULL from '../mocks/purchaseOrdersFull';

const toNumber = (n) => {
  const v = Number(n);
  return Number.isFinite(v) ? v : 0;
};

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
  if (status === 'รับบางส่วน') return 'badge badge--partial';
  if (status === 'ร่าง') return 'badge badge--inactive';
  return 'badge badge--hn';
};

const calcOrderedQtyByCode = (order) => {
  const items = Array.isArray(order?.items) ? order.items : [];
  const byCode = new Map();
  for (const it of items) {
    const code = String(it?.code || '').trim();
    if (!code) continue;
    byCode.set(code, toNumber(it?.qty));
  }
  return byCode;
};

const calcReceivedQtyByCode = (order) => {
  const items = Array.isArray(order?.items) ? order.items : [];
  const byCode = new Map();
  for (const it of items) {
    const code = String(it?.code || '').trim();
    if (!code) continue;
    byCode.set(code, toNumber(it?.receivedQty));
  }
  return byCode;
};

function ReceivePurchaseOrderModal({ order, onClose, onConfirm }) {
  const [receivingByCode, setReceivingByCode] = useState({});
  const [error, setError] = useState('');

  const orderedByCode = useMemo(() => calcOrderedQtyByCode(order), [order]);
  const receivedByCode = useMemo(() => calcReceivedQtyByCode(order), [order]);

  const rows = useMemo(() => {
    const items = Array.isArray(order?.items) ? order.items : [];
    return items.map((it) => {
      const code = String(it?.code || '').trim();
      const orderedQty = toNumber(it?.qty);
      const receivedQty = toNumber(it?.receivedQty);
      const remaining = Math.max(0, orderedQty - receivedQty);
      return {
        code,
        nameTh: String(it?.nameTh || ''),
        unit: String(it?.unit || ''),
        orderedQty,
        receivedQty,
        remaining,
      };
    });
  }, [order]);

  useEffect(() => {
    if (!order) return;
    // Default receive qty = remaining (can be edited to partial)
    const next = {};
    for (const r of rows) {
      if (!r.code) continue;
      next[r.code] = r.remaining;
    }
    setReceivingByCode(next);
    setError('');
  }, [order, rows]);

  if (!order) return null;

  const handleConfirm = () => {
    const items = [];
    const issues = [];

    for (const r of rows) {
      if (!r.code) continue;
      const want = toNumber(receivingByCode[r.code]);
      const orderedQty = orderedByCode.get(r.code) ?? 0;
      const receivedQty = receivedByCode.get(r.code) ?? 0;
      const remaining = Math.max(0, orderedQty - receivedQty);

      if (want < 0) {
        issues.push(`จำนวนรับเข้าไม่ถูกต้อง: ${r.code}`);
        continue;
      }
      if (want > remaining) {
        issues.push(`รับเกินจำนวนคงเหลือ: ${r.code} (คงเหลือ ${remaining})`);
        continue;
      }
      if (want > 0) items.push({ code: r.code, qty: want });
    }

    if (issues.length) {
      setError(issues[0]);
      return;
    }

    if (!items.length) {
      setError('กรุณาระบุจำนวนรับเข้าอย่างน้อย 1 รายการ');
      return;
    }

    setError('');
    onConfirm?.({ orderId: String(order?.id || order?.poNo || ''), items });
  };

  const isFullyReceived = rows.every((r) => r.remaining <= 0);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal modal--customer-details"
        role="dialog"
        aria-modal="true"
        aria-label={`รับสินค้า: ${order.poNo || order.id}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>ตรวจนับก่อนรับสินค้า</h3>
        </div>

        <div className="modal-body">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '160px 1fr',
              gap: '8px 12px',
              marginBottom: 12,
            }}
          >
            <div>เลขที่ใบสั่งซื้อ</div>
            <div>
              <span className="badge badge--hn">{order.poNo || '-'}</span>
            </div>
            <div>ผู้จำหน่าย</div>
            <div>{order.supplier || '-'}</div>
            <div>สถานะปัจจุบัน</div>
            <div>
              <span className={badgeClassForStatus(order.status)}>
                {order.status || '-'}
              </span>
            </div>
          </div>

          {isFullyReceived ? (
            <div style={{ color: '#158990', marginBottom: 12 }}>
              ใบสั่งซื้อนี้รับครบแล้ว
            </div>
          ) : null}

          <div className="table-card" style={{ overflowX: 'auto' }}>
            <table
              className="customers-table"
              style={{ width: '100%', borderCollapse: 'collapse' }}
            >
              <thead>
                <tr>
                  <th style={{ padding: 8, width: 110 }}>รหัส</th>
                  <th style={{ padding: 8 }}>รายการ</th>
                  <th style={{ padding: 8, width: 90 }}>หน่วย</th>
                  <th style={{ padding: 8, width: 90 }}>สั่ง</th>
                  <th style={{ padding: 8, width: 90 }}>รับแล้ว</th>
                  <th style={{ padding: 8, width: 90 }}>คงเหลือ</th>
                  <th style={{ padding: 8, width: 160 }}>รับเข้าครั้งนี้</th>
                </tr>
              </thead>
              <tbody>
                {rows.length ? (
                  rows.map((r) => (
                    <tr
                      key={r.code || Math.random()}
                      style={{ borderTop: '1px solid #eaeaea' }}
                    >
                      <td style={{ padding: 8 }}>{r.code || '-'}</td>
                      <td style={{ padding: 8 }}>{r.nameTh || '-'}</td>
                      <td style={{ padding: 8 }}>{r.unit || '-'}</td>
                      <td style={{ padding: 8 }}>{r.orderedQty}</td>
                      <td style={{ padding: 8 }}>{r.receivedQty}</td>
                      <td style={{ padding: 8 }}>{r.remaining}</td>
                      <td style={{ padding: 8 }}>
                        <input
                          className="input"
                          type="number"
                          min={0}
                          step={1}
                          value={
                            Number.isFinite(Number(receivingByCode[r.code]))
                              ? receivingByCode[r.code]
                              : 0
                          }
                          disabled={r.remaining <= 0}
                          onChange={(e) => {
                            const nextValue = e.target.value;
                            setReceivingByCode((prev) => ({
                              ...prev,
                              [r.code]: nextValue,
                            }));
                          }}
                          style={{ width: '140px' }}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} style={{ padding: 12, color: '#6b7280' }}>
                      ไม่พบรายการสินค้าในใบสั่งซื้อ
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {error ? (
            <div style={{ color: '#b91c1c', marginTop: 10 }}>{error}</div>
          ) : null}
        </div>

        <div className="modal-actions">
          <button type="button" className="button" onClick={onClose}>
            ยกเลิก
          </button>
          <button
            type="button"
            className="button button--solid"
            onClick={handleConfirm}
            disabled={rows.length === 0 || isFullyReceived}
          >
            ยืนยันรับสินค้า
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PurchaseOrders({
  purchaseOrders,
  onEdit,
  onCreateNew,
  onViewSuppliers,
  onBackToPurchaseHome,
  onReceive,
}) {
  const stickyRef = useRef(null);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [receivingOrder, setReceivingOrder] = useState(null);

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

            <button
              type="button"
              className="button"
              onClick={() => onViewSuppliers?.()}
            >
              รายการผู้จำหน่าย
            </button>

            <button
              type="button"
              className="button button--solid"
              onClick={() => onBackToPurchaseHome?.()}
            >
              กลับไปหน้ารายการสินค้า
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
              <th style={{ padding: 8 }}>รับสินค้า</th>
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
                  <button
                    type="button"
                    className="button"
                    onClick={() => setReceivingOrder(o)}
                  >
                    รับสินค้า
                  </button>
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
                <td colSpan={8} style={{ padding: 16, color: '#6b7280' }}>
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

      <ReceivePurchaseOrderModal
        order={receivingOrder}
        onClose={() => setReceivingOrder(null)}
        onConfirm={(payload) => {
          onReceive?.(payload);
          setReceivingOrder(null);
        }}
      />
    </section>
  );
}
