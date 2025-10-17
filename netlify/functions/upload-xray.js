/**
 * X-Ray/File Upload Function
 * Handles file uploads from patients and forwards to dentist's Telegram
 */

const {
    sendXRay,
    sendDocument
} = require('../../lib/telegram-client');
const {
    getConversation,
    getPatientInfo,
    logFileUpload
} = require('../../lib/supabase-client');

// Allowed file types
const ALLOWED_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf'
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

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
        // Parse multipart form data
        const body = JSON.parse(event.body);
        
        const {
            conversationId,
            file,
            filename,
            fileType,
            fileSize
        } = body;

        // Validation
        if (!conversationId) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'conversationId is required' })
            };
        }

        if (!file || !filename) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'file and filename are required' })
            };
        }

        // Validate file type
        if (!ALLOWED_TYPES.includes(fileType)) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    error: 'File type not allowed',
                    allowedTypes: ALLOWED_TYPES
                })
            };
        }

        // Validate file size
        if (fileSize > MAX_FILE_SIZE) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    error: 'File too large',
                    maxSize: '10MB',
                    yourSize: `${(fileSize / 1024 / 1024).toFixed(2)}MB`
                })
            };
        }

        console.log('📤 Processing file upload:', filename, fileType, `${(fileSize / 1024).toFixed(2)}KB`);

        // Get conversation and patient info
        const conversation = await getConversation(conversationId);
        let patientInfo = await getPatientInfo(conversationId);

        // If no patient info yet, use generic info
        if (!patientInfo) {
            patientInfo = {
                firstName: 'Anonymous',
                lastName: 'Patient',
                phone: 'Not provided',
                email: null
            };
        }

        // Convert base64 to buffer
        const fileBuffer = Buffer.from(file, 'base64');

        // Send to Telegram
        let telegramResult;
        const isImage = fileType.startsWith('image/');

        if (isImage) {
            console.log('📷 Sending as photo to Telegram...');
            telegramResult = await sendXRay(fileBuffer, patientInfo, conversationId);
        } else {
            console.log('📄 Sending as document to Telegram...');
            telegramResult = await sendDocument(fileBuffer, filename, patientInfo, conversationId);
        }

        // Log upload in database
        await logFileUpload(conversationId, {
            filename: filename,
            size: fileSize,
            type: fileType,
            telegramFileId: telegramResult.fileId,
            forwarded: true
        });

        console.log('✅ File uploaded and forwarded to Telegram');

        // Success response
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'File uploaded and sent to dentist',
                filename: filename,
                size: fileSize,
                type: fileType,
                telegramMessageId: telegramResult.messageId,
                uploadedAt: new Date().toISOString()
            })
        };

    } catch (error) {
        console.error('❌ Error uploading file:', error.message);

        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                error: 'Failed to upload file',
                message: error.message
            })
        };
    }
};



