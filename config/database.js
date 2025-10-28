const { Pool } = require('pg');
require('dotenv').config();

// إنشاء connection pool
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20, // أقصى عدد للاتصالات
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// اختبار الاتصال عند البدء
pool.on('connect', () => {
  console.log('✅ تم الاتصال بقاعدة البيانات PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ خطأ في قاعدة البيانات:', err);
});

// دالة لاختبار الاتصال
const testConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('✅ اختبار الاتصال ناجح:', result.rows[0].now);
    client.release();
    return true;
  } catch (error) {
    console.error('❌ فشل اختبار الاتصال:', error.message);
    return false;
  }
};

// اختبار الاتصال عند تشغيل التطبيق
testConnection();

module.exports = pool;