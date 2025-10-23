import crypto from 'crypto';

/**
 * Generate a secure verification token
 */
export const generateVerificationToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Generate a password reset token with expiry
 */
export const generatePasswordResetToken = (): { token: string; expires: Date } => {
  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date();
  expires.setHours(expires.getHours() + 1); // Token expires in 1 hour
  
  return { token, expires };
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Sanitize email content to prevent XSS
 */
export const sanitizeEmailContent = (content: string): string => {
  return content
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Format currency for email display
 */
export const formatCurrency = (amount: number, currency: string = 'INR'): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

/**
 * Format date for email display
 */
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Generate order ID
 */
export const generateOrderId = (): string => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD-${timestamp.slice(-6)}${random}`;
};

/**
 * Create verification link
 */
export const createVerificationLink = (baseUrl: string, token: string): string => {
  return `${baseUrl}/verify-email?token=${token}`;
};

/**
 * Create password reset link
 */
export const createPasswordResetLink = (baseUrl: string, token: string): string => {
  return `${baseUrl}/reset-password?token=${token}`;
};

/**
 * Extract domain from email
 */
export const extractDomain = (email: string): string => {
  return email.split('@')[1] || '';
};

/**
 * Check if email is from a disposable email provider
 */
export const isDisposableEmail = (email: string): boolean => {
  const disposableDomains = [
    '10minutemail.com',
    'tempmail.org',
    'guerrillamail.com',
    'mailinator.com',
    'yopmail.com',
    // Add more disposable email domains as needed
  ];
  
  const domain = extractDomain(email).toLowerCase();
  return disposableDomains.includes(domain);
};

/**
 * Generate email tracking pixel (for email open tracking)
 */
export const generateTrackingPixel = (emailId: string, baseUrl: string): string => {
  return `<img src="${baseUrl}/api/email/track/${emailId}" width="1" height="1" style="display:none;" alt="" />`;
};

/**
 * Create unsubscribe link
 */
export const createUnsubscribeLink = (baseUrl: string, email: string, token: string): string => {
  return `${baseUrl}/unsubscribe?email=${encodeURIComponent(email)}&token=${token}`;
};

/**
 * Validate bulk email recipients
 */
export const validateBulkRecipients = (recipients: string[]): { valid: string[]; invalid: string[] } => {
  const valid: string[] = [];
  const invalid: string[] = [];
  
  recipients.forEach(email => {
    if (isValidEmail(email) && !isDisposableEmail(email)) {
      valid.push(email);
    } else {
      invalid.push(email);
    }
  });
  
  return { valid, invalid };
};

/**
 * Calculate email sending rate limit
 */
export const calculateSendingDelay = (totalEmails: number, maxPerHour: number = 100): number => {
  if (totalEmails <= maxPerHour) return 0;
  return Math.ceil((60 * 60 * 1000) / maxPerHour); // Delay in milliseconds
};

/**
 * Generate email preview text
 */
export const generatePreviewText = (content: string, maxLength: number = 150): string => {
  // Remove HTML tags and get plain text
  const plainText = content.replace(/<[^>]*>/g, '').trim();
  
  if (plainText.length <= maxLength) {
    return plainText;
  }
  
  return plainText.substring(0, maxLength).trim() + '...';
};