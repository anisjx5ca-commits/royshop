import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore.ts';
import { CartSidebar } from './CartSidebar';
import { motion } from 'framer-motion';

export const Header: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());

  const menuItems = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'About', href: '/#about' },
  ];

  return (
    <>
      <header 
        className="fixed top-0 left-0 right-0 z-50 border-b-2 border-neon-blue/60 backdrop-blur-lg bg-neon-black/80"
        style={{
          boxShadow: '0 0 30px rgba(0, 217, 255, 0.3), inset 0 1px 20px rgba(0, 217, 255, 0.1)',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo - Left */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/"
              className="text-3xl font-black text-neon-pink transition-all duration-300 cursor-pointer whitespace-nowrap"
              style={{
                textShadow: '0 0 20px #FF006E, 0 0 40px #FF006E, 0 0 60px #FF006E',
              }}
            >
              RoyShop
            </Link>
          </motion.div>

          {/* Navigation - Center (Desktop only) */}
          <nav className="hidden md:flex items-center gap-10 absolute left-1/2 transform -translate-x-1/2">
            {menuItems.map((item) => (
              <motion.div key={item.href} whileHover={{ y: -2 }}>
                <Link
                  to={item.href}
                  className="text-neon-white hover:text-neon-cyan transition-colors duration-300 font-semibold"
                  style={{
                    textShadow: '0 0 10px rgba(0, 217, 255, 0.4)',
                  }}
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Cart Icon - Right */}
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsCartOpen(true)}
              className="relative text-neon-white hover:text-neon-pink transition-colors duration-300 text-2xl"
              title="Open Cart"
            >
              🛒
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-3 -right-2 bg-neon-pink text-neon-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                  style={{
                    boxShadow: '0 0 12px #FF006E, 0 0 24px rgba(255, 0, 110, 0.5)',
                  }}
                >
                  {totalItems}
                </motion.span>
              )}
            </motion.button>

            <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
              <Link
                to="/cart"
                className="text-neon-white hover:text-neon-pink transition-colors duration-300 font-semibold text-sm"
                style={{
                  textShadow: '0 0 10px rgba(255, 0, 110, 0.4)',
                }}
              >
                Cart
              </Link>
            </motion.div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-neon-white hover:text-neon-pink transition-colors duration-300 text-xl"
            >
              {isMobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-neon-black/95 border-t border-neon-blue/40 px-6 py-4 space-y-3"
          >
            {menuItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-neon-white hover:text-neon-pink font-semibold transition-colors py-2"
                style={{
                  textShadow: '0 0 8px rgba(0, 217, 255, 0.3)',
                }}
              >
                {item.label}
              </Link>
            ))}
          </motion.nav>
        )}
      </header>

      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};
