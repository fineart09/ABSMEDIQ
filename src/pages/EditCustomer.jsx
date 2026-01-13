import { useEffect, useMemo, useState } from 'react';

export default function EditCustomer({
  customer,
  onCancel,
  onSave,
  onDefineConditions,
  title = 'แก้ไขรายชื่อลูกค้า',
}) {
  const [form, setForm] = useState(() => ({
    id: customer?.id || '',
    name: customer?.name || '',
    phone: customer?.phone || '',
    email: customer?.email || '',
    status: customer?.status || 'Active',
    lastVisit: customer?.lastVisit || '',
  }));

  useEffect(() => {
    if (!customer) return;
    setForm({
      id: customer.id || '',
      name: customer.name || '',
      phone: customer.phone || '',
      email: customer.email || '',
      status: customer.status || 'Active',
      lastVisit: customer.lastVisit || '',
    });
  }, [customer]);

  const statuses = useMemo(() => ['Active', 'Inactive', 'Delinquent'], []);

  const update = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    onSave?.(form);
  };

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
        style={{ display: 'grid', gap: '0.75rem', maxWidth: 640 }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '160px 1fr',
            gap: '8px 12px',
            alignItems: 'center',
          }}
        >
          <label htmlFor="ec-id">HN</label>
          <input
            id="ec-id"
            value={form.id}
            onChange={update('id')}
            readOnly
            style={{ padding: '8px 10px' }}
          />

          <label htmlFor="ec-name">ชื่อ</label>
          <input
            id="ec-name"
            value={form.name}
            onChange={update('name')}
            style={{ padding: '8px 10px' }}
          />

          <label htmlFor="ec-phone">โทรศัพท์</label>
          <input
            id="ec-phone"
            value={form.phone}
            onChange={update('phone')}
            style={{ padding: '8px 10px' }}
          />

          <label htmlFor="ec-email">อีเมล</label>
          <input
            id="ec-email"
            value={form.email}
            onChange={update('email')}
            style={{ padding: '8px 10px' }}
          />

          <label htmlFor="ec-status">สถานะ</label>
          <select
            id="ec-status"
            value={form.status}
            onChange={update('status')}
            style={{ padding: '8px 10px' }}
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <label htmlFor="ec-last">วันที่ลงทะเบียน</label>
          <input
            id="ec-last"
            type="date"
            value={form.lastVisit}
            onChange={update('lastVisit')}
            style={{ padding: '8px 10px' }}
          />
        </div>

        <div
          style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}
        >
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
