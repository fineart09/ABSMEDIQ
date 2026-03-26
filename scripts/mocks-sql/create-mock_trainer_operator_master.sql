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
CREATE TABLE dbo.mock_trainer_operator_master (
  trainer_operator_id INT IDENTITY(1,1) NOT NULL,
  [code] NVARCHAR(50) NULL,
  [name] NVARCHAR(50) NULL,
  [role] NVARCHAR(50) NULL,
  CONSTRAINT PK_mock_trainer_operator_master PRIMARY KEY CLUSTERED (trainer_operator_id)
);
END;

