const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.POSTGRES_URL
    }
  }
})

async function updateImagePaths() {
  try {
    console.log('🔄 Updating image paths in database...')
    
    // Get all services with image paths that need to be updated
    const services = await prisma.services.findMany({
      where: {
        OR: [
          { image_url: { startsWith: '/images/' } },
          { image_url: { startsWith: 'images/' } }
        ]
      }
    })

    console.log(`Found ${services.length} services to update`)

    // Update each service
    const updates = services.map(service => {
      const newImageUrl = service.image_url?.replace('/images/', '/uploads/').replace('images/', '/uploads/')
      return prisma.services.update({
        where: { id: service.id },
        data: { image_url: newImageUrl }
      })
    })

    await prisma.$transaction(updates)

    // Show updated services
    const updatedServices = await prisma.services.findMany({
      where: {
        image_url: {
          contains: '/uploads/'
        }
      },
      select: {
        id: true,
        name_en: true,
        image_url: true
      }
    })

    console.log('✅ Successfully updated image paths')
    console.log(`Updated ${updates.length} services`)
    console.log('Updated services:', updatedServices)

  } catch (error) {
    console.error('❌ Error updating image paths:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

updateImagePaths()