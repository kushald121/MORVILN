'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, X, ShoppingBag, Flame, ChevronRight, ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import { useCart } from '../contexts/CartContext'; // Adjust path as needed
import { PaymentService } from "@/app/services/payment.service"; // Adjust path as needed

// --- Helper for the Countdown Timer ---
const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `0${m}:${s < 10 ? '0' : ''}${s}`;
};

const CartSidebar = () => {
  // Assuming your useCart context now exposes an isOpen state. 
  // If not, see the "Setup" instructions below.
  const { 
    state, 
    removeFromCart, 
    updateCartQuantity, 
    isCartOpen, // You need to add this to your context
    closeCart,  // You need to add this to your context
    cartTotal 
  } = useCart();

  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(589); // 9:49 minutes in seconds
  const [noteOpen, setNoteOpen] = useState(false);

  // Countdown Logic
  useEffect(() => {
    if (!isCartOpen) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isCartOpen]);

  // Derived State
  const subtotal = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  // Matching the image: Only showing Total, assuming tax/shipping calculated at checkout
  const total = subtotal; 

  // --- Payment Logic (Adapted from your code) ---
  const handleCheckout = async () => {
    setIsLoading(true);
    
    // 1. Prepare Data
    const amountInPaise = PaymentService.convertToPaise(total);
    const orderData = { items: state.items, total };
    const userInfo = { name: "Guest", email: "guest@example.com" }; // Replace with real auth data

    try {
      // 2. Create Order
      const { orderId } = await PaymentService.createOrder(amountInPaise, orderData, userInfo);

      // 3. Razorpay Options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amountInPaise,
        currency: "INR",
        name: "Genrage", // From your screenshot
        description: "Purchase",
        order_id: orderId,
        handler: function (response: any) {
          alert("Payment successful! ID: " + response.razorpay_payment_id);
          // clearCart(); // Uncomment if you want to clear cart on success
          closeCart();
        },
        prefill: { name: userInfo.name, email: userInfo.email },
        theme: { color: "#000000" }, // Black theme to match image
      };

      // 4. Load Script & Open
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => {
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      };
      document.body.appendChild(script);

    } catch (error) {
      console.error("Payment Error:", error);
      alert("Something went wrong with checkout.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />

          {/* Sidebar Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-[85%] md:w-[550px] bg-white z-50 shadow-2xl flex flex-col"
          >
            
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-light tracking-widest text-black">CART</h2>
              <button 
                onClick={closeCart}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
            
              </button>
            </div>

            <br className="text-black"/>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              {state.items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                  <ShoppingBag className="w-12 h-12 text-gray-300 mb-4" />
                  <p className="text-gray-500">Your cart is empty.</p>
                  <button 
                    onClick={closeCart}
                    className="mt-4 text-sm font-bold underline decoration-1 underline-offset-4"
                  >
                    START SHOPPING
                  </button>
                </div>
              ) : (
                <>
                  {/* Cart Items List */}
                  <div className="p-6 space-y-8">
                    {state.items.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        {/* Image */}
                        <div className="w-24 h-32 relative bg-gray-100 flex-shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1 flex flex-col justify-between py-1">
                          <div>
                            <div className="flex justify-between items-start">
                              <h3 className="text-sm font-medium uppercase tracking-wide text-gray-900 w-[80%] leading-relaxed">
                                {item.name}
                              </h3>
                              <p className="text-sm text-gray-600">
                                RS. {item.price.toFixed(2)}
                              </p>
                            </div>
                            <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">
                              {item.size} / {item.color}
                            </p>
                          </div>

                          {/* Controls */}
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center border border-gray-500">
                              <button 
                                onClick={() => updateCartQuantity(item.id, Math.max(0, item.quantity - 1))}
                                className="p-2 hover:bg-gray-50"
                              >
                                <Minus className="w-3 h-3 text-black" />
                              </button>
                              <span className="w-8 text-center text-sm font-medium text-black">
                                {item.quantity}
                              </span>
                              <button 
                                onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                                className="p-2 hover:bg-gray-50"
                              >
                                <Plus className="w-3 h-3 text-black" />
                              </button>
                            </div>

                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-xs text-gray-400 hover:text-black underline decoration-1 underline-offset-2 transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* "Don't Miss Out" Section (Cross-sell Mockup) */}
                   </>
              )}
            </div>

            {/* Footer Section */}
            {state.items.length > 0 && (
              <div className="border-t border-gray-100 bg-white">
                
                {/* Urgency Banner */}
                <div className="bg-[#FEF9C3] px-6 py-3 flex items-start gap-3">
                  <Flame className="w-5 h-5 text-orange-500 fill-orange-500 animate-pulse flex-shrink-0" />
                  <p className="text-xs text-gray-800 leading-relaxed">
                    An item in your cart is in high demand.<br/>
                    Your cart is reserved for <span className="font-bold text-red-600">{formatTime(timeLeft)} minutes!</span>
                  </p>
                </div>

                <div className="p-6 space-y-4">
                  {/* Order Note Toggle */}
                  <div>
                    {!noteOpen ? (
                      <button 
                        onClick={() => setNoteOpen(true)}
                        className="text-xs text-gray-500 underline decoration-1 underline-offset-2"
                      >
                        Add order note
                      </button>
                    ) : (
                      <textarea 
                        className="w-full text-xs p-3 border border-gray-200 outline-none focus:border-black transition-colors resize-none h-20 bg-gray-50 text-black"
                        placeholder="Special instructions for seller..."
                      />
                    )}
                  </div>

                  <p className="text-xs text-gray-400 text-center">
                    Taxes and shipping calculated at checkout
                  </p>

                  <button
                    onClick={handleCheckout}
                    disabled={isLoading}
                    className="w-full bg-black hover:bg-zinc-800 text-white py-4 px-6 text-sm font-bold tracking-widest uppercase transition-all active:scale-[0.99] flex items-center justify-center gap-2"
                  >
                    {isLoading ? 'PROCESSING...' : `CHECKOUT • RS. ${total.toLocaleString()}`}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;