import ENRICHED_CUSTOMERS from './customersFull.js';

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

function mulberry32(seed) {
  let t = seed >>> 0;
  return function rand() {
    t += 0x6d2b79f5;
    let x = t;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

function randomSeedU32() {
  try {
    if (typeof crypto !== 'undefined' && crypto?.getRandomValues) {
      const buf = new Uint32Array(1);
      crypto.getRandomValues(buf);
      return buf[0] >>> 0;
    }
  } catch {
    // ignore
  }
  return Math.floor(Math.random() * 2 ** 32) >>> 0 || 0x1a2b3c4d;
}

function getSessionSeed(key, fallbackSeed) {
  try {
    if (typeof sessionStorage === 'undefined') return fallbackSeed >>> 0;
    const raw = sessionStorage.getItem(key);
    const n = Number(raw);
    if (Number.isFinite(n) && n >= 0) return n >>> 0 || 0;
    const next = fallbackSeed >>> 0;
    sessionStorage.setItem(key, String(next));
    return next;
  } catch {
    return fallbackSeed >>> 0;
  }
}

function pad2(n) {
  const v = Number(n);
  if (!Number.isFinite(v)) return '00';
  return String(v).padStart(2, '0');
}

function minutesToHHMM(totalMinutes) {
  const t = Math.max(0, Math.floor(Number(totalMinutes) || 0));
  const hh = Math.floor(t / 60);
  const mm = t % 60;
  return `${pad2(hh)}:${pad2(mm)}`;
}

function isoFromLocalDate(d) {
  const year = d.getFullYear();
  const month = pad2(d.getMonth() + 1);
  const day = pad2(d.getDate());
  return `${year}-${month}-${day}`;
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

const SERVICES = [
  'Drip วิตามิน',
  'ฉีดยา',
  'ตรวจเลือด',
  'ทำกายภาพ',
  'ปรึกษาแพทย์',
  'ตรวจติดตามอาการ',
  'ทำแผล',
  'รับยา/แนะนำการใช้ยา',
  'ฉีดวิตามิน',
  'ตรวจสุขภาพ',
];

// Generate a dark, vivid 30-color palette (optimized for clear 30% fade)
function buildPalette30() {
  const BASE_COLORS = [
    '#dc2626', // red
    '#ef4444', // red (bright)
    '#e11d48', // rose
    '#f43f5e', // rose (bright)
    '#db2777', // pink
    '#ec4899', // pink (bright)
    '#c026d3', // fuchsia
    '#d946ef', // fuchsia (bright)
    '#a21caf', // purple
    '#a855f7', // purple (bright)
    '#7c3aed', // violet
    '#8b5cf6', // violet (bright)
    '#4f46e5', // indigo
    '#6366f1', // indigo (bright)
    '#2563eb', // blue
    '#3b82f6', // blue (bright)
    '#0284c7', // sky
    '#0ea5e9', // sky (bright)
    '#0891b2', // cyan
    '#06b6d4', // cyan (bright)
    '#0f766e', // teal
    '#14b8a6', // teal (bright)
    '#059669', // emerald
    '#10b981', // emerald (bright)
    '#16a34a', // green
    '#22c55e', // green (bright)
    '#65a30d', // lime
    '#84cc16', // lime (bright)
    '#d97706', // amber
    '#f59e0b', // amber (bright)
  ];

  // Keep order stable; the assignment is randomized separately.
  return BASE_COLORS.map((c) => String(c || '').trim()).filter(Boolean);
}

function pickUnique(arr, count, rand) {
  const src = Array.isArray(arr) ? arr.slice() : [];
  const out = [];
  while (src.length && out.length < count) {
    const idx = Math.floor(rand() * src.length);
    out.push(src.splice(idx, 1)[0]);
  }
  return out;
}

function pickAppointmentStatus(rand) {
  const r = rand();
  // Requirement:
  // - 2 explicit statuses: attended / cancelled
  // - plus some empty status for "เพิ่งสร้าง/ยังไม่มา" (so UI shows 30% color)
  if (r < 0.4) return '';
  if (r < 0.85) return 'attended';
  return 'cancelled';
}

const randTopics = mulberry32(0x20260305);
const randColorsSeed = getSessionSeed(
  'absmediq:apptTopicColorSeed',
  randomSeedU32()
);
const randColors = mulberry32(randColorsSeed);
const palette30 = buildPalette30();
const palette30Shuffled = pickUnique(palette30, palette30.length, randColors);

export const APPOINTMENT_TOPICS_STAGE = pickUnique(
  SERVICES,
  SERVICES.length,
  randTopics
).map((name, idx) => {
  const color = palette30Shuffled[idx % palette30Shuffled.length] || '';
  return { name: String(name || '').trim() || `หัวข้อ ${idx + 1}`, color };
});

const APPOINTMENTS_STAGE = (() => {
  const src = Array.isArray(ENRICHED_CUSTOMERS) ? ENRICHED_CUSTOMERS : [];
  const customers = src
    .map((c) => ({
      hn: String(c?.hn || '').trim(),
      name: displayName(c),
      phone: String(c?.details?.phone || '').trim(),
      segment: String(c?.segment || c?.conditions?.segment || '').trim(),
      status: String(c?.status || 'ใช้งาน').trim(),
    }))
    .filter((c) => c.hn || c.name)
    .filter((c) => c.status === 'ใช้งาน');

  const rand = mulberry32(0x20260306);
  const pickCustomer = () => {
    if (!customers.length) return null;
    return customers[Math.floor(rand() * customers.length)];
  };

  const startDate = new Date(2026, 2, 5); // 05/03/2026 (local)
  const endDate = new Date(2026, 2, 15); // 15/03/2026 (local)
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);

  const dayCount =
    Math.max(0, Math.round((endDate - startDate) / (24 * 60 * 60 * 1000))) + 1;

  const out = [];
  const durations = [30, 60, 90, 120];
  const START_MIN = 8 * 60;
  const END_MIN = 20 * 60;

  for (let di = 0; di < dayCount; di += 1) {
    const dateObj = addDays(startDate, di);
    const iso = isoFromLocalDate(dateObj);

    // Requirement: each day should have appointments at random times.
    const perDay = 2 + Math.floor(rand() * 5); // 2..6

    for (let i = 0; i < perDay; i += 1) {
      const picked = pickCustomer();
      const customerName = picked?.name || '-';
      const customerHn = picked?.hn || '';
      const customerPhone = picked?.phone || '';
      const customerSegment = picked?.segment || '';
      const customerStatus = picked?.status || '';

      const duration = durations[Math.floor(rand() * durations.length)] || 30;
      const latestStart = Math.max(START_MIN, END_MIN - duration);
      const startMinRaw =
        START_MIN + Math.floor(rand() * (latestStart - START_MIN + 1));
      const startMin = Math.floor(startMinRaw / 30) * 30; // snap to 30-min grid
      const endMin = Math.min(END_MIN, startMin + duration);

      const timeStart = minutesToHHMM(startMin);
      const timeEnd = minutesToHHMM(endMin);
      const pickedTopic =
        APPOINTMENT_TOPICS_STAGE[
          Math.floor(rand() * APPOINTMENT_TOPICS_STAGE.length)
        ] || null;
      const service = String(pickedTopic?.name || 'นัดหมาย').trim();
      const appointmentStatus = pickAppointmentStatus(rand);

      out.push({
        id: `stage_${iso.replace(/-/g, '')}_${pad2(i + 1)}`,
        date: iso,
        timeStart,
        timeEnd,
        time: timeStart,
        patient: customerName,
        service,
        details: '',
        customerHn,
        customerName,
        customerPhone,
        customerSegment,
        customerStatus,
        appointmentStatus,
      });
    }
  }

  return out;
})();
export default APPOINTMENTS_STAGE;
