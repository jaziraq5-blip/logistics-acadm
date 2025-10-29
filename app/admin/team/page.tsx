"use client"

import { useAdmin } from "@/contexts/admin-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Plus, Edit, Trash2, Users, Mail, Phone, Linkedin } from "lucide-react"
import { ImageUpload } from "@/components/ui/image-upload"

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

export default function AdminTeamPage() {
  const { isAuthenticated, loading } = useAdmin()
  const router = useRouter()
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)

  // Sample team members data
  const sampleTeamMembers: TeamMember[] = [
    {
      id: "1",
      name_en: "Ahmed Al-Rashid",
      name_ar: "أحمد الراشد",
      name_ro: "Ahmed Al-Rashid",
      position_en: "Chief Executive Officer",
      position_ar: "الرئيس التنفيذي",
      position_ro: "Director General",
      bio_en: "15+ years experience in logistics and supply chain management. Expert in international trade and business development.",
      bio_ar: "أكثر من 15 عامًا من الخبرة في اللوجستيات وإدارة سلسلة التوريد. خبير في التجارة الدولية وتطوير الأعمال.",
      bio_ro: "Peste 15 ani de experiență în logistică și managementul lanțului de aprovizionare. Expert în comerț internațional și dezvoltare de afaceri.",
      email: "ahmed@blacksea-star.com",
      phone: "+40 726 547 699",
      image_url: "/team/ahmed-al-rashid.jpg",
      linkedin_url: "https://linkedin.com/in/ahmed-al-rashid",
      experience_years: 15,
      created_at: "2024-01-01",
      updated_at: "2024-01-01"
    },
    {
      id: "2",
      name_en: "Sarah Johnson",
      name_ar: "سارة جونسون",
      name_ro: "Sarah Johnson",
      position_en: "Chief Operations Officer",
      position_ar: "مدير العمليات",
      position_ro: "Director de Operațiuni",
      bio_en: "Expert in international trade and customs regulations. Specialized in supply chain optimization and process improvement.",
      bio_ar: "خبيرة في التجارة الدولية واللوائح الجمركية. متخصصة في تحسين سلسلة التوريد وتحسين العمليات.",
      bio_ro: "Expertă în comerț internațional și reglementări vamale. Specializată în optimizarea lanțului de aprovizionare și îmbunătățirea proceselor.",
      email: "sarah@blacksea-star.com",
      phone: "+40 791 391 711",
      image_url: "/team/sarah-johnson.jpg",
      linkedin_url: "https://linkedin.com/in/sarah-johnson",
      experience_years: 12,
      created_at: "2024-01-01",
      updated_at: "2024-01-01"
    },
    {
      id: "3",
      name_en: "Mohammed Hassan",
      name_ar: "محمد حسن",
      name_ro: "Mohammed Hassan",
      position_en: "Chief Technology Officer",
      position_ar: "مدير التكنولوجيا",
      position_ro: "Director de Tehnologie",
      bio_en: "Leading digital transformation in logistics operations. Expert in implementing cutting-edge technology solutions.",
      bio_ar: "يقود التحول الرقمي في العمليات اللوجستية. خبير في تنفيذ حلول التكنولوجيا المتطورة.",
      bio_ro: "Conduce transformarea digitală în operațiunile logistice. Expert în implementarea soluțiilor tehnologice de ultimă generație.",
      email: "mohammed@blacksea-star.com",
      phone: "+40 726 547 700",
      image_url: "/team/mohammed-hassan.jpg",
      linkedin_url: "https://linkedin.com/in/mohammed-hassan",
      experience_years: 10,
      created_at: "2024-01-01",
      updated_at: "2024-01-01"
    }
  ]

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/admin/login")
    }
  }, [isAuthenticated, loading, router])

  useEffect(() => {
    // Load team members from database
    const loadTeamMembers = async () => {
      try {
        const response = await fetch('/api/team')
        if (response.ok) {
          const data = await response.json()
          setTeamMembers(data)
        } else {
          console.error('Failed to load team members from database')
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

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const handleBack = () => {
    router.push("/admin/dashboard")
  }

  const handleAddMember = () => {
    setShowAddForm(true)
  }

  const handleEditMember = (member: TeamMember) => {
    setEditingMember(member)
  }

  const handleDeleteMember = async (memberId: string) => {
    if (confirm("Are you sure you want to delete this team member?")) {
      try {
        const response = await fetch('/api/delete-team-member/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: memberId })
        })
        
        if (response.ok) {
          setTeamMembers(teamMembers.filter(m => m.id !== memberId))
          console.log("Team member deleted:", memberId)
          alert("Team member deleted successfully!")
        } else {
          const errorData = await response.json()
          console.error('Failed to delete team member:', errorData)
          alert(`Failed to delete team member: ${errorData.error || 'Unknown error'}`)
        }
      } catch (error) {
        console.error('Error deleting team member:', error)
        alert("Error deleting team member. Please try again.")
      }
    }
  }

  const handleSubmitTeamMember = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const memberData = {
      name_en: formData.get('name_en') as string,
      name_ar: formData.get('name_ar') as string,
      name_ro: formData.get('name_ro') as string,
      position_en: formData.get('position_en') as string,
      position_ar: formData.get('position_ar') as string,
      position_ro: formData.get('position_ro') as string,
      bio_en: formData.get('bio_en') as string,
      bio_ar: formData.get('bio_ar') as string,
      bio_ro: formData.get('bio_ro') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      experience_years: parseInt(formData.get('experience_years') as string),
      image_url: formData.get('image_url') as string,
      linkedin_url: formData.get('linkedin_url') as string,
    }

    try {
      const response = await fetch('/api/team', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(memberData),
      })

      if (response.ok) {
        const newMember = await response.json()
        setTeamMembers([...teamMembers, newMember])
        setShowAddForm(false)
        setEditingMember(null)
        alert('Team member added successfully!')
      } else {
        alert('Failed to add team member. Please try again.')
      }
    } catch (error) {
      console.error('Error adding team member:', error)
      alert('Error adding team member. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">Team Members Management</h1>
            </div>
            <Button onClick={handleAddMember}>
              <Plus className="h-4 w-4 mr-2" />
              Add Team Member
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Team Members</h2>
            <p className="text-gray-600">Manage your team member profiles and information</p>
          </div>

          {/* Team Members Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member) => (
              <Card key={member.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-lg">{member.name_en}</CardTitle>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditMember(member)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteMember(member.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Position</Label>
                      <p className="text-sm text-gray-900">{member.position_en}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Experience</Label>
                      <p className="text-sm text-gray-900">{member.experience_years} years</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{member.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{member.phone}</span>
                    </div>
                    {member.linkedin_url && (
                      <div className="flex items-center space-x-2">
                        <Linkedin className="h-4 w-4 text-blue-600" />
                        <a 
                          href={member.linkedin_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          LinkedIn Profile
                        </a>
                      </div>
                    )}
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Bio</Label>
                      <p className="text-sm text-gray-600 line-clamp-3">{member.bio_en}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Add/Edit Team Member Form */}
          {(showAddForm || editingMember) && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 z-50">
              <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <Card className="w-full bg-white shadow-2xl border-2">
                <CardHeader className="bg-gray-50 border-b">
                  <CardTitle className="text-xl font-bold text-gray-900">
                    {editingMember ? "Edit Team Member" : "Add New Team Member"}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    {editingMember ? "Update team member information" : "Add a new team member to your company"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="bg-white p-6">
                  <form className="space-y-6" onSubmit={handleSubmitTeamMember}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="name_en" className="text-sm font-medium text-gray-700">Name (English)</Label>
                        <Input
                          id="name_en"
                          name="name_en"
                          defaultValue={editingMember?.name_en || ""}
                          placeholder="Full name in English"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="name_ar" className="text-sm font-medium text-gray-700">Name (Arabic)</Label>
                        <Input
                          id="name_ar"
                          name="name_ar"
                          defaultValue={editingMember?.name_ar || ""}
                          placeholder="الاسم الكامل بالعربية"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="name_ro" className="text-sm font-medium text-gray-700">Name (Romanian)</Label>
                        <Input
                          id="name_ro"
                          name="name_ro"
                          defaultValue={editingMember?.name_ro || ""}
                          placeholder="Numele complet în română"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="position_en" className="text-sm font-medium text-gray-700">Position (English)</Label>
                        <Input
                          id="position_en"
                          name="position_en"
                          defaultValue={editingMember?.position_en || ""}
                          placeholder="Job title in English"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="position_ar" className="text-sm font-medium text-gray-700">Position (Arabic)</Label>
                        <Input
                          id="position_ar"
                          name="position_ar"
                          defaultValue={editingMember?.position_ar || ""}
                          placeholder="المسمى الوظيفي بالعربية"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="position_ro" className="text-sm font-medium text-gray-700">Position (Romanian)</Label>
                        <Input
                          id="position_ro"
                          name="position_ro"
                          defaultValue={editingMember?.position_ro || ""}
                          placeholder="Titlul postului în română"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="bio_en">Bio (English)</Label>
                        <Textarea
                          id="bio_en"
                          defaultValue={editingMember?.bio_en || ""}
                          placeholder="Professional bio in English"
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="bio_ar">Bio (Arabic)</Label>
                        <Textarea
                          id="bio_ar"
                          defaultValue={editingMember?.bio_ar || ""}
                          placeholder="السيرة المهنية بالعربية"
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="bio_ro">Bio (Romanian)</Label>
                        <Textarea
                          id="bio_ro"
                          defaultValue={editingMember?.bio_ro || ""}
                          placeholder="Biografia profesională în română"
                          rows={3}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          defaultValue={editingMember?.email || ""}
                          placeholder="email@company.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          defaultValue={editingMember?.phone || ""}
                          placeholder="+40 123 456 789"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="experience_years">Experience (Years)</Label>
                        <Input
                          id="experience_years"
                          type="number"
                          defaultValue={editingMember?.experience_years || ""}
                          placeholder="5"
                        />
                      </div>
                      <div>
                        <ImageUpload
                          value={editingMember?.image_url || ""}
                          onChange={(url) => {
                            // Update the hidden input when image changes
                            const hiddenInput = document.querySelector('input[name="image_url"]') as HTMLInputElement
                            if (hiddenInput) {
                              hiddenInput.value = url
                            }
                          }}
                          placeholder="/team/member-name.jpg"
                        />
                        {/* Hidden input to store the image URL for form submission */}
                        <input
                          type="hidden"
                          name="image_url"
                          defaultValue={editingMember?.image_url || ""}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                      <Input
                        id="linkedin_url"
                        defaultValue={editingMember?.linkedin_url || ""}
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>

                    <div className="flex justify-end space-x-4 pt-4 border-t">
                      <Button
                        type="button"
                        variant="outline"
                        className="px-6 py-2"
                        onClick={() => {
                          setShowAddForm(false)
                          setEditingMember(null)
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {editingMember ? "Update Team Member" : "Add Team Member"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}