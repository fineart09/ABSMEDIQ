/*
  Auto-generated SQL create+seed from src/mocks/*.js
  Generated at: 2026-03-10T17:38:43.171Z
  SQL dialect: Microsoft SQL Server
*/

SET NOCOUNT ON;

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

