/*
  Auto-generated SQL create+seed from src/mocks/*.js
  Generated at: 2026-03-10T17:38:43.171Z
  SQL dialect: Microsoft SQL Server
*/

SET NOCOUNT ON;

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

