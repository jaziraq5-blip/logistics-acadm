import { NextRequest, NextResponse } from 'next/server'
import { ContactMessageModel } from '@/lib/database/models'
import { EmailService } from '@/lib/email'

// POST /api/contact - Submit contact form
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('📧 Contact form submission:', body)

    // Validate required fields
    const { name, email, subject, message, phone, company } = body
    
    if (!name || !email || !subject || !message) {
      return NextResponse.json({
        error: 'Missing required fields',
        details: 'Name, email, subject, and message are required'
      }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({
        error: 'Invalid email format'
      }, { status: 400 })
    }

    // Create contact message in database
    const contactData = {
      first_name: name.trim().split(' ')[0] || name.trim(),
      last_name: name.trim().split(' ').slice(1).join(' ') || '',
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || null,
      company: company?.trim() || null,
      service_type: body.serviceType || null,
      message: message.trim(),
      status: 'new',
      is_read: false
    }

    const contactMessage = await ContactMessageModel.create(contactData)
    console.log('✅ Contact message saved to database:', contactMessage.id)

    // Send email notification to admin
    try {
      const emailSent = await EmailService.sendContactFormNotification({
        name: `${contactData.first_name} ${contactData.last_name}`.trim(),
        email: contactData.email,
        phone: contactData.phone || undefined,
        subject: body.subject || contactData.service_type || 'General Inquiry',
        message: contactData.message
      })
      
      if (emailSent) {
        console.log('✅ Email notification sent to admin')
      } else {
        console.log('⚠️ Email notification failed, but message was saved')
      }
    } catch (emailError) {
      console.error('❌ Email notification error:', emailError)
      // Don't fail the request if email fails
    }

    // Send auto-reply to customer
    try {
      const autoReplySent = await EmailService.sendAutoReply({
        name: `${contactData.first_name} ${contactData.last_name}`.trim(),
        email: contactData.email,
        subject: body.subject || contactData.service_type || 'General Inquiry'
      })
      
      if (autoReplySent) {
        console.log('✅ Auto-reply sent to customer')
      } else {
        console.log('⚠️ Auto-reply failed')
      }
    } catch (autoReplyError) {
      console.error('❌ Auto-reply error:', autoReplyError)
      // Don't fail the request if auto-reply fails
    }

    return NextResponse.json({
      success: true,
      message: 'Contact form submitted successfully',
      id: contactMessage.id
    }, { status: 201 })

  } catch (error) {
    console.error('❌ Contact form submission error:', error)
    
    return NextResponse.json({
      error: 'Failed to submit contact form',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// GET /api/contact - Get contact messages (admin only)
export async function GET(request: NextRequest) {
  try {
    // In a real application, you would check for admin authentication here
    // For now, we'll allow it for development
    
    const messages = await ContactMessageModel.getAll()
    
    return NextResponse.json(messages)
    
  } catch (error) {
    console.error('❌ Error fetching contact messages:', error)
    
    return NextResponse.json({
      error: 'Failed to fetch contact messages',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
