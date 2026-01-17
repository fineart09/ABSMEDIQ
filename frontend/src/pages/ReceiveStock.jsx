import { useMemo, useRef, useState } from 'react';

const normalizeImportedProducts = (src) => {
  const list = Array.isArray(src) ? src : [];
  const usedCodes = new Set();

  return list
    .map((p, i) => {
      const rawCode = String(p?.code || '').trim();
      let code = rawCode || `PRD${String(i + 1).padStart(3, '0')}`;
      while (usedCodes.has(code)) {
        code = `PRD${String(i + 1 + usedCodes.size).padStart(3, '0')}`;
      }
      usedCodes.add(code);

      const stock = Number.isFinite(Number(p?.stock)) ? Number(p.stock) : 0;
      const status = p?.status || (stock > 0 ? 'ใช้งาน' : 'ไม่ใช้งาน');

      return {
        ...p,
        code,
        stock,
        status,
      };
    })
    .filter(Boolean);
};

const parseImportJson = (text) => {
  const parsed = JSON.parse(text);
  if (Array.isArray(parsed)) return parsed;
  if (parsed && Array.isArray(parsed.products)) return parsed.products;
  if (parsed && Array.isArray(parsed.data)) return parsed.data;
  return null;
};

export default function ReceiveStock({
  existingProducts,
  onCancel,
  onImported,
}) {
  const inputRef = useRef(null);
  const [message, setMessage] = useState('');
  const [preview, setPreview] = useState(null);

  const existingCodeSet = useMemo(() => {
    const set = new Set();
    (Array.isArray(existingProducts) ? existingProducts : []).forEach((p) => {
      if (p?.code) set.add(String(p.code));
    });
    return set;
  }, [existingProducts]);

  const onPickFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    setMessage('');
    setPreview(null);

    if (!file) return;

    try {
      const text = await file.text();
      const importedRaw = parseImportJson(text);
      if (!importedRaw) {
        setMessage(
          'ไฟล์ไม่ถูกต้อง: รองรับ JSON เป็น Array หรือ { products: [...] }'
        );
        return;
      }

      const imported = normalizeImportedProducts(importedRaw);
      const incomingByCode = new Map(imported.map((p) => [p.code, p]));
      let willUpdate = 0;
      let willAdd = 0;

      for (const code of incomingByCode.keys()) {
        if (existingCodeSet.has(code)) willUpdate += 1;
        else willAdd += 1;
      }

      setPreview({
        fileName: file.name,
        total: incomingByCode.size,
        willAdd,
        willUpdate,
        products: Array.from(incomingByCode.values()),
      });
      setMessage('อ่านไฟล์สำเร็จ ตรวจสอบข้อมูลแล้วกด “ยืนยันนำเข้า”');
    } catch (err) {
      setMessage(
        `อ่านไฟล์ไม่สำเร็จ: ${err?.message || 'ไม่สามารถอ่าน/แปลงไฟล์ได้'}`
      );
    }
  };

  const confirmImport = () => {
    if (!preview?.products?.length) {
      setMessage('ยังไม่มีข้อมูลให้นำเข้า');
      return;
    }
    onImported?.(preview.products);
  };

  return (
    <section>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          marginBottom: 12,
        }}
      >
        <h1 className="page-title">รับสินค้าเข้า stock</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" className="button" onClick={() => onCancel?.()}>
            ย้อนกลับ
          </button>
        </div>
      </div>

      <div className="form-card" style={{ width: 'min(1100px, 100%)' }}>
        <input
          ref={inputRef}
          type="file"
          accept="application/json,.json"
          style={{ display: 'none' }}
          onChange={onPickFile}
        />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 10,
          }}
        >
          <button
            type="button"
            className="button"
            onClick={() => inputRef.current?.click()}
          >
            เลือกไฟล์สินค้า (JSON)
          </button>
          <button
            type="button"
            className="button"
            onClick={confirmImport}
            disabled={!preview?.products?.length}
          >
            ยืนยันนำเข้า
          </button>
        </div>

        {message ? (
          <div style={{ color: '#6b7280', marginBottom: 12 }}>{message}</div>
        ) : null}

        {preview ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '180px 1fr',
              gap: '8px 12px',
            }}
          >
            <div>ไฟล์</div>
            <div>{preview.fileName}</div>
            <div>จำนวนรายการในไฟล์</div>
            <div>{preview.total}</div>
            <div>เพิ่มใหม่</div>
            <div>{preview.willAdd}</div>
            <div>อัปเดตของเดิม</div>
            <div>{preview.willUpdate}</div>
          </div>
        ) : null}

        {preview?.products?.length ? (
          <div
            className="table-card"
            style={{ marginTop: 14, overflowX: 'auto' }}
          >
            <table
              className="customers-table"
              style={{ width: '100%', borderCollapse: 'collapse' }}
            >
              <thead>
                <tr>
                  <th style={{ padding: 8 }}>รหัส</th>
                  <th style={{ padding: 8 }}>ชื่อสินค้า</th>
                  <th style={{ padding: 8 }}>หมวดหมู่</th>
                  <th style={{ padding: 8 }}>คงเหลือ</th>
                  <th style={{ padding: 8 }}>สถานะ</th>
                </tr>
              </thead>
              <tbody>
                {preview.products.slice(0, 25).map((p) => (
                  <tr key={p.code} style={{ borderTop: '1px solid #eaeaea' }}>
                    <td style={{ padding: 8 }}>{p.code}</td>
                    <td style={{ padding: 8 }}>
                      {p.nameTh || p.nameEn || '-'}
                    </td>
                    <td style={{ padding: 8 }}>{p.category || '-'}</td>
                    <td style={{ padding: 8 }}>
                      {Number.isFinite(Number(p.stock)) ? p.stock : '-'}
                    </td>
                    <td style={{ padding: 8 }}>{p.status || '-'}</td>
                  </tr>
                ))}
                {preview.products.length > 25 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: 10, color: '#6b7280' }}>
                      แสดงตัวอย่าง 25 รายการจาก {preview.products.length} รายการ
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </section>
  );
}
