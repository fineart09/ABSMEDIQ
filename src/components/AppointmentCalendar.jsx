import { useMemo, useState } from 'react';

function pad2(n) {
  const v = Number(n);
  if (!Number.isFinite(v)) return '00';
  return String(v).padStart(2, '0');
}

function toIsoDateLocal(d) {
  const year = d.getFullYear();
  const month = pad2(d.getMonth() + 1);
  const day = pad2(d.getDate());
  return `${year}-${month}-${day}`;
}

function startOfWeekMonday(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  // JS: 0=Sun..6=Sat -> convert to Monday-based
  const day = d.getDay();
  const diff = (day + 6) % 7; // Mon=0..Sun=6
  d.setDate(d.getDate() - diff);
  return d;
}

function startOfMonth(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(1);
  return d;
}

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addMonths(date, months) {
  const d = new Date(date);
  const target = Number(months);
  if (!Number.isFinite(target) || target === 0) return d;
  // Keep the day as-is but avoid DST surprises by normalizing first.
  d.setHours(0, 0, 0, 0);
  const day = d.getDate();
  d.setDate(1);
  d.setMonth(d.getMonth() + target);
  const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  d.setDate(Math.min(day, lastDay));
  return d;
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatThaiWeekdayShort(date) {
  // Keep it stable and simple (no locale dependency).
  const map = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];
  return map[date.getDay()] || '';
}

function normalizeTimeHHMM(time) {
  const raw = String(time || '').trim();
  if (!raw) return '';
  // Accept HH:MM, HH:MM:SS
  const m = raw.match(/^(\d{1,2}):(\d{2})/);
  if (!m) return '';
  const hh = pad2(m[1]);
  const mm = pad2(m[2]);
  return `${hh}:${mm}`;
}

function buildTimeSlots({ startHour = 8, endHour = 20, stepMinutes = 30 }) {
  const slots = [];
  for (let hour = startHour; hour <= endHour; hour += 1) {
    for (let m = 0; m < 60; m += stepMinutes) {
      // For the last hour, only include :00 (so we end cleanly at endHour:00)
      if (hour === endHour && m > 0) continue;
      slots.push(`${pad2(hour)}:${pad2(m)}`);
    }
  }
  return slots;
}

function safeTrim(value) {
  return String(value ?? '').trim();
}

function compareTime(a, b) {
  const ta = safeTrim(a?.time);
  const tb = safeTrim(b?.time);
  return ta.localeCompare(tb);
}

const TH_WEEKDAYS_LONG = [
  'วันอาทิตย์',
  'วันจันทร์',
  'วันอังคาร',
  'วันพุธ',
  'วันพฤหัสบดี',
  'วันศุกร์',
  'วันเสาร์',
];

const TH_MONTHS_LONG = [
  'มกราคม',
  'กุมภาพันธ์',
  'มีนาคม',
  'เมษายน',
  'พฤษภาคม',
  'มิถุนายน',
  'กรกฎาคม',
  'สิงหาคม',
  'กันยายน',
  'ตุลาคม',
  'พฤศจิกายน',
  'ธันวาคม',
];

const TH_MONTHS_SHORT = [
  'ม.ค.',
  'ก.พ.',
  'มี.ค.',
  'เม.ย.',
  'พ.ค.',
  'มิ.ย.',
  'ก.ค.',
  'ส.ค.',
  'ก.ย.',
  'ต.ค.',
  'พ.ย.',
  'ธ.ค.',
];

function buddhistYear(date) {
  return date.getFullYear() + 543;
}

function formatThaiWithIntl(date, options) {
  try {
    return new Intl.DateTimeFormat('th-TH-u-ca-buddhist', options).format(date);
  } catch {
    return null;
  }
}

function formatThaiMonthYear(date) {
  const intl = formatThaiWithIntl(date, { month: 'long', year: 'numeric' });
  if (intl) return intl;
  return `${TH_MONTHS_LONG[date.getMonth()]} ${buddhistYear(date)}`;
}

