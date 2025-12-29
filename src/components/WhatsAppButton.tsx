import React from 'react';
import { motion } from 'framer-motion';

interface WhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  phoneNumber = '213671234567', // Replace with actual number (Algeria +213)
  message = 'Hello RoyShop! I have a question about your products.',
}) => {
  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleWhatsAppClick}
      className="fixed bottom-8 left-8 z-40 w-16 h-16 rounded-full flex items-center justify-center text-3xl font-bold hover:translate-y-[-5px] transition-all duration-300 group"
      style={{
        backgroundColor: '#00FF41',
        boxShadow: '0 0 30px #00FF41, 0 0 60px rgba(0, 255, 65, 0.5), 0 10px 40px rgba(0, 255, 65, 0.3)',
      }}
      title="Chat with us on WhatsApp"
    >
      💬
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        whileHover={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
        className="absolute left-full ml-4 bg-neon-black text-neon-green px-4 py-3 rounded-xl text-sm whitespace-nowrap pointer-events-none font-bold border-2 border-neon-green"
        style={{
          boxShadow: '0 0 20px #00FF41, inset 0 0 20px rgba(0, 255, 65, 0.1)',
        }}
      >
        Chat with us! 💬
      </motion.div>
    </motion.button>
  );
};
