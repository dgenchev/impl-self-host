/**
 * OpenAI Client
 * Handles AI chat interactions with context management and multilingual support
 */

const OpenAI = require('openai');

let openai = null;

/**
 * Get OpenAI client instance
 */
function getOpenAIClient() {
    if (!openai) {
        const apiKey = process.env.OPENAI_API_KEY;
        
        if (!apiKey) {
            throw new Error('OPENAI_API_KEY not configured');
        }
        
        openai = new OpenAI({ apiKey });
    }
    
    return openai;
}

/**
 * Get system prompt with language enforcement
 */
function getSystemPrompt(language = 'auto') {
    const languageInstruction = language !== 'auto'
        ? `CRITICAL: ALWAYS respond in ${language.toUpperCase()} language. NEVER switch languages.`
        : 'CRITICAL: Detect the patient\'s language and ALWAYS respond in that same language throughout the conversation.';

    return `You are Dr. Genchev's dental assistant, specialized in immediate loading dental implants and strategic dental implantology.

${languageInstruction}

**About Dr. Genchev and the Clinic:**
- 30+ years of experience in dental implantology
- Certified Clinical Master of the International Implant Foundation
- International Lecturer on Immediate Loading in Dental Implantology
- Specializes in Strategic Dental Implantology
- Located in Plovdiv, Bulgaria
- Treatment takes only **5 days** from start to finish
- **Fixed pricing**: €5000 per jaw for the entire treatment (no hidden costs)
- Contact: via the AI assistant or by email: genchevi@dr-genchevi.com

**Your Role:**
- Answer questions about dental implants, procedures, costs, and appointments
- Be professional, warm, empathetic, and concise (2-4 sentences typically)
- Show empathy for dental concerns
- For specific medical cases, recommend professional consultation
- Provide accurate information but defer complex medical advice to Dr. Genchev

**INTEREST DETECTION & QUESTIONNAIRE:**
If the patient shows booking interest (keywords: "appointment", "booking", "consultation", "visit", "schedule", "среща", "консултация", "запазване", "rendez-vous", "consultation", "прием"), start collecting information by asking:

1. **First name** and **last name**
2. **Phone number** (with country code if international)
3. **Email address** (required for appointment confirmation)
4. **Brief description** of their dental concerns
5. **Recent x-rays or tomographies** (if available)
6. **Preferred appointment times** (weekday mornings, afternoons, etc.)

Ask these questions **naturally in conversation**, one or two at a time. Don't overwhelm with all questions at once.

After collecting ALL required information (first name, last name, phone, and email), confirm the details with the patient and let them know Dr. Genchev's office will contact them soon.

**Important:**
- Never invent or assume patient information
- If patient mentions pain or emergency, show empathy and suggest contacting the clinic immediately
- Keep responses helpful but concise
- Maintain the detected language throughout the entire conversation`;
}

/**
 * Detect language from message
 */
async function detectLanguage(message) {
    const client = getOpenAIClient();
    
    const response = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
            {
                role: 'system',
                content: 'Detect the language of the following text. Respond with ONLY the two-letter language code (e.g., "en", "bg", "ru", "fr", "de", "es"). No explanation, just the code.'
            },
            {
                role: 'user',
                content: message
            }
        ],
        max_tokens: 10,
        temperature: 0
    });
    
    const detectedLang = response.choices[0].message.content.trim().toLowerCase();
    
    // Validate it's a reasonable language code
    if (detectedLang.length === 2) {
        return detectedLang;
    }
    
    // Default to English if detection fails
    return 'en';
}

/**
 * Process message with OpenAI
 */
async function processMessage(message, conversationHistory = [], language = 'auto') {
    const client = getOpenAIClient();
    
    // Build messages array with full context
    const messages = [
        {
            role: 'system',
            content: getSystemPrompt(language)
        },
        ...conversationHistory,
        {
            role: 'user',
            content: message
        }
    ];
    
    const response = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: messages,
        max_tokens: 400,
        temperature: 0.6,
        presence_penalty: 0.1,
        frequency_penalty: 0.1
    });
    
    return response.choices[0].message.content;
}

/**
 * Extract patient information from conversation
 */
async function extractPatientInfo(conversationHistory) {
    const client = getOpenAIClient();
    
    const conversationText = conversationHistory
        .map(msg => `${msg.role}: ${msg.content}`)
        .join('\n');
    
    const response = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
            {
                role: 'system',
                content: `Analyze this conversation and extract patient information. Return ONLY a valid JSON object with these fields (use null if not found):
{
  "firstName": "string or null",
  "lastName": "string or null", 
  "phone": "string or null",
  "email": "string or null",
  "dentalConcerns": "string or null",
  "preferredTimes": "string or null",
  "isComplete": boolean (true if first name, last name, phone, AND email are all provided)
}

Rules:
- Only extract explicitly stated information
- Phone must include country code if mentioned
- Email must be a valid email format if provided
- Set isComplete to true ONLY if firstName, lastName, phone, AND email are all present
- Return raw JSON only, no markdown, no explanation`
            },
            {
                role: 'user',
                content: conversationText
            }
        ],
        max_tokens: 200,
        temperature: 0
    });
    
    try {
        const extracted = JSON.parse(response.choices[0].message.content);
        return extracted;
    } catch (error) {
        console.error('Failed to parse patient info:', error);
        return {
            firstName: null,
            lastName: null,
            phone: null,
            email: null,
            dentalConcerns: null,
            preferredTimes: null,
            isComplete: false
        };
    }
}

/**
 * Generate Bulgarian summary of conversation
 */
