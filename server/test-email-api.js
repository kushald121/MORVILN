const axios = require('axios');

async function testEmailAPI() {
  const baseURL = 'http://localhost:5000/api/email';
  
  console.log('📧 Testing Email API Endpoints...\n');

  try {
    // Test 1: Connection Test
    console.log('1️⃣ Testing Gmail SMTP connection...');
    const connectionTest = await axios.get(`${baseURL}/test-connection`);
    console.log('✅ Connection test result:', connectionTest.data);
    console.log('');

    // Test 2: Send Test Email
    console.log('2️⃣ Sending test email...');
    const testEmail = await axios.post(`${baseURL}/test-send`, {
      to: 'rachnacollection11@gmail.com', // Send to the same Gmail account
      subject: '🎉 API Test Email - Success!'
    });
    console.log('✅ Test email result:', testEmail.data);
    console.log('');

    // Test 3: Order Confirmation Email
    console.log('3️⃣ Testing order confirmation email...');
    const orderConfirmation = await axios.post(`${baseURL}/order-confirmation`, {
      orderId: 'TEST-ORD-001',
      customerName: 'Test Customer',
      customerEmail: 'rachnacollection11@gmail.com',
      items: [
        {
          name: 'Test Product',
          quantity: 1,
          price: 999
        }
      ],
      totalAmount: 999,
      shippingAddress: '123 Test Street\nTest City, Test State 12345',
      orderDate: new Date().toLocaleDateString(),
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()
    });
    console.log('✅ Order confirmation result:', orderConfirmation.data);
    console.log('');

    // Test 4: Welcome Email
    console.log('4️⃣ Testing welcome email...');
    const welcomeEmail = await axios.post(`${baseURL}/welcome`, {
      userName: 'Test User',
      userEmail: 'rachnacollection11@gmail.com',
      verificationLink: 'https://example.com/verify?token=test123'
    });
    console.log('✅ Welcome email result:', welcomeEmail.data);
    console.log('');

    console.log('🎉 All email tests completed successfully!');
    console.log('📬 Check your Gmail inbox for the test emails.');

  } catch (error) {
    console.error('❌ Email API test failed:', error.response?.data || error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Make sure your server is running on http://localhost:5000');
      console.log('   Run: npm run dev');
    }
  }
}

testEmailAPI();