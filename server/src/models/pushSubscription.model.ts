import supabase from '../config/supabaseclient';

export interface PushSubscription {
  id: string;
  userId?: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  userAgent?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSubscriptionInput {
  userId?: string;
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  userAgent?: string;
}

class PushSubscriptionModel {
  async createSubscription(data: CreateSubscriptionInput): Promise<PushSubscription> {
    // First try to find existing subscription by endpoint
    const { data: existing } = await supabase
      .from('push_subscriptions')
      .select('*')
      .eq('endpoint', data.endpoint)
      .single();

    if (existing) {
      // Update existing subscription
      const { data: updated, error } = await supabase
        .from('push_subscriptions')
        .update({
          user_id: data.userId || null,
          p256dh: data.keys.p256dh,
          auth: data.keys.auth,
          user_agent: data.userAgent || null,
          is_active: true,
          updated_at: new Date().toISOString()
        })
        .eq('endpoint', data.endpoint)
        .select()
        .single();

      if (error) {
        console.error('Error updating push subscription:', error);
        throw new Error(`Failed to update push subscription: ${error.message}`);
      }

      return this.mapRowToSubscription(updated);
    } else {
      // Create new subscription
      const { data: newSub, error } = await supabase
        .from('push_subscriptions')
        .insert({
          user_id: data.userId || null,
          endpoint: data.endpoint,
          p256dh: data.keys.p256dh,
          auth: data.keys.auth,
          user_agent: data.userAgent || null,
          is_active: true
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating push subscription:', error);
        throw new Error(`Failed to create push subscription: ${error.message}`);
      }

      return this.mapRowToSubscription(newSub);
    }
  }

  async getSubscriptionsByUserId(userId: string): Promise<PushSubscription[]> {
    const { data, error } = await supabase
      .from('push_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true);

    if (error) {
      console.error('Error getting subscriptions by user ID:', error);
      throw new Error(`Failed to get subscriptions: ${error.message}`);
    }

    return (data || []).map((row: any) => this.mapRowToSubscription(row));
  }

  async getAllActiveSubscriptions(): Promise<PushSubscription[]> {
    const { data, error } = await supabase
      .from('push_subscriptions')
      .select('*')
      .eq('is_active', true);

    if (error) {
      console.error('Error getting all active subscriptions:', error);
      throw new Error(`Failed to get active subscriptions: ${error.message}`);
    }

    return (data || []).map((row: any) => this.mapRowToSubscription(row));
  }

  async deleteSubscription(endpoint: string): Promise<boolean> {
    const { error } = await supabase
      .from('push_subscriptions')
      .delete()
      .eq('endpoint', endpoint);

    if (error) {
      console.error('Error deleting push subscription:', error);
      throw new Error(`Failed to delete push subscription: ${error.message}`);
    }

    return true;
  }

  async deactivateSubscription(endpoint: string): Promise<boolean> {
    const { error } = await supabase
      .from('push_subscriptions')
      .update({ 
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .eq('endpoint', endpoint);

    if (error) {
      console.error('Error deactivating push subscription:', error);
      throw new Error(`Failed to deactivate push subscription: ${error.message}`);
    }

    return true;
  }

  private mapRowToSubscription(row: any): PushSubscription {
    return {
      id: row.id,
      userId: row.user_id,
      endpoint: row.endpoint,
      p256dh: row.p256dh,
      auth: row.auth,
      userAgent: row.user_agent,
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}

export default new PushSubscriptionModel();
