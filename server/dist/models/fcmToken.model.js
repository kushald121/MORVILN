"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supabaseclient_1 = __importDefault(require("../config/supabaseclient"));
class FCMTokenModel {
    async createOrUpdateToken(data) {
        // First try to update existing token
        const { data: existingToken, error: findError } = await supabaseclient_1.default
            .from('fcm_tokens')
            .select('*')
            .eq('token', data.token)
            .single();
        if (existingToken && !findError) {
            // Update existing token
            const { data: updatedToken, error: updateError } = await supabaseclient_1.default
                .from('fcm_tokens')
                .update({
                user_id: data.userId,
                device_name: data.deviceName || null,
                device_type: data.deviceType || null,
                is_active: true,
                updated_at: new Date().toISOString()
            })
                .eq('token', data.token)
                .select()
                .single();
            if (updateError) {
                console.error('Error updating FCM token:', updateError);
                throw new Error(`Failed to update FCM token: ${updateError.message}`);
            }
            return this.mapRowToToken(updatedToken);
        }
        else {
            // Create new token
            const { data: newToken, error: insertError } = await supabaseclient_1.default
                .from('fcm_tokens')
                .insert({
                user_id: data.userId,
                token: data.token,
                device_name: data.deviceName || null,
                device_type: data.deviceType || null,
                is_active: true
            })
                .select()
                .single();
            if (insertError) {
                console.error('Error creating FCM token:', insertError);
                throw new Error(`Failed to create FCM token: ${insertError.message}`);
            }
            return this.mapRowToToken(newToken);
        }
    }
    async getTokensByUserId(userId) {
        const { data, error } = await supabaseclient_1.default
            .from('fcm_tokens')
            .select('*')
            .eq('user_id', userId)
            .eq('is_active', true);
        if (error) {
            console.error('Error getting FCM tokens by user ID:', error);
            throw new Error(`Failed to get FCM tokens: ${error.message}`);
        }
        return (data || []).map((row) => this.mapRowToToken(row));
    }
    async getAllActiveTokens() {
        const { data, error } = await supabaseclient_1.default
            .from('fcm_tokens')
            .select('*')
            .eq('is_active', true);
        if (error) {
            console.error('Error getting all active FCM tokens:', error);
            throw new Error(`Failed to get active FCM tokens: ${error.message}`);
        }
        return (data || []).map((row) => this.mapRowToToken(row));
    }
    async deleteToken(token) {
        const { error } = await supabaseclient_1.default
            .from('fcm_tokens')
            .delete()
            .eq('token', token);
        if (error) {
            console.error('Error deleting FCM token:', error);
            throw new Error(`Failed to delete FCM token: ${error.message}`);
        }
        return true;
    }
    async deactivateToken(token) {
        const { error } = await supabaseclient_1.default
            .from('fcm_tokens')
            .update({ is_active: false, updated_at: new Date().toISOString() })
            .eq('token', token);
        if (error) {
            console.error('Error deactivating FCM token:', error);
            throw new Error(`Failed to deactivate FCM token: ${error.message}`);
        }
        return true;
    }
    async deactivateAllUserTokens(userId) {
        const { data, error } = await supabaseclient_1.default
            .from('fcm_tokens')
            .update({ is_active: false, updated_at: new Date().toISOString() })
            .eq('user_id', userId)
            .select('id');
        if (error) {
            console.error('Error deactivating all user FCM tokens:', error);
            throw new Error(`Failed to deactivate user FCM tokens: ${error.message}`);
        }
        return data?.length || 0;
    }
    mapRowToToken(row) {
        return {
            id: row.id,
            userId: row.user_id,
            token: row.token,
            deviceName: row.device_name,
            deviceType: row.device_type,
            isActive: row.is_active,
            createdAt: new Date(row.created_at),
            updatedAt: new Date(row.updated_at),
        };
    }
}
exports.default = new FCMTokenModel();
