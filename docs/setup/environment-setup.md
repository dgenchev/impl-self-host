# Environment Variables Setup Guide

Complete guide for setting up all required environment variables in Netlify.

## 📋 Overview

Your dental chatbot requires these environment variables:
- OpenAI API (AI responses)
- Telegram Bot (notifications)
- Supabase (database)
- Security keys (encryption and validation)

## 🔐 All Required Variables

| Variable | Purpose | Where to Get It | Example |
|----------|---------|-----------------|---------|
| `OPENAI_API_KEY` | AI chat responses | https://platform.openai.com/api-keys | `sk-proj-xxx...` |
| `TELEGRAM_BOT_TOKEN` | Send notifications | @BotFather on Telegram | `123456:ABCdef...` |
| `TELEGRAM_CHAT_ID` | Your Telegram ID | @userinfobot | `123456789` |
| `SUPABASE_URL` | Database connection | Supabase project settings | `https://xxx.supabase.co` |
| `SUPABASE_ANON_KEY` | Database auth | Supabase API settings | `eyJ...` |
| `WEBHOOK_SECRET` | Request validation | Generate yourself | 32 random chars |
| `ENCRYPTION_KEY` | Data encryption | Generate yourself | 32 random chars |
| `SITE_URL` | Your website URL | Netlify dashboard | `https://your-site.netlify.app` |

## 🚀 Step-by-Step Setup

### 1. OpenAI API Key

**Already set up** ✅ (from your existing AI chat integration)

If you need to update it:
1. Go to https://platform.openai.com/api-keys
2. Create new secret key
3. Copy the key (starts with `sk-proj-`)
4. Add to Netlify

### 2. Telegram Credentials

See detailed guide: `docs/setup/telegram-setup.md`

**Quick steps:**
1. Chat with @BotFather on Telegram
2. Create new bot with `/newbot`
3. Get your token
4. Get your Chat ID from @userinfobot

### 3. Supabase Credentials

See detailed guide: `docs/setup/supabase-setup.md`

**Quick steps:**
1. Sign up at https://supabase.com
2. Create new project (choose EU region)
3. Go to Settings → API
4. Copy Project URL and anon key

### 4. Generate Security Keys

**On macOS/Linux:**
```bash
# Generate WEBHOOK_SECRET
openssl rand -hex 32

# Generate ENCRYPTION_KEY
openssl rand -hex 32
```

**On Windows (PowerShell):**
```powershell
# Generate random strings
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
```

**Online (if needed):**
- Go to https://www.random.org/strings/
- Length: 32 characters
- Unique: Yes
- Format: Alphanumeric

### 5. Site URL

Your Netlify site URL:
```
https://your-site-name.netlify.app
```

Or your custom domain if you have one:
```
https://dr-genchev.com
```

## 🔧 Adding Variables to Netlify

### Via Dashboard:

1. Go to https://app.netlify.com
2. Select your site
3. Click **"Site settings"** (top right)
4. Click **"Environment variables"** (left sidebar)
5. Click **"Add a variable"**
6. For each variable:
   - Enter the **Key** (variable name)
   - Enter the **Value**
   - Click **"Create variable"**

### Complete List to Add:

```plaintext
Key: OPENAI_API_KEY
Value: sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxx
Scopes: All (checked)

Key: TELEGRAM_BOT_TOKEN
Value: 123456789:ABCdefGHIjklMNOpqrsTUVwxyz
Scopes: All (checked)

Key: TELEGRAM_CHAT_ID
Value: 123456789
Scopes: All (checked)

Key: SUPABASE_URL
Value: https://xxxxxxxxxxxxx.supabase.co
Scopes: All (checked)

Key: SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxxxxxxxxxx
Scopes: All (checked)

Key: WEBHOOK_SECRET
Value: [32 random characters you generated]
Scopes: All (checked)

Key: ENCRYPTION_KEY
Value: [32 random characters you generated]
Scopes: All (checked)

Key: SITE_URL
Value: https://your-site.netlify.app
Scopes: All (checked)
```

### Via Netlify CLI (Alternative):

