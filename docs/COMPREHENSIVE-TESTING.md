# Comprehensive Testing Guide - All Phases

Complete end-to-end testing of the dental chatbot system.

## 📋 Testing Checklist

### Phase 1: Foundation
- [ ] Database connection works
- [ ] Environment variables loaded
- [ ] All dependencies installed

### Phase 2: Core Chat
- [ ] AI responds to messages
- [ ] Conversation context works
- [ ] Language detection works
- [ ] Language persistence works
- [ ] Patient info extraction works

### Phase 3: Telegram Notifications
- [ ] Real-time notification on questionnaire complete
- [ ] Notification in Bulgarian
- [ ] Patient info included
- [ ] No duplicate notifications

### Phase 4: File Upload
- [ ] File upload UI appears
- [ ] Can select and upload image
- [ ] File sent to Telegram
- [ ] Includes patient context

### Phase 5: Daily Summary
- [ ] Manual trigger works
- [ ] Summary received on Telegram
- [ ] Summary in Bulgarian
- [ ] Shows conversation count

---

## 🚀 Testing Procedure

### Prerequisites Check

```bash
# 1. Verify you're in the right directory
pwd
# Should show: /Users/mik/Projects/dr-genchev-website

# 2. Install dependencies (if not done)
npm install

# 3. Verify environment variables
cat env.example
# Make sure you have .env with real values

# 4. Start server
npm run dev
```

Wait for: **"Server now ready on http://localhost:8888"**

---

## TEST 1: Database Connection ✅

```bash
# In a NEW terminal (keep server running)
curl http://localhost:8888/.netlify/functions/test-db
```

**Expected output:**
```json
{
  "success": true,
  "message": "Database connection test successful!",
  "tests": {
    "create": {"passed": true},
    "retrieve": {"passed": true}
  }
}
```

**If failed:** Check Supabase credentials in .env

---

## TEST 2: Basic AI Chat ✅

1. **Open browser:** http://localhost:8888
2. **Scroll to:** "Ask the AI Dentist" section
3. **Type:** "Hello, I need information about dental implants"
4. **Press:** Enter or click send

**Expected:**
- AI responds within 2-3 seconds
- Response about dental implants
- No errors in browser console (F12)

**If failed:**
- Check OPENAI_API_KEY in .env
- Check browser console for errors
- Verify OpenAI has credits

---

## TEST 3: Conversation Context ✅

Continue the conversation:

5. **Type:** "How much does it cost?"

**Expected:**
- AI responds about implant costs
- References previous message about implants
- Shows it remembers context

6. **Type:** "And how long does the procedure take?"

**Expected:**
- AI answers about procedure duration
- Still contextually aware of implants

**If failed:**
- Check conversationId is being stored (console.log)
- Check messages are being saved to Supabase
- Verify getConversationMessages() works

---

## TEST 4: Language Detection & Persistence ✅

**Open NEW browser tab or incognito window:**

7. Go to: http://localhost:8888
8. **Type in Bulgarian:** "Здравейте, интересувам се от зъбни импланти"

**Expected:**
- AI responds in Bulgarian
- Not English

9. **Type in Bulgarian:** "Колко струва?"

**Expected:**
- AI still responds in Bulgarian
- Language is persistent

10. **Try switching (to test enforcement):**
    Type in English: "What about the price?"

**Expected:**
- AI should respond in Bulgarian (enforcing original language)
- Or handle gracefully

**If failed:**
- Check language detection in ai-chat-enhanced.js
- Verify language stored in conversation
- Check system prompt enforces language

---

## TEST 5: Patient Info Extraction ✅

**Continue conversation (English or Bulgarian):**

11. **Type:** "I want to book a consultation"

**Expected:**
- AI asks for your name

12. **Type:** "John Smith"

**Expected:**
- AI asks for phone number

13. **Type:** "+44 7700 900123"

**Expected:**
- AI may ask about dental concerns

14. **Type:** "I need 2 implants for upper jaw"

**Expected:**
- AI may ask about preferred times

15. **Type:** "Weekday mornings"

**Expected:**
- AI confirms information
- Browser console shows: "✅ Patient info collected"
- **IMPORTANT: Check your Telegram now!**

