import { paymentAPI } from '@/lib/api';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

class PaymentService {
  // Load Razorpay script
  static loadRazorpayScript(): Promise<boolean> {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  // Create Razorpay order
  static async createOrder(amount: number, currency: string = 'INR'): Promise<any> {
    try {
      const response = await paymentAPI.createOrder(amount, currency);
      return response.data;
    } catch (error: any) {
      console.error('Error creating order:', error);
      throw new Error(error.response?.data?.message || 'Failed to create payment order');
    }
  }

  // Verify payment
  static async verifyPayment(data: RazorpayResponse): Promise<any> {
    try {
      const response = await paymentAPI.verifyPayment(data);
      return response.data;
    } catch (error: any) {
      console.error('Error verifying payment:', error);
      throw new Error(error.response?.data?.message || 'Payment verification failed');
    }
  }

  // Process complete payment flow
  static async processPayment(
    amount: number,
    orderData: any,
    userInfo?: { name?: string; email?: string; contact?: string }
  ): Promise<any> {
    try {
      // Load Razorpay script
      const scriptLoaded = await this.loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Razorpay SDK failed to load');
      }

      // Create order
      const orderResponse = await this.createOrder(amount);
      const { id: order_id, amount: orderAmount, currency } = orderResponse.order;

      // Return a promise that resolves when payment is complete
      return new Promise((resolve, reject) => {
        const options: RazorpayOptions = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
          amount: orderAmount,
          currency: currency,
          name: 'MORVILN',
          description: 'Order Payment',
          order_id: order_id,
          handler: async (response: RazorpayResponse) => {
            try {
              // Verify payment
              const verificationResult = await this.verifyPayment(response);
              
              // Create order in backend
              const finalOrder = await paymentAPI.processPayment({
                ...orderData,
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                signature: response.razorpay_signature,
              });
              
              resolve(finalOrder.data);
            } catch (error) {
              reject(error);
            }
          },
          prefill: {
            name: userInfo?.name || '',
            email: userInfo?.email || '',
            contact: userInfo?.contact || '',
          },
          theme: {
            color: '#f97316', // Orange color matching MORVILN theme
          },
        };

        const razorpay = new window.Razorpay(options);
        
        razorpay.on('payment.failed', (response: any) => {
          reject(new Error(response.error.description || 'Payment failed'));
        });

        razorpay.open();
      });
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  }

  // Format amount for display
  static formatAmount(amount: number, currency: string = 'INR'): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount / 100); // Razorpay uses paise/cents
  }

  // Convert rupees to paise
  static convertToPaise(amount: number): number {
    return Math.round(amount * 100);
  }

  // Convert paise to rupees
  static convertToRupees(amount: number): number {
    return amount / 100;
  }
}

export { PaymentService };
