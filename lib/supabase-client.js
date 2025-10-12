/**
 * Supabase Database Client
 * Handles all database operations for the dental chatbot
 */

const { createClient } = require('@supabase/supabase-js');
const { encrypt, decrypt } = require('./encryption-utils');

// Initialize Supabase client
let supabase = null;

function getSupabaseClient() {
    if (!supabase) {
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
            throw new Error('Supabase credentials not configured');
        }

        supabase = createClient(supabaseUrl, supabaseKey);
    }
    return supabase;
}

/**
 * Create a new conversation
 */
async function createConversation(language = 'auto', metadata = {}) {
    const client = getSupabaseClient();
    
    const { data, error } = await client
        .from('conversations')
        .insert({
            language,
            status: 'active',
            ip_address: metadata.ip,
            user_agent: metadata.userAgent
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating conversation:', error);
        throw error;
    }

    // Log creation
    await logAudit(data.id, 'created', { language }, metadata);

    return data;
}

/**
 * Get conversation by ID
 */
async function getConversation(conversationId) {
    const client = getSupabaseClient();
    
    const { data, error } = await client
        .from('conversations')
        .select('*')
        .eq('id', conversationId)
        .single();

    if (error) {
        console.error('Error fetching conversation:', error);
        throw error;
    }

    return data;
}

/**
 * Update conversation
 */
async function updateConversation(conversationId, updates) {
    const client = getSupabaseClient();
    
    const { data, error } = await client
        .from('conversations')
        .update(updates)
        .eq('id', conversationId)
        .select()
        .single();

    if (error) {
        console.error('Error updating conversation:', error);
        throw error;
    }

    return data;
}

/**
 * Save a message (encrypted)
 */
async function saveMessage(conversationId, role, content) {
    const client = getSupabaseClient();
    
    // Encrypt the message content
    const contentEncrypted = encrypt(content);

    const { data, error } = await client
        .from('messages')
        .insert({
            conversation_id: conversationId,
            role,
            content_encrypted: contentEncrypted
        })
        .select()
        .single();

    if (error) {
        console.error('Error saving message:', error);
        throw error;
    }

    return data;
}

/**
 * Get conversation messages (decrypted)
 */
async function getConversationMessages(conversationId, limit = 20) {
    const client = getSupabaseClient();
    
    const { data, error } = await client
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('timestamp', { ascending: true })
        .limit(limit);

    if (error) {
        console.error('Error fetching messages:', error);
        throw error;
    }

    // Decrypt messages
    return data.map(msg => ({
        id: msg.id,
        role: msg.role,
        content: decrypt(msg.content_encrypted),
        timestamp: msg.timestamp
    }));
}

/**
 * Save patient information (encrypted)
 */
async function savePatientInfo(conversationId, patientInfo, consentText) {
    const client = getSupabaseClient();
    
    const encryptedInfo = {
        conversation_id: conversationId,
        consent_text: consentText,
        consent_given_at: new Date().toISOString()
    };

    // Encrypt sensitive fields
    if (patientInfo.firstName) {
        encryptedInfo.first_name_encrypted = encrypt(patientInfo.firstName);
    }
    if (patientInfo.lastName) {
        encryptedInfo.last_name_encrypted = encrypt(patientInfo.lastName);
    }
    if (patientInfo.phone) {
        encryptedInfo.phone_encrypted = encrypt(patientInfo.phone);
    }
    if (patientInfo.email) {
        encryptedInfo.email_encrypted = encrypt(patientInfo.email);
    }
    if (patientInfo.dentalConcerns) {
        encryptedInfo.dental_concerns_encrypted = encrypt(patientInfo.dentalConcerns);
    }
    if (patientInfo.preferredTimes) {
        encryptedInfo.preferred_times_encrypted = encrypt(patientInfo.preferredTimes);
    }

    const { data, error } = await client
        .from('patient_info')
        .upsert(encryptedInfo)
        .select()
        .single();

    if (error) {
        console.error('Error saving patient info:', error);
        throw error;
    }

    // Log data collection
    await logAudit(conversationId, 'patient_info_collected', {
        fields: Object.keys(patientInfo)
    });

    return data;
}

/**
 * Get patient information (decrypted)
 */
async function getPatientInfo(conversationId) {
    const client = getSupabaseClient();
    
    const { data, error } = await client
        .from('patient_info')
        .select('*')
        .eq('conversation_id', conversationId)
        .single();

    if (error) {
        if (error.code === 'PGRST116') {
            // No patient info found
            return null;
        }
        console.error('Error fetching patient info:', error);
        throw error;
    }

    // Decrypt fields
    const decrypted = {
        conversationId: data.conversation_id,
        consentGivenAt: data.consent_given_at,
        notifiedDentist: data.notified_dentist,
        notifiedAt: data.notified_at
    };

    if (data.first_name_encrypted) {
        decrypted.firstName = decrypt(data.first_name_encrypted);
    }
    if (data.last_name_encrypted) {
        decrypted.lastName = decrypt(data.last_name_encrypted);
    }
    if (data.phone_encrypted) {
        decrypted.phone = decrypt(data.phone_encrypted);
    }
    if (data.email_encrypted) {
        decrypted.email = decrypt(data.email_encrypted);
    }
    if (data.dental_concerns_encrypted) {
        decrypted.dentalConcerns = decrypt(data.dental_concerns_encrypted);
    }
    if (data.preferred_times_encrypted) {
        decrypted.preferredTimes = decrypt(data.preferred_times_encrypted);
    }

    return decrypted;
}

/**
 * Mark patient as notified
 */
async function markPatientNotified(conversationId) {
    const client = getSupabaseClient();
    
    const { data, error } = await client
        .from('patient_info')
        .update({
            notified_dentist: true,
            notified_at: new Date().toISOString()
        })
        .eq('conversation_id', conversationId)
        .select()
        .single();

    if (error) {
        console.error('Error marking patient notified:', error);
        throw error;
    }

    await logAudit(conversationId, 'notified', { type: 'dentist' });

    return data;
}

/**
 * Log file upload
 */
async function logFileUpload(conversationId, fileInfo) {
    const client = getSupabaseClient();
    
    const { data, error } = await client
        .from('file_uploads')
        .insert({
            conversation_id: conversationId,
            filename: fileInfo.filename,
            file_size: fileInfo.size,
            file_type: fileInfo.type,
            telegram_file_id: fileInfo.telegramFileId,
            forwarded_to_dentist: fileInfo.forwarded || false
        })
        .select()
        .single();

    if (error) {
        console.error('Error logging file upload:', error);
        throw error;
    }

    await logAudit(conversationId, 'file_uploaded', {
        filename: fileInfo.filename,
        size: fileInfo.size
    });

    return data;
}

/**
 * Get today's conversations (with decrypted messages)
 */
async function getTodayConversations() {
    const client = getSupabaseClient();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data, error } = await client
        .from('conversations')
        .select(`
            *,
            messages(*),
            patient_info(*)
        `)
        .gte('created_at', today.toISOString())
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching today\'s conversations:', error);
        throw error;
    }

    // Decrypt messages and patient info for each conversation
    const decryptedData = data.map(conv => {
        const decryptedConv = { ...conv };
        
        // Decrypt messages
        if (conv.messages && conv.messages.length > 0) {
            decryptedConv.messages = conv.messages.map(msg => ({
                id: msg.id,
                conversation_id: msg.conversation_id,
                role: msg.role,
                content: decrypt(msg.content_encrypted),
                timestamp: msg.timestamp
            }));
        }
        
        // Decrypt patient info if exists
        if (conv.patient_info && conv.patient_info.length > 0) {
            const pInfo = conv.patient_info[0];
            decryptedConv.patient_info = {
                conversation_id: pInfo.conversation_id,
                firstName: pInfo.first_name_encrypted ? decrypt(pInfo.first_name_encrypted) : null,
                lastName: pInfo.last_name_encrypted ? decrypt(pInfo.last_name_encrypted) : null,
                phone: pInfo.phone_encrypted ? decrypt(pInfo.phone_encrypted) : null,
                email: pInfo.email_encrypted ? decrypt(pInfo.email_encrypted) : null,
                dentalConcerns: pInfo.dental_concerns_encrypted ? decrypt(pInfo.dental_concerns_encrypted) : null,
                preferredTimes: pInfo.preferred_times_encrypted ? decrypt(pInfo.preferred_times_encrypted) : null,
                consentGivenAt: pInfo.consent_given_at,
                notifiedDentist: pInfo.notified_dentist,
                notifiedAt: pInfo.notified_at
            };
        }
        
        return decryptedConv;
    });

    return decryptedData;
}

