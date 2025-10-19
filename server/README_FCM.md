# Firebase Cloud Messaging (FCM) Push Notifications

## 🎉 Complete Setup

Your FCM push notifications are ready to use with Supabase integration!

## Setup

### 1. Add FCM Server Key to `.env`

```env
FCM_SERVER_KEY=BEmmo3cBEdP8pctXxwLko4NDTejtZNuQIs92HoYdblTkbahgzM18wpmBy7vQStFb0zAgJRrFrW_EDT5MnMJjoKQ
FCM_PROJECT_ID=morviln-app
FCM_CLIENT_EMAIL=firebase-adminsdk@morviln-app.iam.gserviceaccount.com
```

### 2. Database Tables

Tables are automatically created on server start:
- `fcm_tokens` - Stores user FCM device tokens
- `notifications` - Stores notification history

## API Endpoints

### Register FCM Token

```bash
POST /api/push/register-token
Authorization: Cookie (auth_token)
Content-Type: application/json

{
  "token": "fcm-device-token-here",
  "deviceName": "iPhone 14 Pro",
  "deviceType": "ios"
}
```

**Response:**
```json
{
  "success": true,
  "message": "FCM token registered successfully",
  "tokenId": "uuid"
}
```

### Send Notification to User

```bash
POST /api/push/send
Authorization: Cookie (auth_token)
Content-Type: application/json

{
  "userId": "user-uuid",
  "title": "Order Confirmed! 🎉",
  "body": "Your order #12345 has been confirmed",
  "icon": "/icons/order.png",
  "image": "https://example.com/order-image.jpg",
  "url": "/orders/12345",
  "data": {
    "orderId": "12345",
    "type": "order"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Sent 2/2 notifications",
  "successCount": 2,
  "failureCount": 0
}
```

### Send to All Users (Broadcast)

```bash
POST /api/push/send-all
Authorization: Cookie (auth_token)
Content-Type: application/json

{
  "title": "Flash Sale! 🔥",
  "body": "Get 50% off on all items",
  "icon": "/icons/sale.png",
  "url": "/sales"
}
```

### Test Notification

```bash
POST /api/push/test
Authorization: Cookie (auth_token)
```

Sends a test notification to the authenticated user.

### Get User Notifications

```bash
GET /api/push/notifications?limit=50
Authorization: Cookie (auth_token)
```

**Response:**
```json
{
  "success": true,
  "notifications": [...],
  "unreadCount": 5
}
```

### Mark Notification as Read

```bash
PUT /api/push/notifications/:notificationId/read
Authorization: Cookie (auth_token)
```

### Mark All as Read

```bash
PUT /api/push/notifications/read-all
Authorization: Cookie (auth_token)
```

### Unregister Token

```bash
POST /api/push/unregister-token
Authorization: Cookie (auth_token)
Content-Type: application/json

{
  "token": "fcm-device-token"
}
```

## Supabase Webhook Integration

### Setup Webhook in Supabase

1. Go to **Database** → **Webhooks** in Supabase Dashboard
2. Click **Create Webhook**
3. Configure:
   - **Name**: `notifications_webhook`
   - **Table**: `notifications`
   - **Events**: `INSERT`
   - **HTTP Request**:
     - **URL**: `https://your-backend-url.com/api/push/webhook/supabase`
     - **Method**: `POST`
     - **Headers**:
       ```json
       {
         "Content-Type": "application/json"
       }
       ```

4. Click **Create webhook**

### How it Works

When you insert a notification into Supabase:

```sql
INSERT INTO public.notifications (user_id, body)
VALUES ('user-uuid', 'Your order has been shipped!');
```

The webhook automatically triggers and sends a push notification to that user's devices!

## Pre-built Notification Templates

### Order Confirmation

```typescript
import fcmService from './services/fcm.service';

await fcmService.sendOrderNotification(userId, {
  orderId: '12345',
});
```

### Shipping Update

```typescript
await fcmService.sendShippingNotification(userId, {
  orderId: '12345',
  trackingNumber: 'TRACK123',
});
```

### Delivery Confirmation

