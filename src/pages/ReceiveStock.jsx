import ReceiveStockFlow from '../components/ReceiveStockFlow.jsx';

export default function ReceiveStock({
  existingProducts,
  onCancel,
  onReceive,
}) {
  return (
    <ReceiveStockFlow
      title="รับสินค้าเข้า stock"
      items={existingProducts}
      codePrefix="PRD"
      labels={{
        back: 'กลับไปหน้ารายการสินค้า',
        searchTitle: 'ค้นหาสินค้าเพื่อรับเข้า stock',
        colName: 'ชื่อสินค้า',
        empty: 'ไม่พบสินค้า',
      }}
      onCancel={onCancel}
      onReceive={onReceive}
    />
  );
}
