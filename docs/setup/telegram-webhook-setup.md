# Telegram Webhook Setup

This guide explains how to set up the Telegram webhook to enable the "View Full Conversation" button functionality.

## 🎯 What This Enables

When you receive a patient notification on Telegram, you'll see a button:
- **"👁️ Виж пълния разговор"** (View Full Conversation)

Clicking this button will send you the **complete conversation** directly in Telegram as formatted messages - no browser needed!

## 📋 Prerequisites

- Your site is deployed on Netlify
- Telegram bot is already set up (see `telegram-setup.md`)
- `TELEGRAM_BOT_TOKEN` is configured in Netlify

## 🚀 Setup Steps

### Step 1: Deploy Your Site

Make sure your latest code is deployed to Netlify (the `telegram-webhook.js` function should be included).

### Step 2: Get Your Webhook URL

Your webhook URL will be:
```
https://your-site.netlify.app/.netlify/functions/telegram-webhook
```

Replace `your-site.netlify.app` with your actual Netlify domain.

### Step 3: Set Webhook via Telegram API

You can set the webhook using one of these methods:

#### Method 1: Using curl (Easiest)

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -d "url=https://your-site.netlify.app/.netlify/functions/telegram-webhook"
```

Replace:
- `<YOUR_BOT_TOKEN>` with your actual bot token
- `your-site.netlify.app` with your Netlify domain

#### Method 2: Using Browser

Open this URL in your browser (replace the placeholders):
```
https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=https://your-site.netlify.app/.netlify/functions/telegram-webhook
```

#### Method 3: Using Node.js Script

Create a file `set-webhook.js`:

```javascript
const axios = require('axios');

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || 'YOUR_BOT_TOKEN';
const WEBHOOK_URL = 'https://your-site.netlify.app/.netlify/functions/telegram-webhook';

axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`, {
    url: WEBHOOK_URL
}).then(response => {
    console.log('✅ Webhook set successfully!');
    console.log(response.data);
}).catch(error => {
    console.error('❌ Error:', error.response?.data || error.message);
});
```

Run it:
```bash
node set-webhook.js
```

### Step 4: Verify Webhook

Check if webhook is set correctly:

```bash
curl "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo"
```

You should see:
```json
{
  "ok": true,
  "result": {
    "url": "https://your-site.netlify.app/.netlify/functions/telegram-webhook",
    "has_custom_certificate": false,
    "pending_update_count": 0
  }
}
```

## ✅ Testing

1. **Test the button:**
   - Wait for a new patient notification (or trigger one manually)
   - Click the "👁️ Виж пълния разговор" button
   - You should receive the full conversation as formatted Telegram messages

2. **Test the command:**
   - Send `/view <conversation-id>` to your bot
   - Replace `<conversation-id>` with an actual conversation ID
   - You should receive the full conversation

## 🔧 Troubleshooting

### Button doesn't work / No response

1. **Check webhook is set:**
   ```bash
   curl "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo"
   ```

2. **Check Netlify function logs:**
   - Go to Netlify Dashboard → Functions → telegram-webhook
   - Check for any errors

3. **Verify bot token:**
   - Make sure `TELEGRAM_BOT_TOKEN` is set correctly in Netlify
   - Check it matches the token from @BotFather

### "Webhook URL must be HTTPS"

- Make sure your Netlify site uses HTTPS (it should by default)
- Check the URL doesn't have typos

### "Webhook was set, but no updates received"

- Make sure your Netlify function is deployed
- Check the function URL is accessible
- Test the function manually:
  ```bash
  curl -X POST https://your-site.netlify.app/.netlify/functions/telegram-webhook \
    -H "Content-Type: application/json" \
    -d '{"message":{"text":"test","chat":{"id":YOUR_CHAT_ID}}}'
  ```

## 🔄 Updating Webhook

If you need to change the webhook URL or remove it:

**Remove webhook:**
```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/deleteWebhook"
```

**Set new webhook:**
Follow Step 3 above with the new URL.

## 📱 How It Works

1. Patient completes questionnaire → Notification sent to Telegram
2. Notification includes button with `callback_data: "view_conv_<conversation-id>"`
3. You click button → Telegram sends callback query to webhook
4. Webhook function:
   - Fetches conversation from database (decrypts messages)
   - Formats conversation nicely
   - Sends as Telegram messages (splits if too long)
5. You receive full conversation in Telegram! ✅

## 🎉 Benefits

- ✅ **No browser needed** - everything in Telegram
- ✅ **Automatic decryption** - messages are readable
- ✅ **Formatted nicely** - easy to read
- ✅ **Works on mobile** - perfect for on-the-go access
- ✅ **Fast** - no page loading, instant delivery


