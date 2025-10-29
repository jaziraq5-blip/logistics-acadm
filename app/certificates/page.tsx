"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Award, Calendar, Globe, Shield, CheckCircle } from "lucide-react"
import Image from "next/image"
import { useLanguage } from "@/contexts/language-context"

interface Certificate {
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

// Ensure image URL points to the public uploads folder
function normalizeImageUrl(url?: string) {
  if (!url) return undefined
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  let u = url.startsWith('/') ? url : `/${url}`
  if (u.startsWith('/images/')) {
    u = u.replace('/images/', '/uploads/')
  }
  return u
}

// Translation texts for the entire page
const translations = {
  en: {
    headerTitle: "Our Certifications",
    headerDescription: "BLACK SEA STAR is committed to maintaining the highest standards of quality, safety, and environmental responsibility through internationally recognized certifications.",
    sectionTitle: "Quality & Compliance Certifications",
    sectionDescription: "Our certifications demonstrate our commitment to excellence and compliance with international standards in logistics and supply chain management.",
    noCertificatesTitle: "No Certificates Available",
    noCertificatesDescription: "Certificates will be displayed here once they are added.",
    expired: "Expired",
    expiringSoon: "Expiring Soon",
    valid: "Valid",
    issued: "Issued",
    expires: "Expires",
    certificateExpired: "Certificate Expired",
    expiresSoonText: "Expires Soon",
    validCertificate: "Valid Certificate",
    totalCertifications: "Total Certifications",
    validCertificates: "Valid Certificates",
    expiringSoonCount: "Expiring Soon",
    footerTitle: "Trusted by International Standards",
    footerDescription: "Our certifications ensure that we meet the highest international standards for quality, safety, and environmental responsibility in all our operations.",
    loading: "Loading certificates...",
    errorTitle: "Error Loading Certificates"
  },
  ar: {
    headerTitle: "شهاداتنا",
    headerDescription: "تلتزم BLACK SEA STAR بالحفاظ على أعلى معايير الجودة والسلامة والمسؤولية البيئية من خلال الشهادات المعترف بها دولياً.",
    sectionTitle: "شهادات الجودة والامتثال",
    sectionDescription: "تُظهر شهاداتنا التزامنا بالتميز والامتثال للمعايير الدولية في مجال اللوجستيات وإدارة سلسلة التوريد.",
    noCertificatesTitle: "لا توجد شهادات متاحة",
    noCertificatesDescription: "سيتم عرض الشهادات هنا بمجرد إضافتها.",
    expired: "منتهية الصلاحية",
    expiringSoon: "تنتهي قريباً",
    valid: "سارية",
    issued: "تاريخ الإصدار",
    expires: "تاريخ الانتهاء",
    certificateExpired: "شهادة منتهية الصلاحية",
    expiresSoonText: "تنتهي قريباً",
    validCertificate: "شهادة سارية",
    totalCertifications: "إجمالي الشهادات",
    validCertificates: "شهادات سارية",
    expiringSoonCount: "تنتهي قريباً",
    footerTitle: "موثوق بها من قبل المعايير الدولية",
    footerDescription: "تضمن شهاداتنا أننا نلبي أعلى المعايير الدولية للجودة والسلامة والمسؤولية البيئية في جميع عملياتنا.",
    loading: "جاري تحميل الشهادات...",
    errorTitle: "خطأ في تحميل الشهادات"
  },
  ro: {
    headerTitle: "Certificările Noastre",
    headerDescription: "BLACK SEA STAR se angajează să mențină cele mai înalte standarde de calitate, siguranță și responsabilitate față de mediu prin certificări recunoscute la nivel internațional.",
    sectionTitle: "Certificări de Calitate și Conformitate",
    sectionDescription: "Certificările noastre demonstrează angajamentul nostru față de excelență și conformitatea cu standardele internaționale în logistică și managementul lanțului de aprovizionare.",
    noCertificatesTitle: "Niciun certificat disponibil",
    noCertificatesDescription: "Certificatele vor fi afișate aici odată ce sunt adăugate.",
    expired: "Expirat",
    expiringSoon: "Expiră în Curând",
    valid: "Valid",
    issued: "Emis",
    expires: "Expiră",
    certificateExpired: "Certificat Expirat",
    expiresSoonText: "Expiră în Curând",
    validCertificate: "Certificat Valid",
    totalCertifications: "Total Certificări",
    validCertificates: "Certificări Valide",
    expiringSoonCount: "Expiră în Curând",
    footerTitle: "De Încredere prin Standarde Internaționale",
    footerDescription: "Certificările noastre asigură că îndeplinim cele mai înalte standarde internaționale pentru calitate, siguranță și responsabilitate față de mediu în toate operațiunile noastre.",
    loading: "Se încarcă certificatele...",
    errorTitle: "Eroare la încărcarea certificatelor"
  }
}

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // استخدام useLanguage hook
  const { t, language } = useLanguage()

  useEffect(() => {
    const loadCertificates = async () => {
      try {
        const response = await fetch('/api/certificates')
        if (response.ok) {
          const data = await response.json()
          setCertificates(data)
        } else {
          console.error('Failed to load certificates')
          setError('Failed to load certificates')
        }
      } catch (error) {
        console.error('Error loading certificates:', error)
        setError('Error loading certificates')
      } finally {
        setIsLoading(false)
      }
    }

    loadCertificates()
  }, [])

