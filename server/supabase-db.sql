-- Neon Database Setup for Enhanced Fashion E-commerce Platform

-- 1. Enhanced Users table with OAuth support
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255),
    provider VARCHAR(50) DEFAULT 'email', -- 'google', 'instagram', 'email'
    provider_id VARCHAR(255), -- ID from OAuth provider
    avatar_url TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Enhanced Admin Users table with 2 roles
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'content_manager' CHECK (role IN ('super_admin', 'content_manager')),
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Categories table for better organization
CREATE TABLE IF NOT EXISTS categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Locked Sections table for exclusive deals (global passcode)
CREATE TABLE IF NOT EXISTS locked_sections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    passcode_hash VARCHAR(255) NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES admin_users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Enhanced Products table
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    short_description TEXT,
    base_price DECIMAL(10, 2) NOT NULL CHECK (base_price >= 0),
    compare_at_price DECIMAL(10, 2), -- Original price for showing discounts
    cost_price DECIMAL(10, 2), -- For profit calculation
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    locked_section_id UUID REFERENCES locked_sections(id) ON DELETE SET NULL,
    gender VARCHAR(20) CHECK (gender IN ('men', 'women', 'unisex', 'kids')),
    tags TEXT[], -- Array of tags for better filtering
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    seo_title VARCHAR(255),
    seo_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Product Variants table for sizes with inventory tracking
CREATE TABLE IF NOT EXISTS product_variants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    sku VARCHAR(100) UNIQUE NOT NULL,
    size VARCHAR(20) NOT NULL,
    color VARCHAR(50),
    color_code VARCHAR(7), -- Hex color code
    material VARCHAR(100),
    additional_price DECIMAL(10, 2) DEFAULT 0 CHECK (additional_price >= 0),
    stock_quantity INTEGER DEFAULT 0,
    reserved_quantity INTEGER DEFAULT 0, -- For carts/orders in progress
    low_stock_threshold INTEGER DEFAULT 5,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Product Media table with variant association
CREATE TABLE IF NOT EXISTS product_media (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
    media_url TEXT NOT NULL,
    cloudinary_public_id VARCHAR(255),
    media_type VARCHAR(20) DEFAULT 'image', -- 'image', 'video'
    alt_text VARCHAR(255),
    sort_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Enhanced Orders table with JSON products (no separate order_items)
CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20),
    
    -- Shipping address (JSON for flexibility)
    shipping_address JSONB NOT NULL,
    
    -- Order items stored as JSON for simplicity
    products JSONB NOT NULL, -- Array of products with variants, quantities, prices
    
    -- Order amounts
    subtotal_amount DECIMAL(10, 2) NOT NULL CHECK (subtotal_amount >= 0),
    shipping_amount DECIMAL(10, 2) DEFAULT 0,
    tax_amount DECIMAL(10, 2) DEFAULT 0,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    total_amount DECIMAL(10, 2) NOT NULL CHECK (total_amount >= 0),
    
    -- Status tracking
    payment_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'paid', 'failed', 'refunded'
    fulfillment_status VARCHAR(50) DEFAULT 'unfulfilled', -- 'unfulfilled', 'fulfilled'
    
    -- Payment information
    payment_method VARCHAR(100),
    payment_gateway VARCHAR(100), -- 'razorpay', etc.
    payment_gateway_id VARCHAR(255), -- Transaction ID from payment gateway
    
    -- Timestamps
    ordered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    paid_at TIMESTAMP,
    fulfilled_at TIMESTAMP,
    cancelled_at TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Simplified Payment Verifications table (without screenshot)
CREATE TABLE IF NOT EXISTS payment_verifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    upi_transaction_id VARCHAR(255) UNIQUE,
    upi_reference_number VARCHAR(255),
    amount_paid DECIMAL(10, 2) NOT NULL CHECK (amount_paid >= 0),
    verification_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'verified', 'rejected'
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verified_at TIMESTAMP,
    verified_by UUID REFERENCES admin_users(id),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. Cart table (for logged-in users only - guest carts in Redis)
CREATE TABLE IF NOT EXISTS cart (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, variant_id)
);

-- 11. User Favorites table
CREATE TABLE IF NOT EXISTS user_favorites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id)
);

-- 12. Enhanced User Addresses table
CREATE TABLE IF NOT EXISTS user_addresses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    label VARCHAR(100), -- 'Home', 'Work', etc.
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address_line_1 VARCHAR(255) NOT NULL,
    address_line_2 VARCHAR(255),
    landmark VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) DEFAULT 'India',
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 13. Order Status History table
CREATE TABLE IF NOT EXISTS order_status_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    status_type VARCHAR(50) NOT NULL, -- 'payment', 'fulfillment', 'general'
    old_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    changed_by UUID, -- Can be admin_user_id or user_id
    changed_by_type VARCHAR(20) DEFAULT 'system', -- 'admin', 'user', 'system'
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 14. Product Reviews table
CREATE TABLE IF NOT EXISTS product_reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    comment TEXT,
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT FALSE,
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, user_id)
);

-- Insert initial categories
INSERT INTO categories (id, name, slug, description, sort_order) VALUES
(gen_random_uuid(), 'T-Shirts', 't-shirts', 'Comfortable and stylish t-shirts', 1),
(gen_random_uuid(), 'Pants', 'pants', 'Various styles of pants', 2),
(gen_random_uuid(), 'Hoodies', 'hoodies', 'Warm and trendy hoodies', 3),
(gen_random_uuid(), 'Jackets', 'jackets', 'Stylish jackets for all seasons', 4),
(gen_random_uuid(), 'Accessories', 'accessories', 'Fashion accessories', 5)
ON CONFLICT (slug) DO NOTHING;

