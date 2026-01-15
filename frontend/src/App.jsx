import { useEffect, useRef, useState } from 'react';
// import logoUrl from '../logo.png';
import CreateAppointment from './pages/CreateAppointment.jsx';
import Customers from './pages/Customers.jsx';
import EditCustomer from './pages/EditCustomer.jsx';

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
  const [modal, setModal] = useState({ open: false, title: '' });
  const [active, setActive] = useState('ตารางนัดหมาย');
  const [editingCustomer, setEditingCustomer] = useState(null);
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
      id: 'purchase',
      label: 'สั่งซื้อสินค้า',
      items: [
        'รายการสั่งซื้อสินค้า',
        'สร้างรายการสั่งซื้อ',
        'แก้ไขรายการสั่งซื้อ',
        'รับสินค้าจากรายการสั่งซื้อ',
        'ใบเสนอราคา',
      ],
    },
    {
      id: 'customers',
      label: 'รายชื่อลูกค้า',
      items: [
        'ค้นหารายชื่อลูกค้า',
        'สร้างรายชื่อลูกค้าใหม่',
        'กำหนดเงื่อนไขสถานะลูกค้า',
      ],
    },
    {
      id: 'products',
      label: 'รายการสินค้า',
      items: [
        'ค้นหารายการสินค้า',
        'สร้างรายการสินค้าใหม่',
        'แก้ไขรายละเอียดสินค้า',
      ],
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
              setEditingCustomer(customer);
              setActive('แก้ไขรายชื่อลูกค้า');
            }}
          />
        );
      case 'แก้ไขรายชื่อลูกค้า':
        return (
          <EditCustomer
            customer={editingCustomer}
            onCancel={() => setActive('รายชื่อลูกค้า')}
            onSave={(data) => {
              console.log('แก้ไขลูกค้า:', data);
              setEditingCustomer(null);
              setActive('รายชื่อลูกค้า');
              openModal('บันทึกข้อมูลลูกค้าสำเร็จ');
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
