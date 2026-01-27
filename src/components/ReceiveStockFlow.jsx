import { useEffect, useMemo, useState } from 'react';

const toCurrency = (n) => {
  const value = Number(n);
  if (!Number.isFinite(value)) return '-';
  return value.toLocaleString('th-TH', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

const normalizeItems = (src, codePrefix) => {
  const list = Array.isArray(src) ? src : [];
  const usedCodes = new Set();

  return list.map((item, idx) => {
    const rawCode = String(item?.code || '').trim();
    let code = rawCode || `${codePrefix}${String(idx + 1).padStart(3, '0')}`;
    while (usedCodes.has(code)) {
      code = `${codePrefix}${String(idx + 1 + usedCodes.size).padStart(3, '0')}`;
    }
    usedCodes.add(code);

    const stock = Number.isFinite(Number(item?.stock)) ? Number(item.stock) : 0;
    const status = item?.status || (stock > 0 ? 'ใช้งาน' : 'ไม่ใช้งาน');

    return {
      ...item,
      code,
      stock,
      status,
    };
  });
};

function ReceiveStockDetailsModal({
  open,
  item,
  title,
  withLotExpiry,
  onClose,
  onConfirm,
  labels,
}) {
  const [qty, setQty] = useState(1);
  const [lotNo, setLotNo] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setQty(1);
    setLotNo('');
    setExpiryDate('');
    setError('');
  }, [open, item?.code]);

  if (!open || !item) return null;

  const displayName = item?.nameTh || item?.nameEn || '-';

  const handleConfirm = () => {
    const qtyNum = Number(qty);
    const lot = String(lotNo || '').trim();
    const exp = String(expiryDate || '').trim();

    if (!Number.isFinite(qtyNum) || qtyNum <= 0) {
      setError('กรุณาระบุจำนวนรับเข้าให้ถูกต้อง');
      return;
    }
    if (withLotExpiry) {
      if (!lot) {
        setError('กรุณาระบุเลข lot');
        return;
      }
      if (!exp) {
        setError('กรุณาระบุวันหมดอายุ');
        return;
      }
    }

    setError('');
    onConfirm?.({
      code: item.code,
      qty: qtyNum,
      ...(withLotExpiry
        ? {
            lotNo: lot,
            expiryDate: exp,
          }
        : null),
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal modal--customer-details"
        role="dialog"
        aria-modal="true"
        aria-label={`${title} ${item.code}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>{title}</h3>
        </div>
        <div className="modal-body">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '160px 1fr',
              gap: '8px 12px',
              marginBottom: 14,
            }}
          >
            <div>{labels?.code || 'รหัส'}</div>
            <div>
              <span className="badge badge--hn">{item.code}</span>
            </div>
            <div>{labels?.name || 'ชื่อ'}</div>
            <div>{displayName}</div>
            <div>{labels?.category || 'หมวดหมู่'}</div>
            <div>{item.category || '-'}</div>
            <div>{labels?.unit || 'หน่วย'}</div>
            <div>{item.unit || '-'}</div>
            <div>{labels?.stock || 'คงเหลือปัจจุบัน'}</div>
            <div>{Number.isFinite(Number(item.stock)) ? item.stock : '-'}</div>
            <div>{labels?.price || 'ราคา'}</div>
            <div>{toCurrency(item.price)}</div>
          </div>

          <div
            className="form-card"
            style={{
              padding: 12,
              width: '100%',
              background: 'rgba(255,255,255,0.9)',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '160px 1fr',
                gap: '8px 12px',
                alignItems: 'center',
              }}
            >
              <div>{labels?.qty || 'จำนวนรับเข้า'}</div>
              <div>
                <input
                  className="input"
                  type="number"
                  min={1}
                  step={1}
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  style={{ width: 'min(260px, 100%)' }}
                />
              </div>

              {withLotExpiry ? (
                <>
                  <div>{labels?.lotNo || 'เลข lot'}</div>
                  <div>
                    <input
                      className="input"
                      value={lotNo}
                      onChange={(e) => setLotNo(e.target.value)}
                      placeholder={
                        labels?.lotNoPlaceholder || 'เช่น LOT-2026-001'
                      }
                      style={{ width: 'min(360px, 100%)' }}
                    />
                  </div>

                  <div>{labels?.expiryDate || 'วันหมดอายุ'}</div>
                  <div>
                    <input
                      className="input"
                      type="date"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      style={{ width: 'min(260px, 100%)' }}
                    />
                  </div>
                </>
              ) : null}
            </div>

            {error ? (
              <div style={{ color: '#b91c1c', marginTop: 10 }}>{error}</div>
            ) : null}
          </div>
        </div>
        <div className="modal-actions">
          <button type="button" className="button" onClick={onClose}>
            {labels?.cancel || 'ยกเลิก'}
          </button>
          <button
            type="button"
            className="button button--solid"
            onClick={handleConfirm}
          >
            {labels?.confirm || 'ยืนยันรับเข้า stock'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ReceiveStockFlow({
  open,
  modal,
  title,
  items,
  onCancel,
  onReceive,
  codePrefix = 'ITM',
  withLotExpiry = true,
  labels,
}) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const base = useMemo(
    () => normalizeItems(items, codePrefix),
    [items, codePrefix]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return base;
    return base.filter((p) => {
      return (
        String(p.code || '')
          .toLowerCase()
          .includes(q) ||
        String(p.nameTh || '')
          .toLowerCase()
          .includes(q) ||
        String(p.nameEn || '')
          .toLowerCase()
          .includes(q) ||
        String(p.category || '')
          .toLowerCase()
          .includes(q) ||
        String(p.status || '')
          .toLowerCase()
          .includes(q)
      );
    });
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
  }, [query, pageSize]);

  const content = (
    <section className="receive-stock-page">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          marginBottom: 12,
        }}
      >
        <h1 className="page-title">{title || 'รับสินค้าเข้า stock'}</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            type="button"
            className="button button--solid"
            onClick={() => onCancel?.()}
          >
            {labels?.back || 'กลับ'}
          </button>
        </div>
      </div>

      <div className="form-card" style={{ width: '100%' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            flexWrap: 'wrap',
            marginBottom: 12,
          }}
        >
          <div style={{ fontWeight: 800 }}>
            {labels?.searchTitle || 'ค้นหารายการเพื่อรับเข้า stock'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              className="input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                labels?.searchPlaceholder ||
                'ค้นหาด้วยรหัส / ชื่อ / หมวดหมู่ / สถานะ'
              }
              style={{ width: 'min(520px, 100%)' }}
            />
            {query ? (
              <button
                type="button"
                className="button"
                onClick={() => setQuery('')}
              >
                {labels?.clear || 'ล้าง'}
              </button>
            ) : null}
          </div>
        </div>

        <div className="table-card" style={{ overflowX: 'auto' }}>
          <table
            className="customers-table"
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              tableLayout: 'fixed',
            }}
          >
            <thead>
              <tr>
                <th style={{ padding: 8, width: 110 }}>
                  {labels?.colCode || 'รหัส'}
                </th>
                <th style={{ padding: 8, width: 260 }}>
                  {labels?.colName || 'ชื่อ'}
                </th>
                <th style={{ padding: 8, width: 180 }}>
                  {labels?.colCategory || 'หมวดหมู่'}
                </th>
                <th style={{ padding: 8, width: 90 }}>
                  {labels?.colStock || 'คงเหลือ'}
                </th>
                <th style={{ padding: 8, width: 110 }}>
                  {labels?.colStatus || 'สถานะ'}
                </th>
              </tr>
            </thead>
            <tbody>
              {paged.length ? (
                paged.map((p) => (
                  <tr
                    key={p.code}
                    style={{
                      borderTop: '1px solid #eaeaea',
                      cursor: 'pointer',
                    }}
                    onClick={() => setSelected(p)}
                    title={
                      labels?.rowHint || 'คลิกเพื่อดูรายละเอียดและรับเข้า stock'
                    }
                  >
                    <td style={{ padding: 8 }}>{p.code}</td>
                    <td style={{ padding: 8 }}>
                      {p.nameTh || p.nameEn || '-'}
                    </td>
                    <td style={{ padding: 8 }}>{p.category || '-'}</td>
                    <td style={{ padding: 8 }}>
                      {Number.isFinite(Number(p.stock)) ? p.stock : '-'}
                    </td>
                    <td style={{ padding: 8 }}>{p.status || '-'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ padding: 12, color: '#6b7280' }}>
                    {labels?.empty || 'ไม่พบรายการ'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
            marginTop: 12,
            flexWrap: 'wrap',
          }}
          aria-label="ตัวแบ่งหน้า"
        >
          <div style={{ color: '#6b7280' }}>
            แสดง {paged.length ? start + 1 : 0}-{Math.min(end, filtered.length)}{' '}
            จาก {filtered.length} รายการ
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              flexWrap: 'wrap',
              justifyContent: 'flex-end',
            }}
          >
            <label
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              ต่อหน้า
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value) || 10)}
                className="select"
                aria-label="จำนวนรายการต่อหน้า"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </label>
            <button
              type="button"
              className="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              aria-label="ก่อนหน้า"
            >
              ก่อนหน้า
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {visiblePages.map((p, idx) =>
                p === '…' ? (
                  <span key={`ellipsis-${idx}`} style={{ padding: '0 6px' }}>
                    …
                  </span>
                ) : (
                  <button
                    key={`page-${p}`}
                    type="button"
                    className="button"
                    onClick={() => setPage(p)}
                    disabled={p === currentPage}
                    aria-current={p === currentPage ? 'page' : undefined}
                  >
                    {p}
                  </button>
                )
              )}
            </div>
            <button
              type="button"
              className="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              aria-label="ถัดไป"
            >
              ถัดไป
            </button>
          </div>
        </div>
      </div>

      <ReceiveStockDetailsModal
        open={!!selected}
        item={selected}
        title={title || 'รับสินค้าเข้า stock'}
        withLotExpiry={withLotExpiry}
        labels={labels}
        onClose={() => setSelected(null)}
        onConfirm={(payload) => {
          onReceive?.(payload);
          setSelected(null);
        }}
      />
    </section>
  );

  if (open === false) return null;

  if (modal) {
    return (
      <div className="modal-overlay" onClick={() => onCancel?.()}>
        <div
          className="modal"
          role="dialog"
          aria-modal="true"
          aria-label={title || 'รับเข้า stock'}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: 'min(1120px, 96vw)',
            maxHeight: 'min(90vh, 900px)',
            overflow: 'auto',
          }}
        >
          {content}
        </div>
      </div>
    );
  }

  return content;
}
