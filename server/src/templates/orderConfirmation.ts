export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface OrderDetails {
  orderId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: string;
  orderDate: string;
  estimatedDelivery?: string;
}

export const orderConfirmationTemplate = (orderDetails: OrderDetails): string => {
  const itemsHtml = orderDetails.items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        ${item.image ? `<img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; margin-right: 10px;">` : ''}
        ${item.name}
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price.toFixed(2)}</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Order Confirmed! 🎉</h1>
        <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Thank you for your purchase</p>
      </div>
      
      <div style="background: white; padding: 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 10px 10px;">
        <p style="font-size: 18px; margin-bottom: 20px;">Hi ${orderDetails.customerName},</p>
        
        <p style="margin-bottom: 20px;">Great news! Your order has been confirmed and is being processed. Here are the details:</p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <h3 style="margin: 0 0 15px 0; color: #495057;">Order Details</h3>
          <p style="margin: 5px 0;"><strong>Order ID:</strong> ${orderDetails.orderId}</p>
          <p style="margin: 5px 0;"><strong>Order Date:</strong> ${orderDetails.orderDate}</p>
          ${orderDetails.estimatedDelivery ? `<p style="margin: 5px 0;"><strong>Estimated Delivery:</strong> ${orderDetails.estimatedDelivery}</p>` : ''}
        </div>
        
        <h3 style="margin-bottom: 15px; color: #495057;">Items Ordered</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
          <thead>
            <tr style="background: #f8f9fa;">
              <th style="padding: 12px; text-align: left; border-bottom: 2px solid #dee2e6;">Item</th>
              <th style="padding: 12px; text-align: center; border-bottom: 2px solid #dee2e6;">Qty</th>
              <th style="padding: 12px; text-align: right; border-bottom: 2px solid #dee2e6;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr style="background: #f8f9fa;">
              <td colspan="2" style="padding: 15px; font-weight: bold; border-top: 2px solid #dee2e6;">Total Amount</td>
              <td style="padding: 15px; font-weight: bold; text-align: right; border-top: 2px solid #dee2e6; font-size: 18px; color: #28a745;">₹${orderDetails.totalAmount.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
        
        <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <h3 style="margin: 0 0 15px 0; color: #1976d2;">Shipping Address</h3>
          <p style="margin: 0; white-space: pre-line;">${orderDetails.shippingAddress}</p>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <p style="margin-bottom: 20px;">We'll send you another email when your order ships.</p>
          <p style="color: #666; font-size: 14px;">If you have any questions, please don't hesitate to contact our support team.</p>
        </div>
        
        <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; text-align: center; color: #666; font-size: 12px;">
          <p>Thank you for choosing us!</p>
          <p>This is an automated email, please do not reply to this message.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};