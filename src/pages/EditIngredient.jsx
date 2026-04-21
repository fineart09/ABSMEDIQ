import { useEffect, useMemo, useState } from 'react';

const DEFAULT_PRODUCT_CATEGORY_OPTIONS = [
  'ยาเม็ด',
  'ยาน้ำ',
  'ยาผง',
  'เวชภัณฑ์',
];
const DEFAULT_PRODUCT_UNIT_OPTIONS = [
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

const WAREHOUSE_OPTIONS = Array.from({ length: 20 }, (_, i) => String(i + 1));

const ALLOWED_WAREHOUSES = new Set(WAREHOUSE_OPTIONS);

const normalizeCategory = (value) => String(value || '').trim();

const normalizeOptionList = (options, fallbackOptions = []) => {
  const src = Array.isArray(options) ? options : [];
  const normalized = src.map((x) => String(x || '').trim()).filter(Boolean);
  const unique = Array.from(new Set(normalized));
  if (unique.length) return unique;
  return Array.from(
    new Set(
      (fallbackOptions || []).map((x) => String(x || '').trim()).filter(Boolean)
    )
  );
};

const normalizeWarehouse = (value) => {
  const wh = String(value ?? '').trim();
  return ALLOWED_WAREHOUSES.has(wh) ? wh : WAREHOUSE_OPTIONS[0] || '1';
};

export default function EditIngredient({
  onCancel,
  onSave,
  initial,
  title = 'แก้ไขรายละเอียด Ingredient',
  categoryOptions,
  unitOptions,
}) {
  const resolvedCategoryOptions = useMemo(
    () =>
      normalizeOptionList(categoryOptions, DEFAULT_PRODUCT_CATEGORY_OPTIONS),
    [categoryOptions]
  );
  const resolvedUnitOptions = useMemo(
    () => normalizeOptionList(unitOptions, DEFAULT_PRODUCT_UNIT_OPTIONS),
    [unitOptions]
  );

  const initialForm = useMemo(() => {
    if (!initial) {
      return {
        code: '',
        nameTh: '',
        nameEn: '',
        category: resolvedCategoryOptions[0] || '',
        unit: resolvedUnitOptions[0] || '',
        warehouse: WAREHOUSE_OPTIONS[0] || '1',
        status: 'ใช้งาน',
        description: '',
      };
    }

    return {
      code: String(initial.code || '').trim(),
      nameTh: initial.nameTh || '',
      nameEn: initial.nameEn || '',
      category: normalizeCategory(initial.category),
      unit: initial.unit || '',
      warehouse: normalizeWarehouse(initial.warehouse),
      status: initial.status || 'ใช้งาน',
      description: initial.description || '',
    };
  }, [initial, resolvedCategoryOptions, resolvedUnitOptions]);

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(initialForm);
    setErrors({});
  }, [initialForm]);

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

  const submit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSave?.({
      ...form,
      code: String(form.code || '').trim(),
      nameTh: String(form.nameTh || '').trim(),
      category: normalizeCategory(form.category),
      unit: String(form.unit || '').trim(),
      warehouse: normalizeWarehouse(form.warehouse),
      status: String(form.status || '').trim() || 'ใช้งาน',
      description: String(form.description || '').trim(),
    });
  };

  return (
    <section>
      <h1 className="page-title">{title}</h1>

      {!initial ? (
        <div className="form-card">
          ไม่พบข้อมูล Ingredient สำหรับแก้ไข
          <div className="form-actions" style={{ marginTop: 12 }}>
            <button
              type="button"
              className="button button--solid"
              onClick={onCancel}
            >
              กลับ
            </button>
          </div>
        </div>
      ) : (
        <form
          className="form-card"
          onSubmit={submit}
          style={{ position: 'relative', paddingTop: '2.25rem' }}
        >
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
            รหัส Ingredient: {form.code || '-'}
          </span>

          <div className="form-grid">
            <label>ชื่อ Ingredient *</label>
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
                {resolvedCategoryOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
                {form.category &&
                !resolvedCategoryOptions.includes(form.category) ? (
                  <option value={form.category}>{form.category}</option>
                ) : null}
              </select>
              {errors.category ? (
                <div className="field-error">{errors.category}</div>
              ) : null}
            </div>

            <label>หน่วย *</label>
            <div>
              <select
                className="select"
                value={String(form.unit || '')}
                onChange={update('unit')}
                aria-label="หน่วย"
                style={{ width: '100%' }}
              >
                <option value="">-</option>
                {resolvedUnitOptions.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
                {form.unit && !resolvedUnitOptions.includes(form.unit) ? (
                  <option value={form.unit}>{form.unit}</option>
                ) : null}
              </select>
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
            <div>
              <select
                className="select"
                value={form.status}
                onChange={update('status')}
                aria-label="สถานะ"
              >
                <option value="ใช้งาน">ใช้งาน</option>
                <option value="ไม่ใช้งาน">ไม่ใช้งาน</option>
              </select>
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
            <button
              type="button"
              className="button"
              onClick={() => onCancel?.()}
            >
              ยกเลิก
            </button>
            <button type="submit" className="button button--solid">
              บันทึก
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
