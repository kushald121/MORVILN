# Cart Routes Testing Guide

This guide explains how to test the cart functionality in the MORVILN application.

## Prerequisites

1. The server must be running (`npm run dev` or `npm start`)
2. You need a valid JWT token from a user authentication
3. You need a valid product variant ID from the database

## Available Cart Routes

- `POST /api/cart` - Add item to cart
- `GET /api/cart` - Get user's cart
- `GET /api/cart/count` - Get cart item count
- `GET /api/cart/validate` - Validate cart before checkout
- `PUT /api/cart/:cartItemId` - Update cart item quantity
- `DELETE /api/cart/:cartItemId` - Remove item from cart
- `DELETE /api/cart` - Clear entire cart

## Testing Methods

### 1. Using the Test Scripts

#### TypeScript Test (Node.js)
```bash
cd server
npm run test-cart
```

Before running, update the `src/test/cart.test.ts` file with:
- A valid JWT token
- A valid product variant ID

#### Shell Script (Linux/Mac)
```bash
cd server
chmod +x test-cart-routes.sh
./test-cart-routes.sh
```

#### Batch Script (Windows)
```cmd
cd server
test-cart-routes.bat
```

For both scripts, update the variables at the top:
- `JWT_TOKEN` - A valid JWT token
- `VARIANT_ID` - A valid product variant ID

### 2. Using cURL Directly

#### Add Item to Cart
```bash
curl -X POST http://localhost:3000/api/cart \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"variant_id": "VARIANT_ID", "quantity": 1}'
```

#### Get Cart
```bash
curl -X GET http://localhost:3000/api/cart \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Get Cart Count
```bash
curl -X GET http://localhost:3000/api/cart/count \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Update Cart Item
```bash
curl -X PUT http://localhost:3000/api/cart/CART_ITEM_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"quantity": 2}'
```

#### Remove Item from Cart
```bash
curl -X DELETE http://localhost:3000/api/cart/CART_ITEM_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Clear Cart
```bash
curl -X DELETE http://localhost:3000/api/cart \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Validate Cart
```bash
curl -X GET http://localhost:3000/api/cart/validate \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Test Data Preparation

1. **Get a JWT Token**: Log in through the application or use the auth routes to obtain a token
2. **Find a Product Variant**: Check the database for an existing product variant ID or create one

## Expected Responses

### Successful Responses
- Add to Cart: HTTP 201 with cart item data
- Get Cart: HTTP 200 with cart summary
- Update Item: HTTP 200 with updated cart item
- Remove Item/Clear Cart: HTTP 200 with success message
- Get Count/Validate: HTTP 200 with requested data

### Error Responses
- Unauthorized: HTTP 401 when no valid token provided
- Bad Request: HTTP 400 for invalid data (missing fields, invalid quantities)
- Not Found: HTTP 404 when cart item doesn't exist
- Server Error: HTTP 500 for unexpected issues

## Troubleshooting

1. **401 Unauthorized**: Check that your JWT token is valid and not expired
2. **400 Bad Request**: Verify that you're sending the correct data format
3. **404 Not Found**: Ensure the cart item ID exists in the database
4. **500 Server Error**: Check server logs for detailed error information