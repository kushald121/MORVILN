"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
// Base URL for the API
const BASE_URL = 'http://localhost:3000/api';
// Test user credentials (you'll need to create a test user or use existing one)
const TEST_USER_TOKEN = 'YOUR_JWT_TOKEN_HERE'; // Replace with actual JWT token
// Test product variant ID (you'll need to use an actual variant ID from your database)
const TEST_VARIANT_ID = 'TEST_VARIANT_ID'; // Replace with actual variant ID
const apiClient = axios_1.default.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});
// Set the authorization header
apiClient.interceptors.request.use((config) => {
    if (TEST_USER_TOKEN) {
        config.headers.Authorization = `Bearer ${TEST_USER_TOKEN}`;
    }
    return config;
});
async function runCartTests() {
    console.log('🧪 Starting Cart API Tests...\n');
    try {
        // Test 1: Add item to cart
        console.log('Test 1: Adding item to cart...');
        const addToCartResponse = await apiClient.post('/cart', {
            variant_id: TEST_VARIANT_ID,
            quantity: 1
        });
        if (addToCartResponse.status === 201) {
            console.log('✅ Add to cart successful');
            console.log('Response:', addToCartResponse.data);
        }
        else {
            console.log('❌ Add to cart failed');
            console.log('Status:', addToCartResponse.status);
            console.log('Response:', addToCartResponse.data);
            return;
        }
        // Test 2: Get cart
        console.log('\nTest 2: Getting cart...');
        const getCartResponse = await apiClient.get('/cart');
        if (getCartResponse.status === 200) {
            console.log('✅ Get cart successful');
            console.log('Cart items:', getCartResponse.data.data.items.length);
            console.log('Total items:', getCartResponse.data.data.total_items);
            console.log('Subtotal:', getCartResponse.data.data.subtotal);
        }
        else {
            console.log('❌ Get cart failed');
            console.log('Status:', getCartResponse.status);
            console.log('Response:', getCartResponse.data);
            return;
        }
        // Test 3: Get cart count
        console.log('\nTest 3: Getting cart count...');
        const getCartCountResponse = await apiClient.get('/cart/count');
        if (getCartCountResponse.status === 200) {
            console.log('✅ Get cart count successful');
            console.log('Cart count:', getCartCountResponse.data.data.count);
        }
        else {
            console.log('❌ Get cart count failed');
            console.log('Status:', getCartCountResponse.status);
            console.log('Response:', getCartCountResponse.data);
            return;
        }
        // Test 4: Update cart item (assuming we have at least one item)
        if (getCartResponse.data.data.items.length > 0) {
            const cartItemId = getCartResponse.data.data.items[0].id;
            console.log('\nTest 4: Updating cart item...');
            const updateCartItemResponse = await apiClient.put(`/cart/${cartItemId}`, {
                quantity: 2
            });
            if (updateCartItemResponse.status === 200) {
                console.log('✅ Update cart item successful');
                console.log('Updated item quantity:', updateCartItemResponse.data.data.quantity);
            }
            else {
                console.log('❌ Update cart item failed');
                console.log('Status:', updateCartItemResponse.status);
                console.log('Response:', updateCartItemResponse.data);
                return;
            }
        }
        // Test 5: Validate cart
        console.log('\nTest 5: Validating cart...');
        const validateCartResponse = await apiClient.get('/cart/validate');
        if (validateCartResponse.status === 200) {
            console.log('✅ Validate cart successful');
            console.log('Is valid:', validateCartResponse.data.data.isValid);
            console.log('Issues:', validateCartResponse.data.data.issues);
        }
        else {
            console.log('❌ Validate cart failed');
            console.log('Status:', validateCartResponse.status);
            console.log('Response:', validateCartResponse.data);
            return;
        }
        // Test 6: Remove item from cart (assuming we have at least one item)
        if (getCartResponse.data.data.items.length > 0) {
            const cartItemId = getCartResponse.data.data.items[0].id;
            console.log('\nTest 6: Removing item from cart...');
            const removeFromCartResponse = await apiClient.delete(`/cart/${cartItemId}`);
            if (removeFromCartResponse.status === 200) {
                console.log('✅ Remove item from cart successful');
                console.log('Message:', removeFromCartResponse.data.message);
            }
            else {
                console.log('❌ Remove item from cart failed');
                console.log('Status:', removeFromCartResponse.status);
                console.log('Response:', removeFromCartResponse.data);
                return;
            }
        }
        // Test 7: Clear cart
        console.log('\nTest 7: Clearing cart...');
        const clearCartResponse = await apiClient.delete('/cart');
        if (clearCartResponse.status === 200) {
            console.log('✅ Clear cart successful');
            console.log('Message:', clearCartResponse.data.message);
        }
        else {
            console.log('❌ Clear cart failed');
            console.log('Status:', clearCartResponse.status);
            console.log('Response:', clearCartResponse.data);
            return;
        }
        console.log('\n🎉 All cart tests completed successfully!');
    }
    catch (error) {
        console.log('💥 Test failed with error:');
        if (error.response) {
            console.log('Status:', error.response.status);
            console.log('Data:', error.response.data);
            console.log('Headers:', error.response.headers);
        }
        else if (error.request) {
            console.log('No response received:', error.request);
        }
        else {
            console.log('Error message:', error.message);
        }
    }
}
// Run the tests
runCartTests();
