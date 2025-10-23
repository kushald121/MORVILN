'use client';

import React, { useState, useEffect } from 'react';
import { AdminProtectedRoute } from '../components/AdminProtectedRoute';
import axios from 'axios';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  gender: string;
  sizes: string[];
  discount: number;
  category: string;
  media_url?: string;
}

const UpdateProduct = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [updateMessage, setUpdateMessage] = useState({ type: '', text: '' });
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateFormData, setUpdateFormData] = useState({
    price: '',
    stock: '',
    discount: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/products`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      setProducts(response.data.data || response.data);
    } catch (error: any) {
      console.error('Error fetching products:', error);
      setUpdateMessage({ type: 'error', text: 'Failed to fetch products' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id));
    }
  };

  const handleBulkUpdate = async () => {
    if (selectedProducts.length === 0) {
      setUpdateMessage({ type: 'error', text: 'Please select products to update' });
      return;
    }

    try {
      const adminToken = localStorage.getItem('adminToken');
      const updates: any = {};
      if (updateFormData.price) updates.price = parseFloat(updateFormData.price);
      if (updateFormData.stock) updates.stock = parseInt(updateFormData.stock);
      if (updateFormData.discount) updates.discount = parseFloat(updateFormData.discount);

      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/admin/products/bulk`,
        { productIds: selectedProducts, updates },
        { headers: { 'Authorization': `Bearer ${adminToken}` } }
      );

      setUpdateMessage({ type: 'success', text: `${selectedProducts.length} products updated successfully!` });
      setShowUpdateModal(false);
      setSelectedProducts([]);
      setUpdateFormData({ price: '', stock: '', discount: '' });
      fetchProducts();
    } catch (error: any) {
      setUpdateMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update products' });
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/admin/dashboard" className="text-xl font-bold text-gray-800">
                ← Back to Dashboard
              </Link>
              <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
                View Store
              </Link>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-4 max-w-7xl my-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Update Products</h2>
            
            {/* Search and Actions */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <input
                type="text"
                placeholder="Search products by name or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => setShowUpdateModal(true)}
                disabled={selectedProducts.length === 0}
                className={`px-6 py-2 rounded-lg text-white font-medium ${
                  selectedProducts.length === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                Update Selected ({selectedProducts.length})
              </button>
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                        onChange={handleSelectAll}
                        className="w-4 h-4 cursor-pointer"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-gray-600 font-semibold">Image</th>
                    <th className="px-4 py-3 text-left text-gray-600 font-semibold">Name</th>
                    <th className="px-4 py-3 text-left text-gray-600 font-semibold">Category</th>
                    <th className="px-4 py-3 text-left text-gray-600 font-semibold">Price</th>
                    <th className="px-4 py-3 text-left text-gray-600 font-semibold">Stock</th>
                    <th className="px-4 py-3 text-left text-gray-600 font-semibold">Discount</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-gray-500">
                        Loading products...
                      </td>
                    </tr>
                  ) : filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-gray-500">
                        No products found
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => (
                      <tr key={product.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedProducts.includes(product.id)}
                            onChange={() => handleSelectProduct(product.id)}
                            className="w-4 h-4 cursor-pointer"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <img
                            src={product.media_url || 'https://via.placeholder.com/60'}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        </td>
                        <td className="px-4 py-3 font-medium">{product.name}</td>
                        <td className="px-4 py-3">{product.category}</td>
                        <td className="px-4 py-3">₹{product.price}</td>
                        <td className="px-4 py-3">{product.stock}</td>
                        <td className="px-4 py-3">{product.discount}%</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {updateMessage.text && (
              <div className={`mt-4 p-3 rounded-lg ${
                updateMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {updateMessage.text}
              </div>
            )}
          </div>
        </div>

        {/* Update Modal */}
        {showUpdateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-semibold mb-4">Update Selected Products</h3>
              <p className="text-gray-600 mb-4">Updating {selectedProducts.length} product(s). Leave fields empty to keep current values.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">New Price (₹)</label>
                  <input
                    type="number"
                    value={updateFormData.price}
                    onChange={(e) => setUpdateFormData(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Leave empty to keep current"
                    step="0.01"
                    min="0"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">New Stock</label>
                  <input
                    type="number"
                    value={updateFormData.stock}
                    onChange={(e) => setUpdateFormData(prev => ({ ...prev, stock: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Leave empty to keep current"
                    min="0"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">New Discount (%)</label>
                  <input
                    type="number"
                    value={updateFormData.discount}
                    onChange={(e) => setUpdateFormData(prev => ({ ...prev, discount: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Leave empty to keep current"
                    min="0"
                    max="100"
                  />
                </div>
              </div>
              
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => {
                    setShowUpdateModal(false);
                    setUpdateFormData({ price: '', stock: '', discount: '' });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkUpdate}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Update Products
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminProtectedRoute>
  );
};

export default UpdateProduct;
