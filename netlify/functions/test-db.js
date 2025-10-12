/**
 * Database Connection Test Function
 * Tests Supabase connection and basic operations
 */

const { createConversation, getConversation } = require('../../lib/supabase-client');

exports.handler = async (event, context) => {
    // Set CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    try {
        console.log('Testing Supabase connection...');

        // Test 1: Create a test conversation
        const conversation = await createConversation('en', {
            ip: event.headers['x-forwarded-for'] || 'test',
            userAgent: event.headers['user-agent'] || 'test'
        });

        console.log('✅ Created conversation:', conversation.id);

        // Test 2: Retrieve the conversation
        const retrieved = await getConversation(conversation.id);

        console.log('✅ Retrieved conversation:', retrieved.id);

        // Success response
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Database connection test successful!',
                tests: {
                    create: {
                        passed: true,
                        conversationId: conversation.id
                    },
                    retrieve: {
                        passed: true,
                        conversationId: retrieved.id,
                        language: retrieved.language,
                        status: retrieved.status
                    }
                },
                timestamp: new Date().toISOString()
            })
        };

    } catch (error) {
        console.error('❌ Database test failed:', error);

        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                error: error.message,
                details: {
                    name: error.name,
                    message: error.message,
                    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
                }
            })
        };
    }
};

