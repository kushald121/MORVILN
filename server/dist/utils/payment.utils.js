"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePaymentMetadata = exports.extractRazorpayError = exports.validateWebhookTimestamp = exports.generatePaymentDescription = exports.formatAmount = exports.validateCurrency = exports.calculateRefundAmount = exports.formatPaymentStatus = exports.generateWebhookSignature = exports.validateSignature = exports.generateReceiptId = exports.convertToRupees = exports.convertToPaise = void 0;
const crypto_1 = __importDefault(require("crypto"));
/**
 * Convert amount from rupees to paise
 */
const convertToPaise = (amount) => {
    return Math.round(amount * 100);
};
exports.convertToPaise = convertToPaise;
/**
 * Convert amount from paise to rupees
 */
const convertToRupees = (amount) => {
    return amount / 100;
};
exports.convertToRupees = convertToRupees;
/**
 * Generate a unique receipt ID
 */
const generateReceiptId = (prefix = 'rcpt') => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `${prefix}_${timestamp}_${random}`;
};
exports.generateReceiptId = generateReceiptId;
/**
 * Validate Razorpay payment signature
 */
const validateSignature = (orderId, paymentId, signature, secret) => {
    try {
        const body = orderId + '|' + paymentId;
        const expectedSignature = crypto_1.default
            .createHmac('sha256', secret)
            .update(body.toString())
            .digest('hex');
        return expectedSignature === signature;
    }
    catch (error) {
        console.error('Error validating signature:', error);
        return false;
    }
};
exports.validateSignature = validateSignature;
/**
 * Generate webhook signature for verification
 */
const generateWebhookSignature = (body, secret) => {
    return crypto_1.default
        .createHmac('sha256', secret)
        .update(body)
        .digest('hex');
};
exports.generateWebhookSignature = generateWebhookSignature;
/**
 * Format payment status for display
 */
const formatPaymentStatus = (status) => {
    const statusMap = {
        'created': 'Created',
        'authorized': 'Authorized',
        'captured': 'Captured',
        'refunded': 'Refunded',
        'failed': 'Failed'
    };
    return statusMap[status] || status.charAt(0).toUpperCase() + status.slice(1);
};
exports.formatPaymentStatus = formatPaymentStatus;
/**
 * Calculate refund amount with validation
 */
const calculateRefundAmount = (originalAmount, refundAmount) => {
    if (!refundAmount) {
        return originalAmount; // Full refund
    }
    if (refundAmount > originalAmount) {
        throw new Error('Refund amount cannot be greater than original amount');
    }
    if (refundAmount <= 0) {
        throw new Error('Refund amount must be greater than 0');
    }
    return refundAmount;
};
exports.calculateRefundAmount = calculateRefundAmount;
/**
 * Validate currency code
 */
const validateCurrency = (currency) => {
    const supportedCurrencies = ['INR', 'USD', 'EUR', 'GBP', 'AUD', 'CAD', 'SGD'];
    return supportedCurrencies.includes(currency.toUpperCase());
};
exports.validateCurrency = validateCurrency;
/**
 * Format amount for display with currency
 */
const formatAmount = (amount, currency = 'INR') => {
    const formatter = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: currency.toUpperCase(),
        minimumFractionDigits: 2
    });
    return formatter.format((0, exports.convertToRupees)(amount));
};
exports.formatAmount = formatAmount;
/**
 * Generate payment description
 */
const generatePaymentDescription = (orderId, items) => {
    let description = `Payment for order ${orderId}`;
    if (items && items.length > 0) {
        description += ` - ${items.join(', ')}`;
    }
    return description.substring(0, 255); // Razorpay description limit
};
exports.generatePaymentDescription = generatePaymentDescription;
/**
 * Validate webhook timestamp to prevent replay attacks
 */
const validateWebhookTimestamp = (timestamp, toleranceInSeconds = 300) => {
    const currentTime = Math.floor(Date.now() / 1000);
    const timeDifference = Math.abs(currentTime - timestamp);
    return timeDifference <= toleranceInSeconds;
};
exports.validateWebhookTimestamp = validateWebhookTimestamp;
/**
 * Extract error message from Razorpay error
 */
const extractRazorpayError = (error) => {
    if (error.error && error.error.description) {
        return error.error.description;
    }
    if (error.message) {
        return error.message;
    }
    return 'An unknown payment error occurred';
};
exports.extractRazorpayError = extractRazorpayError;
/**
 * Generate payment metadata
 */
const generatePaymentMetadata = (userId, orderId, additionalData) => {
    const metadata = {};
    if (userId)
        metadata.user_id = userId;
    if (orderId)
        metadata.order_id = orderId;
    if (additionalData) {
        Object.keys(additionalData).forEach(key => {
            metadata[key] = String(additionalData[key]);
        });
    }
    return metadata;
};
exports.generatePaymentMetadata = generatePaymentMetadata;
