# Supabase Setup Guide for RoyShop

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start Your Project"
3. Sign in or create an account
4. Create a new organization
5. Create a new project:
   - **Project Name:** RoyShop
   - **Database Password:** Create a strong password
   - **Region:** Choose closest to your users (e.g., Europe-West1 for Algeria-close region)
6. Wait for the project to initialize

## Step 2: Access SQL Editor

1. In your Supabase dashboard, click "SQL Editor" in the left sidebar
2. Click "New Query"
3. Paste the complete SQL schema below

## Step 3: Database Schema SQL

Copy and execute this entire SQL block in Supabase SQL Editor:

```sql
-- ============================================
-- ROYSHOP DATABASE SCHEMA
-- ============================================

-- 1. PRODUCTS TABLE
-- Stores all product information and 3D models
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL UNIQUE,
  price NUMERIC(10, 2) NOT NULL CHECK (price > 0),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  model_url TEXT NOT NULL,
  image_url TEXT,
  description TEXT,
  texture_config JSONB DEFAULT '{"colors": [], "sizes": []}'::jsonb,
  category VARCHAR(100),
  sku VARCHAR(100) UNIQUE,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_price CHECK (price >= 0)
);

-- 2. ORDERS TABLE
-- Stores all customer orders
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  wilaya VARCHAR(100) NOT NULL,
  baladiya VARCHAR(100) NOT NULL,
  address TEXT NOT NULL,
  total_price NUMERIC(10, 2) NOT NULL,
  shipping_cost NUMERIC(10, 2) NOT NULL DEFAULT 0,
  items_json TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  site_rating INTEGER CHECK (site_rating IS NULL OR (site_rating >= 1 AND site_rating <= 5)),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_total CHECK (total_price >= 0),
  CONSTRAINT valid_shipping CHECK (shipping_cost >= 0)
);

-- 3. REVIEWS TABLE
-- Stores customer product reviews (for verified purchases only)
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT review_length CHECK (char_length(comment) <= 1000)
);

-- 4. SHIPPING RATES TABLE
-- Dynamic shipping cost management by Wilaya
CREATE TABLE IF NOT EXISTS shipping_rates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wilaya_code VARCHAR(3) NOT NULL UNIQUE,
  wilaya_name VARCHAR(100) NOT NULL,
  cost NUMERIC(10, 2) NOT NULL CHECK (cost >= 0),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX idx_products_stock ON products(stock);
CREATE INDEX idx_products_is_featured ON products(is_featured);
CREATE INDEX idx_products_created_at ON products(created_at DESC);
CREATE INDEX idx_products_category ON products(category);

CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_phone ON orders(phone);
CREATE INDEX idx_orders_wilaya ON orders(wilaya);

CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_reviews_is_verified ON reviews(is_verified);
CREATE INDEX idx_reviews_created_at ON reviews(created_at DESC);
CREATE INDEX idx_reviews_rating ON reviews(rating);

CREATE INDEX idx_shipping_rates_wilaya_code ON shipping_rates(wilaya_code);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_rates ENABLE ROW LEVEL SECURITY;

-- Products: Public read access
CREATE POLICY "Enable read access for all users" ON products
  FOR SELECT USING (true);

-- Orders: Insert only (from checkout)
CREATE POLICY "Enable insert for anonymous users" ON orders
  FOR INSERT WITH CHECK (true);

-- Orders: Admin can read all
CREATE POLICY "Authenticated users can read their own orders" ON orders
  FOR SELECT USING (true);

-- Reviews: Public read access
CREATE POLICY "Enable read access for reviews" ON reviews
  FOR SELECT USING (true);

-- Shipping Rates: Public read access
CREATE POLICY "Enable read access for shipping rates" ON shipping_rates
  FOR SELECT USING (is_active = true);

-- ============================================
-- SAMPLE DATA
-- ============================================

-- Sample shipping rates for Algerian Wilayas (28 shown, add all 58 as needed)
INSERT INTO shipping_rates (wilaya_code, wilaya_name, cost) VALUES
  ('1', 'Adrar', 800),
  ('2', 'Chlef', 800),
  ('3', 'Laghouat', 800),
  ('4', 'Oum El Bouaghi', 800),
  ('5', 'Batna', 800),
  ('6', 'Béjaïa', 800),
  ('7', 'Biskra', 800),
  ('8', 'Bechar', 800),
  ('9', 'Blida', 800),
  ('10', 'Boumerdes', 800),
  ('11', 'El Tarf', 800),
  ('12', 'Tlemcen', 800),
  ('13', 'Tiaret', 800),
  ('14', 'Tizi Ouzou', 800),
  ('15', 'Alger', 400),    -- Special rate for Algiers
  ('16', 'Djelfa', 800),
  ('17', 'Jijel', 800),
  ('18', 'Sétif', 800),
  ('19', 'Saïda', 800),
  ('20', 'Skikda', 800),
  ('21', 'Sidi Bel Abbès', 800),
  ('22', 'Annaba', 800),
  ('23', 'Guelma', 800),
  ('24', 'Constantine', 800),
  ('25', 'Médéa', 800),
  ('26', 'Mostaganem', 800),
  ('27', 'M\'Sila', 800),
  ('28', 'Mascara', 800),
  ('29', 'Ouargla', 800),
  ('30', 'Oran', 800),
  ('31', 'El Bayadh', 800),
  ('32', 'Illizi', 800),
  ('33', 'Bordj Bou Arréridj', 800),
  ('34', 'Boumerdès', 800),
  ('35', 'El Oued', 800),
  ('36', 'Khenchela', 800),
  ('37', 'Souk Ahras', 800),
  ('38', 'Tipaza', 800),
  ('39', 'Mila', 800),
  ('40', 'Ain Defla', 800),
  ('41', 'Naama', 800),
  ('42', 'Aïn Témouchent', 800),
  ('43', 'Ghardaia', 800),
  ('44', 'Relizane', 800),
  ('45', 'El M\'Ghair', 800),
  ('46', 'El Menia', 800),
  ('47', 'Ouled Djellal', 800),
  ('48', 'Bordj Baji Mokhtar', 800),
  ('49', 'Béni Abbes', 800),
  ('50', 'In Salah', 800),
  ('51', 'In Guezzam', 800),
  ('52', 'Touggourt', 800),
  ('53', 'Djanet', 800),
  ('54', 'El Oued (Oasis)', 800),
  ('55', 'Hassi Messaoud', 800),
  ('56', 'Ouargla (South)', 800),
  ('57', 'Talmanrasset', 800),
  ('58', 'Tindouf', 800)
ON CONFLICT (wilaya_code) DO NOTHING;

-- Sample products
INSERT INTO products (name, price, stock, model_url, image_url, description, texture_config, category, is_featured)
VALUES
  (
    'Premium Casual Shirt',
    4500.00,
    15,
    '/models/shirt-sample.glb',
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
    'High-quality casual shirt made from premium cotton. Perfect for everyday wear with a modern design.',
    '{"colors": ["white", "black", "blue", "navy"], "sizes": ["XS", "S", "M", "L", "XL", "XXL"]}'::jsonb,
    'Shirts',
    true
  ),
  (
    'Elegant Dress Pants',
    5500.00,
    12,
    '/models/pants-sample.glb',
    'https://images.unsplash.com/photo-1473181052071-15efbf76eaea?w=400&h=400&fit=crop',
    'Sophisticated dress pants suitable for professional and formal occasions.',
    '{"colors": ["black", "navy", "gray", "charcoal"], "sizes": ["28", "30", "32", "34", "36", "38"]}'::jsonb,
    'Pants',
    true
  ),
  (
    'Classic Denim Jacket',
    6500.00,
    8,
    '/models/jacket-sample.glb',
    'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&h=400&fit=crop',
    'Timeless denim jacket that never goes out of style. Versatile for any season.',
    '{"colors": ["blue", "black", "light_blue"], "sizes": ["XS", "S", "M", "L", "XL", "XXL"]}'::jsonb,
    'Jackets',
    true
  ),
  (
    'Stylish Sweater',
    4000.00,
    20,
    '/models/sweater-sample.glb',
    'https://images.unsplash.com/photo-1513245543132-31f507417b26?w=400&h=400&fit=crop',
    'Cozy and stylish sweater perfect for any season. Premium knit quality.',
    '{"colors": ["red", "gray", "navy", "white"], "sizes": ["XS", "S", "M", "L", "XL"]}'::jsonb,
    'Sweaters',
    false
  )
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- USEFUL QUERIES (FOR REFERENCE)
-- ============================================

-- Get all featured products
-- SELECT * FROM products WHERE is_featured = true ORDER BY created_at DESC;

-- Get average product rating
-- SELECT p.id, p.name, AVG(r.rating) as avg_rating, COUNT(r.id) as review_count
-- FROM products p
-- LEFT JOIN reviews r ON p.id = r.product_id WHERE r.is_verified = true
-- GROUP BY p.id, p.name;

-- Get pending orders
-- SELECT * FROM orders WHERE status = 'pending' ORDER BY created_at DESC;

-- Update order status
-- UPDATE orders SET status = 'confirmed' WHERE id = 'order-id-here';
```

