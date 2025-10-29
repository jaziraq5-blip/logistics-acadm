"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Ship, Plane, Truck, FileCheck, Shield, Clock, ChevronRight, Globe, Award, TrendingUp } from "lucide-react"

export default function ImportExportPage() {
  const { language } = useLanguage()

  const services = [
    {
      icon: Ship,
      title: language === "ar" ? "الشحن البحري" : "Sea Freight",
      description: language === "ar" ? "خدمات شحن بحري موثوقة مع تغطية عالمية وأسعار تنافسية لجميع أنواع البضائع" : "Reliable sea shipping with global coverage and competitive rates for all cargo types",
      features: language === "ar" ? ["حاويات كاملة وجزئية", "شحن بالجملة", "تتبع مباشر"] : ["Full & partial containers", "Bulk shipping", "Live tracking"]
    },
    {
      icon: Plane,
      title: language === "ar" ? "الشحن الجوي" : "Air Freight",
      description: language === "ar" ? "شحن جوي سريع وآمن للبضائع العاجلة مع ضمان المواعيد والجودة" : "Fast and secure air cargo for urgent goods with guaranteed schedules and quality",
      features: language === "ar" ? ["تسليم سريع", "شحن مبرد", "بضائع خطرة"] : ["Express delivery", "Cold chain", "Dangerous goods"]
    },
    {
      icon: Truck,
      title: language === "ar" ? "النقل البري" : "Land Transport",
      description: language === "ar" ? "شبكة نقل بري متكاملة تغطي جميع المناطق مع خيارات مرنة" : "Integrated land transport network covering all regions with flexible options",
      features: language === "ar" ? ["نقل محلي ودولي", "تخزين مؤقت", "توصيل للباب"] : ["Local & international", "Temporary storage", "Door delivery"]
    },
    {
      icon: FileCheck,
      title: language === "ar" ? "التخليص الجمركي" : "Customs Clearance",
      description: language === "ar" ? "فريق متخصص في الإجراءات الجمركية لضمان سرعة وسهولة التخليص" : "Specialized team in customs procedures ensuring fast and easy clearance",
      features: language === "ar" ? ["إجراءات مبسطة", "استشارات جمركية", "وثائق كاملة"] : ["Simplified procedures", "Customs consulting", "Full documentation"]
    },
    {
      icon: Shield,
      title: language === "ar" ? "التأمين الشامل" : "Comprehensive Insurance",
      description: language === "ar" ? "تغطية تأمينية شاملة للبضائع ضد جميع المخاطر أثناء النقل" : "Full insurance coverage for goods against all risks during transport",
      features: language === "ar" ? ["تأمين شامل", "تعويض سريع", "تغطية عالمية"] : ["Full coverage", "Quick compensation", "Global protection"]
    },
    {
      icon: Clock,
      title: language === "ar" ? "التتبع اللحظي" : "Real-time Tracking",
      description: language === "ar" ? "نظام تتبع متطور يتيح لك مراقبة شحناتك على مدار الساعة" : "Advanced tracking system allowing 24/7 shipment monitoring",
      features: language === "ar" ? ["تحديثات فورية", "إشعارات تلقائية", "تقارير مفصلة"] : ["Instant updates", "Auto notifications", "Detailed reports"]
    },
  ]

  const countries = [
    { name: language === "ar" ? "الإمارات" : "UAE", flag: "🇦🇪" },
    { name: language === "ar" ? "السعودية" : "Saudi Arabia", flag: "🇸🇦" },
    { name: language === "ar" ? "قطر" : "Qatar", flag: "🇶🇦" },
    { name: language === "ar" ? "الكويت" : "Kuwait", flag: "🇰🇼" },
    { name: language === "ar" ? "البحرين" : "Bahrain", flag: "🇧🇭" },
    { name: language === "ar" ? "عمان" : "Oman", flag: "🇴🇲" },
    { name: language === "ar" ? "الأردن" : "Jordan", flag: "🇯🇴" },
    { name: language === "ar" ? "لبنان" : "Lebanon", flag: "🇱🇧" },
    { name: language === "ar" ? "مصر" : "Egypt", flag: "🇪🇬" },
    { name: language === "ar" ? "تركيا" : "Turkey", flag: "🇹🇷" },
    { name: language === "ar" ? "الهند" : "India", flag: "🇮🇳" },
    { name: language === "ar" ? "الصين" : "China", flag: "🇨🇳" },
  ]

  const stats = [
    { icon: Globe, value: "50+", label: language === "ar" ? "دولة نخدمها" : "Countries Served" },
    { icon: Ship, value: "10K+", label: language === "ar" ? "شحنة سنوياً" : "Shipments Yearly" },
    { icon: Award, value: "98%", label: language === "ar" ? "رضا العملاء" : "Client Satisfaction" },
    { icon: TrendingUp, value: "15+", label: language === "ar" ? "سنة خبرة" : "Years Experience" },
  ]

  const processSteps = [
    {
      number: "01",
      title: language === "ar" ? "الاستشارة والتقييم" : "Consultation & Assessment",
      description: language === "ar" ? "نستمع لاحتياجاتكم ونحلل متطلباتكم لوضع أفضل خطة عمل" : "We listen to your needs and analyze requirements for the best action plan"
    },
    {
      number: "02",
      title: language === "ar" ? "التخطيط والتسعير" : "Planning & Pricing",
      description: language === "ar" ? "نضع خطة شاملة مع عرض أسعار تنافسي وشفاف" : "We create a comprehensive plan with competitive and transparent pricing"
    },
    {
      number: "03",
      title: language === "ar" ? "التنفيذ والمتابعة" : "Execution & Monitoring",
      description: language === "ar" ? "ننفذ عملية الشحن مع متابعة دقيقة في كل مرحلة" : "We execute shipping with precise monitoring at every stage"
    },
    {
      number: "04",
      title: language === "ar" ? "التسليم والتقييم" : "Delivery & Evaluation",
      description: language === "ar" ? "نضمن التسليم في الوقت المحدد ونقيم جودة الخدمة" : "We ensure on-time delivery and evaluate service quality"
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-sky-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6 animate-in fade-in slide-in-from-bottom duration-1000">
            {language === "ar" ? "الاستيراد والتصدير" : "Import & Export"}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom delay-300 duration-1000">
            {language === "ar"
              ? "شريكك الموثوق في عمليات الاستيراد والتصدير مع شبكة عالمية واسعة وخدمات متكاملة"
              : "Your trusted partner for import and export with a wide global network and integrated services"}
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="text-center group">
                  <div className="flex justify-center mb-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center group-hover:bg-gray-600 group-hover:scale-110 transition-all duration-300">
                      <Icon className="w-8 h-8 text-gray-600 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                  <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Services Section - Enhanced */}
      <section id="services" className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-6 py-2 bg-gray-100 rounded-full">
              <span className="text-sm font-bold text-gray-900">{language === "ar" ? "ماذا نقدم" : "What We Offer"}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {language === "ar" ? "خدماتنا المتكاملة" : "Our Integrated Services"}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {language === "ar" ? "حلول شاملة لجميع احتياجاتكم اللوجستية" : "Comprehensive solutions for all your logistics needs"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon
              return (
                <Card
                  key={index}
                  className="group hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 border-2 hover:border-gray-200 bg-white overflow-hidden"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-gray-100 transition-colors">
                        <ChevronRight className="w-4 h-4 text-gray-600 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                    <CardTitle className="text-2xl group-hover:text-gray-600 transition-colors duration-300 mb-2">
                      {service.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base text-gray-600 mb-4 leading-relaxed">
                      {service.description}
                    </CardDescription>
                    <div className="space-y-2 pt-4 border-t border-gray-100">
                      {service.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                          <div className="w-1.5 h-1.5 bg-gray-500 rounded-full"></div>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Countries Section - Enhanced */}
     <section className="py-24 bg-white">
  <div className="container mx-auto px-4">
    <div className="text-center mb-16">
      <div className="inline-block mb-4 px-6 py-2 bg-gray-100 rounded-full">
        <span className="text-sm font-bold text-gray-900">
          {language === "ar" ? "شبكتنا العالمية" : "Our Global Network"}
        </span>
      </div>
      <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
        {language === "ar" ? "نغطي أكثر من 50 دولة" : "Covering 50+ Countries"}
      </h2>
      <p className="text-xl text-gray-600">
        {language === "ar"
          ? "شبكة واسعة من الشركاء الموثوقين حول العالم"
          : "Wide network of trusted partners around the world"}
      </p>
    </div>

    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {countries.map((country, index) => (
        <div
          key={index}
          className="group bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl text-center shadow-sm hover:shadow-xl hover:-translate-y-2 border border-gray-100 hover:border-gray-200 transition-all duration-500 cursor-pointer"
        >
          <div
            className="text-4xl mb-3 transition-all duration-500 
                       filter brightness-50 group-hover:brightness-100 
                       group-hover:scale-110"
          >
            {country.flag}
          </div>
          <span className="font-semibold text-gray-800 group-hover:text-gray-600 transition-colors text-sm">
            {country.name}
          </span>
        </div>
      ))}
    </div>

    <div className="text-center mt-12">
      <p className="text-gray-600 text-lg">
        {language === "ar" ? "وأكثر من 40 دولة أخرى..." : "And 40+ more countries..."}
      </p>
    </div>
  </div>
</section>


      {/* Process Section - Enhanced */}
      <section className="py-24 bg-gradient-to-br from-gray-50 via-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-6 py-2 bg-gray-100 rounded-full">
              <span className="text-sm font-bold text-gray-900">{language === "ar" ? "كيف نعمل" : "How We Work"}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {language === "ar" ? "عملية بسيطة وفعالة" : "Simple and Effective Process"}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Connection Lines */}
            <div className="hidden lg:block absolute top-1/4 left-0 right-0 h-1 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"></div>

            {processSteps.map((step, index) => (
              <div key={index} className="relative group">
                <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border-2 border-transparent hover:border-gray-200 h-full">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-600 to-gray-500 rounded-2xl flex items-center justify-center mx-auto shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                      <span className="text-3xl font-bold text-white">{step.number}</span>
                    </div>
                    {index < processSteps.length - 1 && (
                      <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-gray-400 to-transparent"></div>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-gray-600 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-center leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Enhanced */}
      <section className="bg-primary text-primary-foreground py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-gray-300 rounded-full animate-bounce delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gray-300 rounded-full animate-ping delay-500"></div>
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

      <Footer />
    </div>
  )
}