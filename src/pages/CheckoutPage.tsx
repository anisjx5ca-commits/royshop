import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore.ts';
import { createOrder } from '../lib/supabase.ts';
import toast from 'react-hot-toast';

// Algerian Wilayas and their shipping costs
const ALGERIAN_WILAYAS = [
  { name: 'Adrar', shipping: 800 },
  { name: 'Chlef', shipping: 600 },
  { name: 'Laghouat', shipping: 700 },
  { name: 'Oum El Bouaghi', shipping: 550 },
  { name: 'Batna', shipping: 600 },
  { name: 'Béjaïa', shipping: 500 },
  { name: 'Biskra', shipping: 650 },
  { name: 'Béchar', shipping: 900 },
  { name: 'Blida', shipping: 400 },
  { name: 'Bouïra', shipping: 450 },
  { name: 'Tamanrasset', shipping: 1200 },
  { name: 'Tébessa', shipping: 650 },
  { name: 'Tlemcen', shipping: 550 },
  { name: 'Tiaret', shipping: 550 },
  { name: 'Tizi Ouzou', shipping: 500 },
  { name: 'Alger', shipping: 300 },
  { name: 'Djelfa', shipping: 600 },
  { name: 'Jijel', shipping: 500 },
  { name: 'Sétif', shipping: 550 },
  { name: 'Saïda', shipping: 600 },
  { name: 'Skikda', shipping: 500 },
  { name: 'Sidi Bel Abbès', shipping: 600 },
  { name: 'Annaba', shipping: 550 },
  { name: 'Guelma', shipping: 600 },
  { name: 'Constantine', shipping: 550 },
  { name: 'Médéa', shipping: 450 },
  { name: 'Mostaghanem', shipping: 500 },
  { name: 'M\'Sila', shipping: 650 },
  { name: 'Mascara', shipping: 600 },
  { name: 'Ouargla', shipping: 900 },
  { name: 'Oran', shipping: 500 },
  { name: 'El Bayadh', shipping: 700 },
  { name: 'Illizi', shipping: 1300 },
  { name: 'Bordj Bou Arréridj', shipping: 550 },
  { name: 'Boumerdès', shipping: 350 },
  { name: 'El Tarf', shipping: 650 },
  { name: 'Tindouf', shipping: 1100 },
  { name: 'Tissemsilt', shipping: 600 },
  { name: 'El Oued', shipping: 800 },
  { name: 'Khenchela', shipping: 700 },
  { name: 'Souk Ahras', shipping: 650 },
  { name: 'Tipaza', shipping: 400 },
  { name: 'Mila', shipping: 600 },
  { name: 'Aïn Defla', shipping: 500 },
  { name: 'Naâma', shipping: 750 },
  { name: 'Aïn Témouchent', shipping: 550 },
  { name: 'Ghardaïa', shipping: 1000 },
  { name: 'Relizane', shipping: 600 },
];

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, clearCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    wilaya: ALGERIAN_WILAYAS[15].name, // Default to Alger
    baladiya: '',
    address: '',
  });

  const [phoneValidation, setPhoneValidation] = useState<'valid' | 'invalid' | 'empty'>('empty');

  // Validate Algerian phone numbers (05/06/07 + 8 digits)
  const validatePhone = (phone: string) => {
    if (!phone) {
      setPhoneValidation('empty');
      return;
    }
    const algerianPhoneRegex = /^(05|06|07)\d{8}$/;
    setPhoneValidation(algerianPhoneRegex.test(phone) ? 'valid' : 'invalid');
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phone = e.target.value;
    setFormData({ ...formData, phone });
    validatePhone(phone);
  };

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const selectedWilaya = ALGERIAN_WILAYAS.find((w) => w.name === formData.wilaya);
  const shipping = selectedWilaya?.shipping || 0;
  const total = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    if (!formData.fullName.trim()) {
      toast.error('Please enter your full name');
      return;
    }
    if (phoneValidation !== 'valid') {
      toast.error('Please enter a valid Algerian phone number (05/06/07...)');
      return;
    }
    if (!formData.baladiya.trim()) {
      toast.error('Please enter your city');
      return;
    }
    if (!formData.address.trim()) {
      toast.error('Please enter your address');
      return;
    }
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setIsLoading(true);

    try {
      // Create order in database
      await createOrder({
        customer_name: formData.fullName,
        phone_number: formData.phone,
        wilaya: formData.wilaya,
        baladiya: formData.baladiya,
        exact_address: formData.address,
        total_price: total,
        shipping_cost: shipping,
        items: items,
      });

      // Clear cart and redirect to success page
      clearCart();
      toast.success('Order placed successfully!');

      setTimeout(() => {
        navigate('/success', {
          state: {
            orderData: {
              name: formData.fullName,
              phone: formData.phone,
              wilaya: formData.wilaya,
              baladiya: formData.baladiya,
              address: formData.address,
              total: total,
              shipping: shipping,
              itemsCount: items.length,
            },
          },
        });
      }, 500);
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to create order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && !isLoading) {
      toast.error('Your cart is empty');
      setTimeout(() => navigate('/shop'), 1000);
    }
  }, [items, isLoading, navigate]);

  return (
    <div className="min-h-screen bg-neon-black text-neon-white overflow-hidden relative pt-20">
      {/* Cyberpunk Grid Background */}
      <div className="fixed inset-0 opacity-15 pointer-events-none z-0">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="checkout-grid" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00D9FF" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#FF006E" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          <g stroke="url(#checkout-grid)" strokeWidth="0.5" opacity="0.3">
            {Array.from({ length: 16 }).map((_, i) => (
              <g key={i}>
                <line x1={`${i * 6.25}%`} y1="0%" x2={`${i * 6.25}%`} y2="100%" />
                <line x1="0%" y1={`${i * 6.25}%`} x2="100%" y2={`${i * 6.25}%`} />
              </g>
            ))}
          </g>
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            <h1
              className="text-6xl font-black mb-4"
              style={{
                textShadow: '0 0 40px #00D9FF, 0 0 80px #FF006E',
                background: 'linear-gradient(135deg, #00D9FF 0%, #FF006E 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Complete Your Order
            </h1>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Form Section */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-2"
            >
              <form
                onSubmit={handleSubmit}
                className="p-8 rounded-2xl"
                style={{
                  border: '3px solid #00D9FF',
                  background: 'rgba(10, 14, 39, 0.7)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 0 40px rgba(0, 217, 255, 0.3)',
                }}
              >
                <h2
                  className="text-3xl font-bold mb-8"
                  style={{
                    textShadow: '0 0 20px #00D9FF',
                    color: '#00D9FF',
                  }}
                >
                  Delivery Information
                </h2>

                {/* Wilaya - FIRST */}
                <div className="mb-6">
                  <label
                    className="block text-sm font-bold mb-2"
                    style={{ color: '#FF006E', textShadow: '0 0 10px #FF006E' }}
                  >
                    Wilaya (Province) - Select First to See Shipping Cost
                  </label>
                  <select
                    value={formData.wilaya}
                    onChange={(e) => setFormData({ ...formData, wilaya: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg transition-all duration-300 text-neon-white"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '2px solid #666666',
                      boxShadow: '0 0 0 0 rgba(0, 217, 255, 0)',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#00D9FF';
                      e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 217, 255, 0.5)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#666666';
                      e.currentTarget.style.boxShadow = '0 0 0 0 rgba(0, 217, 255, 0)';
                    }}
                  >
                    {ALGERIAN_WILAYAS.map((wilaya) => (
                      <option key={wilaya.name} value={wilaya.name} style={{ background: '#0a0e27', color: '#ffffff' }}>
                        {wilaya.name} - Shipping: {wilaya.shipping} DA
                      </option>
                    ))}
                  </select>
                </div>

                {/* Full Name */}
                <div className="mb-6">
                  <label
                    className="block text-sm font-bold mb-2"
                    style={{ color: '#FF006E', textShadow: '0 0 10px #FF006E' }}
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Your full name"
                    className="w-full px-4 py-3 rounded-lg transition-all duration-300 text-neon-white placeholder-gray-500"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '2px solid #666666',
                      boxShadow: '0 0 0 0 rgba(0, 217, 255, 0)',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#00D9FF';
                      e.target.style.boxShadow = '0 0 20px rgba(0, 217, 255, 0.5)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#666666';
                      e.target.style.boxShadow = '0 0 0 0 rgba(0, 217, 255, 0)';
                    }}
                  />
                </div>

                {/* Phone Number */}
                <div className="mb-6">
                  <label
                    className="block text-sm font-bold mb-2"
                    style={{ color: '#FF006E', textShadow: '0 0 10px #FF006E' }}
                  >
                    Phone Number {phoneValidation === 'valid' && <span style={{ color: '#00FF41' }}>✓</span>}
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    placeholder="05/06/07 XXXXXXXX (Algerian format)"
                    className="w-full px-4 py-3 rounded-lg transition-all duration-300 text-neon-white placeholder-gray-500"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border:
                        phoneValidation === 'valid'
                          ? '2px solid #00FF41'
                          : phoneValidation === 'invalid'
                            ? '2px solid #FF0000'
                            : '2px solid #666666',
                      boxShadow:
                        phoneValidation === 'valid'
                          ? '0 0 20px rgba(0, 255, 65, 0.5)'
                          : phoneValidation === 'invalid'
                            ? '0 0 20px rgba(255, 0, 0, 0.5)'
                            : '0 0 0 0 rgba(0, 217, 255, 0)',
                    }}
                    onFocus={(e) => {
                      if (phoneValidation === 'empty') {
                        e.target.style.borderColor = '#00D9FF';
                        e.target.style.boxShadow = '0 0 20px rgba(0, 217, 255, 0.5)';
                      }
                    }}
                    onBlur={(e) => {
                      if (phoneValidation === 'empty') {
                        e.target.style.borderColor = '#666666';
                        e.target.style.boxShadow = '0 0 0 0 rgba(0, 217, 255, 0)';
                      }
                    }}
                  />
                  {phoneValidation === 'invalid' && (
                    <p className="text-red-400 text-xs mt-1">Please enter a valid Algerian phone number (05/06/07 + 8 digits)</p>
                  )}
                </div>

                {/* Baladiya / City */}
                <div className="mb-6">
                  <label
                    className="block text-sm font-bold mb-2"
                    style={{ color: '#FF006E', textShadow: '0 0 10px #FF006E' }}
                  >
                    City / Baladiya
                  </label>
                  <input
                    type="text"
                    value={formData.baladiya}
                    onChange={(e) => setFormData({ ...formData, baladiya: e.target.value })}
                    placeholder="Your city"
                    className="w-full px-4 py-3 rounded-lg transition-all duration-300 text-neon-white placeholder-gray-500"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '2px solid #666666',
                      boxShadow: '0 0 0 0 rgba(0, 217, 255, 0)',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#00D9FF';
                      e.target.style.boxShadow = '0 0 20px rgba(0, 217, 255, 0.5)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#666666';
                      e.target.style.boxShadow = '0 0 0 0 rgba(0, 217, 255, 0)';
                    }}
                  />
                </div>

                {/* Address */}
                <div className="mb-8">
                  <label
                    className="block text-sm font-bold mb-2"
                    style={{ color: '#FF006E', textShadow: '0 0 10px #FF006E' }}
                  >
                    Exact Address
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Street address, building number, apartment, etc."
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg transition-all duration-300 text-neon-white placeholder-gray-500 resize-none"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '2px solid #666666',
                      boxShadow: '0 0 0 0 rgba(0, 217, 255, 0)',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#00D9FF';
                      e.target.style.boxShadow = '0 0 20px rgba(0, 217, 255, 0.5)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#666666';
                      e.target.style.boxShadow = '0 0 0 0 rgba(0, 217, 255, 0)';
                    }}
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-5 font-black text-xl rounded-xl transition-all duration-300"
                  style={{
                    border: '3px solid #FF006E',
                    background: isLoading
                      ? 'linear-gradient(135deg, rgba(255, 0, 110, 0.2), rgba(0, 217, 255, 0.1))'
                      : 'linear-gradient(135deg, rgba(255, 0, 110, 0.3), rgba(0, 217, 255, 0.15))',
                    color: '#FF006E',
                    boxShadow: isLoading
                      ? '0 0 40px #FF006E, 0 0 80px #00D9FF'
                      : '0 0 25px rgba(255, 0, 110, 0.4)',
                    opacity: isLoading ? 0.8 : 1,
                  }}
                >
                  {isLoading ? (
                    <motion.span
                      animate={{ opacity: [1, 0.6, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      Processing Order...
                    </motion.span>
                  ) : (
                    <>
                      ✓ Confirm Order - {total.toFixed(2)} DA
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div
                className="sticky top-24 p-8 rounded-2xl"
                style={{
                  border: '3px solid #FF006E',
                  background: 'rgba(10, 14, 39, 0.7)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 0 40px rgba(255, 0, 110, 0.3)',
                }}
              >
                <h3
                  className="text-2xl font-black mb-6"
                  style={{
                    textShadow: '0 0 20px #FF006E',
                    color: '#FF006E',
                  }}
                >
                  Order Review
                </h3>

                {/* Items Summary */}
                <div className="space-y-3 mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span style={{ color: '#00D9FF' }}>
                        {item.name} x{item.quantity}
                      </span>
                      <span
                        style={{
                          color: '#FF006E',
                          textShadow: '0 0 10px #FF006E',
                        }}
                      >
                        {(item.price * item.quantity).toFixed(2)} DA
                      </span>
                    </div>
                  ))}
                </div>

                {/* Divider */}
                <div
                  className="my-4 h-[1px]"
                  style={{
                    background: 'linear-gradient(90deg, #FF006E 0%, transparent 50%, #00D9FF 100%)',
                  }}
                />

                {/* Subtotal */}
                <div className="flex justify-between mb-3">
                  <span style={{ color: '#00D9FF' }}>Subtotal</span>
                  <span
                    style={{
                      color: '#00D9FF',
                      textShadow: '0 0 15px #00D9FF',
                    }}
                  >
                    {subtotal.toFixed(2)} DA
                  </span>
                </div>

                {/* Shipping */}
                <div className="flex justify-between mb-4">
                  <span style={{ color: '#00D9FF' }}>
                    Shipping ({formData.wilaya})
                  </span>
                  <span
                    style={{
                      color: '#FF006E',
                      textShadow: '0 0 15px #FF006E',
                    }}
                  >
                    {shipping.toFixed(2)} DA
                  </span>
                </div>

                {/* Divider */}
                <div
                  className="my-4 h-[2px]"
                  style={{
                    background: 'linear-gradient(90deg, #FF006E 0%, #00D9FF 100%)',
                  }}
                />

                {/* Total */}
                <div className="flex justify-between items-center">
                  <span
                    className="text-xl font-black"
                    style={{
                      textShadow: '0 0 20px #FF006E',
                      color: '#FF006E',
                    }}
                  >
                    TOTAL
                  </span>
                  <motion.span
                    animate={{ textShadow: ['0 0 20px #FF006E', '0 0 40px #00D9FF', '0 0 20px #FF006E'] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-3xl font-black"
                    style={{
                      background: 'linear-gradient(135deg, #FF006E 0%, #00D9FF 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {total.toFixed(2)} DA
                  </motion.span>
                </div>

                {/* Info Box */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-8 p-4 rounded-lg text-xs"
                  style={{
                    background: 'rgba(0, 255, 65, 0.1)',
                    border: '1px solid #00FF41',
                    color: '#00FF41',
                  }}
                >
                  ✓ Your order is secure and encrypted. Once confirmed, you'll receive an SMS confirmation with tracking info.
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
