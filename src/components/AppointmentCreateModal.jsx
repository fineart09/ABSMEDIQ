import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import ENRICHED_CUSTOMERS from '../mocks/customersFull';

const displayName = (c) => {
  const thPrefix = c?.name?.prefixTh || '';
  const thFirst = c?.name?.firstTh || '';
  const thLast = c?.name?.lastTh || '';
  const enFirst = c?.name?.firstEn || '';
  const enLast = c?.name?.lastEn || '';
  const nick = c?.name?.nickname || '';
  if (thPrefix || thFirst || thLast)
    return `${thPrefix} ${thFirst} ${thLast}`.trim().replace(/\s+/g, ' ');
  if (enFirst || enLast) return `${enFirst} ${enLast}`.trim();
  if (nick) return nick;
  return 'ไม่ระบุ';
};

export default function AppointmentCreateModal({
  open,
  onClose,
  onSubmit,
  onDelete,
  mode = 'create',
  initialAppointment = null,
}) {
  const inputRef = useRef(null);
  const inputWrapRef = useRef(null);
  const modalBodyRef = useRef(null);

  const [query, setQuery] = useState('');
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [pickerPos, setPickerPos] = useState(null);

  const [date, setDate] = useState('');
  const [timeStart, setTimeStart] = useState('');
  const [timeEnd, setTimeEnd] = useState('');
  const [subject, setSubject] = useState('');
  const [details, setDetails] = useState('');
  const [errors, setErrors] = useState({});

  const customers = useMemo(() => {
    const src = Array.isArray(ENRICHED_CUSTOMERS) ? ENRICHED_CUSTOMERS : [];
    return src
      .map((c) => ({
        hn: c?.hn || '',
        name: displayName(c),
        phone: c?.details?.phone || '',
        segment: c?.segment || c?.conditions?.segment || c?.cond?.segment || '',
        status: c?.status || 'ใช้งาน',
      }))
      .filter((c) => String(c.status || '').trim() === 'ใช้งาน');
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return customers.filter((c) => {
      return (
        String(c.hn).toLowerCase().includes(q) ||
        String(c.name).toLowerCase().includes(q) ||
        String(c.phone).toLowerCase().includes(q) ||
        String(c.segment || '')
          .toLowerCase()
          .includes(q) ||
        String(c.status || '')
          .toLowerCase()
          .includes(q)
      );
    });
  }, [query, customers]);

  const visibleResults = useMemo(() => {
    const max = Math.min(5, Math.max(1, Number(pickerPos?.limit) || 5));
    return filtered.slice(0, max);
  }, [filtered, pickerPos?.limit]);

  const hasQuery = query.trim().length > 0;
  const showPicker = pickerOpen && hasQuery;

  const isEditMode = mode === 'edit';

  useEffect(() => {
    if (!open) return;

    const appt =
      initialAppointment && typeof initialAppointment === 'object'
        ? initialAppointment
        : null;

    if (mode === 'edit' && appt) {
      const hn = String(appt?.customerHn || appt?.customer?.hn || '').trim();
      const name = String(
        appt?.customerName || appt?.customer?.name || appt?.patient || ''
      ).trim();
      const phone = String(
        appt?.customerPhone || appt?.customer?.phone || ''
      ).trim();
      const segment = String(
        appt?.customerSegment || appt?.customer?.segment || ''
      ).trim();
      const status = String(
        appt?.customerStatus || appt?.customer?.status || 'ใช้งาน'
      ).trim();

      const matched = hn
        ? customers.find((c) => String(c?.hn || '').trim() === hn)
        : null;
      const selected =
        matched ||
        (name || hn
          ? {
              hn,
              name: name || '-',
              phone,
              segment,
              status: status || 'ใช้งาน',
            }
          : null);

      setSelectedCustomer(selected);
      setQuery(`${hn} ${name}`.trim());
      setPickerOpen(false);
      setDate(String(appt?.date || '').trim());
      setTimeStart(String(appt?.timeStart || appt?.time || '').trim());
      setTimeEnd(String(appt?.timeEnd || '').trim());

      const rawService = String(appt?.service || '').trim();
      setSubject(rawService === 'นัดหมาย' ? '' : rawService);

      const rawDetails = String(appt?.details || '').trim();
      setDetails(rawDetails);
      setErrors({});
    } else {
      setQuery('');
      setPickerOpen(false);
      setSelectedCustomer(null);
      setDate('');
      setTimeStart('');
      setTimeEnd('');
      setSubject('');
      setDetails('');
      setErrors({});
    }

    // Defer focus so the input exists in DOM.
    const t = window.setTimeout(() => inputRef.current?.focus?.(), 0);
    return () => window.clearTimeout(t);
  }, [open, mode, initialAppointment, customers]);

  useEffect(() => {
    if (!open || !showPicker) {
      setPickerPos(null);
      return;
    }

    const MAX_RESULTS = 5;
    const ITEM_HEIGHT_PX = 38; // compact row height target
    const MENU_CHROME_PX = 16; // padding + border + small buffer
    const GAP_PX = 4; // dropdown gap between items

    const update = () => {
      const el = inputWrapRef.current || inputRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const viewportPadding = 8;
      const width = Math.max(260, rect.width);
      const left = Math.min(
        Math.max(viewportPadding, rect.left),
        window.innerWidth - width - viewportPadding
      );

      const spaceBelow =
        window.innerHeight - viewportPadding - (rect.bottom + 4);
      const spaceAbove = rect.top - viewportPadding - 4;

      const perRow = ITEM_HEIGHT_PX + GAP_PX;
      const maxBelow = Math.floor((spaceBelow - MENU_CHROME_PX) / perRow);
      const maxAbove = Math.floor((spaceAbove - MENU_CHROME_PX) / perRow);

      const belowLimit = Math.max(1, Math.min(MAX_RESULTS, maxBelow));
      const aboveLimit = Math.max(1, Math.min(MAX_RESULTS, maxAbove));

      const placeAbove = maxAbove > maxBelow;
      const limit = placeAbove ? aboveLimit : belowLimit;

      const menuHeight = Math.max(
        1,
        limit * ITEM_HEIGHT_PX +
          Math.max(0, limit - 1) * GAP_PX +
          MENU_CHROME_PX
      );

      const top = placeAbove
        ? Math.max(viewportPadding, rect.top - 4 - menuHeight)
        : Math.min(rect.bottom + 4, window.innerHeight - viewportPadding);

      setPickerPos({
        top,
        left,
        width,
        placement: placeAbove ? 'top' : 'bottom',
        limit,
      });
    };

    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    const bodyEl = modalBodyRef.current;
    if (bodyEl) bodyEl.addEventListener('scroll', update, { passive: true });

    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
      if (bodyEl) bodyEl.removeEventListener('scroll', update);
    };
  }, [open, showPicker]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose?.();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  const selectCustomer = (c) => {
    setSelectedCustomer(c);
    setQuery(`${c?.hn || ''} ${c?.name || ''}`.trim());
    setPickerOpen(false);
    setErrors({});
  };

  const validate = () => {
    const next = {};
    if (!selectedCustomer) next.customer = 'กรุณาเลือกลูกค้า';
    if (!date) next.date = 'กรุณาเลือกวันที่';
    if (!timeStart) next.timeStart = 'กรุณาเลือกเวลาเริ่ม';
    if (!timeEnd) next.timeEnd = 'กรุณาเลือกเวลาสิ้นสุด';
    if (timeStart && timeEnd && timeStart >= timeEnd)
      next.timeEnd = 'เวลาสิ้นสุดต้องมากกว่าเวลาเริ่ม';
    return next;
  };

  const submit = (e) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length) return;

    const payload = {
      id:
        mode === 'edit'
          ? initialAppointment?.id || initialAppointment?.appointmentId || null
          : undefined,
      customer: selectedCustomer,
      customerHn: selectedCustomer?.hn || '',
      customerName: selectedCustomer?.name || '',
      customerPhone: selectedCustomer?.phone || '',
      customerSegment: selectedCustomer?.segment || '',
      customerStatus: selectedCustomer?.status || '',
      date,
      timeStart,
      timeEnd,
      subject: String(subject || '').trim(),
      details: String(details || '').trim(),
    };

    if (typeof onSubmit === 'function') {
      onSubmit(payload);
    }
  };

  if (!open) return null;

  const titleText = mode === 'edit' ? 'แก้ไขนัดหมาย' : 'สร้างนัดหมาย';
  const submitText = mode === 'edit' ? 'บันทึกการแก้ไข' : 'บันทึกนัดหมาย';

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div
          className="modal modal--appointment"
          role="dialog"
          aria-modal="true"
          aria-label={titleText}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <h3>{titleText}</h3>
          </div>

          <div className="modal-body" ref={modalBodyRef}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div ref={inputWrapRef} style={{ position: 'relative' }}>
                <label
                  style={{ display: 'block', fontWeight: 700, marginBottom: 6 }}
                >
                  ค้นหารายชื่อลูกค้า
                </label>
                <input
                  ref={inputRef}
                  className="input"
                  aria-label="ค้นหารายชื่อลูกค้า"
                  placeholder="ค้นหารายชื่อลูกค้า"
                  value={query}
                  disabled={isEditMode}
                  readOnly={isEditMode}
                  onChange={(e) => {
                    if (isEditMode) return;
                    setQuery(e.target.value);
                    setSelectedCustomer(null);
                    setPickerOpen(true);
                  }}
                  onFocus={() => {
                    if (isEditMode) return;
                    setPickerOpen(true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') setPickerOpen(false);
                  }}
                  style={{ width: '100%' }}
                />

                {errors.customer ? (
                  <div className="field-error" style={{ marginTop: 6 }}>
                    {errors.customer}
                  </div>
                ) : null}
              </div>

              {selectedCustomer ? (
                <form id="apptCreateForm" onSubmit={submit}>
                  <div className="form-card" style={{ marginTop: 4 }}>
                    <div className="form-grid">
                      <label>หัวข้อ</label>
                      <div>
                        <input
                          className="input"
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          aria-label="หัวข้อการนัดหมาย"
                          placeholder="เช่น ตรวจติดตามอาการ"
                        />
                      </div>

                      <label>วันที่ *</label>
                      <div>
                        <input
                          className="input"
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          aria-label="วันที่นัดหมาย"
                        />
                        {errors.date ? (
                          <div className="field-error">{errors.date}</div>
                        ) : null}
                      </div>

                      <label>ช่วงเวลา *</label>
                      <div>
                        <div className="inline-pair">
                          <div>
                            <div className="sub-label">เริ่ม</div>
                            <input
                              className="input"
                              type="time"
                              step="1800"
                              value={timeStart}
                              onChange={(e) => setTimeStart(e.target.value)}
                              aria-label="เวลาเริ่ม"
                            />
                            {errors.timeStart ? (
                              <div className="field-error">
                                {errors.timeStart}
                              </div>
                            ) : null}
                          </div>

                          <div>
                            <div className="sub-label">สิ้นสุด</div>
                            <input
                              className="input"
                              type="time"
                              step="1800"
                              value={timeEnd}
                              onChange={(e) => setTimeEnd(e.target.value)}
                              aria-label="เวลาสิ้นสุด"
                            />
                            {errors.timeEnd ? (
                              <div className="field-error">
                                {errors.timeEnd}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>

                      <label>รายละเอียด</label>
                      <div>
                        <textarea
                          className="textarea"
                          value={details}
                          onChange={(e) => setDetails(e.target.value)}
                          aria-label="รายละเอียดนัดหมาย"
                          rows={4}
                          style={{
                            resize: 'vertical',
                            width: '100%',
                            boxSizing: 'border-box',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </form>
              ) : (
                <div style={{ opacity: 0.85 }}>
                  โปรดค้นหาและเลือกลูกค้าก่อน เพื่อสร้างนัดหมาย
                </div>
              )}
            </div>
          </div>

          <div className="modal-actions">
            {isEditMode ? (
              <button
                type="button"
                className="button"
                onClick={() => {
                  if (typeof onDelete === 'function') {
                    const ok =
                      typeof window !== 'undefined' &&
                      typeof window.confirm === 'function'
                        ? window.confirm('ยืนยันลบนัดหมายรายการนี้หรือไม่?')
                        : true;
                    if (!ok) return;
                    onDelete(initialAppointment);
                  }
                }}
                disabled={!initialAppointment?.id}
                aria-label="ลบนัดหมาย"
              >
                ลบนัดหมาย
              </button>
            ) : null}
            <button type="button" className="button" onClick={onClose}>
              ยกเลิก
            </button>
            <button
              type="submit"
              form="apptCreateForm"
              className="button button--solid"
              disabled={!selectedCustomer}
            >
              {submitText}
            </button>
          </div>
        </div>
      </div>

      <CustomerPickerPortal
        open={showPicker}
        pos={pickerPos}
        items={visibleResults}
        onSelect={selectCustomer}
      />
    </>
  );
}

function CustomerPickerPortal({ open, pos, items, onSelect }) {
  if (!open || !pos) return null;

  return createPortal(
    <div
      className="dropdown-menu dropdown-menu--compact"
      style={{
        position: 'fixed',
        top: pos.top,
        left: pos.left,
        width: pos.width,
        overflowY: 'hidden',
        zIndex: 999,
      }}
      role="listbox"
      aria-label="ผลการค้นหารายชื่อลูกค้า"
    >
      {items.length ? (
        items.map((c) => (
          <button
            key={c.hn || `${c.name}_${c.phone}`}
            type="button"
            role="option"
            aria-selected={false}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onSelect(c)}
            style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}
          >
            <span className="badge badge--hn" style={{ flex: '0 0 auto' }}>
              {c.hn || '-'}
            </span>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  justifyContent: 'space-between',
                }}
              >
                <span
                  style={{
                    fontWeight: 800,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {c.name || '-'}
                </span>
                <span
                  className={
                    c.status === 'ไม่ใช้งาน'
                      ? 'badge badge--inactive'
                      : 'badge badge--active'
                  }
                  style={{ flex: '0 0 auto' }}
                >
                  {c.status || '-'}
                </span>
              </div>
              <div
                style={{
                  opacity: 0.85,
                  marginTop: 2,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                <span>{c.phone || '-'}</span>
                <span style={{ margin: '0 8px' }}>•</span>
                <span>{c.segment || '-'}</span>
              </div>
            </div>
          </button>
        ))
      ) : (
        <div style={{ padding: '0.5rem 0.75rem', opacity: 0.8 }}>
          ไม่พบรายการ
        </div>
      )}
    </div>,
    document.body
  );
}
