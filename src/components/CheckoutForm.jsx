/**
 * Checkout Form Component
 * 
 * Comprehensive checkout form with:
 * - Wilaya selection with dynamic shipping cost calculation
 * - Anti-fraud validation (phone number, spam protection)
 * - Order submission to Supabase
 * - Verified purchase system (review access control)
 * 
 * Features:
 * 1. Fetches wilayas from Supabase database
 * 2. Validates Algerian phone numbers (05/06/07, 10 digits)
 * 3. Implements 5-minute cooldown for spam prevention
 * 4. Stores order data in Supabase orders table
 * 5. Displays user-friendly error messages
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useCartStore } from '../store/CartStore.js';
import { fetchWilayas, getShippingCost, createOrder } from '../lib/supabaseClient.js';

const CheckoutForm = () => {
  // Form state
  const [formData, setFormData] = useState({
    customerName: '',
    phoneNumber: '',
    wilaya: '',
    baladiya: '',
    exactAddress: '',
  });

  // UI and validation state
  const [wilayas, setWilayas] = useState([]);
  const [shippingCost, setShippingCost] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Cart state
  const cartItems = useCartStore((state) => state.getItems());
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const clearCart = useCartStore((state) => state.clearCart);

  /**
   * Load wilayas from Supabase on component mount
   */
  useEffect(() => {
    const loadWilayas = async () => {
      setIsLoading(true);
      try {
        const wilayaData = await fetchWilayas();
        setWilayas(wilayaData);
      } catch (err) {
        console.error('Failed to load wilayas:', err);
        toast.error('Failed to load delivery locations');
      } finally {
        setIsLoading(false);
      }
    };
    loadWilayas();
  }, []);

  /**
   * Update shipping cost when wilaya is selected
   */
  useEffect(() => {
    const updateShippingCost = async () => {
      if (!formData.wilaya) {
        setShippingCost(0);
        return;
      }

      try {
        const cost = await getShippingCost(formData.wilaya);
        setShippingCost(cost || 0);
      } catch (err) {
        console.error('Failed to get shipping cost:', err);
        toast.error('Failed to calculate shipping cost');
      }
    };

    updateShippingCost();
  }, [formData.wilaya]);

  /**
   * Validate Algerian phone number
   * Format: Must start with 05, 06, or 07 and be exactly 10 digits
   * Example: 0561234567
   * @param {string} phone - Phone number to validate
   * @returns {boolean} True if valid, false otherwise
   */
  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^(05|06|07)\d{8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  /**
   * Check if user has submitted an order recently (spam protection)
   * Uses localStorage with 5-minute cooldown
   * @returns {boolean} True if user can submit, false if on cooldown
   */
  const canSubmitOrder = () => {
    const lastOrderTime = localStorage.getItem('royshop_last_order_time');
    if (!lastOrderTime) return true;

    const timeSinceLastOrder = Date.now() - parseInt(lastOrderTime);
    const fiveMinutesMs = 5 * 60 * 1000;

    return timeSinceLastOrder >= fiveMinutesMs;
  };

  /**
   * Get remaining cooldown time in seconds
   * @returns {number} Seconds remaining (0 if can submit)
   */
  const getCooldownRemaining = () => {
    const lastOrderTime = localStorage.getItem('royshop_last_order_time');
    if (!lastOrderTime) return 0;

    const timeSinceLastOrder = Date.now() - parseInt(lastOrderTime);
    const fiveMinutesMs = 5 * 60 * 1000;
    const remaining = fiveMinutesMs - timeSinceLastOrder;

    return Math.ceil(remaining / 1000);
  };

  /**
   * Validate entire form
   * @returns {Object} Object with error field names as keys
   */
  const validateForm = () => {
    const newErrors = {};

    // Check empty fields
    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Name is required';
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!validatePhoneNumber(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Invalid phone format. Must start with 05/06/07 and be 10 digits';
    }
    if (!formData.wilaya) {
      newErrors.wilaya = 'Province is required';
    }
    if (!formData.baladiya.trim()) {
      newErrors.baladiya = 'City/Municipality is required';
    }
    if (!formData.exactAddress.trim()) {
      newErrors.exactAddress = 'Delivery address is required';
    }

    // Check cart is not empty
    if (cartItems.length === 0) {
      newErrors.cart = 'Cart is empty. Please add items before checkout';
    }

    // Check spam protection
    if (!canSubmitOrder()) {
      const remaining = getCooldownRemaining();
      newErrors.spam = `Please wait ${remaining} seconds before placing another order`;
    }

    return newErrors;
  };

  /**
   * Handle form input change
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field on change
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  /**
   * Handle form submission
   * Validates form, creates order in Supabase, shows confirmation
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      if (formErrors.phoneNumber) {
        toast.error(formErrors.phoneNumber);
      } else if (formErrors.spam) {
        toast.error(formErrors.spam);
      } else {
        toast.error('Please fill all required fields');
      }
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare order data
      const orderData = {
        customer_name: formData.customerName.trim(),
        phone_number: formData.phoneNumber.trim(),
        wilaya: formData.wilaya,
        baladiya: formData.baladiya.trim(),
        exact_address: formData.exactAddress.trim(),
        items: cartItems, // Cart items as JSON array for JSONB column
        total_price: getTotalPrice(),
        shipping_cost: shippingCost,
      };

      // Submit to Supabase
      const createdOrder = await createOrder(orderData);

      // Set spam cooldown
      localStorage.setItem('royshop_last_order_time', Date.now().toString());

      // Clear cart after successful order
      clearCart();

      // Show success message
      toast.success(`Order placed successfully! Order ID: ${createdOrder.id}`);

      // Reset form
      setFormData({
        customerName: '',
        phoneNumber: '',
        wilaya: '',
        baladiya: '',
        exactAddress: '',
      });

      // Redirect to success page after brief delay
      setTimeout(() => {
        window.location.href = `/success?orderId=${createdOrder.id}`;
      }, 1500);
    } catch (err) {
      console.error('Error submitting order:', err);
      toast.error(err.message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg"
    >
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Checkout</h2>

      {/* Order Summary */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Order Summary</h3>
        <div className="space-y-2">
          <p className="flex justify-between text-gray-600">
            <span>Items:</span>
            <span className="font-semibold">{cartItems.length} item(s)</span>
          </p>
          <p className="flex justify-between text-gray-600">
            <span>Subtotal:</span>
            <span className="font-semibold">{getTotalPrice().toLocaleString()} DA</span>
          </p>
          <p className="flex justify-between text-gray-600">
            <span>Shipping:</span>
            <span className="font-semibold">{shippingCost.toLocaleString()} DA</span>
          </p>
          <div className="border-t pt-2 mt-2">
            <p className="flex justify-between text-lg font-bold text-gray-800">
              <span>Total:</span>
              <span className="text-orange-600">
                {(getTotalPrice() + shippingCost).toLocaleString()} DA
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Checkout Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Name */}
        <div>
          <label htmlFor="customerName" className="block text-sm font-semibold text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            id="customerName"
            name="customerName"
            value={formData.customerName}
            onChange={handleInputChange}
            placeholder="e.g., Ahmed Ben Ali"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition ${
              errors.customerName ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isSubmitting}
          />
          {errors.customerName && (
            <p className="mt-1 text-sm text-red-500">{errors.customerName}</p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-semibold text-gray-700 mb-2">
            Phone Number *
            <span className="block text-xs font-normal text-gray-500 mt-1">
              Format: 05/06/07 followed by 8 digits (e.g., 0561234567)
            </span>
          </label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            placeholder="e.g., 0561234567"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition ${
              errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isSubmitting}
          />
          {errors.phoneNumber && (
            <p className="mt-1 text-sm text-red-500">{errors.phoneNumber}</p>
          )}
        </div>

        {/* Wilaya (Province) */}
        <div>
          <label htmlFor="wilaya" className="block text-sm font-semibold text-gray-700 mb-2">
            Province (Wilaya) *
          </label>
          <select
            id="wilaya"
            name="wilaya"
            value={formData.wilaya}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition ${
              errors.wilaya ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isLoading || isSubmitting}
          >
            <option value="">
              {isLoading ? 'Loading provinces...' : 'Select your province'}
            </option>
            {wilayas.map((wilaya) => (
              <option key={wilaya.id} value={wilaya.name_ar}>
                {wilaya.name_ar} ({wilaya.shipping_cost} DA shipping)
              </option>
            ))}
          </select>
          {errors.wilaya && (
            <p className="mt-1 text-sm text-red-500">{errors.wilaya}</p>
          )}
        </div>

        {/* Baladiya (City/Municipality) */}
        <div>
          <label htmlFor="baladiya" className="block text-sm font-semibold text-gray-700 mb-2">
            City / Municipality *
          </label>
          <input
            type="text"
            id="baladiya"
            name="baladiya"
            value={formData.baladiya}
            onChange={handleInputChange}
            placeholder="e.g., El Biar, Ben Aknoun"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition ${
              errors.baladiya ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isSubmitting}
          />
          {errors.baladiya && (
            <p className="mt-1 text-sm text-red-500">{errors.baladiya}</p>
          )}
        </div>

        {/* Exact Address */}
        <div>
          <label htmlFor="exactAddress" className="block text-sm font-semibold text-gray-700 mb-2">
            Delivery Address *
          </label>
          <textarea
            id="exactAddress"
            name="exactAddress"
            value={formData.exactAddress}
            onChange={handleInputChange}
            placeholder="Enter complete delivery address with building/apartment number"
            rows="3"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition resize-none ${
              errors.exactAddress ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isSubmitting}
          />
          {errors.exactAddress && (
            <p className="mt-1 text-sm text-red-500">{errors.exactAddress}</p>
          )}
        </div>

        {/* Error Messages */}
        {errors.spam && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700"
          >
            ⏱️ {errors.spam}
          </motion.div>
        )}
        {errors.cart && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700"
          >
            ⚠️ {errors.cart}
          </motion.div>
        )}

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isSubmitting || isLoading || cartItems.length === 0}
          whileHover={{ scale: isSubmitting || isLoading ? 1 : 1.02 }}
          whileTap={{ scale: isSubmitting || isLoading ? 1 : 0.98 }}
          className={`w-full py-3 rounded-lg font-semibold text-white transition duration-300 ${
            isSubmitting || isLoading || cartItems.length === 0
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-orange-600 hover:bg-orange-700 active:bg-orange-800'
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Processing...
            </div>
          ) : cartItems.length === 0 ? (
            'Cart is Empty'
          ) : (
            `Place Order - ${(getTotalPrice() + shippingCost).toLocaleString()} DA`
          )}
        </motion.button>

        {/* Security Note */}
        <p className="text-xs text-gray-500 text-center">
          🔒 Your payment information is secure. You will be contacted via WhatsApp to confirm payment.
        </p>
      </form>
    </motion.div>
  );
};

export default CheckoutForm;
