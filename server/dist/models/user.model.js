"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const supabaseclient_1 = __importStar(require("../config/supabaseclient"));
class UserModel {
    async createUser(userData) {
        if (!supabaseclient_1.supabaseAdmin) {
            throw new Error('Database not configured');
        }
        // Use supabaseAdmin to bypass Row Level Security
        const { data, error } = await supabaseclient_1.supabaseAdmin
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
    async findUserByEmail(email) {
        if (!supabaseclient_1.default) {
            return null;
        }
        const { data, error } = await supabaseclient_1.default
            .from('users')
            .select('*')
            .eq('email', email)
            .single();
        if (error) {
            if (error.code === 'PGRST116')
                return null; // No rows returned
            console.error('Error finding user by email:', error);
            throw new Error(`Failed to find user: ${error.message}`);
        }
        return data ? this.mapRowToUser(data) : null;
    }
    async findUserByProvider(provider, providerId) {
        if (!supabaseclient_1.default) {
            return null;
        }
        const { data, error } = await supabaseclient_1.default
            .from('users')
            .select('*')
            .eq('provider', provider)
            .eq('provider_id', providerId)
            .single();
        if (error) {
            if (error.code === 'PGRST116')
                return null; // No rows returned
            console.error('Error finding user by provider:', error);
            throw new Error(`Failed to find user: ${error.message}`);
        }
        return data ? this.mapRowToUser(data) : null;
    }
    async updateUser(id, updates) {
        if (!supabaseclient_1.supabaseAdmin) {
            throw new Error('Database not configured');
        }
        const updateData = {
            updated_at: new Date().toISOString()
        };
        if (updates.name)
            updateData.name = updates.name;
        if (updates.avatarUrl)
            updateData.avatar_url = updates.avatarUrl;
        if (updates.provider)
            updateData.provider = updates.provider;
        if (updates.providerId)
            updateData.provider_id = updates.providerId;
        if (updates.isVerified !== undefined)
            updateData.is_verified = updates.isVerified;
        if (updates.phone)
            updateData.phone = updates.phone;
        // Use supabaseAdmin to bypass RLS for updates
        const { data, error } = await supabaseclient_1.supabaseAdmin
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
    async getUserById(id) {
        if (!supabaseclient_1.default) {
            return null;
        }
        const { data, error } = await supabaseclient_1.default
            .from('users')
            .select('*')
            .eq('id', id)
            .single();
        if (error) {
            if (error.code === 'PGRST116')
                return null; // No rows returned
            console.error('Error finding user by ID:', error);
            throw new Error(`Failed to find user: ${error.message}`);
        }
        return data ? this.mapRowToUser(data) : null;
    }
    async deleteUser(id) {
        if (!supabaseclient_1.supabaseAdmin) {
            throw new Error('Database not configured');
        }
        // Use supabaseAdmin to bypass RLS for deletes
        const { error } = await supabaseclient_1.supabaseAdmin
            .from('users')
            .delete()
            .eq('id', id);
        if (error) {
            console.error('Error deleting user:', error);
            throw new Error(`Failed to delete user: ${error.message}`);
        }
        return true;
    }
    mapRowToUser(row) {
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
exports.default = new UserModel();
