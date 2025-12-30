import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Product3DViewer } from '../components/Product3DViewer';
import { useCartStore } from '../store/cartStore.ts';
import { getProduct, getReviews, Review } from '../lib/supabase.ts';
import toast from 'react-hot-toast';

const MOCK_PRODUCT: Record<string, any> = {
  '1': {
    id: '1',
    name: 'Premium Casual Shirt',
    price: 4500,
    stock: 15,
    model_url: '/models/shirt-sample.glb',
    description: 'Experience ultimate comfort with our premium casual shirt. Crafted from 100% organic cotton with meticulous attention to detail.',
    features: ['100% Organic Cotton', 'Breathable Fabric', 'Machine Washable', 'Premium Stitching'],
    colors: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Black', hex: '#000000' },
      { name: 'Blue', hex: '#0066FF' },
      { name: 'Navy', hex: '#001A4D' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    rating: 0,
    reviewCount: 0,
    image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1503341455253-b2e723bb12dd?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1502716278519-d92b8be57b0d?w=500&h=500&fit=crop',
    ],
  },
  '2': {
    id: '2',
    name: 'Elegant Dress Pants',
    price: 5500,
    stock: 12,
    model_url: '/models/pants-sample.glb',
    description: 'Sophisticated dress pants that elevate any professional wardrobe.',
    features: ['Wool Blend', 'Perfect Fit', 'Professional Look', 'Easy Care'],
    colors: [
      { name: 'Black', hex: '#000000' },
      { name: 'Navy', hex: '#001A4D' },
      { name: 'Gray', hex: '#808080' },
      { name: 'Charcoal', hex: '#2F4F4F' },
    ],
    sizes: ['28', '30', '32', '34', '36', '38'],
    rating: 0,
    reviewCount: 0,
    image_url: 'https://images.unsplash.com/photo-1473181052071-15efbf76eaea?w=500&h=500&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1473181052071-15efbf76eaea?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500&h=500&fit=crop',
    ],
  },
};

