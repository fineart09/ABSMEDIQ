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

