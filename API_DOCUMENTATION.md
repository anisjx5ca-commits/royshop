# API Integration & Documentation

## Components API Reference

### Product3DViewer Component

The main 3D viewer component for product visualization.

```typescript
interface Product3DViewerProps {
  modelPath: string;              // Path to GLB/GLTF model
  modelScale?: number;             // Scale factor (default: 2)
  onModelLoad?: () => void;        // Callback when model loads
  rotationSpeed?: number;          // Auto-rotation speed (default: 0.005)
  enableAutoRotate?: boolean;      // Enable auto-rotation (default: true)
}

<Product3DViewer
  modelPath="/models/shirt-sample.glb"
  modelScale={2}
  enableAutoRotate={true}
  onModelLoad={() => console.log('Model loaded')}
/>
```

**Features:**
- OrbitControls for rotation, zoom
- Studio lighting with environment maps
- Responsive canvas
- Automatic model centering
- Soft shadows and professional rendering

---

### CheckoutForm Component

Complete checkout form with Wilaya selection and shipping calculation.

```typescript
interface CheckoutFormProps {
  onSuccess?: (orderId: string) => void; // Callback on successful order
}

<CheckoutForm onSuccess={(orderId) => {
  navigate(`/success/${orderId}`);
}} />
```

**Form Fields:**
- Full Name (required)
- Phone Number (required, 9+ digits)
- Wilaya/State (58 Algerian options)
- Municipality/Baladiya (required)
- Exact Address (required)
- Site Rating (optional, 1-5 stars)

**Shipping Logic:**
```typescript
const SHIPPING_COSTS = {
  '15': 400,      // Algiers
  'default': 800  // All other Wilayas
};

// Total calculated as:
// totalPrice = subtotal + shippingCost
```

---

### CartSidebar Component

Responsive cart sidebar showing cart items and checkout button.

```typescript
interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const [isCartOpen, setIsCartOpen] = useState(false);

<CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
```

**Features:**
- Add/remove items
- Adjust quantities
- Real-time total calculation
- Mobile-optimized drawer

---

### WhatsAppButton Component

Floating WhatsApp contact button.

```typescript
interface WhatsAppButtonProps {
  phoneNumber?: string;        // WhatsApp number (international format)
  message?: string;            // Pre-filled message
}

<WhatsAppButton 
  phoneNumber="213671234567"
  message="Hello! I have a question..."
/>
```

---

## Zustand Store API

### Cart Store

```typescript
import { useCartStore } from '@/store/cartStore';

const items = useCartStore((state) => state.items);
const addToCart = useCartStore((state) => state.addToCart);
const removeFromCart = useCartStore((state) => state.removeFromCart);
const updateQuantity = useCartStore((state) => state.updateQuantity);
const totalPrice = useCartStore((state) => state.getTotalPrice());
const totalItems = useCartStore((state) => state.getTotalItems());

// Add item
addToCart({
  modelId: 'product-1',
  name: 'Shirt',
  price: 4500,
  color: 'blue',
  size: 'M',
  quantity: 1,
  image: 'url-to-image'
});

// Update quantity
updateQuantity('product-1', 'blue', 'M', 2);

// Remove item
removeFromCart('product-1', 'blue', 'M');
```

### User Store

```typescript
import { useUserStore } from '@/store/userStore';

const user = useUserStore((state) => state.user);
const setUser = useUserStore((state) => state.setUser);

setUser({
  name: 'John Doe',
  phone: '213671234567',
  wilaya: 'Algiers',
  baladiya: 'Central',
  address: '123 Main St',
  siteRating: 5
});
```

---

## Supabase Functions

### Product Functions

```typescript
import { getProducts, getProduct } from '@/lib/supabase';

// Get all products
const products = await getProducts();

// Get single product
const product = await getProduct('product-id');

// Result Type
interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  model_url: string;
  texture_config: Record<string, any>;
  image_url?: string;
  description?: string;
  created_at?: string;
}
```

### Order Functions

