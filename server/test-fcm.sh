#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:5000"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  FCM Push Notifications Test Suite${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Test 1: Health Check
echo -e "${YELLOW}Test 1: Health Check${NC}"
curl -s -X GET $BASE_URL/health | json_pp
echo -e "\n"

# Test 2: Send Magic Link
echo -e "${YELLOW}Test 2: Send Magic Link${NC}"
MAGIC_RESPONSE=$(curl -s -X POST $BASE_URL/api/magic-link/send \
  -H "Content-Type: application/json" \
  -d '{"email":"test@morviln.com"}')
echo $MAGIC_RESPONSE | json_pp

TOKEN=$(echo $MAGIC_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo -e "${GREEN}Token extracted: $TOKEN${NC}\n"

# Test 3: Verify Magic Link & Get Cookie
echo -e "${YELLOW}Test 3: Verify Magic Link${NC}"
curl -s -X POST $BASE_URL/api/magic-link/verify \
  -H "Content-Type: application/json" \
  -d "{\"token\":\"$TOKEN\",\"email\":\"test@morviln.com\"}" \
  -c cookies.txt | json_pp
echo -e "\n"

# Test 4: Register FCM Token
echo -e "${YELLOW}Test 4: Register FCM Token${NC}"
curl -s -X POST $BASE_URL/api/push/register-token \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"token":"test-fcm-token-12345","deviceName":"Test Device","deviceType":"web"}' | json_pp
echo -e "\n"

# Test 5: Send Test Notification
echo -e "${YELLOW}Test 5: Send Test Notification${NC}"
curl -s -X POST $BASE_URL/api/push/test \
  -H "Content-Type: application/json" \
  -b cookies.txt | json_pp
echo -e "\n"

# Test 6: Get User ID from Cookie
echo -e "${YELLOW}Test 6: Get Current User${NC}"
USER_RESPONSE=$(curl -s -X GET $BASE_URL/api/auth/me -b cookies.txt)
echo $USER_RESPONSE | json_pp
USER_ID=$(echo $USER_RESPONSE | grep -o '"id":"[^"]*' | cut -d'"' -f4)
echo -e "${GREEN}User ID: $USER_ID${NC}\n"

# Test 7: Send Custom Notification
echo -e "${YELLOW}Test 7: Send Custom Notification${NC}"
curl -s -X POST $BASE_URL/api/push/send \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d "{\"userId\":\"$USER_ID\",\"title\":\"Order Confirmed! 🎉\",\"body\":\"Your order #12345 has been confirmed\",\"icon\":\"/icons/order.png\",\"url\":\"/orders/12345\",\"data\":{\"orderId\":\"12345\",\"type\":\"order\"}}" | json_pp
echo -e "\n"

# Test 8: Get Notifications
echo -e "${YELLOW}Test 8: Get User Notifications${NC}"
curl -s -X GET "$BASE_URL/api/push/notifications?limit=10" \
  -b cookies.txt | json_pp
echo -e "\n"

# Test 9: Broadcast Notification
echo -e "${YELLOW}Test 9: Broadcast to All Users${NC}"
curl -s -X POST $BASE_URL/api/push/send-all \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"title":"Flash Sale! 🔥","body":"Get 50% off on all items","icon":"/icons/sale.png","url":"/sales"}' | json_pp
echo -e "\n"

# Test 10: Unregister Token
echo -e "${YELLOW}Test 10: Unregister FCM Token${NC}"
curl -s -X POST $BASE_URL/api/push/unregister-token \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"token":"test-fcm-token-12345"}' | json_pp
echo -e "\n"

# Test 11: Supabase Webhook (simulated)
echo -e "${YELLOW}Test 11: Supabase Webhook${NC}"
curl -s -X POST $BASE_URL/api/push/webhook/supabase \
  -H "Content-Type: application/json" \
  -d "{\"type\":\"INSERT\",\"record\":{\"user_id\":\"$USER_ID\",\"body\":\"Test notification from Supabase webhook!\"}}" | json_pp
echo -e "\n"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  All Tests Completed!${NC}"
echo -e "${GREEN}========================================${NC}"
