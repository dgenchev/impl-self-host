/**
 * Telegram Webhook Handler
 * Handles callback queries from inline keyboard buttons
 * Sends full conversation when user clicks "View Full Conversation" button
 * 
 * Security: Only responds to authenticated Telegram webhook callbacks.
 * The chatId is verified to match the configured TELEGRAM_CHAT_ID.
 */

const {
    getConversation,
    getConversationMessages,
    getPatientInfo
} = require('../../lib/supabase-client');
const TelegramBot = require('node-telegram-bot-api');

// Initialize bot
let bot = null;
function getBot() {
    if (!bot) {
        const token = process.env.TELEGRAM_BOT_TOKEN;
        if (!token) {
            throw new Error('TELEGRAM_BOT_TOKEN not configured');
        }
        bot = new TelegramBot(token);
    }
    return bot;
}

exports.handler = async (event, context) => {
    const headers = {
        'Content-Type': 'application/json'
    };

    try {
        // Telegram sends updates via POST
        if (event.httpMethod !== 'POST') {
            return {
                statusCode: 405,
                headers,
                body: JSON.stringify({ error: 'Method not allowed' })
            };
        }

        const update = JSON.parse(event.body);

        // Handle callback query (button click)
        if (update.callback_query) {
            const callbackQuery = update.callback_query;
            const chatId = callbackQuery.message.chat.id;
            const messageId = callbackQuery.message.message_id;
            const data = callbackQuery.data; // Contains conversationId
            const queryId = callbackQuery.id;

            // Security: Verify chatId matches configured dentist chat ID
            const expectedChatId = process.env.TELEGRAM_CHAT_ID;
            if (expectedChatId && String(chatId) !== String(expectedChatId)) {
                console.warn(`Unauthorized access attempt from chat ID: ${chatId}`);
                return {
                    statusCode: 403,
                    headers,
                    body: JSON.stringify({ error: 'Unauthorized' })
                };
            }

            // Verify this is a conversation view request
            if (data && data.startsWith('view_conv_')) {
                const conversationId = data.replace('view_conv_', '');

                // Validate UUID format
                const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
                if (!uuidRegex.test(conversationId)) {
                    const bot = getBot();
                    await bot.answerCallbackQuery(queryId, {
                        text: '❌ Невалиден ID на разговора'
                    });
                    return {
                        statusCode: 400,
                        headers,
                        body: JSON.stringify({ error: 'Invalid conversation ID' })
                    };
                }

                // Answer the callback (removes loading state)
                const bot = getBot();
                await bot.answerCallbackQuery(queryId, {
                    text: 'Зареждане на разговора...'
                });

                // Fetch conversation data
                const conversation = await getConversation(conversationId);
                const messages = await getConversationMessages(conversationId, 1000);
                const patientInfo = await getPatientInfo(conversationId);

                // Format and send full conversation
                await sendFullConversation(bot, chatId, conversation, messages, patientInfo);

                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({ ok: true })
                };
            }
        }

        // Handle regular messages (for future commands like /view <id>)
        if (update.message && update.message.text) {
            const message = update.message;
            const text = message.text.trim();
            const chatId = message.chat.id;

            // Security: Verify chatId matches configured dentist chat ID
            const expectedChatId = process.env.TELEGRAM_CHAT_ID;
            if (expectedChatId && String(chatId) !== String(expectedChatId)) {
                console.warn(`Unauthorized access attempt from chat ID: ${chatId}`);
                return {
                    statusCode: 403,
                    headers,
                    body: JSON.stringify({ error: 'Unauthorized' })
                };
            }

            // Handle /view command
            if (text.startsWith('/view ')) {
                const conversationId = text.replace('/view ', '').trim();
                
                // Validate UUID
                const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
                if (!uuidRegex.test(conversationId)) {
                    const bot = getBot();
                    await bot.sendMessage(chatId, '❌ Невалиден формат на ID на разговора.');
                    return {
                        statusCode: 200,
                        headers,
                        body: JSON.stringify({ ok: true })
                    };
                }

                try {
                    const conversation = await getConversation(conversationId);
                    const messages = await getConversationMessages(conversationId, 1000);
                    const patientInfo = await getPatientInfo(conversationId);

                    const bot = getBot();
                    await sendFullConversation(bot, chatId, conversation, messages, patientInfo);
                } catch (error) {
                    const bot = getBot();
                    await bot.sendMessage(chatId, `❌ Грешка: ${error.message}`);
                }

                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({ ok: true })
                };
            }
        }

        // Unknown update type
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ ok: true })
        };

    } catch (error) {
        console.error('Error handling Telegram webhook:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message })
        };
    }
};

/**
 * Send full conversation as formatted Telegram messages
 */
async function sendFullConversation(bot, chatId, conversation, messages, patientInfo) {
    // Send header message
    let header = `📋 *Пълен Разговор*\n\n`;
    
    if (patientInfo) {
        const fullName = [patientInfo.firstName, patientInfo.lastName].filter(Boolean).join(' ');
        header += `👤 *Пациент:* ${fullName || 'N/A'}\n`;
        if (patientInfo.phone) header += `📱 *Телефон:* ${patientInfo.phone}\n`;
        if (patientInfo.email) header += `📧 *Email:* ${patientInfo.email}\n`;
        header += `\n`;
    }
    
    header += `📅 *Създаден:* ${formatDate(conversation.created_at)}\n`;
    header += `🌐 *Език:* ${conversation.language || 'N/A'}\n`;
    header += `📊 *Статус:* ${conversation.status}\n`;
    header += `\n━━━━━━━━━━━━━━━━\n\n`;
    header += `💬 *Съобщения (${messages.length}):*\n\n`;

    await bot.sendMessage(chatId, header, { parse_mode: 'Markdown' });

    // Send messages in chunks (Telegram limit: 4096 chars per message)
    const MAX_MESSAGE_LENGTH = 3500; // Leave buffer for formatting
    let currentMessage = '';
    let messageCount = 0;

    for (const msg of messages) {
        const role = msg.role === 'user' ? '👤 *Пациент*' : '🤖 *AI Асистент*';
        const timestamp = formatDate(msg.timestamp);
        const content = msg.content;
        
        const formattedMsg = `${role} (${timestamp}):\n${content}\n\n━━━━━━━━━━━━━━━━\n\n`;

        // Check if adding this message would exceed limit
        if (currentMessage.length + formattedMsg.length > MAX_MESSAGE_LENGTH && currentMessage.length > 0) {
            // Send current chunk
            await bot.sendMessage(chatId, currentMessage, { parse_mode: 'Markdown' });
            messageCount++;
            currentMessage = formattedMsg;
        } else {
            currentMessage += formattedMsg;
        }
    }

    // Send remaining messages
    if (currentMessage.length > 0) {
        await bot.sendMessage(chatId, currentMessage, { parse_mode: 'Markdown' });
        messageCount++;
    }

    // Send footer
    const footer = `\n🆔 *ID:* \`${conversation.id}\`\n\n_Разговорът е изпратен в ${messageCount} съобщения._`;
    await bot.sendMessage(chatId, footer, { parse_mode: 'Markdown' });
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('bg-BG', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