```bash
netlify env:set OPENAI_API_KEY "sk-proj-xxxxx"
netlify env:set TELEGRAM_BOT_TOKEN "123456:ABCdef"
netlify env:set TELEGRAM_CHAT_ID "123456789"
netlify env:set SUPABASE_URL "https://xxx.supabase.co"
netlify env:set SUPABASE_ANON_KEY "eyJ..."
netlify env:set WEBHOOK_SECRET "your-32-char-secret"
netlify env:set ENCRYPTION_KEY "your-32-char-key"
netlify env:set SITE_URL "https://your-site.netlify.app"
```

## 🧪 Local Development

For testing locally, create a `.env` file in your project root:

```bash
# Copy env.example to .env
cp env.example .env

# Edit .env with your values
nano .env  # or use your preferred editor
```

**⚠️ IMPORTANT**: Never commit `.env` to Git! It's already in `.gitignore`.

## ✅ Verify Setup

### Check Variables in Netlify:

1. Go to Site Settings → Environment variables
2. You should see 8 variables listed
3. Values should be hidden (for security)

### Test Locally:

```bash
# Start local development server
npm run dev

# In another terminal, test that env vars are loaded
curl http://localhost:8888/.netlify/functions/test-env
```

### Test in Production:

After deployment:
```bash
# Test AI chat (should work)
curl https://your-site.netlify.app/.netlify/functions/ai-chat \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"message": "test"}'

# Check Netlify function logs
netlify logs:function ai-chat
```

## 🔒 Security Checklist

- [ ] All sensitive variables are in Netlify (not in code)
- [ ] `.env` file is in `.gitignore`
- [ ] No tokens/keys visible in Git history
- [ ] Used strong random strings for WEBHOOK_SECRET and ENCRYPTION_KEY
- [ ] Supabase project is in EU region (GDPR)
- [ ] API keys have appropriate permissions (not admin/root)

## 🛠️ Troubleshooting

### "Environment variable not found"

**Check:**
1. Variable name is spelled exactly right (case-sensitive)
2. Variable is set in Netlify dashboard
3. You redeployed after adding variables
4. Scopes are set to "All" or include your deploy context

### "Invalid API key"

**Check:**
1. No extra spaces before/after the key
2. Key wasn't regenerated/revoked
3. Key has appropriate permissions
4. Check service-specific dashboards for key status

### Local development env vars not working

**Check:**
1. `.env` file exists in project root
2. File is named exactly `.env` (not `.env.txt`)
3. Running `netlify dev` (not just `node`)
4. No syntax errors in `.env` file

### Variables not updating

**Fix:**
1. Clear Netlify build cache
2. Redeploy:
   ```bash
   git commit --allow-empty -m "Trigger rebuild"
   git push
   ```

## 🔄 Rotating Keys

If a key is compromised, rotate it:

### OpenAI:
1. Go to https://platform.openai.com/api-keys
2. Delete old key
3. Create new key
4. Update in Netlify
5. Redeploy

### Telegram:
1. Chat with @BotFather
2. Send `/revoke` and select your bot
3. Send `/newbot` to create new one
4. Update in Netlify
5. Redeploy

### Supabase:
1. In Supabase dashboard, go to Settings → API
2. Click "Rotate JWT secret" (under Advanced)
3. Copy new keys
4. Update in Netlify
5. Redeploy

### Security Keys:
1. Generate new random strings
2. Update in Netlify
3. Redeploy (old conversations will be invalidated)

## 📊 Best Practices

1. **Document everything**: Keep track of when keys were created
2. **Regular rotation**: Rotate security keys quarterly
3. **Monitor usage**: Check API usage dashboards monthly
4. **Backup**: Keep encrypted backup of keys in password manager
5. **Access control**: Limit who can see Netlify environment variables

## 🎉 Completion Checklist

Before proceeding to next phase:

- [ ] All 8 environment variables added to Netlify
- [ ] Variables verified in Netlify dashboard
- [ ] `.env` file created for local development
- [ ] Local test successful (`netlify dev`)
- [ ] Security keys are strong random strings
- [ ] No keys committed to Git
- [ ] Documentation reviewed
- [ ] Backup of keys stored securely

---

## Next Steps

After completing environment setup:
1. ✅ All credentials configured
2. ✅ Security keys generated
3. → Create library files (database, Telegram clients)
4. → Build Netlify functions
5. → Test end-to-end

**Estimated time**: 20-30 minutes



