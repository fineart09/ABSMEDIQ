import { useState } from 'react'

function Modal({ open, title, onClose }) {
  if (!open) return null
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
        </div>
        <div className="modal-body">
          <p>คุณเปิดเมนู: {title}</p>
        </div>
        <div className="modal-actions">
          <button type="button" className="button" onClick={onClose}>ปิด</button>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [modal, setModal] = useState({ open: false, title: '' })
  const [active, setActive] = useState('ตารางนัดหมาย')
  const openModal = (title) => setModal({ open: true, title })
  const closeModal = () => setModal({ open: false, title: '' })
  const handleClick = (title) => { setActive(title); openModal(title) }

  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <button
            type="button"
            className="brand"
            onClick={() => handleClick('ตารางนัดหมาย')}
            aria-label="ไปที่ตารางนัดหมาย"
          >
            ABSMEDiQ
          </button>
          <nav className="nav">
            {[
              'ตารางนัดหมาย',
              'บันทึกรายการ',
              'การชำระเงิน',
              'สั่งซื้อสินค้า',
              'รายชื่อลูกค้า',
              'รายการสินค้า',
              'ค่าบริการ',
              'พิมพ์เอกสาร',
              'รายงาน',
              'ตั้งค่า',
            ].map((label) => (
              <button
                key={label}
                type="button"
                className={active === label ? 'active' : ''}
                onClick={() => handleClick(label)}
                aria-current={active === label ? 'page' : undefined}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main>
        <div className="container">
          <h1>หน้าหลัก</h1>
          <p>นี่คือหน้าเดียวหลักของเว็บไซต์ ABSMEDiQ.</p>
        </div>
      </main>

      <Modal open={modal.open} title={modal.title} onClose={closeModal} />
    </div>
  )
}
