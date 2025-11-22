@echo off
REM Cart API Testing Script for Windows
REM Make sure to replace the placeholders with actual values

set BASE_URL=http://localhost:3000/api
set JWT_TOKEN=YOUR_JWT_TOKEN_HERE
set VARIANT_ID=TEST_VARIANT_ID

echo 🧪 Starting Cart API Tests...

REM Test 1: Add item to cart
echo.
echo 1️⃣  Adding item to cart...
curl -X POST "%BASE_URL%/cart" ^
  -H "Authorization: Bearer %JWT_TOKEN%" ^
  -H "Content-Type: application/json" ^
  -d "{\"variant_id\": \"%VARIANT_ID%\", \"quantity\": 1}"

REM Test 2: Get cart
echo.
echo 2️⃣  Getting cart...
curl -X GET "%BASE_URL%/cart" ^
  -H "Authorization: Bearer %JWT_TOKEN%" ^
  -H "Content-Type: application/json"

REM Test 3: Get cart count
echo.
echo 3️⃣  Getting cart count...
curl -X GET "%BASE_URL%/cart/count" ^
  -H "Authorization: Bearer %JWT_TOKEN%" ^
  -H "Content-Type: application/json"

REM Test 4: Validate cart
echo.
echo 4️⃣  Validating cart...
curl -X GET "%BASE_URL%/cart/validate" ^
  -H "Authorization: Bearer %JWT_TOKEN%" ^
  -H "Content-Type: application/json"

echo.
echo 🎯 Cart API tests completed!
echo 📝 Note: Update the script with actual JWT token and variant ID before running.
pause