# 📧 Gmail SMTP Setup Instructions

Follow these steps to configure Gmail SMTP for your application:

## 🚀 Step-by-Step Setup

### 1. Enable 2-Factor Authentication on Your Gmail Account

1. Go to your [Google Account settings](https://myaccount.google.com/)
2. Click on "Security" in the left sidebar
3. Under "Signing in to Google," make sure "2-Step Verification" is turned ON
4. If it's OFF, click on it and follow the steps to set it up

### 2. Generate an App Password

1. In your Google Account settings, click on "Security" 
2. Under "Signing in to Google," click on "App passwords"
3. If you don't see "App passwords," make sure:
   - 2-Step Verification is enabled
   - You're logged into your Google Account
4. At the bottom, choose "Select app" and select "Mail"
5. Choose "Select device" and select "Other (Custom name)"
6. Give it a name like "Node.js App" and click "Generate"
7. Copy the 16-character password that appears (this is your SMTP password)

### 3. Update Your Environment Variables

In your `.env` file, update the following values:

```env
# Gmail SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your-email@gmail.com           # Your full Gmail address
SMTP_PASSWORD=your-16-char-app-password   # The App Password you generated (not your regular Gmail password)
FROM_NAME=Your App Name                   # The name that will appear in the "From" field
```

### 4. Test Your Configuration

Run the following command to test your Gmail SMTP configuration:

```bash
npm run test-email
```

If everything is set up correctly, you should receive a test email at your Gmail address.

## 🔧 Troubleshooting

### Common Issues and Solutions

1. **Authentication Failed Error**
   - Make sure you're using an App Password, not your regular Gmail password
   - Ensure 2-Factor Authentication is enabled
   - Generate a new App Password if the current one isn't working

2. **Less Secure App Access Error**
   - Google no longer supports "Less secure app access"
   - You must use App Passwords with 2-Factor Authentication

3. **Connection Timeout Error**
   - Check your internet connection
   - Make sure Gmail SMTP settings are correct (smtp.gmail.com:587)

4. **Daily Sending Limits**
   - Gmail has sending limits (500 emails per day for free accounts)
   - For higher limits, consider upgrading to Google Workspace

## 📋 Important Notes

- Never commit your App Password to version control
- App Passwords are 16 characters long and contain no spaces
- App Passwords are specific to the app/device you create them for
- If you lose your App Password, you'll need to generate a new one

## 🛠 API Endpoints for Testing

Once your server is running, you can test email functionality using these endpoints:

1. Test SMTP connection:
   ```
   GET /api/email/test-connection
   ```

2. Send a test email:
   ```
   POST /api/email/test-send
   Content-Type: application/json
   
   {
     "to": "recipient@example.com",
     "subject": "Test Email"
   }
   ```

## 🎉 Success!

After completing these steps, your application will be able to send emails using Gmail SMTP. All existing email functionality (order confirmations, welcome emails, password resets, etc.) will work with your Gmail account.