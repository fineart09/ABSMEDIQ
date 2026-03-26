/*
  Auto-generated SQL create+seed from src/mocks/*.js
  Generated at: 2026-03-10T17:38:43.171Z
  SQL dialect: Microsoft SQL Server
*/

SET NOCOUNT ON;

/* mock_appointment_topic_master */
/* source: src/mocks/appointmentsStage.js#APPOINTMENT_TOPICS_STAGE */
IF OBJECT_ID(N'dbo.mock_appointment_topic_master', N'U') IS NULL
BEGIN
CREATE TABLE dbo.mock_appointment_topic_master (
  topic_id INT IDENTITY(1,1) NOT NULL,
  [name] NVARCHAR(50) NULL,
  [color] NVARCHAR(50) NULL,
  CONSTRAINT PK_mock_appointment_topic_master PRIMARY KEY CLUSTERED (topic_id)
);
END;

DELETE FROM dbo.mock_appointment_topic_master;

INSERT INTO dbo.mock_appointment_topic_master ([name], [color])
VALUES
(N'ฉีดวิตามิน', N'#d946ef'),
(N'รับยา/แนะนำการใช้ยา', N'#6366f1'),
(N'ตรวจเลือด', N'#d97706'),
(N'ตรวจสุขภาพ', N'#2563eb'),
(N'ทำกายภาพ', N'#7c3aed'),
(N'ตรวจติดตามอาการ', N'#ec4899'),
(N'ปรึกษาแพทย์', N'#a855f7'),
(N'ฉีดยา', N'#db2777'),
(N'ทำแผล', N'#0f766e'),
(N'Drip วิตามิน', N'#c026d3');


/* mock_appointment_stage */
/* source: src/mocks/appointmentsStage.js#default */
IF OBJECT_ID(N'dbo.mock_appointment_stage', N'U') IS NULL
BEGIN
CREATE TABLE dbo.mock_appointment_stage (
  appointment_id INT IDENTITY(1,1) NOT NULL,
  [id] NVARCHAR(50) NULL,
  [date] DATE NULL,
  [timeStart] NVARCHAR(50) NULL,
  [timeEnd] NVARCHAR(50) NULL,
  [time] NVARCHAR(50) NULL,
  [patient] NVARCHAR(50) NULL,
  [service] NVARCHAR(50) NULL,
  [details] NVARCHAR(50) NULL,
  [customerHn] NVARCHAR(50) NULL,
  [customerName] NVARCHAR(50) NULL,
  [customerPhone] NVARCHAR(50) NULL,
  [customerSegment] NVARCHAR(50) NULL,
  [customerStatus] NVARCHAR(50) NULL,
  [appointmentStatus] NVARCHAR(50) NULL,
  CONSTRAINT PK_mock_appointment_stage PRIMARY KEY CLUSTERED (appointment_id)
);
END;

DELETE FROM dbo.mock_appointment_stage;

