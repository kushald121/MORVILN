"use client";
import React, { useState } from "react";
import {
  Heart,
  ChevronLeft,
  ChevronRight,
  Star,
} from "lucide-react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useSearchParams } from "next/navigation";

const ProductPage = () => {
  const searchParams = useSearchParams();
  const productId = searchParams.get('id');

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("Jet Black");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { theme } = useTheme();

  const images = [
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=900&fit=crop",
    "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&h=900&fit=crop",
    "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=900&fit=crop",
  ];

  const sizes = ["S", "M", "L", "XL", "2XL", "3XL"];

  const colors = [
    { name: "Grey Melange", color: "bg-gray-300" },
    { name: "Jet Black", color: "bg-black" },
    { name: "Lilac Purple", color: "bg-purple-300" },
    { name: "Pink", color: "bg-pink-300" },
    { name: "Mint Green", color: "bg-green-300" },
    { name: "Red", color: "bg-red-500" },
    { name: "Beige", color: "bg-amber-200" },
    { name: "Navy", color: "bg-gray-800" },
    { name: "Dark Blue", color: "bg-blue-900" },
  ];

  const relatedProducts = [
    {
      id: 1,
      title: "Men's Black Oversized T-shirt",
      price: 599,
      mrp: 1349,
      discount: "55% OFF",
      rating: 4.4,
      badge: "OVERSIZED FIT",
      offer: "BUY 2 FOR 999",
    },
    {
      id: 2,
      title: "Men's Black Oversized T-shirt",
      price: 599,
      mrp: 799,
      discount: "25% OFF",
      rating: 4.4,
      badge: "OVERSIZED FIT",
      offer: "BUY 2 FOR 999",
    },
    {
      id: 3,
      title: "Men's Black Oversized T-shirt",
      price: 599,
      mrp: 1299,
      discount: "53% OFF",
      rating: 4.5,
      badge: "FEW LEFT",
      offer: "BUY 2 FOR 999",
    },
    {
      id: 4,
      title: "Men's Black Oversized Plus Size T-shirt",
      price: 899,
      mrp: 1149,
      discount: "21% OFF",
      rating: 4.5,
      badge: "PLUS SIZE",
      offer: "",
    },
  ];

  // Product data - same as in allproducts page
  const products = [
    {
      id: 1,
      name: 'Classic Blue T-Shirt',
      price: 25.99,
      originalPrice: 35.99,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=250&fit=crop&crop=center',
      isOnSale: true,
    },
    {
      id: 2,
      name: 'Red Hoodie',
      price: 45.00,
      image: 'https://images.unsplash.com/photo-1521334884684-d80222895322?w=200&h=250&fit=crop&crop=center',
      isOnSale: false,
    },
    {
      id: 3,
      name: 'Green Sneakers',
      price: 55.00,
      originalPrice: 75.00,
      image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=200&h=250&fit=crop&crop=center',
      isOnSale: true,
    },
    {
      id: 4,
      name: 'Black Leather Jacket',
      price: 120.00,
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=200&h=250&fit=crop&crop=center',
      isOnSale: false,
    },
    {
      id: 5,
      name: 'White Summer Dress',
      price: 38.99,
      originalPrice: 55.99,
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=200&h=250&fit=crop&crop=center',
      isOnSale: true,
    },
    {
      id: 6,
      name: 'Denim Jeans',
      price: 49.99,
      image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=250&fit=crop&crop=center',
      isOnSale: false,
    },
    {
      id: 7,
      name: 'Striped Polo Shirt',
      price: 32.50,
      originalPrice: 45.00,
      image: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=200&h=250&fit=crop&crop=center',
      isOnSale: true,
    },
    {
      id: 8,
      name: 'Brown Ankle Boots',
      price: 85.00,
      image: 'https://images.unsplash.com/photo-1605812860427-4024433a70fd?w=200&h=250&fit=crop&crop=center',
      isOnSale: false,
    },
    {
      id: 9,
      name: 'Gray Sweatpants',
      price: 28.99,
      originalPrice: 39.99,
      image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=200&h=250&fit=crop&crop=center',
      isOnSale: true,
    },
    {
      id: 10,
      name: 'Floral Blouse',
      price: 42.00,
      image: 'https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=200&h=250&fit=crop&crop=center',
      isOnSale: false,
    },
    {
      id: 11,
      name: 'Running Shoes',
      price: 65.99,
      originalPrice: 89.99,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=250&fit=crop&crop=center',
      isOnSale: true,
    },
    {
      id: 12,
      name: 'Wool Beanie',
      price: 18.50,
      image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=200&h=250&fit=crop&crop=center',
      isOnSale: false,
    },
    {
      id: 13,
      name: 'Plaid Flannel Shirt',
      price: 36.00,
      originalPrice: 48.00,
      image: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=200&h=250&fit=crop&crop=center',
      isOnSale: true,
    },
    {
      id: 14,
      name: 'Cargo Shorts',
      price: 34.99,
      image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=200&h=250&fit=crop&crop=center',
      isOnSale: false,
    },
    {
      id: 16,
      name: 'Winter Parka',
      price: 150.00,
      image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=200&h=250&fit=crop&crop=center',
      isOnSale: false,
    },
    {
      id: 17,
      name: 'Canvas Backpack',
      price: 44.99,
      originalPrice: 59.99,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=250&fit=crop&crop=center',
      isOnSale: true,
    },
    {
      id: 18,
      name: 'Sunglasses',
      price: 79.00,
      image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200&h=250&fit=crop&crop=center',
      isOnSale: false,
    },
    {
      id: 19,
      name: 'Knit Cardigan',
      price: 52.50,
      originalPrice: 70.00,
      image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=200&h=250&fit=crop&crop=center',
      isOnSale: true,
    },
    {
      id: 20,
      name: 'Athletic Shorts',
      price: 26.99,
      image: 'https://images.unsplash.com/photo-1519659528534-7fd733a832a0?w=200&h=250&fit=crop&crop=center',
      isOnSale: false,
    },
    {
      id: 21,
      name: 'Leather Belt',
      price: 29.99,
      originalPrice: 42.99,
      image: 'https://images.unsplash.com/photo-150708020285-8f7f6c9f3b1c?w=200&h=250&fit=crop&crop=center',
      isOnSale: true,
    },
    {
      id: 22,
      name: 'Winter Jacket',
      price: 130.00,
      image: 'https://images.unsplash.com/photo-1542068829-1115f7259450?w=200&h=250&fit=crop&crop=center',
      isOnSale: false,
    },
    {
      id: 23,
      name: 'Graphic T-Shirt',
      price: 22.50,
      originalPrice: 30.00,
      image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=200&h=250&fit=crop&crop=center',
      isOnSale: true,
    },
    {
      id: 24,
      name: 'Chino Pants',
      price: 48.00,
      image: 'https://images.unsplash.com/photo-1521334884684-d80222895322?w=200&h=250&fit=crop&crop=center',
      isOnSale: false,
    },
  ];

  // Get current product based on ID
  const currentProduct = products.find(p => p.id === parseInt(productId || '1'));

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div
      className={`min-h-screen ${
        theme === 'dark' ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      } transition-colors duration-200`}
    >
      {/* Breadcrumb */}
      <div
        className={`px-4 py-4 text-sm ${
          theme === 'dark' ? "text-gray-400" : "text-gray-600"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          Home {">"} Shop {">"} Products {" "}
          <span className={theme === 'dark' ? "text-white" : "text-gray-900"}>
            {currentProduct?.name || 'Product Details'}
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
                className={`relative ${
                  theme === 'dark' ? "bg-gray-800" : "bg-gray-100"
                } rounded-lg overflow-hidden`}
                style={{ minHeight: "600px" }}
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
                    className={`px-3 py-1 text-xs font-semibold ${
                      theme === 'dark'
                        ? "bg-gray-700 text-white"
                        : "bg-white text-black"
                    } rounded`}
                  >
                    OVERSIZED FIT
                  </span>
                </div>
                <button
                  onClick={handlePrevImage}
                  className={`absolute left-2 top-1/2 -translate-y-1/2 p-2 ${
                    theme === 'dark'
                      ? "bg-gray-800/80 text-white"
                      : "bg-white/80 text-black"
                  } rounded-full hover:scale-110 transition-transform`}
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={handleNextImage}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 ${
                    theme === 'dark'
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
                  className={`${
                    theme === 'dark' ? "bg-gray-800" : "bg-gray-100"
                  } rounded-lg overflow-hidden aspect-square ${
                    idx === currentImageIndex ? "ring-2 ring-blue-500" : ""
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
              className={`hidden lg:block ${
                theme === 'dark' ? "bg-gray-800" : "bg-gray-100"
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
                    className={`text-sm font-semibold mb-1 ${
                      theme === 'dark' ? "text-white" : "text-black"
                    }`}
                  >
                    REGULAR FIT
                  </p>
                  <p
                    className={`text-xs ${
                      theme === 'dark' ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    An All Time &nbsp;Hit Fit!&nbsp;
                  </p>
                  <p
                    className={`text-xs ${
                      theme === 'dark' ? "text-gray-500" : "text-gray-500"
                    } mt-2`}
                  >
                    Hugging you just the right amount around sleeves and torso,
                    this fit flaunts your best look impeccably.
                  </p>
                  <p
                    className={`text-xs font-semibold mt-2 ${
                      theme === 'dark' ? "text-white" : "text-black"
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
                    className={`text-sm font-semibold mb-1 ${
                      theme === 'dark' ? "text-white" : "text-black"
                    }`}
                  >
                    OVERSIZED
                  </p>
                  <p
                    className={`text-xs ${
                      theme === 'dark' ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Fit that is straight outta streets!
                  </p>
                  <p
                    className={`text-xs ${
                      theme === 'dark' ? "text-gray-500" : "text-gray-500"
                    } mt-2`}
                  >
                    Featuring a shoulder-drop design & a baggy form, this fit
                    gives you a &nbsp;dope&nbsp; casual appeal.
                  </p>
                  <p
                    className={`text-xs font-semibold mt-2 ${
                      theme === 'dark' ? "text-white" : "text-black"
                    }`}
                  >
                    Unravel your street style now.
                  </p>
                </div>
              </div>
              <div
                className={`text-center mt-4 text-xs ${
                  theme === 'dark' ? "text-gray-400" : "text-gray-600"
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
                className={`text-lg font-semibold ${
                  theme === 'dark' ? "text-gray-400" : "text-gray-600"
                }`}
              >
                MORVILN
              </h2>
              <h1
                className={`text-2xl font-bold mt-1 ${
                  theme === 'dark' ? "text-white" : "text-black"
                }`}
              >
                {currentProduct?.name || 'Product Name'}
              </h1>
            </div>

            {/* Price & Rating */}
            <div className="flex items-center gap-4">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">₹{currentProduct?.price ? Math.round(currentProduct.price * 80) : '699'}</span>
                <span
                  className={`text-lg line-through ${
                    theme === 'dark' ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  ₹1,349
                </span>
                <span className="text-lg font-semibold text-green-600">
                  48% OFF
                </span>
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
              className={`text-sm ${
                theme === 'dark' ? "text-gray-400" : "text-gray-600"
              }`}
            >
              inclusive of all taxes
            </p>

            {/* EMI Option */}
            <div
              className={`${
                theme === 'dark'
                  ? "bg-purple-900/30 text-purple-300"
                  : "bg-purple-50 text-purple-700"
              } px-4 py-2 rounded`}
            >
              <span className="text-sm">Get it for as low as ₹595</span>
            </div>

            {/* Purchase Info */}
            <div
              className={`${
                theme === 'dark'
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
                className={`px-3 py-1 text-xs ${
                  theme === 'dark'
                    ? "bg-gray-800 border-gray-700 text-gray-300"
                    : "bg-white border-gray-300 text-gray-700"
                } border rounded`}
              >
                Premium Dense Fabric
              </span>
            </div>

            {/* Color Selection */}
            <div>
              <h3
                className={`text-sm font-semibold mb-3 ${
                  theme === 'dark' ? "text-white" : "text-black"
                }`}
              >
                Colour: {selectedColor}
              </h3>
              <div className="flex gap-2 flex-wrap">
                {colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-10 h-10 rounded-full ${
                      color.color
                    } border-2 ${
                      selectedColor === color.name
                        ? "border-black ring-2 ring-offset-2 ring-black"
                        : theme === 'dark'
                        ? "border-gray-700"
                        : "border-gray-300"
                    }`}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3
                  className={`text-sm font-semibold ${
                    theme === 'dark' ? "text-white" : "text-black"
                  }`}
                >
                  Select Size
                </h3>
                <button className="text-sm text-blue-600 hover:underline">
                  Size guide {">"}
                </button>
              </div>
              <div className="grid grid-cols-6 gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 text-sm font-semibold rounded border ${
                      selectedSize === size
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
                className={`p-3 rounded border ${
                  theme === 'dark'
                    ? "border-gray-700 hover:bg-gray-800"
                    : "border-gray-300 hover:bg-gray-50"
                } transition-colors`}
              >
                <Heart size={24} />
              </button>
            </div>

            {/* Offers */}
            <div
              className={`${theme === 'dark' ? "bg-gray-800" : "bg-white"} border ${
                theme === 'dark' ? "border-gray-700" : "border-gray-200"
              } rounded-lg p-4`}
            >
              <h3
                className={`text-sm font-semibold mb-3 ${
                  theme === 'dark' ? "text-white" : "text-black"
                }`}
              >
                Save extra with these offers
              </h3>
              <div
                className={`${
                  theme === 'dark'
                    ? "bg-yellow-900/30 border-yellow-700"
                    : "bg-yellow-50 border-yellow-300"
                } border rounded p-3 flex items-start gap-3`}
              >
                <span className="text-2xl">🎉</span>
                <div className="flex-1">
                  <p
                    className={`text-sm font-medium ${
                      theme === 'dark' ? "text-white" : "text-black"
                    }`}
                  >
                    Get EXTRA 15% CASHBACK on all orders. Coupon code - DIWALI15
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <code
                      className={`px-2 py-1 text-xs font-mono ${
                        theme === 'dark'
                          ? "bg-gray-700 text-white"
                          : "bg-white text-black"
                      } border ${
                        theme === 'dark' ? "border-gray-600" : "border-gray-300"
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
              className={`${
                theme === 'dark'
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
              className={`${theme === 'dark' ? "bg-gray-800" : "bg-white"} border ${
                theme === 'dark' ? "border-gray-700" : "border-gray-200"
              } rounded-lg p-4`}
            >
              <h3
                className={`text-lg font-semibold mb-4 ${
                  theme === 'dark' ? "text-white" : "text-black"
                }`}
              >
                Key Highlights
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p
                    className={`text-xs ${
                      theme === 'dark' ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Design
                  </p>
                  <p
                    className={`font-semibold ${
                      theme === 'dark' ? "text-white" : "text-black"
                    }`}
                  >
                    Solid
                  </p>
                </div>
                <div>
                  <p
                    className={`text-xs ${
                      theme === 'dark' ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Fit
                  </p>
                  <p
                    className={`font-semibold ${
                      theme === 'dark' ? "text-white" : "text-black"
                    }`}
                  >
                    Oversized Fit
                  </p>
                </div>
                <div>
                  <p
                    className={`text-xs ${
                      theme === 'dark' ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Neck
                  </p>
                  <p
                    className={`font-semibold ${
                      theme === 'dark' ? "text-white" : "text-black"
                    }`}
                  >
                    Round Neck
                  </p>
                </div>
                <div>
                  <p
                    className={`text-xs ${
                      theme === 'dark' ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Occasion
                  </p>
                  <p
                    className={`font-semibold ${
                      theme === 'dark' ? "text-white" : "text-black"
                    }`}
                  >
                    Casual Wear
                  </p>
                </div>
                <div>
                  <p
                    className={`text-xs ${
                      theme === 'dark' ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Sleeve Style
                  </p>
                  <p
                    className={`font-semibold ${
                      theme === 'dark' ? "text-white" : "text-black"
                    }`}
                  >
                    Full Sleeve
                  </p>
                </div>
                <div>
                  <p
                    className={`text-xs ${
                      theme === 'dark' ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Wash Care
                  </p>
                  <p
                    className={`font-semibold ${
                      theme === 'dark' ? "text-white" : "text-black"
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
                  className={`${
                    theme === 'dark' ? "bg-yellow-900/30" : "bg-yellow-50"
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
                  className={`text-xs font-semibold ${
                    theme === 'dark' ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  100% GENUINE
                </p>
                <p
                  className={`text-xs ${
                    theme === 'dark' ? "text-gray-500" : "text-gray-500"
                  }`}
                >
                  PRODUCT
                </p>
              </div>
              <div className="text-center">
                <div
                  className={`${
                    theme === 'dark' ? "bg-yellow-900/30" : "bg-yellow-50"
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
                  className={`text-xs font-semibold ${
                    theme === 'dark' ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  100% SECURE
                </p>
                <p
                  className={`text-xs ${
                    theme === 'dark' ? "text-gray-500" : "text-gray-500"
                  }`}
                >
                  PAYMENT
                </p>
              </div>
              <div className="text-center">
                <div
                  className={`${
                    theme === 'dark' ? "bg-yellow-900/30" : "bg-yellow-50"
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
                  className={`text-xs font-semibold ${
                    theme === 'dark' ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  EASY RETURNS &
                </p>
                <p
                  className={`text-xs ${
                    theme === 'dark' ? "text-gray-500" : "text-gray-500"
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
            className={`text-2xl font-bold mb-6 ${
              theme === 'dark' ? "text-white" : "text-black"
            }`}
          >
            You May Also Like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <div
                key={product.id}
                className={`${
                  theme === 'dark' ? "bg-gray-800" : "bg-white"
                } rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow`}
              >
                <div className="relative">
                  <Image
                    width={100}
                    height={100}
                    src={
                      product.id === 1
                        ? "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop"
                        : product.id === 2
                        ? "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&h=500&fit=crop"
                        : product.id === 3
                        ? "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=500&fit=crop"
                        : "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&h=500&fit=crop"
                    }
                    alt={product.title}
                    className="w-full aspect-[4/5] object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    <span
                      className={`px-2 py-1 text-xs font-semibold ${
                        theme === 'dark'
                          ? "bg-gray-700 text-white"
                          : "bg-white text-black"
                      } rounded`}
                    >
                      {product.badge}
                    </span>
                  </div>
                  <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-white px-2 py-1 rounded">
                    <Star
                      size={12}
                      className="fill-yellow-400 text-yellow-400"
                    />
                    <span className="text-xs font-semibold">
                      {product.rating}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <p
                    className={`text-sm font-semibold mb-1 ${
                      theme === 'dark' ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    MORVILN
                  </p>
                  <p
                    className={`text-sm mb-2 ${
                      theme === 'dark' ? "text-white" : "text-black"
                    }`}
                  >
                    {product.title}
                  </p>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span
                      className={`text-lg font-bold ${
                        theme === 'dark' ? "text-white" : "text-black"
                      }`}
                    >
                      ₹{product.price}
                    </span>
                    <span
                      className={`text-sm line-through ${
                        theme === 'dark' ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      ₹{product.mrp}
                    </span>
                    <span className="text-sm font-semibold text-green-600">
                      {product.discount}
                    </span>
                  </div>
                  {product.offer && (
                    <div className="flex items-center gap-1 text-green-600">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-xs font-semibold">
                        {product.offer}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