```typescript
await fcmService.sendDeliveryNotification(userId, {
  orderId: '12345',
});
```

## Frontend Integration (React/Next.js)

### 1. Install Firebase SDK

```bash
npm install firebase
```

### 2. Initialize Firebase

```typescript
// firebase.ts
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "morviln-app",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
```

### 3. Request Permission & Get Token

```typescript
import { getToken } from 'firebase/messaging';
import { messaging } from './firebase';

async function requestNotificationPermission() {
  try {
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: 'your-vapid-key'
      });
      
      // Register token with backend
      await fetch('http://localhost:5000/api/push/register-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          token,
          deviceName: navigator.userAgent,
          deviceType: 'web'
        })
      });
      
      console.log('FCM Token registered:', token);
    }
  } catch (error) {
    console.error('Error getting FCM token:', error);
  }
}
```

### 4. Listen for Messages (Service Worker)

Create `public/firebase-messaging-sw.js`:

```javascript
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "morviln-app",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon || '/icon-192x192.png',
    data: payload.data
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  );
});
```

## Testing with Postman

### Step 1: Login and Get Cookie

```bash
POST http://localhost:5000/api/auth/google
# Or use magic link
POST http://localhost:5000/api/magic-link/send
```

### Step 2: Register FCM Token

```bash
POST http://localhost:5000/api/push/register-token
Cookie: auth_token=YOUR_TOKEN

{
  "token": "test-fcm-token-123",
  "deviceName": "Test Device",
  "deviceType": "web"
}
```

### Step 3: Send Test Notification

```bash
POST http://localhost:5000/api/push/test
Cookie: auth_token=YOUR_TOKEN
```

### Step 4: Send Custom Notification

```bash
POST http://localhost:5000/api/push/send
Cookie: auth_token=YOUR_TOKEN

{
  "userId": "your-user-id",
  "title": "Test Notification",
  "body": "This is a test message",
  "url": "/"
}
```

## Testing via Supabase

### Option 1: SQL Editor

```sql
INSERT INTO public.notifications (user_id, body)
VALUES ('your-user-uuid', 'Test notification from Supabase!');
```

### Option 2: Supabase Dashboard

1. Go to **Table Editor** → `notifications`
2. Click **Insert** → **Insert row**
3. Fill in:
   - `user_id`: Your user UUID
   - `body`: "Your notification message"
4. Click **Save**

The webhook will automatically send a push notification! 🎉

## Features

✅ **Multi-device support** - Users can have tokens on multiple devices
✅ **Auto-cleanup** - Invalid tokens are automatically deactivated
✅ **Rich notifications** - Support for icons, images, action buttons
✅ **Notification history** - All notifications stored in database
✅ **Read tracking** - Track which notifications have been read
✅ **Supabase webhook** - Auto-send notifications from database inserts
✅ **Pre-built templates** - Order, shipping, delivery notifications
✅ **Broadcast** - Send to all users at once

## Security

- FCM server key kept secure in `.env`
- Authentication required for all endpoints (except webhook)
- Webhook endpoint can be secured with API key if needed
- httpOnly cookies prevent XSS attacks

## Troubleshooting

### Notifications not sending?

1. Check FCM_SERVER_KEY in `.env`
2. Verify user has registered FCM token
3. Check server logs for errors
4. Test with `/api/push/test` endpoint

### Webhook not triggering?

1. Verify webhook URL is correct
2. Check Supabase webhook logs
3. Ensure `user_id` and `body` are provided
4. Check server logs for webhook errors

### Database errors?

Restart server to recreate tables:
```bash
npm run dev
```

## Production Deployment

1. **Environment Variables**:
   ```env
   FCM_SERVER_KEY=your-production-key
   FCM_PROJECT_ID=your-project-id
   ```

2. **Webhook URL**: Update in Supabase to production URL

3. **HTTPS**: Ensure backend is served over HTTPS for webhooks

4. **Rate Limiting**: Consider adding rate limits to webhook endpoint

## Support

- FCM Documentation: https://firebase.google.com/docs/cloud-messaging
- Supabase Webhooks: https://supabase.com/docs/guides/database/webhooks
