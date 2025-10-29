"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, Ship, Plane, Truck, Shield, Globe, Warehouse, ArrowRight, CheckCircle } from "lucide-react"
import Image from "next/image"
import { useLanguage } from "@/contexts/language-context"

interface Service {
  id: string
  name_en: string
  name_ar: string
  name_ro: string
  description_en: string
  description_ar: string
  description_ro: string
  icon: string
  image_url?: string
  created_at: string
  updated_at: string
}

// Ensure image URL points to the public uploads folder and normalize legacy /images/ paths
function normalizeImageUrl(url?: string) {
  if (!url) return undefined
  // If already an absolute URL, return as-is
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  // Ensure leading slash
  let u = url.startsWith('/') ? url : `/${url}`
  // Map legacy /images/* to /uploads/* (admin uploads are stored in public/uploads)
  if (u.startsWith('/images/')) {
    u = u.replace('/images/', '/uploads/')
  }
  return u
}

const serviceIcons = {
  Ship: <Ship className="h-8 w-8 text-black/85" />,
  Plane: <Plane className="h-8 w-8 text-black/85" />,
  Truck: <Truck className="h-8 w-8 text-black/85" />,
  Shield: <Shield className="h-8 w-8 text-black/85" />,
  Globe: <Globe className="h-8 w-8 text-black/85" />,
  Warehouse: <Warehouse className="h-8 w-8 text-black/85" />,
  Package: <Package className="h-8 w-8 text-black/85" />,
}

