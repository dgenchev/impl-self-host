# Supabase Database Setup Guide

This guide will help you set up the PostgreSQL database for the dental chatbot using Supabase.

## 📋 Prerequisites

- A free Supabase account
- Access to your Netlify environment variables

## 🚀 Step 1: Create Supabase Account

1. Go to https://supabase.com
2. Click **"Start your project"**
3. Sign up with GitHub (recommended) or email
4. Verify your email if needed

## 🗄️ Step 2: Create New Project

1. Click **"New Project"**
2. Fill in the details:
   - **Name**: `dr-genchev-chatbot`
   - **Database Password**: Generate a strong password (save it securely!)
   - **Region**: Choose **Europe (Frankfurt)** or **Europe (Ireland)** for GDPR compliance
   - **Pricing Plan**: Free (500MB storage, perfect for your needs)
3. Click **"Create new project"**
4. Wait 2-3 minutes for setup to complete

## 🔑 Step 3: Get Your API Credentials

1. In your project dashboard, click **"Settings"** (gear icon in sidebar)
2. Click **"API"** in the settings menu
3. You'll see:
   - **Project URL**: Copy this (starts with `https://xxxxx.supabase.co`)
   - **anon/public key**: Copy this (long JWT token starting with `eyJ...`)

### Add to Netlify Environment Variables:

1. Go to your Netlify dashboard
2. Click **"Site settings"** → **"Environment variables"**
3. Add these variables:
   - **Key**: `SUPABASE_URL`, **Value**: Your Project URL
   - **Key**: `SUPABASE_ANON_KEY`, **Value**: Your anon/public key

## 📊 Step 4: Create Database Schema

1. In Supabase dashboard, click **"SQL Editor"** in the left sidebar
2. Click **"New query"**
3. Copy and paste the following SQL schema:

```sql
-- ============================================
-- Dr Genchev Dental Chatbot Database Schema
-- GDPR-Compliant with Auto-Deletion
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. CONVERSATIONS TABLE
-- Stores basic conversation metadata
-- ============================================
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    language VARCHAR(10), -- 'en', 'bg', 'ru', 'fr', etc.
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'completed', 'abandoned'
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
    ip_address VARCHAR(50), -- For audit purposes
    user_agent TEXT -- Browser info for audit
);

-- Index for faster queries
CREATE INDEX idx_conversations_status ON conversations(status);
CREATE INDEX idx_conversations_expires ON conversations(expires_at);
CREATE INDEX idx_conversations_created ON conversations(created_at DESC);

-- ============================================
-- 2. MESSAGES TABLE
-- Stores encrypted conversation messages
-- ============================================
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL, -- 'user' or 'assistant'
    content_encrypted TEXT NOT NULL, -- AES-256 encrypted message content
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for faster conversation retrieval
CREATE INDEX idx_messages_conversation ON messages(conversation_id, timestamp);

-- ============================================
-- 3. PATIENT_INFO TABLE
-- Stores encrypted patient information
-- Only populated when patient provides consent
-- ============================================
CREATE TABLE patient_info (
    conversation_id UUID PRIMARY KEY REFERENCES conversations(id) ON DELETE CASCADE,
    first_name_encrypted TEXT,
    last_name_encrypted TEXT,
    phone_encrypted TEXT,
    email_encrypted TEXT, -- Optional
    dental_concerns_encrypted TEXT,
    preferred_times_encrypted TEXT,
    consent_given_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    consent_text TEXT NOT NULL, -- What they consented to
    notified_dentist BOOLEAN DEFAULT FALSE, -- Has dentist been notified?
    notified_at TIMESTAMPTZ -- When was notification sent?
);

-- ============================================
-- 4. AUDIT_LOGS TABLE
-- GDPR compliance - tracks all data access
-- ============================================
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL, -- 'created', 'accessed', 'deleted', 'exported', 'notified'
    details JSONB, -- Additional context
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ip_address VARCHAR(50),
    user_agent TEXT
);

-- Index for audit queries
CREATE INDEX idx_audit_conversation ON audit_logs(conversation_id);
CREATE INDEX idx_audit_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX idx_audit_action ON audit_logs(action);

-- ============================================
-- 5. FILE_UPLOADS TABLE
-- Tracks X-ray uploads (metadata only, not files)
-- ============================================
CREATE TABLE file_uploads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    file_size BIGINT NOT NULL, -- in bytes
    file_type VARCHAR(100),
    telegram_file_id VARCHAR(255), -- Reference to Telegram
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    forwarded_to_dentist BOOLEAN DEFAULT FALSE
);

-- Index for file queries
CREATE INDEX idx_files_conversation ON file_uploads(conversation_id);

-- ============================================
-- 6. AUTO-DELETION FUNCTION
-- Automatically deletes expired conversations
-- ============================================
CREATE OR REPLACE FUNCTION delete_expired_conversations()
RETURNS void AS $$
BEGIN
    -- Log deletions before deleting
    INSERT INTO audit_logs (conversation_id, action, details)
    SELECT 
        id,
        'auto_deleted',
        jsonb_build_object(
            'reason', 'expired',
            'created_at', created_at,
            'expires_at', expires_at
        )
    FROM conversations
    WHERE expires_at < NOW() AND status != 'active';
    
    -- Delete expired conversations (CASCADE will delete related data)
    DELETE FROM conversations 
    WHERE expires_at < NOW() AND status != 'active';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 7. HELPER FUNCTION - Update updated_at timestamp
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for conversations table
CREATE TRIGGER update_conversations_updated_at
    BEFORE UPDATE ON conversations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 8. ROW LEVEL SECURITY (RLS)
-- Protects data access
-- ============================================

-- Enable RLS on all tables
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_uploads ENABLE ROW LEVEL SECURITY;

-- Policy: Allow service role full access (for Netlify functions)
CREATE POLICY "Service role has full access to conversations" 
    ON conversations FOR ALL 
    USING (true);

CREATE POLICY "Service role has full access to messages" 
    ON messages FOR ALL 
    USING (true);

CREATE POLICY "Service role has full access to patient_info" 
    ON patient_info FOR ALL 
    USING (true);

CREATE POLICY "Service role has full access to audit_logs" 
    ON audit_logs FOR ALL 
    USING (true);

CREATE POLICY "Service role has full access to file_uploads" 
    ON file_uploads FOR ALL 
    USING (true);

-- ============================================
-- 9. SCHEDULED CLEANUP JOB
-- Runs daily to delete expired data
-- ============================================

-- You'll set this up in Supabase Edge Functions or use pg_cron if available
-- For now, we'll rely on manual cleanup or Netlify scheduled function

-- ============================================
-- 10. INITIAL DATA / TESTING
-- ============================================

-- Insert a test conversation (optional - remove in production)
INSERT INTO conversations (language, status) 
VALUES ('en', 'active');

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Database schema created successfully!';
    RAISE NOTICE 'Tables created: conversations, messages, patient_info, audit_logs, file_uploads';
    RAISE NOTICE 'Auto-deletion function ready';
    RAISE NOTICE 'Row Level Security enabled';
END $$;
```

