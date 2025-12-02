'use client';

import React from 'react';
import { AdminProtectedRoute } from '../components/AdminProtectedRoute';
import HeroImageManager from '../components/HeroImageManager';
import Link from 'next/link';

const ManageHeroPage = () => {
  return (
    <AdminProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/admin/dashboard" className="text-xl font-bold text-gray-800 hover:text-gray-600">
                ← Back to Dashboard
              </Link>
              <a href="/" className="text-sm text-gray-600 hover:text-gray-900">
                View Store
              </a>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto p-6">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Manage Hero Banners</h1>
            <p className="text-gray-600">Add, edit, and delete hero banners for your homepage</p>
          </div>

          <HeroImageManager />
        </div>
      </div>
    </AdminProtectedRoute>
  );
};

export default ManageHeroPage;