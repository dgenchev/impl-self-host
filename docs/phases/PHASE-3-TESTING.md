# Phase 3 Testing - Quick Start

## 🚀 Quick Test (10 minutes)

### Prerequisites Check:

```bash
# 1. Verify Telegram env vars
netlify env:list | grep TELEGRAM

# Should see:
# TELEGRAM_BOT_TOKEN
# TELEGRAM_CHAT_ID
```

### 2. Start Telegram Bot:
1. Open Telegram app
2. Search for your bot (username you created with @BotFather)
3. Click **"Start"** or send `/start`
4. Bot should respond

### Step 1: Start Server
```bash
npm run dev
```

### Step 2: Complete Questionnaire

1. Open: http://localhost:8888
2. Scroll to "Ask the AI Dentist"
3. Have this conversation:

```
You: "Hello, I need to book a consultation"
AI: [Asks for name]
You: "John Smith"
AI: [Asks for phone]
You: "+44 7700 900123"
AI: [May ask about concerns]
You: "Need implants for upper jaw"
AI: [May ask about times]
You: "Weekday mornings"
```

### Step 3: Check Telegram

**Within 5-10 seconds**, you should receive:

```
🦷 Нов Пациент - Попълнена Информация

👤 Име: John Smith
📱 Телефон: +44 7700 900123
...
```

### Step 4: Verify Console

Press F12, check console:

**Expected logs:**
```
✅ Patient info collected: [conversation-id]
📱 Triggering Telegram notification for: [conversation-id]
✅ Telegram notification sent successfully
```

---

## ✅ Success Criteria

- [x] Received Telegram notification
- [x] Notification is in Bulgarian
- [x] Patient name is correct
- [x] Phone number is correct
- [x] Summary makes sense

---

## 🐛 Quick Fixes

**"No notification received"**
- Check bot is started (send /start)
- Verify TELEGRAM_CHAT_ID matches @userinfobot
- Check browser console for errors

**"Notification in wrong language"**
- This is a bug in openai-client.js
- Check generateBulgarianSummary() function

**"Missing patient info"**
- Make sure you provided: first name + last name + phone
- Check browser console for "✅ Patient info collected"

**"Duplicate notifications"**
- This is normal if you continue chatting
- Only first completion sends notification

---

## 🧪 Advanced Tests

### Test Bulgarian Conversation:
```
You: "Здравейте, искам консултация"
...
```

### Test Manual Trigger:
```bash
# Get conversation ID from Supabase
curl -X POST http://localhost:8888/.netlify/functions/telegram-notify \
  -H "Content-Type: application/json" \
  -d '{"conversationId": "YOUR-CONVERSATION-ID"}'
```

---

## 📱 Telegram Setup Reminder

If no notifications received:

1. **Find your bot**: Search bot username on Telegram
2. **Start bot**: Click "Start" button
3. **Verify Chat ID**:
   - Chat with @userinfobot
   - Copy your ID
   - Compare with TELEGRAM_CHAT_ID in Netlify

4. **Test bot manually**:
   ```bash
   curl -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
     -d "chat_id=${TELEGRAM_CHAT_ID}" \
     -d "text=Test message"
   ```

---

**Once testing passes**: Ready for Phase 4! 🎉



