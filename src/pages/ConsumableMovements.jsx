import { useEffect, useMemo, useState } from 'react';
import { formatDateDMY, toTimestamp } from '../utils/date';

import purchaseOrdersFull from '../mocks/purchaseOrdersFull';

const toNumber = (n) => {
  const v = Number(n);
  return Number.isFinite(v) ? v : 0;
};

const getEffectiveReceivedQty = (poStatus, item) => {
  const status = String(poStatus || '').trim();
  const receivedQtyRaw = item?.receivedQty;
  if (
    status === 'รับของแล้ว' &&
    (receivedQtyRaw === null || receivedQtyRaw === undefined)
  ) {
    return toNumber(item?.qty);
  }
  return toNumber(receivedQtyRaw);
};

const normalizeConsumables = (src) => {
  const list = Array.isArray(src) ? src : [];
  const usedCodes = new Set();
  return list.map((c, i) => {
    const rawCode = String(c?.code || '').trim();
    let code = rawCode || `C-${String(i + 1).padStart(4, '0')}`;
    while (usedCodes.has(code)) {
      code = `C-${String(i + 1 + usedCodes.size).padStart(4, '0')}`;
    }
    usedCodes.add(code);

    const stock = Number.isFinite(Number(c?.stock)) ? Number(c.stock) : 0;
    const status = c?.status || (stock > 0 ? 'ใช้งาน' : 'ไม่ใช้งาน');

    return {
      ...c,
      code,
      stock,
      status,
    };
  });
};

