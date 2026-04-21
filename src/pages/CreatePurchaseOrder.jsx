import { useEffect, useMemo, useState } from 'react';

const todayISO = () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const toNumber = (n) => {
  const v = Number(n);
  return Number.isFinite(v) ? v : 0;
};

const sumTotal = (items) =>
  (Array.isArray(items) ? items : []).reduce((acc, it) => {
    const qty = toNumber(it?.qty);
    const price = toNumber(it?.price);
    return acc + qty * price;
  }, 0);

const formatCurrency = (value) =>
  Number(value || 0).toLocaleString('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const formatDateTH = (iso) => {
  if (!iso) return '';
  const [y, m, d] = String(iso).split('-');
  if (!y || !m || !d) return String(iso);
  return `${d}/${m}/${y}`;
};

const normalizeText = (value) =>
  String(value || '')
    .trim()
    .toLowerCase();

const getProductDisplayName = (product) =>
  String(
    product?.nameTh || product?.nameEn || product?.name || product?.code || ''
  ).trim();

const formatProductOptionText = (product) => {
  const code = String(product?.code || '').trim();
  const name = getProductDisplayName(product);
  if (!code && !name) return '';
  if (!code) return name;
  if (!name) return code;
  return `${code} - ${name}`;
};

const isProductLikeMatch = (product, query) => {
  const q = normalizeText(query);
  if (!q) return true;
  const haystack = [
    product?.code,
    product?.nameTh,
    product?.nameEn,
    product?.name,
  ]
    .map((v) => normalizeText(v))
    .join(' ');
  return haystack.includes(q);
};

