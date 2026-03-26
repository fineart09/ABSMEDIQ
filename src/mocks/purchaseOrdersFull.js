// Mock purchase orders dataset used by Purchase pages

import { MOCK_PRODUCTS_FULL } from './productsFull.js';

function seeded(seed) {
  // deterministic pseudo-random in [0, 1)
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function randomInt(seed, min, max) {
  const r = seeded(seed * 1.231);
  return Math.floor(min + r * (max - min + 1));
}

function pickOne(seed, arr) {
  const list = Array.isArray(arr) ? arr : [];
  if (list.length === 0) return null;
  return list[
    Math.max(0, Math.min(list.length - 1, randomInt(seed, 0, list.length - 1)))
  ];
}

function addDaysISO(iso, days) {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return String(iso || '');
    d.setDate(d.getDate() + Number(days || 0));
    return d.toISOString().slice(0, 10);
  } catch {
    return String(iso || '');
  }
}

function lotNoFromSeed(seed) {
  const yy = 26;
  const n = randomInt(seed * 9.13, 1, 9999);
  return `LOT-${yy}-${String(n).padStart(4, '0')}`;
}

function expiryFromReceivedAt(receivedAt, seed) {
  // 3-24 months after received date
  const addDays = randomInt(seed * 4.77, 90, 720);
  return addDaysISO(receivedAt, addDays);
}

function dateInJan2026(seed) {
  const day = randomInt(seed, 2, 28);
  return `2026-01-${String(day).padStart(2, '0')}`;
}

function generatePurchaseOrders(count = 20) {
  const suppliers = [
    'ABSMEDIQ',
    'MedSupply',
    'CleanCo',
    'HealthPlus',
    'DermPartner',
  ];
  const statuses = ['ร่าง', 'สั่งซื้อแล้ว', 'รับบางส่วน', 'รับของแล้ว'];
  const products = Array.isArray(MOCK_PRODUCTS_FULL) ? MOCK_PRODUCTS_FULL : [];

  const list = [];
  for (let i = 1; i <= count; i++) {
    const poNo = `PO-2026-${String(i).padStart(4, '0')}`;
    const orderedAt = dateInJan2026(i);
    const supplier = pickOne(i * 11.7, suppliers) || 'ABSMEDIQ';

    // Ensure all statuses appear: cycle through statuses
    const status = statuses[(i - 1) % statuses.length];

    // Keep movement rows predictable (1 item per PO) while still having 50 POs.
    const itemsCount = 1;
    const usedCodes = new Set();
    const items = [];

    for (let j = 0; j < itemsCount; j++) {
      // pick unique product
      let p = null;
      for (let attempt = 0; attempt < 20; attempt++) {
        p = pickOne(i * 100 + j * 7 + attempt, products);
        const code = String(p?.code || '').trim();
        if (code && !usedCodes.has(code)) break;
        p = null;
      }

      const code =
        String(p?.code || '').trim() ||
        `PRD${String((i + j) % 999).padStart(3, '0')}`;
      usedCodes.add(code);

      const qtyBase = randomInt(i * 31 + j * 13, 1, 60);
      const qty =
        String(p?.unit || '').trim() === 'ชิ้น'
          ? Math.max(5, qtyBase)
          : qtyBase;
      const cost = Number.isFinite(Number(p?.cost))
        ? Number(p.cost)
        : randomInt(i * 17 + j, 10, 900);

      items.push({
        code,
        nameTh: String(p?.nameTh || '').trim() || `สินค้า ${code}`,
        unit: String(p?.unit || '').trim() || 'ชิ้น',
        qty,
        price: cost,
      });
    }

    // Apply receiving fields for specific statuses
    let lastReceivedAt = '';
    if (status === 'รับของแล้ว') {
      lastReceivedAt = addDaysISO(orderedAt, randomInt(i * 9.1, 1, 5));
      for (const it of items) {
        it.receivedQty = it.qty;
        it.receivedAt = lastReceivedAt;

        const lotNo = lotNoFromSeed(i * 101.7 + Number(it.qty || 0));
        const expiryDate = expiryFromReceivedAt(lastReceivedAt, i * 303.9);
        it.receivedLots = [
          {
            qty: Number(it.receivedQty || 0),
            receivedAt: lastReceivedAt,
            lotNo,
            expiryDate,
          },
        ];
      }
    } else if (status === 'รับบางส่วน') {
      lastReceivedAt = addDaysISO(orderedAt, randomInt(i * 8.4, 1, 6));

      // ensure at least 1 line has partial received and at least 1 has received > 0
      const partialIndex = randomInt(i * 5.2, 0, Math.max(0, items.length - 1));

      for (let k = 0; k < items.length; k++) {
        const it = items[k];
        const orderedQty = Number(it.qty) || 0;

        let receivedQty = 0;
        if (k === partialIndex) {
          receivedQty =
            orderedQty <= 1 ? 0 : randomInt(i * 77 + k * 19, 1, orderedQty - 1);
        } else {
          // mix of 0 / fully received / small received
          const mode = randomInt(i * 41 + k * 7, 0, 2);
          if (mode === 0) receivedQty = 0;
          if (mode === 1)
            receivedQty = Math.min(
              orderedQty,
              randomInt(
                i * 61 + k * 5,
                1,
                Math.max(1, Math.floor(orderedQty / 2))
              )
            );
          if (mode === 2) receivedQty = orderedQty;
        }

        it.receivedQty = Math.max(0, Math.min(orderedQty, receivedQty));
        if (it.receivedQty > 0) {
          it.receivedAt = lastReceivedAt;

          const lotNo = lotNoFromSeed(i * 501.1 + k * 17.3 + orderedQty);
          const expiryDate = expiryFromReceivedAt(
            lastReceivedAt,
            i * 777.7 + k * 19.9
          );
          it.receivedLots = [
            {
              qty: Number(it.receivedQty || 0),
              receivedAt: lastReceivedAt,
              lotNo,
              expiryDate,
            },
          ];
        }
      }

      // make sure not fully received accidentally
      if (items.every((it) => Number(it.receivedQty) >= Number(it.qty))) {
        const it = items[partialIndex] || items[0];
        if (it) it.receivedQty = Math.max(0, Number(it.qty) - 1);
      }
    }

    const notes =
      status === 'ร่าง'
        ? 'รออนุมัติ'
        : status === 'สั่งซื้อแล้ว'
          ? 'สั่งซื้อแล้ว รอรับสินค้า'
          : status === 'รับบางส่วน'
            ? 'รับสินค้าแล้วบางส่วน'
            : 'รับสินค้าเรียบร้อย';

    list.push({
      id: poNo,
      poNo,
      orderedAt,
      supplier,
      status,
      notes,
      lastReceivedAt,
      items,
    });
  }

  return list;
}

