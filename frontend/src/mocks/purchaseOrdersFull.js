// Mock purchase orders dataset used by Purchase pages

export const MOCK_PURCHASE_ORDERS_FULL = [
  {
    id: 'PO-2026-0001',
    poNo: 'PO-2026-0001',
    orderedAt: '2026-01-05',
    supplier: 'ABSMEDIQ',
    status: 'รับของแล้ว',
    notes: 'สั่งเติมสินค้าขายดี',
    items: [
      {
        code: 'PRD001',
        nameTh: 'ครีมบำรุงผิวหน้า',
        unit: 'กระปุก',
        qty: 12,
        price: 520,
      },
      {
        code: 'PRD002',
        nameTh: 'เซรั่มวิตามินซี',
        unit: 'ขวด',
        qty: 8,
        price: 760,
      },
    ],
  },
  {
    id: 'PO-2026-0002',
    poNo: 'PO-2026-0002',
    orderedAt: '2026-01-07',
    supplier: 'MedSupply',
    status: 'สั่งซื้อแล้ว',
    notes: '',
    items: [
      {
        code: 'PRD006',
        nameTh: 'ยาชา (ใช้โดยผู้เชี่ยวชาญ)',
        unit: 'หลอด',
        qty: 20,
        price: 240,
      },
      { code: 'PRD010', nameTh: 'น้ำเกลือ', unit: 'ขวด', qty: 100, price: 18 },
    ],
  },
  {
    id: 'PO-2026-0003',
    poNo: 'PO-2026-0003',
    orderedAt: '2026-01-10',
    supplier: 'CleanCo',
    status: 'ร่าง',
    notes: 'รออนุมัติ',
    items: [
      {
        code: 'PRD007',
        nameTh: 'เจลล้างมือแอลกอฮอล์',
        unit: 'ขวด',
        qty: 48,
        price: 85,
      },
      { code: 'PRD008', nameTh: 'สำลีแผ่น', unit: 'แพ็ค', qty: 36, price: 60 },
    ],
  },
  {
    id: 'PO-2026-0004',
    poNo: 'PO-2026-0004',
    orderedAt: '2026-01-12',
    supplier: 'ABSMEDIQ',
    status: 'สั่งซื้อแล้ว',
    notes: '',
    items: [
      {
        code: 'PRD003',
        nameTh: 'กันแดด SPF50+',
        unit: 'หลอด',
        qty: 15,
        price: 580,
      },
      {
        code: 'PRD004',
        nameTh: 'คลีนเซอร์ล้างหน้า',
        unit: 'หลอด',
        qty: 20,
        price: 320,
      },
    ],
  },
];

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
      items: items.map((it) => ({
        code: String(it?.code || ''),
        nameTh: String(it?.nameTh || ''),
        unit: String(it?.unit || ''),
        qty: toNumber(it?.qty),
        price: toNumber(it?.price),
      })),
    };
  });
};

export default normalize(MOCK_PURCHASE_ORDERS_FULL);
