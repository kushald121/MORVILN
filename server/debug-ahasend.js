const nodemailer = require('nodemailer');
require('dotenv').config();

async function debugAhasend() {
    console.log('🔍 Debugging Ahasend Configuration...\n');

    // Display current configuration
    console.log('📋 Current Configuration:');
    console.log('SMTP_HOST:', process.env.SMTP_HOST);
    console.log('SMTP_PORT:', process.env.SMTP_PORT);
    console.log('SMTP_USERNAME:', process.env.SMTP_USERNAME);
    console.log('SMTP_PASSWORD:', process.env.SMTP_PASSWORD ? '***hidden***' : 'NOT SET');
    console.log('FROM_NAME:', process.env.FROM_NAME);
    console.log('');

    // Create transporter with debug enabled
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'send.ahasend.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false,
        requireTLS: true,
        debug: true, // Enable debug mode
        logger: true, // Enable logging
        auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    try {
        // Test connection
        console.log('1️⃣ Testing SMTP connection...');
        await transporter.verify();
        console.log('✅ SMTP connection successful!\n');

        // Try different sender configurations
        const senderConfigs = [
            `noreply@ahasend.com`,
            `${process.env.SMTP_USERNAME}@ahasend.com`,
            `test@ahasend.com`,
            process.env.SMTP_USERNAME,
        ];

        for (let i = 0; i < senderConfigs.length; i++) {
            const sender = senderConfigs[i];
            console.log(`${i + 2}️⃣ Testing sender: ${sender}`);

            try {
                const info = await transporter.sendMail({
                    from: `"${process.env.FROM_NAME || 'Test App'}" <${sender}>`,
                    to: 'kushaldubey121@gmail.com',
                    subject: `🧪 Ahasend Test ${i + 1} - ${sender}`,
                    html: `
            <h2>🎉 Test Email ${i + 1}</h2>
            <p>This test email was sent using sender: <strong>${sender}</strong></p>
            <p>Sent at: ${new Date().toLocaleString()}</p>
            <p>If you received this, the configuration is working!</p>
          `,
                });

                console.log(`✅ Success with sender: ${sender}`);
                console.log('📧 Message ID:', info.messageId);
                console.log('📬 Response:', info.response);
                console.log('');
                break; // Stop testing if one works

            } catch (error) {
                console.log(`❌ Failed with sender: ${sender}`);
                console.log('Error:', error.message);
                console.log('');
            }
        }

    } catch (error) {
        console.error('❌ Connection test failed:', error.message);
        console.log('\n🔧 Troubleshooting steps:');
        console.log('1. Verify your Ahasend account is active and verified');
        console.log('2. Check if you have any sending limits or restrictions');
        console.log('3. Ensure your domain is properly configured in Ahasend');
        console.log('4. Contact Ahasend support if the issue persists');
    }
}

debugAhasend();