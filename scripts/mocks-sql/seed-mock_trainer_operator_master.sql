/*
  Auto-generated SQL create+seed from src/mocks/*.js
  Generated at: 2026-03-10T17:38:43.171Z
  SQL dialect: Microsoft SQL Server
*/

SET NOCOUNT ON;

/* mock_trainer_operator_master */
/* source: src/mocks/trainersOperatorsFull.js#default */
IF OBJECT_ID(N'dbo.mock_trainer_operator_master', N'U') IS NULL
BEGIN
  RAISERROR('Table dbo.mock_trainer_operator_master does not exist. Run create script first.', 16, 1);
  RETURN;
END;

DELETE FROM dbo.mock_trainer_operator_master;

INSERT INTO dbo.mock_trainer_operator_master ([code], [name], [role])
VALUES
(N'TO001', N'คุณกิตติศักดิ์ วัฒนาพงศ์', N'ผู้ฝึกสอน'),
(N'TO002', N'คุณพิมพ์ชนก ศรีประเสริฐ', N'ผู้ฝึกสอน'),
(N'TO003', N'คุณณัฐพงษ์ จันทร์เพ็ญ', N'ผู้ดำเนินการ'),
(N'TO004', N'คุณชลธิชา นิ่มนวล', N'ผู้ดำเนินการ'),
(N'TO005', N'คุณธนภพ ตั้งใจดี', N'ผู้ฝึกสอน');

