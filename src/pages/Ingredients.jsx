import { useEffect, useMemo, useRef, useState } from 'react';

const CATEGORY_OPTIONS = [
  'สารออกฤทธิ์',
  'สารช่วย',
  'สารเพิ่มปริมาณ',
  'ตัวทำละลาย',
  'อื่นๆ',
];

const WAREHOUSE_OPTIONS = Array.from({ length: 20 }, (_, i) => String(i + 1));

const ALLOWED_CATEGORIES = new Set(CATEGORY_OPTIONS);
const ALLOWED_WAREHOUSES = new Set(WAREHOUSE_OPTIONS);

const normalizeCategory = (value) => {
  const category = String(value || '').trim();
  return ALLOWED_CATEGORIES.has(category) ? category : 'อื่นๆ';
};

const normalizeWarehouse = (value) => {
  const wh = String(value ?? '').trim();
  return ALLOWED_WAREHOUSES.has(wh) ? wh : WAREHOUSE_OPTIONS[0] || '1';
};

const cleanDecimalInput = (raw) => {
  const cleaned = String(raw ?? '').replace(/[^0-9.]/g, '');
  const dotIndex = cleaned.indexOf('.');
  if (dotIndex === -1) return cleaned;
  const head = cleaned.slice(0, dotIndex + 1);
  const tail = cleaned.slice(dotIndex + 1).replace(/\./g, '');
  return head + tail;
};

const normalizeIngredients = (items) => {
  const src = Array.isArray(items) ? items : [];
  return src.map((item, idx) => {
    const code =
      String(item?.code || '').trim() ||
      `ING-${String(idx + 1).padStart(4, '0')}`;
    const stock = Number.isFinite(Number(item?.stock)) ? Number(item.stock) : 0;
    const status = item?.status || (stock > 0 ? 'ใช้งาน' : 'ไม่ใช้งาน');
    return {
      ...item,
      code,
      stock,
      status,
      category: normalizeCategory(item?.category),
      warehouse: normalizeWarehouse(item?.warehouse),
    };
  });
};

const nextDefaultCode = (items) => {
  const src = Array.isArray(items) ? items : [];
  let maxNum = 0;
  for (const it of src) {
    const code = String(it?.code || '').trim();
    const m = /^ING-(\d{1,})$/.exec(code);
    if (!m) continue;
    const n = Number(m[1]);
    if (Number.isFinite(n)) maxNum = Math.max(maxNum, n);
  }
  return `ING-${String(maxNum + 1).padStart(4, '0')}`;
};

const bumpCode = (code) => {
  const m = /^ING-(\d{1,})$/.exec(String(code || '').trim());
  if (!m) return '';
  const n = Number(m[1]);
  if (!Number.isFinite(n)) return '';
  return `ING-${String(n + 1).padStart(4, '0')}`;
};

const generateIngredientCode = ({ existingCodes, items }) => {
  const codes = existingCodes instanceof Set ? existingCodes : new Set();
  let candidate = nextDefaultCode(items);
  let guard = 0;
  while (codes.has(candidate) && guard < 10000) {
    const next = bumpCode(candidate);
    if (!next) break;
    candidate = next;
    guard += 1;
  }
  return candidate;
};

const getAvailableStock = (item) => {
  const lots = Array.isArray(item?.stockLots) ? item.stockLots : [];
  const lotSum = lots.reduce((acc, lot) => {
    const q = Number(lot?.qty);
    return acc + (Number.isFinite(q) ? q : 0);
  }, 0);
  if (lots.length) return lotSum;
  const stock = Number(item?.stock);
  return Number.isFinite(stock) ? stock : 0;
};

