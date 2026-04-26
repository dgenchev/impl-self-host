const axios = require('axios');
const { z } = require('zod');
const { sanitizeInput } = require('../../lib/gdpr-utils');

const RequestSchema = z.object({
    message: z.string().min(1).max(2000)
});

exports.handler = async function(event, context) {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        // Parse and validate request body
        let parsed;
        try {
            parsed = RequestSchema.parse(JSON.parse(event.body));
        } catch (err) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Invalid request: message must be 1–2000 characters' })
            };
        }

        const message = sanitizeInput(parsed.message);

        // Get OpenAI API key from environment variables
        const openaiApiKey = process.env.OPENAI_API_KEY;
        
        if (!openaiApiKey) {
            console.error('OpenAI API key not found in environment variables');
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'AI service not configured' })
            };
        }

        // Create the system prompt for Dr. Genchev's AI assistant
        const systemPrompt = `You are Dr. Genchev's AI dental assistant, specialized in dental implants and immediate loading procedures. You work at a dental clinic in Plovdiv, Bulgaria.

Key information about Dr. Genchev and the clinic:
- Dr. Genchev has over 30 years of experience in dental implantology
- Certified Clinical Master of the International Implant Foundation
- Specializes in Strategic Dental Implantology and immediate loading implants
- Treatment takes only 5 days from start to finish
- Fixed pricing with no hidden costs (€800-1500 per implant)
- Located in Plovdiv, Bulgaria
- Phone: +359 32 266 089
- Email: genchevi@dr-genchevi.com

Your role:
- Answer questions about dental implants, procedures, costs, and appointments
- Be professional, friendly, and informative
- Always encourage consultation for specific cases
- Provide accurate medical information but recommend professional consultation
- Keep responses concise but helpful
- If asked about specific medical advice, recommend consultation with Dr. Genchev

Important: Always mention that for specific cases, patients should schedule a consultation with Dr. Genchev.`;

        // Call OpenAI API
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: message }
            ],
            max_tokens: 300,
            temperature: 0.7
        }, {
            headers: {
                'Authorization': `Bearer ${openaiApiKey}`,
                'Content-Type': 'application/json'
            }
        });

        const aiResponse = response.data.choices[0].message.content;

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify({
                response: aiResponse
            })
        };

    } catch (error) {
        console.error('Error calling OpenAI API:', error.message);
        
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify({
                error: 'Failed to get AI response. Please try again or contact us directly.'
            })
        };
    }
}; 