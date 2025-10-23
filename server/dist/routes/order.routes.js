"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_controller_1 = require("../controllers/order.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Public routes
/**
 * @route   POST /api/orders/create
 * @desc    Create a new order
 * @access  Public
 */
router.post('/create', order_controller_1.OrderController.createOrder);
/**
 * @route   GET /api/orders/:orderId
 * @desc    Get order by ID
 * @access  Public (anyone with order ID can view)
 */
router.get('/:orderId', order_controller_1.OrderController.getOrderById);
/**
 * @route   GET /api/orders/number/:orderNumber
 * @desc    Get order by order number
 * @access  Public (anyone with order number can view)
 */
router.get('/number/:orderNumber', order_controller_1.OrderController.getOrderByOrderNumber);
// Protected routes (require authentication)
/**
 * @route   GET /api/orders/user/me
 * @desc    Get current user's orders
 * @access  Private
 */
router.get('/user/me', auth_middleware_1.authMiddleware, order_controller_1.OrderController.getUserOrders);
/**
 * @route   PUT /api/orders/:orderId/payment-status
 * @desc    Update order payment status
 * @access  Private (admin or system)
 */
router.put('/:orderId/payment-status', order_controller_1.OrderController.updatePaymentStatus);
/**
 * @route   PUT /api/orders/:orderId/fulfillment-status
 * @desc    Update order fulfillment status
 * @access  Private (admin only)
 */
router.put('/:orderId/fulfillment-status', order_controller_1.OrderController.updateFulfillmentStatus);
/**
 * @route   PUT /api/orders/:orderId/cancel
 * @desc    Cancel an order
 * @access  Private (user or admin)
 */
router.put('/:orderId/cancel', order_controller_1.OrderController.cancelOrder);
/**
 * @route   DELETE /api/orders/:orderId
 * @desc    Delete an order
 * @access  Private (admin only)
 */
router.delete('/:orderId', order_controller_1.OrderController.deleteOrder);
// Admin routes
/**
 * @route   GET /api/orders
 * @desc    Get all orders with pagination
 * @access  Private (admin only)
 */
router.get('/', order_controller_1.OrderController.getAllOrders);
exports.default = router;
