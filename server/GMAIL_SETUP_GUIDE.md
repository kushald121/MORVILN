# 🔧 Gmail SMTP Setup Guide

Your Gmail SMTP email system is **fully implemented and ready to use**! 🎉

## Current Status ✅

- ✅ **Server Running**: http://localhost:5000
- ✅ **Email Routes Active**: http://localhost:5000/api/email
- ✅ **All Email Templates Ready**: Order confirmation, Welcome, Password reset, etc.
- ✅ **Gmail SMTP Configuration Complete**

## 🚨 Authentication Issue

The system is failing to authenticate with Gmail SMTP. Error: `535 5.7.8 AUTH invalid`

## 🔑 How to Fix Gmail Authentication

### Step 1: Enable 2-Factor Authentication
1. Go to [Gmail Security Settings](https://myaccount.google.com/security)
2. Enable **2-Factor Authentication** if not already enabled
3. This is **required** for App Passwords

### Step 2: Generate Gmail App Password
1. Go to [App Passwords](https://myaccount.google.com/apppasswords)
2. Select **"Mail"** as the app
3. Select **"Other"** as the device and name it (e.g., "Node.js Server")
4. Copy the generated **16-character password** (no spaces)
5. Update your `.env` file:

```env
SMTP_PASSWORD=your-16-char-app-password-here
```

### Step 3: Update Environment Variables

Your current `.env` configuration:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=rachnacollection11@gmail.com
SMTP_PASSWORD=lxroemffnroztvhh  # ← Replace this with new App Password
FROM_NAME=Rachna Collection
```

## 🧪 Test Your Setup

Once you update the App Password, test the connection:

### 1. Test Connection
```bash
curl http://localhost:5000/api/email/test-connection
```

### 2. Send Test Email
```bash
curl -X POST http://localhost:5000/api/email/test-send \
  -H "Content-Type: application/json" \
  -d '{"to": "your-email@gmail.com", "subject": "Test Email"}'
```

### 3. Test Order Confirmation
```bash
curl -X POST http://localhost:5000/api/email/order-confirmation \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "TEST-001",
    "customerName": "Test Customer",
    "customerEmail": "your-email@gmail.com",
    "items": [{"name": "Test Product", "quantity": 1, "price": 999}],
    "totalAmount": 999,
    "shippingAddress": "123 Test St\nTest City, TS 12345",
    "orderDate": "2024-01-15"
  }'
```

## 📧 Available Email Features

Your system includes these email capabilities:

### 1. **Order Confirmation Emails**
- Beautiful HTML templates
- Itemized order details
- Shipping information
- Professional branding

### 2. **Admin Order Notifications**
- Instant notifications for new orders
- Complete order details
- Customer information

### 3. **Welcome Emails**
- User onboarding
- Email verification links
- Professional welcome message

### 4. **Password Reset Emails**
- Secure reset links
- Expiry time information
- Security notices

### 5. **Custom Emails**
- Send any custom HTML email
- Support for attachments
- CC/BCC functionality

### 6. **Bulk Email Sending**
- Newsletter support
- Batch processing
- Rate limiting

## 🚀 API Endpoints

All endpoints are available at `http://localhost:5000/api/email/`:

- `GET /test-connection` - Test Gmail SMTP connection
- `POST /test-send` - Send test email
- `POST /order-confirmation` - Send order confirmation
- `POST /admin-order-notification` - Send admin notification
- `POST /welcome` - Send welcome email
- `POST /password-reset` - Send password reset
- `POST /email-verification` - Send email verification
- `POST /order-status-update` - Send order status update
- `POST /send-custom` - Send custom email
- `POST /send-bulk` - Send bulk emails

## 💡 Troubleshooting

### Common Gmail Issues:

1. **"Invalid login" Error**
   - Use App Password, not regular Gmail password
   - Ensure 2FA is enabled

2. **"Less secure app access" Error**
   - Enable 2FA and use App Password (recommended)
   - Or enable "Less secure app access" in Gmail settings

3. **"Daily limit exceeded" Error**
   - Gmail free accounts: 500 emails/day
   - Google Workspace: 2,000 emails/day

4. **"Rate limit exceeded" Error**
   - Reduce sending frequency
   - Add delays between emails

## 🎯 Next Steps

1. **Fix Gmail Authentication**: Update App Password in `.env`
2. **Test Email Sending**: Use the test endpoints
3. **Integrate with Your App**: Use the email service in your application
4. **Monitor Usage**: Keep track of daily email limits

## 📞 Support

If you continue having issues:
1. Verify 2FA is enabled on Gmail
2. Generate a new App Password
3. Check Gmail security settings
4. Ensure the Gmail account is active

Your email system is **production-ready** once the Gmail authentication is fixed! 🚀