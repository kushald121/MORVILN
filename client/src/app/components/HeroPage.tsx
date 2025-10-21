"use client";

import { useEffect, useRef, useMemo } from "react";
import { motion, useMotionValue, useTransform, useSpring, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  Sparkles,
  Star,
  ShoppingBag,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react";
import Image from "next/image";
import { StaggerClothingShowcase } from "./ui/stagger-clothes-showcase";
import { SparklesText } from "./ui/sparkels";
// import SplashCursor from "./ui/splash-cursor";

gsap.registerPlugin(ScrollTrigger);

// Optimized throttle using RAF
const throttleRAF = <T extends unknown[]>(func: (...args: T) => void) => {
  let ticking = false;
  return (...args: T) => {
    if (!ticking) {
      requestAnimationFrame(() => {
        func(...args);
        ticking = false;
      });
      ticking = true;
    }
  };
};

export default function HeroPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smoother spring configuration
  const springConfig = { damping: 25, stiffness: 250, mass: 0.5 };
  const mouseXSpring = useSpring(mouseX, springConfig);
  const mouseYSpring = useSpring(mouseY, springConfig);

  // Optimized parallax transforms with reduced intensity for better performance
  const parallaxX1 = useTransform(mouseXSpring, [-0.5, 0.5], [-25, 25]);
  const parallaxY1 = useTransform(mouseYSpring, [-0.5, 0.5], [-15, 15]);
  const parallaxX2 = useTransform(mouseXSpring, [-0.5, 0.5], [-50, 50]);
  const parallaxY2 = useTransform(mouseYSpring, [-0.5, 0.5], [-30, 30]);
  const parallaxX3 = useTransform(mouseXSpring, [-0.5, 0.5], [-75, 75]);
  const parallaxY3 = useTransform(mouseYSpring, [-0.5, 0.5], [-45, 45]);
  const parallaxX4 = useTransform(mouseXSpring, [-0.5, 0.5], [-35, 35]);
  const parallaxY4 = useTransform(mouseYSpring, [-0.5, 0.5], [-25, 25]);

  // Optimized mouse move handler with RAF throttling
  const handleMouseMove = useMemo(() => throttleRAF((e: MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX - innerWidth / 2) / innerWidth;
    const y = (clientY - innerHeight / 2) / innerHeight;
    mouseX.set(x);
    mouseY.set(y);
  }), [mouseX, mouseY]);

  useEffect(() => {
    if (prefersReducedMotion) return;
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove, prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Optimized floating animation with reduced movement and stagger
      gsap.to(".clothing-item-inner", {
        y: "+=10",
        rotation: "+=2",
        duration: 6,
        ease: "sine.inOut",
        stagger: {
          each: 0.2,
          from: "center"
        },
        repeat: -1,
        yoyo: true,
      });

      // Optimized scroll animations with reduced movement
      gsap.to(".hero-content", {
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
        },
        y: 50,
        opacity: 0.6,
      });

      gsap.to(".clothing-item-inner", {
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
        },
        scale: 0.9,
        y: -80,
      });
    }, heroRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  // Memoized clothing items
  const clothingItems = useMemo(() => [
    {
      id: 1,
      position: "top-25 left-[15%]",
      rotation: -12,
      scale: 1.15,
      image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=600&fit=crop",
      zIndex: 30,
      title: "Premium Leather Jacket",
      price: "$299",
      oldPrice: "$399",
      badge: "25% OFF",
    },
    {
      id: 2,
      position: "top-32 right-[20%]",
      rotation: 10,
      scale: 0.95,
      image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400&h=600&fit=crop",
      zIndex: 20,
      title: "Designer Blazer",
      price: "$249",
      oldPrice: "$349",
      badge: "NEW",
    },
    {
      id: 3,
      position: "top-[60%] left-[10%]",
      rotation: -8,
      scale: 0.9,
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=600&fit=crop",
      zIndex: 10,
      title: "Silk Evening Dress",
      price: "$399",
      oldPrice: "$549",
      badge: "BESTSELLER",
    },
    {
      id: 4,
      position: "top-[65%] right-[15%]",
      rotation: -6,
      scale: 1.0,
      image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&h=600&fit=crop",
      zIndex: 15,
      title: "Casual Denim Jacket",
      price: "$199",
      oldPrice: "$249",
      badge: "20% OFF",
    },
  ], []);

  // Optimized particle counts for better performance
  const particleCount = prefersReducedMotion ? 0 : 15;
  const sparkleCount = prefersReducedMotion ? 0 : 8;

  return (
    <>
    {/* <SplashCursor /> */}
    <div
      ref={heroRef}
      className="relative min-h-screen overflow-hidden "
    >
      <div className="absolute inset-0  opacity-30"></div>

      {/* Optimized gradient orbs - reduced to 2 for better performance */}
      <motion.div
        className="absolute top-0 left-0 w-96 h-96 bg-blue-800/30 rounded-full blur-3xl"
        style={{ willChange: 'transform', transform: 'translate3d(0,0,0)' }}
        animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-900/30 rounded-full blur-3xl"
        style={{ willChange: 'transform', transform: 'translate3d(0,0,0)' }}
        animate={{ x: [0, -100, 0], y: [0, -50, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />

      {/* Optimized particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(particleCount)].map((_, i) => (
          <motion.div
            key={i}
            className="particle absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${100 + Math.random() * 20}%`,
              willChange: 'transform, opacity',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.7, 0], y: [-100, -700] }}
            transition={{
              duration: Math.random() * 4 + 4,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear",
            }}
          >
            {i % 3 === 0 ? (
              <Star className="w-2.5 h-2.5 text-cyan-400 fill-cyan-400/50" />
            ) : (
              <div className="w-2 h-2 bg-blue-400/40 rounded-full" />
            )}
          </motion.div>
        ))}
        {[...Array(sparkleCount)].map((_, i) => (
          <motion.div
            key={`sparkle-${i}`}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              willChange: 'transform, opacity',
            }}
            animate={{
              scale: [0, 1.2, 0],
              rotate: [0, 180, 360],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeInOut",
            }}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-300/70" />
          </motion.div>
        ))}
      </div>

      <div className="hero-section relative z-10 flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8" style={{ transform: 'translate3d(0,0,0)' }}>
        {/* Optimized clothing items */}
        {clothingItems.map((item, index) => {
          const parallaxXValues = [parallaxX1, parallaxX2, parallaxX3, parallaxX4];
          const parallaxYValues = [parallaxY1, parallaxY2, parallaxY3, parallaxY4];

          return (
            <motion.div
              key={item.id}
              className={`absolute ${item.position} hidden lg:block`}
              style={{
                zIndex: item.zIndex,
                x: parallaxXValues[index],
                y: parallaxYValues[index],
                willChange: 'transform',
              }}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.8,
                delay: index * 0.15,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              <motion.div
                className="clothing-item-inner relative group cursor-pointer"
                style={{
                  scale: item.scale,
                  rotate: item.rotation,
                  transformStyle: 'preserve-3d',
                }}
                whileHover={{
                  scale: item.scale * 1.06,
                  transition: {
                    duration: 0.25,
                    ease: "easeOut"
                  },
                }}
              >
                {/* Product Badge */}
                <motion.div
                  className="absolute -top-2 -right-2 z-20 px-3 py-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full shadow-lg"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    delay: index * 0.2 + 0.5,
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                  }}
                >
                  {item.badge}
                </motion.div>

                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/15 to-cyan-500/15 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>

                {/* Image container with optimizations */}
                <div className="relative overflow-hidden rounded-2xl">
                  <Image
                    priority={index < 2}
                    width={400}
                    height={600}
                    src={item.image}
                    alt={item.title}
                    className="relative w-48 h-72 object-cover rounded-2xl shadow-2xl border border-white/10 group-hover:border-cyan-400/30 transition-colors duration-300"
                    loading={index < 2 ? "eager" : "lazy"}
                  />

                  {/* Subtle shimmer on hover only */}
                  {!prefersReducedMotion && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100"
                      style={{ willChange: 'transform, opacity' }}
                      animate={{
                        x: ["-100%", "100%"],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        repeatDelay: 0.5,
                        ease: "linear",
                      }}
                    />
                  )}
                </div>

                {/* Hover overlay with product info */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end pb-5 gap-2"
                  initial={false}
                >
                  <motion.div
                    className="text-center px-4"
                    initial={{ y: 10, opacity: 0 }}
                    whileHover={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h3 className="text-white font-bold text-sm mb-1.5">
                      {item.title}
                    </h3>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-cyan-300 font-bold text-lg">
                        {item.price}
                      </span>
                      <span className="text-gray-400 line-through text-xs">
                        {item.oldPrice}
                      </span>
                    </div>
                  </motion.div>

                  <motion.button
                    className="px-4 py-2 bg-white text-black rounded-full text-sm font-semibold hover:bg-cyan-400 hover:text-white transition-colors duration-200 flex items-center gap-2 shadow-lg"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Add to Cart
                  </motion.button>
                </motion.div>
              </motion.div>
            </motion.div>
          );
        })}

        {/* Hero Content */}
        <div className="hero-content max-w-4xl mx-auto px-4 text-center">
          {/* Promotional Badge */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-500/20 to-pink-500/20 backdrop-blur-md rounded-full border border-red-400/40 mb-8 shadow-lg"
          >
            <Sparkles className="w-4 h-4 text-red-300 animate-pulse" />
            <span className="text-red-100 text-sm font-bold uppercase tracking-wide">
              Winter Sale - Up to 50% Off
            </span>
            <Sparkles className="w-4 h-4 text-red-300 animate-pulse" />
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            className="text-5xl md:text-7xl lg:text-7xl font-bold text-white leading-tight mb-4"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <SparklesText
              text="New Season"
              className="text-5xl md:text-7xl lg:text-7xl font-bold"
              colors={{ first: "#06b6d4", second: "#3b82f6" }}
              sparklesCount={4}
            />
            <span className="text-4xl md:text-6xl lg:text-6xl mt-2 inline-block">
              Arrivals 2025
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-8"
          >
            <motion.span
              className="text-2xl md:text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 inline-block"
              animate={{
                backgroundPosition: ["0%", "100%", "0%"],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                backgroundSize: "200% 100%",
              }}
            >
              Shop the Latest Trends
            </motion.span>
          </motion.div>

          {/* Description */}
          <motion.p
            className="text-lg md:text-xl text-cyan-100/90 mb-10 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            Discover premium fashion at unbeatable prices.
            <span className="text-cyan-300 font-semibold">
              {" "}Free shipping on orders over $75
            </span>{" "}
            • Easy returns within{" "}
            <span className="text-cyan-300 font-semibold">30 days</span>
            {" "}• Exclusive member discounts
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <motion.button
              className="group relative px-9 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full font-bold text-lg overflow-hidden shadow-xl shadow-cyan-500/30"
              whileHover={{
                scale: 1.03,
                boxShadow: "0 20px 50px rgba(6, 182, 212, 0.4)",
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <span className="relative z-10 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                Shop Now
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.span>
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600"
                initial={{ x: "-100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>

            <motion.button
              className="group px-9 py-4 border-2 border-cyan-400/40 text-cyan-100 rounded-full font-bold text-lg backdrop-blur-sm hover:bg-cyan-500/10 hover:border-cyan-400/60 transition-all relative overflow-hidden"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <span className="relative z-10 flex items-center gap-2">
                View Sale Items
                <Star className="w-5 h-5 group-hover:rotate-12 transition-transform fill-current" />
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.25 }}
              />
            </motion.button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            className="flex flex-wrap justify-center items-center gap-6 md:gap-8 mt-6 "
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            {[
              { icon: Truck, title: "Free Shipping", subtitle: "Orders over $75", color: "cyan" },
              { icon: Shield, title: "Secure Payment", subtitle: "100% Protected", color: "blue" },
              { icon: RotateCcw, title: "Easy Returns", subtitle: "30-Day Policy", color: "indigo" },
            ].map((item) => (
              <motion.div
                key={item.title}
                className="flex items-center gap-2 text-cyan-100/80"
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <div className={`w-10 h-10 rounded-full bg-${item.color}-500/20 flex items-center justify-center`}>
                  <item.icon className={`w-5 h-5 text-${item.color}-300`} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="text-xs text-cyan-200/70">{item.subtitle}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
      <StaggerClothingShowcase />
    </div>
    </>
  );
}
