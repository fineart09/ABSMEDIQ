import ENRICHED_CUSTOMERS from './customersFull';

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

const templates = [
  {
    id: 'stage_001',
    date: '2026-02-12',
    timeStart: '09:00',
    timeEnd: '09:30',
    service: 'ตรวจติดตามอาการ',
  },
  {
    id: 'stage_002',
    date: '2026-02-12',
    timeStart: '10:00',
    timeEnd: '11:00',
    service: 'ปรึกษาแพทย์',
  },
  {
    id: 'stage_003',
    date: '2026-02-13',
    timeStart: '13:30',
    timeEnd: '14:00',
    service: 'ทำแผล',
  },
  {
    id: 'stage_004',
    date: '2026-02-14',
    timeStart: '15:00',
    timeEnd: '15:30',
    service: 'รับยา/แนะนำการใช้ยา',
  },
];

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

  const rand = mulberry32(0x20260212);
  const pickCustomer = () => {
    if (!customers.length) return null;
    return customers[Math.floor(rand() * customers.length)];
  };

  return templates.map((t) => {
    const picked = pickCustomer();
    const customerName = picked?.name || '-';
    const customerHn = picked?.hn || '';
    const customerPhone = picked?.phone || '';
    const customerSegment = picked?.segment || '';
    const customerStatus = picked?.status || '';

    return {
      id: t.id,
      date: t.date,
      timeStart: t.timeStart,
      timeEnd: t.timeEnd,
      time: t.timeStart,
      patient: customerName,
      service: t.service,
      customerHn,
      customerName,
      customerPhone,
      customerSegment,
      customerStatus,
    };
  });
})();

export default APPOINTMENTS_STAGE;
