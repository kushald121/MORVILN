"use client";

import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { motion } from 'framer-motion';

interface MiniCartPreviewProps {
  className?: string;
}

/**
 * Mini Cart Preview Component
 * Shows a compact view of cart status with item count and total
 * Clicking opens the full cart sidebar
 */
const MiniCartPreview: React.FC<MiniCartPreviewProps> = ({ className = '' }) => {
  const { getCartItemCount, getCartTotal, openCart } = useCart();

  const itemCount = getCartItemCount();
  const cartTotal = getCartTotal();

  if (itemCount === 0) {
    return null;
  }

  return (
    <motion.button
      onClick={openCart}
      className={`
        flex items-center gap-3 px-4 py-2 bg-card border border-border rounded-lg
        hover:shadow-md transition-all duration-200 group
        ${className}
      `}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="relative">
        <ShoppingBag size={20} className="text-foreground group-hover:text-primary transition-colors" />
        <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
          {itemCount}
        </span>
      </div>
      
      <div className="flex flex-col items-start">
        <span className="text-xs text-muted-foreground">Cart Total</span>
        <span className="text-sm font-bold text-foreground">₹{Math.round(cartTotal)}</span>
      </div>
    </motion.button>
  );
};

export default MiniCartPreview;
