"use client";

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
// import dynamic from 'next/dynamic';

// TypeScript Interfaces
interface PhilosophyItem {
  iconName: string;
  title: string;
  description: string;
}

interface Statistic {
  iconName: string;
  number: string;
  label: string;
  description: string;
}

interface TimelineItem {
  iconName: string;
  year: string;
  title: string;
  description: string;
}

interface Value {
  iconName: string;
  title: string;
  description: string;
}

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  avatar: string;
  product: string;
}

interface TeamMember {
  name: string;
  role: string;
  bio: string;
}

interface Feature {
  iconName: string;
  title: string;
  description: string;
}

interface ShopCategory {
  title: string;
  items: string[];
  image: string;
}

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.2,
    }
  }
};

// Icon Component with Error Boundaries
interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number | string;
  stroke?: string;
  fill?: string;
}

const IconWrapper = ({ name, className = "w-8 h-8", fallback = null }: {
  name: string;
  className?: string;
  fallback?: React.ReactNode;
}) => {
  const [IconComponent, setIconComponent] = useState<React.ComponentType<IconProps> | null>(null);

  useEffect(() => {
    import('lucide-react').then(mod => {
      setIconComponent(() => mod[name as keyof typeof mod] as React.ComponentType<IconProps>);
    }).catch(error => {
      console.warn(`Failed to load icon ${name}:`, error);
    });
  }, [name]);

  if (!IconComponent) {
    return <>{fallback || <div className={`${className} bg-gray-300 animate-pulse rounded`} />}</>;
  }

  return <IconComponent className={className} />;
};

// // Dynamic imports for heavy components
// const SplashCursor = dynamic(() => import('../components/ui/splash-cursor'), {
//   ssr: false,
//   loading: () => null
// });

// Data Constants with IconWrapper components
const PHILOSOPHY_ITEMS: PhilosophyItem[] = [
  {
    iconName: "Shirt",
    title: "Timeless Fashion",
    description: "Creating versatile pieces that transcend seasonal trends, designed to be wardrobe staples for years to come.",
  },
  {
    iconName: "Scissors",
    title: "Expert Craftsmanship",
    description: "Every garment is meticulously crafted with premium materials and attention to detail by skilled artisans.",
  },
  {
    iconName: "Leaf",
    title: "Sustainable Materials",
    description: "100% eco-friendly fabrics, organic cotton, and recycled materials. Fashion that cares for our planet.",
  }
];

const STATISTICS: Statistic[] = [
  {
    iconName: "Users",
    number: "50K+",
    label: "Happy Customers",
    description: "Satisfied shoppers worldwide"
  },
  {
    iconName: "Star",
    number: "4.9/5",
    label: "Customer Rating",
    description: "Based on 12,000+ reviews"
  },
  {
    iconName: "Package",
    number: "100K+",
    label: "Orders Delivered",
    description: "Successfully shipped globally"
  },
  {
    iconName: "Leaf",
    number: "100%",
    label: "Sustainable",
    description: "Eco-friendly production"
  }
];

const TIMELINE_ITEMS: TimelineItem[] = [
  {
    iconName: "Lightbulb",
    year: "2020",
    title: "The Vision",
    description: "Born from a passion to create sustainable fashion that doesn't compromise on style. MORVILN was founded to revolutionize how we think about clothing."
  },
  {
    iconName: "Store",
    year: "2021",
    title: "First Collection Launch",
    description: "Our debut collection 'Essential Elegance' sold out in just 48 hours, featuring organic cotton basics and sustainable denim."
  },
  {
    iconName: "Package",
    year: "2022",
    title: "Going Global",
    description: "Expanded shipping to 50+ countries. Launched our signature sustainable sneakers and premium outerwear line."
  },
  {
    iconName: "Globe",
    year: "2024",
    title: "Fashion Forward",
    description: "Opening flagship stores in major cities worldwide. Launching our circular fashion program - buy, wear, return, renew."
  }
];

const VALUES: Value[] = [
  {
    iconName: "Leaf",
    title: "Eco-Conscious",
    description: "Sustainable fabrics, zero waste manufacturing, and carbon-neutral shipping on every order."
  },
  {
    iconName: "Star",
    title: "Premium Quality",
    description: "Superior materials and construction that last. We believe in buy once, wear forever."
  },
  {
    iconName: "Heart",
    title: "Fair Trade",
    description: "Ethical production with fair wages. Every purchase supports artisan communities worldwide."
  },
  {
    iconName: "Shirt",
    title: "Versatile Style",
    description: "Designs that work for any occasion. From casual weekends to business meetings."
  }
];

