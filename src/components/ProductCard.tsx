import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaStar } from 'react-icons/fa';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  rating?: number;
  inStock: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  image,
  rating = 4.5,
  inStock,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-lg overflow-hidden shadow-card hover:shadow-card-lg transition-shadow"
    >
      <Link to={`/product/${id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
          />
          {!inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-bold">Out of Stock</span>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-primary text-lg truncate hover:text-accent">
            {name}
          </h3>

          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl font-bold text-accent">{price.toFixed(2)} DA</span>
            <div className="flex items-center gap-1">
              <FaStar className="text-yellow-400" size={14} />
              <span className="text-sm text-gray-600">{rating.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </Link>

      {inStock && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full py-2 bg-accent text-white font-semibold flex items-center justify-center gap-2 hover:bg-accent-light transition-colors"
        >
          <FaShoppingCart size={16} /> Quick View
        </motion.button>
      )}
    </motion.div>
  );
};
