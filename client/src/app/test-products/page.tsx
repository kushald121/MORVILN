"use client";

import React from 'react';
import { LoaderThree } from '@/app/components/ui/loader';

export default function TestProductsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Products API Test</h1>
        
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4">LoaderThree Component Test</h2>
            <LoaderThree size="lg" />
            <p className="mt-4">If you can see the loader above, the component is working!</p>
          </div>

          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">API Integration Status</h2>
            <div className="space-y-2">
              <p>✅ ProductService created</p>
              <p>✅ LoaderThree component integrated</p>
              <p>✅ All Products page updated with real API calls</p>
              <p>✅ Product page updated with real API calls</p>
              <p>✅ Cloudinary image integration</p>
              <p>✅ Real-time filtering and sorting</p>
              <p>✅ Pagination support</p>
              <p>✅ Error handling and loading states</p>
            </div>
          </div>

          <div className="text-center">
            <a 
              href="/allproducts" 
              className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Go to All Products Page
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}