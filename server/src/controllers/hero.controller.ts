import { Request, Response } from 'express';
import supabase from '../config/database';
import ImageService from '../services/image.service';

export class HeroController {
  // Get all hero images (public - only active ones)
  static async getHeroImages(req: Request, res: Response) {
    try {
      // Check if this is an admin request (has all query param)
      const includeAll = req.query.all === 'true';
      
      let query = supabase
        .from('hero_images')
        .select('*')
        .order('sort_order', { ascending: true });
      
      // For public requests, only show active images
      if (!includeAll) {
        query = query.eq('is_active', true);
      }
      
      const { data, error } = await query;

      if (error) throw error;

      // Map database fields to frontend-friendly format
      const images = (data || []).map((img: any) => ({
        _id: img.id,
        id: img.id,
        title: img.title,
        subtitle: img.description, // Map description to subtitle for frontend
        description: img.description,
        imageUrl: img.image_url,
        image_url: img.image_url,
        ctaText: img.cta_text,
        cta_text: img.cta_text,
        ctaLink: img.cta_link,
        cta_link: img.cta_link,
        cloudinary_public_id: img.cloudinary_public_id,
        isActive: img.is_active,
        is_active: img.is_active,
        sortOrder: img.sort_order,
        sort_order: img.sort_order,
        createdAt: img.created_at,
        updatedAt: img.updated_at
      }));

      return res.status(200).json({
        success: true,
        images, // For frontend compatibility
        data: images, // Also include as data
        message: 'Hero images fetched successfully'
      });
    } catch (error: any) {
      console.error('Error fetching hero images:', error);
      return res.status(500).json({
        success: false,
        images: [],
        data: [],
        message: error.message || 'Failed to fetch hero images'
      });
    }
  }

  // Get single hero image
  static async getHeroImage(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const { data, error } = await supabase
        .from('hero_images')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return res.status(200).json({
        success: true,
        data,
        message: 'Hero image fetched successfully'
      });
    } catch (error: any) {
      console.error('Error fetching hero image:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch hero image'
      });
    }
  }

  // Create hero image
  static async createHeroImage(req: Request, res: Response) {
    try {
      const { title, description, cta_text, cta_link, sort_order, is_active } = req.body;
      const file = (req as any).file;

      console.log('Hero create request body:', { title, description, cta_text, cta_link, sort_order, is_active });
      console.log('File info:', file ? { fieldname: file.fieldname, mimetype: file.mimetype, size: file.size } : 'No file');

      if (!file) {
        return res.status(400).json({
          success: false,
          message: 'Image file is required'
        });
      }

      // Upload to Cloudinary
      const uploadResult = await ImageService.uploadFile(file.buffer, {
        folder: 'hero_images'
      });

      if (!uploadResult.success) {
        console.error('Cloudinary upload failed:', uploadResult.message);
        return res.status(400).json({
          success: false,
          message: 'Failed to upload image to Cloudinary'
        });
      }

      console.log('Cloudinary upload successful:', uploadResult.data);

      // Insert into database
      const isActive = is_active === 'true' || is_active === true;
      const { data, error } = await supabase
        .from('hero_images')
        .insert({
          title,
          description,
          cta_text,
          cta_link,
          image_url: uploadResult.data?.secure_url,
          cloudinary_public_id: uploadResult.data?.public_id,
          sort_order: parseInt(sort_order) || 0,
          is_active: isActive
        })
        .select()
        .single();

      if (error) throw error;

      console.log('Hero image saved to database:', data);

      return res.status(201).json({
        success: true,
        data,
        message: 'Hero image created successfully'
      });
    } catch (error: any) {
      console.error('Error creating hero image:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to create hero image'
      });
    }
  }

  // Update hero image
  static async updateHeroImage(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { title, description, cta_text, cta_link, sort_order, is_active } = req.body;
      const file = (req as any).file;

      // Get existing hero image
      const { data: existingHero, error: fetchError } = await supabase
        .from('hero_images')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      let imageUrl = existingHero.image_url;
      let cloudinaryPublicId = existingHero.cloudinary_public_id;

      // If new file is provided, upload it and delete old one
      if (file) {
        // Delete old image from Cloudinary
        if (existingHero.cloudinary_public_id) {
          await ImageService.deleteFile(existingHero.cloudinary_public_id);
        }

        // Upload new image
        const uploadResult = await ImageService.uploadFile(file.buffer, {
          folder: 'hero_images'
        });

        if (!uploadResult.success) {
          console.error('Cloudinary upload failed:', uploadResult.message);
          return res.status(400).json({
            success: false,
            message: 'Failed to upload image to Cloudinary'
          });
        }

        imageUrl = uploadResult.data?.secure_url;
        cloudinaryPublicId = uploadResult.data?.public_id;
      }

      // Update database
      const { data, error } = await supabase
        .from('hero_images')
        .update({
          title: title || existingHero.title,
          description: description || existingHero.description,
          cta_text: cta_text || existingHero.cta_text,
          cta_link: cta_link || existingHero.cta_link,
          image_url: imageUrl,
          cloudinary_public_id: cloudinaryPublicId,
          sort_order: sort_order !== undefined ? sort_order : existingHero.sort_order,
          is_active: is_active !== undefined ? is_active : existingHero.is_active,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return res.status(200).json({
        success: true,
        data,
        message: 'Hero image updated successfully'
      });
    } catch (error: any) {
      console.error('Error updating hero image:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to update hero image'
      });
    }
  }

  // Delete hero image
  static async deleteHeroImage(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Get hero image to get cloudinary public id
      const { data: heroImage, error: fetchError } = await supabase
        .from('hero_images')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      // Delete from Cloudinary
      if (heroImage.cloudinary_public_id) {
        await ImageService.deleteFile(heroImage.cloudinary_public_id);
      }

      // Delete from database
      const { error: deleteError } = await supabase
        .from('hero_images')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      return res.status(200).json({
        success: true,
        message: 'Hero image deleted successfully'
      });
    } catch (error: any) {
      console.error('Error deleting hero image:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to delete hero image'
      });
    }
  }

  // Reorder hero images
  static async reorderHeroImages(req: Request, res: Response) {
    try {
      const { images } = req.body;

      if (!Array.isArray(images)) {
        return res.status(400).json({
          success: false,
          message: 'Images array is required'
        });
      }

      // Update sort order for each image
      const updates = images.map((img: any, index: number) =>
        supabase
          .from('hero_images')
          .update({ sort_order: index })
          .eq('id', img.id)
      );

      await Promise.all(updates);

      return res.status(200).json({
        success: true,
        message: 'Hero images reordered successfully'
      });
    } catch (error: any) {
      console.error('Error reordering hero images:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to reorder hero images'
      });
    }
  }

  // Toggle hero image active status
  static async toggleHeroImageStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Get current status
      const { data: heroImage, error: fetchError } = await supabase
        .from('hero_images')
        .select('is_active')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      // Toggle status
      const { data, error } = await supabase
        .from('hero_images')
        .update({ is_active: !heroImage.is_active })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return res.status(200).json({
        success: true,
        data,
        message: 'Hero image status toggled successfully'
      });
    } catch (error: any) {
      console.error('Error toggling hero image status:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to toggle hero image status'
      });
    }
  }
}

export default HeroController;
