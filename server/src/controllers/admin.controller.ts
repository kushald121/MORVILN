import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import supabase from '../config/supabaseclient';
import cloudinary from '../config/cloudinary';
import { Readable } from 'stream';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export class AdminController {
  
  /**
   * Admin Login - Automatically recognizes role (super_admin/content_manager) from database
   */
  async adminLogin(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      console.log('🔐 Admin login attempt:', { email });

      if (!email || !password) {
        console.log('❌ Missing credentials');
        return res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
      }

      // Get admin user from database
      const { data: admin, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', email)
        .eq('is_active', true)
        .single();

      if (error) {
        console.log('❌ Database error:', error);
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      if (!admin) {
        console.log('❌ Admin not found');
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      console.log('✅ Admin found:', { id: admin.id, email: admin.email, role: admin.role });

      // Verify password
      console.log('🔍 Verifying password...');
      const isValidPassword = await bcrypt.compare(password, admin.password_hash);

      if (!isValidPassword) {
        console.log('❌ Invalid password');
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      console.log('✅ Password verified');

      // Update last login
      await supabase
        .from('admin_users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', admin.id);

      // Generate JWT token
      const token = jwt.sign(
        {
          id: admin.id,
          email: admin.email,
          role: admin.role,
          type: 'admin'
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      console.log('✅ Login successful');

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          token,
          admin: {
            id: admin.id,
            username: admin.username,
            email: admin.email,
            role: admin.role
          }
        }
      });

    } catch (error: any) {
      console.error('💥 Admin login error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to login'
      });
    }
  }

  /**
   * Get Dashboard Stats
   */
  async getStats(req: Request, res: Response) {
    try {
      // Get product count
      const { count: productCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      // Get order count and revenue
      const { data: orders } = await supabase
        .from('orders')
        .select('total_amount, payment_status, fulfillment_status');

      const orderCount = orders?.length || 0;
      const totalRevenue = orders
        ?.filter(o => o.payment_status === 'paid')
        .reduce((sum, o) => sum + Number(o.total_amount), 0) || 0;

      const pendingOrders = orders?.filter(o => o.fulfillment_status === 'unfulfilled').length || 0;

      // Get user count
      const { count: userCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      // Get low stock products
      const { data: lowStock } = await supabase
        .from('product_variants')
        .select('product_id, size, stock_quantity')
        .lte('stock_quantity', 5)
        .gt('stock_quantity', 0);

      res.json({
        success: true,
        data: {
          products: {
            total: productCount || 0,
            lowStock: lowStock?.length || 0
          },
          orders: {
            total: orderCount,
            pending: pendingOrders
          },
          revenue: {
            total: totalRevenue.toFixed(2)
          },
          users: {
            total: userCount || 0
          }
        }
      });

    } catch (error: any) {
      console.error('Get stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch stats'
      });
    }
  }

  /**
   * Bulk Update Products
   */
  async bulkUpdateProducts(req: Request, res: Response) {
    try {
      const { productIds, updates } = req.body;

      if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Product IDs are required'
        });
      }

      const updateData: any = {};
      if (updates.price !== undefined) updateData.base_price = updates.price;
      if (updates.stock !== undefined) {
        // For stock, we need to update product_variants
        const { error: variantError } = await supabase
          .from('product_variants')
          .update({ stock_quantity: updates.stock })
          .in('product_id', productIds);

        if (variantError) {
          console.error('Update variants stock error:', variantError);
          return res.status(500).json({
            success: false,
            message: 'Failed to update stock'
          });
        }
      }
      if (updates.discount !== undefined) {
        // Calculate compare_at_price based on discount
        const { data: products } = await supabase
          .from('products')
          .select('id, base_price')
          .in('id', productIds);

        for (const product of products || []) {
          const discountAmount = (Number(product.base_price) * updates.discount) / 100;
          const compareAtPrice = Number(product.base_price) + discountAmount;
          
          await supabase
            .from('products')
            .update({ compare_at_price: compareAtPrice })
            .eq('id', product.id);
        }
      }

      if (Object.keys(updateData).length > 0) {
        updateData.updated_at = new Date().toISOString();

        const { error: updateError } = await supabase
          .from('products')
          .update(updateData)
          .in('id', productIds);

        if (updateError) {
          console.error('Bulk update error:', updateError);
          return res.status(500).json({
            success: false,
            message: 'Failed to update products'
          });
        }
      }

      res.json({
        success: true,
        message: `${productIds.length} product(s) updated successfully`
      });

    } catch (error: any) {
      console.error('Bulk update error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update products'
      });
    }
  }

  /**
   * Bulk Delete Products
   */
  async bulkDeleteProducts(req: Request, res: Response) {
    try {
      const { productIds } = req.body;

      if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Product IDs are required'
        });
      }

      const { error } = await supabase
        .from('products')
        .delete()
        .in('id', productIds);

      if (error) {
        console.error('Bulk delete error:', error);
        return res.status(500).json({
          success: false,
          message: 'Failed to delete products'
        });
      }

      res.json({
        success: true,
        message: `${productIds.length} product(s) deleted successfully`
      });

    } catch (error: any) {
      console.error('Bulk delete error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete products'
      });
    }
  }

  /**
   * Get All Orders (Admin)
   */
  async getAllOrders(req: Request, res: Response) {
    try {
      const { page = 1, limit = 20, status, search } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      let query = supabase
        .from('orders')
        .select('*', { count: 'exact' })
        .order('ordered_at', { ascending: false });

      // Status filter
      if (status && status !== 'all') {
        query = query.eq('fulfillment_status', status);
      }

      // Search filter
      if (search && typeof search === 'string') {
        query = query.or(`order_number.ilike.%${search}%,customer_email.ilike.%${search}%`);
      }

      // Pagination
      query = query.range(offset, offset + Number(limit) - 1);

      const { data: orders, count, error } = await query;

      if (error) {
        console.error('Get orders error:', error);
        return res.status(500).json({
          success: false,
          message: 'Failed to fetch orders'
        });
      }

      res.json({
        success: true,
        data: {
          orders: orders || [],
          pagination: {
            total: count || 0,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil((count || 0) / Number(limit))
          }
        }
      });

    } catch (error: any) {
      console.error('Get orders error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch orders'
      });
    }
  }

  /**
   * Update Order Status
   */
  async updateOrderStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;

      if (!status) {
        return res.status(400).json({
          success: false,
          message: 'Status is required'
        });
      }

      const updateData: any = {
        fulfillment_status: status,
        updated_at: new Date().toISOString()
      };

      if (status === 'fulfilled') {
        updateData.fulfilled_at = new Date().toISOString();
        updateData.payment_status = 'paid';
        updateData.paid_at = new Date().toISOString();
      }

      const { data: order, error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Update order status error:', error);
        return res.status(500).json({
          success: false,
          message: 'Failed to update order status'
        });
      }

      // Log status change
      await supabase
        .from('order_status_history')
        .insert({
          order_id: id,
          status_type: 'fulfillment',
          new_status: status,
          changed_by_type: 'admin',
          notes: notes || null
        });

      res.json({
        success: true,
        message: 'Order status updated successfully',
        data: order
      });

    } catch (error: any) {
      console.error('Update order status error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update order status'
      });
    }
  }

  /**
   * Create Product with Cloudinary Upload
   */
  async createProductWithUpload(req: Request, res: Response) {
    try {
      console.log('📦 Creating product with file uploads...');
      
      const files = req.files as Express.Multer.File[];
      const {
        name,
        description,
        shortDescription,
        price,
        compareAtPrice,
        costPrice,
        stock,
        gender,
        sizes, // Can be comma-separated string or array
        colors, // Can be comma-separated string or array
        discount,
        category, // This should be category UUID from client
        tags, // Comma-separated string
        isFeatured,
        seoTitle,
        seoDescription
      } = req.body;

      // Validate required fields
      if (!name || !price) {
        return res.status(400).json({
          success: false,
          message: 'Product name and price are required'
        });
      }

      console.log('📝 Product data:', { name, price, stock, gender, category, sizes, colors });
      console.log('📁 Files received:', files?.length || 0);

      // Upload images to Cloudinary
      const uploadedMedia: any[] = [];
      
      if (files && files.length > 0) {
        console.log('☁️  Uploading to Cloudinary...');
        
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          
          try {
            // Upload to Cloudinary using buffer
            const uploadResult = await new Promise((resolve, reject) => {
              const uploadStream = cloudinary.uploader.upload_stream(
                {
                  folder: 'products',
                  resource_type: 'auto',
                  transformation: [
                    { width: 1000, height: 1000, crop: 'limit' },
                    { quality: 'auto' }
                  ]
                },
                (error, result) => {
                  if (error) reject(error);
                  else resolve(result);
                }
              );

              // Create readable stream from buffer
              const bufferStream = new Readable();
              bufferStream.push(file.buffer);
              bufferStream.push(null);
              bufferStream.pipe(uploadStream);
            });

            console.log(`✅ Uploaded image ${i + 1}/${files.length}`);
            
            uploadedMedia.push({
              media_url: (uploadResult as any).secure_url,
              cloudinary_public_id: (uploadResult as any).public_id,
              media_type: file.mimetype.startsWith('video') ? 'video' : 'image',
              is_primary: i === 0, // First image is primary
              sort_order: i
            });
          } catch (uploadError) {
            console.error('Cloudinary upload error:', uploadError);
            throw new Error(`Failed to upload image ${i + 1}`);
          }
        }
      }

      // Generate slug from name
      const slug = name.toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .replace(/--+/g, '-');

      // Add timestamp to make slug unique
      const uniqueSlug = `${slug}-${Date.now()}`;

      // Parse sizes array (handle both string and array)
      let sizesArray: string[] = [];
      if (sizes) {
        if (typeof sizes === 'string') {
          // Split by comma if it's a string
          sizesArray = sizes.split(',').map(s => s.trim()).filter(Boolean);
        } else if (Array.isArray(sizes)) {
          sizesArray = sizes;
        }
      }
      
      // If no sizes provided, use a default
      if (sizesArray.length === 0) {
        sizesArray = ['One Size'];
      }

      // Parse colors array (handle both string and array)
      let colorsArray: string[] = [];
      if (colors) {
        if (typeof colors === 'string') {
          colorsArray = colors.split(',').map(c => c.trim()).filter(Boolean);
        } else if (Array.isArray(colors)) {
          colorsArray = colors;
        }
      }
      
      // If no colors provided, use default
      if (colorsArray.length === 0) {
        colorsArray = ['Default'];
      }

      // Parse tags array from comma-separated string
      let tagsArray: string[] = [];
      if (tags && typeof tags === 'string') {
        tagsArray = tags.split(',').map(t => t.trim()).filter(Boolean);
      }

      // Use provided compareAtPrice or calculate from discount
      let finalCompareAtPrice = null;
      if (compareAtPrice && parseFloat(compareAtPrice) > 0) {
        finalCompareAtPrice = parseFloat(compareAtPrice);
      } else if (discount && parseFloat(discount) > 0) {
        // Calculate original price from base price and discount
        const discountPercent = parseFloat(discount);
        const basePrice = parseFloat(price);
        finalCompareAtPrice = basePrice / (1 - discountPercent / 100);
      }

      // Get category ID - if it's a string name, find it in categories table
      let categoryId = category;
      if (category && !category.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        // It's a category name, find the ID
        const { data: categoryData } = await supabase
          .from('categories')
          .select('id')
          .ilike('name', category)
          .single();
        
        categoryId = categoryData?.id || null;
      }

      // Normalize gender to lowercase (database expects: 'men', 'women', 'unisex', 'kids')
      const normalizedGender = gender ? gender.toLowerCase() : 'unisex';
      
      // Validate gender value
      const validGenders = ['men', 'women', 'unisex', 'kids'];
      const finalGender = validGenders.includes(normalizedGender) ? normalizedGender : 'unisex';

      // 1. Insert the main product
      const { data: newProduct, error: productError } = await supabase
        .from('products')
        .insert({
          name,
          slug: uniqueSlug,
          description: description || '',
          short_description: shortDescription || description?.substring(0, 200) || '',
          base_price: parseFloat(price),
          compare_at_price: finalCompareAtPrice,
          cost_price: costPrice ? parseFloat(costPrice) : null,
          category_id: categoryId || null,
          gender: finalGender,
          tags: tagsArray.length > 0 ? tagsArray : null,
          is_featured: isFeatured === 'true' || isFeatured === true,
          is_active: true,
          seo_title: seoTitle || name,
          seo_description: seoDescription || description?.substring(0, 160) || ''
        })
        .select()
        .single();

      if (productError) {
        console.error('❌ Create product error:', productError);
        
        // Cleanup uploaded images
        for (const media of uploadedMedia) {
          try {
            await cloudinary.uploader.destroy(media.cloudinary_public_id);
          } catch (e) {
            console.error('Failed to cleanup image:', e);
          }
        }

        if (productError.code === '23505') {
          return res.status(400).json({
            success: false,
            message: 'Product slug already exists'
          });
        }

        return res.status(500).json({
          success: false,
          message: 'Failed to create product',
          error: productError.message
        });
      }

      console.log('✅ Product created:', newProduct.id);

      // 2. Insert product variants (one for each size+color combination)
      const stockPerVariant = stock 
        ? Math.floor(parseInt(stock) / (sizesArray.length * colorsArray.length)) 
        : 0;
      
      const variantData = [];
      let variantIndex = 0;
      
      for (const size of sizesArray) {
        for (const color of colorsArray) {
          variantData.push({
            product_id: newProduct.id,
            sku: `${uniqueSlug}-${size.toLowerCase().replace(/\s+/g, '-')}-${color.toLowerCase().replace(/\s+/g, '-')}-${variantIndex}`,
            size,
            color,
            color_code: null, // Can be enhanced to accept color codes from form
            material: null,
            additional_price: 0,
            stock_quantity: stockPerVariant,
            reserved_quantity: 0,
            low_stock_threshold: 5,
            is_active: true
          });
          variantIndex++;
        }
      }

      const { data: createdVariants, error: variantsError } = await supabase
        .from('product_variants')
        .insert(variantData)
        .select();

      if (variantsError) {
        console.error('❌ Create variants error:', variantsError);
        
        // Rollback product
        await supabase.from('products').delete().eq('id', newProduct.id);
        
        // Cleanup images
        for (const media of uploadedMedia) {
          try {
            await cloudinary.uploader.destroy(media.cloudinary_public_id);
          } catch (e) {
            console.error('Failed to cleanup image:', e);
          }
        }

        return res.status(500).json({
          success: false,
          message: 'Failed to create product variants',
          error: variantsError.message
        });
      }

      console.log(`✅ Created ${variantData.length} variants (${sizesArray.length} sizes × ${colorsArray.length} colors)`);

      // 3. Insert product media (link to product, not specific variants for now)
      if (uploadedMedia.length > 0) {
        const mediaData = uploadedMedia.map(media => ({
          product_id: newProduct.id,
          variant_id: null, // Can be updated later to link to specific variants
          media_url: media.media_url,
          cloudinary_public_id: media.cloudinary_public_id,
          media_type: media.media_type,
          alt_text: name,
          sort_order: media.sort_order,
          is_primary: media.is_primary
        }));

        const { error: mediaError } = await supabase
          .from('product_media')
          .insert(mediaData);

        if (mediaError) {
          console.error('❌ Create media error:', mediaError);
          
          // Rollback
          await supabase.from('product_variants').delete().eq('product_id', newProduct.id);
          await supabase.from('products').delete().eq('id', newProduct.id);
          
          // Cleanup images
          for (const media of uploadedMedia) {
            try {
              await cloudinary.uploader.destroy(media.cloudinary_public_id);
            } catch (e) {
              console.error('Failed to cleanup image:', e);
            }
          }

          return res.status(500).json({
            success: false,
            message: 'Failed to create product media',
            error: mediaError.message
          });
        }

        console.log(`✅ Created ${uploadedMedia.length} media records`);
      }

      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: {
          product: newProduct,
          variants: createdVariants,
          mediaCount: uploadedMedia.length
        }
      });

    } catch (error: any) {
      console.error('💥 Create product error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to create product'
      });
    }
  }
}

export default new AdminController();
