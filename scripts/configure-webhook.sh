#!/bin/bash

# Quick Webhook Configuration Script
# Run this after your site is deployed on Netlify

echo "🔧 Telegram Webhook Configuration"
echo "=================================="
echo ""

# Method 1: Get values from environment or prompt
if [ -f .env ]; then
    source .env
fi

# Get bot token
if [ -z "$TELEGRAM_BOT_TOKEN" ]; then
    echo "📝 Enter your Telegram Bot Token:"
    echo "   (Find it in Netlify → Site settings → Environment variables)"
    echo "   Or get it from @BotFather on Telegram"
    read -p "Bot Token: " TELEGRAM_BOT_TOKEN
else
    echo "✅ Found bot token in environment"
fi

if [ -z "$TELEGRAM_BOT_TOKEN" ]; then
    echo "❌ Bot token is required."
    exit 1
fi

# Get site URL
if [ -z "$SITE_URL" ]; then
    echo ""
    echo "📝 Enter your Netlify site URL:"
    echo "   Examples:"
    echo "   - https://your-site.netlify.app"
    echo "   - https://yourdomain.com"
    echo ""
    echo "   (Find it in Netlify dashboard → Site overview → Site details)"
    read -p "Site URL: " SITE_URL
else
    echo "✅ Found site URL in environment: $SITE_URL"
fi

if [ -z "$SITE_URL" ]; then
    echo "❌ Site URL is required."
    exit 1
fi

# Remove trailing slash
SITE_URL="${SITE_URL%/}"

# Construct webhook URL
WEBHOOK_URL="${SITE_URL}/.netlify/functions/telegram-webhook"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 Configuration Summary:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Bot Token: ${TELEGRAM_BOT_TOKEN:0:10}... (hidden)"
echo "Site URL: $SITE_URL"
echo "Webhook URL: $WEBHOOK_URL"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

read -p "Continue with webhook setup? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled."
    exit 0
fi

echo ""
echo "📤 Setting webhook..."

# Build JSON payload — include secret_token if TELEGRAM_WEBHOOK_SECRET is set
if [ -n "$TELEGRAM_WEBHOOK_SECRET" ]; then
    PAYLOAD="{\"url\":\"${WEBHOOK_URL}\",\"secret_token\":\"${TELEGRAM_WEBHOOK_SECRET}\"}"
    echo "🔒 Registering with secret token verification enabled"
else
    PAYLOAD="{\"url\":\"${WEBHOOK_URL}\"}"
    echo "⚠️  TELEGRAM_WEBHOOK_SECRET not set — registering without signature verification"
fi

# Set webhook via Telegram API
RESPONSE=$(curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD")

# Check if successful
if echo "$RESPONSE" | grep -q '"ok":true'; then
    echo "✅ Webhook set successfully!"
    echo ""
    
    # Verify webhook
    echo "🔍 Verifying webhook configuration..."
    VERIFY_RESPONSE=$(curl -s "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getWebhookInfo")
    
    # Pretty print if python is available, otherwise just show raw
    if command -v python3 &> /dev/null; then
        echo "$VERIFY_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$VERIFY_RESPONSE"
    else
        echo "$VERIFY_RESPONSE"
    fi
    
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🎉 Setup Complete!"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "📱 How to test:"
    echo "   1. Wait for a new patient notification"
    echo "   2. Click the '👁️ Виж пълния разговор' button"
    echo "   3. You should receive the full conversation in Telegram"
    echo ""
    echo "🧪 Manual test:"
    echo "   Send '/view <conversation-id>' to your bot"
    echo "   (Replace <conversation-id> with an actual ID from a notification)"
    echo ""
    
else
    echo "❌ Failed to set webhook!"
    echo ""
    echo "Error response:"
    if command -v python3 &> /dev/null; then
        echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"
    else
        echo "$RESPONSE"
    fi
    echo ""
    echo "💡 Troubleshooting:"
    echo "   - Check that your Netlify site is deployed"
    echo "   - Verify the function 'telegram-webhook' exists in Netlify"
    echo "   - Make sure your bot token is correct"
    echo "   - Ensure the site URL is accessible (try opening it in browser)"
    exit 1
fi


