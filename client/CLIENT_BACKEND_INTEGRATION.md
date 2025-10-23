# Client-Backend Integration Complete Guide

This document outlines the complete integration between the MORVILN client and backend server.

## 📁 File Structure

```
client/src/
├── lib/
│   ├── api.ts           # Centralized API client with all endpoints
│   ├── auth.ts          # Authentication service using Supabase
│   ├── useAuth.ts       # Auth React hook
│   └── utils.ts         # Utility functions
├── app/services/
│   ├── product.service.ts  # Product operations
│   ├── cart.service.ts     # Cart operations
│   ├── order.service.ts    # Order operations
│   └── payment.service.ts  # Payment/Razorpay integration
```

## 🔗 API Configuration

### Base URL
The API base URL is configured in `.env.local`:
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Axios Configuration
All API calls use a centralized axios instance (`lib/api.ts`) with:
- Automatic JWT token injection in headers
- Global error handling
- Automatic redirect to login on 401 errors
- Credentials support for cookies

## 🛣️ Available API Routes

### Authentication (`authAPI`)
```typescript
import { authAPI } from '@/lib/api';

// Login
authAPI.login(email, password)

// Register
authAPI.register({ name, email, password, phone? })

// Logout
authAPI.logout()

// OAuth callback
authAPI.oauthCallback(data)

// Get current user
authAPI.getCurrentUser()

// Update profile
authAPI.updateProfile(data)
```

### Products (`productsAPI`)
```typescript
import { productsAPI } from '@/lib/api';

// Get all products with filters
productsAPI.getAll({ page?, limit?, category?, search?, minPrice?, maxPrice?, sort? })

// Get single product by ID
productsAPI.getById(id)

// Get product by slug
productsAPI.getBySlug(slug)

// Create product (admin)
productsAPI.create(data)

// Update product (admin)
productsAPI.update(id, data)

// Delete product (admin)
productsAPI.delete(id)

// Get categories
productsAPI.getCategories()

// Get featured products
productsAPI.getFeatured()

// Get related products
productsAPI.getRelated(id)
```

### Cart (`cartAPI`)
```typescript
import { cartAPI } from '@/lib/api';

// Get cart
cartAPI.get()

// Add item
cartAPI.addItem({ productId, variantId?, quantity })

// Update item quantity
cartAPI.updateItem(itemId, quantity)

// Remove item
cartAPI.removeItem(itemId)

// Clear cart
cartAPI.clear()

// Sync cart (after login)
cartAPI.sync(items)
```

### Orders (`ordersAPI`)
```typescript
import { ordersAPI } from '@/lib/api';

// Get all orders
ordersAPI.getAll({ page?, limit?, status? })

// Get single order
ordersAPI.getById(id)

// Create order
ordersAPI.create({
  items: [{ productId, variantId?, quantity, price }],
  shippingAddress: { ... },
  paymentMethod: 'razorpay',
  subtotal, shippingCost, tax, total
})

// Cancel order
ordersAPI.cancel(id, reason?)

// Get tracking
ordersAPI.getTracking(id)
```

### Payment (`paymentAPI`)
```typescript
import { paymentAPI } from '@/lib/api';

// Create Razorpay order
paymentAPI.createOrder(amount, currency)

// Verify payment
paymentAPI.verifyPayment({ razorpay_order_id, razorpay_payment_id, razorpay_signature })

// Process payment (complete flow)
paymentAPI.processPayment(data)
```

### Admin (`adminAPI`)
```typescript
import { adminAPI } from '@/lib/api';

// Dashboard stats
adminAPI.getStats()

// User management
adminAPI.getUsers({ page?, limit? })
adminAPI.getUser(id)
adminAPI.updateUser(id, data)
adminAPI.deleteUser(id)

// Order management
adminAPI.getOrders({ page?, limit?, status? })
adminAPI.updateOrderStatus(id, status)
```

### Upload (`uploadAPI`)
```typescript
import { uploadAPI } from '@/lib/api';

// Upload single image
uploadAPI.uploadImage(file, folder?)

// Upload multiple images
uploadAPI.uploadImages(files, folder?)

// Delete image
uploadAPI.deleteImage(publicId)
```

