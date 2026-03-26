/*
  Auto-generated SQL create+seed from src/mocks/*.js
  Generated at: 2026-03-10T17:38:43.171Z
  SQL dialect: Microsoft SQL Server
*/

SET NOCOUNT ON;

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

