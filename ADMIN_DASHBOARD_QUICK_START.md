# Admin Dashboard - Quick Start

## 3-Step Setup

### Step 1: Access Dashboard
Navigate to: `http://localhost:5173/admin/dashboard` (or your Netlify domain)

### Step 2: Enter Password
Default password: **`admin123`**
- Change this in `src/pages/AdminDashboard.tsx` line 25

### Step 3: View Your Data
✅ See KPI cards with Total Revenue, Completed Orders, Average Order Value
✅ View daily sales from `daily_sales_view`
✅ Manage pending orders and confirm sales

---

## What It Does

### Real-Time Analytics
- **Total Revenue:** Sum of all completed order amounts
- **Completed Orders:** Count of confirmed transactions
- **Average Order Value:** Auto-calculated per order
- **Daily Sales:** Breakdown by date with order count and income

### Order Management
- **View Pending Orders:** All orders awaiting payment confirmation
- **Confirm Sale:** Click button to mark payment as confirmed
- **Auto Stock Deduction:** Inventory automatically decrements
- **Live Updates:** KPI cards and sales table refresh instantly

### Neon Design
- Pink, cyan, and green glowing cards
- Cyberpunk grid background
- Animated transitions and hover effects
- Mobile-responsive layout

---

## Quick Test

### Test Data Confirmation
1. Create test order in Supabase (or use existing)
2. Verify it appears in "Pending Orders" section
3. Click "Confirm Sale & Deduct Stock"
4. Watch:
   - Order disappears from pending list ✓
   - KPI cards update ✓
   - Daily sales table updates ✓
   - Stock decrements in products table ✓

### Verify Stock Deduction
Before confirmation:
```sql
SELECT id, stock FROM products WHERE id = 'test-product-id';
-- Result: stock = 10
```

After confirmation:
```sql
SELECT id, stock FROM products WHERE id = 'test-product-id';
-- Result: stock = 9 (decreased by 1)
```

---

## Key Features

| Feature | Details |
|---------|---------|
| **Password Protection** | Simple hardcoded check on entry |
| **KPI Cards** | 3 metrics with individual neon colors |
| **Sales Table** | Daily breakdown with date formatting |
| **Pending Orders** | Card-based list with quick actions |
| **Auto-Refresh** | Data updates after confirmations |
| **Neon Styling** | Pink, cyan, green glowing effects |
| **Mobile Responsive** | Works on phones, tablets, desktops |

---

## How Stock Deduction Works

```
1. Pending Order Exists
   └─ payment_status = 'n'

2. You Click "Confirm Sale"
   └─ Updates payment_status = 'y'

3. PostgreSQL Trigger Activates
   └─ on_order_paid() function runs automatically

4. Function Loops Through Items
   └─ Extracts product_id and quantity from JSONB array

5. Stock Gets Decremented
   └─ products.stock = products.stock - quantity

6. Dashboard Auto-Refreshes
   └─ Shows updated KPIs and daily sales
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Failed to load" error | Check Supabase views exist and credentials are correct |
| No pending orders show | Verify `payment_status = 'n'` orders exist in database |
| Stock doesn't decrease | Check PostgreSQL trigger exists and fires correctly |
| Data doesn't update | Try refresh page, clear cache, or check browser console |
| Wrong password constantly | Clear localStorage: F12 → Application → Clear All |

---

## Files

- **Component:** `src/pages/AdminDashboard.tsx`
- **Route added to:** `src/App.tsx`
- **Full guide:** `ADMIN_DASHBOARD_GUIDE.md`
- **Inventory setup:** `SUPABASE_INVENTORY_SETUP.sql`

---

## Next Steps

1. ✅ Component is created and integrated
2. ⏳ Verify your Supabase views exist:
   - `total_revenue_view`
   - `daily_sales_view`
3. ⏳ Test with a pending order
4. ⏳ Change admin password to something secure
5. ⏳ Deploy to Netlify

Access URL on live site: `https://your-domain.netlify.app/admin/dashboard`
