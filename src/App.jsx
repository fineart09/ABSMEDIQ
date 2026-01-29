import { useEffect, useRef, useState } from 'react';
import CreateAppointment from './pages/CreateAppointment.jsx';
import CreateCustomer from './pages/CreateCustomer.jsx';
import CreateProduct from './pages/CreateProduct.jsx';
import Customers from './pages/Customers.jsx';
import EditCustomer from './pages/EditCustomer.jsx';
import EditProduct from './pages/EditProduct.jsx';
import EditConsumable from './pages/EditConsumable.jsx';
import CreatePurchaseOrder from './pages/CreatePurchaseOrder.jsx';
import Products from './pages/Products.jsx';
// import PurchaseHome from './pages/PurchaseHome.jsx';
import PurchaseOrders from './pages/PurchaseOrders.jsx';
import Suppliers from './pages/Suppliers.jsx';
import CreateSupplier from './pages/CreateSupplier.jsx';
import ReceiveStock from './pages/ReceiveStock.jsx';
import ProductMovements from './pages/ProductMovements.jsx';
import Consumables from './pages/Consumables.jsx';
import ReceiveConsumablesStock from './pages/ReceiveConsumablesStock.jsx';
import Ingredients from './pages/Ingredients.jsx';
import ConsumableMovements from './pages/ConsumableMovements.jsx';
import MOCK_PRODUCTS_FULL from './mocks/productsFull';
import MOCK_PURCHASE_ORDERS_FULL from './mocks/purchaseOrdersFull';
import SUPPLIERS_FULL from './mocks/suppliersFull';
import CONSUMABLES_FULL from './mocks/consumablesFull.js';

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

export default function App() {
  const stripProductPhotoUrl = (p) => {
    if (!p || typeof p !== 'object') return p;
    // Remove legacy product photo field from the system.
    const { photoUrl: _photoUrl, ...rest } = p;
    return rest;
  };

  const [modal, setModal] = useState({ open: false, title: '' });
  const [active, setActive] = useState('ตารางนัดหมาย');
  const [movementFilterCode, setMovementFilterCode] = useState(null);
  const [consumableMovementFilterCode, setConsumableMovementFilterCode] =
    useState(null);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingConsumable, setEditingConsumable] = useState(null);
  const [editingPurchaseOrder, setEditingPurchaseOrder] = useState(null);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [ingredientDraft, setIngredientDraft] = useState([]);
  const [createProductFromIngredients, setCreateProductFromIngredients] =
    useState(null);
  const [products, setProducts] = useState(() => {
    const src = Array.isArray(MOCK_PRODUCTS_FULL) ? MOCK_PRODUCTS_FULL : [];
    return src.map(stripProductPhotoUrl);
  });
  const [consumables, setConsumables] = useState(() =>
    Array.isArray(CONSUMABLES_FULL) ? CONSUMABLES_FULL : []
  );
  const [suppliers, setSuppliers] = useState(() =>
    Array.isArray(SUPPLIERS_FULL) ? SUPPLIERS_FULL : []
  );
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
    const customersPages = new Set(['รายชื่อลูกค้า', 'ค้นหารายชื่อลูกค้า']);
    const productsPages = new Set([
      'รายการสินค้า',
      'ค้นหารายการสินค้า',
      'รายการเคลื่อนไหวสินค้า',
      'Ingredient',
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

  const navItems = [
    {
      id: 'schedule',
      label: 'ตารางนัดหมาย',
      items: ['ตารางนัดหมาย', 'สร้างนัดหมาย', 'แก้ไขข้อมูลนัดหมาย'],
    },
    {
      id: 'record',
      label: 'บันทึกรายการ',
      items: [
        'บันทึกรายการรักษา',
        'แก้ไขรายการรักษา',
        'บันทึกรายการใช้บริการ',
        'แก้ไขรายการใช้บริการ',
      ],
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
      id: 'services',
      label: 'ค่าบริการ',
      items: [
        'รายการบริการ',
        'สร้างคอร์ส',
        'แก้ไขคอร์ส',
        'ผู้ให้บริการ',
        'ค่าจ้างผู้ให้บริการ',
      ],
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
    return false;
  };

  function Page({ activePage }) {
    // Simple single-page views. Extend these with real components as needed.
    switch (activePage) {
      case 'ตารางนัดหมาย':
        return (
          <>
            <h1>ตารางนัดหมาย</h1>
            <p>รอออกแบบ calendar อีกที</p>
          </>
        );
      case 'สร้างนัดหมาย':
        return (
          <CreateAppointment
            onSubmit={(data) => {
              console.log('สร้างนัดหมาย:', data);
              openModal('สร้างนัดหมายสำเร็จ');
              setActive('ตารางนัดหมาย');
            }}
          />
        );
      case 'บันทึกรายการรักษา':
        return (
          <>
            <h1>บันทึกรายการรักษา</h1>
            <p>หน้าบันทึกรายการรักษา</p>
          </>
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
              onSave={(data) => {
                console.log('สร้างลูกค้าใหม่:', data);
                setActive('รายชื่อลูกค้า');
                openModal('สร้างรายชื่อลูกค้าสำเร็จ');
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
                  const updatedItems = poItems.map((it) => {
                    const code = String(it?.code || '').trim();
                    const orderedQty = toNumber(it?.qty);
                    const currentReceived = toNumber(it?.receivedQty);
                    const meta = receivedByCode.get(code);
                    const add = meta?.qty ?? 0;
                    if (!code || add <= 0) return it;

                    const nextReceived = Math.min(
                      orderedQty,
                      currentReceived + add
                    );

                    const prevLots = Array.isArray(it?.receivedLots)
                      ? it.receivedLots
                      : [];

                    return {
                      ...it,
                      receivedQty: nextReceived,
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
            products={products}
            draft={ingredientDraft}
            onDraftChange={setIngredientDraft}
            onBack={() => setActive('รายการสินค้า')}
            onProceed={(items) => {
              const list = Array.isArray(items) ? items : [];
              const lines = list
                .filter((x) => x && typeof x === 'object')
                .map((x) => {
                  const code = String(x.code || '').trim();
                  const name = String(x.nameTh || x.nameEn || '').trim();
                  const qty =
                    x.qty === '' || x.qty === null || x.qty === undefined
                      ? ''
                      : x.qty;
                  const unit = String(x.unit || '').trim();
                  const note = String(x.note || '').trim();
                  const head = [code, name].filter(Boolean).join(' ');
                  const amount = [qty, unit]
                    .filter((v) => String(v).trim())
                    .join(' ');
                  return `- ${head}${amount ? `: ${amount}` : ''}${note ? ` (${note})` : ''}`;
                })
                .join('\n');

              setCreateProductFromIngredients({
                description: lines ? `Ingredients\n${lines}` : '',
              });
              setEditingProduct(null);
              setActive('สร้างรายการสินค้าใหม่');
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

      <Modal open={modal.open} title={modal.title} onClose={closeModal} />
    </div>
  );
}
