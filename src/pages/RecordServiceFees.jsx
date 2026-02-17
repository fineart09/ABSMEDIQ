import { useEffect, useRef } from 'react';

export default function RecordServiceFees({
  onOpenServiceFees,
  onOpenServiceRecord,
}) {
  const stickyRef = useRef(null);

  useEffect(() => {
    const el = stickyRef.current;
    if (!el) return;

    const update = () => {
      const h = el.getBoundingClientRect().height;
      document.documentElement.style.setProperty(
        '--page-sticky-height',
        `${Math.ceil(h)}px`
      );
    };

    update();

    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(() => update());
      ro.observe(el);
      return () => ro.disconnect();
    }

    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return (
    <section className="record-service-fees-page">
      <div
        className="page-sticky-header page-sticky-header--fixed"
        ref={stickyRef}
      >
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
              className="button button--blue"
              onClick={() => onOpenServiceRecord?.()}
              disabled={!onOpenServiceRecord}
            >
              บันทึกรายการบริการ
            </button>
            <button
              type="button"
              className="button"
              onClick={() => onOpenServiceFees?.()}
            >
              รายการค่าบริการ/ผู้ฝึกสอน
            </button>
          </div>
        </div>
      </div>

      <div className="table-card" style={{ overflowX: 'auto' }}>
        <div style={{ padding: 12, textAlign: 'center', color: '#6b7280' }}>
          ยังไม่มีข้อมูลในหน้านี้
        </div>
      </div>
    </section>
  );
}
