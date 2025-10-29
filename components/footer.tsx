"use client"

import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"

export default function Footer() {
  const { t } = useLanguage()
  let siteSettings: any = null
  if (typeof window !== 'undefined') {
    try {
      siteSettings = JSON.parse(localStorage.getItem('site_settings') || 'null')
    } catch {}
  }

  return (
    <footer className="bg-black/80 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-gray-800 font-bold">L</span>
              </div>
              <span className="font-bold text-lg">{t("footer.companyName")}</span>
            </div>
            <p className="text-gray-100 text-sm leading-relaxed">{t("footer.description")}</p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">{t("footer.quickLinks")}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-100 hover:text-white transition-colors">
                  {t("nav.about")}
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-100 hover:text-white transition-colors">
                  {t("nav.services")}
                </Link>
              </li>
              <li>
                <Link href="/import-export" className="text-gray-100 hover:text-white transition-colors">
                  {t("nav.importExport")}
                </Link>
              </li>
              <li>
                <Link href="/certificates" className="text-gray-100 hover:text-white transition-colors">
                  {t("nav.certificates")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">{t("footer.services")}</h3>
            <ul className="space-y-2">
              <li className="text-gray-100">{t("home.seaFreight")}</li>
              <li className="text-gray-100">{t("home.airFreight")}</li>
              <li className="text-gray-100">{t("home.landTransport")}</li>
              <li className="text-gray-100">{t("home.customsClearance")}</li>
              <li className="text-gray-100">{t("services.warehouseTitle")}</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">{t("footer.contact")}</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <span className="text-gray-300">📍</span>
                <span className="text-gray-100">{siteSettings?.address || 'București, România'}</span>
              </div>
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <span className="text-gray-300">✉️</span>
                <a href={`mailto:${siteSettings?.contactEmail || 'info@blacksea-star.com'}`} className="text-gray-100 hover:text-white transition-colors">{siteSettings?.contactEmail || 'info@blacksea-star.com'}</a>
              </div>
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <span className="text-gray-300">🌐</span>
                <a href={`https://${siteSettings?.website || 'www.blacksea-star.com'}`} target="_blank" rel="noopener noreferrer" className="text-gray-100 hover:text-white transition-colors">{siteSettings?.website || 'www.blacksea-star.com'}</a>
              </div>
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <span className="text-gray-300">📞</span>
                <a href={`tel:${siteSettings?.contactPhone || '+40726547699'}`} className="text-gray-100 hover:text-white transition-colors">{siteSettings?.contactPhone || '+40 726 547 699'}</a>
              </div>
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <span className="text-gray-300">📱</span>
                <a href={`tel:${siteSettings?.contactPhone2 || '+40791391711'}`} className="text-gray-100 hover:text-white transition-colors">{siteSettings?.contactPhone2 || '+40 791 391 711'}</a>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex space-x-4 rtl:space-x-reverse pt-4">
              <span className="text-gray-100 text-sm opacity-75">
                Follow us on social media
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-200 text-sm">
            © 2025 {t("footer.companyName")}. {t("footer.rights")}.
          </p>
        </div>
      </div>
    </footer>
  )
}
