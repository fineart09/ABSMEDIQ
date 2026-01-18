import { useEffect, useMemo, useRef, useState } from 'react';

/**
 * EditCustomer Component
 * @description เวอร์ชันรวม Logic Backend เข้ากับ UI ล่าสุด (v1)
 * @param {Object} customer - ข้อมูลเบื้องต้นที่ส่งมาจาก List/Table
 */
export default function EditCustomer({
  customer,
  onCancel,
  onSave,
  onDefineConditions,
  title = 'แก้ไขรายชื่อลูกค้า',
}) {
  const photoInputRef = useRef(null);
  const originalPhotoUrlRef = useRef(customer?.photoUrl || '');

  // 1. Initialize State จาก Props (เพื่อความรวดเร็วในการแสดงผล)
  const [photoUrl, setPhotoUrl] = useState(() => customer?.photoUrl || '');
  const [enableExtraNames, setEnableExtraNames] = useState(false);
  const [extraNames, setExtraNames] = useState([]);
  const [form, setForm] = useState(() => ({
    hn: customer?.hn || customer?.id || '',
    name: customer?.name || '',
    phone: customer?.phone || '',
    email: customer?.email || '',
    status: customer?.status || 'ใช้งาน',
    lastVisit: customer?.lastVisit || '',
    notes: customer?.notes || '',
  }));

  // 2. Data Synchronization (ดึงข้อมูลล่าสุดจาก Backend)
  useEffect(() => {
    const targetId = customer?.hn || customer?.id;
    if (!targetId) return;

    const fetchCustomerData = async () => {
      try {
        // ในระบบจริงควรใช้ Instance ของ Axios หรือ Wrapper Fetch ที่จัดการเรื่อง Auth Token
        const response = await fetch(`/api/customers/${targetId}`);
        if (!response.ok) throw new Error('Failed to fetch customer data');

        const data = await response.json();

        // Mapping Data: แปลง Format จาก Backend เป็น Format ที่ UI เข้าใจ
        setForm({
          hn: data.hn || data.id || '',
          name: data.name || '',
          phone: data.phone || '',
          email: data.email || '',
          status: data.status === 'Active' ? 'ใช้งาน' :
                  data.status === 'Deactive' ? 'ไม่ใช้งาน' : (data.status || 'ใช้งาน'),
          lastVisit: data.birthDate || '', // สมมติว่าหลังบ้านส่งเป็น birthDate
          notes: data.notes || '',
        });

        if (data.photoUrl) {
          setPhotoUrl(data.photoUrl);
          originalPhotoUrlRef.current = data.photoUrl;
        }

        if (Array.isArray(data.otherNames) && data.otherNames.length > 0) {
          setEnableExtraNames(true);
          setExtraNames(data.otherNames);
        }
      } catch (error) {
        console.error('[EditCustomer] Fetch Error:', error);
        // สามารถเพิ่มการแจ้งเตือน Error Toast ได้ที่นี่
      }
    };

    fetchCustomerData();
  }, [customer]);

  const statuses = useMemo(() => ['ใช้งาน', 'ไม่ใช้งาน', 'ค้างชำระ'], []);

  const updateField = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  // 3. Handle Submit with Data Mapping (ขาออก)
  const handleSubmit = (e) => {
    e.preventDefault();

    // แปลงข้อมูลกลับเป็น Format ที่ Backend ต้องการก่อนส่งออก
    const payload = {
      ...form,
      status: form.status === 'ใช้งาน' ? 'Active' :
              form.status === 'ไม่ใช้งาน' ? 'Deactive' : form.status,
      photoUrl: photoUrl || '',
      otherNames: enableExtraNames ? extraNames : [],
    };

    onSave?.(payload);
  };

  // Photo Handlers
  const onPhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoUrl((prev) => {
      if (prev?.startsWith?.('blob:')) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
  };

  const clearOrResetPhoto = () => {
    const original = originalPhotoUrlRef.current || '';
    setPhotoUrl((prev) => {
      if (prev?.startsWith?.('blob:')) URL.revokeObjectURL(prev);
      return original;
    });
    if (photoInputRef.current) photoInputRef.current.value = '';
  };

  // Cleanup Blob URL เมื่อ Component Unmount
  useEffect(() => {
    return () => {
      if (photoUrl?.startsWith?.('blob:')) URL.revokeObjectURL(photoUrl);
    };
  }, [photoUrl]);

  if (!customer) {
    return (
      <section>
        <div className="page-sticky-header"><h1 className="page-title">{title}</h1></div>
        <p>ไม่พบข้อมูลลูกค้าที่ต้องการแก้ไข</p>
        <button type="button" className="button" onClick={onCancel}>กลับ</button>
      </section>
    );
  }

  return (
    <section>
      <div className="page-sticky-header">
        <h1 className="page-title">{title}</h1>
      </div>
      <form onSubmit={handleSubmit} className="form-card" style={{ display: 'grid', gap: '1rem' }}>
        <div className="form-grid">
          {/* Section: Name & HN */}
          <label htmlFor="ec-name">ชื่อ</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'space-between' }}>
            <input
              id="ec-name"
              value={form.name}
              onChange={updateField('name')}
              className="input"
              style={{ flex: 1 }}
              required
            />
            <span className="badge badge--active badge--hn">
              HN: {form.hn || '-'}
            </span>
          </div>

          {/* Section: Extra Names (Dynamic Inputs) */}
          <label htmlFor="ec-extra-names">เพิ่มรายชื่อ</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              id="ec-extra-names"
              type="checkbox"
              checked={enableExtraNames}
              onChange={(e) => {
                const checked = e.target.checked;
                setEnableExtraNames(checked);
                if (checked && extraNames.length === 0) setExtraNames(['']);
                if (!checked) setExtraNames([]);
              }}
            />
            <span>เปิดการเพิ่มรายชื่อ</span>
          </div>

          {enableExtraNames && (
            <div style={{ gridColumn: '1 / -1', display: 'grid', gap: '0.5rem' }}>
              {extraNames.map((val, idx) => (
                <div key={`extra-name-${idx}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    className="input"
                    style={{ flex: 1 }}
                    placeholder={`ชื่อ (เพิ่มเติม) บรรทัดที่ ${idx + 1}`}
                    value={val}
                    onChange={(e) => {
                      const next = [...extraNames];
                      next[idx] = e.target.value;
                      setExtraNames(next);
                    }}
                  />
                  {idx === 0 && extraNames.length < 5 && (
                    <button type="button" className="button" onClick={() => setExtraNames([...extraNames, ''])}>
                      +เพิ่ม
                    </button>
                  )}
                  {idx > 0 && (
                    <button type="button" className="button button--danger" onClick={() => setExtraNames(extraNames.filter((_, i) => i !== idx))}>
                      -ลบ
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Section: Standard Fields */}
          <label htmlFor="ec-phone">โทรศัพท์</label>
          <input id="ec-phone" value={form.phone} onChange={updateField('phone')} className="input" />

          <label htmlFor="ec-email">อีเมล</label>
          <input id="ec-email" type="email" value={form.email} onChange={updateField('email')} className="input" />

          <label htmlFor="ec-status">สถานะ</label>
          <select id="ec-status" value={form.status} onChange={updateField('status')} className="select">
            {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>

          <label htmlFor="ec-last">วันเกิด</label>
          <input id="ec-last" type="date" value={form.lastVisit} onChange={updateField('lastVisit')} className="input" />

          <label htmlFor="ec-notes">หมายเหตุ</label>
          <textarea id="ec-notes" value={form.notes} onChange={updateField('notes')} rows={2} className="textarea" />

          {/* Section: Photo Upload */}
          <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
            <input ref={photoInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={onPhotoChange} />
            <button type="button" className="button" onClick={() => photoInputRef.current?.click()}>
              อัพโหลดรูปลูกค้า
            </button>
            <div className="photo-box" aria-label="รูปภาพลูกค้า">
              {photoUrl ? <img src={photoUrl} alt="รูปภาพลูกค้า" /> : <span className="photo-box__placeholder">ยังไม่มีรูปภาพ</span>}
            </div>
            <button
              type="button"
              className="button button--danger"
              onClick={clearOrResetPhoto}
              disabled={!photoUrl && !originalPhotoUrlRef.current}
            >
              ลบรูป/รีเซ็ตรูป
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="form-actions">
          <button type="button" className="button" onClick={() => onDefineConditions?.(form)}>
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