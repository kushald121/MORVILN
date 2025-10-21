import supabase from '../config/supabaseclient';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  icon?: string;
  url?: string;
  data?: any;
  isRead: boolean;
  sentAt: Date;
  readAt?: Date;
}

export interface CreateNotificationInput {
  userId: string;
  title: string;
  body: string;
  icon?: string;
  url?: string;
  data?: any;
}

class NotificationModel {

  async createNotification(data: CreateNotificationInput): Promise<Notification> {
    const { data: notification, error } = await supabase
      .from('notifications')
      .insert({
        user_id: data.userId,
        title: data.title,
        body: data.body,
        icon: data.icon || null,
        url: data.url || null,
        data: data.data || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating notification:', error);
      throw new Error(`Failed to create notification: ${error.message}`);
    }

    return this.mapRowToNotification(notification);
  }

  async getNotificationsByUserId(userId: string, limit: number = 50): Promise<Notification[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('sent_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error getting notifications by user ID:', error);
      throw new Error(`Failed to get notifications: ${error.message}`);
    }

    return (data || []).map((row: any) => this.mapRowToNotification(row));
  }

  async getUnreadCount(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) {
      console.error('Error getting unread count:', error);
      throw new Error(`Failed to get unread count: ${error.message}`);
    }

    return count || 0;
  }

  async markAsRead(notificationId: string, userId: string): Promise<boolean> {
    const { error } = await supabase
      .from('notifications')
      .update({
        is_read: true,
        read_at: new Date().toISOString()
      })
      .eq('id', notificationId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error marking notification as read:', error);
      throw new Error(`Failed to mark notification as read: ${error.message}`);
    }

    return true;
  }

  async markAllAsRead(userId: string): Promise<number> {
    const { data, error } = await supabase
      .from('notifications')
      .update({
        is_read: true,
        read_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('is_read', false)
      .select('id');

    if (error) {
      console.error('Error marking all notifications as read:', error);
      throw new Error(`Failed to mark all notifications as read: ${error.message}`);
    }

    return data?.length || 0;
  }

  async deleteNotification(notificationId: string, userId: string): Promise<boolean> {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting notification:', error);
      throw new Error(`Failed to delete notification: ${error.message}`);
    }

    return true;
  }

  private mapRowToNotification(row: any): Notification {
    return {
      id: row.id,
      userId: row.user_id,
      title: row.title,
      body: row.body,
      icon: row.icon,
      url: row.url,
      data: row.data,
      isRead: row.is_read,
      sentAt: row.sent_at,
      readAt: row.read_at,
    };
  }
}

export default new NotificationModel();
