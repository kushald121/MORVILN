import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

const fcmServerKey = process.env.FCM_SERVER_KEY;
let firebaseInitialized = false;

if (!fcmServerKey) {
  console.warn('⚠️  WARNING: FCM_SERVER_KEY not configured in .env');
  console.warn('   Push notifications will not work without FCM configuration');
  console.warn('   For testing, notifications will be logged to console');
} else {
  try {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FCM_PROJECT_ID || 'morviln-app',
          privateKey: fcmServerKey.replace(/\\n/g, '\n'),
          clientEmail: process.env.FCM_CLIENT_EMAIL || `firebase-adminsdk@${process.env.FCM_PROJECT_ID}.iam.gserviceaccount.com`,
        }),
      });
      firebaseInitialized = true;
      console.log('✅ Firebase Admin initialized for FCM');
    }
  } catch (error: any) {
    console.error('❌ Failed to initialize Firebase Admin:', error.message);
    console.warn('⚠️  Running in mock mode - notifications will be logged to console');
  }
}

export const isFCMEnabled = firebaseInitialized;
export default admin;
