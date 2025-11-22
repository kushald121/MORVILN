/**
 * Test script for Product and Cart APIs
 * Run with: node test-product-cart-api.js
 */

const BASE_URL = 'http://localhost:5000/api';

// Test data
const testData = {
    // You'll need to replace these with actual IDs from your database
    productId: 'test-product-id',
    variantId: 'test-variant-id',
    authToken: 'your-jwt-token-here' // Get this from login
};

async function makeRequest(endpoint, options = {}) {
    try {
        const url = `${BASE_URL}${endpoint}`;
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });

        const data = await response.json();
        console.log(`${options.method || 'GET'} ${endpoint}:`, {
            status: response.status,
            data
        });

        return { response, data };
    } catch (error) {
        console.error(`Error with ${endpoint}:`, error.message);
        return { error };
    }
}

async function testProductAPIs() {
    console.log('\n=== Testing Product APIs ===');

    // Test get all products
    await makeRequest('/products?limit=5');

    // Test get featured products
    await makeRequest('/products/featured?limit=3');

    // Test get categories
    await makeRequest('/products/categories');

    // Test search products
    await makeRequest('/products/search?q=shirt&limit=3');

    // Test get single product (you'll need to replace with actual product ID/slug)
    // await makeRequest(`/products/${testData.productId}`);

    // Test check availability (you'll need to replace with actual variant ID)
    // await makeRequest(`/products/availability/${testData.variantId}?quantity=1`);
}

async function testCartAPIs() {
    console.log('\n=== Testing Cart APIs (requires authentication) ===');

    const authHeaders = {
        'Authorization': `Bearer ${testData.authToken}`
    };

    // Test get cart
    await makeRequest('/cart', { headers: authHeaders });

    // Test get cart count
    await makeRequest('/cart/count', { headers: authHeaders });

    // Test validate cart
    await makeRequest('/cart/validate', { headers: authHeaders });

    // Test add to cart (you'll need to replace with actual variant ID)
    /*
    await makeRequest('/cart', {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        variant_id: testData.variantId,
        quantity: 1
      })
    });
    */

    // Test update cart item (you'll need cart item ID)
    /*
    await makeRequest('/cart/cart-item-id', {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({
        quantity: 2
      })
    });
    */

    // Test remove from cart (you'll need cart item ID)
    /*
    await makeRequest('/cart/cart-item-id', {
      method: 'DELETE',
      headers: authHeaders
    });
    */
}

async function runTests() {
    console.log('🚀 Starting API Tests...');
    console.log(`Base URL: ${BASE_URL}`);

    // Test product APIs (no auth required)
    await testProductAPIs();

    // Test cart APIs (auth required)
    if (testData.authToken && testData.authToken !== 'your-jwt-token-here') {
        await testCartAPIs();
    } else {
        console.log('\n⚠️  Skipping Cart API tests - no auth token provided');
        console.log('   To test cart APIs, update testData.authToken with a valid JWT token');
    }

    console.log('\n✅ API Tests completed!');
}

// Check if fetch is available (Node.js 18+)
if (typeof fetch === 'undefined') {
    console.error('❌ This script requires Node.js 18+ or install node-fetch');
    console.log('   Alternative: Use curl, Postman, or your browser dev tools');
    process.exit(1);
}

// Run the tests
runTests().catch(console.error);