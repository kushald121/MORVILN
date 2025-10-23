import { Request, Response } from 'express';
import { ProductService } from '../services/product.service';
import { ProductFilters } from '../types/product.types';

export class ProductController {
  // Get all products with filters
  static async getProducts(req: Request, res: Response) {
    try {
      const filters: ProductFilters = {
        category_id: req.query.category_id as string,
        gender: req.query.gender as string,
        min_price: req.query.min_price ? parseFloat(req.query.min_price as string) : undefined,
        max_price: req.query.max_price ? parseFloat(req.query.max_price as string) : undefined,
        tags: req.query.tags ? (req.query.tags as string).split(',') : undefined,
        is_featured: req.query.is_featured === 'true' ? true : req.query.is_featured === 'false' ? false : undefined,
        search: req.query.search as string,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
        sort_by: (req.query.sort_by as 'name' | 'price' | 'created_at') || 'created_at',
        sort_order: (req.query.sort_order as 'asc' | 'desc') || 'desc'
      };

      const result = await ProductService.getProducts(filters);

      res.status(200).json({
        success: true,
        data: result.products,
        pagination: result.pagination,
        message: 'Products fetched successfully'
      });
    } catch (error: any) {
      console.error('Error in getProducts controller:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch products'
      });
    }
  }

  // Get single product by ID or slug
  static async getProduct(req: Request, res: Response) {
    try {
      const { identifier } = req.params;

      if (!identifier) {
        return res.status(400).json({
          success: false,
          message: 'Product ID or slug is required'
        });
      }

      const product = await ProductService.getProductById(identifier);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      res.status(200).json({
        success: true,
        data: product,
        message: 'Product fetched successfully'
      });
    } catch (error: any) {
      console.error('Error in getProduct controller:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch product'
      });
    }
  }

  // Get featured products
  static async getFeaturedProducts(req: Request, res: Response) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 8;
      const products = await ProductService.getFeaturedProducts(limit);

      res.status(200).json({
        success: true,
        data: products,
        message: 'Featured products fetched successfully'
      });
    } catch (error: any) {
      console.error('Error in getFeaturedProducts controller:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch featured products'
      });
    }
  }

  // Get categories
  static async getCategories(req: Request, res: Response) {
    try {
      const categories = await ProductService.getCategories();

      res.status(200).json({
        success: true,
        data: categories,
        message: 'Categories fetched successfully'
      });
    } catch (error: any) {
      console.error('Error in getCategories controller:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch categories'
      });
    }
  }

  // Search products
  static async searchProducts(req: Request, res: Response) {
    try {
      const { q } = req.query;

      if (!q || typeof q !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Search query is required'
        });
      }

      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const products = await ProductService.searchProducts(q, limit);

      res.status(200).json({
        success: true,
        data: products,
        message: 'Search completed successfully'
      });
    } catch (error: any) {
      console.error('Error in searchProducts controller:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to search products'
      });
    }
  }

  // Check product availability
  static async checkAvailability(req: Request, res: Response) {
    try {
      const { variantId } = req.params;
      const { quantity } = req.query;

      if (!variantId) {
        return res.status(400).json({
          success: false,
          message: 'Variant ID is required'
        });
      }

      const requestedQuantity = quantity ? parseInt(quantity as string) : 1;
      const isAvailable = await ProductService.checkProductAvailability(variantId, requestedQuantity);

      res.status(200).json({
        success: true,
        data: {
          variant_id: variantId,
          quantity: requestedQuantity,
          is_available: isAvailable
        },
        message: 'Availability checked successfully'
      });
    } catch (error: any) {
      console.error('Error in checkAvailability controller:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to check availability'
      });
    }
  }
}