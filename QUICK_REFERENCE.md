# RoyShop - Quick Reference Card

## 🚀 Start Here (Copy & Paste Commands)

### 1. Install & Run
```bash
cd "d:\3d ferx"
npm install
npm run dev
```

### 2. Build for Production
```bash
npm run build
npm run preview
```

## 📖 Documentation Quick Links

| Document | Purpose | Time to Read |
|----------|---------|--------------|
| **[README.md](README.md)** | Overview & features | 5 min |
| **[SUPABASE_SETUP.md](SUPABASE_SETUP.md)** | Database setup | 10 min |
| **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** | Component reference | 10 min |
| **[DEPLOYMENT.md](DEPLOYMENT.md)** | Deploy to production | 15 min |
| **[PROJECT_COMPLETE.md](PROJECT_COMPLETE.md)** | What's included | 5 min |

## ⚙️ Environment Setup

### Create `.env.local`
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Get Credentials
1. Go to https://supabase.com
2. Create project
3. Go to Settings → API
4. Copy **Project URL** and **anon public key**
5. Paste into `.env.local`

## 🗄️ Supabase Setup (3 Steps)

1. **Create Project** at https://supabase.com
2. **Run SQL** - Copy all SQL from `SUPABASE_SETUP.md` into Supabase SQL Editor
3. **Add Credentials** to `.env.local`

## 📁 Key File Locations

| File | Purpose |
|------|---------|
| `src/App.tsx` | Main routing |
| `src/pages/` | 5 page components |
| `src/components/` | 7 reusable components |
| `src/store/` | Zustand state management |
| `src/lib/supabase.ts` | Database client |
| `public/models/` | 3D model files (add your GLB files here) |
| `.env.local` | Your secret credentials |

## 🎨 Important Constants

### Shipping Costs (CheckoutForm.tsx)
```typescript
const SHIPPING_COSTS = {
  '15': 400,      // Algiers
  'default': 800  // All other Wilayas
};
```

### Color Scheme (tailwind.config.js)
```javascript
primary: '#1a1a1a'    // Text
secondary: '#ffffff'  // Background
accent: '#ff6b35'     // Buttons (orange)
```

### WhatsApp Number (WhatsAppButton.tsx)
```typescript
<WhatsAppButton phoneNumber="213671234567" />
```

## 🧪 Testing Checklist

- [ ] `npm run dev` starts without errors
- [ ] Home page loads
- [ ] Shop page shows products
- [ ] Can click product → view details
- [ ] 3D viewer loads and rotates
- [ ] Add to cart works
- [ ] Checkout form opens
- [ ] Wilaya selector works
- [ ] Shipping cost calculates automatically
- [ ] Order submits to Supabase
- [ ] Success page shows
- [ ] WhatsApp button opens chat

## 📦 Dependencies Included

### Core
- react@18.2.0
- react-dom@18.2.0
- react-router-dom@6.18.0

### 3D Graphics
- three@r128
- @react-three/fiber@8.14.0
- @react-three/drei@9.88.0

### Styling & Animations
- tailwindcss@3.3.5
- framer-motion@10.16.4

### State & Database
- zustand@4.4.0
- @supabase/supabase-js@2.38.0

### UI
- react-hot-toast@2.4.1
- react-icons@4.12.0

## 🔗 Database Queries

### Get all products
```sql
SELECT * FROM products WHERE stock > 0;
```

### Get pending orders
```sql
SELECT * FROM orders WHERE status = 'pending';
```

### Get product reviews
```sql
SELECT * FROM reviews WHERE product_id = 'product-id' AND is_verified = true;
```

### Update order status
```sql
UPDATE orders SET status = 'confirmed' WHERE id = 'order-id';
```

## 🎯 Common Tasks

### Add a new product to database
```sql
INSERT INTO products (name, price, stock, model_url, image_url, description)
VALUES ('Product Name', 5000, 10, '/models/product.glb', 'image-url', 'Description');
```

### Change accent color
1. Open `tailwind.config.js`
2. Find `accent: '#ff6b35'`
3. Change to your color hex

### Update WhatsApp number
1. Open `src/components/WhatsAppButton.tsx`
2. Change `phoneNumber="213671234567"` to your number

### Add more products to homepage
1. Edit `FEATURED_PRODUCTS` in `src/pages/HomePage.tsx`
2. Add new objects with id, name, price, image, etc.

## 🚀 Deployment Quick Start

### Option 1: Vercel (Easiest)
```bash
npm install -g vercel
vercel
```

### Option 2: Netlify
1. Push to GitHub
2. Connect on netlify.com
3. Set env variables
4. Deploy

### Option 3: Local VPS
```bash
npm run build
# Copy dist/ to server
# Serve with nginx/apache
```

## 📊 Page Routes

```
/              → Home
/shop          → Product listing
/product/:id   → Product details with 3D viewer
/checkout      → Order form
/success/:id   → Order confirmation
```

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Models not loading | Put GLB files in `public/models/` |
| Cart empty after refresh | Check browser allows localStorage |
| Supabase connection fails | Check `.env.local` credentials |
| Shipping cost shows 0 | Select a Wilaya from dropdown |
| 3D viewer is black | Check that 3D model file exists and is valid |

## 📱 Responsive Design

- **Mobile:** < 768px (stack layout, drawer cart)
- **Tablet:** 768px - 1024px (2-column grid)
- **Desktop:** > 1024px (3-4 column grid)

Test with: Press F12 → Toggle device toolbar (Ctrl+Shift+M)

## ⏱️ Time Estimates

| Task | Time |
|------|------|
| Setup Supabase | 15 min |
| Add 3D models | 10 min |
| Configure env variables | 5 min |
| Test locally | 10 min |
| Deploy to Vercel | 5 min |
| **Total** | **45 min** |

## 🆘 Need Help?

1. **Code Issues** → Check comments in source files
2. **Database** → Review [SUPABASE_SETUP.md](SUPABASE_SETUP.md)
3. **Components** → See [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
4. **Deployment** → Follow [DEPLOYMENT.md](DEPLOYMENT.md)
5. **Overview** → Read [PROJECT_COMPLETE.md](PROJECT_COMPLETE.md)

## ✅ Status

- ✅ All files created
- ✅ All dependencies configured
- ✅ Database schema provided
- ✅ Components ready to use
- ✅ Documentation complete
- ✅ Ready for deployment

## 🎯 Next Action

```bash
# 1. Setup Supabase (follow SUPABASE_SETUP.md)
# 2. Create .env.local with your credentials
# 3. Run npm run dev
# 4. Test the application
# 5. Deploy when ready
```

---

**Happy Building! 🚀**

For detailed information, see the full documentation files above.
