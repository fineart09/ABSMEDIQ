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
  const openModal = (title) => setModal({ open: true, title })
  const closeModal = () => setModal({ open: false, title: '' })

  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <button
            type="button"
            className="brand"
            onClick={() => openModal('ตารางนัดหมาย')}
            aria-label="ไปที่ตารางนัดหมาย"
          >
            ABSMEDIQ
          </button>
          <nav className="nav">
            <button type="button" onClick={() => openModal('ตารางนัดหมาย')}>ตารางนัดหมาย</button>
            <button type="button" onClick={() => openModal('บันทึกรายการ')}>บันทึกรายการ</button>
            <button type="button" onClick={() => openModal('การชำระเงิน')}>การชำระเงิน</button>
            <button type="button" onClick={() => openModal('สั่งซื้อสินค้า')}>สั่งซื้อสินค้า</button>
            <button type="button" onClick={() => openModal('รายชื่อลูกค้า')}>รายชื่อลูกค้า</button>
            <button type="button" onClick={() => openModal('รายการสินค้า')}>รายการสินค้า</button>
            <button type="button" onClick={() => openModal('คอร์สออกกำลังกาย')}>คอร์สออกกำลังกาย</button>
            <button type="button" onClick={() => openModal('พิมพ์เอกสาร')}>พิมพ์เอกสาร</button>
            <button type="button" onClick={() => openModal('รายงาน')}>รายงาน</button>
            <button type="button" onClick={() => openModal('ตั้งค่า')}>ตั้งค่า</button>
          </nav>
        </div>
      </header>

      <main>
        <div className="container">
          <h1>หน้าหลัก</h1>
          <p>นี่คือหน้าเดียวหลักของเว็บไซต์ ABSMEDIQ.</p>
        </div>
      </main>

      <Modal open={modal.open} title={modal.title} onClose={closeModal} />
    </div>
  )
}
