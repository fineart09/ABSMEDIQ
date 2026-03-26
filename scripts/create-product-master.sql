/*
  product_master (SQL Server)
  Source: src/mocks/productsFull.js -> MOCK_PRODUCTS_FULL
*/

IF OBJECT_ID(N'dbo.product_master', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.product_master (
    product_id INT IDENTITY(1,1) NOT NULL,

    code NVARCHAR(50) NOT NULL,
    name_th NVARCHAR(200) NOT NULL,
    name_en NVARCHAR(200) NULL,
    category NVARCHAR(100) NULL,
    unit NVARCHAR(50) NULL,

    price DECIMAL(18, 2) NOT NULL,
    cost  DECIMAL(18, 2) NOT NULL,

    description NVARCHAR(500) NULL,
    supplier NVARCHAR(100) NULL,

    CONSTRAINT PK_product_master PRIMARY KEY CLUSTERED (product_id),
    CONSTRAINT UQ_product_master_code UNIQUE (code)
  );
END;
