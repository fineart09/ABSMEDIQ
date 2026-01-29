import { useEffect, useMemo, useRef, useState } from 'react';

const cleanDecimalInput = (raw) => {
  const cleaned = String(raw ?? '').replace(/[^0-9.]/g, '');
  const dotIndex = cleaned.indexOf('.');
  if (dotIndex === -1) return cleaned;
  const head = cleaned.slice(0, dotIndex + 1);
  const tail = cleaned.slice(dotIndex + 1).replace(/\./g, '');
  return head + tail;
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

    return {
      ...p,
      code,
      nameTh: p?.nameTh || '',
      nameEn: p?.nameEn || '',
      category: p?.category || '',
      unit: p?.unit || '',
    };
  });
};

const formatIngredientLines = (items) => {
  const list = Array.isArray(items) ? items : [];
  if (!list.length) return '';
  const lines = list
    .filter((x) => x && typeof x === 'object')
    .map((x) => {
      const code = String(x.code || '').trim();
      const name = String(x.nameTh || x.nameEn || '').trim();
      const qty =
        x.qty === '' || x.qty === null || x.qty === undefined ? '' : x.qty;
      const unit = String(x.unit || '').trim();
      const note = String(x.note || '').trim();
      const head = [code, name].filter(Boolean).join(' ');
      const amount = [qty, unit].filter((v) => String(v).trim()).join(' ');
      return `- ${head}${amount ? `: ${amount}` : ''}${note ? ` (${note})` : ''}`;
    });
  return `Ingredients (${lines.length} รายการ)\n${lines.join('\n')}`;
};

