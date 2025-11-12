# 🚀 Post-Deployment Guide

## ✅ Code Deployed to GitHub

Your complete dental chatbot has been pushed to GitHub and Netlify is now deploying it automatically.

---

## 📊 Monitor Deployment

### Step 1: Check Netlify Dashboard

1. **Go to:** https://app.netlify.com
2. **Select:** Your site (dr-genchev-website)
3. **Watch:** Deploy progress in real-time

**Expected timeline:**
- **0-30 sec:** Build starting
- **30-90 sec:** Installing dependencies
- **90-120 sec:** Building functions
- **120-150 sec:** Deploying to CDN
- **✅ Done in ~2-3 minutes**

### Step 2: Verify Functions Deployed

After deployment completes:

1. **Go to:** Functions tab in Netlify
2. **Verify these 6 functions exist:**
   - ✅ `ai-chat-enhanced`
   - ✅ `telegram-notify`
   - ✅ `upload-xray`
   - ✅ `daily-summary` (should show "Scheduled" badge)
   - ✅ `test-db`
   - ✅ `ai-chat` (legacy, can ignore)

3. **Check daily-summary:**
   - Should show **"Scheduled"** badge
   - Next run time should be visible
   - Schedule: Daily at 3 PM UTC (6 PM Bulgarian summer time)

---

## 🧪 Test Production Site

### Test 1: Visit Website

1. **Open your live site:**
   - Check Netlify dashboard for the URL
   - Usually: `https://your-site-name.netlify.app`
   - Or your custom domain if configured

2. **Verify page loads:**
   - No errors
   - Chat widget visible
   - Paperclip icon visible

### Test 2: Test AI Chat

1. **Scroll to "Ask the AI Dentist"**
2. **Type:** "Hello, I need information about dental implants"
3. **Wait 2-4 seconds**

**Expected:**
- AI responds
- No errors
- Response about implants

**If failed:**
- Check browser console (F12)
- Check Netlify function logs
- Verify OPENAI_API_KEY in Netlify env vars

### Test 3: Complete Full Questionnaire

**Start a conversation:**
```
You: "I want to book a consultation"
AI: [Asks for name]
You: "Maria Ivanova"
AI: [Asks for phone]
You: "+359 88 987 6543"
AI: [May ask about concerns]
You: "Need implants for lower jaw"
AI: [May ask about times]
You: "Weekday afternoons"
```

**Check your Telegram:**
- Should receive notification within 10-15 seconds
- Contains patient info and summary
- All in Bulgarian

### Test 4: Upload File

1. **Click paperclip icon** 📎
2. **Select an image** (JPG, PNG)
3. **Send**

**Check your Telegram:**
- Should receive image
- With patient context
- In Bulgarian

### Test 5: Verify Scheduled Function

1. **Go to Netlify:** Functions → daily-summary
2. **Check:** "Next scheduled run" time
3. **Wait until that time** (or tomorrow at 6 PM)
4. **Check Telegram:** Should receive daily summary

---

## 🔍 Troubleshooting Production Issues

### Issue: Chat Not Working

**Check:**
1. Netlify function logs (Functions → ai-chat-enhanced → Logs)
2. Browser console for JavaScript errors
3. Network tab (F12) - look for 500 errors

**Common causes:**
- Environment variable not set
- OpenAI API key invalid
- Function deployment failed

**Fix:**
- Verify all 7 env vars in Netlify dashboard
- Redeploy if needed

### Issue: No Telegram Notifications

**Check:**
1. Function logs for errors
2. Telegram bot is started (send /start)
3. Env vars: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID

**Test manually:**
```bash
# Get your site URL from Netlify
curl -X POST https://your-site.netlify.app/.netlify/functions/telegram-notify \
  -H "Content-Type: application/json" \
  -d '{"conversationId": "test-id"}'
```

### Issue: Scheduled Function Not Running

**Check:**
1. Netlify Functions → daily-summary
2. Should show "Scheduled" badge
3. Check execution logs

**If not scheduled:**
- Verify netlify.toml deployed
- Check schedule syntax: `0 15 * * *`
- Redeploy if needed

### Issue: File Upload Fails

**Check:**
1. Browser console for errors
2. File size < 10MB
3. File type is image or PDF
4. Function logs for details

