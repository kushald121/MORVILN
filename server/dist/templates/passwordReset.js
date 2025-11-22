"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordResetTemplate = void 0;
const passwordResetTemplate = (data) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset Request</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">🔐 Password Reset</h1>
        <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Reset your account password</p>
      </div>
      
      <div style="background: white; padding: 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 10px 10px;">
        <p style="font-size: 18px; margin-bottom: 20px;">Hi ${data.userName},</p>
        
        <p style="margin-bottom: 25px;">
          We received a request to reset the password for your account. If you made this request, 
          click the button below to reset your password.
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.resetLink}" 
             style="display: inline-block; background: #dc3545; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
            Reset Password
          </a>
        </div>
        
        <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <h3 style="margin: 0 0 15px 0; color: #856404;">⏰ Important Information</h3>
          <ul style="margin: 0; padding-left: 20px; color: #856404;">
            <li style="margin-bottom: 8px;">This link will expire on <strong>${data.expiryTime}</strong></li>
            <li style="margin-bottom: 8px;">You can only use this link once</li>
            <li style="margin-bottom: 8px;">If you didn't request this, you can safely ignore this email</li>
          </ul>
        </div>
        
        <div style="background: #f8d7da; border: 1px solid #f5c6cb; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <h3 style="margin: 0 0 15px 0; color: #721c24;">🛡️ Security Notice</h3>
          <p style="margin: 0; color: #721c24; font-size: 14px;">
            If you didn't request a password reset, please ignore this email or contact our support team 
            if you have concerns about your account security. Your password will remain unchanged.
          </p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <h3 style="margin: 0 0 15px 0; color: #495057;">Can't click the button?</h3>
          <p style="margin: 0 0 10px 0; color: #495057; font-size: 14px;">
            Copy and paste this link into your browser:
          </p>
          <p style="margin: 0; word-break: break-all; color: #007bff; font-size: 12px;">
            ${data.resetLink}
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <p style="color: #666; font-size: 14px;">
            If you have any questions, please contact our support team.
          </p>
        </div>
        
        <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; text-align: center; color: #666; font-size: 12px;">
          <p>This is an automated security email, please do not reply to this message.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
exports.passwordResetTemplate = passwordResetTemplate;
