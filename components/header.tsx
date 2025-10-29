"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { LanguageSwitcher } from "@/components/language-switcher"
import { Menu, X } from "lucide-react"
import Logo from "@/components/logo"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { t } = useLanguage()

  const menuItems = [
    { href: "/", label: t("nav.home") },
    { href: "/about", label: t("nav.about") },
    { href: "/services", label: t("nav.services") },
    { href: "/import-export", label: t("nav.importExport") },
    { href: "/certificates", label: t("nav.certificates") },
    { href: "/contact", label: t("nav.contact") },
    // { href: "/team", label: t("nav.team") },
  ] as const

  return (
    <header className="w-full bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100 fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8 h-[80px]">
        {/* Logo Section */}
        <Link href="/" className="flex items-center group">
          <Logo size="md" className="group-hover:scale-105 transition-transform duration-300" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1 rtl:space-x-reverse">
          {menuItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href} 
              className="relative px-4 py-2 text-gray-700 hover:text-gray-600 transition-all duration-300 font-medium rounded-lg hover:bg-gray-50 group"
            >
              {item.label}
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gray-600 group-hover:w-3/4 transition-all duration-300"></span>
            </Link>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          {/* Language Switcher */}
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>
          
          {/* CTA Button */}
          <Button 
            size="sm" 
            className="hidden md:flex bg-gray-600 hover:bg-gray-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
          >
            Get Quote
          </Button>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden inline-flex items-center justify-center h-10 w-10 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 py-6 space-y-4">
            <nav className="flex flex-col space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-gray-700 hover:text-gray-600 hover:bg-gray-50 transition-all duration-300 font-medium px-4 py-3 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            
            <div className="pt-4 border-t border-gray-100 space-y-3">
              <div className="px-4">
                <LanguageSwitcher />
              </div>
              <Button 
                className="w-full bg-gray-600 hover:bg-gray-700 text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                Get Quote
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
