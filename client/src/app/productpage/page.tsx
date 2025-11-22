"use client";
import React, { useState, useEffect } from "react";
import {
  Heart,
  ChevronLeft,
  ChevronRight,
  Star,
} from "lucide-react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useSearchParams } from "next/navigation";
import { useCart } from "../contexts/CartContext";
import { LoaderThree } from "@/app/components/ui/loader";
import { ProductService, Product } from "../services/productService";



const ProductPage = () => {
  const searchParams = useSearchParams();
  const productId = searchParams.get('id');
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRelatedLoading, setIsRelatedLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();
  const { addToFavorites, removeFromFavorites, isInFavorites } = useCart();

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setError('Product ID is required');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const productData = await ProductService.getProduct(productId);
        setProduct(productData);

        // Set default selections
        if (productData.variants && productData.variants.length > 0) {
          const firstVariant = productData.variants[0];
          setSelectedSize(firstVariant.size || '');
          setSelectedColor(firstVariant.color || '');
        }
      } catch (error: any) {
        console.error('Error fetching product:', error);
        setError(error.message || 'Failed to fetch product');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // Fetch related products
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        setIsRelatedLoading(true);
        const { products } = await ProductService.getProducts({
          limit: 4,
          is_featured: true
        });
        setRelatedProducts(products);
      } catch (error) {
        console.error('Error fetching related products:', error);
      } finally {
        setIsRelatedLoading(false);
      }
    };

    fetchRelatedProducts();
  }, []);


  // Get available sizes and colors from variants
  const availableSizes = product?.variants?.map(v => v.size).filter(Boolean) || [];
  const availableColors = product?.variants?.map(v => ({
    name: v.color || 'Default',
    code: v.color_code || '#000000'
  })).filter(v => v.name !== 'Default') || [];

  // Get product images from media
  const productImages = product?.media?.filter(m => m.media_type === 'image').sort((a, b) => a.sort_order - b.sort_order) || [];
  const images = productImages.length > 0 ? productImages.map(m => m.media_url) : [
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=900&fit=crop"
  ];

  // Calculate discount percentage
  const discountPercentage = product?.compare_at_price && product?.base_price
    ? Math.round(((product.compare_at_price - product.base_price) / product.compare_at_price) * 100)
    : 0;

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Keyboard navigation for image carousel
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrevImage();
      } else if (e.key === 'ArrowRight') {
        handleNextImage();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? "bg-gray-900 text-white" : "bg-white text-gray-900"
          } transition-colors duration-200`}
      >
        <div className="text-center">
          <LoaderThree size="lg" color={theme === 'dark' ? '#ffffff' : '#000000'} />
          <p className="mt-4 text-lg">Loading product...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !product) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? "bg-gray-900 text-white" : "bg-white text-gray-900"
          } transition-colors duration-200`}
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-gray-500 mb-4">{error || 'The requested product could not be found.'}</p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${theme === 'dark' ? "bg-gray-900 text-white" : "bg-white text-gray-900"
        } transition-colors duration-200`}
    >
      {/* Breadcrumb */}
      <div
        className={`px-4 py-4 text-sm ${theme === 'dark' ? "text-gray-400" : "text-gray-600"
          }`}
      >
        <div className="max-w-7xl mx-auto">
          Home {">"} Shop {">"} {product.category?.name || 'Products'} {" "}
          <span className={theme === 'dark' ? "text-white" : "text-gray-900"}>
            {product.name}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Section - Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative">
              <div
                className={`relative ${theme === 'dark' ? "bg-gray-800" : "bg-gray-100"
                  } rounded-lg overflow-hidden`}
              >
                <Image
                  width={100}
                  height={100}
                  src={images[currentImageIndex]}
                  alt="Product"
                  className="w-full h-full object-contain"
                />
                <div className="absolute top-4 left-4">
                  <span
                    className={`px-3 py-1 text-xs font-semibold ${theme === 'dark'
                        ? "bg-gray-700 text-white"
                        : "bg-white text-black"
                      } rounded`}
                  >
                    OVERSIZED FIT
                  </span>
                </div>
                <button
                  onClick={handlePrevImage}
                  className={`absolute left-2 top-1/2 -translate-y-1/2 p-2 ${theme === 'dark'
                      ? "bg-gray-800/80 text-white"
                      : "bg-white/80 text-black"
                    } rounded-full hover:scale-110 transition-transform`}
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={handleNextImage}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 ${theme === 'dark'
                      ? "bg-gray-800/80 text-white"
                      : "bg-white/80 text-black"
                    } rounded-full hover:scale-110 transition-transform`}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`${theme === 'dark' ? "bg-gray-800" : "bg-gray-100"
                    } rounded-lg overflow-hidden aspect-square ${idx === currentImageIndex ? "ring-2 ring-blue-500" : ""
                    }`}
                >
                  <Image
                    width={100}
                    height={100}
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Fit Comparison - Desktop */}
            <div
              className={`hidden lg:block ${theme === 'dark' ? "bg-gray-800" : "bg-gray-100"
                } rounded-lg p-6`}
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="mb-2">
                    <svg className="w-full h-32 mx-auto" viewBox="0 0 100 150">
                      <rect
                        x="30"
                        y="20"
                        width="40"
                        height="60"
                        fill={theme === 'dark' ? "#4B5563" : "#9CA3AF"}
                        rx="3"
                      />
                      <rect
                        x="35"
                        y="80"
                        width="30"
                        height="50"
                        fill={theme === 'dark' ? "#4B5563" : "#9CA3AF"}
                        rx="2"
                      />
                    </svg>
                  </div>
                  <p
                    className={`text-sm font-semibold mb-1 ${theme === 'dark' ? "text-white" : "text-black"
                      }`}
                  >
                    REGULAR FIT
                  </p>
                  <p
                    className={`text-xs ${theme === 'dark' ? "text-gray-400" : "text-gray-600"
                      }`}
                  >
                    An All Time &nbsp;Hit Fit!&nbsp;
                  </p>
                  <p
                    className={`text-xs ${theme === 'dark' ? "text-gray-500" : "text-gray-500"
                      } mt-2`}
                  >
                    Hugging you just the right amount around sleeves and torso,
                    this fit flaunts your best look impeccably.
                  </p>
                  <p
                    className={`text-xs font-semibold mt-2 ${theme === 'dark' ? "text-white" : "text-black"
                      }`}
                  >
                    Let Good Looks Come Naturally
                  </p>
                </div>
                <div className="text-center">
                  <div className="mb-2">
                    <svg className="w-full h-32 mx-auto" viewBox="0 0 100 150">
                      <rect
                        x="20"
                        y="20"
                        width="60"
                        height="70"
                        fill={theme === 'dark' ? "#4B5563" : "#9CA3AF"}
                        rx="3"
                      />
                      <rect
                        x="30"
                        y="90"
                        width="40"
                        height="50"
                        fill={theme === 'dark' ? "#4B5563" : "#9CA3AF"}
                        rx="2"
                      />
                    </svg>
                  </div>
                  <p
                    className={`text-sm font-semibold mb-1 ${theme === 'dark' ? "text-white" : "text-black"
                      }`}
                  >
                    OVERSIZED
                  </p>
                  <p
                    className={`text-xs ${theme === 'dark' ? "text-gray-400" : "text-gray-600"
                      }`}
                  >
                    Fit that is straight outta streets!
                  </p>
                  <p
                    className={`text-xs ${theme === 'dark' ? "text-gray-500" : "text-gray-500"
                      } mt-2`}
                  >
                    Featuring a shoulder-drop design & a baggy form, this fit
                    gives you a &nbsp;dope&nbsp; casual appeal.
                  </p>
                  <p
                    className={`text-xs font-semibold mt-2 ${theme === 'dark' ? "text-white" : "text-black"
                      }`}
                  >
                    Unravel your street style now.
                  </p>
                </div>
              </div>
              <div
                className={`text-center mt-4 text-xs ${theme === 'dark' ? "text-gray-400" : "text-gray-600"
                  }`}
              >
                Model Height 6&nbsp; | Size M
              </div>
            </div>
          </div>

          {/* Right Section - Product Details */}
          <div className="space-y-6">
            {/* Brand & Title */}
            <div>
              <h2
                className={`text-lg font-semibold ${theme === 'dark' ? "text-gray-400" : "text-gray-600"
                  }`}
              >
                {product.category?.name || 'MORVILN'}
              </h2>
              <h1
                className={`text-2xl font-bold mt-1 ${theme === 'dark' ? "text-white" : "text-black"
                  }`}
              >
                {product.name}
              </h1>
              {product.short_description && (
                <p className={`text-sm mt-2 ${theme === 'dark' ? "text-gray-400" : "text-gray-600"}`}>
                  {product.short_description}
                </p>
              )}
            </div>

            {/* Price & Rating */}
            <div className="flex items-center gap-4">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">₹{Math.round(product.base_price)}</span>
                {product.compare_at_price && (
                  <>
                    <span
                      className={`text-lg line-through ${theme === 'dark' ? "text-gray-500" : "text-gray-400"
                        }`}
                    >
                      ₹{Math.round(product.compare_at_price)}
                    </span>
                    {discountPercentage > 0 && (
                      <span className="text-lg font-semibold text-green-600">
                        {discountPercentage}% OFF
                      </span>
                    )}
                  </>
                )}
              </div>
              <div className="flex items-center gap-1 ml-auto">
                <Star size={16} className="fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">4.3</span>
                <span className={theme === 'dark' ? "text-gray-500" : "text-gray-400"}>
                  | 12
                </span>
              </div>
            </div>

            {/* Inclusive of all taxes */}
            <p
              className={`text-sm ${theme === 'dark' ? "text-gray-400" : "text-gray-600"
                }`}
            >
              inclusive of all taxes
            </p>

            {/* EMI Option */}
            <div
              className={`${theme === 'dark'
                  ? "bg-purple-900/30 text-purple-300"
                  : "bg-purple-50 text-purple-700"
                } px-4 py-2 rounded`}
            >
              <span className="text-sm">Get it for as low as ₹595</span>
            </div>

            {/* Purchase Info */}
            <div
              className={`${theme === 'dark'
                  ? "bg-blue-900/30 text-blue-300"
                  : "bg-blue-50 text-blue-700"
                } px-4 py-2 rounded`}
            >
              <span className="text-sm font-medium">
                256 people bought this in the last 7 days
              </span>
            </div>

            {/* Premium Fabric Badge */}
            <div className="inline-block">
              <span
                className={`px-3 py-1 text-xs ${theme === 'dark'
                    ? "bg-gray-800 border-gray-700 text-gray-300"
                    : "bg-white border-gray-300 text-gray-700"
                  } border rounded`}
              >
                Premium Dense Fabric
              </span>
            </div>

            {/* Color Selection */}
            {availableColors.length > 0 && (
              <div>
                <h3
                  className={`text-sm font-semibold mb-3 ${theme === 'dark' ? "text-white" : "text-black"
                    }`}
                >
                  Colour: {selectedColor}
                </h3>
                <div className="flex gap-2 flex-wrap">
                  {availableColors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`w-10 h-10 rounded-full border-2 ${selectedColor === color.name
                          ? "border-black ring-2 ring-offset-2 ring-black"
                          : theme === 'dark'
                            ? "border-gray-700"
                            : "border-gray-300"
                        }`}
                      style={{ backgroundColor: color.code }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {availableSizes.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3
                    className={`text-sm font-semibold ${theme === 'dark' ? "text-white" : "text-black"
                      }`}
                  >
                    Select Size
                  </h3>
                  <button className="text-sm text-blue-600 hover:underline">
                    Size guide {">"}
                  </button>
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 text-sm font-semibold rounded border ${selectedSize === size
                          ? theme === 'dark'
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-gray-900 border-gray-900 text-white"
                          : theme === 'dark'
                            ? "bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600"
                            : "bg-white border-gray-300 hover:border-gray-400"
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Bag & Wishlist */}
            <div className="flex gap-3">
              <button className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 px-6 rounded flex items-center justify-center gap-2 transition-colors">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                ADD TO BAG
              </button>
              <button
                onClick={() => {
                  if (product) {
                    if (isInFavorites(product.id)) {
                      removeFromFavorites(product.id);
                    } else {
                      addToFavorites({
                        productId: product.id,
                        name: product.name,
                        price: product.base_price,
                        originalPrice: product.compare_at_price,
                        image: images[0] || '',
                        stock: 10 // Default stock
                      });
                    }
                  }
                }}
                className={`p-3 rounded border transition-colors ${isInFavorites(product.id)
                    ? 'bg-red-500 text-white border-red-500'
                    : theme === 'dark'
                      ? "border-gray-700 hover:bg-gray-800"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
              >
                <Heart size={24} className={isInFavorites(product.id) ? 'fill-current' : ''} />
              </button>
            </div>

            {/* Offers */}
            <div
              className={`${theme === 'dark' ? "bg-gray-800" : "bg-white"} border ${theme === 'dark' ? "border-gray-700" : "border-gray-200"
                } rounded-lg p-4`}
            >
              <h3
                className={`text-sm font-semibold mb-3 ${theme === 'dark' ? "text-white" : "text-black"
                  }`}
              >
                Save extra with these offers
              </h3>
              <div
                className={`${theme === 'dark'
                    ? "bg-yellow-900/30 border-yellow-700"
                    : "bg-yellow-50 border-yellow-300"
                  } border rounded p-3 flex items-start gap-3`}
              >
                <span className="text-2xl">🎉</span>
                <div className="flex-1">
                  <p
                    className={`text-sm font-medium ${theme === 'dark' ? "text-white" : "text-black"
                      }`}
                  >
                    Get EXTRA 15% CASHBACK on all orders. Coupon code - DIWALI15
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <code
                      className={`px-2 py-1 text-xs font-mono ${theme === 'dark'
                          ? "bg-gray-700 text-white"
                          : "bg-white text-black"
                        } border ${theme === 'dark' ? "border-gray-600" : "border-gray-300"
                        } rounded`}
                    >
                      DIWALI15
                    </code>
                    <button className="text-xs text-blue-600 hover:underline font-semibold">
                      Copy code
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Free Shipping Banner */}
            <div
              className={`${theme === 'dark'
                  ? "bg-blue-900/30 text-blue-300"
                  : "bg-blue-50 text-blue-700"
                } px-4 py-3 rounded flex items-center gap-2`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                />
              </svg>
              <span className="text-sm font-medium">
                This product is eligible for FREE SHIPPING
              </span>
            </div>

            {/* Key Highlights */}
            <div
              className={`${theme === 'dark' ? "bg-gray-800" : "bg-white"} border ${theme === 'dark' ? "border-gray-700" : "border-gray-200"
                } rounded-lg p-4`}
            >
              <h3
                className={`text-lg font-semibold mb-4 ${theme === 'dark' ? "text-white" : "text-black"
                  }`}
              >
                Key Highlights
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p
                    className={`text-xs ${theme === 'dark' ? "text-gray-400" : "text-gray-600"
                      }`}
                  >
                    Design
                  </p>
                  <p
                    className={`font-semibold ${theme === 'dark' ? "text-white" : "text-black"
                      }`}
                  >
                    Solid
                  </p>
                </div>
                <div>
                  <p
                    className={`text-xs ${theme === 'dark' ? "text-gray-400" : "text-gray-600"
                      }`}
                  >
                    Fit
                  </p>
                  <p
                    className={`font-semibold ${theme === 'dark' ? "text-white" : "text-black"
                      }`}
                  >
                    Oversized Fit
                  </p>
                </div>
                <div>
                  <p
                    className={`text-xs ${theme === 'dark' ? "text-gray-400" : "text-gray-600"
                      }`}
                  >
                    Neck
                  </p>
                  <p
                    className={`font-semibold ${theme === 'dark' ? "text-white" : "text-black"
                      }`}
                  >
                    Round Neck
                  </p>
                </div>
                <div>
                  <p
                    className={`text-xs ${theme === 'dark' ? "text-gray-400" : "text-gray-600"
                      }`}
                  >
                    Occasion
                  </p>
                  <p
                    className={`font-semibold ${theme === 'dark' ? "text-white" : "text-black"
                      }`}
                  >
                    Casual Wear
                  </p>
                </div>
                <div>
                  <p
                    className={`text-xs ${theme === 'dark' ? "text-gray-400" : "text-gray-600"
                      }`}
                  >
                    Sleeve Style
                  </p>
                  <p
                    className={`font-semibold ${theme === 'dark' ? "text-white" : "text-black"
                      }`}
                  >
                    Full Sleeve
                  </p>
                </div>
                <div>
                  <p
                    className={`text-xs ${theme === 'dark' ? "text-gray-400" : "text-gray-600"
                      }`}
                  >
                    Wash Care
                  </p>
                  <p
                    className={`font-semibold ${theme === 'dark' ? "text-white" : "text-black"
                      }`}
                  >
                    Gentle Machine Wash
                  </p>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 py-6">
              <div className="text-center">
                <div
                  className={`${theme === 'dark' ? "bg-yellow-900/30" : "bg-yellow-50"
                    } w-16 h-16 rounded-full mx-auto mb-2 flex items-center justify-center`}
                >
                  <svg
                    className="w-8 h-8 text-yellow-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p
                  className={`text-xs font-semibold ${theme === 'dark' ? "text-gray-300" : "text-gray-700"
                    }`}
                >
                  100% GENUINE
                </p>
                <p
                  className={`text-xs ${theme === 'dark' ? "text-gray-500" : "text-gray-500"
                    }`}
                >
                  PRODUCT
                </p>
              </div>
              <div className="text-center">
                <div
                  className={`${theme === 'dark' ? "bg-yellow-900/30" : "bg-yellow-50"
                    } w-16 h-16 rounded-full mx-auto mb-2 flex items-center justify-center`}
                >
                  <svg
                    className="w-8 h-8 text-yellow-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <p
                  className={`text-xs font-semibold ${theme === 'dark' ? "text-gray-300" : "text-gray-700"
                    }`}
                >
                  100% SECURE
                </p>
                <p
                  className={`text-xs ${theme === 'dark' ? "text-gray-500" : "text-gray-500"
                    }`}
                >
                  PAYMENT
                </p>
              </div>
              <div className="text-center">
                <div
                  className={`${theme === 'dark' ? "bg-yellow-900/30" : "bg-yellow-50"
                    } w-16 h-16 rounded-full mx-auto mb-2 flex items-center justify-center`}
                >
                  <svg
                    className="w-8 h-8 text-yellow-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
                <p
                  className={`text-xs font-semibold ${theme === 'dark' ? "text-gray-300" : "text-gray-700"
                    }`}
                >
                  EASY RETURNS &
                </p>
                <p
                  className={`text-xs ${theme === 'dark' ? "text-gray-500" : "text-gray-500"
                    }`}
                >
                  INSTANT REFUNDS
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* You May Also Like */}
        <div className="mt-16">
          <h2
            className={`text-2xl font-bold mb-6 ${theme === 'dark' ? "text-white" : "text-black"
              }`}
          >
            You May Also Like
          </h2>
          {isRelatedLoading ? (
            <div className="flex justify-center py-8">
              <LoaderThree size="md" color={theme === 'dark' ? '#ffffff' : '#000000'} />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => {
                const relatedProductImage = relatedProduct.media?.find(m => m.is_primary)?.media_url ||
                  relatedProduct.media?.[0]?.media_url ||
                  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop";

                const relatedDiscountPercentage = relatedProduct.compare_at_price && relatedProduct.base_price
                  ? Math.round(((relatedProduct.compare_at_price - relatedProduct.base_price) / relatedProduct.compare_at_price) * 100)
                  : 0;

                return (
                  <div
                    key={relatedProduct.id}
                    className={`${theme === 'dark' ? "bg-gray-800" : "bg-white"
                      } rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow cursor-pointer`}
                    onClick={() => window.location.href = `/productpage?id=${relatedProduct.id}`}
                  >
                    <div className="relative">
                      <Image
                        width={400}
                        height={500}
                        src={relatedProductImage}
                        alt={relatedProduct.name}
                        className="w-full aspect-[4/5] object-cover"
                      />
                      {relatedProduct.is_featured && (
                        <div className="absolute top-2 left-2">
                          <span
                            className={`px-2 py-1 text-xs font-semibold ${theme === 'dark'
                                ? "bg-gray-700 text-white"
                                : "bg-white text-black"
                              } rounded`}
                          >
                            FEATURED
                          </span>
                        </div>
                      )}
                      <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-white px-2 py-1 rounded">
                        <Star
                          size={12}
                          className="fill-yellow-400 text-yellow-400"
                        />
                        <span className="text-xs font-semibold">4.3</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <p
                        className={`text-sm font-semibold mb-1 ${theme === 'dark' ? "text-gray-400" : "text-gray-600"
                          }`}
                      >
                        {relatedProduct.category?.name || 'MORVILN'}
                      </p>
                      <p
                        className={`text-sm mb-2 ${theme === 'dark' ? "text-white" : "text-black"
                          }`}
                      >
                        {relatedProduct.name}
                      </p>
                      <div className="flex items-baseline gap-2 mb-2">
                        <span
                          className={`text-lg font-bold ${theme === 'dark' ? "text-white" : "text-black"
                            }`}
                        >
                          ₹{Math.round(relatedProduct.base_price)}
                        </span>
                        {relatedProduct.compare_at_price && (
                          <>
                            <span
                              className={`text-sm line-through ${theme === 'dark' ? "text-gray-500" : "text-gray-400"
                                }`}
                            >
                              ₹{Math.round(relatedProduct.compare_at_price)}
                            </span>
                            {relatedDiscountPercentage > 0 && (
                              <span className="text-sm font-semibold text-green-600">
                                {relatedDiscountPercentage}% OFF
                              </span>
                            )}
                          </>
                        )}
                      </div>
                      {relatedProduct.short_description && (
                        <p className={`text-xs ${theme === 'dark' ? "text-gray-400" : "text-gray-600"}`}>
                          {relatedProduct.short_description}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
