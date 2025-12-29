import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore.ts';
import { FaShoppingCart, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose }) => {
  const items = useCartStore((state) => state.items);
  const totalPrice = useCartStore((state) => state.getTotalPrice());
  const totalItems = useCartStore((state) => state.getTotalItems());
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-lg z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
                <FaShoppingCart /> Cart ({totalItems})
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-primary transition-colors"
              >
                <FaTimes size={24} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <FaShoppingCart className="mx-auto mb-4 text-gray-300" size={48} />
                  <p className="text-gray-600">Your cart is empty</p>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    exit={{ opacity: 0, x: 100 }}
                    className="flex gap-4 pb-4 border-b border-border"
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    )}

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-semibold text-primary">{item.name}</h3>
                        <p className="text-sm text-gray-600">
                          Color: {item.color} | Size: {item.size}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-accent font-bold">
                          {(item.price * item.quantity).toFixed(2)} DA
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.modelId,
                                item.color,
                                item.size,
                                item.quantity - 1
                              )
                            }
                            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                          >
                            −
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.modelId,
                                item.color,
                                item.size,
                                item.quantity + 1
                              )
                            }
                            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        removeFromCart(item.modelId, item.color, item.size)
                      }
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <FaTimes />
                    </button>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-border p-6 space-y-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Subtotal:</span>
                  <span className="text-accent">{totalPrice.toFixed(2)} DA</span>
                </div>

                <Link
                  to="/checkout"
                  onClick={onClose}
                  className="block w-full py-3 bg-accent text-white font-bold text-center rounded-lg hover:bg-accent-light transition-colors"
                >
                  Proceed to Checkout
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
