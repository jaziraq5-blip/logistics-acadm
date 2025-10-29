# Database Setup Guide

This guide will help you set up PostgreSQL database for your BLACK SEA STAR logistics website.

## 🗄️ Database Configuration

### 1. Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/logistics_db"

# For Vercel Database (replace with your actual URL)
# DATABASE_URL="postgres://default:password@ep-xxx.us-east-1.postgres.vercel-storage.com/verceldb"

# Next.js Configuration
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Admin Configuration
ADMIN_EMAIL="admin@blacksea-star.com"
ADMIN_PASSWORD="admin123"

# API Configuration
API_BASE_URL="http://localhost:3000/api"
```

### 2. Vercel Database Setup

1. **Create Vercel Database:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Navigate to your project
   - Go to Storage tab
   - Create a new PostgreSQL database
   - Copy the connection string

2. **Update Environment Variables:**
   - Replace `DATABASE_URL` in `.env.local` with your Vercel database URL
   - Add the same URL to your Vercel project environment variables

## 🚀 Installation & Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Initialize Database

```bash
# Initialize database schema
npm run db:init

# Seed database with initial data
npm run db:seed

# Or run both commands together
npm run db:setup
```

## 📊 Database Schema

The database includes the following tables:

- **users** - Admin user authentication
- **services** - Logistics services (multilingual)
- **certificates** - Company certifications
- **team_members** - Team member profiles
- **contact_messages** - Contact form submissions
- **content_pages** - Dynamic content management
- **analytics** - Website analytics data
- **settings** - Application settings

## 🔐 Default Admin Credentials

After seeding, you can login with:

- **Email:** admin@blacksea-star.com
- **Password:** admin123

## 📝 Available Scripts

- `npm run db:init` - Initialize database schema
- `npm run db:seed` - Seed database with initial data
- `npm run db:setup` - Run both init and seed

## 🌐 Admin Panel Access

Once the database is set up, you can access the admin panel at:

- **Login:** http://localhost:3000/admin/login
- **Dashboard:** http://localhost:3000/admin/dashboard

## 📋 Admin Features

The admin panel includes:

- **Dashboard** - Overview and statistics
- **Services** - Manage logistics services
- **Certificates** - Manage company certifications
- **Team** - Manage team members
- **Content** - Manage website content
- **Messages** - View contact form submissions
- **Analytics** - View website analytics
- **Settings** - Configure application settings

## 🔧 Troubleshooting

### Common Issues:

1. **Connection Error:**
   - Check your `DATABASE_URL` in `.env.local`
   - Ensure your database is running
   - Verify network connectivity

2. **Permission Error:**
   - Ensure your database user has proper permissions
   - Check if the database exists

3. **Schema Error:**
   - Run `npm run db:init` to recreate the schema
   - Check for any existing conflicting tables

### Support:

If you encounter any issues, check the console logs for detailed error messages.

## 🎯 Next Steps

1. Set up your Vercel database
2. Update environment variables
3. Run database setup scripts
4. Access admin panel
5. Customize your content

Your logistics website is now ready with a fully functional database! 🎉
