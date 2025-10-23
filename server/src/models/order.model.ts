import { supabaseAdmin } from '../config/supabaseclient';

export interface OrderData {
  user_id?: string;
  customer_email: string;
  customer_name: string;
  customer_phone?: string;
  shipping_address: {
    full_name: string;
    phone: string;
    address_line_1: string;
    address_line_2?: string;
    landmark?: string;
    city: string;
    state: string;
    postal_code: string;
    country?: string;
  };
  products: Array<{
    product_id: string;
    product_name: string;
    variant_id: string;
    sku: string;
    size: string;
    color?: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  subtotal_amount: number;
  shipping_amount?: number;
  tax_amount?: number;
  discount_amount?: number;
  total_amount: number;
  payment_method?: string;
  payment_gateway?: string;
  payment_gateway_id?: string;
}

export interface Order extends OrderData {
  id: string;
  order_number: string;
  payment_status: string;
  fulfillment_status: string;
  ordered_at: string;
  paid_at?: string;
  fulfilled_at?: string;
  cancelled_at?: string;
  created_at: string;
  updated_at: string;
}

export class OrderModel {
  /**
   * Create a new order
   */
  static async createOrder(orderData: OrderData): Promise<Order> {
    try {
      console.log('📦 Creating order with data:', JSON.stringify(orderData, null, 2));

      const { data, error } = await supabaseAdmin
        .from('orders')
        .insert({
          user_id: orderData.user_id || null,
          customer_email: orderData.customer_email,
          customer_name: orderData.customer_name,
          customer_phone: orderData.customer_phone || null,
          shipping_address: orderData.shipping_address,
          products: orderData.products,
          subtotal_amount: orderData.subtotal_amount,
          shipping_amount: orderData.shipping_amount || 0,
          tax_amount: orderData.tax_amount || 0,
          discount_amount: orderData.discount_amount || 0,
          total_amount: orderData.total_amount,
          payment_method: orderData.payment_method || null,
          payment_gateway: orderData.payment_gateway || 'razorpay',
          payment_gateway_id: orderData.payment_gateway_id || null,
          payment_status: 'pending',
          fulfillment_status: 'unfulfilled',
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Error creating order in DB:', error);
        throw new Error(`Failed to create order: ${error.message}`);
      }

      console.log('✅ Order created successfully:', data.order_number);
      return data as Order;
    } catch (error) {
      console.error('❌ Order creation failed:', error);
      throw error;
    }
  }

  /**
   * Get order by ID
   */
  static async getOrderById(orderId: string): Promise<Order | null> {
    try {
      const { data, error } = await supabaseAdmin
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (error) {
        console.error('Error fetching order:', error);
        return null;
      }

      return data as Order;
    } catch (error) {
      console.error('Error in getOrderById:', error);
      return null;
    }
  }

  /**
   * Get order by order number
   */
  static async getOrderByOrderNumber(orderNumber: string): Promise<Order | null> {
    try {
      const { data, error } = await supabaseAdmin
        .from('orders')
        .select('*')
        .eq('order_number', orderNumber)
        .single();

      if (error) {
        console.error('Error fetching order:', error);
        return null;
      }

      return data as Order;
    } catch (error) {
      console.error('Error in getOrderByOrderNumber:', error);
      return null;
    }
  }

  /**
   * Get orders by user ID
   */
  static async getOrdersByUserId(userId: string, limit = 10, offset = 0): Promise<Order[]> {
    try {
      const { data, error } = await supabaseAdmin
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('ordered_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('Error fetching user orders:', error);
        return [];
      }

      return data as Order[];
    } catch (error) {
      console.error('Error in getOrdersByUserId:', error);
      return [];
    }
  }

  /**
   * Get all orders with pagination
   */
  static async getAllOrders(limit = 10, offset = 0): Promise<{ orders: Order[]; total: number }> {
    try {
      // Get total count
      const { count } = await supabaseAdmin
        .from('orders')
        .select('*', { count: 'exact', head: true });

      // Get orders
      const { data, error } = await supabaseAdmin
        .from('orders')
        .select('*')
        .order('ordered_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('Error fetching orders:', error);
        return { orders: [], total: 0 };
      }

      return { orders: data as Order[], total: count || 0 };
    } catch (error) {
      console.error('Error in getAllOrders:', error);
      return { orders: [], total: 0 };
    }
  }

  /**
   * Update order payment status
   */
  static async updatePaymentStatus(
    orderId: string,
    paymentStatus: string,
    paymentGatewayId?: string
  ): Promise<Order | null> {
    try {
      const updateData: any = {
        payment_status: paymentStatus,
      };

      if (paymentStatus === 'paid') {
        updateData.paid_at = new Date().toISOString();
      }

      if (paymentGatewayId) {
        updateData.payment_gateway_id = paymentGatewayId;
      }

      const { data, error } = await supabaseAdmin
        .from('orders')
        .update(updateData)
        .eq('id', orderId)
        .select()
        .single();

      if (error) {
        console.error('Error updating payment status:', error);
        return null;
      }

      console.log('✅ Order payment status updated:', data.order_number);
      return data as Order;
    } catch (error) {
      console.error('Error in updatePaymentStatus:', error);
      return null;
    }
  }

  /**
   * Update order fulfillment status
   */
  static async updateFulfillmentStatus(
    orderId: string,
    fulfillmentStatus: string
  ): Promise<Order | null> {
    try {
      const updateData: any = {
        fulfillment_status: fulfillmentStatus,
      };

      if (fulfillmentStatus === 'fulfilled') {
        updateData.fulfilled_at = new Date().toISOString();
      }

      const { data, error } = await supabaseAdmin
        .from('orders')
        .update(updateData)
        .eq('id', orderId)
        .select()
        .single();

      if (error) {
        console.error('Error updating fulfillment status:', error);
        return null;
      }

      console.log('✅ Order fulfillment status updated:', data.order_number);
      return data as Order;
    } catch (error) {
      console.error('Error in updateFulfillmentStatus:', error);
      return null;
    }
  }

  /**
   * Cancel order
   */
  static async cancelOrder(orderId: string): Promise<Order | null> {
    try {
      const { data, error } = await supabaseAdmin
        .from('orders')
        .update({
          payment_status: 'cancelled',
          cancelled_at: new Date().toISOString(),
        })
        .eq('id', orderId)
        .select()
        .single();

      if (error) {
        console.error('Error cancelling order:', error);
        return null;
      }

      console.log('✅ Order cancelled:', data.order_number);
      return data as Order;
    } catch (error) {
      console.error('Error in cancelOrder:', error);
      return null;
    }
  }

  /**
   * Delete order (admin only)
   */
  static async deleteOrder(orderId: string): Promise<boolean> {
    try {
      const { error } = await supabaseAdmin.from('orders').delete().eq('id', orderId);

      if (error) {
        console.error('Error deleting order:', error);
        return false;
      }

      console.log('✅ Order deleted successfully');
      return true;
    } catch (error) {
      console.error('Error in deleteOrder:', error);
      return false;
    }
  }
}