const escapeHtml = (value) =>
  String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const createPurchaseOrderHtml = ({
  poNo,
  orderedAt,
  supplier,
  items,
  total,
  vatRate = 0.07,
}) => {
  const vat = total * vatRate;
  const grandTotal = total + vat;
  const safeSupplier = supplier || '-';
  const safePoNo = poNo || '-';
  const safeDate = formatDateTH(orderedAt) || '-';
  const rows = (Array.isArray(items) ? items : []).map((it, idx) => {
    const qty = toNumber(it?.qty);
    const price = toNumber(it?.price);
    const lineTotal = qty * price;
    const name = String(it?.nameTh || it?.nameEn || it?.code || '').trim();
    const unit = String(it?.unit || '').trim();
    return `
      <tr>
        <td>${idx + 1}</td>
        <td>${name || '-'}</td>
        <td class="amount">${qty}</td>
        <td>${unit || '-'}</td>
        <td class="amount">${formatCurrency(price)}</td>
        <td class="amount">${formatCurrency(lineTotal)}</td>
      </tr>`;
  });

  const bodyRows = rows.length
    ? rows.join('')
    : `
      <tr>
        <td colspan="6" class="empty-row">ไม่มีรายการสินค้า</td>
      </tr>`;

  return `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <title>ใบสั่งซื้อ (Purchase Order)</title>
  <style>
    body {
      font-family: 'Tahoma', sans-serif;
      padding: 24px;
      background: #f5f7fb;
      color: #0f172a;
    }
    .po-toolbar {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-bottom: 14px;
    }
    .po-btn {
      border: 1px solid #0f766e;
      background: #0f766e;
      color: #ffffff;
      padding: 8px 14px;
      border-radius: 10px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
    }
    .po-btn--ghost {
      background: #ffffff;
      color: #0f766e;
    }
    .po-container {
      max-width: 860px;
      margin: auto;
      background: #ffffff;
      border: 1px solid #e5e7eb;
      padding: 28px;
      border-radius: 16px;
      box-shadow: 0 16px 40px rgba(15, 23, 42, 0.08);
    }
    .po-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      border-bottom: 1px dashed #e2e8f0;
      padding-bottom: 16px;
    }
    .header {
      font-weight: 700;
      font-size: 22px;
      letter-spacing: 0.5px;
      color: #0f766e;
    }
    .subheader {
      font-size: 12px;
      color: #64748b;
      margin-top: 4px;
    }
    .logo img {
      height: 64px;
    }
    .badge {
      display: inline-block;
      background: #ecfeff;
      color: #0e7490;
      border: 1px solid #a5f3fc;
      padding: 4px 10px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 600;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-top: 20px;
    }
    .info-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 12px 14px;
      line-height: 1.5;
    }
    .meta-card {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .meta-row {
      display: flex;
      justify-content: space-between;
      gap: 12px;
    }
    .meta-label {
      color: #64748b;
    }
    table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      margin-top: 18px;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      overflow: hidden;
    }
    th,
    td {
      padding: 10px 12px;
      text-align: left;
    }
    thead th {
      background: #0f766e;
      color: #ffffff;
      font-weight: 600;
    }
    tbody td {
      border-top: 1px solid #e2e8f0;
    }
    tbody tr:nth-child(even) {
      background: #f8fafc;
    }
    .amount {
      text-align: right;
      white-space: nowrap;
    }
    .empty-row {
      text-align: center;
      color: #64748b;
      padding: 16px;
    }
    .total-section {
      margin-top: 18px;
      display: flex;
      justify-content: flex-end;
    }
    .total-card {
      background: #0f766e;
      color: #ffffff;
      padding: 14px 18px;
      border-radius: 12px;
      min-width: 280px;
      box-shadow: 0 8px 20px rgba(15, 118, 110, 0.25);
    }
    .total-card p {
      margin: 4px 0;
      display: flex;
      justify-content: space-between;
      gap: 12px;
    }
    .total-card strong {
      font-size: 16px;
    }
    .signature-section {
      display: flex;
      justify-content: space-between;
      margin-top: 48px;
      gap: 24px;
    }
    .signature-box {
      text-align: center;
      width: 45%;
      border-top: 1px dashed #94a3b8;
      padding-top: 8px;
      color: #334155;
    }
    @media (max-width: 720px) {
      body {
        padding: 16px;
      }
      .po-header {
        flex-direction: column;
        align-items: flex-start;
      }
      .info-grid {
        grid-template-columns: 1fr;
      }
      .signature-section {
        flex-direction: column;
      }
      .signature-box {
        width: 100%;
      }
    }
    @page {
      size: A4;
      margin: 12mm;
    }
    @media print {
      html,
      body {
        width: 210mm;
        min-height: 297mm;
        background: #ffffff;
        padding: 0;
        color: #0f172a;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .po-toolbar {
        display: none;
      }
      .po-container {
        box-shadow: none;
        border: 1px solid #e5e7eb;
        border-radius: 0;
        padding: 12mm;
        margin: 0;
        width: auto;
        max-width: none;
      }
    }
  </style>
</head>
<body>

<div class="po-container">
  <div class="po-toolbar">
    <button class="po-btn po-btn--ghost" onclick="window.print()">บันทึกเป็น PDF</button>
    <button class="po-btn" onclick="window.print()">สั่งพิมพ์</button>
  </div>
  <div class="po-header">
    <div class="logo">
      <img src="logo.png" alt="โลโก้บริษัท">
    </div>
    <div>
      <div class="header">ใบสั่งซื้อ (PURCHASE ORDER)</div>
      <div class="subheader">เอกสารคำสั่งซื้อสินค้า</div>
    </div>
    <div class="badge">เลขที่ PO: ${safePoNo}</div>
  </div>
    
  <!-- ผู้จำหน่าย & ผู้สั่งซื้อ -->
  <div class="info-grid">
    <div class="info-card">
      <strong>ผู้จำหน่าย (Supplier): ${safeSupplier}</strong><br>
      14/51-53 ถนนสุขุมวิท แขวงบางพลี<br>
      อำเภอบางพลี จังหวัดสมุทรปราการ 10540<br>
      ประเทศไทย<br>
      โทร: 02-xxxxxxx อีเมล: info@mdhealthcare.co.th
    </div>
    <div class="info-card">
      <strong>ผู้ซื้อ: บริษัท ตัวอย่าง จำกัด</strong><br>
      123 ถนนสุขุมวิท กรุงเทพฯ 10110<br>
      เลขประจำตัวผู้เสียภาษี: 01055xxxxxxxx
    </div>
  </div>

  <div class="info-card meta-card" style="margin-top: 16px;">
    <div class="meta-row">
      <span class="meta-label">เลขที่ PO</span>
      <strong>${safePoNo}</strong>
    </div>
    <div class="meta-row">
      <span class="meta-label">วันที่</span>
      <span>${safeDate}</span>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>ลำดับ</th>
        <th>ชื่อสินค้า</th>
        <th>จำนวน</th>
        <th>หน่วย</th>
        <th>ราคา/หน่วย</th>
        <th>จำนวนเงิน</th>
      </tr>
    </thead>
    <tbody>
${bodyRows}
    </tbody>
  </table>

  <div class="total-section">
    <div class="total-card">
      <p><span>รวมเงิน</span><span>${formatCurrency(total)} บาท</span></p>
      <p><span>ภาษีมูลค่าเพิ่ม (7%)</span><span>${formatCurrency(vat)} บาท</span></p>
      <p><strong>ยอดเงินรวมทั้งสิ้น</strong><strong>${formatCurrency(grandTotal)} บาท</strong></p>
    </div>
  </div>

  <div class="signature-section">
    <div class="signature-box">
      <p>.......................................</p>
      <p>ผู้สั่งซื้อ<br>(ลงนามและประทับตรา)</p>
    </div>
    <div class="signature-box">
      <p>.......................................</p>
      <p>ผู้ขาย<br>(ลงนามรับทราบ)</p>
    </div>
  </div>
</div>

</body>
</html>`;
};

