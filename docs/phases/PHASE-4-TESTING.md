# Phase 4 Testing - Quick Start

## 🚀 Quick Test (5 minutes)

### Step 1: Start Server
```bash
npm run dev
```

### Step 2: Open Chat
1. Go to http://localhost:8888
2. Scroll to "Ask the AI Dentist" section

### Step 3: Complete Questionnaire (for context)
```
You: "Hi, I want to book"
AI: [Asks for info]
You: "John Smith"
AI: [Asks for phone]
You: "+44 7700 900123"
```

### Step 4: Upload File

1. **Click paperclip icon** 📎 (next to text input)
2. **Select an image:**
   - Use a dental X-ray if you have one
   - Or any JPG/PNG image for testing
3. **File preview appears** below input
4. **Click send button** (or press Enter)
5. **Watch the chat:**
   - "📎 Uploading filename..." appears
   - Changes to "📎 Uploaded filename ✓"
   - AI responds: "Thank you for uploading the file..."

### Step 5: Check Telegram

**Within 5 seconds**, you should receive:

```
📷 X-Ray від пациент

👤 John Smith
📱 +44 7700 900123
🆔 [conversation-id]

[Your image attached]
```

---

## ✅ Success Criteria

- [x] Paperclip button visible
- [x] File picker opens
- [x] File preview shows
- [x] Upload succeeds
- [x] Telegram receives image
- [x] Patient info included

---

## 🧪 Additional Tests

### Test Different File Types:

**JPG Image:**
```
✅ Should work
```

**PNG Image:**
```
✅ Should work
```

**PDF Document:**
```
✅ Should work (sent as document)
```

**Large File (>10MB):**
```
❌ Should reject with alert
```

**Wrong Type (.docx, .txt):**
```
❌ Should reject with alert
```

---

## 🐛 Quick Fixes

**"Paperclip button not visible"**
- Check HTML was updated
- Clear browser cache (Cmd+Shift+R)
- Check CSS file loaded

**"File not uploading"**
- Check browser console for errors
- Verify conversationId exists (send message first)
- Check file is < 10MB
- Check file is JPG, PNG, GIF, WebP, or PDF

**"No Telegram message"**
- Verify TELEGRAM_BOT_TOKEN in env vars
- Verify TELEGRAM_CHAT_ID in env vars
- Check Netlify function logs

**"Upload succeeds but no Telegram"**
- Check `telegram-client.js` sendXRay function
- Test Telegram bot manually
- Verify bot is started (send /start)

---

## 📸 Test Files

Create test files:

**Small image (< 1MB):** 
- Take a photo with phone
- Or use any existing image

**PDF (< 5MB):**
- Scan a document
- Or use any PDF

**Large file (> 10MB) for testing rejection:**
- Use high-res photo
- Or create large PDF

---

## 🎯 What to Look For

### In Browser:
- ✅ Paperclip icon appears
- ✅ File preview shows when selected
- ✅ Upload progress message
- ✅ Success confirmation
- ✅ No console errors

### On Telegram:
- ✅ Image/document received
- ✅ Patient info correct
- ✅ Message in Bulgarian
- ✅ Can view/download file

### In Database (optional):
- Go to Supabase → file_uploads table
- Check record created with metadata

---

**Once all tests pass**: Ready for Phase 5! 🎉












