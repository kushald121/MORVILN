'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, Package, Truck, MapPin, Mail, Phone, Calendar, ArrowRight, Download } from 'lucide-react';
import { type Address } from '@/app/services/address.service';

interface OrderDetails {
  orderId: string;
  orderNumber: string;
  amount: number;
  paymentId: string;
  items: any[];
  address: Address;
  createdAt: string;
}

const OrderConfirmationPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get order details from localStorage or URL params
    const orderId = searchParams.get('orderId');
    const storedOrderData = localStorage.getItem('lastOrderData');

    if (storedOrderData) {
      setOrderDetails(JSON.parse(storedOrderData));
      setLoading(false);
    } else if (orderId) {
      // Fetch order details from API
      fetchOrderDetails(orderId);
    } else {
      router.push('/');
    }
  }, [searchParams, router]);

  const fetchOrderDetails = async (orderId: string) => {
    // Implement API call to fetch order details
    setLoading(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-slate-200 border-t-slate-700 rounded-full mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 text-lg mb-4">Order not found</p>
          <button
            onClick={() => router.push('/')}
            className="bg-slate-700 text-white px-6 py-3 rounded-xl hover:bg-slate-800 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-12"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-4xl mx-auto px-4">
        {/* Success Header */}
        <motion.div
          className="text-center mb-12"
          variants={itemVariants}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.2 }}
            className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl"
          >
            <CheckCircle className="w-14 h-14 text-white" strokeWidth={2.5} />
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl font-light text-slate-800 mb-4">
            Order Placed Successfully!
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-green-400 to-green-600 mx-auto mb-6 rounded-full"></div>
          
          <p className="text-slate-600 text-lg mb-2">
            Thank you for your purchase!
          </p>
          <p className="text-slate-500">
            Your order has been confirmed and will be shipped soon.
          </p>
        </motion.div>

        {/* Order Details Card */}
        <motion.div
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 overflow-hidden mb-8"
          variants={itemVariants}
        >
          {/* Order Number */}
          <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-8 py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-slate-300 text-sm mb-1">Order Number</p>
                <p className="text-white text-2xl font-semibold tracking-wide">
                  #{orderDetails.orderNumber}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-slate-300 text-sm mb-1">Total Amount</p>
                  <p className="text-white text-2xl font-semibold">
                    ₹{orderDetails.amount.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Status Timeline */}
          <div className="px-8 py-8 border-b border-slate-200">
            <h3 className="text-lg font-medium text-slate-800 mb-6 flex items-center">
              <Package className="w-5 h-5 mr-2 text-slate-600" />
              Order Status
            </h3>
            <div className="relative">
              <div className="flex items-center justify-between">
                {/* Step 1 - Confirmed */}
                <div className="flex flex-col items-center flex-1">
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center mb-2 shadow-lg">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-xs font-medium text-slate-700">Confirmed</p>
                </div>

                <div className="flex-1 h-1 bg-gradient-to-r from-green-500 to-slate-200 mx-2"></div>

                {/* Step 2 - Processing */}
                <div className="flex flex-col items-center flex-1">
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center mb-2">
                    <Package className="w-6 h-6 text-slate-400" />
                  </div>
                  <p className="text-xs font-medium text-slate-500">Processing</p>
                </div>

                <div className="flex-1 h-1 bg-slate-200 mx-2"></div>

                {/* Step 3 - Shipped */}
                <div className="flex flex-col items-center flex-1">
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center mb-2">
                    <Truck className="w-6 h-6 text-slate-400" />
                  </div>
                  <p className="text-xs font-medium text-slate-500">Shipped</p>
                </div>

                <div className="flex-1 h-1 bg-slate-200 mx-2"></div>

                {/* Step 4 - Delivered */}
                <div className="flex flex-col items-center flex-1">
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center mb-2">
                    <CheckCircle className="w-6 h-6 text-slate-400" />
                  </div>
                  <p className="text-xs font-medium text-slate-500">Delivered</p>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="px-8 py-8 border-b border-slate-200">
            <h3 className="text-lg font-medium text-slate-800 mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-slate-600" />
              Delivery Address
            </h3>
            <div className="bg-slate-50 rounded-xl p-6">
              <p className="font-medium text-slate-800 mb-2">{orderDetails.address.full_name}</p>
              <p className="text-slate-600 mb-1">{orderDetails.address.phone}</p>
              <p className="text-slate-700 leading-relaxed">
                {orderDetails.address.address_line_1}
                {orderDetails.address.address_line_2 && `, ${orderDetails.address.address_line_2}`}
                {orderDetails.address.landmark && `, ${orderDetails.address.landmark}`}
                <br />
                {orderDetails.address.city}, {orderDetails.address.state} - {orderDetails.address.postal_code}
              </p>
            </div>
          </div>

          {/* Payment Details */}
          <div className="px-8 py-8">
            <h3 className="text-lg font-medium text-slate-800 mb-4">Payment Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Payment Status</p>
                  <p className="font-medium text-green-600">Paid</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Payment ID</p>
                  <p className="font-medium text-slate-700 text-sm">{orderDetails.paymentId}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 mb-8"
          variants={itemVariants}
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/profile/orders')}
            className="flex-1 bg-gradient-to-r from-slate-700 to-slate-800 text-white py-4 rounded-xl font-medium hover:from-slate-800 hover:to-slate-900 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
          >
            <Package className="w-5 h-5" />
            <span>Track Order</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.print()}
            className="flex-1 border-2 border-slate-300 text-slate-700 py-4 rounded-xl font-medium hover:bg-slate-50 transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <Download className="w-5 h-5" />
            <span>Download Invoice</span>
          </motion.button>
        </motion.div>

        {/* Continue Shopping */}
        <motion.div
          className="text-center"
          variants={itemVariants}
        >
          <motion.button
            whileHover={{ scale: 1.02, x: 5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/allproducts')}
            className="inline-flex items-center space-x-2 text-slate-600 hover:text-slate-800 font-medium transition-colors group"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>

        {/* Email Confirmation Notice */}
        <motion.div
          className="mt-12 bg-blue-50 border border-blue-200 rounded-xl p-6"
          variants={itemVariants}
        >
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-slate-800 mb-1">Confirmation Email Sent</h4>
              <p className="text-slate-600 text-sm">
                We've sent an order confirmation email with all the details. Please check your inbox and spam folder.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Support Section */}
        <motion.div
          className="mt-8 text-center"
          variants={itemVariants}
        >
          <p className="text-slate-500 text-sm mb-2">Need help with your order?</p>
          <div className="flex items-center justify-center space-x-6">
            <a
              href="mailto:support@morviln.com"
              className="flex items-center space-x-2 text-slate-600 hover:text-slate-800 transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span className="text-sm">support@morviln.com</span>
            </a>
            <a
              href="tel:+919876543210"
              className="flex items-center space-x-2 text-slate-600 hover:text-slate-800 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="text-sm">+91 98765 43210</span>
            </a>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default OrderConfirmationPage;