```typescript
import { createOrder } from '@/lib/supabase';

const order = await createOrder({
  user_name: 'John Doe',
  phone: '213671234567',
  wilaya: 'Alger',
  baladiya: 'Downtown',
  address: '123 Main St',
  total_price: 9500,
  shipping_cost: 400,
  items_json: JSON.stringify(cartItems),
  status: 'pending',
  site_rating: 5
});

// Returns Order object with id
interface Order {
  id: string;
  user_name: string;
  phone: string;
  wilaya: string;
  baladiya: string;
  address: string;
  total_price: number;
  shipping_cost: number;
  items_json: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  site_rating?: number;
  created_at?: string;
}
```

### Review Functions

```typescript
import { getReviews, createReview } from '@/lib/supabase';

// Get product reviews
const reviews = await getReviews('product-id');

// Create review (admin only)
const review = await createReview({
  product_id: 'product-id',
  rating: 5,
  comment: 'Excellent product!',
  is_verified: false // Set to true only after purchase verification
});

interface Review {
  id: string;
  product_id: string;
  rating: number;       // 1-5
  comment: string;
  is_verified: boolean; // True = verified purchase
  created_at?: string;
}
```

---

## Route Structure

```
GET  /                      → HomePage
GET  /shop                  → ShopPage (product listing)
GET  /product/:id           → ProductDetailsPage
GET  /checkout              → CheckoutPage
POST /checkout              → createOrder (handled by form)
GET  /success/:orderId      → SuccessPage
```

---

## Environment Variables

```env
# Required
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Optional
VITE_WHATSAPP_PHONE=213671234567
```

---

## Color Scheme (Tailwind)

```typescript
// Custom colors in tailwind.config.js
primary:       '#1a1a1a'   // Dark text
secondary:     '#ffffff'   // White background
accent:        '#ff6b35'   // Orange (CTA)
accent-light:  '#ff8c5a'   // Light orange
border:        '#e5e5e5'   // Borders
bg-light:      '#fafafa'   // Light background
```

---

## Shipping Wilaya Codes

All 58 Algerian Wilayas with codes:

```typescript
const ALGERIAN_WILAYAS = [
  { code: '1', name: 'Adrar' },
  { code: '2', name: 'Chlef' },
  // ... (complete list in CheckoutForm.tsx)
  { code: '15', name: 'Alger' },      // Special rate: 400 DA
  // ... (all others: 800 DA)
  { code: '58', name: 'Tindouf' }
];
```

---

## Performance Tips

1. **Optimize 3D Models:**
   - Use compressed GLB format
   - Keep models under 5MB
   - Use textures efficiently

2. **Image Optimization:**
   - Use responsive images
   - Serve from CDN (Supabase Storage)
   - Use modern formats (WebP with fallback)

3. **State Management:**
   - Use Zustand selectors to minimize re-renders
   - Keep cart state minimal
   - Use localStorage for persistence

4. **Bundle Size:**
   - Route-based code splitting
   - Tree-shake unused imports
   - Monitor with `npm run build`

---

## Error Handling

All async operations are wrapped with try-catch and toast notifications:

```typescript
import toast from 'react-hot-toast';

try {
  await createOrder(orderData);
  toast.success('Order placed successfully!');
} catch (error) {
  console.error(error);
  toast.error('Failed to place order');
}
```

---

## Mobile Responsive Breakpoints

```css
/* Tailwind breakpoints */
sm:  640px   /* Tablets */
md:  768px   /* Large tablets */
lg:  1024px  /* Desktops */
xl:  1280px  /* Large screens */
2xl: 1536px  /* Extra large screens */
```

---

## Testing Workflow

1. **Supabase Connection:**
   - Add product to database
   - Verify `getProducts()` returns data
   - Check console for errors

2. **3D Models:**
   - Place model in `public/models/`
   - Update `model_url` in product
   - Test in Product Details page

3. **Checkout Flow:**
   - Add item to cart
   - Go to checkout
   - Select Wilaya
   - Verify shipping cost
   - Submit order
   - Check Supabase `orders` table

4. **WhatsApp:**
   - Click button
   - Verify WhatsApp opens with message
   - Update phone number if needed

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Models not loading | Check `public/models/` path and file names |
| Cart not persisting | Ensure Zustand middleware is enabled |
| Shipping cost not calculating | Verify Wilaya code matches `SHIPPING_COSTS` |
| Supabase connection fails | Check `.env.local` credentials |
| Canvas is black | Check lighting configuration in Model3D.tsx |
| Form validation errors | Ensure all required fields are filled |

---

**Last Updated:** December 2025
