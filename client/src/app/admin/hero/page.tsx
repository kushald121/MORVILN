'use client';

import React, { useState, useRef, useEffect } from 'react';

interface HeroImage {
  _id?: string;
  imageUrl: string;
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  order: number;
  isActive: boolean;
}

interface FormData {
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  order: number;
  isActive: boolean;
}

const ManageHeroSection = () => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    subtitle: '',
    description: '',
    ctaText: 'SHOP NOW',
    order: 1,
    isActive: true
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchHeroImages();
  }, []);

  const fetchHeroImages = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/admin/hero-images`,
        {
          headers: { 'Authorization': `Bearer ${adminToken}` }
        }
      );
      const data = await response.json();
      setHeroImages(data.images || []);
    } catch (error) {
      console.error('Error fetching hero images:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'order') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 1 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleEdit = (image: HeroImage) => {
    setEditingId(image._id || null);
    setFormData({
      title: image.title,
      subtitle: image.subtitle,
      description: image.description,
      ctaText: image.ctaText,
      order: image.order,
      isActive: image.isActive
    });
    setPreviewUrl(image.imageUrl);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this hero image?')) return;

    try {
      const adminToken = localStorage.getItem('adminToken');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/admin/hero-images/${id}`,
        {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${adminToken}` }
        }
      );
      
      if (response.ok) {
        setSubmitMessage({ type: 'success', text: 'Hero image deleted successfully!' });
        fetchHeroImages();
      } else {
        throw new Error('Failed to delete');
      }
    } catch (error: any) {
      setSubmitMessage({ 
        type: 'error', 
        text: 'Failed to delete hero image' 
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      ctaText: 'SHOP NOW',
      order: 1,
      isActive: true
    });
    setImageFile(null);
    setPreviewUrl('');
    setEditingId(null);
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingId && !imageFile) {
      setSubmitMessage({ type: 'error', text: 'Please select an image' });
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage({ type: '', text: '' });

    try {
      const formDataToSend = new FormData();
      
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value.toString());
      });

      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      const adminToken = localStorage.getItem('adminToken');
      const url = editingId
        ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/admin/hero-images/${editingId}`
        : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/admin/hero-images`;
      
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${adminToken}`
        },
        body: formDataToSend
      });

      if (response.ok) {
        setSubmitMessage({ 
          type: 'success', 
          text: editingId ? 'Hero image updated successfully!' : 'Hero image added successfully!' 
        });
        
        resetForm();
        fetchHeroImages();
      } else {
        throw new Error('Failed to save');
      }
    } catch (error: any) {
      console.error('Error saving hero image:', error);
      setSubmitMessage({ 
        type: 'error', 
        text: 'Failed to save hero image' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button 
              onClick={() => window.history.back()}
              className="text-xl font-bold text-gray-800 hover:text-gray-600"
            >
              ← Back to Dashboard
            </button>
            <a href="/" className="text-sm text-gray-600 hover:text-gray-900">
              View Store
            </a>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 max-w-7xl my-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            {editingId ? 'Edit Hero Image' : 'Add New Hero Image'}
          </h2>
          
          <div>
            {/* Hero Image Upload */}
            <div className="mb-8">
              <h3 className="text-xl font-medium mb-4 text-gray-700 border-b pb-2">Hero Image</h3>
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
              >
                Choose Image
              </button>
              
              {previewUrl && (
                <div className="mt-4 relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            <hr className="my-6 border-gray-200" />

            {/* Content Fields */}
            <div className="mb-8">
              <h3 className="text-xl font-medium mb-4 text-gray-700 border-b pb-2">Content</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="BLACK FRIDAY"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Subtitle</label>
                  <input
                    type="text"
                    name="subtitle"
                    value={formData.subtitle}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="SALE!!!"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2 font-medium">Description</label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="UPTO 60% OFF"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">CTA Button Text</label>
                  <input
                    type="text"
                    name="ctaText"
                    value={formData.ctaText}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="SHOP NOW"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Display Order</label>
                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700 font-medium">Active (Display on website)</span>
                </label>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-4">
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              )}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`px-6 py-3 rounded-lg text-white font-medium ${
                  isSubmitting 
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-blue-500 hover:bg-blue-600 shadow-md'
                } transition-colors`}
              >
                {isSubmitting ? 'Processing...' : editingId ? 'Update Hero Image' : 'Add Hero Image'}
              </button>
            </div>

            {/* Submission Message */}
            {submitMessage.text && (
              <div className={`mt-4 p-3 rounded-lg ${
                submitMessage.type === 'success' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {submitMessage.text}
              </div>
            )}
          </div>
        </div>

        {/* Existing Hero Images List */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Existing Hero Images</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {heroImages.map((image) => (
              <div key={image._id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="relative h-48 bg-gray-200">
                  <img 
                    src={image.imageUrl} 
                    alt={image.title}
                    className="w-full h-full object-cover"
                  />
                  {!image.isActive && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                      Inactive
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1">{image.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">{image.subtitle}</p>
                  <p className="text-gray-500 text-xs mb-3">Order: {image.order}</p>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(image)}
                      className="flex-1 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(image._id!)}
                      className="flex-1 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {heroImages.length === 0 && (
            <p className="text-center text-gray-500 py-8">No hero images added yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageHeroSection;