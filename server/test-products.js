/**
 * Test script to check if products can be fetched from the database
 */

const supabase = require('./dist/config/supabaseclient').default;

async function testProductFetch() {
  console.log('🔍 Testing product fetch from database...\n');
  
  try {
    // Test 1: Check if products table exists and has data
    console.log('1️⃣  Checking products table...');
    const { count, error: countError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.log('❌ Error checking products table:', countError.message);
      if (countError.code === '42P01') {
        console.log('   💡 The products table does not exist. You may need to run the SQL schema.');
      }
      return;
    }
    
    console.log(`✅ Products table exists. Total products: ${count || 0}`);
    
    // Test 2: Fetch some products
    console.log('\n2️⃣  Fetching sample products...');
    const { data: products, error: productError } = await supabase
      .from('products')
      .select(`
        id, name, slug, base_price, is_active,
        categories(name, slug),
        product_variants(id, size, color, stock_quantity),
        product_media(media_url, is_primary)
      `)
      .eq('is_active', true)
      .limit(5);
    
    if (productError) {
      console.log('❌ Error fetching products:', productError.message);
      return;
    }
    
    console.log(`✅ Successfully fetched ${products.length} products:`);
    products.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.name} (${product.categories?.name || 'No category'}) - $${product.base_price}`);
    });
    
    // Test 3: Check categories
    console.log('\n3️⃣  Checking categories...');
    const { data: categories, error: categoryError } = await supabase
      .from('categories')
      .select('id, name, slug, is_active')
      .eq('is_active', true);
    
    if (categoryError) {
      console.log('❌ Error fetching categories:', categoryError.message);
    } else {
      console.log(`✅ Found ${categories.length} categories:`);
      categories.forEach(category => {
        console.log(`   • ${category.name} (${category.slug})`);
      });
    }
    
    console.log('\n✅ All tests completed successfully!');
    
  } catch (error) {
    console.log('❌ Unexpected error:', error.message);
    console.log('Error details:', error);
  }
}

testProductFetch();