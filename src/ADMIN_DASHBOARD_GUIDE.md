# Admin Dashboard Documentation

## Overview

The Admin Dashboard is a protected, neon-styled admin interface that provides real-time sales tracking and order management capabilities. It fetches data from your Supabase database views and allows you to confirm sales, which automatically triggers stock deduction.

**Access URL:** `http://localhost:5173/admin/dashboard` (or your Netlify domain `/admin/dashboard`)

---

## Features

### 1. **Security - Password Authentication**
- Simple hardcoded password prompt on dashboard entry
- Default password: `admin123`
- Password is checked before displaying sensitive data
- Easy to update: modify `ADMIN_PASSWORD` constant in AdminDashboard.tsx

### 2. **KPI Cards (Top Section)**

#### Card 1: Total Revenue (Green Neon)
- **Source:** `total_revenue_view`
- **Displays:** `total_income` field
- **Format:** DA (Algerian Dinar) with proper locale formatting
- **Styling:** Green neon glow effect

#### Card 2: Completed Orders (Blue Neon)
- **Source:** `total_revenue_view`
- **Displays:** `total_orders_completed` field
- **Format:** Simple integer count
- **Styling:** Cyan neon glow effect

#### Card 3: Average Order Value (Pink Neon)
- **Source:** Calculated from Card 1 & 2
- **Formula:** `total_income / total_orders_completed`
- **Format:** DA with rounded integer
- **Styling:** Pink neon glow effect

### 3. **Daily Sales Table**

#### Data Source
- Table: `daily_sales_view`
- Sorted by: `sale_date` (newest first)

#### Columns
| Column | Format | Source |
|--------|--------|--------|
| Date | DD/MM/YYYY | `sale_date` |
| Orders Count | Integer | `orders_count` |
| Income (DA) | Algerian Dinar | `daily_income` |

#### Features
- Responsive scrolling on mobile
- Hover effects for better UX
- Automatic formatting for French locale
- Real-time updates after confirming sales

### 4. **Pending Orders Management**

#### Data Source
- Table: `orders`
- Filter: `payment_status = 'n'` (not yet paid)
- Sorted by: `created_at` (newest first)

#### Order Card Layout
Each pending order displays:
- **Order ID** (first 12 characters)
- **Customer Email**
- **Item Count** (from JSONB array)
- **Total Amount** (DA format)
- **Created Date**

#### Confirm Sale & Deduct Stock Button
- **Action:** Updates `payment_status` to `'y'`
- **Triggers:** PostgreSQL trigger `on_order_paid` which:
  - Loops through order items JSONB array
  - Decrements stock for each product
  - Updates revenue views automatically
- **Feedback:** Toast notification on success/failure
- **Auto-refresh:** Updates KPIs and sales table after confirmation

---

## Database Dependencies

### Required Supabase Views

#### 1. `total_revenue_view`
```sql
-- Expected columns:
-- total_income: INTEGER/BIGINT
-- total_orders_completed: INTEGER
```

#### 2. `daily_sales_view`
```sql
-- Expected columns:
-- sale_date: DATE
-- daily_income: INTEGER/BIGINT
-- orders_count: INTEGER
```

### Required Tables

#### 1. `orders` Table
```sql
-- Required columns:
-- id: UUID (Primary Key)
-- customer_email: TEXT
-- total_amount: NUMERIC
-- items: JSONB (array of {id: string, quantity: number})
-- created_at: TIMESTAMP
-- payment_status: TEXT ('n' = pending, 'y' = confirmed)
```

#### 2. `products` Table
- Used indirectly through inventory management trigger
- Stock will be auto-decremented when payment_status = 'y'

---

## Setup Instructions

### Step 1: Install Dependencies
Ensure you have all required packages:
```bash
npm install react-icons
```

### Step 2: Import the Component
The component is already added to `src/App.tsx`:
```tsx
import { AdminDashboard } from './pages/AdminDashboard';

// In routes:
<Route path="/admin/dashboard" element={<AdminDashboard />} />
```

