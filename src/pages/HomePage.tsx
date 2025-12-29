import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-neon-black text-neon-white overflow-hidden relative">
      {/* 3D Wireframe Grid Background */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grid-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00D9FF" stopOpacity="0.3"/>
              <stop offset="50%" stopColor="#00F0FF" stopOpacity="0.1"/>
              <stop offset="100%" stopColor="#FF006E" stopOpacity="0.3"/>
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Central glow circle */}
          <circle cx="50%" cy="50%" r="30%" fill="url(#grid-gradient)" filter="url(#glow)" opacity="0.2"/>
          
          {/* 3D Grid Lines */}
          <g stroke="url(#grid-gradient)" strokeWidth="0.5" opacity="0.4">
            {Array.from({ length: 20 }).map((_, i) => (
              <g key={i}>
                <line x1={`${i * 5}%`} y1="0%" x2={`${i * 5}%`} y2="100%"/>
                <line x1="0%" y1={`${i * 5}%`} x2="100%" y2={`${i * 5}%`}/>
              </g>
            ))}
          </g>
          
          {/* Diagonal perspective lines for 3D effect */}
          <g stroke="#FF006E" strokeWidth="0.3" opacity="0.2">
            <line x1="0%" y1="0%" x2="50%" y2="50%"/>
            <line x1="100%" y1="0%" x2="50%" y2="50%"/>
            <line x1="0%" y1="100%" x2="50%" y2="50%"/>
            <line x1="100%" y1="100%" x2="50%" y2="50%"/>
          </g>
        </svg>
      </div>

      {/* Central Glow Orb */}
      <motion.div 
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none z-0"
        animate={{
          boxShadow: [
            '0 0 80px 40px rgba(255, 0, 110, 0.3), 0 0 120px 60px rgba(0, 217, 255, 0.2)',
            '0 0 100px 50px rgba(0, 217, 255, 0.3), 0 0 150px 70px rgba(255, 0, 110, 0.2)',
            '0 0 80px 40px rgba(255, 0, 110, 0.3), 0 0 120px 60px rgba(0, 217, 255, 0.2)',
          ],
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      {/* Main Content */}
      <div className="relative z-10 pt-20">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 py-24 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 
              className="text-7xl md:text-8xl font-black mb-6 leading-tight"
              style={{
                textShadow: '0 0 40px #FF006E, 0 0 80px #FF006E, 0 0 120px #FF006E, 0 0 30px #00D9FF',
                background: 'linear-gradient(135deg, #FF006E 0%, #B800E8 50%, #00D9FF 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Welcome to RoyShop
            </h2>
            
            <p 
              className="text-2xl md:text-3xl mb-12 font-semibold"
              style={{
                textShadow: '0 0 20px #00D9FF, 0 0 40px #00D9FF, 0 0 60px #00D9FF',
                color: '#00D9FF',
              }}
            >
              Premium 3D E-commerce Fashion Platform
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-8 justify-center mb-16">
              <motion.div
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/shop"
                  className="px-10 py-5 bg-neon-black border-4 border-neon-pink text-neon-white font-bold text-xl rounded-lg transition-all duration-300 inline-block hover:translate-y-[-5px]"
                  style={{
                    boxShadow: '0 10px 40px #FF006E, inset 0 0 30px rgba(255, 0, 110, 0.2), 0 0 60px rgba(255, 0, 110, 0.4)',
                  }}
                >
                  View Products
                </Link>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/checkout"
                  className="px-10 py-5 bg-neon-black border-4 border-neon-blue text-neon-white font-bold text-xl rounded-lg transition-all duration-300 inline-block hover:translate-y-[-5px]"
                  style={{
                    boxShadow: '0 10px 40px #00D9FF, inset 0 0 30px rgba(0, 217, 255, 0.2), 0 0 60px rgba(0, 217, 255, 0.4)',
                  }}
                >
                  Checkout
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Featured Products Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mb-24"
          >
            <h3 
              className="text-5xl font-bold mb-16 text-center"
              style={{
                textShadow: '0 0 30px #FF006E, 0 0 60px #FF006E, 0 0 90px #00D9FF',
              }}
            >
              Featured Products
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15, duration: 0.6 }}
                  whileHover={{ y: -10 }}
                  className="group"
                >
                  <div
                    className="bg-neon-black/40 backdrop-blur-sm border-4 p-6 rounded-2xl hover:translate-y-[-8px] transition-all duration-300 relative overflow-hidden"
                    style={{
                      borderImage: 'linear-gradient(135deg, #00D9FF 0%, #FF006E 100%) 1',
                      boxShadow: '0 0 40px rgba(0, 217, 255, 0.3), 0 0 80px rgba(255, 0, 110, 0.2), inset 0 0 40px rgba(0, 217, 255, 0.1)',
                    }}
                  >
                    {/* Gradient border effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{
                      background: 'linear-gradient(135deg, #00D9FF 0%, #FF006E 100%)',
                    }}></div>
                    
                    {/* Product Image */}
                    <div 
                      className="relative bg-gradient-to-br from-neon-black to-neon-black/50 w-full h-48 rounded-xl mb-4 flex items-center justify-center border-2 border-neon-blue/30 group-hover:border-neon-pink/50 transition-all duration-300 overflow-hidden"
                      style={{
                        boxShadow: '0 0 30px rgba(0, 217, 255, 0.2), inset 0 0 30px rgba(0, 217, 255, 0.05)',
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-neon-pink/10 to-neon-blue/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <span className="text-neon-cyan/60 text-lg font-bold group-hover:text-neon-pink/80 transition-colors duration-300 relative z-10">
                        Product {i}
                      </span>
                    </div>
                    
                    <h4 
                      className="text-xl font-bold mb-2 relative z-10"
                      style={{
                        textShadow: '0 0 15px #FF006E',
                        color: '#FF006E',
                      }}
                    >
                      Premium Item {i}
                    </h4>
                    <p 
                      className="text-neon-cyan mb-6 text-lg font-semibold relative z-10"
                      style={{
                        textShadow: '0 0 10px #00D9FF',
                      }}
                    >
                      DA {2500 + i * 500}
                    </p>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full bg-neon-black border-3 border-neon-pink text-neon-white font-bold py-3 rounded-lg hover:border-neon-blue transition-all duration-300 relative z-10"
                      style={{
                        boxShadow: '0 0 20px rgba(255, 0, 110, 0.5)',
                      }}
                    >
                      Add to Cart
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Why Choose Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="relative mb-12 px-8 py-20 rounded-3xl"
            style={{
              background: 'rgba(10, 14, 39, 0.6)',
              borderImage: 'linear-gradient(135deg, #FF006E 0%, #B800E8 50%, #00D9FF 100%) 1',
              boxShadow: '0 0 60px rgba(255, 0, 110, 0.4), 0 0 100px rgba(0, 217, 255, 0.3), inset 0 0 60px rgba(255, 0, 110, 0.1)',
              border: '4px solid transparent',
              backgroundClip: 'padding-box',
            }}
          >
            <h3 
              className="text-5xl font-bold mb-16 text-center"
              style={{
                textShadow: '0 0 30px #FF006E, 0 0 60px #FF006E, 0 0 40px #00D9FF',
              }}
            >
              Why Choose RoyShop?
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { icon: '🎨', title: '3D Experience', desc: 'View products in stunning 3D before purchase' },
                { icon: '🚚', title: 'Fast Delivery', desc: 'Quick shipping across Algeria' },
                { icon: '💬', title: '24/7 Support', desc: 'WhatsApp support available anytime' },
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -10 }}
                  className="text-center group"
                >
                  <motion.div 
                    className="text-7xl mb-4 inline-block"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: idx * 0.2 }}
                    style={{
                      filter: 'drop-shadow(0 0 20px #FF006E) drop-shadow(0 0 40px #00D9FF)',
                    }}
                  >
                    {feature.icon}
                  </motion.div>
                  <h4 
                    className="text-2xl font-bold mb-3 group-hover:text-neon-pink transition-colors duration-300"
                    style={{
                      textShadow: '0 0 15px #FF006E',
                      color: '#FF006E',
                    }}
                  >
                    {feature.title}
                  </h4>
                  <p 
                    className="text-neon-cyan text-lg"
                    style={{
                      textShadow: '0 0 10px #00D9FF',
                    }}
                  >
                    {feature.desc}
                  </p>
                  <div 
                    className="w-20 h-1 bg-gradient-to-r from-neon-blue to-neon-pink mx-auto mt-6 rounded-full group-hover:w-32 transition-all duration-300"
                    style={{
                      boxShadow: '0 0 20px #FF006E, 0 0 40px #00D9FF',
                    }}
                  ></div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* WhatsApp Button */}
        <motion.a
          href="https://wa.me/213671234567"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-8 left-8 w-16 h-16 rounded-full flex items-center justify-center text-2xl z-50"
          style={{
            backgroundColor: '#00FF41',
            boxShadow: '0 0 30px #00FF41, 0 0 60px rgba(0, 255, 65, 0.5)',
          }}
          whileHover={{ scale: 1.1 }}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          💬
        </motion.a>

        {/* Footer */}
        <footer className="border-t border-neon-blue/30 bg-neon-black/80 backdrop-blur-sm py-8 mt-12">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-neon-white/60">
              © 2025 RoyShop. All rights reserved.
              <span 
                className="block mt-2 text-neon-pink font-semibold"
                style={{
                  textShadow: '0 0 10px #FF006E',
                }}
              >
                Cyberpunk Neon Experience ✨
              </span>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};
