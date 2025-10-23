'use client';

import { useState, useEffect, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  XMarkIcon,
  UserIcon,
  HeartIcon,
  ShoppingBagIcon,
  ChevronRightIcon,
  SunIcon,
  MoonIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { Fragment } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "next-themes";
import { useCart } from "../contexts/CartContext";

gsap.registerPlugin(ScrollTrigger);

const navigation = {
  pages: [
    { name: "COLLECTIONS", href: "/allproducts" },
    { name: "ABOUT US", href: "/about" },
    { name: "ADMIN", href: "/admin/login" },
  ],
};

const NavBar = () => {
  const [open, setOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { theme, setTheme } = useTheme();
  const { getCartItemCount, state } = useCart();
  const cartCount = getCartItemCount();

  const navbarRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLHeadingElement>(null);
  const navItemsRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const iconsRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();
  const navbarOpacity = useTransform(scrollY, [0, 100], [1, 1]);
  const navbarBlur = useTransform(scrollY, [0, 100], [0, 8]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // GSAP entrance animations
    const tl = gsap.timeline();

    if (navbarRef.current) {
      tl.fromTo(navbarRef.current,
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
      );
    }

    if (logoRef.current) {
      tl.fromTo(logoRef.current,
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: "back.out(1.7)" },
        "-=0.8"
      );
    }

    if (navItemsRef.current) {
      tl.fromTo(navItemsRef.current.children,
        { y: -20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out"
        },
        "-=0.6"
      );
    }

    if (searchRef.current) {
      tl.fromTo(searchRef.current,
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.7, ease: "elastic.out(1, 0.3)" },
        "-=0.5"
      );
    }

    if (iconsRef.current) {
      tl.fromTo(iconsRef.current.children,
        { scale: 0, opacity: 0, rotation: -180 },
        {
          scale: 1,
          opacity: 1,
          rotation: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "back.out(1.7)"
        },
        "-=0.4"
      );
    }
  }, []);

  // GSAP hover animations for navigation items
  useEffect(() => {
    if (navItemsRef.current) {
      const navLinks = navItemsRef.current.querySelectorAll('a');

      navLinks.forEach((link) => {
        const underline = link.querySelector('.nav-underline');

        link.addEventListener('mouseenter', () => {
          gsap.to(link, {
            y: -2,
            duration: 0.3,
            ease: "power2.out"
          });

          if (underline) {
            gsap.to(underline, {
              scaleX: 1,
              duration: 0.3,
              ease: "power2.out"
            });
          }
        });

        link.addEventListener('mouseleave', () => {
          gsap.to(link, {
            y: 0,
            duration: 0.3,
            ease: "power2.out"
          });

          if (underline) {
            gsap.to(underline, {
              scaleX: 0,
              duration: 0.3,
              ease: "power2.out"
            });
          }
        });
      });
    }
  }, []);

  // GSAP hover animations for icon buttons
  useEffect(() => {
    if (iconsRef.current) {
      const iconButtons = iconsRef.current.querySelectorAll('a, button');

      iconButtons.forEach((button) => {
        button.addEventListener('mouseenter', () => {
          gsap.to(button, {
            scale: 1.1,
            y: -2,
            duration: 0.3,
            ease: "power2.out"
          });

          const icon = button.querySelector('svg');
          if (icon) {
            gsap.to(icon, {
              rotation: 360,
              duration: 0.6,
              ease: "power2.inOut"
            });
          }
        });

        button.addEventListener('mouseleave', () => {
          gsap.to(button, {
            scale: 1,
            y: 0,
            duration: 0.3,
            ease: "power2.out"
          });

          const icon = button.querySelector('svg');
          if (icon) {
            gsap.to(icon, {
              rotation: 0,
              duration: 0.3,
              ease: "power2.out"
            });
          }
        });
      });
    }
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      console.log("Searching for:", searchInput);
      setMobileSearchOpen(false);

      // GSAP search animation
      if (searchRef.current) {
        gsap.fromTo(searchRef.current,
          { scale: 1 },
          { scale: 1.05, duration: 0.2, yoyo: true, repeat: 1, ease: "power2.inOut" }
        );
      }
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  if (!mounted) {
    return null;
  }

  return (
    <>
    {/* Desktop Navbar - Hidden on mobile */}
    <motion.div
      ref={navbarRef}
      className={`w-full fixed top-0 z-50 transition-all duration-250 hidden lg:block ${
        isScrolled ? 'shadow-xl' : 'shadow-sm'
      }`}
      style={{
        opacity: navbarOpacity,
      }}
    >
      {/* MOBILE MENU */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 z-50 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-sm sm:max-w-md flex-col overflow-y-auto bg-card shadow-2xl">
                {/* Mobile Menu Header */}
                <div className="flex items-center justify-between px-4 py-5 border-b border-border">
                  <Link href="/" onClick={() => setOpen(false)}>
                    <motion.h1
                      className="font-bold text-primary text-3xl sm:text-4xl"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      MORVILN
                    </motion.h1>
                  </Link>
                  <div className="flex items-center gap-3">
                    {/* Mobile Theme Toggle */}
                    <button
                      onClick={toggleTheme}
                      className="rounded-full p-3 text-foreground hover:bg-accent transition-colors min-h-[48px] min-w-[48px] flex items-center justify-center"
                      aria-label="Toggle theme"
                    >
                      {theme === 'dark' ? (
                        <SunIcon className="h-7 w-7" />
                      ) : (
                        <MoonIcon className="h-7 w-7" />
                      )}
                    </button>
                    <button
                      type="button"
                      className="rounded-full p-3 text-foreground hover:bg-accent transition-colors min-h-[48px] min-w-[48px] flex items-center justify-center"
                      onClick={() => setOpen(false)}
                      aria-label="Close menu"
                    >
                      <XMarkIcon className="h-7 w-7" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                {/* Mobile Search */}
                <div className="px-4 py-5 border-b border-border">
                  <form onSubmit={handleSearchSubmit}>
                    <div className="relative">
                      <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-muted-foreground" />
                      <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Search products..."
                        className="w-full pl-12 pr-4 py-4 bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-base text-foreground placeholder:text-muted-foreground"
                      />
                    </div>
                  </form>
                </div>

                {/* Mobile Navigation Links */}
                <div className="flex-1 px-4 py-6 space-y-3">
                  {navigation.pages.map((page, index) => (
                    <motion.div
                      key={page.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={page.href}
                        className="flex items-center justify-between p-5 font-semibold text-foreground hover:bg-accent rounded-xl transition-colors group min-h-[56px]"
                        onClick={() => setOpen(false)}
                      >
                        <span className="text-lg uppercase tracking-wide group-hover:text-primary transition-colors">
                          {page.name}
                        </span>
                        <ChevronRightIcon className="h-6 w-6 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Mobile Menu Footer */}
                <div className="border-t border-border px-4 py-6 space-y-4">
                  <div className="space-y-2">
                    <Link
                      href="/login"
                      className="flex items-center gap-3 p-3 hover:bg-accent rounded-lg transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      <UserIcon className="h-6 w-6 text-muted-foreground" />
                      <span className="text-sm font-semibold text-foreground">Login</span>
                    </Link>
                    <Link
                      href="/signup"
                      className="flex items-center gap-3 p-3 hover:bg-accent rounded-lg transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      <UserIcon className="h-6 w-6 text-muted-foreground" />
                      <span className="text-sm font-semibold text-foreground">Sign Up</span>
                    </Link>
                  </div>

                  <Link
                    href="/favorites"
                    className="flex items-center gap-3 p-3 hover:bg-accent rounded-lg transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    <HeartIcon className="h-6 w-6 text-muted-foreground" />
                    <span className="text-sm font-semibold text-foreground">My Wishlist</span>
                  </Link>

                  <div className="pt-4 border-t border-border">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Country:</span>
                      <span className="font-semibold text-foreground">India (IN)</span>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* MOBILE SEARCH OVERLAY */}
      <AnimatePresence>
        {mobileSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden bg-background"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center gap-4 px-4 py-5 border-b border-border">
                <button
                  onClick={() => setMobileSearchOpen(false)}
                  className="p-3 -ml-1 hover:bg-accent rounded-full transition-colors min-h-[48px] min-w-[48px] flex items-center justify-center"
                  aria-label="Close search"
                >
                  <XMarkIcon className="h-7 w-7 text-foreground" />
                </button>
                <form onSubmit={handleSearchSubmit} className="flex-1">
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-muted-foreground" />
                    <input
                      type="text"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      placeholder="Search for products..."
                      autoFocus
                      className="w-full pl-12 pr-4 py-4 bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-base text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                </form>
              </div>

              {/* Search Suggestions/Results would go here */}
              <div className="flex-1 overflow-y-auto px-4 py-6">
                <p className="text-base text-muted-foreground text-center mt-12">
                  Start typing to search for products
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DESKTOP & MOBILE NAVBAR */}
      <header className="relative bg-background backdrop-blur-md">
        <nav className="mx-auto max-w-full px-3 sm:px-4 lg:px-8">
          {/* Mobile Navbar */}
          <div className="flex lg:hidden h-16 sm:h-18 items-center justify-between px-2">
            {/* Mobile Menu Button */}
            <button
              type="button"
              className="rounded-lg p-3 -ml-1 text-foreground hover:bg-accent transition-colors min-h-[48px] min-w-[48px] flex items-center justify-center"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <Bars3Icon className="h-7 w-7 sm:h-8 sm:w-8" aria-hidden="true" />
            </button>

            {/* Mobile Logo */}
            <Link href="/" className="flex-shrink-0">
              <h1 className="font-bold text-primary text-2xl sm:text-3xl md:text-4xl">MORVILN</h1>
            </Link>

            {/* Mobile Right Icons */}
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setMobileSearchOpen(true)}
                className="p-2.5 sm:p-3 text-foreground hover:bg-accent rounded-full transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Search"
              >
                <MagnifyingGlassIcon className="h-6 w-6 sm:h-7 sm:w-7" />
              </button>

              <Link
                href="/favorites"
                className="p-2.5 sm:p-3 text-foreground hover:bg-accent rounded-full transition-colors relative min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Favorites"
              >
                <HeartIcon className="h-6 w-6 sm:h-7 sm:w-7" />
              </Link>

              <button className="p-2.5 sm:p-3 text-foreground hover:bg-accent rounded-full transition-colors relative min-h-[44px] min-w-[44px] flex items-center justify-center"
                      aria-label="Shopping bag">
                <ShoppingBagIcon className="h-6 w-6 sm:h-7 sm:w-7" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 sm:h-6 sm:w-6 bg-primary text-primary-foreground text-xs sm:text-sm font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Desktop Navbar */}
          <div className="flex h-16 items-center justify-between">
            {/* LEFT: Logo + Navigation */}
            <div className="flex items-center space-x-12">
              {/* Logo */}
              <Link href="/" className="flex-shrink-0">
                <motion.h1
                  ref={logoRef}
                  className="font-bold text-primary text-2xl xl:text-3xl cursor-pointer"
                  whileHover={{ scale: 1.05, rotate: [0, -2, 2, 0] }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  MORVILN
                </motion.h1>
              </Link>

              {/* Desktop Navigation */}
              <div ref={navItemsRef} className="flex space-x-8">
                {navigation.pages.map((page, index) => (
                  <motion.div
                    key={page.name}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.5 }}
                  >
                    <Link
                      href={page.href}
                      className="relative text-sm font-semibold text-foreground hover:text-primary uppercase tracking-wide group transition-colors py-2"
                    >
                      {page.name}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300 nav-underline"></span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* CENTER: Search Bar */}
            <motion.div
              ref={searchRef}
              className="flex flex-1 max-w-2xl mx-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.7, type: "spring", stiffness: 100 }}
            >
              <form onSubmit={handleSearchSubmit} className="w-full">
                <div className="relative group">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.3 }}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10"
                  >
                    <MagnifyingGlassIcon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </motion.div>
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search for products, collections and more"
                    className="w-full pl-10 pr-4 py-2.5 bg-input border text-foreground border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition-all duration-300 hover:bg-accent/50 placeholder:text-muted-foreground"
                  />
                </div>
              </form>
            </motion.div>

            {/* RIGHT: Country + Icons */}
            <motion.div
              ref={iconsRef}
              className="flex items-center space-x-6 xl:space-x-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              {/* Country Indicator */}
              <div className="flex items-center gap-1">
                <span className="text-sm font-semibold text-foreground">🇮🇳 IN</span>
              </div>

              {/* Profile */}
              <Link href="/profile" className="flex flex-col items-center group cursor-pointer">
                <UserIcon className="h-6 w-6 text-foreground group-hover:text-primary transition-colors" />
                <span className="text-[10px] font-semibold text-muted-foreground mt-1 group-hover:text-primary transition-colors uppercase tracking-wide">
                  Profile
                </span>
              </Link>

              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="flex flex-col items-center group cursor-pointer"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <SunIcon className="h-6 w-6 text-foreground group-hover:text-primary transition-colors" />
                ) : (
                  <MoonIcon className="h-6 w-6 text-foreground group-hover:text-primary transition-colors" />
                )}
                <span className="text-[10px] font-semibold text-muted-foreground mt-1 group-hover:text-primary transition-colors uppercase tracking-wide">
                  Theme
                </span>
              </button>

              {/* Wishlist */}
              <Link href="/favorites/" className="flex flex-col items-center group cursor-pointer relative">
                <HeartIcon className="h-6 w-6 text-foreground group-hover:text-primary transition-colors" />
                <span className="text-[10px] font-semibold text-muted-foreground mt-1 group-hover:text-primary transition-colors uppercase tracking-wide">
                  Wishlist
                </span>
              </Link>

              {/* Bag */}
              <Link href="/bag" className="flex flex-col items-center group cursor-pointer relative">
                <ShoppingBagIcon className="h-6 w-6 text-foreground group-hover:text-primary transition-colors" />
                <span className="text-[10px] font-semibold text-muted-foreground mt-1 group-hover:text-primary transition-colors uppercase tracking-wide">
                  Bag
                </span>
              </Link>
            </motion.div>
          </div>
        </nav>
      </header>
    </motion.div>

    {/* Mobile Top Bar - Fixed on scroll */}
    <motion.div
      className="lg:hidden w-full fixed top-0 z-50 bg-background/95 backdrop-blur-md shadow-sm border-b border-border"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="flex h-14 sm:h-16 items-center justify-between px-3 sm:px-4">
        {/* Hamburger Menu */}
        <button
          type="button"
          className="rounded-lg p-2 text-foreground hover:bg-accent transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <Bars3Icon className="h-6 w-6 sm:h-7 sm:w-7" aria-hidden="true" />
        </button>

        {/* Mobile Logo */}
        <Link href="/" className="flex-shrink-0">
          <h1 className="font-bold text-primary text-xl sm:text-2xl">MORVILN</h1>
        </Link>

        {/* Search Icon */}
        <button
          onClick={() => setMobileSearchOpen(true)}
          className="p-2 text-foreground hover:bg-accent rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Search"
        >
          <MagnifyingGlassIcon className="h-6 w-6 sm:h-7 sm:w-7" />
        </button>
      </div>
    </motion.div>

    {/* Mobile Bottom Navigation Bar - Fixed */}
    <motion.nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t border-border shadow-2xl pb-safe"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
    >
      <div className="flex items-center justify-around h-14 sm:h-16 px-2">
        {/* Home */}
        <Link
          href="/"
          className="flex flex-col items-center justify-center flex-1 py-2 group"
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="relative flex items-center justify-center"
          >
            <svg
              className="h-5 w-5 sm:h-6 sm:w-6 text-foreground group-hover:text-primary transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </motion.div>
          <span className="text-[10px] sm:text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors mt-0.5 sm:mt-1">
            Home
          </span>
        </Link>

        {/* Shop */}
        <Link
          href="/allproducts"
          className="flex flex-col items-center justify-center flex-1 py-2 group"
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="relative flex items-center justify-center"
          >
            <svg
              className="h-5 w-5 sm:h-6 sm:w-6 text-foreground group-hover:text-primary transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </motion.div>
          <span className="text-[10px] sm:text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors mt-0.5 sm:mt-1">
            Shop
          </span>
        </Link>

        {/* Bag */}
        <Link
          href="/bag"
          className="flex flex-col items-center justify-center flex-1 py-2 group"
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="relative flex items-center justify-center"
          >
            <ShoppingBagIcon className="h-5 w-5 sm:h-6 sm:w-6 text-foreground group-hover:text-primary transition-colors" />
            {cartCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 h-5 w-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center"
              >
                {cartCount}
              </motion.span>
            )}
          </motion.div>
          <span className="text-[10px] sm:text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors mt-0.5 sm:mt-1">
            Bag
          </span>
        </Link>

        {/* Account */}
        <Link
          href="/profile"
          className="flex flex-col items-center justify-center flex-1 py-2 group"
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="relative flex items-center justify-center"
          >
            <UserIcon className="h-5 w-5 sm:h-6 sm:w-6 text-foreground group-hover:text-primary transition-colors" />
          </motion.div>
          <span className="text-[10px] sm:text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors mt-0.5 sm:mt-1">
            Account
          </span>
        </Link>
      </div>
    </motion.nav>
    </>
  );
};

export default NavBar;
