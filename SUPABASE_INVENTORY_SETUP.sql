-- ============================================================================
-- SUPABASE INVENTORY MANAGEMENT SCHEMA UPDATE
-- ============================================================================
-- Purpose: Auto-decrement product stock when order payment is confirmed
-- Date: December 30, 2025
-- ============================================================================

-- ============================================================================
-- STEP 1: Add payment_status column to orders table
-- ============================================================================
-- Add new column with default value 'pending'
-- This column tracks payment confirmation status

ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending';

-- Add comment for clarity
COMMENT ON COLUMN orders.payment_status IS 
'Payment status: pending, y (confirmed), n (failed/cancelled)';

-- ============================================================================
-- STEP 2: Create the auto-decrement function
-- ============================================================================
-- This function loops through order items and decrements product stock
-- Only executes when payment_status transitions from non-'y' to 'y'

CREATE OR REPLACE FUNCTION on_order_paid()
RETURNS TRIGGER AS $$
DECLARE
  item JSONB;
  product_id TEXT;
  quantity INTEGER;
BEGIN
  -- Check: Only process if payment status changed to 'y' (confirmed)
  -- and was NOT previously 'y' (prevents double deduction)
  IF NEW.payment_status = 'y' AND OLD.payment_status != 'y' THEN
    
    -- Loop through each item in the items JSONB array
    FOR item IN SELECT jsonb_array_elements(NEW.items)
    LOOP
      -- Extract product ID from the item JSON
      product_id := item->>'id';
      
      -- Extract quantity and convert to INTEGER
      quantity := (item->>'quantity')::INTEGER;
      
      -- Validate we have both required fields
      IF product_id IS NOT NULL AND quantity IS NOT NULL THEN
        -- UPDATE: Decrement stock in products table
        UPDATE products 
        SET stock = stock - quantity 
        WHERE id = product_id
        AND stock >= quantity;  -- Only deduct if sufficient stock
        
        -- Log successful deduction (optional)
        RAISE NOTICE 'Decremented stock for product % by %', product_id, quantity;
      END IF;
    END LOOP;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- STEP 3: Drop existing trigger (if any)
-- ============================================================================
-- Safe approach: Drop trigger before creating to avoid conflicts

DROP TRIGGER IF EXISTS on_order_paid ON orders;

-- ============================================================================
-- STEP 4: Create the trigger
-- ============================================================================
-- Trigger Name: on_order_paid
-- Event: AFTER UPDATE on orders table
-- Timing: For each row that is updated

CREATE TRIGGER on_order_paid
AFTER UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION on_order_paid();

-- ============================================================================
-- OPTIONAL: Create index on payment_status for faster queries
-- ============================================================================
-- This speeds up queries filtering by payment status

CREATE INDEX IF NOT EXISTS idx_orders_payment_status 
ON orders(payment_status);

-- ============================================================================
-- VERIFICATION SCRIPT (run these to test)
-- ============================================================================

-- Check 1: Verify column was added
-- SELECT column_name, data_type, column_default 
-- FROM information_schema.columns 
-- WHERE table_name = 'orders' AND column_name = 'payment_status';

-- Check 2: Verify trigger exists
-- SELECT trigger_name, event_manipulation, event_object_table
-- FROM information_schema.triggers
-- WHERE trigger_name = 'on_order_paid';

-- Check 3: Verify function exists
-- SELECT routine_name, routine_type
-- FROM information_schema.routines
-- WHERE routine_name = 'on_order_paid';

-- ============================================================================
-- TEST SCENARIO
-- ============================================================================

-- Example 1: Create a test order with payment_status 'pending'
-- INSERT INTO orders (
--   customer_name, phone_number, wilaya, baladiya, exact_address,
--   items, total_price, shipping_cost, payment_status
-- ) VALUES (
--   'Test Customer',
--   '0123456789',
--   'Algiers',
--   'Sidi Bel Abbes',
--   'Test Address',
--   '[{"id": "prod-1", "quantity": 2, "name": "Shirt"}]'::jsonb,
--   5000,
--   500,
--   'pending'
-- );

-- Example 2: Confirm payment (trigger will automatically deduct stock)
-- UPDATE orders 
-- SET payment_status = 'y' 
-- WHERE id = 'your-order-id';

-- Example 3: Verify stock was deducted
-- SELECT id, name, stock FROM products WHERE id = 'prod-1';
-- (stock should be reduced by 2)

-- ============================================================================
-- NOTES
-- ============================================================================
-- 1. The trigger prevents double deduction by checking:
--    - NEW.payment_status = 'y' (payment confirmed)
--    - OLD.payment_status != 'y' (wasn't previously confirmed)
--
-- 2. The function safely extracts JSONB data:
--    - item->>'id' extracts as TEXT
--    - (item->>'quantity')::INTEGER converts to number
--
-- 3. Stock deduction only happens if sufficient stock exists:
--    - WHERE stock >= quantity prevents negative stock
--
-- 4. Use payment_status values:
--    - 'pending': Payment not yet confirmed
--    - 'y': Payment confirmed, stock decremented
--    - 'n': Payment failed/cancelled
--
-- 5. To CANCEL an order (reverse the deduction):
--    - Create another trigger for payment_status changes to 'n'
--    - Use stock = stock + quantity instead
-- ============================================================================
