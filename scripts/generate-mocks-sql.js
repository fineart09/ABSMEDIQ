import fs from 'node:fs';
import path from 'node:path';

import APPOINTMENTS_STAGE, {
  APPOINTMENT_TOPICS_STAGE,
} from '../src/mocks/appointmentsStage.js';
import CONSUMABLES_FULL from '../src/mocks/consumablesFull.js';
import ENRICHED_CUSTOMERS from '../src/mocks/customersFull.js';
import INGREDIENTS_FULL from '../src/mocks/ingredientsFull.js';
import ENRICHED_PRODUCTS from '../src/mocks/productsFull.js';
import PURCHASE_ORDERS_FULL from '../src/mocks/purchaseOrdersFull.js';
import SERVICE_FEES_FULL from '../src/mocks/serviceFeesFull.js';
import SUPPLIERS_FULL from '../src/mocks/suppliersFull.js';
import TRAINERS_OPERATORS_FULL from '../src/mocks/trainersOperatorsFull.js';

const DATASETS = [
  {
    source: 'src/mocks/appointmentsStage.js#APPOINTMENT_TOPICS_STAGE',
    table: 'mock_appointment_topic_master',
    identity: 'topic_id',
    rows: APPOINTMENT_TOPICS_STAGE,
  },
  {
    source: 'src/mocks/appointmentsStage.js#default',
    table: 'mock_appointment_stage',
    identity: 'appointment_id',
    rows: APPOINTMENTS_STAGE,
  },
  {
    source: 'src/mocks/consumablesFull.js#default',
    table: 'mock_consumable_master',
    identity: 'consumable_id',
    rows: CONSUMABLES_FULL,
  },
  {
    source: 'src/mocks/customersFull.js#default',
    table: 'mock_customer_master',
    identity: 'customer_id',
    rows: ENRICHED_CUSTOMERS,
  },
  {
    source: 'src/mocks/ingredientsFull.js#default',
    table: 'mock_ingredient_master',
    identity: 'ingredient_id',
    rows: INGREDIENTS_FULL,
  },
  {
    source: 'src/mocks/productsFull.js#default',
    table: 'mock_product_master',
    identity: 'product_id',
    rows: ENRICHED_PRODUCTS,
  },
  {
    source: 'src/mocks/purchaseOrdersFull.js#default',
    table: 'mock_purchase_order_master',
    identity: 'purchase_order_id',
    rows: PURCHASE_ORDERS_FULL,
  },
  {
    source: 'src/mocks/serviceFeesFull.js#default',
    table: 'mock_service_fee_master',
    identity: 'service_fee_id',
    rows: SERVICE_FEES_FULL,
  },
  {
    source: 'src/mocks/suppliersFull.js#default',
    table: 'mock_supplier_master',
    identity: 'supplier_id',
    rows: SUPPLIERS_FULL,
  },
  {
    source: 'src/mocks/trainersOperatorsFull.js#default',
    table: 'mock_trainer_operator_master',
    identity: 'trainer_operator_id',
    rows: TRAINERS_OPERATORS_FULL,
  },
];

const isIsoDate = (value) =>
  typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);

const escapeSqlString = (value) => String(value).replace(/'/g, "''");

function toSqlLiteral(value) {
  if (value === null || value === undefined) return 'NULL';
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) return 'NULL';
    return String(value);
  }
  if (typeof value === 'boolean') return value ? '1' : '0';
  if (Array.isArray(value) || (value && typeof value === 'object')) {
    return `N'${escapeSqlString(JSON.stringify(value))}'`;
  }
  if (isIsoDate(value)) return `CAST('${value}' AS DATE)`;
  return `N'${escapeSqlString(value)}'`;
}

function inferColumnType(values) {
  const nonNull = values.filter((v) => v !== null && v !== undefined);
  if (nonNull.length === 0) return 'NVARCHAR(255) NULL';

  if (nonNull.some((v) => Array.isArray(v) || typeof v === 'object')) {
    return 'NVARCHAR(MAX) NULL';
  }

  if (nonNull.every((v) => typeof v === 'boolean')) return 'BIT NULL';

  if (nonNull.every((v) => typeof v === 'number')) {
    const allInt = nonNull.every((v) => Number.isInteger(v));
    return allInt ? 'INT NULL' : 'DECIMAL(18, 4) NULL';
  }

  if (nonNull.every((v) => isIsoDate(v))) return 'DATE NULL';

  const maxLen = Math.max(...nonNull.map((v) => String(v).length));
  if (maxLen <= 50) return 'NVARCHAR(50) NULL';
  if (maxLen <= 100) return 'NVARCHAR(100) NULL';
  if (maxLen <= 255) return 'NVARCHAR(255) NULL';
  if (maxLen <= 500) return 'NVARCHAR(500) NULL';
  return 'NVARCHAR(MAX) NULL';
}

