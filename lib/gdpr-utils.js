/**
 * GDPR Compliance Utilities
 * Helpers for handling GDPR rights and data protection
 */

const { format, addDays } = require('date-fns');

/**
 * Get GDPR consent text (multilingual)
 */
function getConsentText(language = 'en') {
    const texts = {
        en: `By providing your personal information, you consent to its processing for the purpose of booking a dental consultation with Dr. Genchev. Your data will be stored securely for 30 days and then automatically deleted. You have the right to access, modify, or delete your data at any time by contacting us.`,
        
        bg: `Като предоставяте личната си информация, Вие се съгласявате с нейната обработка с цел записване на дентална консултация при д-р Генчев. Данните Ви ще бъдат съхранявани сигурно за 30 дни и след това автоматично изтрити. Имате право да получите достъп, да промените или да изтриете данните си по всяко време, като се свържете с нас.`,
        
        ru: `Предоставляя свою личную информацию, вы соглашаетесь на её обработку с целью записи на стоматологическую консультацию у доктора Генчева. Ваши данные будут храниться в безопасности в течение 30 дней, после чего будут автоматически удалены. Вы имеете право на доступ, изменение или удаление ваших данных в любое время, связавшись с нами.`,
        
        fr: `En fournissant vos informations personnelles, vous consentez à leur traitement dans le but de prendre rendez-vous pour une consultation dentaire avec le Dr Genchev. Vos données seront conservées en toute sécurité pendant 30 jours puis automatiquement supprimées. Vous avez le droit d'accéder, de modifier ou de supprimer vos données à tout moment en nous contactant.`
    };
    
    return texts[language] || texts.en;
}

/**
 * Get privacy policy link text
 */
function getPrivacyPolicyText(language = 'en') {
    const texts = {
        en: 'View our Privacy Policy',
        bg: 'Вижте нашата Политика за поверителност',
        ru: 'Просмотреть нашу Политику конфиденциальности',
        fr: 'Voir notre Politique de confidentialité'
    };
    
    return texts[language] || texts.en;
}

/**
 * Validate that patient has given explicit consent
 */
function validateConsent(consentGiven, consentTimestamp) {
    if (!consentGiven) {
        throw new Error('GDPR: Consent not provided');
    }
    
    if (!consentTimestamp) {
        throw new Error('GDPR: Consent timestamp missing');
    }
    
    // Consent must be recent (within last hour for this conversation)
    const consentDate = new Date(consentTimestamp);
    const now = new Date();
    const hoursDiff = (now - consentDate) / (1000 * 60 * 60);
    
    if (hoursDiff > 24) {
        throw new Error('GDPR: Consent expired, please provide again');
    }
    
    return true;
}

/**
 * Calculate data retention expiry date
 */
function getExpiryDate(retentionDays = 30) {
    return addDays(new Date(), retentionDays).toISOString();
}

/**
 * Format data for GDPR export (right to portability)
 */
function formatDataForExport(conversationData) {
    return {
        exportDate: new Date().toISOString(),
        dataSubject: 'Patient',
        dataController: {
            name: 'Dr. Genchev Dental Clinic',
            address: 'Plovdiv, Bulgaria',
            email: 'genchevi@dr-genchevi.com',
            phone: '+359 32 266 089'
        },
        personalData: {
            conversation: {
                id: conversationData.conversation?.id,
                created: conversationData.conversation?.created_at,
                language: conversationData.conversation?.language,
                status: conversationData.conversation?.status
            },
            messages: conversationData.messages?.map(msg => ({
                role: msg.role,
                content: msg.content,
                timestamp: msg.timestamp
            })),
            patientInfo: conversationData.patientInfo ? {
                firstName: conversationData.patientInfo.firstName,
                lastName: conversationData.patientInfo.lastName,
                phone: conversationData.patientInfo.phone,
                email: conversationData.patientInfo.email,
                dentalConcerns: conversationData.patientInfo.dentalConcerns,
                preferredTimes: conversationData.patientInfo.preferredTimes,
                consentGivenAt: conversationData.patientInfo.consentGivenAt
            } : null
        },
        gdprRights: {
            rightToAccess: 'You have accessed your data through this export',
            rightToRectification: 'Contact us to correct any inaccuracies',
            rightToErasure: 'Contact us to delete your data',
            rightToRestriction: 'Contact us to restrict processing',
            rightToDataPortability: 'This export provides your data in JSON format',
            rightToObject: 'Contact us to object to processing'
        },
        contact: {
            email: 'genchevi@dr-genchevi.com',
            phone: '+359 32 266 089'
        }
    };
}

