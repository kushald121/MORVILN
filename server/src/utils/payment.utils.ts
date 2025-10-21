import crypto from 'crypto';

/**
 * Convert amount from rupees to paise
 */
export const convertToPaise = (amount: number): number => {
  return Math.round(amount * 100);
};

/**
 * Convert amount from paise to rupees
 */
export const convertToRupees = (amount: number): number => {
  return amount / 100;
};

/**
 * Generate a unique receipt ID
 */
export const generateReceiptId = (prefix: string = 'rcpt'): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${timestamp}_${random}`;
};

/**
 * Validate Razorpay payment signature
 */
export const validateSignature = (
  orderId: string,
  paymentId: string,
  signature: string,
  secret: string
): boolean => {
  try {
    const body = orderId + '|' + paymentId;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body.toString())
      .digest('hex');
    
    return expectedSignature === signature;
  } catch (error) {
    console.error('Error validating signature:', error);
    return false;
  }
};

/**
 * Generate webhook signature for verification
 */
export const generateWebhookSignature = (body: string, secret: string): string => {
  return crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');
};

/**
 * Format payment status for display
 */
export const formatPaymentStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    'created': 'Created',
    'authorized': 'Authorized',
    'captured': 'Captured',
    'refunded': 'Refunded',
    'failed': 'Failed'
  };
  
  return statusMap[status] || status.charAt(0).toUpperCase() + status.slice(1);
};

/**
 * Calculate refund amount with validation
 */
export const calculateRefundAmount = (
  originalAmount: number,
  refundAmount?: number
): number => {
  if (!refundAmount) {
    return originalAmount; // Full refund
  }
  
  if (refundAmount > originalAmount) {
    throw new Error('Refund amount cannot be greater than original amount');
  }
  
  if (refundAmount <= 0) {
    throw new Error('Refund amount must be greater than 0');
  }
  
  return refundAmount;
};

/**
 * Validate currency code
 */
export const validateCurrency = (currency: string): boolean => {
  const supportedCurrencies = ['INR', 'USD', 'EUR', 'GBP', 'AUD', 'CAD', 'SGD'];
  return supportedCurrencies.includes(currency.toUpperCase());
};

/**
 * Format amount for display with currency
 */
export const formatAmount = (amount: number, currency: string = 'INR'): string => {
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2
  });
  
  return formatter.format(convertToRupees(amount));
};

/**
 * Generate payment description
 */
export const generatePaymentDescription = (
  orderId: string,
  items?: string[]
): string => {
  let description = `Payment for order ${orderId}`;
  
  if (items && items.length > 0) {
    description += ` - ${items.join(', ')}`;
  }
  
  return description.substring(0, 255); // Razorpay description limit
};

/**
 * Validate webhook timestamp to prevent replay attacks
 */
export const validateWebhookTimestamp = (
  timestamp: number,
  toleranceInSeconds: number = 300
): boolean => {
  const currentTime = Math.floor(Date.now() / 1000);
  const timeDifference = Math.abs(currentTime - timestamp);
  
  return timeDifference <= toleranceInSeconds;
};

/**
 * Extract error message from Razorpay error
 */
export const extractRazorpayError = (error: any): string => {
  if (error.error && error.error.description) {
    return error.error.description;
  }
  
  if (error.message) {
    return error.message;
  }
  
  return 'An unknown payment error occurred';
};

/**
 * Generate payment metadata
 */
export const generatePaymentMetadata = (
  userId?: string,
  orderId?: string,
  additionalData?: Record<string, any>
): Record<string, string> => {
  const metadata: Record<string, string> = {};
  
  if (userId) metadata.user_id = userId;
  if (orderId) metadata.order_id = orderId;
  
  if (additionalData) {
    Object.keys(additionalData).forEach(key => {
      metadata[key] = String(additionalData[key]);
    });
  }
  
  return metadata;
};