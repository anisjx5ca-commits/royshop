import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore.ts';
import { getProducts } from '../lib/supabase.ts';
import { Product } from '../lib/supabase.ts';

const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Premium Casual Shirt',
    price: 4500,
    stock: 15,
    model_url: '/models/shirt-sample.glb',
    texture_config: { colors: ['white', 'black', 'blue'] },
    image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
    description: 'High-quality casual shirt made from premium cotton',
  },
  {
    id: '2',
    name: 'Elegant Dress Pants',
    price: 5500,
    stock: 12,
    model_url: '/models/pants-sample.glb',
    texture_config: { colors: ['black', 'navy', 'gray'] },
    image_url: 'https://images.unsplash.com/photo-1473181052071-15efbf76eaea?w=400&h=400&fit=crop',
    description: 'Sophisticated dress pants for any occasion',
  },
  {
    id: '3',
    name: 'Classic Denim Jacket',
    price: 6500,
    stock: 8,
    model_url: '/models/jacket-sample.glb',
    texture_config: { colors: ['blue', 'black'] },
    image_url: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&h=400&fit=crop',
    description: 'Timeless denim jacket for a stylish look',
  },
  {
    id: '4',
    name: 'Stylish Sweater',
    price: 4000,
    stock: 20,
    model_url: '/models/sweater-sample.glb',
    texture_config: { colors: ['red', 'gray', 'navy'] },
    image_url: 'https://images.unsplash.com/photo-1513245543132-31f507417b26?w=400&h=400&fit=crop',
    description: 'Cozy sweater perfect for any season',
  },
  {
    id: '5',
    name: 'Summer T-Shirt',
    price: 2500,
    stock: 30,
    model_url: '/models/tshirt-sample.glb',
    texture_config: { colors: ['white', 'black', 'yellow', 'pink'] },
    image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
    description: 'Lightweight and breathable summer essential',
  },
  {
    id: '6',
    name: 'Formal Blazer',
    price: 8000,
    stock: 5,
    model_url: '/models/blazer-sample.glb',
    texture_config: { colors: ['black', 'navy', 'charcoal'] },
    image_url: 'https://images.unsplash.com/photo-1505025114519-a9fc94aa64bf?w=400&h=400&fit=crop',
    description: 'Premium blazer for professional settings',
  },
];

