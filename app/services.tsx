import { Ship, Plane, Truck, Shield, Globe, Award } from "lucide-react"

const iconMap = {
  ship: Ship,
  plane: Plane,
  truck: Truck,
  shield: Shield,
  globe: Globe,
  award: Award
}

export async function getServices() {
  try {
    const response = await fetch('/api/public/services')
    if (!response.ok) {
      throw new Error('Failed to fetch services')
    }
    const services = await response.json()
    
    return services.map((service: any) => ({
      icon: iconMap[service.icon as keyof typeof iconMap] || Globe,
      title: service.name_en,
      title_ar: service.name_ar,
      description: service.description_en,
      description_ar: service.description_ar,
      features: Array.isArray(service.features) ? service.features : [],
      imageUrl: service.image_url
    }))
  } catch (error) {
    console.error('Error fetching services:', error)
    return []
  }
}