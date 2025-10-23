'use client';

import React, { useEffect, useRef } from 'react';
import { AdminProtectedRoute } from '../components/AdminProtectedRoute';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import gsap from 'gsap';

const AdminDashboard = () => {
  const router = useRouter();
  const dashboardRef = useRef(null);

  useEffect(() => {
    if (dashboardRef.current) {
      gsap.from(dashboardRef.current, { opacity: 0, y: 50, duration: 1 });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminRedirectPath');
    router.push('/admin/login');
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <AdminProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-orange-500 via-rose-500 to-indigo-600 bg-clip-text text-transparent">
                MORVILN ADMIN
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition duration-300 transform hover:scale-105"
              >
                Logout
              </button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div ref={dashboardRef} className="max-w-7xl mx-auto p-6">
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Manage your e-commerce store</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Add Product Card */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Link href="/admin/add-product" className="block bg-white rounded-xl shadow-md p-6 hover:scale-105 transform transition duration-300 cursor-pointer h-full">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-semibold mb-2">Add Product</h2>
                  <p className="text-gray-600">Add new products to your store</p>
                </div>
              </Link>
            </motion.div>

            {/* Update Product Card */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link href="/admin/update-product" className="block bg-white rounded-xl shadow-md p-6 hover:scale-105 transform transition duration-300 cursor-pointer h-full">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-semibold mb-2">Update Product</h2>
                  <p className="text-gray-600">Update product details and pricing</p>
                </div>
              </Link>
            </motion.div>

            {/* Delete Product Card */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link href="/admin/delete-product" className="block bg-white rounded-xl shadow-md p-6 hover:scale-105 transform transition duration-300 cursor-pointer h-full">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-semibold mb-2">Delete Product</h2>
                  <p className="text-gray-600">Remove products from catalog</p>
                </div>
              </Link>
            </motion.div>

            {/* View Orders Card */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link href="/admin/view-orders" className="block bg-white rounded-xl shadow-md p-6 hover:scale-105 transform transition duration-300 cursor-pointer h-full">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-semibold mb-2">View Orders</h2>
                  <p className="text-gray-600">See all received orders and status</p>
                </div>
              </Link>
            </motion.div>
          </div>

          {/* Statistics Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Products</h3>
              <p className="text-4xl font-bold text-indigo-600">-</p>
              <p className="text-sm text-gray-500 mt-2">Across all categories</p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Orders</h3>
              <p className="text-4xl font-bold text-green-600">-</p>
              <p className="text-sm text-gray-500 mt-2">Lifetime orders</p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Revenue</h3>
              <p className="text-4xl font-bold text-purple-600">₹-</p>
              <p className="text-sm text-gray-500 mt-2">Total earnings</p>
            </div>
          </motion.div>
        </div>
      </div>
    </AdminProtectedRoute>
  );
};

export default AdminDashboard;
