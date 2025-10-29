"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Mail, Phone, Linkedin, Award, Calendar } from "lucide-react"
import Image from "next/image"

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

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadTeamMembers = async () => {
      try {
        const response = await fetch('/api/team')
        if (response.ok) {
          const data = await response.json()
          setTeamMembers(data)
        } else {
          console.error('Failed to load team members')
          setError('Failed to load team members')
        }
      } catch (error) {
        console.error('Error loading team members:', error)
        setError('Error loading team members')
      } finally {
        setIsLoading(false)
      }
    }

    loadTeamMembers()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading team members...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Team</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Users className="h-16 w-16 text-yellow-300" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Our Team
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Meet the experienced professionals behind BLACK SEA STAR's success. 
              Our dedicated team brings together expertise from around the world.
            </p>
          </div>
        </div>
      </div>

      {/* Team Members Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {teamMembers.length === 0 ? (
          <div className="text-center py-16">
            <Users className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Team Members Available</h3>
            <p className="text-gray-600">Team members will be displayed here once they are added.</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Leadership Team
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Our leadership team combines decades of experience in logistics, 
                international trade, and customer service excellence.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member) => (
                <Card key={member.id} className="group hover:shadow-xl transition-all duration-300 border-2 border-gray-200 shadow-xl bg-white overflow-hidden">
                  <CardHeader className="pb-4 bg-gray-50 border-b">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800 border-blue-200">
                        {member.experience_years}+ Years Experience
                      </Badge>
                      <Award className="h-5 w-5 text-yellow-500" />
                    </div>
                    
                    <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {member.name_en}
                    </CardTitle>
                    
                    <div className="space-y-1 text-sm text-gray-700">
                      <p className="font-medium">{member.name_ar}</p>
                      <p className="font-medium">{member.name_ro}</p>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4 bg-white p-6">
                    {/* Team Member Image */}
                    {member.image_url && (
                      <div className="relative h-48 w-full overflow-hidden rounded-lg bg-gray-100 border-2 border-gray-200">
                        <Image
                          src={member.image_url}
                          alt={member.name_en}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                          }}
                        />
                      </div>
                    )}

                    {/* Position */}
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {member.position_en}
                      </h3>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>{member.position_ar}</p>
                        <p>{member.position_ro}</p>
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="text-gray-800 text-sm leading-relaxed font-medium">
                      {member.bio_en}
                    </p>

                    {/* Contact Information */}
                    <div className="space-y-2 pt-4 border-t border-gray-200">
                      {member.email && (
                        <div className="flex items-center text-sm text-gray-700 font-medium">
                          <Mail className="h-4 w-4 mr-2 text-blue-500" />
                          <span>{member.email}</span>
                        </div>
                      )}
                      {member.phone && (
                        <div className="flex items-center text-sm text-gray-700 font-medium">
                          <Phone className="h-4 w-4 mr-2 text-green-500" />
                          <span>{member.phone}</span>
                        </div>
                      )}
                      {member.linkedin_url && (
                        <div className="flex items-center text-sm text-gray-700 font-medium">
                          <Linkedin className="h-4 w-4 mr-2 text-blue-600" />
                          <a 
                            href={member.linkedin_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:text-blue-600 transition-colors"
                          >
                            LinkedIn Profile
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Experience Badge */}
                    <div className="pt-4">
                      <div className="flex items-center justify-center text-sm text-gray-600 bg-gray-100 rounded-lg p-2">
                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="font-medium">{member.experience_years} years of experience</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Summary Stats */}
            <div className="mt-16 bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {teamMembers.length}
                  </div>
                  <div className="text-gray-700 font-medium">Team Members</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {teamMembers.reduce((sum, member) => sum + member.experience_years, 0)}
                  </div>
                  <div className="text-gray-700 font-medium">Total Experience</div>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="text-3xl font-bold text-yellow-600 mb-2">
                    {Math.round(teamMembers.reduce((sum, member) => sum + member.experience_years, 0) / teamMembers.length)}
                  </div>
                  <div className="text-gray-700 font-medium">Average Experience</div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    24/7
                  </div>
                  <div className="text-gray-700 font-medium">Support Available</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h3 className="text-3xl font-bold mb-4">
            Ready to Work With Our Team?
          </h3>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto text-lg">
            Contact our experienced team today to discuss your logistics needs 
            and discover how we can help your business grow.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-medium hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl">
              Contact Our Team
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-colors shadow-lg hover:shadow-xl">
              View Our Services
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
