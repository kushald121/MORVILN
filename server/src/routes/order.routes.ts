import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Public routes
/**
 * @route   POST /api/orders/create
 * @desc    Create a new order
 * @access  Public
 */
router.post('/create', OrderController.createOrder);

/**
 * @route   GET /api/orders/:orderId
 * @desc    Get order by ID
 * @access  Public (anyone with order ID can view)
 */
router.get('/:orderId', OrderController.getOrderById);

/**
 * @route   GET /api/orders/number/:orderNumber
 * @desc    Get order by order number
 * @access  Public (anyone with order number can view)
 */
router.get('/number/:orderNumber', OrderController.getOrderByOrderNumber);

// Protected routes (require authentication)
/**
 * @route   GET /api/orders/user/me
 * @desc    Get current user's orders
 * @access  Private
 */
router.get('/user/me', authMiddleware, OrderController.getUserOrders);

/**
 * @route   PUT /api/orders/:orderId/payment-status
 * @desc    Update order payment status
 * @access  Private (admin or system)
 */
router.put('/:orderId/payment-status', OrderController.updatePaymentStatus);

/**
 * @route   PUT /api/orders/:orderId/fulfillment-status
 * @desc    Update order fulfillment status
 * @access  Private (admin only)
 */
router.put('/:orderId/fulfillment-status', OrderController.updateFulfillmentStatus);

/**
 * @route   PUT /api/orders/:orderId/cancel
 * @desc    Cancel an order
 * @access  Private (user or admin)
 */
router.put('/:orderId/cancel', OrderController.cancelOrder);

/**
 * @route   DELETE /api/orders/:orderId
 * @desc    Delete an order
 * @access  Private (admin only)
 */
router.delete('/:orderId', OrderController.deleteOrder);

// Admin routes
/**
 * @route   GET /api/orders
 * @desc    Get all orders with pagination
 * @access  Private (admin only)
 */
router.get('/', OrderController.getAllOrders);

export default router;
