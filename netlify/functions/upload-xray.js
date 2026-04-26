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
const ALLOWED_TYPES = new Set([
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf'
]);

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Detect actual MIME type from file magic bytes
function detectMimeType(buffer) {
    if (buffer.length < 12) return null;
    // JPEG: FF D8 FF
    if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) return 'image/jpeg';
    // PNG: 89 50 4E 47
    if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) return 'image/png';
    // GIF: GIF8
    if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x38) return 'image/gif';
    // WebP: RIFF????WEBP
    if (buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 &&
        buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50) return 'image/webp';
    // PDF: %PDF-
    if (buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46) return 'application/pdf';
    return null;
}

// Normalize jpeg aliases to a canonical type for comparison
function normalizeType(type) {
    return type === 'image/jpg' ? 'image/jpeg' : type;
}

const ALLOWED_ORIGINS = new Set([
    'https://dentalimplantsgenchev.com',
    'https://www.dentalimplantsgenchev.com',
    'https://dr-genchevi.com',
    'https://www.dr-genchevi.com'
]);

exports.handler = async (event, context) => {
    const origin = event.headers.origin || '';
    const corsOrigin = ALLOWED_ORIGINS.has(origin)
        ? origin
        : (process.env.NODE_ENV !== 'production' ? '*' : 'https://dentalimplantsgenchev.com');

    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': corsOrigin,
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

        // Validate UUID format before hitting the database
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(conversationId)) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Invalid conversationId format' })
            };
        }

        if (!file || !filename) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'file and filename are required' })
            };
        }

        // Validate declared MIME type
        if (!ALLOWED_TYPES.has(fileType)) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'File type not allowed' })
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

        // Verify the conversation exists before doing any further work
        let conversation;
        try {
            conversation = await getConversation(conversationId);
        } catch (err) {
            if (err.code === 'PGRST116') {
                return {
                    statusCode: 404,
                    headers,
                    body: JSON.stringify({ error: 'Conversation not found' })
                };
            }
            throw err;
        }

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

        // Verify actual file content matches the declared type (prevents renamed executables)
        const detectedType = detectMimeType(fileBuffer);
        if (!detectedType) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Could not verify file type from content' })
            };
        }
        if (normalizeType(detectedType) !== normalizeType(fileType)) {
            console.warn(`Magic byte mismatch: declared=${fileType}, detected=${detectedType}`);
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'File content does not match declared type' })
            };
        }

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



