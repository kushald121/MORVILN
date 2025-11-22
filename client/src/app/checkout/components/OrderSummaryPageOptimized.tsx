'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { useRouter } from 'next/navigation';
import { Trash2, Plus, Minus, MapPin, User, Phone, ShoppingBag } from 'lucide-react';
import { type Address } from '../../services/address.service';
import { apiClient } from '@/lib/api';

interface CartItem {
  id: string;
  productId: string;
  name: string;
  category?: string;
  image: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  itemTotal: number;
  size?: string;
  color?: string;
}

const OrderSummaryPageOptimized = () => {
  const { user, isAuthenticated, getAuthHeaders, getCurrentSessionId, getSessionType } = useAuth();
  const toast = useToast();
  const router = useRouter();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(false);
  const [orderSummary, setOrderSummary] = useState({
    subtotal: 0,
    shipping: 0,
    tax: 0,
    total: 0,
  });

  useEffect(() => {
    // Check authentication
    const hasToken = typeof window !== 'undefined' && localStorage.getItem('userToken');
    
    if (!hasToken && !isAuthenticated) {
      router.push('/login');
      return;
    }

    // Get selected address from localStorage
    const storedAddress = localStorage.getItem('selectedAddress');
    if (storedAddress) {
      try {
        setSelectedAddress(JSON.parse(storedAddress));
      } catch (e) {
        console.error('Failed to parse stored address');
        router.push('/checkout/address');
        return;
      }
    } else {
      router.push('/checkout/address');
      return;
    }

    fetchCartItems();
  }, [isAuthenticated, router]);

  const fetchCartItems = async () => {
    try {
      setLoading(true);

      const sessionId = getCurrentSessionId?.();
      const sessionType = getSessionType?.();

      let response;
      if (sessionType === 'user') {
        response = await apiClient.get(`/cart/${sessionId}`);
      } else {
        response = await apiClient.get(`/guest-cart/${sessionId}`);
      }

      if (response.data.success) {
        const items = response.data.cart.items || [];
        setCartItems(items);
        calculateOrderSummary(items);
      } else {
        toast.error(response.data.message || 'Failed to load cart items');
      }
    } catch (error: any) {
      console.error('Error fetching cart:', error);
      toast.error(error.response?.data?.message || 'Failed to load cart items');
    } finally {
      setLoading(false);
    }
  };

  const calculateOrderSummary = (items: CartItem[]) => {
    const subtotal = items.reduce((sum, item) => sum + (item.itemTotal || item.price * item.quantity), 0);
    const shipping = subtotal >= 500 ? 0 : 50; // Free shipping above ₹500
    const tax = 0; // Add tax calculation if needed
    const total = subtotal + shipping + tax;

    setOrderSummary({
      subtotal: Math.round(subtotal * 100) / 100,
      shipping,
      tax,
      total: Math.round(total * 100) / 100,
    });
  };

  const updateQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(productId);
      return;
    }

    try {
      const sessionId = getCurrentSessionId?.();
      const sessionType = getSessionType?.();

      if (sessionType === 'user') {
        await apiClient.put('/cart', {
          userId: sessionId,
          productId,
          quantity: newQuantity,
        });
      } else {
        await apiClient.put('/guest-cart/update', {
          sessionId,
          productId,
          quantity: newQuantity,
        });
      }

      fetchCartItems();
    } catch (error: any) {
      console.error('Error updating quantity:', error);
      toast.error(error.response?.data?.message || 'Failed to update quantity');
    }
  };

  const removeItem = async (productId: string) => {
    try {
      const sessionId = getCurrentSessionId?.();
      const sessionType = getSessionType?.();

      if (sessionType === 'user') {
        await apiClient.delete(`/cart/${productId}`, {
          data: { userId: sessionId },
        });
      } else {
        await apiClient.delete('/guest-cart/remove', {
          data: { sessionId, productId },
        });
      }

      fetchCartItems();
    } catch (error: any) {
      console.error('Error removing item:', error);
      toast.error(error.response?.data?.message || 'Failed to remove item');
    }
  };

  const handleProceedToPayment = () => {
    if (cartItems.length === 0) {
      toast.warning('Your cart is empty');
      return;
    }

    if (!selectedAddress) {
      toast.warning('Please select a delivery address');
      return;
    }

    // Navigate to payment with order data
    const orderData = {
      items: cartItems,
      summary: orderSummary,
      address: selectedAddress,
    };

    localStorage.setItem('checkoutData', JSON.stringify(orderData));
    router.push('/checkout/payment');
  };

  const handleChangeAddress = () => {
    router.push('/checkout/address');
  };

  if (!user) {
    return (
      <motion.div
        className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-12 flex items-center justify-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-8 h-8 text-slate-600" />
            </div>
            <h2 className="text-3xl font-light text-slate-800 mb-4">Please Login</h2>
            <p className="text-slate-600 mb-8 text-lg font-light">
              You need to be logged in to view your order summary.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/login')}
              className="bg-gradient-to-r from-slate-700 to-slate-800 text-white px-8 py-4 rounded-xl font-medium hover:from-slate-800 hover:to-slate-900 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Login / Sign Up
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-12"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-4xl md:text-5xl font-light text-slate-800 mb-4 tracking-wide">
            Order Summary
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-slate-400 to-blue-500 mx-auto mb-4 rounded-full"></div>
          <p className="text-slate-600 text-lg font-light max-w-2xl mx-auto">
            Review your order before proceeding to payment
          </p>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Order Items */}
          <div className="xl:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-light text-slate-800">
                Order Items ({cartItems.length})
              </h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/allproducts')}
                className="text-slate-600 hover:text-slate-800 font-medium text-sm bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg transition-all duration-200"
              >
                Continue Shopping
              </motion.button>
            </div>

            <AnimatePresence>
              {cartItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start space-x-6">
                    <div className="relative">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-xl shadow-md"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-slate-800 text-lg">{item.name}</h3>
                          {item.category && (
                            <p className="text-slate-600 mt-1">{item.category}</p>
                          )}
                          {item.size && item.color && (
                            <p className="text-sm text-slate-500 mt-1">
                              Size: {item.size} | Color: {item.color}
                            </p>
                          )}
                          {item.originalPrice && item.originalPrice > item.price && (
                            <p className="text-sm text-slate-500 line-through mt-1">
                              ₹{item.originalPrice}
                            </p>
                          )}
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => removeItem(item.productId)}
                          className="text-red-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-3 bg-slate-50 rounded-lg border border-slate-200 px-3 py-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="text-slate-600 hover:text-slate-800 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </motion.button>
                          <span className="font-medium text-slate-800 min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="text-slate-600 hover:text-slate-800 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </motion.button>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-slate-800 text-lg">
                            ₹{item.itemTotal || item.price * item.quantity}
                          </p>
                          <p className="text-sm text-slate-500">₹{item.price} each</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {cartItems.length === 0 && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 text-center border border-slate-200"
              >
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-500 text-lg font-light mb-4">Your cart is empty</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/allproducts')}
                  className="bg-gradient-to-r from-slate-700 to-slate-800 text-white px-8 py-4 rounded-xl font-medium hover:from-slate-800 hover:to-slate-900 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Start Shopping
                </motion.button>
              </motion.div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="space-y-6">
            {/* Delivery Address */}
            {selectedAddress && (
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-slate-600 to-blue-600 rounded-full flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="font-medium text-slate-800 text-lg">Delivery Address</h3>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleChangeAddress}
                    className="text-slate-600 hover:text-slate-800 text-sm font-medium bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-lg transition-all duration-200"
                  >
                    Change
                  </motion.button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center text-slate-700">
                    <User className="w-4 h-4 mr-3 text-slate-500" />
                    <span className="font-medium">{selectedAddress.full_name}</span>
                  </div>
                  <div className="flex items-center text-slate-700">
                    <Phone className="w-4 h-4 mr-3 text-slate-500" />
                    <span>{selectedAddress.phone}</span>
                  </div>
                  <div className="flex items-start text-slate-700">
                    <MapPin className="w-4 h-4 mr-3 mt-0.5 text-slate-500 flex-shrink-0" />
                    <span className="leading-relaxed">
                      {selectedAddress.address_line_1}
                      {selectedAddress.address_line_2 && `, ${selectedAddress.address_line_2}`}
                      {selectedAddress.landmark && `, ${selectedAddress.landmark}`}
                      <br />
                      {selectedAddress.city}, {selectedAddress.state} -{' '}
                      <strong>{selectedAddress.postal_code}</strong>
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Price Breakdown */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 sticky top-24"
            >
              <h3 className="font-medium text-slate-800 text-lg mb-6">Price Details</h3>
              <div className="space-y-4">
                <div className="flex justify-between text-slate-700">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span className="font-medium">₹{orderSummary.subtotal}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Shipping</span>
                  <span
                    className={`font-medium ${
                      orderSummary.shipping === 0 ? 'text-green-600' : 'text-slate-700'
                    }`}
                  >
                    {orderSummary.shipping === 0 ? 'FREE' : `₹${orderSummary.shipping}`}
                  </span>
                </div>
                {orderSummary.tax > 0 && (
                  <div className="flex justify-between text-slate-700">
                    <span>Tax</span>
                    <span className="font-medium">₹{orderSummary.tax}</span>
                  </div>
                )}
                <div className="border-t border-slate-200 pt-4">
                  <div className="flex justify-between text-slate-800 text-xl font-semibold">
                    <span>Total</span>
                    <span>₹{orderSummary.total}</span>
                  </div>
                </div>
              </div>

              {orderSummary.subtotal < 500 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl"
                >
                  <p className="text-sm text-amber-800 font-medium">
                    Add ₹{500 - orderSummary.subtotal} more to get FREE shipping!
                  </p>
                </motion.div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleProceedToPayment}
                disabled={cartItems.length === 0 || loading}
                className="w-full mt-8 bg-gradient-to-r from-slate-700 to-slate-800 text-white py-4 rounded-xl font-medium hover:from-slate-800 hover:to-slate-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-3">
                    <span>Proceed to Payment</span>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </div>
                )}
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <div className="animate-spin w-12 h-12 border-4 border-slate-200 border-t-slate-700 rounded-full mx-auto"></div>
            <p className="mt-4 text-slate-700 font-medium">Loading...</p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default OrderSummaryPageOptimized;
