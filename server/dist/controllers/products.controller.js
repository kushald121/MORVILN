"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminProductController = void 0;
const supabaseclient_1 = __importDefault(require("../config/supabaseclient"));
class AdminProductController {
    // No constructor needed as we're using the imported supabase client
    constructor() { }
    /**
     * Create a new product with variants and media
     */
    async createProduct(req, res) {
        try {
            const { product, variants, media } = req.body;
            // Validate required fields
            if (!product.name || !product.slug || !product.categoryId) {
                return res.status(400).json({
                    success: false,
                    message: 'Product name, slug, and category are required'
                });
            }
            // 1. Insert the main product
            const { data: newProduct, error: productError } = await supabaseclient_1.default
                .from('products')
                .insert({
                name: product.name,
                slug: product.slug,
                description: product.description,
                short_description: product.shortDescription,
                base_price: product.basePrice,
                compare_at_price: product.compareAtPrice || null,
                cost_price: product.costPrice || null,
                category_id: product.categoryId,
                gender: product.gender,
                tags: product.tags,
                is_featured: product.isFeatured,
                is_active: product.isActive,
                seo_title: product.seoTitle || null,
                seo_description: product.seoDescription || null
            })
                .select()
                .single();
            if (productError) {
                console.error('Create product error:', productError);
                // Handle unique constraint violations
                if (productError.code === '23505') {
                    if (productError.message.includes('products_slug_key')) {
                        return res.status(400).json({
                            success: false,
                            message: 'Product slug already exists'
                        });
                    }
                }
                return res.status(500).json({
                    success: false,
                    message: 'Failed to create product'
                });
            }
            // 2. Insert product variants
            if (variants && variants.length > 0) {
                const variantData = variants.map(variant => ({
                    product_id: newProduct.id,
                    size: variant.size,
                    color: variant.color,
                    color_code: variant.colorCode || null,
                    material: variant.material || null,
                    additional_price: variant.additionalPrice,
                    stock_quantity: variant.stockQuantity,
                    sku: variant.sku,
                    is_active: variant.isActive
                }));
                const { error: variantsError } = await supabaseclient_1.default
                    .from('product_variants')
                    .insert(variantData);
                if (variantsError) {
                    console.error('Create variants error:', variantsError);
                    // Handle unique constraint violations
                    if (variantsError.code === '23505' && variantsError.message.includes('product_variants_sku_key')) {
                        return res.status(400).json({
                            success: false,
                            message: 'SKU already exists'
                        });
                    }
                    // Rollback product creation
                    await supabaseclient_1.default
                        .from('products')
                        .delete()
                        .eq('id', newProduct.id);
                    return res.status(500).json({
                        success: false,
                        message: 'Failed to create product variants'
                    });
                }
            }
            // 3. Insert product media if provided
            if (media && media.length > 0) {
                const mediaData = media.map(mediaItem => ({
                    product_id: newProduct.id,
                    media_url: mediaItem.mediaUrl,
                    cloudinary_public_id: mediaItem.cloudinaryPublicId,
                    media_type: mediaItem.mediaType,
                    alt_text: mediaItem.altText || product.name,
                    is_primary: mediaItem.isPrimary
                }));
                const { error: mediaError } = await supabaseclient_1.default
                    .from('product_media')
                    .insert(mediaData);
                if (mediaError) {
                    console.error('Create media error:', mediaError);
                    // Rollback product and variants creation
                    await supabaseclient_1.default
                        .from('product_variants')
                        .delete()
                        .eq('product_id', newProduct.id);
                    await supabaseclient_1.default
                        .from('products')
                        .delete()
                        .eq('id', newProduct.id);
                    return res.status(500).json({
                        success: false,
                        message: 'Failed to create product media'
                    });
                }
            }
            res.status(201).json({
                success: true,
                message: 'Product created successfully',
                data: {
                    product: newProduct,
                    variantsCount: variants?.length || 0,
                    mediaCount: media?.length || 0
                }
            });
        }
        catch (error) {
            console.error('Create product error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to create product'
            });
        }
    }
    /**
     * Update an existing product
     */
    async updateProduct(req, res) {
        try {
            const productId = req.params.id;
            const { product, variants, media } = req.body;
            // 1. Update the main product
            const { data: updatedProduct, error: productError } = await supabaseclient_1.default
                .from('products')
                .update({
                name: product.name,
                slug: product.slug,
                description: product.description,
                short_description: product.shortDescription,
                base_price: product.basePrice,
                compare_at_price: product.compareAtPrice || null,
                cost_price: product.costPrice || null,
                category_id: product.categoryId,
                gender: product.gender,
                tags: product.tags,
                is_featured: product.isFeatured,
                is_active: product.isActive,
                seo_title: product.seoTitle || null,
                seo_description: product.seoDescription || null,
                updated_at: new Date().toISOString()
            })
                .eq('id', productId)
                .select()
                .single();
            if (productError) {
                console.error('Update product error:', productError);
                if (productError.code === 'PGRST116') { // No rows returned
                    return res.status(404).json({
                        success: false,
                        message: 'Product not found'
                    });
                }
                if (productError.code === '23505' && productError.message.includes('products_slug_key')) {
                    return res.status(400).json({
                        success: false,
                        message: 'Product slug already exists'
                    });
                }
                return res.status(500).json({
                    success: false,
                    message: 'Failed to update product'
                });
            }
            // 2. Delete existing variants and insert new ones
            const { error: deleteVariantsError } = await supabaseclient_1.default
                .from('product_variants')
                .delete()
                .eq('product_id', productId);
            if (deleteVariantsError) {
                console.error('Delete variants error:', deleteVariantsError);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to update product variants'
                });
            }
            if (variants && variants.length > 0) {
                const variantData = variants.map(variant => ({
                    product_id: productId,
                    size: variant.size,
                    color: variant.color,
                    color_code: variant.colorCode || null,
                    material: variant.material || null,
                    additional_price: variant.additionalPrice,
                    stock_quantity: variant.stockQuantity,
                    sku: variant.sku,
                    is_active: variant.isActive
                }));
                const { error: variantsError } = await supabaseclient_1.default
                    .from('product_variants')
                    .insert(variantData);
                if (variantsError) {
                    console.error('Insert variants error:', variantsError);
                    return res.status(500).json({
                        success: false,
                        message: 'Failed to update product variants'
                    });
                }
            }
            // 3. Update media if provided
            if (media && media.length > 0) {
                // Delete existing media
                const { error: deleteMediaError } = await supabaseclient_1.default
                    .from('product_media')
                    .delete()
                    .eq('product_id', productId);
                if (deleteMediaError) {
                    console.error('Delete media error:', deleteMediaError);
                    return res.status(500).json({
                        success: false,
                        message: 'Failed to update product media'
                    });
                }
                // Insert new media
                const mediaData = media.map(mediaItem => ({
                    product_id: productId,
                    media_url: mediaItem.mediaUrl,
                    cloudinary_public_id: mediaItem.cloudinaryPublicId,
                    media_type: mediaItem.mediaType,
                    alt_text: mediaItem.altText || product.name,
                    is_primary: mediaItem.isPrimary
                }));
                const { error: mediaError } = await supabaseclient_1.default
                    .from('product_media')
                    .insert(mediaData);
                if (mediaError) {
                    console.error('Insert media error:', mediaError);
                    return res.status(500).json({
                        success: false,
                        message: 'Failed to update product media'
                    });
                }
            }
            res.json({
                success: true,
                message: 'Product updated successfully',
                data: {
                    product: updatedProduct,
                    variantsCount: variants?.length || 0,
                    mediaCount: media?.length || 0
                }
            });
        }
        catch (error) {
            console.error('Update product error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to update product'
            });
        }
    }
    /**
     * Get all products for admin with pagination
     */
    async getProducts(req, res) {
        try {
            const { page = 1, limit = 10, search, category, status } = req.query;
            const offset = (Number(page) - 1) * Number(limit);
            // Build query
            let query = supabaseclient_1.default
                .from('products')
                .select(`
          *,
          categories(name),
          product_variants(count),
          product_media!inner(media_url)
        `, { count: 'exact' })
                .order('created_at', { ascending: false });
            // Search filter
            if (search && typeof search === 'string') {
                query = query.or(`name.ilike.%${search}%,slug.ilike.%${search}%`);
            }
            // Category filter
            if (category) {
                query = query.eq('category_id', category);
            }
            // Status filter
            if (status === 'active') {
                query = query.eq('is_active', true);
            }
            else if (status === 'inactive') {
                query = query.eq('is_active', false);
            }
            // Pagination
            query = query.range(offset, offset + Number(limit) - 1);
            const { data: products, count: totalCount, error } = await query;
            if (error) {
                console.error('Get products error:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to fetch products',
                });
            }
            const totalPages = Math.ceil((totalCount || 0) / Number(limit));
            res.json({
                success: true,
                data: {
                    products: products || [],
                    pagination: {
                        current_page: Number(page),
                        total_pages: totalPages,
                        total_products: totalCount || 0,
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
            // Get product with related data
            const { data: product, error } = await supabaseclient_1.default
                .from('products')
                .select(`
          *,
          categories(name),
          product_variants(*),
          product_media(*)
        `)
                .eq('id', productId)
                .single();
            if (error) {
                if (error.code === 'PGRST116') { // No rows returned
                    return res.status(404).json({
                        success: false,
                        message: 'Product not found',
                    });
                }
                console.error('Get product error:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to fetch product',
                });
            }
            res.json({
                success: true,
                data: product,
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
        try {
            const productId = req.params.id;
            // Check if product exists
            const { data: productExists, error: checkError } = await supabaseclient_1.default
                .from('products')
                .select('id')
                .eq('id', productId)
                .single();
            if (checkError || !productExists) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found'
                });
            }
            // Delete product (Supabase will handle cascade deletion of variants and media)
            const { error: deleteError } = await supabaseclient_1.default
                .from('products')
                .delete()
                .eq('id', productId);
            if (deleteError) {
                console.error('Delete product error:', deleteError);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to delete product'
                });
            }
            res.json({
                success: true,
                message: 'Product deleted successfully'
            });
        }
        catch (error) {
            console.error('Delete product error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to delete product'
            });
        }
    }
    /**
     * Toggle product status (active/inactive)
     */
    async toggleProductStatus(req, res) {
        try {
            const productId = req.params.id;
            const { isActive } = req.body;
            const { data: updatedProduct, error } = await supabaseclient_1.default
                .from('products')
                .update({
                is_active: isActive,
                updated_at: new Date().toISOString()
            })
                .eq('id', productId)
                .select()
                .single();
            if (error) {
                if (error.code === 'PGRST116') { // No rows returned
                    return res.status(404).json({
                        success: false,
                        message: 'Product not found'
                    });
                }
                console.error('Toggle product status error:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to update product status'
                });
            }
            res.json({
                success: true,
                message: `Product ${isActive ? 'activated' : 'deactivated'} successfully`,
                data: updatedProduct
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
            const { data: categories, error } = await supabaseclient_1.default
                .from('categories')
                .select('id, name, slug, description, image_url')
                .eq('is_active', true)
                .order('name');
            if (error) {
                console.error('Get categories error:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to fetch categories'
                });
            }
            res.json({
                success: true,
                data: categories || []
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
            const { data: categoryData, error: categoryError } = await supabaseclient_1.default
                .from('categories')
                .select('id, name, slug, description')
                .eq('slug', categorySlug)
                .eq('is_active', true)
                .single();
            if (categoryError) {
                if (categoryError.code === 'PGRST116') { // No rows returned
                    return res.status(404).json({
                        success: false,
                        message: 'Category not found'
                    });
                }
                console.error('Get category error:', categoryError);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to fetch category'
                });
            }
            // Then get products in that category
            const { data: products, error: productsError } = await supabaseclient_1.default
                .from('products')
                .select(`
          id, name, slug, short_description, base_price,
          compare_at_price, is_active,
          product_media!inner(media_url),
          categories(name, slug)
        `)
                .eq('categories.slug', categorySlug)
                .eq('is_active', true)
                .order('created_at', { ascending: false })
                .range(offset, offset + Number(limit) - 1);
            if (productsError) {
                console.error('Get products by category error:', productsError);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to fetch products'
                });
            }
            res.json({
                success: true,
                data: {
                    category: categoryData,
                    products: products || []
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
            // Get product with related data
            const { data: product, error } = await supabaseclient_1.default
                .from('products')
                .select(`
          *,
          categories(name, slug),
          product_variants(*),
          product_media(*)
        `)
                .eq('categories.slug', categorySlug)
                .eq('slug', productSlug)
                .eq('is_active', true)
                .single();
            if (error) {
                if (error.code === 'PGRST116') { // No rows returned
                    return res.status(404).json({
                        success: false,
                        message: 'Product not found'
                    });
                }
                console.error('Get product by slug error:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to fetch product'
                });
            }
            res.json({
                success: true,
                data: product
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
