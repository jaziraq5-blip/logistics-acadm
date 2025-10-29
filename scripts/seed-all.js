// Seed additional tables: team_members, content_pages, settings
require('dotenv').config()
const { Pool } = require('pg')

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })

async function seed() {
  try {
    console.log('Seeding team members...')
    const team = [
      {
        name_en: 'John Doe',
        name_ar: 'جون دو',
        name_ro: 'John Doe',
        position_en: 'Operations Manager',
        position_ar: 'مدير العمليات',
        position_ro: 'Manager Operațiuni',
        bio_en: 'Over 10 years in logistics and operations management.',
        email: 'john.doe@company.com',
        phone: '+1234567890',
        image_url: '/team/john.jpg',
        linkedin_url: '',
        experience_years: 12
      },
      {
        name_en: 'Sara Ahmed',
        name_ar: 'سارة أحمد',
        name_ro: 'Sara Ahmed',
        position_en: 'Sales Director',
        position_ar: 'مدير المبيعات',
        position_ro: 'Director Vânzări',
        bio_en: 'Leading business development and client relationships across EMEA.',
        email: 'sara.ahmed@company.com',
        phone: '+1987654321',
        image_url: '/team/sara.jpg',
        linkedin_url: '',
        experience_years: 9
      }
    ]

    for (const m of team) {
      // avoid duplicate by email
      const res = await pool.query('SELECT id FROM team_members WHERE email = $1 LIMIT 1', [m.email])
      if (res.rowCount === 0) {
        await pool.query(`
          INSERT INTO team_members (name_en, name_ar, name_ro, position_en, position_ar, position_ro, bio_en, bio_ar, bio_ro, email, phone, image_url, linkedin_url, experience_years, created_at, updated_at)
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,NOW(),NOW())
        `, [m.name_en, m.name_ar, m.name_ro, m.position_en, m.position_ar, m.position_ro, m.bio_en, null, null, m.email, m.phone, m.image_url, m.linkedin_url, m.experience_years])
        console.log('Inserted team member:', m.email)
      } else {
        console.log('Team member exists, skipping:', m.email)
      }
    }

    console.log('Seeding content pages...')
    const pages = [
      {
        page_key: 'home',
        title_en: 'Home',
        title_ar: 'الصفحة الرئيسية',
        title_ro: 'Acasă',
        content_en: '<p>Welcome to our logistics company.</p>',
        content_ar: '<p>مرحبًا بكم في شركتنا اللوجستية.</p>',
        content_ro: '<p>Bine ați venit la compania noastră de logistică.</p>'
      },
      {
        page_key: 'about',
        title_en: 'About Us',
        title_ar: 'من نحن',
        title_ro: 'Despre Noi',
        content_en: '<p>About the company and our values.</p>',
        content_ar: '<p>حول الشركة وقيمنا.</p>',
        content_ro: '<p>Despre companie și valorile noastre.</p>'
      }
    ]

    for (const p of pages) {
      const res = await pool.query('SELECT id FROM content_pages WHERE page_key = $1 LIMIT 1', [p.page_key])
      if (res.rowCount === 0) {
        await pool.query(`
          INSERT INTO content_pages (page_key, title_en, title_ar, title_ro, content_en, content_ar, content_ro, created_at, updated_at)
          VALUES ($1,$2,$3,$4,$5,$6,$7,NOW(),NOW())
        `, [p.page_key, p.title_en, p.title_ar, p.title_ro, p.content_en, p.content_ar, p.content_ro])
        console.log('Inserted content page:', p.page_key)
      } else {
        console.log('Content page exists, skipping:', p.page_key)
      }
    }

    console.log('Seeding settings...')
    const settings = [
      { key: 'site_title', value: 'Black Sea Logistics' },
      { key: 'contact_email', value: 'contact@blacksea-star.com' },
      { key: 'default_language', value: 'en' }
    ]

    for (const s of settings) {
      await pool.query(`
        INSERT INTO settings (setting_key, setting_value, setting_type, created_at, updated_at)
        VALUES ($1,$2,'string',NOW(),NOW())
        ON CONFLICT (setting_key) DO UPDATE SET setting_value = EXCLUDED.setting_value, updated_at = NOW()
      `, [s.key, s.value])
      console.log('Upserted setting:', s.key)
    }

    console.log('Seeding completed')
  } catch (err) {
    console.error('Seeding error:', err)
    throw err
  } finally {
    await pool.end()
  }
}

if (require.main === module) seed()

module.exports = { seed }
