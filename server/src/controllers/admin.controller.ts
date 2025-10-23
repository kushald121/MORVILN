import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import supabase from '../config/supabaseclient';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export class AdminController {
  
  /**
   * Admin Login
   */
  async adminLogin(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
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

      if (error || !admin) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, admin.password_hash);

      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

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
      console.error('Admin login error:', error);
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
}

export default new AdminController();
