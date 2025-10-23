"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartIcon, ShoppingBagIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../contexts/CartContext';

interface FavoriteItem {
  productId: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  stock: number;
}

const FavoritesPage = () => {
  const { state, removeFromFavorites, addToCart } = useCart();

  // Convert context favorites to match the expected format
  const favorites: FavoriteItem[] = state.favorites.map(item => ({
    productId: item.productId,
    name: item.name,
    price: item.price,
    originalPrice: item.originalPrice,
    image: item.image,
    stock: item.stock || 10 // Default stock if not provided
  }));

  const handleRemoveFromFavorites = (productId: string) => {
    removeFromFavorites(productId);
  };

  const handleAddToCart = (productId: string) => {
    const favoriteItem = favorites.find(item => item.productId === productId);
    if (favoriteItem) {
      addToCart({
        id: productId,
        name: favoriteItem.name,
        price: favoriteItem.price,
        image: favoriteItem.image,
        size: 'M', // Default size
        color: 'Default' // Default color
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3 }
    }
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.1 } }
  };

  return (
    <>
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full flex items-center justify-center">
                <HeartIconSolid className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-light text-foreground tracking-wide">
                Wishlist
              </h1>
            </div>
            <div className="w-24 h-1 bg-gradient-to-r from-rose-400 to-pink-500 mx-auto mb-4 rounded-full"></div>
            <p className="text-muted-foreground text-lg font-light">
              {favorites.length} {favorites.length === 1 ? 'item' : 'items'} saved for later
            </p>
          </motion.div>

          {/* Content */}
          {favorites.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                <HeartIcon className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-light text-foreground mb-4">
                Your wishlist is empty
              </h3>
              <p className="text-muted-foreground mb-8 font-light">
                Start adding items you love to your wishlist
              </p>
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Link
                  href="/allproducts"
                  className="inline-flex items-center px-8 py-4 text-white bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Continue Shopping
                </Link>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              <AnimatePresence>
                {favorites.map((item) => (
                  <motion.div
                    key={item.productId}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                    className="group bg-card backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-border overflow-hidden"
                  >
                    {/* Product Image */}
                    <div className="relative aspect-square overflow-hidden bg-secondary">
                      <Link href={`/product/${item.productId}`}>
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={300}
                          height={400}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/300x400/E5E7EB/9CA3AF?text=No+Image';
                          }}
                        />
                      </Link>

                      {/* Remove from wishlist button */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleRemoveFromFavorites(item.productId)}
                        className="absolute top-3 right-3 w-8 h-8 bg-background/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-background transition-all duration-200 border border-border"
                      >
                        <XMarkIcon className="w-4 h-4 text-muted-foreground" />
                      </motion.button>
                    </div>

                    {/* Product Details */}
                    <div className="p-4">
                      <Link
                        href={`/product/${item.productId}`}
                        className="block"
                      >
                        <h3 className="font-medium text-foreground hover:text-primary transition-colors duration-200 line-clamp-2 mb-2">
                          {item.name}
                        </h3>
                      </Link>

                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-semibold text-foreground">
                            {formatCurrency(item.price)}
                          </span>
                          {item.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                              {formatCurrency(item.originalPrice)}
                            </span>
                          )}
                        </div>
                        {item.originalPrice && (
                          <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-500/10 px-2 py-1 rounded-full">
                            {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
                          </span>
                        )}
                      </div>

                      {item.stock > 0 ? (
                        <div className="flex items-center text-xs text-green-600 dark:text-green-400 mb-4">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          In Stock
                        </div>
                      ) : (
                        <div className="flex items-center text-xs text-red-500 mb-4">
                          <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                          Out of Stock
                        </div>
                      )}

                      {/* Add to Cart Button */}
                      <motion.button
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => handleAddToCart(item.productId)}
                        disabled={item.stock === 0}
                        className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                          item.stock === 0
                            ? 'bg-secondary text-muted-foreground cursor-not-allowed'
                            : 'bg-gradient-to-r from-primary to-blue-600 text-white hover:from-primary/90 hover:to-blue-600/90 shadow-lg hover:shadow-xl'
                        }`}
                      >
                        <ShoppingBagIcon className="h-4 w-4" />
                        {item.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default FavoritesPage;
