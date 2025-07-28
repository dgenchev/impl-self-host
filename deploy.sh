#!/bin/bash

# Dr. Genchev Website Deployment Script
# This script helps you deploy your website to GitHub and Netlify

echo "🚀 Dr. Genchev Website Deployment Script"
echo "========================================"

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo "❌ index.html not found. Please run this script from the website directory."
    exit 1
fi

echo "✅ Found website files"

# Ask for GitHub repository URL
echo ""
echo "📝 Please enter your GitHub repository URL:"
echo "   (e.g., https://github.com/yourusername/dr-genchev-website)"
read -p "Repository URL: " REPO_URL

if [ -z "$REPO_URL" ]; then
    echo "❌ Repository URL is required."
    exit 1
fi

# Initialize git repository
echo ""
echo "🔧 Setting up Git repository..."

# Remove existing git if any
rm -rf .git

# Initialize new git repository
git init
git add .
git commit -m "Initial website setup"

# Add remote and push
git branch -M main
git remote add origin "$REPO_URL"
git push -u origin main

echo "✅ Website pushed to GitHub!"

# Instructions for Netlify
echo ""
echo "🎉 Great! Your website is now on GitHub."
echo ""
echo "📋 Next steps to deploy on Netlify:"
echo "   1. Go to https://netlify.com"
echo "   2. Sign up/login with your GitHub account"
echo "   3. Click 'New site from Git'"
echo "   4. Choose GitHub and select your repository"
echo "   5. Click 'Deploy site'"
echo ""
echo "🌐 Your site will be live in a few minutes!"
echo ""
echo "💡 Optional: Add your custom domain in Netlify settings"
echo "   (e.g., dentalimplantsgenchev.com)"
echo ""
echo "📧 Contact form will work automatically with Netlify Forms"
echo "   (100 submissions/month free)"
echo ""
echo "🎯 Benefits of this setup:"
echo "   ✅ $0/month hosting (vs $16-25+/month on Wix)"
echo "   ✅ Faster loading with global CDN"
echo "   ✅ Better SEO and performance"
echo "   ✅ Full control over your code"
echo "   ✅ No platform lock-in"
echo ""
echo "🔗 Your GitHub repository: $REPO_URL"
echo ""
echo "Happy coding! 🚀" 