export default function Ingredients({
  onBack,
  products,
  draft,
  onDraftChange,
  onProceed,
}) {
  const stickyRef = useRef(null);
  const [query, setQuery] = useState('');
  const [resultPage, setResultPage] = useState(1);
  const [resultPageSize, setResultPageSize] = useState(5);

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

  const base = useMemo(() => normalizeProducts(products), [products]);
  const selected = useMemo(() => (Array.isArray(draft) ? draft : []), [draft]);

  const filtered = useMemo(() => {
    const q = String(query || '')
      .trim()
      .toLowerCase();
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
          .includes(q)
      );
    });
  }, [query, base]);

  const totalResultPages = Math.max(
    1,
    Math.ceil(filtered.length / Math.max(1, Number(resultPageSize) || 1))
  );
  const currentResultPage = Math.min(resultPage, totalResultPages);
  const resultStart = (currentResultPage - 1) * resultPageSize;
  const resultEnd = resultStart + resultPageSize;
  const pagedResults = filtered.slice(resultStart, resultEnd);

  const visibleResultPages = useMemo(() => {
    const pages = [];
    const total = totalResultPages;
    const current = currentResultPage;
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
  }, [totalResultPages, currentResultPage]);

  useEffect(() => {
    setResultPage(1);
  }, [query, resultPageSize]);

  const addIngredient = (p) => {
    const codeKey = String(p?.code || '').trim();
    if (!codeKey) return;
    const nextItem = {
      code: codeKey,
      nameTh: p?.nameTh || '',
      nameEn: p?.nameEn || '',
      unit: p?.unit || '',
      qty: '1',
      note: '',
    };

    onDraftChange?.((prev) => {
      const list = Array.isArray(prev) ? prev : [];
      const idx = list.findIndex(
        (x) => String(x?.code || '').trim() === codeKey
      );
      if (idx === -1) return [...list, nextItem];
      const currentQty = Number(list[idx]?.qty);
      const bumpedQty = Number.isFinite(currentQty)
        ? String(currentQty + 1)
        : '1';
      const next = list.slice();
      next[idx] = { ...next[idx], qty: bumpedQty };
      return next;
    });
  };

  const removeIngredient = (code) => {
    const key = String(code || '').trim();
    if (!key) return;
    onDraftChange?.((prev) => {
      const list = Array.isArray(prev) ? prev : [];
      return list.filter((x) => String(x?.code || '').trim() !== key);
    });
  };

  const updateIngredient = (code, patch) => {
    const key = String(code || '').trim();
    if (!key) return;
    onDraftChange?.((prev) => {
      const list = Array.isArray(prev) ? prev : [];
      return list.map((x) => {
        if (String(x?.code || '').trim() !== key) return x;
        return { ...x, ...(patch || {}) };
      });
    });
  };

  const canProceed = selected.length > 0;

  return (
    <section className="ingredients-page">
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
          <h1 className="page-title">Ingredient</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              type="button"
              className="button button--blue"
              disabled={!canProceed}
              onClick={() => {
                const payload = Array.isArray(selected) ? selected : [];
                onProceed?.(payload);
              }}
              title={
                canProceed
                  ? 'ส่งไปหน้าผลิต/สร้างสินค้าใหม่'
                  : 'กรุณาเลือกสินค้าอย่างน้อย 1 รายการ'
              }
            >
              ส่งไปผลิตยาตัวใหม่
            </button>
            <button
              type="button"
              className="button"
              disabled={selected.length === 0}
              onClick={() => onDraftChange?.([])}
            >
              ล้างรายการ
            </button>
            <button
              type="button"
              className="button button--solid"
              onClick={() => onBack?.()}
            >
              กลับไปหน้ารายการสินค้า
            </button>
          </div>
        </div>
        <div style={{ color: '#6b7280' }}>
          ค้นหาสินค้าเพื่อ “ตัด” มาเป็น Ingredient แล้วส่งไปสร้าง/ผลิตยาตัวใหม่
        </div>

        <div style={{ marginTop: 12, display: 'grid', gap: 8 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              className="input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ค้นหาจากรหัสสินค้า / ชื่อ / หมวดหมู่..."
              aria-label="ค้นหาสินค้าเพื่อเพิ่มเป็น ingredient"
              style={{ flex: 1 }}
            />
            <div style={{ color: '#6b7280', whiteSpace: 'nowrap' }}>
              เลือกแล้ว {selected.length} รายการ
            </div>
          </div>
        </div>
      </div>

      <div
        className="table-card"
        style={{ overflowX: 'auto', marginBottom: 16 }}
      >
        <div style={{ padding: 12, borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ fontWeight: 700 }}>ผลการค้นหา</div>
          <div style={{ color: '#6b7280', fontSize: 12 }}>
            คลิก “เพิ่ม” เพื่อใส่ลงในสูตร
          </div>
        </div>

        {filtered.length === 0 ? (
          <div style={{ padding: 16, color: '#6b7280' }}>ไม่พบสินค้า</div>
        ) : (
          <table className="table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>รหัส</th>
                <th style={{ textAlign: 'left' }}>ชื่อสินค้า</th>
                <th style={{ textAlign: 'left' }}>หมวดหมู่</th>
                <th style={{ textAlign: 'left' }}>หน่วย</th>
                <th style={{ textAlign: 'right', width: 120 }} />
              </tr>
            </thead>
            <tbody>
              {pagedResults.map((p) => {
                const codeKey = String(p?.code || '').trim();
                const displayName = p?.nameTh || p?.nameEn || '-';
                const already = selected.some(
                  (x) => String(x?.code || '').trim() === codeKey
                );
                return (
                  <tr key={codeKey}>
                    <td>
                      <span className="badge badge--hn">{codeKey}</span>
                    </td>
                    <td>{displayName}</td>
                    <td>{p?.category || '-'}</td>
                    <td>{p?.unit || '-'}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        className={already ? 'button' : 'button button--blue'}
                        onClick={() => addIngredient(p)}
                      >
                        {already ? 'เพิ่มอีก' : 'เพิ่ม'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {filtered.length > 0 ? (
          <div
            style={{
              padding: 12,
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              flexWrap: 'wrap',
            }}
          >
            <div style={{ color: '#6b7280', fontSize: 12 }}>
              ทั้งหมด {filtered.length.toLocaleString('th-TH')} รายการ
            </div>

            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ color: '#6b7280', fontSize: 12 }}>ต่อหน้า</span>
              <select
                className="select"
                value={String(resultPageSize)}
                onChange={(e) => setResultPageSize(Number(e.target.value) || 5)}
                aria-label="จำนวนผลการค้นหาต่อหน้า"
              >
                {[5, 10, 20].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>

              <button
                type="button"
                className="button"
                disabled={currentResultPage <= 1}
                onClick={() => setResultPage((p) => Math.max(1, p - 1))}
              >
                ก่อนหน้า
              </button>

              {visibleResultPages.map((p, idx) => {
                if (p === '…') {
                  return (
                    <span
                      key={`ellipsis-${idx}`}
                      style={{ color: '#6b7280', padding: '0 4px' }}
                    >
                      …
                    </span>
                  );
                }
                const pageNum = Number(p);
                const isActive = pageNum === currentResultPage;
                return (
                  <button
                    key={pageNum}
                    type="button"
                    className={isActive ? 'button button--solid' : 'button'}
                    onClick={() => setResultPage(pageNum)}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                type="button"
                className="button"
                disabled={currentResultPage >= totalResultPages}
                onClick={() =>
                  setResultPage((p) => Math.min(totalResultPages, p + 1))
                }
              >
                ถัดไป
              </button>
            </div>
          </div>
        ) : null}
      </div>

      <div className="table-card" style={{ overflowX: 'auto' }}>
        <div style={{ padding: 12, borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ fontWeight: 700 }}>รายการ Ingredient ที่เลือก</div>
          <div style={{ color: '#6b7280', fontSize: 12 }}>
            ระบุจำนวนที่ต้องการตัดไปเป็นวัตถุดิบ (และโน้ตถ้ามี)
          </div>
        </div>

        {selected.length === 0 ? (
          <div style={{ padding: 16, color: '#6b7280' }}>
            ยังไม่ได้เลือกสินค้า
          </div>
        ) : (
          <table className="table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>รหัส</th>
                <th style={{ textAlign: 'left' }}>ชื่อสินค้า</th>
                <th style={{ textAlign: 'left', width: 160 }}>จำนวน</th>
                <th style={{ textAlign: 'left', width: 220 }}>โน้ต</th>
                <th style={{ textAlign: 'right', width: 120 }} />
              </tr>
            </thead>
            <tbody>
              {selected.map((x) => {
                const codeKey = String(x?.code || '').trim();
                const displayName = x?.nameTh || x?.nameEn || '-';
                return (
                  <tr key={codeKey}>
                    <td>
                      <span className="badge badge--hn">{codeKey}</span>
                    </td>
                    <td>{displayName}</td>
                    <td>
                      <div
                        style={{
                          display: 'flex',
                          gap: 8,
                          alignItems: 'center',
                        }}
                      >
                        <input
                          className="input"
                          value={String(x?.qty ?? '')}
                          onChange={(e) =>
                            updateIngredient(codeKey, {
                              qty: cleanDecimalInput(e.target.value),
                            })
                          }
                          inputMode="decimal"
                          placeholder="0"
                          aria-label={`จำนวนสำหรับ ${codeKey}`}
                          style={{ width: 110 }}
                        />
                        <span
                          style={{ color: '#6b7280', whiteSpace: 'nowrap' }}
                        >
                          {x?.unit || ''}
                        </span>
                      </div>
                    </td>
                    <td>
                      <input
                        className="input"
                        value={String(x?.note ?? '')}
                        onChange={(e) =>
                          updateIngredient(codeKey, { note: e.target.value })
                        }
                        placeholder="เช่น บด/แบ่ง/ตัดล็อต..."
                        aria-label={`โน้ตสำหรับ ${codeKey}`}
                      />
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        className="button"
                        onClick={() => removeIngredient(codeKey)}
                      >
                        ลบ
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* hidden helper string for App/next page usage */}
      <textarea
        readOnly
        value={formatIngredientLines(selected)}
        style={{ position: 'absolute', left: -99999, top: -99999 }}
        aria-hidden="true"
        tabIndex={-1}
      />
    </section>
  );
}
