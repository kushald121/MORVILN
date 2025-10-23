# 📧 Postman Test for Order Confirmation Email

## 🚀 Quick Test Setup

### **Method:** `POST`
### **URL:** `http://localhost:5000/api/email/order-confirmation`

### **Headers:**
```
Content-Type: application/json
```

### **Request Body (JSON):**

```json
{
  "orderId": "ORD-2024-001",
  "customerName": "John Doe",
  "customerEmail": "customer@example.com",
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
    },
    {
      "name": "Casual Sneakers",
      "quantity": 1,
      "price": 3999,
      "image": "https://example.com/sneakers.jpg"
    }
  ],
  "totalAmount": 7797,
  "shippingAddress": "John Doe\n123 Main Street\nApartment 4B\nMumbai, Maharashtra 400001\nIndia",
  "orderDate": "2024-01-15",
  "estimatedDelivery": "2024-01-22"
}
```

## 📋 Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `orderId` | string | ✅ | Unique order identifier |
| `customerName` | string | ✅ | Customer's full name |
| `customerEmail` | string | ✅ | Customer's email address |
| `items` | array | ✅ | Array of ordered items |
| `items[].name` | string | ✅ | Product name |
| `items[].quantity` | number | ✅ | Quantity ordered |
| `items[].price` | number | ✅ | Price per item (in paise/cents) |
| `items[].image` | string | ❌ | Product image URL (optional) |
| `totalAmount` | number | ✅ | Total order amount |
| `shippingAddress` | string | ✅ | Complete shipping address |
| `orderDate` | string | ✅ | Order date (YYYY-MM-DD) |
| `estimatedDelivery` | string | ❌ | Estimated delivery date |

## 🎯 Expected Responses

### ✅ **Success Response (200):**
```json
{
  "success": true,
  "message": "Order confirmation email sent successfully"
}
```

### ❌ **Error Response (400) - Missing Fields:**
```json
{
  "success": false,
  "message": "Missing required order details"
}
```

### ❌ **Error Response (500) - Email Send Failed:**
```json
{
  "success": false,
  "message": "Failed to send order confirmation email"
}
```

## 🧪 Test Variations

### **Test 1: Minimal Order**
```json
{
  "orderId": "ORD-MIN-001",
  "customerName": "Jane Smith",
  "customerEmail": "jane@example.com",
  "items": [
    {
      "name": "Basic T-Shirt",
      "quantity": 1,
      "price": 599
    }
  ],
  "totalAmount": 599,
  "shippingAddress": "Jane Smith\n456 Oak Avenue\nDelhi, India",
  "orderDate": "2024-01-15"
}
```

### **Test 2: Large Order with Multiple Items**
```json
{
  "orderId": "ORD-LARGE-001",
  "customerName": "Rajesh Kumar",
  "customerEmail": "rajesh@example.com",
  "items": [
    {
      "name": "Formal Shirt - White",
      "quantity": 3,
      "price": 1599,
      "image": "https://example.com/formal-shirt.jpg"
    },
    {
      "name": "Formal Trousers - Black",
      "quantity": 2,
      "price": 2299
    },
    {
      "name": "Leather Belt",
      "quantity": 1,
      "price": 899
    },
    {
      "name": "Formal Shoes",
      "quantity": 1,
      "price": 4999,
      "image": "https://example.com/formal-shoes.jpg"
    }
  ],
  "totalAmount": 14495,
  "shippingAddress": "Rajesh Kumar\nFlat 301, Sunrise Apartments\nSector 15, Noida\nUttar Pradesh 201301\nIndia",
  "orderDate": "2024-01-15",
  "estimatedDelivery": "2024-01-20"
}
```

### **Test 3: International Order**
```json
{
  "orderId": "ORD-INTL-001",
  "customerName": "Sarah Johnson",
  "customerEmail": "sarah@example.com",
  "items": [
    {
      "name": "Indian Ethnic Kurta",
      "quantity": 2,
      "price": 2999,
      "image": "https://example.com/kurta.jpg"
    }
  ],
  "totalAmount": 5998,
  "shippingAddress": "Sarah Johnson\n123 Broadway Street\nNew York, NY 10001\nUnited States",
  "orderDate": "2024-01-15",
  "estimatedDelivery": "2024-01-25"
}
```

## 🔧 Postman Setup Instructions

### **Step 1: Import Collection**
1. Open Postman
2. Click "Import" button
3. Upload the `POSTMAN_EMAIL_TESTS.json` file
4. Collection will be imported with all endpoints

### **Step 2: Set Environment Variable**
1. Create new environment in Postman
2. Add variable: `base_url` = `http://localhost:5000`
3. Select this environment

### **Step 3: Test Order Confirmation**
1. Select "3. Order Confirmation Email" request
2. Modify the email address in the body to your test email
3. Click "Send"
4. Check response and your email inbox

## 🎨 Email Template Preview

The order confirmation email includes:
- ✅ Professional header with gradient background
- ✅ Order details table with itemized breakdown
- ✅ Customer and shipping information
- ✅ Total amount calculation
- ✅ Estimated delivery date
- ✅ Professional footer
- ✅ Responsive design for mobile devices

## 🚨 Troubleshooting

### **Issue: Connection Refused**
- **Solution:** Make sure server is running (`npm run dev`)

### **Issue: Gmail Auth Error**
- **Solution:** Update Gmail App Password in `.env` file
- See `GMAIL_SETUP_GUIDE.md` for instructions

### **Issue: Email Not Received**
- **Check:** Spam/Junk folder
- **Check:** Email address is correct
- **Check:** Gmail daily limits (500 emails/day for free accounts)

## 📞 Support

If you encounter issues:
1. Check server logs for detailed error messages
2. Verify all required fields are provided
3. Ensure Gmail SMTP is properly configured
4. Test with `GET /api/email/test-connection` first

## 🎉 Success!

Once the email sends successfully, you'll receive a beautifully formatted order confirmation email with all the order details, professional styling, and your branding! 📧✨