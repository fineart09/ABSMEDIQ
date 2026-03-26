/*
  Seed mock data for dbo.product_master
  Source: src/mocks/productsFull.js -> MOCK_PRODUCTS_FULL
*/

IF OBJECT_ID(N'dbo.product_master', N'U') IS NULL
BEGIN
  RAISERROR('Table dbo.product_master does not exist. Run create-product-master.sql first.', 16, 1);
  RETURN;
END;

;WITH src AS (
  SELECT *
  FROM (VALUES
    (N'PRD001', N'ครีมบำรุงผิวหน้า', N'Facial Moisturizer', N'สกินแคร์', N'กระปุก', CAST(890.00 AS DECIMAL(18,2)), CAST(520.00 AS DECIMAL(18,2)), N'มอยส์เจอร์ไรเซอร์สำหรับผิวแห้ง ชุ่มชื้นยาวนาน', N'ABSMEDIQ'),
    (N'PRD002', N'เซรั่มวิตามินซี', N'Vitamin C Serum', N'สกินแคร์', N'ขวด', CAST(1290.00 AS DECIMAL(18,2)), CAST(760.00 AS DECIMAL(18,2)), N'ช่วยให้ผิวดูกระจ่างใส ลดรอยดำ', N'ABSMEDIQ'),
    (N'PRD003', N'กันแดด SPF50+', N'Sunscreen SPF50+', N'สกินแคร์', N'หลอด', CAST(990.00 AS DECIMAL(18,2)), CAST(580.00 AS DECIMAL(18,2)), N'ปกป้อง UVA/UVB เนื้อบางเบา ไม่เหนอะหนะ', N'ABSMEDIQ'),
    (N'PRD004', N'คลีนเซอร์ล้างหน้า', N'Gentle Cleanser', N'สกินแคร์', N'หลอด', CAST(590.00 AS DECIMAL(18,2)), CAST(320.00 AS DECIMAL(18,2)), N'ทำความสะอาดผิวอย่างอ่อนโยน เหมาะกับผิวแพ้ง่าย', N'ABSMEDIQ'),
    (N'PRD005', N'มาสก์หน้าชุ่มชื้น', N'Hydrating Mask', N'มาสก์', N'แผ่น', CAST(79.00 AS DECIMAL(18,2)), CAST(35.00 AS DECIMAL(18,2)), N'เติมความชุ่มชื้นเร่งด่วน', N'ABSMEDIQ'),
    (N'PRD006', N'ยาชา (ใช้โดยผู้เชี่ยวชาญ)', N'Topical Anesthetic', N'เวชภัณฑ์', N'หลอด', CAST(450.00 AS DECIMAL(18,2)), CAST(240.00 AS DECIMAL(18,2)), N'ใช้ภายใต้การดูแลของบุคลากรทางการแพทย์', N'MedSupply'),
    (N'PRD007', N'เจลล้างมือแอลกอฮอล์', N'Alcohol Hand Gel', N'ของใช้', N'ขวด', CAST(159.00 AS DECIMAL(18,2)), CAST(85.00 AS DECIMAL(18,2)), N'แอลกอฮอล์ 70% กลิ่นอ่อน', N'CleanCo'),
    (N'PRD008', N'สำลีแผ่น', N'Cotton Pads', N'ของใช้', N'แพ็ค', CAST(120.00 AS DECIMAL(18,2)), CAST(60.00 AS DECIMAL(18,2)), N'สำลีเนื้อนุ่ม ไม่เป็นขุย', N'CleanCo'),
    (N'PRD009', N'ครีมลดรอยแผลเป็น', N'Scar Cream', N'สกินแคร์', N'หลอด', CAST(690.00 AS DECIMAL(18,2)), CAST(410.00 AS DECIMAL(18,2)), N'ช่วยให้รอยดูจางลงเมื่อใช้ต่อเนื่อง', N'ABSMEDIQ'),
    (N'PRD010', N'น้ำเกลือ', N'Saline', N'เวชภัณฑ์', N'ขวด', CAST(45.00 AS DECIMAL(18,2)), CAST(18.00 AS DECIMAL(18,2)), N'สำหรับทำความสะอาดแผล/ล้างอุปกรณ์', N'MedSupply'),
    (N'PRD011', N'เข็มฉีดยา 3ml', N'Syringe 3ml', N'เวชภัณฑ์', N'ชิ้น', CAST(12.00 AS DECIMAL(18,2)), CAST(6.00 AS DECIMAL(18,2)), N'ใช้สำหรับการรักษาตามมาตรฐานคลินิก', N'MedSupply'),
    (N'PRD012', N'ผ้าก๊อซ', N'Sterile Gauze', N'เวชภัณฑ์', N'แพ็ค', CAST(65.00 AS DECIMAL(18,2)), CAST(32.00 AS DECIMAL(18,2)), N'ปลอดเชื้อ เหมาะสำหรับทำแผล', N'MedSupply')
  ) AS v (code, name_th, name_en, category, unit, price, cost, description, supplier)
)
UPDATE target
SET
  target.name_th = src.name_th,
  target.name_en = src.name_en,
  target.category = src.category,
  target.unit = src.unit,
  target.price = src.price,
  target.cost = src.cost,
  target.description = src.description,
  target.supplier = src.supplier
