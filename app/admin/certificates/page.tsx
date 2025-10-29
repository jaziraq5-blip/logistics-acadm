"use client"

import { useAdmin } from "@/contexts/admin-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Plus, Edit, Trash2, Award, Calendar } from "lucide-react"
import { ImageUpload } from "@/components/ui/image-upload"
// Certificate interface
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

// Certificate interface is now imported from storage

export default function AdminCertificatesPage() {
  const { isAuthenticated, loading } = useAdmin()
  const router = useRouter()
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null)

  // Sample data is now handled by localStorage storage

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/admin/login")
    }
  }, [isAuthenticated, loading, router])

  useEffect(() => {
    // Load certificates from database
    const loadCertificates = async () => {
      try {
        const response = await fetch('/api/certificates')
        if (response.ok) {
          const data = await response.json()
          setCertificates(data)
        } else {
          console.error('Failed to load certificates from database')
          setCertificates([])
        }
      } catch (error) {
        console.error('Error loading certificates:', error)
        setCertificates([])
      } finally {
        setIsLoading(false)
      }
    }

    loadCertificates()
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

  const handleAddCertificate = () => {
    setShowAddForm(true)
  }

  const handleEditCertificate = (certificate: Certificate) => {
    setEditingCertificate(certificate)
  }

  const handleDeleteCertificate = async (certificateId: string) => {
    console.log("Delete button clicked for certificate:", certificateId)
    
    if (confirm("Are you sure you want to delete this certificate?")) {
      try {
        const response = await fetch('/api/delete-certificate/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: certificateId })
        })
        
        if (response.ok) {
          setCertificates(certificates.filter(c => c.id !== certificateId))
          console.log("Certificate deleted:", certificateId)
          alert("Certificate deleted successfully!")
        } else {
          const errorData = await response.json()
          console.error('Failed to delete certificate:', errorData)
          alert(`Failed to delete certificate: ${errorData.error || 'Unknown error'}`)
        }
      } catch (error) {
        console.error('Error deleting certificate:', error)
        alert("Error deleting certificate. Please try again.")
      }
    }
  }

  const isExpired = (expiryDate: string) => {
    return new Date(expiryDate) < new Date()
  }

  const isExpiringSoon = (expiryDate: string) => {
    const threeMonthsFromNow = new Date()
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3)
    return new Date(expiryDate) <= threeMonthsFromNow && new Date(expiryDate) > new Date()
  }

  const handleSubmitCertificate = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  const formData = new FormData(e.currentTarget);

  const certificateData = {
    id: editingCertificate?.id || undefined, // ← نضيف الـ id لو كنا نعدل
    name_en: formData.get('name_en') as string || '',
    name_ar: formData.get('name_ar') as string || '',
    name_ro: formData.get('name_ro') as string || '',
    description_en: formData.get('description_en') as string || '',
    description_ar: formData.get('description_ar') as string || '',
    description_ro: formData.get('description_ro') as string || '',
    image_url: formData.get('image_url') as string || '',
    issued_date: formData.get('issued_date') as string || null,
    expiry_date: formData.get('expiry_date') as string || null,
  };

  // التحقق من الحقول المطلوبة
  if (!certificateData.name_en || !certificateData.name_ar || !certificateData.name_ro) {
    alert('Please fill in all name fields (English, Arabic, Romanian)');
    return;
  }

  console.log('Submitting certificate data:', certificateData);

  try {
    const method = editingCertificate ? 'PUT' : 'POST'; // ← تحديد الطريقة
    const url = editingCertificate 
      ? `/api/certificates/${editingCertificate.id}` // ← لو تعديل
      : '/api/certificates'; // ← لو إنشاء جديد

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(certificateData),
    });

    if (response.ok) {
      const updatedCertificate = await response.json();

      if (editingCertificate) {
        // تحديث في الحالة المحلية
        setCertificates(certificates.map(c => 
          c.id === updatedCertificate.id ? updatedCertificate : c
        ));
        alert('Certificate updated successfully!');
      } else {
        setCertificates([...certificates, updatedCertificate]);
        alert('Certificate added successfully!');
      }

      // إغلاق النافذة بعد الحفظ
      setShowAddForm(false);
      setEditingCertificate(null);
    } else {
      const errorData = await response.json();
      console.error('Failed to save certificate:', errorData);
      alert(`Failed to save certificate: ${errorData.error || 'Unknown error'}`);
    }
  } catch (error) {
    console.error('Error saving certificate:', error);
    alert('Error saving certificate. Please try again.');
  }
};


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
              <h1 className="text-xl font-semibold text-gray-900">Certificates Management</h1>
            </div>
            <Button onClick={handleAddCertificate}>
              <Plus className="h-4 w-4 mr-2" />
              Add Certificate
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Company Certificates</h2>
            <p className="text-gray-600">Manage your company certifications and awards</p>
          </div>

          {/* Certificates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((certificate) => (
              <Card key={certificate.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Award className="h-5 w-5 text-yellow-600" />
                      <CardTitle className="text-lg">{certificate.name_en}</CardTitle>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditCertificate(certificate)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteCertificate(certificate.id)}
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
                      <Label className="text-sm font-medium text-gray-500">English</Label>
                      <p className="text-sm text-gray-900">{certificate.name_en}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Arabic</Label>
                      <p className="text-sm text-gray-900">{certificate.name_ar}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Romanian</Label>
                      <p className="text-sm text-gray-900">{certificate.name_ro}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Description</Label>
                      <p className="text-sm text-gray-600">{certificate.description_en}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-500">Issued:</span>
                        <span className="text-sm text-gray-900">{new Date(certificate.issued_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-500">Expires:</span>
                      <span className={`text-sm font-medium ${
                        isExpired(certificate.expiry_date) 
                          ? 'text-red-600' 
                          : isExpiringSoon(certificate.expiry_date) 
                            ? 'text-yellow-600' 
                            : 'text-green-600'
                      }`}>
                        {new Date(certificate.expiry_date).toLocaleDateString()}
                      </span>
                      {isExpired(certificate.expiry_date) && (
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Expired</span>
                      )}
                      {isExpiringSoon(certificate.expiry_date) && !isExpired(certificate.expiry_date) && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Expiring Soon</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

              {/* Add/Edit Certificate Form */}
              {(showAddForm || editingCertificate) && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 z-50">
                  <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                    <Card className="w-full bg-white shadow-2xl border-2">
                <CardHeader className="bg-gray-50 border-b">
                  <CardTitle className="text-xl font-bold text-gray-900">
                    {editingCertificate ? "Edit Certificate" : "Add New Certificate"}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    {editingCertificate ? "Update certificate information" : "Add a new certificate to your company"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="bg-white p-6">
                  <form className="space-y-6" onSubmit={handleSubmitCertificate}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="name_en" className="text-sm font-medium text-gray-700">Name (English)</Label>
                        <Input
                          id="name_en"
                          name="name_en"
                          defaultValue={editingCertificate?.name_en || ""}
                          placeholder="Certificate name in English"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="name_ar" className="text-sm font-medium text-gray-700">Name (Arabic)</Label>
                        <Input
                          id="name_ar"
                          name="name_ar"
                          defaultValue={editingCertificate?.name_ar || ""}
                          placeholder="اسم الشهادة بالعربية"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="name_ro" className="text-sm font-medium text-gray-700">Name (Romanian)</Label>
                        <Input
                          id="name_ro"
                          name="name_ro"
                          defaultValue={editingCertificate?.name_ro || ""}
                          placeholder="Numele certificatului în română"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="description_en" className="text-sm font-medium text-gray-700">Description (English)</Label>
                        <Textarea
                          id="description_en"
                          name="description_en"
                          defaultValue={editingCertificate?.description_en || ""}
                          placeholder="Certificate description in English"
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="description_ar" className="text-sm font-medium text-gray-700">Description (Arabic)</Label>
                        <Textarea
                          id="description_ar"
                          name="description_ar"
                          defaultValue={editingCertificate?.description_ar || ""}
                          placeholder="وصف الشهادة بالعربية"
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="description_ro" className="text-sm font-medium text-gray-700">Description (Romanian)</Label>
                        <Textarea
                          id="description_ro"
                          name="description_ro"
                          defaultValue={editingCertificate?.description_ro || ""}
                          placeholder="Descrierea certificatului în română"
                          rows={3}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                            <Label htmlFor="issued_date" className="text-sm font-medium text-gray-700">Issued Date</Label>
                        <Input
                          id="issued_date"
                          name="issued_date"
                          type="date"
                          defaultValue={editingCertificate?.issued_date || ""}
                        />
                      </div>
                      <div>
                            <Label htmlFor="expiry_date" className="text-sm font-medium text-gray-700">Expiry Date</Label>
                        <Input
                          id="expiry_date"
                          name="expiry_date"
                          type="date"
                          defaultValue={editingCertificate?.expiry_date || ""}
                        />
                      </div>
                    </div>

                    <div>
                      <ImageUpload
                        value={editingCertificate?.image_url || ""}
                        onChange={(url) => {
                          // Update the hidden input when image changes
                          const hiddenInput = document.querySelector('input[name="image_url"]') as HTMLInputElement
                          if (hiddenInput) {
                            hiddenInput.value = url
                          }
                        }}
                        placeholder="/certificates/certificate-name.jpg"
                      />
                      {/* Hidden input to store the image URL for form submission */}
                      <input
                        type="hidden"
                        name="image_url"
                        defaultValue={editingCertificate?.image_url || ""}
                      />
                    </div>

                        <div className="flex justify-end space-x-4 pt-4 border-t">
                          <Button
                            type="button"
                            variant="outline"
                            className="px-6 py-2"
                            onClick={() => {
                              setShowAddForm(false)
                              setEditingCertificate(null)
                            }}
                          >
                            Cancel
                          </Button>
                          <Button 
                            type="submit"
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            {editingCertificate ? "Update Certificate" : "Add Certificate"}
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