INSERT INTO dbo.mock_appointment_stage ([id], [date], [timeStart], [timeEnd], [time], [patient], [service], [details], [customerHn], [customerName], [customerPhone], [customerSegment], [customerStatus], [appointmentStatus])
VALUES
(N'stage_20260305_01', CAST('2026-03-05' AS DATE), N'13:00', N'15:00', N'13:00', N'นาง อรทัย สวัสดิ์', N'ปรึกษาแพทย์', N'', N'HN013', N'นาง อรทัย สวัสดิ์', N'081-888-9900', N'ลูกค้าพิเศษ', N'ใช้งาน', N'attended'),
(N'stage_20260305_02', CAST('2026-03-05' AS DATE), N'10:30', N'11:30', N'10:30', N'นาย ปรีชา เกษมสุข', N'ทำแผล', N'', N'HN003', N'นาย ปรีชา เกษมสุข', N'083-456-7890', N'ลูกค้าไม่ประจำ', N'ใช้งาน', N'attended'),
(N'stage_20260305_03', CAST('2026-03-05' AS DATE), N'08:00', N'09:00', N'08:00', N'นาย ปวริศ กาญจนชัย', N'ตรวจเลือด', N'', N'HN017', N'นาย ปวริศ กาญจนชัย', N'081-505-6060', N'ลูกค้าไม่ประจำ', N'ใช้งาน', N'attended'),
(N'stage_20260305_04', CAST('2026-03-05' AS DATE), N'13:00', N'15:00', N'13:00', N'นาย ปวริศ กาญจนชัย', N'ทำแผล', N'', N'HN017', N'นาย ปวริศ กาญจนชัย', N'081-505-6060', N'ลูกค้าไม่ประจำ', N'ใช้งาน', N'cancelled'),
(N'stage_20260305_05', CAST('2026-03-05' AS DATE), N'17:30', N'19:30', N'17:30', N'นาง จิราภรณ์ ธรรมรักษ์', N'ตรวจติดตามอาการ', N'', N'HN018', N'นาง จิราภรณ์ ธรรมรักษ์', N'082-606-7070', N'ลูกค้าไม่ประจำ', N'ใช้งาน', N'cancelled'),
(N'stage_20260306_01', CAST('2026-03-06' AS DATE), N'18:00', N'20:00', N'18:00', N'นาย กิตติภูมิ รัตนชัย', N'ทำกายภาพ', N'', N'HN015', N'นาย กิตติภูมิ รัตนชัย', N'088-101-2020', N'ลูกค้า VIP', N'ใช้งาน', N''),
(N'stage_20260306_02', CAST('2026-03-06' AS DATE), N'11:30', N'12:30', N'11:30', N'นางสาว กาญจนา ประเสริฐ', N'ฉีดวิตามิน', N'', N'HN004', N'นางสาว กาญจนา ประเสริฐ', N'084-567-8901', N'ลูกค้า VIP', N'ใช้งาน', N'cancelled'),
(N'stage_20260306_03', CAST('2026-03-06' AS DATE), N'17:30', N'19:30', N'17:30', N'นาย สมชาย ใจดี', N'ทำแผล', N'', N'HN001', N'นาย สมชาย ใจดี', N'081-234-5678', N'ลูกค้าพิเศษ', N'ใช้งาน', N''),
(N'stage_20260306_04', CAST('2026-03-06' AS DATE), N'17:30', N'18:00', N'17:30', N'นางสาว พรทิพย์ บุญช่วย', N'ฉีดวิตามิน', N'', N'HN012', N'นางสาว พรทิพย์ บุญช่วย', N'082-777-8899', N'ลูกค้าประจำ', N'ใช้งาน', N''),
(N'stage_20260306_05', CAST('2026-03-06' AS DATE), N'08:00', N'09:30', N'08:00', N'นาง วราภรณ์ ทองดี', N'ตรวจสุขภาพ', N'', N'HN007', N'นาง วราภรณ์ ทองดี', N'089-222-3344', N'ลูกค้า VIP', N'ใช้งาน', N'cancelled'),
(N'stage_20260306_06', CAST('2026-03-06' AS DATE), N'10:00', N'11:30', N'10:00', N'นาย กิตติภูมิ รัตนชัย', N'ทำกายภาพ', N'', N'HN015', N'นาย กิตติภูมิ รัตนชัย', N'088-101-2020', N'ลูกค้า VIP', N'ใช้งาน', N''),
(N'stage_20260307_01', CAST('2026-03-07' AS DATE), N'14:30', N'15:30', N'14:30', N'นาย ศุภกร มงคลชัย', N'ทำแผล', N'', N'HN014', N'นาย ศุภกร มงคลชัย', N'086-909-0001', N'ลูกค้าไม่ประจำ', N'ใช้งาน', N'attended'),
(N'stage_20260307_02', CAST('2026-03-07' AS DATE), N'08:30', N'09:00', N'08:30', N'นาย สมชาย ใจดี', N'ปรึกษาแพทย์', N'', N'HN001', N'นาย สมชาย ใจดี', N'081-234-5678', N'ลูกค้าพิเศษ', N'ใช้งาน', N''),
(N'stage_20260307_03', CAST('2026-03-07' AS DATE), N'15:30', N'16:00', N'15:30', N'นาย สมชาย ใจดี', N'ตรวจติดตามอาการ', N'', N'HN001', N'นาย สมชาย ใจดี', N'081-234-5678', N'ลูกค้าพิเศษ', N'ใช้งาน', N'attended'),
(N'stage_20260308_01', CAST('2026-03-08' AS DATE), N'13:30', N'15:30', N'13:30', N'นางสาว กมลพร สุขใจ', N'ทำกายภาพ', N'', N'HN020', N'นางสาว กมลพร สุขใจ', N'084-808-9090', N'ลูกค้าประจำ', N'ใช้งาน', N'cancelled'),
(N'stage_20260308_02', CAST('2026-03-08' AS DATE), N'10:30', N'12:30', N'10:30', N'นาง วราภรณ์ ทองดี', N'ทำกายภาพ', N'', N'HN007', N'นาง วราภรณ์ ทองดี', N'089-222-3344', N'ลูกค้า VIP', N'ใช้งาน', N'attended'),
(N'stage_20260308_03', CAST('2026-03-08' AS DATE), N'08:00', N'09:00', N'08:00', N'นาย สมศักดิ์ หาญกล้า', N'ฉีดวิตามิน', N'', N'HN005', N'นาย สมศักดิ์ หาญกล้า', N'085-678-9012', N'ลูกค้า VIP', N'ใช้งาน', N'attended'),
(N'stage_20260308_04', CAST('2026-03-08' AS DATE), N'13:30', N'15:00', N'13:30', N'นางสาว กมลพร สุขใจ', N'ตรวจติดตามอาการ', N'', N'HN020', N'นางสาว กมลพร สุขใจ', N'084-808-9090', N'ลูกค้าประจำ', N'ใช้งาน', N''),
(N'stage_20260308_05', CAST('2026-03-08' AS DATE), N'08:00', N'09:00', N'08:00', N'นางสาว กาญจนา ประเสริฐ', N'Drip วิตามิน', N'', N'HN004', N'นางสาว กาญจนา ประเสริฐ', N'084-567-8901', N'ลูกค้า VIP', N'ใช้งาน', N''),
(N'stage_20260308_06', CAST('2026-03-08' AS DATE), N'14:30', N'16:00', N'14:30', N'นาง อรทัย สวัสดิ์', N'ฉีดยา', N'', N'HN013', N'นาง อรทัย สวัสดิ์', N'081-888-9900', N'ลูกค้าพิเศษ', N'ใช้งาน', N'attended'),
(N'stage_20260309_01', CAST('2026-03-09' AS DATE), N'09:00', N'10:30', N'09:00', N'นาย สมศักดิ์ หาญกล้า', N'ปรึกษาแพทย์', N'', N'HN005', N'นาย สมศักดิ์ หาญกล้า', N'085-678-9012', N'ลูกค้า VIP', N'ใช้งาน', N'cancelled'),
(N'stage_20260309_02', CAST('2026-03-09' AS DATE), N'14:30', N'16:30', N'14:30', N'นาง อรทัย สวัสดิ์', N'ทำกายภาพ', N'', N'HN013', N'นาง อรทัย สวัสดิ์', N'081-888-9900', N'ลูกค้าพิเศษ', N'ใช้งาน', N'attended'),
(N'stage_20260309_03', CAST('2026-03-09' AS DATE), N'18:30', N'19:00', N'18:30', N'นาง จิราภรณ์ ธรรมรักษ์', N'ตรวจติดตามอาการ', N'', N'HN018', N'นาง จิราภรณ์ ธรรมรักษ์', N'082-606-7070', N'ลูกค้าไม่ประจำ', N'ใช้งาน', N''),
(N'stage_20260309_04', CAST('2026-03-09' AS DATE), N'10:30', N'11:00', N'10:30', N'นางสาว กาญจนา ประเสริฐ', N'ปรึกษาแพทย์', N'', N'HN004', N'นางสาว กาญจนา ประเสริฐ', N'084-567-8901', N'ลูกค้า VIP', N'ใช้งาน', N'attended'),
(N'stage_20260310_01', CAST('2026-03-10' AS DATE), N'13:30', N'14:30', N'13:30', N'นาง จิราภรณ์ ธรรมรักษ์', N'ตรวจเลือด', N'', N'HN018', N'นาง จิราภรณ์ ธรรมรักษ์', N'082-606-7070', N'ลูกค้าไม่ประจำ', N'ใช้งาน', N''),
(N'stage_20260310_02', CAST('2026-03-10' AS DATE), N'11:30', N'12:30', N'11:30', N'นาย ปรีชา เกษมสุข', N'ตรวจติดตามอาการ', N'', N'HN003', N'นาย ปรีชา เกษมสุข', N'083-456-7890', N'ลูกค้าไม่ประจำ', N'ใช้งาน', N''),
(N'stage_20260310_03', CAST('2026-03-10' AS DATE), N'14:00', N'15:30', N'14:00', N'นาย ธีรศักดิ์ วงศ์วัฒน์', N'ตรวจเลือด', N'', N'HN009', N'นาย ธีรศักดิ์ วงศ์วัฒน์', N'087-444-5566', N'ลูกค้าไม่ประจำ', N'ใช้งาน', N'cancelled'),
(N'stage_20260311_01', CAST('2026-03-11' AS DATE), N'08:30', N'10:00', N'08:30', N'นางสาว พรทิพย์ บุญช่วย', N'Drip วิตามิน', N'', N'HN012', N'นางสาว พรทิพย์ บุญช่วย', N'082-777-8899', N'ลูกค้าประจำ', N'ใช้งาน', N'attended'),
(N'stage_20260311_02', CAST('2026-03-11' AS DATE), N'14:30', N'16:30', N'14:30', N'นาง อรทัย สวัสดิ์', N'ฉีดยา', N'', N'HN013', N'นาง อรทัย สวัสดิ์', N'081-888-9900', N'ลูกค้าพิเศษ', N'ใช้งาน', N''),
(N'stage_20260311_03', CAST('2026-03-11' AS DATE), N'09:30', N'11:00', N'09:30', N'นาย ปวริศ กาญจนชัย', N'ฉีดยา', N'', N'HN017', N'นาย ปวริศ กาญจนชัย', N'081-505-6060', N'ลูกค้าไม่ประจำ', N'ใช้งาน', N''),
(N'stage_20260312_01', CAST('2026-03-12' AS DATE), N'09:00', N'11:00', N'09:00', N'นาย ปรีชา เกษมสุข', N'ตรวจติดตามอาการ', N'', N'HN003', N'นาย ปรีชา เกษมสุข', N'083-456-7890', N'ลูกค้าไม่ประจำ', N'ใช้งาน', N'attended'),
(N'stage_20260312_02', CAST('2026-03-12' AS DATE), N'08:00', N'10:00', N'08:00', N'นาย ธีรศักดิ์ วงศ์วัฒน์', N'ตรวจติดตามอาการ', N'', N'HN009', N'นาย ธีรศักดิ์ วงศ์วัฒน์', N'087-444-5566', N'ลูกค้าไม่ประจำ', N'ใช้งาน', N''),
(N'stage_20260312_03', CAST('2026-03-12' AS DATE), N'13:30', N'15:00', N'13:30', N'นาง จิราภรณ์ ธรรมรักษ์', N'ตรวจติดตามอาการ', N'', N'HN018', N'นาง จิราภรณ์ ธรรมรักษ์', N'082-606-7070', N'ลูกค้าไม่ประจำ', N'ใช้งาน', N'attended'),
(N'stage_20260312_04', CAST('2026-03-12' AS DATE), N'17:00', N'18:00', N'17:00', N'นาง วราภรณ์ ทองดี', N'รับยา/แนะนำการใช้ยา', N'', N'HN007', N'นาง วราภรณ์ ทองดี', N'089-222-3344', N'ลูกค้า VIP', N'ใช้งาน', N'attended'),
(N'stage_20260312_05', CAST('2026-03-12' AS DATE), N'10:00', N'11:00', N'10:00', N'นาง วราภรณ์ ทองดี', N'ตรวจเลือด', N'', N'HN007', N'นาง วราภรณ์ ทองดี', N'089-222-3344', N'ลูกค้า VIP', N'ใช้งาน', N''),
(N'stage_20260312_06', CAST('2026-03-12' AS DATE), N'10:30', N'11:00', N'10:30', N'นาย สมชาย ใจดี', N'รับยา/แนะนำการใช้ยา', N'', N'HN001', N'นาย สมชาย ใจดี', N'081-234-5678', N'ลูกค้าพิเศษ', N'ใช้งาน', N''),
(N'stage_20260313_01', CAST('2026-03-13' AS DATE), N'16:00', N'17:00', N'16:00', N'นาย สมชาย ใจดี', N'ตรวจสุขภาพ', N'', N'HN001', N'นาย สมชาย ใจดี', N'081-234-5678', N'ลูกค้าพิเศษ', N'ใช้งาน', N'attended'),
(N'stage_20260313_02', CAST('2026-03-13' AS DATE), N'17:30', N'19:00', N'17:30', N'นาง วราภรณ์ ทองดี', N'Drip วิตามิน', N'', N'HN007', N'นาง วราภรณ์ ทองดี', N'089-222-3344', N'ลูกค้า VIP', N'ใช้งาน', N'attended'),
(N'stage_20260313_03', CAST('2026-03-13' AS DATE), N'11:30', N'13:00', N'11:30', N'นางสาว วลัยพร วิไลวงศ์', N'ตรวจติดตามอาการ', N'', N'HN016', N'นางสาว วลัยพร วิไลวงศ์', N'089-303-4040', N'ลูกค้า VIP', N'ใช้งาน', N'attended'),
(N'stage_20260314_01', CAST('2026-03-14' AS DATE), N'15:00', N'15:30', N'15:00', N'นาย ธีรศักดิ์ วงศ์วัฒน์', N'ฉีดยา', N'', N'HN009', N'นาย ธีรศักดิ์ วงศ์วัฒน์', N'087-444-5566', N'ลูกค้าไม่ประจำ', N'ใช้งาน', N''),
(N'stage_20260314_02', CAST('2026-03-14' AS DATE), N'15:00', N'16:00', N'15:00', N'นาย สมชาย ใจดี', N'ตรวจเลือด', N'', N'HN001', N'นาย สมชาย ใจดี', N'081-234-5678', N'ลูกค้าพิเศษ', N'ใช้งาน', N''),
(N'stage_20260314_03', CAST('2026-03-14' AS DATE), N'17:30', N'19:00', N'17:30', N'นางสาว วลัยพร วิไลวงศ์', N'ปรึกษาแพทย์', N'', N'HN016', N'นางสาว วลัยพร วิไลวงศ์', N'089-303-4040', N'ลูกค้า VIP', N'ใช้งาน', N'attended'),
(N'stage_20260315_01', CAST('2026-03-15' AS DATE), N'13:00', N'15:00', N'13:00', N'นางสาว กาญจนา ประเสริฐ', N'ตรวจสุขภาพ', N'', N'HN004', N'นางสาว กาญจนา ประเสริฐ', N'084-567-8901', N'ลูกค้า VIP', N'ใช้งาน', N'attended'),
(N'stage_20260315_02', CAST('2026-03-15' AS DATE), N'15:00', N'17:00', N'15:00', N'นาง วราภรณ์ ทองดี', N'ปรึกษาแพทย์', N'', N'HN007', N'นาง วราภรณ์ ทองดี', N'089-222-3344', N'ลูกค้า VIP', N'ใช้งาน', N'');


