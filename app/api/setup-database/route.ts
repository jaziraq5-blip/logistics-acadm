import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/database/connection'

export async function POST(request: NextRequest) {
  try {
    console.log('Setting up database schema...')
    
    // Create tables
    const createTables = `
      -- Services table
      CREATE TABLE IF NOT EXISTS services (
        id SERIAL PRIMARY KEY,
        title_en VARCHAR(255) NOT NULL,
        title_ar VARCHAR(255) NOT NULL,
        title_ro VARCHAR(255) NOT NULL,
        description_en TEXT,
        description_ar TEXT,
        description_ro TEXT,
        icon VARCHAR(100),
        image_url VARCHAR(500),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Certificates table
      CREATE TABLE IF NOT EXISTS certificates (
        id SERIAL PRIMARY KEY,
        title_en VARCHAR(255) NOT NULL,
        title_ar VARCHAR(255) NOT NULL,
        title_ro VARCHAR(255) NOT NULL,
        description_en TEXT,
        description_ar TEXT,
        description_ro TEXT,
        image_url VARCHAR(500),
        issued_by VARCHAR(255),
        issued_date DATE,
        expiry_date DATE,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Team table
      CREATE TABLE IF NOT EXISTS team (
        id SERIAL PRIMARY KEY,
        name_en VARCHAR(255) NOT NULL,
        name_ar VARCHAR(255) NOT NULL,
        name_ro VARCHAR(255) NOT NULL,
        position_en VARCHAR(255) NOT NULL,
        position_ar VARCHAR(255) NOT NULL,
        position_ro VARCHAR(255) NOT NULL,
        bio_en TEXT,
        bio_ar TEXT,
        bio_ro TEXT,
        email VARCHAR(255),
        phone VARCHAR(50),
        image_url VARCHAR(500),
        linkedin_url VARCHAR(500),
        experience_years INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Messages table
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        subject VARCHAR(255),
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Contact table
      CREATE TABLE IF NOT EXISTS contact (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        company VARCHAR(255),
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `

    await pool.query(createTables)
    console.log('Database schema created successfully')

    // Insert sample data
    const insertSampleData = `
      -- Insert sample services
      INSERT INTO services (title_en, title_ar, title_ro, description_en, description_ar, description_ro, icon) VALUES
      ('Sea Freight', 'الشحن البحري', 'Transport Maritim', 'Reliable sea shipping for all cargo types', 'خدمات شحن بحري موثوقة لجميع أنواع البضائع', 'Transport maritim de încredere pentru toate tipurile de marfă', '🚢'),
      ('Air Freight', 'الشحن الجوي', 'Transport Aerian', 'Fast air cargo for urgent and sensitive goods', 'شحن جوي سريع للبضائع العاجلة والحساسة', 'Transport aerian rapid pentru mărfuri urgente și sensibile', '✈️'),
      ('Land Transport', 'النقل البري', 'Transport Terestru', 'Wide land transport network covering all regions', 'شبكة نقل بري واسعة تغطي جميع المناطق', 'Rețea largă de transport terestru care acoperă toate regiunile', '🚛'),
      ('Customs Clearance', 'التخليص الجمركي', 'Vămuire', 'Fast, specialized customs clearance services', 'خدمات تخليص جمركي سريعة ومتخصصة', 'Servicii rapide și specializate de vămuire', '📋'),
      ('Insurance', 'التأمين', 'Asigurare', 'Comprehensive cargo insurance during transport', 'تأمين شامل للبضائع أثناء النقل', 'Asigurare completă pentru marfă în timpul transportului', '🛡️'),
      ('Real-time Tracking', 'التتبع المباشر', 'Urmărire în Timp Real', 'Advanced tracking to monitor shipments', 'نظام تتبع متطور لمراقبة الشحنات', 'Urmărire avansată pentru monitorizarea expedierilor', '⏰')
      ON CONFLICT DO NOTHING;

      -- Insert sample certificates
      INSERT INTO certificates (title_en, title_ar, title_ro, description_en, description_ar, description_ro, issued_by, issued_date) VALUES
      ('ISO 9001:2015', 'ISO 9001:2015', 'ISO 9001:2015', 'Quality Management System Certification', 'شهادة نظام إدارة الجودة', 'Certificare Sistem de Management al Calității', 'ISO International', '2023-01-15'),
      ('ISO 14001:2015', 'ISO 14001:2015', 'ISO 14001:2015', 'Environmental Management System Certification', 'شهادة نظام الإدارة البيئية', 'Certificare Sistem de Management al Mediului', 'ISO International', '2023-02-20'),
      ('OHSAS 18001', 'OHSAS 18001', 'OHSAS 18001', 'Occupational Health and Safety Management', 'شهادة إدارة الصحة والسلامة المهنية', 'Managementul Sănătății și Siguranței la Locul de Muncă', 'BSI Group', '2023-03-10'),
      ('Customs Broker License', 'رخصة وكيل جمركي', 'Licență Agent Vamal', 'Licensed customs broker for international trade', 'وكيل جمركي مرخص للتجارة الدولية', 'Agent vamal licențiat pentru comerț internațional', 'Customs Authority', '2023-04-05')
      ON CONFLICT DO NOTHING;

      -- Insert sample team members
      INSERT INTO team (name_en, name_ar, name_ro, position_en, position_ar, position_ro, bio_en, bio_ar, bio_ro, email, phone, experience_years) VALUES
      ('Ahmed Al-Rashid', 'أحمد الراشد', 'Ahmed Al-Rashid', 'Chief Executive Officer', 'الرئيس التنفيذي', 'Director General', '15+ years experience in logistics and supply chain management', 'أكثر من 15 عامًا من الخبرة في اللوجستيات وإدارة سلسلة التوريد', 'Peste 15 ani de experiență în logistică și managementul lanțului de aprovizionare', 'ahmed@blacksea-star.com', '+40 726 547 699', 15),
      ('Sarah Johnson', 'سارة جونسون', 'Sarah Johnson', 'Chief Operations Officer', 'مدير العمليات', 'Director de Operațiuni', 'Expert in international trade and customs regulations', 'خبيرة في التجارة الدولية واللوائح الجمركية', 'Expertă în comerț internațional și reglementări vamale', 'sarah@blacksea-star.com', '+40 791 391 711', 12),
      ('Mohammed Hassan', 'محمد حسن', 'Mohammed Hassan', 'Chief Technology Officer', 'مدير التكنولوجيا', 'Director de Tehnologie', 'Leading digital transformation in logistics operations', 'يقود التحول الرقمي في العمليات اللوجستية', 'Conduce transformarea digitală în operațiunile logistice', 'mohammed@blacksea-star.com', '+40 726 547 700', 10)
      ON CONFLICT DO NOTHING;
    `

    await pool.query(insertSampleData)
    console.log('Sample data inserted successfully')

    return NextResponse.json({
      success: true,
      message: 'Database setup completed successfully!',
      tables: ['services', 'certificates', 'team', 'messages', 'contact']
    })

  } catch (error) {
    console.error('Database setup error:', error)
    return NextResponse.json({
      success: false,
      message: 'Database setup failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
