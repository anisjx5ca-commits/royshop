# 🔐 Admin Dashboard Access Guide

## Quick Access

### Local Development
```
URL: http://localhost:5173/admin/dashboard
Password: admin123
```

### Production (Netlify)
```
URL: https://your-domain.netlify.app/admin/dashboard
Password: [Your custom password - change before deploying!]
```

---

## Login Steps

1. **Navigate to dashboard**
   - Open the URL above in your browser

2. **You'll see the password screen**
   ```
   🔐 ADMIN ACCESS 🔐
   Enter password to continue
   [Password Input]
   [Unlock Dashboard Button]
   ```

3. **Enter password**
   - Default: `admin123`
   - Note: Change this ASAP in production!

4. **Click "Unlock Dashboard"**
   - You'll see the analytics dashboard

5. **View your data**
   - Total Revenue (green neon)
   - Completed Orders (cyan neon)
   - Average Order Value (pink neon)
   - Daily Sales table
   - Pending Orders list

---

## What You Can Do

### View Analytics
✅ Real-time KPI cards
✅ Daily sales breakdown
✅ Order counts and revenue
✅ Average order value

### Manage Orders
✅ See pending orders awaiting confirmation
✅ Click "Confirm Sale & Deduct Stock"
✅ Stock automatically decrements
✅ Revenue views auto-update
✅ See updates in real-time

### Monitor Dashboard
✅ All data updates in real-time
✅ Responsive on mobile/tablet/desktop
✅ Beautiful neon cyberpunk design
✅ Smooth animations and transitions

---

## Security

### Current Security
- Simple password check on entry
- Password: `admin123` (default)
- Only accessible at `/admin/dashboard` route

### Before Production
⚠️ **MUST CHANGE PASSWORD!**

Edit `src/pages/AdminDashboard.tsx` line 25:
```typescript
const ADMIN_PASSWORD = 'your_new_secure_password';
```

Then rebuild and deploy:
```bash
npm run build
git add -A
git commit -m "Update admin password"
git push origin main
```

### Future Security Enhancements
- Integrate with Supabase Auth
- Add role-based access control
- Add session tokens
- Add IP whitelist
- Add audit logging

---

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Go to Dashboard | `Cmd/Ctrl + Shift + A` (Not yet - could add) |
| Exit Dashboard | Click [EXIT] button or navigate away |

---

## Dashboard Overview

### Password Lock Screen
```
╔════════════════════════════════╗
║    🔐 ADMIN ACCESS 🔐         ║
║  Enter password to continue    ║
║                                ║
║  [Password Input with glow]    ║
║                                ║
║  [🔓 UNLOCK DASHBOARD]         ║
║  [↩️ Back to Home]             ║
╚════════════════════════════════╝
```

### Main Dashboard
```
┌─────────────────────────────────┐
│ ADMIN DASHBOARD      [EXIT]     │
├─────────────────────────────────┤
│                                 │
│ [Total Revenue] [Orders] [Avg] │
│                                 │
├─────────────────────────────────┤
│ DAILY SALES TABLE              │
│ Date | Count | Income          │
├─────────────────────────────────┤
│ PENDING ORDERS (with buttons)  │
│ [Confirm Sale] buttons         │
│                                 │
└─────────────────────────────────┘
```

---

## Feature Details

### KPI Cards

#### 1. Total Revenue (💚 Green)
- Shows: Total income from completed orders
- Source: `total_revenue_view`
- Format: DA (Algerian Dinar)
- Example: DA 1,250,000

#### 2. Completed Orders (💙 Cyan)
- Shows: Number of confirmed transactions
- Source: `total_revenue_view`
- Format: Integer count
- Example: 156 orders

#### 3. Average Order Value (🩷 Pink)
- Shows: Revenue per order
- Source: Calculated from above
- Formula: Total Income ÷ Orders
- Format: DA rounded
- Example: DA 8,012

### Daily Sales Table
- **Column 1:** Date (DD/MM/YYYY format)
- **Column 2:** Orders Count (number of orders that day)
- **Column 3:** Income (DA) (total revenue that day)
- Newest dates first
- Hover effects on rows
- Responsive scroll on mobile

### Pending Orders
- Shows all orders with `payment_status = 'n'`
- Card layout with:
  - Order ID (first 12 chars)
  - Customer email
  - Item count
  - Total amount (DA)
  - [Confirm Sale] button
- Click button to:
  - Mark payment as confirmed
  - Auto-decrement stock
  - Update KPI cards
  - Remove from pending list

---

## Common Tasks

