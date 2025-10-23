# API Usage Examples

This document provides examples of how to use the Product and Cart APIs.

## Product APIs

### 1. Get All Products
```http
GET /api/products
```

**Query Parameters:**
- `category_id` (optional): Filter by category UUID
- `gender` (optional): Filter by gender (men, women, unisex, kids)
- `min_price` (optional): Minimum price filter
- `max_price` (optional): Maximum price filter
- `tags` (optional): Comma-separated tags
- `is_featured` (optional): true/false for featured products
- `search` (optional): Search term for name/description
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `sort_by` (optional): name, price, created_at (default: created_at)
- `sort_order` (optional): asc, desc (default: desc)

**Example:**
```http
GET /api/products?category_id=123&gender=men&page=1&limit=10
```

### 2. Get Single Product
```http
GET /api/products/:identifier
```
- `identifier` can be product ID (UUID) or slug

**Example:**
```http
GET /api/products/t-shirt-basic-blue
GET /api/products/550e8400-e29b-41d4-a716-446655440000
```

### 3. Get Featured Products
```http
GET /api/products/featured?limit=8
```

### 4. Get Categories
```http
GET /api/products/categories
```

### 5. Search Products
```http
GET /api/products/search?q=blue%20shirt&limit=10
```

### 6. Check Product Availability
```http
GET /api/products/availability/:variantId?quantity=2
```

## Cart APIs (Requires Authentication)

All cart APIs require authentication via:
- Cookie: `auth_token`
- Header: `Authorization: Bearer <token>`

### 1. Add Item to Cart
```http
POST /api/cart
Content-Type: application/json

{
  "variant_id": "550e8400-e29b-41d4-a716-446655440000",
  "quantity": 2
}
```

### 2. Get Cart
```http
GET /api/cart
```

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "cart-item-id",
        "user_id": "user-id",
        "variant_id": "variant-id",
        "quantity": 2,
        "product": {
          "id": "product-id",
          "name": "Blue T-Shirt",
          "slug": "blue-t-shirt",
          "base_price": 29.99,
          "compare_at_price": 39.99
        },
        "variant": {
          "id": "variant-id",
          "sku": "BTS-M-BLUE",
          "size": "M",
          "color": "Blue",
          "additional_price": 0,
          "stock_quantity": 50
        },
        "media": {
          "media_url": "https://example.com/image.jpg",
          "alt_text": "Blue T-Shirt"
        }
      }
    ],
    "total_items": 2,
    "subtotal": 59.98,
    "estimated_total": 59.98
  }
}
```

### 3. Update Cart Item Quantity
```http
PUT /api/cart/:cartItemId
Content-Type: application/json

{
  "quantity": 3
}
```

### 4. Remove Item from Cart
```http
DELETE /api/cart/:cartItemId
```

### 5. Clear Entire Cart
```http
DELETE /api/cart
```

### 6. Get Cart Item Count
```http
GET /api/cart/count
```

**Response:**
```json
{
  "success": true,
  "data": {
    "count": 5
  }
}
```

### 7. Validate Cart
```http
GET /api/cart/validate
```

**Response:**
```json
{
  "success": true,
  "data": {
    "isValid": true,
    "issues": []
  }
}
```

## Error Responses

All APIs return consistent error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created (for POST requests)
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (authentication required)
- `404`: Not Found
- `500`: Internal Server Error

## Authentication

To authenticate requests, include one of:

1. **Cookie** (recommended for web apps):
   ```http
   Cookie: auth_token=your_jwt_token_here
   ```

2. **Authorization Header**:
   ```http
   Authorization: Bearer your_jwt_token_here
   ```

## Database Schema Notes

The implementation uses the following key tables:
- `products`: Main product information
- `product_variants`: Size/color variations with inventory
- `product_media`: Product images and videos
- `categories`: Product categories
- `cart`: User cart items (logged-in users only)

The system includes automatic inventory management with reserved quantities for cart items and proper stock validation.