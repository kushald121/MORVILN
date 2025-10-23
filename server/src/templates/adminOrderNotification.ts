import { OrderDetails, OrderItem } from './orderConfirmation';

export const adminOrderNotificationTemplate = (orderDetails: OrderDetails): string => {
  const itemsHtml = orderDetails.items.map(item => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price.toFixed(2)}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">₹${(item.quantity * item.price).toFixed(2)}</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Order Notification</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); padding: 25px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">🔔 New Order Received!</h1>
        <p style="color: white; margin: 10px 0 0 0; font-size: 14px;">Order ID: ${orderDetails.orderId}</p>
      </div>
      
      <div style="background: white; padding: 25px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 10px 10px;">
        <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
          <p style="margin: 0; color: #856404;"><strong>⚡ Action Required:</strong> A new order has been placed and requires processing.</p>
        </div>
        
        <div style="display: flex; gap: 20px; margin-bottom: 25px;">
          <div style="flex: 1; background: #f8f9fa; padding: 15px; border-radius: 6px;">
            <h3 style="margin: 0 0 10px 0; color: #495057; font-size: 16px;">Customer Info</h3>
            <p style="margin: 3px 0; font-size: 14px;"><strong>Name:</strong> ${orderDetails.customerName}</p>
            <p style="margin: 3px 0; font-size: 14px;"><strong>Email:</strong> ${orderDetails.customerEmail}</p>
          </div>
          <div style="flex: 1; background: #f8f9fa; padding: 15px; border-radius: 6px;">
            <h3 style="margin: 0 0 10px 0; color: #495057; font-size: 16px;">Order Info</h3>
            <p style="margin: 3px 0; font-size: 14px;"><strong>Date:</strong> ${orderDetails.orderDate}</p>
            <p style="margin: 3px 0; font-size: 14px;"><strong>Total:</strong> <span style="color: #28a745; font-weight: bold;">₹${orderDetails.totalAmount.toFixed(2)}</span></p>
          </div>
        </div>
        
        <h3 style="margin-bottom: 15px; color: #495057;">Order Items</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
          <thead>
            <tr style="background: #f8f9fa;">
              <th style="padding: 10px; text-align: left; border-bottom: 2px solid #dee2e6;">Item</th>
              <th style="padding: 10px; text-align: center; border-bottom: 2px solid #dee2e6;">Qty</th>
              <th style="padding: 10px; text-align: right; border-bottom: 2px solid #dee2e6;">Unit Price</th>
              <th style="padding: 10px; text-align: right; border-bottom: 2px solid #dee2e6;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        
        <div style="background: #e8f5e8; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
          <h3 style="margin: 0 0 10px 0; color: #155724; font-size: 16px;">📍 Shipping Address</h3>
          <p style="margin: 0; font-size: 14px; white-space: pre-line;">${orderDetails.shippingAddress}</p>
        </div>
        
        <div style="text-align: center; margin-top: 25px;">
          <div style="background: #d1ecf1; border: 1px solid #bee5eb; padding: 15px; border-radius: 6px;">
            <p style="margin: 0; color: #0c5460; font-size: 14px;">
              <strong>Next Steps:</strong><br>
              1. Process the order in your admin panel<br>
              2. Prepare items for shipping<br>
              3. Update order status and tracking information
            </p>
          </div>
        </div>
        
        <div style="border-top: 1px solid #eee; padding-top: 15px; margin-top: 25px; text-align: center; color: #666; font-size: 12px;">
          <p>This is an automated notification from your e-commerce system.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};