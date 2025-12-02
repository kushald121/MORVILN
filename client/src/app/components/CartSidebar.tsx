"use client";

import React, { useEffect, useState } from 'react';
import { X, Minus, Plus, Trash2, ShoppingBag, AlertTriangle } from 'lucide-react';
import Image from 'next/image';
import { useCart } from '../contexts/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

const CartSidebar: React.FC = () => {
  const {
    state,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateCartQuantity,
    getCartTotal,
    getCartItemCount,
  } = useCart();

  const [reserveSeconds, setReserveSeconds] = useState(10 * 60);

  // Prevent body scroll when cart is open & reset timer
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
      if (state.items.length > 0) {
        setReserveSeconds(10 * 60);
      }
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen, state.items.length]);

  // Reservation countdown timer
  useEffect(() => {
    if (!isCartOpen || state.items.length === 0) return;

    const interval = setInterval(() => {
      setReserveSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [isCartOpen, state.items.length]);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (totalSeconds % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const handleQuantityChange = (id: string, currentQuantity: number, change: number) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity > 0) {
      updateCartQuantity(id, newQuantity);
    }
  };

  const cartTotal = getCartTotal();
  const itemCount = getCartItemCount();

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isCartOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={closeCart}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isCartOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[460px] lg:w-[560px] bg-white text-gray-900 border-l border-gray-200 z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
              <h2 className="text-lg tracking-[0.3em] uppercase text-gray-900">
                CART
              </h2>
              <button
                onClick={closeCart}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close cart"
              >
                <X size={24} className="text-gray-900" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {state.items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag size={64} className="text-gray-400 mb-4 opacity-70" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Add some products to get started!
                  </p>
                  <button
                    onClick={closeCart}
                    className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {state.items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className="flex gap-4 pb-6 border-b border-gray-200 last:border-b-0"
                    >
                      {/* Product Image */}
                      <div className="relative w-20 h-20 flex-shrink-0 bg-gray-200 rounded-md overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=250&fit=crop&crop=center';
                          }}
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate">
                          {item.name}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2 uppercase tracking-[0.16em]">
                          {item.size && <span>Size: {item.size}</span>}
                          {item.color && item.color !== 'Default' && (
                            <>
                              <span>•</span>
                              <span>Color: {item.color}</span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-sm text-gray-900">
                            ₹{Math.round(item.price)}
                          </span>
                        </div>

                        {/* Quantity controls + remove link */}
                        <div className="mt-3 flex items-center justify-between">
                          <div className="inline-flex items-center border border-gray-300">
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                              className="px-3 py-2 text-sm hover:bg-gray-100"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="px-4 py-2 text-sm">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                              className="px-3 py-2 text-sm hover:bg-gray-100"
                              aria-label="Increase quantity"
                            >
                              <Plus size={14} />
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-xs uppercase tracking-[0.18em] text-gray-600 hover:text-gray-900"
                            aria-label="Remove item"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer with reservation, notes, and checkout */}
            {state.items.length > 0 && (
              <div className="border-t border-gray-200 px-6 py-5 space-y-5 bg-white">
                {/* Reservation banner */}
                <div className="flex items-start gap-3 bg-[#FFF4DD] border border-[#FFE1A3] px-4 py-3">
                  <div className="mt-[2px] text-[#FF9500]">
                    <AlertTriangle size={20} />
                  </div>
                  <div className="text-sm text-gray-900">
                    <p className="font-medium">
                      An item in your cart is in high demand.
                    </p>
                    <p className="text-sm mt-1">
                      <span className="font-semibold">
                        Your cart is reserved for {formatTime(reserveSeconds)} minutes!
                      </span>
                    </p>
                  </div>
                </div>

                {/* Order note / shipping text */}
                <div className="space-y-1 text-sm">
                  <button
                    type="button"
                    className="text-gray-800 underline underline-offset-4"
                  >
                    Add order note
                  </button>
                  <p className="text-gray-500 text-xs">
                    Taxes and shipping calculated at checkout
                  </p>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={() => {
                    closeCart();
                    window.location.href = '/checkout';
                  }}
                  className="w-full py-4 bg-black text-white tracking-[0.3em] text-xs font-semibold uppercase hover:bg-gray-900 transition-colors"
                >
                  CHECKOUT
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CartSidebar;