/* mock_consumable_master */
/* source: src/mocks/consumablesFull.js#default */
IF OBJECT_ID(N'dbo.mock_consumable_master', N'U') IS NULL
BEGIN
CREATE TABLE dbo.mock_consumable_master (
  consumable_id INT IDENTITY(1,1) NOT NULL,
  [code] NVARCHAR(50) NULL,
  [nameTh] NVARCHAR(50) NULL,
  [category] NVARCHAR(50) NULL,
  [unit] NVARCHAR(50) NULL,
  [price] INT NULL,
  [stock] INT NULL,
  [status] NVARCHAR(50) NULL,
  [warehouse] NVARCHAR(50) NULL,
  [stockLots] NVARCHAR(MAX) NULL,
  CONSTRAINT PK_mock_consumable_master PRIMARY KEY CLUSTERED (consumable_id)
);
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


/* mock_customer_master */
/* source: src/mocks/customersFull.js#default */
IF OBJECT_ID(N'dbo.mock_customer_master', N'U') IS NULL
BEGIN
CREATE TABLE dbo.mock_customer_master (
  customer_id INT IDENTITY(1,1) NOT NULL,
  [hn] NVARCHAR(50) NULL,
  [name] NVARCHAR(MAX) NULL,
  [address] NVARCHAR(MAX) NULL,
  [details] NVARCHAR(MAX) NULL,
  [segment] NVARCHAR(50) NULL,
  [discount] NVARCHAR(50) NULL,
  [lastVisit] DATE NULL,
  [status] NVARCHAR(50) NULL,
  CONSTRAINT PK_mock_customer_master PRIMARY KEY CLUSTERED (customer_id)
);
END;

DELETE FROM dbo.mock_customer_master;

