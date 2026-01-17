import { useEffect, useMemo, useState } from 'react';

const todayISO = () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const toNumber = (n) => {
  const v = Number(n);
  return Number.isFinite(v) ? v : 0;
};

const sumTotal = (items) =>
  (Array.isArray(items) ? items : []).reduce((acc, it) => {
    const qty = toNumber(it?.qty);
    const price = toNumber(it?.price);
    return acc + qty * price;
  }, 0);

const nextPoNo = () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `PO-${yyyy}${mm}${dd}-001`;
};

export default function CreatePurchaseOrder({
  title = 'สร้างรายการสั่งซื้อ',
  initial,
  products,
  onCancel,
  onSave,
}) {
  const productList = useMemo(
    () => (Array.isArray(products) ? products : []),
    [products]
  );

  const [poNo, setPoNo] = useState(initial?.poNo || nextPoNo());
  const [orderedAt, setOrderedAt] = useState(initial?.orderedAt || todayISO());
  const [supplier, setSupplier] = useState(initial?.supplier || '');
  const [status, setStatus] = useState(initial?.status || 'ร่าง');
  const [notes, setNotes] = useState(initial?.notes || '');
  const [items, setItems] = useState(
    Array.isArray(initial?.items) && initial.items.length
      ? initial.items.map((it) => ({
          code: String(it?.code || ''),
          nameTh: String(it?.nameTh || ''),
          unit: String(it?.unit || ''),
          qty: toNumber(it?.qty || 1),
          price: toNumber(it?.price || 0),
        }))
      : []
  );

  useEffect(() => {
    if (!initial) return;
    setPoNo(initial?.poNo || nextPoNo());
    setOrderedAt(initial?.orderedAt || todayISO());
    setSupplier(initial?.supplier || '');
    setStatus(initial?.status || 'ร่าง');
    setNotes(initial?.notes || '');
    setItems(
      Array.isArray(initial?.items) && initial.items.length
        ? initial.items.map((it) => ({
            code: String(it?.code || ''),
            nameTh: String(it?.nameTh || ''),
            unit: String(it?.unit || ''),
            qty: toNumber(it?.qty || 1),
            price: toNumber(it?.price || 0),
          }))
        : []
    );
  }, [initial]);

  const addItem = () => {
    const first = productList[0];
    setItems((prev) => [
      ...prev,
      {
        code: first?.code ? String(first.code) : '',
        nameTh: first?.nameTh ? String(first.nameTh) : '',
        unit: first?.unit ? String(first.unit) : '',
        qty: 1,
        price: toNumber(first?.cost ?? first?.price ?? 0),
      },
    ]);
  };

  const updateItem = (idx, patch) => {
    setItems((prev) =>
      prev.map((it, i) => (i === idx ? { ...it, ...patch } : it))
    );
  };

  const removeItem = (idx) => {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const total = useMemo(() => sumTotal(items), [items]);

  const validation = useMemo(() => {
    const errors = {};
    if (!String(poNo || '').trim()) errors.poNo = 'กรุณากรอกเลขที่ใบสั่งซื้อ';
    if (!String(orderedAt || '').trim())
      errors.orderedAt = 'กรุณาเลือกวันที่สั่งซื้อ';
    if (!String(supplier || '').trim()) errors.supplier = 'กรุณากรอกผู้จำหน่าย';

    const validItems = (Array.isArray(items) ? items : []).filter((it) => {
      const code = String(it?.code || '').trim();
      const qty = toNumber(it?.qty);
      return code && qty > 0;
    });

    if (validItems.length === 0)
      errors.items = 'กรุณาเพิ่มสินค้าอย่างน้อย 1 รายการ';

    return errors;
  }, [poNo, orderedAt, supplier, items]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (Object.keys(validation).length) return;

    const payload = {
      id: String(initial?.id || poNo),
      poNo: String(poNo).trim(),
      orderedAt: String(orderedAt).trim(),
      supplier: String(supplier).trim(),
      status: String(status).trim(),
      notes: String(notes || '').trim(),
      items: (Array.isArray(items) ? items : [])
        .map((it) => ({
          code: String(it?.code || '').trim(),
          nameTh: String(it?.nameTh || '').trim(),
          unit: String(it?.unit || '').trim(),
          qty: toNumber(it?.qty),
          price: toNumber(it?.price),
        }))
        .filter((it) => it.code && it.qty > 0),
    };

    onSave?.(payload);
  };

  return (
    <section>
      <h1 className="page-title">{title}</h1>

      <form className="form-card" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label htmlFor="poNo">เลขที่ใบสั่งซื้อ</label>
          <div>
            <input
              id="poNo"
              className="input"
              value={poNo}
              onChange={(e) => setPoNo(e.target.value)}
              placeholder="เช่น PO-20260116-001"
            />
            {validation.poNo ? (
              <div className="field-error">{validation.poNo}</div>
            ) : null}
          </div>

          <label htmlFor="orderedAt">วันที่สั่งซื้อ</label>
          <div>
            <input
              id="orderedAt"
              type="date"
              className="input"
              value={orderedAt}
              onChange={(e) => setOrderedAt(e.target.value)}
            />
            {validation.orderedAt ? (
              <div className="field-error">{validation.orderedAt}</div>
            ) : null}
          </div>

          <label htmlFor="supplier">ผู้จำหน่าย</label>
          <div>
            <input
              id="supplier"
              className="input"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              placeholder="เช่น ABSMEDIQ / MedSupply"
            />
            {validation.supplier ? (
              <div className="field-error">{validation.supplier}</div>
            ) : null}
          </div>

          <label htmlFor="status">สถานะ</label>
          <div>
            <select
              id="status"
              className="select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {['ร่าง', 'สั่งซื้อแล้ว', 'รับของแล้ว'].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <label htmlFor="notes">หมายเหตุ</label>
          <div>
            <textarea
              id="notes"
              className="textarea"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="หมายเหตุเพิ่มเติม (ถ้ามี)"
            />
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 8,
            }}
          >
            <h3 style={{ margin: 0 }}>รายการสินค้า</h3>
            <button type="button" className="button" onClick={addItem}>
              เพิ่มสินค้า
            </button>
          </div>

          {validation.items ? (
            <div className="field-error">{validation.items}</div>
          ) : null}

          <div
            className="table-card"
            style={{ overflowX: 'auto', marginTop: 10 }}
          >
            <table
              className="customers-table"
              style={{ width: '100%', borderCollapse: 'collapse' }}
            >
              <thead>
                <tr>
                  <th style={{ padding: 8 }}>สินค้า</th>
                  <th style={{ padding: 8 }}>หน่วย</th>
                  <th style={{ padding: 8 }}>จำนวน</th>
                  <th style={{ padding: 8 }}>ราคา/หน่วย</th>
                  <th style={{ padding: 8 }}>รวม</th>
                  <th style={{ padding: 8 }}>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it, idx) => {
                  const lineTotal = toNumber(it.qty) * toNumber(it.price);

                  return (
                    <tr
                      key={`${it.code || 'item'}-${idx}`}
                      style={{ borderTop: '1px solid #eaeaea' }}
                    >
                      <td style={{ padding: 8 }}>
                        <select
                          className="select"
                          value={it.code}
                          onChange={(e) => {
                            const code = e.target.value;
                            const p = productList.find(
                              (x) => String(x?.code || '') === String(code)
                            );
                            updateItem(idx, {
                              code,
                              nameTh: p?.nameTh ? String(p.nameTh) : '',
                              unit: p?.unit ? String(p.unit) : '',
                              price: toNumber(p?.cost ?? p?.price ?? 0),
                            });
                          }}
                        >
                          {productList.length ? (
                            productList.map((p) => (
                              <option key={p.code} value={p.code}>
                                {p.code} — {p.nameTh || p.nameEn || ''}
                              </option>
                            ))
                          ) : (
                            <option value="">(ไม่มีสินค้า)</option>
                          )}
                        </select>
                        {it.nameTh ? (
                          <div
                            style={{
                              fontSize: 12,
                              color: '#6b7280',
                              marginTop: 2,
                            }}
                          >
                            {it.nameTh}
                          </div>
                        ) : null}
                      </td>
                      <td style={{ padding: 8 }}>
                        <input
                          className="input"
                          value={it.unit}
                          onChange={(e) =>
                            updateItem(idx, { unit: e.target.value })
                          }
                          placeholder="หน่วย"
                          style={{ width: 120 }}
                        />
                      </td>
                      <td style={{ padding: 8 }}>
                        <input
                          className="input"
                          type="number"
                          min={0}
                          value={it.qty}
                          onChange={(e) =>
                            updateItem(idx, { qty: toNumber(e.target.value) })
                          }
                          style={{ width: 120 }}
                        />
                      </td>
                      <td style={{ padding: 8 }}>
                        <input
                          className="input"
                          type="number"
                          min={0}
                          value={it.price}
                          onChange={(e) =>
                            updateItem(idx, { price: toNumber(e.target.value) })
                          }
                          style={{ width: 140 }}
                        />
                      </td>
                      <td style={{ padding: 8 }}>
                        {lineTotal.toLocaleString('th-TH')}
                      </td>
                      <td style={{ padding: 8 }}>
                        <button
                          type="button"
                          className="button"
                          onClick={() => removeItem(idx)}
                        >
                          ลบ
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {items.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: 16, color: '#6b7280' }}>
                      ยังไม่มีรายการสินค้า — กด “เพิ่มสินค้า” เพื่อเริ่มต้น
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: 10,
              color: '#111827',
            }}
          >
            <div>
              <strong>ยอดรวม:</strong> {total.toLocaleString('th-TH')}
            </div>
          </div>
        </div>

        <div className="form-actions" style={{ marginTop: 16 }}>
          <button type="button" className="button" onClick={() => onCancel?.()}>
            ยกเลิก
          </button>
          <button
            type="submit"
            className="button"
            disabled={Object.keys(validation).length > 0}
          >
            บันทึก
          </button>
        </div>
      </form>
    </section>
  );
}
