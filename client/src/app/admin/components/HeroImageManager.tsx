"use client";

import React, { useState, useEffect } from 'react';
import { HeroService, HeroImage } from '@/app/services/heroService';
import { LoaderThree } from '@/app/components/ui/loader';
import { Trash2, Edit2, Plus, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import AddHeroModal from './AddHeroModal';
import EditHeroModal from './EditHeroModal';

const HeroImageManager: React.FC = () => {
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingHero, setEditingHero] = useState<HeroImage | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isTogglingStatus, setIsTogglingStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchHeroImages();
  }, []);

  const fetchHeroImages = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const images = await HeroService.getHeroImages();
      setHeroImages(images);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch hero images');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddHero = async (formData: FormData) => {
    try {
      const newHero = await HeroService.createHeroImage(formData);
      setHeroImages([...heroImages, newHero]);
      setShowAddModal(false);
    } catch (err: any) {
      setError(err.message || 'Failed to add hero image');
    }
  };

  const handleEditHero = async (id: string, formData: any) => {
    try {
      const updatedHero = await HeroService.updateHeroImage(id, formData);
      setHeroImages(heroImages.map(h => h.id === id ? updatedHero : h));
      setEditingHero(null);
    } catch (err: any) {
      setError(err.message || 'Failed to update hero image');
    }
  };

  const handleDeleteHero = async (id: string) => {
    if (!confirm('Are you sure you want to delete this hero image?')) return;

    try {
      setIsDeleting(id);
      await HeroService.deleteHeroImage(id);
      setHeroImages(heroImages.filter(h => h.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete hero image');
    } finally {
      setIsDeleting(null);
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      setIsTogglingStatus(id);
      const updatedHero = await HeroService.toggleHeroImageStatus(id);
      setHeroImages(heroImages.map(h => h.id === id ? updatedHero : h));
    } catch (err: any) {
      setError(err.message || 'Failed to toggle hero image status');
    } finally {
      setIsTogglingStatus(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoaderThree size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Hero Images</h2>
          <p className="text-muted-foreground mt-1">Manage hero banner images</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus size={20} />
          Add Hero Image
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-600">
          {error}
        </div>
      )}

      {/* Hero Images Grid */}
      {heroImages.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-border rounded-lg">
          <p className="text-muted-foreground mb-4">No hero images yet</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Create First Hero Image
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {heroImages.map((hero) => (
            <div
              key={hero.id}
              className="border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Image */}
              <div className="relative w-full h-40 bg-muted overflow-hidden">
                {hero.image_url ? (
                  <img
                    src={hero.image_url}
                    alt={hero.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error('Image failed to load:', hero.image_url);
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                    No image
                  </div>
                )}
                {!hero.is_active && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">Inactive</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-foreground truncate">{hero.title}</h3>
                  {hero.description && (
                    <p className="text-sm text-muted-foreground truncate">{hero.description}</p>
                  )}
                </div>

                {hero.cta_text && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">CTA: </span>
                    <span className="text-foreground">{hero.cta_text}</span>
                  </div>
                )}

                <div className="text-xs text-muted-foreground">
                  Order: {hero.sort_order}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => handleToggleStatus(hero.id)}
                    disabled={isTogglingStatus === hero.id}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-secondary text-secondary-foreground rounded hover:bg-accent transition-colors disabled:opacity-50"
                    title={hero.is_active ? 'Deactivate' : 'Activate'}
                  >
                    {isTogglingStatus === hero.id ? (
                      <LoaderThree size="sm" />
                    ) : hero.is_active ? (
                      <Eye size={16} />
                    ) : (
                      <EyeOff size={16} />
                    )}
                  </button>

                  <button
                    onClick={() => setEditingHero(hero)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-secondary text-secondary-foreground rounded hover:bg-accent transition-colors"
                  >
                    <Edit2 size={16} />
                    Edit
                  </button>

                  <button
                    onClick={() => handleDeleteHero(hero.id)}
                    disabled={isDeleting === hero.id}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-500/10 text-red-600 rounded hover:bg-red-500/20 transition-colors disabled:opacity-50"
                  >
                    {isDeleting === hero.id ? (
                      <LoaderThree size="sm" />
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {showAddModal && (
        <AddHeroModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddHero}
        />
      )}

      {editingHero && (
        <EditHeroModal
          hero={editingHero}
          onClose={() => setEditingHero(null)}
          onSubmit={(formData) => handleEditHero(editingHero.id, formData)}
        />
      )}
    </div>
  );
};

export default HeroImageManager;
