# Health Check System - Deployment Guide

## 📋 Summary of Changes

This update implements a smart notification system that:
- ✅ Only sends daily summaries when there are patient queries
- ✅ Provides automated health monitoring to detect system failures
- ✅ Distinguishes between "no messages because no queries" vs "system down"

## 🔄 What Changed

### 1. Modified Files

#### `netlify/functions/daily-summary.js`
- **Changed**: No longer sends "no conversations" message
- **Reason**: Reduce notification spam when there are no patient queries
- **Behavior**: Silently returns success when conversation count is 0

#### `netlify.toml`
- **Added**: Health check scheduled function at 6 AM UTC
- **Maintained**: Daily summary scheduled function at 3 PM UTC
- **Schedule**: Two separate cron jobs for monitoring and reporting

#### `package.json`
- **Added**: `test:health` npm script
- **Added**: `dotenv` dev dependency for local testing

#### `README.md`
- **Added**: Documentation for AI chatbot and health monitoring
- **Added**: Environment variables documentation
- **Added**: Testing instructions

### 2. New Files

#### `netlify/functions/health-check.js` ⭐ NEW
A comprehensive health monitoring function that:
- Tests Supabase database connectivity
- Tests OpenAI API connectivity  
- Tests Telegram Bot API connectivity
- Sends alerts **only when there's a problem**
- Sends weekly confirmation on Mondays (so you know it's working)

#### `docs/guides/HEALTH-CHECK-SYSTEM.md` 📚 NEW
Complete documentation covering:
- How the health check works
- Daily operations schedule
- Different scenarios and expected behavior
- Troubleshooting guide
- Manual testing instructions

#### `scripts/test-health-check.js` 🧪 NEW
Local testing script to verify health check function before deployment

#### `HEALTH-CHECK-DEPLOYMENT.md` 📝 NEW
This file - deployment instructions

## 🚀 Deployment Steps

### Step 1: Install Dependencies (if needed)

```bash
cd /Users/mik/Projects/dr-genchev-website
npm install
```

This installs the new `dotenv` dev dependency for local testing.

### Step 2: Test Locally (Optional but Recommended)

```bash
npm run test:health
```

This will:
- Load environment variables from your `.env` file
- Test all three services (Database, OpenAI, Telegram)
- Display results in your terminal
- **Note**: This will send a test message to your Telegram chat

### Step 3: Commit Changes

```bash
git add netlify/functions/health-check.js
git add netlify/functions/daily-summary.js
git add netlify.toml
git add package.json
git add package-lock.json
git add README.md
git add docs/guides/HEALTH-CHECK-SYSTEM.md
git add scripts/test-health-check.js
git add HEALTH-CHECK-DEPLOYMENT.md

git commit -m "Add health check system and improve daily summary notifications

- Add health-check.js function to monitor system health daily
- Modify daily-summary.js to only send when there are patient queries
- Add comprehensive documentation for health check system
- Add local testing script for health checks
- Update README with AI chatbot and monitoring documentation"
```

### Step 4: Deploy to Netlify

```bash
git push origin main
```

Or if using Netlify CLI:

```bash
netlify deploy --prod
```

### Step 5: Verify Deployment

1. **Check Netlify Dashboard**
   - Go to Functions tab
   - Verify both `health-check` and `daily-summary` are deployed
   - Check that scheduled triggers are active

2. **Check Function Logs**
   - Navigate to Functions > health-check
   - View recent logs to see if it ran successfully
   - Do the same for daily-summary

3. **Manual Test (Optional)**
   ```bash
   curl -X POST https://your-site.netlify.app/.netlify/functions/health-check
   ```

## 📅 Expected Behavior After Deployment

### Daily Schedule (UTC Times)

| Time (UTC) | Function | What Happens |
|------------|----------|--------------|
| 06:00 | Health Check | Tests all systems, sends alert only if there's a problem |
| 15:00 | Daily Summary | Sends summary only if there were patient queries |

### Notification Scenarios

#### Scenario A: Normal Day with Patients
```
6:00 AM UTC  → Health check runs → ✅ All healthy → No message
3:00 PM UTC  → Daily summary runs → 📊 5 patients → Summary sent ✉️
```
**You receive**: 1 Telegram message (patient summary)

#### Scenario B: Quiet Day (No Patients)
```
6:00 AM UTC  → Health check runs → ✅ All healthy → No message
3:00 PM UTC  → Daily summary runs → 0 patients → No message
```
**You receive**: 0 Telegram messages

#### Scenario C: System Failure
```
6:00 AM UTC  → Health check runs → ❌ Database fails → Alert sent 🚨
3:00 PM UTC  → Daily summary runs → May also fail and send error
```
**You receive**: 1-2 Telegram messages (error alerts)

#### Scenario D: Monday (Weekly Confirmation)
```
6:00 AM UTC  → Health check runs → ✅ All healthy → Weekly summary ✉️
3:00 PM UTC  → Daily summary runs → Depends on patient queries
```
**You receive**: 1 Telegram message (weekly health confirmation) + patient summary if any

## 🧪 Testing After Deployment

### Test 1: Verify Health Check Works
Wait until next scheduled run (6 AM UTC) or manually trigger:
```bash
curl -X POST https://your-site.netlify.app/.netlify/functions/health-check
```

Check Telegram for alert (if system unhealthy) or Monday summary (if it's Monday).

### Test 2: Verify Daily Summary Works
Wait until next scheduled run (3 PM UTC) or:
1. Have a patient conversation through the chatbot
2. Manually trigger the daily summary:
   ```bash
   curl -X POST https://your-site.netlify.app/.netlify/functions/daily-summary
   ```
3. Check Telegram for patient summary

### Test 3: Verify "No Patients" Behavior
On a day with no patient queries:
1. Wait for 3 PM UTC
2. Check Telegram - should NOT receive "no conversations" message
3. Check Netlify function logs - should show "No conversations today, summary skipped"

## 📊 Monitoring

### Where to Check Logs

1. **Netlify Dashboard**
   - Site > Functions > health-check
   - Site > Functions > daily-summary
   - View execution logs for each run

2. **Telegram**
   - Alerts for system failures
   - Weekly health confirmations (Mondays)
   - Patient summaries (when applicable)

### What to Watch For

✅ **Good Signs:**
- Monday morning: Weekly health confirmation
- After patient chats: Daily summary
- Netlify logs show successful executions

⚠️ **Warning Signs:**
- Daily error alerts from health check
- No messages for several weeks (health check might be down)
- Daily summaries not arriving when you know there were patients

## 🔧 Troubleshooting

### Health Check Not Running

**Check:**
1. Netlify dashboard > Functions > Verify scheduled trigger is enabled
2. Environment variables are set correctly
3. Function logs for errors

### Daily Summary Not Sending (When There Are Patients)

**Check:**
1. Database has conversations for today
2. OpenAI API key is valid
3. Telegram bot token and chat ID are correct
4. Function logs for specific errors

### Too Many Notifications

**This shouldn't happen with the new system**, but if it does:
- Check if health check is detecting false positives
- Review function logs for details
- Verify environment variables are correct

## 🎉 Benefits of This Update

### Before
- ❌ Daily "no conversations" message every day
- ❌ No way to know if system is working when quiet
- ❌ Confusion between "no patients" and "system down"

### After
- ✅ Clean Telegram - only relevant notifications
- ✅ Proactive health monitoring with early detection
- ✅ Clear distinction between "quiet" and "broken"
- ✅ Weekly confirmation that monitoring is active
- ✅ Focused patient summaries only when needed

## 📞 Support

If you encounter any issues during deployment:
1. Check Netlify function logs first
2. Review environment variables
3. Test locally with `npm run test:health`
4. Check the detailed documentation in `docs/guides/HEALTH-CHECK-SYSTEM.md`

---

**Deployed**: Ready for deployment  
**Tested**: Locally tested  
**Documentation**: Complete  
**Backwards Compatible**: Yes, no breaking changes










