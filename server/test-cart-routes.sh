#!/bin/bash

# Cart API Testing Script
# Make sure to replace the placeholders with actual values

BASE_URL="http://localhost:3000/api"
JWT_TOKEN="YOUR_JWT_TOKEN_HERE"  # Replace with actual JWT token
VARIANT_ID="TEST_VARIANT_ID"     # Replace with actual variant ID

echo "🧪 Starting Cart API Tests..."

# Test 1: Add item to cart
echo -e "\n1️⃣  Adding item to cart..."
curl -X POST "$BASE_URL/cart" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"variant_id\": \"$VARIANT_ID\", \"quantity\": 1}"

# Test 2: Get cart
echo -e "\n\n2️⃣  Getting cart..."
curl -X GET "$BASE_URL/cart" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json"

# Test 3: Get cart count
echo -e "\n\n3️⃣  Getting cart count..."
curl -X GET "$BASE_URL/cart/count" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json"

# Test 4: Validate cart
echo -e "\n\n4️⃣  Validating cart..."
curl -X GET "$BASE_URL/cart/validate" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json"

echo -e "\n\n🎯 Cart API tests completed!"
echo "📝 Note: Update the script with actual JWT token and variant ID before running."