export const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const addToCart = useCartStore((state) => state.addToCart);

  const [product, setProduct] = useState<any | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  // Default values for fallback
  const DEFAULT_SIZES = ['S', 'M', 'L', 'XL'];
  const DEFAULT_COLORS = [
    { name: 'Black', hex: '#000000' },
    { name: 'Blue', hex: '#1D4ED8' },
    { name: 'Amber', hex: '#F59E0B' },
  ];

  useEffect(() => {
    const loadProduct = async () => {
      try {
        if (!id) {
          setProduct(MOCK_PRODUCT['1']);
          setLoading(false);
          return;
        }
        
        // Try to fetch from Supabase first
        const dbProduct = await getProduct(id);
        if (dbProduct) {
          setProduct(dbProduct);
          // Fetch reviews
          const productReviews = await getReviews(id);
          setReviews(productReviews);
        } else {
          // Use mock product
          setProduct(MOCK_PRODUCT[id as string] || MOCK_PRODUCT['1']);
        }
      } catch (error) {
        console.error('Error loading product:', error);
        setProduct(MOCK_PRODUCT[id as string] || MOCK_PRODUCT['1']);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  useEffect(() => {
    if (product) {
      // Set default color - ensure we have a fallback
      const colors = product.colors && product.colors.length > 0 ? product.colors : DEFAULT_COLORS;
      const firstColor = colors[0];
      const colorName = typeof firstColor === 'string' ? firstColor : firstColor.name;
      setSelectedColor(colorName);

      // Set default size - ensure we have a fallback
      const sizes = product.sizes && product.sizes.length > 0 ? product.sizes : DEFAULT_SIZES;
      setSelectedSize(sizes[0]);
    }
  }, [product]);

  const handleAddToCart = async () => {
    if (!selectedColor || !selectedSize) {
      toast.error('Please select color and size');
      return;
    }

    setIsAdding(true);

    try {
      addToCart({
        modelId: product.id,
        name: product.name,
        price: product.price,
        color: selectedColor,
        size: selectedSize,
        quantity,
        image: product.image_url,
        id: `${product.id}-${selectedColor}-${selectedSize}`,
      });

      toast.success(`${product.name} added to cart!`);
      setQuantity(1);
    } catch (error) {
      toast.error('Failed to add item to cart');
    } finally {
      setIsAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neon-black pt-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 rounded-full"
          style={{
            borderColor: '#FF006E',
            borderTopColor: '#00D9FF',
            boxShadow: '0 0 40px #FF006E, 0 0 80px #00D9FF',
          }}
        />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-neon-black pt-20">
        <p 
          className="text-2xl font-bold mb-6"
          style={{
            textShadow: '0 0 20px #FF006E',
            color: '#FF006E',
          }}
        >
          Product not found
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/shop')}
          className="flex items-center gap-2 px-8 py-4 font-bold text-neon-white rounded-lg"
          style={{
            border: '2px solid #FF006E',
            boxShadow: '0 0 20px #FF006E',
          }}
        >
          ← Back to Shop
        </motion.button>
      </div>
    );
  }

  // Get related products (simple mock)
  const relatedProducts = Object.values(MOCK_PRODUCT).filter(p => p.id !== product.id).slice(0, 4);

  // Calculate actual rating from reviews (zero-trust system)
  const displayReviews = reviews.length > 0 ? reviews : [];
  const actualRating = displayReviews.length > 0 
    ? (displayReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / displayReviews.length)
    : 0;
  const actualReviewCount = displayReviews.length;

  return (
    <div className="min-h-screen bg-neon-black text-neon-white overflow-hidden relative pt-20">
      {/* Cyberpunk Grid Background */}
      <div className="fixed inset-0 opacity-15 pointer-events-none z-0">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="details-grid" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00D9FF" stopOpacity="0.4"/>
              <stop offset="100%" stopColor="#FF006E" stopOpacity="0.4"/>
            </linearGradient>
          </defs>
          <g stroke="url(#details-grid)" strokeWidth="0.5" opacity="0.3">
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
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('/shop')}
            className="flex items-center gap-2 font-bold mb-8 px-4 py-2 rounded-lg transition-all duration-300"
            style={{
              color: '#FF006E',
              textShadow: '0 0 15px #FF006E',
            }}
          >
            ← Back to Shop
          </motion.button>

          {/* Product Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* 3D Viewer Section */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col"
            >
              {/* Main 3D Viewer */}
              <div
                className="w-full rounded-2xl overflow-hidden mb-6 backdrop-blur-sm"
                style={{
                  border: '3px solid #00D9FF',
                  background: 'rgba(10, 14, 39, 0.5)',
                  boxShadow: '0 0 30px rgba(0, 217, 255, 0.4), inset 0 0 30px rgba(0, 217, 255, 0.1)',
                  minHeight: '500px',
                }}
              >
                <Product3DViewer
                  modelPath={product.model_url}
                  modelScale={2}
                  enableAutoRotate={true}
                  rotationSpeed={0.005}
                />
              </div>

              {/* Thumbnail Images */}
              <div>
                <p 
                  className="text-sm font-semibold mb-3"
                  style={{
                    textShadow: '0 0 10px #00D9FF',
                    color: '#00D9FF',
                  }}
                >
                  More Views
                </p>
                <div className="flex gap-3">
                  {product.images?.slice(0, 3).map((img: string, idx: number) => (
                    <motion.img
                      key={idx}
                      src={img}
                      alt={`View ${idx + 1}`}
                      className="w-20 h-20 rounded-lg object-cover cursor-pointer hover:border-neon-pink border-2 border-neon-cyan transition-all duration-300"
                      style={{
                        boxShadow: '0 0 15px rgba(0, 217, 255, 0.3)',
                      }}
                      whileHover={{ scale: 1.1 }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Product Details Section */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-col justify-start space-y-6"
            >
              {/* Title */}
              <div>
                <h1
                  className="text-5xl md:text-6xl font-black mb-4 leading-tight"
                  style={{
                    textShadow: '0 0 40px #FF006E, 0 0 80px #FF006E, 0 0 30px #00D9FF',
                    background: 'linear-gradient(135deg, #FF006E 0%, #B800E8 50%, #00D9FF 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {product.name}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-2xl">
                        {i < Math.floor(actualRating) ? '★' : '☆'}
                      </span>
                    ))}
                  </div>
                  <span 
                    className="text-lg font-bold"
                    style={{
                      textShadow: '0 0 15px #00D9FF',
                      color: '#00D9FF',
                    }}
                  >
                    {actualRating > 0 ? actualRating.toFixed(1) : 'No ratings'} ({actualReviewCount} reviews)
                  </span>
                </div>

                <p 
                  className="text-lg mb-4"
                  style={{
                    color: '#00F0FF',
                    textShadow: '0 0 10px #00D9FF',
                  }}
                >
                  {product.description}
                </p>

                {/* Features */}
                {product.features && (
                  <div className="space-y-2">
                    {product.features.map((feature: string, index: number) => (
                      <div key={index} className="flex items-center gap-3">
                        <span 
                          className="w-2 h-2 rounded-full"
                          style={{
                            backgroundColor: '#FF006E',
                            boxShadow: '0 0 10px #FF006E',
                          }}
                        />
                        <span className="text-neon-white">{feature}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Price & Stock */}
              <div 
                className="py-6 px-6 rounded-xl backdrop-blur-sm"
                style={{
                  border: '2px solid #FF006E',
                  background: 'rgba(255, 0, 110, 0.1)',
                  boxShadow: '0 0 20px rgba(255, 0, 110, 0.3)',
                }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="text-5xl font-black"
                    style={{
                      textShadow: '0 0 30px #00D9FF',
                      color: '#00D9FF',
                    }}
                  >
                    {product.price.toFixed(2)} DA
                  </span>
                  <span
                    className={`px-6 py-3 rounded-lg font-bold text-lg ${
                      product.stock > 0
                        ? ''
                        : 'opacity-50'
                    }`}
                    style={{
                      background: product.stock > 0 
                        ? 'rgba(0, 255, 65, 0.2)'
                        : 'rgba(255, 0, 0, 0.2)',
                      border: `2px solid ${product.stock > 0 ? '#00FF41' : '#FF0000'}`,
                      color: product.stock > 0 ? '#00FF41' : '#FF0000',
                      textShadow: `0 0 15px ${product.stock > 0 ? '#00FF41' : '#FF0000'}`,
                    }}
                  >
                    {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                  </span>
                </div>
              </div>

              {/* Product Options */}
              {product.stock > 0 && (
                <div className="space-y-6">
                  {/* Color Selector - Always Visible */}
                  <div className="rounded-xl p-6 backdrop-blur-sm" style={{
                    border: '2px solid #FF006E',
                    background: 'rgba(255, 0, 110, 0.1)',
                    boxShadow: '0 0 20px rgba(255, 0, 110, 0.3)',
                  }}>
                    <label 
                      className="block text-lg font-bold mb-4"
                      style={{
                        textShadow: '0 0 15px #FF006E',
                        color: '#FF006E',
                      }}
                    >
                      👗 Color: <span className="ml-2 text-neon-cyan" style={{ textShadow: '0 0 10px #00D9FF' }}>{selectedColor}</span>
                    </label>
                    <div className="flex flex-wrap gap-4">
                      {(() => {
                        const colors = product.colors && product.colors.length > 0 ? product.colors : DEFAULT_COLORS;
                        return colors.map((color: any, idx: number) => {
                          const colorName = typeof color === 'string' ? color : color.name;
                          const colorHex = typeof color === 'object' ? color.hex : '#CCCCCC';
                          const isSelected = selectedColor === colorName;
                          return (
                            <motion.button
                              key={idx}
                              whileHover={{ scale: 1.15 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setSelectedColor(colorName)}
                              className="relative group transition-all duration-300"
                            >
                              <div
                                className="w-10 h-10 rounded-full border-2 transition-all duration-300"
                                style={{
                                  backgroundColor: colorHex,
                                  borderColor: isSelected ? '#00D9FF' : 'rgba(255, 255, 255, 0.3)',
                                  boxShadow: isSelected
                                    ? `0 0 15px ${colorHex}, ring-2 ring-offset-2 ring-white`
                                    : `inset 0 0 5px rgba(0, 0, 0, 0.5)`,
                                }}
                              />
                              {isSelected && (
                                <motion.div
                                  layoutId="colorRing"
                                  className="absolute inset-0 rounded-full border-2 border-white ring-2 ring-offset-2 ring-white"
                                  style={{
                                    boxShadow: '0 0 15px rgba(255, 255, 255, 0.8)',
                                  }}
                                />
                              )}
                              <span 
                                className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 text-xs font-bold whitespace-nowrap px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity bg-neon-black/80 border border-neon-cyan"
                                style={{
                                  color: '#00D9FF',
                                  textShadow: '0 0 10px #00D9FF',
                                }}
                              >
                                {colorName}
                              </span>
                            </motion.button>
                          );
                        });
                      })()}
                    </div>
                  </div>

                  {/* Size Selector - Always Visible */}
                  <div className="rounded-xl p-6 backdrop-blur-sm" style={{
                    border: '2px solid #00D9FF',
                    background: 'rgba(0, 217, 255, 0.1)',
                    boxShadow: '0 0 20px rgba(0, 217, 255, 0.3)',
                  }}>
                    <label 
                      className="block text-lg font-bold mb-4"
                      style={{
                        textShadow: '0 0 15px #00D9FF',
                        color: '#00D9FF',
                      }}
                    >
                      📏 Size: <span className="ml-2 text-neon-pink" style={{ textShadow: '0 0 10px #FF006E' }}>{selectedSize}</span>
                      <span className="text-sm ml-3 opacity-60 font-normal">Size Guide →</span>
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {(() => {
                        const sizes = product.sizes && product.sizes.length > 0 ? product.sizes : DEFAULT_SIZES;
                        return sizes.map((size: string) => (
                          <motion.button
                            key={size}
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.92 }}
                            onClick={() => setSelectedSize(size)}
                            className="px-6 py-3 rounded-lg font-bold transition-all duration-300 min-w-[60px]"
                            style={{
                              border: selectedSize === size ? '3px solid #FF006E' : '2px solid rgba(255, 255, 255, 0.2)',
                              background: selectedSize === size
                                ? 'rgba(255, 0, 110, 0.3)'
                                : 'rgba(255, 255, 255, 0.05)',
                              color: selectedSize === size ? '#FF006E' : '#00D9FF',
                              textShadow: selectedSize === size
                                ? '0 0 10px #FF006E'
                                : '0 0 10px #00D9FF',
                              boxShadow: selectedSize === size
                                ? '0 0 20px rgba(255, 0, 110, 0.6), inset 0 0 10px rgba(255, 0, 110, 0.2)'
                                : '0 0 10px rgba(0, 217, 255, 0.2)',
                            }}
                          >
                            {size}
                          </motion.button>
                        ));
                      })()}
                    </div>
                  </div>

                  {/* Quantity */}
                  <div>
                    <label 
                      className="block text-lg font-bold mb-4"
                      style={{
                        textShadow: '0 0 15px #FF006E',
                        color: '#FF006E',
                      }}
                    >
                      Quantity
                    </label>
                    <div className="flex items-center gap-4">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-12 h-12 rounded-lg font-bold text-xl flex items-center justify-center"
                        style={{
                          border: '2px solid #00D9FF',
                          background: 'rgba(0, 217, 255, 0.1)',
                          color: '#00D9FF',
                          boxShadow: '0 0 15px rgba(0, 217, 255, 0.3)',
                        }}
                      >
                        −
                      </motion.button>
                      <span 
                        className="flex-1 text-center text-3xl font-black"
                        style={{
                          textShadow: '0 0 20px #FF006E',
                          color: '#FF006E',
                        }}
                      >
                        {quantity}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className="w-12 h-12 rounded-lg font-bold text-xl flex items-center justify-center"
                        style={{
                          border: '2px solid #FF006E',
                          background: 'rgba(255, 0, 110, 0.1)',
                          color: '#FF006E',
                          boxShadow: '0 0 15px rgba(255, 0, 110, 0.3)',
                        }}
                      >
                        +
                      </motion.button>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className="w-full py-5 font-black text-xl rounded-xl transition-all duration-300 flex items-center justify-center gap-3"
                    style={{
                      border: '3px solid #FF006E',
                      background: 'rgba(255, 0, 110, 0.2)',
                      color: '#FF006E',
                      boxShadow: isAdding
                        ? '0 0 30px rgba(255, 0, 110, 0.6)'
                        : '0 0 25px rgba(255, 0, 110, 0.5)',
                      opacity: isAdding ? 0.8 : 1,
                    }}
                  >
                    {isAdding ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-5 h-5 border-2 border-neon-pink border-t-transparent rounded-full"
                        />
                        Adding...
                      </>
                    ) : (
                      <>
                        🛒 Add to Cart
                      </>
                    )}
                  </motion.button>
                </div>
              )}

              {product.stock === 0 && (
                <motion.button
                  disabled
                  className="w-full py-5 font-black text-xl rounded-xl"
                  style={{
                    border: '3px solid #FF0000',
                    background: 'rgba(255, 0, 0, 0.2)',
                    color: '#FF0000',
                    boxShadow: '0 0 25px rgba(255, 0, 0, 0.4)',
                  }}
                >
                  ✗ Out of Stock
                </motion.button>
              )}
            </motion.div>
          </div>

          {/* Reviews Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-16 rounded-2xl overflow-hidden backdrop-blur-sm"
            style={{
              border: '3px solid #00D9FF',
              background: 'rgba(10, 14, 39, 0.5)',
              boxShadow: '0 0 30px rgba(0, 217, 255, 0.3)',
            }}
          >
            <div className="p-8">
              <h2
                className="text-4xl font-black mb-8"
                style={{
                  textShadow: '0 0 30px #00D9FF, 0 0 60px #FF006E',
                  background: 'linear-gradient(135deg, #00D9FF 0%, #FF006E 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Customer Reviews
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {displayReviews.slice(0, 3).map((review, idx) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="p-6 rounded-xl"
                    style={{
                      border: '2px solid #FF006E',
                      background: 'rgba(255, 0, 110, 0.1)',
                      boxShadow: '0 0 15px rgba(255, 0, 110, 0.3)',
                    }}
                  >
                    <div className="flex gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-lg">
                          {i < review.rating ? '★' : '☆'}
                        </span>
                      ))}
                    </div>
                    {review.is_verified && (
                      <span
                        className="text-xs px-3 py-1 rounded-full font-bold mb-3 inline-block"
                        style={{
                          background: 'rgba(0, 255, 65, 0.2)',
                          color: '#00FF41',
                          border: '1px solid #00FF41',
                        }}
                      >
                        ✓ Verified
                      </span>
                    )}
                    <p className="text-sm leading-relaxed">{review.comment}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Related Products */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2
              className="text-4xl font-black mb-8"
              style={{
                textShadow: '0 0 30px #FF006E, 0 0 60px #00D9FF',
                background: 'linear-gradient(135deg, #FF006E 0%, #00D9FF 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              You Might Also Like
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((related: any, idx: number) => (
                <motion.div
                  key={related.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  onClick={() => navigate(`/product/${related.id}`)}
                  className="cursor-pointer rounded-xl overflow-hidden backdrop-blur-sm group"
                  style={{
                    border: '2px solid #00D9FF',
                    background: 'rgba(10, 14, 39, 0.5)',
                    boxShadow: '0 0 20px rgba(0, 217, 255, 0.3)',
                  }}
                >
                  <div className="relative overflow-hidden h-48 bg-gradient-to-br from-neon-black to-neon-black/50">
                    <img
                      src={related.image_url}
                      alt={related.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3
                      className="font-bold text-sm line-clamp-2 mb-2"
                      style={{
                        color: '#FF006E',
                        textShadow: '0 0 10px #FF006E',
                      }}
                    >
                      {related.name}
                    </h3>
                    <p
                      className="text-lg font-black"
                      style={{
                        color: '#00D9FF',
                        textShadow: '0 0 10px #00D9FF',
                      }}
                    >
                      {related.price.toFixed(2)} DA
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
