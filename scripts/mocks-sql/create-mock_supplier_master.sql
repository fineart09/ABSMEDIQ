/*
  Auto-generated SQL create+seed from src/mocks/*.js
  Generated at: 2026-03-10T17:38:43.171Z
  SQL dialect: Microsoft SQL Server
*/

SET NOCOUNT ON;

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

