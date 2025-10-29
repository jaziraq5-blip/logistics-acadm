import { query } from './connection'

// User Model
export interface User {
  id: string
  username: string
  email: string
  password_hash: string
  role: string
  is_active: boolean
  created_at: Date
  updated_at: Date
}

export class UserModel {
  static async create(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>) {
    const { username, email, password_hash, role = 'admin', is_active = true } = userData
    const result = await query(
      'INSERT INTO users (username, email, password_hash, role, is_active) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [username, email, password_hash, role, is_active]
    )
    return result.rows[0]
  }

  static async findByEmail(email: string) {
    const result = await query('SELECT * FROM users WHERE email = $1', [email])
    return result.rows[0]
  }

  static async findById(id: string) {
    const result = await query('SELECT * FROM users WHERE id = $1', [id])
    return result.rows[0]
  }

  static async findAll() {
    const result = await query('SELECT * FROM users ORDER BY created_at DESC')
    return result.rows
  }

  static async update(id: string, userData: Partial<User>) {
    const fields = Object.keys(userData).map((key, index) => `${key} = $${index + 2}`).join(', ')
    const values = Object.values(userData)
    const result = await query(
      `UPDATE users SET ${fields} WHERE id = $1 RETURNING *`,
      [id, ...values]
    )
    return result.rows[0]
  }

  static async delete(id: string) {
    const result = await query('DELETE FROM users WHERE id = $1 RETURNING *', [id])
    return result.rows[0]
  }
}

// Service Model
export interface Service {
  id: string
  name_en: string
  name_ar: string
  name_ro: string
  description_en: string
  description_ar: string
  description_ro: string
  icon: string
  image_url?: string
  features: any[]
  is_active: boolean
  sort_order: number
  created_at: Date
  updated_at: Date
}

