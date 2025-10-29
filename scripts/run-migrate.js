#!/usr/bin/env node
const { Pool } = require('pg')

function buildDefaultConnectionString() {
  const user = process.env.PGUSER || process.env.DB_USER || 'user'
  const password = process.env.PGPASSWORD || process.env.DB_PASSWORD || 'password'
  const host = process.env.PGHOST || process.env.DB_HOST || 'localhost'
  const port = process.env.PGPORT || process.env.DB_PORT || '5432'
  const database = process.env.PGDATABASE || process.env.DB_NAME || 'mydatabase'
  return `postgresql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${database}`
}

const connectionString = process.env.DATABASE_URL || buildDefaultConnectionString()

const pool = new Pool({ connectionString })

async function run() {
  console.log('🔄 Running migration via scripts/run-migrate.js')
  const client = await pool.connect()
  try {
    await client.query("ALTER TABLE services ADD COLUMN IF NOT EXISTS image_url VARCHAR(500)")
    console.log('✅ Ensured image_url column exists')

    const columnCheck = await client.query(`SELECT column_name FROM information_schema.columns WHERE table_name = 'services' AND column_name = 'title_en'`)
    if (columnCheck.rows.length > 0) {
      await client.query('ALTER TABLE services RENAME COLUMN title_en TO name_en')
      await client.query('ALTER TABLE services RENAME COLUMN title_ar TO name_ar')
      await client.query('ALTER TABLE services RENAME COLUMN title_ro TO name_ro')
      console.log('✅ Renamed title_* columns to name_*')
    } else {
      console.log('ℹ️ No title_* columns to rename')
    }

    const updates = [
      ["/uploads/sea-freight.jpg","Sea Freight"],
      ["/uploads/air-freight.jpg","Air Freight"],
      ["/uploads/land-transport.jpg","Land Transport"],
      ["/uploads/customs-clearance.jpg","Customs Clearance"],
      ["/uploads/import-export.jpg","Import & Export"],
      ["/uploads/warehousing.jpg","Warehousing & Distribution"],
    ]

    for (const [url, name] of updates) {
      const res = await client.query('UPDATE services SET image_url = $1 WHERE name_en = $2', [url, name])
      console.log(`Updated ${res.rowCount} row(s) for ${name}`)
    }

    const tableCols = await client.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'services' ORDER BY ordinal_position`)
    console.log('📋 services table columns:')
    for (const r of tableCols.rows) {
      console.log(` - ${r.column_name}: ${r.data_type}`)
    }

    const sample = await client.query(`SELECT id, name_en, image_url FROM services ORDER BY created_at DESC LIMIT 10`)
    console.log('🔍 Sample services (id, name_en, image_url):')
    for (const r of sample.rows) {
      console.log(` - ${r.id} | ${r.name_en} | ${r.image_url}`)
    }

    console.log('✅ Migration script completed')
  } catch (err) {
    console.error('❌ Migration failed:', err)
    process.exitCode = 2
  } finally {
    client.release()
    await pool.end()
  }
}

run()
