# Health Check System

## Overview

The health check system ensures the chatbot infrastructure is running properly and distinguishes between "no messages because no queries" vs "no messages because the system is down".

## Components

### 1. Daily Summary (3 PM UTC / 5-6 PM Bulgarian)
**File:** `netlify/functions/daily-summary.js`

**Behavior:**
- ✅ Sends summary **only when there are patient queries**
- ❌ Does **NOT** send a message when there are no queries
- This prevents unnecessary daily notifications

**What it sends:**
- Summary of all patient conversations from that day
- Generated using OpenAI in Bulgarian
- Includes patient information and concerns

### 2. Health Check (6 AM UTC / 8-9 AM Bulgarian)
**File:** `netlify/functions/health-check.js`

**What it checks:**
- ✅ **Supabase Database** - Connection and query test
- ✅ **OpenAI API** - API connectivity test
- ✅ **Telegram Bot** - Bot status and connectivity

**Notification behavior:**
- 🚨 **Immediate notification** if ANY service fails
- 📊 **Weekly summary** every Monday (all systems operational)
- 🔇 **Silent** on other days when everything is healthy

**Benefits:**
- Early detection of system failures (morning check)
- Doesn't spam with daily "all good" messages
- Weekly confirmation that monitoring is active

## How It Works Together

### Scenario 1: Normal Day with Patients
```
6 AM  → Health check runs → All healthy → Silent (no notification)
3 PM  → Daily summary runs → 5 patients → Sends summary to Telegram ✉️
```

### Scenario 2: Quiet Day (No Patients)
```
6 AM  → Health check runs → All healthy → Silent (no notification)
3 PM  → Daily summary runs → 0 patients → Silent (no notification)
```

### Scenario 3: System Failure
```
6 AM  → Health check runs → Database fails → ALERT sent to Telegram 🚨
3 PM  → Daily summary runs → May also fail and send error
```

### Scenario 4: Monday (Weekly Confirmation)
```
6 AM  → Health check runs → All healthy → Weekly summary sent ✉️
3 PM  → Daily summary runs → Depends on patient queries
```

## Error Handling

### Health Check Errors
- Tests each service independently
- Reports which specific service(s) failed
- Sends detailed error messages to Telegram
- Returns 500 status code if any service unhealthy

### Daily Summary Errors
- Already has error notification system in place
- Sends errors to Telegram via `sendErrorNotification()`
- Returns 500 status code on failure

## Monitoring Schedule

| Time (UTC) | Time (Bulgarian) | Function | Purpose |
|------------|------------------|----------|---------|
| 6:00 AM    | 8-9 AM          | Health Check | System monitoring |
| 3:00 PM    | 5-6 PM          | Daily Summary | Patient query summary |

**Note:** Bulgarian time varies by 1 hour depending on summer/winter time (UTC+2 or UTC+3)

## Manual Testing

You can manually trigger these functions via Netlify:

### Test Health Check
```bash
curl -X POST https://your-site.netlify.app/.netlify/functions/health-check
```

### Test Daily Summary
```bash
curl -X POST https://your-site.netlify.app/.netlify/functions/daily-summary
```

## Deployment

The health check is automatically deployed with your site. After deploying:

1. ✅ Verify both scheduled functions are active in Netlify dashboard
2. ✅ Check function logs to confirm successful execution
3. ✅ Monitor Telegram for notifications

## Configuration

All settings are in `netlify.toml`:

```toml
[functions."health-check"]
  schedule = "0 6 * * *"

[functions."daily-summary"]
  schedule = "0 15 * * *"
```

## Environment Variables Required

Both functions need these environment variables (set in Netlify):

- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`
- `OPENAI_API_KEY`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

## Troubleshooting

### No messages at all
1. Check Netlify function logs
2. Verify scheduled functions are enabled
3. Check environment variables are set
4. Manually trigger health check to test

### Health check not detecting issues
1. Check health check logs in Netlify
2. Verify Telegram bot token and chat ID
3. Test individual services manually

### Too many notifications
- Health check sends alerts only on failures
- If getting daily alerts, there's likely a real issue to investigate
- Weekly Monday summary is normal and expected

## Benefits of This Approach

✅ **Silent when working** - No noise when everything is fine
✅ **Fast failure detection** - Morning check catches issues early
✅ **No confusion** - Clear distinction between "no queries" and "system down"
✅ **Weekly confirmation** - Know the monitoring is still active
✅ **Focused summaries** - Only get patient summaries when there are patients










