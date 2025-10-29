"use client"

import { useAdmin } from "@/contexts/admin-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Plus, Edit, Trash2, Package, Truck, Ship, Plane, Box, Map, Compass, ShoppingBag, BarChart, FileText, Building2, Globe, Factory } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ImageUpload } from "@/components/ui/image-upload"

interface Service {
  id: string
  name_en: string
  name_ar: string
  name_ro: string
  description_en: string
  description_ar: string
  description_ro: string
  icon: string
  image_url?: string
  created_at: string
  updated_at: string
}

export default function AdminServicesPage() {
  const { isAuthenticated, loading } = useAdmin()
  const router = useRouter()
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)

  // Services will be loaded from database

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/admin/login")
    }
  }, [isAuthenticated, loading, router])

  useEffect(() => {
    // Load services from database
    const loadServices = async () => {
      try {
        const response = await fetch('/api/services')
        if (response.ok) {
          const data = await response.json()
          console.log('Loaded services from database:', data)
          setServices(data)
        } else {
          console.error('Failed to load services from database')
          setServices([])
        }
      } catch (error) {
        console.error('Error loading services:', error)
        setServices([])
      } finally {
        setIsLoading(false)
      }
    }

    loadServices()
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

  const handleAddService = () => {
    setShowAddForm(true)
  }

  const handleEditService = (service: Service) => {
    setEditingService(service)
  }

  const handleDeleteService = async (serviceId: string) => {
    console.log('Attempting to delete service with ID:', serviceId)
    console.log('Current services:', services)
    
    if (confirm("Are you sure you want to delete this service?")) {
      try {
        const response = await fetch('/api/delete-service/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: serviceId })
        })
        
        console.log('Delete response status:', response.status)
        
        if (response.ok) {
          const result = await response.json()
          console.log('Delete successful:', result)
          
          // Reload services from database to ensure UI is in sync
          const reloadResponse = await fetch('/api/services')
          if (reloadResponse.ok) {
            const updatedServices = await reloadResponse.json()
            setServices(updatedServices)
            console.log('Services reloaded:', updatedServices)
          } else {
            // Fallback to local state update
            setServices(services.filter(s => s.id !== serviceId))
          }
          
          console.log("Service deleted:", serviceId)
          alert("Service deleted successfully!")
        } else {
          const errorData = await response.json()
          console.error('Failed to delete service:', errorData)
          alert(`Failed to delete service: ${errorData.error || 'Unknown error'}`)
        }
      } catch (error) {
        console.error('Error deleting service:', error)
        alert("Error deleting service. Please try again.")
      }
    }
  }

  const handleSubmitService = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const serviceData = {
      name_en: formData.get('name_en') as string,
      name_ar: formData.get('name_ar') as string,
      name_ro: formData.get('name_ro') as string,
      description_en: formData.get('description_en') as string,
      description_ar: formData.get('description_ar') as string,
      description_ro: formData.get('description_ro') as string,
      icon: formData.get('icon') as string,
      image_url: formData.get('image_url') as string
    }

    try {
      let response;
      
      if (editingService) {
        // If editing, send PUT request to update existing service
        response = await fetch(`/api/services/${editingService.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...serviceData, id: editingService.id }),
        })
      } else {
        // If adding new, send POST request
        response = await fetch('/api/services', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(serviceData),
        })
      }

      if (response.ok) {
        const updatedService = await response.json()
        
        if (editingService) {
          // Update the service in the list
          setServices(services.map(service => 
            service.id === editingService.id ? updatedService : service
          ))
          alert('Service updated successfully!')
        } else {
          // Add new service to the list
          setServices([...services, updatedService])
          alert('Service added successfully!')
        }
        
        setShowAddForm(false)
        setEditingService(null)
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'Failed to save service. Please try again.')
      }
    } catch (error) {
      console.error('Error saving service:', error)
      alert('Error saving service. Please try again.')
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
              <h1 className="text-xl font-semibold text-gray-900">Services Management</h1>
            </div>
            <Button onClick={handleAddService}>
              <Plus className="h-4 w-4 mr-2" />
              Add Service
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Company Services</h2>
            <p className="text-gray-600">Manage your logistics services and offerings</p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card key={service.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Package className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-lg">{service.name_en}</CardTitle>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditService(service)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteService(service.id)}
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
                      <p className="text-sm text-gray-900">{service.name_en}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Arabic</Label>
                      <p className="text-sm text-gray-900">{service.name_ar}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Romanian</Label>
                      <p className="text-sm text-gray-900">{service.name_ro}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Description</Label>
                      <p className="text-sm text-gray-600">{service.description_en}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Add/Edit Service Form */}
        {(showAddForm || editingService) && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 z-50">
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <Card className="w-full bg-white shadow-2xl border-2">
                <CardHeader className="bg-gray-50 border-b">
                  <CardTitle className="text-xl font-bold text-gray-900">
                    {editingService ? "Edit Service" : "Add New Service"}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    {editingService ? "Update service information" : "Add a new service to your offerings"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="bg-white p-6">
                  <form className="space-y-6" onSubmit={handleSubmitService}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="name_en" className="text-sm font-medium text-gray-700">Name (English)</Label>
                        <Input
                          id="name_en"
                          name="name_en"
                          defaultValue={editingService?.name_en || ""}
                          placeholder="Service name in English"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="name_ar" className="text-sm font-medium text-gray-700">Name (Arabic)</Label>
                        <Input
                          id="name_ar"
                          name="name_ar"
                          defaultValue={editingService?.name_ar || ""}
                          placeholder="اسم الخدمة بالعربية"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="name_ro" className="text-sm font-medium text-gray-700">Name (Romanian)</Label>
                        <Input
                          id="name_ro"
                          name="name_ro"
                          defaultValue={editingService?.name_ro || ""}
                          placeholder="Numele serviciului în română"
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
                          defaultValue={editingService?.description_en || ""}
                          placeholder="Service description in English"
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="description_ar" className="text-sm font-medium text-gray-700">Description (Arabic)</Label>
                        <Textarea
                          id="description_ar"
                          name="description_ar"
                          defaultValue={editingService?.description_ar || ""}
                          placeholder="وصف الخدمة بالعربية"
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="description_ro" className="text-sm font-medium text-gray-700">Description (Romanian)</Label>
                        <Textarea
                          id="description_ro"
                          name="description_ro"
                          defaultValue={editingService?.description_ro || ""}
                          placeholder="Descrierea serviciului în română"
                          rows={3}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <Label htmlFor="icon" className="text-sm font-medium text-gray-700">Select Icon</Label>
                        <input
                          type="hidden"
                          id="icon"
                          name="icon"
                          value={editingService?.icon || ""}
                          required
                        />
                        <ScrollArea className="h-[200px] border rounded-md p-4">
                          <div className="grid grid-cols-4 gap-4">
                            {[
                              { icon: Truck, name: "Truck" },
                              { icon: Ship, name: "Ship" },
                              { icon: Plane, name: "Plane" },
                              { icon: Box, name: "Box" },
                              { icon: Map, name: "Map" },
                              { icon: Compass, name: "Compass" },
                              { icon: ShoppingBag, name: "ShoppingBag" },
                              { icon: BarChart, name: "BarChart" },
                              { icon: FileText, name: "FileText" },
                              { icon: Building2, name: "Building2" },
                              { icon: Globe, name: "Globe" },
                              { icon: Factory, name: "Factory" },
                              { icon: Package, name: "Package" }
                            ].map(({ icon: Icon, name }) => (
                              <Button
                                key={name}
                                type="button"
                                variant={editingService?.icon === name ? "default" : "outline"}
                                className="p-4 flex flex-col items-center gap-2 h-auto aspect-square"
                                onClick={() => {
                                  const iconInput = document.querySelector('input[name="icon"]') as HTMLInputElement;
                                  if (iconInput) {
                                    iconInput.value = name;
                                  }
                                  // Force a re-render to show selected state
                                  setEditingService(prev => prev ? {...prev, icon: name} : null);
                                }}
                              >
                                <Icon className="h-8 w-8" />
                                <span className="text-xs text-center">{name}</span>
                              </Button>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                      </div>
                      <div className="col-span-2">
                        <Label className="text-sm font-medium text-gray-700">Service Image</Label>
                        <input type="hidden" name="image_url" value={editingService?.image_url || ""} />
                        <div className="mt-2">
                          <ImageUpload
                            value={editingService?.image_url || ""}
                            onChange={(url) => {
                              const hiddenInput = document.querySelector('input[name="image_url"]') as HTMLInputElement;
                              if (hiddenInput) {
                                hiddenInput.value = url;
                              }
                            }}
                            className="!mt-0"
                          />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-4 pt-4 border-t">
                      <Button
                        type="button"
                        variant="outline"
                        className="px-6 py-2"
                        onClick={() => {
                          setShowAddForm(false)
                          setEditingService(null)
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {editingService ? "Update Service" : "Add Service"}
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