-- Insert default admin users
INSERT INTO admin_users (id, username, email, password_hash, role) VALUES 
(gen_random_uuid(), 'superadmin', 'superadmin@rachna.com', '$2b$10$rQZ8kHp4rQZ8kHp4rQZ8kOQZ8kHp4rQZ8kHp4rQZ8kHp4rQZ8kHp4r', 'super_admin'),
(gen_random_uuid(), 'contentmanager', 'content@rachna.com', '$2b$10$rQZ8kHp4rQZ8kHp4rQZ8kOQZ8kHp4rQZ8kHp4rQZ8kHp4rQZ8kHp4r', 'content_manager')
ON CONFLICT (username) DO NOTHING;

-- ========== OPTIMIZED INDEXES ==========

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_provider ON users(provider, provider_id);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- Categories indexes
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON categories(is_active);

-- Products indexes
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_locked_section_id ON products(locked_section_id);
CREATE INDEX IF NOT EXISTS idx_products_gender ON products(gender);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(base_price);

-- Product variants indexes (CRITICAL for inventory management)
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_sku ON product_variants(sku);
CREATE INDEX IF NOT EXISTS idx_product_variants_stock ON product_variants(stock_quantity) WHERE stock_quantity > 0;
CREATE INDEX IF NOT EXISTS idx_product_variants_size ON product_variants(size);
CREATE INDEX IF NOT EXISTS idx_product_variants_low_stock ON product_variants(stock_quantity) WHERE stock_quantity <= low_stock_threshold;

-- Orders indexes
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_fulfillment_status ON orders(fulfillment_status);
CREATE INDEX IF NOT EXISTS idx_orders_ordered_at ON orders(ordered_at);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);

-- Cart and favorites indexes
CREATE INDEX IF NOT EXISTS idx_cart_user_id ON cart(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);

-- Reviews indexes
CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_rating ON product_reviews(rating);
CREATE INDEX IF NOT EXISTS idx_product_reviews_approved ON product_reviews(is_approved) WHERE is_approved = true;

-- Locked sections indexes
CREATE INDEX IF NOT EXISTS idx_locked_sections_dates ON locked_sections(start_date, end_date) WHERE is_active = true;

-- ========== TRIGGERS ==========

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_product_variants_updated_at BEFORE UPDATE ON product_variants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_addresses_updated_at BEFORE UPDATE ON user_addresses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cart_updated_at BEFORE UPDATE ON cart FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Order number generation
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
DECLARE
    order_count INTEGER;
    new_order_number VARCHAR(50);
BEGIN
    SELECT COUNT(*) INTO order_count 
    FROM orders 
    WHERE DATE(ordered_at) = CURRENT_DATE;
    
    new_order_number := 'ORD-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' || LPAD((order_count + 1)::TEXT, 4, '0');
    NEW.order_number := new_order_number;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER generate_order_number_trigger
    BEFORE INSERT ON orders
    FOR EACH ROW
    WHEN (NEW.order_number IS NULL)
    EXECUTE FUNCTION generate_order_number();

-- Inventory reservation trigger (when item added to cart)
CREATE OR REPLACE FUNCTION reserve_inventory()
RETURNS TRIGGER AS $$
BEGIN
    -- When item is added to cart, reserve the inventory
    UPDATE product_variants 
    SET reserved_quantity = reserved_quantity + NEW.quantity
    WHERE id = NEW.variant_id;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER reserve_inventory_trigger
    AFTER INSERT ON cart
    FOR EACH ROW
    EXECUTE FUNCTION reserve_inventory();

-- Inventory release trigger (when item removed from cart or order cancelled)
CREATE OR REPLACE FUNCTION release_inventory()
RETURNS TRIGGER AS $$
BEGIN
    -- When item is removed from cart, release the reserved inventory
    UPDATE product_variants 
    SET reserved_quantity = reserved_quantity - OLD.quantity
    WHERE id = OLD.variant_id;
    
    RETURN OLD;
END;
$$ language 'plpgsql';

CREATE TRIGGER release_inventory_trigger
    AFTER DELETE ON cart
    FOR EACH ROW
    EXECUTE FUNCTION release_inventory();

-- Update inventory when order is fulfilled
CREATE OR REPLACE FUNCTION update_inventory_on_fulfillment()
RETURNS TRIGGER AS $$
BEGIN
    -- When order status changes to fulfilled, update actual inventory
    IF NEW.fulfillment_status = 'fulfilled' AND OLD.fulfillment_status != 'fulfilled' THEN
        -- Parse the products JSON and update inventory for each variant
        UPDATE product_variants pv
        SET stock_quantity = stock_quantity - (
            SELECT (item->>'quantity')::INTEGER
            FROM jsonb_array_elements(NEW.products) AS item
            WHERE (item->>'variantId')::UUID = pv.id
        ),
        reserved_quantity = reserved_quantity - (
            SELECT (item->>'quantity')::INTEGER
            FROM jsonb_array_elements(NEW.products) AS item
            WHERE (item->>'variantId')::UUID = pv.id
        )
        WHERE pv.id IN (
            SELECT (item->>'variantId')::UUID
            FROM jsonb_array_elements(NEW.products) AS item
        );
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_inventory_on_fulfillment_trigger
    AFTER UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_inventory_on_fulfillment();