/**
 * Test script to check if the product service is working
 */

const { ProductService } = require('./dist/services/product.service');

async function testProductService() {
  console.log('🔍 Testing ProductService...\n');
  
  try {
    // Test 1: Fetch all products
    console.log('1️⃣  Fetching all products...');
    const result = await ProductService.getProducts({});
    console.log(`✅ Successfully fetched ${result.products.length} products`);
    console.log('Pagination:', result.pagination);
    
    if (result.products.length > 0) {
      console.log('Sample product:', {
        id: result.products[0].id,
        name: result.products[0].name,
        price: result.products[0].base_price
      });
    }
    
    // Test 2: Fetch categories
    console.log('\n2️⃣  Fetching categories...');
    const categories = await ProductService.getCategories();
    console.log(`✅ Successfully fetched ${categories.length} categories`);
    
    if (categories.length > 0) {
      console.log('Sample category:', {
        id: categories[0].id,
        name: categories[0].name
      });
    }
    
    // Test 3: Fetch featured products
    console.log('\n3️⃣  Fetching featured products...');
    const featured = await ProductService.getFeaturedProducts(5);
    console.log(`✅ Successfully fetched ${featured.length} featured products`);
    
    console.log('\n✅ All service tests completed successfully!');
    
  } catch (error) {
    console.log('❌ Error testing ProductService:', error.message);
    console.log('Error details:', error);
  }
}

testProductService();