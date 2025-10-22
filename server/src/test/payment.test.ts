// Simple test file to verify Razorpay integration
// Run with: npm test (after setting up a test script)

import { PaymentService } from '../services/payment.service';
import { generateReceiptId, convertToPaise, validateSignature } from '../utils/payment.utils';

// Test utility functions
console.log('Testing utility functions...');

// Test receipt generation
const receipt = generateReceiptId('test');
console.log('Generated receipt:', receipt);

// Test amount conversion
const amountInPaise = convertToPaise(100);
console.log('100 rupees in paise:', amountInPaise);

// Test signature validation (with dummy data)
const isValidSignature = validateSignature(
    'order_test123',
    'pay_test123',
    'dummy_signature',
    'test_secret'
);
console.log('Signature validation test:', isValidSignature);

// Test order creation (commented out to avoid actual API calls)
/*
async function testOrderCreation() {
  try {
    const order = await PaymentService.createOrder({
      amount: 1, // 1 rupee for testing
      currency: 'INR',
      receipt: 'test_receipt_123',
      notes: {
        test: 'true',
        environment: 'development'
      }
    });
    
    console.log('Test order created:', order);
  } catch (error) {
    console.error('Order creation test failed:', error);
  }
}

// Uncomment to test actual order creation
// testOrderCreation();
*/

console.log('Payment integration tests completed!');

export { };