### Step 3: Verify Database Views Exist
Test your views in Supabase SQL Editor:

```sql
-- Test total_revenue_view
SELECT * FROM total_revenue_view;

-- Test daily_sales_view
SELECT * FROM daily_sales_view;
```

### Step 4: Test the Dashboard
1. Navigate to `/admin/dashboard`
2. Enter password: `admin123`
3. Verify data appears from your Supabase views

### Step 5: Change Admin Password (Optional)
Edit `src/pages/AdminDashboard.tsx`:
```tsx
const ADMIN_PASSWORD = 'your_secure_password'; // Change this
```

---

## How It Works

### Data Flow Diagram

```
Admin Dashboard
    ↓
[Password Check] → Denied → Back to Home
    ↓ Approved
[Load Dashboard Data]
    ├→ total_revenue_view → KPI Cards
    ├→ daily_sales_view → Sales Table
    └→ orders (payment_status='n') → Pending Orders
    ↓
[Display Real-time Data with Neon Styling]
    ↓
[User Clicks "Confirm Sale"]
    ↓
[Update order.payment_status = 'y']
    ↓
[PostgreSQL Trigger: on_order_paid]
    ├→ Loops through order.items JSONB
    ├→ Extracts product_id & quantity
    └→ Decrements products.stock
    ↓
[Revenue Views Auto-Update]
    ↓
[Dashboard Auto-Refreshes]
    ├→ KPI cards recalculate
    ├→ Sales table updates
    └→ Pending orders list updates
```

---

## Components & Styling

### Neon Color Scheme
- **Pink Primary:** `#FF006E` (glow effects on main cards)
- **Cyan Secondary:** `#00D9FF` (sales table, secondary UI)
- **Green Accent:** `#00FF41` (revenue, confirm buttons)
- **Background:** `#0a0e27` (neon black)

### Key UI Elements

#### Password Prompt
- Animated modal with pink border
- Lock icon animation
- Password input with cyan glow
- Unlock button with pink shadow

#### KPI Cards
- 3-column responsive grid
- Individual neon glow effects
- Icon badges in top-right
- Shadow effects for depth

#### Sales Table
- Responsive with horizontal scroll on mobile
- Header with cyan text
- Alternating row hover effects
- Locale-formatted numbers

#### Pending Orders
- Card-based layout
- 4-column grid (responsive)
- Green confirm button with pulsing effect
- Loading state animation during confirmation

### Animation Effects
- Page load: Staggered fade-in with vertical motion
- Cards: Delayed entrance animations
- Buttons: Hover scale + tap effects
- Loading states: Animated spinners
- Table rows: Cascade animation

---

## Testing Scenarios

### Scenario 1: Authentication
1. Navigate to `/admin/dashboard`
2. Try wrong password → See error toast
3. Enter correct password (`admin123`) → Access granted

### Scenario 2: View KPI Cards
1. Verify Total Revenue displays correctly
2. Check Completed Orders count
3. Confirm Average Order Value calculates correctly
4. Verify all cards have neon glow effects

### Scenario 3: View Daily Sales
1. Confirm dates are formatted as DD/MM/YYYY
2. Verify orders count and income match totals
3. Test horizontal scroll on mobile
4. Check hover effects on table rows

### Scenario 4: Confirm Sale & Stock Deduction
1. Check products table stock BEFORE confirmation
2. Click "Confirm Sale" on a pending order
3. See success toast notification
4. Verify order removed from pending list
5. Check products table stock AFTER (should be decremented)
6. Verify revenue views updated (KPI cards recalculate)

### Scenario 5: Refresh After Changes
1. Confirm a sale
2. Navigate away and back to dashboard
3. Verify all data persists correctly
4. Check order no longer appears in pending list

---

## Troubleshooting

### Issue: "Failed to load dashboard data"
**Solution:**
1. Verify Supabase credentials in `.env.local`
2. Check that views exist: `total_revenue_view`, `daily_sales_view`
3. Ensure RLS policies allow reading these views
4. Check browser console for specific error messages

