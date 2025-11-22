# MORVILN Server

This is the backend server for the MORVILN application, built with Node.js, Express, and TypeScript.

## Table of Contents

- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Environment Variables](#environment-variables)

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables (see [.env.example](.env.example))

3. Start the development server:
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Start the development server with hot reloading
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start the production server
- `npm test` - Run tests
- `npm run test-email` - Test email functionality
- `npm run test-email-system` - Test email system
- `npm run test-cart` - Test cart functionality (TypeScript)

## API Endpoints

All API endpoints are prefixed with `/api`:

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login with email and password
- `GET /api/auth/me` - Get current user information
- `POST /api/auth/logout` - Logout current user

### Cart
- `POST /api/cart` - Add item to cart
- `GET /api/cart` - Get user's cart
- `GET /api/cart/count` - Get cart item count
- `GET /api/cart/validate` - Validate cart before checkout
- `PUT /api/cart/:cartItemId` - Update cart item quantity
- `DELETE /api/cart/:cartItemId` - Remove item from cart
- `DELETE /api/cart` - Clear entire cart

### Payments
- `POST /api/payments/create-order` - Create a new payment order
- `POST /api/payments/verify-payment` - Verify payment status

### Email
- `POST /api/email/send` - Send an email
- `POST /api/email/order-confirmation` - Send order confirmation email
- `POST /api/email/welcome` - Send welcome email
- `POST /api/email/password-reset` - Send password reset email

## Testing

### Cart Testing

The cart functionality can be tested using several methods:

1. **Using the test script**:
   ```bash
   node test-cart-api.js
   ```

2. **Using cURL**:
   ```bash
   # Add item to cart
   curl -X POST http://localhost:5000/api/cart \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"variant_id": "VARIANT_ID", "quantity": 1}'
   ```

3. **Using the shell script** (Linux/Mac):
   ```bash
   chmod +x test-cart-routes.sh
   ./test-cart-routes.sh
   ```

4. **Using the batch script** (Windows):
   ```cmd
   test-cart-routes.bat
   ```

For detailed cart testing instructions, see [CART_TESTING_GUIDE.md](CART_TESTING_GUIDE.md).

### Email Testing

For email testing instructions, see:
- [CURL_EMAIL_TESTS.md](CURL_EMAIL_TESTS.md)
- [EMAIL_IMPLEMENTATION_SUMMARY.md](EMAIL_IMPLEMENTATION_SUMMARY.md)
- [GMAIL_SETUP_GUIDE.md](GMAIL_SETUP_GUIDE.md)

## Environment Variables

See [.env](.env) for all required environment variables.

Key variables include:
- `PORT` - Server port (default: 5000)
- `DATABASE_URL` - PostgreSQL database connection string
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_KEY` - Supabase service role key
- `JWT_SECRET` - Secret for JWT token signing
- `GMAIL_USER` - Gmail account for sending emails
- `GMAIL_APP_PASSWORD` - App password for Gmail account