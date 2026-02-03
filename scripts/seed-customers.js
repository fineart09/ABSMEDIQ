import sql from 'mssql';
import dotenv from 'dotenv';
import { MOCK_CUSTOMERS_FULL } from '../src/mocks/customersFull.js';

dotenv.config();

const sqlConfig = {
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  server: process.env.SQL_SERVER,
  database: process.env.SQL_DATABASE,
  port: process.env.SQL_PORT ? Number(process.env.SQL_PORT) : undefined,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

const toIntOrNull = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
};

const toDateOrNull = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const upsertCustomer = async (pool, customer) => {
  const name = customer?.name || {};
  const address = customer?.address || {};
  const details = customer?.details || {};

  const request = pool.request();

  request.input('HN', sql.NVarChar(50), customer?.hn || null);
  request.input('Status', sql.NVarChar(20), customer?.status || 'ใช้งาน');
  request.input('PhotoUrl', sql.NVarChar(500), customer?.photoUrl || null);
  request.input('PrefixTh', sql.NVarChar(50), name?.prefixTh || null);
  request.input('FirstNameTh', sql.NVarChar(100), name?.firstTh || null);
  request.input('LastNameTh', sql.NVarChar(100), name?.lastTh || null);
  request.input('Nickname', sql.NVarChar(50), name?.nickname || null);
  request.input('AddressTh', sql.NVarChar(255), address?.addressTh || null);
  request.input('ProvinceTh', sql.NVarChar(100), address?.provinceTh || null);
  request.input('DistrictTh', sql.NVarChar(100), address?.districtTh || null);
  request.input(
    'SubdistrictTh',
    sql.NVarChar(100),
    address?.subdistrictTh || null
  );
  request.input('PostalCode', sql.NVarChar(10), address?.postalCode || null);
  request.input('GenderTh', sql.NVarChar(20), details?.genderTh || null);
  request.input('BloodGroup', sql.NVarChar(10), details?.bloodGroup || null);
  request.input('Age', sql.Int, toIntOrNull(details?.age));
  request.input('BirthDate', sql.Date, toDateOrNull(details?.birthDate));
  request.input('Phone', sql.NVarChar(30), details?.phone || null);
  request.input('Email', sql.NVarChar(100), details?.email || null);
  request.input('Notes', sql.NVarChar(500), details?.notes || null);

  await request.query(`
    IF EXISTS (SELECT 1 FROM dbo.Customers WHERE HN = @HN)
    BEGIN
      UPDATE dbo.Customers
      SET
        Status = @Status,
        PhotoUrl = @PhotoUrl,
        PrefixTh = @PrefixTh,
        FirstNameTh = @FirstNameTh,
        LastNameTh = @LastNameTh,
        Nickname = @Nickname,
        AddressTh = @AddressTh,
        ProvinceTh = @ProvinceTh,
        DistrictTh = @DistrictTh,
        SubdistrictTh = @SubdistrictTh,
        PostalCode = @PostalCode,
        GenderTh = @GenderTh,
        BloodGroup = @BloodGroup,
        Age = @Age,
        BirthDate = @BirthDate,
        Phone = @Phone,
        Email = @Email,
        Notes = @Notes,
        UpdatedAt = SYSDATETIME()
      WHERE HN = @HN;
    END
    ELSE
    BEGIN
      INSERT INTO dbo.Customers (
        HN, Status, PhotoUrl,
        PrefixTh, FirstNameTh, LastNameTh, Nickname,
        AddressTh, ProvinceTh, DistrictTh, SubdistrictTh, PostalCode,
        GenderTh, BloodGroup, Age, BirthDate, Phone, Email, Notes
      )
      VALUES (
        @HN, @Status, @PhotoUrl,
        @PrefixTh, @FirstNameTh, @LastNameTh, @Nickname,
        @AddressTh, @ProvinceTh, @DistrictTh, @SubdistrictTh, @PostalCode,
        @GenderTh, @BloodGroup, @Age, @BirthDate, @Phone, @Email, @Notes
      );
    END
  `);
};

const seed = async () => {
  const pool = await sql.connect(sqlConfig);
  const customers = Array.isArray(MOCK_CUSTOMERS_FULL)
    ? MOCK_CUSTOMERS_FULL
    : [];

  let count = 0;
  for (const customer of customers) {
    if (!customer?.hn) continue;
    await upsertCustomer(pool, customer);
    count += 1;
  }

  await pool.close();
  console.log(`Seeded customers: ${count}`);
};

seed().catch((error) => {
  console.error('Seed customers failed:', error);
  process.exit(1);
});
