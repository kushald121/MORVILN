"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testEmailSetup = testEmailSetup;
const email_service_1 = __importDefault(require("../services/email.service"));
/**
 * Test email functionality
 * Run this file to test your Gmail email setup
 */
async function testEmailSetup() {
    console.log('🧪 Testing Gmail Email Setup...\n');
    // Test 1: Connection Test
    console.log('1️⃣ Testing SMTP connection...');
    try {
        const isConnected = await email_service_1.default.verifyConnection();
        if (!isConnected) {
            console.log('❌ Connection test failed. Please check your Gmail credentials.');
            return;
        }
        console.log('✅ SMTP connection successful!\n');
    }
    catch (error) {
        console.log('❌ Connection test error:', error);
        return;
    }
    // Test 2: Simple Email Test
    console.log('2️⃣ Testing simple email...');
    try {
        await email_service_1.default.sendEmail({
            to: 'test@example.com', // Replace with your test email
            subject: '🧪 Gmail Test Email',
            html: `
        <h2>🎉 Gmail Integration Test</h2>
        <p>This is a test email to verify your Gmail setup is working correctly.</p>
        <p><strong>Sent at:</strong> ${new Date().toLocaleString()}</p>
        <p>If you received this email, your configuration is perfect! ✨</p>
      `,
        });
        console.log('✅ Simple email test passed!\n');
    }
    catch (error) {
        console.log('❌ Simple email test error:', error);
    }
    // Test 3: Order Confirmation Email
    console.log('3️⃣ Testing order confirmation email...');
    try {
        await email_service_1.default.sendOrderConfirmation('customer@example.com', // Replace with your test email
        {
            customerName: 'John Doe',
            orderId: 'ORD-123456',
            orderDate: new Date().toLocaleDateString(),
            items: [
                {
                    name: 'Premium T-Shirt',
                    quantity: 2,
                    price: 999,
                },
                {
                    name: 'Jeans',
                    quantity: 1,
                    price: 1999,
                },
            ],
            totalAmount: 3997,
            shippingAddress: 'John Doe\n123 Main Street\nCity, State 12345\nCountry',
        });
        console.log('✅ Order confirmation email test passed!\n');
    }
    catch (error) {
        console.log('❌ Order confirmation email test error:', error);
    }
    // Test 4: Product Launch Email
    console.log('4️⃣ Testing product launch email...');
    try {
        await email_service_1.default.sendProductLaunch(['subscriber1@example.com', 'subscriber2@example.com'], // Replace with your test emails
        {
            productName: 'New Smart Watch',
            productDescription: 'The latest smartwatch with health monitoring features',
            productImage: 'https://example.com/smartwatch.jpg',
            productUrl: 'https://yourstore.com/products/smartwatch',
            launchDate: new Date().toLocaleDateString(),
        });
        console.log('✅ Product launch email test passed!\n');
    }
    catch (error) {
        console.log('❌ Product launch email test error:', error);
    }
    // Test 5: Custom Offer Email
    console.log('5️⃣ Testing custom offer email...');
    try {
        await email_service_1.default.sendCustomOffer(['customer1@example.com', 'customer2@example.com'], // Replace with your test emails
        {
            customerName: 'Valued Customer',
            offerTitle: 'Special Holiday Discount',
            offerDescription: 'Get 20% off on all products this holiday season',
            discountCode: 'HOLIDAY20',
            validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            termsAndConditions: 'Offer valid for a limited time. Cannot be combined with other offers.',
        });
        console.log('✅ Custom offer email test passed!\n');
    }
    catch (error) {
        console.log('❌ Custom offer email test error:', error);
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
