/**
 * Enhanced AI Chat Function
 * Full chatbot with conversation context, multilingual support, and patient info extraction
 */

const { z } = require('zod');
const {
    createConversation,
    getConversation,
    updateConversation,
    saveMessage,
    getConversationMessages,
    savePatientInfo,
    getPatientInfo,
    markPatientNotified,
    logAudit
} = require('../../lib/supabase-client');
const {
    detectLanguage,
    processMessage,
    extractPatientInfo,
    generateBulgarianSummary
} = require('../../lib/openai-client');
const { getConsentText, sanitizeInput } = require('../../lib/gdpr-utils');
const {
    sendNewPatientNotification
} = require('../../lib/telegram-client');

/**
 * Trigger Telegram notification asynchronously
 * Sends notification to dentist when patient completes questionnaire
 */
async function triggerTelegramNotification(conversationId) {
    try {
        console.log('📱 Triggering Telegram notification for:', conversationId);

        // Get patient info and messages
        console.log('📱 Getting patient info...');
        const patientInfo = await getPatientInfo(conversationId);
        console.log('📱 Patient info retrieved:', patientInfo ? 'found' : 'not found');
        if (patientInfo) {
            await logAudit(conversationId, 'patient_info_accessed', { purpose: 'telegram_notification' });
        }
        
        console.log('📱 Getting conversation messages...');
        const messages = await getConversationMessages(conversationId);
        console.log('📱 Messages retrieved:', messages ? messages.length : 0, 'messages');

        // Generate Bulgarian summary
        console.log('📱 Generating Bulgarian summary...');
        const summary = await generateBulgarianSummary(messages, patientInfo);
        console.log('📱 Summary generated, length:', summary ? summary.length : 0);

        // Send to Telegram
        console.log('📱 Sending to Telegram...');
        await sendNewPatientNotification(patientInfo, summary, conversationId);
        console.log('📱 Telegram message sent');

        // Mark as notified
        console.log('📱 Marking as notified...');
        await markPatientNotified(conversationId);
        console.log('📱 Marked as notified');

        console.log('✅ Telegram notification sent successfully');
    } catch (error) {
        console.error('❌ Error in Telegram notification for conversation:', conversationId);
        console.error('❌ Error type:', error.constructor.name);
        console.error('❌ Error message:', error.message);
        console.error('❌ Error stack:', error.stack);
        throw error;
    }
}

// Pre-canned responses for consent handling (avoids extra OpenAI call)
const CONSENT_ACCEPTED_MESSAGES = {
    en: "Thank you for your consent. Dr. Genchev's office will contact you soon to schedule your appointment.",
    bg: "Благодарим за вашето съгласие. Офисът на д-р Генчев ще се свърже с вас скоро за насрочване на час.",
    ru: "Спасибо за согласие. Офис доктора Генчева свяжется с вами в ближайшее время для записи на прием.",
    fr: "Merci pour votre consentement. Le cabinet du Dr Genchev vous contactera bientôt pour planifier votre rendez-vous."
};

const CONSENT_DECLINED_MESSAGES = {
    en: "Understood. Your contact information will not be saved. Please feel free to continue asking questions.",
    bg: "Разбрахме. Вашите данни няма да бъдат запазени. Можете да продължите да задавате въпроси.",
    ru: "Понятно. Ваши данные не будут сохранены. Вы можете продолжать задавать вопросы.",
    fr: "Compris. Vos coordonnées ne seront pas enregistrées. N'hésitez pas à continuer à poser des questions."
};

// Input validation schema
const ChatRequestSchema = z.object({
    message: z.string().max(2000).optional().default(''),
    conversationId: z.string().uuid().optional(),
    language: z.enum(['en', 'bg', 'ru', 'fr', 'auto']).optional().default('auto'),
    gdprConsented: z.boolean().optional()
}).refine(data => data.message.length > 0 || data.gdprConsented !== undefined, {
    message: 'Either message or gdprConsented must be provided'
});

const ALLOWED_ORIGINS = new Set([
    'https://dentalimplantsgenchev.com',
    'https://www.dentalimplantsgenchev.com',
    'https://dr-genchevi.com',
    'https://www.dr-genchevi.com'
]);

