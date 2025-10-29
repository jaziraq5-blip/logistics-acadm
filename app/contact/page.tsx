"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import ContactForm from "@/components/contact-form"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { Phone, Mail, MapPin, Clock } from "lucide-react"

export default function ContactPage() {
  const { t } = useLanguage()
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-secondary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-4 animate-in fade-in delay-300 duration-700">
            {t("contact.title")}
          </Badge>
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 animate-in fade-in slide-in-from-bottom delay-500 duration-1000">
            {t("contact.heroTitle")}
          </h1>
          <p className="text-xl max-w-3xl mx-auto text-primary-foreground/90 animate-in fade-in slide-in-from-bottom delay-700 duration-1000">
            {t("contact.heroSubtitle")}
          </p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="animate-in fade-in slide-in-from-left duration-1000">
              <Badge variant="outline" className="mb-4 animate-in fade-in delay-200 duration-600">
                {t("contact.contactFormTitle")}
              </Badge>
              <h2 className="text-3xl font-bold mb-6 animate-in fade-in slide-in-from-left delay-300 duration-800">
                {t("contact.sendMessageTitle")}
              </h2>
              <Card className="hover:shadow-xl transition-all duration-500 animate-in fade-in slide-in-from-left delay-500">
                <CardContent className="p-6">
                  <ContactForm />
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="animate-in fade-in slide-in-from-right duration-1000">
              <Badge variant="outline" className="mb-4 animate-in fade-in delay-200 duration-600">
                {t("contact.contactInfoTitle")}
              </Badge>
              <h2 className="text-3xl font-bold mb-6 animate-in fade-in slide-in-from-right delay-300 duration-800">
                {t("contact.contactDirectlyTitle")}
              </h2>

              <div className="space-y-6">
                <Card className="hover:shadow-xl hover:-translate-y-1 transition-all duration-500 animate-in fade-in slide-in-from-right delay-500 group">
                  <CardHeader>
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                        <Phone className="w-5 h-5 text-primary" />
                      </div>
                      <CardTitle className="group-hover:text-primary transition-colors duration-300">{t("contact.phone")}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-2">{t("contact.callDirectly")}</p>
                    <p className="font-semibold hover:text-primary transition-colors duration-300">+40 726 547 699</p>
                    <p className="font-semibold hover:text-primary transition-colors duration-300">+40 791 391 711</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-xl hover:-translate-y-1 transition-all duration-500 animate-in fade-in slide-in-from-right delay-600 group">
                  <CardHeader>
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                        <Mail className="w-5 h-5 text-primary" />
                      </div>
                      <CardTitle className="group-hover:text-primary transition-colors duration-300">
                        {t("contact.email")}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-2">{t("contact.emailUs")}</p>
                    <p className="font-semibold hover:text-primary transition-colors duration-300">
                      info@blacksea-star.com
                    </p>
                    <p className="font-semibold hover:text-primary transition-colors duration-300">
                      www.blacksea-star.com
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-xl hover:-translate-y-1 transition-all duration-500 animate-in fade-in slide-in-from-right delay-700 group">
                  <CardHeader>
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <CardTitle className="group-hover:text-primary transition-colors duration-300">Location</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-2">Our Office</p>
                    <p className="font-semibold hover:text-primary transition-colors duration-300">
                      📍 București, România
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-xl hover:-translate-y-1 transition-all duration-500 animate-in fade-in slide-in-from-right delay-800 group">
                  <CardHeader>
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                        <Clock className="w-5 h-5 text-primary" />
                      </div>
                      <CardTitle className="group-hover:text-primary transition-colors duration-300">
                        {t("contact.workingHours")}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between hover:translate-x-1 transition-transform duration-200">
                        <span>Sunday - Thursday</span>
                        <span className="font-semibold">8:00 AM - 6:00 PM</span>
                      </div>
                      <div className="flex justify-between hover:translate-x-1 transition-transform duration-200">
                        <span>Friday</span>
                        <span className="font-semibold">Closed</span>
                      </div>
                      <div className="flex justify-between hover:translate-x-1 transition-transform duration-200">
                        <span>Saturday</span>
                        <span className="font-semibold">9:00 AM - 2:00 PM</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom duration-800">
            <Badge variant="outline" className="mb-4 animate-in fade-in delay-200 duration-600">
              {t("contact.locationTitle")}
            </Badge>
            <h2 className="text-3xl font-bold mb-4 animate-in fade-in slide-in-from-bottom delay-300 duration-800">
              {t("contact.visitUsTitle")}
            </h2>
            <p className="text-muted-foreground animate-in fade-in slide-in-from-bottom delay-500 duration-800">
              {t("contact.locationSubtitle")}
            </p>
          </div>

          <div className="bg-background rounded-lg p-4 shadow-lg hover:shadow-xl transition-all duration-500 animate-in fade-in slide-in-from-bottom delay-700">
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center group hover:bg-muted/80 transition-colors duration-300">
              <div className="text-center">
                <div className="w-12 h-12 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="w-12 h-12" />
                </div>
                <p className="text-muted-foreground">{t("contact.interactiveMap")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