### Notifications (`notificationsAPI`)
```typescript
import { notificationsAPI } from '@/lib/api';

// Register FCM token
notificationsAPI.registerToken(token)

// Subscribe to push
notificationsAPI.subscribe(subscription)

// Unsubscribe
notificationsAPI.unsubscribe(endpoint)

// Get notifications
notificationsAPI.getAll({ page?, limit? })

// Mark as read
notificationsAPI.markAsRead(id)
notificationsAPI.markAllAsRead()
```

## 🎯 Service Classes

### ProductService
High-level product operations with error handling and fallbacks.

```typescript
import { ProductService } from '@/app/services/product.service';

// Get categories
const categories = await ProductService.getCategories();

// Upload images
const uploads = await ProductService.uploadImages(files);

// Create product
await ProductService.createProduct(payload);

// Get products
const { products, total, totalPages } = await ProductService.getProducts(page, limit);

// Get single product
const product = await ProductService.getProduct(id);

// Update product
await ProductService.updateProduct(id, payload);

// Delete product
await ProductService.deleteProduct(id);

// Generate slug
const slug = ProductService.generateSlug(name);
```

### CartService
Cart management with helper methods.

```typescript
import { CartService } from '@/app/services/cart.service';

// Get cart
const cart = await CartService.getCart();

// Add item
const updatedCart = await CartService.addItem(productId, quantity, variantId?);

// Update quantity
const updatedCart = await CartService.updateItemQuantity(itemId, quantity);

// Remove item
const updatedCart = await CartService.removeItem(itemId);

// Clear cart
await CartService.clearCart();

// Sync cart (after login)
const syncedCart = await CartService.syncCart(localCartItems);

// Helper methods
const itemCount = CartService.getItemCount(cart);
const total = CartService.calculateTotal(cart);
```

### OrderService
Order management with formatting utilities.

```typescript
import { OrderService } from '@/app/services/order.service';

// Get orders
const { orders, total, totalPages } = await OrderService.getOrders(page, limit, status?);

// Get single order
const order = await OrderService.getOrder(id);

// Create order
const newOrder = await OrderService.createOrder({
  items: [...],
  shippingAddress: {...},
  paymentMethod: 'razorpay',
  subtotal, shippingCost, tax, total
});

// Cancel order
const cancelledOrder = await OrderService.cancelOrder(id, reason?);

// Get tracking
const tracking = await OrderService.getTracking(id);

// Utility methods
const formattedNumber = OrderService.formatOrderNumber(orderNumber);
const statusColor = OrderService.getStatusColor(status);
const paymentColor = OrderService.getPaymentStatusColor(paymentStatus);
```

### PaymentService
Razorpay integration with complete payment flow.

```typescript
import { PaymentService } from '@/app/services/payment.service';

// Process complete payment (recommended)
const order = await PaymentService.processPayment(
  amount,           // in rupees
  orderData,        // order details to create after payment
  { name, email, contact }  // prefill user info
);

// Or manual flow:

// 1. Load Razorpay script
const loaded = await PaymentService.loadRazorpayScript();

// 2. Create order
const orderResponse = await PaymentService.createOrder(amount);

// 3. Verify payment
const verification = await PaymentService.verifyPayment(razorpayResponse);

// Utility methods
const formatted = PaymentService.formatAmount(amount);
const paise = PaymentService.convertToPaise(rupees);
const rupees = PaymentService.convertToRupees(paise);
```

## 🔐 Authentication Flow

### 1. Login/Signup
```typescript
import { authService } from '@/lib/auth';

// Regular login
const response = await authService.login({ email, password });
// Token and user data automatically saved to localStorage

// Signup
const response = await authService.signup({ name, email, password, phone? });
```

### 2. OAuth (Google/Facebook)
```typescript
// Initiate OAuth
await authService.loginWithGoogle();
// or
await authService.loginWithFacebook();

// Handle callback in /auth/callback page
const response = await authService.handleOAuthCallback();
```

### 3. Protected Routes
```typescript
import { authService } from '@/lib/auth';

// Check if authenticated
if (!authService.isAuthenticated()) {
  router.push('/login');
  return;
}

// Get current user
const user = authService.getCurrentUser();

// Get token
const token = authService.getToken();
```

