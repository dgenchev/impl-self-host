# Dr Genchev Dental Chatbot - Project Overview

AI-powered multilingual dental chatbot with Telegram notifications for Dr. Genchev's clinic.

## 🎯 Project Goals

- **AI Chat**: Answer patient questions in multiple languages (BG, EN, RU, FR)
- **Lead Collection**: Automatically collect patient information when interest detected
- **Telegram Notifications**: Real-time alerts to dentist when forms completed
- **Daily Summaries**: Bulgarian summary of all conversations sent at 6 PM
- **X-Ray Handling**: Patients can upload X-rays, forwarded to dentist
- **GDPR Compliant**: Full encryption, auto-deletion, data rights implementation

## 🏗️ Architecture

```
Patient Website (Netlify) 
    ↓
Chat Interface
    ↓
Netlify Functions (Serverless)
    ↓
OpenAI (AI) + Supabase (DB) + Telegram (Notifications)
```

## 📁 Project Structure

```
dr-genchev-website/
├── docs/                          # Setup guides & documentation
│   ├── supabase-setup.md         # Database setup (15-20 min)
│   ├── telegram-setup.md         # Bot setup (5-10 min)
│   ├── environment-setup.md      # Env vars guide
│   └── PHASE-1-COMPLETE.md       # Current status
│
├── lib/                          # Reusable libraries
│   ├── supabase-client.js       # Database operations
│   ├── openai-client.js         # AI chat logic
│   ├── telegram-client.js       # Telegram integration
│   ├── encryption-utils.js      # Security & encryption
│   └── gdpr-utils.js            # GDPR compliance
│
├── netlify/functions/            # Serverless functions (Phase 2+)
│   ├── ai-chat.js               # Current basic chat
│   ├── ai-chat-enhanced.js      # [Phase 2] Full chatbot
│   ├── telegram-notify.js       # [Phase 3] Notifications
│   ├── upload-xray.js           # [Phase 4] File handling
│   ├── daily-summary.js         # [Phase 5] Scheduled job
│   └── gdpr.js                  # [Phase 6] GDPR endpoints
│
├── js/                           # Frontend JavaScript
│   ├── script.js                # Current site JS
│   └── chatWidget.js            # [Phase 4] Enhanced chat UI
│
├── css/                          # Styles
│   ├── style.css                # Current styles
│   └── chatWidget.css           # [Phase 4] Chat styles
│
├── index.html                    # Main website
├── package.json                  # Dependencies
├── netlify.toml                  # Netlify config
└── env.example                   # Environment template
```

## 🚀 Implementation Phases

### ✅ Phase 1: Foundation (COMPLETE)
- [x] Dependencies added
- [x] Configuration files
- [x] Setup documentation
- [x] Library files created

### ⏳ Phase 2: Core Chat Enhancement (NEXT)
- [ ] Fix existing chat bugs
- [ ] Add conversation context
- [ ] Implement multilingual support
- [ ] Add database persistence
- [ ] Interest detection

### ⏳ Phase 3: Telegram Integration
- [ ] Real-time notifications
- [ ] Questionnaire completion alerts
- [ ] Bulgarian summaries

### ⏳ Phase 4: File Upload
- [ ] X-ray upload UI
- [ ] File handling
- [ ] Forward to Telegram

### ⏳ Phase 5: Daily Summaries
- [ ] Scheduled function
- [ ] Summary generation
- [ ] Telegram delivery

### ⏳ Phase 6: GDPR & Security
- [ ] GDPR endpoints
- [ ] Privacy policy
- [ ] Security hardening
- [ ] Auto-deletion

### ⏳ Phase 7: Testing & Launch
- [ ] End-to-end testing
- [ ] Security testing
- [ ] Performance optimization
- [ ] Production launch

## 🔧 Quick Start

### Prerequisites
- Node.js 18+
- Netlify account
- OpenAI API key (already have)
- Supabase account (free)
- Telegram account

### Setup (45 minutes)

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up Supabase** (15-20 min):
   - See `docs/supabase-setup.md`
   - Create account, project, run SQL schema

3. **Set up Telegram bot** (5-10 min):
   - See `docs/telegram-setup.md`
   - Chat with @BotFather, get token

4. **Configure environment variables** (10-15 min):
   - See `docs/environment-setup.md`
   - Add 8 variables to Netlify dashboard

5. **Test setup**:
   ```bash
   npm run dev
   ```

## 🔐 Environment Variables

Required in Netlify dashboard:

```
OPENAI_API_KEY           # Already configured
TELEGRAM_BOT_TOKEN       # From @BotFather
TELEGRAM_CHAT_ID         # From @userinfobot
SUPABASE_URL            # Supabase project URL
SUPABASE_ANON_KEY       # Supabase API key
WEBHOOK_SECRET          # Generate with: openssl rand -hex 32
ENCRYPTION_KEY          # Generate with: openssl rand -hex 32
SITE_URL                # Your Netlify URL
```

