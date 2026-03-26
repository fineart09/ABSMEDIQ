import { useEffect, useMemo, useRef, useState } from 'react';
import { MOCK_CUSTOMERS_FULL } from '../mocks/customersFull';

export default function EditCustomer({
  onCancel,
  onSave,
  initial,
  title = 'แก้ไขรายชื่อลูกค้า',
  onDefineConditions,
  initialConditions,
}) {
  const photoInputRef = useRef(null);
  const [photoUrl, setPhotoUrl] = useState(() => initial?.photoUrl || '');
  const originalPhotoUrlRef = useRef(initial?.photoUrl || '');
  const [condOpen, setCondOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerQuery, setPickerQuery] = useState('');
  const [pickerLineIndex, setPickerLineIndex] = useState(0);

  useEffect(() => {
    originalPhotoUrlRef.current = initial?.photoUrl || '';
    setPhotoUrl(initial?.photoUrl || '');
  }, [initial]);
  const [useAddName, setUseAddName] = useState(() =>
    Boolean(initialConditions?.segmentText)
  );
  const [cond, setCond] = useState(() => ({
    segment: initialConditions?.segment || '',
    discount: initialConditions?.discount ?? '',
    notes: initialConditions?.notes || '',
    segmentText: initialConditions?.segmentText || '',
  }));

  const [segmentLines, setSegmentLines] = useState(() => {
    const raw = initialConditions?.segmentText || '';
    const lines = raw
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean);
    return lines.length ? lines : [''];
  });

  useEffect(() => {
    if (!useAddName) {
      setCond((prev) => ({ ...prev, segmentText: '' }));
      return;
    }
    const joined = segmentLines
      .map((s) => (s || '').trim())
      .filter(Boolean)
      .join('\n');
    setCond((prev) => ({ ...prev, segmentText: joined }));
  }, [segmentLines, useAddName]);

  const filteredHN = useMemo(() => {
    const q = pickerQuery.trim().toLowerCase();
    if (!q) return MOCK_CUSTOMERS_FULL;
    return MOCK_CUSTOMERS_FULL.filter((c) => {
      const thName = [c.name?.prefixTh, c.name?.firstTh, c.name?.lastTh]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      const enName = [c.name?.prefixEn, c.name?.firstEn, c.name?.lastEn]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return thName.includes(q) || enName.includes(q);
    });
  }, [pickerQuery]);

  const composeThaiName = (c) =>
    [c.name?.prefixTh, c.name?.firstTh, c.name?.lastTh]
      .filter(Boolean)
      .join(' ');
  const composeThaiAddress = (c) =>
    [
      c.address?.addressTh,
      c.address?.subdistrictTh,
      c.address?.districtTh,
      c.address?.provinceTh,
      c.address?.postalCode,
    ]
      .filter(Boolean)
      .join(' ');
  const makeInitial = () => {
    if (!initial) {
      return {
        hn: '',
        status: 'ใช้งาน',
        // Name
        prefixTh: '',
        firstNameTh: '',
        lastNameTh: '',
        nickname: '',
        // Address
        addressTh: '',
        provinceTh: '',
        postalCode: '',
        districtTh: '',
        subdistrictTh: '',
        // Details
        genderTh: '',
        bloodGroup: '',
        birthDate: '',
        phone: '',
        customerType: 'บุคคลธรรมดา',
        email: '',
        notes: '',
        age: '',
      };
    }
    return {
      hn: initial.hn || '',
      status: initial.status || 'ใช้งาน',
      // Name
      prefixTh: initial.name?.prefixTh || '',
      firstNameTh: initial.name?.firstTh || '',
      lastNameTh: initial.name?.lastTh || '',
      nickname: initial.name?.nickname || '',
      // Address
      addressTh: initial.address?.addressTh || '',
      provinceTh: initial.address?.provinceTh || '',
      postalCode: initial.address?.postalCode || '',
      districtTh: initial.address?.districtTh || '',
      subdistrictTh: initial.address?.subdistrictTh || '',
      // Details
      genderTh: initial.details?.genderTh || '',
      bloodGroup: initial.details?.bloodGroup || '',
      birthDate: initial.details?.birthDate || '',
      phone: initial.details?.phone || '',
      customerType:
        initial.details?.customerType || initial.customerType || 'บุคคลธรรมดา',
      email: initial.details?.email || '',
      notes: initial.details?.notes || '',
      age: initial.details?.age || '',
    };
  };

  const [form, setForm] = useState(makeInitial);
  const isInactive = form.status === 'ไม่ใช้งาน';

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
      if (prev && prev !== original) return original;
      return '';
    });
    if (photoInputRef.current) photoInputRef.current.value = '';
  };

  useEffect(() => {
    return () => {
      if (photoUrl?.startsWith?.('blob:')) URL.revokeObjectURL(photoUrl);
    };
  }, [photoUrl]);

  useEffect(() => {
    // Keep picker closed when customer form changes
    setPickerOpen(false);
  }, [form]);

  const requiredFields = useMemo(() => ['prefixTh', 'firstNameTh'], []);

  const [errors, setErrors] = useState({});

  // Load Thailand address database for cascading selects
  const [thDb, setThDb] = useState([]);
  useEffect(() => {
    let alive = true;
    fetch(
      'https://cdn.jsdelivr.net/npm/jquery.thailand.js@2.0.5/dist/database/db.json'
    )
      .then((r) => r.json())
      .then((data) => {
        if (!alive) return;
        setThDb(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        setThDb([]);
      });
    return () => {
      alive = false;
    };
  }, []);

  const provinces = useMemo(() => {
    if (!thDb.length) return [];
    const set = new Set();
    thDb.forEach((r) => set.add(r.province));
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'th'));
  }, [thDb]);

  const amphoes = useMemo(() => {
    if (!form.provinceTh) return [];
    const set = new Set();
    thDb.forEach((r) => {
      if (r.province === form.provinceTh) set.add(r.amphoe);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'th'));
  }, [thDb, form.provinceTh]);

  const districts = useMemo(() => {
    if (!form.provinceTh || !form.districtTh) return [];
    const set = new Set();
    thDb.forEach((r) => {
      if (r.province === form.provinceTh && r.amphoe === form.districtTh) {
        set.add(r.district);
      }
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'th'));
  }, [thDb, form.provinceTh, form.districtTh]);

  const zipcodeFor = (province, amphoe, district) => {
    const rec = thDb.find(
      (r) =>
        r.province === province &&
        r.amphoe === amphoe &&
        r.district === district
    );
    return rec?.zipcode || '';
  };

  const update = (field) => (e) => {
    const value = e.target.value;
    setForm((prev) => {
      return { ...prev, [field]: value };
    });
    if (errors[field]) setErrors((err) => ({ ...err, [field]: '' }));
  };

  const onProvinceSelect = (e) => {
    const value = e.target.value;
    setForm((prev) => ({
      ...prev,
      provinceTh: value,
      districtTh: '',
      subdistrictTh: '',
      postalCode: '',
    }));
    if (errors.provinceTh) setErrors((err) => ({ ...err, provinceTh: '' }));
  };

  const onDistrictSelect = (e) => {
    const value = e.target.value;
    setForm((prev) => ({
      ...prev,
      districtTh: value,
      subdistrictTh: '',
      postalCode: '',
    }));
    if (errors.districtTh) setErrors((err) => ({ ...err, districtTh: '' }));
  };

  const onSubdistrictSelect = (e) => {
    const value = e.target.value;
    const zip = zipcodeFor(form.provinceTh, form.districtTh, value);
    setForm((prev) => ({
      ...prev,
      subdistrictTh: value,
      postalCode: zip || prev.postalCode,
    }));
    if (errors.subdistrictTh)
      setErrors((err) => ({ ...err, subdistrictTh: '' }));
  };

  const validate = () => {
    const next = {};
    requiredFields.forEach((key) => {
      if (!String(form[key] || '').trim()) next[key] = 'กรุณากรอกข้อมูล';
    });
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = 'อีเมลไม่ถูกต้อง';
    }
    if (form.postalCode && !/^\d{5}$/.test(form.postalCode)) {
      next.postalCode = 'กรุณากรอกรหัสไปรษณีย์ 5 หลัก';
    }
    return next;
  };

  const submit = (e) => {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const payload = {
      hn: form.hn,
      status: form.status || 'ใช้งาน',
      photoUrl: photoUrl || '',
      name: {
        prefixTh: form.prefixTh,
        firstTh: form.firstNameTh,
        lastTh: form.lastNameTh,
        nickname: form.nickname,
      },
      address: {
        addressTh: form.addressTh,
        provinceTh: form.provinceTh,
        postalCode: form.postalCode,
        districtTh: form.districtTh,
        subdistrictTh: form.subdistrictTh,
      },
      details: {
        genderTh: form.genderTh,
        bloodGroup: form.bloodGroup,
        age: form.age,
        birthDate: form.birthDate,
        phone: form.phone,
        customerType: form.customerType || 'บุคคลธรรมดา',
        email: form.email,
        notes: form.notes,
      },
    };

    onSave?.(payload);
  };

  // removed mock filler

  const Field = ({ label, htmlFor, required, error, children }) => (
    <div style={{ display: 'contents' }}>
      <label htmlFor={htmlFor}>
        {label}{' '}
        {required ? (
          <span aria-hidden="true" style={{ color: 'crimson' }}>
            *
          </span>
        ) : null}
      </label>
      <div>
        {children}
        {error ? (
          <div role="alert" className="field-error">
            {error}
          </div>
        ) : null}
      </div>
    </div>
  );

  return (
    <section>
      <div className="page-sticky-header">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
          }}
        >
          <h1 className="page-title" style={{ margin: 0 }}>
            {title || 'สร้างรายชื่อลูกค้าใหม่'}
          </h1>
        </div>
      </div>
      <form
        onSubmit={submit}
        className="form-card"
        style={{
          display: 'grid',
          gap: '1rem',
          position: 'relative',
          ...(initial ? { paddingTop: '2.25rem' } : null),
        }}
      >
        {initial ? (
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
            HN: {form.hn || '-'}
          </span>
        ) : null}
        <fieldset
          disabled={isInactive}
          style={{ border: 0, margin: 0, padding: 0 }}
        >
          {/* Name */}
          <div className="form-section">
            <h3 className="form-section__title">ชื่อ</h3>
            <div className="form-grid">
              <Field label="คำนำหน้า" htmlFor="cc-prefix-th" required>
                <input
                  id="cc-prefix-th"
                  value={form.prefixTh}
                  onChange={update('prefixTh')}
                  className="input"
                />
                {errors.prefixTh ? (
                  <div role="alert" className="field-error">
                    {errors.prefixTh}
                  </div>
                ) : null}
              </Field>

              <Field label="ชื่อ" htmlFor="cc-first-th" required>
                <input
                  id="cc-first-th"
                  value={form.firstNameTh}
                  onChange={update('firstNameTh')}
                  className="input"
                />
                {errors.firstNameTh ? (
                  <div role="alert" className="field-error">
                    {errors.firstNameTh}
                  </div>
                ) : null}
              </Field>

              <Field label="นามสกุล" htmlFor="cc-last-th">
                <input
                  id="cc-last-th"
                  value={form.lastNameTh}
                  onChange={update('lastNameTh')}
                  className="input"
                />
                {errors.lastNameTh ? (
                  <div role="alert" className="field-error">
                    {errors.lastNameTh}
                  </div>
                ) : null}
              </Field>

              <Field
                label="ชื่อเล่น/ผู้แนะนำ"
                htmlFor="cc-nickname"
                error={errors.nickname}
              >
                <input
                  id="cc-nickname"
                  value={form.nickname}
                  onChange={update('nickname')}
                  className="input"
                />
              </Field>
            </div>
          </div>

          {/* Address */}
          <div className="form-section">
            <h3 className="form-section__title">ที่อยู่</h3>
            <div className="form-grid">
              <Field label="ที่อยู่" htmlFor="cc-addr-th">
                <textarea
                  id="cc-addr-th"
                  value={form.addressTh}
                  onChange={update('addressTh')}
                  rows={2}
                  className="textarea"
                />
                {errors.addressTh ? (
                  <div role="alert" className="field-error">
                    {errors.addressTh}
                  </div>
                ) : null}
              </Field>

              <Field label="จังหวัด" htmlFor="cc-province-th">
                <select
                  id="cc-province-th"
                  value={form.provinceTh}
                  onChange={onProvinceSelect}
                  className="select"
                >
                  <option value="">-- เลือกจังหวัด --</option>
                  {provinces.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
                {errors.provinceTh ? (
                  <div role="alert" className="field-error">
                    {errors.provinceTh}
                  </div>
                ) : null}
              </Field>

              <Field
                label="รหัสไปรษณีย์"
                htmlFor="cc-postal"
                error={errors.postalCode}
              >
                <div className="input-with-icon">
                  <span className="input-icon" aria-hidden>
                    <svg
                      viewBox="0 0 24 24"
                      width="16"
                      height="16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect
                        x="3"
                        y="5"
                        width="18"
                        height="14"
                        rx="2"
                        ry="2"
                      ></rect>
                      <polyline points="3,7 12,13 21,7"></polyline>
                    </svg>
                  </span>
                  <input
                    id="cc-postal"
                    value={form.postalCode}
                    onChange={update('postalCode')}
                    className="input"
                    placeholder="เช่น 10110"
                    readOnly
                  />
                </div>
              </Field>

              <Field label="อำเภอ" htmlFor="cc-district-th">
                <select
                  id="cc-district-th"
                  value={form.districtTh}
                  onChange={onDistrictSelect}
                  className="select"
                  disabled={!form.provinceTh}
                >
                  <option value="">-- เลือกอำเภอ --</option>
                  {amphoes.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
                {errors.districtTh ? (
                  <div role="alert" className="field-error">
                    {errors.districtTh}
                  </div>
                ) : null}
              </Field>

              <Field label="ตำบล" htmlFor="cc-subdistrict-th">
                <select
                  id="cc-subdistrict-th"
                  value={form.subdistrictTh}
                  onChange={onSubdistrictSelect}
                  className="select"
                  disabled={!form.provinceTh || !form.districtTh}
                >
                  <option value="">-- เลือกตำบล --</option>
                  {districts.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                {errors.subdistrictTh ? (
                  <div role="alert" className="field-error">
                    {errors.subdistrictTh}
                  </div>
                ) : null}
              </Field>
            </div>
          </div>

          {/* Details */}
          <div className="form-section">
            <h3 className="form-section__title">รายละเอียด</h3>
            <div className="form-grid">
              <Field label="เพศ" htmlFor="cc-gender-th">
                <input
                  id="cc-gender-th"
                  value={form.genderTh}
                  onChange={update('genderTh')}
                  className="input"
                />
                {errors.genderTh ? (
                  <div role="alert" className="field-error">
                    {errors.genderTh}
                  </div>
                ) : null}
              </Field>

              <Field label="กรุ๊ปเลือด / อายุ" htmlFor="cc-blood">
                <div className="inline-pair">
                  <div>
                    <select
                      id="cc-blood"
                      value={form.bloodGroup}
                      onChange={update('bloodGroup')}
                      className="select"
                    >
                      <option value="">-- เลือก --</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                  <div>
                    <input
                      id="cc-age"
                      type="number"
                      min="0"
                      max="120"
                      value={form.age}
                      onChange={update('age')}
                      className="input"
                      placeholder="อายุ (ปี)"
                    />
                  </div>
                </div>
              </Field>
              <Field label="วันเกิด" htmlFor="cc-birth">
                <input
                  id="cc-birth"
                  type="date"
                  value={form.birthDate}
                  onChange={update('birthDate')}
                  className="input"
                />
              </Field>

              <Field
                label="เบอร์ติดต่อ"
                htmlFor="cc-phone"
                error={errors.phone}
              >
                <input
                  id="cc-phone"
                  value={form.phone}
                  onChange={update('phone')}
                  className="input"
                />
              </Field>

              <Field label="ประเภทลูกค้า" htmlFor="cc-customer-type">
                <select
                  id="cc-customer-type"
                  value={form.customerType}
                  onChange={update('customerType')}
                  className="select"
                >
                  <option value="บุคคลธรรมดา">บุคคลธรรมดา</option>
                  <option value="นิติบุคคล">นิติบุคคล</option>
                </select>
              </Field>
              <Field label="อีเมล" htmlFor="cc-email" error={errors.email}>
                <input
                  id="cc-email"
                  value={form.email}
                  onChange={update('email')}
                  className="input"
                />
              </Field>

              <Field label="หมายเหตุ" htmlFor="cc-notes">
                <textarea
                  id="cc-notes"
                  value={form.notes}
                  onChange={update('notes')}
                  rows={2}
                  className="textarea"
                />
              </Field>

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
                    <span className="photo-box__placeholder">
                      ยังไม่มีรูปภาพ
                    </span>
                  )}
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
          </div>
        </fieldset>

        <div className="form-actions" style={{ alignItems: 'center' }}>
          {initial ? (
            <label
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
            >
              <span style={{ fontWeight: 600, color: '#158990' }}>
                สถานะลูกค้า
              </span>
              <select
                value={form.status}
                onChange={(e) =>
                  setForm((f) => ({ ...f, status: e.target.value }))
                }
                className="select"
                aria-label="สถานะลูกค้า"
              >
                <option value="ใช้งาน">ใช้งาน</option>
                <option value="ไม่ใช้งาน">ไม่ใช้งาน</option>
              </select>
            </label>
          ) : null}
          {initial ? (
            <button
              type="button"
              className="button"
              onClick={() => setCondOpen(true)}
              disabled={isInactive}
            >
              กำหนดเงื่อนไขลูกค้า
            </button>
          ) : null}
          <button type="button" className="button" onClick={onCancel}>
            ยกเลิก
          </button>
          <button type="submit" className="button">
            บันทึก
          </button>
        </div>
        {condOpen && (
          <div className="modal-overlay" onClick={() => setCondOpen(false)}>
            <div
              className="modal"
              role="dialog"
              aria-modal="true"
              aria-label="กำหนดเงื่อนไขลูกค้า"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>กำหนดเงื่อนไขลูกค้า</h3>
              </div>
              <div className="modal-body">
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  <div
                    className="inline-pair"
                    style={{ gridTemplateColumns: '1fr 1fr' }}
                  >
                    <label>
                      กลุ่มลูกค้า
                      <select
                        value={cond.segment}
                        onChange={(e) =>
                          setCond((c) => ({ ...c, segment: e.target.value }))
                        }
                        className="select"
                      >
                        <option value="">-- เลือก --</option>
                        <option value="ลูกค้าไม่ประจำ">ลูกค้าไม่ประจำ</option>
                        <option value="ลูกค้าประจำ">ลูกค้าประจำ</option>
                        <option value="ลูกค้าพิเศษ">ลูกค้าพิเศษ</option>
                        <option value="ลูกค้า VIP">ลูกค้า VIP</option>
                      </select>
                    </label>
                    <label>
                      ส่วนลดลูกค้า (%)
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="any"
                        value={cond.discount}
                        onChange={(e) =>
                          setCond((c) => ({ ...c, discount: e.target.value }))
                        }
                        className="input"
                        placeholder="เช่น 10"
                        inputMode="decimal"
                      />
                    </label>
                  </div>
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '0.25rem',
                        gap: '0.75rem',
                      }}
                    >
                      <label
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={useAddName}
                          onChange={(e) => {
                            const next = e.target.checked;
                            setUseAddName(next);
                            if (
                              next &&
                              (!segmentLines.length ||
                                segmentLines.every((s) => !String(s).trim()))
                            ) {
                              setSegmentLines(['']);
                            }
                          }}
                        />
                        เพิ่มรายชื่อ
                      </label>
                    </div>

                    <div style={{ display: 'grid', gap: '0.5rem' }}>
                      {segmentLines.map((line, idx) => {
                        const canAdd = useAddName && segmentLines.length < 5;
                        const showAdd = idx === 0 || (idx >= 1 && idx <= 3);
                        const showDelete = idx >= 1;
                        const addDisabled = !canAdd;
                        const deleteDisabled = !useAddName;

                        return (
                          <div
                            key={idx}
                            className="inline-pair"
                            style={{
                              gridTemplateColumns: '1fr max-content',
                              alignItems: 'center',
                            }}
                          >
                            <div
                              className="input-with-icon"
                              style={{ flex: 1, minWidth: 0, maxWidth: 420 }}
                            >
                              <input
                                value={line}
                                onChange={(e) => {
                                  const v = e.target.value;
                                  setSegmentLines((prev) =>
                                    prev.map((s, i) => (i === idx ? v : s))
                                  );
                                }}
                                className="input"
                                placeholder={`ระบุรายชื่อบรรทัดที่ ${idx + 1}`}
                                disabled={!useAddName}
                                onClick={() => {
                                  if (!useAddName) return;
                                  setPickerLineIndex(idx);
                                  setPickerOpen(true);
                                }}
                              />
                            </div>

                            <div
                              style={{
                                display: 'inline-flex',
                                flexDirection: 'row',
                                flexWrap: 'nowrap',
                                gap: 8,
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {showAdd ? (
                                <button
                                  type="button"
                                  className="button"
                                  style={{
                                    flex: '0 0 auto',
                                    whiteSpace: 'nowrap',
                                  }}
                                  aria-label="เพิ่มบรรทัด"
                                  disabled={addDisabled}
                                  onClick={() => {
                                    if (!canAdd) return;
                                    setSegmentLines((prev) => {
                                      const next = [...prev];
                                      next.splice(idx + 1, 0, '');
                                      return next.slice(0, 5);
                                    });
                                  }}
                                >
                                  <span
                                    aria-hidden
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: 4,
                                    }}
                                  >
                                    <svg
                                      viewBox="0 0 24 24"
                                      width="16"
                                      height="16"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <path d="M12 5v14" />
                                      <path d="M5 12h14" />
                                    </svg>
                                    เพิ่ม
                                  </span>
                                </button>
                              ) : null}

                              {showDelete ? (
                                <button
                                  type="button"
                                  className="button button--danger"
                                  style={{
                                    flex: '0 0 auto',
                                    whiteSpace: 'nowrap',
                                  }}
                                  aria-label="ลบบรรทัด"
                                  disabled={deleteDisabled}
                                  onClick={() => {
                                    setSegmentLines((prev) => {
                                      const next = prev.filter(
                                        (_, i) => i !== idx
                                      );
                                      return next.length ? next : [''];
                                    });
                                  }}
                                >
                                  -ลบ
                                </button>
                              ) : null}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div
                    className="inline-pair"
                    style={{
                      gridTemplateColumns: '2fr auto',
                      alignItems: 'start',
                    }}
                  >
                    <div>
                      <label>
                        หมายเหตุเงื่อนไข
                        <textarea
                          value={cond.notes}
                          onChange={(e) =>
                            setCond((c) => ({ ...c, notes: e.target.value }))
                          }
                          rows={3}
                          className="textarea condition-notes"
                        />
                      </label>
                    </div>
                    <div></div>
                  </div>
                </div>
                {pickerOpen && (
                  <div
                    style={{
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      padding: '0.5rem',
                      background: '#fafafa',
                      margin: '0 20px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        gap: '0.5rem',
                        alignItems: 'center',
                        marginBottom: '0.5rem',
                      }}
                    >
                      <input
                        value={pickerQuery}
                        onChange={(e) => setPickerQuery(e.target.value)}
                        className="input"
                        placeholder="ค้นหาชื่อ"
                        aria-label="ค้นหาชื่อ"
                      />
                      <button
                        type="button"
                        className="button"
                        onClick={() => setPickerOpen(false)}
                      >
                        ปิด
                      </button>
                    </div>
                    <div style={{ maxHeight: 220, overflow: 'auto' }}>
                      {filteredHN.map((c) => (
                        <button
                          key={c.hn}
                          type="button"
                          style={{
                            display: 'block',
                            width: '100%',
                            textAlign: 'left',
                            padding: '0.4rem 0.5rem',
                            borderBottom: '1px solid #eee',
                          }}
                          onClick={() => {
                            setSegmentLines((prev) =>
                              prev.map((s, i) =>
                                i === pickerLineIndex ? composeThaiName(c) : s
                              )
                            );
                            setPickerOpen(false);
                          }}
                        >
                          <div style={{ fontWeight: 600 }}>
                            {composeThaiName(c)}
                          </div>
                          <div style={{ fontSize: '0.85em', color: '#6b7280' }}>
                            {composeThaiAddress(c)}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="button"
                  onClick={() => setCondOpen(false)}
                >
                  ยกเลิก
                </button>
                <button
                  type="button"
                  className="button"
                  onClick={() => {
                    onDefineConditions?.({ ...cond, customer: form });
                    setCondOpen(false);
                  }}
                >
                  บันทึกเงื่อนไข
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
    </section>
  );
}
