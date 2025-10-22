"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const crypto_1 = __importDefault(require("crypto"));
const razorpay_1 = __importDefault(require("../config/razorpay"));
class PaymentService {
    /**
     * Create a new Razorpay order
     */
    static async createOrder(orderData) {
        try {
            const options = {
                amount: orderData.amount * 100, // Convert to paise
                currency: orderData.currency || 'INR',
                receipt: orderData.receipt || `receipt_${Date.now()}`,
                notes: orderData.notes || {}
            };
            const order = await razorpay_1.default.orders.create(options);
            return order;
        }
        catch (error) {
            console.error('Error creating Razorpay order:', error);
            throw new Error('Failed to create payment order');
        }
    }
    /**
     * Verify payment signature
     */
    static verifyPaymentSignature(paymentData) {
        try {
            const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentData;
            const body = razorpay_order_id + '|' + razorpay_payment_id;
            const expectedSignature = crypto_1.default
                .createHmac('sha256', process.env.RAZORPAY_TEST_SECRET)
                .update(body.toString())
                .digest('hex');
            return expectedSignature === razorpay_signature;
        }
        catch (error) {
            console.error('Error verifying payment signature:', error);
            return false;
        }
    }
    /**
     * Get payment details by payment ID
     */
    static async getPaymentDetails(paymentId) {
        try {
            const payment = await razorpay_1.default.payments.fetch(paymentId);
            return payment;
        }
        catch (error) {
            console.error('Error fetching payment details:', error);
            throw new Error('Failed to fetch payment details');
        }
    }
    /**
     * Get order details by order ID
     */
    static async getOrderDetails(orderId) {
        try {
            const order = await razorpay_1.default.orders.fetch(orderId);
            return order;
        }
        catch (error) {
            console.error('Error fetching order details:', error);
            throw new Error('Failed to fetch order details');
        }
    }
    /**
     * Capture a payment
     */
    static async capturePayment(paymentId, amount) {
        try {
            const payment = await razorpay_1.default.payments.capture(paymentId, amount * 100, 'INR');
            return payment;
        }
        catch (error) {
            console.error('Error capturing payment:', error);
            throw new Error('Failed to capture payment');
        }
    }
    /**
     * Create a refund
     */
    static async createRefund(refundData) {
        try {
            const options = {
                payment_id: refundData.payment_id,
                speed: refundData.speed || 'normal',
                notes: refundData.notes || {},
            };
            if (refundData.amount) {
                options.amount = refundData.amount * 100; // Convert to paise
            }
            if (refundData.receipt) {
                options.receipt = refundData.receipt;
            }
            const refund = await razorpay_1.default.payments.refund(refundData.payment_id, options);
            return refund;
        }
        catch (error) {
            console.error('Error creating refund:', error);
            throw new Error('Failed to create refund');
        }
    }
    /**
     * Get all refunds for a payment
     */
    static async getRefunds(paymentId) {
        try {
            const refunds = await razorpay_1.default.payments.fetchMultipleRefund(paymentId);
            return refunds;
        }
        catch (error) {
            console.error('Error fetching refunds:', error);
            throw new Error('Failed to fetch refunds');
        }
    }
    /**
     * Get refund details by refund ID
     */
    static async getRefundDetails(paymentId, refundId) {
        try {
            const refund = await razorpay_1.default.payments.fetchRefund(paymentId, refundId);
            return refund;
        }
        catch (error) {
            console.error('Error fetching refund details:', error);
            throw new Error('Failed to fetch refund details');
        }
    }
    /**
     * Get all payments with optional filters
     */
    static async getAllPayments(options = {}) {
        try {
            const payments = await razorpay_1.default.payments.all(options);
            return payments;
        }
        catch (error) {
            console.error('Error fetching payments:', error);
            throw new Error('Failed to fetch payments');
        }
    }
    /**
     * Get all orders with optional filters
     */
    static async getAllOrders(options = {}) {
        try {
            const orders = await razorpay_1.default.orders.all(options);
            return orders;
        }
        catch (error) {
            console.error('Error fetching orders:', error);
            throw new Error('Failed to fetch orders');
        }
    }
}
exports.PaymentService = PaymentService;
