import emailService from '../services/email.service';
import { testEmailConnection } from '../config/email';
import { OrderDetails } from '../templates/orderConfirmation';
import { WelcomeEmailData } from '../templates/welcomeEmail';
import { PasswordResetData } from '../templates/passwordReset';

/**
 * Test email functionality
 * Run this file to test your Ahasend email setup
 */

async function testEmailSetup() {
  console.log('🧪 Testing Ahasend Email Setup...\n');

  // Test 1: Connection Test
  console.log('1️⃣ Testing SMTP connection...');
  const isConnected = await testEmailConnection();
  if (!isConnected) {
    console.log('❌ Connection test failed. Please check your Ahasend credentials.');
    return;
  }
  console.log('✅ SMTP connection successful!\n');

  // Test 2: Simple Email Test
  console.log('2️⃣ Testing simple email...');
  try {
    const testEmailSuccess = await emailService.sendEmail({
      to: 'test@example.com', // Replace with your test email
      subject: '🧪 Ahasend Test Email',
      html: `
        <h2>🎉 Ahasend Integration Test</h2>
        <p>This is a test email to verify your Ahasend setup is working correctly.</p>
        <p><strong>Sent at:</strong> ${new Date().toLocaleString()}</p>
        <p>If you received this email, your configuration is perfect! ✨</p>
      `,
    });

    if (testEmailSuccess) {
      console.log('✅ Simple email test passed!\n');
    } else {
      console.log('❌ Simple email test failed.\n');
    }
  } catch (error) {
    console.log('❌ Simple email test error:', error);
  }

  // Test 3: Order Confirmation Email
  console.log('3️⃣ Testing order confirmation email...');
  try {
    const orderDetails: OrderDetails = {
      orderId: 'ORD-123456',
      customerName: 'John Doe',
      customerEmail: 'customer@example.com', // Replace with your test email
      items: [
        {
          name: 'Premium T-Shirt',
          quantity: 2,
          price: 999,
          image: 'https://example.com/tshirt.jpg',
        },
        {
          name: 'Jeans',
          quantity: 1,
          price: 1999,
        },
      ],
      totalAmount: 3997,
      shippingAddress: 'John Doe\n123 Main Street\nCity, State 12345\nCountry',
      orderDate: new Date().toLocaleDateString(),
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    };

    const orderEmailSuccess = await emailService.sendOrderConfirmation(orderDetails);
    if (orderEmailSuccess) {
      console.log('✅ Order confirmation email test passed!\n');
    } else {
      console.log('❌ Order confirmation email test failed.\n');
    }
  } catch (error) {
    console.log('❌ Order confirmation email test error:', error);
  }

  // Test 4: Welcome Email
  console.log('4️⃣ Testing welcome email...');
  try {
    const welcomeData: WelcomeEmailData = {
      userName: 'Jane Smith',
      userEmail: 'newuser@example.com', // Replace with your test email
      verificationLink: 'https://yourapp.com/verify?token=abc123',
    };

    const welcomeEmailSuccess = await emailService.sendWelcomeEmail(welcomeData);
    if (welcomeEmailSuccess) {
      console.log('✅ Welcome email test passed!\n');
    } else {
      console.log('❌ Welcome email test failed.\n');
    }
  } catch (error) {
    console.log('❌ Welcome email test error:', error);
  }

  // Test 5: Password Reset Email
  console.log('5️⃣ Testing password reset email...');
  try {
    const resetData: PasswordResetData = {
      userName: 'Bob Johnson',
      resetLink: 'https://yourapp.com/reset-password?token=xyz789',
      expiryTime: new Date(Date.now() + 60 * 60 * 1000).toLocaleString(),
    };

    const resetEmailSuccess = await emailService.sendPasswordResetEmail(
      resetData,
      'user@example.com' // Replace with your test email
    );
    if (resetEmailSuccess) {
      console.log('✅ Password reset email test passed!\n');
    } else {
      console.log('❌ Password reset email test failed.\n');
    }
  } catch (error) {
    console.log('❌ Password reset email test error:', error);
  }

  // Test 6: Admin Order Notification
  console.log('6️⃣ Testing admin order notification...');
  try {
    const orderDetails: OrderDetails = {
      orderId: 'ORD-789012',
      customerName: 'Alice Cooper',
      customerEmail: 'alice@example.com',
      items: [
        {
          name: 'Laptop',
          quantity: 1,
          price: 75000,
        },
      ],
      totalAmount: 75000,
      shippingAddress: 'Alice Cooper\n456 Tech Street\nTech City, TC 67890',
      orderDate: new Date().toLocaleDateString(),
    };

    const adminEmailSuccess = await emailService.sendAdminOrderNotification(
      orderDetails,
      'admin@example.com' // Replace with your admin email
    );
    if (adminEmailSuccess) {
      console.log('✅ Admin order notification test passed!\n');
    } else {
      console.log('❌ Admin order notification test failed.\n');
    }
  } catch (error) {
    console.log('❌ Admin order notification test error:', error);
  }

  console.log('🎉 Email testing completed!');
  console.log('\n📝 Next Steps:');
  console.log('1. Replace test email addresses with real ones');
  console.log('2. Test the API endpoints using the provided routes');
  console.log('3. Integrate email sending into your application logic');
  console.log('4. Monitor email delivery and open rates');
}

// Run the test if this file is executed directly
if (require.main === module) {
  testEmailSetup().catch(console.error);
}

export { testEmailSetup };