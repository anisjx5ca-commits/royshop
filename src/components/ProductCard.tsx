import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaStar } from 'react-icons/fa';
import { useCartStore } from '../store/cartStore.ts';

interface Product {
  id: string | number;
  name: string;
  price: number;
  image?: string;
  image_url?: string;
  rating?: number;
  reviewCount?: number;
  stock?: number;
  inStock?: boolean;
  description?: string;
  [key: string]: any;
}

interface ProductCardProps {
  product: Product;
  id?: string;
  name?: string;
  price?: number;
  image?: string;
  rating?: number;
  inStock?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  id: propId,
  name: propName,
  price: propPrice,
  image: propImage,
  rating: propRating = 4.5,
  inStock: propInStock,
}) => {
  // Use product prop if provided, otherwise use individual props
  const productId = (product?.id || propId)?.toString();
  const productName = product?.name || propName || 'Product';
  const productPrice = product?.price || propPrice || 0;
  const productImage = product?.image || product?.image_url || propImage || '/assets/images/placeholder.jpg';
  const productRating = product?.rating || propRating;
  const isInStock = product?.inStock ?? (product?.stock !== undefined ? product.stock > 0 : propInStock ?? true);

  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      id: `${productId}-default`,
      modelId: productId || 'unknown',
      name: productName,
      price: productPrice,
      image: productImage,
      color: 'Default',
      size: 'M',
      quantity: 1,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="bg-gradient-to-br from-neon-black/40 to-neon-black/20 backdrop-blur-sm rounded-2xl overflow-hidden border-2 border-neon-blue/30 hover:border-neon-pink/50 transition-all duration-300 group"
      style={{
        boxShadow: '0 0 30px rgba(0, 217, 255, 0.2), inset 0 0 30px rgba(0, 217, 255, 0.05)',
      }}
    >
      <Link to={`/product/${productId}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-neon-black/50 border-b-2 border-neon-blue/30">
          <img
            src={productImage}
            alt={productName}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300 group-hover:brightness-110"
          />
          {!isInStock && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <span className="text-neon-pink font-bold text-lg">Out of Stock</span>
            </div>
          )}
          {isInStock && (
            <div className="absolute top-3 right-3 bg-neon-pink/80 text-neon-black px-3 py-1 rounded-full text-xs font-bold">
              In Stock
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 
            className="font-bold text-lg truncate group-hover:text-neon-pink transition-colors duration-300"
            style={{
              color: '#00D9FF',
              textShadow: '0 0 10px #00D9FF',
            }}
          >
            {productName}
          </h3>

          <div className="flex items-center justify-between mt-3">
            <span 
              className="text-2xl font-bold"
              style={{
                color: '#FF006E',
                textShadow: '0 0 10px #FF006E',
              }}
            >
              {productPrice.toFixed(0)} DA
            </span>
            <div className="flex items-center gap-1 bg-neon-black/50 px-2 py-1 rounded">
              <FaStar className="text-yellow-400" size={14} />
              <span 
                className="text-sm font-semibold"
                style={{ color: '#00D9FF' }}
              >
                {productRating?.toFixed(1) || '0.0'}
              </span>
            </div>
          </div>
        </div>
      </Link>

      {isInStock && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddToCart}
          className="w-full m-4 mt-2 bg-neon-black border-2 border-neon-pink text-neon-white font-bold py-3 rounded-lg hover:border-neon-blue transition-all duration-300 flex items-center justify-center gap-2"
          style={{
            boxShadow: '0 0 20px rgba(255, 0, 110, 0.5)',
          }}
        >
          <FaShoppingCart size={18} />
          <span>Add to Cart</span>
        </motion.button>
      )}
    </motion.div>
  );
};
