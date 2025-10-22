"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFCMEnabled = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const fcmPrivateKey = process.env.FCM_PRIVATE_KEY;
let firebaseInitialized = false;
if (!fcmPrivateKey) {
    console.warn('⚠️  WARNING: FCM_PRIVATE_KEY not configured in .env');
    console.warn('   Push notifications will not work without Firebase configuration');
    console.warn('   For testing, notifications will be logged to console');
}
else {
    try {
        if (!firebase_admin_1.default.apps.length) {
            firebase_admin_1.default.initializeApp({
                credential: firebase_admin_1.default.credential.cert({
                    projectId: process.env.FCM_PROJECT_ID || 'morviln-app',
                    privateKey: fcmPrivateKey.replace(/\\n/g, '\n'),
                    clientEmail: process.env.FCM_CLIENT_EMAIL || `firebase-adminsdk@${process.env.FCM_PROJECT_ID}.iam.gserviceaccount.com`,
                }),
            });
            firebaseInitialized = true;
            console.log('✅ Firebase Admin initialized for FCM');
        }
    }
    catch (error) {
        console.error('❌ Failed to initialize Firebase Admin:', error.message);
        console.warn('⚠️  Running in mock mode - notifications will be logged to console');
    }
}
exports.isFCMEnabled = firebaseInitialized;
exports.default = firebase_admin_1.default;
