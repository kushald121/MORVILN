"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Star, Plus } from "lucide-react";
import { ProductService, Product } from "../services/productService";
import Link from 'next/link';
interface ExploreProductsProps {
  title?: string;
  showViewAll?: boolean;
  category?: string;
}

const ExploreProducts: React.FC<ExploreProductsProps> = ({
  title = "Explore Products",
  showViewAll = true,
  category,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Fetch ALL products initially
  const fetchAllProducts = async (pageNum = 1, initialLoad = false) => {
    try {
      if (initialLoad) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      // Fetch products without limit to get all products
      const { products: fetchedProducts, total } = await ProductService.getProducts({
        page: pageNum,
        // Remove or set a very high limit to get all products
        limit: 50, // You can increase this number based on your API capabilities
        ...(category && { category }),
        // Remove is_featured filter to get ALL products
      });

      if (pageNum === 1) {
        setProducts(fetchedProducts);
      } else {
        setProducts(prev => [...prev, ...fetchedProducts]);
      }

      // Check if there are more products to load
      setHasMore(fetchedProducts.length > 0);
      setPage(pageNum);

    } catch (error: any) {
      console.error("Error fetching products:", error);
      setError(error.message || "Failed to fetch products");
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchAllProducts(1, true);
  }, [category]);

  // Calculate discount percentage
  const calculateDiscount = (product: Product) => {
    return product.compare_at_price && product.base_price
      ? Math.round(
        ((product.compare_at_price - product.base_price) /
          product.compare_at_price) *
        100
      )
      : 0;
  };

  const handleLoadMore = () => {
    fetchAllProducts(page + 1, false);
  };

  if (isLoading) {
    return (
      <div className="bg-black text-white py-16 px-4">
        <div className="max-w-[1600px] mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center uppercase tracking-widest">
            {title}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {Array.from({ length: 12 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse bg-gray-900 aspect-[3/4] rounded"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black text-white py-16 px-4">
        <div className="max-w-[1600px] mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
          <p className="text-gray-400">Failed to load products</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white py-16 px-4 lg:px-8">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-12">
          <h2 className="text-3xl font-bold uppercase tracking-widest mb-6 lg:mb-0">
            {title} ({products.length} products)
          </h2>
          {showViewAll && (
            <Link href="/allproducts" className="text-white border border-white px-8 py-3 font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-colors">
              View All
            </Link>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {products.map((product) => {
            const discount = calculateDiscount(product);
            const mainImage =
              product.media?.find((m) => m.media_type === "image")
                ?.media_url ||
              "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=900&fit=crop";

            return (
              <div
                key={product.id}
                className="group cursor-pointer relative"
                onClick={() =>
                  (window.location.href = `/productpage?id=${product.id}`)
                }
              >
                {/* Image Container */}
                <div className="relative aspect-[3/4] mb-6 overflow-hidden bg-[#0a0a0a]">
                  <Image
                    src={mainImage}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />

                  {/* Discount Badge */}
                  {discount > 0 && (
                    <div className="absolute top-4 left-4 bg-[#E31E24] text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider">
                      Save {discount}%
                    </div>
                  )}


                  {/* Black Friday Tag */}
                  <div className="absolute top-12 left-2 transform -rotate-12">
                    <div className="bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded-sm shadow-lg border border-white/20 relative">
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-1 h-3 bg-white/50 rounded-full"></div>
                      BLACK
                      <br />
                      FRIDAY
                    </div>
                  </div>

                  {/* Quick Add Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Add to cart logic here
                      console.log("Add to cart", product.id);
                    }}
                    className="absolute bottom-4 right-4 w-10 h-10 bg-white text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-200 rounded-full"
                  >
                    <Plus size={20} />
                  </button>
                </div>

                {/* Product Info */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-gray-200 leading-relaxed line-clamp-2">
                    {product.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className="fill-green-500 text-green-500"
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-400">(4.8)</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-[#E31E24]">
                      RS. {Math.round(product.base_price).toLocaleString()}.00
                    </span>
                    {product.compare_at_price && (
                      <span className="text-sm text-gray-500 line-through">
                        RS.{" "}
                        {Math.round(product.compare_at_price).toLocaleString()}
                        .00
                      </span>
                    )}
                  </div>

                  {/* Category/Tags */}
                  {product.category && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">
                        {product.category.name}
                      </span>
                    </div>
                  )}

                  {/* Stock Status */}
                  <div className="flex items-center gap-2 text-xs">
                    <div
                      className={`w-2 h-2 rounded-full ${product.variants?.some((v) => v.stock_quantity > 0)
                        ? "bg-green-500 animate-pulse"
                        : "bg-red-500"
                        }`}
                    />
                    <span className="text-gray-400">
                      {product.variants?.some((v) => v.stock_quantity > 0)
                        ? "In Stock"
                        : "Out of Stock"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Load More Button - Show only if there are more products */}
        {hasMore && (
          <div className="text-center mt-12">
            <button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className={`border ${isLoadingMore
                ? "border-gray-800 text-gray-800 cursor-not-allowed"
                : "border-white text-white hover:bg-white hover:text-black"
                } px-8 py-3 font-bold uppercase tracking-wider transition-colors`}
            >
              {isLoadingMore ? "Loading..." : "Load More Products"}
            </button>
          </div>
        )}

        {/* Show message when all products are loaded */}
        {!hasMore && products.length > 0 && (
          <div className="text-center mt-12">
            <p className="text-gray-400">
              All {products.length} products loaded
            </p>
          </div>
        )}

        {/* Show empty state */}
        {!isLoading && products.length === 0 && (
          <div className="text-center mt-12">
            <p className="text-gray-400">No products found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreProducts;