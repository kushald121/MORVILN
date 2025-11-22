import nodemailer from "nodemailer";
import { EmailOptions, OrderConfirmationData, ProductLaunchData, OfferData } from "../types/emailTypes";

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  }

  public async sendEmail(options: EmailOptions): Promise<void> {
    try {
      const mailOptions = {
        from: `"${process.env.EMAIL_FROM_NAME || 'MORVLIN'}" <${process.env.GMAIL_USER}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      };

      await this.transporter.sendMail(mailOptions);
      console.log("Email sent successfully");
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error('Failed to send email');
    }
  }

<<<<<<< HEAD
  // Order Confirmation Mail 
  public async sendOrderConfirmation(
    email: string,
    data: OrderConfirmationData
  ): Promise<void> {
    const itemsHtml = data.items
      .map(
        (item) => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${(item.price/100).toFixed(2)}</td>
        </tr>
      `
      )
      .join('');
=======
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
>>>>>>> f3387b1 (fix: saving all local changes before merge)

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
              <h1>Order Confirmation</h1>
            </div>
            <div class="content">
              <p>Dear ${data.customerName},</p>
              <p>Thank you for your order! Here are your order details:</p>
              
              <table>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Price</th>
                </tr>
                ${itemsHtml}
              </table>
              
              <p><strong>Order ID:</strong> ${data.orderId}</p>
              <p><strong>Order Date:</strong> ${data.orderDate}</p>
              <p><strong>Total Amount:</strong> $${(data.totalAmount/100).toFixed(2)}</p>
              <p><strong>Shipping Address:</strong> ${data.shippingAddress}</p>
              
              <p>We'll notify you when your order ships.</p>
              <p>Thank you for shopping with us!</p>
            </div>
            <div class="footer">
              <p>&copy; 2024 MORVLIN. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await this.sendEmail({
      to: email,
      subject: `Order Confirmation - #${data.orderId}`,
      html,
    });
  }

  // New Product Launch Email
  public async sendProductLaunch(
    emails: string[],
    data: ProductLaunchData
  ): Promise<void> {
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
              <h1>New Product Launch!</h1>
            </div>
            <div class="content">
              <h2>${data.productName}</h2>
              ${data.productImage ? `<img src="${data.productImage}" alt="${data.productName}" style="max-width: 100%; height: auto; margin: 20px 0;">` : ''}
              <p>${data.productDescription}</p>
              
              ${data.specialOffer ? `
                <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 4px; margin: 20px 0;">
                  <h3 style="color: #856404; margin: 0;">Special Offer!</h3>
                  <p style="margin: 10px 0 0 0; color: #856404;">${data.specialOffer}</p>
                </div>
              ` : ''}
              
              <p><strong>Launch Date:</strong> ${data.launchDate}</p>
              
              <a href="${data.productUrl}" class="cta-button">View Product</a>
            </div>
            <div class="footer">
              <p>&copy; 2024 MORVLIN. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

<<<<<<< HEAD
    // Send to multiple recipients
    for (const email of emails) {
      await this.sendEmail({
        to: email,
        subject: `New Product: ${data.productName}`,
        html,
      });
=======
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
>>>>>>> f3387b1 (fix: saving all local changes before merge)
    }
  }

  // Custom Offers Email
  public async sendCustomOffer(
    emails: string[],
    data: OfferData
  ): Promise<void> {
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
            .offer-code { background: #f8f9fa; padding: 15px; text-align: center; font-size: 18px; font-weight: bold; margin: 20px 0; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Special Offer Just For You!</h1>
            </div>
            <div class="content">
              <p>Dear ${data.customerName},</p>
              
              <h2>${data.offerTitle}</h2>
              <p>${data.offerDescription}</p>
              
              ${data.discountCode ? `
                <div class="offer-code">
                  Use Code: <span style="color: #007bff;">${data.discountCode}</span>
                </div>
              ` : ''}
              
              <p><strong>Valid until:</strong> ${data.validUntil}</p>
              
              ${data.termsAndConditions ? `
                <p><small><strong>Terms & Conditions:</strong> ${data.termsAndConditions}</small></p>
              ` : ''}
              
              <p>Don't miss out on this amazing offer!</p>
            </div>
            <div class="footer">
              <p>&copy; 2024 MORVLIN. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    for (const email of emails) {
      await this.sendEmail({
        to: email,
        subject: data.offerTitle,
        html,
      });
    }
  }

  // Verify transporter connection
  public async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('SMTP connection verified successfully');
      return true;
    } catch (error) {
      console.error('SMTP connection failed:', error);
      return false;
    }
  }
}

export default new EmailService();