/*
  Auto-generated SQL create+seed from src/mocks/*.js
  Generated at: 2026-03-10T17:38:43.171Z
  SQL dialect: Microsoft SQL Server
*/

SET NOCOUNT ON;

/* mock_ingredient_master */
/* source: src/mocks/ingredientsFull.js#default */
IF OBJECT_ID(N'dbo.mock_ingredient_master', N'U') IS NULL
BEGIN
CREATE TABLE dbo.mock_ingredient_master (
  ingredient_id INT IDENTITY(1,1) NOT NULL,
  [code] NVARCHAR(50) NULL,
  [nameTh] NVARCHAR(50) NULL,
  [nameEn] NVARCHAR(50) NULL,
  [category] NVARCHAR(50) NULL,
  [unit] NVARCHAR(50) NULL,
  [warehouse] NVARCHAR(50) NULL,
  [stock] INT NULL,
  [status] NVARCHAR(50) NULL,
  [price] DECIMAL(18, 4) NULL,
  [description] NVARCHAR(50) NULL,
  [stockLots] NVARCHAR(MAX) NULL,
  CONSTRAINT PK_mock_ingredient_master PRIMARY KEY CLUSTERED (ingredient_id)
);
END;

