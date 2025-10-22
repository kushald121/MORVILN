"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminProductController = void 0;
const pg_1 = require("pg");
class AdminProductController {
    constructor() {
        this.pool = new pg_1.Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false }
        });
    }
    /**
     * Create a new product with variants and media
     */
    async createProduct(req, res) {
        const client = await this.pool.connect();
        try {
            const { product, variants, media } = req.body;
            // Validate required fields
            if (!product.name || !product.slug || !product.categoryId) {
                return res.status(400).json({
                    success: false,
                    message: 'Product name, slug, and category are required'
                });
            }
            await client.query('BEGIN');
            // 1. Insert the main product
            const productQuery = `
        INSERT INTO products (
          name, slug, description, short_description, base_price, 
          compare_at_price, cost_price, category_id, gender, tags,
          is_featured, is_active, seo_title, seo_description
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING *
      `;
            const productValues = [
                product.name,
                product.slug,
                product.description,
                product.shortDescription,
                product.basePrice,
                product.compareAtPrice || null,
                product.costPrice || null,
                product.categoryId,
                product.gender,
                product.tags,
                product.isFeatured,
                product.isActive,
                product.seoTitle || null,
                product.seoDescription || null
            ];
            const productResult = await client.query(productQuery, productValues);
            const newProduct = productResult.rows[0];
            // 2. Insert product variants
            for (const variant of variants) {
                const variantQuery = `
          INSERT INTO product_variants (
            product_id, size, color, color_code, material,
            additional_price, stock_quantity, sku, is_active
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          RETURNING *
        `;
                const variantValues = [
                    newProduct.id,
                    variant.size,
                    variant.color,
                    variant.colorCode || null,
                    variant.material || null,
                    variant.additionalPrice,
                    variant.stockQuantity,
                    variant.sku,
                    variant.isActive
                ];
                await client.query(variantQuery, variantValues);
            }
            // 3. Insert product media if provided
            if (media && media.length > 0) {
                for (const mediaItem of media) {
                    const mediaQuery = `
            INSERT INTO product_media (
              product_id, media_url, cloudinary_public_id, 
              media_type, alt_text, is_primary
            ) VALUES ($1, $2, $3, $4, $5, $6)
          `;
                    const mediaValues = [
                        newProduct.id,
                        mediaItem.mediaUrl,
                        mediaItem.cloudinaryPublicId,
                        mediaItem.mediaType,
                        mediaItem.altText || product.name,
                        mediaItem.isPrimary
                    ];
                    await client.query(mediaQuery, mediaValues);
                }
            }
            await client.query('COMMIT');
            res.status(201).json({
                success: true,
                message: 'Product created successfully',
                data: {
                    product: newProduct,
                    variantsCount: variants.length,
                    mediaCount: media?.length || 0
                }
            });
        }
        catch (error) {
            await client.query('ROLLBACK');
            console.error('Create product error:', error);
            // Handle unique constraint violations
            if (error.code === '23505') {
                if (error.constraint === 'products_slug_key') {
                    return res.status(400).json({
                        success: false,
                        message: 'Product slug already exists'
                    });
                }
                if (error.constraint === 'product_variants_sku_key') {
                    return res.status(400).json({
                        success: false,
                        message: 'SKU already exists'
                    });
                }
            }
            res.status(500).json({
                success: false,
                message: 'Failed to create product'
            });
        }
        finally {
            client.release();
        }
    }
    /**
     * Update an existing product
     */
    async updateProduct(req, res) {
        const client = await this.pool.connect();
        try {
            const productId = req.params.id;
            const { product, variants, media } = req.body;
            await client.query('BEGIN');
            // 1. Update the main product
            const productQuery = `
        UPDATE products 
        SET 
          name = $1, slug = $2, description = $3, short_description = $4,
          base_price = $5, compare_at_price = $6, cost_price = $7,
          category_id = $8, gender = $9, tags = $10, is_featured = $11,
          is_active = $12, seo_title = $13, seo_description = $14,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $15
        RETURNING *
      `;
            const productValues = [
                product.name,
                product.slug,
                product.description,
                product.shortDescription,
                product.basePrice,
                product.compareAtPrice || null,
                product.costPrice || null,
                product.categoryId,
                product.gender,
                product.tags,
                product.isFeatured,
                product.isActive,
                product.seoTitle || null,
                product.seoDescription || null,
                productId
            ];
            const productResult = await client.query(productQuery, productValues);
            if (productResult.rows.length === 0) {
                await client.query('ROLLBACK');
                return res.status(404).json({
                    success: false,
                    message: 'Product not found'
                });
            }
            const updatedProduct = productResult.rows[0];
            // 2. Delete existing variants and insert new ones
            await client.query('DELETE FROM product_variants WHERE product_id = $1', [productId]);
            for (const variant of variants) {
                const variantQuery = `
          INSERT INTO product_variants (
            product_id, size, color, color_code, material,
            additional_price, stock_quantity, sku, is_active
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `;
                const variantValues = [
                    productId,
                    variant.size,
                    variant.color,
                    variant.colorCode || null,
                    variant.material || null,
                    variant.additionalPrice,
                    variant.stockQuantity,
                    variant.sku,
                    variant.isActive
                ];
                await client.query(variantQuery, variantValues);
            }
            // 3. Update media if provided
            if (media && media.length > 0) {
                // Delete existing media and insert new ones
                await client.query('DELETE FROM product_media WHERE product_id = $1', [productId]);
                for (const mediaItem of media) {
                    const mediaQuery = `
            INSERT INTO product_media (
              product_id, media_url, cloudinary_public_id, 
              media_type, alt_text, is_primary
            ) VALUES ($1, $2, $3, $4, $5, $6)
          `;
                    const mediaValues = [
                        productId,
                        mediaItem.mediaUrl,
                        mediaItem.cloudinaryPublicId,
                        mediaItem.mediaType,
                        mediaItem.altText || product.name,
                        mediaItem.isPrimary
                    ];
                    await client.query(mediaQuery, mediaValues);
                }
            }
            await client.query('COMMIT');
            res.json({
                success: true,
                message: 'Product updated successfully',
                data: {
                    product: updatedProduct,
                    variantsCount: variants.length,
                    mediaCount: media?.length || 0
                }
            });
        }
        catch (error) {
            await client.query('ROLLBACK');
            console.error('Update product error:', error);
            if (error.code === '23505') {
                if (error.constraint === 'products_slug_key') {
                    return res.status(400).json({
                        success: false,
                        message: 'Product slug already exists'
                    });
                }
            }
            res.status(500).json({
                success: false,
                message: 'Failed to update product'
            });
        }
        finally {
            client.release();
        }
    }
    /**
     * Get all products for admin with pagination
     */
    async getProducts(req, res) {
        try {
            const { page = 1, limit = 10, search, category, status } = req.query;
            const offset = (Number(page) - 1) * Number(limit);
            let whereClause = 'WHERE 1=1';
            const queryParams = [];
            let paramCount = 1;
            // Search filter
            if (search) {
                whereClause += ` AND (p.name ILIKE $${paramCount} OR p.slug ILIKE $${paramCount})`;
                queryParams.push(`%${search}%`);
                paramCount++;
            }
            // Category filter
            if (category) {
                whereClause += ` AND p.category_id = $${paramCount}`;
                queryParams.push(category);
                paramCount++;
            }
            // Status filter
            if (status === 'active') {
                whereClause += ` AND p.is_active = true`;
            }
            else if (status === 'inactive') {
                whereClause += ` AND p.is_active = false`;
            }
            const query = `
        SELECT 
          p.*,
          c.name as category_name,
          (
            SELECT COUNT(*) 
            FROM product_variants pv 
            WHERE pv.product_id = p.id
          ) as variants_count,
          (
            SELECT pm.media_url 
            FROM product_media pm 
            WHERE pm.product_id = p.id AND pm.is_primary = true 
            LIMIT 1
          ) as primary_image,
          COUNT(*) OVER() as total_count
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        ${whereClause}
        ORDER BY p.created_at DESC
        LIMIT $${paramCount} OFFSET $${paramCount + 1}
      `;
            queryParams.push(Number(limit), offset);
            const result = await this.pool.query(query, queryParams);
            const totalCount = result.rows.length > 0 ? Number(result.rows[0].total_count) : 0;
            const totalPages = Math.ceil(totalCount / Number(limit));
            res.json({
                success: true,
                data: {
                    products: result.rows,
                    pagination: {
                        current_page: Number(page),
                        total_pages: totalPages,
                        total_products: totalCount,
                        has_next: Number(page) < totalPages,
                        has_prev: Number(page) > 1,
                    },
                },
            });
        }
        catch (error) {
            console.error('Get products error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch products',
            });
        }
    }
    /**
     * Get single product for admin (with all details)
     */
    async getProduct(req, res) {
        try {
            const productId = req.params.id;
            const query = `
        SELECT 
          p.*,
          c.name as category_name,
          json_agg(
            DISTINCT jsonb_build_object(
              'id', pv.id,
              'size', pv.size,
              'color', pv.color,
              'color_code', pv.color_code,
              'material', pv.material,
              'additional_price', pv.additional_price,
              'stock_quantity', pv.stock_quantity,
              'sku', pv.sku,
              'is_active', pv.is_active
            )
          ) as variants,
          json_agg(
            DISTINCT jsonb_build_object(
              'id', pm.id,
              'media_url', pm.media_url,
              'cloudinary_public_id', pm.cloudinary_public_id,
              'media_type', pm.media_type,
              'alt_text', pm.alt_text,
              'is_primary', pm.is_primary
            )
          ) as media
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN product_variants pv ON p.id = pv.product_id
        LEFT JOIN product_media pm ON p.id = pm.product_id
        WHERE p.id = $1
        GROUP BY p.id, c.name
      `;
            const result = await this.pool.query(query, [productId]);
            if (result.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found',
                });
            }
            res.json({
                success: true,
                data: result.rows[0],
            });
        }
        catch (error) {
            console.error('Get product error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch product',
            });
        }
    }
    /**
     * Delete a product
     */
    async deleteProduct(req, res) {
        const client = await this.pool.connect();
        try {
            const productId = req.params.id;
            await client.query('BEGIN');
            // Check if product exists
            const productCheck = await client.query('SELECT id FROM products WHERE id = $1', [productId]);
            if (productCheck.rows.length === 0) {
                await client.query('ROLLBACK');
                return res.status(404).json({
                    success: false,
                    message: 'Product not found'
                });
            }
            // Delete product (cascade will handle variants and media)
            await client.query('DELETE FROM products WHERE id = $1', [productId]);
            await client.query('COMMIT');
            res.json({
                success: true,
                message: 'Product deleted successfully'
            });
        }
        catch (error) {
            await client.query('ROLLBACK');
            console.error('Delete product error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to delete product'
            });
        }
        finally {
            client.release();
        }
    }
    /**
     * Toggle product status (active/inactive)
     */
    async toggleProductStatus(req, res) {
        try {
            const productId = req.params.id;
            const { isActive } = req.body;
            const query = `
        UPDATE products 
        SET is_active = $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING *
      `;
            const result = await this.pool.query(query, [isActive, productId]);
            if (result.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found'
                });
            }
            res.json({
                success: true,
                message: `Product ${isActive ? 'activated' : 'deactivated'} successfully`,
                data: result.rows[0]
            });
        }
        catch (error) {
            console.error('Toggle product status error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to update product status'
            });
        }
    }
    /**
     * Get all categories for SEO-friendly routes
     */
    async getCategories(req, res) {
        try {
            const query = `
        SELECT id, name, slug, description, image_url
        FROM categories
        WHERE is_active = true
        ORDER BY name
      `;
            const result = await this.pool.query(query);
            res.json({
                success: true,
                data: result.rows
            });
        }
        catch (error) {
            console.error('Get categories error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch categories'
            });
        }
    }
    /**
     * Get products by category for SEO-friendly routes
     */
    async getProductsByCategory(req, res) {
        try {
            const categorySlug = req.params.category;
            const { page = 1, limit = 12 } = req.query;
            const offset = (Number(page) - 1) * Number(limit);
            // First get category info
            const categoryQuery = `
        SELECT id, name, slug, description
        FROM categories
        WHERE slug = $1 AND is_active = true
      `;
            const categoryResult = await this.pool.query(categoryQuery, [categorySlug]);
            if (categoryResult.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Category not found'
                });
            }
            const category = categoryResult.rows[0];
            // Then get products in that category
            const productsQuery = `
        SELECT 
          p.id, p.name, p.slug, p.short_description, p.base_price,
          p.compare_at_price, p.is_active,
          pm.media_url as primary_image,
          c.name as category_name, c.slug as category_slug
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN product_media pm ON p.id = pm.product_id AND pm.is_primary = true
        WHERE c.slug = $1 AND p.is_active = true
        ORDER BY p.created_at DESC
        LIMIT $2 OFFSET $3
      `;
            const productsResult = await this.pool.query(productsQuery, [categorySlug, limit, offset]);
            res.json({
                success: true,
                data: {
                    category,
                    products: productsResult.rows
                }
            });
        }
        catch (error) {
            console.error('Get products by category error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch products'
            });
        }
    }
    /**
     * Get product by slug for SEO-friendly routes
     */
    async getProductBySlug(req, res) {
        try {
            const categorySlug = req.params.category;
            const productSlug = req.params.slug;
            const query = `
        SELECT 
          p.*,
          c.name as category_name, c.slug as category_slug,
          json_agg(
            DISTINCT jsonb_build_object(
              'id', pv.id,
              'size', pv.size,
              'color', pv.color,
              'color_code', pv.color_code,
              'material', pv.material,
              'additional_price', pv.additional_price,
              'stock_quantity', pv.stock_quantity,
              'sku', pv.sku,
              'is_active', pv.is_active
            )
          ) as variants,
          json_agg(
            DISTINCT jsonb_build_object(
              'id', pm.id,
              'media_url', pm.media_url,
              'cloudinary_public_id', pm.cloudinary_public_id,
              'media_type', pm.media_type,
              'alt_text', pm.alt_text,
              'is_primary', pm.is_primary
            )
          ) as media
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN product_variants pv ON p.id = pv.product_id
        LEFT JOIN product_media pm ON p.id = pm.product_id
        WHERE c.slug = $1 AND p.slug = $2 AND p.is_active = true
        GROUP BY p.id, c.name, c.slug
      `;
            const result = await this.pool.query(query, [categorySlug, productSlug]);
            if (result.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found'
                });
            }
            res.json({
                success: true,
                data: result.rows[0]
            });
        }
        catch (error) {
            console.error('Get product by slug error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch product'
            });
        }
    }
}
exports.AdminProductController = AdminProductController;
exports.default = new AdminProductController();
