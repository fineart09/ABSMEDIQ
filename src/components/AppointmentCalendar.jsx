import { useEffect, useMemo, useState } from 'react';

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

function buildTimeSlotsFullDay({ stepMinutes = 30 }) {
  const slots = [];
  const step = Number(stepMinutes);
  if (!Number.isFinite(step) || step <= 0) return slots;
  // 00:00 up to 23:30 (end-exclusive 24:00)
  for (let total = 0; total < 24 * 60; total += step) {
    const hour = Math.floor(total / 60);
    const minute = total % 60;
    slots.push(`${pad2(hour)}:${pad2(minute)}`);
  }
  return slots;
}

function safeTrim(value) {
  return String(value ?? '').trim();
}

function getStartTime(appt) {
  return normalizeTimeHHMM(appt?.timeStart || appt?.time);
}

function getEndTime(appt) {
  return normalizeTimeHHMM(appt?.timeEnd);
}

function getTitle(appt) {
  return (
    safeTrim(appt?.patient) ||
    safeTrim(appt?.customerName) ||
    safeTrim(appt?.customer?.name) ||
    '-'
  );
}

function getService(appt) {
  return safeTrim(appt?.service) || safeTrim(appt?.details) || 'นัดหมาย';
}

function getDetails(appt) {
  return safeTrim(appt?.details);
}

function normalizeAppointmentStatus(raw) {
  const s = safeTrim(raw).toLowerCase();
  if (!s) return '';
  if (s === 'attended') return 'attended';
  if (s === 'cancelled' || s === 'canceled') return 'cancelled';

  // Support Thai labels (in case stored as display text)
  if (s.includes('มาตาม')) return 'attended';
  if (s.includes('ยกเลิก')) return 'cancelled';
  return '';
}

