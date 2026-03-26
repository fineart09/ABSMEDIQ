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
  RAISERROR('Table dbo.mock_supplier_master does not exist. Run create script first.', 16, 1);
  RETURN;
END;

DELETE FROM dbo.mock_supplier_master;

INSERT INTO dbo.mock_supplier_master ([id], [name], [address], [taxId])
VALUES
(N'SUP001', N'ABSMEDIQ', N'99/1 ถ.สุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพมหานคร 10110', N'0105551234567'),
(N'SUP002', N'MedSupply', N'88/12 ถ.พหลโยธิน แขวงจอมพล เขตจตุจักร กรุงเทพมหานคร 10900', N'0105552345678'),
(N'SUP003', N'CleanCo', N'12/3 ถ.รามคำแหง แขวงหัวหมาก เขตบางกะปิ กรุงเทพมหานคร 10240', N'0105553456789'),
(N'SUP004', N'VetPlus จำกัด', N'45/6 ถ.มิตรภาพ ต.ในเมือง อ.เมืองนครราชสีมา นครราชสีมา 30000', N'0305554567890'),
(N'SUP005', N'PharmaCare', N'120/9 ถ.เชียงใหม่-ลำพูน ต.วัดเกต อ.เมืองเชียงใหม่ เชียงใหม่ 50000', N'0505555678901'),
(N'SUP006', N'BioHealth Trading', N'77/2 ถ.นิมมานเหมินท์ ต.สุเทพ อ.เมืองเชียงใหม่ เชียงใหม่ 50200', N'0505556789012'),
(N'SUP007', N'Siam Medical Pack', N'9/9 ถ.เพชรบุรี แขวงมักกะสัน เขตราชเทวี กรุงเทพมหานคร 10400', N'0105557890123'),
(N'SUP008', N'GreenVet Supplies', N'15/8 ถ.ศรีนครินทร์ แขวงสวนหลวง เขตสวนหลวง กรุงเทพมหานคร 10250', N'0105558901234'),
(N'SUP009', N'Central Lab Service', N'200/1 ถ.พระราม 2 แขวงแสมดำ เขตบางขุนเทียน กรุงเทพมหานคร 10150', N'0105559012345'),
(N'SUP010', N'Northern Distributors', N'33/4 ถ.เจ้าฟ้า ต.วิชิต อ.เมืองภูเก็ต ภูเก็ต 83000', N'0835550123456');