/**
 * Log audit event
 */
async function logAudit(conversationId, action, details = {}, metadata = {}) {
    const client = getSupabaseClient();
    
    const { error } = await client
        .from('audit_logs')
        .insert({
            conversation_id: conversationId,
            action,
            details,
            ip_address: metadata.ip,
            user_agent: metadata.userAgent
        });

    if (error) {
        console.error('Error logging audit:', error);
        // Don't throw - audit logging shouldn't break main flow
    }
}

/**
 * Delete conversation (GDPR right to deletion)
 */
async function deleteConversation(conversationId, reason = 'user_request') {
    const client = getSupabaseClient();
    
    // Log deletion before deleting
    await logAudit(conversationId, 'deleted', { reason });

    // Delete conversation (CASCADE will delete related data)
    const { error } = await client
        .from('conversations')
        .delete()
        .eq('id', conversationId);

    if (error) {
        console.error('Error deleting conversation:', error);
        throw error;
    }

    return { success: true, conversationId, deletedAt: new Date().toISOString() };
}

/**
 * Export conversation data (GDPR right to portability)
 */
async function exportConversationData(conversationId) {
    const conversation = await getConversation(conversationId);
    const messages = await getConversationMessages(conversationId, 1000);
    const patientInfo = await getPatientInfo(conversationId);

    await logAudit(conversationId, 'exported');

    return {
        conversation,
        messages,
        patientInfo,
        exportedAt: new Date().toISOString()
    };
}

/**
 * Clean up expired conversations (called by scheduled function)
 */
async function cleanupExpiredConversations() {
    const client = getSupabaseClient();
    
    const { data, error } = await client.rpc('delete_expired_conversations');

    if (error) {
        console.error('Error cleaning up conversations:', error);
        throw error;
    }

    return { success: true, cleanedAt: new Date().toISOString() };
}

module.exports = {
    getSupabaseClient,
    createConversation,
    getConversation,
    updateConversation,
    saveMessage,
    getConversationMessages,
    savePatientInfo,
    getPatientInfo,
    markPatientNotified,
    logFileUpload,
    getTodayConversations,
    logAudit,
    deleteConversation,
    exportConversationData,
    cleanupExpiredConversations
};

