import { useEffect, useMemo, useRef, useState } from 'react';

const CATEGORY_OPTIONS = [
  'เวชภัณฑ์',
  'วัสดุสิ้นเปลือง',
  'วัสดุสำนักงาน',
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

const normalizeConsumables = (items) => {
  const src = Array.isArray(items) ? items : [];
  return src.map((item, idx) => {
    const code =
      String(item?.code || '').trim() ||
      `C-${String(idx + 1).padStart(4, '0')}`;
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
    const m = /^C-(\d{1,})$/.exec(code);
    if (!m) continue;
    const n = Number(m[1]);
    if (Number.isFinite(n)) maxNum = Math.max(maxNum, n);
  }
  return `C-${String(maxNum + 1).padStart(4, '0')}`;
};

const bumpCode = (code) => {
  const m = /^C-(\d{1,})$/.exec(String(code || '').trim());
  if (!m) return '';
  const n = Number(m[1]);
  if (!Number.isFinite(n)) return '';
  return `C-${String(n + 1).padStart(4, '0')}`;
};

const generateConsumableCode = ({ existingCodes, items }) => {
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

const todayISO = () => new Date().toISOString().slice(0, 10);

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

const consumeFromLots = ({ lots, qty }) => {
  const src = Array.isArray(lots) ? lots : [];
  const desired = Number(qty);
  if (!Number.isFinite(desired) || desired <= 0) {
    return { ok: false, error: 'กรุณาระบุจำนวนตัดใช้ให้ถูกต้อง' };
  }

  const indexed = src.map((lot, idx) => ({ lot, idx }));
  indexed.sort((a, b) => {
    const aExp = String(a.lot?.expiryDate || '').trim();
    const bExp = String(b.lot?.expiryDate || '').trim();
    const expCmp = aExp.localeCompare(bExp);
    if (aExp && bExp && expCmp !== 0) return expCmp;
    if (aExp && !bExp) return -1;
    if (!aExp && bExp) return 1;

    const aRecv = String(a.lot?.receivedAt || '').trim();
    const bRecv = String(b.lot?.receivedAt || '').trim();
    const recvCmp = aRecv.localeCompare(bRecv);
    if (aRecv && bRecv && recvCmp !== 0) return recvCmp;
    if (aRecv && !bRecv) return -1;
    if (!aRecv && bRecv) return 1;

    const aNo = String(a.lot?.lotNo || '').trim();
    const bNo = String(b.lot?.lotNo || '').trim();
    const noCmp = aNo.localeCompare(bNo);
    if (noCmp !== 0) return noCmp;

    return a.idx - b.idx;
  });

  const nextLots = src.map((l) => ({ ...l }));
  const consumed = [];

  let remaining = desired;
  for (const { idx } of indexed) {
    if (remaining <= 0) break;
    const lot = nextLots[idx];
    const available = Number(lot?.qty);
    const avail = Number.isFinite(available) ? available : 0;
    if (avail <= 0) continue;

    const take = Math.min(avail, remaining);
    if (take <= 0) continue;

    lot.qty = avail - take;
    remaining -= take;
    consumed.push({
      lotNo: String(lot?.lotNo || '').trim() || '-',
      expiryDate: String(lot?.expiryDate || '').trim() || '-',
      receivedAt: String(lot?.receivedAt || '').trim() || '-',
      qty: take,
    });
  }

  if (remaining > 0) {
    return { ok: false, error: 'จำนวนตัดใช้มากกว่าคงเหลือ' };
  }

  const newStock = nextLots.reduce((acc, lot) => {
    const q = Number(lot?.qty);
    return acc + (Number.isFinite(q) ? q : 0);
  }, 0);

  return { ok: true, nextLots, consumed, newStock };
};

function ConsumableModal({ item, onClose, onViewMovements }) {
  if (!item) return null;

  const displayName = item.nameTh || item.nameEn || '-';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal modal--customer-details"
        role="dialog"
        aria-modal="true"
        aria-label={`รายละเอียดวัสดุสิ้นเปลือง ${displayName} (${item.code})`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>รายละเอียดวัสดุสิ้นเปลืองและอื่นๆ</h3>
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
            รายการเคลื่อนไหววัสดุสิ้นเปลืองและอื่นๆ
          </button>
          <button type="button" className="button" onClick={onClose}>
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
}

function CreateConsumableModal({ open, onClose, onSave }) {
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
        aria-label="สร้างรายการวัสดุ"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>สร้างรายการวัสดุ</h3>
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
                  placeholder="ชื่อวัสดุ"
                  aria-label="ชื่อวัสดุ"
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
                  placeholder="เช่น กล่อง / ชิ้น / ขวด"
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

function ConsumeConsumableModal({ open, item, onClose, onConfirm }) {
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
        aria-label={`ตัดใช้วัสดุสิ้นเปลือง ${displayName} (${item.code})`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>ตัดใช้วัสดุสิ้นเปลือง</h3>
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
                  placeholder="เช่น ใช้ทำหัตถการ"
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
            ยืนยันตัดใช้
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Consumables({
  onBack,
  items,
  onItemsChange,
  onReceiveStock,
  onViewMovements,
  onEdit,
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

  const rawItems = useMemo(() => {
    return Array.isArray(items) ? items : [];
  }, [items]);
  const setRawItems = (updater) => {
    if (typeof onItemsChange === 'function') onItemsChange(updater);
  };

  const onImportClick = () => {
    onReceiveStock?.();
  };

  const allItems = useMemo(() => normalizeConsumables(rawItems), [rawItems]);

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

  useEffect(() => {
    setPage(1);
  }, [query, pageSize, category]);

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
          <h1 className="page-title">วัสดุสิ้นเปลืองและอื่นๆ</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button type="button" className="button" onClick={onImportClick}>
              นำเข้าวัสดุสิ้นเปลือง
            </button>
            <button
              type="button"
              className="button"
              onClick={() => setCreateOpen(true)}
            >
              สร้างรายการวัสดุ
            </button>
            <button
              type="button"
              className="button"
              onClick={() => onViewMovements?.()}
            >
              รายการเคลื่อนไหววัสดุสิ้นเปลือง
            </button>
            <button
              type="button"
              className="button button--solid"
              onClick={() => onBack?.()}
            >
              กลับหน้ารายการสินค้า
            </button>
          </div>
        </div>

        <div
          className="toolbar"
          style={{ display: 'flex', gap: 8, marginBottom: 12 }}
        >
          <input
            aria-label="ค้นหารายการวัสดุสิ้นเปลือง"
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
              <th style={{ padding: 8 }}>ตัดใช้</th>
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
                        : 'ตัดใช้วัสดุสิ้นเปลือง'
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

      <ConsumableModal
        item={selected}
        onClose={() => setSelected(null)}
        onViewMovements={onViewMovements}
      />
      <CreateConsumableModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSave={(data) => {
          const nextCode = generateConsumableCode({
            existingCodes,
            items: allItems,
          });
          if (!nextCode || existingCodes.has(nextCode)) return;

          setRawItems((prev) => {
            const src = Array.isArray(prev) ? prev : [];
            return [
              {
                ...data,
                code: nextCode,
                category: normalizeCategory(data?.category),
              },
              ...src,
            ];
          });

          setCreateOpen(false);
        }}
      />

      <ConsumeConsumableModal
        open={Boolean(consumeTarget)}
        item={consumeTarget}
        onClose={() => setConsumeTarget(null)}
        onConfirm={({ qty, note }) => {
          const codeKey = String(consumeTarget?.code || '').trim();
          if (!codeKey) return;

          setRawItems((prev) => {
            const src = Array.isArray(prev) ? prev : [];
            return src.map((it) => {
              if (String(it?.code || '').trim() !== codeKey) return it;

              const available = getAvailableStock(it);
              const desired = Number(qty);
              if (!Number.isFinite(desired) || desired <= 0) return it;
              if (desired > available) return it;

              const lots = Array.isArray(it?.stockLots) ? it.stockLots : [];

              if (lots.length) {
                const res = consumeFromLots({ lots, qty: desired });
                if (!res.ok) return it;

                const issues = Array.isArray(it?.stockIssues)
                  ? it.stockIssues
                  : [];

                const issuedAt = todayISO();
                const newIssues = res.consumed.map((c, idx) => ({
                  id: `${codeKey}__ISSUE__${issuedAt}__${c.lotNo}__${idx}`,
                  issuedAt,
                  qty: c.qty,
                  lotNo: c.lotNo,
                  expiryDate: c.expiryDate,
                  note: String(note || '').trim(),
                }));

                return {
                  ...it,
                  stockLots: res.nextLots,
                  stock: res.newStock,
                  status: res.newStock > 0 ? 'ใช้งาน' : 'ไม่ใช้งาน',
                  stockIssues: [...newIssues, ...issues],
                };
              }

              const currentStock = Number(it?.stock);
              const stockNum = Number.isFinite(currentStock) ? currentStock : 0;
              const nextStock = Math.max(0, stockNum - desired);
              const issues = Array.isArray(it?.stockIssues)
                ? it.stockIssues
                : [];
              return {
                ...it,
                stock: nextStock,
                status: nextStock > 0 ? 'ใช้งาน' : 'ไม่ใช้งาน',
                stockIssues: [
                  {
                    id: `${codeKey}__ISSUE__${todayISO()}__${issues.length}`,
                    issuedAt: todayISO(),
                    qty: desired,
                    lotNo: '-',
                    expiryDate: '-',
                    note: String(note || '').trim(),
                  },
                  ...issues,
                ],
              };
            });
          });

          setConsumeTarget(null);
        }}
      />
    </section>
  );
}
