# Push Notifications Implementation

## Overview

Complete Web Push Notifications system with:
- ✅ **VAPID authentication** for secure push
- ✅ **PostgreSQL storage** for subscriptions & notifications
- ✅ **User-specific notifications** 
- ✅ **Broadcast notifications** (send to all)
- ✅ **Notification templates** (orders, shipping, promotions)
- ✅ **Read/unread tracking**
- ✅ **Supabase integration ready**

## Setup

### 1. Generate VAPID Keys

```bash
cd server
npx web-push generate-vapid-keys
```

### 2. Add to `.env`

```env
VAPID_PUBLIC_KEY=BIXc7eQz3PwlDlfEh3eY9KB0IKsyGrzWQtzmzW7Aglq6eskT4ZjQlcYQlaHs1mWGnYZQn4USroOxQtiUSyPGxDI
VAPID_PRIVATE_KEY=vOdzTrrE3C8oQn7VTUTnniP8hh3HGsmHnY_4J1X-Jfg
VAPID_SUBJECT=mailto:admin@morviln.com
```

### 3. Database Tables

Tables are automatically created on server start:
- `push_subscriptions` - Stores user push subscriptions
- `notifications` - Stores notification history

## API Endpoints

### Get VAPID Public Key

```bash
GET /api/push/vapid-public-key
```

Response:
```json
{
  "success": true,
  "publicKey": "BIXc7eQz3..."
}
```

### Subscribe to Push Notifications

```bash
POST /api/push/subscribe
Authorization: Cookie (auth_token)
Content-Type: application/json

{
  "endpoint": "https://fcm.googleapis.com/fcm/send/...",
  "keys": {
    "p256dh": "BG3N...",
    "auth": "sK7..."
  }
}
```

### Unsubscribe

```bash
POST /api/push/unsubscribe
Authorization: Cookie (auth_token)
Content-Type: application/json

{
  "endpoint": "https://fcm.googleapis.com/fcm/send/..."
}
```

### Send Notification to User

```bash
POST /api/push/send
Authorization: Cookie (auth_token)
Content-Type: application/json

{
  "userId": "user-uuid",
  "title": "Order Confirmed",
  "body": "Your order #12345 has been confirmed",
  "icon": "/icons/order.png",
  "url": "/orders/12345",
  "data": {
    "orderId": "12345",
    "type": "order"
  }
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
  "url": "/sales/flash-sale"
}
```

### Get User Notifications

```bash
GET /api/push/notifications?limit=50
Authorization: Cookie (auth_token)
```

Response:
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

## Frontend Integration

### 1. Service Worker (`public/sw.js`)

```javascript
self.addEventListener('push', (event) => {
  const data = event.data.json();
  
  const options = {
    body: data.body,
    icon: data.icon || '/icon-192x192.png',
    badge: data.badge || '/badge-72x72.png',
    data: data.data,
    actions: data.actions || []
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  );
});
```

### 2. Subscribe User (React/Next.js)

```typescript
async function subscribeToPush() {
  // Get VAPID public key
  const { publicKey } = await fetch('http://localhost:5000/api/push/vapid-public-key')
    .then(r => r.json());
  
  // Register service worker
  const registration = await navigator.serviceWorker.register('/sw.js');
  
  // Subscribe to push
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicKey)
  });
  
  // Send subscription to backend
  await fetch('http://localhost:5000/api/push/subscribe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(subscription)
  });
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
  
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
```

### 3. Request Permission

```typescript
async function requestNotificationPermission() {
  const permission = await Notification.requestPermission();
  
  if (permission === 'granted') {
    await subscribeToPush();
  }
}
```

## Pre-built Notification Templates

### Order Confirmation

```typescript
import pushNotificationService from './services/pushNotification.service';

await pushNotificationService.sendOrderNotification(userId, {
  orderId: '12345',
});
```

### Shipping Update

```typescript
await pushNotificationService.sendShippingNotification(userId, {
  orderId: '12345',
  trackingNumber: 'TRACK123',
});
```

### Delivery Confirmation

```typescript
await pushNotificationService.sendDeliveryNotification(userId, {
  orderId: '12345',
});
```

### Promotion Broadcast

```typescript
await pushNotificationService.sendPromotionNotification({
  title: 'Flash Sale! 🔥',
  body: 'Get 50% off on all items',
  url: '/sales/flash-sale',
});
```

## Testing with Postman

### 1. Subscribe (after login)

```bash
POST http://localhost:5000/api/push/subscribe
Cookie: auth_token=YOUR_JWT_TOKEN

{
  "endpoint": "https://fcm.googleapis.com/fcm/send/test",
  "keys": {
    "p256dh": "test-key",
    "auth": "test-auth"
  }
}
```

### 2. Send Test Notification

```bash
POST http://localhost:5000/api/push/send
Cookie: auth_token=YOUR_JWT_TOKEN

{
  "userId": "user-uuid-from-login",
  "title": "Test Notification",
  "body": "This is a test push notification"
}
```

## Features

✅ **Auto-cleanup** - Expired subscriptions are automatically deactivated
✅ **Multi-device** - Users can have multiple subscriptions (phone, desktop)
✅ **Notification history** - All notifications stored in database
✅ **Read tracking** - Track which notifications have been read
✅ **Custom actions** - Add action buttons to notifications
✅ **Rich notifications** - Support for icons, badges, images
✅ **URL redirects** - Clicking notification opens specific URL

## Security

- VAPID keys ensure notifications come from your server
- httpOnly cookies prevent XSS attacks
- User authentication required for subscription
- Endpoint validation prevents spam

## Browser Support

- ✅ Chrome/Edge (Desktop & Mobile)
- ✅ Firefox (Desktop & Mobile)
- ✅ Safari (macOS 16.4+, iOS 16.4+)
- ❌ IE (not supported)

## Troubleshooting

### Notifications not appearing?

1. Check browser permissions
2. Verify service worker is registered
3. Ensure VAPID keys are correct
4. Check server logs for errors

### VAPID key errors?

```bash
# Generate new keys
npx web-push generate-vapid-keys

# Update .env with new keys
```

### Database errors?

```bash
# Restart server to recreate tables
npm run dev
```
