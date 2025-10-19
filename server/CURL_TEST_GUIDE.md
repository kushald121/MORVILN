# FCM Push Notifications - cURL Test Guide

## ✅ All Tests Completed Successfully!

### Quick Test Results:
- ✅ Health Check: Working
- ✅ Magic Link: Generated
- ✅ Authentication: Cookie set
- ✅ FCM Token Registration: Success
- ✅ Mock notifications: Working (FCM server key needed for real push)

## Complete Test Commands

### 1. Health Check
```bash
curl -X GET http://localhost:5000/health
```
**Expected:** `{"status":"OK","timestamp":"..."}`

---

### 2. Send Magic Link
```bash
curl -X POST http://localhost:5000/api/magic-link/send \
  -H "Content-Type: application/json" \
  -d '{"email":"test@morviln.com"}'
```
**Expected:** 
```json
{
  "success": true,
  "message": "Magic link generated...",
  "token": "126081d38367b65d..."
}
```

---

### 3. Verify Magic Link & Get Cookie
```bash
curl -X POST http://localhost:5000/api/magic-link/verify \
  -H "Content-Type: application/json" \
  -d '{"token":"YOUR_TOKEN_HERE","email":"test@morviln.com"}' \
  -c cookies.txt -v
```
**Expected:** Cookie `auth_token` saved to cookies.txt

---

### 4. Register FCM Token
```bash
curl -X POST http://localhost:5000/api/push/register-token \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"token":"test-fcm-token-12345","deviceName":"Test Device","deviceType":"web"}'
```
**Expected:**
```json
{
  "success": true,
  "message": "FCM token registered successfully",
  "tokenId": "uuid"
}
```

---

### 5. Send Test Notification
```bash
curl -X POST http://localhost:5000/api/push/test \
  -H "Content-Type: application/json" \
  -b cookies.txt
```
**Expected:**
```json
{
  "success": true,
  "message": "Mock: Sent to 1 device(s) (FCM not configured)",
  "successCount": 1,
  "failureCount": 0
}
```

---

### 6. Get Current User
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -b cookies.txt
```
**Expected:**
```json
{
  "success": true,
  "user": {
    "id": "89cd1ae3-269c-4b48-a885-618889129639",
    "email": "test@morviln.com",
    "name": "test"
  }
}
```

---

### 7. Send Custom Notification
```bash
curl -X POST http://localhost:5000/api/push/send \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "userId":"89cd1ae3-269c-4b48-a885-618889129639",
    "title":"Order Confirmed! 🎉",
    "body":"Your order #12345 has been confirmed",
    "icon":"/icons/order.png",
    "url":"/orders/12345",
    "data":{"orderId":"12345","type":"order"}
  }'
```

---

### 8. Get User Notifications
```bash
curl -X GET "http://localhost:5000/api/push/notifications?limit=10" \
  -b cookies.txt
```
**Expected:**
```json
{
  "success": true,
  "notifications": [...],
  "unreadCount": 2
}
```

---

### 9. Mark Notification as Read
```bash
curl -X PUT http://localhost:5000/api/push/notifications/NOTIFICATION_ID/read \
  -b cookies.txt
```

---

### 10. Mark All as Read
```bash
curl -X PUT http://localhost:5000/api/push/notifications/read-all \
  -b cookies.txt
```

---

### 11. Broadcast to All Users
```bash
curl -X POST http://localhost:5000/api/push/send-all \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "title":"Flash Sale! 🔥",
    "body":"Get 50% off on all items",
    "icon":"/icons/sale.png",
    "url":"/sales"
  }'
```

---

### 12. Unregister FCM Token
```bash
curl -X POST http://localhost:5000/api/push/unregister-token \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"token":"test-fcm-token-12345"}'
```

---

### 13. Supabase Webhook (No Auth Required)
```bash
curl -X POST http://localhost:5000/api/push/webhook/supabase \
  -H "Content-Type: application/json" \
  -d '{
    "type":"INSERT",
    "record":{
      "user_id":"89cd1ae3-269c-4b48-a885-618889129639",
      "body":"Test notification from Supabase webhook!"
    }
  }'
```

---

## Test Results Summary

### ✅ Working Features:
1. Health check endpoint
2. Magic link generation
3. Magic link verification
4. Cookie-based authentication
5. FCM token registration
6. Notification history storage
7. Get user notifications
8. Mark notifications as read
9. Webhook endpoint

### ⚠️ Mock Mode (No FCM Server Key):
- Test notifications are logged to console
- All endpoints work but don't send actual push notifications
- Database storage still works
- Webhook processing works

### 🔧 To Enable Real Push Notifications:

Add to `.env`:
```env
FCM_SERVER_KEY=BEmmo3cBEdP8pctXxwLko4NDTejtZNuQIs92HoYdblTkbahgzM18wpmBy7vQStFb0zAgJRrFrW_EDT5MnMJjoKQ
FCM_PROJECT_ID=morviln-app
FCM_CLIENT_EMAIL=firebase-adminsdk@morviln-app.iam.gserviceaccount.com
```

Then restart server:
```bash
npm run dev
```

---

## Quick Test Script

### Windows (test-fcm.bat)
```bash
cd server
test-fcm.bat
```

### Linux/Mac (test-fcm.sh)
```bash
cd server
chmod +x test-fcm.sh
./test-fcm.sh
```

---

## Test Database Tables

### Check fcm_tokens:
```sql
SELECT * FROM fcm_tokens;
```

### Check notifications:
```sql
SELECT * FROM notifications ORDER BY sent_at DESC;
```

### Insert notification via SQL (triggers webhook):
```sql
INSERT INTO public.notifications (user_id, body)
VALUES ('89cd1ae3-269c-4b48-a885-618889129639', 'Test from SQL!');
```

---

## API Response Codes

- `200` - Success
- `201` - Created (token registered)
- `400` - Bad request (missing parameters)
- `401` - Unauthorized (no auth cookie)
- `404` - Not found
- `500` - Server error

---

## Notes

- All endpoints except `/webhook/supabase` require authentication
- Cookies are automatically sent with `-b cookies.txt`
- Use `-v` flag for verbose output including headers
- Use `-c cookies.txt` to save cookies
- FCM tokens can be reused across devices
- Notifications are stored in database even in mock mode
- Invalid FCM tokens are automatically deactivated