INSERT INTO dbo.mock_customer_master ([hn], [name], [address], [details], [segment], [discount], [lastVisit], [status])
VALUES
(N'HN001', N'{"prefixTh":"นาย","prefixEn":"Mr.","firstTh":"สมชาย","firstEn":"Somchai","lastTh":"ใจดี","lastEn":"Jaidee","nickname":"ชาย"}', N'{"addressTh":"123 ถนนสุขุมวิท แขวงคลองเตย","addressEn":"123 Sukhumvit Rd., Khlong Toei","provinceTh":"กรุงเทพมหานคร","provinceEn":"Bangkok","postalCode":"10110","districtTh":"คลองเตย","districtEn":"Khlong Toei","subdistrictTh":"คลองเตย","subdistrictEn":"Khlong Toei"}', N'{"genderTh":"ชาย","genderEn":"Male","bloodGroup":"A+","birthDate":"1988-04-12","phone":"081-234-5678","email":"somchai.j@example.com","notes":"ลูกค้าประจำออฟฟิศคลองเตย","age":"37"}', N'ลูกค้าพิเศษ', N'3', CAST('2024-12-19' AS DATE), N'ใช้งาน'),
(N'HN002', N'{"prefixTh":"นางสาว","prefixEn":"Ms.","firstTh":"สุกัญญา","firstEn":"Sukanya","lastTh":"มั่นคง","lastEn":"Mankong","nickname":"กัญ"}', N'{"addressTh":"55 ถ.พระราม 4 แขวงสีลม","addressEn":"55 Rama IV Rd., Silom","provinceTh":"กรุงเทพมหานคร","provinceEn":"Bangkok","postalCode":"10500","districtTh":"บางรัก","districtEn":"Bang Rak","subdistrictTh":"สีลม","subdistrictEn":"Silom"}', N'{"genderTh":"หญิง","genderEn":"Female","bloodGroup":"O+","birthDate":"1992-11-20","phone":"082-345-6789","email":"sukanya.m@example.com","notes":"ชอบนัดวันเสาร์เช้า","age":"33"}', N'ลูกค้า VIP', N'29', CAST('2025-06-09' AS DATE), N'ไม่ใช้งาน'),
(N'HN003', N'{"prefixTh":"นาย","prefixEn":"Mr.","firstTh":"ปรีชา","firstEn":"Preecha","lastTh":"เกษมสุข","lastEn":"Kasemsuk","nickname":"ชา"}', N'{"addressTh":"88 ถ.นิมมานเหมินท์ ต.สุเทพ","addressEn":"88 Nimman Rd., Suthep","provinceTh":"เชียงใหม่","provinceEn":"Chiang Mai","postalCode":"50200","districtTh":"เมืองเชียงใหม่","districtEn":"Mueang Chiang Mai","subdistrictTh":"สุเทพ","subdistrictEn":"Suthep"}', N'{"genderTh":"ชาย","genderEn":"Male","bloodGroup":"B+","birthDate":"1985-07-03","phone":"083-456-7890","email":"preecha.k@example.com","notes":"","age":"40"}', N'ลูกค้าไม่ประจำ', N'7', CAST('2024-12-21' AS DATE), N'ใช้งาน'),
(N'HN004', N'{"prefixTh":"นางสาว","prefixEn":"Ms.","firstTh":"กาญจนา","firstEn":"Kanjana","lastTh":"ประเสริฐ","lastEn":"Prasert","nickname":"จ๋า"}', N'{"addressTh":"12/3 ถ.เทพกระษัตรี ต.ตลาดใหญ่","addressEn":"12/3 Thepkasattri Rd., Talat Yai","provinceTh":"ภูเก็ต","provinceEn":"Phuket","postalCode":"83000","districtTh":"เมืองภูเก็ต","districtEn":"Mueang Phuket","subdistrictTh":"ตลาดใหญ่","subdistrictEn":"Talat Yai"}', N'{"genderTh":"หญิง","genderEn":"Female","bloodGroup":"AB+","birthDate":"1996-02-14","phone":"084-567-8901","email":"kanjana.p@example.com","notes":"ย้ายที่อยู่บ่อย","age":"29"}', N'ลูกค้า VIP', N'28', CAST('2024-11-20' AS DATE), N'ใช้งาน'),
(N'HN005', N'{"prefixTh":"นาย","prefixEn":"Mr.","firstTh":"สมศักดิ์","firstEn":"Somsak","lastTh":"หาญกล้า","lastEn":"Hankla","nickname":"ศักดิ์"}', N'{"addressTh":"199 ถ.สุขุมวิท ต.บางปลาสร้อย","addressEn":"199 Sukhumvit Rd., Bang Pla Soi","provinceTh":"ชลบุรี","provinceEn":"Chon Buri","postalCode":"20000","districtTh":"เมืองชลบุรี","districtEn":"Mueang Chon Buri","subdistrictTh":"บางปลาสร้อย","subdistrictEn":"Bang Pla Soi"}', N'{"genderTh":"ชาย","genderEn":"Male","bloodGroup":"O-","birthDate":"1980-09-18","phone":"085-678-9012","email":"somsak.h@example.com","notes":"","age":"45"}', N'ลูกค้า VIP', N'9', CAST('2025-10-04' AS DATE), N'ใช้งาน'),
(N'HN006', N'{"prefixTh":"นาย","prefixEn":"Mr.","firstTh":"ณัฐวุฒิ","firstEn":"Nattawut","lastTh":"อินทร์ทอง","lastEn":"Inthong","nickname":"วุฒิ"}', N'{"addressTh":"88/9 ถ.ชัยพฤกษ์ ต.บางกระสอ","addressEn":"88/9 Chaiphruek Rd., Bang Krasor","provinceTh":"นนทบุรี","provinceEn":"Nonthaburi","postalCode":"11000","districtTh":"เมืองนนทบุรี","districtEn":"Mueang Nonthaburi","subdistrictTh":"บางกระสอ","subdistrictEn":"Bang Krasor"}', N'{"genderTh":"ชาย","genderEn":"Male","bloodGroup":"A-","birthDate":"1990-01-22","phone":"086-111-2233","email":"nattawut.i@example.com","notes":"","age":"35"}', N'ลูกค้า VIP', N'27', CAST('2025-07-31' AS DATE), N'ไม่ใช้งาน'),
(N'HN007', N'{"prefixTh":"นาง","prefixEn":"Mrs.","firstTh":"วราภรณ์","firstEn":"Waraporn","lastTh":"ทองดี","lastEn":"Thongdee","nickname":"อร"}', N'{"addressTh":"77 หมู่ 4 ต.คลองหนึ่ง","addressEn":"77 Moo 4, Khlong Nueng","provinceTh":"ปทุมธานี","provinceEn":"Pathum Thani","postalCode":"12120","districtTh":"คลองหลวง","districtEn":"Khlong Luang","subdistrictTh":"คลองหนึ่ง","subdistrictEn":"Khlong Nueng"}', N'{"genderTh":"หญิง","genderEn":"Female","bloodGroup":"B-","birthDate":"1983-05-05","phone":"089-222-3344","email":"waraporn.t@example.com","notes":"ลูกค้ากลุ่มครอบครัว","age":"42"}', N'ลูกค้า VIP', N'11', CAST('2025-04-26' AS DATE), N'ใช้งาน'),
(N'HN008', N'{"prefixTh":"นาย","prefixEn":"Mr.","firstTh":"พิชิต","firstEn":"Pichit","lastTh":"สิริชัย","lastEn":"Sirichai","nickname":"ชิต"}', N'{"addressTh":"15 ถ.สุขุมวิท ต.ปากน้ำ","addressEn":"15 Sukhumvit Rd., Pak Nam","provinceTh":"สมุทรปราการ","provinceEn":"Samut Prakan","postalCode":"10270","districtTh":"เมืองสมุทรปราการ","districtEn":"Mueang Samut Prakan","subdistrictTh":"ปากน้ำ","subdistrictEn":"Pak Nam"}', N'{"genderTh":"ชาย","genderEn":"Male","bloodGroup":"AB-","birthDate":"1979-03-29","phone":"080-333-4455","email":"pichit.s@example.com","notes":"","age":"46"}', N'ลูกค้าพิเศษ', N'26', CAST('2025-03-11' AS DATE), N'ไม่ใช้งาน'),
(N'HN009', N'{"prefixTh":"นาย","prefixEn":"Mr.","firstTh":"ธีรศักดิ์","firstEn":"Teerasak","lastTh":"วงศ์วัฒน์","lastEn":"Wongwat","nickname":"ตั้ม"}', N'{"addressTh":"9 ถ.มิตรภาพ ต.ในเมือง","addressEn":"9 Mittraphap Rd., Nai Mueang","provinceTh":"นครราชสีมา","provinceEn":"Nakhon Ratchasima","postalCode":"30000","districtTh":"เมืองนครราชสีมา","districtEn":"Mueang Nakhon Ratchasima","subdistrictTh":"ในเมือง","subdistrictEn":"Nai Mueang"}', N'{"genderTh":"ชาย","genderEn":"Male","bloodGroup":"O+","birthDate":"1987-12-02","phone":"087-444-5566","email":"teerasak.w@example.com","notes":"","age":"38"}', N'ลูกค้าไม่ประจำ', N'13', CAST('2026-01-21' AS DATE), N'ใช้งาน'),
(N'HN010', N'{"prefixTh":"นางสาว","prefixEn":"Ms.","firstTh":"ชลธิชา","firstEn":"Cholticha","lastTh":"ศรีสุวรรณ","lastEn":"Srisuwan","nickname":"มิว"}', N'{"addressTh":"101 ถ.กลางเมือง ต.ในเมือง","addressEn":"101 Klang Muang Rd., Nai Mueang","provinceTh":"ขอนแก่น","provinceEn":"Khon Kaen","postalCode":"40000","districtTh":"เมืองขอนแก่น","districtEn":"Mueang Khon Kaen","subdistrictTh":"ในเมือง","subdistrictEn":"Nai Mueang"}', N'{"genderTh":"หญิง","genderEn":"Female","bloodGroup":"A+","birthDate":"1994-08-09","phone":"086-555-6677","email":"cholticha.s@example.com","notes":"","age":"31"}', N'ลูกค้า VIP', N'25', CAST('2025-09-02' AS DATE), N'ไม่ใช้งาน'),
(N'HN011', N'{"prefixTh":"นาย","prefixEn":"Mr.","firstTh":"นรินทร์","firstEn":"Narin","lastTh":"จันทร์เพ็ญ","lastEn":"Chanphen","nickname":"ริณ"}', N'{"addressTh":"45 ถ.ราชดำเนิน ต.ท่าวัง","addressEn":"45 Ratchadamnoen Rd., Tha Wang","provinceTh":"นครศรีธรรมราช","provinceEn":"Nakhon Si Thammarat","postalCode":"80000","districtTh":"เมืองนครศรีธรรมราช","districtEn":"Mueang Nakhon Si Thammarat","subdistrictTh":"ท่าวัง","subdistrictEn":"Tha Wang"}', N'{"genderTh":"ชาย","genderEn":"Male","bloodGroup":"B+","birthDate":"1982-06-30","phone":"089-666-7788","email":"narin.c@example.com","notes":"","age":"43"}', N'ลูกค้าไม่ประจำ', N'14', CAST('2025-03-27' AS DATE), N'ไม่ใช้งาน'),
(N'HN012', N'{"prefixTh":"นางสาว","prefixEn":"Ms.","firstTh":"พรทิพย์","firstEn":"Porntip","lastTh":"บุญช่วย","lastEn":"Boonchuay","nickname":"พร"}', N'{"addressTh":"12 ถ.ท่าทราย ต.ตลาด","addressEn":"12 Tha Sai Rd., Talat","provinceTh":"สุราษฎร์ธานี","provinceEn":"Surat Thani","postalCode":"84000","districtTh":"เมืองสุราษฎร์ธานี","districtEn":"Mueang Surat Thani","subdistrictTh":"ตลาด","subdistrictEn":"Talat"}', N'{"genderTh":"หญิง","genderEn":"Female","bloodGroup":"AB+","birthDate":"1991-10-17","phone":"082-777-8899","email":"porntip.b@example.com","notes":"ชอบติดต่อทางอีเมล","age":"34"}', N'ลูกค้าประจำ', N'24', CAST('2025-01-16' AS DATE), N'ใช้งาน'),
(N'HN013', N'{"prefixTh":"นาง","prefixEn":"Mrs.","firstTh":"อรทัย","firstEn":"Orathai","lastTh":"สวัสดิ์","lastEn":"Sawas","nickname":"อร"}', N'{"addressTh":"222 ถ.กาญจนวนิช ต.คอหงส์","addressEn":"222 Kanjanavanit Rd., Kho Hong","provinceTh":"สงขลา","provinceEn":"Songkhla","postalCode":"90110","districtTh":"หาดใหญ่","districtEn":"Hat Yai","subdistrictTh":"คอหงส์","subdistrictEn":"Kho Hong"}', N'{"genderTh":"หญิง","genderEn":"Female","bloodGroup":"O+","birthDate":"1986-01-05","phone":"081-888-9900","email":"orathai.s@example.com","notes":"","age":"39"}', N'ลูกค้าพิเศษ', N'16', CAST('2025-09-05' AS DATE), N'ใช้งาน'),
(N'HN014', N'{"prefixTh":"นาย","prefixEn":"Mr.","firstTh":"ศุภกร","firstEn":"Supakorn","lastTh":"มงคลชัย","lastEn":"Mongkolchai","nickname":"กัน"}', N'{"addressTh":"78 ถ.แจ้งสนิท ต.ในเมือง","addressEn":"78 Chaeng Sanit Rd., Nai Mueang","provinceTh":"อุบลราชธานี","provinceEn":"Ubon Ratchathani","postalCode":"34000","districtTh":"เมืองอุบลราชธานี","districtEn":"Mueang Ubon Ratchathani","subdistrictTh":"ในเมือง","subdistrictEn":"Nai Mueang"}', N'{"genderTh":"ชาย","genderEn":"Male","bloodGroup":"A-","birthDate":"1993-03-12","phone":"086-909-0001","email":"supakorn.m@example.com","notes":"","age":"32"}', N'ลูกค้าไม่ประจำ', N'23', CAST('2024-12-06' AS DATE), N'ใช้งาน'),
(N'HN015', N'{"prefixTh":"นาย","prefixEn":"Mr.","firstTh":"กิตติภูมิ","firstEn":"Kittiphum","lastTh":"รัตนชัย","lastEn":"Rattanachai","nickname":"ภูมิ"}', N'{"addressTh":"65 ถ.โพศรี ต.หมากแข้ง","addressEn":"65 Pho Sri Rd., Mak Khaeng","provinceTh":"อุดรธานี","provinceEn":"Udon Thani","postalCode":"41000","districtTh":"เมืองอุดรธานี","districtEn":"Mueang Udon Thani","subdistrictTh":"หมากแข้ง","subdistrictEn":"Mak Khaeng"}', N'{"genderTh":"ชาย","genderEn":"Male","bloodGroup":"B+","birthDate":"1997-09-23","phone":"088-101-2020","email":"kittiphum.r@example.com","notes":"","age":"28"}', N'ลูกค้า VIP', N'17', CAST('2025-05-16' AS DATE), N'ใช้งาน'),
(N'HN016', N'{"prefixTh":"นางสาว","prefixEn":"Ms.","firstTh":"วลัยพร","firstEn":"Walaiporn","lastTh":"วิไลวงศ์","lastEn":"Wilaiwong","nickname":"ไล"}', N'{"addressTh":"19 ถ.พหลโยธิน ต.รอบเวียง","addressEn":"19 Phahonyothin Rd., Rob Wiang","provinceTh":"เชียงราย","provinceEn":"Chiang Rai","postalCode":"57000","districtTh":"เมืองเชียงราย","districtEn":"Mueang Chiang Rai","subdistrictTh":"รอบเวียง","subdistrictEn":"Rob Wiang"}', N'{"genderTh":"หญิง","genderEn":"Female","bloodGroup":"AB-","birthDate":"1995-12-31","phone":"089-303-4040","email":"walaiporn.w@example.com","notes":"","age":"30"}', N'ลูกค้า VIP', N'22', CAST('2025-09-01' AS DATE), N'ใช้งาน'),
(N'HN017', N'{"prefixTh":"นาย","prefixEn":"Mr.","firstTh":"ปวริศ","firstEn":"Pawarit","lastTh":"กาญจนชัย","lastEn":"Kanchanachai","nickname":"ริศ"}', N'{"addressTh":"333 ถ.สุขุมวิท ต.ท่าประดู่","addressEn":"333 Sukhumvit Rd., Tha Pradu","provinceTh":"ระยอง","provinceEn":"Rayong","postalCode":"21000","districtTh":"เมืองระยอง","districtEn":"Mueang Rayong","subdistrictTh":"ท่าประดู่","subdistrictEn":"Tha Pradu"}', N'{"genderTh":"ชาย","genderEn":"Male","bloodGroup":"O+","birthDate":"1984-08-08","phone":"081-505-6060","email":"pawarit.k@example.com","notes":"","age":"41"}', N'ลูกค้าไม่ประจำ', N'19', CAST('2025-11-19' AS DATE), N'ใช้งาน'),
(N'HN018', N'{"prefixTh":"นาง","prefixEn":"Mrs.","firstTh":"จิราภรณ์","firstEn":"Jiraporn","lastTh":"ธรรมรักษ์","lastEn":"Thammarak","nickname":"จิ"}', N'{"addressTh":"12 ถ.ราชดำเนิน ต.พระปฐมเจดีย์","addressEn":"12 Ratchadamnoen Rd., Phra Pathom Chedi","provinceTh":"นครปฐม","provinceEn":"Nakhon Pathom","postalCode":"73000","districtTh":"เมืองนครปฐม","districtEn":"Mueang Nakhon Pathom","subdistrictTh":"พระปฐมเจดีย์","subdistrictEn":"Phra Pathom Chedi"}', N'{"genderTh":"หญิง","genderEn":"Female","bloodGroup":"A+","birthDate":"1978-04-04","phone":"082-606-7070","email":"jiraporn.t@example.com","notes":"","age":"47"}', N'ลูกค้าไม่ประจำ', N'20', CAST('2025-09-01' AS DATE), N'ใช้งาน'),
(N'HN019', N'{"prefixTh":"นาย","prefixEn":"Mr.","firstTh":"พนม","firstEn":"Phanom","lastTh":"อยุธยา","lastEn":"Ayutthaya","nickname":"นม"}', N'{"addressTh":"90 ถ.อู่ทอง ต.ประตูชัย","addressEn":"90 U Thong Rd., Pratu Chai","provinceTh":"พระนครศรีอยุธยา","provinceEn":"Phra Nakhon Si Ayutthaya","postalCode":"13000","districtTh":"พระนครศรีอยุธยา","districtEn":"Phra Nakhon Si Ayutthaya","subdistrictTh":"ประตูชัย","subdistrictEn":"Pratu Chai"}', N'{"genderTh":"ชาย","genderEn":"Male","bloodGroup":"B+","birthDate":"1981-06-16","phone":"083-707-8080","email":"phanom.a@example.com","notes":"","age":"44"}', N'ลูกค้า VIP', N'20', CAST('2026-03-10' AS DATE), N'ไม่ใช้งาน'),
(N'HN020', N'{"prefixTh":"นางสาว","prefixEn":"Ms.","firstTh":"กมลพร","firstEn":"Kamonporn","lastTh":"สุขใจ","lastEn":"Sukjai","nickname":"กมล"}', N'{"addressTh":"18 ถ.เศรษฐกิจ ต.มหาชัย","addressEn":"18 Setthakit Rd., Mahachai","provinceTh":"สมุทรสาคร","provinceEn":"Samut Sakhon","postalCode":"74000","districtTh":"เมืองสมุทรสาคร","districtEn":"Mueang Samut Sakhon","subdistrictTh":"มหาชัย","subdistrictEn":"Mahachai"}', N'{"genderTh":"หญิง","genderEn":"Female","bloodGroup":"O+","birthDate":"1999-02-28","phone":"084-808-9090","email":"kamonporn.s@example.com","notes":"เพิ่งย้ายงาน","age":"26"}', N'ลูกค้าประจำ', N'19', CAST('2025-05-17' AS DATE), N'ใช้งาน');