function IngredientModal({ item, onClose, onViewMovements }) {
  if (!item) return null;

  const displayName = item.nameTh || item.nameEn || '-';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal modal--customer-details"
        role="dialog"
        aria-modal="true"
        aria-label={`รายละเอียด Ingredient ${displayName} (${item.code})`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>รายละเอียด Ingredient</h3>
        </div>
        <div className="modal-body">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '160px 1fr',
              gap: '8px 12px',
            }}
          >
            <div>รหัส</div>
            <div>
              <span className="badge badge--hn">{item.code}</span>
            </div>
            <div>ชื่อ</div>
            <div>{displayName}</div>
            <div>หมวดหมู่</div>
            <div>{item.category || '-'}</div>
            <div>หน่วย</div>
            <div>{item.unit || '-'}</div>
            <div>คลัง</div>
            <div>{item.warehouse || '-'}</div>
            <div>คงเหลือ</div>
            <div>{Number.isFinite(Number(item.stock)) ? item.stock : '-'}</div>
            <div>สถานะ</div>
            <div>
              <span
                className={
                  'badge badge--' +
                  (item.status === 'ใช้งาน'
                    ? 'active'
                    : item.status === 'ไม่ใช้งาน'
                      ? 'inactive'
                      : String(item.status || '').toLowerCase())
                }
              >
                {item.status || '-'}
              </span>
            </div>
            <div>รายละเอียด</div>
            <div style={{ whiteSpace: 'pre-wrap' }}>
              {item.description || '-'}
            </div>
          </div>
        </div>
        <div
          className="modal-actions"
          style={{ justifyContent: 'space-between' }}
        >
          <button
            type="button"
            className="button"
            onClick={() => {
              onViewMovements?.(item);
              onClose?.();
            }}
          >
            รายการเคลื่อนไหว Ingredient
          </button>
          <button type="button" className="button" onClick={onClose}>
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
}

