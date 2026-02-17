import { useEffect, useMemo, useState } from 'react';

const ROLE_OPTIONS = ['ผู้ฝึกสอน', 'ผู้ดำเนินการ'];

const generateCode = () => {
  const dateKey = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `TO${dateKey}-${rand}`;
};

export default function CreateTrainerOperator({
  onCancel,
  onSave,
  title,
  initial,
}) {
  const initialForm = useMemo(() => {
    if (!initial) {
      return {
        code: '',
        name: '',
        role: '',
      };
    }

    return {
      code: initial.code || '',
      name: initial.name || '',
      role: initial.role || '',
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

  const validate = () => {
    const next = {};
    if (!String(form.name || '').trim()) next.name = 'จำเป็นต้องกรอก';
    if (!String(form.role || '').trim()) next.role = 'จำเป็นต้องเลือก';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const code = String(form.code || '').trim() || generateCode();

    onSave?.({
      code,
      name: String(form.name || '').trim(),
      role: String(form.role || '').trim(),
    });
  };

  return (
    <section>
      <h1 className="page-title">{title || 'สร้างผู้ฝึกสอน/ผู้ดำเนินการ'}</h1>

      <form className="form-card" onSubmit={submit}>
        <div className="form-grid">
          <label>ชื่อ-นามสกุล *</label>
          <div>
            <input
              className="input"
              value={form.name}
              onChange={update('name')}
              placeholder="ชื่อ-นามสกุล"
              aria-label="ชื่อ-นามสกุล"
            />
            {errors.name ? (
              <div className="field-error">{errors.name}</div>
            ) : null}
          </div>

          <label>บทบาท *</label>
          <div>
            <select
              className="select"
              value={form.role}
              onChange={update('role')}
              aria-label="บทบาท"
            >
              <option value="">เลือกบทบาท</option>
              {ROLE_OPTIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            {errors.role ? (
              <div className="field-error">{errors.role}</div>
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