function hexToRgb(hex) {
  const raw = String(hex || '').trim();
  const m = raw.match(/^#?([0-9a-fA-F]{6})$/);
  if (!m) return null;
  const n = Number.parseInt(m[1], 16);
  if (!Number.isFinite(n)) return null;
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function withAlpha(color, alpha) {
  const a = Math.max(0, Math.min(1, Number(alpha)));
  const rgb = hexToRgb(color);
  if (!rgb) return String(color || '').trim();
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${a})`;
}

function topicBlockAlphaByStatus(statusKey) {
  // Visual rule:
  // - attended: show topic color clearly (but not fully opaque for readability)
  // - pending (empty) & cancelled: 30% intensity of attended
  const attendedAlpha = 0.55;
  if (statusKey === 'attended') return attendedAlpha;
  return attendedAlpha * 0.3;
}

function getAppointmentStatusKey(appt) {
  const raw = appt?.appointmentStatus || appt?.apptStatus || appt?.status;
  return normalizeAppointmentStatus(raw);
}

function getAppointmentStatusClass(appt) {
  const key = getAppointmentStatusKey(appt);
  return key ? ` appt-cal__event--${key}` : ' appt-cal__event--unspecified';
}

function formatTimeRange(appt) {
  const start = getStartTime(appt);
  const end = getEndTime(appt);
  if (start && end && start !== end) return `${start}-${end}`;
  return start || '--:--';
}

function compareTime(a, b) {
  const ta = getStartTime(a);
  const tb = getStartTime(b);
  return ta.localeCompare(tb);
}

function timeToMinutes(timeHHMM) {
  const raw = String(timeHHMM || '').trim();
  const m = raw.match(/^(\d{1,2}):(\d{2})/);
  if (!m) return null;
  const hh = Number(m[1]);
  const mm = Number(m[2]);
  if (!Number.isFinite(hh) || !Number.isFinite(mm)) return null;
  const total = hh * 60 + mm;
  if (total < 0 || total > 24 * 60) return null;
  return total;
}

function clampMinutes(mins) {
  const v = Number(mins);
  if (!Number.isFinite(v)) return 0;
  return Math.min(24 * 60, Math.max(0, v));
}

function layoutOverlappingEvents(events) {
  const src = Array.isArray(events) ? events : [];
  const normalized = [];

  for (const appt of src) {
    const startMinRaw = timeToMinutes(getStartTime(appt));
    if (startMinRaw === null) continue;
    const endMinRaw = timeToMinutes(getEndTime(appt));

    const startMin = clampMinutes(startMinRaw);
    let endMin =
      endMinRaw === null
        ? clampMinutes(startMin + 30)
        : clampMinutes(endMinRaw);

    if (endMin <= startMin) endMin = clampMinutes(startMin + 30);

    normalized.push({ appt, startMin, endMin });
  }

  normalized.sort((a, b) => {
    if (a.startMin !== b.startMin) return a.startMin - b.startMin;
    if (a.endMin !== b.endMin) return a.endMin - b.endMin;
    return String(a.appt?.id || '').localeCompare(String(b.appt?.id || ''));
  });

  // Split into overlap clusters.
  const clusters = [];
  let cluster = [];
  let clusterEnd = -1;
  for (const item of normalized) {
    if (!cluster.length) {
      cluster = [item];
      clusterEnd = item.endMin;
      continue;
    }

    if (item.startMin < clusterEnd) {
      cluster.push(item);
      clusterEnd = Math.max(clusterEnd, item.endMin);
    } else {
      clusters.push(cluster);
      cluster = [item];
      clusterEnd = item.endMin;
    }
  }
  if (cluster.length) clusters.push(cluster);

  const out = [];
  for (const group of clusters) {
    const colEnds = []; // endMin per column
    const placed = [];

    for (const item of group) {
      let col = colEnds.findIndex((end) => end <= item.startMin);
      if (col < 0) {
        col = colEnds.length;
        colEnds.push(item.endMin);
      } else {
        colEnds[col] = item.endMin;
      }
      placed.push({ ...item, col });
    }

    const cols = Math.max(1, colEnds.length);
    for (const p of placed) out.push({ ...p, cols });
  }

  return out;
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
  appointmentTopics,
  onCreateAppointment,
  onAppointmentTopics,
  onEditAppointment,
}) {
  const [view, setView] = useState('day');
  const [anchorDate, setAnchorDate] = useState(() => startOfDay(new Date()));
  const [selectedDateIso, setSelectedDateIso] = useState(null);
  const [searchNameQuery, setSearchNameQuery] = useState('');
  const [topicFilter, setTopicFilter] = useState('');

  const topicColorMap = useMemo(() => {
    const src = Array.isArray(appointmentTopics) ? appointmentTopics : [];
    const map = new Map();
    for (const t of src) {
      const name =
        typeof t === 'string' ? String(t).trim() : String(t?.name || '').trim();
      if (!name) continue;
      const color =
        typeof t === 'object' && t ? String(t?.color || '').trim() : '';
      if (!color) continue;
      map.set(name.toLowerCase(), color);
    }
    return map;
  }, [appointmentTopics]);

  const getApptTopicBlockStyle = (appt) => {
    const service = safeTrim(appt?.service) || safeTrim(appt?.subject);
    if (!service) return null;
    const base = topicColorMap.get(service.toLowerCase()) || '';
    if (!base) return null;

    const statusKey = getAppointmentStatusKey(appt);
    const bgAlpha = topicBlockAlphaByStatus(statusKey);
    const left = statusKey === 'attended' ? base : withAlpha(base, 0.3);

    return {
      borderLeft: `6px solid ${left}`,
      backgroundColor: withAlpha(base, bgAlpha),
      borderColor: withAlpha(base, Math.min(1, bgAlpha + 0.18)),
    };
  };

  const topicOptions = useMemo(() => {
    const src = Array.isArray(appointmentTopics) ? appointmentTopics : [];
    const out = [];
    const seen = new Set();
    for (const t of src) {
      const name =
        typeof t === 'string' ? String(t).trim() : String(t?.name || '').trim();
      if (!name) continue;
      const key = name.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(name);
    }
    return out;
  }, [appointmentTopics]);

  // If the chosen topic disappears (e.g. edited in settings), fall back to "ทั้งหมด".
  useEffect(() => {
    if (!topicFilter) return;
    const ok = topicOptions.some(
      (x) =>
        String(x || '')
          .trim()
          .toLowerCase() === topicFilter.toLowerCase()
    );
    if (!ok) setTopicFilter('');
  }, [topicFilter, topicOptions]);

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

  const baseList = useMemo(
    () => (Array.isArray(appointments) ? appointments : []),
    [appointments]
  );

  const list = useMemo(() => {
    const q = String(searchNameQuery || '')
      .trim()
      .toLowerCase();
    const topicKey = String(topicFilter || '')
      .trim()
      .toLowerCase();
    if (!q && !topicKey) return baseList;

    return baseList.filter((appt) => {
      if (!appt || typeof appt !== 'object') return false;

      if (q) {
        const name = String(getTitle(appt) || '')
          .trim()
          .toLowerCase();
        if (!name.includes(q)) return false;
      }

      if (topicKey) {
        const service = safeTrim(appt?.service) || safeTrim(appt?.subject);
        if (!service) return false;
        if (service.toLowerCase() !== topicKey) return false;
      }

      return true;
    });
  }, [baseList, searchNameQuery, topicFilter]);

  const slots = useMemo(() => {
    if (view === 'day' || view === 'week') {
      return buildTimeSlotsFullDay({ stepMinutes: 30 });
    }
    return buildTimeSlots({ startHour: 8, endHour: 20, stepMinutes: 30 });
  }, [view]);

  const byDateAnyView = useMemo(() => {
    if (view === 'month') return new Map();
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

  const laidOutByDate = useMemo(() => {
    if (view === 'month') return new Map();
    const map = new Map();
    for (const d of days) {
      const items = byDateAnyView.get(d.iso) || [];
      map.set(d.iso, layoutOverlappingEvents(items));
    }
    return map;
  }, [byDateAnyView, days, view]);

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
          <div className="appt-cal__controls-wrap">
            <div className="appt-cal__controls">
              <label className="appt-cal__view">
                มุมมอง
                <select
                  value={view}
                  onChange={(e) => {
                    const next = e.target.value;
                    setView(next);
                    // Default to today in every view so users always land on "today"
                    // after switching views (and newly created appointments are visible).
                    setAnchorDate(() => {
                      const base = startOfDay(new Date());
                      if (next === 'month') return startOfMonth(base);
                      if (next === 'week') return startOfWeekMonday(base);
                      return base;
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
                className="button"
                onClick={() => {
                  if (typeof onAppointmentTopics === 'function') {
                    onAppointmentTopics();
                  }
                }}
                aria-label="หัวข้อนัดหมาย"
              >
                หัวข้อนัดหมาย
              </button>

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

            <div className="appt-cal__searchrow" aria-label="ค้นหาและตัวกรอง">
              <input
                className="input"
                value={searchNameQuery}
                onChange={(e) => setSearchNameQuery(e.target.value)}
                placeholder="ค้นหา"
                aria-label="ค้นหาจากชื่อ"
                style={{ width: 240, maxWidth: '70vw' }}
              />

              <select
                className="input"
                value={topicFilter}
                onChange={(e) => setTopicFilter(e.target.value)}
                aria-label="กรองหัวข้อนัดหมาย"
                style={{ width: 240, maxWidth: '70vw' }}
              >
                <option value="">แสดงทั้งหมด</option>
                {topicOptions.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
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
                }}
              >
                <div className="appt-cal__month-date">{d.day}</div>
                {items.length > 0 ? (
                  <div className="appt-cal__month-events">
                    {items.slice(0, 6).map((a) => (
                      <div
                        key={String(
                          a?.id ||
                            `${a?.date}-${getStartTime(a)}-${getTitle(a)}`
                        )}
                        className={`appt-cal__month-event${getAppointmentStatusClass(a)}`}
                        title={`${formatTimeRange(a)} ${getTitle(a)} ${getService(a)}`.trim()}
                        role={
                          typeof onEditAppointment === 'function'
                            ? 'button'
                            : undefined
                        }
                        tabIndex={
                          typeof onEditAppointment === 'function'
                            ? 0
                            : undefined
                        }
                        style={getApptTopicBlockStyle(a) || undefined}
                        onClick={(e) => {
                          if (typeof onEditAppointment !== 'function') return;
                          e.stopPropagation();
                          onEditAppointment(a);
                        }}
                        onKeyDown={(e) => {
                          if (typeof onEditAppointment !== 'function') return;
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            e.stopPropagation();
                            onEditAppointment(a);
                          }
                        }}
                      >
                        <span className="appt-cal__month-event-time">
                          {getStartTime(a) || '--:--'}
                        </span>
                        <span className="appt-cal__month-event-title">
                          {getTitle(a) || '-'}
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
          className={`appt-cal__grid${view === 'day' ? ' appt-cal__grid--day' : ''}${view === 'week' ? ' appt-cal__grid--week' : ''}`}
          role="grid"
          aria-label="ปฏิทินนัดหมาย"
          style={{
            gridTemplateColumns: `${view === 'day' ? 72 : 72}px repeat(${days.length}, ${
              view === 'day' ? 'minmax(0, 1fr)' : 'minmax(110px, 1fr)'
            })`,
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

          {/* Body: time column + day columns (duration blocks) */}
          <div className="appt-cal__timecol" role="rowheader" aria-label="เวลา">
            {slots.map((slot) => (
              <div key={slot} className="appt-cal__timecol-item">
                {slot}
              </div>
            ))}
          </div>

          {days.map((d) => {
            const items = laidOutByDate.get(d.iso) || [];
            const isToday = d.iso === todayIso;
            return (
              <div
                key={d.iso}
                className={`appt-cal__daycol${isToday ? ' appt-cal__daycol--today' : ''}`}
                role="gridcell"
                aria-label={d.label}
                onClick={() => {
                  setSelectedDateIso(null);
                }}
              >
                {items.map(({ appt, startMin, endMin, col, cols }) => {
                  const leftPct = (col / cols) * 100;
                  const widthPct = 100 / cols;
                  const duration = Math.max(1, endMin - startMin);
                  const isDayView = view === 'day';
                  const isShort = duration < 60;
                  const isTiny = duration <= 35;
                  const detailLine = getDetails(appt) || getService(appt);
                  const title =
                    `${formatTimeRange(appt)} ${getTitle(appt)} ${getService(appt)}`.trim();

                  return (
                    <div
                      key={String(
                        appt?.id ||
                          `${appt?.date}-${getStartTime(appt)}-${getTitle(appt)}`
                      )}
                      className={`appt-cal__event-block${getAppointmentStatusClass(appt)}${isDayView ? ' appt-cal__event-block--day' : ''}${isTiny ? ' appt-cal__event-block--tiny' : isShort ? ' appt-cal__event-block--short' : ''}`}
                      title={title}
                      role={
                        typeof onEditAppointment === 'function'
                          ? 'button'
                          : undefined
                      }
                      tabIndex={
                        typeof onEditAppointment === 'function' ? 0 : undefined
                      }
                      style={{
                        top: `calc((var(--appt-slot-h) / 30) * ${startMin})`,
                        height: `calc((var(--appt-slot-h) / 30) * ${duration})`,
                        left: `calc(${leftPct}% + 2px)`,
                        width: `calc(${widthPct}% - 4px)`,
                        ...(getApptTopicBlockStyle(appt) || {}),
                      }}
                      onClick={(e) => {
                        if (typeof onEditAppointment !== 'function') return;
                        e.stopPropagation();
                        onEditAppointment(appt);
                      }}
                      onKeyDown={(e) => {
                        if (typeof onEditAppointment !== 'function') return;
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          e.stopPropagation();
                          onEditAppointment(appt);
                        }
                      }}
                    >
                      <div className="appt-cal__event-block-title">
                        {getTitle(appt) || '-'}
                      </div>
                      <div className="appt-cal__event-block-detailline">
                        {detailLine || '-'}
                      </div>
                      {!isShort ? (
                        <div className="appt-cal__event-block-meta">
                          {formatTimeRange(appt)}
                        </div>
                      ) : null}
                      {isDayView && duration >= 90 && getDetails(appt) ? (
                        <div className="appt-cal__event-block-details">
                          {getDetails(appt)}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}

      {list.length === 0 ? (
        <div className="appt-cal__empty">ยังไม่มีนัดหมายในระบบ</div>
      ) : null}
    </section>
  );
}
