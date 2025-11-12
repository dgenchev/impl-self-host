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
language VARCHAR(10),
status VARCHAR(20) DEFAULT 'active',
expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
ip_address VARCHAR(50),
user_agent TEXT
);

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
role VARCHAR(20) NOT NULL,
content_encrypted TEXT NOT NULL,
timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id, timestamp);

-- ============================================
-- 3. PATIENT_INFO TABLE
-- Stores encrypted patient information
-- ============================================
CREATE TABLE patient_info (
conversation_id UUID PRIMARY KEY REFERENCES conversations(id) ON DELETE CASCADE,
first_name_encrypted TEXT,
last_name_encrypted TEXT,
phone_encrypted TEXT,
email_encrypted TEXT,
dental_concerns_encrypted TEXT,
preferred_times_encrypted TEXT,
consent_given_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
consent_text TEXT NOT NULL,
notified_dentist BOOLEAN DEFAULT FALSE,
notified_at TIMESTAMPTZ
);

-- ============================================
-- 4. AUDIT_LOGS TABLE
-- GDPR compliance - tracks all data access
-- ============================================
CREATE TABLE audit_logs (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
conversation_id UUID REFERENCES conversations(id) ON DELETE SET NULL,
action VARCHAR(50) NOT NULL,
details JSONB,
timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
ip_address VARCHAR(50),
user_agent TEXT
);

CREATE INDEX idx_audit_conversation ON audit_logs(conversation_id);
CREATE INDEX idx_audit_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX idx_audit_action ON audit_logs(action);

-- ============================================
-- 5. FILE_UPLOADS TABLE
-- Tracks X-ray uploads (metadata only)
-- ============================================
CREATE TABLE file_uploads (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
filename VARCHAR(255) NOT NULL,
file_size BIGINT NOT NULL,
file_type VARCHAR(100),
telegram_file_id VARCHAR(255),
uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
forwarded_to_dentist BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_files_conversation ON file_uploads(conversation_id);

-- ============================================
-- 6. AUTO-DELETION FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION delete_expired_conversations()
RETURNS void AS $$
BEGIN
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

DELETE FROM conversations 
WHERE expires_at < NOW() AND status != 'active';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 7. HELPER FUNCTION - Update timestamp
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = NOW();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_conversations_updated_at
BEFORE UPDATE ON conversations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 8. ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_uploads ENABLE ROW LEVEL SECURITY;

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
-- 10. TEST DATA
-- ============================================
INSERT INTO conversations (language, status) 
VALUES ('en', 'active');

-- Success message
DO $$
BEGIN
RAISE NOTICE 'Database schema created successfully!';
RAISE NOTICE 'Tables: conversations, messages, patient_info, audit_logs, file_uploads';
RAISE NOTICE 'Auto-deletion function ready';
RAISE NOTICE 'Row Level Security enabled';
END $$;