function CreateIngredientModal({ open, onClose, onSave }) {
  const [form, setForm] = useState({
    nameTh: '',
    category: CATEGORY_OPTIONS[0] || 'อื่นๆ',
    unit: '',
    warehouse: WAREHOUSE_OPTIONS[0] || '1',
    status: 'ใช้งาน',
    description: '',
  });
  const [errors, setErrors] = useState({});

  const update = (field) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const next = {};
    if (!String(form.nameTh || '').trim()) next.nameTh = 'จำเป็นต้องกรอก';
    if (!String(form.category || '').trim()) next.category = 'จำเป็นต้องกรอก';
    if (!String(form.unit || '').trim()) next.unit = 'จำเป็นต้องกรอก';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  useEffect(() => {
    if (!open) return;
    setForm({
      nameTh: '',
      category: CATEGORY_OPTIONS[0] || 'อื่นๆ',
      unit: '',
      warehouse: WAREHOUSE_OPTIONS[0] || '1',
      status: 'ใช้งาน',
      description: '',
    });
    setErrors({});
  }, [open]);

  if (!open) return null;

  const onSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const nameKey = String(form.nameTh || '').trim();

    onSave?.({
      nameTh: nameKey,
      category: normalizeCategory(form.category),
      unit: String(form.unit || '').trim(),
      warehouse: normalizeWarehouse(form.warehouse),
      stock: 0,
      status: String(form.status || '').trim() || 'ใช้งาน',
      description: String(form.description || '').trim(),
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label="สร้างรายการ Ingredient"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>สร้างรายการ Ingredient</h3>
        </div>
        <div className="modal-body">
          <form className="form-card" onSubmit={onSubmit}>
            <div className="form-grid">
              <label>ชื่อ *</label>
              <div>
                <input
                  className="input"
                  value={form.nameTh}
                  onChange={update('nameTh')}
                  placeholder="ชื่อ Ingredient"
                  aria-label="ชื่อ Ingredient"
                />
                {errors.nameTh ? (
                  <div className="field-error">{errors.nameTh}</div>
                ) : null}
              </div>

              <label>หมวดหมู่ *</label>
              <div>
                <select
                  className="select"
                  value={String(form.category || '')}
                  onChange={update('category')}
                  aria-label="หมวดหมู่"
                  style={{ width: '100%' }}
                >
                  <option value="">-</option>
                  {CATEGORY_OPTIONS.map((c, idx) => (
                    <option key={`${c}-${idx}`} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                {errors.category ? (
                  <div className="field-error">{errors.category}</div>
                ) : null}
              </div>

              <label>หน่วย *</label>
              <div>
                <input
                  className="input"
                  value={form.unit}
                  onChange={update('unit')}
                  placeholder="เช่น กรัม / ลิตร / กิโลกรัม"
                  aria-label="หน่วย"
                />
                {errors.unit ? (
                  <div className="field-error">{errors.unit}</div>
                ) : null}
              </div>

              <label>คลัง</label>
              <div>
                <select
                  className="select"
                  value={String(form.warehouse || '')}
                  onChange={update('warehouse')}
                  aria-label="คลัง"
                  style={{ width: '100%' }}
                >
                  {WAREHOUSE_OPTIONS.map((w) => (
                    <option key={w} value={w}>
                      {w}
                    </option>
                  ))}
                </select>
              </div>

              <label>สถานะ</label>
              <select
                className="select"
                value={form.status}
                onChange={update('status')}
                aria-label="สถานะ"
              >
                <option value="ใช้งาน">ใช้งาน</option>
                <option value="ไม่ใช้งาน">ไม่ใช้งาน</option>
              </select>

              <label>รายละเอียด</label>
              <textarea
                className="textarea"
                rows={3}
                value={form.description}
                onChange={update('description')}
                placeholder="รายละเอียดเพิ่มเติม"
                aria-label="รายละเอียด"
              />
            </div>

            <div className="form-actions" style={{ marginTop: 12 }}>
              <button type="button" className="button" onClick={onClose}>
                ยกเลิก
              </button>
              <button type="submit" className="button">
                บันทึก
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function ConsumeIngredientModal({ open, item, onClose, onConfirm }) {
  const [qty, setQty] = useState('1');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setQty('1');
    setNote('');
    setError('');
  }, [open, item?.code]);

  if (!open || !item) return null;

  const displayName = item?.nameTh || item?.nameEn || '-';
  const available = getAvailableStock(item);

  const onSubmit = () => {
    const qtyNum = Number(qty);
    if (!Number.isFinite(qtyNum) || qtyNum <= 0) {
      setError('กรุณาระบุจำนวนตัดใช้ให้ถูกต้อง');
      return;
    }
    if (qtyNum > available) {
      setError(`จำนวนตัดใช้มากกว่าคงเหลือ (คงเหลือ ${available})`);
      return;
    }
    setError('');
    onConfirm?.({ qty: qtyNum, note: String(note || '').trim() });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal modal--customer-details"
        role="dialog"
        aria-modal="true"
        aria-label={`ตัดใช้ Ingredient ${displayName} (${item.code})`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>ตัดใช้ Ingredient เพื่อผลิตสินค้าใหม่</h3>
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
            <div>รหัส</div>
            <div>
              <span className="badge badge--hn">{item.code}</span>
            </div>
            <div>ชื่อ</div>
            <div>{displayName}</div>
            <div>หน่วย</div>
            <div>{item.unit || '-'}</div>
            <div>คงเหลือ</div>
            <div>{available}</div>
          </div>

          <div className="form-card" style={{ padding: 12, width: '100%' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '160px 1fr',
                gap: '8px 12px',
                alignItems: 'center',
              }}
            >
              <div>จำนวนตัดใช้</div>
              <div>
                <input
                  className="input"
                  type="number"
                  min={0}
                  step="any"
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  inputMode="decimal"
                  style={{ width: 'min(260px, 100%)' }}
                />
              </div>

              <div>หมายเหตุ</div>
              <div>
                <input
                  className="input"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="เช่น ส่งไปผลิตล็อต A"
                  style={{ width: 'min(520px, 100%)' }}
                />
              </div>
            </div>

            {error ? (
              <div style={{ color: '#b91c1c', marginTop: 10 }}>{error}</div>
            ) : null}
          </div>
        </div>
        <div className="modal-actions">
          <button type="button" className="button" onClick={onClose}>
            ยกเลิก
          </button>
          <button
            type="button"
            className="button button--solid"
            onClick={onSubmit}
          >
            เพิ่มเข้ารายการผลิต
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Ingredients({
  onBack,
  items,
  onItemsChange,
  onReceiveStock,
  onViewMovements,
  onEdit,
  draft,
  onDraftChange,
  onProceed,
}) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('ทั้งหมด');
  const stickyRef = useRef(null);
  const [selected, setSelected] = useState(null);
  const [consumeTarget, setConsumeTarget] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
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
  }, []);

  const rawItems = useMemo(() => (Array.isArray(items) ? items : []), [items]);
  const setRawItems = (updater) => {
    if (typeof onItemsChange === 'function') onItemsChange(updater);
  };

  const onImportClick = () => {
    onReceiveStock?.();
  };

  const allItems = useMemo(() => normalizeIngredients(rawItems), [rawItems]);

  const existingCodes = useMemo(() => {
    return new Set(
      allItems.map((i) => String(i?.code || '').trim()).filter(Boolean)
    );
  }, [allItems]);

  const filtered = useMemo(() => {
    const q = String(query || '')
      .trim()
      .toLowerCase();

    return allItems.filter((i) => {
      if (category !== 'ทั้งหมด' && normalizeCategory(i?.category) !== category)
        return false;
      if (!q) return true;

      const code = String(i?.code || '').toLowerCase();
      const nameTh = String(i?.nameTh || '').toLowerCase();
      const nameEn = String(i?.nameEn || '').toLowerCase();
      const cat = String(normalizeCategory(i?.category) || '').toLowerCase();
      const status = String(i?.status || '').toLowerCase();
      return (
        code.includes(q) ||
        nameTh.includes(q) ||
        nameEn.includes(q) ||
        cat.includes(q) ||
        status.includes(q)
      );
    });
  }, [allItems, category, query]);

  const totalPages = useMemo(() => {
    const size = Math.max(1, Number(pageSize) || 10);
    return Math.max(1, Math.ceil(filtered.length / size));
  }, [filtered.length, pageSize]);

  const currentPage = Math.min(Math.max(1, page), totalPages);

  const paged = useMemo(() => {
    const size = Math.max(1, Number(pageSize) || 10);
    const start = (currentPage - 1) * size;
    return filtered.slice(start, start + size);
  }, [filtered, currentPage, pageSize]);

  const pageNums = useMemo(() => {
    const total = totalPages;
    const current = currentPage;
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

    const pages = [1];
    let s = Math.max(2, current - 2);
    let e = Math.min(total - 1, current + 2);
    if (s > 2) pages.push('…');
    for (let i = s; i <= e; i++) pages.push(i);
    if (e < total - 1) pages.push('…');
    pages.push(total);
    return pages;
  }, [currentPage, totalPages]);

  const selectedDraft = useMemo(
    () => (Array.isArray(draft) ? draft : []),
    [draft]
  );

  useEffect(() => {
    setPage(1);
  }, [query, pageSize, category]);

  const addIngredientDraft = (item, payload) => {
    const codeKey = String(item?.code || '').trim();
    if (!codeKey) return;
    const qty = payload?.qty ?? 1;
    const note = payload?.note ?? '';

    const nextItem = {
      code: codeKey,
      nameTh: item?.nameTh || '',
      nameEn: item?.nameEn || '',
      unit: item?.unit || '',
      qty: String(qty),
      note: String(note || ''),
    };

    onDraftChange?.((prev) => {
      const list = Array.isArray(prev) ? prev : [];
      const idx = list.findIndex(
        (x) => String(x?.code || '').trim() === codeKey
      );
      if (idx === -1) return [...list, nextItem];
      const currentQty = Number(list[idx]?.qty);
      const bumpedQty = Number.isFinite(currentQty)
        ? String(currentQty + Number(qty))
        : String(qty);
      const next = list.slice();
      next[idx] = { ...next[idx], qty: bumpedQty };
      return next;
    });
  };

  const removeDraft = (code) => {
    const key = String(code || '').trim();
    if (!key) return;
    onDraftChange?.((prev) => {
      const list = Array.isArray(prev) ? prev : [];
      return list.filter((x) => String(x?.code || '').trim() !== key);
    });
  };

  const updateDraft = (code, patch) => {
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

  return (
    <section className="products-page">
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
          <h1 className="page-title">คลัง Ingredient</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button type="button" className="button" onClick={onImportClick}>
              นำเข้า Ingredient
            </button>
            <button
              type="button"
              className="button"
              onClick={() => setCreateOpen(true)}
            >
              สร้างรายการ Ingredient
            </button>
            <button
              type="button"
              className="button"
              onClick={() => onViewMovements?.()}
            >
              รายการเคลื่อนไหว Ingredient
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

        <div
          className="toolbar"
          style={{ display: 'flex', gap: 8, marginBottom: 12 }}
        >
          <input
            aria-label="ค้นหารายการ Ingredient"
            placeholder="ค้นหารหัส / ชื่อ / หมวดหมู่ / สถานะ"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ flex: 1, padding: '8px 10px' }}
          />
          <button type="button" className="button" onClick={() => setQuery('')}>
            ล้าง
          </button>

          <select
            aria-label="หมวดหมู่"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ padding: '8px 10px' }}
          >
            <option value="ทั้งหมด">ทั้งหมด</option>
            {CATEGORY_OPTIONS.map((c, idx) => (
              <option key={`${c}-${idx}`} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            aria-label="จำนวนแถวต่อหน้า"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value) || 10)}
            style={{ padding: '8px 10px' }}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
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
              <th style={{ padding: 8 }}>รหัส</th>
              <th style={{ padding: 8 }}>ชื่อ</th>
              <th style={{ padding: 8 }}>หมวดหมู่</th>
              <th style={{ padding: 8 }}>คงเหลือ</th>
              <th style={{ padding: 8 }}>สถานะ</th>
              <th style={{ padding: 8 }}>ดูข้อมูล</th>
              <th style={{ padding: 8 }}>แก้ไข</th>
              <th style={{ padding: 8 }}>ตัดใช้ผลิต</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((i) => (
              <tr key={i.code} style={{ borderTop: '1px solid #eaeaea' }}>
                <td style={{ padding: 8 }}>{i.code}</td>
                <td style={{ padding: 8 }}>
                  {i.nameTh || i.nameEn || '-'}
                  {i.nameEn ? (
                    <div
                      style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}
                    >
                      {i.nameEn}
                    </div>
                  ) : null}
                </td>
                <td style={{ padding: 8 }}>{i.category || '-'}</td>
                <td style={{ padding: 8 }}>
                  {Number.isFinite(Number(i.stock)) ? i.stock : '-'}
                </td>
                <td style={{ padding: 8 }}>
                  <span
                    className={
                      'badge badge--' +
                      (i.status === 'ใช้งาน'
                        ? 'active'
                        : i.status === 'ไม่ใช้งาน'
                          ? 'inactive'
                          : String(i.status || '').toLowerCase())
                    }
                  >
                    {i.status}
                  </span>
                </td>
                <td style={{ padding: 8 }}>
                  <button
                    type="button"
                    className="button"
                    onClick={() => setSelected(i)}
                  >
                    รายละเอียด
                  </button>
                </td>
                <td style={{ padding: 8 }}>
                  <button
                    type="button"
                    className="button"
                    onClick={() => onEdit?.(i)}
                  >
                    แก้ไข
                  </button>
                </td>
                <td style={{ padding: 8 }}>
                  <button
                    type="button"
                    className="button"
                    onClick={() => setConsumeTarget(i)}
                    disabled={getAvailableStock(i) <= 0}
                    title={
                      getAvailableStock(i) <= 0
                        ? 'ไม่สามารถตัดใช้ได้: คงเหลือ 0'
                        : 'ตัด Ingredient เพื่อผลิตสินค้าใหม่'
                    }
                  >
                    ตัดใช้
                  </button>
                </td>
              </tr>
            ))}

            {paged.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  style={{ padding: 16, textAlign: 'center', color: '#6b7280' }}
                >
                  ไม่พบข้อมูล
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
          alignItems: 'center',
          gap: 8,
          marginTop: 12,
        }}
      >
        <div style={{ color: '#6b7280' }}>
          ทั้งหมด {filtered.length.toLocaleString('th-TH')} รายการ
        </div>

        <div
          style={{
            display: 'flex',
            gap: 6,
            alignItems: 'center',
            flexWrap: 'wrap',
            justifyContent: 'flex-end',
          }}
        >
          <button
            type="button"
            className="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
          >
            ก่อนหน้า
          </button>

          {pageNums.map((p, idx) =>
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
                className={
                  p === currentPage ? 'button button--solid' : 'button'
                }
                onClick={() => setPage(Number(p))}
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

      <div className="table-card" style={{ overflowX: 'auto', marginTop: 16 }}>
        <div style={{ padding: 12, borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ fontWeight: 700 }}>
            รายการ Ingredient สำหรับผลิตสินค้าใหม่
          </div>
          <div style={{ color: '#6b7280', fontSize: 12 }}>
            ระบุจำนวนที่ต้องการตัดไปผลิต และกด “ส่งไปผลิตยาตัวใหม่”
          </div>
        </div>

        {selectedDraft.length === 0 ? (
          <div style={{ padding: 16, color: '#6b7280' }}>
            ยังไม่ได้เลือก Ingredient
          </div>
        ) : (
          <table className="table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>รหัส</th>
                <th style={{ textAlign: 'left' }}>ชื่อ Ingredient</th>
                <th style={{ textAlign: 'left', width: 160 }}>จำนวน</th>
                <th style={{ textAlign: 'left', width: 220 }}>โน้ต</th>
                <th style={{ textAlign: 'right', width: 120 }} />
              </tr>
            </thead>
            <tbody>
              {selectedDraft.map((x) => {
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
                            updateDraft(codeKey, {
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
                          updateDraft(codeKey, { note: e.target.value })
                        }
                        placeholder="เช่น ส่งไปผลิตล็อต B"
                        aria-label={`โน้ตสำหรับ ${codeKey}`}
                      />
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        className="button"
                        onClick={() => removeDraft(codeKey)}
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

        <div
          style={{
            borderTop: '1px solid #e5e7eb',
            padding: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ color: '#6b7280' }}>
            เลือกแล้ว {selectedDraft.length.toLocaleString('th-TH')} รายการ
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              className="button"
              disabled={selectedDraft.length === 0}
              onClick={() => onDraftChange?.([])}
            >
              ล้างรายการ
            </button>
            <button
              type="button"
              className="button button--blue"
              disabled={selectedDraft.length === 0}
              onClick={() => onProceed?.(selectedDraft)}
            >
              ส่งไปผลิตยาตัวใหม่
            </button>
          </div>
        </div>
      </div>

      <IngredientModal
        item={selected}
        onClose={() => setSelected(null)}
        onViewMovements={onViewMovements}
      />
      <CreateIngredientModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSave={(payload) => {
          setRawItems((prev) => {
            const list = Array.isArray(prev) ? prev : [];
            const nextCode = generateIngredientCode({
              existingCodes,
              items: list,
            });
            return [...list, { ...payload, code: nextCode }];
          });
          setCreateOpen(false);
        }}
      />
      <ConsumeIngredientModal
        open={Boolean(consumeTarget)}
        item={consumeTarget}
        onClose={() => setConsumeTarget(null)}
        onConfirm={(payload) => {
          if (consumeTarget) addIngredientDraft(consumeTarget, payload);
          setConsumeTarget(null);
        }}
      />
    </section>
  );
}
