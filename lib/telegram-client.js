/**
 * Telegram Bot Client
 * Handles sending notifications to dentist via Telegram
 */

const TelegramBot = require('node-telegram-bot-api');

let bot = null;

/**
 * Get Telegram bot instance
 */
function getTelegramBot() {
    if (!bot) {
        const token = process.env.TELEGRAM_BOT_TOKEN;
        
        if (!token) {
            throw new Error('TELEGRAM_BOT_TOKEN not configured');
        }
        
        bot = new TelegramBot(token);
    }
    
    return bot;
}

/**
 * Get dentist's chat ID
 */
function getDentistChatId() {
    const chatId = process.env.TELEGRAM_CHAT_ID;
    
    if (!chatId) {
        throw new Error('TELEGRAM_CHAT_ID not configured');
    }
    
    return chatId;
}

/**
 * Send text message to dentist
 */
async function sendMessage(text, options = {}) {
    try {
        const bot = getTelegramBot();
        const chatId = getDentistChatId();
        
        const defaultOptions = {
            parse_mode: 'Markdown',
            disable_web_page_preview: true
        };
        
        const response = await bot.sendMessage(
            chatId,
            text,
            { ...defaultOptions, ...options }
        );
        
        return response;
    } catch (error) {
        console.error('Error sending Telegram message:', error);
        throw error;
    }
}

/**
 * Send new patient notification (when questionnaire is completed)
 */
async function sendNewPatientNotification(patientInfo, summary, conversationId) {
    const fullName = `${patientInfo.firstName} ${patientInfo.lastName}`;
    const phone = patientInfo.phone;
    const email = patientInfo.email ? `📧 Email: ${patientInfo.email}\n` : '';
    const concerns = patientInfo.dentalConcerns 
        ? `\n🦷 Проблеми:\n${patientInfo.dentalConcerns}\n` 
        : '';
    const times = patientInfo.preferredTimes 
        ? `\n🕒 Предпочитани часове: ${patientInfo.preferredTimes}\n` 
        : '';
    
    const siteUrl = process.env.SITE_URL || 'https://your-site.netlify.app';
    const conversationUrl = `${siteUrl}/admin/conversation/${conversationId}`;
    
    const message = `🦷 *Нов Пациент - Попълнена Информация*

👤 *Име:* ${fullName}
📱 *Телефон:* ${phone}
${email}
━━━━━━━━━━━━━━━━

📋 *Резюме на разговора:*
${summary}
${concerns}${times}
━━━━━━━━━━━━━━━━

🆔 Разговор: \`${conversationId}\`

_Това съобщение беше генерирано автоматично от AI асистента._`;
    
    return sendMessage(message);
}

/**
 * Send daily summary
 */
async function sendDailySummary(summary, date, conversationCount) {
    const message = `📊 *Дневен Резюме* - ${date}

📈 Общо разговори: *${conversationCount}*

${summary}

━━━━━━━━━━━━━━━━

_Автоматично генериран доклад от AI асистента._`;
    
    return sendMessage(message);
}

/**
 * Send X-ray file to dentist
 */
async function sendXRay(fileBuffer, patientInfo, conversationId) {
    try {
        const bot = getTelegramBot();
        const chatId = getDentistChatId();
        
        const caption = `📷 *X-Ray от пациент*

👤 ${patientInfo.firstName} ${patientInfo.lastName}
📱 ${patientInfo.phone}
🆔 ${conversationId}

_Изпратено от AI асистента_`;
        
        const response = await bot.sendPhoto(chatId, fileBuffer, {
            caption,
            parse_mode: 'Markdown'
        });
        
        return {
            success: true,
            fileId: response.photo[0].file_id,
            messageId: response.message_id
        };
    } catch (error) {
        console.error('Error sending X-ray to Telegram:', error);
        throw error;
    }
}

/**
 * Send document (for larger files)
 */
async function sendDocument(fileBuffer, filename, patientInfo, conversationId) {
    try {
        const bot = getTelegramBot();
        const chatId = getDentistChatId();
        
        const caption = `📄 *Документ от пациент*

👤 ${patientInfo.firstName} ${patientInfo.lastName}
📱 ${patientInfo.phone}
📁 ${filename}
🆔 ${conversationId}

_Изпратено от AI асистента_`;
        
        const response = await bot.sendDocument(chatId, fileBuffer, {
            caption,
            parse_mode: 'Markdown'
        }, {
            filename: filename
        });
        
        return {
            success: true,
            fileId: response.document.file_id,
            messageId: response.message_id
        };
    } catch (error) {
        console.error('Error sending document to Telegram:', error);
        throw error;
    }
}

/**
 * Send error notification
 */
async function sendErrorNotification(error, context) {
    const message = `⚠️ *System Error*

*Error:* ${error.message}

*Context:* ${context}

*Time:* ${new Date().toISOString()}

_This is an automated system notification._`;
    
    try {
        return sendMessage(message);
    } catch (e) {
        console.error('Failed to send error notification:', e);
        // Don't throw - error notification failure shouldn't break main flow
    }
}

/**
 * Send test message (for setup verification)
 */
async function sendTestMessage() {
    const message = `🧪 *Test Message*

Your Telegram bot is configured correctly! ✅

You will receive notifications here when:
- Patients complete the questionnaire
- X-rays are uploaded
- Daily summary is generated (6 PM)

_This is a test from your Dr Genchev Dental Bot._`;
    
    return sendMessage(message);
}

/**
 * Format conversation for Telegram
 */
function formatConversationForTelegram(messages) {
    let formatted = '';
    
    messages.forEach((msg, index) => {
        const role = msg.role === 'user' ? '👤 Пациент' : '🤖 AI';
        const content = msg.content.length > 200 
            ? msg.content.substring(0, 200) + '...'
            : msg.content;
        
        formatted += `${role}: ${content}\n\n`;
        
        // Limit to first 5 messages for summary
        if (index >= 4) {
            formatted += '_(съкратено)_\n';
            return false;
        }
    });
    
    return formatted;
}

/**
 * Escape markdown characters
 */
function escapeMarkdown(text) {
    if (!text) return '';
    
    return text
        .replace(/_/g, '\\_')
        .replace(/\*/g, '\\*')
        .replace(/\[/g, '\\[')
        .replace(/\]/g, '\\]')
        .replace(/\(/g, '\\(')
        .replace(/\)/g, '\\)')
        .replace(/~/g, '\\~')
        .replace(/`/g, '\\`')
        .replace(/>/g, '\\>')
        .replace(/#/g, '\\#')
        .replace(/\+/g, '\\+')
        .replace(/-/g, '\\-')
        .replace(/=/g, '\\=')
        .replace(/\|/g, '\\|')
        .replace(/\{/g, '\\{')
        .replace(/\}/g, '\\}')
        .replace(/\./g, '\\.')
        .replace(/!/g, '\\!');
}

module.exports = {
    getTelegramBot,
    sendMessage,
    sendNewPatientNotification,
    sendDailySummary,
    sendXRay,
    sendDocument,
    sendErrorNotification,
    sendTestMessage,
    formatConversationForTelegram,
    escapeMarkdown
};



