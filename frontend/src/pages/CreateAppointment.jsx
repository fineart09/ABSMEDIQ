import { useState } from 'react';

export default function CreateAppointment({ onSubmit }) {
  const [form, setForm] = useState({
    patient: '',
    date: '',
    time: '',
    service: '',
    provider: '',
    notes: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const validate = () => {
    const err = {};
    if (!form.patient.trim()) err.patient = 'กรุณาใส่ชื่อลูกค้า';
    if (!form.date) err.date = 'กรุณาเลือกวันที่';
    if (!form.time) err.time = 'กรุณาเลือกเวลา';
    if (!form.service.trim()) err.service = 'กรุณาเลือกบริการ';
    return err;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = validate();
    setErrors(err);
    if (Object.keys(err).length === 0) {
      // call parent or fallback to console
      if (typeof onSubmit === 'function') onSubmit(form);
      else console.log('CreateAppointment submit', form);
      // reset form
      setForm({
        patient: '',
        date: '',
        time: '',
        service: '',
        provider: '',
        notes: '',
      });
    }
  };

  return (
    <section className="create-appointment">
      <h1>สร้างนัดหมาย</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <label>
            ชื่อลูกค้า
            <input
              name="patient"
              value={form.patient}
              onChange={handleChange}
            />
          </label>
          {errors.patient && <div className="error">{errors.patient}</div>}
        </div>

        <div className="form-row">
          <label>
            วันที่
            <input
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
            />
          </label>
          {errors.date && <div className="error">{errors.date}</div>}
        </div>

        <div className="form-row">
          <label>
            เวลา
            <input
              name="time"
              type="time"
              value={form.time}
              onChange={handleChange}
            />
          </label>
          {errors.time && <div className="error">{errors.time}</div>}
        </div>

        <div className="form-row">
          <label>
            บริการ
            <input
              name="service"
              value={form.service}
              onChange={handleChange}
              placeholder="เช่น ตรวจทั่วไป"
            />
          </label>
          {errors.service && <div className="error">{errors.service}</div>}
        </div>

        <div className="form-row">
          <label>
            ผู้ให้บริการ
            <input
              name="provider"
              value={form.provider}
              onChange={handleChange}
              placeholder="ชือผู้ให้บริการ"
            />
          </label>
        </div>

        <div className="form-row">
          <label>
            หมายเหตุ
            <textarea name="notes" value={form.notes} onChange={handleChange} />
          </label>
        </div>

        <div className="form-actions">
          <button type="submit" className="button primary">
            บันทึกนัดหมาย
          </button>
        </div>
      </form>
    </section>
  );
}