function buildScriptForDataset(dataset) {
  const rows = Array.isArray(dataset.rows) ? dataset.rows : [];
  const keySet = new Set();
  for (const row of rows) {
    if (row && typeof row === 'object' && !Array.isArray(row)) {
      for (const key of Object.keys(row)) keySet.add(key);
    }
  }

  const columns = Array.from(keySet);
  const inferred = columns.map((col) => {
    const values = rows.map((row) => (row ? row[col] : null));
    return { name: col, type: inferColumnType(values) };
  });

  const createColumns = [
    `  ${dataset.identity} INT IDENTITY(1,1) NOT NULL`,
    ...inferred.map((c) => `  [${c.name}] ${c.type}`),
    `  CONSTRAINT PK_${dataset.table} PRIMARY KEY CLUSTERED (${dataset.identity})`,
  ];

  const create = `IF OBJECT_ID(N'dbo.${dataset.table}', N'U') IS NULL\nBEGIN\nCREATE TABLE dbo.${dataset.table} (\n${createColumns.join(',\n')}\n);\nEND;\n`;

  const deleteSql = `DELETE FROM dbo.${dataset.table};\n`;

  let insertSql = '';
  if (rows.length > 0 && columns.length > 0) {
    const colSql = columns.map((c) => `[${c}]`).join(', ');
    const valuesSql = rows
      .map((row) => {
        const rowValues = columns.map((c) => toSqlLiteral(row?.[c]));
        return `(${rowValues.join(', ')})`;
      })
      .join(',\n');

    insertSql = `INSERT INTO dbo.${dataset.table} (${colSql})\nVALUES\n${valuesSql};\n`;
  }

  const seedGuard = `IF OBJECT_ID(N'dbo.${dataset.table}', N'U') IS NULL\nBEGIN\n  RAISERROR('Table dbo.${dataset.table} does not exist. Run create script first.', 16, 1);\n  RETURN;\nEND;\n`;

  const merged = [
    `/* ${dataset.table} */`,
    `/* source: ${dataset.source} */`,
    create,
    deleteSql,
    insertSql,
  ].join('\n');

  const createOnly = [
    `/* ${dataset.table} */`,
    `/* source: ${dataset.source} */`,
    create,
  ].join('\n');

  const seedOnly = [
    `/* ${dataset.table} */`,
    `/* source: ${dataset.source} */`,
    seedGuard,
    deleteSql,
    insertSql,
  ].join('\n');

  return {
    merged,
    createOnly,
    seedOnly,
  };
}

const header = `/*\n  Auto-generated SQL create+seed from src/mocks/*.js\n  Generated at: ${new Date().toISOString()}\n  SQL dialect: Microsoft SQL Server\n*/\n\nSET NOCOUNT ON;\n`;

const built = DATASETS.map(buildScriptForDataset);
const body = built.map((x) => x.merged).join('\n\n');
const sqlText = `${header}\n${body}`;

const outPath = path.resolve('scripts/create-seed-all-mocks.sql');
fs.writeFileSync(outPath, sqlText, 'utf8');

const splitDir = path.resolve('scripts/mocks-sql');
if (!fs.existsSync(splitDir)) {
  fs.mkdirSync(splitDir, { recursive: true });
}

DATASETS.forEach((dataset, index) => {
  const createPath = path.join(splitDir, `create-${dataset.table}.sql`);
  const seedPath = path.join(splitDir, `seed-${dataset.table}.sql`);

  fs.writeFileSync(
    createPath,
    `${header}\n${built[index].createOnly}\n`,
    'utf8'
  );
  fs.writeFileSync(seedPath, `${header}\n${built[index].seedOnly}\n`, 'utf8');
});

console.log(`Generated: ${outPath}`);
console.log(`Generated split files in: ${splitDir}`);
