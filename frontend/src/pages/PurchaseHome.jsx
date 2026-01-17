export default function PurchaseHome({ onNavigate }) {
  return (
    <section>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          marginBottom: 12,
          flexWrap: 'wrap',
        }}
      >
        <h1 className="page-title">สั่งซื้อสินค้า</h1>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            flexWrap: 'wrap',
          }}
        >
          {[
            'รายการสั่งซื้อสินค้า',
            'สร้างรายการสั่งซื้อ',
            'รับสินค้าจากรายการสั่งซื้อ',
            'ใบเสนอราคา',
          ].map((label) => (
            <button
              key={label}
              type="button"
              className="button"
              onClick={() => onNavigate?.(label)}
            >
              {label}
            </button>
          ))}

          <button
            type="button"
            className="button button--solid"
            onClick={() => onNavigate?.('รายการสินค้า')}
          >
            กลับไปหน้ารายการสินค้า
          </button>
        </div>
      </div>

      <div className="table-card" style={{ padding: 16 }}>
        <h3 style={{ marginTop: 0 }}>ทางลัด</h3>
        <p style={{ margin: 0, color: '#6b7280' }}>
          หน้านี้เป็นเมนูรวมสำหรับงานสั่งซื้อสินค้า
        </p>
      </div>
    </section>
  );
}
