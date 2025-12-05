"use client";
import React, { useState, useEffect } from "react";
import {
  Heart,
  ChevronLeft,
  ChevronRight,
  Star,
  Minus,
  Plus,
  CheckCircle2,
  ShieldCheck,
  Trophy,
  TrendingUp,
  Store
} from "lucide-react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useSearchParams } from "next/navigation";
import { useCart } from "../contexts/CartContext";
import { LoaderThree } from "@/app/components/ui/loader";
import { ProductService, Product } from "../services/productService";

const ReviewsSection = () => {
  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 lg:px-8 mt-24 text-white">
      {/* Tabs Header */}
      <div className="flex gap-8 border-b border-gray-800 mb-8">
        <button className="pb-4 border-b-2 border-white font-bold text-lg">
          Product Reviews (2075)
        </button>
        <button className="pb-4 border-b-2 border-transparent text-gray-400 hover:text-white font-medium text-lg transition-colors">
          Shop Reviews (87)
        </button>
      </div>

      {/* Summary Section */}
      <div className="bg-black border border-gray-800 p-8 rounded-lg mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Rating Score */}
          <div className="lg:col-span-3 flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <div className="flex gap-1 text-[#00b67a]">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={24} fill="currentColor" strokeWidth={0} />
                ))}
              </div>
              <span className="text-2xl font-bold">4.82</span>
              <span className="text-gray-400">out of 5</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>Based on 2162 reviews</span>
              <CheckCircle2 size={16} className="text-[#00b67a]" />
            </div>
          </div>

          {/* Progress Bars */}
          <div className="lg:col-span-5 space-y-2">
            {[
              { stars: 5, count: 1766, percent: "85%" },
              { stars: 4, count: 394, percent: "12%" },
              { stars: 3, count: 1, percent: "1%" },
              { stars: 2, count: 0, percent: "0%" },
              { stars: 1, count: 1, percent: "1%" },
            ].map((item) => (
              <div key={item.stars} className="flex items-center gap-4 text-sm">
                <div className="flex gap-0.5 text-[#00b67a] w-24">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      fill={i < item.stars ? "currentColor" : "none"}
                      stroke={i < item.stars ? "none" : "#333"}
                      strokeWidth={i < item.stars ? 0 : 2}
                      className={i >= item.stars ? "text-gray-700" : ""}
                    />
                  ))}
                </div>
                <div className="flex-1 h-4 bg-gray-800 rounded-sm overflow-hidden">
                  <div
                    className="h-full bg-gray-200"
                    style={{ width: item.percent }}
                  />
                </div>
                <span className="w-8 text-right text-gray-400">{item.count}</span>
              </div>
            ))}
          </div>

          {/* Write Review Button */}
          <div className="lg:col-span-4 flex justify-end">
            <button className="bg-white text-black px-8 py-3 font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors">
              Write a Store Review
            </button>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-12 pt-8 border-t border-gray-800">
          {[
            { icon: ShieldCheck, label: "VERIFIED REVIEWS", sub: "1673" },
            { icon: CheckCircle2, label: "MONTHLY RECORD", sub: "114" },
            { icon: Trophy, label: "BRONZE TRANSPARENCY", sub: "AWARD" },
            { icon: TrendingUp, label: "TOP 1%", sub: "TRENDING" },
            { icon: Store, label: "TOP 5%", sub: "STORES" },
          ].map((badge, idx) => (
            <div key={idx} className="flex flex-col items-center justify-center text-center gap-2">
              <div className="w-12 h-12 rounded-full border-2 border-[#d4af37] flex items-center justify-center text-[#d4af37] mb-1">
                <badge.icon size={24} />
              </div>
              <div className="text-[10px] font-bold tracking-widest text-[#d4af37]">
                {badge.label}
              </div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wider">
                {badge.sub}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div className="relative">
            <select className="bg-transparent text-white border-none outline-none cursor-pointer font-medium appearance-none pr-8">
              <option>Most Recent</option>
              <option>Highest Rating</option>
              <option>Lowest Rating</option>
            </select>
            <ChevronRight className="absolute right-0 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" size={16} />
          </div>
        </div>

        {[
          {
            product: "Bexor Black Unisex Straight Fit Baggy Pants",
            user: "Nishu Singh",
            verified: true,
            rating: 5,
            title: "Great",
            content: "Great"
          },
          {
            product: "Dawn Unisex Straight Fit Baggy Pants",
            user: "Anonymous",
            verified: true,
            rating: 5,
            title: "Its",
            content: "Its fine"
          },
          {
            product: "Raudra Unisex Straight Fit Baggy Pants",
            user: "Anonymous",
            verified: true,
            rating: 5,
            title: "Good nice",
            content: "God nice clothe qualify"
          }
        ].map((review, idx) => (
          <div key={idx} className="border-b border-gray-800 pb-8">
            <div className="text-sm text-gray-400 mb-2">
              about <span className="text-white underline decoration-gray-600 underline-offset-4">{review.product}</span>
            </div>
            <div className="flex gap-1 text-[#00b67a] mb-3">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  fill={i < review.rating ? "currentColor" : "none"}
                  stroke={i < review.rating ? "none" : "currentColor"}
                />
              ))}
            </div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center text-gray-400" />
              <span className="font-medium text-gray-300">{review.user}</span>
              {review.verified && (
                <span className="bg-gray-800 text-gray-400 text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider">
                  Verified
                </span>
              )}
            </div>
            <h4 className="font-bold text-white mb-1">{review.title}</h4>
            <p className="text-gray-400">{review.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 34,
    seconds: 35,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-2 text-2xl font-mono font-bold text-white tracking-wider">
      <span>00</span>
      <span>:</span>
      <span>{String(timeLeft.hours).padStart(2, "0")}</span>
      <span>:</span>
      <span>{String(timeLeft.minutes).padStart(2, "0")}</span>
      <span>:</span>
      <span>{String(timeLeft.seconds).padStart(2, "0")}</span>
    </div>
  );
};

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
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();
  const { addToFavorites, removeFromFavorites, isInFavorites, addToCart } = useCart();

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
          // Find first available variant
          const firstAvailable = productData.variants.find(v => v.stock_quantity > 0 && v.is_active) || productData.variants[0];
          setSelectedSize(firstAvailable.size || '');
          setSelectedColor(firstAvailable.color || '');
        }

        // Update document title and meta description for SEO
        if (productData.seo_title) {
          document.title = productData.seo_title;
        } else {
          document.title = `${productData.name} | Store`;
        }

        // Note: Meta description update would typically require a head management library like next/head or Next.js Metadata API
        // For client-side only updates:
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
          metaDescription.setAttribute('content', productData.seo_description || productData.short_description || productData.description || '');
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
        // Filter out current product
        setRelatedProducts(products.filter(p => p.id !== productId));
      } catch (error) {
        console.error('Error fetching related products:', error);
      } finally {
        setIsRelatedLoading(false);
      }
    };

    if (productId) {
      fetchRelatedProducts();
    }
  }, [productId]);

  // Deduplicate sizes and colors
  const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL'];
  const uniqueSizes = Array.from(new Set(product?.variants?.map(v => v.size?.trim()).filter(Boolean)))
    .sort((a, b) => {
      const indexA = sizeOrder.indexOf(a as string);
      const indexB = sizeOrder.indexOf(b as string);
      // If both are in the known list, sort by index
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      // If only A is known, it comes first
      if (indexA !== -1) return -1;
      // If only B is known, it comes first
      if (indexB !== -1) return 1;
      // Otherwise sort alphabetically
      return (a as string).localeCompare(b as string);
    });

  // For colors, we might want to keep the color code mapping
  const colorMap: { [key: string]: string } = {
    'Black': '#000000',
    'White': '#FFFFFF',
    'Red': '#EF4444',
    'Blue': '#3B82F6',
    'Green': '#22C55E',
    'Yellow': '#EAB308',
    'Pink': '#EC4899',
    'Gray': '#6B7280',
    'Purple': '#A855F7',
    'Orange': '#F97316',
    'Brown': '#78350F',
    'Navy': '#1E3A8A',
    'Beige': '#F5F5DC',
    'Maroon': '#800000',
    'Teal': '#14B8A6',
    'Olive': '#808000',
    'Cream': '#FFFDD0',
  };

  const uniqueColorsMap = new Map();
  product?.variants?.forEach(v => {
    const colorName = v.color?.trim();
    if (colorName && !uniqueColorsMap.has(colorName)) {
      // Use provided code, or fallback to map, or fallback to black
      const code = v.color_code && v.color_code !== '#000000'
        ? v.color_code
        : (colorMap[colorName] || colorMap[Object.keys(colorMap).find(k => k.toLowerCase() === colorName.toLowerCase()) || ''] || '#000000');

      uniqueColorsMap.set(colorName, code);
    }
  });
  const uniqueColors = Array.from(uniqueColorsMap.entries()).map(([name, code]) => ({ name, code }));

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

  const handleQuantityChange = (type: 'inc' | 'dec') => {
    if (type === 'inc') {
      setQuantity(prev => prev + 1);
    } else {
      setQuantity(prev => (prev > 1 ? prev - 1 : 1));
    }
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
  }, [images.length]); // Add dependency

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <LoaderThree size="lg" color="#ffffff" />
          <p className="mt-4 text-lg">Loading product...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-gray-500 mb-4">{error || 'The requested product could not be found.'}</p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-white text-black rounded hover:bg-gray-200 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (

    <div className="min-h-screen bg-black text-white selection:bg-red-500 selection:text-white">
      <div className="max-w-[1600px] mx-auto px-4 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column - Images (60-65% width approx) */}
          <div className="lg:col-span-7 flex flex-col-reverse lg:flex-row gap-4 h-auto lg:h-[85vh] sticky top-4">
            {/* Thumbnails Strip */}
            <div className="w-full lg:w-24 flex-shrink-0 flex flex-row lg:flex-col gap-4 overflow-x-auto lg:overflow-y-auto no-scrollbar">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`w-20 lg:w-full aspect-[3/4] relative border-2 flex-shrink-0 transition-all duration-200 ${idx === currentImageIndex ? "border-white" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                >
                  <Image
                    src={img}
                    alt={`View ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div className="flex-1 relative bg-[#0a0a0a] min-h-[50vh] lg:h-full w-full">
              <Image
                src={images[currentImageIndex]}
                alt={product.name}
                fill
                className="object-contain"
                priority
              />

              {/* Navigation Arrows (Mobile/Tablet only usually, but good to have) */}
              <button
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black transition-colors lg:hidden"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black transition-colors lg:hidden"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>

          {/* Right Column - Product Info */}
          <div className="lg:col-span-5 flex flex-col justify-center py-8">
            {/* Title */}
            <h1 className="text-4xl lg:text-5xl font-bold uppercase tracking-wide mb-4 leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-8">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((_, i) => (
                  <Star key={i} size={18} className="fill-green-500 text-green-500" />
                ))}
              </div>
              <span className="text-gray-400 text-sm">(4.8)</span>
            </div>

            {/* Price */}
            <div className="mb-10">
              {discountPercentage > 0 && (
                <span className="inline-block bg-red-600 text-white text-xs font-bold px-2 py-1 mb-2">
                  SAVE {discountPercentage}%
                </span>
              )}
              <div className="flex items-baseline gap-4">
                <span className="text-3xl font-bold text-red-600">
                  RS. {Math.round(product.base_price).toLocaleString()}.00
                </span>
                {product.compare_at_price && (
                  <span className="text-xl text-gray-500 line-through">
                    RS. {Math.round(product.compare_at_price).toLocaleString()}.00
                  </span>
                )}
              </div>
            </div>

            {/* Size Selector */}
            {uniqueSizes.length > 0 && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg">Size:</span>
                  <button className="text-sm text-gray-400 hover:text-white underline">
                    Size chart
                  </button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {uniqueSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-6 py-3 border transition-all duration-200 min-w-[3rem] ${selectedSize === size
                        ? "bg-white text-black border-white font-bold"
                        : "bg-black text-white border-gray-700 hover:border-gray-500"
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selector */}
            {uniqueColors.length > 0 && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg">Color: <span className="text-gray-400">{selectedColor}</span></span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {uniqueColors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`w-10 h-10 rounded-full border-2 transition-all duration-200 ${selectedColor === color.name
                        ? "border-white scale-110"
                        : "border-transparent hover:border-gray-500"
                        }`}
                      style={{ backgroundColor: color.code }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-8">
              <div className="flex items-center border border-gray-700 w-fit">
                <button
                  onClick={() => handleQuantityChange('dec')}
                  className="p-4 hover:bg-gray-900 transition-colors"
                >
                  <Minus size={16} />
                </button>
                <div className="w-12 text-center font-bold">{quantity}</div>
                <button
                  onClick={() => handleQuantityChange('inc')}
                  className="p-4 hover:bg-gray-900 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4 mb-12">
              <button
                onClick={() => addToCart({
                  id: product.id,
                  name: product.name,
                  price: product.base_price,
                  image: images[0],
                  size: selectedSize,
                  color: selectedColor,
                  quantity: quantity,
                })}
                disabled={!selectedSize}
                className={`w-full py-4 text-lg font-bold tracking-wider transition-colors ${selectedSize
                  ? "bg-[#333] hover:bg-[#444] text-white"
                  : "bg-gray-800 text-gray-500 cursor-not-allowed"
                  }`}
              >
                {selectedSize ? "ADD TO CART" : "SELECT SIZE"}
              </button>
              <button
                onClick={() => {
                  if (!selectedSize) return;
                  addToCart({
                    id: product.id,
                    name: product.name,
                    price: product.base_price,
                    image: images[0],
                    size: selectedSize,
                    color: selectedColor,
                    quantity: quantity,
                  });
                  // In a real app, this would redirect to checkout
                  console.log("Proceed to checkout");
                }}
                disabled={!selectedSize}
                className={`w-full py-4 text-lg font-bold tracking-wider transition-colors ${selectedSize
                  ? "bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white"
                  : "bg-gray-900 text-gray-600 cursor-not-allowed"
                  }`}
              >
                BUY IT NOW
              </button>
            </div>

            {/* Promo Section */}
            <div className="flex flex-col items-center justify-center py-8 border-t border-gray-800">
              <h3 className="text-xl font-bold mb-2">BLACK FRIDAY 2025</h3>
              <p className="text-gray-400 text-sm mb-4">offer ends in:</p>
              <CountdownTimer />
            </div>

            {/* Product Details Section */}
            <div className="py-8 border-t border-gray-800 space-y-8">
              {/* Branding & Origin */}
              <div className="space-y-2">
                <h3 className="text-2xl font-bold tracking-wider">MUTATION <span className="text-sm font-normal text-gray-400">by Rage Studios ©</span></h3>
                <p className="text-sm text-gray-400 flex items-center gap-2">
                  Proudly Made in India <Heart size={12} className="fill-red-500 text-red-500" />
                </p>
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2 text-green-500 font-bold tracking-wide uppercase text-sm">
                <div className={`w-2 h-2 rounded-full ${product.variants?.some(v => v.stock_quantity > 0) ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                {product.variants?.some(v => v.stock_quantity > 0) ? 'In Stock' : 'Out of Stock'}
              </div>

              {/* Description */}
              <div className="space-y-4">
                <h4 className="font-bold uppercase tracking-wide text-gray-300 text-sm">Description</h4>
                <div className="text-sm text-gray-400 leading-relaxed whitespace-pre-line">
                  {product.description}
                </div>
              </div>

              {/* Product Details: Gender, Short Description, Tags, Stock */}
              <div className="space-y-6">
                <h4 className="font-bold uppercase tracking-wide text-gray-300 text-sm">Product Details</h4>

                <div className="space-y-4 text-sm text-gray-400">
                  {/* Gender */}
                  {product.gender && (
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">Gender:</span>
                      <span className="capitalize">{product.gender}</span>
                    </div>
                  )}

                  {/* Short Description */}
                  {product.short_description && (
                    <div>
                      <span className="text-white font-medium block mb-1">Overview:</span>
                      <p className="leading-relaxed">{product.short_description}</p>
                    </div>
                  )}

                  {/* Tags */}
                  {product.tags && product.tags.length > 0 && (
                    <div>
                      <span className="text-white font-medium block mb-2">Tags:</span>
                      <div className="flex flex-wrap gap-2">
                        {product.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-900 border border-gray-800 rounded-full text-xs text-gray-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Category */}
                  {product.category && (
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">Category:</span>
                      <span>{product.category.name}</span>
                    </div>
                  )}

                  {/* Stock Quantity */}
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">Stock:</span>
                    <span className={
                      (product.variants?.find(v => v.size === selectedSize && v.color === selectedColor)?.stock_quantity || 0) > 0
                        ? "text-green-500 font-bold"
                        : "text-red-500 font-bold"
                    }>
                      {product.variants?.find(v => v.size === selectedSize && v.color === selectedColor)?.stock_quantity || 0} units
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <ReviewsSection />

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-32 mb-16">
            <h2 className="text-3xl font-bold mb-12 uppercase text-center tracking-widest">Related Products</h2>

            <div className="relative">
              {/* Navigation Arrows (Visual only for grid, functional if we added carousel logic) */}
              <button className="absolute -right-12 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center text-black z-10 hover:scale-110 transition-transform hidden lg:flex">
                <ChevronRight size={20} />
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {relatedProducts.map((relatedProduct) => {
                  const discount = relatedProduct.compare_at_price
                    ? Math.round(((relatedProduct.compare_at_price - relatedProduct.base_price) / relatedProduct.compare_at_price) * 100)
                    : 0;

                  return (
                    <div
                      key={relatedProduct.id}
                      className="group cursor-pointer relative"
                      onClick={() => window.location.href = `/productpage?id=${relatedProduct.id}`}
                    >
                      {/* Image Container */}
                      <div className="relative aspect-[3/4] mb-6 overflow-hidden bg-[#0a0a0a]">
                        <Image
                          src={relatedProduct.media?.[0]?.media_url || ""}
                          alt={relatedProduct.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />

                        {/* Save Badge */}
                        {discount > 0 && (
                          <div className="absolute top-4 left-4 bg-[#E31E24] text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider">
                            Save {discount}%
                          </div>
                        )}

                        {/* Black Friday Tag (CSS simulated) */}
                        <div className="absolute top-12 left-2 transform -rotate-12">
                          <div className="bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded-sm shadow-lg border border-white/20 relative">
                            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-1 h-3 bg-white/50 rounded-full"></div>
                            BLACK<br />FRIDAY
                          </div>
                        </div>

                        {/* Add Button */}
                        <button className="absolute bottom-4 right-4 w-8 h-8 bg-white text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-200">
                          <Plus size={16} />
                        </button>
                      </div>

                      {/* Product Info */}
                      <div className="text-center space-y-2">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-200 leading-relaxed">
                          {relatedProduct.name}
                        </h3>
                        <div className="flex items-center justify-center gap-3 text-xs font-bold">
                          <span className="text-[#E31E24]">
                            RS. {Math.round(relatedProduct.base_price).toLocaleString()}.00
                          </span>
                          {relatedProduct.compare_at_price && (
                            <span className="text-gray-500 line-through decoration-gray-500">
                              RS. {Math.round(relatedProduct.compare_at_price).toLocaleString()}.00
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
