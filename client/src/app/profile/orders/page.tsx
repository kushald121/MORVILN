'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import { useToast } from '@/app/contexts/ToastContext';
import { apiClient } from '@/lib/api';
import { 
  Package, Clock, CheckCircle, Truck, XCircle, 
  ArrowLeft, ShoppingBag, MapPin, Calendar,
  ChevronDown, ChevronUp, Eye
} from 'lucide-react';
import Image from 'next/image';

interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  total: number;
  size?: string;
  color?: string;
}

interface ShippingAddress {
  full_name: string;
  phone: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
}

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  shipping_address: ShippingAddress;
  products: OrderItem[];
  subtotal_amount: number;
  shipping_amount: number;
  tax_amount: number;
  total_amount: number;
  payment_status: string;
  fulfillment_status: string;
  payment_method: string;
  ordered_at: string;
  created_at: string;
}

const OrdersPage = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const toast = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);

  useEffect(() => {
    const hasToken = typeof window !== 'undefined' && localStorage.getItem('userToken');
    
    if (!hasToken && !isAuthenticated) {
      toast.warning('Please login to view your orders');
      router.push('/login');
      return;
    }

    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/orders/user/me');
      
      if (response.data.success) {
        setOrders(response.data.data || []);
      }
    } catch (error: any) {
      console.error('Error loading orders:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        router.push('/login');
      } else {
        toast.error('Failed to load orders');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId: string, orderNumber: string) => {
    if (!confirm(`Are you sure you want to cancel order #${orderNumber}? This action cannot be undone.`)) {
      return;
    }

    try {
      setCancellingOrderId(orderId);
      const response = await apiClient.put(`/orders/${orderId}/cancel`);
      
      if (response.data.success) {
        toast.success(`Order #${orderNumber} has been cancelled`);
        // Update the order in the local state
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.id === orderId 
              ? { ...order, payment_status: 'cancelled' }
              : order
          )
        );
      } else {
        throw new Error(response.data.message || 'Failed to cancel order');
      }
    } catch (error: any) {
      console.error('Error cancelling order:', error);
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancellingOrderId(null);
    }
  };

  const canCancelOrder = (order: Order) => {
    // Can cancel if payment is pending or paid but not yet fulfilled/shipped
    const cancelablePaymentStatuses = ['pending', 'paid'];
    const cancelableFulfillmentStatuses = ['unfulfilled', 'pending'];
    
    return (
      cancelablePaymentStatuses.includes(order.payment_status.toLowerCase()) &&
      cancelableFulfillmentStatuses.includes(order.fulfillment_status.toLowerCase()) &&
      order.payment_status.toLowerCase() !== 'cancelled'
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
      case 'fulfilled':
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
      case 'unfulfilled':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'shipped':
      case 'in_transit':
        return <Truck className="w-5 h-5 text-blue-500" />;
      case 'cancelled':
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
      case 'fulfilled':
      case 'delivered':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending':
      case 'unfulfilled':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'shipped':
      case 'in_transit':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'cancelled':
      case 'failed':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const toggleOrderExpand = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-gray-700 border-t-white rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400 font-medium">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-8 pt-24">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.push('/profile')}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Profile</span>
        </motion.button>

        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            My Orders
          </h1>
          <div className="w-24 h-1 bg-white mx-auto mb-4"></div>
          <p className="text-gray-400">
            Track and manage your orders
          </p>
        </motion.div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center"
          >
            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No orders yet</h3>
            <p className="text-gray-400 mb-6">Start shopping to see your orders here</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/allproducts')}
              className="bg-white text-black px-8 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              Start Shopping
            </motion.button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {orders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden"
                >
                  {/* Order Header */}
                  <div 
                    className="p-6 cursor-pointer hover:bg-gray-800/50 transition-colors"
                    onClick={() => toggleOrderExpand(order.id)}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Package className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white text-lg">
                            Order #{order.order_number}
                          </h3>
                          <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(order.ordered_at || order.created_at)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-white font-bold text-lg">
                            ₹{Number(order.total_amount).toFixed(2)}
                          </p>
                          <p className="text-gray-500 text-sm">
                            {order.products?.length || 0} items
                          </p>
                        </div>

                        <div className="flex flex-col gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.payment_status)}`}>
                            {order.payment_status}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.fulfillment_status)}`}>
                            {order.fulfillment_status}
                          </span>
                        </div>

                        <div className="text-gray-400">
                          {expandedOrder === order.id ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Order Details */}
                  <AnimatePresence>
                    {expandedOrder === order.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-gray-800 p-6 space-y-6">
                          {/* Order Items */}
                          <div>
                            <h4 className="font-medium text-white mb-4 flex items-center gap-2">
                              <ShoppingBag className="w-4 h-4 text-gray-400" />
                              Order Items
                            </h4>
                            <div className="space-y-3">
                              {order.products?.map((item, idx) => (
                                <div 
                                  key={idx}
                                  className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl"
                                >
                                  <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                                      <Package className="w-6 h-6 text-gray-400" />
                                    </div>
                                    <div>
                                      <p className="font-medium text-white">{item.product_name}</p>
                                      <div className="flex items-center gap-2 text-sm text-gray-400">
                                        <span>Qty: {item.quantity}</span>
                                        {item.size && <span>• Size: {item.size}</span>}
                                        {item.color && <span>• Color: {item.color}</span>}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-medium text-white">₹{Number(item.total).toFixed(2)}</p>
                                    <p className="text-sm text-gray-500">₹{Number(item.price).toFixed(2)} each</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Shipping Address */}
                          <div>
                            <h4 className="font-medium text-white mb-4 flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              Shipping Address
                            </h4>
                            <div className="p-4 bg-gray-800/50 rounded-xl">
                              <p className="font-medium text-white">{order.shipping_address?.full_name}</p>
                              <p className="text-gray-400 text-sm mt-1">{order.shipping_address?.phone}</p>
                              <p className="text-gray-400 text-sm mt-2">
                                {order.shipping_address?.address_line_1}
                                {order.shipping_address?.address_line_2 && `, ${order.shipping_address.address_line_2}`}
                                <br />
                                {order.shipping_address?.city}, {order.shipping_address?.state} - {order.shipping_address?.postal_code}
                              </p>
                            </div>
                          </div>

                          {/* Order Summary */}
                          <div>
                            <h4 className="font-medium text-white mb-4">Order Summary</h4>
                            <div className="p-4 bg-gray-800/50 rounded-xl space-y-2">
                              <div className="flex justify-between text-gray-400">
                                <span>Subtotal</span>
                                <span className="text-white">₹{Number(order.subtotal_amount).toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between text-gray-400">
                                <span>Shipping</span>
                                <span className={order.shipping_amount === 0 ? 'text-green-500' : 'text-white'}>
                                  {order.shipping_amount === 0 ? 'FREE' : `₹${Number(order.shipping_amount).toFixed(2)}`}
                                </span>
                              </div>
                              {order.tax_amount > 0 && (
                                <div className="flex justify-between text-gray-400">
                                  <span>Tax</span>
                                  <span className="text-white">₹{Number(order.tax_amount).toFixed(2)}</span>
                                </div>
                              )}
                              <div className="border-t border-gray-700 pt-2 mt-2">
                                <div className="flex justify-between text-white font-bold">
                                  <span>Total</span>
                                  <span>₹{Number(order.total_amount).toFixed(2)}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Cancel Order Button */}
                          {canCancelOrder(order) && (
                            <div className="pt-4 border-t border-gray-800">
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCancelOrder(order.id, order.order_number);
                                }}
                                disabled={cancellingOrderId === order.id}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl hover:bg-red-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {cancellingOrderId === order.id ? (
                                  <>
                                    <div className="animate-spin w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full"></div>
                                    <span>Cancelling...</span>
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="w-5 h-5" />
                                    <span>Cancel Order</span>
                                  </>
                                )}
                              </motion.button>
                            </div>
                          )}

                          {/* Already Cancelled Notice */}
                          {order.payment_status.toLowerCase() === 'cancelled' && (
                            <div className="pt-4 border-t border-gray-800">
                              <div className="flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl">
                                <XCircle className="w-5 h-5" />
                                <span>This order has been cancelled</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
