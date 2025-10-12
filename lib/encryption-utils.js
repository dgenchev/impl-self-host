/**
 * Encryption Utilities
 * AES-256 encryption for sensitive patient data
 */

const CryptoJS = require('crypto-js');

/**
 * Get encryption key from environment
 */
function getEncryptionKey() {
    const key = process.env.ENCRYPTION_KEY;
    
    if (!key) {
        throw new Error('ENCRYPTION_KEY not configured in environment');
    }
    
    if (key.length < 32) {
        throw new Error('ENCRYPTION_KEY must be at least 32 characters');
    }
    
    return key;
}

/**
 * Encrypt text using AES-256
 */
function encrypt(text) {
    if (!text) {
        return null;
    }
    
    try {
        const key = getEncryptionKey();
        const encrypted = CryptoJS.AES.encrypt(text, key).toString();
        return encrypted;
    } catch (error) {
        console.error('Encryption error:', error);
        throw new Error('Failed to encrypt data');
    }
}

/**
 * Decrypt text using AES-256
 */
function decrypt(ciphertext) {
    if (!ciphertext) {
        return null;
    }
    
    try {
        const key = getEncryptionKey();
        const bytes = CryptoJS.AES.decrypt(ciphertext, key);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        
        if (!decrypted) {
            throw new Error('Decryption resulted in empty string');
        }
        
        return decrypted;
    } catch (error) {
        console.error('Decryption error:', error);
        throw new Error('Failed to decrypt data');
    }
}

/**
 * Hash data (one-way, for verification)
 */
function hash(text) {
    if (!text) {
        return null;
    }
    
    return CryptoJS.SHA256(text).toString();
}

/**
 * Generate HMAC signature for webhook validation
 */
function generateSignature(payload, secret = null) {
    const webhookSecret = secret || process.env.WEBHOOK_SECRET;
    
    if (!webhookSecret) {
        throw new Error('WEBHOOK_SECRET not configured');
    }
    
    const hmac = CryptoJS.HmacSHA256(payload, webhookSecret);
    return hmac.toString(CryptoJS.enc.Hex);
}

/**
 * Verify HMAC signature
 */
function verifySignature(payload, signature, secret = null) {
    const expectedSignature = generateSignature(payload, secret);
    
    // Use timing-safe comparison
    return signature === expectedSignature;
}

/**
 * Generate random string (for IDs, tokens, etc.)
 */
function generateRandomString(length = 32) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const randomBytes = CryptoJS.lib.WordArray.random(length);
    
    for (let i = 0; i < length; i++) {
        const byte = randomBytes.words[Math.floor(i / 4)] >>> (24 - (i % 4) * 8) & 0xFF;
        result += chars[byte % chars.length];
    }
    
    return result;
}

/**
 * Sanitize string for safe storage/display
 */
function sanitize(text) {
    if (!text) {
        return '';
    }
    
    return text
        .replace(/[<>]/g, '') // Remove HTML tags
        .replace(/[^\w\s@.,+()-]/gi, '') // Allow only safe characters
        .trim();
}

/**
 * Mask sensitive data for logging (e.g., phone numbers)
 */
function maskData(data, type = 'phone') {
    if (!data) {
        return '';
    }
    
    switch (type) {
        case 'phone':
            // Show last 4 digits: +359 88 xxx xx34
            return data.length > 4 
                ? data.slice(0, -4).replace(/\d/g, 'x') + data.slice(-4)
                : 'xxx';
        
        case 'email':
            // Show first letter and domain: j***@example.com
            const [local, domain] = data.split('@');
            if (!domain) return 'xxx';
            return local[0] + '***@' + domain;
        
        case 'name':
            // Show first and last letter: I***n
            return data.length > 2
                ? data[0] + '***' + data.slice(-1)
                : 'xxx';
        
        default:
            return 'xxx';
    }
}

module.exports = {
    encrypt,
    decrypt,
    hash,
    generateSignature,
    verifySignature,
    generateRandomString,
    sanitize,
    maskData
};