## 📊 Database Schema

**Tables**:
- `conversations` - Basic conversation metadata
- `messages` - Encrypted chat messages
- `patient_info` - Encrypted patient data (collected with consent)
- `audit_logs` - GDPR compliance tracking
- `file_uploads` - X-ray upload metadata

**Features**:
- AES-256 encryption for all sensitive data
- Auto-deletion after 30 days
- Row-level security
- Audit logging

## 🤖 AI Features

**Capabilities**:
- Multilingual support (auto-detect or enforce)
- Conversation context (remembers previous messages)
- Interest detection (triggers questionnaire)
- Patient info extraction
- Summary generation in Bulgarian

**Models**:
- Primary: GPT-4o-mini (fast, cost-effective)
- Fallback: GPT-3.5-turbo

## 📱 What Dentist Receives

### Real-Time (when patient completes form):
```
🦷 Нов Пациент - Попълнена Информация

👤 Име: Ivan Petrov
📱 Телефон: +359 88 123 4567
📧 Email: ivan@example.com

Резюме на разговора:
Patient interested in implants for upper jaw...

🆔 Conversation ID: abc-123
```

### Daily Summary (6 PM):
```
📊 Дневен Резюме - 2024-01-15

Общо разговори: 3

1. Ivan P. - High interest, complete info
2. Maria K. - Price inquiry
3. John S. - General questions

Препоръки: Follow up with Ivan P.
```

### X-Ray Uploads:
```
📷 X-Ray от пациент:
👤 Ivan Petrov
📱 +359 88 123 4567

[Image attached]
```

## 💰 Monthly Costs

- **Netlify**: Free (100GB bandwidth, 125k function calls)
- **Supabase**: Free (500MB storage)
- **OpenAI**: ~$2-5 (8 conversations/month)
- **Telegram**: Free

**Total**: ~$2-5/month

## 🔒 Security Features

- [x] AES-256 encryption for sensitive data
- [x] HMAC signature validation for webhooks
- [x] Rate limiting per conversation
- [x] Input sanitization and validation
- [x] HTTPS everywhere
- [x] No secrets in code (env variables only)
- [x] Audit logging
- [x] Auto-deletion after retention period

## 📜 GDPR Compliance

**Rights Implemented**:
- ✅ Right to Access (export endpoint)
- ✅ Right to Rectification (contact process)
- ✅ Right to Erasure (delete endpoint)
- ✅ Right to Restriction (status updates)
- ✅ Right to Data Portability (JSON export)
- ✅ Right to Object (contact process)

**Features**:
- Explicit consent collection
- Consent text in multiple languages
- 30-day auto-deletion
- Encrypted storage
- Audit trail
- Privacy policy

## 🧪 Testing

### Local Development:
```bash
npm run dev
# Site runs on http://localhost:8888
```

### Test Supabase:
```bash
# Test database connection
curl http://localhost:8888/.netlify/functions/test-db
```

### Test Telegram:
```bash
# Test bot connection
node test-telegram.js
```

### Test AI Chat:
```bash
# Test OpenAI integration
curl http://localhost:8888/.netlify/functions/ai-chat \
  -X POST \
  -d '{"message":"test"}'
```

## 📚 Documentation

- **Setup Guides**: `/docs/` directory
- **API Documentation**: Coming in Phase 2
- **Architecture Diagrams**: In phase documentation
- **GDPR Policy**: Coming in Phase 6

## 🐛 Troubleshooting

### Common Issues:

**"npm install fails"**
- Solution: Use Node.js 18+: `nvm use 18`

**"Supabase connection error"**
- Check URL and key are correct
- Verify no trailing spaces
- Check project is active

**"Telegram not sending"**
- Verify bot token format (numbers:ABC...)
- Check Chat ID is just numbers
- Test with @userinfobot

**"Environment variables not found"**
- Redeploy after adding variables
- Check variable names (case-sensitive)
- Verify scopes are set to "All"

## 📞 Support Resources

- **Supabase**: https://supabase.com/docs
- **Telegram Bots**: https://core.telegram.org/bots
- **OpenAI**: https://platform.openai.com/docs
- **Netlify**: https://docs.netlify.com

## 🎯 Current Status

**Phase 1**: ✅ Complete
**Action Required**: Complete setup steps in `docs/PHASE-1-COMPLETE.md`

Once setup is complete, notify to proceed with Phase 2!

---

**Last Updated**: Phase 1 - Foundation Complete
**Next Milestone**: Phase 2 - Core Chat Enhancement

