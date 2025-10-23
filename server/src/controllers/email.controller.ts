import { Request, Response } from 'express';
import emailService from '../services/email.service';
import { testEmailConnection } from '../config/email';
import { OrderDetails } from '../templates/orderConfirmation';
import { WelcomeEmailData } from '../templates/welcomeEmail';
import { PasswordResetData } from '../templates/passwordReset';

export class EmailController {
  /**
   * Test email connection
   */
  async testConnection(req: Request, res: Response) {
    try {
      const isConnected = await testEmailConnection();
      
      if (isConnected) {
        res.status(200).json({
          success: true,
          message: 'Gmail SMTP connection successful',
          status: 'Connected - Ready for sending',
          nextSteps: [
            'Test sending an email using /api/email/test-send',
            'If sending fails, check Gmail App Password',
            'Ensure 2-Factor Authentication is enabled on Gmail'
          ]
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to connect to Gmail SMTP server',
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error testing email connection',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Send a test email
   */
  async sendTestEmail(req: Request, res: Response) {
    try {
      const { to, subject = 'Test Email from Gmail SMTP' } = req.body;

      if (!to) {
        return res.status(400).json({
          success: false,
          message: 'Recipient email is required',
        });
      }

      const html = `
        <h2>🎉 Test Email Successful!</h2>
        <p>This is a test email sent via Gmail SMTP service.</p>
        <p><strong>Sent at:</strong> ${new Date().toLocaleString()}</p>
        <p>If you received this email, your Gmail SMTP configuration is working correctly!</p>
      `;

      const success = await emailService.sendEmail({
        to,
        subject,
        html,
      });

      if (success) {
        res.status(200).json({
          success: true,
          message: 'Test email sent successfully',
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to send test email',
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error sending test email',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Send order confirmation email
   */
  async sendOrderConfirmation(req: Request, res: Response) {
    try {
      const orderDetails: OrderDetails = req.body;

      // Validate required fields
      if (!orderDetails.orderId || !orderDetails.customerEmail || !orderDetails.customerName) {
        return res.status(400).json({
          success: false,
          message: 'Missing required order details',
        });
      }

      const success = await emailService.sendOrderConfirmation(orderDetails);

      if (success) {
        res.status(200).json({
          success: true,
          message: 'Order confirmation email sent successfully',
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to send order confirmation email',
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error sending order confirmation email',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Send admin order notification
   */
  async sendAdminOrderNotification(req: Request, res: Response) {
    try {
      const { orderDetails, adminEmails } = req.body;

      if (!orderDetails || !adminEmails) {
        return res.status(400).json({
          success: false,
          message: 'Order details and admin emails are required',
        });
      }

      const success = await emailService.sendAdminOrderNotification(orderDetails, adminEmails);

      if (success) {
        res.status(200).json({
          success: true,
          message: 'Admin notification email sent successfully',
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to send admin notification email',
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error sending admin notification email',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Send welcome email
   */
  async sendWelcomeEmail(req: Request, res: Response) {
    try {
      const welcomeData: WelcomeEmailData = req.body;

      if (!welcomeData.userName || !welcomeData.userEmail) {
        return res.status(400).json({
          success: false,
          message: 'User name and email are required',
        });
      }

      const success = await emailService.sendWelcomeEmail(welcomeData);

      if (success) {
        res.status(200).json({
          success: true,
          message: 'Welcome email sent successfully',
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to send welcome email',
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error sending welcome email',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(req: Request, res: Response) {
    try {
      const { resetData, userEmail } = req.body;

      if (!resetData || !userEmail) {
        return res.status(400).json({
          success: false,
          message: 'Reset data and user email are required',
        });
      }

      const success = await emailService.sendPasswordResetEmail(resetData, userEmail);

      if (success) {
        res.status(200).json({
          success: true,
          message: 'Password reset email sent successfully',
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to send password reset email',
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error sending password reset email',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Send email verification
   */
  async sendEmailVerification(req: Request, res: Response) {
    try {
      const { userEmail, userName, verificationLink } = req.body;

      if (!userEmail || !userName || !verificationLink) {
        return res.status(400).json({
          success: false,
          message: 'User email, name, and verification link are required',
        });
      }

      const success = await emailService.sendEmailVerification(userEmail, userName, verificationLink);

      if (success) {
        res.status(200).json({
          success: true,
          message: 'Email verification sent successfully',
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to send email verification',
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error sending email verification',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Send order status update
   */
  async sendOrderStatusUpdate(req: Request, res: Response) {
    try {
      const { customerEmail, orderId, status, trackingNumber } = req.body;

      if (!customerEmail || !orderId || !status) {
        return res.status(400).json({
          success: false,
          message: 'Customer email, order ID, and status are required',
        });
      }

      const success = await emailService.sendOrderStatusUpdate(
        customerEmail,
        orderId,
        status,
        trackingNumber
      );

      if (success) {
        res.status(200).json({
          success: true,
          message: 'Order status update email sent successfully',
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to send order status update email',
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error sending order status update email',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Send custom email
   */
  async sendCustomEmail(req: Request, res: Response) {
    try {
      const { to, subject, html, text, cc, bcc } = req.body;

      if (!to || !subject || (!html && !text)) {
        return res.status(400).json({
          success: false,
          message: 'Recipient, subject, and content (html or text) are required',
        });
      }

      const success = await emailService.sendEmail({
        to,
        subject,
        html,
        text,
        cc,
        bcc,
      });

      if (success) {
        res.status(200).json({
          success: true,
          message: 'Custom email sent successfully',
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to send custom email',
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error sending custom email',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Send bulk emails
   */
  async sendBulkEmail(req: Request, res: Response) {
    try {
      const { recipients, subject, html, batchSize = 50 } = req.body;

      if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Recipients array is required and must not be empty',
        });
      }

      if (!subject || !html) {
        return res.status(400).json({
          success: false,
          message: 'Subject and HTML content are required',
        });
      }

      const result = await emailService.sendBulkEmail(recipients, subject, html, batchSize);

      res.status(200).json({
        success: true,
        message: 'Bulk email sending completed',
        result: {
          totalRecipients: recipients.length,
          successful: result.success,
          failed: result.failed,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error sending bulk emails',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}

export default new EmailController();