import { useEffect, useState, useMemo } from 'react';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');

  // 1. กระบวนการดึงข้อมูลจาก Java Backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // เรียกไปยัง @GetMapping ใน CustomerController
        const response = await fetch('/customer');

        if (!response.ok) {
          throw new Error(`Server Error: ${response.status}`);
        }

        const data = await response.json();
        setCustomers(data); // เก็บข้อมูล DTO เข้า State
      } catch (err) {
        console.error("Fetch Error:", err);
        setError("ไม่สามารถเชื่อมต่อกับระบบ ABSMediQ ได้");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // 2. ฟังก์ชันช่วยรวมชื่อ (Helper for Full Name)
  const getFullName = (c) => {
    const title = c.title || '';
    const mid = c.middleName ? ` ${c.middleName} ` : ' ';
    return `${title}${c.firstName}${mid}${c.lastName}`;
  };

  // 3. ระบบค้นหา (Search Logic)
  const filteredItems = useMemo(() => {
    const q = query.toLowerCase().trim();
    return customers.filter(item =>
      item.id.toLowerCase().includes(q) ||
      getFullName(item).toLowerCase().includes(q)
    );
  }, [query, customers]);

  if (isLoading) return <div className="p-8">กำลังดึงข้อมูลจาก SQL Server...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="customers-container">
      <header className="flex justify-between p-4">
        <h1>รายชื่อลูกค้า</h1>
        <input
          type="text"
          placeholder="ค้นหา HN หรือ ชื่อ-นามสกุล..."
          className="border p-2 rounded"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </header>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 text-left">HN (ID)</th>
            <th className="p-3 text-left">ชื่อ-นามสกุล</th>
            <th className="p-3 text-left">สถานะ</th>
            <th className="p-3 text-center">จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map((c) => (
            <tr key={c.id} className="border-b hover:bg-gray-50">
              <td className="p-3 font-mono">{c.id}</td>
              <td className="p-3">{getFullName(c)}</td>
              <td className="p-3">
                <span className={`status-badge ${c.status?.toLowerCase()}`}>
                  {c.status}
                </span>
              </td>
              <td className="p-3 text-center">
                <button className="text-blue-600 hover:underline">แก้ไข</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredItems.length === 0 && (
        <div className="text-center p-10 text-gray-400">ไม่พบข้อมูลลูกค้า</div>
      )}
    </div>
  );
}