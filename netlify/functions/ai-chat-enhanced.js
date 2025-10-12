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
    markPatientNotified
} = require('../../lib/supabase-client');
const {
    detectLanguage,
    processMessage,
    extractPatientInfo,
    generateBulgarianSummary
} = require('../../lib/openai-client');
const { getConsentText } = require('../../lib/gdpr-utils');
const { sanitizeInput } = require('../../lib/gdpr-utils');
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

// Input validation schema
const ChatRequestSchema = z.object({
    message: z.string().min(1).max(2000),
    conversationId: z.string().uuid().optional(),
    language: z.enum(['en', 'bg', 'ru', 'fr', 'auto']).optional().default('auto')
});

exports.handler = async (event, context) => {
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
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
                console.error('Failed to retrieve conversation, creating new one:', error);
                conversation = await createConversation(validatedData.language, metadata);
            }
        } else {
            // Create new conversation
            conversation = await createConversation(validatedData.language, metadata);
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

        if (totalMessages >= 4) {
            // Get fresh conversation history including new messages
            const fullHistory = await getConversationMessages(conversation.id);
            
            // Extract patient information
            const extracted = await extractPatientInfo(fullHistory);

            if (extracted.isComplete) {
                // Check if we already saved this info
                const existingInfo = await getPatientInfo(conversation.id);

                if (!existingInfo) {
                    // Save patient info with consent
                    const consentText = getConsentText(language);
                    
                    await savePatientInfo(
                        conversation.id,
                        {
                            firstName: extracted.firstName,
                            lastName: extracted.lastName,
                            phone: extracted.phone,
                            email: extracted.email,
                            dentalConcerns: extracted.dentalConcerns,
                            preferredTimes: extracted.preferredTimes
                        },
                        consentText
                    );

                    // Update conversation status
                    await updateConversation(conversation.id, { status: 'completed' });

                    questionnaireComplete = true;
                    patientInfo = extracted;

                    console.log('✅ Patient info collected:', conversation.id);

                    // Trigger Telegram notification (async, don't wait)
                    triggerTelegramNotification(conversation.id).catch(error => {
                        console.error('⚠️ Failed to send Telegram notification for conversation:', conversation.id);
                        console.error('⚠️ Error details:', error.message);
                        console.error('⚠️ Error stack:', error.stack);
                        // Don't throw - notification failure shouldn't break the chat
                    });
                }
            }
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
                patientInfo: questionnaireComplete ? {
                    firstName: patientInfo.firstName,
                    lastName: patientInfo.lastName,
                    phone: patientInfo.phone
                } : null,
                messageCount: totalMessages
            })
        };

    } catch (error) {
        console.error('Error in ai-chat-enhanced:', error);

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