async function generateBulgarianSummary(conversationHistory, patientInfo = null) {
    const client = getOpenAIClient();
    
    const conversationText = conversationHistory
        .filter(msg => msg.role !== 'system')
        .map(msg => {
            const role = msg.role === 'user' ? 'Пациент' : 'AI';
            return `${role}: ${msg.content}`;
        })
        .join('\n');
    
    const patientInfoText = patientInfo 
        ? `\n\nИнформация за пациента:\n- Име: ${patientInfo.firstName} ${patientInfo.lastName}\n- Телефон: ${patientInfo.phone}\n- Email: ${patientInfo.email || 'Не е предоставен'}`
        : '';
    
    const response = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
            {
                role: 'system',
                content: `Ти си асистент на доктор Генчев. Резюмирай следния разговор на български език за зъболекаря.

Включи:
- Основните въпроси и интереси на пациента
- Дентални проблеми или притеснения
- Ниво на интерес (висок/среден/нисък)
- Спешност (ако има)

Резюмето трябва да бъде кратко (3-5 изречения) и професионално.`
            },
            {
                role: 'user',
                content: conversationText + patientInfoText
            }
        ],
        max_tokens: 300,
        temperature: 0.5
    });
    
    return response.choices[0].message.content;
}

/**
 * Generate daily summary in Bulgarian
 */
async function generateDailySummary(conversations) {
    const client = getOpenAIClient();
    
    const conversationsText = conversations.map((conv, index) => {
        const messages = conv.messages || [];
        const patientInfo = conv.patient_info; // Already decrypted by getTodayConversations
        
        let text = `\n━━━ Разговор ${index + 1} ━━━\n`;
        
        // Patient info (if available)
        if (patientInfo && patientInfo.firstName) {
            text += `👤 Пациент: ${patientInfo.firstName} ${patientInfo.lastName}\n`;
            text += `📱 Телефон: ${patientInfo.phone}\n`;
            if (patientInfo.email) {
                text += `📧 Email: ${patientInfo.email}\n`;
            }
            if (patientInfo.dentalConcerns) {
                text += `🦷 Проблеми: ${patientInfo.dentalConcerns}\n`;
            }
        } else {
            text += `👤 Пациент: Анонимен (без контактни данни)\n`;
        }
        
        text += `🌍 Език: ${conv.language || 'неизвестен'}\n`;
        text += `💬 Съобщения: ${messages.length}\n`;
        text += `📅 Начало: ${new Date(conv.created_at).toLocaleTimeString('bg-BG', {hour: '2-digit', minute: '2-digit'})}\n`;
        
        // Add conversation content (first few messages)
        text += `\n📝 Съдържание:\n`;
        messages.slice(0, 5).forEach((msg, msgIndex) => {
            const role = msg.role === 'user' ? 'Пациент' : 'AI';
            const content = msg.content || '[няма съдържание]';
            // Truncate long messages
            const truncated = content.length > 100 ? content.substring(0, 100) + '...' : content;
            text += `  ${role}: ${truncated}\n`;
        });
        
        if (messages.length > 5) {
            text += `  ... (+${messages.length - 5} още съобщения)\n`;
        }
        
        return text;
    }).join('\n');
    
    const response = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
            {
                role: 'system',
                content: `Ти си асистент на доктор Генчев. Създай дневно резюме на български език.

СТРУКТУРА НА РЕЗЮМЕТО:

1. **Високоприоритетни Пациенти** (с пълна информация):
   - Име и телефон
   - Основни проблеми
   - Препоръчано действие

2. **Други Запитвания** (без пълна информация):
   - Брой разговори
   - Основни теми
   - Ниво на интерес

3. **Статистика**:
   - Общ брой разговори
   - Разпределение по езици
   - Изпратени файлове (ако има)

4. **Препоръки за Действие**:
   - С кого да се свържете първи
   - Спешни случаи
   - Последващи стъпки

Резюмето трябва да бъде информативно (8-12 изречения), структурирано и фокусирано върху действията.`
            },
            {
                role: 'user',
                content: `Днешни разговори:\n${conversationsText}`
            }
        ],
        max_tokens: 600,
        temperature: 0.6
    });
    
    return response.choices[0].message.content;
}

/**
 * Check if conversation shows interest in booking
 */
async function detectBookingInterest(conversationHistory) {
    const client = getOpenAIClient();
    
    const conversationText = conversationHistory
        .filter(msg => msg.role === 'user')
        .map(msg => msg.content)
        .join('\n');
    
    const response = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
            {
                role: 'system',
                content: `Analyze if the patient is showing interest in booking an appointment or consultation. 
                
Return ONLY a JSON object:
{
  "interested": boolean,
  "confidence": "high" | "medium" | "low",
  "reason": "brief explanation"
}

Indicators of interest:
- Asking about booking, appointments, consultation
- Requesting availability, scheduling
- Asking "when can I come", "how do I book"
- Expressing urgency or readiness to proceed

Return raw JSON only, no markdown.`
            },
            {
                role: 'user',
                content: conversationText
            }
        ],
        max_tokens: 100,
        temperature: 0
    });
    
    try {
        return JSON.parse(response.choices[0].message.content);
    } catch (error) {
        console.error('Failed to parse booking interest:', error);
        return { interested: false, confidence: 'low', reason: 'parse error' };
    }
}

module.exports = {
    getOpenAIClient,
    getSystemPrompt,
    detectLanguage,
    processMessage,
    extractPatientInfo,
    generateBulgarianSummary,
    generateDailySummary,
    detectBookingInterest
};

