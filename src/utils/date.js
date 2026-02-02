export const toTimestamp = (value) => {
  const raw = String(value || '').trim();
  if (!raw || raw === '-') return null;

  const dmyMatch = raw.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{4})/);
  if (dmyMatch) {
    const day = Number(dmyMatch[1]);
    const month = Number(dmyMatch[2]);
    const year = Number(dmyMatch[3]);
    if (
      Number.isFinite(day) &&
      Number.isFinite(month) &&
      Number.isFinite(year)
    ) {
      return new Date(year, month - 1, day).getTime();
    }
  }

  const parsed = new Date(raw);
  const time = parsed.getTime();
  return Number.isFinite(time) ? time : null;
};

export const formatDateDMY = (value) => {
  const raw = String(value || '').trim();
  if (!raw || raw === '-') return '-';
  const time = toTimestamp(raw);
  if (time === null) return raw;
  const d = new Date(time);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = String(d.getFullYear()).padStart(4, '0');
  return `${day}/${month}/${year}`;
};