const createPurchaseOrderAttachmentHtml = ({
  poNo,
  orderedAt,
  supplier,
  items,
  notes,
  productList,
}) => {
  const safeSupplier = escapeHtml(supplier || '-');
  const safePoNo = escapeHtml(poNo || '-');
  const safeDate = escapeHtml(formatDateTH(orderedAt) || '-');
  const safeNotes = escapeHtml(notes || '');

  const products = Array.isArray(productList) ? productList : [];

  const rows = (Array.isArray(items) ? items : []).map((it, idx) => {
    const code = String(it?.code || '').trim();
    const qty = toNumber(it?.qty);
    const p = products.find((x) => String(x?.code || '').trim() === code);
    const description = String(p?.description || '').trim();
    const itemNote = String(it?.note || '').trim();
    const detailText = [description, itemNote ? `หมายเหตุ: ${itemNote}` : '']
      .filter(Boolean)
      .join('\n');
    const unit = String(it?.unit || p?.unit || '').trim();
    const name = String(
      it?.nameTh || it?.nameEn || p?.nameTh || p?.nameEn || p?.name || ''
    ).trim();

    return `
      <tr>
        <td class="center">${idx + 1}</td>
        <td>${escapeHtml(name || '-')}</td>
        <td class="amount qty-col">${escapeHtml(qty)}</td>
        <td>${escapeHtml(unit || '-')}</td>
        <td class="desc">${escapeHtml(detailText || '-')}</td>
      </tr>`;
  });

  const bodyRows = rows.length
    ? rows.join('')
    : `
      <tr>
        <td colspan="5" class="empty-row">ไม่มีรายการสินค้า</td>
      </tr>`;

  return `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <title>เอกสารแนบใบสั่งซื้อ</title>
  <style>
    body {
      font-family: 'Tahoma', sans-serif;
      padding: 24px;
      background: #f5f7fb;
      color: #0f172a;
    }
    .container {
      max-width: 860px;
      margin: auto;
      background: #ffffff;
      border: 1px solid #e5e7eb;
      padding: 28px;
      border-radius: 16px;
      box-shadow: 0 16px 40px rgba(15, 23, 42, 0.08);
    }
    .header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
      border-bottom: 1px dashed #e2e8f0;
      padding-bottom: 16px;
    }
    .title {
      font-weight: 800;
      font-size: 20px;
      letter-spacing: 0.3px;
      color: #0f766e;
    }
    .subtitle {
      font-size: 12px;
      color: #64748b;
      margin-top: 6px;
      line-height: 1.45;
    }
    .badge {
      display: inline-block;
      background: #ecfeff;
      color: #0e7490;
      border: 1px solid #a5f3fc;
      padding: 4px 10px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 700;
      white-space: nowrap;
    }
    .meta {
      display: grid;
      grid-template-columns: 160px 1fr;
      gap: 8px 12px;
      margin-top: 16px;
      padding: 12px 14px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
    }
    .meta .label {
      color: #64748b;
    }
    table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      margin-top: 16px;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      overflow: hidden;
    }
    thead th {
      background: #0f766e;
      color: #ffffff;
      font-weight: 700;
      padding: 10px 12px;
      text-align: left;
      font-size: 13px;
    }
    tbody td {
      border-top: 1px solid #e2e8f0;
      padding: 10px 12px;
      vertical-align: top;
      font-size: 13px;
    }
    tbody tr:nth-child(even) {
      background: #f8fafc;
    }
    .amount {
      text-align: right;
      white-space: nowrap;
    }
    .qty-col {
      padding-left: 8px;
      padding-right: 8px;
    }
    .center {
      text-align: center;
      white-space: nowrap;
    }
    .desc {
      white-space: pre-wrap;
      line-height: 1.5;
    }
    .empty-row {
      text-align: center;
      color: #64748b;
      padding: 16px;
    }
    .footer-note {
      margin-top: 14px;
      padding: 12px 14px;
      background: #fff7ed;
      border: 1px solid #fed7aa;
      border-radius: 12px;
      color: #9a3412;
      font-size: 12px;
      line-height: 1.5;
    }
    @page {
      size: A4;
      margin: 12mm;
    }
    @media print {
      html,
      body {
        width: 210mm;
        min-height: 297mm;
        background: #ffffff;
        padding: 0;
        color: #0f172a;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .container {
        box-shadow: none;
        border: 1px solid #e5e7eb;
        border-radius: 0;
        padding: 12mm;
        margin: 0;
        width: auto;
        max-width: none;
      }
      .footer-note {
        color: #000000;
        background: #ffffff;
        border: 1px solid #e5e7eb;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div>
        <div class="title">เอกสารแนบใบสั่งซื้อสินค้า (ATTACHMENT)</div>
        <div class="subtitle">รายละเอียดสินค้า/หมายเหตุรายรายการ เพื่อให้ผู้จำหน่ายทราบข้อมูลสำคัญของสินค้า</div>
      </div>
      <div class="badge">PO: ${safePoNo}</div>
    </div>

    <div class="meta">
      <div class="label">ผู้จำหน่าย</div><div>${safeSupplier}</div>
      <div class="label">วันที่สั่งซื้อ</div><div>${safeDate}</div>
    </div>

    <table>
      <thead>
        <tr>
          <th style="width: 44px;" class="center">#</th>
          <th>ชื่อสินค้า</th>
          <th style="width: 64px;" class="amount qty-col">จำนวน</th>
          <th style="width: 70px;">หน่วย</th>
          <th>รายละเอียดสินค้า / หมายเหตุ</th>
        </tr>
      </thead>
      <tbody>
        ${bodyRows}
      </tbody>
    </table>

    <div class="footer-note">
      <strong>หมายเหตุใบสั่งซื้อ:</strong> ${safeNotes || '-'}
    </div>
  </div>
</body>
</html>`;
};

