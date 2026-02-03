import express from 'express';
import cors from 'cors';
import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

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

let poolPromise;
const getPool = async () => {
  if (!poolPromise) {
    poolPromise = sql.connect(sqlConfig);
  }
  return poolPromise;
};

app.get('/api/health', (req, res) => {
  res.json({ ok: true, server: 'absmediq-api' });
});

app.post('/api/customers', async (req, res) => {
  try {
    const data = req.body || {};
    const name = data.name || {};
    const address = data.address || {};
    const details = data.details || {};

    const prefixTh = String(name.prefixTh || '').trim();
    const firstTh = String(name.firstTh || '').trim();

    if (!prefixTh || !firstTh) {
      return res.status(400).json({
        error: 'กรุณาระบุคำนำหน้าและชื่อ (prefixTh, firstTh)',
      });
    }

    const pool = await getPool();
    const request = pool.request();

    request.input('HN', sql.NVarChar(50), data.hn || null);
    request.input('Status', sql.NVarChar(20), data.status || 'ใช้งาน');
    request.input('PhotoUrl', sql.NVarChar(500), data.photoUrl || null);
    request.input('PrefixTh', sql.NVarChar(50), prefixTh);
    request.input('FirstNameTh', sql.NVarChar(100), firstTh);
    request.input('LastNameTh', sql.NVarChar(100), name.lastTh || null);
    request.input('Nickname', sql.NVarChar(50), name.nickname || null);
    request.input('AddressTh', sql.NVarChar(255), address.addressTh || null);
    request.input('ProvinceTh', sql.NVarChar(100), address.provinceTh || null);
    request.input('DistrictTh', sql.NVarChar(100), address.districtTh || null);
    request.input(
      'SubdistrictTh',
      sql.NVarChar(100),
      address.subdistrictTh || null
    );
    request.input('PostalCode', sql.NVarChar(10), address.postalCode || null);
    request.input('GenderTh', sql.NVarChar(20), details.genderTh || null);
    request.input('BloodGroup', sql.NVarChar(10), details.bloodGroup || null);

    const ageNum = Number(details.age);
    request.input('Age', sql.Int, Number.isFinite(ageNum) ? ageNum : null);

    request.input(
      'BirthDate',
      sql.Date,
      details.birthDate ? new Date(details.birthDate) : null
    );
    request.input('Phone', sql.NVarChar(30), details.phone || null);
    request.input('Email', sql.NVarChar(100), details.email || null);
    request.input('Notes', sql.NVarChar(500), details.notes || null);

    const result = await request.query(`
      INSERT INTO dbo.Customers (
        HN, Status, PhotoUrl,
        PrefixTh, FirstNameTh, LastNameTh, Nickname,
        AddressTh, ProvinceTh, DistrictTh, SubdistrictTh, PostalCode,
        GenderTh, BloodGroup, Age, BirthDate, Phone, Email, Notes
      )
      OUTPUT INSERTED.CustomerId
      VALUES (
        @HN, @Status, @PhotoUrl,
        @PrefixTh, @FirstNameTh, @LastNameTh, @Nickname,
        @AddressTh, @ProvinceTh, @DistrictTh, @SubdistrictTh, @PostalCode,
        @GenderTh, @BloodGroup, @Age, @BirthDate, @Phone, @Email, @Notes
      );
    `);

    const customerId = result?.recordset?.[0]?.CustomerId ?? null;
    return res.status(201).json({ customerId });
  } catch (error) {
    console.error('Create customer failed:', error);
    return res.status(500).json({ error: 'บันทึกลูกค้าไม่สำเร็จ' });
  }
});

const port = Number(process.env.API_PORT || 4000);
app.listen(port, () => {
  console.log(`API running on port ${port}`);
});