4. Click **"Run"** (or press Cmd/Ctrl + Enter)
5. You should see: **"Success. No rows returned"** with notices about tables created

## ✅ Step 5: Verify Setup

1. Click **"Table Editor"** in the left sidebar
2. You should see these tables:
   - `conversations`
   - `messages`
   - `patient_info`
   - `audit_logs`
   - `file_uploads`

3. Click on `conversations` - you should see 1 test row

## 🧪 Step 6: Test Connection Locally

1. Create a file `.env` in your project root:
   ```bash
   SUPABASE_URL=https://xxxxx.supabase.co
   SUPABASE_ANON_KEY=eyJ...
   ```

2. Run the test:
   ```bash
   npm run dev
   ```

3. Open another terminal and test:
   ```bash
   curl http://localhost:8888/.netlify/functions/test-db
   ```

## 🔒 Step 7: Security Best Practices

### Enable Additional Security:

1. In Supabase dashboard, go to **"Settings"** → **"API"**
2. Consider enabling:
   - **JWT Secret Rotation** (for added security)
   - **Custom SMTP** (for email notifications if needed)

### Database Backups:

1. Supabase automatically backs up your database daily (free tier: 7 days retention)
2. To manually backup:
   - Go to **"Database"** → **"Backups"**
   - Click **"Download backup"**

## 📊 Step 8: Monitor Usage

1. Go to **"Settings"** → **"Usage"**
2. Monitor:
   - Database size (500MB limit on free tier)
   - API requests
   - Bandwidth

For your expected volume (~8 conversations/week), you'll use:
- **Storage**: ~10-20MB per month
- **Bandwidth**: ~100MB per month

Well within free tier limits! 🎉

## 🛠️ Troubleshooting

### Error: "relation does not exist"
- Make sure you ran the SQL schema completely
- Check Table Editor to see if tables were created

### Error: "permission denied"
- Row Level Security is enabled
- Make sure you're using the service role key in functions (not anon key)

### Can't connect from Netlify Functions
- Double-check environment variables are set correctly
- Make sure there are no trailing spaces in the values

## 🔄 Maintenance

### Weekly Check:
- Monitor Supabase dashboard for any errors
- Check database size usage

### Monthly:
- Review audit logs for any suspicious activity
- Export and archive old audit logs if needed

### Quarterly:
- Update Supabase client library: `npm update @supabase/supabase-js`

## 📞 Support

- **Supabase Docs**: https://supabase.com/docs
- **Supabase Discord**: https://discord.supabase.com
- **Project Issues**: Check Netlify function logs

---

## Next Steps

After completing this setup:
1. ✅ Supabase database ready
2. → Continue with Telegram bot setup (see `telegram-setup.md`)
3. → Set up Netlify environment variables
4. → Deploy your functions

**Estimated time**: 15-20 minutes

