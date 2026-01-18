import { useEffect, useMemo, useRef, useState } from 'react';

export default function EditCustomer({
  customer, // รับกุญแจหลัก (เช่น HN หรือ ID) มาจากหน้า List
  onCancel,
  onSave,
  onDefineConditions,
  title = 'แก้ไขรายชื่อลูกค้า',
}) {
  const photoInputRef = useRef(null);
  const [photoUrl, setPhotoUrl] = useState('');
  const originalPhotoUrlRef = useRef('');

  // --- [เพิ่มใหม่] States สำหรับการดึงข้อมูลจาก Backend ---
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [enableExtraNames, setEnableExtraNames] = useState(false);
  const [extraNames, setExtraNames] = useState([]);

  // --- [เพิ่มใหม่] Form State เริ่มต้น ---
  const [form, setForm] = useState({
    hn: '',
    name: '',
    phone: '',
    email: '',
    status: 'ใช้งาน',
    lastVisit: '', // ใช้เป็นวันเกิดใน UI นี้
    notes: '',
  });

  // Helper สำหรับแปลงสถานะ (ตามที่เราตกลงกันไว้)
  const mapStatusToUI = (status) => {
    const s = String(status || '').toLowerCase();
    if (s === 'active') return 'ใช้งาน';
    if (s === 'deactive' || s === 'inactive') return 'ไม่ใช้งาน';
    return 'ใช้งาน';
  };

  // --- [จุดสำคัญ] useEffect สำหรับเรียก Backend ก่อนเริ่มแก้ไข ---
  useEffect(() => {
    const fetchFullCustomerData = async () => {
      // ตรวจสอบว่ามีกุญแจหลัก (HN) ส่งมาหรือไม่
      const targetId = customer?.hn || customer?.id;
      if (!targetId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setFetchError(null);

        // เรียก API ดึงข้อมูลรายบุคคลจาก Java Spring Boot
        const response = await fetch(`/api/customers/${targetId}`);
        if (!response.ok) throw new Error(`ไม่สามารถโหลดข้อมูลลูกค้าได้ (Status: ${response.status})`);

        const fullData = await response.json();

        // --- [การ Mapping ข้อมูลหลังบ้านเข้าสู่ Form] ---
        setForm({
          hn: fullData.hn || fullData.id || '',
          name: fullData.name || '',
          phone: fullData.phone || fullData.details?.phone || '',
          email: fullData.email || fullData.details?.email || '',
          status: mapStatusToUI(fullData.status),
          // สำคัญ: type="date" ต้องการรูปแบบ yyyy-MM-dd เท่านั้น
          lastVisit: fullData.birthDate || fullData.lastVisit || '',
          notes: fullData.notes || fullData.details?.notes || '',
        });

        // จัดการรูปภาพ
        setPhotoUrl(fullData.photoUrl || '');
        originalPhotoUrlRef.current = fullData.photoUrl || '';

        // จัดการรายชื่อเพิ่มเติม
        if (Array.isArray(fullData.otherNames) && fullData.otherNames.length > 0) {
          setEnableExtraNames(true);
          setExtraNames(fullData.otherNames);
        }

      } catch (err) {
        console.error("Fetch Detail Error:", err);
        setFetchError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFullCustomerData();
  }, [customer]);

  const statuses = useMemo(() => ['ใช้งาน', 'ไม่ใช้งาน', 'ค้างชำระ'], []);

  const update = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  // จังหวะบันทึก: แปลงค่ากลับไปเป็น Format Backend
  const submit = (e) => {
    e.preventDefault();
    onSave?.({
      ...form,
      status: form.status === 'ใช้งาน' ? 'Active' : 'Deactive', // แปลงกลับไปให้ SQL Server
      photoUrl: photoUrl || '',
      otherNames: enableExtraNames ? extraNames : [],
    });
  };

  // --- UI Handling Logic ---
  const onPhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoUrl(URL.createObjectURL(file));
  };

  const clearOrResetPhoto = () => {
    setPhotoUrl(originalPhotoUrlRef.current || '');
    if (photoInputRef.current) photoInputRef.current.value = '';
  };

  // Loading & Error Views
  if (isLoading) return <div className="p-10">กำลังโหลดข้อมูลล่าสุดจาก SQL Server...</div>;
  if (fetchError) return <div className="p-10 text-red-500">ข้อผิดพลาด: {fetchError} <button onClick={onCancel}>กลับ</button></div>;
  if (!customer && !isLoading) return <p className="p-10">ไม่พบรหัสลูกค้าที่ต้องการแก้ไข</p>;

  return (
    <section>
      <div className="page-sticky-header">
        <h1 className="page-title">{title}</h1>
      </div>
      <form onSubmit={submit} className="form-card" style={{ display: 'grid', gap: '1rem' }}>
        <div className="form-grid">
          <label htmlFor="ec-name">ชื่อ</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'space-between' }}>
            <input id="ec-name" value={form.name} onChange={update('name')} className="input" style={{ flex: 1 }} />
            <span className="badge badge--active badge--hn">HN: {form.hn || '-'}</span>
          </div>

          <label htmlFor="ec-extra-names">เพิ่มรายชื่อ</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input id="ec-extra-names" type="checkbox" checked={enableExtraNames} onChange={(e) => setEnableExtraNames(e.target.checked)} />
            <span>เปิดการเพิ่มรายชื่อ</span>
          </div>

          {/* รายชื่อเพิ่มเติม (Dynamic Inputs) */}
          {enableExtraNames && (
            <div style={{ gridColumn: '1 / -1', display: 'grid', gap: '0.5rem' }}>
              {extraNames.map((val, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    value={val}
                    onChange={(e) => {
                      const next = [...extraNames];
                      next[idx] = e.target.value;
                      setExtraNames(next);
                    }}
                    className="input"
                    style={{ flex: 1 }}
                  />
                  {idx === 0 ? (
                    <button type="button" className="button" onClick={() => setExtraNames([...extraNames, ''])}>+</button>
                  ) : (
                    <button type="button" className="button button--danger" onClick={() => setExtraNames(extraNames.filter((_, i) => i !== idx))}>-</button>
                  )}
                </div>
              ))}
            </div>
          )}

          <label htmlFor="ec-phone">โทรศัพท์</label>
          <input id="ec-phone" value={form.phone} onChange={update('phone')} className="input" />

          <label htmlFor="ec-email">อีเมล</label>
          <input id="ec-email" value={form.email} onChange={update('email')} className="input" />

          <label htmlFor="ec-status">สถานะ</label>
          <select id="ec-status" value={form.status} onChange={update('status')} className="select">
            {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>

          <label htmlFor="ec-last">วันเกิด</label>
          <input id="ec-last" type="date" value={form.lastVisit} onChange={update('lastVisit')} className="input" />

          <label htmlFor="ec-notes">หมายเหตุ</label>
          <textarea id="ec-notes" value={form.notes} onChange={update('notes')} rows={2} className="textarea" />

          {/* Photo Management */}
          <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button type="button" className="button" onClick={() => photoInputRef.current?.click()}>อัพโหลดรูปลูกค้า</button>
            <input ref={photoInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={onPhotoChange} />
            <div className="photo-box">
              {photoUrl ? <img src={photoUrl} alt="Preview" /> : <span className="photo-box__placeholder">ยังไม่มีรูปภาพ</span>}
            </div>
            <button type="button" className="button button--danger" onClick={clearOrResetPhoto} disabled={!photoUrl}>ลบรูป/รีเซ็ตรูป</button>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="button" onClick={() => onDefineConditions?.(form)}>กำหนดเงื่อนไขลูกค้า</button>
          <button type="button" className="button" onClick={onCancel}>ยกเลิก</button>
          <button type="submit" className="button">บันทึก</button>
        </div>
      </form>
    </section>
  );
}