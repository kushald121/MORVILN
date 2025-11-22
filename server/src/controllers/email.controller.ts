import { Request, Response } from 'express';
import emailService from '../services/email.service';
import { OrderConfirmationData, ProductLaunchData, OfferData } from '../types/emailTypes';

class EmailController {
  // Send order confirmation
  public async sendOrderConfirmation(req: Request, res: Response): Promise<void> {
    try {
      const { email, orderData } = req.body;

      if (!email || !orderData) {
        res.status(400).json({
          success: false,
          message: 'Email and order data are required',
        });
        return;
      }

      await emailService.sendOrderConfirmation(email, orderData as OrderConfirmationData);

      res.status(200).json({
        success: true,
        message: 'Order confirmation email sent successfully',
      });
    } catch (error) {
      console.error('Error sending order confirmation:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to send order confirmation email',
      });
    }
  }

  // Send product launch announcement
  public async sendProductLaunch(req: Request, res: Response): Promise<void> {
    try {
      const { emails, productData } = req.body;

      if (!emails || !Array.isArray(emails) || !productData) {
        res.status(400).json({
          success: false,
          message: 'Emails array and product data are required',
        });
        return;
      }

      await emailService.sendProductLaunch(emails, productData as ProductLaunchData);

      res.status(200).json({
        success: true,
        message: 'Product launch emails sent successfully',
      });
    } catch (error) {
      console.error('Error sending product launch emails:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to send product launch emails',
      });
    }
  }

  // Send custom offers
  public async sendCustomOffer(req: Request, res: Response): Promise<void> {
    try {
      const { emails, offerData } = req.body;

      if (!emails || !Array.isArray(emails) || !offerData) {
        res.status(400).json({
          success: false,
          message: 'Emails array and offer data are required',
        });
        return;
      }

      await emailService.sendCustomOffer(emails, offerData as OfferData);

      res.status(200).json({
        success: true,
        message: 'Custom offer emails sent successfully',
      });
    } catch (error) {
      console.error('Error sending custom offer emails:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to send custom offer emails',
      });
    }
  }

  // Verify email service
  public async verifyEmailService(req: Request, res: Response): Promise<void> {
    try {
      const isVerified = await emailService.verifyConnection();

      res.status(200).json({
        success: isVerified,
        message: isVerified ? 'Email service is connected' : 'Email service connection failed',
      });
    } catch (error) {
      console.error('Error verifying email service:', error);
      res.status(500).json({
        success: false,
        message: 'Error verifying email service',
      });
    }
  }

  // Test connection
  public async testConnection(req: Request, res: Response): Promise<void> {
    try {
      const isVerified = await emailService.verifyConnection();
      
      res.status(200).json({
        success: isVerified,
        message: isVerified ? 'Email service connection successful' : 'Email service connection failed',
      });
    } catch (error) {
      console.error('Error testing email connection:', error);
      res.status(500).json({
        success: false,
        message: 'Error testing email connection',
      });
    }
  }

  // Send test email
  public async sendTestEmail(req: Request, res: Response): Promise<void> {
    try {
      const { to, subject, text } = req.body;
      
      if (!to || !subject) {
        res.status(400).json({
          success: false,
          message: 'Recipient email and subject are required',
        });
        return;
      }

      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #f8f9fa; padding: 20px; text-align: center; }
              .content { padding: 20px; }
              .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Email Service Test</h1>
              </div>
              <div class="content">
                <p>This is a test email from your MORVILN application.</p>
                <p>If you received this email, your email service is working correctly!</p>
              </div>
              <div class="footer">
                <p>&copy; 2024 MORVLIN. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `;

      await emailService.sendEmail({
        to,
        subject,
        html,
        text,
      });

      res.status(200).json({
        success: true,
        message: 'Test email sent successfully',
      });
    } catch (error) {
      console.error('Error sending test email:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to send test email',
      });
    }
  }

  // Send welcome email
  public async sendWelcomeEmail(req: Request, res: Response): Promise<void> {
    try {
      const { userName, userEmail, verificationLink } = req.body;
      
      if (!userName || !userEmail || !verificationLink) {
        res.status(400).json({
          success: false,
          message: 'User name, email, and verification link are required',
        });
        return;
      }

      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #f8f9fa; padding: 20px; text-align: center; }
              .content { padding: 20px; }
              .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; }
              .cta-button { display: inline-block; padding: 12px 24px; background: #007bff; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Welcome to MORVILN!</h1>
              </div>
              <div class="content">
                <p>Hello ${userName},</p>
                <p>Welcome to MORVILN! We're excited to have you join our community.</p>
                <p>To get started, please verify your email address by clicking the button below:</p>
                <a href="${verificationLink}" class="cta-button">Verify Email Address</a>
                <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
                <p>${verificationLink}</p>
                <p>Thank you for joining us!</p>
              </div>
              <div class="footer">
                <p>&copy; 2024 MORVLIN. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `;

      await emailService.sendEmail({
        to: userEmail,
        subject: 'Welcome to MORVILN!',
        html,
      });

      res.status(200).json({
        success: true,
        message: 'Welcome email sent successfully',
      });
    } catch (error) {
      console.error('Error sending welcome email:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to send welcome email',
      });
    }
  }

  // Send password reset email
  public async sendPasswordResetEmail(req: Request, res: Response): Promise<void> {
    try {
      const { resetData, userEmail } = req.body;
      
      if (!resetData || !userEmail) {
        res.status(400).json({
          success: false,
          message: 'Reset data and user email are required',
        });
        return;
      }

      const { userName, resetLink, expiryTime } = resetData;

      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #f8f9fa; padding: 20px; text-align: center; }
              .content { padding: 20px; }
              .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; }
              .cta-button { display: inline-block; padding: 12px 24px; background: #007bff; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }
              .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 4px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Password Reset Request</h1>
              </div>
              <div class="content">
                <p>Hello ${userName},</p>
                <p>We received a request to reset your password for your MORVILN account.</p>
                <p>If you made this request, please click the button below to reset your password:</p>
                <a href="${resetLink}" class="cta-button">Reset Password</a>
                <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
                <p>${resetLink}</p>
                <div class="warning">
                  <p><strong>Note:</strong> This link will expire on ${expiryTime}. If you didn't request a password reset, please ignore this email.</p>
                </div>
              </div>
              <div class="footer">
                <p>&copy; 2024 MORVLIN. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `;

      await emailService.sendEmail({
        to: userEmail,
        subject: 'Password Reset Request - MORVILN',
        html,
      });

      res.status(200).json({
        success: true,
        message: 'Password reset email sent successfully',
      });
    } catch (error) {
      console.error('Error sending password reset email:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to send password reset email',
      });
    }
  }

  // Send admin order notification
  public async sendAdminOrderNotification(req: Request, res: Response): Promise<void> {
    try {
      const { orderDetails, adminEmails } = req.body;
      
      if (!orderDetails || !adminEmails || !Array.isArray(adminEmails) || adminEmails.length === 0) {
        res.status(400).json({
          success: false,
          message: 'Order details and admin emails array are required',
        });
        return;
      }

      const { orderId, customerName, customerEmail, items, totalAmount, shippingAddress, orderDate } = orderDetails;

      const itemsHtml = items.map((item: { name: string; quantity: number; price: number; }) => `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">$${(item.price / 100).toFixed(2)}</td>
        </tr>
      `).join('');

      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #f8f9fa; padding: 20px; text-align: center; }
              .content { padding: 20px; }
              .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; }
              table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              th { background: #f8f9fa; padding: 10px; text-align: left; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>New Order Received</h1>
              </div>
              <div class="content">
                <p>A new order has been placed:</p>
                
                <p><strong>Order ID:</strong> ${orderId}</p>
                <p><strong>Customer:</strong> ${customerName} (${customerEmail})</p>
                <p><strong>Order Date:</strong> ${orderDate}</p>
                
                <table>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                  </tr>
                  ${itemsHtml}
                </table>
                
                <p><strong>Total Amount:</strong> $${(totalAmount / 100).toFixed(2)}</p>
                <p><strong>Shipping Address:</strong><br>${shippingAddress.replace(/\n/g, '<br>')}</p>
              </div>
              <div class="footer">
                <p>&copy; 2024 MORVLIN. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `;

      // Send to all admin emails
      for (const email of adminEmails) {
        await emailService.sendEmail({
          to: email,
          subject: `New Order #${orderId} from ${customerName}`,
          html,
        });
      }

      res.status(200).json({
        success: true,
        message: 'Admin order notifications sent successfully',
      });
    } catch (error) {
      console.error('Error sending admin order notification:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to send admin order notification',
      });
    }
  }
}

export default new EmailController();