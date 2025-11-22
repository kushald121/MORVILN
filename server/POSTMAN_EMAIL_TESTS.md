# MORVILN Email API - Postman Testing Guide

This guide provides instructions for testing the MORVILN Email API using Postman.

## Prerequisites

1. [Postman](https://www.postman.com/downloads/) installed
2. MORVILN server running on `http://localhost:5000`
3. Properly configured `.env` file with Gmail SMTP credentials

## Importing the Collection

1. Open Postman
2. Click on "Import" in the top left corner
3. Select the `Email_API.postman_collection.json` file from the `postman` directory
4. The collection "MORVILN Email API" will be imported

## Available Endpoints

### 1. Test Email Connection
- **Method**: GET
- **URL**: `http://localhost:5000/api/email/test-connection`
- **Description**: Tests if the email service can connect to the SMTP server
- **Expected Response**: 
  ```json
  {
    "success": true,
    "message": "Email service connection successful"
  }
  ```

### 2. Verify Email Service
- **Method**: GET
- **URL**: `http://localhost:5000/api/email/verify`
- **Description**: Verifies the email service connection
- **Expected Response**: 
  ```json
  {
    "success": true,
    "message": "Email service is connected"
  }
  ```

### 3. Send Test Email
- **Method**: POST
- **URL**: `http://localhost:5000/api/email/test-send`
- **Headers**: 
  - Content-Type: application/json
- **Body**:
  ```json
  {
    "to": "recipient@example.com",
    "subject": "Test Email",
    "text": "This is a test email"
  }
  ```
- **Description**: Sends a simple test email
- **Expected Response**: 
  ```json
  {
    "success": true,
    "message": "Test email sent successfully"
  }
  ```

### 4. Send Order Confirmation
- **Method**: POST
- **URL**: `http://localhost:5000/api/email/order-confirmation`
- **Headers**: 
  - Content-Type: application/json
- **Body**:
  ```json
  {
    "email": "customer@example.com",
    "orderData": {
      "customerName": "John Doe",
      "orderId": "ORD-12345",
      "orderDate": "2025-11-22",
      "totalAmount": 15000,
      "shippingAddress": "123 Main St, City, State 12345",
      "items": [
        {
          "name": "Product 1",
          "quantity": 2,
          "price": 5000
        }
      ]
    }
  }
  ```
- **Description**: Sends an order confirmation email
- **Expected Response**: 
  ```json
  {
    "success": true,
    "message": "Order confirmation email sent successfully"
  }
  ```

### 5. Send Product Launch Announcement
- **Method**: POST
- **URL**: `http://localhost:5000/api/email/product-launch`
- **Headers**: 
  - Content-Type: application/json
- **Body**:
  ```json
  {
    "emails": [
      "subscriber1@example.com",
      "subscriber2@example.com"
    ],
    "productData": {
      "productName": "New Amazing Product",
      "productDescription": "This is an amazing new product!",
      "productImage": "https://example.com/image.jpg",
      "productUrl": "https://example.com/product",
      "launchDate": "2025-12-01",
      "specialOffer": "20% off for early birds!"
    }
  }
  ```
- **Description**: Sends a product launch announcement to multiple subscribers
- **Expected Response**: 
  ```json
  {
    "success": true,
    "message": "Product launch emails sent successfully"
  }
  ```

### 6. Send Custom Offer
- **Method**: POST
- **URL**: `http://localhost:5000/api/email/custom-offer`
- **Headers**: 
  - Content-Type: application/json
- **Body**:
  ```json
  {
    "emails": [
      "customer1@example.com",
      "customer2@example.com"
    ],
    "offerData": {
      "customerName": "Valued Customer",
      "offerTitle": "Special Holiday Offer",
      "offerDescription": "Enjoy exclusive discounts!",
      "discountCode": "HOLIDAY25",
      "validUntil": "2025-12-31",
      "termsAndConditions": "Offer valid for new customers only."
    }
  }
  ```
- **Description**: Sends a custom offer to multiple customers
- **Expected Response**: 
  ```json
  {
    "success": true,
    "message": "Custom offer emails sent successfully"
  }
  ```

### 7. Send Welcome Email
- **Method**: POST
- **URL**: `http://localhost:5000/api/email/welcome`
- **Headers**: 
  - Content-Type: application/json
- **Body**:
  ```json
  {
    "userName": "John Doe",
    "userEmail": "john.doe@example.com",
    "verificationLink": "https://example.com/verify?token=abc123"
  }
  ```
- **Description**: Sends a welcome email to a new user
- **Expected Response**: 
  ```json
  {
    "success": true,
    "message": "Welcome email sent successfully"
  }
  ```

### 8. Send Password Reset Email
- **Method**: POST
- **URL**: `http://localhost:5000/api/email/password-reset`
- **Headers**: 
  - Content-Type: application/json
- **Body**:
  ```json
  {
    "userEmail": "user@example.com",
    "resetData": {
      "userName": "John Doe",
      "resetLink": "https://example.com/reset-password?token=xyz789",
      "expiryTime": "2025-11-23 16:00:00 UTC"
    }
  }
  ```
- **Description**: Sends a password reset email to a user
- **Expected Response**: 
  ```json
  {
    "success": true,
    "message": "Password reset email sent successfully"
  }
  ```

### 9. Send Admin Order Notification
- **Method**: POST
- **URL**: `http://localhost:5000/api/email/admin-order-notification`
- **Headers**: 
  - Content-Type: application/json
- **Body**:
  ```json
  {
    "adminEmails": [
      "admin1@example.com",
      "admin2@example.com"
    ],
    "orderDetails": {
      "orderId": "ORD-12345",
      "customerName": "John Doe",
      "customerEmail": "john.doe@example.com",
      "items": [
        {
          "name": "Product 1",
          "quantity": 2,
          "price": 5000
        }
      ],
      "totalAmount": 10000,
      "shippingAddress": "123 Main St\nCity, State 12345",
      "orderDate": "2025-11-22"
    }
  }
  ```
- **Description**: Sends an order notification to admin users
- **Expected Response**: 
  ```json
  {
    "success": true,
    "message": "Admin order notifications sent successfully"
  }
  ```

## Testing Instructions

1. Make sure the MORVILN server is running on `http://localhost:5000`
2. Update the email addresses in the request bodies with valid test emails
3. Start with the "Test Email Connection" and "Verify Email Service" endpoints to ensure the email service is working
4. Proceed to test other endpoints as needed
5. Check your email inbox/junk folder for the sent emails

## Troubleshooting

- If you get connection errors, verify your Gmail SMTP credentials in the `.env` file
- Make sure you're using an App Password for Gmail, not your regular password
- Check that the server is running and accessible
- Verify that your firewall isn't blocking the connection