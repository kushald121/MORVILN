const axios = require('axios');

async function testAddProduct() {
  try {
    const response = await axios.post('http://localhost:5000/api/admin/products', {
      "product": {
        "name": "Test Product",
        "slug": "test-product",
        "description": "A test product",
        "shortDescription": "Short description",
        "basePrice": 29.99,
        "categoryId": "fashion",
        "gender": "unisex",
        "tags": ["test", "product"],
        "isFeatured": false,
        "isActive": true
      },
      "variants": [
        {
          "size": "M",
          "color": "Red",
          "additionalPrice": 0,
          "stockQuantity": 100,
          "sku": "TEST-PRODUCT-M-RED",
          "isActive": true
        }
      ]
    }, {
      headers: {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyNzY1ODIxZS03NzlhLTQyYTAtODhjYi0xZjU2MzM0NmE3NDUiLCJlbWFpbCI6ImFuaWtldHNpbmdoczcxOEBnbWFpbC5jb20iLCJuYW1lIjoiQW5pa2V0IFNpbmdoIiwiaWF0IjoxNzYxMTA0MzU4LCJleHAiOjE3NjE3MDkxNTh9.myWlPt8dP1QX5FMeSbGJ108nTP5-8D_JbJDtcWuZJPI",
        "Content-Type": "application/json"
      }
    });

    console.log('Response:', response.data);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

testAddProduct();