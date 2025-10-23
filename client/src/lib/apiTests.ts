// Test Client-Backend Connection
// Run this in browser console or create a test page

import { apiClient, authAPI, productsAPI, cartAPI, ordersAPI } from '@/lib/api';

/**
 * Test 1: Check API Connection
 */
export async function testConnection() {
  console.log('🔍 Testing API connection...');
  try {
    const response = await apiClient.get('/health');
    console.log('✅ API Connected:', response.data);
    return true;
  } catch (error: any) {
    console.error('❌ API Connection Failed:', error.message);
    return false;
  }
}

/**
 * Test 2: Test Product Endpoints
 */
export async function testProducts() {
  console.log('🔍 Testing Products API...');
  try {
    // Get products
    const response = await productsAPI.getAll({ page: 1, limit: 5 });
    console.log('✅ Products:', response.data);
    
    // Get categories
    const categories = await productsAPI.getCategories();
    console.log('✅ Categories:', categories.data);
    
    return true;
  } catch (error: any) {
    console.error('❌ Products API Failed:', error.response?.data || error.message);
    return false;
  }
}

/**
 * Test 3: Test Authentication (Login)
 */
export async function testAuth(email: string, password: string) {
  console.log('🔍 Testing Auth API...');
  try {
    const response = await authAPI.login(email, password);
    console.log('✅ Login Success:', response.data);
    return true;
  } catch (error: any) {
    console.error('❌ Auth Failed:', error.response?.data || error.message);
    return false;
  }
}

/**
 * Test 4: Test Registration
 */
export async function testRegister(data: {
  name: string;
  email: string;
  password: string;
  phone?: string;
}) {
  console.log('🔍 Testing Registration...');
  try {
    const response = await authAPI.register(data);
    console.log('✅ Registration Success:', response.data);
    return true;
  } catch (error: any) {
    console.error('❌ Registration Failed:', error.response?.data || error.message);
    return false;
  }
}

/**
 * Test 5: Test Cart (requires authentication)
 */
export async function testCart() {
  console.log('🔍 Testing Cart API...');
  try {
    // Get cart
    const cart = await cartAPI.get();
    console.log('✅ Cart:', cart.data);
    return true;
  } catch (error: any) {
    console.error('❌ Cart API Failed:', error.response?.data || error.message);
    return false;
  }
}

/**
 * Test 6: Test Orders (requires authentication)
 */
export async function testOrders() {
  console.log('🔍 Testing Orders API...');
  try {
    const orders = await ordersAPI.getAll({ page: 1, limit: 5 });
    console.log('✅ Orders:', orders.data);
    return true;
  } catch (error: any) {
    console.error('❌ Orders API Failed:', error.response?.data || error.message);
    return false;
  }
}

/**
 * Run All Tests
 */
export async function runAllTests() {
  console.log('🚀 Starting API Tests...\n');
  
  const results = {
    connection: await testConnection(),
    products: await testProducts(),
    // Auth tests require credentials
    // auth: await testAuth('test@example.com', 'password'),
    // cart: await testCart(),
    // orders: await testOrders(),
  };
  
  console.log('\n📊 Test Results:');
  console.table(results);
  
  const allPassed = Object.values(results).every(r => r === true);
  if (allPassed) {
    console.log('✅ All tests passed! Client-Backend integration is working.');
  } else {
    console.log('❌ Some tests failed. Check the errors above.');
  }
  
  return results;
}

// Export individual test functions
export default {
  testConnection,
  testProducts,
  testAuth,
  testRegister,
  testCart,
  testOrders,
  runAllTests,
};
