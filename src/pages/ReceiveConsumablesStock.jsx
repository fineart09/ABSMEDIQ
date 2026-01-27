import ReceiveStockFlow from '../components/ReceiveStockFlow.jsx';

export default function ReceiveConsumablesStock({
  existingConsumables,
  onCancel,
  onReceive,
}) {
  return (
    <ReceiveStockFlow
      title="รับวัสดุสิ้นเปลืองเข้า stock"
      items={existingConsumables}
      codePrefix="C-"
      withLotExpiry={false}
      labels={{
        back: 'กลับไปหน้าวัสดุสิ้นเปลืองและอื่นๆ',
        searchTitle: 'ค้นหาวัสดุสิ้นเปลืองเพื่อรับเข้า stock',
        colName: 'ชื่อวัสดุ',
        empty: 'ไม่พบวัสดุ',
        code: 'รหัสวัสดุ',
        name: 'ชื่อวัสดุ',
        category: 'หมวดหมู่',
        unit: 'หน่วย',
        stock: 'คงเหลือปัจจุบัน',
        qty: 'จำนวนรับเข้า',
        confirm: 'ยืนยันรับเข้า stock',
        cancel: 'ยกเลิก',
      }}
      onCancel={onCancel}
      onReceive={onReceive}
    />
  );
}
