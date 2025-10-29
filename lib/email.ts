// Email service for sending notifications
// This is a simple email service that can be extended with actual email providers

interface EmailData {
  to: string
  subject: string
  html: string
  text?: string
}

export class EmailService {
  private static adminEmail = process.env.ADMIN_EMAIL || 'admin@blacksea-star.com'
  
  static async sendEmail(data: EmailData): Promise<boolean> {
    try {
      console.log('📧 Email would be sent:', {
        to: data.to,
        subject: data.subject,
        // Don't log the full content for privacy
        contentLength: data.html.length
      })
      
      // In a real application, you would integrate with an email service like:
      // - SendGrid
      // - Mailgun
      // - AWS SES
      // - Nodemailer with SMTP
      
      // For now, we'll just log the email details
      // You can replace this with actual email sending logic
      
      return true
    } catch (error) {
      console.error('❌ Failed to send email:', error)
      return false
    }
  }
  
  static async sendContactFormNotification(contactData: {
    name: string
    email: string
    phone?: string
    subject?: string
    message: string
  }): Promise<boolean> {
    const subject = `New Contact Form Submission: ${contactData.subject || 'General Inquiry'}`
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
          New Contact Form Submission
        </h2>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1f2937; margin-top: 0;">Contact Details</h3>
          <p><strong>Name:</strong> ${contactData.name}</p>
          <p><strong>Email:</strong> <a href="mailto:${contactData.email}">${contactData.email}</a></p>
          ${contactData.phone ? `<p><strong>Phone:</strong> <a href="tel:${contactData.phone}">${contactData.phone}</a></p>` : ''}
          <p><strong>Subject:</strong> ${contactData.subject || 'General Inquiry'}</p>
        </div>
        
        <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h3 style="color: #1f2937; margin-top: 0;">Message</h3>
          <p style="white-space: pre-wrap; line-height: 1.6;">${contactData.message}</p>
        </div>
        
        <div style="margin-top: 20px; padding: 15px; background-color: #fef3c7; border-radius: 8px;">
          <p style="margin: 0; color: #92400e;">
            <strong>Action Required:</strong> Please respond to this inquiry as soon as possible.
          </p>
        </div>
        
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 12px;">
          <p>This email was sent from the BLACK SEA STAR contact form.</p>
          <p>Reply directly to this email to respond to the customer.</p>
        </div>
      </div>
    `
    
    const text = `
New Contact Form Submission

Contact Details:
- Name: ${contactData.name}
- Email: ${contactData.email}
${contactData.phone ? `- Phone: ${contactData.phone}` : ''}
- Subject: ${contactData.subject || 'General Inquiry'}

Message:
${contactData.message}

Action Required: Please respond to this inquiry as soon as possible.

This email was sent from the BLACK SEA STAR contact form.
Reply directly to this email to respond to the customer.
    `
    
    return await this.sendEmail({
      to: this.adminEmail,
      subject,
      html,
      text
    })
  }
  
  static async sendAutoReply(contactData: {
    name: string
    email: string
    subject?: string
  }): Promise<boolean> {
    const subject = `Thank you for contacting BLACK SEA STAR`
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
          Thank You for Contacting BLACK SEA STAR
        </h2>
        
        <p>Dear ${contactData.name},</p>
        
        <p>Thank you for reaching out to us regarding "<strong>${contactData.subject || 'your inquiry'}</strong>".</p>
        
        <p>We have received your message and our team will review it carefully. We typically respond to all inquiries within 24 hours during business days.</p>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1f2937; margin-top: 0;">What happens next?</h3>
          <ul style="color: #374151;">
            <li>Our team will review your inquiry</li>
            <li>We'll prepare a detailed response</li>
            <li>You'll receive a reply within 24 hours</li>
          </ul>
        </div>
        
        <p>If you have any urgent matters, please don't hesitate to call us directly.</p>
        
        <div style="margin-top: 30px; padding: 20px; background-color: #1f2937; color: white; border-radius: 8px;">
          <h3 style="margin-top: 0; color: white;">BLACK SEA STAR</h3>
          <p style="margin: 5px 0;">Your trusted partner for comprehensive logistics solutions</p>
          <p style="margin: 5px 0;">📧 Email: info@blacksea-star.com</p>
          <p style="margin: 5px 0;">📞 Phone: +40 21 123 4567</p>
        </div>
      </div>
    `
    
    const text = `
Thank You for Contacting BLACK SEA STAR

Dear ${contactData.name},

Thank you for reaching out to us regarding "${contactData.subject || 'your inquiry'}".

We have received your message and our team will review it carefully. We typically respond to all inquiries within 24 hours during business days.

What happens next?
- Our team will review your inquiry
- We'll prepare a detailed response
- You'll receive a reply within 24 hours

If you have any urgent matters, please don't hesitate to call us directly.

BLACK SEA STAR
Your trusted partner for comprehensive logistics solutions
📧 Email: info@blacksea-star.com
📞 Phone: +40 21 123 4567
    `
    
    return await this.sendEmail({
      to: contactData.email,
      subject,
      html,
      text
    })
  }
}