/* mock_ingredient_master */
/* source: src/mocks/ingredientsFull.js#default */
IF OBJECT_ID(N'dbo.mock_ingredient_master', N'U') IS NULL
BEGIN
CREATE TABLE dbo.mock_ingredient_master (
  ingredient_id INT IDENTITY(1,1) NOT NULL,
  [code] NVARCHAR(50) NULL,
  [nameTh] NVARCHAR(50) NULL,
  [nameEn] NVARCHAR(50) NULL,
  [category] NVARCHAR(50) NULL,
  [unit] NVARCHAR(50) NULL,
  [warehouse] NVARCHAR(50) NULL,
  [stock] INT NULL,
  [status] NVARCHAR(50) NULL,
  [price] DECIMAL(18, 4) NULL,
  [description] NVARCHAR(50) NULL,
  [stockLots] NVARCHAR(MAX) NULL,
  CONSTRAINT PK_mock_ingredient_master PRIMARY KEY CLUSTERED (ingredient_id)
);
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


/* mock_product_master */
/* source: src/mocks/productsFull.js#default */
IF OBJECT_ID(N'dbo.mock_product_master', N'U') IS NULL
BEGIN
CREATE TABLE dbo.mock_product_master (
  product_id INT IDENTITY(1,1) NOT NULL,
  [code] NVARCHAR(50) NULL,
  [nameTh] NVARCHAR(50) NULL,
  [nameEn] NVARCHAR(50) NULL,
  [category] NVARCHAR(50) NULL,
  [unit] NVARCHAR(50) NULL,
  [price] INT NULL,
  [cost] INT NULL,
  [description] NVARCHAR(50) NULL,
  [supplier] NVARCHAR(50) NULL,
  [stock] INT NULL,
  [status] NVARCHAR(50) NULL,
  [updatedAt] DATE NULL,
  [stockLots] NVARCHAR(MAX) NULL,
  CONSTRAINT PK_mock_product_master PRIMARY KEY CLUSTERED (product_id)
);
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


/* mock_purchase_order_master */
/* source: src/mocks/purchaseOrdersFull.js#default */
IF OBJECT_ID(N'dbo.mock_purchase_order_master', N'U') IS NULL
BEGIN
CREATE TABLE dbo.mock_purchase_order_master (
  purchase_order_id INT IDENTITY(1,1) NOT NULL,
  [id] NVARCHAR(50) NULL,
  [poNo] NVARCHAR(50) NULL,
  [orderedAt] DATE NULL,
  [supplier] NVARCHAR(50) NULL,
  [status] NVARCHAR(50) NULL,
  [notes] NVARCHAR(50) NULL,
  [lastReceivedAt] NVARCHAR(50) NULL,
  [items] NVARCHAR(MAX) NULL,
  CONSTRAINT PK_mock_purchase_order_master PRIMARY KEY CLUSTERED (purchase_order_id)
);
END;

DELETE FROM dbo.mock_purchase_order_master;

