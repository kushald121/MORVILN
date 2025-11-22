import supabase, { supabaseAdmin } from '../config/supabaseclient';

export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash?: string;
  phone?: string;
  avatarUrl?: string;
  provider: 'google' | 'facebook' | 'email' | 'instagram';
  providerId?: string;
  isVerified: boolean;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInput {
  email: string;
  name: string;
  passwordHash?: string;
  phone?: string;
  avatarUrl?: string;
  provider?: 'google' | 'facebook' | 'email' | 'instagram';
  providerId?: string;
  isVerified?: boolean;
}

class UserModel {
  async createUser(userData: CreateUserInput): Promise<User> {
    if (!supabaseAdmin) {
      throw new Error('Database not configured');
    }
    
    // Use supabaseAdmin to bypass Row Level Security
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert({
        email: userData.email,
        name: userData.name,
        password_hash: userData.passwordHash,
        phone: userData.phone,
        avatar_url: userData.avatarUrl,
        provider: userData.provider || 'email',
        provider_id: userData.providerId,
        is_verified: userData.isVerified !== undefined ? userData.isVerified : false,
        is_active: true
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating user:', error);
      throw new Error(`Failed to create user: ${error.message}`);
    }

    return this.mapRowToUser(data);
  }

  async findUserByEmail(email: string): Promise<User | null> {
    if (!supabase) {
      return null;
    }
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null; // No rows returned
      console.error('Error finding user by email:', error);
      throw new Error(`Failed to find user: ${error.message}`);
    }

    return data ? this.mapRowToUser(data) : null;
  }

  async findUserByProvider(provider: string, providerId: string): Promise<User | null> {
    if (!supabase) {
      return null;
    }
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('provider', provider)
      .eq('provider_id', providerId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null; // No rows returned
      console.error('Error finding user by provider:', error);
      throw new Error(`Failed to find user: ${error.message}`);
    }

    return data ? this.mapRowToUser(data) : null;
  }

  async updateUser(id: string, updates: Partial<CreateUserInput>): Promise<User> {
    if (!supabaseAdmin) {
      throw new Error('Database not configured');
    }
    
    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (updates.name) updateData.name = updates.name;
    if (updates.avatarUrl) updateData.avatar_url = updates.avatarUrl;
    if (updates.provider) updateData.provider = updates.provider;
    if (updates.providerId) updateData.provider_id = updates.providerId;
    if (updates.isVerified !== undefined) updateData.is_verified = updates.isVerified;
    if (updates.phone) updateData.phone = updates.phone;

    // Use supabaseAdmin to bypass RLS for updates
    const { data, error } = await supabaseAdmin
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating user:', error);
      throw new Error(`Failed to update user: ${error.message}`);
    }

    return this.mapRowToUser(data);
  }

  async getUserById(id: string): Promise<User | null> {
    if (!supabase) {
      return null;
    }
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null; // No rows returned
      console.error('Error finding user by ID:', error);
      throw new Error(`Failed to find user: ${error.message}`);
    }

    return data ? this.mapRowToUser(data) : null;
  }

  async deleteUser(id: string): Promise<boolean> {
    if (!supabaseAdmin) {
      throw new Error('Database not configured');
    }
    
    // Use supabaseAdmin to bypass RLS for deletes
    const { error } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting user:', error);
      throw new Error(`Failed to delete user: ${error.message}`);
    }

    return true;
  }

  private mapRowToUser(row: any): User {
    return {
      id: row.id,
      email: row.email,
      name: row.name,
      passwordHash: row.password_hash,
      phone: row.phone,
      avatarUrl: row.avatar_url,
      provider: row.provider,
      providerId: row.provider_id,
      isVerified: row.is_verified,
      isActive: row.is_active,
      lastLogin: row.last_login ? new Date(row.last_login) : undefined,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }
}

export default new UserModel();