FROM dbo.product_master AS target
INNER JOIN src ON target.code = src.code;

;WITH src AS (
  SELECT *
  FROM (VALUES
    (N'PRD001', N'ครีมบำรุงผิวหน้า', N'Facial Moisturizer', N'สกินแคร์', N'กระปุก', CAST(890.00 AS DECIMAL(18,2)), CAST(520.00 AS DECIMAL(18,2)), N'มอยส์เจอร์ไรเซอร์สำหรับผิวแห้ง ชุ่มชื้นยาวนาน', N'ABSMEDIQ'),
    (N'PRD002', N'เซรั่มวิตามินซี', N'Vitamin C Serum', N'สกินแคร์', N'ขวด', CAST(1290.00 AS DECIMAL(18,2)), CAST(760.00 AS DECIMAL(18,2)), N'ช่วยให้ผิวดูกระจ่างใส ลดรอยดำ', N'ABSMEDIQ'),
    (N'PRD003', N'กันแดด SPF50+', N'Sunscreen SPF50+', N'สกินแคร์', N'หลอด', CAST(990.00 AS DECIMAL(18,2)), CAST(580.00 AS DECIMAL(18,2)), N'ปกป้อง UVA/UVB เนื้อบางเบา ไม่เหนอะหนะ', N'ABSMEDIQ'),
    (N'PRD004', N'คลีนเซอร์ล้างหน้า', N'Gentle Cleanser', N'สกินแคร์', N'หลอด', CAST(590.00 AS DECIMAL(18,2)), CAST(320.00 AS DECIMAL(18,2)), N'ทำความสะอาดผิวอย่างอ่อนโยน เหมาะกับผิวแพ้ง่าย', N'ABSMEDIQ'),
    (N'PRD005', N'มาสก์หน้าชุ่มชื้น', N'Hydrating Mask', N'มาสก์', N'แผ่น', CAST(79.00 AS DECIMAL(18,2)), CAST(35.00 AS DECIMAL(18,2)), N'เติมความชุ่มชื้นเร่งด่วน', N'ABSMEDIQ'),
    (N'PRD006', N'ยาชา (ใช้โดยผู้เชี่ยวชาญ)', N'Topical Anesthetic', N'เวชภัณฑ์', N'หลอด', CAST(450.00 AS DECIMAL(18,2)), CAST(240.00 AS DECIMAL(18,2)), N'ใช้ภายใต้การดูแลของบุคลากรทางการแพทย์', N'MedSupply'),
    (N'PRD007', N'เจลล้างมือแอลกอฮอล์', N'Alcohol Hand Gel', N'ของใช้', N'ขวด', CAST(159.00 AS DECIMAL(18,2)), CAST(85.00 AS DECIMAL(18,2)), N'แอลกอฮอล์ 70% กลิ่นอ่อน', N'CleanCo'),
    (N'PRD008', N'สำลีแผ่น', N'Cotton Pads', N'ของใช้', N'แพ็ค', CAST(120.00 AS DECIMAL(18,2)), CAST(60.00 AS DECIMAL(18,2)), N'สำลีเนื้อนุ่ม ไม่เป็นขุย', N'CleanCo'),
    (N'PRD009', N'ครีมลดรอยแผลเป็น', N'Scar Cream', N'สกินแคร์', N'หลอด', CAST(690.00 AS DECIMAL(18,2)), CAST(410.00 AS DECIMAL(18,2)), N'ช่วยให้รอยดูจางลงเมื่อใช้ต่อเนื่อง', N'ABSMEDIQ'),
    (N'PRD010', N'น้ำเกลือ', N'Saline', N'เวชภัณฑ์', N'ขวด', CAST(45.00 AS DECIMAL(18,2)), CAST(18.00 AS DECIMAL(18,2)), N'สำหรับทำความสะอาดแผล/ล้างอุปกรณ์', N'MedSupply'),
    (N'PRD011', N'เข็มฉีดยา 3ml', N'Syringe 3ml', N'เวชภัณฑ์', N'ชิ้น', CAST(12.00 AS DECIMAL(18,2)), CAST(6.00 AS DECIMAL(18,2)), N'ใช้สำหรับการรักษาตามมาตรฐานคลินิก', N'MedSupply'),
    (N'PRD012', N'ผ้าก๊อซ', N'Sterile Gauze', N'เวชภัณฑ์', N'แพ็ค', CAST(65.00 AS DECIMAL(18,2)), CAST(32.00 AS DECIMAL(18,2)), N'ปลอดเชื้อ เหมาะสำหรับทำแผล', N'MedSupply')
  ) AS v (code, name_th, name_en, category, unit, price, cost, description, supplier)
)
INSERT INTO dbo.product_master (code, name_th, name_en, category, unit, price, cost, description, supplier)
SELECT
  src.code,
  src.name_th,
  src.name_en,
  src.category,
  src.unit,
  src.price,
  src.cost,
  src.description,
  src.supplier
FROM src
LEFT JOIN dbo.product_master AS target ON target.code = src.code
WHERE target.code IS NULL;
