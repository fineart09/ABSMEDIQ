/*
  Auto-generated SQL create+seed from src/mocks/*.js
  Generated at: 2026-03-10T17:38:43.171Z
  SQL dialect: Microsoft SQL Server
*/

SET NOCOUNT ON;

/* mock_product_master */
/* source: src/mocks/productsFull.js#default */
IF OBJECT_ID(N'dbo.mock_product_master', N'U') IS NULL
BEGIN
  RAISERROR('Table dbo.mock_product_master does not exist. Run create script first.', 16, 1);
  RETURN;
END;

DELETE FROM dbo.mock_product_master;

INSERT INTO dbo.mock_product_master ([code], [nameTh], [nameEn], [category], [unit], [price], [cost], [description], [supplier], [stock], [status], [updatedAt], [stockLots])
VALUES
(N'PRD001', N'ครีมบำรุงผิวหน้า', N'Facial Moisturizer', N'สกินแคร์', N'กระปุก', 890, 520, N'มอยส์เจอร์ไรเซอร์สำหรับผิวแห้ง ชุ่มชื้นยาวนาน', N'ABSMEDIQ', 27, N'ใช้งาน', CAST('2025-05-13' AS DATE), N'[{"qty":27,"receivedAt":"2025-05-13","lotNo":"LOT-26-0310","expiryDate":"2026-08-27"}]'),
(N'PRD002', N'เซรั่มวิตามินซี', N'Vitamin C Serum', N'สกินแคร์', N'ขวด', 1290, 760, N'ช่วยให้ผิวดูกระจ่างใส ลดรอยดำ', N'ABSMEDIQ', 92, N'ใช้งาน', CAST('2025-09-06' AS DATE), N'[{"qty":32,"receivedAt":"2026-01-09","lotNo":"LOT-26-9825","expiryDate":"2026-12-09"},{"qty":12,"receivedAt":"2025-05-06","lotNo":"LOT-26-0767","expiryDate":"2026-07-27"},{"qty":48,"receivedAt":"2025-09-25","lotNo":"LOT-26-2178","expiryDate":"2027-08-29"}]'),
(N'PRD003', N'กันแดด SPF50+', N'Sunscreen SPF50+', N'สกินแคร์', N'หลอด', 990, 580, N'ปกป้อง UVA/UVB เนื้อบางเบา ไม่เหนอะหนะ', N'ABSMEDIQ', 16, N'ใช้งาน', CAST('2025-05-14' AS DATE), N'[{"qty":6,"receivedAt":"2025-11-21","lotNo":"LOT-26-5877","expiryDate":"2027-07-31"},{"qty":1,"receivedAt":"2025-04-03","lotNo":"LOT-26-4146","expiryDate":"2026-09-10"},{"qty":9,"receivedAt":"2025-09-05","lotNo":"LOT-26-0380","expiryDate":"2026-12-24"}]'),
(N'PRD004', N'คลีนเซอร์ล้างหน้า', N'Gentle Cleanser', N'สกินแคร์', N'หลอด', 590, 320, N'ทำความสะอาดผิวอย่างอ่อนโยน เหมาะกับผิวแพ้ง่าย', N'ABSMEDIQ', 7, N'ใช้งาน', CAST('2025-04-24' AS DATE), N'[{"qty":7,"receivedAt":"2025-08-03","lotNo":"LOT-26-7554","expiryDate":"2026-11-07"}]'),
(N'PRD005', N'มาสก์หน้าชุ่มชื้น', N'Hydrating Mask', N'มาสก์', N'แผ่น', 79, 35, N'เติมความชุ่มชื้นเร่งด่วน', N'ABSMEDIQ', 79, N'ใช้งาน', CAST('2025-11-24' AS DATE), N'[{"qty":35,"receivedAt":"2026-03-05","lotNo":"LOT-26-9277","expiryDate":"2027-11-17"},{"qty":44,"receivedAt":"2026-01-02","lotNo":"LOT-26-1745","expiryDate":"2026-07-27"}]'),
(N'PRD006', N'ยาชา (ใช้โดยผู้เชี่ยวชาญ)', N'Topical Anesthetic', N'เวชภัณฑ์', N'หลอด', 450, 240, N'ใช้ภายใต้การดูแลของบุคลากรทางการแพทย์', N'MedSupply', 97, N'ใช้งาน', CAST('2025-10-11' AS DATE), N'[{"qty":97,"receivedAt":"2025-07-06","lotNo":"LOT-26-8176","expiryDate":"2026-10-28"}]'),
(N'PRD007', N'เจลล้างมือแอลกอฮอล์', N'Alcohol Hand Gel', N'ของใช้', N'ขวด', 159, 85, N'แอลกอฮอล์ 70% กลิ่นอ่อน', N'CleanCo', 64, N'ใช้งาน', CAST('2025-08-07' AS DATE), N'[{"qty":29,"receivedAt":"2025-12-23","lotNo":"LOT-26-6218","expiryDate":"2027-01-02"},{"qty":35,"receivedAt":"2025-04-29","lotNo":"LOT-26-3351","expiryDate":"2026-01-26"}]'),
(N'PRD008', N'สำลีแผ่น', N'Cotton Pads', N'ของใช้', N'แพ็ค', 120, 60, N'สำลีเนื้อนุ่ม ไม่เป็นขุย', N'CleanCo', 120, N'ใช้งาน', CAST('2025-07-08' AS DATE), N'[{"qty":26,"receivedAt":"2026-02-20","lotNo":"LOT-26-0827","expiryDate":"2026-12-08"},{"qty":9,"receivedAt":"2025-11-27","lotNo":"LOT-26-1938","expiryDate":"2026-08-03"},{"qty":85,"receivedAt":"2026-02-17","lotNo":"LOT-26-6590","expiryDate":"2027-05-18"}]'),
(N'PRD009', N'ครีมลดรอยแผลเป็น', N'Scar Cream', N'สกินแคร์', N'หลอด', 690, 410, N'ช่วยให้รอยดูจางลงเมื่อใช้ต่อเนื่อง', N'ABSMEDIQ', 94, N'ใช้งาน', CAST('2026-02-06' AS DATE), N'[{"qty":26,"receivedAt":"2026-02-15","lotNo":"LOT-26-5163","expiryDate":"2026-09-19"},{"qty":45,"receivedAt":"2025-04-26","lotNo":"LOT-26-4275","expiryDate":"2026-04-02"},{"qty":23,"receivedAt":"2025-03-15","lotNo":"LOT-26-4746","expiryDate":"2025-07-14"}]'),
(N'PRD010', N'น้ำเกลือ', N'Saline', N'เวชภัณฑ์', N'ขวด', 45, 18, N'สำหรับทำความสะอาดแผล/ล้างอุปกรณ์', N'MedSupply', 34, N'ไม่ใช้งาน', CAST('2025-11-03' AS DATE), N'[{"qty":34,"receivedAt":"2026-02-20","lotNo":"LOT-26-9933","expiryDate":"2027-10-13"}]'),
(N'PRD011', N'เข็มฉีดยา 3ml', N'Syringe 3ml', N'เวชภัณฑ์', N'ชิ้น', 12, 6, N'ใช้สำหรับการรักษาตามมาตรฐานคลินิก', N'MedSupply', 113, N'ใช้งาน', CAST('2025-07-18' AS DATE), N'[{"qty":35,"receivedAt":"2025-09-20","lotNo":"LOT-26-9189","expiryDate":"2027-05-13"},{"qty":78,"receivedAt":"2025-03-28","lotNo":"LOT-26-7433","expiryDate":"2026-09-09"}]'),
(N'PRD012', N'ผ้าก๊อซ', N'Sterile Gauze', N'เวชภัณฑ์', N'แพ็ค', 65, 32, N'ปลอดเชื้อ เหมาะสำหรับทำแผล', N'MedSupply', 85, N'ไม่ใช้งาน', CAST('2025-06-01' AS DATE), N'[{"qty":40,"receivedAt":"2026-02-07","lotNo":"LOT-26-4344","expiryDate":"2027-10-11"},{"qty":45,"receivedAt":"2025-11-09","lotNo":"LOT-26-9990","expiryDate":"2026-12-07"}]');