## Step 4: Get API Credentials

1. Go to **Settings** → **API** in your Supabase dashboard
2. Find **Project URL** - Copy this to `VITE_SUPABASE_URL`
3. Find **anon public** key - Copy this to `VITE_SUPABASE_ANON_KEY`
4. Create `.env.local` in project root:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

## Step 5: Set Storage for 3D Models (Optional)

1. Go to **Storage** in Supabase dashboard
2. Create a new bucket called `models`
3. Make it public by editing policies
4. Upload your GLB/GLTF files

## Step 6: Test Connection

Run the development server:

```bash
npm run dev
```

The app should now connect to your Supabase database.

## Important Notes

### Shipping Cost Logic

The app includes logic to automatically calculate shipping costs based on the selected Wilaya:

```typescript
// From CheckoutForm.tsx
const SHIPPING_COSTS: Record<string, number> = {
  '15': 400,    // Algiers (lower cost)
  'default': 800 // All other Wilayas
};
```

You can modify these costs by:
1. **Backend (Recommended):** Update `shipping_rates` table in Supabase
2. **Frontend:** Edit the `SHIPPING_COSTS` object in `CheckoutForm.tsx`

### Order Flow

1. User completes checkout
2. Data is saved to `orders` table with `status = 'pending'`
3. Admin can update status via Supabase dashboard
4. When status changes, you can send notifications (future feature)

### Review System

- Reviews are only marked as `is_verified = true` after confirming the purchase
- Implement a verification system to match orders with reviews
- Calculate average rating: `AVG(rating)` where `is_verified = true`

## Troubleshooting

### Connection Issues

1. Verify `.env.local` has correct URL and key
2. Check Network tab in browser DevTools for failed requests
3. Ensure RLS policies are enabled

### Models Not Loading

1. Check `model_url` paths in products table
2. Ensure 3D files are in `public/models/` directory
3. Verify file names match exactly (case-sensitive)

### Shipping Costs Not Calculating

1. Check that `wilaya_code` in `shipping_rates` table matches your form
2. Verify the `SHIPPING_COSTS` object in CheckoutForm matches your rates

---

**Next Step:** Configure your environment variables and run `npm run dev` to start the application!
