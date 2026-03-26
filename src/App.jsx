import { useCallback, useEffect, useRef, useState } from 'react';
import { formatDateDMY } from './utils/date';
import CreateCustomer from './pages/CreateCustomer.jsx';
import CreateProduct from './pages/CreateProduct.jsx';
import Customers from './pages/Customers.jsx';
import EditCustomer from './pages/EditCustomer.jsx';
import EditProduct from './pages/EditProduct.jsx';
import EditConsumable from './pages/EditConsumable.jsx';
import EditIngredient from './pages/EditIngredient.jsx';
import CreatePurchaseOrder from './pages/CreatePurchaseOrder.jsx';
import Products from './pages/Products.jsx';
import PurchaseOrders from './pages/PurchaseOrders.jsx';
import Suppliers from './pages/Suppliers.jsx';
import CreateSupplier from './pages/CreateSupplier.jsx';
import ReceiveStock from './pages/ReceiveStock.jsx';
import ProductMovements from './pages/ProductMovements.jsx';
import Consumables from './pages/Consumables.jsx';
import ReceiveConsumablesStock from './pages/ReceiveConsumablesStock.jsx';
import Ingredients from './pages/Ingredients.jsx';
import ConsumableMovements from './pages/ConsumableMovements.jsx';
import IngredientMovements from './pages/IngredientMovements.jsx';
import ReceiveIngredientsStock from './pages/ReceiveIngredientsStock.jsx';
import ServiceFees from './pages/ServiceFees.jsx';
import RecordServiceFees from './pages/RecordServiceFees.jsx';
import CreateServiceFee from './pages/CreateServiceFee.jsx';
import TrainersOperators from './pages/TrainersOperators.jsx';
import CreateTrainerOperator from './pages/CreateTrainerOperator.jsx';
import AppointmentCalendar from './components/AppointmentCalendar.jsx';
import AppointmentCreateModal from './components/AppointmentCreateModal.jsx';
import MOCK_PRODUCTS_FULL from './mocks/productsFull';
import MOCK_PURCHASE_ORDERS_FULL from './mocks/purchaseOrdersFull';
import SUPPLIERS_FULL from './mocks/suppliersFull';
import CONSUMABLES_FULL from './mocks/consumablesFull.js';
import INGREDIENTS_FULL from './mocks/ingredientsFull.js';
import APPOINTMENTS_STAGE, {
  APPOINTMENT_TOPICS_STAGE,
} from './mocks/appointmentsStage.js';
import SERVICE_FEES_FULL from './mocks/serviceFeesFull';
import TRAINERS_OPERATORS_FULL from './mocks/trainersOperatorsFull';
import ENRICHED_CUSTOMERS from './mocks/customersFull';

const APPOINTMENT_TOPIC_COLOR_PALETTE = [
  '#dc2626', // red
  '#ef4444', // red (bright)
  '#e11d48', // rose
  '#f43f5e', // rose (bright)
  '#db2777', // pink
  '#ec4899', // pink (bright)
  '#c026d3', // fuchsia
  '#d946ef', // fuchsia (bright)
  '#a21caf', // purple
  '#a855f7', // purple (bright)
  '#7c3aed', // violet
  '#8b5cf6', // violet (bright)
  '#4f46e5', // indigo
  '#6366f1', // indigo (bright)
  '#2563eb', // blue
  '#3b82f6', // blue (bright)
  '#0284c7', // sky
  '#0ea5e9', // sky (bright)
  '#0891b2', // cyan
  '#06b6d4', // cyan (bright)
  '#0f766e', // teal
  '#14b8a6', // teal (bright)
  '#059669', // emerald
  '#10b981', // emerald (bright)
  '#16a34a', // green
  '#22c55e', // green (bright)
  '#65a30d', // lime
  '#84cc16', // lime (bright)
  '#d97706', // amber
  '#f59e0b', // amber (bright)
];

function Modal({ open, title, onClose }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>{title}</h3>
        </div>
        <div className="modal-body">
          <p>คุณเปิดเมนู: {title}</p>
        </div>
        <div className="modal-actions">
          <button type="button" className="button" onClick={onClose}>
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
}

function AppointmentCustomerTypeModal({ open, onClose, onChoose }) {
  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label="เลือกประเภทลูกค้า"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>สร้างนัดหมาย</h3>
        </div>
        <div className="modal-body">
          <p style={{ margin: 0 }}>ลูกค้าเป็นประเภทไหน?</p>
        </div>
        <div className="modal-actions" style={{ display: 'flex', gap: 8 }}>
          <button
            type="button"
            className="button button--solid"
            onClick={() => onChoose?.('existing')}
          >
            ลูกค้ามี HN
          </button>
          <button
            type="button"
            className="button"
            onClick={() => onChoose?.('new')}
          >
            ลูกค้าใหม่
          </button>
          <button type="button" className="button" onClick={onClose}>
            ยกเลิก
          </button>
        </div>
      </div>
    </div>
  );
}

