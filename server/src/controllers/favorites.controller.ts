import { Request, Response } from 'express';
import supabase from '../config/database';

/**
 * Get user's favorites
 */
export const getFavorites = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any)?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    // Get user favorites with product details
    const { data: favorites, error } = await supabase
      .from('user_favorites')
      .select(`
        id,
        added_at,
        product:products (
          id,
          name,
          slug,
          description,
          short_description,
          base_price,
          compare_at_price,
          is_featured,
          gender,
          tags,
          category:categories (
            name,
            slug
          )
        )
      `)
      .eq('user_id', userId)
      .order('added_at', { ascending: false });

    if (error) {
      throw error;
    }

    // Get media and variants for each product
    const productsWithDetails = await Promise.all(
      (favorites || []).map(async (fav: any) => {
        const productId = fav.product?.id;
        
        if (!productId) return fav;

        // Get product media
        const { data: media } = await supabase
          .from('product_media')
          .select('id, media_url, media_type, alt_text, is_primary')
          .eq('product_id', productId)
          .order('is_primary', { ascending: false })
          .order('sort_order', { ascending: true });

        // Get product variants
        const { data: variants } = await supabase
          .from('product_variants')
          .select('id, size, color, stock_quantity, additional_price')
          .eq('product_id', productId)
          .eq('is_active', true);

        return {
          ...fav,
          product: {
            ...fav.product,
            media: media || [],
            variants: variants || []
          }
        };
      })
    );

    return res.status(200).json({
      success: true,
      message: 'Favorites retrieved successfully',
      data: {
        favorites: productsWithDetails,
        count: productsWithDetails.length
      }
    });
  } catch (error: any) {
    console.error('Get favorites error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve favorites',
      error: error.message
    });
  }
};

/**
 * Add product to favorites
 */
export const addToFavorites = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any)?.id;
    const { productId } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    // Check if product exists
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id')
      .eq('id', productId)
      .eq('is_active', true)
      .single();

    if (productError || !product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if already in favorites
    const { data: existingFavorite } = await supabase
      .from('user_favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .single();

    if (existingFavorite) {
      return res.status(400).json({
        success: false,
        message: 'Product already in favorites'
      });
    }

    // Add to favorites
    const { data, error } = await supabase
      .from('user_favorites')
      .insert({
        user_id: userId,
        product_id: productId
      })
      .select('id, added_at')
      .single();

    if (error) {
      throw error;
    }

    return res.status(201).json({
      success: true,
      message: 'Product added to favorites',
      data: {
        favoriteId: data.id,
        addedAt: data.added_at
      }
    });
  } catch (error: any) {
    console.error('Add to favorites error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to add product to favorites',
      error: error.message
    });
  }
};

/**
 * Remove product from favorites
 */
export const removeFromFavorites = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any)?.id;
    const { productId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const { error } = await supabase
      .from('user_favorites')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId);

    if (error) {
      return res.status(404).json({
        success: false,
        message: 'Product not found in favorites'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Product removed from favorites'
    });
  } catch (error: any) {
    console.error('Remove from favorites error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to remove product from favorites',
      error: error.message
    });
  }
};

/**
 * Check if product is in favorites
 */
export const checkFavorite = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any)?.id;
    const { productId } = req.params;

    if (!userId) {
      return res.status(200).json({
        success: true,
        data: { isFavorite: false }
      });
    }

    const { data, error } = await supabase
      .from('user_favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .single();

    return res.status(200).json({
      success: true,
      data: {
        isFavorite: !!data && !error
      }
    });
  } catch (error: any) {
    console.error('Check favorite error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to check favorite status',
      error: error.message
    });
  }
};

/**
 * Clear all favorites
 */
export const clearFavorites = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any)?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const { data, error } = await supabase
      .from('user_favorites')
      .delete()
      .eq('user_id', userId)
      .select('id');

    if (error) {
      throw error;
    }

    return res.status(200).json({
      success: true,
      message: `Cleared ${data?.length || 0} favorites`,
      data: {
        deletedCount: data?.length || 0
      }
    });
  } catch (error: any) {
    console.error('Clear favorites error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to clear favorites',
      error: error.message
    });
  }
};
