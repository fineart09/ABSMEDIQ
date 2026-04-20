import { useEffect, useMemo, useState } from 'react';
import { formatDateDMY } from '../utils/date';

const toNumber = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

const getIssueStatus = (record) => {
  const status = String(record?.issueStatus || '')
    .trim()
    .toLowerCase();
  if (status === 'approved') return 'approved';
  return 'pending';
};

const getItemIssueStatus = (record, item) => {
  const itemStatus = String(item?.issueStatus || '')
    .trim()
    .toLowerCase();
  if (itemStatus === 'approved') return 'approved';
  return getIssueStatus(record);
};

export default function IssueProducts({
  records,
  products,
  consumables,
  onBack,
  onApprove,
}) {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const productStockByCode = useMemo(() => {
    const map = new Map();
    const productList = Array.isArray(products) ? products : [];
    const consumableList = Array.isArray(consumables) ? consumables : [];

    productList.forEach((p) => {
      const code = String(p?.code || '').trim();
      if (!code) return;
      map.set(code, toNumber(p?.stock));
    });

    consumableList.forEach((c) => {
      const code = String(c?.code || '').trim();
      if (!code || map.has(code)) return;
      map.set(code, toNumber(c?.stock));
    });

    return map;
  }, [products, consumables]);

  const rows = useMemo(() => {
    const list = (Array.isArray(records) ? records : []).filter(
      (r) => String(r?.type || '').trim() === 'treatment'
    );

    const prepared = list.flatMap((r) => {
      const recordId = String(r?.id || '').trim();
      const base = {
        recordId,
        createdAt: String(r?.createdAt || '').trim(),
        refNo: String(r?.refNo || '-').trim() || '-',
        hn: String(r?.customer?.hn || '-').trim() || '-',
        customerName: String(r?.customer?.name || '-').trim() || '-',
        createdBy: String(r?.createdBy || '-').trim() || '-',
      };

      const rawItems = Array.isArray(r?.items) ? r.items : [];
      return rawItems
        .map((it, itemIndex) => {
          const code = String(it?.code || '').trim();
          const qty = Math.max(0, toNumber(it?.qty));
          const issueStatus = getItemIssueStatus(r, it);
          const stock = productStockByCode.get(code);
          const hasProduct = stock !== undefined;
          const insufficient = !hasProduct || stock < qty;
          const canToggle =
            issueStatus === 'approved' ? true : hasProduct && !insufficient;

          return {
            id: `${recordId}__${itemIndex}`,
            itemIndex,
            code,
            name: String(it?.name || '').trim(),
            qty,
            price: Math.max(0, toNumber(it?.price)),
            subtotal: Math.max(0, toNumber(it?.price)) * qty,
            issueStatus,
            issuedAt: String(it?.issuedAt || r?.issuedAt || '').trim(),
            issuedBy: String(it?.issuedBy || r?.issuedBy || '').trim(),
            canToggle,
            actionTitle:
              issueStatus === 'approved'
                ? 'ยกเลิกอนุมัติและคืนสินค้าเข้า stock'
                : !hasProduct
                  ? `ไม่พบสินค้า/วัสดุในคลัง: ${code || '-'}`
                  : insufficient
                    ? `สต๊อกไม่พอ: ${code}`
                    : 'อนุมัติเบิกสินค้า/วัสดุ',
            ...base,
          };
        })
        .filter((it) => it.code && it.qty > 0);
    });

    prepared.sort((a, b) =>
      String(b.createdAt).localeCompare(String(a.createdAt))
    );

    const q = String(query || '')
      .trim()
      .toLowerCase();

    if (!q) return prepared;

    return prepared.filter((r) => {
      return (
        String(r.refNo).toLowerCase().includes(q) ||
        String(r.hn).toLowerCase().includes(q) ||
        String(r.customerName).toLowerCase().includes(q) ||
        String(r.createdBy).toLowerCase().includes(q) ||
        String(r.code).toLowerCase().includes(q) ||
        String(r.name).toLowerCase().includes(q)
      );
    });
  }, [records, productStockByCode, query]);

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const pagedRows = rows.slice(start, end);

  const visiblePages = useMemo(() => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i += 1) pages.push(i);
      return pages;
    }

    pages.push(1);
    const startPage = Math.max(2, currentPage - 2);
    const endPage = Math.min(totalPages - 1, currentPage + 2);

    if (startPage > 2) pages.push('…');
    for (let i = startPage; i <= endPage; i += 1) pages.push(i);
    if (endPage < totalPages - 1) pages.push('…');
    pages.push(totalPages);

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
          <h1 className="page-title">เบิกสินค้า (รออนุมัติ)</h1>
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
            aria-label="ค้นหารายการเบิกสินค้า"
            placeholder="ค้นหาเลขที่อ้างอิง / HN / ชื่อลูกค้า / รหัสสินค้า/วัสดุ"
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
              <th style={{ padding: 6, width: 105, whiteSpace: 'nowrap' }}>
                อ้างอิง
              </th>
              <th style={{ padding: 6, width: 72, whiteSpace: 'nowrap' }}>
                HN
              </th>
              <th style={{ padding: 6, width: 120, whiteSpace: 'nowrap' }}>
                ลูกค้า
              </th>
              <th style={{ padding: 6, width: 90, whiteSpace: 'nowrap' }}>
                รหัส
              </th>
              <th style={{ padding: 6 }}>สินค้า</th>
              <th style={{ padding: 6, width: 70, textAlign: 'right' }}>
                จำนวน
              </th>
              <th style={{ padding: 6, width: 100, textAlign: 'right' }}>
                มูลค่า
              </th>
              <th style={{ padding: 6, width: 90, whiteSpace: 'nowrap' }}>
                สถานะเบิก
              </th>
              <th style={{ padding: 6, width: 84, whiteSpace: 'nowrap' }}>
                Approved
              </th>
            </tr>
          </thead>
          <tbody>
            {pagedRows.length ? (
              pagedRows.map((r) => {
                return (
                  <tr key={r.id} style={{ borderTop: '1px solid #eaeaea' }}>
                    <td style={{ padding: 6, whiteSpace: 'nowrap' }}>
                      {formatDateDMY(r.createdAt)}
                    </td>
                    <td
                      style={{ padding: 6, whiteSpace: 'nowrap' }}
                      title={r.refNo}
                    >
                      {r.refNo}
                    </td>
                    <td style={{ padding: 6, whiteSpace: 'nowrap' }}>{r.hn}</td>
                    <td style={{ padding: 6 }} title={r.customerName}>
                      {r.customerName}
                    </td>
                    <td style={{ padding: 6, whiteSpace: 'nowrap' }}>
                      {r.code}
                    </td>
                    <td style={{ padding: 6 }} title={r.name || '-'}>
                      {r.name || '-'}
                    </td>
                    <td style={{ padding: 6, textAlign: 'right' }}>
                      {toNumber(r.qty).toLocaleString('th-TH')}
                    </td>
                    <td
                      style={{
                        padding: 6,
                        textAlign: 'right',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {(toNumber(r.price) * toNumber(r.qty)).toLocaleString(
                        'th-TH',
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}
                    </td>
                    <td style={{ padding: 6, whiteSpace: 'nowrap' }}>
                      {r.issueStatus === 'approved' ? (
                        <span className="badge badge--active">อนุมัติแล้ว</span>
                      ) : (
                        <span className="badge badge--partial">รออนุมัติ</span>
                      )}
                    </td>
                    <td style={{ padding: 6 }}>
                      <button
                        type="button"
                        className={
                          r.issueStatus === 'approved'
                            ? 'button button--solid'
                            : 'button button--orange'
                        }
                        onClick={() =>
                          onApprove?.({
                            recordId: r.recordId,
                            itemIndex: r.itemIndex,
                          })
                        }
                        disabled={!r.canToggle}
                        title={r.actionTitle}
                        style={{
                          width: '100%',
                          minWidth: 0,
                          padding: '4px 6px',
                          fontSize: 12,
                        }}
                      >
                        {r.issueStatus === 'approved'
                          ? 'ยกเลิกอนุมัติ'
                          : 'Approve'}
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td style={{ padding: 12, color: '#6b7280' }} colSpan={10}>
                  ยังไม่มีรายการรอเบิกสินค้า
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
