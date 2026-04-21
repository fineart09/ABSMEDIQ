import { useEffect, useMemo, useRef, useState } from 'react';
import MOCK_PRODUCTS_FULL from '../mocks/productsFull';

const enCollator = new Intl.Collator('en', {
  sensitivity: 'base',
  numeric: true,
});

const thCollator = new Intl.Collator('th', {
  sensitivity: 'base',
  numeric: true,
});

const getDisplayName = (product) =>
  String(product?.nameTh || product?.nameEn || '').trim();

const getNameSortBucket = (name) => {
  if (/^[A-Za-z]/.test(name)) return 0;
  if (/^[\u0E00-\u0E7F]/.test(name)) return 1;
  return 2;
};

const compareProductName = (a, b) => {
  const nameA = getDisplayName(a);
  const nameB = getDisplayName(b);
  const bucketA = getNameSortBucket(nameA);
  const bucketB = getNameSortBucket(nameB);

  if (bucketA !== bucketB) return bucketA - bucketB;

  if (bucketA === 0) {
    const byEn = enCollator.compare(nameA, nameB);
    if (byEn !== 0) return byEn;
  }

  if (bucketA === 1) {
    const byTh = thCollator.compare(nameA, nameB);
    if (byTh !== 0) return byTh;
  }

  return thCollator.compare(nameA, nameB);
};

const compareBySortKey = (a, b, key) => {
  if (key === 'code') {
    return enCollator.compare(String(a?.code || ''), String(b?.code || ''));
  }
  if (key === 'productId') {
    return enCollator.compare(
      String(a?.productId || ''),
      String(b?.productId || '')
    );
  }
  if (key === 'name') {
    return compareProductName(a, b);
  }
  if (key === 'category') {
    return thCollator.compare(
      String(a?.category || ''),
      String(b?.category || '')
    );
  }
  if (key === 'status') {
    return thCollator.compare(String(a?.status || ''), String(b?.status || ''));
  }
  return 0;
};