**If extraction failed:**
- Check browser console for "Patient info collected"
- Check Supabase patient_info table
- Verify extractPatientInfo() in openai-client.js

---

## TEST 6: Telegram Real-Time Notification ✅

**Check your Telegram app:**

**Expected within 10 seconds:**
```
🦷 Нов Пациент - Попълнена Информация

👤 Име: John Smith
📱 Телефон: +44 7700 900123

[Bulgarian summary of conversation]

🆔 Conversation ID: ...
```

**Verify:**
- [ ] Notification received
- [ ] In Bulgarian
- [ ] Patient name correct
- [ ] Phone number correct
- [ ] Summary makes sense

**If failed:**
- Check TELEGRAM_BOT_TOKEN in .env
- Check TELEGRAM_CHAT_ID in .env
- Send /start to your bot on Telegram
- Check function logs for errors
- Test with: curl http://localhost:8888/.netlify/functions/telegram-notify \
  -H "Content-Type: application/json" \
  -d '{"conversationId": "YOUR-ID-FROM-SUPABASE"}'

---

## TEST 7: File Upload ✅

**In the same or new conversation:**

16. **Click the paperclip icon** 📎 (next to text input)

**Expected:**
- File picker opens

17. **Select an image** (JPG or PNG, < 10MB)

**Expected:**
- File preview appears below input
- Shows filename

18. **Click send button**

**Expected:**
- "📎 Uploading filename..." appears
- Changes to "📎 Uploaded filename ✓"
- AI responds: "Thank you for uploading the file..."

19. **Check your Telegram:**

**Expected within 5 seconds:**
```
📷 X-Ray от пациент

👤 John Smith
📱 +44 7700 900123

[Your image attached]
```

**Verify:**
- [ ] Image received
- [ ] Patient info included
- [ ] Can view/download image

**If failed:**
- Check file is < 10MB
- Check file is JPG, PNG, GIF, WebP, or PDF
- Check upload-xray function logs
- Verify conversationId exists

---

## TEST 8: File Upload (Wrong Type) ✅

20. **Click paperclip again**
21. **Try selecting a .txt or .docx file**

**Expected:**
- Alert: "File type not supported..."
- File not uploaded

**Good!** Validation working.

---

## TEST 9: File Upload (Too Large) ✅

If you have a large file (> 10MB):

22. **Try uploading it**

**Expected:**
- Alert: "File is too large. Maximum size is 10MB."
- File not uploaded

**Good!** Size validation working.

---

## TEST 10: Daily Summary ✅

**Trigger the daily summary manually:**

```bash
curl http://localhost:8888/.netlify/functions/daily-summary
```

**Expected response:**
```json
{
  "success": true,
  "message": "Daily summary sent",
  "date": "2024-01-15",
  "conversationCount": 2,
  "timestamp": "..."
}
```

23. **Check your Telegram:**

**Expected within 10-15 seconds:**
```
📊 Дневен Резюме - 2024-01-15

📈 Общо разговори: 2

[Bulgarian summary of today's conversations]

_Автоматично генериран доклад от AI асистента._
```

**Verify:**
- [ ] Summary received
- [ ] In Bulgarian
- [ ] Shows correct conversation count
- [ ] Includes key information

**If failed:**
- Check function response for errors
- Verify getTodayConversations() works
- Check OpenAI API key
- Check Telegram credentials

---

## TEST 11: Database Verification ✅

**Check Supabase dashboard:**

1. Go to: https://supabase.com
2. Open your project
3. Click **"Table Editor"**

**Check conversations table:**
- [ ] Has at least 2 conversations
- [ ] Language field populated (e.g., "en", "bg")
- [ ] Status "active" or "completed"
- [ ] Timestamps correct

**Check messages table:**
- [ ] Has multiple messages
- [ ] content_encrypted field shows encrypted text
- [ ] Both user and assistant messages
- [ ] Timestamps in order

**Check patient_info table:**
- [ ] Has at least 1 entry
- [ ] Fields are encrypted (long strings)
- [ ] notified_dentist = true
- [ ] consent_given_at has timestamp

**Check file_uploads table:**
- [ ] Has file upload record
- [ ] filename, file_size, file_type populated
- [ ] forwarded_to_dentist = true

