import { useEffect, useMemo, useState } from 'react';

const SERVICE_FEE_TYPES = [
  'ครอสออกกำลังการ',
  'ค่าหัถการ',
  'การบริการแลป',
  'ค่าบริการให้วิตามิน',
];

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

const generateServiceFeeCode = () => {
  const dateKey = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `SV${dateKey}-${rand}`;
};

export default function CreateServiceFee({ onCancel, onSave, title, initial }) {
  const initialForm = useMemo(() => {
    if (!initial) {
      return {
        code: '',
        name: '',
        type: '',
        price: '',
      };
    }

    return {
      code: initial.code || '',
      name: initial.name || '',
      type: initial.type || '',
      price: toNumber(initial.price),
    };
  }, [initial]);

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(initialForm);
  }, [initialForm]);

  const update = (field) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const updatePrice = (e) => {
    const cleaned = cleanDecimalInput(e.target.value);
    setForm((prev) => ({ ...prev, price: cleaned }));
    if (errors.price) setErrors((prev) => ({ ...prev, price: '' }));
  };

  const validate = () => {
    const next = {};
    if (!String(form.name || '').trim()) next.name = 'จำเป็นต้องกรอก';
    if (!String(form.type || '').trim()) next.type = 'จำเป็นต้องเลือก';

    const priceRaw = form.price;
    const priceNumber = Number(priceRaw);
    if (priceRaw === '' || !Number.isFinite(priceNumber) || priceNumber < 0) {
      next.price = 'กรุณาระบุราคาให้ถูกต้อง';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const code = String(form.code || '').trim() || generateServiceFeeCode();

    onSave?.({
      code,
      name: String(form.name || '').trim(),
      type: String(form.type || '').trim(),
      price: Number(form.price),
    });
  };

  return (
    <section>
      <h1 className="page-title">{title || 'สร้างรายการค่าบริการ'}</h1>

      <form className="form-card" onSubmit={submit}>
        <div className="form-grid">
          <label>รายการค่าบริการ *</label>
          <div>
            <input
              className="input"
              value={form.name}
              onChange={update('name')}
              placeholder="ชื่อรายการค่าบริการ"
              aria-label="รายการค่าบริการ"
            />
            {errors.name ? (
              <div className="field-error">{errors.name}</div>
            ) : null}
          </div>

          <label>ประเภท *</label>
          <div>
            <select
              className="select"
              value={form.type}
              onChange={update('type')}
              aria-label="ประเภทค่าบริการ"
            >
              <option value="">เลือกประเภท</option>
              {SERVICE_FEE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            {errors.type ? (
              <div className="field-error">{errors.type}</div>
            ) : null}
          </div>

          <label>ราคา (บาท) *</label>
          <div>
            <input
              className="input"
              value={form.price}
              onChange={updatePrice}
              placeholder="0.00"
              aria-label="ราคา"
              inputMode="decimal"
            />
            {errors.price ? (
              <div className="field-error">{errors.price}</div>
            ) : null}
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="button" onClick={() => onCancel?.()}>
            ยกเลิก
          </button>
          <button type="submit" className="button button--solid">
            บันทึก
          </button>
        </div>
      </form>
    </section>
  );
}