INSERT INTO dbo.mock_purchase_order_master ([id], [poNo], [orderedAt], [supplier], [status], [notes], [lastReceivedAt], [items])
VALUES
(N'PO-2026-0001', N'PO-2026-0001', CAST('2026-01-08' AS DATE), N'CleanCo', N'ร่าง', N'รออนุมัติ', N'', N'[{"code":"PRD006","nameTh":"ยาชา (ใช้โดยผู้เชี่ยวชาญ)","unit":"หลอด","qty":24,"price":240,"receivedAt":"","receivedLots":[]}]'),
(N'PO-2026-0002', N'PO-2026-0002', CAST('2026-01-22' AS DATE), N'CleanCo', N'สั่งซื้อแล้ว', N'สั่งซื้อแล้ว รอรับสินค้า', N'', N'[{"code":"PRD001","nameTh":"ครีมบำรุงผิวหน้า","unit":"กระปุก","qty":51,"price":520,"receivedAt":"","receivedLots":[]}]'),
(N'PO-2026-0003', N'PO-2026-0003', CAST('2026-01-05' AS DATE), N'CleanCo', N'รับบางส่วน', N'รับสินค้าแล้วบางส่วน', CAST('2026-01-08' AS DATE), N'[{"code":"PRD004","nameTh":"คลีนเซอร์ล้างหน้า","unit":"หลอด","qty":8,"price":320,"receivedQty":1,"receivedAt":"2026-01-08","receivedLots":[{"qty":1,"receivedAt":"2026-01-08","lotNo":"LOT-26-4477","expiryDate":"2027-12-24"}]}]'),
(N'PO-2026-0004', N'PO-2026-0004', CAST('2026-01-03' AS DATE), N'DermPartner', N'รับของแล้ว', N'รับสินค้าเรียบร้อย', CAST('2026-01-08' AS DATE), N'[{"code":"PRD008","nameTh":"สำลีแผ่น","unit":"แพ็ค","qty":29,"price":60,"receivedQty":29,"receivedAt":"2026-01-08","receivedLots":[{"qty":29,"receivedAt":"2026-01-08","lotNo":"LOT-26-0024","expiryDate":"2026-12-02"}]}]'),
(N'PO-2026-0005', N'PO-2026-0005', CAST('2026-01-19' AS DATE), N'CleanCo', N'ร่าง', N'รออนุมัติ', N'', N'[{"code":"PRD001","nameTh":"ครีมบำรุงผิวหน้า","unit":"กระปุก","qty":50,"price":520,"receivedAt":"","receivedLots":[]}]'),
(N'PO-2026-0006', N'PO-2026-0006', CAST('2026-01-23' AS DATE), N'CleanCo', N'สั่งซื้อแล้ว', N'สั่งซื้อแล้ว รอรับสินค้า', N'', N'[{"code":"PRD001","nameTh":"ครีมบำรุงผิวหน้า","unit":"กระปุก","qty":37,"price":520,"receivedAt":"","receivedLots":[]}]'),
(N'PO-2026-0007', N'PO-2026-0007', CAST('2026-01-16' AS DATE), N'HealthPlus', N'รับบางส่วน', N'รับสินค้าแล้วบางส่วน', CAST('2026-01-20' AS DATE), N'[{"code":"PRD009","nameTh":"ครีมลดรอยแผลเป็น","unit":"หลอด","qty":3,"price":410,"receivedQty":2,"receivedAt":"2026-01-20","receivedLots":[{"qty":2,"receivedAt":"2026-01-20","lotNo":"LOT-26-4066","expiryDate":"2027-01-24"}]}]'),
(N'PO-2026-0008', N'PO-2026-0008', CAST('2026-01-28' AS DATE), N'ABSMEDIQ', N'รับของแล้ว', N'รับสินค้าเรียบร้อย', CAST('2026-02-02' AS DATE), N'[{"code":"PRD011","nameTh":"เข็มฉีดยา 3ml","unit":"ชิ้น","qty":13,"price":6,"receivedQty":13,"receivedAt":"2026-02-02","receivedLots":[{"qty":13,"receivedAt":"2026-02-02","lotNo":"LOT-26-7473","expiryDate":"2026-12-27"}]}]'),
(N'PO-2026-0009', N'PO-2026-0009', CAST('2026-01-23' AS DATE), N'MedSupply', N'ร่าง', N'รออนุมัติ', N'', N'[{"code":"PRD012","nameTh":"ผ้าก๊อซ","unit":"แพ็ค","qty":5,"price":32,"receivedAt":"","receivedLots":[]}]'),
(N'PO-2026-0010', N'PO-2026-0010', CAST('2026-01-09' AS DATE), N'HealthPlus', N'สั่งซื้อแล้ว', N'สั่งซื้อแล้ว รอรับสินค้า', N'', N'[{"code":"PRD011","nameTh":"เข็มฉีดยา 3ml","unit":"ชิ้น","qty":42,"price":6,"receivedAt":"","receivedLots":[]}]'),
(N'PO-2026-0011', N'PO-2026-0011', CAST('2026-01-27' AS DATE), N'MedSupply', N'รับบางส่วน', N'รับสินค้าแล้วบางส่วน', CAST('2026-01-30' AS DATE), N'[{"code":"PRD001","nameTh":"ครีมบำรุงผิวหน้า","unit":"กระปุก","qty":53,"price":520,"receivedQty":26,"receivedAt":"2026-01-30","receivedLots":[{"qty":26,"receivedAt":"2026-01-30","lotNo":"LOT-26-6738","expiryDate":"2027-05-02"}]}]'),
(N'PO-2026-0012', N'PO-2026-0012', CAST('2026-01-21' AS DATE), N'ABSMEDIQ', N'รับของแล้ว', N'รับสินค้าเรียบร้อย', CAST('2026-01-22' AS DATE), N'[{"code":"PRD006","nameTh":"ยาชา (ใช้โดยผู้เชี่ยวชาญ)","unit":"หลอด","qty":14,"price":240,"receivedQty":14,"receivedAt":"2026-01-22","receivedLots":[{"qty":14,"receivedAt":"2026-01-22","lotNo":"LOT-26-1218","expiryDate":"2026-10-25"}]}]'),
(N'PO-2026-0013', N'PO-2026-0013', CAST('2026-01-08' AS DATE), N'HealthPlus', N'ร่าง', N'รออนุมัติ', N'', N'[{"code":"PRD004","nameTh":"คลีนเซอร์ล้างหน้า","unit":"หลอด","qty":32,"price":320,"receivedAt":"","receivedLots":[]}]'),
(N'PO-2026-0014', N'PO-2026-0014', CAST('2026-01-02' AS DATE), N'HealthPlus', N'สั่งซื้อแล้ว', N'สั่งซื้อแล้ว รอรับสินค้า', N'', N'[{"code":"PRD010","nameTh":"น้ำเกลือ","unit":"ขวด","qty":16,"price":18,"receivedAt":"","receivedLots":[]}]'),
(N'PO-2026-0015', N'PO-2026-0015', CAST('2026-01-16' AS DATE), N'ABSMEDIQ', N'รับบางส่วน', N'รับสินค้าแล้วบางส่วน', CAST('2026-01-19' AS DATE), N'[{"code":"PRD005","nameTh":"มาสก์หน้าชุ่มชื้น","unit":"แผ่น","qty":5,"price":35,"receivedQty":3,"receivedAt":"2026-01-19","receivedLots":[{"qty":3,"receivedAt":"2026-01-19","lotNo":"LOT-26-8386","expiryDate":"2027-07-08"}]}]'),
(N'PO-2026-0016', N'PO-2026-0016', CAST('2026-01-09' AS DATE), N'HealthPlus', N'รับของแล้ว', N'รับสินค้าเรียบร้อย', CAST('2026-01-14' AS DATE), N'[{"code":"PRD006","nameTh":"ยาชา (ใช้โดยผู้เชี่ยวชาญ)","unit":"หลอด","qty":44,"price":240,"receivedQty":44,"receivedAt":"2026-01-14","receivedLots":[{"qty":44,"receivedAt":"2026-01-14","lotNo":"LOT-26-9164","expiryDate":"2027-08-06"}]}]'),
(N'PO-2026-0017', N'PO-2026-0017', CAST('2026-01-22' AS DATE), N'HealthPlus', N'ร่าง', N'รออนุมัติ', N'', N'[{"code":"PRD009","nameTh":"ครีมลดรอยแผลเป็น","unit":"หลอด","qty":59,"price":410,"receivedAt":"","receivedLots":[]}]'),
(N'PO-2026-0018', N'PO-2026-0018', CAST('2026-01-07' AS DATE), N'CleanCo', N'สั่งซื้อแล้ว', N'สั่งซื้อแล้ว รอรับสินค้า', N'', N'[{"code":"PRD010","nameTh":"น้ำเกลือ","unit":"ขวด","qty":31,"price":18,"receivedAt":"","receivedLots":[]}]'),
(N'PO-2026-0019', N'PO-2026-0019', CAST('2026-01-06' AS DATE), N'HealthPlus', N'รับบางส่วน', N'รับสินค้าแล้วบางส่วน', CAST('2026-01-09' AS DATE), N'[{"code":"PRD010","nameTh":"น้ำเกลือ","unit":"ขวด","qty":8,"price":18,"receivedQty":6,"receivedAt":"2026-01-09","receivedLots":[{"qty":6,"receivedAt":"2026-01-09","lotNo":"LOT-26-8312","expiryDate":"2027-07-20"}]}]'),
(N'PO-2026-0020', N'PO-2026-0020', CAST('2026-01-10' AS DATE), N'DermPartner', N'รับของแล้ว', N'รับสินค้าเรียบร้อย', CAST('2026-01-14' AS DATE), N'[{"code":"PRD012","nameTh":"ผ้าก๊อซ","unit":"แพ็ค","qty":16,"price":32,"receivedQty":16,"receivedAt":"2026-01-14","receivedLots":[{"qty":16,"receivedAt":"2026-01-14","lotNo":"LOT-26-1889","expiryDate":"2026-11-29"}]}]'),
(N'PO-2026-0021', N'PO-2026-0021', CAST('2026-01-22' AS DATE), N'ABSMEDIQ', N'ร่าง', N'รออนุมัติ', N'', N'[{"code":"PRD007","nameTh":"เจลล้างมือแอลกอฮอล์","unit":"ขวด","qty":45,"price":85,"receivedAt":"","receivedLots":[]}]'),
(N'PO-2026-0022', N'PO-2026-0022', CAST('2026-01-11' AS DATE), N'CleanCo', N'สั่งซื้อแล้ว', N'สั่งซื้อแล้ว รอรับสินค้า', N'', N'[{"code":"PRD001","nameTh":"ครีมบำรุงผิวหน้า","unit":"กระปุก","qty":5,"price":520,"receivedAt":"","receivedLots":[]}]'),
(N'PO-2026-0023', N'PO-2026-0023', CAST('2026-01-13' AS DATE), N'MedSupply', N'รับบางส่วน', N'รับสินค้าแล้วบางส่วน', CAST('2026-01-18' AS DATE), N'[{"code":"PRD007","nameTh":"เจลล้างมือแอลกอฮอล์","unit":"ขวด","qty":31,"price":85,"receivedQty":11,"receivedAt":"2026-01-18","receivedLots":[{"qty":11,"receivedAt":"2026-01-18","lotNo":"LOT-26-0905","expiryDate":"2026-09-12"}]}]'),
(N'PO-2026-0024', N'PO-2026-0024', CAST('2026-01-28' AS DATE), N'DermPartner', N'รับของแล้ว', N'รับสินค้าเรียบร้อย', CAST('2026-02-01' AS DATE), N'[{"code":"PRD004","nameTh":"คลีนเซอร์ล้างหน้า","unit":"หลอด","qty":15,"price":320,"receivedQty":15,"receivedAt":"2026-02-01","receivedLots":[{"qty":15,"receivedAt":"2026-02-01","lotNo":"LOT-26-1245","expiryDate":"2026-10-06"}]}]'),
(N'PO-2026-0025', N'PO-2026-0025', CAST('2026-01-18' AS DATE), N'DermPartner', N'ร่าง', N'รออนุมัติ', N'', N'[{"code":"PRD008","nameTh":"สำลีแผ่น","unit":"แพ็ค","qty":18,"price":60,"receivedAt":"","receivedLots":[]}]'),
(N'PO-2026-0026', N'PO-2026-0026', CAST('2026-01-07' AS DATE), N'ABSMEDIQ', N'สั่งซื้อแล้ว', N'สั่งซื้อแล้ว รอรับสินค้า', N'', N'[{"code":"PRD007","nameTh":"เจลล้างมือแอลกอฮอล์","unit":"ขวด","qty":13,"price":85,"receivedAt":"","receivedLots":[]}]'),
(N'PO-2026-0027', N'PO-2026-0027', CAST('2026-01-13' AS DATE), N'CleanCo', N'รับบางส่วน', N'รับสินค้าแล้วบางส่วน', CAST('2026-01-18' AS DATE), N'[{"code":"PRD008","nameTh":"สำลีแผ่น","unit":"แพ็ค","qty":33,"price":60,"receivedQty":20,"receivedAt":"2026-01-18","receivedLots":[{"qty":20,"receivedAt":"2026-01-18","lotNo":"LOT-26-3330","expiryDate":"2027-05-27"}]}]'),
(N'PO-2026-0028', N'PO-2026-0028', CAST('2026-01-28' AS DATE), N'HealthPlus', N'รับของแล้ว', N'รับสินค้าเรียบร้อย', CAST('2026-02-01' AS DATE), N'[{"code":"PRD008","nameTh":"สำลีแผ่น","unit":"แพ็ค","qty":29,"price":60,"receivedQty":29,"receivedAt":"2026-02-01","receivedLots":[{"qty":29,"receivedAt":"2026-02-01","lotNo":"LOT-26-4316","expiryDate":"2027-06-16"}]}]'),
(N'PO-2026-0029', N'PO-2026-0029', CAST('2026-01-15' AS DATE), N'MedSupply', N'ร่าง', N'รออนุมัติ', N'', N'[{"code":"PRD012","nameTh":"ผ้าก๊อซ","unit":"แพ็ค","qty":25,"price":32,"receivedAt":"","receivedLots":[]}]'),
(N'PO-2026-0030', N'PO-2026-0030', CAST('2026-01-02' AS DATE), N'HealthPlus', N'สั่งซื้อแล้ว', N'สั่งซื้อแล้ว รอรับสินค้า', N'', N'[{"code":"PRD009","nameTh":"ครีมลดรอยแผลเป็น","unit":"หลอด","qty":7,"price":410,"receivedAt":"","receivedLots":[]}]'),
(N'PO-2026-0031', N'PO-2026-0031', CAST('2026-01-12' AS DATE), N'MedSupply', N'รับบางส่วน', N'รับสินค้าแล้วบางส่วน', CAST('2026-01-14' AS DATE), N'[{"code":"PRD006","nameTh":"ยาชา (ใช้โดยผู้เชี่ยวชาญ)","unit":"หลอด","qty":59,"price":240,"receivedQty":3,"receivedAt":"2026-01-14","receivedLots":[{"qty":3,"receivedAt":"2026-01-14","lotNo":"LOT-26-4146","expiryDate":"2027-09-19"}]}]'),
(N'PO-2026-0032', N'PO-2026-0032', CAST('2026-01-17' AS DATE), N'CleanCo', N'รับของแล้ว', N'รับสินค้าเรียบร้อย', CAST('2026-01-18' AS DATE), N'[{"code":"PRD008","nameTh":"สำลีแผ่น","unit":"แพ็ค","qty":29,"price":60,"receivedQty":29,"receivedAt":"2026-01-18","receivedLots":[{"qty":29,"receivedAt":"2026-01-18","lotNo":"LOT-26-3918","expiryDate":"2026-11-23"}]}]'),
(N'PO-2026-0033', N'PO-2026-0033', CAST('2026-01-25' AS DATE), N'CleanCo', N'ร่าง', N'รออนุมัติ', N'', N'[{"code":"PRD011","nameTh":"เข็มฉีดยา 3ml","unit":"ชิ้น","qty":5,"price":6,"receivedAt":"","receivedLots":[]}]'),
(N'PO-2026-0034', N'PO-2026-0034', CAST('2026-01-07' AS DATE), N'HealthPlus', N'สั่งซื้อแล้ว', N'สั่งซื้อแล้ว รอรับสินค้า', N'', N'[{"code":"PRD009","nameTh":"ครีมลดรอยแผลเป็น","unit":"หลอด","qty":40,"price":410,"receivedAt":"","receivedLots":[]}]'),
(N'PO-2026-0035', N'PO-2026-0035', CAST('2026-01-17' AS DATE), N'ABSMEDIQ', N'รับบางส่วน', N'รับสินค้าแล้วบางส่วน', CAST('2026-01-22' AS DATE), N'[{"code":"PRD003","nameTh":"กันแดด SPF50+","unit":"หลอด","qty":22,"price":580,"receivedQty":12,"receivedAt":"2026-01-22","receivedLots":[{"qty":12,"receivedAt":"2026-01-22","lotNo":"LOT-26-4675","expiryDate":"2027-09-21"}]}]'),
(N'PO-2026-0036', N'PO-2026-0036', CAST('2026-01-13' AS DATE), N'DermPartner', N'รับของแล้ว', N'รับสินค้าเรียบร้อย', CAST('2026-01-17' AS DATE), N'[{"code":"PRD005","nameTh":"มาสก์หน้าชุ่มชื้น","unit":"แผ่น","qty":56,"price":35,"receivedQty":56,"receivedAt":"2026-01-17","receivedLots":[{"qty":56,"receivedAt":"2026-01-17","lotNo":"LOT-26-3101","expiryDate":"2026-05-31"}]}]'),
(N'PO-2026-0037', N'PO-2026-0037', CAST('2026-01-23' AS DATE), N'ABSMEDIQ', N'ร่าง', N'รออนุมัติ', N'', N'[{"code":"PRD009","nameTh":"ครีมลดรอยแผลเป็น","unit":"หลอด","qty":53,"price":410,"receivedAt":"","receivedLots":[]}]'),
(N'PO-2026-0038', N'PO-2026-0038', CAST('2026-01-11' AS DATE), N'MedSupply', N'สั่งซื้อแล้ว', N'สั่งซื้อแล้ว รอรับสินค้า', N'', N'[{"code":"PRD007","nameTh":"เจลล้างมือแอลกอฮอล์","unit":"ขวด","qty":19,"price":85,"receivedAt":"","receivedLots":[]}]'),
(N'PO-2026-0039', N'PO-2026-0039', CAST('2026-01-06' AS DATE), N'MedSupply', N'รับบางส่วน', N'รับสินค้าแล้วบางส่วน', CAST('2026-01-11' AS DATE), N'[{"code":"PRD005","nameTh":"มาสก์หน้าชุ่มชื้น","unit":"แผ่น","qty":53,"price":35,"receivedQty":43,"receivedAt":"2026-01-11","receivedLots":[{"qty":43,"receivedAt":"2026-01-11","lotNo":"LOT-26-0564","expiryDate":"2026-05-23"}]}]'),
(N'PO-2026-0040', N'PO-2026-0040', CAST('2026-01-11' AS DATE), N'ABSMEDIQ', N'รับของแล้ว', N'รับสินค้าเรียบร้อย', CAST('2026-01-16' AS DATE), N'[{"code":"PRD004","nameTh":"คลีนเซอร์ล้างหน้า","unit":"หลอด","qty":19,"price":320,"receivedQty":19,"receivedAt":"2026-01-16","receivedLots":[{"qty":19,"receivedAt":"2026-01-16","lotNo":"LOT-26-0881","expiryDate":"2027-08-31"}]}]'),
(N'PO-2026-0041', N'PO-2026-0041', CAST('2026-01-21' AS DATE), N'DermPartner', N'ร่าง', N'รออนุมัติ', N'', N'[{"code":"PRD010","nameTh":"น้ำเกลือ","unit":"ขวด","qty":28,"price":18,"receivedAt":"","receivedLots":[]}]'),
(N'PO-2026-0042', N'PO-2026-0042', CAST('2026-01-28' AS DATE), N'MedSupply', N'สั่งซื้อแล้ว', N'สั่งซื้อแล้ว รอรับสินค้า', N'', N'[{"code":"PRD009","nameTh":"ครีมลดรอยแผลเป็น","unit":"หลอด","qty":43,"price":410,"receivedAt":"","receivedLots":[]}]'),
(N'PO-2026-0043', N'PO-2026-0043', CAST('2026-01-06' AS DATE), N'DermPartner', N'รับบางส่วน', N'รับสินค้าแล้วบางส่วน', CAST('2026-01-11' AS DATE), N'[{"code":"PRD005","nameTh":"มาสก์หน้าชุ่มชื้น","unit":"แผ่น","qty":1,"price":35,"receivedQty":0,"receivedAt":"","receivedLots":[]}]'),
(N'PO-2026-0044', N'PO-2026-0044', CAST('2026-01-04' AS DATE), N'ABSMEDIQ', N'รับของแล้ว', N'รับสินค้าเรียบร้อย', CAST('2026-01-08' AS DATE), N'[{"code":"PRD005","nameTh":"มาสก์หน้าชุ่มชื้น","unit":"แผ่น","qty":44,"price":35,"receivedQty":44,"receivedAt":"2026-01-08","receivedLots":[{"qty":44,"receivedAt":"2026-01-08","lotNo":"LOT-26-5870","expiryDate":"2027-12-11"}]}]'),
(N'PO-2026-0045', N'PO-2026-0045', CAST('2026-01-13' AS DATE), N'DermPartner', N'ร่าง', N'รออนุมัติ', N'', N'[{"code":"PRD011","nameTh":"เข็มฉีดยา 3ml","unit":"ชิ้น","qty":37,"price":6,"receivedAt":"","receivedLots":[]}]'),
(N'PO-2026-0046', N'PO-2026-0046', CAST('2026-01-16' AS DATE), N'MedSupply', N'สั่งซื้อแล้ว', N'สั่งซื้อแล้ว รอรับสินค้า', N'', N'[{"code":"PRD003","nameTh":"กันแดด SPF50+","unit":"หลอด","qty":32,"price":580,"receivedAt":"","receivedLots":[]}]'),
(N'PO-2026-0047', N'PO-2026-0047', CAST('2026-01-16' AS DATE), N'MedSupply', N'รับบางส่วน', N'รับสินค้าแล้วบางส่วน', CAST('2026-01-22' AS DATE), N'[{"code":"PRD010","nameTh":"น้ำเกลือ","unit":"ขวด","qty":40,"price":18,"receivedQty":25,"receivedAt":"2026-01-22","receivedLots":[{"qty":25,"receivedAt":"2026-01-22","lotNo":"LOT-26-9996","expiryDate":"2027-02-28"}]}]'),
(N'PO-2026-0048', N'PO-2026-0048', CAST('2026-01-03' AS DATE), N'CleanCo', N'รับของแล้ว', N'รับสินค้าเรียบร้อย', CAST('2026-01-05' AS DATE), N'[{"code":"PRD002","nameTh":"เซรั่มวิตามินซี","unit":"ขวด","qty":48,"price":760,"receivedQty":48,"receivedAt":"2026-01-05","receivedLots":[{"qty":48,"receivedAt":"2026-01-05","lotNo":"LOT-26-9252","expiryDate":"2027-05-04"}]}]'),
(N'PO-2026-0049', N'PO-2026-0049', CAST('2026-01-22' AS DATE), N'ABSMEDIQ', N'ร่าง', N'รออนุมัติ', N'', N'[{"code":"PRD012","nameTh":"ผ้าก๊อซ","unit":"แพ็ค","qty":4,"price":32,"receivedAt":"","receivedLots":[]}]'),
(N'PO-2026-0050', N'PO-2026-0050', CAST('2026-01-16' AS DATE), N'CleanCo', N'สั่งซื้อแล้ว', N'สั่งซื้อแล้ว รอรับสินค้า', N'', N'[{"code":"PRD009","nameTh":"ครีมลดรอยแผลเป็น","unit":"หลอด","qty":12,"price":410,"receivedAt":"","receivedLots":[]}]');


