"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const product_service_1 = require("../services/product.service");
class ProductController {
    // Get all products with filters
    static async getProducts(req, res) {
        try {
            const filters = {
                category_id: req.query.category_id,
                gender: req.query.gender,
                min_price: req.query.min_price ? parseFloat(req.query.min_price) : undefined,
                max_price: req.query.max_price ? parseFloat(req.query.max_price) : undefined,
                tags: req.query.tags ? req.query.tags.split(',') : undefined,
                is_featured: req.query.is_featured === 'true' ? true : req.query.is_featured === 'false' ? false : undefined,
                search: req.query.search,
                page: req.query.page ? parseInt(req.query.page) : 1,
                limit: req.query.limit ? parseInt(req.query.limit) : 20,
                sort_by: req.query.sort_by || 'created_at',
                sort_order: req.query.sort_order || 'desc'
            };
            const result = await product_service_1.ProductService.getProducts(filters);
            res.status(200).json({
                success: true,
                data: result.products,
                pagination: result.pagination,
                message: 'Products fetched successfully'
            });
        }
        catch (error) {
            console.error('Error in getProducts controller:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to fetch products'
            });
        }
    }
    // Get single product by ID or slug
    static async getProduct(req, res) {
        try {
            const { identifier } = req.params;
            if (!identifier) {
                return res.status(400).json({
                    success: false,
                    message: 'Product ID or slug is required'
                });
            }
            const product = await product_service_1.ProductService.getProductById(identifier);
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
        }
        catch (error) {
            console.error('Error in getProduct controller:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to fetch product'
            });
        }
    }
    // Get featured products
    static async getFeaturedProducts(req, res) {
        try {
            const limit = req.query.limit ? parseInt(req.query.limit) : 8;
            const products = await product_service_1.ProductService.getFeaturedProducts(limit);
            res.status(200).json({
                success: true,
                data: products,
                message: 'Featured products fetched successfully'
            });
        }
        catch (error) {
            console.error('Error in getFeaturedProducts controller:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to fetch featured products'
            });
        }
    }
    // Get categories
    static async getCategories(req, res) {
        try {
            const categories = await product_service_1.ProductService.getCategories();
            res.status(200).json({
                success: true,
                data: categories,
                message: 'Categories fetched successfully'
            });
        }
        catch (error) {
            console.error('Error in getCategories controller:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to fetch categories'
            });
        }
    }
    // Search products
    static async searchProducts(req, res) {
        try {
            const { q } = req.query;
            if (!q || typeof q !== 'string') {
                return res.status(400).json({
                    success: false,
                    message: 'Search query is required'
                });
            }
            const limit = req.query.limit ? parseInt(req.query.limit) : 10;
            const products = await product_service_1.ProductService.searchProducts(q, limit);
            res.status(200).json({
                success: true,
                data: products,
                message: 'Search completed successfully'
            });
        }
        catch (error) {
            console.error('Error in searchProducts controller:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to search products'
            });
        }
    }
    // Check product availability
    static async checkAvailability(req, res) {
        try {
            const { variantId } = req.params;
            const { quantity } = req.query;
            if (!variantId) {
                return res.status(400).json({
                    success: false,
                    message: 'Variant ID is required'
                });
            }
            const requestedQuantity = quantity ? parseInt(quantity) : 1;
            const isAvailable = await product_service_1.ProductService.checkProductAvailability(variantId, requestedQuantity);
            res.status(200).json({
                success: true,
                data: {
                    variant_id: variantId,
                    quantity: requestedQuantity,
                    is_available: isAvailable
                },
                message: 'Availability checked successfully'
            });
        }
        catch (error) {
            console.error('Error in checkAvailability controller:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to check availability'
            });
        }
    }
}
exports.ProductController = ProductController;
