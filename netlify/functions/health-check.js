/**
 * Health Check Function
 * Scheduled to run daily at 9 AM Bulgarian time
 * Verifies all critical services are operational
 * Sends notification to Telegram only if there's an issue
 */

const { createClient } = require('@supabase/supabase-js');
const OpenAI = require('openai');
const TelegramBot = require('node-telegram-bot-api');
const { format } = require('date-fns');

// Initialize clients
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const openaiKey = process.env.OPENAI_API_KEY;
const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
const telegramChatId = process.env.TELEGRAM_CHAT_ID;

/**
 * Test Supabase database connectivity
 */
async function testDatabase() {
    try {
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        // Simple query to test connectivity
        const { data, error } = await supabase
            .from('conversations')
            .select('id')
            .limit(1);
        
        if (error) throw error;
        
        return {
            status: 'healthy',
            service: 'Supabase Database',
            message: 'Database connection successful'
        };
    } catch (error) {
        return {
            status: 'unhealthy',
            service: 'Supabase Database',
            message: `Database error: ${error.message}`,
            error: error
        };
    }
}

/**
 * Test OpenAI API connectivity
 */
async function testOpenAI() {
    try {
        const openai = new OpenAI({ apiKey: openaiKey });
        
        // Simple API call to test connectivity
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: 'test' }],
            max_tokens: 5
        });
        
        if (!completion || !completion.choices || completion.choices.length === 0) {
            throw new Error('Invalid response from OpenAI');
        }
        
        return {
            status: 'healthy',
            service: 'OpenAI API',
            message: 'OpenAI API connection successful'
        };
    } catch (error) {
        return {
            status: 'unhealthy',
            service: 'OpenAI API',
            message: `OpenAI error: ${error.message}`,
            error: error
        };
    }
}

/**
 * Test Telegram Bot API connectivity
 */
async function testTelegram() {
    try {
        const bot = new TelegramBot(telegramToken, { polling: false });
        
        // Test bot connectivity
        const botInfo = await bot.getMe();
        
        if (!botInfo || !botInfo.username) {
            throw new Error('Invalid response from Telegram');
        }
        
        return {
            status: 'healthy',
            service: 'Telegram Bot',
            message: `Telegram bot @${botInfo.username} is operational`
        };
    } catch (error) {
        return {
            status: 'unhealthy',
            service: 'Telegram Bot',
            message: `Telegram error: ${error.message}`,
            error: error
        };
    }
}

/**
 * Send health status to Telegram (only if there's an issue)
 */
async function sendHealthNotification(results, isHealthy) {
    try {
        const bot = new TelegramBot(telegramToken, { polling: false });
        const today = format(new Date(), 'yyyy-MM-dd HH:mm');
        
        if (!isHealthy) {
            // Send detailed error notification
            let message = `⚠️ <b>SYSTEM HEALTH CHECK FAILED</b>\n`;
            message += `📅 ${today}\n\n`;
            
            results.forEach(result => {
                const emoji = result.status === 'healthy' ? '✅' : '❌';
                message += `${emoji} <b>${result.service}</b>: ${result.message}\n`;
            });
            
            message += `\n⚠️ Please investigate immediately!`;
            
            await bot.sendMessage(telegramChatId, message, { parse_mode: 'HTML' });
        } else {
            // Optional: Send a brief "all good" message once per week (Monday)
            const dayOfWeek = new Date().getDay();
            if (dayOfWeek === 1) { // Monday
                const message = `✅ <b>Weekly Health Check</b>\n📅 ${today}\n\nAll systems operational:\n✅ Database\n✅ OpenAI API\n✅ Telegram Bot`;
                await bot.sendMessage(telegramChatId, message, { parse_mode: 'HTML' });
            }
        }
    } catch (error) {
        console.error('❌ Failed to send health notification:', error);
        throw error;
    }
}

/**
 * Main handler
 */
exports.handler = async (event, context) => {
    try {
        console.log('🏥 Starting health check...');
        
        // Run all health checks in parallel
        const [dbResult, openaiResult, telegramResult] = await Promise.all([
            testDatabase(),
            testOpenAI(),
            testTelegram()
        ]);
        
        const results = [dbResult, openaiResult, telegramResult];
        
        // Check if all services are healthy
        const isHealthy = results.every(r => r.status === 'healthy');
        
        // Log results
        results.forEach(result => {
            const emoji = result.status === 'healthy' ? '✅' : '❌';
            console.log(`${emoji} ${result.service}: ${result.message}`);
        });
        
        // Send notification to Telegram only if there's an issue (or weekly on Monday)
        await sendHealthNotification(results, isHealthy);
        
        if (isHealthy) {
            console.log('✅ All systems healthy');
        } else {
            console.log('⚠️ Some systems unhealthy - notification sent');
        }
        
        // Return response
        return {
            statusCode: isHealthy ? 200 : 500,
            body: JSON.stringify({
                success: isHealthy,
                timestamp: new Date().toISOString(),
                results: results.map(r => ({
                    service: r.service,
                    status: r.status,
                    message: r.message
                }))
            })
        };
        
    } catch (error) {
        console.error('❌ Health check failed:', error);
        
        // Try to send error notification
        try {
            const bot = new TelegramBot(telegramToken, { polling: false });
            const today = format(new Date(), 'yyyy-MM-dd HH:mm');
            await bot.sendMessage(
                telegramChatId,
                `❌ <b>CRITICAL: Health check crashed</b>\n📅 ${today}\n\nError: ${error.message}`,
                { parse_mode: 'HTML' }
            );
        } catch (notifyError) {
            console.error('Failed to send crash notification:', notifyError);
        }
        
        return {
            statusCode: 500,
            body: JSON.stringify({
                success: false,
                error: 'Health check failed',
                message: error.message
            })
        };
    }
};