export const ShopPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const dbProducts = await getProducts();
        if (dbProducts.length > 0) {
          setProducts(dbProducts);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        // Fallback to mock products
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter and sort products
  let filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (sortBy === 'price-low') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'newest') {
    filteredProducts.sort(
      (a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
    );
  }

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: `${product.id}-${Date.now()}`,
      modelId: product.id,
      name: product.name,
      price: product.price,
      color: 'Default',
      size: 'M',
      quantity: 1,
      image: product.image_url || '',
    });
  };

  return (
    <div className="min-h-screen bg-neon-black text-neon-white overflow-hidden relative pt-20">
      {/* Cyberpunk Grid Background */}
      <div className="fixed inset-0 opacity-20 pointer-events-none z-0">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="shop-grid-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00D9FF" stopOpacity="0.4"/>
              <stop offset="50%" stopColor="#FF006E" stopOpacity="0.2"/>
              <stop offset="100%" stopColor="#00D9FF" stopOpacity="0.4"/>
            </linearGradient>
            <filter id="shop-glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Central glow orb */}
          <circle cx="50%" cy="30%" r="25%" fill="url(#shop-grid-gradient)" filter="url(#shop-glow)" opacity="0.15"/>
          
          {/* Grid Lines */}
          <g stroke="url(#shop-grid-gradient)" strokeWidth="0.5" opacity="0.3">
            {Array.from({ length: 16 }).map((_, i) => (
              <g key={i}>
                <line x1={`${i * 6.25}%`} y1="0%" x2={`${i * 6.25}%`} y2="100%"/>
                <line x1="0%" y1={`${i * 6.25}%`} x2="100%" y2={`${i * 6.25}%`}/>
              </g>
            ))}
          </g>
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 py-16">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 
              className="text-6xl md:text-7xl font-black mb-4 leading-tight"
              style={{
                textShadow: '0 0 40px #FF006E, 0 0 80px #FF006E, 0 0 120px #FF006E, 0 0 30px #00D9FF',
                background: 'linear-gradient(135deg, #FF006E 0%, #B800E8 50%, #00D9FF 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Shop Our Collection
            </h1>
            <p 
              className="text-xl md:text-2xl font-semibold mt-6"
              style={{
                textShadow: '0 0 20px #00D9FF, 0 0 40px #00D9FF',
                color: '#00D9FF',
              }}
            >
              Explore premium fashion with interactive 3D viewing
            </p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-12"
          >
            <div 
              className="flex flex-col md:flex-row gap-4 p-6 rounded-2xl backdrop-blur-md"
              style={{
                border: '3px solid #00D9FF',
                background: 'rgba(10, 14, 39, 0.6)',
                boxShadow: '0 0 30px rgba(0, 217, 255, 0.4), inset 0 0 30px rgba(0, 217, 255, 0.1)',
              }}
            >
              <input
                type="search"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-5 py-3 bg-neon-black text-neon-white border-2 border-neon-cyan rounded-lg focus:outline-none focus:border-neon-pink transition-all duration-300 placeholder-neon-cyan/50"
                style={{
                  textShadow: '0 0 10px #00D9FF',
                  boxShadow: '0 0 15px rgba(0, 217, 255, 0.2), inset 0 0 15px rgba(0, 217, 255, 0.05)',
                }}
              />

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-5 py-3 bg-neon-black text-neon-white border-2 border-neon-blue rounded-lg focus:outline-none focus:border-neon-pink transition-all duration-300"
                style={{
                  boxShadow: '0 0 15px rgba(0, 217, 255, 0.2)',
                }}
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </motion.div>

          {/* Products Grid */}
          {loading ? (
            <div className="text-center py-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="inline-block"
              >
                <div 
                  className="w-12 h-12 border-4 rounded-full"
                  style={{
                    borderColor: '#FF006E',
                    borderTopColor: '#00D9FF',
                    boxShadow: '0 0 30px #FF006E, 0 0 60px #00D9FF',
                  }}
                />
              </motion.div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <p 
                className="text-2xl font-semibold"
                style={{
                  textShadow: '0 0 20px #FF006E',
                  color: '#FF006E',
                }}
              >
                No products found. Try adjusting your search.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  whileHover={{ y: -10 }}
                  className="group"
                >
                  <div
                    className="rounded-xl overflow-hidden backdrop-blur-sm h-full flex flex-col hover:shadow-2xl transition-all duration-300"
                    style={{
                      border: index % 2 === 0 
                        ? '3px solid #00D9FF' 
                        : '3px solid #FF006E',
                      background: 'rgba(10, 14, 39, 0.5)',
                      boxShadow: index % 2 === 0
                        ? '0 0 25px rgba(0, 217, 255, 0.4), inset 0 0 25px rgba(0, 217, 255, 0.1)'
                        : '0 0 25px rgba(255, 0, 110, 0.4), inset 0 0 25px rgba(255, 0, 110, 0.1)',
                    }}
                  >
                    {/* Product Image */}
                    <div className="relative overflow-hidden h-48 bg-gradient-to-br from-neon-black to-neon-black/50">
                      <img
                        src={product.image_url || 'https://via.placeholder.com/300'}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div 
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                          background: index % 2 === 0
                            ? 'linear-gradient(135deg, rgba(0, 217, 255, 0.2), rgba(0, 217, 255, 0.05))'
                            : 'linear-gradient(135deg, rgba(255, 0, 110, 0.2), rgba(255, 0, 110, 0.05))',
                        }}
                      />
                    </div>

                    {/* Product Info */}
                    <div className="p-5 flex flex-col flex-1">
                      <Link to={`/product/${product.id}`}>
                        <h3 
                          className="font-bold text-lg mb-2 line-clamp-2 hover:text-neon-cyan transition-colors duration-300"
                          style={{
                            textShadow: index % 2 === 0
                              ? '0 0 15px #00D9FF'
                              : '0 0 15px #FF006E',
                            color: index % 2 === 0 ? '#00D9FF' : '#FF006E',
                          }}
                        >
                          {product.name}
                        </h3>
                      </Link>

                      {/* Price and Rating */}
                      <div className="flex items-center justify-between mb-4">
                        <span 
                          className="text-2xl font-bold"
                          style={{
                            textShadow: '0 0 15px #00D9FF',
                            color: '#00D9FF',
                          }}
                        >
                          {product.price.toFixed(2)} DA
                        </span>
                        <div className="flex items-center gap-1">
                          {product.rating && product.rating > 0 ? (
                            <>
                              <span className="text-yellow-400 text-lg">★</span>
                              <span className="text-neon-white text-sm font-semibold">{(product.rating as any)?.toFixed(1) || '0'}</span>
                            </>
                          ) : (
                            <>
                              <span className="text-gray-500 text-lg">☆</span>
                              <span className="text-gray-400 text-sm font-semibold">No ratings</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Add to Cart Button */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAddToCart(product)}
                        className="w-full py-3 font-bold text-neon-white rounded-lg transition-all duration-300 mt-auto"
                        style={{
                          border: index % 2 === 0 
                            ? '2px solid #00D9FF' 
                            : '2px solid #FF006E',
                          background: 'rgba(10, 14, 39, 0.8)',
                          boxShadow: index % 2 === 0
                            ? '0 0 20px rgba(0, 217, 255, 0.5)'
                            : '0 0 20px rgba(255, 0, 110, 0.5)',
                        }}
                      >
                        🛒 Add to Cart
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Results Count */}
          {!loading && filteredProducts.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <p 
                className="text-lg font-semibold"
                style={{
                  textShadow: '0 0 15px #00D9FF',
                  color: '#00D9FF',
                }}
              >
                Showing {filteredProducts.length} of {products.length} products
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
