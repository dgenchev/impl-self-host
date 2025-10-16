/**
 * Daily Summary Function
 * Scheduled to run daily at 6 PM Bulgarian time
 * Sends summary of all conversations to dentist's Telegram
 */

const {
    getTodayConversations
} = require('../../lib/supabase-client');
const {
    generateDailySummary
} = require('../../lib/openai-client');
const {
    sendDailySummary
} = require('../../lib/telegram-client');
const { format } = require('date-fns');

exports.handler = async (event, context) => {
    try {
        console.log('📊 Starting daily summary generation...');

        const today = format(new Date(), 'yyyy-MM-dd');
        
        // Step 1: Get all conversations from today
        const conversations = await getTodayConversations();

        console.log(`Found ${conversations.length} conversations for ${today}`);

        // If no conversations, skip sending summary
        // Health check will ensure system is running
        if (conversations.length === 0) {
            console.log('ℹ️ No conversations today, skipping summary (health check will monitor system)');

            return {
                statusCode: 200,
                body: JSON.stringify({
                    success: true,
                    message: 'No conversations today, summary skipped',
                    date: today,
                    conversationCount: 0
                })
            };
        }

        // Step 2: Generate Bulgarian summary using OpenAI
        console.log('🤖 Generating summary with OpenAI...');
        const summary = await generateDailySummary(conversations);

        // Step 3: Send to Telegram
        console.log('📤 Sending to Telegram...');
        await sendDailySummary(summary, today, conversations.length);

        console.log('✅ Daily summary sent successfully');

        // Return success
        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                message: 'Daily summary sent',
                date: today,
                conversationCount: conversations.length,
                timestamp: new Date().toISOString()
            })
        };

    } catch (error) {
        console.error('❌ Error generating daily summary:', error);

        // Try to send error notification
        try {
            const { sendErrorNotification } = require('../../lib/telegram-client');
            await sendErrorNotification(error, 'daily-summary function');
        } catch (telegramError) {
            console.error('Failed to send error notification:', telegramError);
        }

        return {
            statusCode: 500,
            body: JSON.stringify({
                success: false,
                error: 'Failed to generate daily summary',
                message: error.message
            })
        };
    }
};



