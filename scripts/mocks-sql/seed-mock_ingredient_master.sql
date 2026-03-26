/*
  Auto-generated SQL create+seed from src/mocks/*.js
  Generated at: 2026-03-10T17:38:43.171Z
  SQL dialect: Microsoft SQL Server
*/

SET NOCOUNT ON;

/* mock_ingredient_master */
/* source: src/mocks/ingredientsFull.js#default */
IF OBJECT_ID(N'dbo.mock_ingredient_master', N'U') IS NULL
BEGIN
  RAISERROR('Table dbo.mock_ingredient_master does not exist. Run create script first.', 16, 1);
  RETURN;
END;

DELETE FROM dbo.mock_ingredient_master;

INSERT INTO dbo.mock_ingredient_master ([code], [nameTh], [nameEn], [category], [unit], [warehouse], [stock], [status], [price], [description], [stockLots])
VALUES
(N'ING-0001', N'สารสกัดขมิ้นชัน', N'Turmeric Extract', N'สารออกฤทธิ์', N'กรัม', N'1', 1200, N'ใช้งาน', 12.5, N'สารออกฤทธิ์จากขมิ้นชัน (Batch A)', N'[{"qty":300,"receivedAt":"2025-12-01","lotNo":"ING-2025-001","expiryDate":"2027-12-01"},{"qty":900,"receivedAt":"2026-01-10","lotNo":"ING-2026-003","expiryDate":"2027-12-31"}]'),
(N'ING-0002', N'สารสกัดใบบัวบก', N'Centella Extract', N'สารออกฤทธิ์', N'กรัม', N'1', 820, N'ใช้งาน', 14.2, N'ใช้ในสูตรบำรุงผิว', N'[{"qty":820,"receivedAt":"2026-01-18","lotNo":"ING-2026-006","expiryDate":"2027-10-15"}]'),
(N'ING-0003', N'สารสกัดชาเขียว', N'Green Tea Extract', N'สารออกฤทธิ์', N'กรัม', N'2', 500, N'ใช้งาน', 11.75, N'สารต้านอนุมูลอิสระ', N'[{"qty":500,"receivedAt":"2026-01-05","lotNo":"ING-2026-001","expiryDate":"2027-09-30"}]'),
(N'ING-0004', N'กรดไฮยาลูโรนิก', N'Hyaluronic Acid', N'สารออกฤทธิ์', N'กรัม', N'2', 260, N'ใช้งาน', 48, N'สารให้ความชุ่มชื้น', N'[{"qty":260,"receivedAt":"2025-11-20","lotNo":"ING-2025-110","expiryDate":"2027-05-20"}]'),
(N'ING-0005', N'วิตามินซีผง', N'Vitamin C Powder', N'สารออกฤทธิ์', N'กรัม', N'3', 640, N'ใช้งาน', 9.8, N'ใช้ในสูตรลดรอยดำ', N'[{"qty":320,"receivedAt":"2025-10-05","lotNo":"ING-2025-090","expiryDate":"2027-01-05"},{"qty":320,"receivedAt":"2026-01-15","lotNo":"ING-2026-004","expiryDate":"2027-12-15"}]'),
(N'ING-0006', N'แอลกอฮอล์ 95%', N'Ethanol 95%', N'ตัวทำละลาย', N'ลิตร', N'4', 120, N'ใช้งาน', 85, N'ตัวทำละลายหลัก', N'[{"qty":60,"receivedAt":"2025-12-12","lotNo":"ING-2025-201","expiryDate":"2028-12-12"},{"qty":60,"receivedAt":"2026-01-22","lotNo":"ING-2026-009","expiryDate":"2029-01-22"}]'),
(N'ING-0007', N'กลีเซอรีน', N'Glycerin', N'ตัวทำละลาย', N'กิโลกรัม', N'4', 85, N'ใช้งาน', 52, N'ตัวทำละลาย/ให้ความชุ่มชื้น', N'[{"qty":85,"receivedAt":"2026-01-08","lotNo":"ING-2026-002","expiryDate":"2028-01-08"}]'),
(N'ING-0008', N'สารเพิ่มความหนืด (CMC)', N'CMC Thickener', N'สารเพิ่มปริมาณ', N'กิโลกรัม', N'5', 45, N'ใช้งาน', 95, N'ใช้เพิ่มความหนืด', N'[{"qty":45,"receivedAt":"2025-09-12","lotNo":"ING-2025-071","expiryDate":"2027-09-12"}]'),
(N'ING-0009', N'สารกันเสีย (Phenoxyethanol)', N'Phenoxyethanol', N'สารช่วย', N'กิโลกรัม', N'5', 22, N'ใช้งาน', 180, N'สารกันเสียสำหรับสูตรเจล', N'[{"qty":22,"receivedAt":"2025-12-28","lotNo":"ING-2025-251","expiryDate":"2027-12-28"}]'),
(N'ING-0010', N'สารช่วยการละลาย (PEG-40)', N'PEG-40', N'สารช่วย', N'กิโลกรัม', N'6', 30, N'ใช้งาน', 140, N'ช่วยละลายกลิ่น/สารสกัด', N'[{"qty":30,"receivedAt":"2026-01-02","lotNo":"ING-2026-000","expiryDate":"2028-01-02"}]'),
(N'ING-0011', N'สารให้ความหวาน (Stevia)', N'Stevia', N'สารช่วย', N'กรัม', N'7', 350, N'ใช้งาน', 6.5, N'ใช้ในสูตรเจลรับประทาน', NULL),
(N'ING-0012', N'กลิ่นวานิลลา', N'Vanilla Flavor', N'สารช่วย', N'มิลลิลิตร', N'7', 110, N'ใช้งาน', 22, N'กลิ่นสำหรับสูตรเฉพาะ', NULL),
(N'ING-0013', N'ผงคอลลาเจน', N'Collagen Powder', N'สารออกฤทธิ์', N'กรัม', N'8', 900, N'ใช้งาน', 10.9, N'ใช้ในสูตรเสริมความยืดหยุ่นผิว', NULL),
(N'ING-0014', N'น้ำบริสุทธิ์ (DI Water)', N'DI Water', N'ตัวทำละลาย', N'ลิตร', N'8', 500, N'ใช้งาน', 3.2, N'น้ำบริสุทธิ์สำหรับการผลิต', NULL),
(N'ING-0015', N'ผงว่านหางจระเข้', N'Aloe Vera Powder', N'สารออกฤทธิ์', N'กรัม', N'9', 260, N'ใช้งาน', 12, N'ลดการระคายเคือง', NULL),
(N'ING-0016', N'สารแต่งสี (CI 19140)', N'Colorant CI 19140', N'สารช่วย', N'กรัม', N'9', 80, N'ใช้งาน', 4.8, N'ใช้เติมสีในสูตร', NULL),
(N'ING-0017', N'ผงซิงค์ออกไซด์', N'Zinc Oxide', N'สารออกฤทธิ์', N'กรัม', N'10', 700, N'ใช้งาน', 7.4, N'ใช้ในสูตรกันแดด', NULL),
(N'ING-0018', N'สารเพิ่มปริมาณ (Maltodextrin)', N'Maltodextrin', N'สารเพิ่มปริมาณ', N'กิโลกรัม', N'10', 60, N'ใช้งาน', 38, N'ใช้เป็นตัวพา', NULL),
(N'ING-0019', N'สารปรับ pH (Citric Acid)', N'Citric Acid', N'สารช่วย', N'กรัม', N'11', 420, N'ใช้งาน', 5.1, N'สารปรับสมดุลกรด-ด่าง', NULL),
(N'ING-0020', N'สารกันเสีย (Paraben Free Blend)', N'Paraben-Free Blend', N'สารช่วย', N'กิโลกรัม', N'11', 18, N'ใช้งาน', 210, N'ชุดสารกันเสียสูตรอ่อนโยน', NULL);

