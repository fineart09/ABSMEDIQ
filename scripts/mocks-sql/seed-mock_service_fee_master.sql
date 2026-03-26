/*
  Auto-generated SQL create+seed from src/mocks/*.js
  Generated at: 2026-03-10T17:38:43.171Z
  SQL dialect: Microsoft SQL Server
*/

SET NOCOUNT ON;

/* mock_service_fee_master */
/* source: src/mocks/serviceFeesFull.js#default */
IF OBJECT_ID(N'dbo.mock_service_fee_master', N'U') IS NULL
BEGIN
  RAISERROR('Table dbo.mock_service_fee_master does not exist. Run create script first.', 16, 1);
  RETURN;
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