exports.handler = async (event, context) => {
    const origin = event.headers.origin || '';
    const corsOrigin = ALLOWED_ORIGINS.has(origin)
        ? origin
        : (process.env.NODE_ENV !== 'production' ? '*' : 'https://dentalimplantsgenchev.com');

    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': corsOrigin,
        'Access-Control-Allow-Headers': 'Content-Type, x-conversation-id',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle preflight
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    // Only allow POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        // Parse and validate request
        const body = JSON.parse(event.body);
        const validatedData = ChatRequestSchema.parse(body);

        // Sanitize input
        const message = sanitizeInput(validatedData.message);

        // Get metadata
        const metadata = {
            ip: event.headers['x-forwarded-for'] || event.headers['client-ip'],
            userAgent: event.headers['user-agent']
        };

        // Step 1: Get or create conversation
        let conversation;
        let conversationHistory = [];

        if (validatedData.conversationId) {
            // Retrieve existing conversation
            try {
                conversation = await getConversation(validatedData.conversationId);
                conversationHistory = await getConversationMessages(validatedData.conversationId);
            } catch (error) {
                console.error('Failed to retrieve conversation, creating new one:', error.message);
                conversation = await createConversation(validatedData.language, metadata);
            }
        } else {
            // Create new conversation
            conversation = await createConversation(validatedData.language, metadata);
        }

        // Step 2 (pre-check): Handle explicit GDPR consent response — no OpenAI call needed
        if (conversation.status === 'awaiting_consent' && validatedData.gdprConsented !== undefined) {
            const lang = conversation.language || 'en';

            if (validatedData.gdprConsented === true) {
                const fullHistory = await getConversationMessages(conversation.id);
                const extracted = await extractPatientInfo(fullHistory);

                if (extracted.isComplete) {
                    const consentText = getConsentText(lang);
                    await savePatientInfo(conversation.id, {
                        firstName: extracted.firstName,
                        lastName: extracted.lastName,
                        phone: extracted.phone,
                        email: extracted.email,
                        dentalConcerns: extracted.dentalConcerns,
                        preferredTimes: extracted.preferredTimes
                    }, consentText);
                    await updateConversation(conversation.id, { status: 'completed' });

                    triggerTelegramNotification(conversation.id).catch(err => {
                        console.error('⚠️ Failed to send Telegram notification:', err.message);
                    });
                }

                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({
                        response: CONSENT_ACCEPTED_MESSAGES[lang] || CONSENT_ACCEPTED_MESSAGES.en,
                        conversationId: conversation.id,
                        language: lang,
                        questionnaireComplete: true,
                        consentAccepted: true
                    })
                };
            } else {
                // Patient declined — reset to active so chat can continue normally
                await updateConversation(conversation.id, { status: 'active' });

                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({
                        response: CONSENT_DECLINED_MESSAGES[lang] || CONSENT_DECLINED_MESSAGES.en,
                        conversationId: conversation.id,
                        language: lang,
                        consentDeclined: true
                    })
                };
            }
        }

        // Step 2: Detect or get language
        let language = conversation.language;
        
        if (!language || language === 'auto') {
            // Detect language from first message
            language = await detectLanguage(message);
            await updateConversation(conversation.id, { language });
        }

        // Step 3: Build conversation context for OpenAI
        const contextMessages = conversationHistory.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'assistant',
            content: msg.content
        }));

        // Step 4: Process message with OpenAI
        const aiResponse = await processMessage(message, contextMessages, language);

        // Step 5: Save both messages to database
        await saveMessage(conversation.id, 'user', message);
        await saveMessage(conversation.id, 'assistant', aiResponse);

        // Step 6: Check if we should extract patient info
        // Only check after a few messages to avoid false positives
        const totalMessages = conversationHistory.length + 2; // +2 for messages we just added

        let patientInfo = null;
        let questionnaireComplete = false;
        let requiresConsent = false;
        let consentText = null;

        // Only attempt extraction after enough context, and skip if already awaiting consent
        if (totalMessages >= 4 && conversation.status !== 'awaiting_consent') {
            const fullHistory = await getConversationMessages(conversation.id);
            const extracted = await extractPatientInfo(fullHistory);

            if (extracted.isComplete) {
                const existingInfo = await getPatientInfo(conversation.id);

                if (!existingInfo) {
                    // Request explicit consent before persisting PII
                    await updateConversation(conversation.id, { status: 'awaiting_consent' });
                    requiresConsent = true;
                    consentText = getConsentText(language);
                    console.log('📋 Consent requested for conversation:', conversation.id);
                }
            }
        }

        // If the conversation was already awaiting consent (e.g. user sent another message),
        // remind the frontend to show the consent prompt again.
        if (!requiresConsent && conversation.status === 'awaiting_consent') {
            requiresConsent = true;
            consentText = getConsentText(language);
        }

        // Step 7: Return response
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                response: aiResponse,
                conversationId: conversation.id,
                language: language,
                questionnaireComplete: questionnaireComplete,
                requiresConsent: requiresConsent || undefined,
                consentText: consentText || undefined,
                patientInfo: questionnaireComplete ? {
                    firstName: patientInfo?.firstName,
                    lastName: patientInfo?.lastName,
                    phone: patientInfo?.phone
                } : null,
                messageCount: totalMessages
            })
        };

    } catch (error) {
        console.error('Error in ai-chat-enhanced:', error.message);

        // Handle validation errors
        if (error instanceof z.ZodError) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    error: 'Invalid request',
                    details: error.errors
                })
            };
        }

        // Handle other errors
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'An error occurred processing your message',
                message: error.message,
                // Include stack trace in development
                ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
            })
        };
    }
};

