<<<<<<< HEAD
import emailService from "./email.service"

// Define the interface for order email data
interface OrderEmailData {
  order: {
    id: string;
    order_number: string;
    ordered_at: string;
    subtotal_amount: number;
    shipping_amount: number;
    tax_amount: number;
    discount_amount: number;
    total_amount: number;
    payment_status: string;
    payment_method: string;
  };
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  products: Array<{
    name: string;
    size: string;
    color: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress: {
    full_name: string;
    address_line_1: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    phone: string;
  };
}
=======
import { EmailService, OrderEmailData } from './emailService';
>>>>>>> f3387b1 (fix: saving all local changes before merge)

export class OrderService {
  static async confirmOrderAfterPayment(orderId: string, paymentData: any) {
    try {
      // 1. Verify payment with Razorpay
      const paymentVerified = await this.verifyRazorpayPayment(paymentData);
      
      if (!paymentVerified) {
        throw new Error('Payment verification failed');
      }

      // 2. Update order status to confirmed
      const order = await this.updateOrderStatus(orderId, 'confirmed', 'paid');
      
      // 3. Prepare email data
      const emailData = await this.prepareOrderEmailData(order);
      
      // 4. Send emails (fire and forget - don't await)
      this.sendOrderEmailsAsync(emailData);
      
      // 5. Update inventory and other operations
      await this.updateInventory(order);
      await this.createOrderStatusHistory(order.id, 'payment', 'pending', 'paid');
      
      return { success: true, order };
    } catch (error) {
      console.error('Error confirming order:', error);
      throw error;
    }
  }

  private static async verifyRazorpayPayment(paymentData: any): Promise<boolean> {
    // Implement Razorpay payment verification
    // This is a placeholder - implement actual Razorpay verification
    return true;
  }

  private static async updateOrderStatus(orderId: string, status: string, paymentStatus: string) {
    // Update order in database
    // This is a placeholder - implement actual database update
    return {
      id: orderId,
      order_number: 'ORD-20250101-0001',
      ordered_at: new Date().toISOString(),
      subtotal_amount: 4500.00,
      shipping_amount: 75.00,
      tax_amount: 540.00,
      discount_amount: 500.00,
      total_amount: 4615.00,
      payment_status: paymentStatus,
      payment_method: 'razorpay'
    };
  }

  private static async prepareOrderEmailData(order: any): Promise<OrderEmailData> {
    // Fetch complete order data from database
    // This is a placeholder - implement actual data fetching
    
    return {
      order: {
        id: order.id,
        order_number: order.order_number,
        ordered_at: order.ordered_at,
        subtotal_amount: order.subtotal_amount,
        shipping_amount: order.shipping_amount,
        tax_amount: order.tax_amount,
        discount_amount: order.discount_amount,
        total_amount: order.total_amount,
        payment_status: order.payment_status,
        payment_method: order.payment_method
      },
      customer: {
        name: 'John Doe', // Fetch from user table
        email: 'customer@example.com', // Fetch from user table
        phone: '+91 9876543210' // Fetch from user table
      },
      products: [
        {
          name: 'Premium Cotton T-Shirt',
          size: 'M',
          color: 'Navy Blue',
          quantity: 2,
          price: 1200.00
        }
      ],
      shippingAddress: {
        full_name: 'John Doe',
        address_line_1: '123 Main Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        postal_code: '400001',
        country: 'India',
        phone: '+91 9876543210'
      }
    };
  }

  private static async sendOrderEmailsAsync(emailData: OrderEmailData) {
    try {
<<<<<<< HEAD
      // Send order confirmation email
      await emailService.sendOrderConfirmation(
        emailData.customer.email,
        {
          customerName: emailData.customer.name,
          orderId: emailData.order.order_number,
          orderDate: new Date(emailData.order.ordered_at).toLocaleDateString(),
          items: emailData.products.map(product => ({
            name: product.name,
            quantity: product.quantity,
            price: product.price * 100 // Convert to cents
          })),
          totalAmount: emailData.order.total_amount * 100, // Convert to cents
          shippingAddress: `${emailData.shippingAddress.address_line_1}\n${emailData.shippingAddress.city}, ${emailData.shippingAddress.state} ${emailData.shippingAddress.postal_code}\n${emailData.shippingAddress.country}`
        }
      );
=======
      await EmailService.sendOrderEmails(emailData);
>>>>>>> f3387b1 (fix: saving all local changes before merge)
    } catch (error) {
      console.error('Failed to send order emails:', error);
      // Don't throw error here to not affect order confirmation flow
    }
  }

  private static async updateInventory(order: any) {
    // Update product inventory
    // Implement inventory update logic
  }

  private static async createOrderStatusHistory(orderId: string, statusType: string, oldStatus: string, newStatus: string) {
    // Create order status history record
    // Implement history tracking
  }
}