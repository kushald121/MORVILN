"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ProductFormData,
  ProductVariantFormData,
  // ProductMediaFormData,
  Category,
  UploadResponse
} from '../types/product.types';
import { ProductService } from '../services/product.service';
import Image from 'next/image';
// import SplashCursor from '../components/ui/splash-cursor';

const AddProduct: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [uploadedImages, setUploadedImages] = useState<UploadResponse[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  // Form states
  const [productData, setProductData] = useState<ProductFormData>({
    name: '',
    slug: '',
    description: '',
    shortDescription: '',
    basePrice: 0,
    compareAtPrice: 0,
    costPrice: 0,
    categoryId: '',
    gender: 'unisex',
    tags: [],
    isFeatured: false,
    isActive: true,
    seoTitle: '',
    seoDescription: ''
  });

  const [variants, setVariants] = useState<ProductVariantFormData[]>([
    {
      size: '',
      color: '',
      colorCode: '#000000',
      material: '',
      additionalPrice: 0,
      stockQuantity: 0,
      sku: '',
      isActive: true
    }
  ]);

  const [tagInput, setTagInput] = useState('');

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const categoriesData = await ProductService.getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
      alert('Failed to load categories');
    }
  };

  // Handle product form changes
  const handleProductChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setProductData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'name') {
      setProductData(prev => ({
        ...prev,
        [name]: value,
        slug: ProductService.generateSlug(value)
      }));
    } else {
      setProductData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handle variant changes
  const handleVariantChange = (index: number, field: keyof ProductVariantFormData, value: string | number | boolean) => {
    setVariants(prev => prev.map((variant, i) => 
      i === index ? { ...variant, [field]: value } : variant
    ));
  };

  // Add new variant
  const addVariant = () => {
    setVariants(prev => [...prev, {
      size: '',
      color: '',
      colorCode: '#000000',
      material: '',
      additionalPrice: 0,
      stockQuantity: 0,
      sku: '',
      isActive: true
    }]);
  };

  // Remove variant
  const removeVariant = (index: number) => {
    if (variants.length > 1) {
      setVariants(prev => prev.filter((_, i) => i !== index));
    }
  };

  // Handle tag input
  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      setProductData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim().toLowerCase()]
      }));
      setTagInput('');
    }
  };

  // Remove tag
  const removeTag = (tagToRemove: string) => {
    setProductData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Handle image upload
  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    try {
      const uploaded = await ProductService.uploadImages(Array.from(files));
      setUploadedImages(prev => [...prev, ...uploaded]);
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Failed to upload images');
    } finally {
      setUploadingImages(false);
    }
  };

  // Remove uploaded image
  const removeImage = async (publicId: string, index: number) => {
    try {
      await ProductService.deleteImage(publicId);
      setUploadedImages(prev => prev.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Failed to delete image');
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare media data from uploaded images
      const media = uploadedImages.map((upload, index) => ({
        mediaUrl: upload.data?.url || '',
        cloudinaryPublicId: upload.data?.publicId || '',
        mediaType: 'image' as const,
        altText: productData.name,
        isPrimary: index === 0 // First image is primary
      }));

      const productPayload = {
        product: productData,
        variants: variants,
        media: media
      };

      await ProductService.createProduct(productPayload);
      
      alert('Product created successfully!');
      router.push('/admin/products');
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Failed to create product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen  py-8">
      {/* <SplashCursor /> */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="glass-dark rounded-2xl p-10 animate-fade-in-up shadow-2xl border border-slate-700/50">
          <div className="mb-10">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">Add New Product</h1>
                <p className="text-slate-300 text-lg">Create a new product for your store with detailed information</p>
              </div>
            </div>
            <div className="w-full h-1 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-600/20 rounded-full"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Basic Product Information */}
            <div className="bg-slate-800/30 rounded-xl p-8 border border-slate-700/50">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-slate-100">Basic Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-200 mb-3">
                    Product Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={productData.name}
                    onChange={handleProductChange}
                    required
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200"
                    placeholder="Enter product name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-200 mb-3">
                    Slug <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={productData.slug}
                    onChange={handleProductChange}
                    required
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200"
                    placeholder="product-slug"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-200 mb-3">
                    Category <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="categoryId"
                    value={productData.categoryId}
                    onChange={handleProductChange}
                    required
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-100 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200"
                  >
                    <option value="">Select Category</option>
                    {categories.map((category: Category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-200 mb-3">
                    Gender <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="gender"
                    value={productData.gender}
                    onChange={handleProductChange}
                    required
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-100 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200"
                  >
                    <option value="unisex">Unisex</option>
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="kids">Kids</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-200 mb-3">
                    Base Price (₹) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    name="basePrice"
                    value={productData.basePrice}
                    onChange={handleProductChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-200 mb-3">
                    Compare at Price (₹)
                  </label>
                  <input
                    type="number"
                    name="compareAtPrice"
                    value={productData.compareAtPrice}
                    onChange={handleProductChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="bg-slate-800/30 rounded-xl p-8 border border-slate-700/50">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-slate-100">Product Descriptions</h2>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-200 mb-3">
                    Short Description <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    name="shortDescription"
                    value={productData.shortDescription}
                    onChange={handleProductChange}
                    required
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200 resize-none"
                    placeholder="Brief description for product listings (appears in search results and category pages)"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-200 mb-3">
                    Full Description <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={productData.description}
                    onChange={handleProductChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200 resize-none"
                    placeholder="Detailed product description with features, benefits, and specifications"
                  />
                </div>
              </div>
            </div>

            {/* Tags Section */}
            <div className="bg-slate-800/30 rounded-xl p-8 border border-slate-700/50">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-slate-100">Product Tags</h2>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-200 mb-3">
                    Tags
                  </label>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagInput}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200"
                    placeholder="Type a tag and press Enter to add it"
                  />
                  <p className="text-sm text-slate-400">Press Enter to add a tag. Tags help with product discovery and filtering.</p>
                </div>

                <div className="flex flex-wrap gap-3">
                  {productData.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 text-sm rounded-full border border-cyan-400/30 hover:border-cyan-400/50 transition-all duration-200"
                    >
                      <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-3 text-slate-400 hover:text-red-400 transition-colors font-semibold text-lg p-1 rounded-full hover:bg-red-400/20"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Variants Section */}
            <div className="bg-slate-800/30 rounded-xl p-8 border border-slate-700/50">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-600 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-semibold text-slate-100">Product Variants</h2>
                </div>
                <button
                  type="button"
                  onClick={addVariant}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Variant
                </button>
              </div>

              <div className="space-y-6">
                {variants.map((variant, index) => (
                  <div key={index} className="bg-slate-900/50 rounded-xl p-6 border border-slate-600/50 animate-fade-in-up">
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {index + 1}
                        </div>
                        <h4 className="text-xl font-semibold text-slate-100">Variant {index + 1}</h4>
                      </div>
                      {variants.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeVariant(index)}
                          className="inline-flex items-center px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-400/20 rounded-lg transition-all duration-200 font-medium"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-200 mb-2">
                          Size <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          value={variant.size}
                          onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                          required
                          className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200"
                          placeholder="S, M, L, XL"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-200 mb-2">
                          Color <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          value={variant.color}
                          onChange={(e) => handleVariantChange(index, 'color', e.target.value)}
                          required
                          className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200"
                          placeholder="Red, Blue, Black"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-200 mb-2">
                          Color Code
                        </label>
                        <div className="relative">
                          <input
                            type="color"
                            value={variant.colorCode}
                            onChange={(e) => handleVariantChange(index, 'colorCode', e.target.value)}
                            className="w-full h-12 bg-slate-800/50 border border-slate-600 rounded-lg cursor-pointer focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200"
                          />
                          <div className="absolute inset-0 rounded-lg pointer-events-none" style={{ backgroundColor: variant.colorCode, opacity: 0.1 }}></div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-200 mb-2">
                          SKU <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          value={variant.sku}
                          onChange={(e) => handleVariantChange(index, 'sku', e.target.value)}
                          required
                          className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200"
                          placeholder="Unique SKU"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-200 mb-2">
                          Additional Price (₹)
                        </label>
                        <input
                          type="number"
                          value={variant.additionalPrice}
                          onChange={(e) => handleVariantChange(index, 'additionalPrice', parseFloat(e.target.value) || 0)}
                          min="0"
                          step="0.01"
                          className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-200 mb-2">
                          Stock Quantity <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="number"
                          value={variant.stockQuantity}
                          onChange={(e) => handleVariantChange(index, 'stockQuantity', parseInt(e.target.value) || 0)}
                          required
                          min="0"
                          className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200"
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2 lg:col-span-3">
                        <label className="block text-sm font-semibold text-slate-200 mb-2">
                          Material
                        </label>
                        <input
                          type="text"
                          value={variant.material}
                          onChange={(e) => handleVariantChange(index, 'material', e.target.value)}
                          className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200"
                          placeholder="Cotton, Polyester, etc."
                        />
                      </div>

                      <div className="flex items-center space-x-3 md:col-span-2 lg:col-span-3">
                        <input
                          type="checkbox"
                          checked={variant.isActive}
                          onChange={(e) => handleVariantChange(index, 'isActive', e.target.checked)}
                          className="h-5 w-5 text-cyan-400 focus:ring-cyan-400/20 border-slate-600 rounded"
                        />
                        <label className="block text-sm font-semibold text-slate-200">
                          Variant Active
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="bg-slate-800/30 rounded-xl p-8 border border-slate-700/50">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-slate-100">Product Images</h2>
              </div>

              <div className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center hover:border-cyan-400/50 transition-all duration-200 bg-slate-900/30">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files)}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer block group"
                >
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                      <svg className="w-10 h-10 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-xl text-slate-200 mb-2 font-semibold">
                      Click to upload product images
                    </p>
                    <p className="text-sm text-slate-400 mb-4">
                      PNG, JPG, WEBP up to 10MB each
                    </p>
                    <div className="inline-flex items-center px-4 py-2 bg-cyan-500/10 text-cyan-400 rounded-lg border border-cyan-400/30">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                      </svg>
                      Choose Files
                    </div>
                  </div>
                </label>
              </div>

              {/* Uploaded Images Preview */}
              {uploadingImages && (
                <div className="mt-6 text-center">
                  <div className="inline-flex items-center space-x-3 text-slate-200 bg-slate-900/50 px-6 py-3 rounded-lg">
                    <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                    <p className="font-medium">Uploading images...</p>
                  </div>
                </div>
              )}

              {uploadedImages.length > 0 && (
                <div className="mt-8">
                  <h4 className="text-xl font-semibold text-slate-100 mb-4">Uploaded Images</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {uploadedImages.map((upload, index) => (
                      <div key={index} className="relative group">
                        {upload.data?.url && (
                          <div className="relative">
                            <Image
                              width={150}
                              height={150}
                              src={upload.data.url}
                              alt={`Product image ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg border-2 border-slate-600 shadow-lg"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg"></div>
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(upload.data!.publicId, index)}
                          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg transform hover:scale-110"
                        >
                          ×
                        </button>
                        {index === 0 && (
                          <span className="absolute top-2 left-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs px-2 py-1 rounded-full font-semibold shadow-lg">
                            Primary
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* SEO Section */}
            <div className="bg-slate-800/30 rounded-xl p-8 border border-slate-700/50">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-slate-100">SEO Settings</h2>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-200 mb-3">
                    SEO Title
                  </label>
                  <input
                    type="text"
                    name="seoTitle"
                    value={productData.seoTitle}
                    onChange={handleProductChange}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200"
                    placeholder="SEO title for search engines (50-60 characters recommended)"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-200 mb-3">
                    SEO Description
                  </label>
                  <textarea
                    name="seoDescription"
                    value={productData.seoDescription}
                    onChange={handleProductChange}
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200 resize-none"
                    placeholder="SEO description for search engines (150-160 characters recommended)"
                  />
                </div>
              </div>
            </div>

            {/* Status and Actions */}
            <div className="bg-slate-800/30 rounded-xl p-8 border border-slate-700/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-8">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name="isFeatured"
                      checked={productData.isFeatured}
                      onChange={handleProductChange}
                      className="h-5 w-5 text-cyan-400 focus:ring-cyan-400/20 border-slate-600 rounded"
                    />
                    <div>
                      <label className="block text-sm font-semibold text-slate-200">
                        Featured Product
                      </label>
                      <p className="text-xs text-slate-400">Show this product in featured sections</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={productData.isActive}
                      onChange={handleProductChange}
                      className="h-5 w-5 text-cyan-400 focus:ring-cyan-400/20 border-slate-600 rounded"
                    />
                    <div>
                      <label className="block text-sm font-semibold text-slate-200">
                        Active
                      </label>
                      <p className="text-xs text-slate-400">Make this product visible to customers</p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => router.push('/admin/products')}
                    className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold rounded-lg transition-all duration-200 hover:shadow-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Creating...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span>Create Product</span>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