const TESTIMONIALS: Testimonial[] = [
  {
    quote: "Best quality clothes I've ever owned! The fabric is incredibly soft and the fit is perfect. I've washed my MORVILN tee 50+ times and it still looks brand new.",
    author: "Emily Chen",
    role: "Verified Customer",
    avatar: "EC",
    product: "Organic Cotton T-Shirt"
  },
  {
    quote: "Finally, a brand that gets it right. Sustainable, stylish, and affordable. The sneakers are my go-to for everything. I've bought 3 pairs already!",
    author: "Marcus Johnson",
    role: "Verified Customer",
    avatar: "MJ",
    product: "Eco Sneakers Collection"
  },
  {
    quote: "I love that I can look good and feel good about my purchases. The quality is exceptional and knowing it's all eco-friendly makes it even better. 10/10!",
    author: "Sarah Williams",
    role: "Verified Customer",
    avatar: "SW",
    product: "Sustainable Denim Jeans"
  }
];

const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "Harnish Dangi",
    role: "Founder & Creative Director",
    bio: "Fashion designer with 15+ years experience, combining runway aesthetics with everyday wearability.",
  },
  {
    name: "Morviln Dangi",
    role: "Head of Sustainability",
    bio: "Leading our eco-initiative, ensuring every material meets the highest environmental standards.",
  },
  {
    name: "Nilesh Dangi",
    role: "Chief Operations Officer",
    bio: "Streamlining global logistics to deliver premium quality clothing to your doorstep.",
  },
];

const FEATURES: Feature[] = [
  {
    iconName: "Truck",
    title: "Free Shipping",
    description: "Free worldwide shipping on orders over $50"
  },
  {
    iconName: "RefreshCw",
    title: "Easy Returns",
    description: "30-day hassle-free returns and exchanges"
  },
  {
    iconName: "Shield",
    title: "Quality Guarantee",
    description: "1-year warranty on all our products"
  }
];

const SHOP_CATEGORIES: ShopCategory[] = [
  {
    title: "Men's Collection",
    items: ["T-Shirts & Tops", "Jeans & Pants", "Jackets & Hoodies", "Shoes & Sneakers"],
    image: "👔"
  },
  {
    title: "Women's Collection",
    items: ["Dresses & Skirts", "Tops & Blouses", "Jeans & Trousers", "Outerwear"],
    image: "👗"
  },
  {
    title: "Accessories",
    items: ["Bags & Backpacks", "Hats & Caps", "Scarves & Belts", "Sunglasses"],
    image: "👜"
  }
];

