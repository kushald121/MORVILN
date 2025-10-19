@echo off
setlocal enabledelayedexpansion

set BASE_URL=http://localhost:5000

echo ========================================
echo   FCM Push Notifications Test Suite
echo ========================================
echo.

echo Test 1: Health Check
curl -s -X GET %BASE_URL%/health
echo.
echo.

echo Test 2: Send Magic Link
curl -s -X POST %BASE_URL%/api/magic-link/send -H "Content-Type: application/json" -d "{\"email\":\"test@morviln.com\"}" > temp_magic.json
type temp_magic.json
echo.

echo Test 3: Verify Magic Link
curl -s -X POST %BASE_URL%/api/magic-link/verify -H "Content-Type: application/json" -d "{\"token\":\"REPLACE_WITH_TOKEN\",\"email\":\"test@morviln.com\"}" -c cookies.txt
echo.

echo Test 4: Register FCM Token
curl -s -X POST %BASE_URL%/api/push/register-token -H "Content-Type: application/json" -b cookies.txt -d "{\"token\":\"test-fcm-token-12345\",\"deviceName\":\"Test Device\",\"deviceType\":\"web\"}"
echo.

echo Test 5: Send Test Notification
curl -s -X POST %BASE_URL%/api/push/test -H "Content-Type: application/json" -b cookies.txt
echo.

echo Test 6: Get Notifications
curl -s -X GET "%BASE_URL%/api/push/notifications?limit=10" -b cookies.txt
echo.

echo Test 7: Send Custom Notification to User
curl -s -X POST %BASE_URL%/api/push/send -H "Content-Type: application/json" -b cookies.txt -d "{\"userId\":\"YOUR_USER_ID\",\"title\":\"Order Confirmed!\",\"body\":\"Your order #12345 has been confirmed\",\"url\":\"/orders/12345\"}"
echo.

echo Test 8: Broadcast to All
curl -s -X POST %BASE_URL%/api/push/send-all -H "Content-Type: application/json" -b cookies.txt -d "{\"title\":\"Flash Sale!\",\"body\":\"Get 50%% off\",\"url\":\"/sales\"}"
echo.

echo ========================================
echo   Tests Completed!
echo ========================================

del temp_magic.json
pause
