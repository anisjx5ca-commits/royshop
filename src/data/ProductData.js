/**
 * Product Data
 * 
 * This file contains the complete product catalog for RoyShop.
 * All products are initialized with:
 * - rating: 0 (zero-trust system - no fake reviews)
 * - reviewCount: 0 (no pre-loaded reviews)
 * 
 * Images and 3D models should be placed in public/assets/images/ and public/models/
 */

export const products = [
  {
    id: 1,
    name: 'Premium Cotton T-Shirt',
    category: 'mens',
    price: 2500,
    image: '/assets/images/tshirt-white.jpg',
    modelPath: '/models/tshirt-sample.glb',
    colors: ['White', 'Black', 'Navy', 'Gray'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    description: 'High-quality cotton t-shirt with modern design. Perfect for daily wear with comfortable fit.',
    material: '100% Cotton',
    care: 'Machine wash cold. Do not bleach. Tumble dry low.',
    rating: 0,
    reviewCount: 0,
    inStock: true,
    tags: ['cotton', 'casual', 'comfortable'],
  },
  {
    id: 2,
    name: 'Classic Denim Jeans',
    category: 'mens',
    price: 5500,
    image: '/assets/images/jeans-blue.jpg',
    modelPath: '/models/jeans-sample.glb',
    colors: ['Light Blue', 'Dark Blue', 'Black', 'Gray'],
    sizes: ['28', '30', '32', '34', '36', '38', '40'],
    description: 'Timeless denim jeans with a perfect fit. Durable and stylish for any occasion.',
    material: '98% Cotton, 2% Elastane',
    care: 'Wash inside out. Cold water preferred. Air dry.',
    rating: 0,
    reviewCount: 0,
    inStock: true,
    tags: ['denim', 'jeans', 'casual'],
  },
  {
    id: 3,
    name: 'Elegant Casual Shirt',
    category: 'mens',
    price: 4200,
    image: '/assets/images/shirt-blue.jpg',
    modelPath: '/models/shirt-sample.glb',
    colors: ['Light Blue', 'White', 'Pink', 'Black'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Smart casual shirt perfect for office or weekend outings. Premium fabric with breathable feel.',
    material: '65% Polyester, 35% Cotton',
    care: 'Machine wash warm. Iron on medium heat if needed.',
    rating: 0,
    reviewCount: 0,
    inStock: true,
    tags: ['casual', 'shirt', 'office-wear'],
  },
  {
    id: 4,
    name: 'Lightweight Jacket',
    category: 'mens',
    price: 7500,
    image: '/assets/images/jacket-black.jpg',
    modelPath: '/models/jacket-sample.glb',
    colors: ['Black', 'Navy', 'Olive', 'Brown'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Versatile lightweight jacket ideal for spring and autumn. Wind-resistant and water-repellent.',
    material: '100% Polyester',
    care: 'Dry clean recommended. Spot clean with mild soap.',
    rating: 0,
    reviewCount: 0,
    inStock: true,
    tags: ['jacket', 'outdoor', 'weather-resistant'],
  },
  {
    id: 5,
    name: 'Premium Polo Shirt',
    category: 'mens',
    price: 3800,
    image: '/assets/images/polo-green.jpg',
    modelPath: '/models/polo-sample.glb',
    colors: ['Green', 'Blue', 'Red', 'White', 'Black'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Classic polo shirt made from premium pique cotton. Perfect for casual or semi-formal settings.',
    material: '100% Cotton Pique',
    care: 'Machine wash warm. Iron on medium heat if needed.',
    rating: 0,
    reviewCount: 0,
    inStock: true,
    tags: ['polo', 'cotton', 'casual'],
  },
  {
    id: 6,
    name: 'Athletic Sports Shorts',
    category: 'mens',
    price: 2200,
    image: '/assets/images/shorts-black.jpg',
    modelPath: '/models/shorts-sample.glb',
    colors: ['Black', 'Blue', 'Gray', 'Red'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Comfortable athletic shorts with quick-dry technology. Ideal for gym, running, and outdoor activities.',
    material: '88% Nylon, 12% Spandex',
    care: 'Machine wash cold. Air dry recommended.',
    rating: 0,
    reviewCount: 0,
    inStock: true,
    tags: ['sports', 'athletic', 'shorts'],
  },
  {
    id: 7,
    name: 'Wool Winter Sweater',
    category: 'mens',
    price: 6800,
    image: '/assets/images/sweater-gray.jpg',
    modelPath: '/models/sweater-sample.glb',
    colors: ['Gray', 'Navy', 'Black', 'Cream'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Warm and cozy wool sweater perfect for winter. Soft texture with classic design.',
    material: '80% Wool, 20% Acrylic',
    care: 'Hand wash in cool water. Lay flat to dry.',
    rating: 0,
    reviewCount: 0,
    inStock: true,
    tags: ['sweater', 'wool', 'winter'],
  },
  {
    id: 8,
    name: 'Formal Dress Pants',
    category: 'mens',
    price: 5900,
    image: '/assets/images/pants-black.jpg',
    modelPath: '/models/pants-sample.glb',
    colors: ['Black', 'Navy', 'Gray', 'Brown'],
    sizes: ['28', '30', '32', '34', '36', '38', '40'],
    description: 'Professional formal pants suitable for office and formal occasions. Premium fabric with perfect fit.',
    material: '55% Polyester, 45% Wool',
    care: 'Dry clean recommended for best results.',
    rating: 0,
    reviewCount: 0,
    inStock: true,
    tags: ['formal', 'pants', 'office-wear'],
  },
];

/**
 * Get product by ID
 * @param {number} productId - The product ID
 * @returns {Object|null} The product object or null if not found
 */
export const getProductById = (productId) => {
  return products.find((product) => product.id === productId) || null;
};

/**
 * Get all products by category
 * @param {string} category - The category name (e.g., 'mens', 'womens')
 * @returns {Array} Array of products in the specified category
 */
export const getProductsByCategory = (category) => {
  return products.filter((product) => product.category === category);
};

/**
 * Search products by name or description
 * @param {string} query - The search query
 * @returns {Array} Array of matching products
 */
export const searchProducts = (query) => {
  const lowerQuery = query.toLowerCase();
  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(lowerQuery) ||
      product.description.toLowerCase().includes(lowerQuery) ||
      product.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
};

/**
 * Get available categories
 * @returns {Array} Unique list of product categories
 */
export const getCategories = () => {
  return [...new Set(products.map((p) => p.category))];
};

/**
 * Get products sorted by price
 * @param {string} order - 'asc' for ascending, 'desc' for descending
 * @returns {Array} Sorted array of products
 */
export const getProductsSortedByPrice = (order = 'asc') => {
  const sorted = [...products].sort((a, b) => a.price - b.price);
  return order === 'desc' ? sorted.reverse() : sorted;
};