### 4. Logout
```typescript
await authService.logout();
router.push('/login');
```

## 🎨 Usage Examples

### Example: Product Listing Page
```typescript
'use client';
import { useState, useEffect } from 'react';
import { ProductService } from '@/app/services/product.service';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await ProductService.getProducts(1, 20);
      setProducts(data.products);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  // ... render products
}
```

### Example: Add to Cart
```typescript
'use client';
import { CartService } from '@/app/services/cart.service';
import { useState } from 'react';

export default function ProductCard({ product }) {
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async () => {
    setAdding(true);
    try {
      await CartService.addItem(product.id, 1);
      alert('Added to cart!');
    } catch (error) {
      alert('Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  return (
    <button onClick={handleAddToCart} disabled={adding}>
      {adding ? 'Adding...' : 'Add to Cart'}
    </button>
  );
}
```

### Example: Checkout with Payment
```typescript
'use client';
import { PaymentService } from '@/app/services/payment.service';
import { OrderService } from '@/app/services/order.service';
import { CartService } from '@/app/services/cart.service';

export default function CheckoutPage() {
  const handleCheckout = async (cart, shippingAddress, userInfo) => {
    try {
      // Calculate total in paise
      const totalInPaise = PaymentService.convertToPaise(cart.total);

      // Prepare order data
      const orderData = {
        items: cart.items.map(item => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress,
        paymentMethod: 'razorpay',
        subtotal: cart.subtotal,
        shippingCost: 50,
        tax: cart.total * 0.18,
        total: cart.total + 50,
      };

      // Process payment and create order
      const order = await PaymentService.processPayment(
        totalInPaise,
        orderData,
        userInfo
      );

      // Clear cart after successful order
      await CartService.clearCart();

      // Redirect to order confirmation
      router.push(`/orders/${order.id}`);
    } catch (error) {
      alert('Payment failed: ' + error.message);
    }
  };

  // ... render checkout form
}
```

## ⚙️ Environment Variables

Update `.env.local` in the client directory:

```bash
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Supabase (for OAuth)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Razorpay (for payments)
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id

# Cloudinary (for image uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_API_KEY=your_api_key
```

## 🚀 Getting Started

1. **Install dependencies**
```bash
cd client
npm install axios @supabase/supabase-js
```

2. **Update environment variables**
Edit `.env.local` with your configuration.

3. **Start the backend server**
```bash
cd ../server
npm run dev
```

4. **Start the client**
```bash
cd ../client
npm run dev
```

5. **Test the connection**
Open http://localhost:3000 and try:
- Registering a new account
- Adding products to cart
- Creating an order

## 🔍 Debugging

### Check API Connection
```typescript
import { apiClient } from '@/lib/api';

// Test connection
apiClient.get('/health').then(res => {
  console.log('API Connected:', res.data);
}).catch(err => {
  console.error('API Connection Failed:', err);
});
```

### Monitor Requests
All API requests include automatic logging. Open browser DevTools > Network tab to see:
- Request URL
- Request headers (including Authorization)
- Response data
- Status codes

### Common Issues

1. **401 Unauthorized**: Token expired or invalid
   - Solution: Logout and login again

2. **CORS Error**: Backend not allowing client origin
   - Solution: Check server CORS configuration

3. **Network Error**: Backend server not running
   - Solution: Start backend server on port 3001

4. **Token not sent**: Authorization header missing
   - Solution: Ensure token is in localStorage as 'userToken'

## 📚 Additional Resources

- Backend API Documentation: `server/README.md`
- Razorpay Integration: `server/RAZORPAY_INTEGRATION_GUIDE.md`
- Authentication Flow: `server/README_AUTH.md`

## ✅ Integration Checklist

- [x] Centralized API client created
- [x] All service classes implemented
- [x] Authentication flow integrated
- [x] Product management connected
- [x] Cart operations working
- [x] Order creation integrated
- [x] Payment gateway integrated
- [x] Error handling implemented
- [x] Environment variables configured
- [x] Documentation complete

Your client is now fully connected to the backend! 🎉
