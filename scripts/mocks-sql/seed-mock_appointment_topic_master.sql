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
  RAISERROR('Table dbo.mock_appointment_topic_master does not exist. Run create script first.', 16, 1);
  RETURN;
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