// Translation texts for the entire page
const translations = {
  en: {
    headerTitle: "Our Services",
    headerDescription: "BLACK SEA STAR provides comprehensive logistics solutions tailored to meet your business needs with the highest standards of quality and reliability.",
    sectionTitle: "Comprehensive Logistics Solutions",
    sectionDescription: "From sea freight to air cargo, we provide end-to-end logistics services that ensure your cargo reaches its destination safely and on time.",
    noServicesTitle: "No Services Available",
    noServicesDescription: "Services will be displayed here once they are added.",
    available: "Available",
    professionalService: "Professional Service",
    support24: "24/7 Support",
    globalNetwork: "Global Network",
    learnMore: "Learn More",
    totalServices: "Total Services",
    countriesServed: "Countries Served",
    happyClients: "Happy Clients",
    yearsExperience: "Years Experience",
    readyTitle: "Ready to Get Started?",
    readyDescription: "Contact us today to discuss your logistics needs and get a customized solution that fits your business requirements.",
    getQuote: "Get Quote",
    contactUs: "Contact Us",
    loading: "Loading services...",
    errorTitle: "Error Loading Services"
  },
  ar: {
    headerTitle: "خدماتنا",
    headerDescription: "تقدم BLACK SEA STAR حلولاً لوجستية شاملة مصممة لتلبية احتياجات عملك بأعلى معايير الجودة والموثوقية.",
    sectionTitle: "حلول لوجستية شاملة",
    sectionDescription: "من الشحن البحري إلى الشحن الجوي، نقدم خدمات لوجستية متكاملة تضمن وصول شحنتك إلى وجهتها بأمان وفي الوقت المحدد.",
    noServicesTitle: "لا توجد خدمات متاحة",
    noServicesDescription: "سيتم عرض الخدمات هنا بمجرد إضافتها.",
    available: "متاح",
    professionalService: "خدمة احترافية",
    support24: "دعم على مدار الساعة",
    globalNetwork: "شبكة عالمية",
    learnMore: "تعرف على المزيد",
    totalServices: "إجمالي الخدمات",
    countriesServed: "دولة تمت خدمتها",
    happyClients: "عميل سعيد",
    yearsExperience: "سنوات الخبرة",
    readyTitle: "مستعد للبدء؟",
    readyDescription: "اتصل بنا اليوم لمناقشة احتياجاتك اللوجستية والحصول على حل مخصص يناسب متطلبات عملك.",
    getQuote: "احصل على عرض سعر",
    contactUs: "اتصل بنا",
    loading: "جاري تحميل الخدمات...",
    errorTitle: "خطأ في تحميل الخدمات"
  },
  ro: {
    headerTitle: "Serviciile Noastre",
    headerDescription: "BLACK SEA STAR oferă soluții logistice complete, adaptate nevoilor afacerii dumneavoastră, cu cele mai înalte standarde de calitate și fiabilitate.",
    sectionTitle: "Soluții Logistice Complete",
    sectionDescription: "De la transportul maritim la cel aerian, oferim servicii logistice de la un capăt la altul care asigură că marfa dvs. ajunge la destinație în siguranță și la timp.",
    noServicesTitle: "Niciun serviciu disponibil",
    noServicesDescription: "Serviciile vor fi afișate aici odată ce sunt adăugate.",
    available: "Disponibil",
    professionalService: "Serviciu Profesional",
    support24: "Suport 24/7",
    globalNetwork: "Rețea Globală",
    learnMore: "Află Mai Mult",
    totalServices: "Total Servicii",
    countriesServed: "Țări Deservite",
    happyClients: "Clienți Fericiți",
    yearsExperience: "Ani Experiență",
    readyTitle: "Gata să începeți?",
    readyDescription: "Contactați-ne astăzi pentru a discuta nevoile dvs. logistice și pentru a obține o soluție personalizată care se potrivește cerințelor afacerii dvs.",
    getQuote: "Solicită Ofertă",
    contactUs: "Contactează-ne",
    loading: "Se încarcă serviciile...",
    errorTitle: "Eroare la încărcarea serviciilor"
  }
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // استخدام useLanguage hook للحصول على اللغة الحالية
  const { t, language } = useLanguage()

  useEffect(() => {
    const loadServices = async () => {
      try {
        const response = await fetch('/api/services')
        if (response.ok) {
          const data = await response.json()
          setServices(data)
        } else {
          console.error('Failed to load services')
          setError('Failed to load services')
        }
      } catch (error) {
        console.error('Error loading services:', error)
        setError('Error loading services')
      } finally {
        setIsLoading(false)
      }
    }

    loadServices()
  }, [])

  // Helper function to get service name based on current language
  const getServiceName = (service: Service) => {
    switch (language) {
      case 'ar': return service.name_ar
      case 'ro': return service.name_ro
      default: return service.name_en
    }
  }

  // Helper function to get service description based on current language
  const getServiceDescription = (service: Service) => {
    switch (language) {
      case 'ar': return service.description_ar
      case 'ro': return service.description_ro
      default: return service.description_en
    }
  }

  // الحصول على الترجمات بناءً على اللغة الحالية
  const pageTranslations = translations[language]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black/85 mx-auto mb-4"></div>
          <p className="text-gray-600">{pageTranslations.loading}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-black/85 mb-2">{pageTranslations.errorTitle}</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header Section */}
      <div className="bg-gradient-to-r from-black/85 via-black/85 to-black/85 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Package className="h-16 w-16 text-gray-300" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {pageTranslations.headerTitle}
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {pageTranslations.headerDescription}
            </p>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {services.length === 0 ? (
          <div className="text-center py-16">
            <Package className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-black/85 mb-2">{pageTranslations.noServicesTitle}</h3>
            <p className="text-gray-600">{pageTranslations.noServicesDescription}</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-black/85 mb-4">
                {pageTranslations.sectionTitle}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {pageTranslations.sectionDescription}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <Card key={service.id} className="group hover:shadow-xl transition-all duration-300 border-2 border-gray-200 shadow-xl bg-white overflow-hidden hover:border-gray-300">
                  <CardHeader className="pb-4 bg-gray-50 border-b">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {serviceIcons[service.icon as keyof typeof serviceIcons] || <Package className="h-8 w-8 text-black/85" />}
                        <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-800 border-gray-200">
                          {pageTranslations.available}
                        </Badge>
                      </div>
                      <CheckCircle className="h-5 w-5 text-gray-500" />
                    </div>
                    
                    <CardTitle className="text-xl font-bold text-black/85 group-hover:text-black/85 transition-colors">
                      {getServiceName(service)}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4 bg-white p-6">
                    {/* Service Image */}
                    {service.image_url && (
                      <div className="relative h-48 w-full overflow-hidden rounded-lg bg-gray-100 border-2 border-gray-200">
                        <Image
                          src={normalizeImageUrl(service.image_url) || '/placeholder.jpg'}
                          alt={getServiceName(service)}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                          }}
                        />
                      </div>
                    )}

                    {/* Description */}
                    <p className="text-black/85 text-sm leading-relaxed font-medium">
                      {getServiceDescription(service)}
                    </p>

                    {/* Service Features */}
                    <div className="space-y-2 pt-4 border-t border-gray-200">
                      <div className="flex items-center text-sm text-gray-700 font-medium">
                        <CheckCircle className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{pageTranslations.professionalService}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-700 font-medium">
                        <CheckCircle className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{pageTranslations.support24}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-700 font-medium">
                        <CheckCircle className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{pageTranslations.globalNetwork}</span>
                      </div>
                    </div>

                 
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Summary Stats */}
            <div className="mt-16 bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="text-3xl font-bold text-black/85 mb-2">
                    {services.length}
                  </div>
                  <div className="text-gray-700 font-medium">{pageTranslations.totalServices}</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="text-3xl font-bold text-black/85 mb-2">
                    50+
                  </div>
                  <div className="text-gray-700 font-medium">{pageTranslations.countriesServed}</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="text-3xl font-bold text-black/85 mb-2">
                    500+
                  </div>
                  <div className="text-gray-700 font-medium">{pageTranslations.happyClients}</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="text-3xl font-bold text-black/85 mb-2">
                    15+
                  </div>
                  <div className="text-gray-700 font-medium">{pageTranslations.yearsExperience}</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-sky-300 rounded-full animate-bounce delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-blue-300 rounded-full animate-ping delay-500"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl font-bold mb-6 animate-in fade-in slide-in-from-bottom duration-800">
            {language === "ar" ? "ابدأ رحلتك التجارية معنا" : "Start your business journey with us"}
          </h2>
          <p className="text-xl mb-8 opacity-90 animate-in fade-in slide-in-from-bottom delay-300 duration-800">
            {language === "ar" ? "احصل على عرض أسعار مخصص لاحتياجاتك في الاستيراد والتصدير" : "Get a tailored quote for your import and export needs"}
          </p>
          <a
            href="/contact"
            className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 hover:scale-105 transition-all duration-300 animate-in fade-in slide-in-from-bottom delay-600"
          >
            {language === "ar" ? "احصل على عرض أسعار" : "Get a Quote"}
          </a>
        </div>
      </section>
    </div>
  )
}