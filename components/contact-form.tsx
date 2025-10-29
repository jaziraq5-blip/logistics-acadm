"use client"

import { useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  company: string
  serviceType: string
  subject: string
  message: string
}

interface FormStatus {
  type: 'idle' | 'loading' | 'success' | 'error'
  message: string
}

export default function ContactForm() {
  const { t } = useLanguage()
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    serviceType: '',
    subject: '',
    message: ''
  })
  const [status, setStatus] = useState<FormStatus>({ type: 'idle', message: '' })

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus({ type: 'loading', message: 'Sending message...' })

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          phone: formData.phone || undefined,
          company: formData.company || undefined,
          subject: formData.subject || `Inquiry about ${formData.serviceType || 'services'}`,
          message: formData.message
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus({ 
          type: 'success', 
          message: 'Thank you! Your message has been sent successfully. We will respond within 24 hours.' 
        })
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          company: '',
          serviceType: '',
          subject: '',
          message: ''
        })
      } else {
        setStatus({ 
          type: 'error', 
          message: data.error || 'Failed to send message. Please try again.' 
        })
      }
    } catch (error) {
      console.error('Contact form error:', error)
      setStatus({ 
        type: 'error', 
        message: 'Network error. Please check your connection and try again.' 
      })
    }
  }

  return (
    <Card className="hover:shadow-xl transition-all duration-500 animate-in fade-in slide-in-from-left delay-500">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 animate-in fade-in slide-in-from-left delay-700 duration-500">
              <Label htmlFor="firstName">{t("contact.firstName")} *</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                placeholder={t("contact.enterFirstName")}
                className="hover:border-primary/50 transition-colors duration-300"
                required
              />
            </div>
            <div className="space-y-2 animate-in fade-in slide-in-from-left delay-800 duration-500">
              <Label htmlFor="lastName">{t("contact.lastName")} *</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                placeholder={t("contact.enterLastName")}
                className="hover:border-primary/50 transition-colors duration-300"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2 animate-in fade-in slide-in-from-left delay-900 duration-500">
            <Label htmlFor="email">{t("contact.email")} *</Label>
            <Input 
              id="email" 
              name="email"
              type="email" 
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder={t("contact.enterEmail")} 
              className="hover:border-primary/50 transition-colors duration-300"
              required
            />
          </div>

          {/* Phone */}
          <div className="space-y-2 animate-in fade-in slide-in-from-left delay-1000 duration-500">
            <Label htmlFor="phone">{t("contact.phone")}</Label>
            <Input 
              id="phone" 
              name="phone"
              type="tel" 
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder={t("contact.enterPhone")} 
              className="hover:border-primary/50 transition-colors duration-300"
            />
          </div>

          {/* Company */}
          <div className="space-y-2 animate-in fade-in slide-in-from-left delay-1100 duration-500">
            <Label htmlFor="company">{t("contact.company")}</Label>
            <Input 
              id="company" 
              name="company"
              value={formData.company}
              onChange={(e) => handleInputChange('company', e.target.value)}
              placeholder={t("contact.enterCompany")} 
              className="hover:border-primary/50 transition-colors duration-300"
            />
          </div>

          {/* Service Type */}
          <div className="space-y-2 animate-in fade-in slide-in-from-left delay-1200 duration-500">
            <Label htmlFor="serviceType">{t("contact.serviceType")}</Label>
            <Select value={formData.serviceType} onValueChange={(value) => handleInputChange('serviceType', value)}>
              <SelectTrigger className="hover:border-primary/50 transition-colors duration-300">
                <SelectValue placeholder={t("contact.chooseService")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sea-freight">{t("contact.seaFreight")}</SelectItem>
                <SelectItem value="air-freight">{t("contact.airFreight")}</SelectItem>
                <SelectItem value="land-transport">{t("contact.landTransport")}</SelectItem>
                <SelectItem value="customs-clearance">{t("contact.customsClearance")}</SelectItem>
                <SelectItem value="import-export">{t("contact.importExport")}</SelectItem>
                <SelectItem value="warehousing">{t("contact.warehousing")}</SelectItem>
                <SelectItem value="other">{t("contact.other")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Subject */}
          <div className="space-y-2 animate-in fade-in slide-in-from-left delay-1300 duration-500">
            <Label htmlFor="subject">Subject</Label>
            <Input 
              id="subject" 
              name="subject"
              value={formData.subject}
              onChange={(e) => handleInputChange('subject', e.target.value)}
              placeholder="Brief description of your inquiry"
              className="hover:border-primary/50 transition-colors duration-300"
            />
          </div>

          {/* Message */}
          <div className="space-y-2 animate-in fade-in slide-in-from-left delay-1400 duration-500">
            <Label htmlFor="message">{t("contact.message")} *</Label>
            <Textarea 
              id="message" 
              name="message"
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              placeholder={t("contact.tellUsNeeds")}
              className="min-h-[120px] hover:border-primary/50 transition-colors duration-300 resize-none"
              required
            />
          </div>

          {/* Status Message */}
          {status.type !== 'idle' && (
            <div className={`p-4 rounded-lg flex items-center space-x-2 ${
              status.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
              status.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' :
              'bg-blue-50 text-blue-800 border border-blue-200'
            }`}>
              {status.type === 'success' && <CheckCircle className="h-5 w-5" />}
              {status.type === 'error' && <AlertCircle className="h-5 w-5" />}
              {status.type === 'loading' && <Loader2 className="h-5 w-5 animate-spin" />}
              <span>{status.message}</span>
            </div>
          )}

          {/* Submit Button */}
          <div className="animate-in fade-in slide-in-from-left delay-1500 duration-500">
            <Button 
              type="submit" 
              size="lg" 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 hover:scale-105"
              disabled={status.type === 'loading'}
            >
              {status.type === 'loading' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  {t("contact.sendMessage")} →
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