const toCurrency = (n) => {
  const value = Number(n);
  if (!Number.isFinite(value)) return '-';
  return value.toLocaleString('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

function ProductModal({ product, onClose, onViewMovements }) {
  if (!product) return null;

  const displayName = product.nameTh || product.nameEn || '-';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal modal--customer-details"
        role="dialog"
        aria-modal="true"
        aria-label={`รายละเอียดสินค้า ${
          product.nameTh || product.nameEn || ''
        } (${product.code})`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>รายละเอียดสินค้า</h3>
        </div>
        <div className="modal-body">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '160px 1fr',
              gap: '8px 12px',
            }}
          >
            <div>รหัสสินค้า</div>
            <div>
              <span className="badge badge--hn">{product.code}</span>
            </div>
            <div>ชื่อสินค้า</div>
            <div>{displayName}</div>
            <div>หมวดหมู่</div>
            <div>{product.category || '-'}</div>
            <div>คลัง</div>
            <div>{product.warehouse || '-'}</div>
            <div>หน่วย</div>
            <div>{product.unit || '-'}</div>
            <div>ราคา</div>
            <div>{toCurrency(product.price)}</div>
            <div>คงเหลือ</div>
            <div>
              {Number.isFinite(Number(product.stock)) ? product.stock : '-'}
            </div>
            <div>สถานะ</div>
            <div>
              <span
                className={
                  'badge badge--' +
                  (product.status === 'ใช้งาน'
                    ? 'active'
                    : product.status === 'ไม่ใช้งาน'
                      ? 'inactive'
                      : String(product.status || '').toLowerCase())
                }
              >
                {product.status || '-'}
              </span>
            </div>
            <div>รายละเอียด</div>
            <div style={{ whiteSpace: 'pre-wrap' }}>
              {product.description || '-'}
            </div>
          </div>
        </div>
        <div
          className="modal-actions"
          style={{ justifyContent: 'space-between' }}
        >
          <button
            type="button"
            className="button"
            onClick={() => {
              onViewMovements?.(product);
              onClose?.();
            }}
          >
            รายการเคลื่อนไหวสินค้า
          </button>
          <button type="button" className="button" onClick={onClose}>
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
}

const normalizeProducts = (src) => {
  const list = Array.isArray(src) ? src : [];
  const usedCodes = new Set();
  return list.map((p, i) => {
    const rawCode = String(p?.code || '').trim();
    let code = rawCode || `PRD${String(i + 1).padStart(3, '0')}`;
    while (usedCodes.has(code)) {
      code = `PRD${String(i + 1 + usedCodes.size).padStart(3, '0')}`;
    }
    usedCodes.add(code);

    const stock = Number.isFinite(Number(p?.stock)) ? Number(p.stock) : 0;
    const status = p?.status || (stock > 0 ? 'ใช้งาน' : 'ไม่ใช้งาน');
    const productId = String(p?.productId || '').trim();
    return {
      ...p,
      code,
      productId,
      stock,
      status,
    };
  });
};

export default function Products({
  products,
  onEdit,
  onCreateNew,
  onIssueStock,
  onPurchase,
  onViewIngredients,
  onReceiveStock,
  onViewMovements,
  onViewConsumables,
}) {
  const [query, setQuery] = useState('');
  const stickyRef = useRef(null);
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [importMessage] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

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

  const base = useMemo(() => {
    const src = Array.isArray(products)
      ? products
      : Array.isArray(MOCK_PRODUCTS_FULL)
        ? MOCK_PRODUCTS_FULL
        : [];
    return normalizeProducts(src);
  }, [products]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return base;
    return base.filter((p) => {
      return (
        String(p.code || '')
          .toLowerCase()
          .includes(q) ||
        String(p.productId || '')
          .toLowerCase()
          .includes(q) ||
        String(p.nameTh || '')
          .toLowerCase()
          .includes(q) ||
        String(p.nameEn || '')
          .toLowerCase()
          .includes(q) ||
        String(p.category || '')
          .toLowerCase()
          .includes(q) ||
        String(p.status || '')
          .toLowerCase()
          .includes(q)
      );
    });
  }, [query, base]);

  const ordered = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const dir = sortDirection === 'desc' ? -1 : 1;
      const bySelected = compareBySortKey(a, b, sortBy);
      if (bySelected !== 0) return bySelected * dir;

      const byName = compareBySortKey(a, b, 'name');
      if (byName !== 0) return byName;

      return enCollator.compare(String(a?.code || ''), String(b?.code || ''));
    });
  }, [filtered, sortBy, sortDirection]);

  const toggleSort = (key) => {
    if (sortBy === key) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(key);
      setSortDirection('asc');
    }
    setPage(1);
  };

  const getSortMark = (key) => {
    if (sortBy !== key) return '↕';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  const getAriaSort = (key) => {
    if (sortBy !== key) return 'none';
    return sortDirection === 'asc' ? 'ascending' : 'descending';
  };

  const totalPages = Math.max(1, Math.ceil(ordered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const paged = ordered.slice(start, end);

  const visiblePages = useMemo(() => {
    const pages = [];
    const total = totalPages;
    const current = currentPage;
    const maxSimple = 7;
    if (total <= maxSimple) {
      for (let i = 1; i <= total; i++) pages.push(i);
      return pages;
    }
    pages.push(1);
    let s = Math.max(2, current - 2);
    let e = Math.min(total - 1, current + 2);
    if (s > 2) pages.push('…');
    for (let i = s; i <= e; i++) pages.push(i);
    if (e < total - 1) pages.push('…');
    pages.push(total);
    return pages;
  }, [currentPage, totalPages]);

  useEffect(() => {
    setPage(1);
  }, [query, pageSize]);

  return (
    <section className="products-page">
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
          <h1 className="page-title">รายการสินค้า</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              type="button"
              className="button button--orange"
              onClick={() => (onIssueStock || onViewMovements)?.()}
            >
              เบิกสินค้า
            </button>
            <button
              type="button"
              className="button button--blue"
              onClick={() => onViewIngredients?.()}
            >
              Ingredient
            </button>
            <button
              type="button"
              className="button"
              onClick={() => onPurchase?.()}
            >
              สั่งซื้อสินค้า
            </button>
            <button
              type="button"
              className="button"
              onClick={() => onReceiveStock?.()}
            >
              นำสินค้าเข้า stock
            </button>
            <button
              type="button"
              className="button"
              onClick={() => onCreateNew?.()}
            >
              สร้างรายการสินค้าใหม่
            </button>

            <button
              type="button"
              className="button"
              onClick={() => onViewMovements?.()}
            >
              รายการเคลื่อนไหวสินค้า
            </button>

            <button
              type="button"
              className="button"
              onClick={() => onViewConsumables?.()}
            >
              วัสดุสิ้นเปลืองและอื่นๆ
            </button>
          </div>
        </div>

        <div
          className="toolbar"
          style={{ display: 'flex', gap: 8, marginBottom: 12 }}
        >
          <input
            aria-label="ค้นหารายการสินค้า"
            placeholder="ค้นหารหัส / ID สินค้า / ชื่อสินค้า / หมวดหมู่ / สถานะ"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ flex: 1, padding: '8px 10px' }}
          />
          <button type="button" className="button" onClick={() => setQuery('')}>
            ล้าง
          </button>
        </div>

        {importMessage ? (
          <div style={{ color: '#6b7280', marginBottom: 12 }}>
            {importMessage}
          </div>
        ) : null}
      </div>

      <div className="table-card" style={{ overflowX: 'auto' }}>
        <table
          className="customers-table"
          style={{ width: '100%', borderCollapse: 'collapse' }}
        >
          <thead>
            <tr>
              <th style={{ padding: 8 }} aria-sort={getAriaSort('code')}>
                <button
                  type="button"
                  onClick={() => toggleSort('code')}
                  style={{
                    border: 0,
                    background: 'transparent',
                    padding: 0,
                    font: 'inherit',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                  aria-label={`เรียงตามรหัส ${
                    sortBy === 'code' && sortDirection === 'asc'
                      ? 'จาก Z ไป A'
                      : 'จาก A ไป Z'
                  }`}
                >
                  รหัส {getSortMark('code')}
                </button>
              </th>
              <th style={{ padding: 8 }} aria-sort={getAriaSort('productId')}>
                <button
                  type="button"
                  onClick={() => toggleSort('productId')}
                  style={{
                    border: 0,
                    background: 'transparent',
                    padding: 0,
                    font: 'inherit',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                  aria-label={`เรียงตาม ID สินค้า ${
                    sortBy === 'productId' && sortDirection === 'asc'
                      ? 'จาก Z ไป A'
                      : 'จาก A ไป Z'
                  }`}
                >
                  ID สินค้า {getSortMark('productId')}
                </button>
              </th>
              <th style={{ padding: 8 }} aria-sort={getAriaSort('name')}>
                <button
                  type="button"
                  onClick={() => toggleSort('name')}
                  style={{
                    border: 0,
                    background: 'transparent',
                    padding: 0,
                    font: 'inherit',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                  aria-label={`เรียงตามชื่อสินค้า ${
                    sortBy === 'name' && sortDirection === 'asc'
                      ? 'จาก Z ไป A'
                      : 'จาก A ไป Z'
                  }`}
                >
                  ชื่อสินค้า {getSortMark('name')}
                </button>
              </th>
              <th style={{ padding: 8 }} aria-sort={getAriaSort('category')}>
                <button
                  type="button"
                  onClick={() => toggleSort('category')}
                  style={{
                    border: 0,
                    background: 'transparent',
                    padding: 0,
                    font: 'inherit',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                  aria-label={`เรียงตามหมวดหมู่ ${
                    sortBy === 'category' && sortDirection === 'asc'
                      ? 'จาก Z ไป A'
                      : 'จาก A ไป Z'
                  }`}
                >
                  หมวดหมู่ {getSortMark('category')}
                </button>
              </th>
              <th style={{ padding: 8 }}>ราคา</th>
              <th style={{ padding: 8 }}>คงเหลือ</th>
              <th style={{ padding: 8 }} aria-sort={getAriaSort('status')}>
                <button
                  type="button"
                  onClick={() => toggleSort('status')}
                  style={{
                    border: 0,
                    background: 'transparent',
                    padding: 0,
                    font: 'inherit',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                  aria-label={`เรียงตามสถานะ ${
                    sortBy === 'status' && sortDirection === 'asc'
                      ? 'จาก Z ไป A'
                      : 'จาก A ไป Z'
                  }`}
                >
                  สถานะ {getSortMark('status')}
                </button>
              </th>
              <th style={{ padding: 8 }}>ดูข้อมูล / แก้ไข</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((p) => (
              <tr key={p.code} style={{ borderTop: '1px solid #eaeaea' }}>
                <td style={{ padding: 8 }}>{p.code}</td>
                <td style={{ padding: 8 }}>{p.productId || '-'}</td>
                <td style={{ padding: 8 }}>
                  {p.nameTh || p.nameEn || '-'}
                  {p.nameEn ? (
                    <div
                      style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}
                    >
                      {p.nameEn}
                    </div>
                  ) : null}
                </td>
                <td style={{ padding: 8 }}>{p.category || '-'}</td>
                <td style={{ padding: 8 }}>{toCurrency(p.price)}</td>
                <td style={{ padding: 8 }}>
                  {Number.isFinite(Number(p.stock)) ? p.stock : '-'}
                </td>
                <td style={{ padding: 8 }}>
                  <span
                    className={
                      'badge badge--' +
                      (p.status === 'ใช้งาน'
                        ? 'active'
                        : p.status === 'ไม่ใช้งาน'
                          ? 'inactive'
                          : String(p.status || '').toLowerCase())
                    }
                  >
                    {p.status}
                  </span>
                </td>
                <td style={{ padding: 8 }}>
                  <button
                    type="button"
                    className="button"
                    onClick={() => setSelected(p)}
                    style={{ marginRight: 8 }}
                  >
                    ดูข้อมูล
                  </button>
                  <button
                    type="button"
                    className="button"
                    onClick={() => onEdit?.(p)}
                  >
                    แก้ไขรายละเอียดสินค้า
                  </button>
                </td>
              </tr>
            ))}
            {paged.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  style={{ padding: 12, textAlign: 'center', color: '#6b7280' }}
                >
                  ไม่พบข้อมูลในหน้านี้
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          marginTop: 12,
        }}
        aria-label="ตัวแบ่งหน้า"
      >
        <div style={{ color: '#6b7280' }}>
          แสดง {paged.length ? start + 1 : 0}-{Math.min(end, ordered.length)}{' '}
          จาก {ordered.length} รายการ
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <label
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            ต่อหน้า
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value) || 10)}
              className="select"
              aria-label="จำนวนรายการต่อหน้า"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </label>
          <button
            type="button"
            className="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
            aria-label="ก่อนหน้า"
          >
            ก่อนหน้า
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {visiblePages.map((p, idx) =>
              p === '…' ? (
                <span key={`ellipsis-${idx}`} style={{ padding: '0 6px' }}>
                  …
                </span>
              ) : (
                <button
                  key={`page-${p}`}
                  type="button"
                  className="button"
                  onClick={() => setPage(p)}
                  disabled={p === currentPage}
                  aria-current={p === currentPage ? 'page' : undefined}
                >
                  {p}
                </button>
              )
            )}
          </div>
          <button
            type="button"
            className="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
            aria-label="ถัดไป"
          >
            ถัดไป
          </button>
        </div>
      </div>

      {selected && (
        <ProductModal
          product={selected}
          onClose={() => setSelected(null)}
          onViewMovements={(product) => onViewMovements?.(product)}
        />
      )}
    </section>
  );
}
