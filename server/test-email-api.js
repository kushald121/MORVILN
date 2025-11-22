/**
 * MORVILN Email API Testing Script
 * This script tests all email endpoints using Node.js
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/email';

async function testEmailAPI() {
  console.log('=== MORVILN Email API Testing ===');
  console.log('Make sure the server is running on http://localhost:5000\n');

  try {
    // Test Email Connection
    console.log('1. Testing Email Connection...');
    const testConnectionResponse = await axios.get(`${BASE_URL}/test-connection`);
    console.log('Response:', testConnectionResponse.data);
    console.log('');

    // Verify Email Service
    console.log('2. Verifying Email Service...');
    const verifyResponse = await axios.get(`${BASE_URL}/verify`);
    console.log('Response:', verifyResponse.data);
    console.log('');

    // Send Test Email
    console.log('3. Sending Test Email...');
    const testEmailResponse = await axios.post(`${BASE_URL}/test-send`, {
      to: 'recipient@example.com',
      subject: 'Test Email from MORVILN',
      text: 'This is a test email sent from the MORVILN application.'
    });
    console.log('Response:', testEmailResponse.data);
    console.log('');

    // Send Order Confirmation
    console.log('4. Sending Order Confirmation...');
    const orderConfirmationResponse = await axios.post(`${BASE_URL}/order-confirmation`, {
      email: 'customer@example.com',
      orderData: {
        customerName: 'John Doe',
        orderId: 'ORD-12345',
        orderDate: '2025-11-22',
        totalAmount: 15000,
        shippingAddress: '123 Main St, City, State 12345',
        items: [
          {
            name: 'Product 1',
            quantity: 2,
            price: 5000
          }
        ]
      }
    });
    console.log('Response:', orderConfirmationResponse.data);
    console.log('');

    console.log('=== Testing Complete ===');
    console.log('Check your email inbox for the sent emails');

  } catch (error) {
    console.error('Error testing email API:', error.response ? error.response.data : error.message);
  }
}

// Run the test
testEmailAPI();