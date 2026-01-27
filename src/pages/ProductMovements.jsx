import { useEffect, useMemo, useState } from 'react';

import purchaseOrdersFull from '../mocks/purchaseOrdersFull';

const toNumber = (n) => {
  const v = Number(n);
  return Number.isFinite(v) ? v : 0;
};

const normalizeProducts = (src) => {
  const list = Array.isArray(src) ? src : [];
  const usedCodes = new Set();
  return list.map((p, i) => {
    const rawCode = String(p?.code || '').trim();
    let code = rawCode || `PRD${String(i + 1).padStart(3, '0')}`;
    while (usedCodes.has(code)) {
      code = `PRD${String(i + 1 + usedCodes.size).padStart(3, '0')}`;
    }
    usedCodes.add(code);

    const stock = Number.isFinite(Number(p?.stock)) ? Number(p.stock) : 0;
    const status = p?.status || (stock > 0 ? 'ใช้งาน' : 'ไม่ใช้งาน');
    return {
      ...p,
      code,
      stock,
      status,
    };
  });
};

export default function ProductMovements({ products, onBack, onSaveCosts }) {
  const [query, setQuery] = useState('');
  const [costByRowId, setCostByRowId] = useState({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const getRowCostDraft = (row) => {
    const raw = costByRowId[row.id];
    if (raw === undefined) return row.cost;
    return raw;
  };

  const saveRowCost = (row) => {
    const code = String(row?.code || '').trim();
    const cost = Number(getRowCostDraft(row));
    if (!code || code === '-' || !Number.isFinite(cost) || cost <= 0) return;
    onSaveCosts?.({ code, cost });
  };

  const rows = useMemo(() => {
    const base = normalizeProducts(products);

    const stockLotMovements = base.flatMap((p) => {
      const lots = Array.isArray(p?.stockLots) ? p.stockLots : [];
      const name = p.nameTh || p.nameEn || '-';
      const cost = toNumber(p?.cost);

      return lots.map((lot, idx) => {
        const receivedAt = String(lot?.receivedAt || '').trim();
        const expiryDate = String(lot?.expiryDate || '').trim();
        const lotNo = String(lot?.lotNo || '').trim();
        const qty = Number.isFinite(Number(lot?.qty)) ? Number(lot.qty) : 0;

        return {
          id: `${p.code}__${receivedAt || 'unknown'}__${lotNo || 'nolot'}__${idx}`,
          date: receivedAt || '-',
          type: 'รับเข้า stock',
          code: p.code,
          name,
          qty,
          unit: p.unit || '-',
          lotNo: lotNo || '-',
          expiryDate: expiryDate || '-',
          ref: '',
          cost,
        };
      });
    });

    const poList = Array.isArray(purchaseOrdersFull) ? purchaseOrdersFull : [];
    const poMovements = poList.flatMap((po) => {
      const poNo = String(po?.poNo || po?.id || '').trim();
      const status = String(po?.status || '').trim();
      const orderedAt = String(po?.orderedAt || '').trim();
      const items = Array.isArray(po?.items) ? po.items : [];

      const isReceived = status === 'รับของแล้ว';
      const type = isReceived ? 'รับเข้า (PO)' : 'สั่งซื้อ (PO)';

      return items.map((it, idx) => {
        const code = String(it?.code || '').trim();
        const name = String(it?.nameTh || it?.nameEn || '').trim() || '-';
        const qty = Number.isFinite(Number(it?.qty)) ? Number(it.qty) : 0;
        const unit = String(it?.unit || '').trim() || '-';
        const cost = toNumber(it?.price);

        return {
          id: `PO__${poNo || 'unknown'}__${code || 'nocode'}__${orderedAt || 'nodate'}__${idx}`,
          date: orderedAt || '-',
          type,
          code: code || '-',
          name,
          qty,
          unit,
          lotNo: '-',
          expiryDate: '-',
          ref: poNo || '-',
          cost,
        };
      });
    });

    const all = [...stockLotMovements, ...poMovements];

    all.sort((a, b) =>
      String(b.date || '').localeCompare(String(a.date || ''))
    );

    const q = query.trim().toLowerCase();
    if (!q) return all;

    return all.filter((r) => {
      return (
        String(r.code || '')
          .toLowerCase()
          .includes(q) ||
        String(r.name || '')
          .toLowerCase()
          .includes(q) ||
        String(r.lotNo || '')
          .toLowerCase()
          .includes(q) ||
        String(r.type || '')
          .toLowerCase()
          .includes(q) ||
        String(r.ref || '')
          .toLowerCase()
          .includes(q)
      );
    });
  }, [products, query]);

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const pagedRows = rows.slice(start, end);

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

  return (
    <section className="products-page">
      <div className="page-sticky-header">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
            marginBottom: 12,
          }}
        >
          <h1 className="page-title">รายการเคลื่อนไหวสินค้า</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button type="button" className="button" onClick={() => onBack?.()}>
              กลับไปหน้ารายการสินค้า
            </button>
          </div>
        </div>

        <div
          className="toolbar"
          style={{ display: 'flex', gap: 8, marginBottom: 12 }}
        >
          <input
            aria-label="ค้นหารายการเคลื่อนไหวสินค้า"
            placeholder="ค้นหารหัส / ชื่อสินค้า / เลข lot / ประเภท / PO"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ flex: 1, padding: '8px 10px' }}
          />
          <button type="button" className="button" onClick={() => setQuery('')}>
            ล้าง
          </button>
        </div>
      </div>

      <div className="table-card" style={{ overflowX: 'hidden' }}>
        <table
          className="customers-table"
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            tableLayout: 'fixed',
            fontSize: 12,
            lineHeight: 1.25,
          }}
        >
          <thead>
            <tr>
              <th style={{ padding: 6, width: 90, whiteSpace: 'nowrap' }}>
                วันที่
              </th>
              <th style={{ padding: 6, width: 95, whiteSpace: 'nowrap' }}>
                ประเภท
              </th>
              <th style={{ padding: 6, width: 95, whiteSpace: 'nowrap' }}>
                อ้างอิง
              </th>
              <th style={{ padding: 6, width: 80, whiteSpace: 'nowrap' }}>
                รหัส
              </th>
              <th style={{ padding: 6 }}>ชื่อสินค้า</th>
              <th style={{ padding: 6, width: 55, textAlign: 'right' }}>
                จำนวน
              </th>
              <th style={{ padding: 6, width: 55, whiteSpace: 'nowrap' }}>
                หน่วย
              </th>
              <th style={{ padding: 6, width: 80, whiteSpace: 'nowrap' }}>
                เลข lot
              </th>
              <th style={{ padding: 6, width: 85, whiteSpace: 'nowrap' }}>
                วันหมดอายุ
              </th>
              <th style={{ padding: 6, width: 90, textAlign: 'right' }}>
                ต้นทุน
              </th>
              <th style={{ padding: 6, width: 60, whiteSpace: 'nowrap' }}>
                บันทึก
              </th>
            </tr>
          </thead>
          <tbody>
            {pagedRows.length ? (
              pagedRows.map((r) => (
                <tr key={r.id} style={{ borderTop: '1px solid #eaeaea' }}>
                  <td style={{ padding: 6, whiteSpace: 'nowrap' }}>{r.date}</td>
                  <td style={{ padding: 6, whiteSpace: 'nowrap' }}>{r.type}</td>
                  <td
                    style={{
                      padding: 6,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                    title={r.ref || '-'}
                  >
                    {r.ref || '-'}
                  </td>
                  <td
                    style={{
                      padding: 6,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                    }}
                  >
                    <span
                      className="badge badge--hn"
                      style={{
                        display: 'inline-block',
                        maxWidth: '100%',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        verticalAlign: 'top',
                      }}
                      title={r.code}
                    >
                      {r.code}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: 6,
                      overflowWrap: 'anywhere',
                      wordBreak: 'break-word',
                    }}
                    title={r.name}
                  >
                    {r.name}
                  </td>
                  <td style={{ padding: 6, textAlign: 'right' }}>{r.qty}</td>
                  <td style={{ padding: 6, whiteSpace: 'nowrap' }}>{r.unit}</td>
                  <td style={{ padding: 6, whiteSpace: 'nowrap' }}>
                    {r.lotNo}
                  </td>
                  <td style={{ padding: 6, whiteSpace: 'nowrap' }}>
                    {r.expiryDate}
                  </td>
                  <td style={{ padding: 6 }}>
                    <input
                      className="input"
                      type="number"
                      min={0}
                      step={1}
                      value={
                        getRowCostDraft(r) === 0 || getRowCostDraft(r)
                          ? String(getRowCostDraft(r))
                          : ''
                      }
                      onChange={(e) =>
                        setCostByRowId((prev) => ({
                          ...prev,
                          [r.id]: e.target.value,
                        }))
                      }
                      placeholder="0"
                      style={{
                        width: '100%',
                        fontSize: 12,
                        padding: '4px 6px',
                        textAlign: 'right',
                      }}
                      inputMode="numeric"
                    />
                  </td>
                  <td style={{ padding: 6, overflow: 'hidden' }}>
                    <button
                      type="button"
                      className="button button--solid"
                      onClick={() => saveRowCost(r)}
                      disabled={
                        !String(r.code || '').trim() ||
                        String(r.code || '').trim() === '-' ||
                        !(
                          Number.isFinite(Number(getRowCostDraft(r))) &&
                          Number(getRowCostDraft(r)) > 0
                        )
                      }
                      style={{
                        padding: '4px 6px',
                        fontSize: 12,
                        lineHeight: 1.1,
                        width: '100%',
                        minWidth: 0,
                        boxSizing: 'border-box',
                      }}
                      title="บันทึกต้นทุนของสินค้ารหัสนี้"
                    >
                      บันทึก
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td style={{ padding: 12, color: '#6b7280' }} colSpan={11}>
                  ยังไม่มีรายการเคลื่อนไหวสินค้า
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div
        className="toolbar"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 8,
          marginTop: 10,
        }}
      >
        <div style={{ color: '#6b7280', fontSize: 12 }}>
          ทั้งหมด {rows.length.toLocaleString('th-TH')} รายการ
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <select
            className="input"
            aria-label="จำนวนแถวต่อหน้า"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value) || 10)}
            style={{ padding: '6px 8px', fontSize: 12 }}
          >
            <option value={10}>10 / หน้า</option>
            <option value={20}>20 / หน้า</option>
            <option value={50}>50 / หน้า</option>
          </select>

          <button
            type="button"
            className="button"
            disabled={currentPage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            ก่อนหน้า
          </button>

          {visiblePages.map((p, idx) =>
            p === '…' ? (
              <span key={`ellipsis-${idx}`} style={{ padding: '6px 4px' }}>
                …
              </span>
            ) : (
              <button
                key={p}
                type="button"
                className={
                  p === currentPage ? 'button button--solid' : 'button'
                }
                onClick={() => setPage(p)}
                style={{ minWidth: 40 }}
              >
                {p}
              </button>
            )
          )}

          <button
            type="button"
            className="button"
            disabled={currentPage >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            ถัดไป
          </button>
        </div>
      </div>
    </section>
  );
}
