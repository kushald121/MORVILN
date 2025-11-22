"use client";

import React, { useState, useEffect } from 'react';
// import SplashCursor from '../components/ui/splash-cursor';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingCart, Filter } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useRouter } from 'next/navigation';
import { LoaderThree } from '@/app/components/ui/loader';
import { ProductService, Product, Category, ProductFilters } from '../services/productService';

const AllProducts = () => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedGender, setSelectedGender] = useState<string>('');
  const [sortBy, setSortBy] = useState('default');
  const [isLoading, setIsLoading] = useState<{[key: string]: {cart: boolean, favorite: boolean}}>({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const { addToCart, removeFromCart, addToFavorites, removeFromFavorites, isInCart, isInFavorites } = useCart();

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsProductsLoading(true);
        setError(null);

        const filters: ProductFilters = {
          page: currentPage,
          limit: 20,
          sort_by: (sortBy === 'price-low' || sortBy === 'price-high') ? 'price' : 
                   sortBy === 'name' ? 'name' : 'created_at',
          sort_order: sortBy === 'price-high' ? 'desc' : 'asc',
          min_price: priceRange[0],
          max_price: priceRange[1],
          category_id: selectedCategories.length > 0 ? selectedCategories[0] : undefined,
          gender: selectedGender || undefined,
          search: searchQuery || undefined
        };

        const { products: fetchedProducts, pagination } = await ProductService.getProducts(filters);
        setProducts(fetchedProducts);
        setTotalPages(pagination?.total_pages || 1);
      } catch (error: any) {
        console.error('Error fetching products:', error);
        setError(error.message || 'Failed to fetch products');
      } finally {
        setIsProductsLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, sortBy, priceRange, selectedCategories, selectedGender, searchQuery]);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsCategoriesLoading(true);
        const fetchedCategories = await ProductService.getCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setIsCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const genderOptions = ['men', 'women', 'unisex', 'kids'];

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(c => c !== categoryId)
        : [...prev, categoryId]
    );
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleGenderChange = (gender: string) => {
    setSelectedGender(prev => prev === gender ? '' : gender);
    setCurrentPage(1);
  };

  const handlePriceRangeChange = (newRange: number[]) => {
    setPriceRange(newRange);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  // Cart and Favorite handlers
  const handleAddToCart = async (productId: string) => {
    setIsLoading(prev => ({ ...prev, [productId]: { ...prev[productId], cart: true } }));

    try {
      // Find the product to add to cart
      const product = products.find(p => p.id === productId);
      if (product) {
        const productImage = product.media?.find(m => m.is_primary)?.media_url || 
          product.media?.[0]?.media_url || 
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=250&fit=crop&crop=center";

        if (isInCart(productId)) {
          removeFromCart(productId);
        } else {
          addToCart({
            id: productId,
            name: product.name,
            price: product.base_price,
            image: productImage,
            size: product.variants?.[0]?.size || 'M', // Default to first available size
            color: product.variants?.[0]?.color || 'Default' // Default to first available color
          });
        }
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsLoading(prev => ({ ...prev, [productId]: { ...prev[productId], cart: false } }));
    }
  };

  const handleToggleFavorite = async (productId: string) => {
    setIsLoading(prev => ({ ...prev, [productId]: { ...prev[productId], favorite: true } }));

    try {
      // Find the product to add to favorites
      const product = products.find(p => p.id === productId);
      if (product) {
        const productImage = product.media?.find(m => m.is_primary)?.media_url || 
          product.media?.[0]?.media_url || 
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=250&fit=crop&crop=center";

        if (isInFavorites(productId)) {
          removeFromFavorites(productId);
        } else {
          addToFavorites({
            productId: productId,
            name: product.name,
            price: product.base_price,
            originalPrice: product.compare_at_price,
            image: productImage,
            stock: product.variants?.reduce((total, variant) => total + variant.stock_quantity, 0) || 10
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
  const handleProductClick = (productId: string) => {
    router.push(`/productpage?id=${productId}`);
  };

  // Show loading state
  if (isProductsLoading && products.length === 0) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <LoaderThree size="lg" />
          <p className="mt-4 text-lg">Loading products...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && products.length === 0) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error Loading Products</h1>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

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
                {/* Search Filter */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">Search</h3>
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                  />
                </div>

                {/* Price Filter */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">Price Range</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Min. Price</span>
                      <span className="font-semibold">₹{priceRange[0]}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Max. Price</span>
                      <span className="font-semibold">₹{priceRange[1]}</span>
                    </div>
                    <div className="relative">
                      <input
                        type="range"
                        min="0"
                        max="5000"
                        value={priceRange[1]}
                        onChange={(e) => handlePriceRangeChange([priceRange[0], parseInt(e.target.value)])}
                        className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>₹0</span>
                        <span>₹5000</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Category Filter */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">Categories</h3>
                  {isCategoriesLoading ? (
                    <div className="flex justify-center py-4">
                      <LoaderThree size="sm" />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {categories.map(category => (
                        <label key={category.id} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(category.id)}
                            onChange={() => handleCategoryChange(category.id)}
                            className="mr-3 w-4 h-4 text-primary bg-background border-gray-600 rounded focus:ring-primary"
                          />
                          <span className="text-muted-foreground">{category.name}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Gender Filter */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">Gender</h3>
                  <div className="space-y-3">
                    {genderOptions.map(gender => (
                      <label key={gender} className="flex items-center">
                        <input
                          type="radio"
                          name="gender"
                          checked={selectedGender === gender}
                          onChange={() => handleGenderChange(gender)}
                          className="mr-3 w-4 h-4 text-primary bg-background border-gray-600 focus:ring-primary"
                        />
                        <span className="text-muted-foreground capitalize">{gender}</span>
                      </label>
                    ))}
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        checked={selectedGender === ''}
                        onChange={() => setSelectedGender('')}
                        className="mr-3 w-4 h-4 text-primary bg-background border-gray-600 focus:ring-primary"
                      />
                      <span className="text-muted-foreground">All</span>
                    </label>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1">
              {/* Top Bar */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div className="flex items-center gap-4">
                  <p className="text-muted-foreground">
                    Showing {products.length} results
                    {searchQuery && ` for "${searchQuery}"`}
                  </p>
                  {isProductsLoading && (
                    <LoaderThree size="sm" />
                  )}
                </div>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-background border border-gray-600 px-4 py-2 pr-8 rounded focus:outline-none focus:border-primary text-foreground"
                  >
                    <option value="default">Default sorting</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name">Name: A to Z</option>
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
                  key={products.length}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {products.map((product, index) => {
                    const productImage = product.media?.find(m => m.is_primary)?.media_url || 
                      product.media?.[0]?.media_url || 
                      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=250&fit=crop&crop=center";
                    
                    const isOnSale = product.compare_at_price && product.compare_at_price > product.base_price;
                    const discountPercentage = isOnSale && product.compare_at_price
                      ? Math.round(((product.compare_at_price - product.base_price) / product.compare_at_price) * 100)
                      : 0;

                    return (
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
                              width={300}
                              height={400}
                              src={productImage}
                              alt={product.name}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                              onError={(e) => {
                                e.currentTarget.src = 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=250&fit=crop&crop=center';
                              }}
                            />
                          </div>
                          {isOnSale && (
                            <motion.div
                              className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            >
                              {discountPercentage}% OFF
                            </motion.div>
                          )}
                          {product.is_featured && (
                            <motion.div
                              className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-semibold"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            >
                              Featured
                            </motion.div>
                          )}
                          <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />

                          {/* Action Buttons */}
                          <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <motion.button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleFavorite(product.id);
                              }}
                              disabled={isLoading[product.id]?.favorite}
                              className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
                                isInFavorites(product.id)
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
                                  className={`w-4 h-4 ${isInFavorites(product.id) ? 'fill-current' : ''}`}
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
                                isInCart(product.id)
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
                          <div className="text-xs text-muted-foreground">
                            {product.category?.name || 'Uncategorized'}
                          </div>
                          <h3 className="font-semibold text-lg cursor-pointer line-clamp-2" onClick={() => handleProductClick(product.id)}>
                            {product.name}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <motion.span
                              className="text-primary font-bold text-xl"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
                            >
                              ₹{Math.round(product.base_price)}
                            </motion.span>
                            {product.compare_at_price && (
                              <motion.span
                                className="text-muted-foreground line-through"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                              >
                                ₹{Math.round(product.compare_at_price)}
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
                                isInCart(product.id)
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-secondary text-secondary-foreground hover:bg-accent'
                              }`}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              {isLoading[product.id]?.cart ? (
                                <div className="flex items-center justify-center gap-2">
                                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                  <span>Loading...</span>
                                </div>
                              ) : isInCart(product.id) ? (
                                'Remove from Cart'
                              ) : (
                                'Add to Cart'
                              )}
                            </motion.button>

                            <motion.button
                              onClick={() => handleToggleFavorite(product.id)}
                              disabled={isLoading[product.id]?.favorite}
                              className={`p-2 rounded-lg font-semibold transition-all duration-200 ${
                                isInFavorites(product.id)
                                  ? 'bg-red-500 text-white'
                                  : 'bg-secondary text-secondary-foreground hover:bg-accent'
                              }`}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {isLoading[product.id]?.favorite ? (
                                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Heart className={`w-4 h-4 ${isInFavorites(product.id) ? 'fill-current' : ''}`} />
                              )}
                            </motion.button>
                          </div>
                        </motion.div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </AnimatePresence>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent transition-colors"
                  >
                    Previous
                  </button>
                  
                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                      if (pageNum > totalPages) return null;
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-3 py-2 rounded-lg transition-colors ${
                            currentPage === pageNum
                              ? 'bg-primary text-primary-foreground'
                              : 'border border-gray-300 hover:bg-accent'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}

              {/* No Products Message */}
              {!isProductsLoading && products.length === 0 && (
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold mb-2">No products found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your filters or search terms
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategories([]);
                      setSelectedGender('');
                      setPriceRange([0, 5000]);
                      setCurrentPage(1);
                    }}
                    className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default AllProducts;