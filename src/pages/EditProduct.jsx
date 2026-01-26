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

export default function EditProduct({
  onCancel,
  onSave,
  initial,
  title = 'แก้ไขรายละเอียดสินค้า',
}) {
  const initialForm = useMemo(() => {
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
        lowStockAlertEnabled: false,
        lowStockAlertThreshold: '',
        allowNegativeStockSale: false,
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
      lowStockAlertEnabled: Boolean(initial.lowStockAlertEnabled),
      lowStockAlertThreshold: toNumber(initial.lowStockAlertThreshold),
      allowNegativeStockSale: Boolean(initial.allowNegativeStockSale),
      supplier: initial.supplier || '',
      status: initial.status || 'ใช้งาน',
      description: initial.description || '',
    };
  }, [initial]);

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const isEdit = Boolean(initial);

  useEffect(() => {
    setForm(initialForm);
  }, [initialForm]);

  const requiredFields = useMemo(() => {
    // Allow editing without changing code, but still require code on create.
    return isEdit
      ? ['nameTh', 'category', 'unit']
      : ['code', 'nameTh', 'category', 'unit'];
  }, [isEdit]);

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

    onSave?.({
      ...form,
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

      <form
        className="form-card"
        onSubmit={submit}
        style={{
          position: 'relative',
          ...(isEdit ? { paddingTop: '2.25rem' } : null),
        }}
      >
        {isEdit ? (
          <span
            className="badge badge--active badge--hn"
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              transform: 'scale(1.3)',
              transformOrigin: 'top right',
            }}
          >
            รหัสสินค้า: {form.code || '-'}
          </span>
        ) : null}
        <div className="form-grid">
          {!isEdit ? (
            <>
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
            </>
          ) : null}

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
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
                {form.category && !CATEGORY_OPTIONS.includes(form.category) ? (
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
                  {UNIT_OPTIONS.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                  {form.unit && !UNIT_OPTIONS.includes(form.unit) ? (
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
