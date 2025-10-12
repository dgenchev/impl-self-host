# Phase 2 Testing Guide - Quick Start

## 🚀 Quick Test (5 minutes)

### Step 1: Start Local Server
```bash
cd /Users/mik/Projects/dr-genchev-website
npm run dev
```

Wait for: `Server now ready on http://localhost:8888`

### Step 2: Test Database Connection
Open new terminal:
```bash
curl http://localhost:8888/.netlify/functions/test-db
```

**Expected**: JSON response with `"success": true`

### Step 3: Test Chat Interface

1. Open browser: http://localhost:8888
2. Scroll to "Ask the AI Dentist" section
3. Type: **"Hello, I need dental implants"**
4. Wait for AI response (~2-3 seconds)

**Expected**: AI responds about dental implants in English

### Step 4: Test Context Memory

Continue conversation:
5. Type: **"How much does it cost?"**

**Expected**: AI responds about cost AND remembers you're asking about implants

### Step 5: Test Questionnaire

6. Type: **"I want to book a consultation"**

**Expected**: AI asks for your name

7. Type: **"John Smith"**

**Expected**: AI asks for phone number

8. Type: **"+44 7700 900123"**

**Expected**: AI confirms and may ask about dental concerns

9. Open browser console (F12)

**Expected**: Should see: `✅ Questionnaire completed! {firstName: "John", ...}`

### Step 6: Verify Database

1. Go to your Supabase dashboard
2. Click **"Table Editor"**
3. Click **"conversations"** table

**Expected**: See 1 new conversation with `language: "en"` and `status: "completed"`

4. Click **"messages"** table

**Expected**: See your messages (encrypted)

5. Click **"patient_info"** table

**Expected**: See 1 row with encrypted patient data

---

## ✅ Success Criteria

If all steps above work, Phase 2 is successful! ✅

You're ready for Phase 3 (Telegram notifications).

---

## 🐛 Quick Fixes

**"Connection refused"**
- Make sure `npm run dev` is still running
- Check it says "Server now ready" before testing

**"Database test failed"**
- Verify Supabase credentials in `.env` file
- Check Supabase project is active

**"AI doesn't respond"**
- Check browser console (F12) for errors
- Verify OpenAI API key in `.env`
- Check you have OpenAI credits

**"Function not found"**
- Stop server (Ctrl+C)
- Run `npm run dev` again
- Functions need to be detected on startup

---

## 📊 Testing Checklist

- [ ] Database test returns success
- [ ] Can send messages in chat
- [ ] AI responds (not just loading forever)
- [ ] AI remembers previous message
- [ ] Questionnaire triggers on booking request
- [ ] Patient info extracted
- [ ] Data visible in Supabase

Once complete, you're ready for Phase 3! 🎉

