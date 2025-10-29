# 🚀 Deployment Guide - Logistics Website

This guide will help you deploy your BLACK SEA STAR logistics website to GitHub Pages using GitHub CLI.

## 📋 Prerequisites

- GitHub account
- GitHub CLI installed
- Node.js 18+ installed
- Git installed

## 🔧 Step-by-Step Deployment

### 1. Install GitHub CLI

```bash
# Windows (using winget)
winget install GitHub.cli

# macOS (using homebrew)
brew install gh

# Linux (Ubuntu/Debian)
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install gh
```

### 2. Authenticate with GitHub

```bash
gh auth login
```

Follow the prompts to authenticate with your GitHub account.

### 3. Initialize Git Repository

```bash
# Initialize git repository (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Logistics website with admin panel"
```

### 4. Create GitHub Repository

```bash
# Create repository on GitHub
gh repo create logistics-website --public --description "BLACK SEA STAR Logistics Website with Admin Panel"

# Add remote origin
git remote add origin https://github.com/YOUR_USERNAME/logistics-website.git

# Push to GitHub
git push -u origin main
```

### 5. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings** tab
3. Scroll down to **Pages** section
4. Under **Source**, select **GitHub Actions**
5. Save the settings

### 6. Deploy

The deployment will happen automatically when you push to the main branch. The GitHub Actions workflow will:

1. Build your Next.js project
2. Export it as static files
3. Deploy to GitHub Pages

## 🌐 Access Your Website

After deployment, your website will be available at:
```
https://YOUR_USERNAME.github.io/logistics-website
```

## 📝 Important Notes

### Static Export Limitations

Since we're using static export for GitHub Pages, some features won't work:

- ❌ **Admin Panel** - Requires server-side functionality
- ❌ **Database Operations** - No server-side database access
- ❌ **API Routes** - No server-side API endpoints
- ❌ **Contact Form** - No server-side form processing

### What Works on GitHub Pages

- ✅ **Public Website** - All public pages work perfectly
- ✅ **Services Page** - Displays services (if data is pre-loaded)
- ✅ **Certificates Page** - Displays certificates (if data is pre-loaded)
- ✅ **Team Page** - Displays team members (if data is pre-loaded)
- ✅ **Contact Page** - Contact form UI (but won't submit)
- ✅ **Multi-language Support** - Language switching works
- ✅ **Responsive Design** - Works on all devices

## 🔄 Alternative Deployment Options

For full functionality including admin panel and database:

### 1. Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### 2. Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

### 3. Railway
```bash
# Install Railway CLI
npm i -g @railway/cli

# Deploy
railway login
railway init
railway up
```

## 🛠️ Development vs Production

### Development (Local)
- Full admin panel functionality
- Database operations
- API routes
- Contact form submissions

### Production (GitHub Pages)
- Static website only
- No admin panel
- No database
- No API routes

## 📞 Support

If you need help with deployment, check:
1. GitHub Actions logs for build errors
2. Browser console for runtime errors
3. Network tab for failed requests

## 🎉 Success!

Once deployed, your logistics website will be live and accessible to the world!