/* mock_service_fee_master */
/* source: src/mocks/serviceFeesFull.js#default */
IF OBJECT_ID(N'dbo.mock_service_fee_master', N'U') IS NULL
BEGIN
CREATE TABLE dbo.mock_service_fee_master (
  service_fee_id INT IDENTITY(1,1) NOT NULL,
  [code] NVARCHAR(50) NULL,
  [name] NVARCHAR(50) NULL,
  [type] NVARCHAR(50) NULL,
  [price] INT NULL,
  CONSTRAINT PK_mock_service_fee_master PRIMARY KEY CLUSTERED (service_fee_id)
);
END;

DELETE FROM dbo.mock_service_fee_master;

INSERT INTO dbo.mock_service_fee_master ([code], [name], [type], [price])
VALUES
(N'SV001', N'คอร์สออกกำลังกาย 10 ครั้ง', N'ครอสออกกำลังการ', 3500),
(N'SV002', N'คอร์สออกกำลังกาย 20 ครั้ง', N'ครอสออกกำลังการ', 6500),
(N'SV003', N'คอร์สออกกำลังกาย 30 ครั้ง', N'ครอสออกกำลังการ', 9000),
(N'SV004', N'คอร์ส Personal Training (1 ครั้ง)', N'ครอสออกกำลังการ', 900),
(N'SV005', N'คอร์สออกกำลังกาย (รายเดือน)', N'ครอสออกกำลังการ', 2500),
(N'SV006', N'ทำแผล/เปลี่ยนผ้าพันแผล', N'ค่าหัถการ', 300),
(N'SV007', N'ฉีดยาเข้ากล้าม (IM)', N'ค่าหัถการ', 250),
(N'SV008', N'ฉีดยาเข้าหลอดเลือด (IV)', N'ค่าหัถการ', 350),
(N'SV009', N'ทำหัตถการเล็ก (Basic)', N'ค่าหัถการ', 1200),
(N'SV010', N'เย็บแผล (ไม่รวมค่ายา/อุปกรณ์)', N'ค่าหัถการ', 1500),
(N'SV011', N'ตรวจเลือด CBC', N'การบริการแลป', 350),
(N'SV012', N'ตรวจน้ำตาล (FBS)', N'การบริการแลป', 250),
(N'SV013', N'ตรวจไขมัน (Lipid Profile)', N'การบริการแลป', 650),
(N'SV014', N'ตรวจการทำงานตับ (LFT)', N'การบริการแลป', 700),
(N'SV015', N'ตรวจการทำงานไต (BUN/Cr)', N'การบริการแลป', 550),
(N'SV016', N'วิตามินซี (Vitamin C) 1,000 mg', N'ค่าบริการให้วิตามิน', 890),
(N'SV017', N'วิตามินบีรวม (B-Complex)', N'ค่าบริการให้วิตามิน', 790),
(N'SV018', N'วิตามินดี (Vitamin D) Booster', N'ค่าบริการให้วิตามิน', 990),
(N'SV019', N'NAD+ Drip (Starter)', N'ค่าบริการให้วิตามิน', 2900),
(N'SV020', N'Immune Boost Drip', N'ค่าบริการให้วิตามิน', 2500);


