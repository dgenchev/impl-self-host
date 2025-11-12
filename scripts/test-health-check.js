#!/usr/bin/env node

/**
 * Local Health Check Test Script
 * Run this to test the health check function locally
 * 
 * Usage: node test-health-check.js
 */

require('dotenv').config();
const { handler } = require('./netlify/functions/health-check');

console.log('🧪 Testing Health Check Function Locally...\n');
console.log('Environment:');
console.log('- Supabase URL:', process.env.SUPABASE_URL ? '✓ Set' : '✗ Missing');
console.log('- Supabase Key:', process.env.SUPABASE_SERVICE_KEY ? '✓ Set' : '✗ Missing');
console.log('- OpenAI Key:', process.env.OPENAI_API_KEY ? '✓ Set' : '✗ Missing');
console.log('- Telegram Token:', process.env.TELEGRAM_BOT_TOKEN ? '✓ Set' : '✗ Missing');
console.log('- Telegram Chat ID:', process.env.TELEGRAM_CHAT_ID ? '✓ Set' : '✗ Missing');
console.log('\n' + '='.repeat(60) + '\n');

// Mock event and context
const mockEvent = {
    httpMethod: 'POST',
    headers: {},
    body: '{}'
};

const mockContext = {};

// Run the health check
handler(mockEvent, mockContext)
    .then(result => {
        console.log('\n' + '='.repeat(60));
        console.log('📊 Health Check Result:\n');
        console.log('Status Code:', result.statusCode);
        
        const body = JSON.parse(result.body);
        console.log('Success:', body.success);
        console.log('Timestamp:', body.timestamp);
        
        if (body.results) {
            console.log('\nService Results:');
            body.results.forEach(r => {
                const emoji = r.status === 'healthy' ? '✅' : '❌';
                console.log(`  ${emoji} ${r.service}: ${r.message}`);
            });
        }
        
        if (body.error) {
            console.log('\n❌ Error:', body.error);
            console.log('Message:', body.message);
        }
        
        console.log('\n' + '='.repeat(60));
        console.log(body.success ? '✅ All tests passed!' : '❌ Some tests failed!');
        process.exit(body.success ? 0 : 1);
    })
    .catch(error => {
        console.error('\n❌ Test failed with error:');
        console.error(error);
        process.exit(1);
    });










