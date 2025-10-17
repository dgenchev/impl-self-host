/**
 * Telegram Notification Function
 * Sends notifications to dentist when patient completes questionnaire
 */

const {
    sendNewPatientNotification
} = require('../../lib/telegram-client');
const {
    getConversation,
    getConversationMessages,
    getPatientInfo,
    markPatientNotified
} = require('../../lib/supabase-client');
const {
    generateBulgarianSummary
} = require('../../lib/openai-client');

exports.handler = async (event, context) => {
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
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
        // Parse request
        const { conversationId } = JSON.parse(event.body);

        if (!conversationId) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'conversationId is required' })
            };
        }

        console.log('📱 Processing Telegram notification for:', conversationId);

        // Step 1: Get conversation and patient info
        const conversation = await getConversation(conversationId);
        const patientInfo = await getPatientInfo(conversationId);

        if (!patientInfo) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    error: 'No patient info found for this conversation',
                    conversationId 
                })
            };
        }

        // Check if already notified
        if (patientInfo.notifiedDentist) {
            console.log('ℹ️ Dentist already notified for this conversation');
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    message: 'Dentist was already notified',
                    alreadyNotified: true
                })
            };
        }

        // Step 2: Get conversation history for summary
        const messages = await getConversationMessages(conversationId);

        // Step 3: Generate Bulgarian summary
        console.log('🤖 Generating Bulgarian summary...');
        const summary = await generateBulgarianSummary(messages, patientInfo);

        // Step 4: Send to Telegram
        console.log('📤 Sending to Telegram...');
        const telegramResponse = await sendNewPatientNotification(
            patientInfo,
            summary,
            conversationId
        );

        // Step 5: Mark as notified
        await markPatientNotified(conversationId);

        console.log('✅ Telegram notification sent successfully');

        // Success response
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Notification sent to dentist',
                conversationId: conversationId,
                telegramMessageId: telegramResponse.message_id,
                patientName: `${patientInfo.firstName} ${patientInfo.lastName}`,
                notifiedAt: new Date().toISOString()
            })
        };

    } catch (error) {
        console.error('❌ Error sending Telegram notification:', error.message);

        // Try to send error notification to Telegram
        try {
            const { sendErrorNotification } = require('../../lib/telegram-client');
            await sendErrorNotification(error, 'telegram-notify function');
        } catch (telegramError) {
            console.error('Failed to send error notification:', telegramError);
        }

        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                error: 'Failed to send notification',
                message: error.message,
                conversationId: event.body ? JSON.parse(event.body).conversationId : null
            })
        };
    }
};



