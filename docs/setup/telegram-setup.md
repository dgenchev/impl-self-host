# Telegram Bot Setup Guide

This guide will help you create a Telegram bot and configure it to receive dental chatbot notifications.

## 📋 Prerequisites

- A Telegram account
- Access to Telegram on your phone or computer
- 5 minutes of your time

## 🤖 Step 1: Create Your Bot with BotFather

1. **Open Telegram** and search for `@BotFather`
2. **Start a chat** by clicking the START button
3. **Send command**: `/newbot`
4. **Choose a name** for your bot (users will see this):
   ```
   Dr Genchev Dental Assistant
   ```
5. **Choose a username** (must end in 'bot'):
   ```
   DrGenchevDentalBot
   ```
   (If taken, try: `DrGenchevDental_Bot` or `DrGenchevAssistant_Bot`)

6. **BotFather will respond** with:
   - Congratulations message
   - Your bot token: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`
   - **⚠️ IMPORTANT**: Copy this token and save it securely!

## 🔑 Step 2: Get Your Chat ID

Your bot needs to know where to send notifications (your personal Telegram account).

### Method 1: Using IDBot (Easiest)

1. Search for `@userinfobot` in Telegram
2. Start a chat and it will immediately send you your ID
3. Your ID is a number like: `123456789`
4. Copy this number

### Method 2: Using Your Bot

1. Start a chat with your new bot (search for the username you created)
2. Send any message (like "Hello")
3. Open this URL in your browser (replace `YOUR_BOT_TOKEN`):
   ```
   https://api.telegram.org/botYOUR_BOT_TOKEN/getUpdates
   ```
4. You'll see JSON response. Find `"chat":{"id":123456789}`
5. The number is your Chat ID

### Method 3: Using Web Telegram

1. Open https://web.telegram.org
2. Start chat with your bot
3. Look at the URL - it ends with `#/im?p=u123456789`
4. The number after `u` is your Chat ID

## 🔒 Step 3: Save Credentials to Netlify

1. Go to your **Netlify dashboard**
2. Select your site (dr-genchev-website)
3. Click **"Site settings"** → **"Environment variables"**
4. Click **"Add a variable"** and add these:

   **Variable 1:**
   - **Key**: `TELEGRAM_BOT_TOKEN`
   - **Value**: The token from BotFather (e.g., `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

   **Variable 2:**
   - **Key**: `TELEGRAM_CHAT_ID`
   - **Value**: Your chat ID number (e.g., `123456789`)

5. Click **"Save"**

## 🧪 Step 4: Test Your Bot

### Test 1: Send a Test Message

1. Create a test file `test-telegram.js`:
```javascript
const axios = require('axios');

const BOT_TOKEN = 'YOUR_BOT_TOKEN_HERE';
const CHAT_ID = 'YOUR_CHAT_ID_HERE';

axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    chat_id: CHAT_ID,
    text: '🧪 Test message from Dr Genchev Dental Bot!\n\nIf you see this, everything is working! ✅',
    parse_mode: 'Markdown'
}).then(response => {
    console.log('✅ Message sent successfully!');
}).catch(error => {
    console.error('❌ Error:', error.response?.data || error.message);
});
```

2. Run it:
```bash
node test-telegram.js
```

3. You should receive a message on Telegram!

### Test 2: Test with Netlify Function

After deploying your functions, test:
```bash
curl -X POST https://your-site.netlify.app/.netlify/functions/telegram-notify \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
```

## 🎨 Step 5: Customize Your Bot (Optional)

### Add Profile Photo:
1. Chat with @BotFather
2. Send: `/setuserpic`
3. Choose your bot
4. Upload a photo (e.g., tooth/clinic logo)

### Add Description:
1. Chat with @BotFather
2. Send: `/setdescription`
3. Choose your bot
4. Enter:
   ```
   AI assistant for Dr Genchev's dental clinic. 
   Sends notifications about patient inquiries and bookings.
   ```

### Add About Text:
1. Chat with @BotFather
2. Send: `/setabouttext`
3. Choose your bot
4. Enter:
   ```
   Dr Genchev Dental Clinic notification bot
   ```

### Set Commands (Optional):
1. Chat with @BotFather
2. Send: `/setcommands`
3. Choose your bot
4. Enter:
   ```
   start - Start the bot
   help - Show help information
   status - Check system status
   ```

## 📨 What You'll Receive

Once everything is set up, you'll receive:

### Real-Time Notifications (when patient completes form):
```
🦷 Нов Пациент - Попълнена Информация

👤 Име: Иван Петров
📱 Телефон: +359 88 123 4567
📧 Email: ivan@example.com

Резюме на разговора:
Пациентът се интересува от импланти...

🔗 Виж пълния разговор
```

### Daily Summary (6 PM every day):
```
📊 Дневен Резюме - 2024-01-15

Днес имаше 3 разговора:

1. Иван П. (+359 88...) - Интерес към импланти
2. Мария К. - Запитване за цени
3. John S. (+44 77...) - Консултация

Детайли в пълния доклад...
```

### X-Ray Uploads:
```
📷 X-Ray от пациент:
👤 Иван Петров
📱 +359 88 123 4567
🆔 Conversation ID: abc123

[Image attached]
```

## 🔐 Security Best Practices

1. **Never share your bot token** publicly or commit it to Git
2. **Never share your chat ID** (anyone with it can send you messages)
3. **Restrict bot access**: Your bot only works with your specific chat ID
4. **Regenerate token if compromised**:
   - Chat with @BotFather
   - Send: `/revoke`
   - Update Netlify environment variables

## 🛠️ Troubleshooting

### Bot doesn't respond to /start
- Make sure you searched for the correct username
- Check if bot token is correct

### No notifications received
1. Check Netlify function logs for errors
2. Verify environment variables are set correctly
3. Make sure bot token and chat ID match
4. Test with the test script above

### "Forbidden: bot was blocked by the user"
- You may have blocked the bot
- Unblock it in Telegram settings
- Send /start to the bot again

### Messages come from wrong bot
- You might have multiple bots
- Double-check the bot token in Netlify

## 📱 Using Multiple Accounts

If you want notifications on multiple Telegram accounts:

1. Create a Telegram group
2. Add your bot to the group (make it admin)
3. Get the group Chat ID (negative number like `-123456789`)
4. Use the group Chat ID in your environment variables

This way, multiple people can receive notifications!

## 🔄 Maintenance

### Weekly:
- Check that notifications are coming through
- Test with a sample conversation

### Monthly:
- Review notification format (is it helpful?)
- Update bot description if services change

### When Changing Bot:
1. Create new bot with @BotFather
2. Update `TELEGRAM_BOT_TOKEN` in Netlify
3. Redeploy functions
4. Test notifications

## 📊 Bot Limits

Telegram bot limits (free, no restrictions for your use case):
- **Messages**: No limit for your volume
- **File size**: 50MB per file (plenty for X-rays)
- **Rate limit**: 30 messages/second (way more than you need)

## 🎉 You're All Set!

Your Telegram bot is ready to:
- ✅ Receive patient notifications
- ✅ Get daily summaries in Bulgarian
- ✅ Receive X-ray uploads
- ✅ Track all dental inquiries

---

## Next Steps

After completing this setup:
1. ✅ Telegram bot created
2. ✅ Credentials saved to Netlify
3. → Deploy Netlify functions
4. → Test end-to-end flow

**Estimated time**: 5-10 minutes

## 📞 Support

- **Telegram Bot API Docs**: https://core.telegram.org/bots/api
- **BotFather Commands**: Send `/help` to @BotFather
- **Project Issues**: Check your Netlify function logs