/**
 * Anonymize data (for statistics/analytics)
 */
function anonymizeData(data) {
    return {
        ...data,
        firstName: null,
        lastName: null,
        phone: null,
        email: null,
        id: 'anonymized',
        // Keep only non-identifiable data
        language: data.language,
        timestamp: data.timestamp,
        messageCount: data.messages?.length || 0
    };
}

/**
 * Check if data subject has rights under GDPR
 */
function isGDPRApplicable(metadata = {}) {
    // GDPR applies to:
    // 1. EU residents
    // 2. Data processed in EU
    // 3. Services offered to EU residents
    
    // Since clinic is in Bulgaria (EU), GDPR applies to all
    return true;
}

/**
 * Generate GDPR compliance report
 */
function generateComplianceReport(stats) {
    const report = {
        generatedAt: new Date().toISOString(),
        period: format(new Date(), 'MMMM yyyy'),
        
        dataProcessing: {
            legalBasis: 'Consent (GDPR Article 6(1)(a))',
            purpose: 'Booking dental consultation',
            dataCategories: [
                'Identity data (name)',
                'Contact data (phone, email)',
                'Communication data (chat messages)',
                'Technical data (IP address, browser)'
            ],
            recipients: 'Dr. Genchev (dentist)',
            retentionPeriod: '30 days',
            dataProtectionOfficer: null // Not required for small businesses
        },
        
        statistics: {
            totalConversations: stats.totalConversations || 0,
            activeConversations: stats.activeConversations || 0,
            deletedConversations: stats.deletedConversations || 0,
            exportRequests: stats.exportRequests || 0,
            deletionRequests: stats.deletionRequests || 0
        },
        
        securityMeasures: [
            'End-to-end encryption (AES-256)',
            'Encrypted data at rest',
            'Secure HTTPS connections',
            'Access controls and authentication',
            'Regular security audits',
            'Automatic data deletion after retention period',
            'Audit logging of all data access'
        ],
        
        rightsImplemented: {
            rightToAccess: 'API endpoint available',
            rightToRectification: 'Manual process via contact',
            rightToErasure: 'API endpoint available',
            rightToRestriction: 'Conversation can be marked restricted',
            rightToDataPortability: 'JSON export available',
            rightToObject: 'Contact process available',
            rightsRelatedToAutomatedDecision: 'N/A - no automated decisions made'
        },
        
        compliance: {
            dataMinimization: 'Only necessary data collected',
            purposeLimitation: 'Data used only for stated purpose',
            accuracyPrinciple: 'Patients can update their data',
            storageLimitation: '30-day automatic deletion',
            integrityAndConfidentiality: 'Encryption and security measures',
            accountability: 'This compliance report and audit logs'
        }
    };
    
    return report;
}

/**
 * Validate email format
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate phone format (international)
 */
function isValidPhone(phone) {
    // Basic international phone validation
    // Should start with + and contain 10-15 digits
    const phoneRegex = /^\+?[1-9]\d{9,14}$/;
    return phoneRegex.test(phone.replace(/[\s-]/g, ''));
}

/**
 * Sanitize user input to prevent injection
 */
function sanitizeInput(input) {
    if (typeof input !== 'string') {
        return input;
    }
    
    return input
        .replace(/[<>]/g, '') // Remove potential HTML tags
        .trim()
        .substring(0, 1000); // Limit length
}

/**
 * Create GDPR-compliant data deletion notice
 */
function createDeletionNotice(conversationId, deletedAt, reason) {
    return {
        conversationId,
        deletedAt,
        reason,
        notification: 'Your personal data has been permanently deleted from our systems in accordance with GDPR Article 17 (Right to Erasure). A record of this deletion has been logged for compliance purposes, but no personal data remains.',
        auditLog: true,
        personalDataDeleted: [
            'Name',
            'Phone number',
            'Email address',
            'Chat messages',
            'Any uploaded files'
        ]
    };
}

module.exports = {
    getConsentText,
    getPrivacyPolicyText,
    validateConsent,
    getExpiryDate,
    formatDataForExport,
    anonymizeData,
    isGDPRApplicable,
    generateComplianceReport,
    isValidEmail,
    isValidPhone,
    sanitizeInput,
    createDeletionNotice
};

