import { Request, Response } from 'express';
import { OrderModel, OrderData } from '../models/order.model';

export class OrderController {
  /**
   * Create a new order
   */
  static async createOrder(req: Request, res: Response): Promise<void> {
    try {
      console.log('📦 Received order creation request');
      console.log('Request body:', JSON.stringify(req.body, null, 2));

      const orderData: OrderData = req.body;

      // Validation
      if (!orderData.customer_email || !orderData.customer_name) {
        res.status(400).json({
          success: false,
          message: 'Customer email and name are required',
        });
        return;
      }

      if (!orderData.shipping_address) {
        res.status(400).json({
          success: false,
          message: 'Shipping address is required',
        });
        return;
      }

      if (!orderData.products || orderData.products.length === 0) {
        res.status(400).json({
          success: false,
          message: 'At least one product is required',
        });
        return;
      }

      if (!orderData.total_amount || orderData.total_amount <= 0) {
        res.status(400).json({
          success: false,
          message: 'Valid total amount is required',
        });
        return;
      }

      // Create order in database
      const order = await OrderModel.createOrder(orderData);

      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        data: order,
      });
    } catch (error) {
      console.error('❌ Create order error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create order',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Get order by ID
   */
  static async getOrderById(req: Request, res: Response): Promise<void> {
    try {
      const { orderId } = req.params;

      if (!orderId) {
        res.status(400).json({
          success: false,
          message: 'Order ID is required',
        });
        return;
      }

      const order = await OrderModel.getOrderById(orderId);

      if (!order) {
        res.status(404).json({
          success: false,
          message: 'Order not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Order retrieved successfully',
        data: order,
      });
    } catch (error) {
      console.error('Get order error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get order',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Get order by order number
   */
  static async getOrderByOrderNumber(req: Request, res: Response): Promise<void> {
    try {
      const { orderNumber } = req.params;

      if (!orderNumber) {
        res.status(400).json({
          success: false,
          message: 'Order number is required',
        });
        return;
      }

      const order = await OrderModel.getOrderByOrderNumber(orderNumber);

      if (!order) {
        res.status(404).json({
          success: false,
          message: 'Order not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Order retrieved successfully',
        data: order,
      });
    } catch (error) {
      console.error('Get order error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get order',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Get user's orders
   */
  static async getUserOrders(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id; // From auth middleware
      const { limit = 10, offset = 0 } = req.query;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated',
        });
        return;
      }

      const orders = await OrderModel.getOrdersByUserId(
        userId,
        parseInt(limit as string),
        parseInt(offset as string)
      );

      res.status(200).json({
        success: true,
        message: 'Orders retrieved successfully',
        data: orders,
        count: orders.length,
      });
    } catch (error) {
      console.error('Get user orders error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get orders',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Get all orders (admin)
   */
  static async getAllOrders(req: Request, res: Response): Promise<void> {
    try {
      const { limit = 10, offset = 0 } = req.query;

      const result = await OrderModel.getAllOrders(
        parseInt(limit as string),
        parseInt(offset as string)
      );

      res.status(200).json({
        success: true,
        message: 'Orders retrieved successfully',
        data: result.orders,
        total: result.total,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
      });
    } catch (error) {
      console.error('Get all orders error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get orders',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Update order payment status
   */
  static async updatePaymentStatus(req: Request, res: Response): Promise<void> {
    try {
      const { orderId } = req.params;
      const { payment_status, payment_gateway_id } = req.body;

      if (!orderId || !payment_status) {
        res.status(400).json({
          success: false,
          message: 'Order ID and payment status are required',
        });
        return;
      }

      const order = await OrderModel.updatePaymentStatus(
        orderId,
        payment_status,
        payment_gateway_id
      );

      if (!order) {
        res.status(404).json({
          success: false,
          message: 'Order not found or update failed',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Payment status updated successfully',
        data: order,
      });
    } catch (error) {
      console.error('Update payment status error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update payment status',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Update order fulfillment status
   */
  static async updateFulfillmentStatus(req: Request, res: Response): Promise<void> {
    try {
      const { orderId } = req.params;
      const { fulfillment_status } = req.body;

      if (!orderId || !fulfillment_status) {
        res.status(400).json({
          success: false,
          message: 'Order ID and fulfillment status are required',
        });
        return;
      }

      const order = await OrderModel.updateFulfillmentStatus(orderId, fulfillment_status);

      if (!order) {
        res.status(404).json({
          success: false,
          message: 'Order not found or update failed',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Fulfillment status updated successfully',
        data: order,
      });
    } catch (error) {
      console.error('Update fulfillment status error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update fulfillment status',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Cancel order
   */
  static async cancelOrder(req: Request, res: Response): Promise<void> {
    try {
      const { orderId } = req.params;

      if (!orderId) {
        res.status(400).json({
          success: false,
          message: 'Order ID is required',
        });
        return;
      }

      const order = await OrderModel.cancelOrder(orderId);

      if (!order) {
        res.status(404).json({
          success: false,
          message: 'Order not found or cancellation failed',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Order cancelled successfully',
        data: order,
      });
    } catch (error) {
      console.error('Cancel order error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to cancel order',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Delete order (admin only)
   */
  static async deleteOrder(req: Request, res: Response): Promise<void> {
    try {
      const { orderId } = req.params;

      if (!orderId) {
        res.status(400).json({
          success: false,
          message: 'Order ID is required',
        });
        return;
      }

      const success = await OrderModel.deleteOrder(orderId);

      if (!success) {
        res.status(404).json({
          success: false,
          message: 'Order not found or deletion failed',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Order deleted successfully',
      });
    } catch (error) {
      console.error('Delete order error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete order',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
