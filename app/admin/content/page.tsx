"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAdmin } from "@/contexts/admin-context"
import AdminLayout from "@/components/admin/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Save,
  FileText,
  Globe,
  Home,
  Info,
  Mail
} from "lucide-react"

interface ContentItem {
  id: string
  key: string
  title: string
  titleEn: string
  content: string
  contentEn: string
  category: string
}

const contentItems: ContentItem[] = [
  {
    id: "1",
    key: "heroTitle",
    title: "عنوان البطل الرئيسي",
    titleEn: "Hero Main Title",
    content: "حلول لوجستية متقدمة",
    contentEn: "Advanced Logistics Solutions",
    category: "home"
  },
  {
    id: "2",
    key: "heroSubtitle",
    title: "عنوان البطل الفرعي",
    titleEn: "Hero Subtitle",
    content: "شريكك الموثوق للخدمات اللوجستية والنقل الشاملة في الشرق الأوسط وما بعده",
    contentEn: "Your trusted partner for comprehensive logistics and transportation services across the Middle East and beyond",
    category: "home"
  },
  {
    id: "3",
    key: "heroDescription",
    title: "وصف البطل",
    titleEn: "Hero Description",
    content: "نقدم حلول لوجستية متكاملة تشمل الشحن البحري والجوي والبري والتخليص الجمركي بأعلى معايير الجودة.",
    contentEn: "We provide integrated logistics solutions including sea freight, air freight, land transport, and customs clearance with the highest quality standards.",
    category: "home"
  },
  {
    id: "4",
    key: "companyName",
    title: "اسم الشركة",
    titleEn: "Company Name",
    content: "BLACK SEA STAR",
    contentEn: "BLACK SEA STAR",
    category: "general"
  },
  {
    id: "5",
    key: "companyDescription",
    title: "وصف الشركة",
    titleEn: "Company Description",
    content: "شريكك الموثوق للخدمات اللوجستية والنقل الشاملة",
    contentEn: "Your trusted partner for comprehensive logistics and transportation services",
    category: "general"
  }
]

export default function AdminContent() {
  const { isAuthenticated, loading } = useAdmin()
  const router = useRouter()
  const [content, setContent] = useState<ContentItem[]>(contentItems)
  const [activeTab, setActiveTab] = useState("home")

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/admin/login")
    }
  }, [isAuthenticated, loading, router])

  const handleContentChange = (id: string, field: 'content' | 'contentEn', value: string) => {
    setContent(content.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ))
  }

  const handleSave = () => {
    // هنا يمكنك إرسال البيانات إلى API أو قاعدة البيانات
    alert("تم حفظ التغييرات بنجاح!")
  }

  const getContentByCategory = (category: string) => {
    return content.filter(item => item.category === category)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">إدارة المحتوى</h1>
            <p className="text-gray-600">تحديث النصوص والمحتوى العام للموقع</p>
          </div>
          <Button onClick={handleSave} className="flex items-center space-x-2">
            <Save className="h-4 w-4" />
            <span>حفظ جميع التغييرات</span>
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="home" className="flex items-center space-x-2">
              <Home className="h-4 w-4" />
              <span>الصفحة الرئيسية</span>
            </TabsTrigger>
            <TabsTrigger value="about" className="flex items-center space-x-2">
              <Info className="h-4 w-4" />
              <span>من نحن</span>
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span>اتصل بنا</span>
            </TabsTrigger>
            <TabsTrigger value="general" className="flex items-center space-x-2">
              <Globe className="h-4 w-4" />
              <span>عام</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>محتوى الصفحة الرئيسية</CardTitle>
                <CardDescription>تحديث النصوص والعناوين في الصفحة الرئيسية</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {getContentByCategory("home").map((item) => (
                  <div key={item.id} className="border rounded-lg p-4 space-y-4">
                    <div>
                      <h3 className="font-medium text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-500">{item.titleEn}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`${item.id}-ar`}>النص العربي</Label>
                        <Textarea
                          id={`${item.id}-ar`}
                          value={item.content}
                          onChange={(e) => handleContentChange(item.id, 'content', e.target.value)}
                          rows={3}
                          className="resize-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`${item.id}-en`}>النص الإنجليزي</Label>
                        <Textarea
                          id={`${item.id}-en`}
                          value={item.contentEn}
                          onChange={(e) => handleContentChange(item.id, 'contentEn', e.target.value)}
                          rows={3}
                          className="resize-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="about" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>محتوى صفحة من نحن</CardTitle>
                <CardDescription>تحديث النصوص والعناوين في صفحة من نحن</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">قريباً</h3>
                  <p className="text-gray-600">سيتم إضافة محتوى صفحة من نحن قريباً</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>محتوى صفحة اتصل بنا</CardTitle>
                <CardDescription>تحديث النصوص والعناوين في صفحة اتصل بنا</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">قريباً</h3>
                  <p className="text-gray-600">سيتم إضافة محتوى صفحة اتصل بنا قريباً</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>المحتوى العام</CardTitle>
                <CardDescription>تحديث النصوص العامة في الموقع</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {getContentByCategory("general").map((item) => (
                  <div key={item.id} className="border rounded-lg p-4 space-y-4">
                    <div>
                      <h3 className="font-medium text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-500">{item.titleEn}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`${item.id}-ar`}>النص العربي</Label>
                        <Input
                          id={`${item.id}-ar`}
                          value={item.content}
                          onChange={(e) => handleContentChange(item.id, 'content', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`${item.id}-en`}>النص الإنجليزي</Label>
                        <Input
                          id={`${item.id}-en`}
                          value={item.contentEn}
                          onChange={(e) => handleContentChange(item.id, 'contentEn', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}

