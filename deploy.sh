#!/bin/bash

# 🚀 Logistics Website Deployment Script
# This script helps deploy your website to GitHub Pages

echo "🚀 Starting deployment process..."

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI is not installed. Please install it first:"
    echo "   Windows: winget install GitHub.cli"
    echo "   macOS: brew install gh"
    echo "   Linux: See https://cli.github.com/manual/installation"
    exit 1
fi

# Check if user is authenticated
if ! gh auth status &> /dev/null; then
    echo "🔐 Please authenticate with GitHub first:"
    echo "   gh auth login"
    exit 1
fi

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing git repository..."
    git init
fi

# Add all files
echo "📝 Adding files to git..."
git add .

# Check if there are changes to commit
if git diff --staged --quiet; then
    echo "ℹ️  No changes to commit."
else
    echo "💾 Committing changes..."
    git commit -m "Deploy: Update logistics website $(date '+%Y-%m-%d %H:%M:%S')"
fi

# Check if remote exists
if ! git remote get-url origin &> /dev/null; then
    echo "🌐 Creating GitHub repository..."
    gh repo create logistics-website --public --description "BLACK SEA STAR Logistics Website with Admin Panel"
    git remote add origin https://github.com/$(gh api user --jq .login)/logistics-website.git
fi

# Push to GitHub
echo "⬆️  Pushing to GitHub..."
git push -u origin main

echo "✅ Deployment initiated!"
echo "🌐 Your website will be available at:"
echo "   https://$(gh api user --jq .login).github.io/logistics-website"
echo ""
echo "📋 Next steps:"
echo "   1. Go to your repository settings"
echo "   2. Enable GitHub Pages with GitHub Actions source"
echo "   3. Wait for the deployment to complete"
echo ""
echo "⏱️  Deployment usually takes 2-5 minutes."
