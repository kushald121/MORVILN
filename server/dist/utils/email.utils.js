"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePreviewText = exports.calculateSendingDelay = exports.validateBulkRecipients = exports.createUnsubscribeLink = exports.generateTrackingPixel = exports.isDisposableEmail = exports.extractDomain = exports.createPasswordResetLink = exports.createVerificationLink = exports.generateOrderId = exports.formatDate = exports.formatCurrency = exports.sanitizeEmailContent = exports.isValidEmail = exports.generatePasswordResetToken = exports.generateVerificationToken = void 0;
const crypto_1 = __importDefault(require("crypto"));
/**
 * Generate a secure verification token
 */
const generateVerificationToken = () => {
    return crypto_1.default.randomBytes(32).toString('hex');
};
exports.generateVerificationToken = generateVerificationToken;
/**
 * Generate a password reset token with expiry
 */
const generatePasswordResetToken = () => {
    const token = crypto_1.default.randomBytes(32).toString('hex');
    const expires = new Date();
    expires.setHours(expires.getHours() + 1); // Token expires in 1 hour
    return { token, expires };
};
exports.generatePasswordResetToken = generatePasswordResetToken;
/**
 * Validate email format
 */
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
exports.isValidEmail = isValidEmail;
/**
 * Sanitize email content to prevent XSS
 */
const sanitizeEmailContent = (content) => {
    return content
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
};
exports.sanitizeEmailContent = sanitizeEmailContent;
/**
 * Format currency for email display
 */
const formatCurrency = (amount, currency = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: currency,
    }).format(amount);
};
exports.formatCurrency = formatCurrency;
/**
 * Format date for email display
 */
const formatDate = (date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};
exports.formatDate = formatDate;
/**
 * Generate order ID
 */
const generateOrderId = () => {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `ORD-${timestamp.slice(-6)}${random}`;
};
exports.generateOrderId = generateOrderId;
/**
 * Create verification link
 */
const createVerificationLink = (baseUrl, token) => {
    return `${baseUrl}/verify-email?token=${token}`;
};
exports.createVerificationLink = createVerificationLink;
/**
 * Create password reset link
 */
const createPasswordResetLink = (baseUrl, token) => {
    return `${baseUrl}/reset-password?token=${token}`;
};
exports.createPasswordResetLink = createPasswordResetLink;
/**
 * Extract domain from email
 */
const extractDomain = (email) => {
    return email.split('@')[1] || '';
};
exports.extractDomain = extractDomain;
/**
 * Check if email is from a disposable email provider
 */
const isDisposableEmail = (email) => {
    const disposableDomains = [
        '10minutemail.com',
        'tempmail.org',
        'guerrillamail.com',
        'mailinator.com',
        'yopmail.com',
        // Add more disposable email domains as needed
    ];
    const domain = (0, exports.extractDomain)(email).toLowerCase();
    return disposableDomains.includes(domain);
};
exports.isDisposableEmail = isDisposableEmail;
/**
 * Generate email tracking pixel (for email open tracking)
 */
const generateTrackingPixel = (emailId, baseUrl) => {
    return `<img src="${baseUrl}/api/email/track/${emailId}" width="1" height="1" style="display:none;" alt="" />`;
};
exports.generateTrackingPixel = generateTrackingPixel;
/**
 * Create unsubscribe link
 */
const createUnsubscribeLink = (baseUrl, email, token) => {
    return `${baseUrl}/unsubscribe?email=${encodeURIComponent(email)}&token=${token}`;
};
exports.createUnsubscribeLink = createUnsubscribeLink;
/**
 * Validate bulk email recipients
 */
const validateBulkRecipients = (recipients) => {
    const valid = [];
    const invalid = [];
    recipients.forEach(email => {
        if ((0, exports.isValidEmail)(email) && !(0, exports.isDisposableEmail)(email)) {
            valid.push(email);
        }
        else {
            invalid.push(email);
        }
    });
    return { valid, invalid };
};
exports.validateBulkRecipients = validateBulkRecipients;
/**
 * Calculate email sending rate limit
 */
const calculateSendingDelay = (totalEmails, maxPerHour = 100) => {
    if (totalEmails <= maxPerHour)
        return 0;
    return Math.ceil((60 * 60 * 1000) / maxPerHour); // Delay in milliseconds
};
exports.calculateSendingDelay = calculateSendingDelay;
/**
 * Generate email preview text
 */
const generatePreviewText = (content, maxLength = 150) => {
    // Remove HTML tags and get plain text
    const plainText = content.replace(/<[^>]*>/g, '').trim();
    if (plainText.length <= maxLength) {
        return plainText;
    }
    return plainText.substring(0, maxLength).trim() + '...';
};
exports.generatePreviewText = generatePreviewText;
