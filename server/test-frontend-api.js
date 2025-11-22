const axios = require('axios');

async function testFrontendAPI() {
  console.log('🔍 Testing frontend API calls...\n');
  
  try {
    // Test 1: Get all products
    console.log('1️⃣  Testing GET /api/product');
    try {
      const response = await axios.get('http://localhost:5000/api/product');
      console.log('✅ Success:', response.status);
      console.log('   Products found:', response.data.data?.length || 0);
    } catch (error) {
      console.log('❌ Error:', error.response?.status, error.response?.data?.message || error.message);
    }
    
    // Test 2: Get categories
    console.log('\n2️⃣  Testing GET /api/product/categories');
    try {
      const response = await axios.get('http://localhost:5000/api/product/categories');
      console.log('✅ Success:', response.status);
      console.log('   Categories found:', response.data.data?.length || 0);
    } catch (error) {
      console.log('❌ Error:', error.response?.status, error.response?.data?.message || error.message);
    }
    
    // Test 3: Get featured products
    console.log('\n3️⃣  Testing GET /api/product/featured');
    try {
      const response = await axios.get('http://localhost:5000/api/product/featured');
      console.log('✅ Success:', response.status);
      console.log('   Featured products found:', response.data.data?.length || 0);
    } catch (error) {
      console.log('❌ Error:', error.response?.status, error.response?.data?.message || error.message);
    }
    
    // Test 4: Test SEO-friendly routes
    console.log('\n4️⃣  Testing GET /api/products/categories');
    try {
      const response = await axios.get('http://localhost:5000/api/products/categories');
      console.log('✅ Success:', response.status);
      console.log('   SEO categories found:', response.data.data?.length || 0);
    } catch (error) {
      console.log('❌ Error:', error.response?.status, error.response?.data?.message || error.message);
    }
    
    console.log('\n✅ API tests completed!');
    
  } catch (error) {
    console.log('❌ Unexpected error:', error.message);
  }
}

testFrontendAPI();