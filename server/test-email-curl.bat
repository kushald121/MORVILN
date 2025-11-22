@echo off
title MORVILN Email API Testing

echo === MORVILN Email API Testing ===
echo Make sure the server is running on http://localhost:5000
echo.

echo 1. Testing Email Connection...
curl -X GET http://localhost:5000/api/email/test-connection
echo.

echo 2. Verifying Email Service...
curl -X GET http://localhost:5000/api/email/verify
echo.

echo 3. Sending Test Email...
curl -X POST http://localhost:5000/api/email/test-send ^
  -H "Content-Type: application/json" ^
  -d "{\"to\": \"recipient@example.com\", \"subject\": \"Test Email from MORVILN\", \"text\": \"This is a test email sent from the MORVILN application.\"}"
echo.

echo 4. Sending Order Confirmation...
curl -X POST http://localhost:5000/api/email/order-confirmation ^
  -H "Content-Type: application/json" ^
  -d "{\"email\": \"customer@example.com\", \"orderData\": {\"customerName\": \"John Doe\", \"orderId\": \"ORD-12345\", \"orderDate\": \"2025-11-22\", \"totalAmount\": 15000, \"shippingAddress\": \"123 Main St, City, State 12345\", \"items\": [{\"name\": \"Product 1\", \"quantity\": 2, \"price\": 5000}]}}"
echo.

echo === Testing Complete ===
echo Check your email inbox for the sent emails
pause