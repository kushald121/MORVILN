import { apiClient } from '@/lib/api';

export interface HeroImage {
    id: string;
    title: string;
    description?: string;
    cta_text?: string;
    cta_link?: string;
    image_url: string;
    cloudinary_public_id?: string;
    sort_order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

// Map database response to HeroImage interface
const mapHeroResponse = (data: any): HeroImage => {
    return {
        id: data.id,
        title: data.title,
        description: data.subtitle || data.description,
        cta_text: data.cta_text,
        cta_link: data.link_url || data.cta_link,
        image_url: data.media_url || data.image_url,
        cloudinary_public_id: data.cloudinary_public_id,
        sort_order: data.sort_order,
        is_active: data.is_active,
        created_at: data.created_at,
        updated_at: data.updated_at
    };
};

export class HeroService {
    // Get all hero images (public - only active ones)
    static async getHeroImages(): Promise<HeroImage[]> {
        try {
            const response = await apiClient.get('/hero');

            if (!response.data.success) {
                throw new Error(response.data.message || 'Failed to fetch hero images');
            }

            // Handle both data array and images array in response
            const images = response.data.data || response.data.images || [];
            return images.map(mapHeroResponse);
        } catch (error: any) {
            console.error('Error fetching hero images:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch hero images');
        }
    }

    // Get all hero images for admin (including inactive)
    static async getAdminHeroImages(): Promise<HeroImage[]> {
        try {
            const response = await apiClient.get('/hero?all=true');

            if (!response.data.success) {
                throw new Error(response.data.message || 'Failed to fetch hero images');
            }

            // Handle both data array and images array in response
            const images = response.data.data || response.data.images || [];
            return images.map(mapHeroResponse);
        } catch (error: any) {
            console.error('Error fetching hero images:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch hero images');
        }
    }

    // Get single hero image (public)
    static async getHeroImage(id: string): Promise<HeroImage> {
        try {
            const response = await apiClient.get(`/hero/${id}`);

            if (!response.data.success) {
                throw new Error(response.data.message || 'Failed to fetch hero image');
            }

            return mapHeroResponse(response.data.data);
        } catch (error: any) {
            console.error('Error fetching hero image:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch hero image');
        }
    }

    // Create hero image (admin)
    static async createHeroImage(formData: FormData): Promise<HeroImage> {
        try {
            const response = await apiClient.post('/admin/hero', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (!response.data.success) {
                throw new Error(response.data.message || 'Failed to create hero image');
            }

            return mapHeroResponse(response.data.data);
        } catch (error: any) {
            console.error('Error creating hero image:', error);
            throw new Error(error.response?.data?.message || 'Failed to create hero image');
        }
    }

    // Update hero image (admin)
    static async updateHeroImage(id: string, formData: FormData): Promise<HeroImage> {
        try {
            const response = await apiClient.put(`/admin/hero/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (!response.data.success) {
                throw new Error(response.data.message || 'Failed to update hero image');
            }

            return mapHeroResponse(response.data.data);
        } catch (error: any) {
            console.error('Error updating hero image:', error);
            throw new Error(error.response?.data?.message || 'Failed to update hero image');
        }
    }

    // Delete hero image (admin)
    static async deleteHeroImage(id: string): Promise<void> {
        try {
            const response = await apiClient.delete(`/admin/hero/${id}`);

            if (!response.data.success) {
                throw new Error(response.data.message || 'Failed to delete hero image');
            }
        } catch (error: any) {
            console.error('Error deleting hero image:', error);
            throw new Error(error.response?.data?.message || 'Failed to delete hero image');
        }
    }

    // Toggle hero image status (admin)
    static async toggleHeroImageStatus(id: string): Promise<HeroImage> {
        try {
            const response = await apiClient.patch(`/admin/hero/${id}/status`);

            if (!response.data.success) {
                throw new Error(response.data.message || 'Failed to toggle hero image status');
            }

            return mapHeroResponse(response.data.data);
        } catch (error: any) {
            console.error('Error toggling hero image status:', error);
            throw new Error(error.response?.data?.message || 'Failed to toggle hero image status');
        }
    }

    // Reorder hero images (admin)
    static async reorderHeroImages(images: Array<{ id: string }>): Promise<void> {
        try {
            const response = await apiClient.post('/admin/hero/reorder', { images });

            if (!response.data.success) {
                throw new Error(response.data.message || 'Failed to reorder hero images');
            }
        } catch (error: any) {
            console.error('Error reordering hero images:', error);
            throw new Error(error.response?.data?.message || 'Failed to reorder hero images');
        }
    }
}
