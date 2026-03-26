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
CREATE TABLE dbo.mock_service_fee_master (
  service_fee_id INT IDENTITY(1,1) NOT NULL,
  [code] NVARCHAR(50) NULL,
  [name] NVARCHAR(50) NULL,
  [type] NVARCHAR(50) NULL,
  [price] INT NULL,
  CONSTRAINT PK_mock_service_fee_master PRIMARY KEY CLUSTERED (service_fee_id)
);
END;

