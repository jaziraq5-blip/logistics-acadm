"use client"

import { useLanguage } from "@/contexts/language-context"
import type { Language } from "@/lib/translations"
import { ChevronDown, Globe } from "lucide-react"

const languages = [
  { code: "en" as Language, name: "English", flag: "🇺🇸", nativeName: "English" },
  { code: "ro" as Language, name: "Română", flag: "🇷🇴", nativeName: "Română" },
  { code: "ar" as Language, name: "العربية", flag: "🇸🇦", nativeName: "العربية" },
]

export function LanguageSwitcher() {
  const { language, setLanguage, isRTL } = useLanguage()

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage)
  }

  return (
    <div className="relative language-switcher">
      <div className="flex items-center space-x-2 rtl:space-x-reverse">
        <Globe className="h-4 w-4 text-gray-500" />
        <select
          value={language}
          onChange={(e) => handleLanguageChange(e.target.value as Language)}
          className={`appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer hover:border-gray-400 transition-colors ${
            isRTL ? 'text-right' : 'text-left'
          }`}
          aria-label="Select language"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code} className="bg-white text-gray-900">
              {lang.flag} {lang.nativeName}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </div>
      </div>
    </div>
  )
}