export class ServiceModel {
  static async create(serviceData: Omit<Service, 'id' | 'created_at' | 'updated_at'>) {
    const { name_en, name_ar, name_ro, description_en, description_ar, description_ro, icon, image_url, features = [], is_active = true, sort_order = 0 } = serviceData
    // Ensure features is JSON for PostgreSQL
    const featuresValue = features && typeof features === 'string' ? features : JSON.stringify(features)

    const result = await query(
      `INSERT INTO services (
          name_en, name_ar, name_ro,
          description_en, description_ar, description_ro,
          icon, image_url, features, is_active, sort_order
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [name_en, name_ar, name_ro, description_en, description_ar, description_ro, icon, image_url, featuresValue, is_active, sort_order]
    )
    return result.rows[0]
  }

  static async findAll() {
    const result = await query('SELECT * FROM services ORDER BY created_at DESC')
    return result.rows
  }

  static async getAll() {
    return this.findAll()
  }

  static async findActive() {
    const result = await query('SELECT * FROM services WHERE is_active = true ORDER BY created_at DESC')
    return result.rows
  }

  static async findById(id: string) {
    const result = await query('SELECT * FROM services WHERE id = $1', [id])
    return result.rows[0]
  }

  static async update(id: string, serviceData: Partial<Service>) {
    const fields = Object.keys(serviceData).map((key, index) => `${key} = $${index + 2}`).join(', ')
    const values = Object.values(serviceData)
    const result = await query(
      `UPDATE services SET ${fields} WHERE id = $1 RETURNING *`,
      [id, ...values]
    )
    return result.rows[0]
  }

  static async delete(id: string) {
    const result = await query('DELETE FROM services WHERE id = $1 RETURNING *', [id])
    return result.rows[0]
  }
}

// Certificate Model
export interface Certificate {
  id: string
  name_en: string
  name_ar: string
  name_ro: string
  description_en?: string
  description_ar?: string
  description_ro?: string
  image_url?: string
  certificate_type?: string
  issued_by?: string
  issued_date?: Date
  expiry_date?: Date
  is_active: boolean
  sort_order: number
  created_at: Date
  updated_at: Date
}

export class CertificateModel {
  // دالة لإنشاء سجل جديد
  static async create(certificateData: Omit<Certificate, 'id' | 'created_at' | 'updated_at'>) {
    const { 
      name_en, name_ar, name_ro, 
      description_en, description_ar, description_ro, 
      image_url, certificate_type, issued_by, issued_date, expiry_date, 
      is_active = true, sort_order = 0 
    } = certificateData;

    const result = await query(
      `INSERT INTO certificates (
        name_en, name_ar, name_ro, 
        description_en, description_ar, description_ro, 
        image_url, issued_by, issued_date, expiry_date, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
      RETURNING *`,
      [name_en, name_ar, name_ro, description_en, description_ar, description_ro, image_url, issued_by, issued_date, expiry_date, is_active]
    );

    return result.rows[0];
  }

  // دالة لتعديل سجل موجود
  static async update(id: string, certificateData: Partial<Certificate>) {
    const fields = Object.keys(certificateData)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');
    const values = Object.values(certificateData);
    const result = await query(
      `UPDATE certificates SET ${fields} WHERE id = $1 RETURNING *`,
      [id, ...values]
    );
    return result.rows[0];
  }

  // دالة ذكية لإنشاء أو تعديل
  static async save(certificateData: Partial<Certificate>) {
    if (certificateData.id) {
      // إذا وجد id موجود، نحدث السجل
      return await this.update(certificateData.id, certificateData);
    } else {
      // إذا لم يكن موجود id، ننشئ سجل جديد
      return await this.create(certificateData as Omit<Certificate, 'id' | 'created_at' | 'updated_at'>);
    }
  }

  // الدوال الأخرى كما هي
  static async findAll() {
    const result = await query('SELECT * FROM certificates ORDER BY created_at DESC');
    return result.rows;
  }

  static async getAll() {
    return this.findAll();
  }

  static async findActive() {
    const result = await query('SELECT * FROM certificates WHERE is_active = true ORDER BY created_at DESC');
    return result.rows;
  }

  static async findById(id: string) {
    const result = await query('SELECT * FROM certificates WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async delete(id: string) {
    const result = await query('DELETE FROM certificates WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }
}



// Team Member Model
export interface TeamMember {
  id: string
  name_en: string
  name_ar: string
  name_ro: string
  position_en: string
  position_ar: string
  position_ro: string
  bio_en?: string
  bio_ar?: string
  bio_ro?: string
  email?: string
  phone?: string
  image_url?: string
  linkedin_url?: string
  experience_years?: number
  is_active: boolean
  sort_order: number
  created_at: Date
  updated_at: Date
}

export class TeamMemberModel {
  static async create(teamMemberData: Omit<TeamMember, 'id' | 'created_at' | 'updated_at'>) {
    const { name_en, name_ar, name_ro, position_en, position_ar, position_ro, bio_en, bio_ar, bio_ro, email, phone, image_url, linkedin_url, experience_years, is_active = true, sort_order = 0 } = teamMemberData
    const result = await query(
      'INSERT INTO team (name_en, name_ar, name_ro, position_en, position_ar, position_ro, bio_en, bio_ar, bio_ro, email, phone, image_url, linkedin_url, experience_years, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *',
      [name_en, name_ar, name_ro, position_en, position_ar, position_ro, bio_en, bio_ar, bio_ro, email, phone, image_url, linkedin_url, experience_years, is_active]
    )
    return result.rows[0]
  }

  static async findAll() {
    const result = await query('SELECT * FROM team ORDER BY created_at DESC')
    return result.rows
  }

  static async getAll() {
    return this.findAll()
  }

  static async findActive() {
    const result = await query('SELECT * FROM team WHERE is_active = true ORDER BY created_at DESC')
    return result.rows
  }

  static async findById(id: string) {
    const result = await query('SELECT * FROM team WHERE id = $1', [id])
    return result.rows[0]
  }

  static async update(id: string, teamMemberData: Partial<TeamMember>) {
    const fields = Object.keys(teamMemberData).map((key, index) => `${key} = $${index + 2}`).join(', ')
    const values = Object.values(teamMemberData)
    const result = await query(
      `UPDATE team_members SET ${fields} WHERE id = $1 RETURNING *`,
      [id, ...values]
    )
    return result.rows[0]
  }

  static async delete(id: string) {
    const result = await query('DELETE FROM team WHERE id = $1 RETURNING *', [id])
    return result.rows[0]
  }
}

// Contact Message Model
export interface ContactMessage {
  id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  company?: string
  service_type?: string
  message: string
  status: string
  is_read: boolean
  created_at: Date
  updated_at: Date
}

export class ContactMessageModel {
  static async create(messageData: Omit<ContactMessage, 'id' | 'created_at' | 'updated_at'>) {
    const { first_name, last_name, email, phone, company, service_type, message, status = 'new', is_read = false } = messageData
    const fullName = `${first_name} ${last_name}`.trim()
    const result = await query(
      'INSERT INTO contact (name, email, phone, company, message, is_read) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [fullName, email, phone, company, message, is_read]
    )
    return result.rows[0]
  }

  static async findAll() {
    const result = await query('SELECT * FROM contact ORDER BY created_at DESC')
    return result.rows
  }

  static async getAll() {
    return this.findAll()
  }

  static async findByStatus(status: string) {
    const result = await query('SELECT * FROM contact WHERE is_read = $1 ORDER BY created_at DESC', [status === 'read'])
    return result.rows
  }

  static async findUnread() {
    const result = await query('SELECT * FROM contact WHERE is_read = false ORDER BY created_at DESC')
    return result.rows
  }

  static async findById(id: string) {
    const result = await query('SELECT * FROM contact WHERE id = $1', [id])
    return result.rows[0]
  }

  static async getById(id: string) {
    return this.findById(id)
  }

  static async update(id: string, messageData: Partial<ContactMessage>) {
    const fields = Object.keys(messageData).map((key, index) => `${key} = $${index + 2}`).join(', ')
    const values = Object.values(messageData)
    const result = await query(
      `UPDATE contact_messages SET ${fields} WHERE id = $1 RETURNING *`,
      [id, ...values]
    )
    return result.rows[0]
  }

  static async updateReadStatus(id: string, isRead: boolean) {
    const result = await query(
      'UPDATE contact_messages SET is_read = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *',
      [id, isRead]
    )
    return result.rows[0]
  }

  static async delete(id: string) {
    const result = await query('DELETE FROM contact_messages WHERE id = $1 RETURNING *', [id])
    return result.rows[0]
  }

  static async getStats() {
    const result = await query(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN is_read = false THEN 1 END) as unread,
        COUNT(CASE WHEN status = 'new' THEN 1 END) as new_messages,
        COUNT(CASE WHEN status = 'replied' THEN 1 END) as replied,
        COUNT(CASE WHEN created_at >= CURRENT_DATE THEN 1 END) as today
      FROM contact_messages
    `)
    return result.rows[0]
  }
}
