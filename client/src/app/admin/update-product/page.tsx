'use client';

import React, { useState, useEffect } from 'react';
import { AdminProtectedRoute } from '../components/AdminProtectedRoute';
import axios from 'axios';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description?: string;
  base_price: number;
  compare_at_price?: number;
  cost_price?: number;
  categories?: { id: string; name: string } | null;
  category_id?: string;
  product_media?: Array<{ id: string; media_url: string; media_type: string; is_primary: boolean; sort_order: number }>;
  product_variants?: Array<{ id: string; sku: string; size: string; color: string; stock_quantity: number; reserved_quantity: number }>;
  gender: string;
  tags?: string[];
  is_featured: boolean;
  is_active: boolean;
  seo_title?: string;
  seo_description?: string;
  discount?: number;
}

interface EditFormData {
  name: string;
  description: string;
  shortDescription: string;
  price: string;
  compareAtPrice: string;
  costPrice: string;
  gender: string;
  category: string;
  tags: string;
  isFeatured: boolean;
  isActive: boolean;
  seoTitle: string;
  seoDescription: string;
}

const UpdateProduct = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [updateMessage, setUpdateMessage] = useState({ type: '', text: '' });
  const [showEditModal, setShowEditModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editFormData, setEditFormData] = useState<EditFormData>({
    name: '',
    description: '',
    shortDescription: '',
    price: '',
    compareAtPrice: '',
    costPrice: '',
    gender: '',
    category: '',
    tags: '',
    isFeatured: false,
    isActive: true,
    seoTitle: '',
    seoDescription: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/admin/products?limit=100`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      
      const productsData = response.data.data?.products || response.data.products || response.data.data || response.data;
      console.log('Fetched products:', productsData);
      setProducts(Array.isArray(productsData) ? productsData : []);
    } catch (error: any) {
      console.error('Error fetching products:', error);
      setUpdateMessage({ type: 'error', text: 'Failed to fetch products' });
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setEditFormData({
      name: product.name || '',
      description: product.description || '',
      shortDescription: product.short_description || '',
      price: product.base_price?.toString() || '',
      compareAtPrice: product.compare_at_price?.toString() || '',
      costPrice: product.cost_price?.toString() || '',
      gender: product.gender || '',
      category: product.category_id || product.categories?.id || '',
      tags: product.tags?.join(', ') || '',
      isFeatured: product.is_featured || false,
      isActive: product.is_active !== false,
      seoTitle: product.seo_title || '',
      seoDescription: product.seo_description || ''
    });
    setShowEditModal(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setEditFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setEditFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleUpdateProduct = async () => {
    if (!selectedProduct) return;

    setIsSubmitting(true);
    setUpdateMessage({ type: '', text: '' });

    try {
      const adminToken = localStorage.getItem('adminToken');
      
      const updateData: any = {
        name: editFormData.name,
        description: editFormData.description,
        short_description: editFormData.shortDescription,
        base_price: parseFloat(editFormData.price),
        gender: editFormData.gender.toLowerCase(),
        is_featured: editFormData.isFeatured,
        is_active: editFormData.isActive,
      };

      if (editFormData.compareAtPrice) updateData.compare_at_price = parseFloat(editFormData.compareAtPrice);
      if (editFormData.costPrice) updateData.cost_price = parseFloat(editFormData.costPrice);
      if (editFormData.category) updateData.category_id = editFormData.category;
      if (editFormData.tags) updateData.tags = editFormData.tags.split(',').map(t => t.trim()).filter(Boolean);
      if (editFormData.seoTitle) updateData.seo_title = editFormData.seoTitle;
      if (editFormData.seoDescription) updateData.seo_description = editFormData.seoDescription;

      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/admin/products/${selectedProduct.id}`,
        updateData,
        { headers: { 'Authorization': `Bearer ${adminToken}` } }
      );

      setUpdateMessage({ type: 'success', text: 'Product updated successfully!' });
      setShowEditModal(false);
      setSelectedProduct(null);
      fetchProducts();
    } catch (error: any) {
      console.error('Update error:', error);
      setUpdateMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to update product' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const categoryName = product.categories?.name || '';
    return product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           categoryName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getTotalStock = (product: Product) => {
    return product.product_variants?.reduce((sum, v) => sum + (v.stock_quantity || 0), 0) || 0;
  };

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
            
            {/* Search */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search products by name or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-gray-600 font-semibold">Image</th>
                    <th className="px-4 py-3 text-left text-gray-600 font-semibold">Name</th>
                    <th className="px-4 py-3 text-left text-gray-600 font-semibold">Category</th>
                    <th className="px-4 py-3 text-left text-gray-600 font-semibold">Price</th>
                    <th className="px-4 py-3 text-left text-gray-600 font-semibold">Stock</th>
                    <th className="px-4 py-3 text-left text-gray-600 font-semibold">Status</th>
                    <th className="px-4 py-3 text-left text-gray-600 font-semibold">Actions</th>
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
                          <img
                            src={product.product_media?.[0]?.media_url || 'https://via.placeholder.com/60'}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        </td>
                        <td className="px-4 py-3 font-medium">{product.name}</td>
                        <td className="px-4 py-3">{product.categories?.name || 'N/A'}</td>
                        <td className="px-4 py-3">₹{product.base_price}</td>
                        <td className="px-4 py-3">{getTotalStock(product)}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            product.is_active 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {product.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                          >
                            Edit
                          </button>
                        </td>
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
        {showEditModal && selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 my-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-semibold">Edit Product: {selectedProduct.name}</h3>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedProduct(null);
                  }}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="max-h-[70vh] overflow-y-auto pr-2">
                <form className="space-y-6">
                  {/* General Information */}
                  <div className="border-b pb-4">
                    <h4 className="text-lg font-medium mb-3 text-gray-700">General Information</h4>
                    
                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2 font-medium">Product Name</label>
                      <input
                        type="text"
                        name="name"
                        value={editFormData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2 font-medium">Description</label>
                      <textarea
                        name="description"
                        value={editFormData.description}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={4}
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2 font-medium">Short Description</label>
                      <textarea
                        name="shortDescription"
                        value={editFormData.shortDescription}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={2}
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2 font-medium">Gender</label>
                      <select
                        name="gender"
                        value={editFormData.gender}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Select Gender</option>
                        <option value="men">Men</option>
                        <option value="women">Women</option>
                        <option value="unisex">Unisex</option>
                        <option value="kids">Kids</option>
                      </select>
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2 font-medium">Category</label>
                      <select
                        name="category"
                        value={editFormData.category}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Category</option>
                        <option value="Jacket">Jacket</option>
                        <option value="Tshirt">Tshirt</option>
                        <option value="Hoodie">Hoodie</option>
                      </select>
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2 font-medium">Tags</label>
                      <input
                        type="text"
                        name="tags"
                        value={editFormData.tags}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="winter, jacket, trending (comma-separated)"
                      />
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="border-b pb-4">
                    <h4 className="text-lg font-medium mb-3 text-gray-700">Pricing</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-gray-700 mb-2 font-medium">Base Price (₹)</label>
                        <input
                          type="number"
                          name="price"
                          value={editFormData.price}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          step="0.01"
                          min="0"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 mb-2 font-medium">Compare At Price (₹)</label>
                        <input
                          type="number"
                          name="compareAtPrice"
                          value={editFormData.compareAtPrice}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          step="0.01"
                          min="0"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 mb-2 font-medium">Cost Price (₹)</label>
                        <input
                          type="number"
                          name="costPrice"
                          value={editFormData.costPrice}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          step="0.01"
                          min="0"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SEO */}
                  <div className="border-b pb-4">
                    <h4 className="text-lg font-medium mb-3 text-gray-700">SEO & Marketing</h4>
                    
                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2 font-medium">SEO Title</label>
                      <input
                        type="text"
                        name="seoTitle"
                        value={editFormData.seoTitle}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        maxLength={60}
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        {editFormData.seoTitle.length}/60 characters
                      </p>
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2 font-medium">SEO Description</label>
                      <textarea
                        name="seoDescription"
                        value={editFormData.seoDescription}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        maxLength={160}
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        {editFormData.seoDescription.length}/160 characters
                      </p>
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <h4 className="text-lg font-medium mb-3 text-gray-700">Status</h4>
                    
                    <div className="space-y-2">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="isFeatured"
                          checked={editFormData.isFeatured}
                          onChange={handleChange}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="ml-2 text-gray-700 font-medium">Featured Product</span>
                      </label>

                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="isActive"
                          checked={editFormData.isActive}
                          onChange={handleChange}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="ml-2 text-gray-700 font-medium">Active (Visible to customers)</span>
                      </label>
                    </div>
                  </div>

                  {/* Variants Info */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-lg font-medium mb-2 text-gray-700">Current Variants</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Total Stock: {getTotalStock(selectedProduct)} units
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {selectedProduct.product_variants?.map((variant) => (
                        <div key={variant.id} className="bg-white p-2 rounded text-sm">
                          <div className="font-medium">{variant.size} - {variant.color}</div>
                          <div className="text-gray-600">Stock: {variant.stock_quantity}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </form>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedProduct(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateProduct}
                  disabled={isSubmitting}
                  className={`flex-1 px-4 py-2 rounded-lg text-white font-medium ${
                    isSubmitting 
                      ? 'bg-blue-400 cursor-not-allowed' 
                      : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                >
                  {isSubmitting ? 'Updating...' : 'Update Product'}
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
