const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/orders';

// Sample order data
const testOrder = {
  customer_email: "test.customer@example.com",
  customer_name: "Test Customer",
  customer_phone: "+91 9876543210",
  shipping_address: {
    full_name: "Test Customer",
    phone: "+91 9876543210",
    address_line_1: "123 Fashion Street",
    address_line_2: "Apartment 5B",
    landmark: "Near City Mall",
    city: "Mumbai",
    state: "Maharashtra",
    postal_code: "400001",
    country: "India"
  },
  products: [
    {
      product_id: "550e8400-e29b-41d4-a716-446655440001",
      product_name: "Blue Cotton T-Shirt",
      variant_id: "550e8400-e29b-41d4-a716-446655440011",
      sku: "TSH-BLU-M-001",
      size: "M",
      color: "Blue",
      quantity: 2,
      price: 599.00,
      total: 1198.00
    },
    {
      product_id: "550e8400-e29b-41d4-a716-446655440002",
      product_name: "Black Denim Jeans",
      variant_id: "550e8400-e29b-41d4-a716-446655440012",
      sku: "JNS-BLK-32-001",
      size: "32",
      color: "Black",
      quantity: 1,
      price: 1299.00,
      total: 1299.00
    }
  ],
  subtotal_amount: 2497.00,
  shipping_amount: 99.00,
  tax_amount: 449.46,
  discount_amount: 250.00,
  total_amount: 2795.46,
  payment_method: "razorpay",
  payment_gateway: "razorpay"
};

// Test 1: Create Order
async function testCreateOrder() {
  try {
    console.log('\n📦 Test 1: Creating Order...');
    console.log('=====================================');
    
    const response = await axios.post(`${BASE_URL}/create`, testOrder);
    
    console.log('✅ SUCCESS - Order Created!');
    console.log('Order Number:', response.data.data.order_number);
    console.log('Order ID:', response.data.data.id);
    console.log('Payment Status:', response.data.data.payment_status);
    console.log('Fulfillment Status:', response.data.data.fulfillment_status);
    console.log('Total Amount:', response.data.data.total_amount);
    
    return response.data.data;
  } catch (error) {
    console.error('❌ FAILED - Create Order Error:');
    console.error(error.response?.data || error.message);
    throw error;
  }
}

// Test 2: Get Order by ID
async function testGetOrderById(orderId) {
  try {
    console.log('\n🔍 Test 2: Getting Order by ID...');
    console.log('=====================================');
    
    const response = await axios.get(`${BASE_URL}/${orderId}`);
    
    console.log('✅ SUCCESS - Order Retrieved!');
    console.log('Order Number:', response.data.data.order_number);
    console.log('Customer Name:', response.data.data.customer_name);
    console.log('Products Count:', response.data.data.products.length);
    
    return response.data.data;
  } catch (error) {
    console.error('❌ FAILED - Get Order Error:');
    console.error(error.response?.data || error.message);
    throw error;
  }
}

// Test 3: Get Order by Order Number
async function testGetOrderByNumber(orderNumber) {
  try {
    console.log('\n🔍 Test 3: Getting Order by Order Number...');
    console.log('=====================================');
    
    const response = await axios.get(`${BASE_URL}/number/${orderNumber}`);
    
    console.log('✅ SUCCESS - Order Retrieved by Number!');
    console.log('Order ID:', response.data.data.id);
    console.log('Customer Email:', response.data.data.customer_email);
    
    return response.data.data;
  } catch (error) {
    console.error('❌ FAILED - Get Order by Number Error:');
    console.error(error.response?.data || error.message);
    throw error;
  }
}

// Test 4: Update Payment Status
async function testUpdatePaymentStatus(orderId) {
  try {
    console.log('\n💳 Test 4: Updating Payment Status...');
    console.log('=====================================');
    
    const response = await axios.put(`${BASE_URL}/${orderId}/payment-status`, {
      payment_status: 'paid',
      payment_gateway_id: 'pay_test123abc456'
    });
    
    console.log('✅ SUCCESS - Payment Status Updated!');
    console.log('Payment Status:', response.data.data.payment_status);
    console.log('Payment Gateway ID:', response.data.data.payment_gateway_id);
    console.log('Paid At:', response.data.data.paid_at);
    
    return response.data.data;
  } catch (error) {
    console.error('❌ FAILED - Update Payment Status Error:');
    console.error(error.response?.data || error.message);
    throw error;
  }
}

// Test 5: Get All Orders
async function testGetAllOrders() {
  try {
    console.log('\n📋 Test 5: Getting All Orders...');
    console.log('=====================================');
    
    const response = await axios.get(`${BASE_URL}?limit=5&offset=0`);
    
    console.log('✅ SUCCESS - Orders Retrieved!');
    console.log('Total Orders:', response.data.total);
    console.log('Returned:', response.data.data.length);
    console.log('Orders:');
    response.data.data.forEach((order, index) => {
      console.log(`  ${index + 1}. ${order.order_number} - ${order.customer_name} - ₹${order.total_amount}`);
    });
    
    return response.data;
  } catch (error) {
    console.error('❌ FAILED - Get All Orders Error:');
    console.error(error.response?.data || error.message);
    throw error;
  }
}

// Run all tests
async function runAllTests() {
  console.log('\n🚀 Starting Order API Tests...');
  console.log('=====================================');
  console.log('Server:', BASE_URL);
  console.log('=====================================');
  
  try {
    // Test 1: Create Order
    const createdOrder = await testCreateOrder();
    await new Promise(resolve => setTimeout(resolve, 500)); // Small delay
    
    // Test 2: Get Order by ID
    await testGetOrderById(createdOrder.id);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Test 3: Get Order by Order Number
    await testGetOrderByNumber(createdOrder.order_number);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Test 4: Update Payment Status
    await testUpdatePaymentStatus(createdOrder.id);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Test 5: Get All Orders
    await testGetAllOrders();
    
    console.log('\n✅ ALL TESTS PASSED! 🎉');
    console.log('=====================================');
    console.log('Order is successfully saved to database!');
    console.log('Check Supabase dashboard to verify.');
    
  } catch (error) {
    console.log('\n❌ TESTS FAILED');
    console.log('=====================================');
    console.log('Please check the error messages above.');
  }
}

// Check if server is running
async function checkServer() {
  try {
    await axios.get('http://localhost:5000/api/test/health');
    return true;
  } catch (error) {
    return false;
  }
}

// Main execution
(async () => {
  console.log('Checking if server is running...');
  
  const serverRunning = await checkServer();
  
  if (!serverRunning) {
    console.error('❌ ERROR: Server is not running on http://localhost:5000');
    console.log('\nPlease start the server first:');
    console.log('  cd server');
    console.log('  npm run dev');
    process.exit(1);
  }
  
  console.log('✅ Server is running\n');
  await runAllTests();
})();
