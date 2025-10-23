"use client";

import React, { useState, useMemo } from 'react';
// import SplashCursor from '../components/ui/splash-cursor';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingCart, } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useRouter } from 'next/navigation';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  isOnSale: boolean;
}

const AllProducts = () => {
  const router = useRouter();
  const [priceRange, setPriceRange] = useState([35, 80]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedShoeSizes, setSelectedShoeSizes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('default');
  const [isLoading, setIsLoading] = useState<{[key: number]: {cart: boolean, favorite: boolean}}>({});
  const [isFilterOpen, setIsFilterOpen] = useState(false); // State for mobile filter toggle

  const { addToCart, removeFromCart, addToFavorites, removeFromFavorites, isInCart, isInFavorites } = useCart();

  const products: Product[] = useMemo(() => [
    {
      id: 1,
      name: 'Classic Blue T-Shirt',
      price: 25.99,
      originalPrice: 35.99,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=250&fit=crop&crop=center',
      isOnSale: true,
    },
    {
      id: 2,
      name: 'Red Hoodie',
      price: 45.00,
      image: 'https://images.unsplash.com/photo-1521334884684-d80222895322?w=200&h=250&fit=crop&crop=center',
      isOnSale: false,
    },
    {
      id: 3,
      name: 'Green Sneakers',
      price: 55.00,
      originalPrice: 75.00,
      image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=200&h=250&fit=crop&crop=center',
      isOnSale: true,
    },
    {
      id: 4,
      name: 'Black Leather Jacket',
      price: 120.00,
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=200&h=250&fit=crop&crop=center',
      isOnSale: false,
    },
    {
      id: 5,
      name: 'White Summer Dress',
      price: 38.99,
      originalPrice: 55.99,
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=200&h=250&fit=crop&crop=center',
      isOnSale: true,
    },
    {
      id: 6,
      name: 'Denim Jeans',
      price: 49.99,
      image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=250&fit=crop&crop=center',
      isOnSale: false,
    },
    {
      id: 7,
      name: 'Striped Polo Shirt',
      price: 32.50,
      originalPrice: 45.00,
      image: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=200&h=250&fit=crop&crop=center',
      isOnSale: true,
    },
    {
      id: 8,
      name: 'Brown Ankle Boots',
      price: 85.00,
      image: 'https://images.unsplash.com/photo-1605812860427-4024433a70fd?w=200&h=250&fit=crop&crop=center',
      isOnSale: false,
    },
    {
      id: 9,
      name: 'Gray Sweatpants',
      price: 28.99,
      originalPrice: 39.99,
      image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=200&h=250&fit=crop&crop=center',
      isOnSale: true,
    },
    {
      id: 10,
      name: 'Floral Blouse',
      price: 42.00,
      image: 'https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=200&h=250&fit=crop&crop=center',
      isOnSale: false,
    },
    {
      id: 11,
      name: 'Running Shoes',
      price: 65.99,
      originalPrice: 89.99,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=250&fit=crop&crop=center',
      isOnSale: true,
    },
    {
      id: 12,
      name: 'Wool Beanie',
      price: 18.50,
      image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=200&h=250&fit=crop&crop=center',
      isOnSale: false,
    },
    {
      id: 13,
      name: 'Plaid Flannel Shirt',
      price: 36.00,
      originalPrice: 48.00,
      image: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=200&h=250&fit=crop&crop=center',
      isOnSale: true,
    },
    {
      id: 14,
      name: 'Cargo Shorts',
      price: 34.99,
      image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=200&h=250&fit=crop&crop=center',
      isOnSale: false,
    },
    {
      id: 16,
      name: 'Winter Parka',
      price: 150.00,
      image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=200&h=250&fit=crop&crop=center',
      isOnSale: false,
    },
    {
      id: 17,
      name: 'Canvas Backpack',
      price: 44.99,
      originalPrice: 59.99,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=250&fit=crop&crop=center',
      isOnSale: true,
    },
    {
      id: 18,
      name: 'Sunglasses',
      price: 79.00,
      image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200&h=250&fit=crop&crop=center',
      isOnSale: false,
    },
    {
      id: 19,
      name: 'Knit Cardigan',
      price: 52.50,
      originalPrice: 70.00,
      image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=200&h=250&fit=crop&crop=center',
      isOnSale: true,
    },
    {
      id: 20,
      name: 'Athletic Shorts',
      price: 26.99,
      image: 'https://images.unsplash.com/photo-1519659528534-7fd733a832a0?w=200&h=250&fit=crop&crop=center',
      isOnSale: false,
    },
    {
      id: 21,
      name: 'Leather Belt',
      price: 29.99,
      originalPrice: 42.99,
      image: 'https://images.unsplash.com/photo-150708020285-8f7f6c9f3b1c?w=200&h=250&fit=crop&crop=center',
      isOnSale: true,
    },
    {
      id: 22,
      name: 'Winter Jacket',
      price: 130.00,
      image: 'https://images.unsplash.com/photo-1542068829-1115f7259450?w=200&h=250&fit=crop&crop=center',
      isOnSale: false,
    },
    {
      id: 23,
      name: 'Graphic T-Shirt',
      price: 22.50,
      originalPrice: 30.00,
      image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=200&h=250&fit=crop&crop=center',
      isOnSale: true,
    },
    { 
      id: 24,
      name: 'Chino Pants',
      price: 48.00,
      image: 'https://images.unsplash.com/photo-1521334884684-d80222895322?w=200&h=250&fit=crop&crop=center',
      isOnSale: false,  
    },
    
  ], []);


  const colors = ['Blue', 'Green', 'Red'];
  const sizes = ['Extra Large', 'Large', 'Medium', 'Small'];
  const shoeSizes = ['36', '38', '40'];

  const handleColorChange = (color: string) => {
    setSelectedColors(prev =>
      prev.includes(color)
        ? prev.filter(c => c !== color)
        : [...prev, color]
    );
  };

  const handleSizeChange = (size: string) => {
    setSelectedSizes(prev =>
      prev.includes(size)
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  };

  const handleShoeSizeChange = (size: string) => {
    setSelectedShoeSizes(prev =>
      prev.includes(size)
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  };

  // Cart and Favorite handlers
  const handleAddToCart = async (productId: number) => {
    setIsLoading(prev => ({ ...prev, [productId]: { ...prev[productId], cart: true } }));

    try {
      // Simulate API call - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));

      // Find the product to add to cart
      const product = products.find(p => p.id === productId);
      if (product) {
        if (isInCart(productId.toString())) {
          removeFromCart(productId.toString());
        } else {
          addToCart({
            id: productId.toString(),
            name: product.name,
            price: product.price,
            image: product.image,
            size: 'M', // Default size
            color: 'Default' // Default color
          });
        }
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsLoading(prev => ({ ...prev, [productId]: { ...prev[productId], cart: false } }));
    }
  };

  const handleToggleFavorite = async (productId: number) => {
    setIsLoading(prev => ({ ...prev, [productId]: { ...prev[productId], favorite: true } }));

    try {
      // Simulate API call - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));

      // Find the product to add to favorites
      const product = products.find(p => p.id === productId);
      if (product) {
        if (isInFavorites(productId.toString())) {
          removeFromFavorites(productId.toString());
        } else {
          addToFavorites({
            productId: productId.toString(),
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice,
            image: product.image,
            stock: 10 // Default stock
          });
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsLoading(prev => ({ ...prev, [productId]: { ...prev[productId], favorite: false } }));
    }
  };

  // Handle product click to navigate to product detail page
  const handleProductClick = (productId: number) => {
    router.push(`/productpage?id=${productId}`);
  };

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    const filtered = products.filter(product => {
      // Price filter
      if (product.price < priceRange[0] || product.price > priceRange[1]) {
        return false;
      }

      // Color filter (basic implementation - you can expand this based on actual product data)
      if (selectedColors.length > 0) {
        const productColor = product.name.toLowerCase();
        const hasMatchingColor = selectedColors.some(color =>
          productColor.includes(color.toLowerCase())
        );
        if (!hasMatchingColor) {
          return false;
        }
      }

      // Size filter (basic implementation - you can expand this based on actual product data)
      if (selectedSizes.length > 0 || selectedShoeSizes.length > 0) {
        // This is a simplified filter - in a real app, you'd have size data per product
        return true; // For now, we'll show all products if any size filter is active
      }

      return true;
    });

    // Sort products
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return a.id - b.id; // Default sorting by ID
      }
    });

    return sorted;
  }, [products, priceRange, selectedColors, selectedSizes, selectedShoeSizes, sortBy]);

  return (
    <>
      {/* <SplashCursor /> */}
      <div className="min-h-screen bg-background text-foreground">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Shop</h1>
            <nav className="text-muted-foreground">
              Home / Shop
            </nav>
          </div>

          <div className="flex flex-col lg:flex-row lg:gap-8">
            {/* Filter Toggle Button for Mobile */}
            <button
              className="lg:hidden bg-primary text-primary-foreground py-2 px-4 rounded-lg mb-4"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
            </button>

            {/* Sidebar Filters */}
            <aside className={`w-full lg:w-64 flex-shrink-0 mb-8 lg:mb-0 ${isFilterOpen ? 'block' : 'hidden'} lg:block`}>
              <div className="lg:sticky lg:top-8">
                {/* Price Filter */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Price</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Min. Price</span>
                    <span className="font-semibold">${priceRange[0]}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Max. Price</span>
                    <span className="font-semibold">${priceRange[1]}</span>
                  </div>
                  <div className="relative">
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>$0</span>
                      <span>$200</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Color Filter */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Color</h3>
                <div className="space-y-3">
                  {colors.map(color => (
                    <label key={color} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedColors.includes(color)}
                        onChange={() => handleColorChange(color)}
                        className="mr-3 w-4 h-4 text-green-500 bg-gray-700 border-gray-600 rounded focus:ring-green-500"
                      />
                      <span className="text-muted-foreground">{color}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Size Filter */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Size</h3>
                <div className="space-y-3">
                  {sizes.map(size => (
                    <label key={size} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedSizes.includes(size)}
                        onChange={() => handleSizeChange(size)}
                        className="mr-3 w-4 h-4 text-green-500 bg-gray-700 border-gray-600 rounded focus:ring-green-500"
                      />
                      <span className="text-muted-foreground">{size}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Shoe Size Filter */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Clothes Size</h3>
                <div className="space-y-3">
                  {shoeSizes.map(size => (
                    <label key={size} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedShoeSizes.includes(size)}
                        onChange={() => handleShoeSizeChange(size)}
                        className="mr-3 w-4 h-4 text-green-500 bg-gray-700 border-gray-600 rounded focus:ring-green-500"
                      />
                      <span className="text-muted-foreground">{size}</span>
                    </label>
                  ))}
                </div>
              </div>
              </div> {/* Closing tag for lg:sticky div */}
            </aside>

            {/* Main Content */}
            <main className="flex-1">
              {/* Top Bar */}
              <div className="flex justify-between items-center mb-8">
                <p className="text-muted-foreground">Showing {filteredAndSortedProducts.length} of {products.length} results</p>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-transparent border border-gray-600 px-4 py-2 pr-8 rounded focus:outline-none focus:border-green-500"
                  >
                    <option value="default" className="bg-black">Default sorting</option>
                    <option value="price-low" className="bg-black">Price: Low to High</option>
                    <option value="price-high" className="bg-black">Price: High to Low</option>
                    <option value="name" className="bg-black">Name: A to Z</option>
                  </select>
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Product Grid */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={filteredAndSortedProducts.length}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {filteredAndSortedProducts.map((product, index) => (
                    <motion.div
                      key={`${product.id}-${sortBy}`}
                      className="group"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{
                        duration: 0.3,
                        delay: index * 0.05,
                        ease: "easeOut"
                      }}
                      layout
                    >
                      <motion.div
                        className="relative overflow-hidden rounded-lg mb-4"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="aspect-[3/4] bg-muted flex items-center justify-center cursor-pointer" onClick={() => handleProductClick(product.id)}>
                          <Image
                            width={100}
                            height={133}
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=250&fit=crop&crop=center';
                            }}
                          />
                        </div>
                        {product.isOnSale && (
                          <motion.div
                            className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-semibold"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                          >
                            Sale
                          </motion.div>
                        )}
                        <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />

                        {/* Action Buttons */}
                        <div className="absolute top-2 left-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleFavorite(product.id);
                            }}
                            disabled={isLoading[product.id]?.favorite}
                            className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
                              isInFavorites(product.id.toString())
                                ? 'bg-red-500 text-white'
                                : 'bg-black/80 text-white hover:bg-black/90'
                            }`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {isLoading[product.id]?.favorite ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Heart
                                className={`w-4 h-4 ${isInFavorites(product.id.toString()) ? 'fill-current' : ''}`}
                              />
                            )}
                          </motion.button>

                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(product.id);
                            }}
                            disabled={isLoading[product.id]?.cart}
                            className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
                              isInCart(product.id.toString())
                                ? 'bg-blue-500 text-white'
                                : 'bg-black/80 text-white hover:bg-black/90'
                            }`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {isLoading[product.id]?.cart ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <ShoppingCart className="w-4 h-4" />
                            )}
                          </motion.button>
                        </div>
                      </motion.div>

                      <motion.div
                        className="space-y-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        <h3 className="font-semibold text-lg cursor-pointer" onClick={() => handleProductClick(product.id)}>{product.name}</h3>
                        <div className="flex items-center space-x-2">
                          <motion.span
                            className="text-blue-500 font-bold text-xl"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
                          >
                            ${product.price.toFixed(2)}
                          </motion.span>
                          {product.originalPrice && (
                            <motion.span
                              className="text-muted-foreground line-through"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.2 }}
                            >
                              ${product.originalPrice.toFixed(2)}
                            </motion.span>
                          )}
                        </div>

                        {/* Bottom Action Buttons */}
                        <div className="flex gap-2 pt-2">
                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(product.id);
                            }}
                            disabled={isLoading[product.id]?.cart}
                            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all duration-200 ${
                              isInCart(product.id.toString())
                                ? 'bg-blue-500 text-white'
                                : 'bg-secondary text-secondary-foreground hover:bg-accent'
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {isLoading[product.id]?.cart ? (
                              <div className="flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>Loading...</span>
                              </div>
                            ) : isInCart(product.id.toString()) ? (
                              'Remove from Cart'
                            ) : (
                              'Add to Cart'
                            )}
                          </motion.button>

                          <motion.button
                            onClick={() => handleToggleFavorite(product.id)}
                            disabled={isLoading[product.id]?.favorite}
                            className={`p-2 rounded-lg font-semibold transition-all duration-200 ${
                              isInFavorites(product.id.toString())
                                ? 'bg-red-500 text-white'
                                : 'bg-secondary text-secondary-foreground hover:bg-accent'
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {isLoading[product.id]?.favorite ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Heart className={`w-4 h-4 ${isInFavorites(product.id.toString()) ? 'fill-current' : ''}`} />
                            )}
                          </motion.button>
                        </div>
                      </motion.div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default AllProducts;
