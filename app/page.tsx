"use client"

import Image from "next/image"
import { Globe, Clock, Users, MapPin, TrendingUp, Star, Navigation, Shield, Award } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AnimatedSection } from "@/components/animated-section"
import { useLanguage } from "@/contexts/language-context"
import React from 'react'
import { getServices } from './services'
import Link from "next/link";

interface Service {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  features: string[];
  imageUrl?: string;
}

export default function HomePage() {
  const { t, isRTL } = useLanguage()
  const [services, setServices] = React.useState<Service[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    setLoading(true)
    setError(null)
    
    getServices()
      .then(data => {
        setServices(data.map((service: {
          title: string;
          title_ar: string;
          description: string;
          description_ar: string;
          icon: any;
          features: string[];
          imageUrl?: string;
        }) => ({
          ...service,
          title: isRTL ? service.title_ar : service.title,
          description: isRTL ? service.description_ar : service.description
        })))
      })
      .catch(err => {
        console.error('Error loading services:', err)
        setError(t('errors.failedToLoadServices'))
      })
      .finally(() => {
        setLoading(false)
      })
  }, [isRTL, t])

  const stats = [
    { number: "500+", label: t("home.statsClients"), icon: Users },
    { number: "50+", label: t("home.statsCountries"), icon: MapPin },
    { number: "1000+", label: t("home.statsShipments"), icon: TrendingUp },
    { number: "15+", label: t("home.statsExperience"), icon: Clock }
  ]

  const features = [
    {
      icon: <Globe className="w-5 h-5" />,
      title: t("home.globalNetwork"),
      description: t("home.globalNetworkDesc")
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: t("home.expertTeam"),
      description: t("home.expertTeamDesc")
    },
    {
      icon: <Navigation className="w-5 h-5" />,
      title: t("home.technology"),
      description: t("home.technologyDesc")
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: t("home.support"),
      description: t("home.supportDesc")
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section
  className="relative pt-28 pb-16 text-white overflow-hidden"
  style={{
    background: "linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #2d2d2d 100%)",
  }}
  aria-labelledby="hero-title"
>
  {/* Animated Background Elements */}
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
    <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-gray-600/10 rounded-full blur-3xl"></div>
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gray-500/5 rounded-full blur-3xl"></div>
  </div>

  <div className="container mx-auto px-4 relative z-10">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
      {/* Text Content */}
      <AnimatedSection animation="fade-right" duration={1000}>
        <div className="space-y-5">
          {/* Badge */}
          <AnimatedSection animation="fade-up" delay={300} duration={700}>
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-ping absolute"></div>
                <Star className="w-5 h-5 text-white relative z-10" fill="white" />
              </div>
              <Badge 
                variant="secondary" 
                className="bg-white/20 text-white backdrop-blur-sm border-0 px-3 py-1.5 text-sm hover:bg-white/30 transition-all duration-300"
              >
                {t("home.heroTitle")}
              </Badge>
            </div>
          </AnimatedSection>
          
          {/* Main Heading */}
          <AnimatedSection animation="fade-right" delay={500} duration={1000}>
            <h1 id="hero-title" className="text-3xl lg:text-5xl font-bold leading-snug text-white">
              {t("home.heroSubtitle")}
              <span className="block bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mt-2">
                {t("home.heroTitle")}
              </span>
            </h1>
          </AnimatedSection>
          
          {/* Description */}
          <AnimatedSection animation="fade-right" delay={1000} duration={1000}>
            <p className="text-lg leading-relaxed text-gray-300 max-w-lg">
              {t("home.heroDescription")}
            </p>
          </AnimatedSection>
          
          {/* Buttons */}
          <AnimatedSection animation="fade-up" delay={1200} duration={1000}>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                size="lg"
                className="text-base px-6 py-2.5 bg-white text-black hover:bg-gray-100 hover:scale-105 transition-all duration-300 hover:shadow-xl font-semibold border-0 group"
                aria-label={`${t("common.requestService")} - Get started with our logistics services`}
              >
                {t("common.requestService")}
                <span className="ml-2 transform group-hover:translate-x-1 transition-transform">
                  {isRTL ? "←" : "→"}
                </span>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-base px-6 py-2.5 bg-transparent hover:bg-white/10 hover:scale-105 transition-all duration-300 border-2 border-white text-white backdrop-blur-sm"
                aria-label={`${t("common.learnMore")} - Discover more about our services`}
              >
                {t("common.learnMore")}
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </AnimatedSection>
      
      {/* Image Section */}
      <AnimatedSection animation="fade-left" duration={1000} delay={300}>
        <div className="relative">
         <div className="relative rounded-xl overflow-hidden shadow-xl border border-gray-700/50 max-w-[500px] mx-auto">
  <Image
    src="/warehouse.png"
    alt="Modern logistics warehouse with trucks and containers showing our state-of-the-art facilities"
    width={100}
    height={100}
    className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
    priority
  />
  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent"></div>
</div>

          
          {/* Floating Elements */}
          <div className="absolute -top-3 -right-3 w-16 h-16 bg-white/10 rounded-full animate-pulse backdrop-blur-sm border border-white/20"></div>
          <div className="absolute -bottom-3 -left-3 w-12 h-12 bg-gray-500/20 rounded-full animate-bounce delay-1000 backdrop-blur-sm border border-gray-500/30"></div>
          
          {/* Stats Overlay */}
          <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-4 min-w-[250px] border border-gray-200">
            <div className="flex justify-between items-center">
              <div className="text-center">
                <div className="text-xl font-bold text-gray-900">99%</div>
                <div className="text-xs text-gray-600">{t("home.onTimeDelivery")}</div>
              </div>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="text-center">
                <div className="text-xl font-bold text-gray-900">24/7</div>
                <div className="text-xs text-gray-600">{t("home.support")}</div>
              </div>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="text-center">
                <div className="text-xl font-bold text-gray-900">50+</div>
                <div className="text-xs text-gray-600">{t("home.statsCountries")}</div>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </div>
  </div>
</section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-gray-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <AnimatedSection key={index} animation="fade-up" delay={index * 100} duration={700}>
                <div className="text-center group p-6 rounded-2xl hover:bg-white hover:shadow-xl hover:border hover:border-gray-100 transition-all duration-500">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-900 to-black rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2 group-hover:scale-105 transition-transform duration-300">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-gray-50 to-transparent"></div>
        <div className="container mx-auto px-4">
          <AnimatedSection animation="fade-up" duration={800} className="text-center mb-16">
            <AnimatedSection animation="fade-up" delay={200} duration={600}>
              <Badge variant="outline" className="mb-4 bg-gray-100 text-gray-900 border-gray-300 px-4 py-2">
                {t("home.servicesTitle")}
              </Badge>
            </AnimatedSection>
            <AnimatedSection animation="fade-up" delay={300} duration={800}>
              <h2 className="text-4xl font-bold mb-4 text-gray-900">
                {t("home.servicesTitle")}
              </h2>
            </AnimatedSection>
            <AnimatedSection animation="fade-up" delay={500} duration={800}>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                {t("home.servicesSubtitle")}
              </p>
            </AnimatedSection>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
             <AnimatedSection key={index} animation="fade-up" delay={index * 100} duration={500}>
  <Card className="group hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 h-full 
                   border border-black/10 rounded-2xl 
                   bg-black/10 backdrop-blur-md 
                   hover:bg-black/10 hover:border-black overflow-hidden">
    <CardHeader className="pb-4">
      <div className="w-14 h-14 bg-gradient-to-br from-gray-900 to-black rounded-2xl 
                      flex items-center justify-center mb-4 
                      group-hover:scale-110 group-hover:rotate-3 
                      transition-all duration-300 shadow-lg">
        <service.icon className="w-7 h-7 text-white" />
      </div>
      <CardTitle className="text-xl text-black group-hover:text-gray-700 transition-colors duration-300">
        {service.title}
      </CardTitle>
      <CardDescription className="text-gray-600 leading-relaxed">
        {service.description}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <ul className="space-y-3">
        {service.features.map((feature, featureIndex) => (
          <li 
            key={featureIndex}
            className="flex items-center text-sm text-gray-200 hover:translate-x-2 
                       transition-transform duration-200 group/item"
          >
            <div className="w-5 h-5 bg-gray-800/70 border border-black rounded-full 
                            flex items-center justify-center mr-3 
                            group-hover/item:bg-gray-700 transition-colors duration-200">
              <span className="text-white text-xs">✓</span>
            </div>
            {feature}
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
</AnimatedSection>

            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent"></div>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection animation="fade-right" duration={1000}>
              <div>
                <AnimatedSection animation="fade-up" delay={200} duration={600}>
                  <Badge variant="outline" className="mb-4 bg-gray-100 text-gray-900 border-gray-300 px-4 py-2">
                    {t("home.whyChooseTitle")}
                  </Badge>
                </AnimatedSection>
                <AnimatedSection animation="fade-right" delay={300} duration={800}>
                  <h2 className="text-4xl font-bold mb-6 text-gray-900">
                    {t("home.whyChooseTitle")}
                  </h2>
                </AnimatedSection>
                <div className="space-y-8">
                  {features.map((feature, index) => (
                    <AnimatedSection 
                      key={index}
                      animation="fade-right" 
                      delay={500 + index * 200} 
                      duration={700}
                    >
                      <div className="flex items-start space-x-4 rtl:space-x-reverse group p-4 rounded-2xl hover:bg-white hover:shadow-lg hover:border hover:border-gray-100 transition-all duration-500">
                        <div className="w-12 h-12 bg-gradient-to-br from-gray-900 to-black rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-md">
                          {feature.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2 text-gray-900 group-hover:text-gray-800 transition-colors duration-300">
                            {feature.title}
                          </h3>
                          <p className="text-gray-600 leading-relaxed">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </AnimatedSection>
                  ))}
                </div>
              </div>
            </AnimatedSection>
            
            <AnimatedSection animation="fade-left" duration={1000} delay={300}>
              <div className="relative">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
                  <Image
                    src="/team-office.png"
                    alt="Professional logistics team working in modern office environment"
                    width={600}
                    height={400}
                    className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/30 to-transparent"></div>
                </div>
                
                {/* Floating Card */}
                <div className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 max-w-xs border border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center">
                      <Award className="w-6 h-6 text-gray-900" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{t("home.awardWinning")}</div>
                      <div className="text-sm text-gray-600">{t("home.bestLogistics")}</div>
                    </div>
                  </div>
                </div>
                
                {/* Background Elements */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-gray-100/50 rounded-full animate-pulse backdrop-blur-sm border border-gray-200/50"></div>
                <div className="absolute -bottom-4 -right-8 w-16 h-16 bg-gray-200/50 rounded-full animate-bounce delay-1000 backdrop-blur-sm border border-gray-300/50"></div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* CTA Section */}
 <AnimatedSection animation="fade-up" duration={800}>
  <section
    className="py-20 text-white relative overflow-hidden"
    style={{
      background: "linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #2d2d2d 100%)",
    }}
  >
    {/* Animated Background */}
    <div className="absolute inset-0 opacity-10">
      <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-24 h-24 bg-gray-500 rounded-full animate-bounce delay-1000"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gray-400 rounded-full animate-ping delay-500"></div>
      <div className="absolute bottom-20 right-1/4 w-20 h-20 bg-gray-600 rounded-full animate-pulse delay-700"></div>
    </div>

    <div className="container mx-auto px-4 text-center relative z-10">
      <AnimatedSection animation="fade-up" duration={800}>
        <h2 className="text-4xl font-bold mb-4 text-white">
          {t("home.ctaTitle")}
        </h2>
      </AnimatedSection>
      <AnimatedSection animation="fade-up" delay={300} duration={800}>
        <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-300 leading-relaxed">
          {t("home.ctaSubtitle")}
        </p>
      </AnimatedSection>

      {/* ✅ الأزرار */}
      <AnimatedSection animation="fade-up" delay={600} duration={800}>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {/* زر البدء */}
          <Link href="/contact" passHref>
            <Button
              size="lg"
              className="text-lg px-8 py-3 bg-white text-black hover:bg-gray-100 hover:scale-105 transition-all duration-300 hover:shadow-xl font-semibold border-0 shadow-lg group"
            >
              {t("common.getStarted")}
              <span className="ml-2 transform group-hover:translate-x-1 transition-transform">
                {isRTL ? "←" : "→"}
              </span>
            </Button>
          </Link>

          {/* زر الاتصال */}
          <Link href="/contact" passHref>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-3 bg-transparent hover:bg-white/10 hover:scale-105 transition-all duration-300 border-2 border-white text-white backdrop-blur-sm shadow-lg"
            >
              {t("common.contactUs")}
            </Button>
          </Link>
        </div>
      </AnimatedSection>

      {/* Trust Badges */}
      <AnimatedSection animation="fade-up" delay={900} duration={800}>
        <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-gray-300">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>{t("home.secureReliable")}</span>
          </div>
          <div className="w-px h-6 bg-gray-500/50"></div>
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>24/7 {t("home.support")}</span>
          </div>
          <div className="w-px h-6 bg-gray-500/50"></div>
          <div className="flex items-center space-x-2">
            <Globe className="w-5 h-5" />
            <span>{t("home.globalCoverage")}</span>
          </div>
        </div>
      </AnimatedSection>
    </div>
  </section>
</AnimatedSection>

      <Footer />
    </div>
  )
}