/* mock_supplier_master */
/* source: src/mocks/suppliersFull.js#default */
IF OBJECT_ID(N'dbo.mock_supplier_master', N'U') IS NULL
BEGIN
CREATE TABLE dbo.mock_supplier_master (
  supplier_id INT IDENTITY(1,1) NOT NULL,
  [id] NVARCHAR(50) NULL,
  [name] NVARCHAR(50) NULL,
  [address] NVARCHAR(100) NULL,
  [taxId] NVARCHAR(50) NULL,
  CONSTRAINT PK_mock_supplier_master PRIMARY KEY CLUSTERED (supplier_id)
);
END;

DELETE FROM dbo.mock_supplier_master;

INSERT INTO dbo.mock_supplier_master ([id], [name], [address], [taxId])
VALUES
(N'SUP001', N'ABSMEDIQ', N'99/1 ถ.สุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพมหานคร 10110', N'0105551234567'),
(N'SUP002', N'MedSupply', N'88/12 ถ.พหลโยธิน แขวงจอมพล เขตจตุจักร กรุงเทพมหานคร 10900', N'0105552345678'),
(N'SUP003', N'CleanCo', N'12/3 ถ.รามคำแหง แขวงหัวหมาก เขตบางกะปิ กรุงเทพมหานคร 10240', N'0105553456789'),
(N'SUP004', N'VetPlus จำกัด', N'45/6 ถ.มิตรภาพ ต.ในเมือง อ.เมืองนครราชสีมา นครราชสีมา 30000', N'0305554567890'),
(N'SUP005', N'PharmaCare', N'120/9 ถ.เชียงใหม่-ลำพูน ต.วัดเกต อ.เมืองเชียงใหม่ เชียงใหม่ 50000', N'0505555678901'),
(N'SUP006', N'BioHealth Trading', N'77/2 ถ.นิมมานเหมินท์ ต.สุเทพ อ.เมืองเชียงใหม่ เชียงใหม่ 50200', N'0505556789012'),
(N'SUP007', N'Siam Medical Pack', N'9/9 ถ.เพชรบุรี แขวงมักกะสัน เขตราชเทวี กรุงเทพมหานคร 10400', N'0105557890123'),
(N'SUP008', N'GreenVet Supplies', N'15/8 ถ.ศรีนครินทร์ แขวงสวนหลวง เขตสวนหลวง กรุงเทพมหานคร 10250', N'0105558901234'),
(N'SUP009', N'Central Lab Service', N'200/1 ถ.พระราม 2 แขวงแสมดำ เขตบางขุนเทียน กรุงเทพมหานคร 10150', N'0105559012345'),
(N'SUP010', N'Northern Distributors', N'33/4 ถ.เจ้าฟ้า ต.วิชิต อ.เมืองภูเก็ต ภูเก็ต 83000', N'0835550123456');


/* mock_trainer_operator_master */
/* source: src/mocks/trainersOperatorsFull.js#default */
IF OBJECT_ID(N'dbo.mock_trainer_operator_master', N'U') IS NULL
BEGIN
CREATE TABLE dbo.mock_trainer_operator_master (
  trainer_operator_id INT IDENTITY(1,1) NOT NULL,
  [code] NVARCHAR(50) NULL,
  [name] NVARCHAR(50) NULL,
  [role] NVARCHAR(50) NULL,
  CONSTRAINT PK_mock_trainer_operator_master PRIMARY KEY CLUSTERED (trainer_operator_id)
);
END;

DELETE FROM dbo.mock_trainer_operator_master;

INSERT INTO dbo.mock_trainer_operator_master ([code], [name], [role])
VALUES
(N'TO001', N'คุณกิตติศักดิ์ วัฒนาพงศ์', N'ผู้ฝึกสอน'),
(N'TO002', N'คุณพิมพ์ชนก ศรีประเสริฐ', N'ผู้ฝึกสอน'),
(N'TO003', N'คุณณัฐพงษ์ จันทร์เพ็ญ', N'ผู้ดำเนินการ'),
(N'TO004', N'คุณชลธิชา นิ่มนวล', N'ผู้ดำเนินการ'),
(N'TO005', N'คุณธนภพ ตั้งใจดี', N'ผู้ฝึกสอน');
