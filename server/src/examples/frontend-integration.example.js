// Frontend Integration Example for Razorpay
// This file shows how to integrate Razorpay on the client side

// 1. Include Razorpay script in your HTML
// <script src="https://checkout.razorpay.com/v1/checkout.js"></script>

// 2. Create order and initiate payment
async function initiatePayment(orderData) {
  try {
    // Step 1: Create order on your backend
    const orderResponse = await fetch('/api/payments/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: orderData.amount, // Amount in rupees
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
        notes: {
          user_id: orderData.userId,
          product: orderData.product
        }
      })
    });

    const orderResult = await orderResponse.json();
    
    if (!orderResult.success) {
      throw new Error(orderResult.message);
    }

    const order = orderResult.data;

    // Step 2: Configure Razorpay options
    const options = {
      key: 'rzp_test_RW3TYnZo9MLX0n', // Your Razorpay key ID
      amount: order.amount, // Amount in paise
      currency: order.currency,
      name: 'Your Company Name',
      description: 'Payment for your order',
      image: '/your-logo.png', // Your company logo
      order_id: order.id,
      
      // Customer details
      prefill: {
        name: orderData.customerName,
        email: orderData.customerEmail,
        contact: orderData.customerPhone
      },
      
      // Theme customization
      theme: {
        color: '#3399cc'
      },
      
      // Payment success handler
      handler: async function (response) {
        try {
          // Step 3: Verify payment on backend
          const verificationResponse = await fetch('/api/payments/verify-payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            })
          });

          const verificationResult = await verificationResponse.json();
          
          if (verificationResult.success) {
            // Payment successful
            showSuccessMessage('Payment successful!');
            redirectToSuccessPage(verificationResult.data);
          } else {
            // Payment verification failed
            showErrorMessage('Payment verification failed');
          }
        } catch (error) {
          console.error('Payment verification error:', error);
          showErrorMessage('Payment verification failed');
        }
      },
      
      // Payment modal closed handler
      modal: {
        ondismiss: function() {
          showErrorMessage('Payment cancelled by user');
        }
      }
    };

    // Step 4: Open Razorpay checkout
    const rzp = new Razorpay(options);
    rzp.open();

    // Handle payment failure
    rzp.on('payment.failed', function (response) {
      console.error('Payment failed:', response.error);
      showErrorMessage(`Payment failed: ${response.error.description}`);
    });

  } catch (error) {
    console.error('Payment initiation error:', error);
    showErrorMessage('Failed to initiate payment');
  }
}

// 3. Example usage
function handlePaymentButton() {
  const orderData = {
    amount: 100, // Amount in rupees
    userId: 'user_123',
    product: 'Premium Plan',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    customerPhone: '9999999999'
  };

  initiatePayment(orderData);
}

// 4. Utility functions
function showSuccessMessage(message) {
  // Show success notification
  alert(message); // Replace with your notification system
}

function showErrorMessage(message) {
  // Show error notification
  alert(message); // Replace with your notification system
}

function redirectToSuccessPage(paymentData) {
  // Redirect to success page with payment details
  window.location.href = `/payment-success?payment_id=${paymentData.payment_id}`;
}

// 5. React/Next.js Integration Example
/*
import { useState } from 'react';

const PaymentComponent = () => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    
    try {
      // Load Razorpay script dynamically
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        initiatePayment({
          amount: 100,
          userId: 'user_123',
          product: 'Premium Plan',
          customerName: 'John Doe',
          customerEmail: 'john@example.com',
          customerPhone: '9999999999'
        });
      };
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handlePayment} 
      disabled={loading}
      className="bg-blue-500 text-white px-4 py-2 rounded"
    >
      {loading ? 'Processing...' : 'Pay Now'}
    </button>
  );
};

export default PaymentComponent;
*/

// 6. Environment Configuration
const RAZORPAY_CONFIG = {
  development: {
    key_id: 'rzp_test_RW3TYnZo9MLX0n',
    api_url: 'http://localhost:5000/api/payments'
  },
  production: {
    key_id: 'rzp_live_xxxxxxxxxx', // Replace with live key
    api_url: 'https://yourapi.com/api/payments'
  }
};

// Get current environment config
const getCurrentConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  return RAZORPAY_CONFIG[env];
};