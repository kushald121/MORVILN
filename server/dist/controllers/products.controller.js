"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsController = void 0;
const pg_1 = require("pg");
class ProductsController {
    constructor() {
        this.pool = new pg_1.Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false }
        });
    }
    /**
     * Get product by SEO-friendly URL: /products/:category/:slug
     */
    async getProductBySlug(req, res) {
        try {
            const { category, slug } = req.params;
            const query = `
        SELECT 
          p.*,
          c.name as category_name,
          c.slug as category_slug,
          json_agg(
            DISTINCT jsonb_build_object(
              'id', pv.id,
              'size', pv.size,
              'color', pv.color,
              'stock_quantity', pv.stock_quantity,
              'sku', pv.sku,
              'additional_price', pv.additional_price
            )
          ) as variants,
          json_agg(
            DISTINCT jsonb_build_object(
              'id', pm.id,
              'media_url', pm.media_url,
              'cloudinary_public_id', pm.cloudinary_public_id,
              'media_type', pm.media_type,
              'is_primary', pm.is_primary,
              'responsive_urls', jsonb_build_object(
                'thumbnail', cloudinary_url(pm.cloudinary_public_id, 
                  ARRAY[
                    jsonb_build_object('width', 100, 'height', 100, 'crop', 'fill'),
                    jsonb_build_object('quality', 'auto', 'fetch_format', 'auto')
                  ]
                ),
                'gallery', cloudinary_url(pm.cloudinary_public_id, 
                  ARRAY[
                    jsonb_build_object('width', 500, 'height', 500, 'crop', 'fill'),
                    jsonb_build_object('quality', 'auto', 'fetch_format', 'auto')
                  ]
                ),
                'main', cloudinary_url(pm.cloudinary_public_id, 
                  ARRAY[
                    jsonb_build_object('width', 600, 'height', 600, 'crop', 'limit'),
                    jsonb_build_object('quality', 'auto', 'fetch_format', 'auto')
                  ]
                )
              )
            )
          ) as media
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN product_variants pv ON p.id = pv.product_id
        LEFT JOIN product_media pm ON p.id = pm.product_id
        WHERE p.slug = $1 
          AND c.slug = $2 
          AND p.is_active = true
        GROUP BY p.id, c.name, c.slug
      `;
            const result = await this.pool.query(query, [slug, category]);
            if (result.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found',
                });
            }
            const product = result.rows[0];
            res.json({
                success: true,
                data: product,
                seo: {
                    title: `${product.name} | ${product.category_name} | Your Fashion Store`,
                    description: product.short_description || `Buy ${product.name} - ${product.category_name}. Best quality fashion products.`,
                    keywords: `${product.name}, ${product.category_name}, fashion, clothing`,
                    canonical: `/products/${category}/${slug}`,
                },
            });
        }
        catch (error) {
            console.error('Get product by slug error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    }
    /**
     * Get products by category with SEO-friendly URL: /products/:category
     */
    async getProductsByCategory(req, res) {
        try {
            const { category } = req.params;
            const { page = 1, limit = 12, sort = 'newest', gender } = req.query;
            const offset = (Number(page) - 1) * Number(limit);
            let whereClause = `WHERE c.slug = $1 AND p.is_active = true`;
            const queryParams = [category];
            let paramCount = 2;
            if (gender) {
                whereClause += ` AND p.gender = $${paramCount}`;
                queryParams.push(gender);
                paramCount++;
            }
            const sortClause = this.getSortClause(sort);
            const query = `
        SELECT 
          p.*,
          c.name as category_name,
          (
            SELECT pm.media_url 
            FROM product_media pm 
            WHERE pm.product_id = p.id AND pm.is_primary = true 
            LIMIT 1
          ) as primary_image,
          (
            SELECT pm.cloudinary_public_id 
            FROM product_media pm 
            WHERE pm.product_id = p.id AND pm.is_primary = true 
            LIMIT 1
          ) as primary_image_public_id,
          COUNT(*) OVER() as total_count
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        ${whereClause}
        ${sortClause}
        LIMIT $${paramCount} OFFSET $${paramCount + 1}
      `;
            queryParams.push(Number(limit), offset);
            const result = await this.pool.query(query, queryParams);
            const totalCount = result.rows.length > 0 ? Number(result.rows[0].total_count) : 0;
            const totalPages = Math.ceil(totalCount / Number(limit));
            // Generate optimized image URLs
            const productsWithOptimizedImages = result.rows.map((product) => ({
                ...product,
                optimized_images: product.primary_image_public_id ? {
                    thumbnail: `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/c_fill,w_100,h_100,q_auto,f_auto/${product.primary_image_public_id}`,
                    main: `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/c_limit,w_600,h_600,q_auto,f_auto/${product.primary_image_public_id}`,
                } : null,
            }));
            res.json({
                success: true,
                data: {
                    products: productsWithOptimizedImages,
                    pagination: {
                        current_page: Number(page),
                        total_pages: totalPages,
                        total_products: totalCount,
                        has_next: Number(page) < totalPages,
                        has_prev: Number(page) > 1,
                    },
                },
                seo: {
                    title: `${this.formatCategoryName(category)} | Your Fashion Store`,
                    description: `Browse our collection of ${category}. Latest fashion trends and styles.`,
                    canonical: `/products/${category}`,
                },
            });
        }
        catch (error) {
            console.error('Get products by category error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    }
    /**
     * Get all categories for navigation
     */
    async getCategories(req, res) {
        try {
            const query = `
        SELECT 
          id, 
          name, 
          slug, 
          description,
          image_url,
          (
            SELECT COUNT(*) 
            FROM products p 
            WHERE p.category_id = c.id AND p.is_active = true
          ) as product_count
        FROM categories c
        WHERE is_active = true
        ORDER BY sort_order, name
      `;
            const result = await this.pool.query(query);
            res.json({
                success: true,
                data: result.rows,
            });
        }
        catch (error) {
            console.error('Get categories error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    }
    /**
     * Helper function to generate sort clause
     */
    getSortClause(sort) {
        switch (sort) {
            case 'price-low':
                return 'ORDER BY p.base_price ASC';
            case 'price-high':
                return 'ORDER BY p.base_price DESC';
            case 'name':
                return 'ORDER BY p.name ASC';
            case 'featured':
                return 'ORDER BY p.is_featured DESC, p.created_at DESC';
            default: // newest
                return 'ORDER BY p.created_at DESC';
        }
    }
    /**
     * Helper function to format category name for SEO
     */
    formatCategoryName(slug) {
        return slug
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }
}
exports.ProductsController = ProductsController;
exports.default = new ProductsController();