const nextPoNo = () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `PO-${yyyy}${mm}${dd}-001`;
};

export default function CreatePurchaseOrder({
  title = 'สร้างรายการสั่งซื้อ',
  initial,
  products,
  suppliers,
  onCancel,
  onDelete,
  onSave,
}) {
  const isEdit = Boolean(initial);

  const productList = useMemo(
    () => (Array.isArray(products) ? products : []),
    [products]
  );

  const supplierOptions = useMemo(() => {
    const list = Array.isArray(suppliers) ? suppliers : [];
    const names = list.map((s) => String(s?.name || '').trim()).filter(Boolean);
    const unique = Array.from(new Set(names));
    unique.sort((a, b) => a.localeCompare(b, 'th'));
    return unique;
  }, [suppliers]);

  const [poNo, setPoNo] = useState(initial?.poNo || nextPoNo());
  const [orderedAt, setOrderedAt] = useState(initial?.orderedAt || todayISO());
  const [supplier, setSupplier] = useState(initial?.supplier || '');
  const [status, setStatus] = useState(initial?.status || 'ร่าง');
  const [notes, setNotes] = useState(initial?.notes || '');
  const [printAttachment, setPrintAttachment] = useState(false);
  const [activeProductRow, setActiveProductRow] = useState(null);
  const [items, setItems] = useState(
    Array.isArray(initial?.items) && initial.items.length
      ? initial.items.map((it) => ({
          code: String(it?.code || ''),
          nameTh: String(it?.nameTh || ''),
          unit: String(it?.unit || ''),
          qty: toNumber(it?.qty || 1),
          price: toNumber(it?.price || 0),
          note: String(it?.note || ''),
          shipDate: String(it?.shipDate || ''),
          productSearch: formatProductOptionText(it),
        }))
      : []
  );

  useEffect(() => {
    if (!initial) {
      setPoNo(nextPoNo());
      setOrderedAt(todayISO());
      setSupplier('');
      setStatus('ร่าง');
      setNotes('');
      setPrintAttachment(false);
      setActiveProductRow(null);
      setItems([]);
      return;
    }

    setPoNo(initial?.poNo || nextPoNo());
    setOrderedAt(initial?.orderedAt || todayISO());
    setSupplier(initial?.supplier || '');
    setStatus(initial?.status || 'ร่าง');
    setNotes(initial?.notes || '');
    setPrintAttachment(false);
    setActiveProductRow(null);
    setItems(
      Array.isArray(initial?.items) && initial.items.length
        ? initial.items.map((it) => ({
            code: String(it?.code || ''),
            nameTh: String(it?.nameTh || ''),
            unit: String(it?.unit || ''),
            qty: toNumber(it?.qty || 1),
            price: toNumber(it?.price || 0),
            note: String(it?.note || ''),
            shipDate: String(it?.shipDate || ''),
            productSearch: formatProductOptionText(it),
          }))
        : []
    );
  }, [initial]);

  const addItem = () => {
    const first = productList[0];
    setItems((prev) => [
      ...prev,
      {
        code: first?.code ? String(first.code) : '',
        nameTh: first?.nameTh
          ? String(first.nameTh)
          : first?.nameEn
            ? String(first.nameEn)
            : '',
        unit: first?.unit ? String(first.unit) : '',
        qty: 1,
        price: toNumber(first?.cost ?? first?.price ?? 0),
        note: '',
        shipDate: '',
        productSearch: formatProductOptionText(first),
      },
    ]);
  };

  const updateItem = (idx, patch) => {
    setItems((prev) =>
      prev.map((it, i) => (i === idx ? { ...it, ...patch } : it))
    );
  };

  const removeItem = (idx) => {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const selectProductForItem = (idx, product) => {
    if (!product) return;
    updateItem(idx, {
      code: product?.code ? String(product.code) : '',
      nameTh: getProductDisplayName(product),
      unit: product?.unit ? String(product.unit) : '',
      price: toNumber(product?.cost ?? product?.price ?? 0),
      productSearch: formatProductOptionText(product),
    });
    setActiveProductRow(null);
  };

  const handleProductSearchChange = (idx, value) => {
    const nextValue = String(value || '');
    const exactCodeMatch = productList.find(
      (p) => normalizeText(p?.code) === normalizeText(nextValue)
    );

    if (exactCodeMatch) {
      selectProductForItem(idx, exactCodeMatch);
      return;
    }

    updateItem(idx, {
      productSearch: nextValue,
      code: '',
      nameTh: '',
      unit: '',
      price: 0,
    });
  };

  useEffect(() => {
    if (activeProductRow === null) return;
    if (activeProductRow < items.length) return;
    setActiveProductRow(null);
  }, [activeProductRow, items.length]);

  const activeProductSearchText = useMemo(() => {
    if (activeProductRow === null) return '';
    return String(items?.[activeProductRow]?.productSearch || '').trim();
  }, [activeProductRow, items]);

  const activeProductSuggestions = useMemo(() => {
    if (activeProductRow === null) return [];
    return productList
      .filter((p) => isProductLikeMatch(p, activeProductSearchText))
      .slice(0, 20);
  }, [activeProductRow, activeProductSearchText, productList]);

  const total = useMemo(() => sumTotal(items), [items]);

  const validation = useMemo(() => {
    const errors = {};
    if (!String(poNo || '').trim()) errors.poNo = 'กรุณากรอกเลขที่ใบสั่งซื้อ';
    if (!String(orderedAt || '').trim())
      errors.orderedAt = 'กรุณาเลือกวันที่สั่งซื้อ';
    if (!String(supplier || '').trim()) errors.supplier = 'กรุณากรอกผู้จำหน่าย';

    const validItems = (Array.isArray(items) ? items : []).filter((it) => {
      const code = String(it?.code || '').trim();
      const qty = toNumber(it?.qty);
      return code && qty > 0;
    });

    // Prevent duplicate product codes (receiving & stock updates are code-based)
    const codeCounts = new Map();
    for (const it of validItems) {
      const code = String(it?.code || '').trim();
      if (!code) continue;
      codeCounts.set(code, (codeCounts.get(code) || 0) + 1);
    }
    const dupCodes = Array.from(codeCounts.entries())
      .filter(([, count]) => count > 1)
      .map(([code]) => code);

    if (validItems.length === 0)
      errors.items = 'กรุณาเพิ่มสินค้าอย่างน้อย 1 รายการ';

    if (!errors.items && dupCodes.length) {
      errors.items = `มีรหัสสินค้าซ้ำ: ${dupCodes.slice(0, 3).join(', ')}${
        dupCodes.length > 3 ? ` (+${dupCodes.length - 3})` : ''
      }`;
    }

    return errors;
  }, [poNo, orderedAt, supplier, items]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (Object.keys(validation).length) return;

    const payload = {
      id: String(initial?.id || poNo),
      poNo: String(poNo).trim(),
      orderedAt: String(orderedAt).trim(),
      supplier: String(supplier).trim(),
      status: isEdit ? String(status).trim() : 'ร่าง',
      notes: String(notes || '').trim(),
      items: (Array.isArray(items) ? items : [])
        .map((it) => ({
          code: String(it?.code || '').trim(),
          nameTh: String(it?.nameTh || '').trim(),
          unit: String(it?.unit || '').trim(),
          qty: toNumber(it?.qty),
          price: toNumber(it?.price),
          note: String(it?.note || '').trim(),
          shipDate: String(it?.shipDate || '').trim(),
        }))
        .filter((it) => it.code && it.qty > 0),
    };

    onSave?.(payload);
  };

  return (
    <section>
      <h1 className="page-title">{title}</h1>

      <form className="form-card" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label htmlFor="poNo">เลขที่ใบสั่งซื้อ</label>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
            }}
          >
            <div style={{ flex: 1 }}>
              <input
                id="poNo"
                className="input"
                value={poNo}
                onChange={(e) => setPoNo(e.target.value)}
                placeholder="เช่น PO-20260116-001"
              />
              {validation.poNo ? (
                <div className="field-error">{validation.poNo}</div>
              ) : null}
            </div>
            {isEdit ? (
              <button
                type="button"
                className="button"
                onClick={() => {
                  setStatus('สั่งซื้อแล้ว');

                  const w = window.open('', '_blank');
                  if (!w) return;

                  const baseHtml = createPurchaseOrderHtml({
                    poNo: String(poNo || '').trim(),
                    orderedAt: String(orderedAt || '').trim(),
                    supplier: String(supplier || '').trim(),
                    items,
                    total,
                  });

                  const extractFirstStyleText = (html) => {
                    const m = String(html || '').match(
                      /<style[^>]*>([\s\S]*?)<\/style>/i
                    );
                    return m?.[1] ? String(m[1]) : '';
                  };

                  const extractBodyInner = (html) => {
                    const m = String(html || '').match(
                      /<body[^>]*>([\s\S]*?)<\/body>/i
                    );
                    return m?.[1] ? String(m[1]).trim() : '';
                  };

                  let htmlToPrint = baseHtml;

                  if (printAttachment) {
                    const attachmentHtml = createPurchaseOrderAttachmentHtml({
                      poNo: String(poNo || '').trim(),
                      orderedAt: String(orderedAt || '').trim(),
                      supplier: String(supplier || '').trim(),
                      items,
                      notes,
                      productList,
                    });

                    const attachmentCss = extractFirstStyleText(attachmentHtml);
                    const attachmentBody = extractBodyInner(attachmentHtml);

                    if (attachmentCss) {
                      htmlToPrint = htmlToPrint.replace(
                        '</style>',
                        `\n/* Attachment styles */\n${attachmentCss}\n</style>`
                      );
                    }

                    if (attachmentBody) {
                      htmlToPrint = htmlToPrint.replace(
                        /<\/body>\s*<\/html>\s*$/i,
                        `\n<div style="page-break-before: always;"></div>\n${attachmentBody}\n</body>\n</html>`
                      );
                    }
                  }

                  w.document.open();
                  w.document.write(htmlToPrint);
                  w.document.close();
                }}
              >
                สั่งซื้อสินค้า
              </button>
            ) : null}
          </div>

          <label htmlFor="orderedAt">วันที่สั่งซื้อ</label>
          <div>
            <input
              id="orderedAt"
              type="date"
              className="input"
              value={orderedAt}
              onChange={(e) => setOrderedAt(e.target.value)}
            />
            {validation.orderedAt ? (
              <div className="field-error">{validation.orderedAt}</div>
            ) : null}
          </div>

          <label htmlFor="supplier">ผู้จำหน่าย</label>
          <div>
            {supplierOptions.length ? (
              <select
                id="supplier"
                className="select"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                aria-label="ผู้จำหน่าย"
              >
                <option value="">- เลือกผู้จำหน่าย -</option>
                {supplier &&
                !supplierOptions.includes(String(supplier).trim()) ? (
                  <option value={supplier}>{supplier}</option>
                ) : null}
                {supplierOptions.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id="supplier"
                className="input"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                placeholder="เช่น ABSMEDIQ / MedSupply"
              />
            )}
            {validation.supplier ? (
              <div className="field-error">{validation.supplier}</div>
            ) : null}
          </div>

          {isEdit ? (
            <>
              <label htmlFor="status">สถานะ</label>
              <div>
                <select
                  id="status"
                  className="select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  {['ร่าง', 'สั่งซื้อแล้ว', 'รับของแล้ว'].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </>
          ) : null}

          <label htmlFor="notes">หมายเหตุ</label>
          <div>
            <textarea
              id="notes"
              className="textarea"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="หมายเหตุเพิ่มเติม (ถ้ามี)"
            />
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 8,
            }}
          >
            <h3 style={{ margin: 0 }}>รายการสินค้า</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {isEdit ? (
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: 13,
                    color: '#111827',
                    userSelect: 'none',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={printAttachment}
                    onChange={(e) => setPrintAttachment(e.target.checked)}
                  />
                  พิมพ์เอกสารแนบใบสั่งซื้อ
                </label>
              ) : null}

              <button type="button" className="button" onClick={addItem}>
                เพิ่มสินค้า
              </button>
            </div>
          </div>

          {validation.items ? (
            <div className="field-error">{validation.items}</div>
          ) : null}

          <div
            className="table-card"
            style={{ overflowX: 'auto', marginTop: 10 }}
          >
            <table
              className="customers-table po-items-table"
              style={{ width: '100%', borderCollapse: 'collapse' }}
            >
              <thead>
                <tr>
                  <th style={{ padding: 8 }}>สินค้า</th>
                  <th style={{ padding: 8 }}>ชื่อสินค้า</th>
                  <th style={{ padding: 8 }}>หน่วย</th>
                  <th style={{ padding: 8 }}>จำนวน</th>
                  <th style={{ padding: 8 }}>ราคา/หน่วย</th>
                  <th style={{ padding: 8 }}>รวม</th>
                  <th style={{ padding: 8 }}>หมายเหตุรายการ</th>
                  {isEdit ? (
                    <th style={{ padding: 8 }}>วันจัดส่งสินค้า</th>
                  ) : null}
                  <th style={{ padding: 8 }}>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it, idx) => {
                  const lineTotal = toNumber(it.qty) * toNumber(it.price);

                  return (
                    <tr
                      key={`${it.code || 'item'}-${idx}`}
                      style={{ borderTop: '1px solid #eaeaea' }}
                    >
                      <td style={{ padding: 8 }}>
                        <div className="po-item-product">
                          <input
                            className="input"
                            value={String(it.productSearch || '')}
                            onFocus={() => setActiveProductRow(idx)}
                            onChange={(e) =>
                              handleProductSearchChange(idx, e.target.value)
                            }
                            onKeyDown={(e) => {
                              if (e.key === 'Escape') setActiveProductRow(null);
                            }}
                            placeholder="พิมพ์ค้นหา รหัสหรือชื่อสินค้า"
                            autoComplete="off"
                          />
                        </div>
                      </td>
                      <td style={{ padding: 8 }}>
                        <input
                          className="input po-item-name-input"
                          value={it.nameTh}
                          onChange={(e) =>
                            updateItem(idx, { nameTh: e.target.value })
                          }
                          placeholder="ชื่อสินค้า (แก้ไขได้)"
                        />
                      </td>
                      <td style={{ padding: 8 }}>
                        <input
                          className="input"
                          value={it.unit}
                          onChange={(e) =>
                            updateItem(idx, { unit: e.target.value })
                          }
                          placeholder="หน่วย"
                          style={{ width: 120 }}
                        />
                      </td>
                      <td style={{ padding: 8 }}>
                        <input
                          className="input"
                          type="number"
                          min={0}
                          step="any"
                          value={it.qty}
                          onChange={(e) =>
                            updateItem(idx, { qty: toNumber(e.target.value) })
                          }
                          inputMode="decimal"
                          style={{ width: 120 }}
                        />
                      </td>
                      <td style={{ padding: 8 }}>
                        <input
                          className="input"
                          type="number"
                          min={0}
                          step={0.01}
                          value={it.price}
                          onChange={(e) =>
                            updateItem(idx, { price: toNumber(e.target.value) })
                          }
                          inputMode="decimal"
                          style={{ width: 140 }}
                        />
                      </td>
                      <td style={{ padding: 8 }}>
                        {lineTotal.toLocaleString('th-TH', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>

                      <td style={{ padding: 8 }}>
                        <input
                          className="input"
                          value={String(it.note || '')}
                          onChange={(e) =>
                            updateItem(idx, { note: e.target.value })
                          }
                          placeholder="หมายเหตุของรายการนี้"
                          style={{ width: 220 }}
                        />
                      </td>

                      {isEdit ? (
                        <td style={{ padding: 8 }}>
                          <input
                            className="input"
                            type="date"
                            value={String(it.shipDate || '')}
                            onChange={(e) =>
                              updateItem(idx, { shipDate: e.target.value })
                            }
                            style={{ width: 150 }}
                          />
                        </td>
                      ) : null}

                      <td style={{ padding: 8 }}>
                        <button
                          type="button"
                          className="button"
                          onClick={() => removeItem(idx)}
                        >
                          ลบ
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {items.length === 0 ? (
                  <tr>
                    <td
                      colSpan={isEdit ? 9 : 8}
                      style={{ padding: 16, color: '#6b7280' }}
                    >
                      ยังไม่มีรายการสินค้า — กด “เพิ่มสินค้า” เพื่อเริ่มต้น
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          {activeProductRow !== null ? (
            <div className="po-product-search-panel" role="region">
              <div className="po-product-search-panel-header">
                <strong>รายการสินค้าที่ค้นหา</strong>
                <button
                  type="button"
                  className="button"
                  onClick={() => setActiveProductRow(null)}
                >
                  ปิด
                </button>
              </div>

              <div className="po-product-search-panel-list">
                {productList.length === 0 ? (
                  <div className="po-item-product-empty">ไม่มีสินค้า</div>
                ) : activeProductSuggestions.length === 0 ? (
                  <div className="po-item-product-empty">
                    ไม่พบสินค้าที่ค้นหา
                  </div>
                ) : (
                  activeProductSuggestions.map((p, optionIdx) => (
                    <button
                      key={`${String(p?.code || 'product')}-${optionIdx}`}
                      type="button"
                      className="po-item-product-option"
                      onClick={() => selectProductForItem(activeProductRow, p)}
                    >
                      {formatProductOptionText(p)}
                    </button>
                  ))
                )}
              </div>
            </div>
          ) : null}

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: 10,
              color: '#111827',
            }}
          >
            <div>
              <strong>ยอดรวม:</strong>{' '}
              {total.toLocaleString('th-TH', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
          </div>
        </div>

        <div
          className="form-actions"
          style={{ marginTop: 16, justifyContent: 'space-between' }}
        >
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {isEdit && String(status || '').trim() === 'ร่าง' && onDelete ? (
              <button
                type="button"
                className="button button--danger"
                onClick={() => {
                  const poLabel = String(poNo || initial?.poNo || '').trim();
                  const ok = window.confirm(
                    `ยืนยันลบใบสั่งซื้อ ${poLabel || ''} ?\nการลบจะไม่สามารถกู้คืนได้`
                  );
                  if (!ok) return;
                  onDelete?.({ ...initial, poNo: poLabel || initial?.poNo });
                }}
              >
                ลบใบสั่งซื้อ
              </button>
            ) : null}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              className="button"
              onClick={() => onCancel?.()}
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="button"
              disabled={Object.keys(validation).length > 0}
            >
              บันทึก
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
