export default function RecordServiceFees({ onOpenServiceFees }) {
  return (
    <section className="record-service-fees-page">
      <div className="page-sticky-header">
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
          <h1 className="page-title">บันทึกรายการค่าบริการ</h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              type="button"
              className="button"
              onClick={() => onOpenServiceFees?.()}
            >
              รายการค่าบริการ
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
