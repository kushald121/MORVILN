import webPush from 'web-push';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
  console.warn('⚠️  WARNING: VAPID keys not configured in .env');
  console.warn('   Generate keys with: npx web-push generate-vapid-keys');
  console.warn('   Push notifications will not work without VAPID keys');
}

if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webPush.setVapidDetails(
    process.env.VAPID_SUBJECT || 'mailto:admin@morviln.com',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
  console.log('✅ Web Push configured with VAPID keys');
}

export default webPush;
