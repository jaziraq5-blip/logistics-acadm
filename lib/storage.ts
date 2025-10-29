// Local storage utilities for admin data persistence
// This provides data persistence without requiring database connection

export interface Certificate {
  id: string
  name_en: string
  name_ar: string
  name_ro: string
  description_en: string
  description_ar: string
  description_ro: string
  image_url: string
  issued_date: string
  expiry_date: string
  created_at: string
  updated_at: string
}

export interface Service {
  id: string
  name_en: string
  name_ar: string
  name_ro: string
  description_en: string
  description_ar: string
  description_ro: string
  icon: string
  created_at: string
  updated_at: string
}

export interface TeamMember {
  id: string
  name_en: string
  name_ar: string
  name_ro: string
  position_en: string
  position_ar: string
  position_ro: string
  bio_en: string
  bio_ar: string
  bio_ro: string
  email: string
  phone: string
  image_url: string
  linkedin_url: string
  experience_years: number
  created_at: string
  updated_at: string
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  service_type?: string
  message: string
  read_status: boolean
  created_at: string
}

// Generate unique ID
const generateId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}

// Certificates storage
export const certificateStorage = {
  getAll: (): Certificate[] => {
    if (typeof window === 'undefined') return []
    const stored = localStorage.getItem('admin_certificates')
    if (!stored) {
      // Return default certificates
      const defaultCertificates: Certificate[] = [
        {
          id: "1",
          name_en: "ISO 9001:2015 Quality Management",
          name_ar: "ISO 9001:2015 إدارة الجودة",
          name_ro: "ISO 9001:2015 Managementul Calității",
          description_en: "Certified for high-quality management systems.",
          description_ar: "معتمد لأنظمة إدارة الجودة العالية.",
          description_ro: "Certificat pentru sisteme de management de înaltă calitate.",
          image_url: "/certificates/iso-9001.jpg",
          issued_date: "2022-01-15",
          expiry_date: "2025-01-14",
          created_at: "2024-01-01",
          updated_at: "2024-01-01"
        },
        {
          id: "2",
          name_en: "ISO 14001:2015 Environmental Management",
          name_ar: "ISO 14001:2015 الإدارة البيئية",
          name_ro: "ISO 14001:2015 Managementul de Mediu",
          description_en: "Committed to environmental protection and sustainability.",
          description_ar: "ملتزمون بحماية البيئة والاستدامة.",
          description_ro: "Angajat în protecția mediului și sustenabilitate.",
          image_url: "/certificates/iso-14001.jpg",
          issued_date: "2021-06-01",
          expiry_date: "2024-05-31",
          created_at: "2024-01-01",
          updated_at: "2024-01-01"
        }
      ]
      localStorage.setItem('admin_certificates', JSON.stringify(defaultCertificates))
      return defaultCertificates
    }
    return JSON.parse(stored)
  },

  create: (certificate: Omit<Certificate, 'id' | 'created_at' | 'updated_at'>): Certificate => {
    const newCertificate: Certificate = {
      ...certificate,
      id: generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    const certificates = certificateStorage.getAll()
    certificates.push(newCertificate)
    localStorage.setItem('admin_certificates', JSON.stringify(certificates))
    return newCertificate
  },

  update: (id: string, updates: Partial<Certificate>): Certificate | null => {
    const certificates = certificateStorage.getAll()
    const index = certificates.findIndex(c => c.id === id)
    if (index === -1) return null
    
    certificates[index] = {
      ...certificates[index],
      ...updates,
      updated_at: new Date().toISOString()
    }
    localStorage.setItem('admin_certificates', JSON.stringify(certificates))
    return certificates[index]
  },

  delete: (id: string): boolean => {
    const certificates = certificateStorage.getAll()
    const filtered = certificates.filter(c => c.id !== id)
    if (filtered.length === certificates.length) return false
    
    localStorage.setItem('admin_certificates', JSON.stringify(filtered))
    return true
  }
}

// Services storage
export const serviceStorage = {
  getAll: (): Service[] => {
    if (typeof window === 'undefined') return []
    const stored = localStorage.getItem('admin_services')
    if (!stored) {
      const defaultServices: Service[] = [
        {
          id: "1",
          name_en: "Sea Freight",
          name_ar: "الشحن البحري",
          name_ro: "Transport Maritim",
          description_en: "Reliable and cost-effective sea transportation services worldwide.",
          description_ar: "خدمات نقل بحري موثوقة وفعالة من حيث التكلفة في جميع أنحاء العالم.",
          description_ro: "Servicii de transport maritim fiabile și rentabile în întreaga lume.",
          icon: "Ship",
          created_at: "2024-01-01",
          updated_at: "2024-01-01"
        },
        {
          id: "2",
          name_en: "Air Freight",
          name_ar: "الشحن الجوي",
          name_ro: "Transport Aerian",
          description_en: "Fast and secure air cargo services for urgent shipments.",
          description_ar: "خدمات شحن جوي سريعة وآمنة للشحنات العاجلة.",
          description_ro: "Servicii rapide și sigure de cargo aerian pentru expedieri urgente.",
          icon: "Plane",
          created_at: "2024-01-01",
          updated_at: "2024-01-01"
        }
      ]
      localStorage.setItem('admin_services', JSON.stringify(defaultServices))
      return defaultServices
    }
    return JSON.parse(stored)
  },

  create: (service: Omit<Service, 'id' | 'created_at' | 'updated_at'>): Service => {
    const newService: Service = {
      ...service,
      id: generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    const services = serviceStorage.getAll()
    services.push(newService)
    localStorage.setItem('admin_services', JSON.stringify(services))
    return newService
  },

  update: (id: string, updates: Partial<Service>): Service | null => {
    const services = serviceStorage.getAll()
    const index = services.findIndex(s => s.id === id)
    if (index === -1) return null
    
    services[index] = {
      ...services[index],
      ...updates,
      updated_at: new Date().toISOString()
    }
    localStorage.setItem('admin_services', JSON.stringify(services))
    return services[index]
  },

  delete: (id: string): boolean => {
    const services = serviceStorage.getAll()
    const filtered = services.filter(s => s.id !== id)
    if (filtered.length === services.length) return false
    
    localStorage.setItem('admin_services', JSON.stringify(filtered))
    return true
  }
}

// Team members storage
export const teamStorage = {
  getAll: (): TeamMember[] => {
    if (typeof window === 'undefined') return []
    const stored = localStorage.getItem('admin_team')
    if (!stored) {
      const defaultTeam: TeamMember[] = [
        {
          id: "1",
          name_en: "Ahmed Al-Rashid",
          name_ar: "أحمد الراشد",
          name_ro: "Ahmed Al-Rashid",
          position_en: "Chief Executive Officer",
          position_ar: "الرئيس التنفيذي",
          position_ro: "Director General",
          bio_en: "15+ years experience in logistics and supply chain management.",
          bio_ar: "أكثر من 15 عامًا من الخبرة في اللوجستيات وإدارة سلسلة التوريد.",
          bio_ro: "Peste 15 ani de experiență în logistică și managementul lanțului de aprovizionare.",
          email: "ahmed@blacksea-star.com",
          phone: "+40 726 547 699",
          image_url: "/team/ahmed-al-rashid.jpg",
          linkedin_url: "https://linkedin.com/in/ahmed-al-rashid",
          experience_years: 15,
          created_at: "2024-01-01",
          updated_at: "2024-01-01"
        }
      ]
      localStorage.setItem('admin_team', JSON.stringify(defaultTeam))
      return defaultTeam
    }
    return JSON.parse(stored)
  },

  create: (member: Omit<TeamMember, 'id' | 'created_at' | 'updated_at'>): TeamMember => {
    const newMember: TeamMember = {
      ...member,
      id: generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    const members = teamStorage.getAll()
    members.push(newMember)
    localStorage.setItem('admin_team', JSON.stringify(members))
    return newMember
  },

  update: (id: string, updates: Partial<TeamMember>): TeamMember | null => {
    const members = teamStorage.getAll()
    const index = members.findIndex(m => m.id === id)
    if (index === -1) return null
    
    members[index] = {
      ...members[index],
      ...updates,
      updated_at: new Date().toISOString()
    }
    localStorage.setItem('admin_team', JSON.stringify(members))
    return members[index]
  },

  delete: (id: string): boolean => {
    const members = teamStorage.getAll()
    const filtered = members.filter(m => m.id !== id)
    if (filtered.length === members.length) return false
    
    localStorage.setItem('admin_team', JSON.stringify(filtered))
    return true
  }
}

// Contact messages storage
export const messageStorage = {
  getAll: (): ContactMessage[] => {
    if (typeof window === 'undefined') return []
    const stored = localStorage.getItem('admin_messages')
    if (!stored) {
      const defaultMessages: ContactMessage[] = [
        {
          id: "1",
          name: "John Smith",
          email: "john.smith@example.com",
          phone: "+40 123 456 789",
          company: "ABC Logistics Ltd",
          service_type: "Sea Freight",
          message: "Hello, I'm interested in your sea freight services for shipping containers from Constanta to Istanbul.",
          read_status: false,
          created_at: "2024-01-15T10:30:00Z"
        }
      ]
      localStorage.setItem('admin_messages', JSON.stringify(defaultMessages))
      return defaultMessages
    }
    return JSON.parse(stored)
  },

  create: (message: Omit<ContactMessage, 'id' | 'created_at'>): ContactMessage => {
    const newMessage: ContactMessage = {
      ...message,
      id: generateId(),
      created_at: new Date().toISOString()
    }
    const messages = messageStorage.getAll()
    messages.push(newMessage)
    localStorage.setItem('admin_messages', JSON.stringify(messages))
    return newMessage
  },

  update: (id: string, updates: Partial<ContactMessage>): ContactMessage | null => {
    const messages = messageStorage.getAll()
    const index = messages.findIndex(m => m.id === id)
    if (index === -1) return null
    
    messages[index] = { ...messages[index], ...updates }
    localStorage.setItem('admin_messages', JSON.stringify(messages))
    return messages[index]
  },

  delete: (id: string): boolean => {
    const messages = messageStorage.getAll()
    const filtered = messages.filter(m => m.id !== id)
    if (filtered.length === messages.length) return false
    
    localStorage.setItem('admin_messages', JSON.stringify(filtered))
    return true
  }
}
