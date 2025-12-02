"use client";

import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';
import { LoaderThree } from '@/app/components/ui/loader';

interface AddHeroModalProps {
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
}

const AddHeroModal: React.FC<AddHeroModalProps> = ({ onClose, onSubmit }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    cta_text: '',
    cta_link: '',
    sort_order: 0,
    is_active: true
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!imageFile) {
      setError('Please select an image');
      return;
    }

    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      setIsLoading(true);
      const form = new FormData();
      form.append('image', imageFile);
      form.append('title', formData.title);
      form.append('description', formData.description);
      form.append('cta_text', formData.cta_text);
      form.append('cta_link', formData.cta_link);
      form.append('sort_order', formData.sort_order.toString());
      form.append('is_active', formData.is_active.toString());

      await onSubmit(form);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to add hero image');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card">
          <h2 className="text-xl font-bold text-foreground">Add Hero Image</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-accent rounded transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Image *
            </label>
            <div className="relative">
              {imagePreview ? (
                <div className="relative w-full h-40 bg-muted rounded overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <label className="flex items-center justify-center w-full h-40 border-2 border-dashed border-border rounded cursor-pointer hover:bg-accent/50 transition-colors">
                  <div className="flex flex-col items-center justify-center">
                    <Upload size={24} className="text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">Click to upload</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Hero title"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Hero description"
              rows={3}
            />
          </div>

          {/* CTA Text */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              CTA Text
            </label>
            <input
              type="text"
              value={formData.cta_text}
              onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g., Shop Now"
            />
          </div>

          {/* CTA Link */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              CTA Link
            </label>
            <input
              type="text"
              value={formData.cta_link}
              onChange={(e) => setFormData({ ...formData, cta_link: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g., /allproducts"
            />
          </div>

          {/* Sort Order */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Sort Order
            </label>
            <input
              type="number"
              value={formData.sort_order}
              onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Active Status */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-4 h-4"
            />
            <label htmlFor="is_active" className="text-sm font-semibold text-foreground">
              Active
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-border rounded hover:bg-accent transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <LoaderThree size="sm" />
                  Adding...
                </>
              ) : (
                'Add Hero Image'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddHeroModal;
