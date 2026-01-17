// Mock products dataset used by Products page

export const MOCK_PRODUCTS_FULL = [
  {
    code: 'PRD001',
    nameTh: 'ครีมบำรุงผิวหน้า',
    nameEn: 'Facial Moisturizer',
    category: 'สกินแคร์',
    unit: 'กระปุก',
    price: 890,
    cost: 520,
    description: 'มอยส์เจอร์ไรเซอร์สำหรับผิวแห้ง ชุ่มชื้นยาวนาน',
    supplier: 'ABSMEDIQ',
  },
  {
    code: 'PRD002',
    nameTh: 'เซรั่มวิตามินซี',
    nameEn: 'Vitamin C Serum',
    category: 'สกินแคร์',
    unit: 'ขวด',
    price: 1290,
    cost: 760,
    description: 'ช่วยให้ผิวดูกระจ่างใส ลดรอยดำ',
    supplier: 'ABSMEDIQ',
  },
  {
    code: 'PRD003',
    nameTh: 'กันแดด SPF50+',
    nameEn: 'Sunscreen SPF50+',
    category: 'สกินแคร์',
    unit: 'หลอด',
    price: 990,
    cost: 580,
    description: 'ปกป้อง UVA/UVB เนื้อบางเบา ไม่เหนอะหนะ',
    supplier: 'ABSMEDIQ',
  },
  {
    code: 'PRD004',
    nameTh: 'คลีนเซอร์ล้างหน้า',
    nameEn: 'Gentle Cleanser',
    category: 'สกินแคร์',
    unit: 'หลอด',
    price: 590,
    cost: 320,
    description: 'ทำความสะอาดผิวอย่างอ่อนโยน เหมาะกับผิวแพ้ง่าย',
    supplier: 'ABSMEDIQ',
  },
  {
    code: 'PRD005',
    nameTh: 'มาสก์หน้าชุ่มชื้น',
    nameEn: 'Hydrating Mask',
    category: 'มาสก์',
    unit: 'แผ่น',
    price: 79,
    cost: 35,
    description: 'เติมความชุ่มชื้นเร่งด่วน',
    supplier: 'ABSMEDIQ',
  },
  {
    code: 'PRD006',
    nameTh: 'ยาชา (ใช้โดยผู้เชี่ยวชาญ)',
    nameEn: 'Topical Anesthetic',
    category: 'เวชภัณฑ์',
    unit: 'หลอด',
    price: 450,
    cost: 240,
    description: 'ใช้ภายใต้การดูแลของบุคลากรทางการแพทย์',
    supplier: 'MedSupply',
  },
  {
    code: 'PRD007',
    nameTh: 'เจลล้างมือแอลกอฮอล์',
    nameEn: 'Alcohol Hand Gel',
    category: 'ของใช้',
    unit: 'ขวด',
    price: 159,
    cost: 85,
    description: 'แอลกอฮอล์ 70% กลิ่นอ่อน',
    supplier: 'CleanCo',
  },
  {
    code: 'PRD008',
    nameTh: 'สำลีแผ่น',
    nameEn: 'Cotton Pads',
    category: 'ของใช้',
    unit: 'แพ็ค',
    price: 120,
    cost: 60,
    description: 'สำลีเนื้อนุ่ม ไม่เป็นขุย',
    supplier: 'CleanCo',
  },
  {
    code: 'PRD009',
    nameTh: 'ครีมลดรอยแผลเป็น',
    nameEn: 'Scar Cream',
    category: 'สกินแคร์',
    unit: 'หลอด',
    price: 690,
    cost: 410,
    description: 'ช่วยให้รอยดูจางลงเมื่อใช้ต่อเนื่อง',
    supplier: 'ABSMEDIQ',
  },
  {
    code: 'PRD010',
    nameTh: 'น้ำเกลือ',
    nameEn: 'Saline',
    category: 'เวชภัณฑ์',
    unit: 'ขวด',
    price: 45,
    cost: 18,
    description: 'สำหรับทำความสะอาดแผล/ล้างอุปกรณ์',
    supplier: 'MedSupply',
  },
  {
    code: 'PRD011',
    nameTh: 'เข็มฉีดยา 3ml',
    nameEn: 'Syringe 3ml',
    category: 'เวชภัณฑ์',
    unit: 'ชิ้น',
    price: 12,
    cost: 6,
    description: 'ใช้สำหรับการรักษาตามมาตรฐานคลินิก',
    supplier: 'MedSupply',
  },
  {
    code: 'PRD012',
    nameTh: 'ผ้าก๊อซ',
    nameEn: 'Sterile Gauze',
    category: 'เวชภัณฑ์',
    unit: 'แพ็ค',
    price: 65,
    cost: 32,
    description: 'ปลอดเชื้อ เหมาะสำหรับทำแผล',
    supplier: 'MedSupply',
  },
];

function seeded(seed) {
  // deterministic pseudo-random in [0, 1)
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function randomInt(seed, min, max) {
  const r = seeded(seed * 1.231);
  return Math.floor(min + r * (max - min + 1));
}

function randomDate(seed) {
  // Within the last ~12 months
  const r = seeded(seed * 2.71828);
  const daysAgo = Math.floor(r * 365);
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

const ENRICHED_PRODUCTS = MOCK_PRODUCTS_FULL.map((p, i) => {
  const stock = randomInt(i + 1, 0, 120);
  const status =
    stock === 0
      ? 'ไม่ใช้งาน'
      : seeded((i + 1) * 1.414) < 0.85
      ? 'ใช้งาน'
      : 'ไม่ใช้งาน';
  return {
    ...p,
    stock,
    status,
    updatedAt: randomDate(i + 1),
  };
});

export default ENRICHED_PRODUCTS;
