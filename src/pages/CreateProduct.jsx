import { useEffect, useMemo, useState } from 'react';

const toNumber = (v) => {
  if (v === '' || v === null || v === undefined) return '';
  const n = Number(v);
  return Number.isFinite(n) ? n : '';
};

const CATEGORY_OPTIONS = ['ยาเม็ด', 'ยาน้ำ', 'ยาผง', 'เวชภัณฑ์'];
const UNIT_OPTIONS = [
  'เม็ด',
  'แคปซูล',
  'ขวด',
  'หลอด',
  'กระปุก',
  'ซอง',
  'กล่อง',
  'แผง',
  'แผ่น',
  'แพ็ค',
  'ชิ้น',
];

export default function CreateProduct({ onCancel, onSave, initial, title }) {
  const makeInitial = () => {
    if (!initial) {
      return {
        code: '',
        nameTh: '',
        nameEn: '',
        category: '',
        unit: '',
        warehouse: '',
        price: '',
        stock: '',
        supplier: '',
        status: 'ใช้งาน',
        description: '',
      };
    }
    return {
      code: initial.code || '',
      nameTh: initial.nameTh || '',
      nameEn: initial.nameEn || '',
      category: initial.category || '',
      unit: initial.unit || '',
      price: toNumber(initial.price),
      stock: toNumber(initial.stock),
      warehouse: initial.warehouse || '',
      supplier: initial.supplier || '',
      status: initial.status || 'ใช้งาน',
      description: initial.description || '',
    };
  };

  const [form, setForm] = useState(makeInitial);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(makeInitial());
  }, [initial]);

  const requiredFields = useMemo(() => ['code', 'nameTh'], []);

  const update = (field) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const updateNumber = (field) => (e) => {
    const raw = e.target.value;
    const cleaned = raw.replace(/[^0-9.]/g, '');
    setForm((prev) => ({ ...prev, [field]: cleaned }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const next = {};
    requiredFields.forEach((k) => {
      if (!String(form[k] || '').trim()) next[k] = 'จำเป็นต้องกรอก';
    });
    if (form.price !== '' && !Number.isFinite(Number(form.price))) {
      next.price = 'รูปแบบไม่ถูกต้อง';
    }
    if (form.stock !== '' && !Number.isFinite(Number(form.stock))) {
      next.stock = 'รูปแบบไม่ถูกต้อง';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSave?.({
      ...form,
      price: form.price === '' ? '' : Number(form.price),
      stock: form.stock === '' ? '' : Number(form.stock),
    });
  };

  return (
    <section>
      <h1 className="page-title">{title || 'สร้างรายการสินค้าใหม่'}</h1>

      <form className="form-card" onSubmit={submit}>
        <div className="form-grid">
          <label>รหัสสินค้า *</label>
          <div>
            <input
              className="input"
              value={form.code}
              onChange={update('code')}
              placeholder="เช่น PRD013"
              aria-label="รหัสสินค้า"
            />
            {errors.code ? (
              <div className="field-error">{errors.code}</div>
            ) : null}
          </div>

          <label>ชื่อสินค้า *</label>
          <div>
            <input
              className="input"
              value={form.nameTh}
              onChange={update('nameTh')}
              placeholder="ชื่อสินค้า"
              aria-label="ชื่อสินค้า"
            />
            {errors.nameTh ? (
              <div className="field-error">{errors.nameTh}</div>
            ) : null}
          </div>

          {initial ? (
            <>
              <label>ชื่อสินค้า (EN)</label>
              <input
                className="input"
                value={form.nameEn}
                onChange={update('nameEn')}
                placeholder="Product name"
                aria-label="ชื่อสินค้า (EN)"
              />
            </>
          ) : null}

          <label>หมวดหมู่</label>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <select
              className="select"
              value={String(form.category || '')}
              onChange={update('category')}
              aria-label="หมวดหมู่"
              style={{ flex: 1 }}
            >
              <option value="">-</option>
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
              {form.category && !CATEGORY_OPTIONS.includes(form.category) ? (
                <option value={form.category}>{form.category}</option>
              ) : null}
            </select>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                flex: 1,
              }}
            >
              <span style={{ whiteSpace: 'nowrap', fontWeight: 600 }}>
                คลัง
              </span>
              <select
                className="select"
                value={String(form.warehouse || '')}
                onChange={update('warehouse')}
                aria-label="คลัง"
                style={{ flex: 1 }}
              >
                <option value="">-</option>
                {Array.from({ length: 20 }, (_, i) => String(i + 1)).map(
                  (v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>

          <label>หน่วย</label>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <select
                className="select"
                value={String(form.unit || '')}
                onChange={update('unit')}
                aria-label="หน่วย"
                style={{ flex: 1 }}
              >
                <option value="">-</option>
                {UNIT_OPTIONS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
                {form.unit && !UNIT_OPTIONS.includes(form.unit) ? (
                  <option value={form.unit}>{form.unit}</option>
                ) : null}
              </select>
              <span style={{ whiteSpace: 'nowrap', fontWeight: 600 }}>
                สถานะ
              </span>
              <select
                className="select"
                value={form.status}
                onChange={update('status')}
                aria-label="สถานะ"
                style={{ flex: 1 }}
              >
                <option value="ใช้งาน">ใช้งาน</option>
                <option value="ไม่ใช้งาน">ไม่ใช้งาน</option>
              </select>
            </div>
          </div>

          <label>คงเหลือ</label>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                className="input"
                value={form.stock}
                onChange={updateNumber('stock')}
                placeholder="0"
                inputMode="numeric"
                aria-label="คงเหลือ"
                style={{ flex: 1 }}
              />
              <span style={{ whiteSpace: 'nowrap', fontWeight: 600 }}>
                ราคา
              </span>
              <input
                className="input"
                value={form.price}
                onChange={updateNumber('price')}
                placeholder="0"
                inputMode="decimal"
                aria-label="ราคา"
                style={{ flex: 1 }}
              />
            </div>
            {errors.stock ? (
              <div className="field-error">{errors.stock}</div>
            ) : null}
            {errors.price ? (
              <div className="field-error">{errors.price}</div>
            ) : null}
          </div>

          <label>ผู้จำหน่าย</label>
          <input
            className="input"
            value={form.supplier}
            onChange={update('supplier')}
            placeholder="เช่น ABSMEDIQ"
            aria-label="ผู้จำหน่าย"
          />

          <label>รายละเอียด</label>
          <textarea
            className="textarea"
            rows={4}
            value={form.description}
            onChange={update('description')}
            placeholder="รายละเอียดเพิ่มเติม"
            aria-label="รายละเอียด"
          />
        </div>

        <div className="form-actions" style={{ marginTop: 12 }}>
          <button type="button" className="button" onClick={() => onCancel?.()}>
            ย้อนกลับ
          </button>
          <button type="submit" className="button">
            บันทึก
          </button>
        </div>
      </form>
    </section>
  );
}