function formatThaiDateLong(date) {
  const intl = formatThaiWithIntl(date, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  if (intl) return intl;
  const weekday = TH_WEEKDAYS_LONG[date.getDay()] || '';
  const day = date.getDate();
  const month = TH_MONTHS_LONG[date.getMonth()] || '';
  const year = buddhistYear(date);
  return `${weekday} ${day} ${month} ${year}`.trim();
}

function formatThaiDateShort(date) {
  const intl = formatThaiWithIntl(date, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  if (intl) return intl;
  const day = date.getDate();
  const month = TH_MONTHS_SHORT[date.getMonth()] || '';
  const year = buddhistYear(date);
  return `${day} ${month} ${year}`.trim();
}

export default function AppointmentCalendar({
  appointments,
  onCreateAppointment,
}) {
  const [view, setView] = useState('week');
  const [anchorDate, setAnchorDate] = useState(() => startOfDay(new Date()));
  const [selectedCellKey, setSelectedCellKey] = useState(null);
  const [selectedDateIso, setSelectedDateIso] = useState(null);

  const today = new Date();
  const todayIso = toIsoDateLocal(today);
  const anchorIso = toIsoDateLocal(anchorDate);

  const days = useMemo(() => {
    if (view === 'day') {
      return [
        {
          date: new Date(anchorDate),
          iso: anchorIso,
          label: `${formatThaiWeekdayShort(anchorDate)} ${pad2(anchorDate.getDate())}/${pad2(anchorDate.getMonth() + 1)}`,
        },
      ];
    }

    const weekStart = startOfWeekMonday(anchorDate);
    return Array.from({ length: 7 }, (_, i) => {
      const d = addDays(weekStart, i);
      return {
        date: d,
        iso: toIsoDateLocal(d),
        label: `${formatThaiWeekdayShort(d)} ${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}`,
      };
    });
  }, [anchorDate, anchorIso, view]);

  const monthModel = useMemo(() => {
    if (view !== 'month') return null;
    const monthStart = startOfMonth(anchorDate);
    const gridStart = startOfWeekMonday(monthStart);
    // 6 weeks grid (42 days) to cover all months consistently.
    const gridDays = Array.from({ length: 42 }, (_, i) => {
      const d = addDays(gridStart, i);
      const iso = toIsoDateLocal(d);
      return {
        date: d,
        iso,
        day: d.getDate(),
        inMonth: d.getMonth() === monthStart.getMonth(),
      };
    });

    const weekdayHeads = Array.from({ length: 7 }, (_, i) => {
      const d = addDays(gridStart, i);
      return {
        key: `wd_${i}`,
        label: formatThaiWeekdayShort(d),
      };
    });

    return {
      monthStart,
      gridStart,
      gridDays,
      weekdayHeads,
    };
  }, [anchorDate, view]);

  const list = useMemo(
    () => (Array.isArray(appointments) ? appointments : []),
    [appointments]
  );

  const slots = useMemo(
    () => buildTimeSlots({ startHour: 8, endHour: 20, stepMinutes: 30 }),
    []
  );

  const byDayTime = useMemo(() => {
    if (view === 'month') return new Map();
    const map = new Map();
    for (const appt of list) {
      const dateIso = safeTrim(appt?.date);
      const timeHHMM = normalizeTimeHHMM(appt?.time);
      if (!dateIso || !timeHHMM) continue;

      const key = `${dateIso}__${timeHHMM}`;
      const prev = map.get(key) || [];
      map.set(key, [...prev, appt]);
    }
    return map;
  }, [list, view]);

  const byDate = useMemo(() => {
    if (view !== 'month') return new Map();
    const map = new Map();
    for (const appt of list) {
      const dateIso = safeTrim(appt?.date);
      if (!dateIso) continue;
      const prev = map.get(dateIso) || [];
      map.set(dateIso, [...prev, appt]);
    }
    for (const [k, v] of map.entries()) {
      const next = (Array.isArray(v) ? v : []).slice().sort(compareTime);
      map.set(k, next);
    }
    return map;
  }, [list, view]);

  const viewLabel =
    view === 'day' ? 'รายวัน' : view === 'month' ? 'รายเดือน' : 'รายสัปดาห์';

  const rangeLabel = useMemo(() => {
    if (view === 'month') {
      return formatThaiMonthYear(anchorDate);
    }

    if (view === 'day') {
      return formatThaiDateLong(anchorDate);
    }

    const weekStart = startOfWeekMonday(anchorDate);
    const weekEnd = addDays(weekStart, 6);
    return `${formatThaiDateShort(weekStart)} - ${formatThaiDateShort(weekEnd)}`;
  }, [anchorDate, view]);

  const handlePrev = () => {
    setAnchorDate((prev) => {
      if (view === 'month') return startOfMonth(addMonths(prev, -1));
      if (view === 'week') return addDays(prev, -7);
      return addDays(prev, -1);
    });
  };

  const handleNext = () => {
    setAnchorDate((prev) => {
      if (view === 'month') return startOfMonth(addMonths(prev, 1));
      if (view === 'week') return addDays(prev, 7);
      return addDays(prev, 1);
    });
  };

  const handleToday = () => {
    setAnchorDate(startOfDay(new Date()));
  };

  const clearSelection = () => {
    setSelectedCellKey(null);
    setSelectedDateIso(null);
  };

  return (
    <section className="appt-cal">
      <div className="page-sticky-header">
        <div className="appt-cal__header">
          <div>
            <h1 className="page-title">ตารางนัดหมาย</h1>
            <div className="appt-cal__sub">
              {viewLabel} • {rangeLabel}
            </div>
          </div>
          <div className="appt-cal__controls">
            <label className="appt-cal__view">
              มุมมอง
              <select
                value={view}
                onChange={(e) => {
                  const next = e.target.value;
                  setView(next);
                  setAnchorDate((prev) => {
                    if (next === 'month') return startOfMonth(prev);
                    if (next === 'week') return startOfWeekMonday(prev);
                    return startOfDay(prev);
                  });
                  clearSelection();
                }}
                aria-label="เลือกมุมมองปฏิทิน"
              >
                <option value="day">รายวัน</option>
                <option value="week">รายสัปดาห์</option>
                <option value="month">รายเดือน</option>
              </select>
            </label>

            <div className="appt-cal__nav" aria-label="เลื่อนปฏิทิน">
              <button type="button" className="button" onClick={handlePrev}>
                ก่อนหน้า
              </button>
              <button type="button" className="button" onClick={handleToday}>
                วันนี้
              </button>
              <button type="button" className="button" onClick={handleNext}>
                ถัดไป
              </button>
            </div>

            <button
              type="button"
              className="appt-cal__legend-item appt-cal__cta"
              onClick={() => {
                if (typeof onCreateAppointment === 'function') {
                  onCreateAppointment();
                }
              }}
              aria-label="สร้างนัดหมาย"
            >
              สร้างนัดหมาย
            </button>
          </div>
        </div>
      </div>

      {view === 'month' && monthModel ? (
        <div
          className="appt-cal__grid appt-cal__grid--month"
          role="grid"
          aria-label="ปฏิทินนัดหมาย (Month)"
        >
          {monthModel.weekdayHeads.map((h) => (
            <div
              key={h.key}
              className="appt-cal__month-dayhead"
              role="columnheader"
            >
              {h.label}
            </div>
          ))}

          {monthModel.gridDays.map((d) => {
            const items = byDate.get(d.iso) || [];
            const isToday = d.iso === todayIso;
            const isSelected = selectedDateIso === d.iso;
            return (
              <div
                key={d.iso}
                className={`appt-cal__month-cell${d.inMonth ? '' : ' appt-cal__month-cell--out'}${isToday ? ' appt-cal__today' : ''}${isSelected ? ' appt-cal__selected' : ''}`}
                role="gridcell"
                aria-label={`${d.iso}`}
                aria-selected={isSelected ? 'true' : 'false'}
                tabIndex={0}
                onClick={() => {
                  setSelectedDateIso(d.iso);
                  setSelectedCellKey(null);
                }}
              >
                <div className="appt-cal__month-date">{d.day}</div>
                {items.length > 0 ? (
                  <div className="appt-cal__month-events">
                    {items.slice(0, 6).map((a) => (
                      <div
                        key={String(
                          a?.id || `${a?.date}-${a?.time}-${a?.patient}`
                        )}
                        className="appt-cal__month-event"
                        title={`${safeTrim(a?.time)} ${safeTrim(a?.patient)} ${safeTrim(a?.service)}`.trim()}
                      >
                        <span className="appt-cal__month-event-time">
                          {normalizeTimeHHMM(a?.time) || '--:--'}
                        </span>
                        <span className="appt-cal__month-event-title">
                          {safeTrim(a?.patient) || '-'}
                        </span>
                      </div>
                    ))}
                    {items.length > 6 ? (
                      <div className="appt-cal__month-more">
                        +{items.length - 6} รายการ
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      ) : (
        <div
          className="appt-cal__grid"
          role="grid"
          aria-label="ปฏิทินนัดหมาย"
          style={{
            gridTemplateColumns: `84px repeat(${days.length}, minmax(140px, 1fr))`,
          }}
        >
          {/* Header row */}
          <div className="appt-cal__corner" />
          {days.map((d) => (
            <div
              key={d.iso}
              className={`appt-cal__dayhead${d.iso === todayIso ? ' appt-cal__dayhead--today' : ''}`}
              role="columnheader"
            >
              {d.label}
            </div>
          ))}

          {/* Body */}
          {slots.map((slot) => (
            <div className="appt-cal__row" key={slot} role="row">
              <div className="appt-cal__time" role="rowheader">
                {slot}
              </div>
              {days.map((d) => {
                const key = `${d.iso}__${slot}`;
                const items = byDayTime.get(key) || [];
                const isSelected = selectedCellKey === key;
                return (
                  <div
                    key={key}
                    className={`appt-cal__cell${d.iso === todayIso ? ' appt-cal__cell--today' : ''}${isSelected ? ' appt-cal__selected' : ''}`}
                    role="gridcell"
                    aria-label={`${d.label} ${slot}`}
                    aria-selected={isSelected ? 'true' : 'false'}
                    tabIndex={0}
                    onClick={() => {
                      setSelectedCellKey(key);
                      setSelectedDateIso(null);
                    }}
                  >
                    {items.length > 0 ? (
                      <div className="appt-cal__events">
                        {items.map((a) => (
                          <div
                            key={String(
                              a?.id || `${a?.date}-${a?.time}-${a?.patient}`
                            )}
                            className="appt-cal__event"
                          >
                            <div className="appt-cal__event-title">
                              {safeTrim(a?.patient) || '-'}
                            </div>
                            <div className="appt-cal__event-meta">
                              {safeTrim(a?.service) || 'นัดหมาย'}
                              {safeTrim(a?.provider)
                                ? ` • ${safeTrim(a?.provider)}`
                                : ''}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {list.length === 0 ? (
        <div className="appt-cal__empty">ยังไม่มีนัดหมายในระบบ</div>
      ) : null}
    </section>
  );
}
