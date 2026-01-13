import { useEffect, useMemo, useRef, useState } from 'react';
import { MOCK_CUSTOMERS_FULL } from '../mocks/customersFull';

export default function CreateCustomer({
  onCancel,
  onSave,
  initial,
  title,
  onDefineConditions,
  initialConditions,
}) {
  const [condOpen, setCondOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerQuery, setPickerQuery] = useState('');
  const [useCustomReceipt, setUseCustomReceipt] = useState(() =>
    Boolean(initialConditions?.receiptName || initialConditions?.receiptAddress)
  );
  const [cond, setCond] = useState(() => ({
    segment: initialConditions?.segment || '',
    discount: initialConditions?.discount ?? '',
    notes: initialConditions?.notes || '',
    receiptName: initialConditions?.receiptName || '',
    receiptAddress: initialConditions?.receiptAddress || '',
  }));

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
      return (
        (c.hn || '').toLowerCase().includes(q) ||
        thName.includes(q) ||
        enName.includes(q)
      );
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
        prefixEn: '',
        firstNameTh: '',
        firstNameEn: '',
        lastNameTh: '',
        lastNameEn: '',
        nickname: '',
        // Address
        addressTh: '',
        addressEn: '',
        provinceTh: '',
        provinceEn: '',
        postalCode: '',
        districtTh: '',
        districtEn: '',
        subdistrictTh: '',
        subdistrictEn: '',
        // Details
        genderTh: '',
        genderEn: '',
        bloodGroup: '',
        birthDate: '',
        phone: '',
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
      prefixEn: initial.name?.prefixEn || '',
      firstNameTh: initial.name?.firstTh || '',
      firstNameEn: initial.name?.firstEn || '',
      lastNameTh: initial.name?.lastTh || '',
      lastNameEn: initial.name?.lastEn || '',
      nickname: initial.name?.nickname || '',
      // Address
      addressTh: initial.address?.addressTh || '',
      addressEn: initial.address?.addressEn || '',
      provinceTh: initial.address?.provinceTh || '',
      provinceEn: initial.address?.provinceEn || '',
      postalCode: initial.address?.postalCode || '',
      districtTh: initial.address?.districtTh || '',
      districtEn: initial.address?.districtEn || '',
      subdistrictTh: initial.address?.subdistrictTh || '',
      subdistrictEn: initial.address?.subdistrictEn || '',
      // Details
      genderTh: initial.details?.genderTh || '',
      genderEn: initial.details?.genderEn || '',
      bloodGroup: initial.details?.bloodGroup || '',
      birthDate: initial.details?.birthDate || '',
      phone: initial.details?.phone || '',
      email: initial.details?.email || '',
      notes: initial.details?.notes || '',
      age: initial.details?.age || '',
    };
  };

  const [form, setForm] = useState(makeInitial);
  const isInactive = form.status === 'ไม่ใช้งาน';

  // When not using custom receipt info, keep name/address in sync with the customer's form.
  useEffect(() => {
    if (!useCustomReceipt) {
      const name = [form.prefixTh, form.firstNameTh, form.lastNameTh]
        .filter(Boolean)
        .join(' ');
      const addr = [
        form.addressTh,
        form.subdistrictTh,
        form.districtTh,
        form.provinceTh,
        form.postalCode,
      ]
        .filter(Boolean)
        .join(' ');
      setCond((prev) => ({
        ...prev,
        receiptName: name,
        receiptAddress: addr,
      }));
      setPickerOpen(false);
    }
  }, [useCustomReceipt, form]);

  const requiredFields = useMemo(
    () => [
      'prefixTh',
      'prefixEn',
      'firstNameTh',
      'firstNameEn',
      'lastNameTh',
      'lastNameEn',
      'addressTh',
      'addressEn',
      'provinceTh',
      'provinceEn',
      'postalCode',
      'districtTh',
      'districtEn',
      'subdistrictTh',
      'subdistrictEn',
      'genderTh',
      'genderEn',
      'phone',
    ],
    []
  );

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
      const next = { ...prev, [field]: value };
      if (field === 'provinceTh' && !prev.provinceEn) next.provinceEn = value;
      if (field === 'districtTh' && !prev.districtEn) next.districtEn = value;
      if (field === 'subdistrictTh' && !prev.subdistrictEn)
        next.subdistrictEn = value;
      return next;
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
      ...(prev.provinceEn ? {} : { provinceEn: value }),
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
      ...(prev.districtEn ? {} : { districtEn: value }),
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
      ...(prev.subdistrictEn ? {} : { subdistrictEn: value }),
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
      name: {
        prefixTh: form.prefixTh,
        prefixEn: form.prefixEn,
        firstTh: form.firstNameTh,
        firstEn: form.firstNameEn,
        lastTh: form.lastNameTh,
        lastEn: form.lastNameEn,
        nickname: form.nickname,
      },
      address: {
        addressTh: form.addressTh,
        addressEn: form.addressEn,
        provinceTh: form.provinceTh,
        provinceEn: form.provinceEn,
        postalCode: form.postalCode,
        districtTh: form.districtTh,
        districtEn: form.districtEn,
        subdistrictTh: form.subdistrictTh,
        subdistrictEn: form.subdistrictEn,
      },
      details: {
        genderTh: form.genderTh,
        genderEn: form.genderEn,
        bloodGroup: form.bloodGroup,
        age: form.age,
        birthDate: form.birthDate,
        phone: form.phone,
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
        <h1 className="page-title">{title || 'สร้างรายชื่อลูกค้าใหม่'}</h1>
      </div>
      <form
        onSubmit={submit}
        className="form-card"
        style={{ display: 'grid', gap: '1rem' }}
      >
        <fieldset
          disabled={isInactive}
          style={{ border: 0, margin: 0, padding: 0 }}
        >
          {/* HN */}
          <div className="form-grid">
            <Field label="HN" htmlFor="cc-hn" error={errors.hn}>
              <input
                id="cc-hn"
                value={form.hn}
                onChange={update('hn')}
                className="input"
                readOnly
              />
            </Field>
          </div>

          {/* Name */}
          <div className="form-section">
            <h3 className="form-section__title">ชื่อ / Name</h3>
            <div className="form-grid">
              <Field label="คำนำหน้า TH / ENG" htmlFor="cc-prefix-th" required>
                <div className="inline-pair">
                  <div>
                    <span className="sub-label">TH</span>
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
                  </div>
                  <div>
                    <span className="sub-label">ENG</span>
                    <input
                      id="cc-prefix-en"
                      value={form.prefixEn}
                      onChange={update('prefixEn')}
                      className="input"
                    />
                    {errors.prefixEn ? (
                      <div role="alert" className="field-error">
                        {errors.prefixEn}
                      </div>
                    ) : null}
                  </div>
                </div>
              </Field>

              <Field label="ชื่อ TH / ENG" htmlFor="cc-first-th" required>
                <div className="inline-pair">
                  <div>
                    <span className="sub-label">TH</span>
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
                  </div>
                  <div>
                    <span className="sub-label">ENG</span>
                    <input
                      id="cc-first-en"
                      value={form.firstNameEn}
                      onChange={update('firstNameEn')}
                      className="input"
                    />
                    {errors.firstNameEn ? (
                      <div role="alert" className="field-error">
                        {errors.firstNameEn}
                      </div>
                    ) : null}
                  </div>
                </div>
              </Field>

              <Field label="นามสกุล TH / ENG" htmlFor="cc-last-th" required>
                <div className="inline-pair">
                  <div>
                    <span className="sub-label">TH</span>
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
                  </div>
                  <div>
                    <span className="sub-label">ENG</span>
                    <input
                      id="cc-last-en"
                      value={form.lastNameEn}
                      onChange={update('lastNameEn')}
                      className="input"
                    />
                    {errors.lastNameEn ? (
                      <div role="alert" className="field-error">
                        {errors.lastNameEn}
                      </div>
                    ) : null}
                  </div>
                </div>
              </Field>

              <Field
                label="ชื่อเล่น"
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
            <h3 className="form-section__title">ที่อยู่ / Address</h3>
            <div className="form-grid">
              <Field label="ที่อยู่ TH / ENG" htmlFor="cc-addr-th" required>
                <div className="inline-pair">
                  <div>
                    <span className="sub-label">TH</span>
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
                  </div>
                  <div>
                    <span className="sub-label">ENG</span>
                    <textarea
                      id="cc-addr-en"
                      value={form.addressEn}
                      onChange={update('addressEn')}
                      rows={2}
                      className="textarea"
                    />
                    {errors.addressEn ? (
                      <div role="alert" className="field-error">
                        {errors.addressEn}
                      </div>
                    ) : null}
                  </div>
                </div>
              </Field>

              <Field label="จังหวัด TH / ENG" htmlFor="cc-province-th" required>
                <div className="inline-pair">
                  <div>
                    <span className="sub-label">TH</span>
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
                  </div>
                  <div>
                    <span className="sub-label">ENG</span>
                    <input
                      id="cc-province-en"
                      value={form.provinceEn}
                      onChange={update('provinceEn')}
                      className="input"
                      placeholder="Province"
                    />
                    {errors.provinceEn ? (
                      <div role="alert" className="field-error">
                        {errors.provinceEn}
                      </div>
                    ) : null}
                  </div>
                </div>
              </Field>

              <Field
                label="รหัสไปรษณีย์"
                htmlFor="cc-postal"
                required
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

              <Field label="อำเภอ TH / ENG" htmlFor="cc-district-th" required>
                <div className="inline-pair">
                  <div>
                    <span className="sub-label">TH</span>
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
                  </div>
                  <div>
                    <span className="sub-label">ENG</span>
                    <input
                      id="cc-district-en"
                      value={form.districtEn}
                      onChange={update('districtEn')}
                      className="input"
                      placeholder="District"
                    />
                    {errors.districtEn ? (
                      <div role="alert" className="field-error">
                        {errors.districtEn}
                      </div>
                    ) : null}
                  </div>
                </div>
              </Field>

              <Field label="ตำบล TH / ENG" htmlFor="cc-subdistrict-th" required>
                <div className="inline-pair">
                  <div>
                    <span className="sub-label">TH</span>
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
                  </div>
                  <div>
                    <span className="sub-label">ENG</span>
                    <input
                      id="cc-subdistrict-en"
                      value={form.subdistrictEn}
                      onChange={update('subdistrictEn')}
                      className="input"
                      placeholder="Subdistrict"
                    />
                    {errors.subdistrictEn ? (
                      <div role="alert" className="field-error">
                        {errors.subdistrictEn}
                      </div>
                    ) : null}
                  </div>
                </div>
              </Field>
            </div>
          </div>

          {/* Details */}
          <div className="form-section">
            <h3 className="form-section__title">รายละเอียด / Description</h3>
            <div className="form-grid">
              <Field label="เพศ TH / ENG" htmlFor="cc-gender-th" required>
                <div className="inline-pair">
                  <div>
                    <span className="sub-label">TH</span>
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
                  </div>
                  <div>
                    <span className="sub-label">ENG</span>
                    <input
                      id="cc-gender-en"
                      value={form.genderEn}
                      onChange={update('genderEn')}
                      className="input"
                    />
                    {errors.genderEn ? (
                      <div role="alert" className="field-error">
                        {errors.genderEn}
                      </div>
                    ) : null}
                  </div>
                </div>
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
                required
                error={errors.phone}
              >
                <input
                  id="cc-phone"
                  value={form.phone}
                  onChange={update('phone')}
                  className="input"
                />
              </Field>
              <Field label="Email" htmlFor="cc-email" error={errors.email}>
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
                        <option value="ลูกค้าทั่วไป">ลูกค้าทั่วไป</option>
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
                        step="1"
                        value={cond.discount}
                        onChange={(e) =>
                          setCond((c) => ({ ...c, discount: e.target.value }))
                        }
                        className="input"
                        placeholder="เช่น 10"
                      />
                    </label>
                  </div>
                  <label>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '0.25rem',
                      }}
                    >
                      <span>ชื่อบนใบเสร็จ</span>
                    </div>
                    <div
                      className="inline-pair"
                      style={{
                        gridTemplateColumns: '2fr auto',
                        alignItems: 'center',
                      }}
                    >
                      <div className="input-with-icon" style={{ flex: 1 }}>
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
                            <path d="M21 21l-4.35-4.35" />
                            <circle cx="10" cy="10" r="7" />
                          </svg>
                        </span>
                        <input
                          value={cond.receiptName}
                          onChange={(e) =>
                            setCond((c) => ({
                              ...c,
                              receiptName: e.target.value,
                            }))
                          }
                          className="input"
                          placeholder="ระบุชื่อที่ต้องการพิมพ์ในใบเสร็จ"
                          disabled={!useCustomReceipt}
                        />
                      </div>
                      <button
                        type="button"
                        className="button"
                        onClick={() => setPickerOpen(true)}
                        aria-label="เลือกรายชื่อจาก HN"
                        disabled={!useCustomReceipt}
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
                            <path d="M21 21l-4.35-4.35" />
                            <circle cx="10" cy="10" r="7" />
                          </svg>
                          เลือกจาก HN
                        </span>
                      </button>
                    </div>
                  </label>
                  <div
                    className="inline-pair"
                    style={{
                      gridTemplateColumns: '2fr auto',
                      alignItems: 'start',
                    }}
                  >
                    <div>
                      <label>
                        ที่อยู่บนใบเสร็จ
                        <textarea
                          value={cond.receiptAddress}
                          onChange={(e) =>
                            setCond((c) => ({
                              ...c,
                              receiptAddress: e.target.value,
                            }))
                          }
                          rows={3}
                          className="textarea receipt-address"
                          placeholder="ระบุที่อยู่สำหรับใบเสร็จ"
                          disabled={!useCustomReceipt}
                        />
                      </label>
                    </div>
                    <div></div>
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
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginTop: '0.5rem',
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
                      checked={useCustomReceipt}
                      onChange={(e) => setUseCustomReceipt(e.target.checked)}
                    />
                    ใช้ชื่ออื่นบนใบเสร็จ
                  </label>
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
                        placeholder="ค้นหา HN หรือชื่อ"
                        aria-label="ค้นหา HN หรือชื่อ"
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
                            display: 'grid',
                            gridTemplateColumns: '100px 1fr',
                            gap: '0.5rem',
                            width: '100%',
                            textAlign: 'left',
                            padding: '0.4rem 0.5rem',
                            borderBottom: '1px solid #eee',
                          }}
                          onClick={() => {
                            setCond((prev) => ({
                              ...prev,
                              receiptName: composeThaiName(c),
                              receiptAddress: composeThaiAddress(c),
                            }));
                            setPickerOpen(false);
                          }}
                        >
                          <span style={{ fontWeight: 600 }}>{c.hn}</span>
                          <span>
                            {composeThaiName(c)}
                            <div
                              style={{ fontSize: '0.85em', color: '#6b7280' }}
                            >
                              {composeThaiAddress(c)}
                            </div>
                          </span>
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
