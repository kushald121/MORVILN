const axios = require('axios');

const testAdminLogin = async () => {
  try {
    console.log('🧪 Testing admin login endpoint...\n');
    
    const url = 'http://localhost:5000/api/admin/login';
    const credentials = {
      email: 'superadmin@morviln.com',
      password: 'Admin@1234'
    };
    
    console.log('URL:', url);
    console.log('Credentials:', credentials);
    console.log('\nSending request...\n');
    
    const response = await axios.post(url, credentials, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ SUCCESS!');
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.log('❌ ERROR!');
    
    if (error.response) {
      // Server responded with error
      console.log('Status:', error.response.status);
      console.log('Response:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      // Request made but no response
      console.log('No response received from server');
      console.log('Is your server running on http://localhost:5000?');
    } else {
      // Error setting up request
      console.log('Error:', error.message);
    }
  }
};

testAdminLogin();