---

## 📱 What to Expect Daily

### Every Day at 6 PM Bulgarian Time:

You'll receive a Telegram message:

```
📊 Дневен Резюме - 2025-10-13

📈 Общо разговори: X

[Summary of conversations]

_Автоматично генериран доклад от AI асистента._
```

**Even on days with 0 conversations**, you'll get:
```
📊 Дневен Резюме - 2025-10-13

Днес нямаше разговори с пациенти.
```

This confirms the system is running!

---

## 🎯 Success Criteria

Production deployment successful when:

- [ ] Website loads without errors
- [ ] Chat interface works
- [ ] AI responds to messages
- [ ] Can complete questionnaire
- [ ] Telegram notification received
- [ ] File upload works
- [ ] No console errors
- [ ] All 6 functions shown in Netlify
- [ ] daily-summary shows "Scheduled"

---

## 📊 Monitor First Week

### Daily Checks:

**Day 1 (Today):**
- [ ] Test chat on production
- [ ] Test questionnaire completion
- [ ] Verify Telegram notification
- [ ] Test file upload
- [ ] Wait for 6 PM automatic summary

**Day 2:**
- [ ] Check if daily summary arrived at 6 PM
- [ ] Verify summary content is good
- [ ] Test with real inquiry (optional)

**Day 3-7:**
- [ ] Monitor daily summaries
- [ ] Check for any errors in Netlify logs
- [ ] Monitor OpenAI usage/costs
- [ ] Adjust if needed

### Weekly Checks:

**Review:**
- Netlify function usage
- Supabase database size
- OpenAI API costs
- Telegram notification quality

**Adjust if needed:**
- AI prompts (if responses need improvement)
- Summary timing (if 6 PM doesn't work)
- Questionnaire questions

---

## 💡 Tips for First Week

### For Patients:

**Share the chat:**
- Add link to chat section on social media
- Tell patients they can ask questions online
- Mention multilingual support

**Example message:**
```
"Have questions about dental implants? 
Chat with our AI assistant in your language:
https://your-site.netlify.app/#ai-dentist

Available 24/7 in Bulgarian, English, Russian, French!"
```

### For You:

**Respond to Telegram notifications:**
- Call patients who completed questionnaire
- Review X-rays received
- Prioritize based on daily summary
- Track conversion rate

---

## 🔧 Quick Fixes

### Change Daily Summary Time:

Edit `netlify.toml`:
```toml
[functions."daily-summary"]
  schedule = "0 16 * * *"  # Change to 4 PM UTC (7 PM summer)
```

Then redeploy:
```bash
git add netlify.toml
git commit -m "Adjust summary time"
git push
```

### Improve AI Responses:

Edit `lib/openai-client.js`, find `getSystemPrompt()`, adjust the content.

### Customize Telegram Messages:

Edit `lib/telegram-client.js`, find notification templates, adjust format.

---

## 📞 Support Resources

**If you encounter issues:**

1. **Netlify Docs:** https://docs.netlify.com
2. **Supabase Docs:** https://supabase.com/docs
3. **OpenAI Docs:** https://platform.openai.com/docs
4. **Telegram Bot API:** https://core.telegram.org/bots

**Check logs:**
- Netlify: Dashboard → Functions → [function] → Logs
- Supabase: Dashboard → Logs
- OpenAI: Dashboard → Usage

---

## 🎉 You're Live!

Your AI dental chatbot is now:
- ✅ Running 24/7
- ✅ Accepting patient inquiries
- ✅ Collecting information automatically
- ✅ Notifying you in real-time
- ✅ Sending daily summaries
- ✅ Handling X-ray uploads
- ✅ All for ~$3/month!

**Congratulations!** 🎊

---

## 📈 Next Steps

### Immediate:
1. Test production site
2. Wait for first automatic daily summary (6 PM)
3. Share chat link with potential patients

### This Week:
1. Monitor notifications
2. Review daily summaries
3. Adjust prompts if needed

### Future Enhancements (Optional):
- Add admin dashboard
- Integrate with calendar
- Add email notifications
- Multi-site deployment
- Analytics dashboard
- More AI features

---

**Your chatbot is LIVE!** Test it on your production URL and enjoy automated patient intake! 🚀












