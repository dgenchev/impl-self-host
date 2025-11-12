# Phase 5 Testing - Quick Start

## 🚀 Quick Test (5 minutes)

### Step 1: Create Test Conversations

1. **Start server:**
   ```bash
   npm run dev
   ```

2. **Create 2-3 test conversations:**
   - Open http://localhost:8888
   - Chat with AI, complete questionnaire
   - Use different names/phones
   - Optional: Upload a file in one conversation

3. **Tip:** Use different browser tabs or incognito mode for each conversation

### Step 2: Trigger Summary Manually

```bash
# In a new terminal
curl http://localhost:8888/.netlify/functions/daily-summary
```

### Step 3: Check Telegram

**Within 10-15 seconds**, you should receive:

```
📊 Дневен Резюме - 2024-01-15

📈 Общо разговори: 3

[Bulgarian summary of conversations]

_Автоматично генериран доклад от AI асистента._
```

---

## ✅ Success Criteria

- [x] Function runs without errors
- [x] Summary received on Telegram
- [x] Summary is in Bulgarian
- [x] Shows correct conversation count
- [x] Includes patient info

---

## 🧪 Additional Tests

### Test: No Conversations

1. **Clear today's conversations** in Supabase (or wait for a day with none)
2. **Trigger summary:**
   ```bash
   curl http://localhost:8888/.netlify/functions/daily-summary
   ```
3. **Expected:**
   ```
   📊 Дневен Резюме - 2024-01-15
   Днес нямаше разговори с пациенти.
   ```

### Test: Check Response

```bash
curl -v http://localhost:8888/.netlify/functions/daily-summary
```

**Expected response:**
```json
{
  "success": true,
  "message": "Daily summary sent",
  "date": "2024-01-15",
  "conversationCount": 3,
  "timestamp": "2024-01-15T15:00:00.000Z"
}
```

### Test: Verify Schedule (Production)

After deploying:

1. **Check Netlify Dashboard:**
   - Go to Functions → daily-summary
   - Should show "Scheduled" badge
   - Check "Next scheduled run" time

2. **Wait for scheduled time** (5-6 PM Bulgarian time)

3. **Check Telegram** - should receive automatic summary

---

## 🐛 Quick Fixes

**"No summary received"**
- Check function ran (look for 200 response)
- Verify TELEGRAM_BOT_TOKEN
- Verify TELEGRAM_CHAT_ID
- Check you have conversations today in Supabase

**"Summary not in Bulgarian"**
- Check openai-client.js generateDailySummary()
- System prompt should specify Bulgarian
- Test OpenAI API directly

**"Error: conversations is not iterable"**
- Check getTodayConversations() returns array
- Verify Supabase connection
- Check date filtering

**"Function timeout"**
- Too many conversations (>50)
- OpenAI API slow
- Increase timeout in netlify.toml if needed

---

## 📊 Test Data

Create diverse test conversations:

**High-interest patient:**
```
Name: Ivan Petrov
Phone: +359 88 123 4567
Concern: Need implants urgently
Times: Weekday mornings
```

**General inquiry:**
```
Message: "How much do implants cost?"
(No contact info)
```

**With file upload:**
```
Name: Maria Ivanova
Phone: +359 88 987 6543
Uploaded: xray.jpg
```

This gives you a good summary to test!

---

## 🎯 Production Verification

After deployment, verify:

1. **Netlify Dashboard:**
   - Functions → daily-summary
   - Status: "Scheduled"
   - Last execution: Check timestamp
   - Logs: No errors

2. **Daily at 5-6 PM:**
   - Receive summary on Telegram
   - Contains today's conversations
   - Properly formatted in Bulgarian

3. **If no summary:**
   - Check Netlify function logs
   - Verify environment variables
   - Test manual trigger

---

**Once testing passes**: Phase 5 Complete! 🎉

**Next options:**
- Phase 6: GDPR & Privacy Policy (optional)
- Phase 7: Final Testing & Launch











