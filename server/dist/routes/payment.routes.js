"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// Test route
router.get('/test', (req, res) => {
    res.json({ message: 'Payment routes are working!' });
});
// Simple create order route for testing
router.post('/create-order', async (req, res) => {
    try {
        res.json({
            success: true,
            message: 'Payment route is accessible',
            body: req.body
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error in payment route',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// Verify payment
router.post('/verify-payment', PaymentController.verifyPayment);
// Get payment details
router.get('/payment/:paymentId', PaymentController.getPaymentDetails);
// Get order details
router.get('/order/:orderId', PaymentController.getOrderDetails);
// Capture payment (for manual capture)
router.post('/capture/:paymentId', PaymentController.capturePayment);
// Create refund
router.post('/refund', PaymentController.createRefund);
// Get all payments
router.get('/payments', PaymentController.getAllPayments);
// Get all orders
router.get('/orders', PaymentController.getAllOrders);
// Webhook endpoint
router.post('/webhook', PaymentController.handleWebhook);
exports.default = router;
