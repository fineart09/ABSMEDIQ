import { useEffect, useRef } from 'react';

export default function Ingredients({ onBack }) {
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
    <section className="ingredients-page">
      <div className="page-sticky-header" ref={stickyRef}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
            marginBottom: 12,
          }}
        >
          <h1 className="page-title">Ingredient</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              type="button"
              className="button button--solid"
              onClick={() => onBack?.()}
            >
              กลับไปหน้ารายการสินค้า
            </button>
          </div>
        </div>
        <div style={{ color: '#6b7280' }}>
          หน้านี้สำหรับจัดการส่วนประกอบ/สูตรสินค้า (กำลังพัฒนา)
        </div>
      </div>

      <div className="table-card" style={{ overflowX: 'auto' }}>
        <div style={{ padding: 16, color: '#6b7280' }}>
          ยังไม่มีข้อมูล Ingredient
        </div>
      </div>
    </section>
  );
}
