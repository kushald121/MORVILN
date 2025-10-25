import { Request, Response } from 'express';
import supabase from '../config/database';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

// Get all addresses for current user
export const getUserAddresses = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const { data, error } = await supabase
      .from('user_addresses')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return res.status(200).json({
      success: true,
      addresses: data || [],
    });
  } catch (error) {
    console.error('Error fetching addresses:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch addresses',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Get specific address by ID
export const getAddressById = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const { data, error } = await supabase
      .from('user_addresses')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      return res.status(404).json({
        success: false,
        message: 'Address not found',
      });
    }

    return res.status(200).json({
      success: true,
      address: data,
    });
  } catch (error) {
    console.error('Error fetching address:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch address',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Create new address
export const createAddress = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const {
      label,
      full_name,
      phone,
      address_line_1,
      address_line_2,
      landmark,
      city,
      state,
      postal_code,
      country = 'India',
      is_default = false,
    } = req.body;

    // Validate required fields
    if (!full_name || !phone || !address_line_1 || !city || !state || !postal_code) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    // If this is set as default, unset all other defaults for this user
    if (is_default) {
      await supabase
        .from('user_addresses')
        .update({ is_default: false })
        .eq('user_id', userId);
    }

    const { data, error } = await supabase
      .from('user_addresses')
      .insert({
        user_id: userId,
        label,
        full_name,
        phone,
        address_line_1,
        address_line_2,
        landmark,
        city,
        state,
        postal_code,
        country,
        is_default,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return res.status(201).json({
      success: true,
      message: 'Address created successfully',
      address: data,
    });
  } catch (error) {
    console.error('Error creating address:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create address',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Update address
export const updateAddress = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const {
      label,
      full_name,
      phone,
      address_line_1,
      address_line_2,
      landmark,
      city,
      state,
      postal_code,
      country,
      is_default,
    } = req.body;

    // Check if address exists and belongs to user
    const { data: existingAddress } = await supabase
      .from('user_addresses')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (!existingAddress) {
      return res.status(404).json({
        success: false,
        message: 'Address not found',
      });
    }

    // If this is set as default, unset all other defaults for this user
    if (is_default) {
      await supabase
        .from('user_addresses')
        .update({ is_default: false })
        .eq('user_id', userId)
        .neq('id', id);
    }

    // Build update object with only provided fields
    const updateData: any = {};
    if (label !== undefined) updateData.label = label;
    if (full_name !== undefined) updateData.full_name = full_name;
    if (phone !== undefined) updateData.phone = phone;
    if (address_line_1 !== undefined) updateData.address_line_1 = address_line_1;
    if (address_line_2 !== undefined) updateData.address_line_2 = address_line_2;
    if (landmark !== undefined) updateData.landmark = landmark;
    if (city !== undefined) updateData.city = city;
    if (state !== undefined) updateData.state = state;
    if (postal_code !== undefined) updateData.postal_code = postal_code;
    if (country !== undefined) updateData.country = country;
    if (is_default !== undefined) updateData.is_default = is_default;

    const { data, error } = await supabase
      .from('user_addresses')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return res.status(200).json({
      success: true,
      message: 'Address updated successfully',
      address: data,
    });
  } catch (error) {
    console.error('Error updating address:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update address',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Delete address
export const deleteAddress = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const { error } = await supabase
      .from('user_addresses')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      throw error;
    }

    return res.status(200).json({
      success: true,
      message: 'Address deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting address:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete address',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Set default address
export const setDefaultAddress = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    // Check if address exists and belongs to user
    const { data: existingAddress } = await supabase
      .from('user_addresses')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (!existingAddress) {
      return res.status(404).json({
        success: false,
        message: 'Address not found',
      });
    }

    // Unset all defaults for this user
    await supabase
      .from('user_addresses')
      .update({ is_default: false })
      .eq('user_id', userId);

    // Set this address as default
    const { data, error } = await supabase
      .from('user_addresses')
      .update({ is_default: true })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return res.status(200).json({
      success: true,
      message: 'Default address set successfully',
      address: data,
    });
  } catch (error) {
    console.error('Error setting default address:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to set default address',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
