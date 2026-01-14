import { useEffect, useMemo, useRef, useState } from 'react';

export default function EditCustomer({
  customer,
  onCancel,
  onSave,
  onDefineConditions,
  title = 'แก้ไขรายชื่อลูกค้า',
}) {
  const photoInputRef = useRef(null);
  const [photoUrl, setPhotoUrl] = useState('');
  const [form, setForm] = useState(() => ({
    hn: customer?.hn || '',
    name: customer?.name || '',
    phone: customer?.phone || '',
    email: customer?.email || '',
    status: customer?.status || 'Active',
    lastVisit: customer?.lastVisit || '',
    notes: customer?.notes || '',
  }));

  useEffect(() => {
    if (!customer) return;
    setForm({
      hn: customer.hn || '',
      name: customer.name || '',
      phone: customer.phone || '',
      email: customer.email || '',
      status: customer.status || 'Active',
      lastVisit: customer.lastVisit || '',
      notes: customer.notes || '',
    });
  }, [customer]);

  const statuses = useMemo(() => ['Active', 'Inactive', 'Delinquent'], []);

  const update = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    onSave?.(form);
  };

  const onPhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
  };

  useEffect(() => {
    return () => {
      if (photoUrl) URL.revokeObjectURL(photoUrl);
    };
  }, [photoUrl]);

  if (!customer) {
    return (
      <section>
        <div className="page-sticky-header">
          <h1 className="page-title">{title}</h1>
        </div>
        <p>ไม่พบข้อมูลลูกค้าที่ต้องการแก้ไข</p>
        <div style={{ marginTop: '0.75rem' }}>
          <button type="button" className="button" onClick={onCancel}>
            กลับ
          </button>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="page-sticky-header">
        <h1 className="page-title">{title}</h1>
      </div>
      <form
        onSubmit={submit}
        className="form-card"
        style={{ display: 'grid', gap: '1rem' }}
      >
        <div className="form-grid">
          <label htmlFor="ec-name">ชื่อ</label>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              justifyContent: 'space-between',
            }}
          >
            <input
              id="ec-name"
              value={form.name}
              onChange={update('name')}
              className="input"
              style={{ flex: 1 }}
            />
            <span className="badge badge--active badge--hn">
              HN: {form.hn || '-'}
            </span>
          </div>

          {/* Photo preview moved to be near upload button */}

          <label htmlFor="ec-phone">โทรศัพท์</label>
          <input
            id="ec-phone"
            value={form.phone}
            onChange={update('phone')}
            className="input"
          />

          <label htmlFor="ec-email">อีเมล</label>
          <input
            id="ec-email"
            value={form.email}
            onChange={update('email')}
            className="input"
          />

          <label htmlFor="ec-status">สถานะ</label>
          <select
            id="ec-status"
            value={form.status}
            onChange={update('status')}
            className="select"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <label htmlFor="ec-last">วันเกิด</label>
          <input
            id="ec-last"
            type="date"
            value={form.lastVisit}
            onChange={update('lastVisit')}
            className="input"
          />

          <label htmlFor="ec-notes">หมายเหตุ</label>
          <textarea
            id="ec-notes"
            value={form.notes}
            onChange={update('notes')}
            rows={2}
            className="textarea"
          />

          {/* Upload button and photo preview below Notes */}
          <div
            style={{
              gridColumn: '1 / -1',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '8px',
            }}
          >
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={onPhotoChange}
            />
            <button
              type="button"
              className="button"
              onClick={() => photoInputRef.current?.click()}
            >
              อัพโหลดรูปลูกค้า
            </button>
            <div className="photo-box" aria-label="รูปภาพลูกค้า">
              {photoUrl ? (
                <img src={photoUrl} alt="รูปภาพลูกค้า" />
              ) : (
                <span className="photo-box__placeholder">ยังไม่มีรูปภาพ</span>
              )}
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="button"
            onClick={() => onDefineConditions?.(form)}
          >
            กำหนดเงื่อนไขลูกค้า
          </button>
          <button type="button" className="button" onClick={onCancel}>
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
