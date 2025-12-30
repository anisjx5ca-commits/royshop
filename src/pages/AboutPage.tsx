import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaPhone, FaWhatsapp, FaClock, FaLightbulb, FaTrophy, FaRocket } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';

export const AboutPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill all fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('📤 Sending contact message to Supabase...');
      
      // Insert data into contact_messages table
      const { data, error } = await supabase
        .from('contact_messages')
        .insert([
          {
            name: formData.name.trim(),
            email: formData.email.trim(),
            message: formData.message.trim(),
          }
        ])
        .select();

      if (error) {
        console.error('❌ Supabase error:', error);
        toast.error(`Failed to send message: ${error.message}`);
        return;
      }

      console.log('✅ Message sent successfully:', data);
      toast.success('Message Sent Successfully! We will contact you soon.');
      setFormData({ name: '', email: '', message: '' });
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('❌ Error sending message:', errorMessage);
      toast.error('Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neon-black text-neon-white overflow-hidden relative pt-20">
      {/* Cyberpunk Grid Background */}
      <div className="fixed inset-0 opacity-15 pointer-events-none z-0">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="about-grid" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00D9FF" stopOpacity="0.4"/>
              <stop offset="100%" stopColor="#FF006E" stopOpacity="0.4"/>
            </linearGradient>
          </defs>
          <g stroke="url(#about-grid)" strokeWidth="0.5" opacity="0.3">
            {Array.from({ length: 16 }).map((_, i) => (
              <g key={i}>
                <line x1={`${i * 6.25}%`} y1="0%" x2={`${i * 6.25}%`} y2="100%"/>
                <line x1="0%" y1={`${i * 6.25}%`} x2="100%" y2={`${i * 6.25}%`}/>
              </g>
            ))}
          </g>
        </svg>
      </div>

      {/* Central Glow Orb */}
      <motion.div 
        className="fixed top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none z-0"
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
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 py-16">
          {/* Hero Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-24"
          >
            <motion.h1
              className="text-7xl md:text-8xl font-black mb-6 leading-tight"
              style={{
                textShadow: '0 0 40px #FF006E, 0 0 80px #FF006E, 0 0 120px #FF006E, 0 0 30px #00D9FF',
                background: 'linear-gradient(135deg, #FF006E 0%, #B800E8 50%, #00D9FF 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              About RoyShop
            </motion.h1>

            {/* Glowing Underline */}
            <motion.div
              className="w-32 h-1 bg-gradient-to-r from-neon-blue to-neon-pink mx-auto mb-8 rounded-full"
              style={{
                boxShadow: '0 0 30px #FF006E, 0 0 60px #00D9FF',
              }}
              animate={{ scaleX: [0.8, 1.2, 0.8] }}
              transition={{ duration: 3, repeat: Infinity }}
            />

            <p 
              className="text-2xl md:text-3xl font-semibold mb-6"
              style={{
                textShadow: '0 0 20px #00D9FF, 0 0 40px #00D9FF',
                color: '#00D9FF',
              }}
            >
              Revolutionizing E-commerce with 3D Technology
            </p>

            <p className="text-lg text-neon-white/70 max-w-3xl mx-auto">
              Discover the future of online shopping with interactive 3D product visualization and premium fashion experiences.
            </p>
          </motion.section>

          {/* Our Story Section */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-24"
          >
            <div
              className="rounded-3xl p-12 backdrop-blur-sm"
              style={{
                border: '3px solid #00D9FF',
                background: 'rgba(10, 14, 39, 0.6)',
                boxShadow: '0 0 40px rgba(0, 217, 255, 0.4), inset 0 0 40px rgba(0, 217, 255, 0.1)',
              }}
            >
              <h2
                className="text-5xl font-black mb-8"
                style={{
                  textShadow: '0 0 30px #FF006E, 0 0 60px #FF006E',
                  background: 'linear-gradient(135deg, #FF006E 0%, #00D9FF 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Our Story
              </h2>

              <div className="space-y-6 text-lg text-neon-white/80 leading-relaxed">
                <p>
                  RoyShop is an innovative Algerian startup dedicated to transforming the e-commerce landscape through cutting-edge 3D technology and premium fashion curation. We believe that online shopping should be immersive, engaging, and reflective of modern consumer expectations.
                </p>

                <p>
                  Founded with a vision to bridge the gap between traditional online retail and next-generation interactive experiences, we bring premium fashion products to life through interactive 3D visualization. Every product on our platform tells a story and offers a unique shopping experience.
                </p>

                <p>
                  Our commitment extends beyond aesthetics—we prioritize quality, sustainability, and customer satisfaction. We work directly with artisans and premium brands to curate collections that represent the best in contemporary fashion while maintaining authentic, locally-inspired designs.
                </p>

                <p className="pt-4">
                  Whether you're a fashion enthusiast, a trendsetter, or someone seeking premium quality garments, RoyShop is your destination for discovering, visualizing, and purchasing the perfect items with confidence.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Core Values Section */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-24"
          >
            <h2
              className="text-5xl font-black mb-12 text-center"
              style={{
                textShadow: '0 0 30px #FF006E, 0 0 60px #00D9FF',
                background: 'linear-gradient(135deg, #FF006E 0%, #00D9FF 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Our Core Values
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Quality Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.05 }}
                className="rounded-2xl p-8 backdrop-blur-sm group cursor-pointer"
                style={{
                  border: '2px solid #FF006E',
                  background: 'rgba(255, 0, 110, 0.1)',
                  boxShadow: '0 0 30px rgba(255, 0, 110, 0.3)',
                }}
              >
                <motion.div
                  className="text-6xl mb-6 inline-block"
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{
                    filter: 'drop-shadow(0 0 20px #FF006E)',
                  }}
                >
                  <FaTrophy />
                </motion.div>

                <h3 
                  className="text-2xl font-bold mb-4 group-hover:text-neon-pink transition-colors"
                  style={{
                    textShadow: '0 0 15px #FF006E',
                    color: '#FF006E',
                  }}
                >
                  Quality
                </h3>

                <p className="text-neon-white/70">
                  We curate only premium products that meet rigorous quality standards. Every item is verified and tested to ensure customer satisfaction.
                </p>
              </motion.div>

              {/* Innovation Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.05 }}
                className="rounded-2xl p-8 backdrop-blur-sm group cursor-pointer"
                style={{
                  border: '2px solid #00D9FF',
                  background: 'rgba(0, 217, 255, 0.1)',
                  boxShadow: '0 0 30px rgba(0, 217, 255, 0.3)',
                }}
              >
                <motion.div
                  className="text-6xl mb-6 inline-block"
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
                  style={{
                    filter: 'drop-shadow(0 0 20px #00D9FF)',
                  }}
                >
                  <FaLightbulb />
                </motion.div>

                <h3 
                  className="text-2xl font-bold mb-4 group-hover:text-neon-cyan transition-colors"
                  style={{
                    textShadow: '0 0 15px #00D9FF',
                    color: '#00D9FF',
                  }}
                >
                  Innovation
                </h3>

                <p className="text-neon-white/70">
                  We leverage cutting-edge 3D technology and AI-driven recommendations to create immersive shopping experiences that set us apart.
                </p>
              </motion.div>

              {/* Speed Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.05 }}
                className="rounded-2xl p-8 backdrop-blur-sm group cursor-pointer"
                style={{
                  border: '2px solid #B800E8',
                  background: 'rgba(184, 0, 232, 0.1)',
                  boxShadow: '0 0 30px rgba(184, 0, 232, 0.3)',
                }}
              >
                <motion.div
                  className="text-6xl mb-6 inline-block"
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
                  style={{
                    filter: 'drop-shadow(0 0 20px #B800E8)',
                  }}
                >
                  <FaRocket />
                </motion.div>

                <h3 
                  className="text-2xl font-bold mb-4 group-hover:text-purple-400 transition-colors"
                  style={{
                    textShadow: '0 0 15px #B800E8',
                    color: '#B800E8',
                  }}
                >
                  Speed
                </h3>

                <p className="text-neon-white/70">
                  Fast shipping, quick responses, and seamless transactions. We value your time and ensure the smoothest shopping experience.
                </p>
              </motion.div>
            </div>
          </motion.section>

          {/* Contact & Support Section */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-24"
          >
            <h2
              className="text-5xl font-black mb-12 text-center"
              style={{
                textShadow: '0 0 30px #FF006E, 0 0 60px #00D9FF',
                background: 'linear-gradient(135deg, #00D9FF 0%, #FF006E 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Contact & Support
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <div
                  className="rounded-2xl p-8 backdrop-blur-sm"
                  style={{
                    border: '2px solid #00D9FF',
                    background: 'rgba(0, 217, 255, 0.1)',
                    boxShadow: '0 0 30px rgba(0, 217, 255, 0.3)',
                  }}
                >
                  <h3
                    className="text-2xl font-bold mb-6"
                    style={{
                      textShadow: '0 0 15px #00D9FF',
                      color: '#00D9FF',
                    }}
                  >
                    Get in Touch
                  </h3>

                  {/* WhatsApp Support */}
                  <motion.a
                    href="https://wa.me/213671234567"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ x: 10 }}
                    className="flex items-center gap-4 p-4 rounded-xl mb-4 cursor-pointer transition-all duration-300"
                    style={{
                      border: '2px solid #25D366',
                      background: 'rgba(37, 211, 102, 0.1)',
                      boxShadow: '0 0 15px rgba(37, 211, 102, 0.3)',
                    }}
                  >
                    <FaWhatsapp className="text-3xl text-green-400" style={{ filter: 'drop-shadow(0 0 10px #25D366)' }} />
                    <div>
                      <p className="font-bold text-neon-white">WhatsApp Support</p>
                      <p className="text-sm text-neon-white/60">+213 67 123 45 67</p>
                    </div>
                  </motion.a>

                  {/* Email Support */}
                  <motion.a
                    href="mailto:support@royshop.dz"
                    whileHover={{ x: 10 }}
                    className="flex items-center gap-4 p-4 rounded-xl mb-4 cursor-pointer transition-all duration-300"
                    style={{
                      border: '2px solid #FF006E',
                      background: 'rgba(255, 0, 110, 0.1)',
                      boxShadow: '0 0 15px rgba(255, 0, 110, 0.3)',
                    }}
                  >
                    <FaEnvelope className="text-3xl text-neon-pink" style={{ filter: 'drop-shadow(0 0 10px #FF006E)' }} />
                    <div>
                      <p className="font-bold text-neon-white">Email Support</p>
                      <p className="text-sm text-neon-white/60">support@royshop.dz</p>
                    </div>
                  </motion.a>

                  {/* Phone Support */}
                  <motion.div
                    whileHover={{ x: 10 }}
                    className="flex items-center gap-4 p-4 rounded-xl mb-4 cursor-pointer transition-all duration-300"
                    style={{
                      border: '2px solid #B800E8',
                      background: 'rgba(184, 0, 232, 0.1)',
                      boxShadow: '0 0 15px rgba(184, 0, 232, 0.3)',
                    }}
                  >
                    <FaPhone className="text-3xl text-purple-400" style={{ filter: 'drop-shadow(0 0 10px #B800E8)' }} />
                    <div>
                      <p className="font-bold text-neon-white">Phone Support</p>
                      <p className="text-sm text-neon-white/60">+213 (0) 21 234 56 78</p>
                    </div>
                  </motion.div>

                  {/* Working Hours */}
                  <motion.div
                    whileHover={{ x: 10 }}
                    className="flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-300"
                    style={{
                      border: '2px solid #00FF41',
                      background: 'rgba(0, 255, 65, 0.1)',
                      boxShadow: '0 0 15px rgba(0, 255, 65, 0.3)',
                    }}
                  >
                    <FaClock className="text-3xl text-green-400" style={{ filter: 'drop-shadow(0 0 10px #00FF41)' }} />
                    <div>
                      <p className="font-bold text-neon-white">Working Hours</p>
                      <p className="text-sm text-neon-white/60">Monday - Friday: 9:00 AM - 6:00 PM</p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Contact Form */}
              <motion.form
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                onSubmit={handleSubmitForm}
                className="rounded-2xl p-8 backdrop-blur-sm space-y-4"
                style={{
                  border: '2px solid #FF006E',
                  background: 'rgba(255, 0, 110, 0.1)',
                  boxShadow: '0 0 30px rgba(255, 0, 110, 0.3)',
                }}
              >
                <h3
                  className="text-2xl font-bold mb-6"
                  style={{
                    textShadow: '0 0 15px #FF006E',
                    color: '#FF006E',
                  }}
                >
                  Send us a Message
                </h3>

                {/* Name Input */}
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: '#00D9FF' }}>
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 rounded-lg bg-neon-black text-neon-white placeholder-neon-white/40 focus:outline-none transition-all duration-300"
                    style={{
                      border: '2px solid #00D9FF',
                      boxShadow: 'focus: 0 0 15px rgba(0, 217, 255, 0.4)',
                    }}
                  />
                </div>

                {/* Email Input */}
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: '#00D9FF' }}>
                    Your Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 rounded-lg bg-neon-black text-neon-white placeholder-neon-white/40 focus:outline-none transition-all duration-300"
                    style={{
                      border: '2px solid #00D9FF',
                      boxShadow: 'focus: 0 0 15px rgba(0, 217, 255, 0.4)',
                    }}
                  />
                </div>

                {/* Message Input */}
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: '#00D9FF' }}>
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us how we can help..."
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg bg-neon-black text-neon-white placeholder-neon-white/40 focus:outline-none transition-all duration-300 resize-none"
                    style={{
                      border: '2px solid #00D9FF',
                      boxShadow: 'focus: 0 0 15px rgba(0, 217, 255, 0.4)',
                    }}
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 font-bold text-lg rounded-lg transition-all duration-300"
                  style={{
                    border: '2px solid #FF006E',
                    background: 'rgba(255, 0, 110, 0.2)',
                    color: '#FF006E',
                    textShadow: '0 0 10px #FF006E',
                    boxShadow: '0 0 20px rgba(255, 0, 110, 0.5)',
                    opacity: isSubmitting ? 0.7 : 1,
                  }}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </motion.button>
              </motion.form>
            </div>
          </motion.section>

          {/* Team/Office Section */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-24"
          >
            <h2
              className="text-5xl font-black mb-12 text-center"
              style={{
                textShadow: '0 0 30px #FF006E, 0 0 60px #00D9FF',
                background: 'linear-gradient(135deg, #B800E8 0%, #FF006E 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Our Team
            </h2>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="rounded-3xl overflow-hidden backdrop-blur-sm h-96"
              style={{
                border: '3px solid #00D9FF',
                background: 'rgba(10, 14, 39, 0.6)',
                boxShadow: '0 0 40px rgba(0, 217, 255, 0.4)',
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=400&fit=crop"
                alt="Team at work"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 0, 110, 0.2), rgba(0, 217, 255, 0.2))',
                }}
              />
            </motion.div>

            <div
              className="mt-8 rounded-2xl p-8 backdrop-blur-sm text-center"
              style={{
                border: '2px solid #B800E8',
                background: 'rgba(184, 0, 232, 0.1)',
                boxShadow: '0 0 30px rgba(184, 0, 232, 0.3)',
              }}
            >
              <p className="text-lg text-neon-white/80 leading-relaxed">
                Our dedicated team of designers, developers, and fashion experts work tirelessly to bring innovation to e-commerce. 
                Based in Algeria, we combine local insights with global expertise to create products and experiences that resonate with customers worldwide.
              </p>
            </div>
          </motion.section>

          {/* Call to Action */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <div
              className="rounded-3xl p-12 backdrop-blur-sm"
              style={{
                border: '3px solid #FF006E',
                background: 'rgba(255, 0, 110, 0.15)',
                boxShadow: '0 0 50px rgba(255, 0, 110, 0.4), inset 0 0 50px rgba(255, 0, 110, 0.1)',
              }}
            >
              <h2
                className="text-4xl font-black mb-6"
                style={{
                  textShadow: '0 0 30px #FF006E',
                  color: '#FF006E',
                }}
              >
                Ready to Shop with Us?
              </h2>

              <p className="text-lg text-neon-white/70 mb-8 max-w-2xl mx-auto">
                Explore our collection of premium fashion items with interactive 3D visualization and experience the future of online shopping today.
              </p>

              <motion.a
                href="/shop"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block px-12 py-5 font-bold text-lg rounded-xl transition-all duration-300"
                style={{
                  border: '3px solid #00D9FF',
                  background: 'rgba(0, 217, 255, 0.2)',
                  color: '#00D9FF',
                  textShadow: '0 0 10px #00D9FF',
                  boxShadow: '0 0 25px rgba(0, 217, 255, 0.6)',
                }}
              >
                Explore Shop →
              </motion.a>
            </div>
          </motion.section>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-neon-blue/30 bg-neon-black/80 backdrop-blur-sm py-8 mt-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-neon-white/60">
            © 2025 RoyShop. All rights reserved.
            <span 
              className="block mt-2 text-neon-pink font-semibold"
              style={{
                textShadow: '0 0 10px #FF006E',
              }}
            >
              Crafted with Innovation and Passion ✨
            </span>
          </p>
        </div>
      </footer>
    </div>
  );
};
