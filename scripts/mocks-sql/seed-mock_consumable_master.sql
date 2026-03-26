/*
  Auto-generated SQL create+seed from src/mocks/*.js
  Generated at: 2026-03-10T17:38:43.171Z
  SQL dialect: Microsoft SQL Server
*/

SET NOCOUNT ON;

/* mock_consumable_master */
/* source: src/mocks/consumablesFull.js#default */
IF OBJECT_ID(N'dbo.mock_consumable_master', N'U') IS NULL
BEGIN
  RAISERROR('Table dbo.mock_consumable_master does not exist. Run create script first.', 16, 1);
  RETURN;
END;

DELETE FROM dbo.mock_consumable_master;

INSERT INTO dbo.mock_consumable_master ([code], [nameTh], [category], [unit], [price], [stock], [status], [warehouse], [stockLots])
VALUES
(N'C-0001', N'ถุงมือยาง (S)', N'เวชภัณฑ์', N'กล่อง', 120, 18, N'ใช้งาน', N'1', N'[{"lotNo":"LOT-C0001-2511-A","expiryDate":"2026-06-30","unitPrice":118,"qty":6,"receivedAt":"2025-11-05"},{"lotNo":"LOT-C0001-2512-B","expiryDate":"2026-07-31","unitPrice":120,"qty":5,"receivedAt":"2025-12-12"},{"lotNo":"LOT-C0001-2601-C","expiryDate":"2026-09-30","unitPrice":122,"qty":7,"receivedAt":"2026-01-10"}]'),
(N'C-0002', N'ถุงมือยาง (M)', N'เวชภัณฑ์', N'กล่อง', 120, 12, N'ใช้งาน', N'2', N'[{"lotNo":"LOT-C0002-2510-A","expiryDate":"2026-05-31","unitPrice":119,"qty":4,"receivedAt":"2025-10-18"},{"lotNo":"LOT-C0002-2512-B","expiryDate":"2026-08-31","unitPrice":121,"qty":3,"receivedAt":"2025-12-08"},{"lotNo":"LOT-C0002-2601-C","expiryDate":"2026-10-31","unitPrice":120,"qty":5,"receivedAt":"2026-01-22"}]'),
(N'C-0003', N'ถุงมือยาง (L)', N'เวชภัณฑ์', N'กล่อง', 120, 0, N'ไม่ใช้งาน', N'3', N'[{"lotNo":"LOT-C0003-2509-A","expiryDate":"2026-04-30","unitPrice":117,"qty":2,"receivedAt":"2025-09-02"},{"lotNo":"LOT-C0003-2511-B","expiryDate":"2026-06-30","unitPrice":119,"qty":3,"receivedAt":"2025-11-21"},{"lotNo":"LOT-C0003-2512-C","expiryDate":"2026-07-31","unitPrice":120,"qty":1,"receivedAt":"2025-12-20"},{"lotNo":"LOT-C0003-2601-D","expiryDate":"2026-09-30","unitPrice":121,"qty":2,"receivedAt":"2026-01-14"}]'),
(N'C-0004', N'หน้ากากอนามัย', N'เวชภัณฑ์', N'กล่อง', 95, 34, N'ใช้งาน', N'4', N'[{"lotNo":"LOT-C0004-2510-A","expiryDate":"2027-01-31","unitPrice":92,"qty":10,"receivedAt":"2025-10-05"},{"lotNo":"LOT-C0004-2511-B","expiryDate":"2027-02-28","unitPrice":95,"qty":12,"receivedAt":"2025-11-15"},{"lotNo":"LOT-C0004-2512-C","expiryDate":"2027-03-31","unitPrice":96,"qty":12,"receivedAt":"2025-12-27"}]'),
(N'C-0005', N'สำลีแผ่น', N'เวชภัณฑ์', N'ห่อ', 35, 40, N'ใช้งาน', N'5', N'[{"lotNo":"LOT-C0005-2508-A","expiryDate":"2027-08-31","unitPrice":33,"qty":15,"receivedAt":"2025-08-19"},{"lotNo":"LOT-C0005-2510-B","expiryDate":"2027-10-31","unitPrice":35,"qty":12,"receivedAt":"2025-10-22"},{"lotNo":"LOT-C0005-2601-C","expiryDate":"2027-12-31","unitPrice":36,"qty":13,"receivedAt":"2026-01-09"}]'),
(N'C-0006', N'แอลกอฮอล์ 70%', N'เวชภัณฑ์', N'ขวด', 45, 22, N'ใช้งาน', N'6', N'[{"lotNo":"LOT-C0006-2512-A","expiryDate":"2027-12-31","unitPrice":44,"qty":8,"receivedAt":"2025-12-02"}]'),
(N'C-0007', N'ผ้าก๊อซ', N'เวชภัณฑ์', N'ห่อ', 55, 9, N'ใช้งาน', N'7', N'[{"lotNo":"LOT-C0007-2511-A","expiryDate":"2027-09-30","unitPrice":54,"qty":4,"receivedAt":"2025-11-09"}]'),
(N'C-0008', N'เข็มฉีดยา 3cc', N'เวชภัณฑ์', N'กล่อง', 160, 7, N'ใช้งาน', N'8', N'[{"lotNo":"LOT-C0008-2601-A","expiryDate":"2028-01-31","unitPrice":158,"qty":3,"receivedAt":"2026-01-06"}]'),
(N'C-0009', N'เข็มฉีดยา 5cc', N'เวชภัณฑ์', N'กล่อง', 175, 6, N'ใช้งาน', N'9', N'[{"lotNo":"LOT-C0009-2510-A","expiryDate":"2028-03-31","unitPrice":172,"qty":2,"receivedAt":"2025-10-28"}]'),
(N'C-0010', N'กระดาษเช็ดมือ', N'วัสดุสำนักงาน', N'แพ็ค', 70, 15, N'ใช้งาน', N'10', N'[{"lotNo":"LOT-C0010-2511-A","expiryDate":"2028-11-30","unitPrice":68,"qty":6,"receivedAt":"2025-11-03"},{"lotNo":"LOT-C0010-2512-B","expiryDate":"2028-12-31","unitPrice":70,"qty":4,"receivedAt":"2025-12-16"},{"lotNo":"LOT-C0010-2601-C","expiryDate":"2029-01-31","unitPrice":72,"qty":5,"receivedAt":"2026-01-25"},{"lotNo":"LOT-C0010-2601-D","expiryDate":"2029-03-31","unitPrice":69,"qty":3,"receivedAt":"2026-01-28"}]'),
(N'C-0011', N'น้ำยาฆ่าเชื้อพื้น', N'อื่นๆ', N'แกลลอน', 220, 4, N'ใช้งาน', N'11', N'[{"lotNo":"LOT-C0011-2512-A","expiryDate":"2027-06-30","unitPrice":215,"qty":2,"receivedAt":"2025-12-05"}]'),
(N'C-0012', N'ถุงขยะ (ดำ 24x28)', N'อื่นๆ', N'ม้วน', 35, 20, N'ใช้งาน', N'12', N'[{"lotNo":"LOT-C0012-2511-A","expiryDate":"2029-11-30","unitPrice":34,"qty":10,"receivedAt":"2025-11-18"}]'),
(N'C-0013', N'ผ้ากันเปื้อน', N'อื่นๆ', N'ชิ้น', 60, 11, N'ใช้งาน', N'13', N'[{"lotNo":"LOT-C0013-2601-A","expiryDate":"2029-12-31","unitPrice":58,"qty":5,"receivedAt":"2026-01-12"}]'),
(N'C-0014', N'สำลีก้าน', N'เวชภัณฑ์', N'กล่อง', 28, 25, N'ใช้งาน', N'14', N'[{"lotNo":"LOT-C0014-2510-A","expiryDate":"2028-10-31","unitPrice":27,"qty":12,"receivedAt":"2025-10-08"}]'),
(N'C-0015', N'พลาสเตอร์', N'เวชภัณฑ์', N'กล่อง', 40, 13, N'ใช้งาน', N'15', N'[{"lotNo":"LOT-C0015-2512-A","expiryDate":"2028-12-31","unitPrice":39,"qty":6,"receivedAt":"2025-12-11"}]'),
(N'C-0016', N'ถาดสแตนเลส', N'อื่นๆ', N'ชิ้น', 180, 2, N'ใช้งาน', N'16', N'[{"lotNo":"LOT-C0016-2511-A","expiryDate":"2030-11-30","unitPrice":175,"qty":1,"receivedAt":"2025-11-26"}]'),
(N'C-0017', N'กาวกระดาษ', N'วัสดุสำนักงาน', N'ม้วน', 20, 8, N'ใช้งาน', N'17', NULL),
(N'C-0018', N'ปากกาลูกลื่น', N'วัสดุสำนักงาน', N'ด้าม', 12, 30, N'ใช้งาน', N'18', NULL),
(N'C-0019', N'กระดาษ A4', N'วัสดุสำนักงาน', N'รีม', 125, 5, N'ใช้งาน', N'19', NULL),
(N'C-0020', N'สติ๊กเกอร์ฉลาก', N'วัสดุสำนักงาน', N'แพ็ค', 85, 3, N'ใช้งาน', N'20', NULL);

