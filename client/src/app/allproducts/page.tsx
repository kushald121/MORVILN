"use client"
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingCart, ChevronDown, ChevronUp } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useRouter } from 'next/navigation';
import { LoaderThreeDemo } from '@/app/components/LoaderThreeDemo';
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
  const [sortBy, setSortBy] = useState('default');
  const [isLoading, setIsLoading] = useState<{ [key: string]: { cart: boolean, favorite: boolean } }>({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('all');

  // Collapsible filter states
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isPriceOpen, setIsPriceOpen] = useState(true);
  const [isAvailabilityOpen, setIsAvailabilityOpen] = useState(true);

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
        };

        const { products: fetchedProducts, pagination } = await ProductService.getProducts(filters);

        // Apply availability filter on client side
        let filteredProducts = fetchedProducts;
        if (availabilityFilter === 'in-stock') {
          filteredProducts = fetchedProducts.filter(p =>
            p.variants?.some(v => v.stock_quantity > 0)
          );
        } else if (availabilityFilter === 'out-of-stock') {
          filteredProducts = fetchedProducts.filter(p =>
            !p.variants?.some(v => v.stock_quantity > 0)
          );
        }

        setProducts(filteredProducts);
        setTotalPages(pagination?.total_pages || 1);
      } catch (error: any) {
        console.error('Error fetching products:', error);
        setError(error.message || 'Failed to fetch products');
      } finally {
        setIsProductsLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, sortBy, priceRange, selectedCategories, availabilityFilter]);

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

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(c => c !== categoryId)
        : [...prev, categoryId]
    );
    setCurrentPage(1);
  };

  const handlePriceRangeChange = (newRange: number[]) => {
    setPriceRange(newRange);
    setCurrentPage(1);
  };

  const handleAvailabilityChange = (value: string) => {
    setAvailabilityFilter(value);
    setCurrentPage(1);
  };

  const handleAddToCart = async (productId: string) => {
    setIsLoading(prev => ({ ...prev, [productId]: { ...prev[productId], cart: true } }));

    try {
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
            size: product.variants?.[0]?.size || 'M',
            color: product.variants?.[0]?.color || 'Default'
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

  const handleProductClick = (productId: string) => {
    router.push(`/productpage?id=${productId}`);
  };

  if (isProductsLoading && products.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <LoaderThreeDemo />
          <p className="mt-4 text-lg">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error && products.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error Loading Products</h1>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-white text-black rounded hover:bg-gray-200 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 md:pt-28">
      <div className="max-w-[1600px] mx-auto px-4 pb-16">
        <div className="flex flex-col lg:flex-row lg:gap-8">
          {/* Mobile Filter Toggle */}
          <button
            className="lg:hidden bg-white text-black py-3 px-6 rounded-lg mb-6 font-semibold uppercase tracking-wider text-sm"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
          </button>

          {/* Sidebar Filters */}
          <aside className={`w-full lg:w-64 flex-shrink-0 mb-8 lg:mb-0 ${isFilterOpen ? 'block' : 'hidden'} lg:block`}>
            <div className="lg:sticky lg:top-8 space-y-1">

              {/* Category Filter - dropdown */}
              <div className="border-b border-gray-800 py-4">
                <label className="block text-sm font-semibold uppercase tracking-wider mb-2 text-[#A6A6A6]">Category</label>
                {isCategoriesLoading ? (
                  <div className="flex justify-center py-4">
                    <LoaderThreeDemo />
                  </div>
                ) : (
                  <select
                    value={selectedCategories[0] || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSelectedCategories(val ? [val] : []);
                      setCurrentPage(1);
                    }}
                    className="w-full bg-transparent border border-gray-700 px-3 py-2 text-sm text-[#A6A6A6] focus:outline-none cursor-pointer"
                  >
                    <option value="" className="text-[#A6A6A6]">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id} className="text-[#A6A6A6]">
                        {cat.name} {`(${cat.count || cat.product_count || 0})`}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Price Filter - dropdown */}
              <div className="border-b border-gray-800 py-4">
                <label className="block text-sm font-semibold uppercase tracking-wider mb-2 text-[#A6A6A6]">Price</label>
                <select
                  value={`${priceRange[0]}-${priceRange[1]}`}
                  onChange={(e) => {
                    const val = e.target.value;
                    switch (val) {
                      case '0-999': setPriceRange([0, 999]); break;
                      case '1000-1999': setPriceRange([1000, 1999]); break;
                      case '2000-2999': setPriceRange([2000, 2999]); break;
                      case '3000-4999': setPriceRange([3000, 4999]); break;
                      case '5000+': setPriceRange([5000, 100000]); break;
                      default: setPriceRange([0, 5000]); break;
                    }
                    setCurrentPage(1);
                  }}
                  className="w-full bg-transparent border border-gray-700 px-3 py-2 text-sm text-[#A6A6A6] focus:outline-none cursor-pointer"
                >
                  <option value="0-5000" className="text-[#A6A6A6]">All Prices</option>
                  <option value="0-999" className="text-[#A6A6A6]">₹0 - ₹999</option>
                  <option value="1000-1999" className="text-[#A6A6A6]">₹1000 - ₹1999</option>
                  <option value="2000-2999" className="text-[#A6A6A6]">₹2000 - ₹2999</option>
                  <option value="3000-4999" className="text-[#A6A6A6]">₹3000 - ₹4999</option>
                  <option value="5000+" className="text-[#A6A6A6]">₹5000+</option>
                </select>
              </div>

              {/* Availability Filter - dropdown */}
              <div className="border-b border-gray-800 py-4">
                <label className="block text-sm font-semibold uppercase tracking-wider mb-2 text-[#A6A6A6]">Availability</label>
                <select
                  value={availabilityFilter}
                  onChange={(e) => { setAvailabilityFilter(e.target.value); setCurrentPage(1); }}
                  className="w-full bg-transparent border border-gray-700 px-3 py-2 text-sm text-[#A6A6A6] focus:outline-none cursor-pointer"
                >
                  <option value="all" className="text-[#A6A6A6]">All Products</option>
                  <option value="in-stock" className="text-[#A6A6A6]">In stock only</option>
                  <option value="out-of-stock" className="text-[#A6A6A6]">Out of stock</option>
                </select>
              </div>

            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Top Bar */}
            <div className="relative mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* left: view toggles placeholder (keeps space) */}
                </div>

                {/* center: product count */}
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-[#A6A6A6] uppercase tracking-wider text-sm">
                      {products.length} Products
                    </p>
                    {isProductsLoading && (
                      <div className="mt-2"><LoaderThreeDemo /></div>
                    )}
                  </div>
                </div>

                {/* right: sort select */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-transparent border border-transparent px-6 py-2 pr-10 focus:outline-none text-sm uppercase tracking-wider cursor-pointer text-[#A6A6A6]"
                  >
                    <option value="default" className="bg-black text-[#A6A6A6]">Sort By</option>
                    <option value="price-low" className="bg-black text-[#A6A6A6]">Price: Low to High</option>
                    <option value="price-high" className="bg-black text-[#A6A6A6]">Price: High to Low</option>
                    <option value="name" className="bg-black text-[#A6A6A6]">Name: A to Z</option>
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <ChevronDown className="w-4 h-4 text-[#A6A6A6]" />
                  </div>
                </div>
              </div>

              {/* decorative thin lines under the top bar */}
              <div className="mt-6">
                <div className="h-[1px] bg-gray-800" />
                <div className="h-[1px] bg-gray-900 mt-1" />
              </div>
            </div>

            {/* Product Grid */}
            <AnimatePresence mode="wait">
              <motion.div
                key={products.length}
                className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8 md:gap-x-12 md:gap-y-16"
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
                        className="relative overflow-hidden mb-4"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="aspect-[507/634] flex items-center justify-center cursor-pointer bg-gray-900" onClick={() => handleProductClick(product.id)}>
                          <Image
                            width={400}
                            height={533}
                            src={productImage}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=250&fit=crop&crop=center';
                            }}
                          />
                        </div>
                        {isOnSale && (
                          <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider">
                            Save {discountPercentage}%
                          </div>
                        )}

                        {/* Add to Cart Plus Button - Bottom Right - Hidden by default, visible on hover */}
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(product.id);
                          }}
                          disabled={isLoading[product.id]?.cart}
                          className="absolute bottom-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white text-black hover:bg-gray-100 transition-all duration-200 shadow-lg opacity-0 group-hover:opacity-100"
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.5 }}
                        >
                          {isLoading[product.id]?.cart ? (
                            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <span className="text-2xl font-bold">+</span>
                          )}
                        </motion.button>
                      </motion.div>

                      <div className="space-y-2">
                        <h3
                          className="font-semibold text-sm cursor-pointer hover:text-gray-300 transition-colors line-clamp-2 uppercase tracking-widest text-white text-center"
                          onClick={() => handleProductClick(product.id)}
                        >
                          {product.name}
                        </h3>
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-red-800 font-bold text-base">
                            ₹{Math.round(product.base_price)}
                          </span>
                          {product.compare_at_price && (
                            <span className="text-gray-500 line-through text-xs">
                              ₹{Math.round(product.compare_at_price)}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-16">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-5 py-2 border border-gray-700 rounded disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white hover:text-black transition-all duration-200 uppercase tracking-wider text-sm font-semibold"
                >
                  Previous
                </button>

                <div className="flex gap-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                    if (pageNum > totalPages) return null;

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-4 py-2 rounded transition-all duration-200 font-semibold ${currentPage === pageNum
                            ? 'bg-white text-black'
                            : 'border border-gray-700 hover:bg-white hover:text-black'
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
                  className="px-5 py-2 border border-gray-700 rounded disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white hover:text-black transition-all duration-200 uppercase tracking-wider text-sm font-semibold"
                >
                  Next
                </button>
              </div>
            )}

            {/* No Products Message */}
            {!isProductsLoading && products.length === 0 && (
              <div className="text-center py-20">
                <h3 className="text-2xl font-bold mb-3 uppercase tracking-wider">No products found</h3>
                <p className="text-gray-400 mb-6">
                  Try adjusting your filters
                </p>
                <button
                  onClick={() => {
                    setSelectedCategories([]);
                    setPriceRange([0, 5000]);
                    setAvailabilityFilter('all');
                    setCurrentPage(1);
                  }}
                  className="px-8 py-3 bg-white text-black rounded hover:bg-gray-200 transition-colors font-semibold uppercase tracking-wider text-sm"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AllProducts;