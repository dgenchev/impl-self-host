#!/bin/bash

# Verify Telegram Webhook Configuration

echo "🔍 Verifying Telegram Webhook"
echo "=============================="
echo ""

if [ -f .env ]; then
    source .env
fi

if [ -z "$TELEGRAM_BOT_TOKEN" ]; then
    echo "📝 Enter your Telegram Bot Token:"
    read -p "Bot Token: " TELEGRAM_BOT_TOKEN
fi

if [ -z "$TELEGRAM_BOT_TOKEN" ]; then
    echo "❌ Bot token is required."
    exit 1
fi

echo ""
echo "📤 Checking webhook info..."
echo ""

RESPONSE=$(curl -s "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getWebhookInfo")

if command -v python3 &> /dev/null; then
    echo "$RESPONSE" | python3 -m json.tool
else
    echo "$RESPONSE"
fi

echo ""
echo "✅ If you see your webhook URL above, everything is configured correctly!"