export default function ConsumableMovements({
  consumables,
  filterCode,
  onBackToConsumables,
  onBackToProducts,
  onSaveCosts,
}) {
  const [query, setQuery] = useState('');
  const [unitCostByRowId, setUnitCostByRowId] = useState({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(30);

  useEffect(() => {
    const code = String(filterCode || '').trim();
    setQuery(code);
  }, [filterCode]);

  const getRowUnitCostDraft = (row) => {
    const raw = unitCostByRowId[row.id];
    if (raw === undefined) return row.cost;
    return raw;
  };

  const saveRowCost = (row) => {
    const code = String(row?.code || '').trim();
    const cost = Number(getRowUnitCostDraft(row));
    if (!code || code === '-' || !Number.isFinite(cost) || cost <= 0) return;
    onSaveCosts?.({ code, cost });
  };

  const rows = useMemo(() => {
    const base = normalizeConsumables(consumables);
    const codeFilter = String(filterCode || '').trim();

    const stockLotMovements = base.flatMap((c) => {
      const lots = Array.isArray(c?.stockLots) ? c.stockLots : [];
      const name = c.nameTh || c.nameEn || '-';
      const cost = toNumber(c?.price);

      return lots.map((lot, idx) => {
        const receivedAt = String(lot?.receivedAt || '').trim();
        const expiryDate = String(lot?.expiryDate || '').trim();
        const lotNo = String(lot?.lotNo || '').trim();
        const qty = Number.isFinite(Number(lot?.qty)) ? Number(lot.qty) : 0;
        const unitPrice = toNumber(lot?.unitPrice ?? c?.price);

        return {
          id: `${c.code}__${receivedAt || 'unknown'}__${lotNo || 'nolot'}__${idx}`,
          date: receivedAt || '-',
          type: 'รับเข้า stock',
          code: c.code,
          name,
          qty,
          unit: c.unit || '-',
          lotNo: lotNo || '-',
          expiryDate: expiryDate || '-',
          ref: '',
          unitPrice,
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

      return items
        .map((it, idx) => {
          const code = String(it?.code || '').trim();
          if (!code || !code.startsWith('C-')) return null;

          const name = String(it?.nameTh || it?.nameEn || '').trim() || '-';
          const orderedQty = Number.isFinite(Number(it?.qty))
            ? Number(it.qty)
            : 0;
          const unit = String(it?.unit || '').trim() || '-';
          const unitPrice = toNumber(it?.price);

          const receivedQty = getEffectiveReceivedQty(status, it);
          const hasReceipt =
            (status === 'รับของแล้ว' || status === 'รับบางส่วน') &&
            receivedQty > 0;

          const type = hasReceipt ? 'รับเข้า (PO)' : 'สั่งซื้อ (PO)';
          const receiptDate =
            String(it?.receivedAt || '').trim() ||
            String(po?.lastReceivedAt || '').trim() ||
            orderedAt;

          const receivedLots = Array.isArray(it?.receivedLots)
            ? it.receivedLots
            : [];
          const firstLot = receivedLots.find((l) => {
            const lotNo = String(l?.lotNo || '').trim();
            const expiryDate = String(l?.expiryDate || '').trim();
            return Boolean(lotNo || expiryDate);
          });
          const lotNo = String(firstLot?.lotNo || '').trim();
          const expiryDate = String(firstLot?.expiryDate || '').trim();

          return {
            id: `PO__${poNo || 'unknown'}__${code || 'nocode'}__${
              (hasReceipt ? receiptDate : orderedAt) || 'nodate'
            }__${idx}`,
            date: (hasReceipt ? receiptDate : orderedAt) || '-',
            type,
            code: code || '-',
            name,
            qty: hasReceipt ? receivedQty : orderedQty,
            unit,
            lotNo: hasReceipt && lotNo ? lotNo : '-',
            expiryDate: hasReceipt && lotNo ? expiryDate || '-' : '-',
            ref: poNo || '-',
            unitPrice,
            cost: unitPrice,
          };
        })
        .filter(Boolean);
    });

    const issueMovements = base.flatMap((c) => {
      const issues = Array.isArray(c?.stockIssues) ? c.stockIssues : [];
      if (!issues.length) return [];

      const name = c.nameTh || c.nameEn || '-';
      const cost = toNumber(c?.price);

      return issues.map((it, idx) => {
        const issuedAt = String(it?.issuedAt || '').trim();
        const lotNo = String(it?.lotNo || '').trim() || '-';
        const expiryDate = String(it?.expiryDate || '').trim() || '-';
        const qty = toNumber(it?.qty);
        const note = String(it?.note || '').trim();

        return {
          id: `ISSUE__${c.code}__${issuedAt || 'nodate'}__${lotNo}__${idx}`,
          date: issuedAt || '-',
          type: 'ตัดใช้',
          code: c.code,
          name,
          qty: qty ? -Math.abs(qty) : 0,
          unit: c.unit || '-',
          lotNo,
          expiryDate,
          ref: note,
          unitPrice: cost,
          cost,
        };
      });
    });

    let all = [...stockLotMovements, ...poMovements, ...issueMovements];

    if (codeFilter) {
      all = all.filter((r) => String(r?.code || '').trim() === codeFilter);
    }

    all.sort((a, b) => {
      const timeA = toTimestamp(a?.date);
      const timeB = toTimestamp(b?.date);
      if (timeA !== null && timeB !== null) return timeB - timeA;
      if (timeA !== null) return -1;
      if (timeB !== null) return 1;
      return String(b?.date || '').localeCompare(String(a?.date || ''));
    });

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
  }, [consumables, query, filterCode]);

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
  }, [query, pageSize, filterCode]);

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
          <h1 className="page-title">รายการเคลื่อนไหววัสดุสิ้นเปลือง</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              type="button"
              className="button"
              onClick={() => onBackToConsumables?.()}
            >
              กลับหน้าวัสดุสิ้นเปลืองและอื่นๆ
            </button>
            <button
              type="button"
              className="button button--solid"
              onClick={() => onBackToProducts?.()}
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
            aria-label="ค้นหารายการเคลื่อนไหววัสดุสิ้นเปลือง"
            placeholder="ค้นหารหัส / ชื่อวัสดุ / เลข lot / ประเภท / เลขที่อ้างอิง"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ flex: 1, padding: '8px 10px' }}
          />
          <button type="button" className="button" onClick={() => setQuery('')}>
            ล้าง
          </button>
        </div>
      </div>

      <div className="table-card" style={{ overflowX: 'auto' }}>
        <table
          className="customers-table"
          style={{
            width: '100%',
            minWidth: 1080,
            borderCollapse: 'collapse',
            tableLayout: 'auto',
            fontSize: 12,
            lineHeight: 1.25,
          }}
        >
          <thead>
            <tr>
              <th style={{ padding: 6, width: 90, whiteSpace: 'nowrap' }}>
                วันที่
              </th>
              <th style={{ padding: 6, width: 80, whiteSpace: 'nowrap' }}>
                รหัส
              </th>
              <th style={{ padding: 6, width: 200 }}>ชื่อวัสดุ</th>
              <th style={{ padding: 6, width: 55, textAlign: 'right' }}>
                จำนวน
              </th>
              <th style={{ padding: 6, width: 55, whiteSpace: 'nowrap' }}>
                หน่วย
              </th>
              <th style={{ padding: 6, width: 120, whiteSpace: 'nowrap' }}>
                เลข lot
              </th>
              <th style={{ padding: 6, width: 85, whiteSpace: 'nowrap' }}>
                วันหมดอายุ
              </th>
              <th style={{ padding: 6, width: 110, whiteSpace: 'nowrap' }}>
                เลขที่บิลอ้างอิง
              </th>
              <th style={{ padding: 6, width: 90, textAlign: 'right' }}>
                ต้นทุนต่อหน่วย
              </th>
              <th style={{ padding: 6, width: 90, textAlign: 'right' }}>รวม</th>
              <th style={{ padding: 6, width: 60, whiteSpace: 'nowrap' }}>
                บันทึก
              </th>
            </tr>
          </thead>
          <tbody>
            {pagedRows.length ? (
              pagedRows.map((r) => (
                <tr key={r.id} style={{ borderTop: '1px solid #eaeaea' }}>
                  <td style={{ padding: 6, whiteSpace: 'nowrap' }}>
                    {formatDateDMY(r.date)}
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
                    {formatDateDMY(r.expiryDate)}
                  </td>
                  <td
                    style={{ padding: 6, whiteSpace: 'nowrap' }}
                    title={String(r.ref || '-').trim() || '-'}
                  >
                    {String(r.ref || '-').trim() || '-'}
                  </td>
                  <td style={{ padding: 6 }}>
                    <input
                      className="input"
                      type="number"
                      min={0}
                      step={0.01}
                      value={
                        getRowUnitCostDraft(r) === 0 || getRowUnitCostDraft(r)
                          ? String(getRowUnitCostDraft(r))
                          : ''
                      }
                      onChange={(e) =>
                        setUnitCostByRowId((prev) => ({
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
                      inputMode="decimal"
                    />
                  </td>
                  <td
                    style={{
                      padding: 6,
                      textAlign: 'right',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {(
                      toNumber(getRowUnitCostDraft(r)) * toNumber(r.qty)
                    ).toLocaleString('th-TH', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
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
                          Number.isFinite(Number(getRowUnitCostDraft(r))) &&
                          Number(getRowUnitCostDraft(r)) > 0
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
                      title="บันทึกต้นทุนของวัสดุรหัสนี้"
                    >
                      บันทึก
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td style={{ padding: 12, color: '#6b7280' }} colSpan={11}>
                  ยังไม่มีรายการเคลื่อนไหววัสดุสิ้นเปลือง
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
            <option value={30}>30 / หน้า</option>
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
