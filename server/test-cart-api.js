/**
 * Cart API Test Script
 * 
 * This script demonstrates how to test the cart API endpoints.
 * 
 * To run this script:
 * 1. Make sure the server is running (npm run dev)
 * 2. Obtain a valid JWT token by logging in through the application
 * 3. Replace the JWT_TOKEN and VARIANT_ID placeholders with actual values
 * 4. Run: node test-cart-api.js
 */

const axios = require('axios');

// Configuration - Update these values
const BASE_URL = 'http://localhost:5000/api';
const JWT_TOKEN = 'YOUR_JWT_TOKEN_HERE';  // Replace with actual JWT token
const VARIANT_ID = 'TEST_VARIANT_ID';     // Replace with actual variant ID

// Create axios instance with base configuration
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add authentication token to all requests
api.interceptors.request.use((config) => {
  if (JWT_TOKEN) {
    config.headers.Authorization = `Bearer ${JWT_TOKEN}`;
  }
  return config;
});

async function testCartAPI() {
  console.log('🧪 Starting Cart API Tests...\n');
  
  try {
    // Test 1: Get cart (should be empty initially)
    console.log('1️⃣  Testing GET /cart (empty cart)');
    try {
      const cartResponse = await api.get('/cart');
      console.log('✅ Success:', cartResponse.data.message);
      console.log('   Items:', cartResponse.data.data.items.length);
      console.log('   Total items:', cartResponse.data.data.total_items);
      console.log('   Subtotal:', cartResponse.data.data.subtotal);
    } catch (error) {
      console.log('❌ Error:', error.response?.data?.message || error.message);
    }
    
    // Test 2: Get cart count (should be 0)
    console.log('\n2️⃣  Testing GET /cart/count');
    try {
      const countResponse = await api.get('/cart/count');
      console.log('✅ Success:', countResponse.data.message);
      console.log('   Count:', countResponse.data.data.count);
    } catch (error) {
      console.log('❌ Error:', error.response?.data?.message || error.message);
    }
    
    // Test 3: Add item to cart
    console.log('\n3️⃣  Testing POST /cart (add item)');
    try {
      const addToCartResponse = await api.post('/cart', {
        variant_id: VARIANT_ID,
        quantity: 1
      });
      console.log('✅ Success:', addToCartResponse.data.message);
      console.log('   Item ID:', addToCartResponse.data.data.id);
      console.log('   Quantity:', addToCartResponse.data.data.quantity);
    } catch (error) {
      console.log('❌ Error:', error.response?.data?.message || error.message);
    }
    
    // Test 4: Get cart (should have 1 item)
    console.log('\n4️⃣  Testing GET /cart (with items)');
    let cartItemId = null;
    try {
      const cartResponse = await api.get('/cart');
      console.log('✅ Success:', cartResponse.data.message);
      console.log('   Items:', cartResponse.data.data.items.length);
      console.log('   Total items:', cartResponse.data.data.total_items);
      console.log('   Subtotal:', cartResponse.data.data.subtotal);
      
      if (cartResponse.data.data.items.length > 0) {
        cartItemId = cartResponse.data.data.items[0].id;
        console.log('   First item ID:', cartItemId);
      }
    } catch (error) {
      console.log('❌ Error:', error.response?.data?.message || error.message);
    }
    
    // Test 5: Update cart item (if we have an item)
    if (cartItemId) {
      console.log('\n5️⃣  Testing PUT /cart/:id (update item)');
      try {
        const updateResponse = await api.put(`/cart/${cartItemId}`, {
          quantity: 2
        });
        console.log('✅ Success:', updateResponse.data.message);
        console.log('   New quantity:', updateResponse.data.data.quantity);
      } catch (error) {
        console.log('❌ Error:', error.response?.data?.message || error.message);
      }
    }
    
    // Test 6: Validate cart
    console.log('\n6️⃣  Testing GET /cart/validate');
    try {
      const validateResponse = await api.get('/cart/validate');
      console.log('✅ Success:', validateResponse.data.message);
      console.log('   Is valid:', validateResponse.data.data.isValid);
      console.log('   Issues:', validateResponse.data.data.issues.length);
    } catch (error) {
      console.log('❌ Error:', error.response?.data?.message || error.message);
    }
    
    // Test 7: Remove item from cart (if we have an item)
    if (cartItemId) {
      console.log('\n7️⃣  Testing DELETE /cart/:id (remove item)');
      try {
        const removeResponse = await api.delete(`/cart/${cartItemId}`);
        console.log('✅ Success:', removeResponse.data.message);
      } catch (error) {
        console.log('❌ Error:', error.response?.data?.message || error.message);
      }
    }
    
    // Test 8: Clear cart
    console.log('\n8️⃣  Testing DELETE /cart (clear cart)');
    try {
      const clearResponse = await api.delete('/cart');
      console.log('✅ Success:', clearResponse.data.message);
    } catch (error) {
      console.log('❌ Error:', error.response?.data?.message || error.message);
    }
    
    console.log('\n🎉 All tests completed!');
    console.log('\n📝 Notes:');
    console.log('   - Replace JWT_TOKEN with a valid authentication token');
    console.log('   - Replace VARIANT_ID with a valid product variant ID');
    console.log('   - Run this script with: node test-cart-api.js');
    
  } catch (error) {
    console.log('💥 Unexpected error:', error.message);
  }
}

// Run the tests
testCartAPI();