export const MOCK_PURCHASE_ORDERS_FULL = generatePurchaseOrders(50);

const toNumber = (n) => {
  const v = Number(n);
  return Number.isFinite(v) ? v : 0;
};

const normalize = (orders) => {
  const list = Array.isArray(orders) ? orders : [];
  return list.map((o) => {
    const items = Array.isArray(o?.items) ? o.items : [];
    return {
      ...o,
      id: String(o?.id || o?.poNo || ''),
      poNo: String(o?.poNo || ''),
      orderedAt: String(o?.orderedAt || ''),
      supplier: String(o?.supplier || ''),
      status: String(o?.status || ''),
      notes: String(o?.notes || ''),
      lastReceivedAt: String(o?.lastReceivedAt || ''),
      items: items.map((it) => {
        const receivedLotsRaw = Array.isArray(it?.receivedLots)
          ? it.receivedLots
          : [];

        const receivedLots = receivedLotsRaw
          .filter((l) => l && typeof l === 'object')
          .map((l) => {
            const receivedAt = String(l?.receivedAt || '').trim();
            const safeReceivedAt = receivedAt || '2026-01-01';
            const lotNo = String(l?.lotNo || '').trim();
            const expiryDate = String(l?.expiryDate || '').trim();
            const qty = toNumber(l?.qty);

            if (!lotNo && !expiryDate) {
              return { qty, receivedAt };
            }

            return {
              qty,
              receivedAt,
              lotNo: lotNo || lotNoFromSeed(qty || 1),
              expiryDate:
                expiryDate || expiryFromReceivedAt(safeReceivedAt, qty || 1),
            };
          });

        return {
          code: String(it?.code || ''),
          nameTh: String(it?.nameTh || ''),
          unit: String(it?.unit || ''),
          qty: toNumber(it?.qty),
          price: toNumber(it?.price),
          receivedQty:
            it?.receivedQty === null || it?.receivedQty === undefined
              ? undefined
              : toNumber(it?.receivedQty),
          receivedAt: String(it?.receivedAt || '').trim(),
          receivedLots,
        };
      }),
    };
  });
};

export default normalize(MOCK_PURCHASE_ORDERS_FULL);
