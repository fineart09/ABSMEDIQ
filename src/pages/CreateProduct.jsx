import { useEffect, useMemo, useState } from 'react';

const toNumber = (v) => {
  if (v === '' || v === null || v === undefined) return '';
  const n = Number(v);
  return Number.isFinite(n) ? n : '';
};

const cleanDecimalInput = (raw) => {
  const cleaned = String(raw ?? '').replace(/[^0-9.]/g, '');
  const dotIndex = cleaned.indexOf('.');
  if (dotIndex === -1) return cleaned;
  const head = cleaned.slice(0, dotIndex + 1);
  const tail = cleaned.slice(dotIndex + 1).replace(/\./g, '');
  return head + tail;
};

const generateProductCode = () => {
  const dateKey = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `PRD${dateKey}-${rand}`;
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

export default function CreateProduct({
  onCancel,
  onSave,
  initial,
  title,
  prefill,
  categoryOptions = CATEGORY_OPTIONS,
  unitOptions = UNIT_OPTIONS,
}) {
  const initialForm = useMemo(() => {
    if (!initial) {
      const base = {
        code: '',
        nameTh: '',
        productId: '',
        nameEn: '',
        category: '',
        unit: '',
        warehouse: '',
        price: '',
        stock: '',
        lowStockAlertEnabled: false,
        lowStockAlertThreshold: '',
        allowNegativeStockSale: false,
        status: 'ใช้งาน',
        description: '',
      };

      const src = prefill && typeof prefill === 'object' ? prefill : null;
      if (!src) return base;

      const merged = { ...base };
      const assignIfProvided = (key) => {
        if (!(key in base)) return;
        const v = src[key];
        if (v === undefined || v === null) return;
        if (typeof base[key] === 'string') {
          merged[key] = String(v);
          return;
        }
        merged[key] = v;
      };

      assignIfProvided('nameTh');
      assignIfProvided('productId');
      assignIfProvided('category');
      assignIfProvided('unit');
      assignIfProvided('warehouse');
      assignIfProvided('description');

      if (src.price !== undefined && src.price !== null && src.price !== '') {
        merged.price = toNumber(src.price);
      }
      if (src.stock !== undefined && src.stock !== null && src.stock !== '') {
        merged.stock = toNumber(src.stock);
      }

      return merged;
    }
    return {
      code: initial.code || '',
      nameTh: initial.nameTh || '',
      productId: initial.productId || '',
      nameEn: initial.nameEn || '',
      category: initial.category || '',
      unit: initial.unit || '',
      price: toNumber(initial.price),
      stock: toNumber(initial.stock),
      warehouse: initial.warehouse || '',
      lowStockAlertEnabled: Boolean(initial.lowStockAlertEnabled),
      lowStockAlertThreshold: toNumber(initial.lowStockAlertThreshold),
      allowNegativeStockSale: Boolean(initial.allowNegativeStockSale),
      status: initial.status || 'ใช้งาน',
      description: initial.description || '',
    };
  }, [initial, prefill]);

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(initialForm);
  }, [initialForm]);

  const requiredFields = useMemo(() => ['nameTh', 'category', 'unit'], []);

  const update = (field) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const updateNumber = (field) => (e) => {
    const raw = e.target.value;
    const cleaned = cleanDecimalInput(raw);
    setForm((prev) => ({ ...prev, [field]: cleaned }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const updateInteger = (field) => (e) => {
    const raw = e.target.value;
    const cleaned = raw.replace(/[^0-9]/g, '');
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

    if (form.lowStockAlertEnabled) {
      const t = Number(form.lowStockAlertThreshold);
      if (form.lowStockAlertThreshold === '' || !Number.isFinite(t) || t < 0) {
        next.lowStockAlertThreshold = 'กรุณาระบุจำนวนขั้นต่ำ (0 ขึ้นไป)';
      }
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const code = String(form.code || '').trim() || generateProductCode();

    onSave?.({
      ...form,
      code,
      productId: String(form.productId || '').trim(),
      price: form.price === '' ? '' : Number(form.price),
      stock: form.stock === '' ? '' : Number(form.stock),
      lowStockAlertEnabled: Boolean(form.lowStockAlertEnabled),
      lowStockAlertThreshold:
        form.lowStockAlertEnabled && form.lowStockAlertThreshold !== ''
          ? Number(form.lowStockAlertThreshold)
          : '',
      allowNegativeStockSale: Boolean(form.allowNegativeStockSale),
    });
  };

  return (
    <section>
      <h1 className="page-title">{title || 'สร้างรายการสินค้าใหม่'}</h1>

      <form className="form-card" onSubmit={submit}>
        <div className="form-grid">
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

          <label>ID สินค้า</label>
          <div>
            <input
              className="input"
              value={form.productId}
              onChange={update('productId')}
              placeholder="เช่น A/01"
              aria-label="ID สินค้า"
            />
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

          <label>หมวดหมู่ *</label>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <select
                className="select"
                value={String(form.category || '')}
                onChange={update('category')}
                aria-label="หมวดหมู่"
                style={{ width: '100%' }}
              >
                <option value="">-</option>
                {categoryOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
                {form.category && !categoryOptions.includes(form.category) ? (
                  <option value={form.category}>{form.category}</option>
                ) : null}
              </select>
              {errors.category ? (
                <div className="field-error">{errors.category}</div>
              ) : null}
            </div>
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

          <label>หน่วย *</label>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ flex: 1 }}>
                <select
                  className="select"
                  value={String(form.unit || '')}
                  onChange={update('unit')}
                  aria-label="หน่วย"
                  style={{ width: '100%' }}
                >
                  <option value="">-</option>
                  {unitOptions.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                  {form.unit && !unitOptions.includes(form.unit) ? (
                    <option value={form.unit}>{form.unit}</option>
                  ) : null}
                </select>
                {errors.unit ? (
                  <div className="field-error">{errors.unit}</div>
                ) : null}
              </div>
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

          <label>เตือน stock คงเหลือ</label>
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                flexWrap: 'wrap',
              }}
            >
              <label
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  fontWeight: 700,
                }}
              >
                <input
                  type="checkbox"
                  checked={Boolean(form.lowStockAlertEnabled)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setForm((prev) => ({
                      ...prev,
                      lowStockAlertEnabled: checked,
                    }));
                    if (errors.lowStockAlertThreshold) {
                      setErrors((prev) => ({
                        ...prev,
                        lowStockAlertThreshold: '',
                      }));
                    }
                  }}
                  aria-label="เปิดใช้งานเตือน stock คงเหลือ"
                />
                เปิดใช้งาน
              </label>

              <span style={{ whiteSpace: 'nowrap', fontWeight: 600 }}>
                จำนวน
              </span>
              <input
                className="input"
                value={form.lowStockAlertThreshold}
                onChange={updateInteger('lowStockAlertThreshold')}
                placeholder="เช่น 5"
                inputMode="numeric"
                disabled={!form.lowStockAlertEnabled}
                aria-label="จำนวนเตือน stock คงเหลือ"
                style={{ width: 140 }}
              />

              <label
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  fontWeight: 700,
                }}
              >
                <input
                  type="checkbox"
                  checked={Boolean(form.allowNegativeStockSale)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setForm((prev) => ({
                      ...prev,
                      allowNegativeStockSale: checked,
                    }));
                  }}
                  aria-label="ขายได้เมื่อ stock ติดลบ"
                />
                ขายได้เมื่อ stock ติดลบ
              </label>
            </div>
            {errors.lowStockAlertThreshold ? (
              <div className="field-error">{errors.lowStockAlertThreshold}</div>
            ) : null}
          </div>

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
            ยกเลิก
          </button>
          <button type="submit" className="button">
            บันทึก
          </button>
        </div>
      </form>
    </section>
  );
}
