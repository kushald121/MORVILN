export interface WelcomeEmailData {
  userName: string;
  userEmail: string;
  verificationLink?: string;
}

export const welcomeEmailTemplate = (data: WelcomeEmailData): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Our Platform</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 40px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 32px;">Welcome! 🎉</h1>
        <p style="color: white; margin: 15px 0 0 0; font-size: 18px;">We're excited to have you on board</p>
      </div>
      
      <div style="background: white; padding: 40px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 10px 10px;">
        <p style="font-size: 18px; margin-bottom: 25px;">Hi ${data.userName},</p>
        
        <p style="margin-bottom: 25px; font-size: 16px;">
          Welcome to our platform! We're thrilled to have you as part of our community. 
          Your account has been successfully created and you're ready to get started.
        </p>
        
        ${data.verificationLink ? `
          <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <h3 style="margin: 0 0 15px 0; color: #856404;">📧 Verify Your Email</h3>
            <p style="margin: 0 0 20px 0; color: #856404;">
              To complete your registration and secure your account, please verify your email address by clicking the button below:
            </p>
            <div style="text-align: center;">
              <a href="${data.verificationLink}" 
                 style="display: inline-block; background: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Verify Email Address
              </a>
            </div>
          </div>
        ` : ''}
        
        <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
          <h3 style="margin: 0 0 20px 0; color: #495057;">🚀 What's Next?</h3>
          <ul style="margin: 0; padding-left: 20px; color: #495057;">
            <li style="margin-bottom: 10px;">Complete your profile setup</li>
            <li style="margin-bottom: 10px;">Explore our features and services</li>
            <li style="margin-bottom: 10px;">Connect with our community</li>
            <li style="margin-bottom: 10px;">Start your journey with us!</li>
          </ul>
        </div>
        
        <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <h3 style="margin: 0 0 15px 0; color: #1976d2;">💡 Need Help?</h3>
          <p style="margin: 0; color: #1976d2;">
            If you have any questions or need assistance, our support team is here to help. 
            Don't hesitate to reach out to us anytime!
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <p style="margin-bottom: 20px; font-size: 16px;">
            Thank you for joining us. We can't wait to see what you'll accomplish!
          </p>
          <p style="color: #666; font-size: 14px;">
            Best regards,<br>
            The Team
          </p>
        </div>
        
        <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; text-align: center; color: #666; font-size: 12px;">
          <p>This email was sent to ${data.userEmail}</p>
          <p>This is an automated email, please do not reply to this message.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};