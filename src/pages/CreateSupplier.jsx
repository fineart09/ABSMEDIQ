import { useEffect, useMemo, useState } from 'react';

const normalizeTaxId = (v) => String(v || '').replace(/[^0-9]/g, '');

const generateSupplierId = () => {
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `SUP-${rand}`;
};

export default function CreateSupplier({ onCancel, onSave, initial, title }) {
  const initialForm = useMemo(() => {
    if (!initial) {
      return {
        name: '',
        address: '',
        taxId: '',
      };
    }

    return {
      name: initial.name || '',
      address: initial.address || '',
      taxId: initial.taxId || '',
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

  const updateTaxId = (e) => {
    const cleaned = normalizeTaxId(e.target.value);
    setForm((prev) => ({ ...prev, taxId: cleaned }));
    if (errors.taxId) setErrors((prev) => ({ ...prev, taxId: '' }));
  };

  const validate = () => {
    const next = {};

    if (!String(form.name || '').trim()) next.name = 'จำเป็นต้องกรอก';

    const taxId = normalizeTaxId(form.taxId);
    if (taxId && taxId.length !== 13) next.taxId = 'กรุณากรอก 13 หลัก';

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const existingId = String(initial?.id || '').trim();
    const id = existingId || generateSupplierId();

    onSave?.({
      id,
      name: String(form.name || '').trim(),
      address: String(form.address || '').trim(),
      taxId: normalizeTaxId(form.taxId),
    });
  };

  return (
    <section>
      <h1 className="page-title">{title || 'สร้างรายการผู้จำหน่าย'}</h1>

      <form className="form-card" onSubmit={submit}>
        <div className="form-grid">
          <label>ผู้จำหน่าย *</label>
          <div>
            <input
              className="input"
              value={form.name}
              onChange={update('name')}
              placeholder="ชื่อผู้จำหน่าย"
              aria-label="ชื่อผู้จำหน่าย"
            />
            {errors.name ? (
              <div className="field-error">{errors.name}</div>
            ) : null}
          </div>

          <label>ที่อยู่</label>
          <div>
            <textarea
              className="input"
              value={form.address}
              onChange={update('address')}
              placeholder="ที่อยู่ผู้จำหน่าย"
              aria-label="ที่อยู่ผู้จำหน่าย"
              rows={3}
              style={{ resize: 'vertical' }}
            />
            {errors.address ? (
              <div className="field-error">{errors.address}</div>
            ) : null}
          </div>

          <label>เลขประจำตัวผู้เสียภาษี</label>
          <div>
            <input
              className="input"
              value={form.taxId}
              onChange={updateTaxId}
              placeholder="13 หลัก"
              aria-label="เลขประจำตัวผู้เสียภาษี"
              inputMode="numeric"
              maxLength={13}
            />
            {errors.taxId ? (
              <div className="field-error">{errors.taxId}</div>
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
