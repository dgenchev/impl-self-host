#!/bin/bash

# Telegram Webhook Setup Script
# This script helps you set up the Telegram webhook after deployment

echo "🔧 Telegram Webhook Setup"
echo "========================="
echo ""

# Check if required tools are available
if ! command -v curl &> /dev/null; then
    echo "❌ curl is not installed. Please install curl first."
    exit 1
fi

# Get bot token
echo "📝 Enter your Telegram Bot Token:"
echo "   (Get it from @BotFather or Netlify environment variables)"
read -p "Bot Token: " BOT_TOKEN

if [ -z "$BOT_TOKEN" ]; then
    echo "❌ Bot token is required."
    exit 1
fi

# Get Netlify site URL
echo ""
echo "📝 Enter your Netlify site URL:"
echo "   (e.g., https://your-site.netlify.app or https://yourdomain.com)"
read -p "Site URL: " SITE_URL

if [ -z "$SITE_URL" ]; then
    echo "❌ Site URL is required."
    exit 1
fi

# Remove trailing slash if present
SITE_URL="${SITE_URL%/}"

# Construct webhook URL
WEBHOOK_URL="${SITE_URL}/.netlify/functions/telegram-webhook"

echo ""
echo "🔗 Webhook URL: $WEBHOOK_URL"
echo ""

# Set webhook
echo "📤 Setting webhook..."
RESPONSE=$(curl -s -X POST "https://api.telegram.org/bot${BOT_TOKEN}/setWebhook" \
  -d "url=${WEBHOOK_URL}")

# Check response
if echo "$RESPONSE" | grep -q '"ok":true'; then
    echo "✅ Webhook set successfully!"
    echo ""
    
    # Verify webhook
    echo "🔍 Verifying webhook..."
    VERIFY_RESPONSE=$(curl -s "https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo")
    
    if echo "$VERIFY_RESPONSE" | grep -q "$WEBHOOK_URL"; then
        echo "✅ Webhook verified!"
        echo ""
        echo "📋 Webhook Info:"
        echo "$VERIFY_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$VERIFY_RESPONSE"
    else
        echo "⚠️  Webhook set but verification failed. Check manually:"
        echo "   curl \"https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo\""
    fi
else
    echo "❌ Failed to set webhook:"
    echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"
    exit 1
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📱 Next steps:"
echo "   1. Wait for a new patient notification"
echo "   2. Click the '👁️ Виж пълния разговор' button"
echo "   3. You should receive the full conversation in Telegram"
echo ""
echo "🧪 Test command:"
echo "   Send '/view <conversation-id>' to your bot to test manually"
echo ""