### Issue: Data not updating after confirming sale
**Solution:**
1. Verify PostgreSQL trigger `on_order_paid` exists
2. Check that `payment_status` column exists in orders table
3. Ensure trigger has correct permissions
4. Test trigger manually in SQL Editor

### Issue: Password prompt appears repeatedly
**Solution:**
1. Clear browser localStorage: Press F12 → Application → Clear All
2. Try in private/incognito window
3. Verify ADMIN_PASSWORD value in code

### Issue: Neon effects not visible
**Solution:**
1. Check browser support for CSS filters
2. Disable browser dark mode overrides
3. Verify tailwind CSS is properly configured
4. Check for conflicting CSS rules

### Issue: Pending orders not loading
**Solution:**
1. Verify `orders` table has rows with `payment_status = 'n'`
2. Check that `items` column is valid JSONB
3. Ensure RLS policies allow reading orders table
4. Test query manually: `SELECT * FROM orders WHERE payment_status = 'n'`

---

## Advanced Configuration

### Change Admin Password
Edit `src/pages/AdminDashboard.tsx`:
```tsx
// Line ~25
const ADMIN_PASSWORD = 'your_new_secure_password';
```

### Customize Neon Colors
Edit the border and shadow styles in AdminDashboard.tsx. For example:
```tsx
// Change Total Revenue card color
className="bg-neon-dark-gray border-2 border-neon-green rounded-lg p-6"
// Change to:
className="bg-neon-dark-gray border-2 border-neon-purple rounded-lg p-6"
```

### Add More KPI Cards
1. Create new view in Supabase (e.g., `top_products_view`)
2. Add state hook: `const [topProducts, setTopProducts] = useState(null)`
3. Fetch in useEffect: `await supabase.from('top_products_view').select('*')`
4. Create new card component with same styling pattern

### Add Order Filtering
Modify the pending orders query:
```tsx
// Current:
.eq('payment_status', 'n')

// Add date range:
.gte('created_at', '2024-01-01')
.lte('created_at', '2024-12-31')
```

### Add Export Functionality
Extend the component with CSV export:
```tsx
const handleExportSales = () => {
  const csv = dailySales.map(sale => 
    `${sale.sale_date},${sale.orders_count},${sale.daily_income}`
  ).join('\n');
  // Download CSV...
};
```

---

## Performance Notes

### Data Fetching
- Data is fetched once on component mount
- Set `isAuthenticated` dependency in useEffect
- Consider adding polling intervals for real-time updates
- Implement pagination if daily_sales_view becomes large

### Optimization Tips
1. **Add Pagination:** Limit daily_sales_view to last 30 days
2. **Caching:** Store view results in localStorage with timestamp
3. **Debouncing:** Debounce refresh on multiple confirmations
4. **Lazy Loading:** Load order items on demand in a modal

### Production Checklist
- [ ] Change `ADMIN_PASSWORD` to secure value
- [ ] Test with actual Supabase database
- [ ] Verify all views return expected data
- [ ] Test stock deduction workflow end-to-end
- [ ] Check mobile responsiveness
- [ ] Verify neon styling displays correctly
- [ ] Test error states and edge cases
- [ ] Monitor performance with large datasets

---

## File References

- **Component:** [src/pages/AdminDashboard.tsx](src/pages/AdminDashboard.tsx)
- **Route:** [src/App.tsx](src/App.tsx)
- **Database Setup:** [SUPABASE_INVENTORY_SETUP.sql](SUPABASE_INVENTORY_SETUP.sql)
- **Inventory Management Guide:** [INVENTORY_MANAGEMENT_GUIDE.md](INVENTORY_MANAGEMENT_GUIDE.md)

---

## Support

For issues or feature requests:
1. Check the Troubleshooting section above
2. Review browser console for error messages
3. Verify Supabase views and tables with SQL Editor
4. Check [INVENTORY_MANAGEMENT_GUIDE.md](INVENTORY_MANAGEMENT_GUIDE.md) for stock deduction issues
