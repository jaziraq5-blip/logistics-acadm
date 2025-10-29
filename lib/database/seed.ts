import bcrypt from 'bcryptjs'
import { UserModel, ServiceModel, CertificateModel, TeamMemberModel } from './models'

export async function seedDatabase() {
  try {
    console.log('Starting database seeding...')

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10)
    const adminUser = await UserModel.create({
      username: 'admin',
      email: 'admin@blacksea-star.com',
      password_hash: hashedPassword,
      role: 'admin',
      is_active: true
    })
    console.log('Admin user created:', adminUser.email)

    // Create services
    const services = [
      {
        name_en: 'Sea Freight',
        name_ar: 'الشحن البحري',
        name_ro: 'Transport Maritim',
        description_en: 'Reliable and cost-effective sea transportation services worldwide',
        description_ar: 'خدمات نقل بحري موثوقة وفعالة من حيث التكلفة في جميع أنحاء العالم',
        description_ro: 'Servicii de transport maritim fiabile și rentabile în întreaga lume',
        icon: 'Ship',
        features: [
          'Full Container Load (FCL)',
          'Less Container Load (LCL)',
          'Shipment Tracking',
          'Customs Clearance',
          'Insurance Coverage'
        ],
        is_active: true,
        sort_order: 1
      },
      {
        name_en: 'Air Freight',
        name_ar: 'الشحن الجوي',
        name_ro: 'Transport Aerian',
        description_en: 'Fast and secure air cargo services for urgent shipments',
        description_ar: 'خدمات شحن جوي سريعة وآمنة للشحنات العاجلة',
        description_ro: 'Servicii rapide și sigure de cargo aerian pentru expedieri urgente',
        icon: 'Plane',
        features: [
          'Express 24-48 hours',
          'Time-sensitive cargo',
          'Comprehensive insurance',
          'Real-time tracking',
          'Door-to-door service'
        ],
        is_active: true,
        sort_order: 2
      },
      {
        name_en: 'Land Transport',
        name_ar: 'النقل البري',
        name_ro: 'Transport Terestru',
        description_en: 'Efficient ground transportation across regional networks',
        description_ar: 'نقل بري فعال عبر الشبكات الإقليمية',
        description_ro: 'Transport terestru eficient prin rețele regionale',
        icon: 'Truck',
        features: [
          'Local & regional transport',
          'Modern diverse fleet',
          'Real-time tracking',
          'Temperature controlled',
          'Express delivery'
        ],
        is_active: true,
        sort_order: 3
      },
      {
        name_en: 'Customs Clearance',
        name_ar: 'التخليص الجمركي',
        name_ro: 'Vămuire',
        description_en: 'Expert customs handling and documentation services',
        description_ar: 'خدمات خبيرة في التعامل الجمركي والوثائق',
        description_ro: 'Servicii experte de manipulare vamală și documentație',
        icon: 'Shield',
        features: [
          'Fast & accurate clearance',
          'Full legal compliance',
          'Customs consultation',
          'Document preparation',
          'Duty optimization'
        ],
        is_active: true,
        sort_order: 4
      },
      {
        name_en: 'Import & Export',
        name_ar: 'الاستيراد والتصدير',
        name_ro: 'Import & Export',
        description_en: 'Comprehensive import and export services with extensive global network',
        description_ar: 'خدمات استيراد وتصدير شاملة مع شبكة عالمية واسعة',
        description_ro: 'Servicii complete de import și export cu rețea globală extinsă',
        icon: 'Globe',
        features: [
          'Extensive global network',
          'Supply chain management',
          'Trade consultation',
          'Documentation support',
          'Market analysis'
        ],
        is_active: true,
        sort_order: 5
      },
      {
        name_en: 'Security Solutions',
        name_ar: 'حلول الأمان',
        name_ro: 'Soluții de Securitate',
        description_en: 'Advanced security systems to protect cargo throughout the transport journey',
        description_ar: 'أنظمة أمان متقدمة لحماية البضائع طوال رحلة النقل',
        description_ro: 'Sisteme de securitate avansate pentru protejarea mărfurilor pe tot parcursul transportului',
        icon: 'Award',
        features: [
          'Comprehensive insurance',
          '24/7 monitoring',
          'Security reports',
          'Risk assessment',
          'Emergency response'
        ],
        is_active: true,
        sort_order: 6
      }
    ]

    for (const service of services) {
      await ServiceModel.create(service)
    }
    console.log('Services created:', services.length)

    // Create certificates
    const certificates = [
      {
        name_en: 'ISO 9001:2015 Quality Management',
        name_ar: 'ISO 9001:2015 إدارة الجودة',
        name_ro: 'ISO 9001:2015 Managementul Calității',
        description_en: 'International standard for quality management systems',
        description_ar: 'المعيار الدولي لأنظمة إدارة الجودة',
        description_ro: 'Standard internațional pentru sistemele de management al calității',
        image_url: '/certificates/iso-9001.jpg',
        certificate_type: 'Quality Management',
        issued_by: 'International Organization for Standardization',
        issued_date: new Date('2020-01-15'),
        expiry_date: new Date('2026-01-15'),
        is_active: true,
        sort_order: 1
      },
      {
        name_en: 'ISO 14001:2015 Environmental Management',
        name_ar: 'ISO 14001:2015 الإدارة البيئية',
        name_ro: 'ISO 14001:2015 Managementul de Mediu',
        description_en: 'International standard for environmental management systems',
        description_ar: 'المعيار الدولي لأنظمة الإدارة البيئية',
        description_ro: 'Standard internațional pentru sistemele de management de mediu',
        image_url: '/certificates/iso-14001.jpg',
        certificate_type: 'Environmental Management',
        issued_by: 'International Organization for Standardization',
        issued_date: new Date('2020-03-20'),
        expiry_date: new Date('2026-03-20'),
        is_active: true,
        sort_order: 2
      },
      {
        name_en: 'IATA Certified Air Cargo Agent',
        name_ar: 'وكيل شحن جوي معتمد من IATA',
        name_ro: 'Agent de Cargo Aerian Certificat IATA',
        description_en: 'Certified air cargo agent by International Air Transport Association',
        description_ar: 'وكيل شحن جوي معتمد من قبل الرابطة الدولية للنقل الجوي',
        description_ro: 'Agent de cargo aerian certificat de Asociația Internațională de Transport Aerian',
        image_url: '/certificates/iata.jpg',
        certificate_type: 'Air Cargo',
        issued_by: 'International Air Transport Association',
        issued_date: new Date('2019-06-10'),
        expiry_date: new Date('2025-06-10'),
        is_active: true,
        sort_order: 3
      },
      {
        name_en: 'FIATA Freight Forwarder Certificate',
        name_ar: 'شهادة وكيل شحن FIATA',
        name_ro: 'Certificat de Expeditor de Marfă FIATA',
        description_en: 'Certified freight forwarder by International Federation of Freight Forwarders Associations',
        description_ar: 'وكيل شحن معتمد من قبل الاتحاد الدولي لجمعيات وكلاء الشحن',
        description_ro: 'Expeditor de marfă certificat de Federația Internațională a Asociațiilor de Expeditori de Marfă',
        image_url: '/certificates/fiata.jpg',
        certificate_type: 'Freight Forwarding',
        issued_by: 'International Federation of Freight Forwarders Associations',
        issued_date: new Date('2018-09-15'),
        expiry_date: new Date('2024-09-15'),
        is_active: true,
        sort_order: 4
      }
    ]

    for (const certificate of certificates) {
      await CertificateModel.create(certificate)
    }
    console.log('Certificates created:', certificates.length)

    // Create team members
    const teamMembers = [
      {
        name_en: 'Ahmed Al-Rashid',
        name_ar: 'أحمد الراشد',
        name_ro: 'Ahmed Al-Rashid',
        position_en: 'Chief Executive Officer',
        position_ar: 'الرئيس التنفيذي',
        position_ro: 'Director General',
        bio_en: '15+ years experience in logistics and supply chain management. Expert in international trade and business development.',
        bio_ar: 'أكثر من 15 عامًا من الخبرة في اللوجستيات وإدارة سلسلة التوريد. خبير في التجارة الدولية وتطوير الأعمال.',
        bio_ro: 'Peste 15 ani de experiență în logistică și managementul lanțului de aprovizionare. Expert în comerț internațional și dezvoltare de afaceri.',
        email: 'ahmed@blacksea-star.com',
        phone: '+40 726 547 699',
        image_url: '/team/ahmed-al-rashid.jpg',
        linkedin_url: 'https://linkedin.com/in/ahmed-al-rashid',
        experience_years: 15,
        is_active: true,
        sort_order: 1
      },
      {
        name_en: 'Sarah Johnson',
        name_ar: 'سارة جونسون',
        name_ro: 'Sarah Johnson',
        position_en: 'Chief Operations Officer',
        position_ar: 'مدير العمليات',
        position_ro: 'Director de Operațiuni',
        bio_en: 'Expert in international trade and customs regulations. Specialized in supply chain optimization and process improvement.',
        bio_ar: 'خبيرة في التجارة الدولية واللوائح الجمركية. متخصصة في تحسين سلسلة التوريد وتحسين العمليات.',
        bio_ro: 'Expertă în comerț internațional și reglementări vamale. Specializată în optimizarea lanțului de aprovizionare și îmbunătățirea proceselor.',
        email: 'sarah@blacksea-star.com',
        phone: '+40 791 391 711',
        image_url: '/team/sarah-johnson.jpg',
        linkedin_url: 'https://linkedin.com/in/sarah-johnson',
        experience_years: 12,
        is_active: true,
        sort_order: 2
      },
      {
        name_en: 'Mohammed Hassan',
        name_ar: 'محمد حسن',
        name_ro: 'Mohammed Hassan',
        position_en: 'Chief Technology Officer',
        position_ar: 'مدير التكنولوجيا',
        position_ro: 'Director de Tehnologie',
        bio_en: 'Leading digital transformation in logistics operations. Expert in implementing cutting-edge technology solutions.',
        bio_ar: 'يقود التحول الرقمي في العمليات اللوجستية. خبير في تنفيذ حلول التكنولوجيا المتطورة.',
        bio_ro: 'Conduce transformarea digitală în operațiunile logistice. Expert în implementarea soluțiilor tehnologice de ultimă generație.',
        email: 'mohammed@blacksea-star.com',
        phone: '+40 726 547 700',
        image_url: '/team/mohammed-hassan.jpg',
        linkedin_url: 'https://linkedin.com/in/mohammed-hassan',
        experience_years: 10,
        is_active: true,
        sort_order: 3
      }
    ]

    for (const teamMember of teamMembers) {
      await TeamMemberModel.create(teamMember)
    }
    console.log('Team members created:', teamMembers.length)

    console.log('Database seeding completed successfully!')
  } catch (error) {
    console.error('Database seeding failed:', error)
    throw error
  }
}
