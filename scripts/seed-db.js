// Import the seed function from the TypeScript file
// Load environment variables from .env when running with node
require('dotenv').config()
const { execSync } = require('child_process')
const path = require('path')

// Since we can't directly require TypeScript, let's create a simple seed script
async function seedDatabase() {
  console.log('🌱 Starting database seeding...')
  
  const { Pool } = require('pg')
  const bcrypt = require('bcryptjs')
  
  const connectionString = process.env.DATABASE_URL || 'postgresql://logistics_user:logistics_password@localhost:5432/logistics_db'
  
  const pool = new Pool({
    connectionString: connectionString,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  })
  
  try {
    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10)
    await pool.query(`
      INSERT INTO users (username, email, password_hash, role, created_at) 
      VALUES ($1, $2, $3, $4, NOW())
      ON CONFLICT (email) DO NOTHING
    `, ['admin', 'admin@blacksea-star.com', hashedPassword, 'admin'])
    
    console.log('✅ Admin user created/verified')
    
        // Create sample services
        const services = [
          {
            name_en: 'Sea Freight',
            name_ar: 'الشحن البحري',
            name_ro: 'Transport Maritim',
            description_en: 'Reliable and cost-effective sea transportation services worldwide with comprehensive cargo handling.',
            description_ar: 'خدمات نقل بحري موثوقة وفعالة من حيث التكلفة في جميع أنحاء العالم مع التعامل الشامل مع البضائع.',
            description_ro: 'Servicii de transport maritim fiabile și rentabile în întreaga lume cu manipulare cuprinzătoare a mărfurilor.',
            icon: 'Ship',
            image_url: '/uploads/sea-freight.jpg'
          },
          {
            name_en: 'Air Freight',
            name_ar: 'الشحن الجوي',
            name_ro: 'Transport Aerian',
            description_en: 'Fast and secure air cargo services for urgent shipments with real-time tracking.',
            description_ar: 'خدمات شحن جوي سريعة وآمنة للشحنات العاجلة مع التتبع في الوقت الفعلي.',
            description_ro: 'Servicii rapide și sigure de cargo aerian pentru expedieri urgente cu urmărire în timp real.',
            icon: 'Plane',
            image_url: '/uploads/air-freight.jpg'
          },
          {
            name_en: 'Land Transport',
            name_ar: 'النقل البري',
            name_ro: 'Transport Terestru',
            description_en: 'Efficient ground transportation across regional networks with door-to-door delivery.',
            description_ar: 'نقل بري فعال عبر الشبكات الإقليمية مع التسليم من الباب إلى الباب.',
            description_ro: 'Transport terestru eficient prin rețele regionale cu livrare de la ușă la ușă.',
            icon: 'Truck',
            image_url: '/uploads/land-transport.jpg'
          },
          {
            name_en: 'Customs Clearance',
            name_ar: 'التخليص الجمركي',
            name_ro: 'Vămuire',
            description_en: 'Expert customs handling and documentation services with compliance assurance.',
            description_ar: 'خدمات خبيرة في التعامل الجمركي والوثائق مع ضمان الامتثال.',
            description_ro: 'Servicii experte de manipulare vamală și documentație cu asigurarea conformității.',
            icon: 'Shield',
            image_url: '/uploads/customs-clearance.jpg'
          },
          {
            name_en: 'Import & Export',
            name_ar: 'الاستيراد والتصدير',
            name_ro: 'Import & Export',
            description_en: 'Comprehensive import and export services with extensive global network coverage.',
            description_ar: 'خدمات استيراد وتصدير شاملة مع تغطية شبكة عالمية واسعة.',
            description_ro: 'Servicii complete de import și export cu acoperire extinsă a rețelei globale.',
            icon: 'Globe',
            image_url: '/uploads/import-export.jpg'
          },
          {
            name_en: 'Warehousing & Distribution',
            name_ar: 'التخزين والتوزيع',
            name_ro: 'Depozitare și Distribuție',
            description_en: 'Secure storage and efficient distribution solutions with inventory management.',
            description_ar: 'حلول تخزين وتوزيع آمنة وفعالة مع إدارة المخزون.',
            description_ro: 'Soluții sigure de depozitare și distribuție eficientă cu managementul inventarului.',
            icon: 'Warehouse',
            image_url: '/uploads/warehousing.jpg'
          }
        ]
    
    for (const service of services) {
      await pool.query(`
        INSERT INTO services (name_en, name_ar, name_ro, description_en, description_ar, description_ro, icon, image_url, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
        ON CONFLICT DO NOTHING
      `, [service.name_en, service.name_ar, service.name_ro, service.description_en, service.description_ar, service.description_ro, service.icon, service.image_url])
    }
    
    console.log('✅ Services created/verified')
    
        // Create sample certificates
        const certificates = [
          {
            name_en: 'ISO 9001:2015 Quality Management',
            name_ar: 'ISO 9001:2015 إدارة الجودة',
            name_ro: 'ISO 9001:2015 Managementul Calității',
            description_en: 'Certified for high-quality management systems that ensure consistent quality in all our logistics operations.',
            description_ar: 'معتمد لأنظمة إدارة الجودة العالية التي تضمن الجودة المتسقة في جميع عملياتنا اللوجستية.',
            description_ro: 'Certificat pentru sisteme de management de înaltă calitate care asigură calitatea consistentă în toate operațiunile noastre logistice.',
            image_url: '/certificates/iso-9001.jpg',
            issued_date: new Date('2022-01-15'),
            expiry_date: new Date('2025-01-14')
          },
          {
            name_en: 'ISO 14001:2015 Environmental Management',
            name_ar: 'ISO 14001:2015 الإدارة البيئية',
            name_ro: 'ISO 14001:2015 Managementul de Mediu',
            description_en: 'Committed to environmental protection and sustainability in all our logistics operations.',
            description_ar: 'ملتزمون بحماية البيئة والاستدامة في جميع عملياتنا اللوجستية.',
            description_ro: 'Angajat în protecția mediului și sustenabilitate în toate operațiunile noastre logistice.',
            image_url: '/certificates/iso-14001.jpg',
            issued_date: new Date('2021-06-01'),
            expiry_date: new Date('2024-05-31')
          },
          {
            name_en: 'IATA Certified Air Cargo Agent',
            name_ar: 'وكيل شحن جوي معتمد من IATA',
            name_ro: 'Agent de Cargo Aerian Certificat IATA',
            description_en: 'Authorized to handle international air cargo shipments with IATA standards.',
            description_ar: 'مصرح له بالتعامل مع شحنات الشحن الجوي الدولية وفقاً لمعايير IATA.',
            description_ro: 'Autorizat să gestioneze expedieri internaționale de marfă aeriană conform standardelor IATA.',
            image_url: '/certificates/iata.jpg',
            issued_date: new Date('2023-03-10'),
            expiry_date: new Date('2026-03-09')
          },
          {
            name_en: 'FIATA Freight Forwarder Certificate',
            name_ar: 'شهادة وكيل شحن FIATA',
            name_ro: 'Certificat de Expeditor de Marfă FIATA',
            description_en: 'Recognized as a professional freight forwarder by the International Federation of Freight Forwarders Associations.',
            description_ar: 'معترف به كوكيل شحن محترف من قبل الاتحاد الدولي لجمعيات وكلاء الشحن.',
            description_ro: 'Recunoscut ca expeditor de marfă profesionist de către Federația Internațională a Asociațiilor de Expeditori de Marfă.',
            image_url: '/certificates/fiata.jpg',
            issued_date: new Date('2020-09-15'),
            expiry_date: new Date('2025-09-14')
          }
        ]
    
    for (const cert of certificates) {
      await pool.query(`
        INSERT INTO certificates (name_en, name_ar, name_ro, description_en, description_ar, description_ro, image_url, issued_date, expiry_date, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
        ON CONFLICT DO NOTHING
      `, [cert.name_en, cert.name_ar, cert.name_ro, cert.description_en, cert.description_ar, cert.description_ro, cert.image_url, cert.issued_date, cert.expiry_date])
    }
    
    console.log('✅ Certificates created/verified')
    
    console.log('🎉 Database seeding completed successfully!')
    
  } catch (error) {
    console.error('❌ Database seeding failed:', error)
    throw error
  } finally {
    await pool.end()
  }
}

async function runSeed() {
  try {
    console.log('Starting database seeding...')
    await seedDatabase()
    console.log('🎉 Database seeding completed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Database seeding failed:', error)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  runSeed()
}

module.exports = { runSeed }
