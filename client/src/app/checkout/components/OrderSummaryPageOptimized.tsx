'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useCart, CartItem } from '../../contexts/CartContext';
import { useToast } from '../../contexts/ToastContext';
import { useRouter } from 'next/navigation';
import { Trash2, Plus, Minus, MapPin, User, Phone, ShoppingBag, ArrowLeft } from 'lucide-react';
import { type Address } from '../../services/address.service';
import Image from 'next/image';

const OrderSummaryPageOptimized = () => {
  const { isAuthenticated } = useAuth();
  const { state, removeFromCart, updateCartQuantity, getCartTotal, getCartItemCount } = useCart();
  const cartItems: CartItem[] = state.items;
  const toast = useToast();
  const router = useRouter();

  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(true);
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

    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Calculate order summary when cart items change
  useEffect(() => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal >= 500 ? 0 : 50; // Free shipping above ₹500
    const tax = 0; // Add tax calculation if needed
    const total = subtotal + shipping + tax;

    setOrderSummary({
      subtotal: Math.round(subtotal * 100) / 100,
      shipping,
      tax,
      total: Math.round(total * 100) / 100,
    });
  }, [cartItems]);

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(id);
      toast.success('Item removed from cart');
    } else {
      updateCartQuantity(id, newQuantity);
    }
  };

  const handleRemoveItem = (id: string) => {
    removeFromCart(id);
    toast.success('Item removed from cart');
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
      items: cartItems.map(item => ({
        id: item.id,
        productId: item.id,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
        itemTotal: item.price * item.quantity,
        size: item.size,
        color: item.color,
      })),
      summary: orderSummary,
      address: selectedAddress,
    };

    localStorage.setItem('checkoutData', JSON.stringify(orderData));
    router.push('/checkout/payment');
  };

  const handleChangeAddress = () => {
    router.push('/checkout/address');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-gray-700 border-t-white rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-black text-white py-8 pt-24"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.push('/checkout/address')}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Address</span>
        </motion.button>

        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-wide">
            Order Summary
          </h1>
          <div className="w-24 h-1 bg-white mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg">
            Review your order before proceeding to payment
          </p>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Order Items */}
          <div className="xl:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                Order Items ({getCartItemCount()})
              </h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/allproducts')}
                className="text-gray-400 hover:text-white text-sm border border-gray-700 hover:border-white px-4 py-2 rounded-lg transition-all duration-200"
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
                  transition={{ duration: 0.3 }}
                  className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-all duration-300"
                >
                  <div className="flex items-start space-x-5">
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-white text-lg truncate">{item.name}</h3>
                          {item.size && item.color && (
                            <p className="text-sm text-gray-500 mt-1">
                              Size: {item.size} | Color: {item.color}
                            </p>
                          )}
                          <p className="text-gray-400 mt-1">₹{item.price} each</p>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-500 hover:text-red-400 transition-colors p-2 hover:bg-red-500/10 rounded-lg ml-2"
                        >
                          <Trash2 className="w-5 h-5" />
                        </motion.button>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-3 bg-gray-800 rounded-lg border border-gray-700 px-3 py-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="text-gray-400 hover:text-white transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </motion.button>
                          <span className="font-medium text-white min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="text-gray-400 hover:text-white transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </motion.button>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-white text-lg">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {cartItems.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center"
              >
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="w-8 h-8 text-gray-500" />
                </div>
                <p className="text-gray-400 text-lg mb-4">Your cart is empty</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/allproducts')}
                  className="bg-white text-black px-8 py-3 rounded-lg font-medium hover:bg-gray-200 transition-all duration-300"
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
                transition={{ delay: 0.2 }}
                className="bg-gray-900 border border-gray-800 rounded-xl p-5"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-black" />
                    </div>
                    <h3 className="font-semibold text-white">Delivery Address</h3>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleChangeAddress}
                    className="text-gray-400 hover:text-white text-sm border border-gray-700 hover:border-white px-3 py-1 rounded-lg transition-all duration-200"
                  >
                    Change
                  </motion.button>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-300">
                    <User className="w-4 h-4 mr-3 text-gray-500" />
                    <span className="font-medium">{selectedAddress.full_name}</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Phone className="w-4 h-4 mr-3 text-gray-500" />
                    <span>{selectedAddress.phone}</span>
                  </div>
                  <div className="flex items-start text-gray-400">
                    <MapPin className="w-4 h-4 mr-3 mt-0.5 text-gray-500 flex-shrink-0" />
                    <span className="leading-relaxed">
                      {selectedAddress.address_line_1}
                      {selectedAddress.address_line_2 && `, ${selectedAddress.address_line_2}`}
                      {selectedAddress.landmark && `, ${selectedAddress.landmark}`}
                      <br />
                      {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.postal_code}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Price Breakdown */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-900 border border-gray-800 rounded-xl p-5 sticky top-24"
            >
              <h3 className="font-semibold text-white text-lg mb-5">Price Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal ({getCartItemCount()} items)</span>
                  <span className="text-white">₹{orderSummary.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span className={orderSummary.shipping === 0 ? 'text-green-500' : 'text-white'}>
                    {orderSummary.shipping === 0 ? 'FREE' : `₹${orderSummary.shipping}`}
                  </span>
                </div>
                {orderSummary.tax > 0 && (
                  <div className="flex justify-between text-gray-400">
                    <span>Tax</span>
                    <span className="text-white">₹{orderSummary.tax}</span>
                  </div>
                )}
                <div className="border-t border-gray-700 pt-4 mt-4">
                  <div className="flex justify-between text-white text-xl font-bold">
                    <span>Total</span>
                    <span>₹{orderSummary.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {orderSummary.subtotal > 0 && orderSummary.subtotal < 500 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-5 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg"
                >
                  <p className="text-sm text-yellow-500">
                    Add ₹{(500 - orderSummary.subtotal).toFixed(2)} more to get FREE shipping!
                  </p>
                </motion.div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleProceedToPayment}
                disabled={cartItems.length === 0}
                className="w-full mt-6 bg-white text-black py-4 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Proceed to Payment
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderSummaryPageOptimized;
