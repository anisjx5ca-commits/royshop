import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore.ts';
import toast from 'react-hot-toast';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, removeFromCart, updateQuantity } = useCartStore();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? (subtotal > 10000 ? 0 : 500) : 0; // Free shipping over 10000 DA
  const total = subtotal + shipping;

  const handleProceedToCheckout = () => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    setIsCheckingOut(true);
    setTimeout(() => {
      navigate('/checkout');
    }, 300);
  };

  return (
    <div className="min-h-screen bg-neon-black text-neon-white overflow-hidden relative pt-20">
      {/* Cyberpunk Grid Background */}
      <div className="fixed inset-0 opacity-15 pointer-events-none z-0">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="cart-grid" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00D9FF" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#FF006E" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          <g stroke="url(#cart-grid)" strokeWidth="0.5" opacity="0.3">
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
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h1
              className="text-6xl font-black mb-4"
              style={{
                textShadow: '0 0 40px #FF006E, 0 0 80px #00D9FF',
                background: 'linear-gradient(135deg, #FF006E 0%, #00D9FF 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Shopping Cart
            </h1>
            <p
              className="text-lg"
              style={{
                color: '#00D9FF',
                textShadow: '0 0 15px #00D9FF',
              }}
            >
              {items.length} {items.length === 1 ? 'item' : 'items'} in cart
            </p>
          </motion.div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left: Cart Items */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-2 space-y-4"
            >
              {items.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16"
                  style={{
                    border: '2px dashed #00D9FF',
                    borderRadius: '16px',
                    background: 'rgba(10, 14, 39, 0.5)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <p
                    className="text-2xl font-bold mb-6"
                    style={{
                      color: '#FF006E',
                      textShadow: '0 0 20px #FF006E',
                    }}
                  >
                    Your cart is empty 🛒
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/shop')}
                    className="px-8 py-3 font-bold rounded-lg transition-all"
                    style={{
                      border: '2px solid #00D9FF',
                      color: '#00D9FF',
                      background: 'rgba(0, 217, 255, 0.1)',
                      boxShadow: '0 0 20px rgba(0, 217, 255, 0.3)',
                    }}
                  >
                    Continue Shopping
                  </motion.button>
                </motion.div>
              ) : (
                <AnimatePresence>
                  {items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex gap-4 p-6 rounded-xl"
                      style={{
                        border: '2px solid #00D9FF',
                        background: 'rgba(10, 14, 39, 0.6)',
                        backdropFilter: 'blur(15px)',
                        boxShadow: '0 0 30px rgba(0, 217, 255, 0.2)',
                      }}
                    >
                      {/* Product Thumbnail */}
                      <div
                        className="w-24 h-24 rounded-lg flex-shrink-0 flex items-center justify-center"
                        style={{
                          background: 'linear-gradient(135deg, rgba(0, 217, 255, 0.1), rgba(255, 0, 110, 0.1))',
                          border: '2px solid #FF006E',
                        }}
                      >
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <span className="text-3xl">📦</span>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <h3
                          className="text-lg font-bold mb-2"
                          style={{
                            color: '#FF006E',
                            textShadow: '0 0 15px #FF006E',
                          }}
                        >
                          {item.name}
                        </h3>

                        {/* Color and Size */}
                        <div className="flex items-center gap-6 mb-3 text-sm">
                          {item.color && (
                            <div className="flex items-center gap-2">
                              <span style={{ color: '#00D9FF' }}>Color:</span>
                              <div
                                className="w-4 h-4 rounded-full border-2 border-neon-white"
                                style={{
                                  backgroundColor: item.color === 'Default' ? '#CCCCCC' : item.color,
                                }}
                              />
                            </div>
                          )}
                          {item.size && (
                            <span style={{ color: '#00D9FF' }}>
                              Size: <span className="font-bold">{item.size}</span>
                            </span>
                          )}
                        </div>

                        {/* Quantity Controller */}
                        <div className="flex items-center gap-3">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() =>
                              updateQuantity(item.modelId, item.color, item.size, Math.max(1, item.quantity - 1))
                            }
                            className="w-8 h-8 rounded flex items-center justify-center font-bold"
                            style={{
                              border: '2px solid #00D9FF',
                              background: 'rgba(0, 217, 255, 0.1)',
                              color: '#00D9FF',
                              boxShadow: '0 0 10px rgba(0, 217, 255, 0.2)',
                            }}
                          >
                            −
                          </motion.button>
                          <span className="w-8 text-center font-bold">{item.quantity}</span>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() =>
                              updateQuantity(item.modelId, item.color, item.size, item.quantity + 1)
                            }
                            className="w-8 h-8 rounded flex items-center justify-center font-bold"
                            style={{
                              border: '2px solid #FF006E',
                              background: 'rgba(255, 0, 110, 0.1)',
                              color: '#FF006E',
                              boxShadow: '0 0 10px rgba(255, 0, 110, 0.2)',
                            }}
                          >
                            +
                          </motion.button>
                        </div>
                      </div>

                      {/* Price and Remove */}
                      <div className="flex flex-col items-end justify-between">
                        <span
                          className="text-2xl font-bold"
                          style={{
                            color: '#00D9FF',
                            textShadow: '0 0 20px #00D9FF',
                          }}
                        >
                          {(item.price * item.quantity).toFixed(2)} DA
                        </span>

                        <motion.button
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            removeFromCart(item.modelId, item.color, item.size);
                            toast.success('Item removed from cart');
                          }}
                          className="text-2xl transition-all"
                          style={{
                            textShadow: '0 0 15px #FF0000',
                            filter: 'drop-shadow(0 0 10px rgba(255, 0, 0, 0.3))',
                          }}
                        >
                          🗑️
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </motion.div>

            {/* Right: Order Summary (Sticky) */}
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
                <h2
                  className="text-2xl font-black mb-6"
                  style={{
                    textShadow: '0 0 20px #FF006E',
                    color: '#FF006E',
                  }}
                >
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  {/* Subtotal */}
                  <div className="flex justify-between items-center">
                    <span style={{ color: '#00D9FF' }}>Subtotal</span>
                    <span
                      className="font-bold text-lg"
                      style={{
                        color: '#00D9FF',
                        textShadow: '0 0 15px #00D9FF',
                      }}
                    >
                      {subtotal.toFixed(2)} DA
                    </span>
                  </div>

                  {/* Shipping */}
                  <div className="flex justify-between items-center">
                    <span style={{ color: '#00D9FF' }}>
                      Shipping {subtotal > 10000 && <span className="text-green-400">(FREE)</span>}
                    </span>
                    <span
                      className="font-bold text-lg"
                      style={{
                        color: shipping === 0 ? '#00FF41' : '#FF006E',
                        textShadow: `0 0 15px ${shipping === 0 ? '#00FF41' : '#FF006E'}`,
                      }}
                    >
                      {shipping > 0 ? `${shipping.toFixed(2)} DA` : 'FREE'}
                    </span>
                  </div>

                  {/* Divider */}
                  <div
                    className="my-4 h-[1px]"
                    style={{
                      background: 'linear-gradient(90deg, #FF006E 0%, transparent 50%, #00D9FF 100%)',
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
                    <span
                      className="text-2xl font-black"
                      style={{
                        textShadow: '0 0 30px #FF006E, 0 0 60px #00D9FF',
                        background: 'linear-gradient(135deg, #FF006E 0%, #00D9FF 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      {total.toFixed(2)} DA
                    </span>
                  </div>
                </div>

                {/* Proceed Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleProceedToCheckout}
                  disabled={items.length === 0 || isCheckingOut}
                  className="w-full py-4 font-black text-lg rounded-xl transition-all duration-300 relative overflow-hidden"
                  style={{
                    border: '3px solid #FF006E',
                    background: 'linear-gradient(135deg, rgba(255, 0, 110, 0.3), rgba(0, 217, 255, 0.1))',
                    color: '#FF006E',
                    boxShadow: isCheckingOut
                      ? '0 0 40px #FF006E, 0 0 80px #00D9FF'
                      : '0 0 25px rgba(255, 0, 110, 0.4)',
                    opacity: items.length === 0 ? 0.5 : 1,
                  }}
                >
                  {isCheckingOut ? (
                    <motion.span
                      animate={{ opacity: [1, 0.6, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      Processing...
                    </motion.span>
                  ) : (
                    <>
                      🛒 Proceed to Checkout
                    </>
                  )}
                </motion.button>

                {/* Continue Shopping Link */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/shop')}
                  className="w-full mt-4 py-3 font-bold text-neon-white rounded-xl transition-all"
                  style={{
                    border: '2px solid #00D9FF',
                    background: 'rgba(0, 217, 255, 0.05)',
                    boxShadow: '0 0 15px rgba(0, 217, 255, 0.2)',
                  }}
                >
                  Continue Shopping
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
