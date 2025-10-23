"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderModel = void 0;
const supabaseclient_1 = require("../config/supabaseclient");
class OrderModel {
    /**
     * Create a new order
     */
    static async createOrder(orderData) {
        try {
            console.log('📦 Creating order with data:', JSON.stringify(orderData, null, 2));
            const { data, error } = await supabaseclient_1.supabaseAdmin
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
            return data;
        }
        catch (error) {
            console.error('❌ Order creation failed:', error);
            throw error;
        }
    }
    /**
     * Get order by ID
     */
    static async getOrderById(orderId) {
        try {
            const { data, error } = await supabaseclient_1.supabaseAdmin
                .from('orders')
                .select('*')
                .eq('id', orderId)
                .single();
            if (error) {
                console.error('Error fetching order:', error);
                return null;
            }
            return data;
        }
        catch (error) {
            console.error('Error in getOrderById:', error);
            return null;
        }
    }
    /**
     * Get order by order number
     */
    static async getOrderByOrderNumber(orderNumber) {
        try {
            const { data, error } = await supabaseclient_1.supabaseAdmin
                .from('orders')
                .select('*')
                .eq('order_number', orderNumber)
                .single();
            if (error) {
                console.error('Error fetching order:', error);
                return null;
            }
            return data;
        }
        catch (error) {
            console.error('Error in getOrderByOrderNumber:', error);
            return null;
        }
    }
    /**
     * Get orders by user ID
     */
    static async getOrdersByUserId(userId, limit = 10, offset = 0) {
        try {
            const { data, error } = await supabaseclient_1.supabaseAdmin
                .from('orders')
                .select('*')
                .eq('user_id', userId)
                .order('ordered_at', { ascending: false })
                .range(offset, offset + limit - 1);
            if (error) {
                console.error('Error fetching user orders:', error);
                return [];
            }
            return data;
        }
        catch (error) {
            console.error('Error in getOrdersByUserId:', error);
            return [];
        }
    }
    /**
     * Get all orders with pagination
     */
    static async getAllOrders(limit = 10, offset = 0) {
        try {
            // Get total count
            const { count } = await supabaseclient_1.supabaseAdmin
                .from('orders')
                .select('*', { count: 'exact', head: true });
            // Get orders
            const { data, error } = await supabaseclient_1.supabaseAdmin
                .from('orders')
                .select('*')
                .order('ordered_at', { ascending: false })
                .range(offset, offset + limit - 1);
            if (error) {
                console.error('Error fetching orders:', error);
                return { orders: [], total: 0 };
            }
            return { orders: data, total: count || 0 };
        }
        catch (error) {
            console.error('Error in getAllOrders:', error);
            return { orders: [], total: 0 };
        }
    }
    /**
     * Update order payment status
     */
    static async updatePaymentStatus(orderId, paymentStatus, paymentGatewayId) {
        try {
            const updateData = {
                payment_status: paymentStatus,
            };
            if (paymentStatus === 'paid') {
                updateData.paid_at = new Date().toISOString();
            }
            if (paymentGatewayId) {
                updateData.payment_gateway_id = paymentGatewayId;
            }
            const { data, error } = await supabaseclient_1.supabaseAdmin
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
            return data;
        }
        catch (error) {
            console.error('Error in updatePaymentStatus:', error);
            return null;
        }
    }
    /**
     * Update order fulfillment status
     */
    static async updateFulfillmentStatus(orderId, fulfillmentStatus) {
        try {
            const updateData = {
                fulfillment_status: fulfillmentStatus,
            };
            if (fulfillmentStatus === 'fulfilled') {
                updateData.fulfilled_at = new Date().toISOString();
            }
            const { data, error } = await supabaseclient_1.supabaseAdmin
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
            return data;
        }
        catch (error) {
            console.error('Error in updateFulfillmentStatus:', error);
            return null;
        }
    }
    /**
     * Cancel order
     */
    static async cancelOrder(orderId) {
        try {
            const { data, error } = await supabaseclient_1.supabaseAdmin
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
            return data;
        }
        catch (error) {
            console.error('Error in cancelOrder:', error);
            return null;
        }
    }
    /**
     * Delete order (admin only)
     */
    static async deleteOrder(orderId) {
        try {
            const { error } = await supabaseclient_1.supabaseAdmin.from('orders').delete().eq('id', orderId);
            if (error) {
                console.error('Error deleting order:', error);
                return false;
            }
            console.log('✅ Order deleted successfully');
            return true;
        }
        catch (error) {
            console.error('Error in deleteOrder:', error);
            return false;
        }
    }
}
exports.OrderModel = OrderModel;