**Check audit_logs table:**
- [ ] Multiple log entries
- [ ] Actions: created, patient_info_collected, notified, file_uploaded
- [ ] Timestamps correct

---

## TEST 12: No Duplicate Notifications ✅

24. **In the same conversation where you completed questionnaire:**
    Type another message: "Thanks!"

**Expected:**
- AI responds normally
- **NO new Telegram notification**
- Only responds to chat

**Good!** Duplicate prevention working.

---

## TEST 13: Multilingual Bulgarian Conversation ✅

**Open new browser tab/incognito:**

25. Start conversation in Bulgarian:
    - "Здравейте, искам да запазя час"
    - Provide Bulgarian name and phone
    - Complete full questionnaire in Bulgarian

**Expected:**
- [ ] AI responds in Bulgarian throughout
- [ ] Extracts patient info correctly
- [ ] Sends Telegram notification
- [ ] Summary still in Bulgarian for you

---

## 🔍 Common Issues & Fixes

### Issue: "AI not responding"
**Fix:**
- Check OPENAI_API_KEY in .env
- Verify OpenAI account has credits
- Check browser console for errors
- Look at network tab (F12) for 500 errors

### Issue: "No Telegram notifications"
**Fix:**
- Verify bot started (send /start)
- Check TELEGRAM_BOT_TOKEN
- Check TELEGRAM_CHAT_ID (just numbers)
- Test bot manually: https://api.telegram.org/bot{TOKEN}/getMe

### Issue: "File upload fails"
**Fix:**
- Check file size (< 10MB)
- Check file type (image or PDF)
- Verify conversationId exists
- Check browser console

### Issue: "Database errors"
**Fix:**
- Check SUPABASE_URL and SUPABASE_ANON_KEY
- Verify Supabase project is active
- Check tables exist (run SQL schema)
- Test connection with test-db function

### Issue: "Language detection wrong"
**Fix:**
- First message should be clear (5+ words)
- Once detected, it stays consistent
- Check console.log for detected language

---

## ✅ Final Checklist

Before deploying to production:

### Functionality:
- [ ] AI chat works
- [ ] Remembers conversation context
- [ ] Detects and maintains language
- [ ] Extracts patient information
- [ ] Sends real-time Telegram notifications
- [ ] Handles file uploads
- [ ] Sends daily summaries
- [ ] All Telegram messages in Bulgarian

### Data:
- [ ] Messages saved to database (encrypted)
- [ ] Patient info saved (encrypted)
- [ ] File uploads logged
- [ ] Audit logs created

### Security:
- [ ] No API keys in code
- [ ] All in environment variables
- [ ] Data encrypted in database
- [ ] File size/type validation works

### UX:
- [ ] Chat interface responsive
- [ ] File upload UI clear
- [ ] Error messages helpful
- [ ] No console errors

### Telegram:
- [ ] Bot started and responding
- [ ] All notifications received
- [ ] Messages formatted well
- [ ] Patient info accurate

---

## 📊 Test Results Summary

Fill in as you test:

```
✅ Database Connection: PASS / FAIL
✅ Basic AI Chat: PASS / FAIL
✅ Context Memory: PASS / FAIL
✅ Language Detection: PASS / FAIL
✅ Language Persistence: PASS / FAIL
✅ Patient Info Extraction: PASS / FAIL
✅ Real-Time Notification: PASS / FAIL
✅ File Upload (valid): PASS / FAIL
✅ File Upload (validation): PASS / FAIL
✅ Daily Summary: PASS / FAIL
✅ No Duplicate Notifications: PASS / FAIL
✅ Bulgarian Conversation: PASS / FAIL

Total: __ / 12 PASS
```

---

## 🎯 Success Criteria

**System ready for production when:**
- At least 10/12 tests pass
- All critical features work (chat, notifications, file upload)
- No major errors in console
- Database contains test data
- Telegram receives all notifications

---

## 🚀 After Testing

If all tests pass:
1. Review any issues found
2. Fix critical bugs
3. **Deploy to production!**
4. Test again on live site

If tests fail:
1. Note which tests failed
2. Check troubleshooting section
3. Fix issues
4. Re-test

---

**Ready to start testing?** Let me know when you begin and I'll help troubleshoot any issues! 🧪

