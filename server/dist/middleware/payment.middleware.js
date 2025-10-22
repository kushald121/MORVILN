"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logPaymentOperation = exports.webhookSecurity = exports.paymentRateLimit = exports.validateRefundCreation = exports.validatePaymentVerification = exports.validateCreateOrder = void 0;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { body, validationResult } = require('express-validator');
// Validation middleware for creating orders
exports.validateCreateOrder = [
    body('amount')
        .isNumeric()
        .withMessage('Amount must be a number')
        .isFloat({ min: 1 })
        .withMessage('Amount must be greater than 0'),
    body('currency')
        .optional()
        .isString()
        .isLength({ min: 3, max: 3 })
        .withMessage('Currency must be a 3-character code'),
    body('receipt')
        .optional()
        .isString()
        .isLength({ max: 40 })
        .withMessage('Receipt must be less than 40 characters'),
    body('notes')
        .optional()
        .isObject()
        .withMessage('Notes must be an object'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }
        next();
    }
];
// Validation middleware for payment verification
exports.validatePaymentVerification = [
    body('razorpay_order_id')
        .notEmpty()
        .withMessage('Razorpay order ID is required'),
    body('razorpay_payment_id')
        .notEmpty()
        .withMessage('Razorpay payment ID is required'),
    body('razorpay_signature')
        .notEmpty()
        .withMessage('Razorpay signature is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }
        next();
    }
];
// Validation middleware for refund creation
exports.validateRefundCreation = [
    body('payment_id')
        .notEmpty()
        .withMessage('Payment ID is required'),
    body('amount')
        .optional()
        .isNumeric()
        .withMessage('Amount must be a number')
        .isFloat({ min: 1 })
        .withMessage('Amount must be greater than 0'),
    body('speed')
        .optional()
        .isIn(['normal', 'optimum'])
        .withMessage('Speed must be either "normal" or "optimum"'),
    body('notes')
        .optional()
        .isObject()
        .withMessage('Notes must be an object'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }
        next();
    }
];
// Rate limiting middleware for payment operations
const paymentRateLimit = (_req, _res, next) => {
    // Implement rate limiting logic here
    // You can use libraries like express-rate-limit
    next();
};
exports.paymentRateLimit = paymentRateLimit;
// Security middleware for webhook verification
const webhookSecurity = (req, res, next) => {
    // Ensure webhook is coming from Razorpay
    const signature = req.headers['x-razorpay-signature'];
    if (!signature) {
        return res.status(400).json({
            success: false,
            message: 'Missing webhook signature'
        });
    }
    next();
};
exports.webhookSecurity = webhookSecurity;
// Middleware to log payment operations
const logPaymentOperation = (req, _res, next) => {
    const { method, url, body } = req;
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] Payment Operation: ${method} ${url}`, {
        body: method === 'POST' ? body : undefined,
        ip: req.ip,
        userAgent: req.get('User-Agent')
    });
    next();
};
exports.logPaymentOperation = logPaymentOperation;
