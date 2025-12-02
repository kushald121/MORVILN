"use client";

import React, { useState } from 'react';
import { ShoppingCart, Check } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { motion } from 'framer-motion';

interface AddToCartButtonProps {
  productId: string;
  productName: string;
  productPrice: number;
  productImage: string;
  selectedSize?: string;
  selectedColor?: string;
  className?: string;
  openCartAfterAdd?: boolean;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  productId,
  productName,
  productPrice,
  productImage,
  selectedSize = 'M',
  selectedColor = 'Default',
  className = '',
  openCartAfterAdd = true,
}) => {
  const { addToCart, openCart, isInCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const inCart = isInCart(productId);

  const handleAddToCart = async () => {
    setIsAdding(true);

    try {
      addToCart({
        id: productId,
        name: productName,
        price: productPrice,
        image: productImage,
        size: selectedSize,
        color: selectedColor,
      });

      setJustAdded(true);

      // Show success state for 2 seconds
      setTimeout(() => {
        setJustAdded(false);
      }, 2000);

      // Open cart sidebar if enabled
      if (openCartAfterAdd) {
        setTimeout(() => {
          openCart();
        }, 300);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <motion.button
      onClick={handleAddToCart}
      disabled={isAdding}
      className={`
        flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold
        transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
        ${justAdded 
          ? 'bg-green-600 text-white' 
          : inCart
          ? 'bg-blue-500 text-white hover:bg-blue-600'
          : 'bg-primary text-primary-foreground hover:bg-primary/90'
        }
        ${className}
      `}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {isAdding ? (
        <>
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>Adding...</span>
        </>
      ) : justAdded ? (
        <>
          <Check size={20} />
          <span>Added to Cart!</span>
        </>
      ) : inCart ? (
        <>
          <ShoppingCart size={20} />
          <span>In Cart</span>
        </>
      ) : (
        <>
          <ShoppingCart size={20} />
          <span>Add to Cart</span>
        </>
      )}
    </motion.button>
  );
};

export default AddToCartButton;
