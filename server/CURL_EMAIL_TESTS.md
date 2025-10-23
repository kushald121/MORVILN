# 🚀 cURL Commands for Email API Testing

## 📧 Order Confirmation Email Test

### **Basic Order Confirmation:**
```bash
curl -X POST http://localhost:5000/api/email/order-confirmation \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "ORD-2024-001",
    "customerName": "John Doe",
    "customerEmail": "test@example.com",
    "items": [
      {
        "name": "Premium Cotton T-Shirt",
        "quantity": 2,
        "price": 1299,
        "image": "https://example.com/tshirt.jpg"
      },
      {
        "name": "Designer Jeans",
        "quantity": 1,
        "price": 2499
      }
    ],
    "totalAmount": 5097,
    "shippingAddress": "John Doe\n123 Main Street\nMumbai, Maharashtra 400001\nIndia",
    "orderDate": "2024-01-15",
    "estimatedDelivery": "2024-01-22"
  }'
```

## 🧪 Other Email Tests

### **1. Test Gmail Connection:**
```bash
curl -X GET http://localhost:5000/api/email/test-connection
```

### **2. Send Test Email:**
```bash
curl -X POST http://localhost:5000/api/email/test-send \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "subject": "Test Email from cURL"
  }'
```

### **3. Welcome Email:**
```bash
curl -X POST http://localhost:5000/api/email/welcome \
  -H "Content-Type: application/json" \
  -d '{
    "userName": "Jane Smith",
    "userEmail": "jane@example.com",
    "verificationLink": "https://example.com/verify?token=abc123"
  }'
```

### **4. Password Reset Email:**
```bash
curl -X POST http://localhost:5000/api/email/password-reset \
  -H "Content-Type: application/json" \
  -d '{
    "resetData": {
      "userName": "John Doe",
      "resetLink": "https://example.com/reset?token=reset123",
      "expiryTime": "2024-01-15 18:30:00"
    },
    "userEmail": "john@example.com"
  }'
```

### **5. Admin Order Notification:**
```bash
curl -X POST http://localhost:5000/api/email/admin-order-notification \
  -H "Content-Type: application/json" \
  -d '{
    "orderDetails": {
      "orderId": "ORD-2024-001",
      "customerName": "John Doe",
      "customerEmail": "customer@example.com",
      "items": [
        {
          "name": "Premium T-Shirt",
          "quantity": 2,
          "price": 1299
        }
      ],
      "totalAmount": 2598,
      "shippingAddress": "123 Main Street\nMumbai, Maharashtra",
      "orderDate": "2024-01-15"
    },
    "adminEmails": ["admin@example.com"]
  }'
```

## 💡 PowerShell Commands (Windows)

### **Order Confirmation (PowerShell):**
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/email/order-confirmation" -Method POST -ContentType "application/json" -Body '{
  "orderId": "ORD-2024-001",
  "customerName": "John Doe",
  "customerEmail": "test@example.com",
  "items": [
    {
      "name": "Premium Cotton T-Shirt",
      "quantity": 2,
      "price": 1299
    }
  ],
  "totalAmount": 2598,
  "shippingAddress": "John Doe\n123 Main Street\nMumbai, Maharashtra 400001",
  "orderDate": "2024-01-15"
}'
```

### **Test Connection (PowerShell):**
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/email/test-connection" -Method GET
```

## 📋 Quick Test Script

Save this as `test-emails.sh` (Linux/Mac) or `test-emails.bat` (Windows):

```bash
#!/bin/bash
echo "Testing Email API..."

echo "1. Testing connection..."
curl -X GET http://localhost:5000/api/email/test-connection

echo -e "\n\n2. Sending test email..."
curl -X POST http://localhost:5000/api/email/test-send \
  -H "Content-Type: application/json" \
  -d '{"to": "test@example.com", "subject": "API Test"}'

echo -e "\n\n3. Sending order confirmation..."
curl -X POST http://localhost:5000/api/email/order-confirmation \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "TEST-001",
    "customerName": "Test Customer",
    "customerEmail": "test@example.com",
    "items": [{"name": "Test Product", "quantity": 1, "price": 999}],
    "totalAmount": 999,
    "shippingAddress": "Test Address",
    "orderDate": "2024-01-15"
  }'

echo -e "\n\nEmail API tests completed!"
```

## 🎯 Expected Responses

### **Success Response:**
```json
{
  "success": true,
  "message": "Order confirmation email sent successfully"
}
```

### **Error Response:**
```json
{
  "success": false,
  "message": "Failed to send order confirmation email"
}
```

## 🔧 Tips

1. **Replace email addresses** with your actual test email
2. **Ensure server is running** on http://localhost:5000
3. **Check Gmail setup** if authentication fails
4. **Use proper JSON formatting** in requests
5. **Check server logs** for detailed error messages