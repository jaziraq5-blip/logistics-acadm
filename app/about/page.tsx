"use client"

import Image from "next/image"
import { Eye, Target, Trophy, Users, Lightbulb } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { useEffect, useState } from "react"

interface TeamMember {
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

export default function AboutPage() {
  const { t, language } = useLanguage()
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadTeamMembers = async () => {
      try {
        const response = await fetch('/api/team')
        if (response.ok) {
          const data = await response.json()
          setTeamMembers(data)
        } else {
          console.error('Failed to load team members')
          setTeamMembers([])
        }
      } catch (error) {
        console.error('Error loading team members:', error)
        setTeamMembers([])
      } finally {
        setIsLoading(false)
      }
    }

    loadTeamMembers()
  }, [])

  const getLocalizedContent = (member: TeamMember, field: 'name' | 'position' | 'bio') => {
    switch (language) {
      case 'ar':
        return member[`${field}_ar` as keyof TeamMember] as string
      case 'ro':
        return member[`${field}_ro` as keyof TeamMember] as string
      default:
        return member[`${field}_en` as keyof TeamMember] as string
    }
  }

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-secondary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-4 animate-in fade-in delay-300 duration-700">
            {t("nav.about")}
          </Badge>
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 animate-in fade-in slide-in-from-bottom delay-500 duration-1000">
            {t("about.title")}
          </h1>
          <p className="text-xl max-w-3xl mx-auto text-primary-foreground/90 animate-in fade-in slide-in-from-bottom delay-700 duration-1000">
            {t("about.subtitle")}
          </p>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-in fade-in slide-in-from-left duration-1000">
              <Badge variant="outline" className="mb-4 animate-in fade-in delay-200 duration-600">
                {t("about.storyTitle")}
              </Badge>
              <h2 className="text-4xl font-bold mb-6 animate-in fade-in slide-in-from-left delay-300 duration-800">
                {t("about.description")}
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p className="animate-in fade-in slide-in-from-left delay-500 duration-700">
                  {t("about.storyDesc1")}
                </p>
                <p className="animate-in fade-in slide-in-from-left delay-700 duration-700">
                  {t("about.storyDesc2")}
                </p>
                <p className="animate-in fade-in slide-in-from-left delay-900 duration-700">
                  {t("about.storyDesc3")}
                </p>
              </div>
            </div>
            <div className="relative animate-in fade-in slide-in-from-right duration-1000 delay-300">
              <Image
                src="/company-building.png"
                alt="Modern logistics company building with trucks and containers showcasing our headquarters"
                width={600}
                height={400}
                className="rounded-lg shadow-lg hover:scale-105 transition-transform duration-500 hover:shadow-xl"
              />
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-gray-100 rounded-full animate-pulse delay-500"></div>
              <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-gray-200 rounded-full animate-bounce delay-1000"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
   <section className="py-20 bg-muted relative overflow-hidden">
  <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/10 backdrop-blur-sm"></div>
  <div className="container mx-auto px-4 relative z-10">
    <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom duration-800">
      <Badge
        variant="outline"
        className="mb-4 animate-in fade-in delay-200 duration-600 border border-black/50 text-white bg-black/30 backdrop-blur-md"
      >
        {t("about.visionMissionTitle")}
      </Badge>
      <h2 className="text-4xl font-bold mb-4 text-white animate-in fade-in slide-in-from-bottom delay-300 duration-800">
        {t("about.whatWeBelieveTitle")}
      </h2>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* بطاقة الرؤية */}
      <Card className="text-center group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 animate-in fade-in slide-in-from-left delay-100 
                      border border-black/60 bg-black/30 backdrop-blur-md 
                      hover:bg-black/40 hover:border-black rounded-2xl overflow-hidden">
        <CardHeader>
          <div className="w-16 h-16 bg-gradient-to-br from-gray-900 to-black rounded-full flex items-center justify-center mx-auto mb-4 
                          group-hover:scale-110 transition-all duration-300 shadow-lg">
            <Eye className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl text-white group-hover:text-gray-100 transition-colors duration-300">
            {t("about.visionTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300 leading-relaxed">{t("about.visionDesc")}</p>
        </CardContent>
      </Card>

      {/* بطاقة الرسالة */}
      <Card className="text-center group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 animate-in fade-in slide-in-from-right delay-200 
                      border border-black/60 bg-black/30 backdrop-blur-md 
                      hover:bg-black/40 hover:border-black rounded-2xl overflow-hidden">
        <CardHeader>
          <div className="w-16 h-16 bg-gradient-to-br from-gray-900 to-black rounded-full flex items-center justify-center mx-auto mb-4 
                          group-hover:scale-110 transition-all duration-300 shadow-lg">
            <Target className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl text-white group-hover:text-gray-100 transition-colors duration-300">
            {t("about.missionTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300 leading-relaxed">{t("about.missionDesc")}</p>
        </CardContent>
      </Card>
    </div>
  </div>
</section>


      {/* Our Values */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom duration-800">
            <Badge variant="outline" className="mb-4 animate-in fade-in delay-200 duration-600">
              {t("about.valuesTitle")}
            </Badge>
            <h2 className="text-4xl font-bold mb-4 animate-in fade-in slide-in-from-bottom delay-300 duration-800">
              {t("about.valuesTitle")}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom delay-500 duration-800">
              {t("about.valuesSubtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center animate-in fade-in slide-in-from-bottom delay-100 duration-700 hover:-translate-y-2 transition-transform duration-300 group">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                <Trophy className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors duration-300">
                {t("about.excellenceTitle")}
              </h3>
              <p className="text-muted-foreground">{t("about.excellenceDesc")}</p>
            </div>

            <div className="text-center animate-in fade-in slide-in-from-bottom delay-200 duration-700 hover:-translate-y-2 transition-transform duration-300 group">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors duration-300">
                {t("about.integrityTitle")}
              </h3>
              <p className="text-muted-foreground">{t("about.integrityDesc")}</p>
            </div>

            <div className="text-center animate-in fade-in slide-in-from-bottom delay-300 duration-700 hover:-translate-y-2 transition-transform duration-300 group">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                <Lightbulb className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors duration-300">
                {t("about.innovationTitle")}
              </h3>
              <p className="text-muted-foreground">{t("about.innovationDesc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      {!isLoading && teamMembers.length > 0 && (
        <section className="py-20 bg-muted">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom duration-800">
              <Badge variant="outline" className="mb-4 animate-in fade-in delay-200 duration-600">
                {t("about.teamTitle")}
              </Badge>
              <h2 className="text-4xl font-bold mb-4 animate-in fade-in slide-in-from-bottom delay-300 duration-800">
                {t("about.teamTitle")}
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom delay-500 duration-800">
                {t("about.teamSubtitle")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <Card key={member.id} className="text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-500 animate-in fade-in slide-in-from-bottom group">
                  <CardHeader>
                    <Image
                      src={member.image_url || "/placeholder-avatar.jpg"}
                      alt={`${getLocalizedContent(member, 'name')}, ${getLocalizedContent(member, 'position')}`}
                      width={128}
                      height={128}
                      className="w-32 h-32 rounded-full mx-auto mb-4 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <CardTitle className="group-hover:text-primary transition-colors duration-300">
                      {getLocalizedContent(member, 'name')}
                    </CardTitle>
                    <p className="text-muted-foreground">{getLocalizedContent(member, 'position')}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{getLocalizedContent(member, 'bio')}</p>
                    <div className="mt-2 text-xs text-muted-foreground">
                      {member.experience_years}+ years experience
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  )
}
