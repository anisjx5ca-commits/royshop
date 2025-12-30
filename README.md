# RoyShop - 3D E-Commerce Platform

[![Netlify Status](https://api.netlify.com/api/v1/badges/31b6c956-c448-4b91-b7f3-0cd47fd537b3/deploy-status)](https://app.netlify.com/projects/royshop2/deploys)

A premium, high-performance 3D e-commerce website for a clothing brand using React, Three.js, and Supabase.

## 🌐 Live Demo & Repository

- **Live Site:** [RoyShop on Netlify](https://royshop2.netlify.app)
- **GitHub Repository:** [anisjx5ca-commits/royshop](https://github.com/anisjx5ca-commits/royshop)

## 🚀 Tech Stack

- **Frontend:** React 18 + Vite + TypeScript
- **3D Engine:** React Three Fiber (R3F), @react-three/drei
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **State Management:** Zustand
- **Backend/Database:** Supabase (PostgreSQL)
- **UI Components:** React Icons, React Hot Toast
- **Routing:** React Router v6

## 📁 Project Structure

```
src/
├── components/
│   ├── Header.tsx              # Navigation & Cart icon
│   ├── CartSidebar.tsx         # Shopping cart drawer
│   ├── Product3DViewer.tsx     # 3D model viewer component
│   ├── Model3D.tsx             # 3D model loader
│   ├── ProductCard.tsx         # Product grid card
│   ├── CheckoutForm.tsx        # Checkout form with Wilaya logic
│   └── WhatsAppButton.tsx      # Floating WhatsApp button
├── pages/
│   ├── HomePage.tsx            # Home with hero & featured products
│   ├── ShopPage.tsx            # Product listing with filters
│   ├── ProductDetailsPage.tsx  # Product details with 3D viewer
│   ├── CheckoutPage.tsx        # Checkout form page
│   └── SuccessPage.tsx         # Order confirmation
├── store/
│   ├── cartStore.ts            # Zustand cart state
│   └── userStore.ts            # Zustand user state
├── lib/
│   └── supabase.ts             # Supabase client & helpers
├── App.tsx                      # Main routing component
├── main.tsx                     # Entry point
└── index.css                    # Global styles

public/
└── models/                      # 3D model files (GLB/GLTF)

.env.local                        # Environment variables (local)
.env.example                      # Example env template
vite.config.ts                   # Vite configuration
tailwind.config.js               # Tailwind config
postcss.config.js                # PostCSS config
```

## 🗄️ Supabase Database Schema

### SQL Setup

Execute this SQL in your Supabase SQL Editor to set up the database:

```sql
-- Create Products Table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  model_url TEXT NOT NULL,
  image_url TEXT,
  description TEXT,
  texture_config JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Orders Table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  wilaya VARCHAR(100) NOT NULL,
  baladiya VARCHAR(100) NOT NULL,
  address TEXT NOT NULL,
  total_price NUMERIC(10, 2) NOT NULL,
  shipping_cost NUMERIC(10, 2) NOT NULL,
  items_json TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  site_rating INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Reviews Table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Indexes for better performance
CREATE INDEX idx_products_stock ON products(stock);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_reviews_created_at ON reviews(created_at);

-- Enable RLS (Row Level Security) if needed
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Create policies (optional, depending on your security needs)
CREATE POLICY "Enable read access for all users" ON products
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for checkout" ON orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read for reviews" ON reviews
  FOR SELECT USING (true);
```

## 🔧 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Execute the SQL schema above in your Supabase SQL Editor
3. Copy your project URL and anon key
4. Create `.env.local` file and add your credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Add 3D Models

Place your GLB/GLTF models in the `public/models/` directory:
- `shirt-sample.glb`
- `pants-sample.glb`
- `jacket-sample.glb`
- `sweater-sample.glb`
- etc.

### 4. Run Development Server

```bash
npm run dev
```

The application will open at `http://localhost:5173`

## 📦 Building for Production

```bash
npm run build
npm run preview
```

## 🎨 Key Features

### 1. **3D Product Viewer**
- Interactive 3D model viewer with OrbitControls
- Rotate, zoom, and pan the product
- Professional studio lighting with environment maps
- Responsive canvas that works on mobile

### 2. **Smart Cart System**
- Persistent cart using Zustand + LocalStorage
- Track product variants (color, size)
- Real-time quantity updates
- Sidebar drawer on mobile, visible sidebar on desktop

### 3. **Checkout Flow**
- Form with all required fields
- **Algerian Wilaya (State) selector** (58 options)
- **Dynamic shipping cost calculation:**
  - Algiers (Wilaya 15): 400 DA
  - Other Wilayas: 800 DA
- Optional 5-star site rating
- Verified purchase logic structure

### 4. **Product Reviews**
- Display product ratings and reviews
- Verified purchase badge
- Star rating system
- Expandable review list

### 5. **Animations & Polish**
- Smooth page transitions with Framer Motion
- Hover effects on cards and buttons
- Loading states
- Toast notifications for actions
- Responsive design (Mobile/Tablet/Desktop)

### 6. **WhatsApp Integration**
- Floating button (bottom-left)
- Pre-filled message template
- Direct link to chat

## 🛍️ Wilaya (State) Shipping Logic

The checkout form includes all 58 Algerian Wilayas:

```typescript
// Shipping costs by Wilaya
const SHIPPING_COSTS = {
  '15': 400,    // Algiers (Alger)
  'default': 800 // All other Wilayas
};

// Example: Auto-calculated total
Total = (Item Price × Quantity) + Shipping Cost
```

## 📝 Sample Product Data

Insert sample products:

```sql
INSERT INTO products (name, price, stock, model_url, image_url, description, texture_config)
VALUES
  (
    'Premium Casual Shirt',
    4500,
    15,
    '/models/shirt-sample.glb',
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
    'High-quality casual shirt made from premium cotton',
    '{"colors": ["white", "black", "blue", "navy"]}'
  ),
  (
    'Elegant Dress Pants',
    5500,
    12,
    '/models/pants-sample.glb',
    'https://images.unsplash.com/photo-1473181052071-15efbf76eaea?w=400&h=400&fit=crop',
    'Sophisticated dress pants for any occasion',
    '{"colors": ["black", "navy", "gray"]}'
  );
```

## 🔐 Environment Variables

Required variables in `.env.local`:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## 🌐 Deployment to Netlify

### Prerequisites
- GitHub account with repository created
- Netlify account (sign up at netlify.com)

### Step 1: Push to GitHub

```bash
# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/3d-royshop.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Netlify

1. **Connect Repository:**
   - Go to [Netlify Dashboard](https://app.netlify.com)
   - Click "New site from Git"
   - Choose GitHub and authorize
   - Select your repository

2. **Configure Build Settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: 18

3. **Set Environment Variables:**
   - In Netlify Dashboard → Site Settings → Build & deploy → Environment
   - Add these variables:
     - `VITE_SUPABASE_URL`: Your Supabase project URL
     - `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

4. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete (2-3 minutes)
   - Your site will be live at `https://your-site-name.netlify.app`

### Netlify Configuration

The `netlify.toml` file includes:
- Automatic routing for React Router (all routes → index.html)
- Security headers (XSS protection, content type options)
- Cache control for assets (aggressive caching for /assets/*)
- No cache for index.html (always fresh)

### Automatic Deployments

- Every push to `main` branch automatically deploys
- Preview builds for pull requests
- Instant rollbacks available

### Important Notes

✅ **The project is Netlify-ready:**
- Vite build configuration optimized
- React Router redirects configured
- Environment variables properly handled
- No server-side code required (static site)

## 📱 Responsive Behavior

- **Mobile (< 768px):** Stacked layout, drawer cart, touch-optimized
- **Tablet (768px - 1024px):** 2-column grid, hamburger menu
- **Desktop (> 1024px):** 3-4 column grid, persistent header

## 🚀 Performance Optimizations

1. **3D Model Optimization:**
   - GLB models are compressed
   - Automatic LOD (Level of Detail) scaling
   - Canvas resizes responsively

2. **Code Splitting:**
   - Route-based code splitting with React Router
   - Lazy loading of 3D models

3. **Zustand State:**
   - Minimal re-renders with selective subscriptions
   - Persistent state with localStorage

## 🎯 Post-Purchase Flow

1. User fills checkout form
2. Validates all required fields
3. Calculates total (items + shipping)
4. Sends data to Supabase `orders` table
5. Clears cart
6. Redirects to Success page
7. Shows confirmation message with order details

## 📞 Support & Contact

The WhatsApp floating button links to your support team. Update the phone number in:

```typescript
<WhatsAppButton phoneNumber="213671234567" />
```

## 📄 License

MIT License - Feel free to use this for commercial projects.

## 🤝 Contributing

Contributions are welcome! Please follow the code structure and maintain the component hierarchy.

---

**Built with ❤️ for Premium 3D E-Commerce**
