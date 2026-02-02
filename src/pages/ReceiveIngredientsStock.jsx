import ReceiveStockFlow from '../components/ReceiveStockFlow.jsx';

export default function ReceiveIngredientsStock({
  existingIngredients,
  onCancel,
  onReceive,
}) {
  return (
    <ReceiveStockFlow
      title="รับ Ingredient เข้า stock"
      items={existingIngredients}
      codePrefix="ING-"
      withLotExpiry={true}
      withReceivePrice={false}
      lotExpiryRequired={false}
      showItemPrice={false}
      labels={{
        back: 'กลับไปหน้าคลัง Ingredient',
        searchTitle: 'ค้นหา Ingredient เพื่อรับเข้า stock',
        colName: 'ชื่อ Ingredient',
        empty: 'ไม่พบ Ingredient',
        code: 'รหัส Ingredient',
        name: 'ชื่อ Ingredient',
        category: 'หมวดหมู่',
        unit: 'หน่วย',
        stock: 'คงเหลือปัจจุบัน',
        qty: 'จำนวนรับเข้า',
        lotNo: 'เลข lot',
        lotNoPlaceholder: 'เช่น ING-LOT-2026-001',
        expiryDate: 'วันหมดอายุ',
        confirm: 'ยืนยันรับเข้า stock',
        cancel: 'ยกเลิก',
      }}
      onCancel={onCancel}
      onReceive={onReceive}
    />
  );
}
