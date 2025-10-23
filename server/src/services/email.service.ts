import transporter, { emailConfig } from '../config/email';
import { orderConfirmationTemplate, OrderDetails } from '../templates/orderConfirmation';
import { adminOrderNotificationTemplate } from '../templates/adminOrderNotification';
import { welcomeEmailTemplate, WelcomeEmailData } from '../templates/welcomeEmail';
import { passwordResetTemplate, PasswordResetData } from '../templates/passwordReset';

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
}

class EmailService {
  private from: string;

  constructor() {
    this.from = `"${emailConfig.fromName}" <${emailConfig.from}>`;
  }

  /**
   * Send a generic email
   */
  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      const mailOptions = {
        from: this.from,
        to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
        cc: options.cc ? (Array.isArray(options.cc) ? options.cc.join(', ') : options.cc) : undefined,
        bcc: options.bcc ? (Array.isArray(options.bcc) ? options.bcc.join(', ') : options.bcc) : undefined,
        attachments: options.attachments,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('✅ Email sent successfully:', info.messageId);
      return true;
    } catch (error: any) {
      // Handle specific Gmail errors
      if (error.message?.includes('Invalid login')) {
        console.error('❌ Gmail Authentication Error: Invalid credentials');
        console.error('💡 Please use Gmail App Password instead of regular password');
      } else if (error.message?.includes('Less secure app access')) {
        console.error('❌ Gmail Security Error: Less secure app access not allowed');
        console.error('💡 Enable 2FA and use App Password, or enable Less Secure Apps');
      } else {
        console.error('❌ Failed to send email:', error.message || error);
      }
      return false;
    }
  }

  /**
   * Send order confirmation email to customer
   */
  async sendOrderConfirmation(orderDetails: OrderDetails): Promise<boolean> {
    const html = orderConfirmationTemplate(orderDetails);
    
    return this.sendEmail({
      to: orderDetails.customerEmail,
      subject: `Order Confirmation - ${orderDetails.orderId}`,
      html,
    });
  }

  /**
   * Send order notification to admin
   */
  async sendAdminOrderNotification(
    orderDetails: OrderDetails, 
    adminEmails: string | string[]
  ): Promise<boolean> {
    const html = adminOrderNotificationTemplate(orderDetails);
    
    return this.sendEmail({
      to: adminEmails,
      subject: `🔔 New Order Received - ${orderDetails.orderId}`,
      html,
    });
  }

  /**
   * Send welcome email to new user
   */
  async sendWelcomeEmail(data: WelcomeEmailData): Promise<boolean> {
    const html = welcomeEmailTemplate(data);
    
    return this.sendEmail({
      to: data.userEmail,
      subject: '🎉 Welcome to Our Platform!',
      html,
    });
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(data: PasswordResetData, userEmail: string): Promise<boolean> {
    const html = passwordResetTemplate(data);
    
    return this.sendEmail({
      to: userEmail,
      subject: '🔐 Password Reset Request',
      html,
    });
  }

  /**
   * Send email verification
   */
  async sendEmailVerification(
    userEmail: string, 
    userName: string, 
    verificationLink: string
  ): Promise<boolean> {
    const data: WelcomeEmailData = {
      userName,
      userEmail,
      verificationLink,
    };

    const html = welcomeEmailTemplate(data);
    
    return this.sendEmail({
      to: userEmail,
      subject: '📧 Please Verify Your Email Address',
      html,
    });
  }

  /**
   * Send order status update
   */
  async sendOrderStatusUpdate(
    customerEmail: string,
    orderId: string,
    status: string,
    trackingNumber?: string
  ): Promise<boolean> {
    const statusMessages = {
      processing: 'Your order is being processed',
      shipped: 'Your order has been shipped',
      delivered: 'Your order has been delivered',
      cancelled: 'Your order has been cancelled',
    };

    const message = statusMessages[status as keyof typeof statusMessages] || `Order status updated to: ${status}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Status Update</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">📦 Order Update</h1>
          <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Order ${orderId}</p>
        </div>
        
        <div style="background: white; padding: 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 10px 10px;">
          <h2 style="color: #28a745; margin-bottom: 20px;">${message}</h2>
          
          <div style="background: #d4edda; border: 1px solid #c3e6cb; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <p style="margin: 0; color: #155724;"><strong>Order ID:</strong> ${orderId}</p>
            <p style="margin: 10px 0 0 0; color: #155724;"><strong>Status:</strong> ${status.toUpperCase()}</p>
            ${trackingNumber ? `<p style="margin: 10px 0 0 0; color: #155724;"><strong>Tracking Number:</strong> ${trackingNumber}</p>` : ''}
          </div>
          
          <p>Thank you for your patience. We'll continue to keep you updated on your order status.</p>
          
          <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; text-align: center; color: #666; font-size: 12px;">
            <p>This is an automated email, please do not reply to this message.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: customerEmail,
      subject: `Order Update - ${orderId}`,
      html,
    });
  }

  /**
   * Send bulk emails (for newsletters, promotions, etc.)
   */
  async sendBulkEmail(
    recipients: string[],
    subject: string,
    html: string,
    batchSize: number = 50
  ): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;

    // Send emails in batches to avoid overwhelming the SMTP server
    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize);
      
      try {
        await this.sendEmail({
          bcc: batch, // Use BCC to hide recipient list
          to: emailConfig.from, // Send to self as primary recipient
          subject,
          html,
        });
        success += batch.length;
      } catch (error) {
        console.error(`Failed to send batch ${i / batchSize + 1}:`, error);
        failed += batch.length;
      }

      // Add delay between batches to be respectful to the SMTP server
      if (i + batchSize < recipients.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return { success, failed };
  }
}

export default new EmailService();