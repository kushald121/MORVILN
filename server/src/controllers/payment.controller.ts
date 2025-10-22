import { Request, Response } from 'express';
import crypto from 'crypto';
import { PaymentService } from '../services/payment.service';
import { CreateOrderRequest, VerifyPaymentRequest, RefundRequest } from '../types/payment.types';

export class PaymentController {
  /**
   * Create a new payment order
   */
  static async createOrder(req: Request, res: Response): Promise<void> {
    try {
      const { amount, currency, receipt, notes }: CreateOrderRequest = req.body;

      if (!amount || amount <= 0) {
        res.status(400).json({
          success: false,
          message: 'Valid amount is required'
        });
        return;
      }

      const order = await PaymentService.createOrder({
        amount,
        currency,
        receipt,
        notes
      });

      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        data: order
      });
    } catch (error) {
      console.error('Create order error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create order',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Verify payment after successful payment
   */
  static async verifyPayment(req: Request, res: Response): Promise<void> {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature }: VerifyPaymentRequest = req.body;

      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        res.status(400).json({
          success: false,
          message: 'Missing required payment verification parameters'
        });
        return;
      }

      const isValid = PaymentService.verifyPaymentSignature({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      });

      if (isValid) {
        // Get payment details
        const paymentDetails = await PaymentService.getPaymentDetails(razorpay_payment_id);

        // Here you can save payment details to your database
        // await savePaymentToDatabase(paymentDetails);

        res.status(200).json({
          success: true,
          message: 'Payment verified successfully',
          data: {
            payment_id: razorpay_payment_id,
            order_id: razorpay_order_id,
            status: 'verified',
            payment_details: paymentDetails
          }
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'Payment verification failed'
        });
      }
    } catch (error) {
      console.error('Verify payment error:', error);
      res.status(500).json({
        success: false,
        message: 'Payment verification failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get payment details
   */
  static async getPaymentDetails(req: Request, res: Response): Promise<void> {
    try {
      const { paymentId } = req.params;

      if (!paymentId) {
        res.status(400).json({
          success: false,
          message: 'Payment ID is required'
        });
        return;
      }

      const paymentDetails = await PaymentService.getPaymentDetails(paymentId);

      res.status(200).json({
        success: true,
        message: 'Payment details retrieved successfully',
        data: paymentDetails
      });
    } catch (error) {
      console.error('Get payment details error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get payment details',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get order details
   */
  static async getOrderDetails(req: Request, res: Response): Promise<void> {
    try {
      const { orderId } = req.params;

      if (!orderId) {
        res.status(400).json({
          success: false,
          message: 'Order ID is required'
        });
        return;
      }

      const orderDetails = await PaymentService.getOrderDetails(orderId);

      res.status(200).json({
        success: true,
        message: 'Order details retrieved successfully',
        data: orderDetails
      });
    } catch (error) {
      console.error('Get order details error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get order details',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Capture payment (for manual capture)
   */
  static async capturePayment(req: Request, res: Response): Promise<void> {
    try {
      const { paymentId } = req.params;
      const { amount } = req.body;

      if (!paymentId || !amount) {
        res.status(400).json({
          success: false,
          message: 'Payment ID and amount are required'
        });
        return;
      }

      const capturedPayment = await PaymentService.capturePayment(paymentId, amount);

      res.status(200).json({
        success: true,
        message: 'Payment captured successfully',
        data: capturedPayment
      });
    } catch (error) {
      console.error('Capture payment error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to capture payment',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Create refund
   */
  static async createRefund(req: Request, res: Response): Promise<void> {
    try {
      const { payment_id, amount, speed, notes, receipt }: RefundRequest = req.body;

      if (!payment_id) {
        res.status(400).json({
          success: false,
          message: 'Payment ID is required'
        });
        return;
      }

      const refund = await PaymentService.createRefund({
        payment_id,
        amount,
        speed,
        notes,
        receipt
      });

      res.status(201).json({
        success: true,
        message: 'Refund created successfully',
        data: refund
      });
    } catch (error) {
      console.error('Create refund error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create refund',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get all payments with pagination
   */
  static async getAllPayments(req: Request, res: Response): Promise<void> {
    try {
      const { count = 10, skip = 0, from, to } = req.query;

      const options: any = {
        count: parseInt(count as string),
        skip: parseInt(skip as string)
      };

      if (from) options.from = new Date(from as string).getTime() / 1000;
      if (to) options.to = new Date(to as string).getTime() / 1000;

      const payments = await PaymentService.getAllPayments(options);

      res.status(200).json({
        success: true,
        message: 'Payments retrieved successfully',
        data: payments
      });
    } catch (error) {
      console.error('Get all payments error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get payments',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get all orders with pagination
   */
  static async getAllOrders(req: Request, res: Response): Promise<void> {
    try {
      const { count = 10, skip = 0, from, to } = req.query;

      const options: any = {
        count: parseInt(count as string),
        skip: parseInt(skip as string)
      };

      if (from) options.from = new Date(from as string).getTime() / 1000;
      if (to) options.to = new Date(to as string).getTime() / 1000;

      const orders = await PaymentService.getAllOrders(options);

      res.status(200).json({
        success: true,
        message: 'Orders retrieved successfully',
        data: orders
      });
    } catch (error) {
      console.error('Get all orders error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get orders',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Webhook handler for Razorpay events
   */
  static async handleWebhook(req: Request, res: Response): Promise<void> {
    try {
      const webhookSignature = req.headers['x-razorpay-signature'] as string;
      const webhookBody = JSON.stringify(req.body);

      // Verify webhook signature
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET || '')
        .update(webhookBody)
        .digest('hex');

      if (webhookSignature !== expectedSignature) {
        res.status(400).json({
          success: false,
          message: 'Invalid webhook signature'
        });
        return;
      }

      const { event, payload } = req.body;

      // Handle different webhook events
      switch (event) {
        case 'payment.captured':
          console.log('Payment captured:', payload.payment.entity);
          // Handle successful payment
          break;
        case 'payment.failed':
          console.log('Payment failed:', payload.payment.entity);
          // Handle failed payment
          break;
        case 'order.paid':
          console.log('Order paid:', payload.order.entity);
          // Handle order completion
          break;
        case 'refund.created':
          console.log('Refund created:', payload.refund.entity);
          // Handle refund creation
          break;
        default:
          console.log('Unhandled webhook event:', event);
      }

      res.status(200).json({
        success: true,
        message: 'Webhook processed successfully'
      });
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(500).json({
        success: false,
        message: 'Webhook processing failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