  // Helper functions
  const isExpired = (expiryDate: string) => {
    return new Date(expiryDate) < new Date()
  }

  const isExpiringSoon = (expiryDate: string) => {
    const threeMonthsFromNow = new Date()
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3)
    return new Date(expiryDate) <= threeMonthsFromNow && new Date(expiryDate) > new Date()
  }

  const formatDate = (dateString: string) => {
    const locales = {
      en: 'en-US',
      ar: 'ar-EG',
      ro: 'ro-RO'
    }
    return new Date(dateString).toLocaleDateString(locales[language], {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Get certificate name based on language
  const getCertificateName = (certificate: Certificate) => {
    switch (language) {
      case 'ar': return certificate.name_ar
      case 'ro': return certificate.name_ro
      default: return certificate.name_en
    }
  }

  // Get certificate description based on language
  const getCertificateDescription = (certificate: Certificate) => {
    switch (language) {
      case 'ar': return certificate.description_ar
      case 'ro': return certificate.description_ro
      default: return certificate.description_en
    }
  }

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
              <Award className="h-16 w-16 text-gray-300" />
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

      {/* Certificates Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {certificates.length === 0 ? (
          <div className="text-center py-16">
            <Award className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-black/85 mb-2">{pageTranslations.noCertificatesTitle}</h3>
            <p className="text-gray-600">{pageTranslations.noCertificatesDescription}</p>
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
              {certificates.map((certificate) => (
                <Card key={certificate.id} className="group hover:shadow-xl transition-all duration-300 border-2 border-gray-200 shadow-xl bg-white overflow-hidden hover:border-gray-300">
                  <CardHeader className="pb-4 bg-gray-50 border-b">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Shield className="h-6 w-6 text-black/85" />
                        <Badge 
                          variant={isExpired(certificate.expiry_date) ? "destructive" : 
                                  isExpiringSoon(certificate.expiry_date) ? "secondary" : "default"}
                          className="text-xs bg-gray-100 text-gray-800 border-gray-200"
                        >
                          {isExpired(certificate.expiry_date) ? pageTranslations.expired : 
                           isExpiringSoon(certificate.expiry_date) ? pageTranslations.expiringSoon : pageTranslations.valid}
                        </Badge>
                      </div>
                      <CheckCircle className="h-5 w-5 text-gray-500" />
                    </div>
                    
                    <CardTitle className="text-xl font-bold text-black/85 group-hover:text-black/85 transition-colors">
                      {getCertificateName(certificate)}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4 bg-white p-6">
                    {/* Certificate Image */}
                    {certificate.image_url && (
                      <div className="relative h-48 w-full overflow-hidden rounded-lg bg-gray-100 border-2 border-gray-200">
                        <Image
                          src={normalizeImageUrl(certificate.image_url) || '/placeholder.jpg'}
                          alt={getCertificateName(certificate)}
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
                      {getCertificateDescription(certificate)}
                    </p>

                    {/* Dates */}
                    <div className="space-y-2 pt-4 border-t border-gray-200">
                      <div className="flex items-center text-sm text-gray-700 font-medium">
                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="font-semibold">{pageTranslations.issued}:</span>
                        <span className={`${language === 'ar' ? 'mr-2' : 'ml-2'}`}>{formatDate(certificate.issued_date)}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-700 font-medium">
                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="font-semibold">{pageTranslations.expires}:</span>
                        <span className={`${language === 'ar' ? 'mr-2' : 'ml-2'}`}>{formatDate(certificate.expiry_date)}</span>
                      </div>
                    </div>

                    {/* Status Indicator */}
                    <div className="flex items-center justify-center pt-2">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        isExpired(certificate.expiry_date) 
                          ? 'bg-red-100 text-red-800 border border-red-200' 
                          : isExpiringSoon(certificate.expiry_date)
                          ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                          : 'bg-green-100 text-green-800 border border-green-200'
                      }`}>
                        {isExpired(certificate.expiry_date) ? (
                          <>
                            <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                            {pageTranslations.certificateExpired}
                          </>
                        ) : isExpiringSoon(certificate.expiry_date) ? (
                          <>
                            <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                            {pageTranslations.expiresSoonText}
                          </>
                        ) : (
                          <>
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            {pageTranslations.validCertificate}
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Summary Stats */}
            <div className="mt-16 bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="text-3xl font-bold text-black/85 mb-2">
                    {certificates.length}
                  </div>
                  <div className="text-gray-700 font-medium">{pageTranslations.totalCertifications}</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {certificates.filter(c => !isExpired(c.expiry_date) && !isExpiringSoon(c.expiry_date)).length}
                  </div>
                  <div className="text-gray-700 font-medium">{pageTranslations.validCertificates}</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="text-3xl font-bold text-yellow-600 mb-2">
                    {certificates.filter(c => isExpiringSoon(c.expiry_date)).length}
                  </div>
                  <div className="text-gray-700 font-medium">{pageTranslations.expiringSoonCount}</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer CTA */}
      <div className="bg-gradient-to-r from-black/85 via-black/85 to-black/85 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h3 className="text-2xl font-bold mb-4">
            {pageTranslations.footerTitle}
          </h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            {pageTranslations.footerDescription}
          </p>
          <div className="flex justify-center space-x-4">
            <Globe className="h-8 w-8 text-gray-300" />
            <Shield className="h-8 w-8 text-gray-300" />
            <Award className="h-8 w-8 text-gray-300" />
          </div>
        </div>
      </div>
    </div>
  )
}