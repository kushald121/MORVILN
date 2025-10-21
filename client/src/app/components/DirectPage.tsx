"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';
import { SparklesText } from './ui/sparkels';
// import SplashCursor from './ui/splash-cursor';

const DirectPages = () => {
  return (
    <div className="w-full relative min-h-screen ">
      {/* <SplashCursor /> */}
      {/* Enhanced background gradient orbs matching hero style */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 bg-blue-800/30 rounded-full blur-3xl"
          animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-900/30 rounded-full blur-3xl"
          animate={{ x: [0, -100, 0], y: [0, -50, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-900/25 rounded-full blur-3xl"
          animate={{ x: [-50, 50, -50], y: [-50, 50, -50] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute top-1/4 right-1/4 w-72 h-72 bg-cyan-800/20 rounded-full blur-3xl"
          animate={{ x: [0, -80, 0], y: [0, 80, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-purple-900/20 rounded-full blur-3xl"
          animate={{ x: [0, 60, 0], y: [0, -60, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>

      {/* Top Promotional Banners */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 relative z-10 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Local Warehousing Banner */}
        <motion.div
          className="relative group cursor-pointer h-full"
          whileHover={{ scale: 1.02, y: -5 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative h-full backdrop-blur-md border border-cyan-400/20 p-4 sm:p-6 lg:p-8 flex flex-col justify-center items-center text-center min-h-[280px] sm:min-h-[320px] lg:min-h-[350px] hover:bg-cyan-500/5 transition-all duration-300 rounded-2xl overflow-hidden shadow-2xl">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <motion.div
              className="relative z-10 mb-3 sm:mb-4 lg:mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 lg:px-4 py-1 sm:py-2 rounded-full mb-3 sm:mb-4 lg:mb-6 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-sm border border-cyan-400/30 shadow-lg">
                <span className="text-cyan-300 text-sm sm:text-base lg:text-lg">👕</span>
                <span className="text-cyan-200 font-semibold text-xs sm:text-sm uppercase tracking-wide">Local Warehousing</span>
              </div>
            </motion.div>

            <motion.h2
              className="relative z-10 text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-2 sm:mb-3 lg:mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Fast Delivery
            </motion.h2>

            <motion.div
              className="relative z-10 mb-4 sm:mb-6 lg:mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <span className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent animate-pulse">From $1.00</span>
            </motion.div>

            <motion.button
              className="relative z-10 group/btn px-6 sm:px-8 lg:px-10 py-2 sm:py-3 lg:py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full font-bold text-sm sm:text-base lg:text-lg overflow-hidden shadow-xl shadow-cyan-500/30 hover:shadow-cyan-500/50"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 25px 60px rgba(6, 182, 212, 0.5)",
              }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <span className="relative z-10 flex items-center gap-1 sm:gap-2">
                Shop Now
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <span className="text-lg sm:text-xl">➤</span>
                </motion.span>
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600"
                initial={{ x: "-100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          </div>
        </motion.div>

        {/* Price Drop Banner */}
        <motion.div
          className="relative group cursor-pointer h-full"
          whileHover={{ scale: 1.02, y: -5 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative h-full backdrop-blur-md border border-blue-400/20 p-8 flex flex-col justify-center items-center text-center min-h-[350px] hover:bg-blue-500/5 transition-all duration-300 rounded-2xl overflow-hidden shadow-2xl">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <motion.div
              className="relative z-10 mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 backdrop-blur-sm border border-blue-400/30 shadow-lg">
                <span className="text-blue-300 text-lg">👖</span>
                <span className="text-blue-200 font-semibold text-sm uppercase tracking-wide">Save Up to $40</span>
              </div>
            </motion.div>

            <motion.h2
              className="relative z-10 text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-400 bg-clip-text text-transparent mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Price Drop
            </motion.h2>

            <motion.div
              className="relative z-10 mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <span className="text-2xl font-bold text-blue-300">🔥 Hot Deals</span>
            </motion.div>

            <motion.button
              className="relative z-10 group/btn px-10 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full font-bold text-lg overflow-hidden shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 25px 60px rgba(59, 130, 246, 0.5)",
              }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <span className="relative z-10 flex items-center gap-2">
                Shop Now
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <span className="text-xl">➤</span>
                </motion.span>
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600"
                initial={{ x: "-100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          </div>
        </motion.div>

        {/* Clearance Banner */}
        <motion.div
          className="relative group cursor-pointer h-full"
          whileHover={{ scale: 1.02, y: -5 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative h-full backdrop-blur-md border border-purple-400/20 p-8 flex flex-col justify-center items-center text-center min-h-[350px] hover:bg-purple-500/5 transition-all duration-300 rounded-2xl overflow-hidden shadow-2xl">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <motion.div
              className="relative z-10 mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-400/30 shadow-lg">
                <span className="text-purple-300 text-lg">👟</span>
                <span className="text-purple-200 font-semibold text-sm uppercase tracking-wide">Up to 70% Off</span>
              </div>
            </motion.div>

            <motion.h2
              className="relative z-10 text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Clearance
            </motion.h2>

            <motion.div
              className="relative z-10 mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <span className="text-2xl font-bold text-pink-300">⚡ Final Sale</span>
            </motion.div>

            <motion.button
              className="relative z-10 group/btn px-10 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-full font-bold text-lg overflow-hidden shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 25px 60px rgba(168, 85, 247, 0.5)",
              }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <span className="relative z-10 flex items-center gap-2">
                Shop Now
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <span className="text-xl">➤</span>
                </motion.span>
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-pink-600 to-red-600"
                initial={{ x: "-100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Bottom Product Sections */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8 relative z-10 px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
        {/* Fashion Collection */}
        <motion.div
          className="relative backdrop-blur-md border border-cyan-400/20 p-6 sm:p-8 lg:p-10 rounded-3xl overflow-hidden shadow-2xl hover:bg-cyan-500/5 transition-all duration-300"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8">
            <motion.h2
              className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white flex items-center mb-2 sm:mb-0"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <SparklesText text="Fashion Collection" className='text-2xl sm:text-3xl lg:text-4xl xl:text-5xl' />
              <span className="ml-2 sm:ml-3 text-cyan-400 text-2xl sm:text-3xl lg:text-4xl xl:text-5xl">✨</span>
            </motion.h2>
          </div>

          <div className="flex space-x-4 mb-6">
            {/* Product 1 - Red Dress */}
            <motion.div
              className="glass border border-cyan-400/20 rounded-lg p-4 flex-1 text-center hover:bg-cyan-500/10 transition-all duration-300 group cursor-pointer"
              whileHover={{ scale: 1.05, y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="w-full h-32 bg-gradient-to-br from-red-600/20 to-red-700/20 rounded mx-auto mb-3 flex items-center justify-center overflow-hidden shadow-lg group-hover:shadow-red-500/30 transition-all duration-300 relative">
                <Image
                  src="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=200&h=300&fit=crop"
                  alt="Premium Dress"
                  width={200}
                  height={300}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h3 className="font-semibold text-sm mb-1 text-cyan-100">Premium Dress</h3>
              <p className="text-cyan-300 text-sm font-bold">$149.00</p>
            </motion.div>

            {/* Product 2 - Jewelry */}
            <motion.div
              className="glass border border-blue-400/20 rounded-lg p-4 flex-1 text-center hover:bg-blue-500/10 transition-all duration-300 group cursor-pointer"
              whileHover={{ scale: 1.05, y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="w-full h-32 bg-gradient-to-br from-purple-600/20 to-purple-700/20 rounded mx-auto mb-3 flex items-center justify-center overflow-hidden shadow-lg group-hover:shadow-purple-500/30 transition-all duration-300 relative">
                <Image
                  src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200&h=300&fit=crop"
                  alt="Designer Jewelry"
                  width={200}
                  height={300}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h3 className="font-semibold text-sm mb-1 text-cyan-100">Designer Jewelry</h3>
              <p className="text-cyan-300 text-sm font-bold">$189.00 - $249.00</p>
            </motion.div>

            {/* Product 3 - Handbag */}
            <motion.div
              className="glass border border-indigo-400/20 rounded-lg p-4 flex-1 text-center hover:bg-indigo-500/10 transition-all duration-300 group cursor-pointer"
              whileHover={{ scale: 1.05, y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="w-full h-32 bg-gradient-to-br from-amber-700/20 to-amber-800/20 rounded mx-auto mb-3 flex items-center justify-center overflow-hidden shadow-lg group-hover:shadow-amber-500/30 transition-all duration-300 relative">
                <Image
                  src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=200&h=300&fit=crop"
                  alt="Luxury Handbag"
                  width={200}
                  height={300}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h3 className="font-semibold text-sm mb-1 text-cyan-100">Luxury Handbag</h3>
              <p className="text-cyan-300 text-sm font-bold">$800.00</p>
            </motion.div>
          </div>

          <div className="flex items-center justify-between">
            <motion.button
              className="text-cyan-300 text-3xl hover:text-cyan-100 transition-colors p-2"
              whileHover={{ scale: 1.1, x: -2 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              ‹
            </motion.button>

            <motion.button
              className="group/btn relative px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full font-semibold overflow-hidden shadow-lg shadow-cyan-500/30"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 50px rgba(6, 182, 212, 0.4)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 flex items-center gap-2">
                <span className="text-lg">🛍️</span>
                Shop Collection
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <span className="text-lg">➤</span>
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
              className="text-cyan-300 text-3xl hover:text-cyan-100 transition-colors p-2"
              whileHover={{ scale: 1.1, x: 2 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              ›
            </motion.button>
          </div>
        </motion.div>

        {/* Today's Pick */}
        <motion.div
          className="relative backdrop-blur-md border border-purple-400/20 p-6 sm:p-8 lg:p-10 rounded-3xl overflow-hidden shadow-2xl hover:bg-purple-500/5 transition-all duration-300"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8">
            <motion.h2
              className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white flex items-center mb-2 sm:mb-0"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
             <SparklesText text="Today's Pick" className='text-2xl sm:text-3xl lg:text-4xl xl:text-5xl' />
              <span className="ml-2 sm:ml-3 text-purple-400 text-2xl sm:text-3xl lg:text-4xl xl:text-5xl">⭐</span>
            </motion.h2>
            <motion.div
              className="relative z-10 text-left sm:text-right"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <p className="text-cyan-300 text-sm sm:text-base lg:text-lg font-bold">From $29.00</p>
            </motion.div>
          </div>

          <div className="flex space-x-4 mb-6">
            {/* Product 1 - Chair */}
            <motion.div
              className="glass border border-cyan-400/20 rounded-lg p-4 flex-1 text-center hover:bg-cyan-500/10 transition-all duration-300 group cursor-pointer"
              whileHover={{ scale: 1.05, y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="w-full h-32 bg-gradient-to-br from-amber-200/20 to-amber-300/20 rounded mx-auto mb-3 flex items-center justify-center overflow-hidden shadow-lg group-hover:shadow-amber-500/30 transition-all duration-300 relative">
                <Image
                  src="https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=200&h=300&fit=crop"
                  alt="Modern Chair"
                  width={200}
                  height={300}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h3 className="font-semibold text-sm mb-1 text-cyan-100">Modern Chair</h3>
              <p className="text-gray-400 text-sm line-through">$578.00</p>
              <p className="text-green-400 font-bold text-sm">$49.00</p>
            </motion.div>

            {/* Product 2 - Plant */}
            <motion.div
              className="glass border border-blue-400/20 rounded-lg p-4 flex-1 text-center hover:bg-blue-500/10 transition-all duration-300 group cursor-pointer"
              whileHover={{ scale: 1.05, y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="w-full h-32 bg-gradient-to-br from-green-200/20 to-green-300/20 rounded mx-auto mb-3 flex items-center justify-center overflow-hidden shadow-lg group-hover:shadow-green-500/30 transition-all duration-300 relative">
                <Image
                  src="https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=200&h=300&fit=crop"
                  alt="Indoor Plant"
                  width={200}
                  height={300}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h3 className="font-semibold text-sm mb-1 text-cyan-100">Indoor Plant</h3>
              <p className="text-cyan-300 text-sm font-bold">$29.00</p>
            </motion.div>

            {/* Product 3 - Headphones */}
            <motion.div
              className="glass border border-indigo-400/20 rounded-lg p-4 flex-1 text-center hover:bg-indigo-500/10 transition-all duration-300 group cursor-pointer"
              whileHover={{ scale: 1.05, y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="w-full h-32 bg-gradient-to-br from-slate-800/20 to-slate-900/20 rounded mx-auto mb-3 flex items-center justify-center overflow-hidden shadow-lg group-hover:shadow-slate-500/30 transition-all duration-300 relative">
                <Image
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=300&fit=crop"
                  alt="Wireless Headphones"
                  width={200}
                  height={300}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h3 className="font-semibold text-sm mb-1 text-cyan-100">Wireless Headphones</h3>
              <p className="text-cyan-300 text-sm font-bold">$156.00</p>
            </motion.div>
          </div>

          <div className="flex items-center justify-between">
            <motion.button
              className="text-cyan-300 text-3xl hover:text-cyan-100 transition-colors p-2"
              whileHover={{ scale: 1.1, x: -2 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              ‹
            </motion.button>

            <motion.button
              className="group/btn relative px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-full font-semibold overflow-hidden shadow-lg shadow-purple-500/30"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 50px rgba(168, 85, 247, 0.4)",
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <span className="relative z-10 flex items-center gap-2">
                <span className="text-lg">🛒</span>
                Shop Deals
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <span className="text-lg">➤</span>
                </motion.span>
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-pink-600 to-red-600"
                initial={{ x: "-100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>

            <motion.button
              className="text-cyan-300 text-3xl hover:text-cyan-100 transition-colors p-2"
              whileHover={{ scale: 1.1, x: 2 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              ›
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DirectPages;
