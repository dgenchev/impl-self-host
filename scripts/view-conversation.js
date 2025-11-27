#!/usr/bin/env node

/**
 * View Full Conversation Script
 * Fetches and displays a complete conversation from the database
 * 
 * Usage: node scripts/view-conversation.js <conversation-id>
 * Example: node scripts/view-conversation.js 075125ae-dfd5-409f-a689-265db15f4677
 */

require('dotenv').config();
const {
    getConversation,
    getConversationMessages,
    getPatientInfo
} = require('../lib/supabase-client');

// Get conversation ID from command line
const conversationId = process.argv[2];

if (!conversationId) {
    console.error('❌ Error: Conversation ID is required');
    console.log('\nUsage: node scripts/view-conversation.js <conversation-id>');
    console.log('Example: node scripts/view-conversation.js 075125ae-dfd5-409f-a689-265db15f4677\n');
    process.exit(1);
}

// Validate UUID format
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
if (!uuidRegex.test(conversationId)) {
    console.error('❌ Error: Invalid conversation ID format');
    console.log('Expected UUID format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx\n');
    process.exit(1);
}

async function viewConversation() {
    try {
        console.log('🔍 Fetching conversation...\n');
        console.log('='.repeat(80));
        
        // Fetch conversation metadata
        const conversation = await getConversation(conversationId);
        
        console.log('\n📋 CONVERSATION METADATA');
        console.log('='.repeat(80));
        console.log(`🆔 ID: ${conversation.id}`);
        console.log(`📅 Created: ${new Date(conversation.created_at).toLocaleString()}`);
        console.log(`🔄 Updated: ${new Date(conversation.updated_at).toLocaleString()}`);
        console.log(`🌐 Language: ${conversation.language || 'N/A'}`);
        console.log(`📊 Status: ${conversation.status}`);
        console.log(`⏰ Expires: ${new Date(conversation.expires_at).toLocaleString()}`);
        if (conversation.ip_address) {
            console.log(`🌍 IP Address: ${conversation.ip_address}`);
        }
        
        // Fetch patient info
        console.log('\n' + '='.repeat(80));
        console.log('👤 PATIENT INFORMATION');
        console.log('='.repeat(80));
        
        const patientInfo = await getPatientInfo(conversationId);
        
        if (patientInfo) {
            if (patientInfo.firstName || patientInfo.lastName) {
                const fullName = [patientInfo.firstName, patientInfo.lastName]
                    .filter(Boolean)
                    .join(' ');
                console.log(`👤 Name: ${fullName || 'N/A'}`);
            }
            if (patientInfo.phone) {
                console.log(`📱 Phone: ${patientInfo.phone}`);
            }
            if (patientInfo.email) {
                console.log(`📧 Email: ${patientInfo.email}`);
            }
            if (patientInfo.dentalConcerns) {
                console.log(`🦷 Dental Concerns: ${patientInfo.dentalConcerns}`);
            }
            if (patientInfo.preferredTimes) {
                console.log(`⏰ Preferred Times: ${patientInfo.preferredTimes}`);
            }
            console.log(`✅ Consent Given: ${new Date(patientInfo.consentGivenAt).toLocaleString()}`);
            console.log(`📬 Notified Dentist: ${patientInfo.notifiedDentist ? 'Yes' : 'No'}`);
            if (patientInfo.notifiedAt) {
                console.log(`📬 Notified At: ${new Date(patientInfo.notifiedAt).toLocaleString()}`);
            }
        } else {
            console.log('No patient information available yet.');
        }
        
        // Fetch all messages (use high limit to get all)
        console.log('\n' + '='.repeat(80));
        console.log('💬 CONVERSATION MESSAGES');
        console.log('='.repeat(80));
        
        const messages = await getConversationMessages(conversationId, 1000);
        
        if (messages.length === 0) {
            console.log('\nNo messages found in this conversation.');
        } else {
            console.log(`\nTotal messages: ${messages.length}\n`);
            
            messages.forEach((msg, index) => {
                const timestamp = new Date(msg.timestamp).toLocaleString();
                const role = msg.role === 'user' ? '👤 USER' : '🤖 ASSISTANT';
                const separator = '-'.repeat(80);
                
                console.log(separator);
                console.log(`[${index + 1}] ${role} - ${timestamp}`);
                console.log(separator);
                console.log(msg.content);
                console.log('');
            });
        }
        
        console.log('='.repeat(80));
        console.log('✅ Conversation loaded successfully!\n');
        
    } catch (error) {
        console.error('\n❌ Error fetching conversation:');
        console.error(error.message);
        
        if (error.message.includes('PGRST116')) {
            console.error('\n💡 The conversation ID was not found in the database.');
            console.error('   Make sure the ID is correct and the conversation exists.');
        } else if (error.message.includes('ENCRYPTION_KEY')) {
            console.error('\n💡 Encryption key is missing or invalid.');
            console.error('   Make sure ENCRYPTION_KEY is set in your .env file.');
        } else if (error.message.includes('Supabase')) {
            console.error('\n💡 Supabase connection error.');
            console.error('   Check your SUPABASE_URL and SUPABASE_ANON_KEY in .env file.');
        }
        
        console.log('');
        process.exit(1);
    }
}

// Run the script
viewConversation();


