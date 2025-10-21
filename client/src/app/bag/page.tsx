'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, CreditCard } from 'lucide-react';
import Image from 'next/image';

// Types for cart items
interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
  variantId?: string;
}

interface CartSummary {
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

const BagPage: React.FC = () => {
  // Mock cart data - in real app, this would come from context/state management
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: '1',
      name: 'Premium Cotton T-Shirt',
      price: 29.99,
      image: 'https://voilastudio.in/old_website_assets/voilastudio_admin/images/model_images/indian_model/ANMOL_23_1_23%20(16).webp',
      size: 'M',
      color: 'Black',
      quantity: 2,
      variantId: 'var1'
    },
    {
      id: '2',
      name: 'Designer Jeans',
      price: 89.99,
      image: 'https://img.freepik.com/free-photo/portrait-handsome-fashion-stylish-hipster-model-dressed-warm-overcoat-posing-studio_158538-11452.jpg',
      size: '32',
      color: 'Dark Blue',
      quantity: 1,
      variantId: 'var2'
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);

  // Calculate cart summary
  const calculateSummary = (): CartSummary => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08; // 8% tax
    const shipping = subtotal > 75 ? 0 : 9.99; // Free shipping over $75
    const total = subtotal + tax + shipping;

    return { subtotal, tax, shipping, total };
  };

  const summary = calculateSummary();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15
      }
    },
    exit: {
      opacity: 0,
      x: -100,
      transition: { duration: 0.3 }
    }
  };

  const summaryVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.5,
        duration: 0.5,
        type: "spring" as const,
        stiffness: 100
      }
    }
  };

  // Update quantity
  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
      return;
    }

    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Remove item
  const removeItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen pt-20 relative overflow-hidden bg-background">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="container mx-auto px-4 py-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-md mx-auto text-center"
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="w-32 h-32 mx-auto mb-8 relative"
            >
              {/* Enhanced gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-600 to-cyan-500 rounded-full animate-pulse opacity-30"></div>
              <div className="absolute inset-2 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-16 h-16 text-white" />
              </div>
              {/* Animated ring */}
              <div className="absolute inset-0 rounded-full border-2 border-primary/50 animate-spin" style={{ animationDuration: '3s' }}></div>
            </motion.div>

            <motion.h1
              className="text-4xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-blue-600 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                backgroundSize: '200% 200%'
              }}
            >
              Your bag is empty
            </motion.h1>

            <motion.p
              className="text-muted-foreground mb-10 text-xl leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Looks like you haven&#39;t added anything to your bag yet.
              <br />
              <span className="text-sm text-muted-foreground mt-2 block">
                Start exploring our amazing collection!
              </span>
            </motion.p>

            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-10 py-4 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              onClick={() => window.history.back()}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <span className="relative flex items-center gap-2">
                Continue Shopping
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </span>
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 md:mb-8 lg:mb-12"
        >
          <div className="backdrop-blur-sm bg-card rounded-xl md:rounded-2xl p-4 md:p-6 border border-border shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center justify-between sm:justify-start space-x-4">
                <motion.button
                  whileHover={{
                    x: -5,
                    backgroundColor: "rgba(59, 130, 246, 0.1)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.history.back()}
                  className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-all duration-300 p-2 md:p-3 rounded-lg md:rounded-xl border border-border hover:border-primary/50 text-sm md:text-base"
                >
                  <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="font-medium hidden sm:inline">Continue Shopping</span>
                  <span className="font-medium sm:hidden">Back</span>
                </motion.button>

                {cartItems.length > 0 && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{
                      scale: 1.05,
                      backgroundColor: "rgba(239, 68, 68, 0.1)"
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={clearCart}
                    className="flex items-center space-x-2 text-red-500 hover:text-red-600 transition-all duration-300 px-3 py-2 rounded-lg border border-red-200 hover:border-red-300 text-sm md:text-base dark:border-red-500/20 dark:hover:border-red-400/50"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="font-medium hidden sm:inline">Clear Bag</span>
                    <span className="font-medium sm:hidden">Clear</span>
                  </motion.button>
                )}
              </div>

              <div className="flex items-center space-x-3 justify-center sm:justify-end">
                <div className="p-2 md:p-3 bg-gradient-to-br from-primary to-blue-600 rounded-lg md:rounded-xl shadow-lg">
                  <ShoppingBag className="w-5 h-5 md:w-7 md:h-7 text-white" />
                </div>
                <div className="text-center sm:text-left">
                  <h1 className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-foreground via-primary to-blue-600 bg-clip-text text-transparent">
                    Shopping Bag
                  </h1>
                  <p className="text-muted-foreground text-xs md:text-sm">
                    {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Cart Items */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-2 space-y-4 order-1 lg:order-1"
          >
            <AnimatePresence>
              {cartItems.map((item) => (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  exit="exit"
                  layout
                  whileHover={{
                    y: -5,
                    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)"
                  }}
                  className="group relative backdrop-blur-sm bg-card rounded-2xl p-6 border border-border shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  {/* Animated background gradient on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                    {/* Cross button positioned absolutely on mobile, relatively on desktop */}
                    <motion.button
                      whileHover={{
                        scale: 1.1,
                        rotate: 90,
                        backgroundColor: "rgba(239, 68, 68, 0.1)"
                      }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeItem(item.id)}
                      className="absolute top-2 right-2 p-2 text-red-500 hover:text-red-600 rounded-full border border-red-200 hover:border-red-300 transition-all duration-300 z-20 dark:border-red-500/20 dark:hover:border-red-400/50"
                    >
                      <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </motion.button>

                    {/* Product Image */}
                    <motion.div
                      whileHover={{ scale: 1.05, rotate: 2 }}
                      className="flex-shrink-0 relative mx-auto sm:mx-0"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-blue-600/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                      <div className="relative p-2 bg-card rounded-xl border border-border">
                        <Image
                          width={120}
                          height={150}
                          src={item.image}
                          alt={item.name}
                          className="w-28 h-36 sm:w-32 sm:h-40 md:w-36 md:h-44 object-cover rounded-lg shadow-lg"
                        />
                      </div>
                    </motion.div>

                    {/* Product Details */}
                    <div className="flex-1 space-y-3 sm:space-y-4">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4">
                        <div className="space-y-2 flex-1">
                          <h3 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 leading-tight">
                            {item.name}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-xs sm:text-sm font-medium border border-border">
                              Size: {item.size}
                            </span>
                            <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-xs sm:text-sm font-medium border border-border">
                              {item.color}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                        <div className="flex items-center justify-center sm:justify-start space-x-3 sm:space-x-4">
                          <motion.button
                            whileHover={{
                              scale: 1.1,
                              backgroundColor: "rgba(59, 130, 246, 0.1)"
                            }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-12 h-12 sm:w-10 sm:h-10 rounded-full bg-secondary hover:bg-primary/10 flex items-center justify-center transition-all duration-300 border border-border hover:border-primary/50"
                          >
                            <Minus className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                          </motion.button>

                          <motion.div
                            key={item.quantity}
                            initial={{ scale: 1.2, rotate: 180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            className="w-16 h-16 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg"
                          >
                            <span className="text-white font-bold text-base sm:text-lg">
                              {item.quantity}
                            </span>
                          </motion.div>

                          <motion.button
                            whileHover={{
                              scale: 1.1,
                              backgroundColor: "rgba(59, 130, 246, 0.1)"
                            }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-12 h-12 sm:w-10 sm:h-10 rounded-full bg-secondary hover:bg-primary/10 flex items-center justify-center transition-all duration-300 border border-border hover:border-primary/50"
                          >
                            <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                          </motion.button>
                        </div>

                        <div className="text-center sm:text-right space-y-1">
                          <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                            {formatCurrency(item.price * item.quantity)}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-xs sm:text-sm text-muted-foreground">
                              {formatCurrency(item.price)} each
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            variants={summaryVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-1 order-2 lg:order-2"
          >
            <div className="backdrop-blur-sm bg-card rounded-xl md:rounded-2xl p-4 md:p-6 border border-border shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center space-x-3 mb-6 md:mb-8">
                <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                  <CreditCard className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-foreground">
                  Order Summary
                </h2>
              </div>

              <div className="space-y-3 md:space-y-5 mb-6 md:mb-8">
                <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg border border-border">
                  <span className="text-muted-foreground font-medium text-sm md:text-base">Subtotal</span>
                  <span className="font-bold text-foreground text-sm md:text-base">{formatCurrency(summary.subtotal)}</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg border border-border">
                  <span className="text-muted-foreground font-medium text-sm md:text-base">Tax</span>
                  <span className="font-bold text-foreground text-sm md:text-base">{formatCurrency(summary.tax)}</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg border border-border">
                  <span className="text-muted-foreground font-medium text-sm md:text-base">Shipping</span>
                  <span className={`font-bold text-sm md:text-base ${summary.shipping === 0 ? 'text-green-600 dark:text-green-400' : 'text-foreground'}`}>
                    {summary.shipping === 0 ? 'FREE' : formatCurrency(summary.shipping)}
                  </span>
                </div>

                {summary.shipping === 0 && summary.subtotal < 75 && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg"
                  >
                    <p className="text-xs md:text-sm text-green-600 dark:text-green-400 flex items-center space-x-2">
                      <span className="text-base md:text-lg">🎉</span>
                      <span>You saved {formatCurrency(9.99)} on shipping!</span>
                    </p>
                  </motion.div>
                )}

                <div className="border-t border-border pt-4 md:pt-5 mt-4 md:mt-5">
                  <div className="flex justify-between items-center p-3 md:p-4 bg-gradient-to-r from-primary/10 to-blue-600/10 rounded-lg md:rounded-xl border border-primary/20">
                    <span className="text-lg md:text-xl font-bold text-foreground">Total</span>
                    <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                      {formatCurrency(summary.total)}
                    </span>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)"
                }}
                whileTap={{ scale: 0.98 }}
                className="group w-full py-4 md:py-5 px-4 md:px-6 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white font-bold text-base md:text-lg rounded-lg md:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative"
                onClick={() => setIsLoading(true)}
                disabled={isLoading}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <span className="relative flex items-center justify-center space-x-2 md:space-x-3">
                  <CreditCard className="w-5 h-5 md:w-6 md:h-6" />
                  <span>{isLoading ? 'Processing...' : 'Proceed to Checkout'}</span>
                </span>
              </motion.button>

              <div className="mt-4 md:mt-6 text-center p-3 md:p-4 bg-secondary/30 rounded-lg border border-border">
                <p className="text-xs md:text-sm text-muted-foreground flex items-center justify-center space-x-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  <span>Secure checkout powered by Stripe</span>
                </p>
              </div>

              {/* Promo Code Section */}
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ delay: 1 }}
                className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-border"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full p-2 md:p-3 text-xs md:text-sm text-muted-foreground hover:text-foreground transition-all duration-300 bg-secondary/50 hover:bg-secondary rounded-lg border border-border hover:border-primary/30"
                >
                  💳 Have a promo code? Apply here
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Continue Shopping */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 md:mt-12 text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.history.back()}
            className="px-6 md:px-8 py-3 md:py-4 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold text-sm md:text-base rounded-lg md:rounded-xl border border-border hover:border-primary/30 transition-all duration-300"
          >
            Continue Shopping
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default BagPage;