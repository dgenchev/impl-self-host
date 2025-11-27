#!/bin/bash

# Helper script to push changes using HTTPS
# This allows the AI agent to push without SSH keys

echo "🚀 Pushing changes to GitHub..."
echo ""

# Get current remote URL
CURRENT_URL=$(git config --get remote.origin.url)

# Check if already using HTTPS
if [[ $CURRENT_URL == https://* ]]; then
    echo "✅ Already using HTTPS"
    git push
else
    echo "📝 Temporarily switching to HTTPS for push..."
    
    # Convert SSH URL to HTTPS
    HTTPS_URL=$(echo $CURRENT_URL | sed 's|git@github.com:|https://github.com/|' | sed 's|\.git$||')
    
    # Temporarily set HTTPS URL
    git remote set-url origin "$HTTPS_URL.git"
    
    echo "📤 Pushing..."
    git push
    
    # Restore SSH URL (user prefers SSH)
    echo "🔄 Restoring SSH URL..."
    git remote set-url origin "$CURRENT_URL"
    
    echo "✅ Done! Remote URL restored to SSH."
fi

