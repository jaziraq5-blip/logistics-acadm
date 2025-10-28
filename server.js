const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./config/database');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// اختبار الاتصال بقاعدة البيانات
app.get('/api/test-connection', async (req, res) => {
  try {
    const client = await db.connect();
    
    // اختبار استعلام بسيط
    const result = await client.query('SELECT version()');
    const version = result.rows[0].version;
    
    client.release();
    
    res.json({
      success: true,
      message: 'تم الاتصال بقاعدة البيانات بنجاح',
      postgresVersion: version,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('خطأ في الاتصال:', error);
    res.status(500).json({
      success: false,
      message: 'فشل الاتصال بقاعدة البيانات',
      error: error.message
    });
  }
});

// الحصول على بيانات من جدول كمثال
app.get('/api/users', async (req, res) => {
  try {
    const client = await db.connect();
    
    // تأكد من وجود الجدول أولاً
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // إدخال بيانات تجريبية إذا كان الجدول فارغاً
    const checkResult = await client.query('SELECT COUNT(*) FROM users');
    if (parseInt(checkResult.rows[0].count) === 0) {
      await client.query(`
        INSERT INTO users (name, email) VALUES 
        ('أحمد محمد', 'ahmed@example.com'),
        ('فاطمة علي', 'fatima@example.com'),
        ('محمد خالد', 'mohamed@example.com')
      `);
    }
    
    const result = await client.query('SELECT * FROM users ORDER BY id');
    client.release();
    
    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('خطأ في جلب البيانات:', error);
    res.status(500).json({
      success: false,
      message: 'فشل في جلب البيانات',
      error: error.message
    });
  }
});

// إضافة مستخدم جديد
app.post('/api/users', async (req, res) => {
  try {
    const { name, email } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'الاسم والبريد الإلكتروني مطلوبان'
      });
    }
    
    const client = await db.connect();
    const result = await client.query(
      'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
      [name, email]
    );
    
    client.release();
    
    res.json({
      success: true,
      message: 'تم إضافة المستخدم بنجاح',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('خطأ في إضافة المستخدم:', error);
    res.status(500).json({
      success: false,
      message: 'فشل في إضافة المستخدم',
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`الخادم يعمل على المنفذ ${PORT}`);
  console.log(`رابط الاختبار: http://localhost:${PORT}/api/test-connection`);
});