function AppointmentTopicsModal({
  open,
  topics,
  onAdd,
  onUpdateColor,
  onClose,
}) {
  const [newTopic, setNewTopic] = useState('');
  const [error, setError] = useState('');
  const [openColorFor, setOpenColorFor] = useState(null);

  const COLOR_PALETTE = APPOINTMENT_TOPIC_COLOR_PALETTE;

  useEffect(() => {
    if (!open) return;
    setNewTopic('');
    setError('');
    setOpenColorFor(null);
  }, [open]);

  if (!open) return null;

  const items = Array.isArray(topics) ? topics : [];

  const openColorKey = String(openColorFor || '')
    .trim()
    .toLowerCase();

  const getTopicName = (t) => {
    if (!t) return '';
    if (typeof t === 'string') return t;
    return String(t?.name || '').trim();
  };

  const getTopicColor = (t) => {
    if (!t || typeof t !== 'object') return '';
    return String(t?.color || '').trim();
  };

  const submit = () => {
    const raw = String(newTopic || '').trim();
    if (!raw) {
      setError('กรุณากรอกหัวข้อนัดหมาย');
      return;
    }
    onAdd?.(raw);
    setNewTopic('');
    setError('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label="หัวข้อนัดหมาย"
        onClick={(e) => e.stopPropagation()}
        onMouseDownCapture={(e) => {
          if (!openColorKey) return;
          const el = e.target;
          if (!(el instanceof Element)) return;
          const hit = el.closest(
            `[data-topic-color-trigger="${openColorKey}"], [data-topic-color-popover="${openColorKey}"]`
          );
          if (!hit) setOpenColorFor(null);
        }}
      >
        <div className="modal-header">
          <h3>หัวข้อนัดหมาย</h3>
        </div>
        <div className="modal-body">
          <div style={{ display: 'grid', gap: 10 }}>
            <div className="table-card" style={{ overflowX: 'auto' }}>
              <table
                className="customers-table"
                aria-label="ตารางหัวข้อนัดหมาย"
                style={{ width: '100%', fontSize: 12, lineHeight: 1.2 }}
              >
                <thead>
                  <tr>
                    <th style={{ width: 70 }}>ลำดับ</th>
                    <th>หัวข้อ</th>
                    <th style={{ width: 110 }}>สี</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length ? (
                    items.map((t, idx) => {
                      const name = getTopicName(t);
                      const color = getTopicColor(t);
                      const isOpen =
                        !!name &&
                        !!openColorFor &&
                        String(openColorFor).toLowerCase() ===
                          name.toLowerCase();
                      const rowKey = String(name || '')
                        .trim()
                        .toLowerCase();
                      return (
                        <tr key={name || String(idx)}>
                          <td style={{ height: 34 }}>{idx + 1}</td>
                          <td>{name || '-'}</td>
                          <td style={{ height: 34 }}>
                            <div style={{ position: 'relative' }}>
                              <button
                                type="button"
                                onClick={() => {
                                  if (!name) return;
                                  setOpenColorFor((prev) =>
                                    prev &&
                                    String(prev).toLowerCase() ===
                                      name.toLowerCase()
                                      ? null
                                      : name
                                  );
                                }}
                                disabled={!name}
                                aria-label={`เลือกสีสำหรับหัวข้อ ${name || idx + 1}`}
                                title={color || 'ไม่ระบุ'}
                                data-topic-color-trigger={rowKey}
                                style={{
                                  width: 46,
                                  height: 22,
                                  borderRadius: 8,
                                  border: '1px solid #e5e7eb',
                                  background: '#ffffff',
                                  padding: 0,
                                  cursor: name ? 'pointer' : 'not-allowed',
                                  boxShadow: color
                                    ? `inset 10px 0 0 0 ${color}`
                                    : 'none',
                                }}
                              />

                              {isOpen ? (
                                <div
                                  className="dropdown-menu dropdown-menu--compact"
                                  role="dialog"
                                  aria-label={`พาเลตสีสำหรับหัวข้อ ${name}`}
                                  data-topic-color-popover={rowKey}
                                  style={{
                                    top: 'calc(100% + 6px)',
                                    right: 0,
                                    left: 'auto',
                                    minWidth: 220,
                                    zIndex: 1000,
                                  }}
                                >
                                  <button
                                    type="button"
                                    onClick={() => {
                                      onUpdateColor?.(name, '');
                                      setOpenColorFor(null);
                                    }}
                                  >
                                    ไม่ระบุ
                                  </button>

                                  <div
                                    aria-label="ชุดสี"
                                    style={{
                                      display: 'grid',
                                      gridTemplateColumns:
                                        'repeat(6, minmax(22px, 1fr))',
                                      gap: 6,
                                      paddingTop: 4,
                                    }}
                                  >
                                    {COLOR_PALETTE.map((c) => {
                                      const selected = !!color && color === c;
                                      return (
                                        <button
                                          key={c}
                                          type="button"
                                          onClick={() => {
                                            onUpdateColor?.(name, c);
                                            setOpenColorFor(null);
                                          }}
                                          aria-label={`เลือกสี ${c}`}
                                          title={c}
                                          style={{
                                            width: 22,
                                            height: 22,
                                            borderRadius: 6,
                                            border: '1px solid #e5e7eb',
                                            background: c,
                                            boxShadow: selected
                                              ? 'inset 0 0 0 2px #111827'
                                              : 'none',
                                          }}
                                        />
                                      );
                                    })}
                                  </div>
                                </div>
                              ) : null}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={3}
                        style={{
                          textAlign: 'center',
                          color: '#6b7280',
                          height: 34,
                        }}
                      >
                        ยังไม่มีหัวข้อ
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div>
              <label
                style={{ display: 'block', fontWeight: 700, marginBottom: 6 }}
              >
                เพิ่มหัวข้อนัดหมาย
              </label>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input
                  className="input"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  placeholder="เช่น Drip วิตามิน"
                  aria-label="เพิ่มหัวข้อนัดหมาย"
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  className="button button--solid"
                  onClick={submit}
                >
                  เพิ่ม
                </button>
              </div>
              {error ? (
                <div className="field-error" style={{ marginTop: 6 }}>
                  {error}
                </div>
              ) : null}
            </div>
          </div>
        </div>
        <div className="modal-actions">
          <button type="button" className="button" onClick={onClose}>
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
}

const customerDisplayName = (c) => {
  if (!c || typeof c !== 'object') return 'ไม่ระบุ';
  const thPrefix = c?.name?.prefixTh || '';
  const thFirst = c?.name?.firstTh || '';
  const thLast = c?.name?.lastTh || '';
  const enFirst = c?.name?.firstEn || '';
  const enLast = c?.name?.lastEn || '';
  const nick = c?.name?.nickname || '';
  if (thPrefix || thFirst || thLast)
    return `${thPrefix} ${thFirst} ${thLast}`.trim().replace(/\s+/g, ' ');
  if (enFirst || enLast) return `${enFirst} ${enLast}`.trim();
  if (nick) return nick;
  return 'ไม่ระบุ';
};

function TreatmentRecordModal({
  open,
  customers,
  products,
  customerQuery,
  onCustomerQueryChange,
  selectedCustomer,
  onSelectCustomer,
  productQuery,
  onProductQueryChange,
  items,
  onAddProduct,
  onUpdateQty,
  onRemoveItem,
  statusText,
  onClose,
  onSave,
}) {
  if (!open) return null;

  const customerQ = String(customerQuery || '')
    .trim()
    .toLowerCase();
  const productQ = String(productQuery || '')
    .trim()
    .toLowerCase();

  const hasCustomerQuery = !!customerQ;
  const customerResults = hasCustomerQuery
    ? (Array.isArray(customers) ? customers : [])
        .filter((c) => c && typeof c === 'object')
        .filter((c) => String(c?.status || '').trim() !== 'ไม่ใช้งาน')
        .filter((c) => {
          const hn = String(c?.hn || '')
            .trim()
            .toLowerCase();
          const name = customerDisplayName(c).trim().toLowerCase();
          const phone = String(c?.details?.phone || '')
            .trim()
            .toLowerCase();
          const segment = String(c?.segment || '')
            .trim()
            .toLowerCase();
          const status = String(c?.status || '')
            .trim()
            .toLowerCase();

          return (
            hn.includes(customerQ) ||
            name.includes(customerQ) ||
            phone.includes(customerQ) ||
            segment.includes(customerQ) ||
            status.includes(customerQ)
          );
        })
        .slice(0, 3)
    : [];

  const hasProductQuery = !!productQ;
  const productResults = hasProductQuery
    ? (Array.isArray(products) ? products : [])
        .filter((p) => p && typeof p === 'object')
        .filter((p) => String(p?.status || '').trim() !== 'ไม่ใช้งาน')
        .filter((p) => {
          const code = String(p?.code || '').toLowerCase();
          const th = String(p?.nameTh || '').toLowerCase();
          const en = String(p?.nameEn || '').toLowerCase();
          return (
            code.includes(productQ) ||
            th.includes(productQ) ||
            en.includes(productQ)
          );
        })
        .slice(0, 3)
    : [];

  const subtotal = (Array.isArray(items) ? items : []).reduce((acc, row) => {
    const qty = Number(row?.qty);
    const price = Number(row?.price);
    const line =
      Number.isFinite(qty) && qty > 0 && Number.isFinite(price) && price >= 0
        ? qty * price
        : 0;
    return acc + line;
  }, 0);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal modal--treatment-record"
        role="dialog"
        aria-modal="true"
        aria-label="บันทึกรายการรักษา"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              flexWrap: 'wrap',
            }}
          >
            <h3 style={{ margin: 0 }}>บันทึกรายการรักษา</h3>
            <span className="badge badge--partial">{statusText}</span>
          </div>
        </div>

        <div className="modal-body">
          <div className="treatment-modal__grid">
            <div>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>
                ค้นหารายชื่อลูกค้า
              </div>
              <input
                className="input"
                placeholder="ค้นหา HN / ชื่อ / เบอร์โทร / กลุ่มลูกค้า / สถานะ"
                value={customerQuery}
                onChange={(e) => onCustomerQueryChange(e.target.value)}
              />

              <div style={{ marginTop: 10 }}>
                {selectedCustomer ? (
                  <div className="table-card" style={{ overflowX: 'auto' }}>
                    <div style={{ padding: 12 }}>
                      <div>
                        <span className="badge badge--hn badge--active">
                          {String(selectedCustomer?.hn || '-')}
                        </span>
                      </div>
                      <div style={{ marginTop: 6, fontWeight: 800 }}>
                        {customerDisplayName(selectedCustomer)}
                      </div>

                      <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
                        <button
                          type="button"
                          className="button"
                          onClick={() => onSelectCustomer(null)}
                        >
                          ล้างลูกค้า
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="table-card" style={{ overflowX: 'auto' }}>
                    <table
                      className="customers-table"
                      style={{ width: '100%', fontSize: 12, lineHeight: 1.2 }}
                    >
                      <thead>
                        <tr>
                          <th style={{ width: 110 }}>HN</th>
                          <th>ชื่อ</th>
                          <th style={{ width: 110 }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {!hasCustomerQuery ? (
                          Array.from({ length: 3 }).map((_, idx) => (
                            <tr key={`blank-customer-${idx}`}>
                              <td style={{ height: 34 }}>&nbsp;</td>
                              <td>&nbsp;</td>
                              <td>&nbsp;</td>
                            </tr>
                          ))
                        ) : (
                          <>
                            {customerResults.length ? (
                              customerResults.map((c) => (
                                <tr key={String(c?.hn || '')}>
                                  <td style={{ height: 34 }}>
                                    {String(c?.hn || '-')}
                                  </td>
                                  <td>{customerDisplayName(c)}</td>
                                  <td style={{ textAlign: 'right' }}>
                                    <button
                                      type="button"
                                      className="button button--blue"
                                      onClick={() => onSelectCustomer(c)}
                                    >
                                      เลือก
                                    </button>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td
                                  colSpan={3}
                                  style={{
                                    textAlign: 'center',
                                    color: '#6b7280',
                                    height: 34,
                                  }}
                                >
                                  ไม่พบลูกค้า
                                </td>
                              </tr>
                            )}
                            {Array.from({
                              length: Math.max(
                                0,
                                3 - Math.max(1, customerResults.length)
                              ),
                            }).map((_, idx) => (
                              <tr key={`pad-customer-${idx}`}>
                                <td style={{ height: 34 }}>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                              </tr>
                            ))}
                          </>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            <div>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>
                เพิ่มสินค้าเข้ารายการ
              </div>
              <input
                className="input"
                placeholder="ค้นหารหัสสินค้า หรือชื่อสินค้า"
                value={productQuery}
                onChange={(e) => onProductQueryChange(e.target.value)}
              />

              <div
                className="table-card"
                style={{
                  marginTop: 10,
                  overflowX: 'auto',
                }}
              >
                <table
                  className="customers-table"
                  style={{ width: '100%', fontSize: 12, lineHeight: 1.2 }}
                >
                  <thead>
                    <tr>
                      <th style={{ width: 110 }}>รหัส</th>
                      <th>สินค้า</th>
                      <th style={{ width: 110, textAlign: 'right' }}>ราคา</th>
                      <th style={{ width: 110 }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {!hasProductQuery ? (
                      Array.from({ length: 3 }).map((_, idx) => (
                        <tr key={`blank-product-${idx}`}>
                          <td style={{ height: 34 }}>&nbsp;</td>
                          <td>&nbsp;</td>
                          <td>&nbsp;</td>
                          <td>&nbsp;</td>
                        </tr>
                      ))
                    ) : (
                      <>
                        {productResults.length ? (
                          productResults.map((p) => (
                            <tr key={String(p?.code || '')}>
                              <td style={{ height: 34 }}>
                                {String(p?.code || '-')}
                              </td>
                              <td>{String(p?.nameTh || p?.nameEn || '-')}</td>
                              <td style={{ textAlign: 'right' }}>
                                {Number(p?.price || 0).toLocaleString('th-TH')}
                              </td>
                              <td style={{ textAlign: 'right' }}>
                                <button
                                  type="button"
                                  className="button button--blue"
                                  onClick={() => onAddProduct(p)}
                                >
                                  เพิ่ม
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={4}
                              style={{
                                textAlign: 'center',
                                color: '#6b7280',
                                height: 34,
                              }}
                            >
                              ไม่พบสินค้า
                            </td>
                          </tr>
                        )}
                        {Array.from({
                          length: Math.max(
                            0,
                            3 - Math.max(1, productResults.length)
                          ),
                        }).map((_, idx) => (
                          <tr key={`pad-product-${idx}`}>
                            <td style={{ height: 34 }}>&nbsp;</td>
                            <td>&nbsp;</td>
                            <td>&nbsp;</td>
                            <td>&nbsp;</td>
                          </tr>
                        ))}
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 14, fontWeight: 800 }}>
            รายการสินค้าในบิล
          </div>
          <div
            className="table-card"
            style={{ marginTop: 10, overflowX: 'auto' }}
          >
            <table className="customers-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th style={{ width: 110 }}>รหัส</th>
                  <th>สินค้า</th>
                  <th style={{ width: 120, textAlign: 'right' }}>ราคา</th>
                  <th style={{ width: 120 }}>จำนวน</th>
                  <th style={{ width: 130, textAlign: 'right' }}>รวม</th>
                  <th style={{ width: 90 }}></th>
                </tr>
              </thead>
              <tbody>
                {(Array.isArray(items) ? items : []).length ? (
                  items.map((row) => {
                    const qty = Number(row?.qty);
                    const price = Number(row?.price);
                    const lineTotal =
                      Number.isFinite(qty) && qty > 0 && Number.isFinite(price)
                        ? qty * price
                        : 0;
                    return (
                      <tr key={String(row?.code || '')}>
                        <td>{String(row?.code || '-')}</td>
                        <td>{String(row?.name || '-')}</td>
                        <td style={{ textAlign: 'right' }}>
                          {Number(price || 0).toLocaleString('th-TH')}
                        </td>
                        <td>
                          <input
                            className="input"
                            type="number"
                            min={1}
                            step={1}
                            value={Number.isFinite(qty) && qty > 0 ? qty : 1}
                            onChange={(e) =>
                              onUpdateQty(row?.code, e.target.value)
                            }
                            style={{ width: '100%' }}
                          />
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          {Number(lineTotal || 0).toLocaleString('th-TH')}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            type="button"
                            className="button"
                            onClick={() => onRemoveItem(row?.code)}
                          >
                            ลบ
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center' }}>
                      ยังไม่มีสินค้าในรายการ
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div
            style={{
              marginTop: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 10,
              flexWrap: 'wrap',
            }}
          >
            <div style={{ opacity: 0.85 }}>
              สถานะ: <span style={{ fontWeight: 800 }}>{statusText}</span>
            </div>
            <div style={{ fontWeight: 900 }}>
              รวมทั้งหมด: {Number(subtotal || 0).toLocaleString('th-TH')} บาท
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button type="button" className="button" onClick={onClose}>
            ปิด
          </button>
          <button
            type="button"
            className="button button--blue"
            onClick={onSave}
          >
            บันทึก (รอชำระเงิน)
          </button>
        </div>
      </div>
    </div>
  );
}

function TreatmentRecordDetailModal({
  open,
  record,
  customers,
  customerConditions,
  products,
  onClose,
  onSave,
}) {
  const [draftItems, setDraftItems] = useState([]);
  const [productQuery, setProductQuery] = useState('');

  useEffect(() => {
    if (!open) return;
    const items = Array.isArray(record?.items) ? record.items : [];
    setDraftItems(
      items.map((row) => ({
        code: String(row?.code || '').trim(),
        name: String(row?.name || '').trim(),
        price: Number(row?.price) || 0,
        qty: Number(row?.qty) || 1,
      }))
    );
    setProductQuery('');
  }, [open, record]);

  if (!open || !record) return null;

  const hn = String(record?.customer?.hn || '').trim();
  const customerRow = (Array.isArray(customers) ? customers : []).find(
    (c) => String(c?.hn || '').trim() === hn
  );
  const conditions =
    customerConditions && typeof customerConditions === 'object'
      ? customerConditions[hn]
      : null;

  const customerNotes = String(customerRow?.details?.notes || '').trim();
  const customerSegment = String(
    conditions?.segmentText || conditions?.segment || customerRow?.segment || ''
  ).trim();
  const rawDiscount =
    conditions?.discount ?? customerRow?.discount ?? customerRow?.discount;
  const discountText = (() => {
    const s = String(rawDiscount ?? '').trim();
    if (!s) return '-';
    const n = Number(s);
    if (Number.isFinite(n)) return `${n}%`;
    return s;
  })();
  const conditionsNotes = String(conditions?.notes || '').trim();

  const subtotal = draftItems.reduce((acc, row) => {
    const qty = Number(row?.qty);
    const price = Number(row?.price);
    const line =
      Number.isFinite(qty) && qty > 0 && Number.isFinite(price) && price >= 0
        ? qty * price
        : 0;
    return acc + line;
  }, 0);

  const updateQty = (code, nextQtyRaw) => {
    const key = String(code || '').trim();
    if (!key) return;
    const qtyNum = Number(nextQtyRaw);
    const qty = Number.isFinite(qtyNum) ? Math.max(1, Math.floor(qtyNum)) : 1;
    setDraftItems((prev) =>
      (Array.isArray(prev) ? prev : []).map((row) =>
        String(row?.code || '').trim() === key ? { ...row, qty } : row
      )
    );
  };

  const removeItem = (code) => {
    const key = String(code || '').trim();
    if (!key) return;
    setDraftItems((prev) =>
      (Array.isArray(prev) ? prev : []).filter(
        (row) => String(row?.code || '').trim() !== key
      )
    );
  };

  const productQ = String(productQuery || '')
    .trim()
    .toLowerCase();
  const hasProductQuery = !!productQ;
  const productResults = hasProductQuery
    ? (Array.isArray(products) ? products : [])
        .filter((p) => p && typeof p === 'object')
        .filter((p) => String(p?.status || '').trim() !== 'ไม่ใช้งาน')
        .filter((p) => {
          const code = String(p?.code || '').toLowerCase();
          const th = String(p?.nameTh || '').toLowerCase();
          const en = String(p?.nameEn || '').toLowerCase();
          return (
            code.includes(productQ) ||
            th.includes(productQ) ||
            en.includes(productQ)
          );
        })
        .slice(0, 3)
    : [];

  const addProduct = (p) => {
    const code = String(p?.code || '').trim();
    if (!code) return;
    const name = String(p?.nameTh || p?.nameEn || '').trim() || code;
    const priceNum = Number(p?.price);
    const price = Number.isFinite(priceNum) && priceNum >= 0 ? priceNum : 0;

    setDraftItems((prev) => {
      const src = Array.isArray(prev) ? prev : [];
      const idx = src.findIndex((x) => String(x?.code || '').trim() === code);
      if (idx >= 0) {
        const row = src[idx];
        const qty = Number(row?.qty);
        const nextQty = Number.isFinite(qty) && qty > 0 ? qty + 1 : 2;
        const next = src.map((x) => ({ ...x }));
        next[idx] = { ...next[idx], qty: nextQty };
        return next;
      }
      return [...src, { code, name, price, qty: 1 }];
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal modal--treatment-record"
        role="dialog"
        aria-modal="true"
        aria-label="รายละเอียดรายการรักษา"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              flexWrap: 'wrap',
            }}
          >
            <h3 style={{ margin: 0 }}>รายละเอียดรายการรักษา</h3>
            <span className="badge badge--partial">
              {String(record?.status || '-')}
            </span>
          </div>
        </div>

        <div className="modal-body">
          <div className="treatment-detail-grid">
            <div className="treatment-detail-grid__label">วันที่</div>
            <div className="treatment-detail-grid__value">
              {formatDateDMY(String(record?.createdAt || ''))}
            </div>
            <div className="treatment-detail-grid__label">เลขที่</div>
            <div className="treatment-detail-grid__value treatment-detail-grid__value--strong">
              {String(record?.refNo || '-')}
            </div>

            <div className="treatment-detail-grid__label">HN</div>
            <div className="treatment-detail-grid__value">
              <span className="badge badge--hn">
                {String(record?.customer?.hn || '-')}
              </span>
            </div>
            <div className="treatment-detail-grid__label">ชื่อลูกค้า</div>
            <div className="treatment-detail-grid__value">
              {String(record?.customer?.name || '-')}
            </div>

            <div className="treatment-detail-grid__label">หมายเหตุ</div>
            <div className="treatment-detail-grid__value treatment-detail-grid__value--span">
              {customerNotes || '-'}
            </div>

            <div className="treatment-detail-grid__label">กลุ่มลูกค้า</div>
            <div className="treatment-detail-grid__value">
              {customerSegment || '-'}
            </div>
            <div className="treatment-detail-grid__label">ส่วนลดลูกค้า</div>
            <div className="treatment-detail-grid__value">{discountText}</div>

            <div className="treatment-detail-grid__label">หมายเหตุเงื่อนไข</div>
            <div className="treatment-detail-grid__value treatment-detail-grid__value--span">
              {conditionsNotes || '-'}
            </div>

            <div className="treatment-detail-grid__label">ผู้บันทึกรายการ</div>
            <div className="treatment-detail-grid__value treatment-detail-grid__value--span">
              {String(record?.createdBy || '-')}
            </div>
          </div>

          <div style={{ fontWeight: 800, marginTop: 6 }}>
            เพิ่มสินค้าเข้ารายการ
          </div>
          <input
            className="input"
            placeholder="ค้นหารหัสสินค้า หรือชื่อสินค้า"
            value={productQuery}
            onChange={(e) => setProductQuery(e.target.value)}
          />
          <div
            className="table-card"
            style={{
              marginTop: 10,
              overflowX: 'auto',
            }}
          >
            <table className="customers-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th style={{ width: 110 }}>รหัส</th>
                  <th>สินค้า</th>
                  <th style={{ width: 110, textAlign: 'right' }}>ราคา</th>
                  <th style={{ width: 110 }}></th>
                </tr>
              </thead>
              <tbody>
                {!hasProductQuery ? (
                  Array.from({ length: 3 }).map((_, idx) => (
                    <tr key={`blank-${idx}`}>
                      <td style={{ height: 34 }}>&nbsp;</td>
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                    </tr>
                  ))
                ) : (
                  <>
                    {productResults.length ? (
                      productResults.map((p) => (
                        <tr key={String(p?.code || '')}>
                          <td style={{ height: 34 }}>
                            {String(p?.code || '-')}
                          </td>
                          <td>{String(p?.nameTh || p?.nameEn || '-')}</td>
                          <td style={{ textAlign: 'right' }}>
                            {Number(p?.price || 0).toLocaleString('th-TH')}
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <button
                              type="button"
                              className="button button--blue"
                              onClick={() => addProduct(p)}
                            >
                              เพิ่ม
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={4}
                          style={{
                            textAlign: 'center',
                            color: '#6b7280',
                            height: 34,
                          }}
                        >
                          ไม่พบสินค้า
                        </td>
                      </tr>
                    )}
                    {Array.from({
                      length: Math.max(
                        0,
                        3 - Math.max(1, productResults.length)
                      ),
                    }).map((_, idx) => (
                      <tr key={`pad-${idx}`}>
                        <td style={{ height: 34 }}>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                      </tr>
                    ))}
                  </>
                )}
              </tbody>
            </table>
          </div>

          <div style={{ fontWeight: 800, marginTop: 6 }}>รายการสินค้า</div>
          <div
            className="table-card"
            style={{ marginTop: 10, overflowX: 'auto' }}
          >
            <table className="customers-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th style={{ width: 110 }}>รหัส</th>
                  <th>สินค้า</th>
                  <th style={{ width: 120, textAlign: 'right' }}>ราคา</th>
                  <th style={{ width: 120 }}>จำนวน</th>
                  <th style={{ width: 130, textAlign: 'right' }}>รวม</th>
                  <th style={{ width: 90 }}></th>
                </tr>
              </thead>
              <tbody>
                {draftItems.length ? (
                  draftItems.map((row) => {
                    const qty = Number(row?.qty);
                    const price = Number(row?.price);
                    const lineTotal =
                      Number.isFinite(qty) && qty > 0 && Number.isFinite(price)
                        ? qty * price
                        : 0;
                    return (
                      <tr key={String(row?.code || '')}>
                        <td>{String(row?.code || '-')}</td>
                        <td>{String(row?.name || '-')}</td>
                        <td style={{ textAlign: 'right' }}>
                          {Number(price || 0).toLocaleString('th-TH')}
                        </td>
                        <td>
                          <input
                            className="input"
                            type="number"
                            min={1}
                            step={1}
                            value={Number.isFinite(qty) && qty > 0 ? qty : 1}
                            onChange={(e) =>
                              updateQty(row?.code, e.target.value)
                            }
                            style={{ width: '100%' }}
                          />
                        </td>
                        <td
                          style={{ textAlign: 'right', whiteSpace: 'nowrap' }}
                        >
                          {Number(lineTotal || 0).toLocaleString('th-TH')}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            type="button"
                            className="button"
                            onClick={() => removeItem(row?.code)}
                          >
                            ลบ
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      style={{ textAlign: 'center', color: '#6b7280' }}
                    >
                      ไม่มีรายการสินค้า
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="modal-actions treatment-detail-actions">
          <div className="treatment-detail-actions__status">
            สถานะ:{' '}
            <span className="treatment-detail-actions__status-value">
              {String(record?.status || '-')}
            </span>
          </div>

          <div className="treatment-detail-actions__right">
            <div className="treatment-detail-actions__total">
              รวมทั้งหมด: {Number(subtotal || 0).toLocaleString('th-TH')} บาท
            </div>
            <button type="button" className="button" onClick={onClose}>
              ปิด
            </button>
            <button
              type="button"
              className="button button--blue"
              onClick={() => onSave?.({ id: record?.id, items: draftItems })}
              disabled={!draftItems.length}
            >
              บันทึกการแก้ไข
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const getVisiblePages = ({ totalPages, currentPage }) => {
  const pages = [];
  const total = Math.max(1, Number(totalPages) || 1);
  const current = Math.min(Math.max(1, Number(currentPage) || 1), total);
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
};

export default function App() {
  const APPOINTMENTS_LS_KEY = 'absmediq.appointments.v3';
  const APPOINTMENT_TOPICS_LS_KEY = 'absmediq.appointmentTopics.v3';
  const MOCK_RESET_MARKER_KEY = 'absmediq.appointments.mockreset.20260310';
  const TOPIC_PALETTE_MIGRATION_KEY =
    'absmediq.appointmentTopics.paletteMigration.v20260310';

  const isHex6 = (value) =>
    /^#[0-9a-fA-F]{6}$/.test(String(value || '').trim());

  const shuffle = (list) => {
    const out = Array.isArray(list) ? list.slice() : [];
    for (let i = out.length - 1; i > 0; i -= 1) {
      const r = Math.random();
      const j = Math.floor(r * (i + 1));
      const tmp = out[i];
      out[i] = out[j];
      out[j] = tmp;
    }
    return out;
  };

  const assignPaletteColors = (items, { force = false } = {}) => {
    const src = Array.isArray(items) ? items : [];
    const palette = shuffle(APPOINTMENT_TOPIC_COLOR_PALETTE).filter(isHex6);
    const paletteSet = new Set(palette.map((c) => c.toLowerCase()));
    if (!palette.length) return src;

    return src.map((t, idx) => {
      const name = String(t?.name || '').trim();
      if (!name) return t;
      const existing = String(t?.color || '').trim();
      const okExisting =
        !!existing &&
        isHex6(existing) &&
        paletteSet.has(existing.toLowerCase());
      if (!force && okExisting) return t;
      const next = palette[idx % palette.length] || '';
      return { ...t, color: next };
    });
  };

  const cleanupLegacyAppointmentMockKeys = () => {
    try {
      if (typeof window === 'undefined') return;
      const ls = window.localStorage;
      if (!ls) return;
      if (ls.getItem(MOCK_RESET_MARKER_KEY)) return;

      const keysToRemove = [
        'absmediq.appointments.v1',
        'absmediq.appointments.v2',
        'absmediq.appointmentTopics.v1',
        'absmediq.appointmentTopics.v2',
      ];

      for (const k of keysToRemove) {
        try {
          ls.removeItem(k);
        } catch {
          // ignore
        }
      }

      ls.setItem(MOCK_RESET_MARKER_KEY, new Date().toISOString());
    } catch {
      // ignore
    }
  };

  // "ลบทิ้งจริงๆ" legacy mock keys (one-time)
  useEffect(() => {
    cleanupLegacyAppointmentMockKeys();
  }, []);

  const readAppointmentsFromLocalStorage = () => {
    try {
      if (typeof window === 'undefined') return null;
      const raw = window.localStorage.getItem(APPOINTMENTS_LS_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      const items = Array.isArray(parsed)
        ? parsed
        : Array.isArray(parsed?.items)
          ? parsed.items
          : null;
      if (!items) return null;
      return items.filter((x) => x && typeof x === 'object');
    } catch {
      return null;
    }
  };

  const writeAppointmentsToLocalStorage = (items) => {
    try {
      if (typeof window === 'undefined') return;
      const src = Array.isArray(items) ? items : [];
      window.localStorage.setItem(
        APPOINTMENTS_LS_KEY,
        JSON.stringify({ items: src, savedAt: new Date().toISOString() })
      );
    } catch {
      // Ignore quota / private mode errors
    }
  };

  const normalizeAppointmentTopics = useCallback((raw) => {
    const src = Array.isArray(raw)
      ? raw
      : Array.isArray(raw?.items)
        ? raw.items
        : null;
    if (!src) return null;

    const out = [];
    const seen = new Set();
    for (const t of src) {
      const name =
        typeof t === 'string' ? String(t).trim() : String(t?.name || '').trim();
      if (!name) continue;
      const key = name.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);

      const color =
        typeof t === 'object' && t ? String(t?.color || '').trim() : '';
      out.push({ name, color });
    }
    return out;
  }, []);

  const readAppointmentTopicsFromLocalStorage = useCallback(() => {
    try {
      if (typeof window === 'undefined') return null;
      const raw = window.localStorage.getItem(APPOINTMENT_TOPICS_LS_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return normalizeAppointmentTopics(parsed);
    } catch {
      return null;
    }
  }, [APPOINTMENT_TOPICS_LS_KEY, normalizeAppointmentTopics]);

  const writeAppointmentTopicsToLocalStorage = useCallback(
    (items) => {
      try {
        if (typeof window === 'undefined') return;
        const normalized = normalizeAppointmentTopics(items) || [];
        window.localStorage.setItem(
          APPOINTMENT_TOPICS_LS_KEY,
          JSON.stringify({
            items: normalized,
            savedAt: new Date().toISOString(),
          })
        );
      } catch {
        // Ignore quota / private mode errors
      }
    },
    [APPOINTMENT_TOPICS_LS_KEY, normalizeAppointmentTopics]
  );

  const stripProductPhotoUrl = (p) => {
    if (!p || typeof p !== 'object') return p;
    // Remove legacy product photo field from the system.
    const { photoUrl: _photoUrl, ...rest } = p;
    return rest;
  };

  const getIngredientAvailableStock = (item) => {
    const lots = Array.isArray(item?.stockLots) ? item.stockLots : [];
    const lotSum = lots.reduce((acc, lot) => {
      const q = Number(lot?.qty);
      return acc + (Number.isFinite(q) ? q : 0);
    }, 0);
    if (lots.length) return lotSum;
    const stock = Number(item?.stock);
    return Number.isFinite(stock) ? stock : 0;
  };

  const consumeIngredientFromLots = ({ lots, qty }) => {
    const src = Array.isArray(lots) ? lots : [];
    const desired = Number(qty);
    if (!Number.isFinite(desired) || desired <= 0) {
      return { ok: false, error: 'กรุณาระบุจำนวนตัดใช้ให้ถูกต้อง' };
    }

    const indexed = src.map((lot, idx) => ({ lot, idx }));
    indexed.sort((a, b) => {
      const aExp = String(a.lot?.expiryDate || '').trim();
      const bExp = String(b.lot?.expiryDate || '').trim();
      const expCmp = aExp.localeCompare(bExp);
      if (aExp && bExp && expCmp !== 0) return expCmp;
      if (aExp && !bExp) return -1;
      if (!aExp && bExp) return 1;

      const aRecv = String(a.lot?.receivedAt || '').trim();
      const bRecv = String(b.lot?.receivedAt || '').trim();
      const recvCmp = aRecv.localeCompare(bRecv);
      if (aRecv && bRecv && recvCmp !== 0) return recvCmp;
      if (aRecv && !bRecv) return -1;
      if (!aRecv && bRecv) return 1;

      const aNo = String(a.lot?.lotNo || '').trim();
      const bNo = String(b.lot?.lotNo || '').trim();
      const noCmp = aNo.localeCompare(bNo);
      if (noCmp !== 0) return noCmp;

      return a.idx - b.idx;
    });

    const nextLots = src.map((l) => ({ ...l }));
    const consumed = [];

    let remaining = desired;
    for (const { idx } of indexed) {
      if (remaining <= 0) break;
      const lot = nextLots[idx];
      const available = Number(lot?.qty);
      const avail = Number.isFinite(available) ? available : 0;
      if (avail <= 0) continue;

      const take = Math.min(avail, remaining);
      if (take <= 0) continue;

      lot.qty = avail - take;
      remaining -= take;
      consumed.push({
        lotNo: String(lot?.lotNo || '').trim() || '-',
        expiryDate: String(lot?.expiryDate || '').trim() || '-',
        receivedAt: String(lot?.receivedAt || '').trim() || '-',
        qty: take,
      });
    }

    if (remaining > 0) {
      return { ok: false, error: 'จำนวนตัดใช้มากกว่าคงเหลือ' };
    }

    const newStock = nextLots.reduce((acc, lot) => {
      const q = Number(lot?.qty);
      return acc + (Number.isFinite(q) ? q : 0);
    }, 0);

    return { ok: true, nextLots, consumed, newStock };
  };

  const [modal, setModal] = useState({ open: false, title: '' });
  const [appointmentTopics, setAppointmentTopics] = useState(() => {
    const local = readAppointmentTopicsFromLocalStorage();
    const base =
      local && local.length
        ? local
        : normalizeAppointmentTopics(APPOINTMENT_TOPICS_STAGE) ||
          normalizeAppointmentTopics([
            { name: 'Drip วิตามิน', color: '' },
            { name: 'ฉีดยา', color: '' },
            { name: 'ตรวจเลือด', color: '' },
            { name: 'ทำกายภาพ', color: '' },
          ]) ||
          [];

    // One-time migration: overwrite any legacy colors with the new vivid palette.
    let forceRecolor = false;
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        forceRecolor = !window.localStorage.getItem(
          TOPIC_PALETTE_MIGRATION_KEY
        );
        if (forceRecolor) {
          window.localStorage.setItem(
            TOPIC_PALETTE_MIGRATION_KEY,
            new Date().toISOString()
          );
        }
      }
    } catch {
      // ignore
    }

    return assignPaletteColors(base, { force: forceRecolor });
  });
  const [appointmentTopicsModalOpen, setAppointmentTopicsModalOpen] =
    useState(false);
  const [appointmentCustomerTypeOpen, setAppointmentCustomerTypeOpen] =
    useState(false);
  const [appointmentModal, setAppointmentModal] = useState({
    open: false,
    mode: 'create',
    initialAppointment: null,
    customerType: 'existing',
  });

  useEffect(() => {
    writeAppointmentTopicsToLocalStorage(appointmentTopics);
  }, [appointmentTopics, writeAppointmentTopicsToLocalStorage]);

  const addAppointmentTopic = (raw) => {
    const topic = String(raw || '').trim();
    if (!topic) return;
    setAppointmentTopics((prev) => {
      const src = Array.isArray(prev) ? prev : [];
      const exists = src.some(
        (t) =>
          String(t?.name || '')
            .trim()
            .toLowerCase() === topic.toLowerCase()
      );
      if (exists) return src;

      const used = new Set(
        src
          .map((t) =>
            String(t?.color || '')
              .trim()
              .toLowerCase()
          )
          .filter(Boolean)
      );
      const pick =
        APPOINTMENT_TOPIC_COLOR_PALETTE.find(
          (c) => !used.has(String(c).toLowerCase())
        ) ||
        APPOINTMENT_TOPIC_COLOR_PALETTE[
          Math.floor(Math.random() * APPOINTMENT_TOPIC_COLOR_PALETTE.length)
        ] ||
        '';

      return [...src, { name: topic, color: pick }];
    });
  };

  const updateAppointmentTopicColor = (nameRaw, colorRaw) => {
    const name = String(nameRaw || '').trim();
    if (!name) return;
    const color = String(colorRaw || '').trim();
    setAppointmentTopics((prev) => {
      const src = Array.isArray(prev) ? prev : [];
      return src.map((t) => {
        const tName = String(t?.name || '').trim();
        if (!tName) return t;
        if (tName.toLowerCase() !== name.toLowerCase()) return t;
        return { ...t, color };
      });
    });
  };
  const [treatmentModalOpen, setTreatmentModalOpen] = useState(false);
  const [treatmentCustomerQuery, setTreatmentCustomerQuery] = useState('');
  const [treatmentSelectedCustomer, setTreatmentSelectedCustomer] =
    useState(null);
  const [treatmentProductQuery, setTreatmentProductQuery] = useState('');
  const [treatmentItems, setTreatmentItems] = useState([]);
  const [pendingPayments, setPendingPayments] = useState(() => {
    const c1 = Array.isArray(ENRICHED_CUSTOMERS) ? ENRICHED_CUSTOMERS[0] : null;
    const c2 = Array.isArray(ENRICHED_CUSTOMERS) ? ENRICHED_CUSTOMERS[1] : null;
    const now = new Date();
    const d1 = new Date(now);
    d1.setDate(d1.getDate() - 1);
    const d2 = new Date(now);
    d2.setDate(d2.getDate() - 3);

    const make = ({ createdAt, customer, items, refNo, createdBy }) => {
      const safeItems = Array.isArray(items) ? items : [];
      const subtotal = safeItems.reduce((acc, row) => {
        const qty = Number(row?.qty);
        const price = Number(row?.price);
        const line =
          Number.isFinite(qty) &&
          qty > 0 &&
          Number.isFinite(price) &&
          price >= 0
            ? qty * price
            : 0;
        return acc + line;
      }, 0);
      return {
        id: `${Date.now()}_${Math.random().toString(16).slice(2)}`,
        refNo:
          String(refNo || '').trim() ||
          `TR-${String(createdAt || '')
            .slice(0, 10)
            .replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`,
        type: 'treatment',
        status: 'รอชำระเงิน',
        createdAt,
        createdBy: String(createdBy || '').trim() || 'ระบบ',
        customer,
        items: safeItems,
        subtotal,
      };
    };

    return [
      make({
        createdAt: d1.toISOString(),
        refNo: 'TR-20260216-0001',
        createdBy: 'แอดมิน',
        customer: {
          hn: String(c1?.hn || 'HN001'),
          name: customerDisplayName(c1) || 'ลูกค้าตัวอย่าง 1',
        },
        items: [
          { code: 'PRD001', name: 'ครีมบำรุงผิวหน้า', price: 890, qty: 1 },
          { code: 'PRD002', name: 'เซรั่มวิตามินซี', price: 1290, qty: 1 },
        ],
      }),
      make({
        createdAt: d2.toISOString(),
        refNo: 'TR-20260214-0002',
        createdBy: 'แอดมิน',
        customer: {
          hn: String(c2?.hn || 'HN002'),
          name: customerDisplayName(c2) || 'ลูกค้าตัวอย่าง 2',
        },
        items: [
          { code: 'PRD005', name: 'มาสก์หน้าชุ่มชื้น', price: 79, qty: 5 },
        ],
      }),
    ];
  });
  const [recordQuery, setRecordQuery] = useState('');
  const [recordPage, setRecordPage] = useState(1);
  const [recordPageSize, setRecordPageSize] = useState(10);
  const [treatmentDetailRow, setTreatmentDetailRow] = useState(null);
  const [active, setActive] = useState('ตารางนัดหมาย');
  const [movementFilterCode, setMovementFilterCode] = useState(null);
  const [consumableMovementFilterCode, setConsumableMovementFilterCode] =
    useState(null);
  const [ingredientMovementFilterCode, setIngredientMovementFilterCode] =
    useState(null);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingConsumable, setEditingConsumable] = useState(null);
  const [editingIngredient, setEditingIngredient] = useState(null);
  const [editingPurchaseOrder, setEditingPurchaseOrder] = useState(null);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [ingredientDraft, setIngredientDraft] = useState([]);
  const [createProductFromIngredients, setCreateProductFromIngredients] =
    useState(null);
  const [products, setProducts] = useState(() => {
    const src = Array.isArray(MOCK_PRODUCTS_FULL) ? MOCK_PRODUCTS_FULL : [];
    return src.map(stripProductPhotoUrl);
  });
  const [serviceFees, setServiceFees] = useState(() =>
    Array.isArray(SERVICE_FEES_FULL) ? SERVICE_FEES_FULL : []
  );
  const [trainersOperators, setTrainersOperators] = useState(() =>
    Array.isArray(TRAINERS_OPERATORS_FULL) ? TRAINERS_OPERATORS_FULL : []
  );
  const [consumables, setConsumables] = useState(() =>
    Array.isArray(CONSUMABLES_FULL) ? CONSUMABLES_FULL : []
  );
  const [ingredients, setIngredients] = useState(() =>
    Array.isArray(INGREDIENTS_FULL) ? INGREDIENTS_FULL : []
  );
  const [suppliers, setSuppliers] = useState(() =>
    Array.isArray(SUPPLIERS_FULL) ? SUPPLIERS_FULL : []
  );
  const [appointments, setAppointments] = useState(() => {
    const local = readAppointmentsFromLocalStorage();
    return Array.isArray(local) ? local : [];
  });
  const [purchaseOrders, setPurchaseOrders] = useState(() =>
    Array.isArray(MOCK_PURCHASE_ORDERS_FULL) ? MOCK_PURCHASE_ORDERS_FULL : []
  );
  const [customerStatusOverrides, setCustomerStatusOverrides] = useState({});
  const [customerConditions, setCustomerConditions] = useState({});
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [navOpen, setNavOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 900);
  const [navCompact, setNavCompact] = useState(() => window.innerWidth < 1400);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });
  const headerRef = useRef(null);
  const dropdownContainerRefs = useRef({});
  const dropdownButtonRefs = useRef({});
  const openModal = (title) => setModal({ open: true, title });
  const closeModal = () => setModal({ open: false, title: '' });

  const openTreatmentModal = () => {
    setTreatmentModalOpen(true);
    setTreatmentCustomerQuery('');
    setTreatmentSelectedCustomer(null);
    setTreatmentProductQuery('');
    setTreatmentItems([]);
  };

  const closeTreatmentModal = () => setTreatmentModalOpen(false);

  const addTreatmentProduct = (p) => {
    const code = String(p?.code || '').trim();
    if (!code) return;
    const name = String(p?.nameTh || p?.nameEn || '').trim() || code;
    const priceNum = Number(p?.price);
    const price = Number.isFinite(priceNum) && priceNum >= 0 ? priceNum : 0;

    setTreatmentItems((prev) => {
      const src = Array.isArray(prev) ? prev : [];
      const idx = src.findIndex((x) => String(x?.code || '').trim() === code);
      if (idx >= 0) {
        const row = src[idx];
        const qty = Number(row?.qty);
        const nextQty = Number.isFinite(qty) && qty > 0 ? qty + 1 : 2;
        const next = src.map((x) => ({ ...x }));
        next[idx] = { ...next[idx], qty: nextQty };
        return next;
      }
      return [...src, { code, name, price, qty: 1 }];
    });
  };

  const updateTreatmentQty = (code, nextQtyRaw) => {
    const key = String(code || '').trim();
    if (!key) return;
    const qtyNum = Number(nextQtyRaw);
    const qty = Number.isFinite(qtyNum) ? Math.max(1, Math.floor(qtyNum)) : 1;
    setTreatmentItems((prev) => {
      const src = Array.isArray(prev) ? prev : [];
      return src.map((row) =>
        String(row?.code || '').trim() === key ? { ...row, qty } : row
      );
    });
  };

  const removeTreatmentItem = (code) => {
    const key = String(code || '').trim();
    if (!key) return;
    setTreatmentItems((prev) => {
      const src = Array.isArray(prev) ? prev : [];
      return src.filter((row) => String(row?.code || '').trim() !== key);
    });
  };

  const saveTreatmentRecord = () => {
    if (!treatmentSelectedCustomer) {
      openModal('กรุณาเลือกลูกค้า');
      return;
    }

    const items = Array.isArray(treatmentItems) ? treatmentItems : [];
    if (!items.length) {
      openModal('กรุณาเพิ่มสินค้าอย่างน้อย 1 รายการ');
      return;
    }

    const subtotal = items.reduce((acc, row) => {
      const qty = Number(row?.qty);
      const price = Number(row?.price);
      const line =
        Number.isFinite(qty) && qty > 0 && Number.isFinite(price) && price >= 0
          ? qty * price
          : 0;
      return acc + line;
    }, 0);

    const record = {
      id: `${Date.now()}_${Math.random().toString(16).slice(2)}`,
      refNo: `TR-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(
        1000 + Math.random() * 9000
      )}`,
      type: 'treatment',
      status: 'รอชำระเงิน',
      createdAt: new Date().toISOString(),
      createdBy: 'ระบบ',
      customer: {
        hn: String(treatmentSelectedCustomer?.hn || '').trim(),
        name: customerDisplayName(treatmentSelectedCustomer),
      },
      items: items.map((row) => ({
        code: String(row?.code || '').trim(),
        name: String(row?.name || '').trim(),
        price: Number(row?.price) || 0,
        qty: Number(row?.qty) || 1,
      })),
      subtotal,
    };

    setPendingPayments((prev) => {
      const src = Array.isArray(prev) ? prev : [];
      return [record, ...src];
    });

    console.log('บันทึกรายการรักษา (รอชำระเงิน):', record);
    setTreatmentModalOpen(false);
    openModal('บันทึกรายการรักษาสำเร็จ (รอชำระเงิน)');
  };

  const updateTreatmentRecord = ({ id, items }) => {
    const key = String(id || '').trim();
    if (!key) return;

    const normalizedItems = (Array.isArray(items) ? items : [])
      .map((row) => ({
        code: String(row?.code || '').trim(),
        name: String(row?.name || '').trim(),
        price: Number(row?.price) || 0,
        qty: Number(row?.qty) || 1,
      }))
      .filter((row) => row.code);

    if (!normalizedItems.length) {
      openModal('กรุณาให้มีสินค้าอย่างน้อย 1 รายการ');
      return;
    }

    const subtotal = normalizedItems.reduce((acc, row) => {
      const qty = Number(row?.qty);
      const price = Number(row?.price);
      const line =
        Number.isFinite(qty) && qty > 0 && Number.isFinite(price) && price >= 0
          ? qty * price
          : 0;
      return acc + line;
    }, 0);

    setPendingPayments((prev) => {
      const src = Array.isArray(prev) ? prev : [];
      return src.map((r) =>
        String(r?.id || '').trim() === key
          ? { ...r, items: normalizedItems, subtotal }
          : r
      );
    });

    setTreatmentDetailRow((prev) => {
      if (!prev) return prev;
      return String(prev?.id || '').trim() === key
        ? { ...prev, items: normalizedItems, subtotal }
        : prev;
    });

    setTreatmentDetailRow(null);
    openModal('บันทึกการแก้ไขรายการสำเร็จ');
  };

  const openCreateAppointment = () => {
    setAppointmentCustomerTypeOpen(true);
  };

  const openAppointmentTopics = () => {
    setAppointmentTopicsModalOpen(true);
  };

  const openEditAppointment = (appt) => {
    const src = appt && typeof appt === 'object' ? appt : null;
    if (!src) return;

    const existingId = String(src?.id || '').trim();
    if (existingId) {
      setAppointmentModal({
        open: true,
        mode: 'edit',
        initialAppointment: src,
        customerType: 'existing',
      });
      return;
    }

    const newId = `${Date.now()}_${Math.random().toString(16).slice(2)}`;
    const key = [
      String(src?.date || '').trim(),
      String(src?.timeStart || src?.time || '').trim(),
      String(src?.customerHn || '').trim(),
      String(src?.customerName || src?.patient || '').trim(),
    ]
      .filter(Boolean)
      .join('__');

    setAppointments((prev) => {
      const items = Array.isArray(prev) ? prev : [];
      let updated = false;
      return items.map((a) => {
        if (updated) return a;
        if (a === src) {
          updated = true;
          return { ...a, id: newId };
        }
        const aKey = [
          String(a?.date || '').trim(),
          String(a?.timeStart || a?.time || '').trim(),
          String(a?.customerHn || '').trim(),
          String(a?.customerName || a?.patient || '').trim(),
        ]
          .filter(Boolean)
          .join('__');
        if (key && aKey && aKey === key) {
          updated = true;
          return { ...a, id: newId };
        }
        return a;
      });
    });

    setAppointmentModal({
      open: true,
      mode: 'edit',
      initialAppointment: { ...src, id: newId },
      customerType: 'existing',
    });
  };
  const createCustomerOnServer = async (payload) => {
    const res = await fetch('/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload || {}),
    });
    let body = null;
    try {
      body = await res.json();
    } catch {
      body = null;
    }
    if (!res.ok) {
      const message = body?.error || 'บันทึกลูกค้าไม่สำเร็จ';
      throw new Error(message);
    }
    return body;
  };
  // handleClick now only sets the active page so navbar acts like SPA navigation
  const handleClick = (title) => {
    setActive(title);
  };

  const updateDropdownPos = (dropdownId) => {
    const buttonEl = dropdownButtonRefs.current[dropdownId];
    if (!buttonEl) return;
    const rect = buttonEl.getBoundingClientRect();

    const width = Math.max(200, rect.width);
    const viewportPadding = 8;
    const left = Math.min(
      Math.max(viewportPadding, rect.left),
      window.innerWidth - width - viewportPadding
    );

    setDropdownPos({
      top: rect.bottom + 4,
      left,
      width,
    });
  };

  useEffect(() => {
    const headerEl = headerRef.current;
    if (!headerEl) return;

    const update = () => {
      const height = headerEl.getBoundingClientRect().height;
      document.documentElement.style.setProperty(
        '--header-offset',
        `${Math.ceil(height)}px`
      );
    };

    update();

    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(() => update());
      ro.observe(headerEl);
      return () => ro.disconnect();
    }

    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    // localStorage-only mode: seed from stage mock only on first run
    // (i.e. when the localStorage key does not exist).
    try {
      const hasKey =
        typeof window !== 'undefined' &&
        window.localStorage.getItem(APPOINTMENTS_LS_KEY) !== null;
      if (hasKey) return;
    } catch {
      // If localStorage isn't available, do nothing.
      return;
    }
    const seed = Array.isArray(APPOINTMENTS_STAGE) ? APPOINTMENTS_STAGE : [];
    if (!seed.length) return;
    setAppointments((prev) => {
      if (Array.isArray(prev) && prev.length) return prev;
      return seed;
    });
  }, []);

  useEffect(() => {
    writeAppointmentsToLocalStorage(appointments);
  }, [appointments]);

  useEffect(() => {
    const customersPages = new Set(['รายชื่อลูกค้า', 'ค้นหารายชื่อลูกค้า']);
    const productsPages = new Set([
      'รายการสินค้า',
      'ค้นหารายการสินค้า',
      'รายการเคลื่อนไหวสินค้า',
      'Ingredient',
      'แก้ไขรายละเอียด Ingredient',
      'รายการเคลื่อนไหว Ingredient',
      'รับ Ingredient เข้า stock',
      'วัสดุสิ้นเปลืองและอื่นๆ',
      'รับวัสดุสิ้นเปลืองเข้า stock',
      'แก้ไขรายละเอียดวัสดุสิ้นเปลือง',
    ]);

    if (customersPages.has(active)) document.body.dataset.pageKey = 'customers';
    else if (productsPages.has(active))
      document.body.dataset.pageKey = 'products';
    else document.body.dataset.pageKey = 'default';
  }, [active]);

  useEffect(() => {
    const onDocClick = (e) => {
      if (!openDropdownId) return;
      const containerEl = dropdownContainerRefs.current[openDropdownId];
      if (containerEl && !containerEl.contains(e.target))
        setOpenDropdownId(null);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpenDropdownId(null);
    };
    document.addEventListener('mousedown', onDocClick);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      window.removeEventListener('keydown', onKey);
    };
  }, [openDropdownId]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 900) setNavOpen(false);
      setIsMobile(window.innerWidth < 900);
      setNavCompact(window.innerWidth < 1400);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (!openDropdownId || isMobile) return;

    updateDropdownPos(openDropdownId);

    const onScroll = () => updateDropdownPos(openDropdownId);
    const onResize = () => updateDropdownPos(openDropdownId);
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onResize);
    };
  }, [openDropdownId, isMobile]);

  const handleNavItemClick = (title) => {
    handleClick(title);
    setNavOpen(false);
  };

  const handleLogout = () => {
    setOpenDropdownId(null);
    setNavOpen(false);
    openModal('ออกจากระบบ');
  };

  const serviceSubPages = [
    'รายการบริการ',
    'สร้างคอร์ส',
    'แก้ไขคอร์ส',
    'ผู้ให้บริการ',
    'ค่าจ้างผู้ให้บริการ',
    'รายการค่าบริการ',
    'สร้างรายการค่าบริการ',
    'ผู้ฝึกสอน/ผู้ดำเนินการ',
    'สร้างผู้ฝึกสอน/ผู้ดำเนินการ',
  ];

  const scheduleSubPages = ['ตารางนัดหมาย', 'แก้ไขข้อมูลนัดหมาย'];

  const navItems = [
    {
      id: 'schedule',
      label: 'ตารางนัดหมาย',
      // Removed dropdown items to render as a simple button
    },
    {
      id: 'record',
      label: 'บันทึกรายการ',
      // Removed dropdown items to render as a simple button
    },
    {
      id: 'services',
      label: 'บันทึกรายการค่าบริการ',
      // Removed dropdown items to render as a simple button
    },
    {
      id: 'payment',
      label: 'การชำระเงิน',
      items: [
        'รับชำระเงิน',
        'แก้ไขรายการรับชำระเงิน',
        'รายงานรายรับ (เฉพาะการเงิน)',
        'รายงาน (ใบเสร็จรับเงิน)',
        'วางบิล',
        'ลูกค้าค้างชำระ',
      ],
    },
    {
      id: 'customers',
      label: 'รายชื่อลูกค้า',
      // Removed dropdown items to render as a simple button
    },
    {
      id: 'products',
      label: 'รายการสินค้า',
      // Removed dropdown items to render as a simple button
    },
    {
      id: 'print',
      label: 'พิมพ์เอกสาร',
      items: ['พิมพ์ฉลากสินค้า', 'พิมพ์เอกสารย้อนหลัง'],
    },
    {
      id: 'reports',
      label: 'รายงาน',
      items: ['รายงานประจำวัน'],
    },
    {
      id: 'settings',
      label: 'ตั้งค่า',
      items: ['ตั้งค่าทั่วไป'],
    },
  ];

  const isNavItemActive = (navItem) => {
    if (active === navItem.label) return true;
    if (navItem.items && navItem.items.includes(active)) return true;
    if (navItem.id === 'services' && serviceSubPages.includes(active))
      return true;
    if (navItem.id === 'schedule' && scheduleSubPages.includes(active))
      return true;
    return false;
  };

  function Page({ activePage }) {
    // Simple single-page views. Extend these with real components as needed.
    switch (activePage) {
      case 'บันทึกรายการ': {
        const allRows = (Array.isArray(pendingPayments) ? pendingPayments : [])
          .filter((r) => String(r?.type || '') === 'treatment')
          .slice()
          .sort((a, b) => {
            const ta = String(a?.createdAt || '');
            const tb = String(b?.createdAt || '');
            return tb.localeCompare(ta);
          });

        const q = String(recordQuery || '')
          .trim()
          .toLowerCase();
        const rows = q
          ? allRows.filter((r) => {
              const hay = [
                String(r?.id || ''),
                String(r?.refNo || ''),
                String(r?.customer?.hn || ''),
                String(r?.customer?.name || ''),
                String(r?.status || ''),
                String(r?.createdBy || ''),
                ...(Array.isArray(r?.items)
                  ? r.items.flatMap((it) => [
                      String(it?.code || ''),
                      String(it?.name || ''),
                    ])
                  : []),
              ]
                .join(' ')
                .toLowerCase();
              return hay.includes(q);
            })
          : allRows;

        const totalPages = Math.max(1, Math.ceil(rows.length / recordPageSize));
        const currentPage = Math.min(recordPage, totalPages);
        const start = (currentPage - 1) * recordPageSize;
        const end = start + recordPageSize;
        const pagedRows = rows.slice(start, end);
        const visiblePages = getVisiblePages({ totalPages, currentPage });

        return (
          <section className="record-page">
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
                <h1 className="page-title">บันทึกรายการ</h1>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button
                    type="button"
                    className="button button--blue"
                    onClick={openTreatmentModal}
                  >
                    บันทึกรายการรักษา
                  </button>
                </div>
              </div>

              <div
                className="toolbar"
                style={{ display: 'flex', gap: 8, marginBottom: 12 }}
              >
                <input
                  aria-label="ค้นหารายการรักษา"
                  placeholder="ค้นหา เลขที่ / HN / ชื่อลูกค้า / สถานะ / สินค้า"
                  value={recordQuery}
                  onChange={(e) => {
                    setRecordQuery(e.target.value);
                    setRecordPage(1);
                  }}
                  style={{ flex: 1, padding: '8px 10px' }}
                />
                <button
                  type="button"
                  className="button"
                  onClick={() => {
                    setRecordQuery('');
                    setRecordPage(1);
                  }}
                >
                  ล้าง
                </button>
              </div>
            </div>

            <div className="table-card" style={{ overflowX: 'hidden' }}>
              <table
                className="customers-table"
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  tableLayout: 'fixed',
                  fontSize: 12,
                  lineHeight: 1.25,
                }}
              >
                <thead>
                  <tr>
                    <th style={{ padding: 6, width: 95, whiteSpace: 'nowrap' }}>
                      วันที่
                    </th>
                    <th
                      style={{ padding: 6, width: 140, whiteSpace: 'nowrap' }}
                    >
                      เลขที่
                    </th>
                    <th style={{ padding: 6, width: 95, whiteSpace: 'nowrap' }}>
                      HN
                    </th>
                    <th style={{ padding: 6 }}>ชื่อลูกค้า</th>
                    <th style={{ padding: 6, width: 120, textAlign: 'right' }}>
                      จำนวนเงิน
                    </th>
                    <th
                      style={{ padding: 6, width: 120, whiteSpace: 'nowrap' }}
                    >
                      สถานะ
                    </th>
                    <th
                      style={{
                        padding: 6,
                        width: 40,
                        whiteSpace: 'nowrap',
                        textAlign: 'center',
                      }}
                      title="รายละเอียด"
                    >
                      <span aria-hidden="true">🔍</span>
                    </th>
                    <th
                      style={{ padding: 6, width: 140, whiteSpace: 'nowrap' }}
                    >
                      ผู้บันทึกรายการ
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pagedRows.length ? (
                    pagedRows.map((r) => (
                      <tr
                        key={String(r?.id || '')}
                        style={{ borderTop: '1px solid #eaeaea' }}
                      >
                        <td style={{ padding: 6, whiteSpace: 'nowrap' }}>
                          {formatDateDMY(String(r?.createdAt || ''))}
                        </td>
                        <td style={{ padding: 6, whiteSpace: 'nowrap' }}>
                          {String(r?.refNo || '-')}
                        </td>
                        <td style={{ padding: 6, whiteSpace: 'nowrap' }}>
                          <span className="badge badge--hn">
                            {String(r?.customer?.hn || '-')}
                          </span>
                        </td>
                        <td
                          style={{
                            padding: 6,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                          title={String(r?.customer?.name || '')}
                        >
                          {String(r?.customer?.name || '-')}
                        </td>
                        <td
                          style={{
                            padding: 6,
                            textAlign: 'right',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {Number(r?.subtotal || 0).toLocaleString('th-TH')}
                        </td>
                        <td style={{ padding: 6, whiteSpace: 'nowrap' }}>
                          <span className="badge badge--partial">
                            {String(r?.status || '-')}
                          </span>
                        </td>
                        <td style={{ padding: 6, textAlign: 'center' }}>
                          <button
                            type="button"
                            className="button"
                            onClick={() => setTreatmentDetailRow(r)}
                            title="รายละเอียด"
                            aria-label="รายละเอียด"
                            style={{ padding: '4px 6px', minWidth: 0 }}
                          >
                            🔍
                          </button>
                        </td>
                        <td style={{ padding: 6, whiteSpace: 'nowrap' }}>
                          {String(r?.createdBy || '-')}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td style={{ padding: 12, color: '#6b7280' }} colSpan={8}>
                        ยังไม่มีรายการบันทึก
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div
              className="toolbar"
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: 8,
                marginTop: 10,
              }}
            >
              <div style={{ color: '#6b7280', fontSize: 12 }}>
                ทั้งหมด {rows.length.toLocaleString('th-TH')} รายการ
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                <select
                  className="input"
                  aria-label="จำนวนแถวต่อหน้า"
                  value={recordPageSize}
                  onChange={(e) => {
                    setRecordPageSize(Number(e.target.value) || 10);
                    setRecordPage(1);
                  }}
                  style={{ padding: '6px 8px', fontSize: 12 }}
                >
                  <option value={10}>10 / หน้า</option>
                  <option value={20}>20 / หน้า</option>
                  <option value={50}>50 / หน้า</option>
                </select>

                <button
                  type="button"
                  className="button"
                  disabled={currentPage <= 1}
                  onClick={() => setRecordPage((p) => Math.max(1, p - 1))}
                >
                  ก่อนหน้า
                </button>

                {visiblePages.map((p, idx) =>
                  p === '…' ? (
                    <span
                      key={`ellipsis-${idx}`}
                      style={{ padding: '6px 4px' }}
                    >
                      …
                    </span>
                  ) : (
                    <button
                      key={p}
                      type="button"
                      className={
                        p === currentPage ? 'button button--solid' : 'button'
                      }
                      onClick={() => setRecordPage(p)}
                      style={{ minWidth: 40 }}
                    >
                      {p}
                    </button>
                  )
                )}

                <button
                  type="button"
                  className="button"
                  disabled={currentPage >= totalPages}
                  onClick={() =>
                    setRecordPage((p) => Math.min(totalPages, p + 1))
                  }
                >
                  ถัดไป
                </button>
              </div>
            </div>
          </section>
        );
      }
      case 'ตารางนัดหมาย':
        return (
          <AppointmentCalendar
            appointments={appointments}
            appointmentTopics={appointmentTopics}
            onCreateAppointment={openCreateAppointment}
            onAppointmentTopics={openAppointmentTopics}
            onEditAppointment={openEditAppointment}
          />
        );
      case 'รายชื่อลูกค้า':
      case 'ค้นหารายชื่อลูกค้า':
        return (
          <Customers
            onEdit={(customer) => {
              const override = customerStatusOverrides[customer.hn];
              setEditingCustomer(
                override ? { ...customer, status: override } : customer
              );
              setActive('แก้ไขรายชื่อลูกค้า');
            }}
            onCreateNew={() => {
              console.log('กดปุ่มสร้างรายชื่อลูกค้าใหม่');
              setActive('สร้างรายชื่อลูกค้าใหม่');
              console.log('active page:', 'สร้างรายชื่อลูกค้าใหม่');
            }}
            statusOverrides={customerStatusOverrides}
          />
        );
      case 'สร้างรายชื่อลูกค้าใหม่':
        return (
          <>
            <div className="page-sticky-header">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 8,
                  marginBottom: 12,
                }}
              >
                <h1 className="page-title">สร้างรายชื่อลูกค้าใหม่</h1>
              </div>
            </div>
            <CreateCustomer
              initial={null}
              initialConditions={{}}
              onCancel={() => setActive('รายชื่อลูกค้า')}
              onSave={async (data) => {
                try {
                  await createCustomerOnServer(data);
                  setActive('รายชื่อลูกค้า');
                  openModal('สร้างรายชื่อลูกค้าสำเร็จ');
                } catch (err) {
                  openModal(err?.message || 'บันทึกลูกค้าไม่สำเร็จ');
                }
              }}
            />
          </>
        );
      case 'แก้ไขรายชื่อลูกค้า':
        if (!editingCustomer) {
          setActive('รายชื่อลูกค้า');
          return null;
        }
        return (
          <EditCustomer
            initial={editingCustomer}
            initialConditions={customerConditions[editingCustomer.hn] || {}}
            onCancel={() => setActive('รายชื่อลูกค้า')}
            onSave={(data) => {
              console.log('แก้ไขลูกค้า:', data);
              if (data?.hn && data?.status) {
                setCustomerStatusOverrides((prev) => ({
                  ...prev,
                  [data.hn]: data.status,
                }));
              }
              setEditingCustomer(null);
              setActive('รายชื่อลูกค้า');
              openModal('บันทึกข้อมูลลูกค้าสำเร็จ');
            }}
            onDefineConditions={(cond) => {
              if (!cond?.customer?.hn) {
                openModal('ไม่พบ HN ของลูกค้า');
                return;
              }
              setCustomerConditions((prev) => ({
                ...prev,
                [cond.customer.hn]: {
                  segment: cond.segment || '',
                  segmentText: cond.segmentText || '',
                  discount: cond.discount ?? '',
                  notes: cond.notes || '',
                  receiptName: cond.receiptName || '',
                  receiptAddress: cond.receiptAddress || '',
                },
              }));
            }}
          />
        );
      case 'รายการสั่งซื้อสินค้า':
        return (
          <PurchaseOrders
            purchaseOrders={purchaseOrders}
            onCreateNew={() => {
              setEditingPurchaseOrder(null);
              setActive('สร้างรายการสั่งซื้อ');
            }}
            onViewSuppliers={() => {
              setActive('รายการผู้จำหน่าย');
            }}
            onBackToPurchaseHome={() => {
              setActive('รายการสินค้า');
            }}
            onEdit={(order) => {
              const status = String(order?.status || '').trim();
              const isLocked = [
                'สั่งซื้อแล้ว',
                'รับของแล้ว',
                'รับบางส่วน',
              ].includes(status);

              if (isLocked) {
                openModal(
                  'ไม่สามารถแก้ไขรายการสั่งซื้อได้เมื่อสถานะเป็น สั่งซื้อแล้ว/รับของแล้ว/รับบางส่วน'
                );
                return;
              }
              setEditingPurchaseOrder(order);
              setActive('แก้ไขรายการสั่งซื้อ');
            }}
            onReceive={({ orderId, items }) => {
              const idKey = String(orderId || '').trim();
              const lines = Array.isArray(items) ? items : [];
              const toNumber = (n) => {
                const v = Number(n);
                return Number.isFinite(v) ? v : 0;
              };

              if (!idKey) {
                openModal('รับสินค้าไม่สำเร็จ: ไม่พบเลขที่ใบสั่งซื้อ');
                return;
              }

              if (!lines.length) {
                openModal('รับสินค้าไม่สำเร็จ: ไม่พบรายการรับเข้า');
                return;
              }

              // Prevent duplicate receiving (fully received orders)
              const currentOrders = Array.isArray(purchaseOrders)
                ? purchaseOrders
                : [];
              const target = currentOrders.find((po) => {
                const poId = String(po?.id || po?.poNo || '').trim();
                return poId === idKey;
              });

              if (target) {
                const status = String(target?.status || '').trim();
                const targetItems = Array.isArray(target?.items)
                  ? target.items
                  : [];

                const fullyByStatus = status === 'รับของแล้ว';
                const fullyByItems =
                  targetItems.length > 0 &&
                  targetItems.every((it) => {
                    const orderedQty = toNumber(it?.qty);
                    const receivedQty = toNumber(it?.receivedQty);
                    if (orderedQty <= 0) return true;
                    return receivedQty >= orderedQty;
                  });

                if (fullyByStatus || fullyByItems) {
                  openModal('ใบสั่งซื้อนี้รับครบแล้ว จึงไม่สามารถรับซ้ำได้');
                  return;
                }
              }

              const receivedAt = new Date().toISOString().slice(0, 10);

              const receivedByCode = new Map();
              for (const l of lines) {
                const code = String(l?.code || '').trim();
                const qty = toNumber(l?.qty);
                if (!code || qty <= 0) continue;

                const lotNo = String(l?.lotNo ?? '').trim();
                const expiryDate = String(l?.expiryDate ?? '').trim();
                const existing = receivedByCode.get(code) || {
                  qty: 0,
                  lotNo: '',
                  expiryDate: '',
                };

                receivedByCode.set(code, {
                  qty: existing.qty + qty,
                  lotNo: lotNo || existing.lotNo,
                  expiryDate: expiryDate || existing.expiryDate,
                });
              }

              // 1) Update purchase order receivedQty + status
              setPurchaseOrders((prev) => {
                const list = Array.isArray(prev) ? prev : [];
                const next = list.map((po) => {
                  const poId = String(po?.id || po?.poNo || '').trim();
                  if (poId !== idKey) return po;

                  const poItems = Array.isArray(po?.items) ? po.items : [];
                  // Allocate received qty across multiple lines with same code.
                  const remainingAddByCode = new Map();
                  for (const [code, meta] of receivedByCode.entries()) {
                    remainingAddByCode.set(code, toNumber(meta?.qty));
                  }

                  const updatedItems = poItems.map((it) => {
                    const code = String(it?.code || '').trim();
                    const addRemaining = toNumber(remainingAddByCode.get(code));
                    if (!code || addRemaining <= 0) return it;

                    const orderedQty = toNumber(it?.qty);
                    const currentReceived = toNumber(it?.receivedQty);
                    const lineRemaining = Math.max(
                      0,
                      orderedQty - currentReceived
                    );
                    if (lineRemaining <= 0) return it;

                    const add = Math.min(lineRemaining, addRemaining);
                    if (add <= 0) return it;

                    remainingAddByCode.set(code, addRemaining - add);

                    const meta = receivedByCode.get(code);
                    const prevLots = Array.isArray(it?.receivedLots)
                      ? it.receivedLots
                      : [];

                    return {
                      ...it,
                      receivedQty: Math.min(orderedQty, currentReceived + add),
                      receivedAt,
                      receivedLots: [
                        ...prevLots,
                        {
                          qty: add,
                          receivedAt,
                          ...(meta?.lotNo ? { lotNo: meta.lotNo } : null),
                          ...(meta?.expiryDate
                            ? { expiryDate: meta.expiryDate }
                            : null),
                        },
                      ],
                    };
                  });

                  const orderedTotal = updatedItems.reduce(
                    (acc, it) => acc + toNumber(it?.qty),
                    0
                  );
                  const receivedTotal = updatedItems.reduce(
                    (acc, it) => acc + toNumber(it?.receivedQty),
                    0
                  );

                  let nextStatus = String(po?.status || '');
                  if (orderedTotal > 0 && receivedTotal >= orderedTotal) {
                    nextStatus = 'รับของแล้ว';
                  } else if (
                    receivedTotal > 0 &&
                    receivedTotal < orderedTotal
                  ) {
                    nextStatus = 'รับบางส่วน';
                  }

                  return {
                    ...po,
                    items: updatedItems,
                    status: nextStatus,
                    lastReceivedAt: receivedAt,
                  };
                });
                return next;
              });

              // 2) Update product stock
              const missing = [];
              setProducts((prev) => {
                const list = Array.isArray(prev) ? prev : [];
                const next = list.map((p) => {
                  const code = String(p?.code || '').trim();
                  const meta = receivedByCode.get(code);
                  const add = meta?.qty ?? 0;
                  if (!code || add <= 0) return p;

                  const currentStock = Number.isFinite(Number(p?.stock))
                    ? Number(p.stock)
                    : 0;
                  const nextStock = currentStock + add;

                  const stockLots = Array.isArray(p?.stockLots)
                    ? p.stockLots
                    : [];

                  return stripProductPhotoUrl({
                    ...p,
                    stock: nextStock,
                    status: nextStock > 0 ? 'ใช้งาน' : 'ไม่ใช้งาน',
                    updatedAt: receivedAt,
                    stockLots: [
                      ...stockLots,
                      {
                        qty: add,
                        receivedAt,
                        ...(meta?.lotNo ? { lotNo: meta.lotNo } : null),
                        ...(meta?.expiryDate
                          ? { expiryDate: meta.expiryDate }
                          : null),
                        orderId: idKey,
                      },
                    ],
                  });
                });

                // collect missing codes
                for (const [code] of receivedByCode.entries()) {
                  if (
                    !next.some((p) => String(p?.code || '').trim() === code)
                  ) {
                    missing.push(code);
                  }
                }

                return next.map(stripProductPhotoUrl);
              });

              if (missing.length) {
                openModal(
                  `รับสินค้าแล้ว แต่ไม่พบสินค้าในคลังสำหรับรหัส: ${missing.join(', ')}`
                );
              } else {
                openModal('รับสินค้าเรียบร้อย');
              }
            }}
          />
        );

      case 'รายการผู้จำหน่าย':
        return (
          <Suppliers
            suppliers={suppliers}
            onCreateNew={() => setActive('สร้างรายการผู้จำหน่าย')}
            onEdit={(s) => {
              setEditingSupplier(s);
              setActive('แก้ไขรายการผู้จำหน่าย');
            }}
            onBack={() => setActive('รายการสั่งซื้อสินค้า')}
          />
        );

      case 'สร้างรายการผู้จำหน่าย':
        return (
          <CreateSupplier
            onCancel={() => setActive('รายการผู้จำหน่าย')}
            onSave={(data) => {
              const id = String(data?.id || '').trim();
              if (!id) {
                openModal('บันทึกไม่สำเร็จ: ไม่พบ ID ผู้จำหน่าย');
                return;
              }

              setSuppliers((prev) => {
                const list = Array.isArray(prev) ? prev : [];
                if (list.some((s) => String(s?.id || '').trim() === id)) {
                  openModal('บันทึกไม่สำเร็จ: ID ซ้ำ');
                  return list;
                }
                return [...list, data];
              });

              setActive('รายการผู้จำหน่าย');
              openModal('สร้างรายการผู้จำหน่ายสำเร็จ');
            }}
          />
        );

      case 'แก้ไขรายการผู้จำหน่าย': {
        if (!editingSupplier) {
          return (
            <>
              <h1>แก้ไขรายการผู้จำหน่าย</h1>
              <p>กรุณาเลือกรายการจากหน้า “รายการผู้จำหน่าย” ก่อน</p>
              <button
                type="button"
                className="button"
                onClick={() => setActive('รายการผู้จำหน่าย')}
              >
                ไปที่รายการผู้จำหน่าย
              </button>
            </>
          );
        }

        return (
          <CreateSupplier
            title="แก้ไขรายการผู้จำหน่าย"
            initial={editingSupplier}
            onCancel={() => {
              setEditingSupplier(null);
              setActive('รายการผู้จำหน่าย');
            }}
            onSave={(data) => {
              const id = String(data?.id || '').trim();
              if (!id) {
                openModal('บันทึกไม่สำเร็จ: ไม่พบ ID ผู้จำหน่าย');
                return;
              }

              let found = false;
              setSuppliers((prev) => {
                const list = Array.isArray(prev) ? prev : [];
                const next = list.map((s) => {
                  if (String(s?.id || '').trim() !== id) return s;
                  found = true;
                  return { ...s, ...data, id };
                });
                return found ? next : [...list, data];
              });

              setEditingSupplier(null);
              setActive('รายการผู้จำหน่าย');
              openModal(
                found
                  ? 'แก้ไขรายการผู้จำหน่ายสำเร็จ'
                  : 'แก้ไขสำเร็จ (เพิ่มเป็นรายการใหม่)'
              );
            }}
          />
        );
      }
      case 'สร้างรายการสั่งซื้อ':
        return (
          <CreatePurchaseOrder
            products={products}
            suppliers={suppliers}
            onCancel={() => setActive('รายการสั่งซื้อสินค้า')}
            onSave={(data) => {
              console.log('สร้างรายการสั่งซื้อ:', data);
              if (data?.id) {
                setPurchaseOrders((prev) => {
                  const byId = new Map(
                    (Array.isArray(prev) ? prev : []).map((o) => [
                      String(o?.id || o?.poNo || ''),
                      o,
                    ])
                  );
                  byId.set(String(data.id), data);
                  return Array.from(byId.values());
                });
              }
              setActive('รายการสั่งซื้อสินค้า');
              openModal('สร้างรายการสั่งซื้อสำเร็จ');
            }}
          />
        );
      case 'แก้ไขรายการสั่งซื้อ': {
        if (!editingPurchaseOrder) {
          return (
            <>
              <h1>แก้ไขรายการสั่งซื้อ</h1>
              <p>กรุณาเลือกรายการจากหน้า “รายการสั่งซื้อสินค้า” ก่อน</p>
              <button
                type="button"
                className="button"
                onClick={() => setActive('รายการสั่งซื้อสินค้า')}
              >
                ไปที่รายการสั่งซื้อสินค้า
              </button>
            </>
          );
        }

        const status = String(editingPurchaseOrder?.status || '').trim();
        const isLocked = ['สั่งซื้อแล้ว', 'รับของแล้ว', 'รับบางส่วน'].includes(
          status
        );

        if (isLocked) {
          return (
            <>
              <h1>แก้ไขรายการสั่งซื้อ</h1>
              <p>รายการนี้อยู่ในสถานะ “{status || '-'}” จึงไม่สามารถแก้ไขได้</p>
              <button
                type="button"
                className="button"
                onClick={() => {
                  setEditingPurchaseOrder(null);
                  setActive('รายการสั่งซื้อสินค้า');
                }}
              >
                กลับไปหน้ารายการสั่งซื้อสินค้า
              </button>
            </>
          );
        }

        return (
          <CreatePurchaseOrder
            title="แก้ไขรายการสั่งซื้อ"
            initial={editingPurchaseOrder}
            products={products}
            suppliers={suppliers}
            onCancel={() => {
              setEditingPurchaseOrder(null);
              setActive('รายการสั่งซื้อสินค้า');
            }}
            onDelete={(order) => {
              const current = order || editingPurchaseOrder;
              const currentStatus = String(current?.status || '').trim();
              if (currentStatus !== 'ร่าง') {
                openModal(
                  'ลบไม่สำเร็จ: สามารถลบได้เฉพาะใบสั่งซื้อสถานะ “ร่าง”'
                );
                return;
              }

              const idKey = String(current?.id || current?.poNo || '').trim();
              if (!idKey) {
                openModal('ลบไม่สำเร็จ: ไม่พบเลขที่ใบสั่งซื้อ');
                return;
              }

              setPurchaseOrders((prev) => {
                const list = Array.isArray(prev) ? prev : [];
                return list.filter(
                  (po) => String(po?.id || po?.poNo || '').trim() !== idKey
                );
              });

              setEditingPurchaseOrder(null);
              setActive('รายการสั่งซื้อสินค้า');
              openModal('ลบใบสั่งซื้อเรียบร้อย');
            }}
            onSave={(data) => {
              console.log('แก้ไขรายการสั่งซื้อ:', data);
              if (data?.id) {
                setPurchaseOrders((prev) => {
                  const byId = new Map(
                    (Array.isArray(prev) ? prev : []).map((o) => [
                      String(o?.id || o?.poNo || ''),
                      o,
                    ])
                  );
                  const existing = byId.get(String(data.id));
                  byId.set(
                    String(data.id),
                    existing ? { ...existing, ...data } : data
                  );
                  return Array.from(byId.values());
                });
              }
              setEditingPurchaseOrder(null);
              setActive('รายการสั่งซื้อสินค้า');
              openModal('บันทึกรายการสั่งซื้อสำเร็จ');
            }}
          />
        );
      }
      case 'รายการสินค้า':
      case 'ค้นหารายการสินค้า':
        return (
          <Products
            products={products}
            onEdit={(product) => {
              setEditingProduct(product);
              setActive('แก้ไขรายละเอียดสินค้า');
            }}
            onCreateNew={() => {
              setEditingProduct(null);
              setActive('สร้างรายการสินค้าใหม่');
            }}
            onViewIngredients={() => {
              setActive('Ingredient');
            }}
            onPurchase={() => {
              setActive('รายการสั่งซื้อสินค้า');
            }}
            onReceiveStock={() => {
              setActive('รับสินค้าเข้า stock');
            }}
            onViewMovements={(product) => {
              const code = String(product?.code || '').trim();
              setMovementFilterCode(code || null);
              setActive('รายการเคลื่อนไหวสินค้า');
            }}
            onViewConsumables={() => {
              setActive('วัสดุสิ้นเปลืองและอื่นๆ');
            }}
          />
        );
      case 'Ingredient':
        return (
          <Ingredients
            items={ingredients}
            onItemsChange={setIngredients}
            draft={ingredientDraft}
            onDraftChange={setIngredientDraft}
            onBack={() => setActive('รายการสินค้า')}
            onReceiveStock={() => setActive('รับ Ingredient เข้า stock')}
            onViewMovements={(ingredient) => {
              const code = String(ingredient?.code || '').trim();
              setIngredientMovementFilterCode(code || null);
              setActive('รายการเคลื่อนไหว Ingredient');
            }}
            onEdit={(ingredient) => {
              setEditingIngredient(ingredient);
              setActive('แก้ไขรายละเอียด Ingredient');
            }}
            onProceed={(items) => {
              const list = Array.isArray(items) ? items : [];
              if (list.length === 0) {
                openModal('ยังไม่ได้เลือก Ingredient');
                return;
              }

              const now = new Date().toISOString().slice(0, 10);
              const currentIngredients = Array.isArray(ingredients)
                ? ingredients
                : [];
              const byCode = new Map(
                currentIngredients.map((i) => [String(i?.code || '').trim(), i])
              );
              const updates = new Map();

              for (const it of list) {
                const codeKey = String(it?.code || '').trim();
                if (!codeKey) {
                  openModal('ตัด Ingredient ไม่สำเร็จ: ไม่พบรหัส Ingredient');
                  return;
                }
                const ingredient = byCode.get(codeKey);
                if (!ingredient) {
                  openModal(`ตัด Ingredient ไม่สำเร็จ: ไม่พบ ${codeKey}`);
                  return;
                }

                const qtyNum = Number(it?.qty);
                if (!Number.isFinite(qtyNum) || qtyNum <= 0) {
                  openModal(
                    `ตัด Ingredient ไม่สำเร็จ: จำนวนไม่ถูกต้อง (${codeKey})`
                  );
                  return;
                }

                const available = getIngredientAvailableStock(ingredient);
                if (qtyNum > available) {
                  openModal(
                    `ตัด Ingredient ไม่สำเร็จ: จำนวนมากกว่าคงเหลือ (${codeKey})`
                  );
                  return;
                }

                const lots = Array.isArray(ingredient?.stockLots)
                  ? ingredient.stockLots
                  : [];
                const consumeResult = lots.length
                  ? consumeIngredientFromLots({ lots, qty: qtyNum })
                  : {
                      ok: true,
                      nextLots: lots,
                      consumed: [],
                      newStock: available - qtyNum,
                    };

                if (!consumeResult.ok) {
                  openModal(
                    `ตัด Ingredient ไม่สำเร็จ: ${consumeResult.error || codeKey}`
                  );
                  return;
                }

                updates.set(codeKey, {
                  qty: qtyNum,
                  note: String(it?.note || '').trim(),
                  consumeResult,
                });
              }

              setIngredients((prev) => {
                const src = Array.isArray(prev) ? prev : [];
                return src.map((ingredient) => {
                  const codeKey = String(ingredient?.code || '').trim();
                  const update = updates.get(codeKey);
                  if (!update) return ingredient;

                  const existingIssues = Array.isArray(ingredient?.stockIssues)
                    ? ingredient.stockIssues
                    : [];

                  const consumedLots = update.consumeResult.consumed || [];
                  const issueEntries = consumedLots.length
                    ? consumedLots.map((lot) => ({
                        issuedAt: now,
                        lotNo: String(lot?.lotNo || '').trim() || '-',
                        expiryDate: String(lot?.expiryDate || '').trim() || '-',
                        qty: Number(lot?.qty) || update.qty,
                        note: update.note,
                        issuedBy: 'ผู้ใช้งานระบบ',
                      }))
                    : [
                        {
                          issuedAt: now,
                          lotNo: '-',
                          expiryDate: '-',
                          qty: update.qty,
                          note: update.note,
                          issuedBy: 'ผู้ใช้งานระบบ',
                        },
                      ];

                  const nextStock = Number.isFinite(
                    Number(update.consumeResult.newStock)
                  )
                    ? Number(update.consumeResult.newStock)
                    : Math.max(
                        0,
                        getIngredientAvailableStock(ingredient) - update.qty
                      );

                  return {
                    ...ingredient,
                    stock: nextStock,
                    status: nextStock > 0 ? 'ใช้งาน' : 'ไม่ใช้งาน',
                    updatedAt: now,
                    stockLots:
                      update.consumeResult.nextLots || ingredient.stockLots,
                    stockIssues: [...existingIssues, ...issueEntries],
                  };
                });
              });

              setIngredientDraft([]);
              openModal('ตัดยาสั่งผลิดเรียบร้อยแล้ว');
            }}
          />
        );
      case 'แก้ไขรายละเอียด Ingredient':
        return (
          <EditIngredient
            initial={editingIngredient}
            onCancel={() => {
              setEditingIngredient(null);
              setActive('Ingredient');
            }}
            onSave={(data) => {
              const codeKey = String(data?.code || '').trim();
              if (!codeKey) {
                openModal('บันทึกข้อมูล Ingredient ไม่สำเร็จ: ไม่พบรหัส');
                return;
              }

              setIngredients((prev) => {
                const src = Array.isArray(prev) ? prev : [];
                const exists = src.some(
                  (it) => String(it?.code || '').trim() === codeKey
                );
                if (!exists) {
                  openModal(
                    `บันทึกข้อมูล Ingredient ไม่สำเร็จ: ไม่พบ ${codeKey}`
                  );
                  return src;
                }

                return src.map((it) => {
                  if (String(it?.code || '').trim() !== codeKey) return it;
                  return {
                    ...it,
                    ...data,
                    code: codeKey,
                  };
                });
              });

              setEditingIngredient(null);
              setActive('Ingredient');
              openModal('บันทึกข้อมูล Ingredient สำเร็จ');
            }}
          />
        );
      case 'วัสดุสิ้นเปลืองและอื่นๆ':
        return (
          <Consumables
            items={consumables}
            onItemsChange={setConsumables}
            onReceiveStock={() => setActive('รับวัสดุสิ้นเปลืองเข้า stock')}
            onViewMovements={(consumable) => {
              const code = String(consumable?.code || '').trim();
              setConsumableMovementFilterCode(code || null);
              setActive('รายการเคลื่อนไหววัสดุสิ้นเปลือง');
            }}
            onEdit={(consumable) => {
              setEditingConsumable(consumable);
              setActive('แก้ไขรายละเอียดวัสดุสิ้นเปลือง');
            }}
            onBack={() => setActive('รายการสินค้า')}
          />
        );
      case 'รายการเคลื่อนไหว Ingredient':
        return (
          <IngredientMovements
            ingredients={ingredients}
            filterCode={ingredientMovementFilterCode}
            onBackToIngredients={() => setActive('Ingredient')}
            onBackToProducts={() => setActive('รายการสินค้า')}
            onSaveCosts={({ code, cost }) => {
              const codeKey = String(code || '').trim();
              const costNum = Number(cost);
              if (!codeKey) {
                openModal('บันทึกต้นทุนไม่สำเร็จ: ไม่พบรหัส Ingredient');
                return;
              }
              if (!codeKey.startsWith('ING-')) {
                openModal(
                  `บันทึกต้นทุนไม่สำเร็จ: รหัส Ingredient ไม่ถูกต้อง (${codeKey})`
                );
                return;
              }
              if (!Number.isFinite(costNum) || costNum <= 0) {
                openModal(
                  `บันทึกต้นทุนไม่สำเร็จ: ต้นทุนไม่ถูกต้อง (${codeKey})`
                );
                return;
              }

              setIngredients((prev) => {
                const src = Array.isArray(prev) ? prev : [];
                const exists = src.some(
                  (c) => String(c?.code || '').trim() === codeKey
                );
                if (!exists) {
                  openModal(
                    `บันทึกต้นทุนไม่สำเร็จ: ไม่พบ Ingredient ${codeKey}`
                  );
                  return src;
                }

                return src.map((c) => {
                  const cCode = String(c?.code || '').trim();
                  if (cCode !== codeKey) return c;
                  return {
                    ...c,
                    price: costNum,
                  };
                });
              });

              openModal(
                `บันทึกต้นทุนสำเร็จ: ${codeKey} = ${costNum.toLocaleString('th-TH')}`
              );
            }}
          />
        );
      case 'รายการเคลื่อนไหววัสดุสิ้นเปลือง':
        return (
          <ConsumableMovements
            consumables={consumables}
            filterCode={consumableMovementFilterCode}
            onBackToConsumables={() => setActive('วัสดุสิ้นเปลืองและอื่นๆ')}
            onBackToProducts={() => setActive('รายการสินค้า')}
            onSaveCosts={({ code, cost }) => {
              const codeKey = String(code || '').trim();
              const costNum = Number(cost);
              if (!codeKey) {
                openModal('บันทึกต้นทุนไม่สำเร็จ: ไม่พบรหัสวัสดุ');
                return;
              }
              if (!codeKey.startsWith('C-')) {
                openModal(
                  `บันทึกต้นทุนไม่สำเร็จ: รหัสวัสดุไม่ถูกต้อง (${codeKey})`
                );
                return;
              }
              if (!Number.isFinite(costNum) || costNum <= 0) {
                openModal(
                  `บันทึกต้นทุนไม่สำเร็จ: ต้นทุนไม่ถูกต้อง (${codeKey})`
                );
                return;
              }

              setConsumables((prev) => {
                const src = Array.isArray(prev) ? prev : [];
                const exists = src.some(
                  (c) => String(c?.code || '').trim() === codeKey
                );
                if (!exists) {
                  openModal(`บันทึกต้นทุนไม่สำเร็จ: ไม่พบวัสดุ ${codeKey}`);
                  return src;
                }

                return src.map((c) => {
                  const cCode = String(c?.code || '').trim();
                  if (cCode !== codeKey) return c;
                  return {
                    ...c,
                    price: costNum,
                  };
                });
              });

              openModal(
                `บันทึกต้นทุนสำเร็จ: ${codeKey} = ${costNum.toLocaleString('th-TH')}`
              );
            }}
          />
        );
      case 'แก้ไขรายละเอียดวัสดุสิ้นเปลือง':
        return (
          <EditConsumable
            title="แก้ไขรายละเอียดวัสดุสิ้นเปลือง"
            initial={editingConsumable}
            onCancel={() => {
              setEditingConsumable(null);
              setActive('วัสดุสิ้นเปลืองและอื่นๆ');
            }}
            onSave={(data) => {
              const codeKey = String(data?.code || '').trim();
              if (!codeKey) {
                openModal('บันทึกข้อมูลวัสดุไม่สำเร็จ: ไม่พบรหัสวัสดุ');
                return;
              }

              setConsumables((prev) => {
                const src = Array.isArray(prev) ? prev : [];
                const exists = src.some(
                  (it) => String(it?.code || '').trim() === codeKey
                );
                if (!exists) {
                  openModal(
                    `บันทึกข้อมูลวัสดุไม่สำเร็จ: ไม่พบวัสดุ ${codeKey}`
                  );
                  return src;
                }

                return src.map((it) => {
                  if (String(it?.code || '').trim() !== codeKey) return it;
                  return {
                    ...it,
                    ...data,
                    code: codeKey,
                  };
                });
              });

              setEditingConsumable(null);
              setActive('วัสดุสิ้นเปลืองและอื่นๆ');
              openModal('บันทึกข้อมูลวัสดุสำเร็จ');
            }}
          />
        );
      case 'รายการเคลื่อนไหวสินค้า':
        return (
          <ProductMovements
            products={products}
            filterCode={movementFilterCode}
            onBack={() => setActive('รายการสินค้า')}
            onSaveCosts={({ code, cost }) => {
              const codeKey = String(code || '').trim();
              const costNum = Number(cost);
              if (!codeKey) {
                openModal('บันทึกต้นทุนไม่สำเร็จ: ไม่พบรหัสสินค้า');
                return;
              }
              if (!Number.isFinite(costNum) || costNum <= 0) {
                openModal(
                  `บันทึกต้นทุนไม่สำเร็จ: ต้นทุนไม่ถูกต้อง (${codeKey})`
                );
                return;
              }

              setProducts((prev) => {
                const src = Array.isArray(prev) ? prev : [];
                const exists = src.some(
                  (p) => String(p?.code || '').trim() === codeKey
                );
                if (!exists) {
                  openModal(`บันทึกต้นทุนไม่สำเร็จ: ไม่พบสินค้า ${codeKey}`);
                  return src;
                }

                return src.map((p) => {
                  const c = String(p?.code || '').trim();
                  if (c !== codeKey) return p;
                  return stripProductPhotoUrl({
                    ...p,
                    cost: costNum,
                  });
                });
              });

              openModal(
                `บันทึกต้นทุนสำเร็จ: ${codeKey} = ${costNum.toLocaleString('th-TH')}`
              );
            }}
          />
        );

      case 'รับวัสดุสิ้นเปลืองเข้า stock':
        return (
          <ReceiveConsumablesStock
            existingConsumables={consumables}
            onCancel={() => setActive('วัสดุสิ้นเปลืองและอื่นๆ')}
            onReceive={({ code, qty, lotNo, expiryDate }) => {
              const codeKey = String(code || '').trim();
              const qtyNum = Number(qty);
              const lotKey = String(lotNo || '').trim();
              const expKey = String(expiryDate || '').trim();
              if (!codeKey) {
                openModal('รับเข้า stock ไม่สำเร็จ: ไม่พบรหัสวัสดุ');
                return;
              }
              if (!Number.isFinite(qtyNum) || qtyNum <= 0) {
                openModal('รับเข้า stock ไม่สำเร็จ: จำนวนไม่ถูกต้อง');
                return;
              }

              if (
                !(Array.isArray(consumables) ? consumables : []).some(
                  (it) => String(it?.code || '').trim() === codeKey
                )
              ) {
                openModal(
                  `รับเข้า stock ไม่สำเร็จ: ไม่พบวัสดุสิ้นเปลือง ${codeKey}`
                );
                return;
              }

              const receivedAt = new Date().toISOString().slice(0, 10);

              setConsumables((prev) => {
                const list = Array.isArray(prev) ? prev : [];
                return list.map((it) => {
                  if (String(it?.code || '').trim() !== codeKey) return it;

                  const currentStock = Number.isFinite(Number(it?.stock))
                    ? Number(it.stock)
                    : 0;
                  const nextStock = currentStock + qtyNum;
                  const stockLots = Array.isArray(it?.stockLots)
                    ? it.stockLots
                    : [];

                  return {
                    ...it,
                    stock: nextStock,
                    status: nextStock > 0 ? 'ใช้งาน' : 'ไม่ใช้งาน',
                    updatedAt: receivedAt,
                    stockLots: [
                      ...stockLots,
                      {
                        qty: qtyNum,
                        receivedAt,
                        ...(lotKey ? { lotNo: lotKey } : null),
                        ...(expKey ? { expiryDate: expKey } : null),
                      },
                    ],
                  };
                });
              });

              openModal(`รับเข้า stock สำเร็จ: ${codeKey} +${qtyNum}`);
            }}
          />
        );
      case 'รับ Ingredient เข้า stock':
        return (
          <ReceiveIngredientsStock
            existingIngredients={ingredients}
            onCancel={() => setActive('Ingredient')}
            onReceive={({ code, qty, lotNo, expiryDate }) => {
              const codeKey = String(code || '').trim();
              const qtyNum = Number(qty);
              const lotKey = String(lotNo || '').trim();
              const expKey = String(expiryDate || '').trim();
              if (!codeKey) {
                openModal('รับเข้า stock ไม่สำเร็จ: ไม่พบรหัส Ingredient');
                return;
              }
              if (!Number.isFinite(qtyNum) || qtyNum <= 0) {
                openModal('รับเข้า stock ไม่สำเร็จ: จำนวนไม่ถูกต้อง');
                return;
              }

              if (
                !(Array.isArray(ingredients) ? ingredients : []).some(
                  (it) => String(it?.code || '').trim() === codeKey
                )
              ) {
                openModal(
                  `รับเข้า stock ไม่สำเร็จ: ไม่พบ Ingredient ${codeKey}`
                );
                return;
              }

              const receivedAt = new Date().toISOString().slice(0, 10);

              setIngredients((prev) => {
                const list = Array.isArray(prev) ? prev : [];
                return list.map((it) => {
                  if (String(it?.code || '').trim() !== codeKey) return it;

                  const currentStock = Number.isFinite(Number(it?.stock))
                    ? Number(it.stock)
                    : 0;
                  const nextStock = currentStock + qtyNum;
                  const stockLots = Array.isArray(it?.stockLots)
                    ? it.stockLots
                    : [];

                  return {
                    ...it,
                    stock: nextStock,
                    status: nextStock > 0 ? 'ใช้งาน' : 'ไม่ใช้งาน',
                    updatedAt: receivedAt,
                    stockLots: [
                      ...stockLots,
                      {
                        qty: qtyNum,
                        receivedAt,
                        ...(lotKey ? { lotNo: lotKey } : null),
                        ...(expKey ? { expiryDate: expKey } : null),
                      },
                    ],
                  };
                });
              });

              openModal(`รับเข้า stock สำเร็จ: ${codeKey} +${qtyNum}`);
            }}
          />
        );
      case 'รับสินค้าเข้า stock':
        return (
          <ReceiveStock
            existingProducts={products}
            onCancel={() => setActive('รายการสินค้า')}
            onReceive={({ code, qty, lotNo, expiryDate }) => {
              const codeKey = String(code || '').trim();
              if (!codeKey) {
                openModal('รับสินค้าเข้า stock ไม่สำเร็จ: ไม่พบรหัสสินค้า');
                return;
              }
              if (
                !(Array.isArray(products) ? products : []).some(
                  (p) => String(p?.code || '') === codeKey
                )
              ) {
                openModal(
                  `รับสินค้าเข้า stock ไม่สำเร็จ: ไม่พบสินค้า ${codeKey}`
                );
                return;
              }

              const receivedAt = new Date().toISOString().slice(0, 10);

              setProducts((prev) => {
                const list = Array.isArray(prev) ? prev : [];
                const next = list.map((p) => {
                  if (String(p?.code || '') !== codeKey) return p;

                  const currentStock = Number.isFinite(Number(p?.stock))
                    ? Number(p.stock)
                    : 0;
                  const nextStock = currentStock + Number(qty || 0);
                  const stockLots = Array.isArray(p?.stockLots)
                    ? p.stockLots
                    : [];

                  return stripProductPhotoUrl({
                    ...p,
                    stock: nextStock,
                    status: nextStock > 0 ? 'ใช้งาน' : 'ไม่ใช้งาน',
                    updatedAt: receivedAt,
                    stockLots: [
                      ...stockLots,
                      {
                        lotNo: String(lotNo || '').trim(),
                        expiryDate: String(expiryDate || '').trim(),
                        qty: Number(qty || 0),
                        receivedAt,
                      },
                    ],
                  });
                });
                return next.map(stripProductPhotoUrl);
              });

              openModal(
                `รับสินค้าเข้า stock สำเร็จ: ${codeKey} +${qty} (LOT ${lotNo}, EXP ${expiryDate})`
              );
            }}
          />
        );
      case 'สร้างรายการสินค้าใหม่':
        return (
          <CreateProduct
            title={
              createProductFromIngredients
                ? 'ผลิตยาตัวใหม่ (สร้างสินค้าใหม่จาก Ingredient)'
                : 'สร้างรายการสินค้าใหม่'
            }
            prefill={createProductFromIngredients || null}
            onCancel={() => {
              if (createProductFromIngredients) {
                setActive('Ingredient');
                return;
              }
              setActive('รายการสินค้า');
            }}
            onSave={(data) => {
              console.log('สร้างสินค้าใหม่:', data);
              if (data?.code) {
                setProducts((prev) => {
                  const byCode = new Map(
                    (Array.isArray(prev) ? prev : []).map((p) => [
                      String(p?.code || ''),
                      p,
                    ])
                  );
                  byCode.set(String(data.code), stripProductPhotoUrl(data));
                  return Array.from(byCode.values());
                });
              }
              setCreateProductFromIngredients(null);
              setActive('รายการสินค้า');
              openModal('สร้างรายการสินค้าใหม่สำเร็จ');
            }}
          />
        );
      case 'แก้ไขรายละเอียดสินค้า':
        return (
          <EditProduct
            title="แก้ไขรายละเอียดสินค้า"
            initial={editingProduct}
            onCancel={() => {
              setEditingProduct(null);
              setActive('รายการสินค้า');
            }}
            onSave={(data) => {
              console.log('แก้ไขสินค้า:', data);
              if (data?.code) {
                setProducts((prev) => {
                  const byCode = new Map(
                    (Array.isArray(prev) ? prev : []).map((p) => [
                      String(p?.code || ''),
                      p,
                    ])
                  );
                  const existing = byCode.get(String(data.code));
                  const merged = existing ? { ...existing, ...data } : data;
                  byCode.set(String(data.code), stripProductPhotoUrl(merged));
                  return Array.from(byCode.values());
                });
              }
              setEditingProduct(null);
              setActive('รายการสินค้า');
              openModal('บันทึกข้อมูลสินค้าสำเร็จ');
            }}
          />
        );
      case 'การชำระเงิน':
      case 'รับชำระเงิน':
        return (
          <>
            <h1>การชำระเงิน</h1>
            <p>จัดการการชำระเงิน ดูรายการ และออกใบเสร็จ</p>
          </>
        );

      case 'ค่าบริการ':
        return (
          <RecordServiceFees
            onOpenServiceFees={() => setActive('รายการค่าบริการ')}
            onOpenServiceRecord={() => setActive('บันทึกรายการบริการ')}
          />
        );

      case 'บันทึกรายการค่าบริการ':
        return (
          <RecordServiceFees
            onOpenServiceFees={() => setActive('รายการค่าบริการ')}
            onOpenServiceRecord={() => setActive('บันทึกรายการบริการ')}
          />
        );

      case 'รายการค่าบริการ':
        return (
          <ServiceFees
            title="รายการค่าบริการ"
            items={serviceFees}
            onCreateNew={() => setActive('สร้างรายการค่าบริการ')}
            onOpenTrainersOperators={() => setActive('ผู้ฝึกสอน/ผู้ดำเนินการ')}
            onBackToRecord={() => setActive('บันทึกรายการค่าบริการ')}
          />
        );

      case 'สร้างรายการค่าบริการ':
        return (
          <CreateServiceFee
            title="สร้างรายการค่าบริการ"
            onCancel={() => setActive('รายการค่าบริการ')}
            onSave={(data) => {
              if (data && typeof data === 'object') {
                setServiceFees((prev) => {
                  const src = Array.isArray(prev) ? prev : [];
                  return [...src, data];
                });
              }
              setActive('รายการค่าบริการ');
              openModal('บันทึกข้อมูลค่าบริการสำเร็จ');
            }}
          />
        );

      case 'ผู้ฝึกสอน/ผู้ดำเนินการ':
        return (
          <TrainersOperators
            onBack={() => setActive('รายการค่าบริการ')}
            items={trainersOperators}
            onCreateNew={() => setActive('สร้างผู้ฝึกสอน/ผู้ดำเนินการ')}
          />
        );

      case 'สร้างผู้ฝึกสอน/ผู้ดำเนินการ':
        return (
          <CreateTrainerOperator
            title="สร้างผู้ฝึกสอน/ผู้ดำเนินการ"
            onCancel={() => setActive('ผู้ฝึกสอน/ผู้ดำเนินการ')}
            onSave={(data) => {
              if (data && typeof data === 'object') {
                setTrainersOperators((prev) => {
                  const src = Array.isArray(prev) ? prev : [];
                  return [...src, data];
                });
              }
              setActive('ผู้ฝึกสอน/ผู้ดำเนินการ');
              openModal('บันทึกข้อมูลผู้ฝึกสอน/ผู้ดำเนินการสำเร็จ');
            }}
          />
        );
      case 'ตั้งค่าทั่วไป':
        return (
          <>
            <h1>ตั้งค่า</h1>
            <p>ตั้งค่าทั่วไปของระบบ</p>
          </>
        );
      default:
        return (
          <>
            <h1>{activePage}</h1>
            <p>เนื้อหาหน้านี้ยังไม่ได้ออกแบบ — แสดงแบบ placeholder</p>
          </>
        );
    }
  }

  const createAppointment = (data) => {
    const payload = data && typeof data === 'object' ? data : {};
    const id = `${Date.now()}_${Math.random().toString(16).slice(2)}`;

    const normalizeAppointmentStatus = (raw) => {
      const s = String(raw || '')
        .trim()
        .toLowerCase();
      if (!s) return '';
      if (s === 'attended') return 'attended';
      if (s === 'cancelled' || s === 'canceled') return 'cancelled';
      if (s.includes('มาตาม')) return 'attended';
      if (s.includes('ยกเลิก')) return 'cancelled';
      return '';
    };

    const date = String(payload?.date || '').trim();
    const timeStart = String(payload?.timeStart || payload?.time || '').trim();
    const timeEnd = String(payload?.timeEnd || '').trim();
    const patient =
      String(payload?.customerName || payload?.patient || '').trim() || '-';
    const service = String(
      payload?.subject || payload?.service || payload?.details || ''
    ).trim();

    const appointmentStatus =
      normalizeAppointmentStatus(
        payload?.appointmentStatus || payload?.apptStatus || payload?.status
      ) || '';

    const calendarAppt = {
      ...payload,
      date,
      timeStart,
      timeEnd,
      time: timeStart,
      patient,
      service: service || 'นัดหมาย',
      appointmentStatus,
    };

    // Update UI immediately (calendar updates right away)
    setAppointments((prev) => [
      ...(Array.isArray(prev) ? prev : []).map((a) => a),
      { ...calendarAppt, id },
    ]);

    console.log('สร้างนัดหมาย:', calendarAppt);
    openModal('สร้างนัดหมายสำเร็จ');
  };

  const updateAppointment = (data) => {
    const payload = data && typeof data === 'object' ? data : {};
    const id = String(payload?.id || '').trim();
    if (!id) {
      console.warn('Update appointment skipped: missing id', payload);
      openModal('ไม่สามารถแก้ไขนัดหมายได้ (ไม่พบรหัสรายการ)');
      return;
    }

    const normalizeAppointmentStatus = (raw) => {
      const s = String(raw || '')
        .trim()
        .toLowerCase();
      if (!s) return '';
      if (s === 'attended') return 'attended';
      if (s === 'cancelled' || s === 'canceled') return 'cancelled';
      if (s.includes('มาตาม')) return 'attended';
      if (s.includes('ยกเลิก')) return 'cancelled';
      return '';
    };

    const date = String(payload?.date || '').trim();
    const timeStart = String(payload?.timeStart || payload?.time || '').trim();
    const timeEnd = String(payload?.timeEnd || '').trim();
    const patient =
      String(payload?.customerName || payload?.patient || '').trim() || '-';
    const service = String(
      payload?.subject || payload?.service || payload?.details || ''
    ).trim();

    const appointmentStatus =
      normalizeAppointmentStatus(
        payload?.appointmentStatus || payload?.apptStatus || payload?.status
      ) || '';

    const calendarAppt = {
      ...payload,
      date,
      timeStart,
      timeEnd,
      time: timeStart,
      patient,
      service: service || 'นัดหมาย',
      appointmentStatus,
    };

    setAppointments((prev) => {
      const items = Array.isArray(prev) ? prev : [];
      return items.map((a) =>
        String(a?.id || '').trim() === id ? { ...a, ...calendarAppt, id } : a
      );
    });

    console.log('แก้ไขนัดหมาย:', calendarAppt);
    openModal('บันทึกการแก้ไขนัดหมายสำเร็จ');
  };

  const deleteAppointment = (apptOrId) => {
    const id =
      typeof apptOrId === 'string'
        ? apptOrId
        : String(apptOrId?.id || '').trim();
    if (!id) {
      openModal('ไม่สามารถลบนัดหมายได้ (ไม่พบรหัสรายการ)');
      return;
    }

    setAppointments((prev) => {
      const items = Array.isArray(prev) ? prev : [];
      return items.filter((a) => String(a?.id || '').trim() !== id);
    });

    console.log('ลบนัดหมาย:', id);
    openModal('ลบนัดหมายสำเร็จ');
  };

  return (
    <div className={`app${navCompact ? ' nav-compact' : ''}`}>
      <header className="header" ref={headerRef}>
        <div className="container">
          <button
            type="button"
            className="brand"
            onClick={() => handleNavItemClick('ตารางนัดหมาย')}
            aria-label="ไปที่ตารางนัดหมาย"
          >
            <img src="/logo.png" alt="ABSMEDIQ" />
          </button>

          <div
            id="navbarNav"
            className={`navbar-collapse${navOpen ? ' show' : ''}`}
          >
            <nav className="nav">
              {navItems.map((navItem) => {
                if (navItem.items) {
                  const isOpen = openDropdownId === navItem.id;
                  const isActive = isNavItemActive(navItem);

                  return (
                    <div
                      key={navItem.id}
                      className="nav-item dropdown"
                      ref={(el) => {
                        dropdownContainerRefs.current[navItem.id] = el;
                      }}
                    >
                      <div
                        className={`nav-dropdown ${isActive ? 'active' : ''}`}
                      >
                        <button
                          type="button"
                          className="nav-dropdown__label"
                          onClick={() => {
                            setOpenDropdownId(null);
                            handleNavItemClick(navItem.label);
                          }}
                          aria-current={
                            active === navItem.label ? 'page' : undefined
                          }
                        >
                          {navItem.label}
                        </button>

                        <button
                          type="button"
                          className="nav-dropdown__toggle dropdown-toggle"
                          ref={(el) => {
                            dropdownButtonRefs.current[navItem.id] = el;
                          }}
                          onClick={() => {
                            setOpenDropdownId((current) => {
                              const next =
                                current === navItem.id ? null : navItem.id;
                              if (next && !isMobile) updateDropdownPos(next);
                              return next;
                            });
                          }}
                          data-bs-toggle="dropdown"
                          aria-label={`เปิดเมนูย่อย ${navItem.label}`}
                          aria-expanded={isOpen}
                          aria-controls={`dropdown-${navItem.id}`}
                        />
                      </div>

                      {isOpen && (
                        <div
                          id={`dropdown-${navItem.id}`}
                          className={`dropdown-menu${
                            isMobile ? '' : ' dropdown-menu--fixed'
                          }`}
                          role="menu"
                          style={
                            isMobile
                              ? undefined
                              : {
                                  top: `${dropdownPos.top}px`,
                                  left: `${dropdownPos.left}px`,
                                  minWidth: `${Math.max(
                                    200,
                                    dropdownPos.width
                                  )}px`,
                                  zIndex: 1000,
                                }
                          }
                        >
                          {navItem.items.map((item) => (
                            <button
                              key={item}
                              type="button"
                              role="menuitem"
                              onClick={() => {
                                setOpenDropdownId(null);
                                handleNavItemClick(item);
                              }}
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <button
                    key={navItem.id}
                    type="button"
                    className={active === navItem.label ? 'active' : ''}
                    onClick={() => handleNavItemClick(navItem.label)}
                    aria-current={active === navItem.label ? 'page' : undefined}
                  >
                    {navItem.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="header-actions">
            <button
              type="button"
              className="logout-button"
              onClick={handleLogout}
            >
              Log out
            </button>

            <button
              className="navbar-toggler"
              type="button"
              aria-controls="navbarNav"
              aria-expanded={navOpen}
              aria-label="Toggle navigation"
              onClick={() => setNavOpen((v) => !v)}
            >
              <span className="navbar-toggler-icon"></span>
            </button>
          </div>
        </div>
      </header>

      <main>
        <div className="container">
          <Page activePage={active} />
        </div>
      </main>

      <AppointmentCustomerTypeModal
        open={appointmentCustomerTypeOpen}
        onClose={() => setAppointmentCustomerTypeOpen(false)}
        onChoose={(type) => {
          setAppointmentCustomerTypeOpen(false);
          setAppointmentModal({
            open: true,
            mode: 'create',
            initialAppointment: null,
            customerType: type === 'new' ? 'new' : 'existing',
          });
        }}
      />

      <AppointmentTopicsModal
        open={appointmentTopicsModalOpen}
        topics={appointmentTopics}
        onAdd={addAppointmentTopic}
        onUpdateColor={updateAppointmentTopicColor}
        onClose={() => setAppointmentTopicsModalOpen(false)}
      />

      <AppointmentCreateModal
        open={appointmentModal.open}
        mode={appointmentModal.mode}
        initialAppointment={appointmentModal.initialAppointment}
        customerType={appointmentModal.customerType}
        appointmentTopics={appointmentTopics}
        onClose={() =>
          setAppointmentModal({
            open: false,
            mode: 'create',
            initialAppointment: null,
            customerType: 'existing',
          })
        }
        onDelete={(appt) => {
          setAppointmentModal({
            open: false,
            mode: 'create',
            initialAppointment: null,
            customerType: 'existing',
          });
          deleteAppointment(appt);
        }}
        onSubmit={(payload) => {
          const mode = appointmentModal.mode;
          setAppointmentModal({
            open: false,
            mode: 'create',
            initialAppointment: null,
            customerType: 'existing',
          });
          if (mode === 'edit') updateAppointment(payload);
          else createAppointment(payload);
        }}
      />

      <TreatmentRecordModal
        open={treatmentModalOpen}
        customers={ENRICHED_CUSTOMERS}
        products={products}
        customerQuery={treatmentCustomerQuery}
        onCustomerQueryChange={setTreatmentCustomerQuery}
        selectedCustomer={treatmentSelectedCustomer}
        onSelectCustomer={setTreatmentSelectedCustomer}
        productQuery={treatmentProductQuery}
        onProductQueryChange={setTreatmentProductQuery}
        items={treatmentItems}
        onAddProduct={addTreatmentProduct}
        onUpdateQty={updateTreatmentQty}
        onRemoveItem={removeTreatmentItem}
        statusText="รอชำระเงิน"
        onClose={closeTreatmentModal}
        onSave={saveTreatmentRecord}
      />

      <TreatmentRecordDetailModal
        open={!!treatmentDetailRow}
        record={treatmentDetailRow}
        customers={ENRICHED_CUSTOMERS}
        customerConditions={customerConditions}
        products={products}
        onClose={() => setTreatmentDetailRow(null)}
        onSave={updateTreatmentRecord}
      />

      <Modal open={modal.open} title={modal.title} onClose={closeModal} />
    </div>
  );
}
