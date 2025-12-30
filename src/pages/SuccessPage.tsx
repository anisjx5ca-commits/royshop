import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { OrderReviewList } from '../components/OrderReviewList';
import { useCartStore } from '../store/cartStore.ts';

export const SuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const clearCart = useCartStore((state) => state.clearCart);
  const orderData = (location.state as any)?.orderData;

  useEffect(() => {
    // Clear cart on success page load
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-neon-black text-neon-white overflow-hidden relative pt-20">
      {/* Cyberpunk Grid Background */}
      <div className="fixed inset-0 opacity-15 pointer-events-none z-0">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="success-grid" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00FF41" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#00D9FF" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          <g stroke="url(#success-grid)" strokeWidth="0.5" opacity="0.3">
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
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Success Icon Animation */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
            className="text-center mb-12"
          >
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-9xl inline-block mb-8"
              style={{
                textShadow: '0 0 50px #00FF41, 0 0 100px #00D9FF',
                filter: 'drop-shadow(0 0 30px rgba(0, 255, 65, 0.6))',
              }}
            >
              ✓
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-6xl font-black mb-4"
              style={{
                textShadow: '0 0 40px #00FF41, 0 0 80px #00D9FF',
                background: 'linear-gradient(135deg, #00FF41 0%, #00D9FF 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Order Confirmed!
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-xl"
              style={{
                color: '#00D9FF',
                textShadow: '0 0 15px #00D9FF',
              }}
            >
              Thank you for your purchase at RoyShop
            </motion.p>
          </motion.div>

          {/* Order Details Card */}
          {orderData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="p-8 rounded-2xl mb-12"
              style={{
                border: '3px solid #00FF41',
                background: 'rgba(10, 14, 39, 0.7)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 0 40px rgba(0, 255, 65, 0.3)',
              }}
            >
              <h2
                className="text-2xl font-bold mb-6"
                style={{
                  textShadow: '0 0 20px #00FF41',
                  color: '#00FF41',
                }}
              >
                Order Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <p className="text-sm opacity-70" style={{ color: '#00D9FF' }}>
                      Customer Name
                    </p>
                    <p
                      className="text-xl font-bold"
                      style={{
                        color: '#FF006E',
                        textShadow: '0 0 10px #FF006E',
                      }}
                    >
                      {orderData.name}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm opacity-70" style={{ color: '#00D9FF' }}>
                      Phone Number
                    </p>
                    <p
                      className="text-xl font-bold font-mono"
                      style={{
                        color: '#FF006E',
                        textShadow: '0 0 10px #FF006E',
                      }}
                    >
                      {orderData.phone}
                    </p>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <p className="text-sm opacity-70" style={{ color: '#00D9FF' }}>
                      Delivery Address
                    </p>
                    <p className="text-lg font-bold">
                      <span style={{ color: '#FF006E' }}>{orderData.baladiya}</span>
                      <span style={{ color: '#00D9FF' }} className="mx-2">
                        •
                      </span>
                      <span style={{ color: '#FF006E' }}>{orderData.wilaya}</span>
                    </p>
                  </div>

                  <div>
                    <p className="text-sm opacity-70" style={{ color: '#00D9FF' }}>
                      Items in Order
                    </p>
                    <p className="text-xl font-bold" style={{ color: '#00FF41' }}>
                      {orderData.itemsCount} {orderData.itemsCount === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div
                className="my-8 h-[1px]"
                style={{
                  background: 'linear-gradient(90deg, #00FF41 0%, transparent 50%, #00D9FF 100%)',
                }}
              />

              {/* Totals */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm opacity-70" style={{ color: '#00D9FF' }}>
                    Subtotal
                  </p>
                  <p
                    className="text-2xl font-black"
                    style={{
                      color: '#00D9FF',
                      textShadow: '0 0 15px #00D9FF',
                    }}
                  >
                    {(orderData.total - orderData.shipping).toFixed(2)} DA
                  </p>
                </div>

                <div>
                  <p className="text-sm opacity-70" style={{ color: '#00D9FF' }}>
                    Shipping
                  </p>
                  <p
                    className="text-2xl font-black"
                    style={{
                      color: '#FF006E',
                      textShadow: '0 0 15px #FF006E',
                    }}
                  >
                    {orderData.shipping.toFixed(2)} DA
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Bulk Review System */}
          {orderData && orderData.items && orderData.items.length > 0 && (
            <OrderReviewList
              orderItems={orderData.items}
              customerName={orderData.name}
              onSubmitSuccess={() => {
                // Optional: Do something after bulk review submission
                console.log('Bulk reviews submitted successfully!');
              }}
            />
          )}

          {/* Status Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="p-6 rounded-xl mb-12"
            style={{
              border: '2px solid #00FF41',
              background: 'rgba(0, 255, 65, 0.05)',
            }}
          >
            <p className="text-lg font-bold mb-3" style={{ color: '#00FF41' }}>
              ✓ What's Next?
            </p>
            <p style={{ color: '#00D9FF' }}>
              Our team will contact you shortly to confirm your order. You can expect a call or WhatsApp message
              within the next 24 hours. Keep your phone nearby! A confirmation email has also been sent to your
              registered email address. Don't forget to rate the products you received!
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/shop')}
              className="px-10 py-4 font-black text-lg rounded-xl transition-all"
              style={{
                border: '3px solid #00FF41',
                background: 'rgba(0, 255, 65, 0.1)',
                color: '#00FF41',
                boxShadow: '0 0 25px rgba(0, 255, 65, 0.4)',
              }}
            >
              🛒 Continue Shopping
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              className="px-10 py-4 font-black text-lg rounded-xl transition-all"
              style={{
                border: '3px solid #00D9FF',
                background: 'rgba(0, 217, 255, 0.1)',
                color: '#00D9FF',
                boxShadow: '0 0 25px rgba(0, 217, 255, 0.4)',
              }}
            >
              🏠 Back to Home
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