const AboutPage = () => {
  const timelineRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start end", "end start"]
  });
  const timelineProgress = useTransform(scrollYProgress, [0.1, 0.9], [0, 1]);

  return (
    <>
      {/* <SplashCursor /> */}
      <div className="min-h-screen ">
        
        {/* Hero Section */}
        <motion.section
          className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {/* Background Effects */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-blob-slow" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-blob-slow animation-delay-2000" />
          </div>

          <div className="relative max-w-4xl mx-auto text-center z-10">
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 backdrop-blur-sm rounded-full border border-cyan-400/30 mb-8"
            >
              <IconWrapper name="Sparkles" className="w-5 h-5 text-cyan-300" />
              <span className="text-cyan-100 text-sm font-medium tracking-wider">SUSTAINABLE FASHION BRAND</span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tighter"
            >
              Fashion That Feels{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">
                As Good As It Looks
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-xl text-cyan-100/80 max-w-3xl mx-auto leading-relaxed mb-8"
            >
              Premium quality clothing crafted with sustainable materials. Where style meets responsibility, and comfort meets conscience.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link href="/allproducts">
                <motion.button
                  className="px-8 py-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-full font-semibold text-lg shadow-lg shadow-cyan-500/20 hover:shadow-xl hover:shadow-cyan-500/40 transition-all duration-300 flex items-center gap-2"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <IconWrapper name="ShoppingBag" className="w-5 h-5" />
                  Shop Collection
                </motion.button>
              </Link>

              <motion.button
                className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-full font-semibold text-lg hover:bg-white/20 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                View Lookbook
              </motion.button>
            </motion.div>
          </div>
        </motion.section>

        {/* What Makes Us Different */}
        <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h2 className="text-4xl sm:text-5xl font-bold text-blue-500 mb-4 tracking-tight">
                What Makes Us{' '}
                <span className="text-blue bg-clip-text ">
                  Different
                </span>
              </h2>
              <p className="text-lg text-white max-w-3xl mx-auto">
                Were not just another clothing brand. Were on a mission to prove that fashion can be both beautiful and responsible.
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {PHILOSOPHY_ITEMS.map((item) => (
                <motion.div
                  key={item.title}
                  variants={fadeInUp}
                  className="group p-8 bg-white rounded-2xl border border-gray-200/80 hover:border-[#0A1B39]/50 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-cyan-500/10"
                  whileHover={{ y: -8 }}
                >
                  <div
                    className="inline-flex p-4 rounded-xl text-white mb-6 group-hover:scale-110 transition-all duration-300"
                    style={{ backgroundColor: '#0A1B39' }}
                  >
                    <IconWrapper name={item.iconName} className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Statistics Section */}
        <section
          className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8"
        >
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
                Trusted by{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">
                  Thousands
                </span>
              </h2>
              <p className="text-lg text-white/70 max-w-3xl mx-auto">
                Join our growing community of fashion-forward, eco-conscious shoppers worldwide.
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-2 lg:grid-cols-4 gap-8"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {STATISTICS.map((stat) => (
                <motion.div
                  key={stat.label}
                  variants={fadeInUp}
                  className="text-center group"
                >
                  <div className="relative p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-cyan-400/30 transition-all duration-300 hover:bg-white/10">
                    <div className="inline-flex p-4 rounded-xl bg-cyan-400/20 text-cyan-300 mb-4 group-hover:bg-cyan-400/30 group-hover:scale-110 transition-all duration-300">
                      <IconWrapper name={stat.iconName} className="w-8 h-8" />
                    </div>
                    <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
                    <div className="text-lg font-semibold text-cyan-200 mb-1">{stat.label}</div>
                    <div className="text-sm text-white/60">{stat.description}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Our Journey Timeline */}
        <section
          ref={timelineRef}
          className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8"
        >
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="text-center mb-20"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
                Our Journey
              </h2>
              <p className="text-lg text-white/70 max-w-3xl mx-auto">
                From a small idea to a global sustainable fashion movement.
              </p>
            </motion.div>

            <div className="relative">
              {/* Timeline Line */}
              <motion.div
                className="absolute left-1/2 top-0 bottom-0 w-1 bg-white/20"
                style={{ transform: 'translateX(-50%)' }}
              />
              <motion.div
                className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 to-blue-500"
                style={{ transform: 'translateX(-50%)', scaleY: timelineProgress, transformOrigin: 'top' }}
              />

              {/* Timeline Items */}
              <div className="space-y-16">
                {TIMELINE_ITEMS.map((item, index) => (
                  <motion.div
                    key={item.year}
                    className="relative flex items-center"
                    initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left order-2'}`}>
                      <p className="text-cyan-300 font-semibold text-lg mb-1">{item.year}</p>
                      <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
                      <p className="text-white/60">{item.description}</p>
                    </div>
                    <div className="w-1/2 flex justify-center order-1">
                      <div
                        className="absolute z-10 w-12 h-12 border-2 border-cyan-400 rounded-full flex items-center justify-center text-cyan-300"
                        style={{ backgroundColor: '#0A1B39' }}
                      >
                        <IconWrapper name={item.iconName} className="w-6 h-6" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 ">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h2 className="text-4xl sm:text-5xl font-bold text-blue-500 mb-4 tracking-tight">
                Our{' '}
                <span className="text-blue-500 bg-clip-text ">
                  Commitment
                </span>
              </h2>
              <p className="text-lg text-white max-w-3xl mx-auto">
                Every piece we create reflects our dedication to quality, sustainability, and ethical practices.
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {VALUES.map((value) => (
                <motion.div
                  key={value.title}
                  variants={fadeInUp}
                  className="text-center group p-6"
                >
                  <div
                    className="inline-flex p-4 rounded-xl text-white mb-4 group-hover:scale-110 transition-all duration-300"
                    style={{ backgroundColor: '#0A1B39' }}
                  >
                    <IconWrapper name={value.iconName} className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-blue-500 mb-3">{value.title}</h3>
                  <p className="text-gray-200 leading-relaxed text-sm">{value.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Customer Reviews */}
        <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 ">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-100 mb-4 tracking-tight">
                What Our{' '}
                <span className="text-blue-500 bg-clip-text bg-gradient-to-r from-[#0A1B39] to-cyan-600">
                  Customers Say
                </span>
              </h2>
              <p className="text-lg text-gray-200 max-w-3xl mx-auto">
                Real reviews from real customers who love their MORVILN pieces.
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {TESTIMONIALS.map((testimonial) => (
                <motion.div
                  key={testimonial.author}
                  variants={fadeInUp}
                  className="relative p-8 bg-gray-50 rounded-2xl border border-gray-200 hover:border-[#0A1B39]/50 transition-all duration-300 hover:shadow-lg"
                >
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <IconWrapper key={i} name="Star" className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 leading-relaxed">{testimonial.quote}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold mr-4"
                        style={{ backgroundColor: '#0A1B39' }}
                      >
                        {testimonial.avatar}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{testimonial.author}</div>
                        <div className="text-sm text-gray-600">{testimonial.role}</div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500">Purchased: {testimonial.product}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="text-center mt-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <Link href="/reviews">
                <motion.button
                  className="px-8 py-3 border-2 border-[#0A1B39] text-blue-500 rounded-full font-semibold hover:bg-[#0A1B39] hover:text-white transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Read More Reviews
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Shop by Category Preview */}
        <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 ">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h2 className="text-4xl sm:text-5xl font-bold text-blue-500 mb-4 tracking-tight">
                Shop Our{' '}
                <span className="text-blue-400 bg-clip-text bg-gradient-to-r from-[#0A1B39] to-cyan-600">
                  Collections
                </span>
              </h2>
              <p className="text-lg text-gray-200 max-w-3xl mx-auto">
                Discover premium clothing for every style and occasion.
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {SHOP_CATEGORIES.map((category) => (
                <motion.div
                  key={category.title}
                  variants={fadeInUp}
                  className="group p-8 bg-white rounded-2xl border border-gray-200 hover:border-[#0A1B39]/50 transition-all duration-300 hover:shadow-xl cursor-pointer"
                  whileHover={{ y: -8 }}
                >
                  <div className="text-6xl mb-6 text-center">{category.image}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">{category.title}</h3>
                  <ul className="space-y-2">
                    {category.items.map((item) => (
                      <li key={item} className="text-gray-600 flex items-center">
                        <IconWrapper name="ArrowRight" className="w-4 h-4 mr-2 text-[#0A1B39]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link href="/allproducts">
                    <motion.button
                      className="w-full mt-6 px-6 py-3 bg-[#0A1B39] text-white rounded-full font-semibold hover:bg-[#0d2147] transition-all duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Shop Now
                    </motion.button>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Team Section */}
        <section
          className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8"
        >
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
                Meet Our{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">
                  Team
                </span>
              </h2>
              <p className="text-lg text-white/70 max-w-3xl mx-auto">
                The passionate people behind your favorite clothing brand.
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {TEAM_MEMBERS.map((member) => (
                <motion.div key={member.name} variants={fadeInUp} className="text-center group">
                  <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-cyan-400 to-blue-500 group-hover:from-cyan-300 group-hover:to-blue-400 transition-all duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <IconWrapper name="Users" className="w-16 h-16 text-white/50" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
                  <p className="text-cyan-300 font-medium mb-3">{member.role}</p>
                  <p className="text-white/60 text-sm leading-relaxed">{member.bio}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section - Shop Now */}
        <section
          className="relative py-20 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
        >
          {/* Background Elements */}
          <div className="absolute inset-0">
            <motion.div
              className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.5, 0.3, 0.5],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>

          <div className="relative max-w-6xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-400/10 backdrop-blur-sm rounded-full border border-cyan-400/30 mb-8"
                whileHover={{ scale: 1.05 }}
              >
                <IconWrapper name="Sparkles" className="w-5 h-5 text-cyan-300" />
                <span className="text-cyan-100 text-sm font-medium tracking-wider">SHOP WITH CONFIDENCE</span>
              </motion.div>

              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
                Ready to Elevate Your{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">
                  Wardrobe?
                </span>
              </h2>
              <p className="text-xl text-white/70 mb-4 max-w-3xl mx-auto leading-relaxed">
                Join thousands of satisfied customers whove upgraded their style with MORVILN.
              </p>
              <p className="text-lg text-cyan-200/80 max-w-2xl mx-auto">
                Premium quality. Sustainable materials. Timeless designs. All delivered to your door.
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {FEATURES.map((feature) => (
                <motion.div
                  key={feature.title}
                  variants={fadeInUp}
                  className="text-center group"
                >
                  <div className="inline-flex p-4 rounded-xl bg-cyan-400/20 text-cyan-300 mb-4 group-hover:bg-cyan-400/30 group-hover:scale-110 transition-all duration-300">
                    <IconWrapper name={feature.iconName} className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="text-center"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/shop">
                  <motion.button
                    className="px-10 py-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-full font-semibold text-lg shadow-lg shadow-cyan-500/20 hover:shadow-xl hover:shadow-cyan-500/40 transition-all duration-300 flex items-center gap-2"
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <IconWrapper name="ShoppingBag" className="w-5 h-5" />
                    Start Shopping
                  </motion.button>
                </Link>

                <Link href="/new-arrivals">
                  <motion.button
                    className="px-10 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-full font-semibold text-lg hover:bg-white/20 transition-all duration-300"
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    View New Arrivals
                  </motion.button>
                </Link>
              </div>

              <motion.p
                className="text-white/50 text-sm mt-8"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.6 }}
              >
                50,000+ Happy Customers • Free Shipping Over $50 • 30-Day Returns • Eco-Friendly Packaging
              </motion.p>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AboutPage;
