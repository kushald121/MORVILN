"use client";

import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Settings, ShoppingBag, Heart } from 'lucide-react';

const ProfilePage = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-morviln-neutral-offwhite to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            My <span className="text-transparent bg-clip-text bg-gradient-to-r from-morviln-navy-500 to-morviln-steel">Profile</span>
          </h1>
          <p className="text-gray-600">Manage your account and preferences</p>
        </motion.div>

        {/* Profile Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              {/* Profile Picture */}
              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-morviln-navy-500 to-morviln-steel rounded-full flex items-center justify-center mb-4 shadow-lg">
                  <User className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">John Doe</h2>
                <p className="text-sm text-gray-500">Member since 2025</p>
              </div>

              {/* Quick Stats */}
              <div className="space-y-4 border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between p-3 bg-morviln-neutral-offwhite rounded-lg">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-morviln-navy-500" />
                    <span className="text-sm font-medium text-gray-700">Orders</span>
                  </div>
                  <span className="font-bold text-morviln-navy-500">12</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-morviln-neutral-offwhite rounded-lg">
                  <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-morviln-navy-500" />
                    <span className="text-sm font-medium text-gray-700">Wishlist</span>
                  </div>
                  <span className="font-bold text-morviln-navy-500">8</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Account Information</h3>
                <button className="flex items-center gap-2 px-4 py-2 bg-morviln-navy-500 text-white rounded-lg hover:bg-morviln-royal transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-morviln-royal focus:ring-offset-2">
                  <Settings className="w-4 h-4" />
                  <span className="text-sm font-medium">Edit</span>
                </button>
              </div>

              {/* Profile Details */}
              <div className="space-y-6">
                {/* Full Name */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <User className="w-4 h-4 text-morviln-navy-500" />
                    Full Name
                  </label>
                  <div className="p-4 bg-morviln-neutral-offwhite rounded-lg border border-gray-200">
                    <p className="text-gray-900 font-medium">John Doe</p>
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Mail className="w-4 h-4 text-morviln-navy-500" />
                    Email Address
                  </label>
                  <div className="p-4 bg-morviln-neutral-offwhite rounded-lg border border-gray-200">
                    <p className="text-gray-900 font-medium">john.doe@example.com</p>
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Phone className="w-4 h-4 text-morviln-navy-500" />
                    Phone Number
                  </label>
                  <div className="p-4 bg-morviln-neutral-offwhite rounded-lg border border-gray-200">
                    <p className="text-gray-900 font-medium">+91 98280 96047</p>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 text-morviln-navy-500" />
                    Shipping Address
                  </label>
                  <div className="p-4 bg-morviln-neutral-offwhite rounded-lg border border-gray-200">
                    <p className="text-gray-900 font-medium">123 Fashion Street</p>
                    <p className="text-gray-600 text-sm mt-1">Mumbai, Maharashtra 400001</p>
                    <p className="text-gray-600 text-sm">India</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-4">
                <button className="flex-1 px-6 py-3 bg-gradient-to-r from-morviln-navy-500 to-morviln-royal text-white rounded-lg font-semibold hover:shadow-brand transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-morviln-royal focus:ring-offset-2">
                  Save Changes
                </button>
                <button className="flex-1 px-6 py-3 border-2 border-morviln-navy-500 text-morviln-navy-500 rounded-lg font-semibold hover:bg-morviln-navy-500 hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-morviln-royal focus:ring-offset-2">
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
