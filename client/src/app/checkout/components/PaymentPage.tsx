'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/app/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { CreditCard, Lock, ShieldCheck, MapPin, Package, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { type Address } from '@/app/services/address.service';
import { apiClient } from '@/lib/api';
import Script from 'next/script';

interface CartItem {
  id: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  itemTotal: number;
  size?: string;
  color?: string;
}

interface CheckoutData {
  items: CartItem[];
  summary: {
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
  };
  address: Address;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const PaymentPage = () => {
  const { user } = useAuth();
  const router = useRouter();

  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    // Get checkout data from localStorage
    const storedData = localStorage.getItem('checkoutData');
    if (storedData) {
      setCheckoutData(JSON.parse(storedData));
    } else {
      setError('No checkout data found');
      setTimeout(() => router.push('/checkout/address'), 2000);
    }
  }, [user, router]);

  const handleRazorpayLoad = () => {
    setRazorpayLoaded(true);
  };

  const createRazorpayOrder = async () => {
    if (!checkoutData) return null;

    try {
      const response = await apiClient.post('/payment/create-order', {
        amount: Math.round(checkoutData.summary.total * 100), // Amount in paise
        currency: 'INR',
        receipt: `order_${Date.now()}`,
        notes: {
          user_id: user?.id,
          user_email: user?.email,
        },
      });

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to create order');
      }
    } catch (error: any) {
      console.error('Error creating Razorpay order:', error);
      throw error;
    }
  };

  const createDatabaseOrder = async (paymentDetails: any) => {
    if (!checkoutData) return null;

    try {
      // Prepare order items
      const orderItems = checkoutData.items.map((item) => ({
        product_id: item.productId,
        quantity: item.quantity,
        price: item.price,
        name: item.name,
        image: item.image,
        size: item.size,
        color: item.color,
      }));

      const response = await apiClient.post('/orders', {
        items: orderItems,
        shippingAddress: {
          fullName: checkoutData.address.full_name,
          phone: checkoutData.address.phone,
          addressLine1: checkoutData.address.address_line_1,
          addressLine2: checkoutData.address.address_line_2,
          landmark: checkoutData.address.landmark,
          city: checkoutData.address.city,
          state: checkoutData.address.state,
          postalCode: checkoutData.address.postal_code,
          country: checkoutData.address.country,
        },
        paymentMethod: 'razorpay',
        paymentDetails: {
          razorpay_order_id: paymentDetails.razorpay_order_id,
          razorpay_payment_id: paymentDetails.razorpay_payment_id,
          razorpay_signature: paymentDetails.razorpay_signature,
        },
        subtotal: checkoutData.summary.subtotal,
        shippingCost: checkoutData.summary.shipping,
        tax: checkoutData.summary.tax,
        total: checkoutData.summary.total,
      });

      if (response.data.success) {
        return response.data.order;
      } else {
        throw new Error(response.data.message || 'Failed to create order');
      }
    } catch (error: any) {
      console.error('Error creating database order:', error);
      throw error;
    }
  };

  const verifyPayment = async (paymentDetails: any) => {
    try {
      const response = await apiClient.post('/payment/verify', paymentDetails);

      if (response.data.success) {
        return true;
      } else {
        throw new Error('Payment verification failed');
      }
    } catch (error: any) {
      console.error('Error verifying payment:', error);
      throw error;
    }
  };

  const handlePayment = async () => {
    if (!checkoutData || !razorpayLoaded) {
      setError('Payment system not ready. Please try again.');
      return;
    }

    setProcessingPayment(true);
    setError('');

    try {
      // Step 1: Create Razorpay order
      const razorpayOrder = await createRazorpayOrder();

      if (!razorpayOrder) {
        throw new Error('Failed to create payment order');
      }

      // Step 2: Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'MORVILN',
        description: 'Order Payment',
        order_id: razorpayOrder.id,
        prefill: {
          name: checkoutData.address.full_name,
          email: user?.email || '',
          contact: checkoutData.address.phone,
        },
        theme: {
          color: '#334155', // slate-700
        },
        handler: async function (response: any) {
          try {
            // Step 3: Verify payment
            const isVerified = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (!isVerified) {
              throw new Error('Payment verification failed');
            }

            // Step 4: Create order in database
            const order = await createDatabaseOrder(response);

            // Step 5: Clear cart and checkout data
            localStorage.removeItem('checkoutData');
            localStorage.removeItem('selectedAddress');

            // Step 6: Save order data for confirmation page
            localStorage.setItem('lastOrderData', JSON.stringify({
              orderId: order.id,
              orderNumber: order.order_number,
              amount: checkoutData.summary.total,
              paymentId: response.razorpay_payment_id,
              items: checkoutData.items,
              address: checkoutData.address,
              createdAt: new Date().toISOString(),
            }));

            // Step 7: Redirect to confirmation page
            router.push(`/checkout/confirmation?orderId=${order.id}`);
          } catch (error: any) {
            console.error('Payment processing error:', error);
            setError(error.message || 'Payment processing failed. Please contact support.');
            setProcessingPayment(false);
          }
        },
        modal: {
          ondismiss: function () {
            setProcessingPayment(false);
            setError('Payment cancelled');
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      console.error('Payment initialization error:', error);
      setError(error.response?.data?.message || error.message || 'Failed to initialize payment');
      setProcessingPayment(false);
    }
  };

  if (!checkoutData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-slate-200 border-t-slate-700 rounded-full mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading payment details...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Load Razorpay Script */}
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={handleRazorpayLoad}
        onError={() => setError('Failed to load payment gateway')}
      />

      <motion.div
        className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-5xl font-light text-slate-800 mb-4 tracking-wide">
              Complete Payment
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-slate-400 to-blue-500 mx-auto mb-4 rounded-full"></div>
            <p className="text-slate-600 text-lg font-light">
              Secure payment powered by Razorpay
            </p>
          </motion.div>

          {/* Back Button */}
          <motion.button
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-slate-600 hover:text-slate-800 mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Order Summary</span>
          </motion.button>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl flex items-center space-x-3"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Payment Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Payment Method */}
              <motion.div
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 p-8"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h2 className="text-2xl font-light text-slate-800 mb-6 flex items-center">
                  <CreditCard className="w-6 h-6 mr-3 text-slate-600" />
                  Payment Method
                </h2>

                <div className="space-y-4">
                  {/* Razorpay Payment Option */}
                  <div className="border-2 border-blue-500 bg-blue-50/50 rounded-xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                          <CreditCard className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-medium text-slate-800">Razorpay</h3>
                          <p className="text-sm text-slate-600">Cards, UPI, Netbanking & More</p>
                        </div>
                      </div>
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-slate-700 border border-slate-200">
                        💳 Credit/Debit Cards
                      </span>
                      <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-slate-700 border border-slate-200">
                        📱 UPI
                      </span>
                      <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-slate-700 border border-slate-200">
                        🏦 Netbanking
                      </span>
                      <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-slate-700 border border-slate-200">
                        💰 Wallets
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 text-sm text-slate-600">
                      <Lock className="w-4 h-4" />
                      <span>Secure payment with 256-bit SSL encryption</span>
                    </div>
                  </div>
                </div>

                {/* Security Features */}
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex items-start space-x-3">
                    <ShieldCheck className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-900 mb-1">100% Secure Payment</h4>
                      <p className="text-sm text-green-700">
                        Your payment information is encrypted and secure. We never store your card details.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Delivery Address Review */}
              <motion.div
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 p-8"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h2 className="text-2xl font-light text-slate-800 mb-6 flex items-center">
                  <MapPin className="w-6 h-6 mr-3 text-slate-600" />
                  Delivery Address
                </h2>

                <div className="bg-slate-50 rounded-xl p-6">
                  <p className="font-medium text-slate-800 mb-2">{checkoutData.address.full_name}</p>
                  <p className="text-slate-600 mb-1">{checkoutData.address.phone}</p>
                  <p className="text-slate-700 leading-relaxed">
                    {checkoutData.address.address_line_1}
                    {checkoutData.address.address_line_2 && `, ${checkoutData.address.address_line_2}`}
                    {checkoutData.address.landmark && `, ${checkoutData.address.landmark}`}
                    <br />
                    {checkoutData.address.city}, {checkoutData.address.state} - {checkoutData.address.postal_code}
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 p-6 sticky top-24"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h3 className="font-medium text-slate-800 text-lg mb-6 flex items-center">
                  <Package className="w-5 h-5 mr-2 text-slate-600" />
                  Order Summary
                </h3>

                {/* Order Items */}
                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {checkoutData.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">{item.name}</p>
                        <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium text-slate-800">₹{item.itemTotal}</p>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="border-t border-slate-200 pt-4 space-y-3">
                  <div className="flex justify-between text-slate-700">
                    <span>Subtotal</span>
                    <span className="font-medium">₹{checkoutData.summary.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span>Shipping</span>
                    <span className={`font-medium ${checkoutData.summary.shipping === 0 ? 'text-green-600' : ''}`}>
                      {checkoutData.summary.shipping === 0 ? 'FREE' : `₹${checkoutData.summary.shipping}`}
                    </span>
                  </div>
                  {checkoutData.summary.tax > 0 && (
                    <div className="flex justify-between text-slate-700">
                      <span>Tax</span>
                      <span className="font-medium">₹{checkoutData.summary.tax}</span>
                    </div>
                  )}
                  <div className="border-t border-slate-200 pt-3">
                    <div className="flex justify-between text-slate-800 text-xl font-semibold">
                      <span>Total</span>
                      <span>₹{checkoutData.summary.total}</span>
                    </div>
                  </div>
                </div>

                {/* Pay Now Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePayment}
                  disabled={processingPayment || !razorpayLoaded}
                  className="w-full mt-8 bg-gradient-to-r from-slate-700 to-slate-800 text-white py-4 rounded-xl font-medium hover:from-slate-800 hover:to-slate-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {processingPayment ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>Processing...</span>
                    </div>
                  ) : !razorpayLoaded ? (
                    <span>Loading Payment Gateway...</span>
                  ) : (
                    <div className="flex items-center justify-center space-x-3">
                      <Lock className="w-5 h-5" />
                      <span>Pay ₹{checkoutData.summary.total}</span>
                    </div>
                  )}
                </motion.button>

                {/* Trust Badges */}
                <div className="mt-6 flex items-center justify-center space-x-4 text-xs text-slate-500">
                  <div className="flex items-center space-x-1">
                    <Lock className="w-3 h-3" />
                    <span>Secure</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>SSL Encrypted</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Terms and Conditions */}
          <motion.div
            className="mt-8 text-center text-sm text-slate-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            By completing this purchase, you agree to our{' '}
            <a href="/terms" className="text-slate-700 hover:underline">
              Terms & Conditions
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-slate-700 hover:underline">
              Privacy Policy
            </a>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default PaymentPage;