### Confirm a Sale
1. Find order in "Pending Orders"
2. Click green [Confirm Sale & Deduct Stock] button
3. See success toast notification
4. Order disappears from pending list
5. KPI cards update
6. Sales table updates
7. Stock auto-decrements in products table

### Check Daily Revenue
1. Look at "Daily Sales" table
2. Dates are formatted as DD/MM/YYYY
3. See order count and income per day
4. Click exit to go back to home

### View Statistics
1. Check three KPI cards at top
2. Total Revenue - all income
3. Completed Orders - total orders
4. Average Order Value - per-order average
5. All update in real-time

---

## Troubleshooting

### Can't Access Dashboard
**Issue:** Error loading page
**Solution:**
1. Check URL is correct: `/admin/dashboard`
2. Verify you're logged in to admin
3. Clear browser cache (Ctrl+Shift+Delete)
4. Try in private/incognito window

### Wrong Password
**Issue:** "Incorrect password" message
**Solution:**
1. Try default: `admin123`
2. If changed, check `src/pages/AdminDashboard.tsx` line 25
3. Clear localStorage: F12 → Application → Clear All
4. Reload page

### Data Not Loading
**Issue:** "Failed to load dashboard data"
**Solution:**
1. Check Supabase credentials in `.env.local`
2. Verify views exist:
   - `total_revenue_view`
   - `daily_sales_view`
3. Check RLS policies allow reading
4. Open browser console (F12) for error details

### Stock Not Decreasing
**Issue:** Confirmed order but stock didn't decrease
**Solution:**
1. Verify PostgreSQL trigger exists: `on_order_paid`
2. Check trigger has correct permissions
3. Run in SQL Editor:
   ```sql
   SELECT * FROM orders WHERE payment_status = 'y';
   SELECT * FROM products WHERE stock IS NOT NULL;
   ```
4. See [INVENTORY_MANAGEMENT_GUIDE.md](INVENTORY_MANAGEMENT_GUIDE.md)

### Neon Effects Not Showing
**Issue:** Cards look flat, no glowing
**Solution:**
1. Disable browser dark mode
2. Check browser supports CSS filters
3. Update browser to latest version
4. Clear browser cache

---

## File References

### Main Component
- [src/pages/AdminDashboard.tsx](src/pages/AdminDashboard.tsx) - The dashboard component (850 lines)

### Documentation
- [ADMIN_DASHBOARD_QUICK_START.md](ADMIN_DASHBOARD_QUICK_START.md) - 3-step setup
- [src/ADMIN_DASHBOARD_GUIDE.md](src/ADMIN_DASHBOARD_GUIDE.md) - Complete guide (500+ lines)
- [ADMIN_DASHBOARD_VISUAL_OVERVIEW.md](ADMIN_DASHBOARD_VISUAL_OVERVIEW.md) - Diagrams and architecture
- [ADMIN_DASHBOARD_COMPLETE_SUMMARY.md](ADMIN_DASHBOARD_COMPLETE_SUMMARY.md) - Full summary

### Integration
- [src/App.tsx](src/App.tsx) - Route added: `/admin/dashboard`

### Related Systems
- [SUPABASE_INVENTORY_SETUP.sql](SUPABASE_INVENTORY_SETUP.sql) - Stock deduction setup
- [INVENTORY_MANAGEMENT_GUIDE.md](INVENTORY_MANAGEMENT_GUIDE.md) - Inventory system details

---

## Testing Checklist

- [ ] Navigate to `/admin/dashboard`
- [ ] See password prompt
- [ ] Enter password `admin123`
- [ ] Unlock button works
- [ ] Dashboard loads
- [ ] KPI cards show data
- [ ] Daily sales table displays
- [ ] Pending orders list shows
- [ ] Can see confirm buttons
- [ ] Click confirm - order disappears
- [ ] Toast shows "Sale confirmed"
- [ ] Stock decrements automatically
- [ ] KPI cards update
- [ ] Sales table updates
- [ ] No console errors

---

## Support

**For issues:**
1. Check troubleshooting section above
2. Review browser console (F12)
3. Check [ADMIN_DASHBOARD_GUIDE.md](src/ADMIN_DASHBOARD_GUIDE.md)
4. Verify database views and tables
5. Check Supabase logs

---

## Summary

✅ Dashboard is **LIVE and READY**
✅ Access at: `/admin/dashboard`
✅ Default password: `admin123`
✅ Change password before production!
✅ Full documentation provided
✅ All features working
✅ Stock deduction integrated
✅ Real-time updates enabled

**Happy selling! 🎉**
