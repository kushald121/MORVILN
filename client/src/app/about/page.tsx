"use client";

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';

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
    return <>{fallback || <div className={`${className} bg-muted animate-pulse rounded`} />}</>;
  }

  return <IconComponent className={className} />;
};

// Data Constants
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
      <div className="min-h-screen bg-background">
        
        {/* Hero Section */}
        <motion.section
          className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {/* Background Effects */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-blob-slow" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-blob-slow animation-delay-2000" />
          </div>

          <div className="relative max-w-4xl mx-auto text-center z-10">
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 backdrop-blur-sm rounded-full border border-primary/30 mb-8"
            >
              <IconWrapper name="Sparkles" className="w-5 h-5 text-primary" />
              <span className="text-foreground text-sm font-medium tracking-wider">SUSTAINABLE FASHION BRAND</span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight tracking-tighter"
            >
              Fashion That Feels{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
                As Good As It Looks
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8"
            >
              Premium quality clothing crafted with sustainable materials. Where style meets responsibility, and comfort meets conscience.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link href="/allproducts">
                <motion.button
                  className="px-8 py-4 bg-gradient-to-r from-primary to-blue-600 text-white rounded-full font-semibold text-lg shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 flex items-center gap-2"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <IconWrapper name="ShoppingBag" className="w-5 h-5" />
                  Shop Collection
                </motion.button>
              </Link>

              <motion.button
                className="px-8 py-4 bg-secondary backdrop-blur-sm border border-border text-secondary-foreground rounded-full font-semibold text-lg hover:bg-secondary/80 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                View Lookbook
              </motion.button>
            </motion.div>
          </div>
        </motion.section>

        {/* What Makes Us Different */}
        <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 tracking-tight">
                What Makes Us{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
                  Different
                </span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                We&apos;re not just another clothing brand. We&apos;re on a mission to prove that fashion can be both beautiful and responsible.
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
                  className="group p-8 bg-card rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-primary/10"
                  whileHover={{ y: -8 }}
                >
                  <div className="inline-flex p-4 rounded-xl bg-primary text-primary-foreground mb-6 group-hover:scale-110 transition-all duration-300">
                    <IconWrapper name={item.iconName} className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-card-foreground mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-background">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 tracking-tight">
                Trusted by{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
                  Thousands
                </span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
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
                  <div className="relative p-8 bg-card backdrop-blur-sm rounded-2xl border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
                    <div className="inline-flex p-4 rounded-xl bg-primary/10 text-primary mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                      <IconWrapper name={stat.iconName} className="w-8 h-8" />
                    </div>
                    <div className="text-4xl font-bold text-foreground mb-2">{stat.number}</div>
                    <div className="text-lg font-semibold text-primary mb-1">{stat.label}</div>
                    <div className="text-sm text-muted-foreground">{stat.description}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Our Journey Timeline */}
        <section
          ref={timelineRef}
          className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-muted/30"
        >
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="text-center mb-20"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 tracking-tight">
                Our Journey
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                From a small idea to a global sustainable fashion movement.
              </p>
            </motion.div>

            <div className="relative">
              {/* Timeline Line */}
              <motion.div
                className="absolute left-1/2 top-0 bottom-0 w-1 bg-border"
                style={{ transform: 'translateX(-50%)' }}
              />
              <motion.div
                className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-blue-600"
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
                      <p className="text-primary font-semibold text-lg mb-1">{item.year}</p>
                      <h3 className="text-2xl font-bold text-foreground mb-2">{item.title}</h3>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                    <div className="w-1/2 flex justify-center order-1">
                      <div className="absolute z-10 w-12 h-12 bg-background border-2 border-primary rounded-full flex items-center justify-center text-primary">
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
        <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-background">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 tracking-tight">
                Our{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
                  Commitment
                </span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
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
                  <div className="inline-flex p-4 rounded-xl bg-primary text-primary-foreground mb-4 group-hover:scale-110 transition-all duration-300">
                    <IconWrapper name={value.iconName} className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">{value.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Customer Reviews */}
        <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 tracking-tight">
                What Our{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
                  Customers Say
                </span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
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
                  className="relative p-8 bg-card rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
                >
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <IconWrapper key={i} name="Star" className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-card-foreground mb-6 leading-relaxed">{testimonial.quote}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold mr-4">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <div className="font-bold text-card-foreground">{testimonial.author}</div>
                        <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground">Purchased: {testimonial.product}</p>
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
                  className="px-8 py-3 border-2 border-primary text-primary rounded-full font-semibold hover:bg-primary hover:text-primary-foreground transition-all duration-300"
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
        <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-background">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 tracking-tight">
                Shop Our{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
                  Collections
                </span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
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
                  className="group p-8 bg-card rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl cursor-pointer"
                  whileHover={{ y: -8 }}
                >
                  <div className="text-6xl mb-6 text-center">{category.image}</div>
                  <h3 className="text-2xl font-bold text-card-foreground mb-4 text-center">{category.title}</h3>
                  <ul className="space-y-2">
                    {category.items.map((item) => (
                      <li key={item} className="text-muted-foreground flex items-center">
                        <IconWrapper name="ArrowRight" className="w-4 h-4 mr-2 text-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link href="/allproducts">
                    <motion.button
                      className="w-full mt-6 px-6 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-all duration-300"
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
        <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 tracking-tight">
                Meet Our{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
                  Team
                </span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
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
                    <div className="absolute inset-0 bg-gradient-to-b from-primary to-blue-600 group-hover:from-blue-600 group-hover:to-primary transition-all duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <IconWrapper name="User" className="w-16 h-16 text-white/80" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{member.name}</h3>
                  <p className="text-primary font-medium mb-3">{member.role}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">{member.bio}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section - Shop Now */}
        <section className="relative py-20 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-primary/10 via-background to-blue-600/10">
          {/* Background Elements */}
          <div className="absolute inset-0">
            <motion.div
              className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
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
              className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl"
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
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 backdrop-blur-sm rounded-full border border-primary/30 mb-8"
                whileHover={{ scale: 1.05 }}
              >
                <IconWrapper name="Sparkles" className="w-5 h-5 text-primary" />
                <span className="text-foreground text-sm font-medium tracking-wider">SHOP WITH CONFIDENCE</span>
              </motion.div>

              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight">
                Ready to Elevate Your{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
                  Wardrobe?
                </span>
              </h2>
              <p className="text-xl text-muted-foreground mb-4 max-w-3xl mx-auto leading-relaxed">
                Join thousands of satisfied customers who&apos;ve upgraded their style with MORVILN.
              </p>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
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
                  <div className="inline-flex p-4 rounded-xl bg-primary/10 text-primary mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                    <IconWrapper name={feature.iconName} className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
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
                    className="px-10 py-4 bg-gradient-to-r from-primary to-blue-600 text-white rounded-full font-semibold text-lg shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 flex items-center gap-2"
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <IconWrapper name="ShoppingBag" className="w-5 h-5" />
                    Start Shopping
                  </motion.button>
                </Link>

                <Link href="/new-arrivals">
                  <motion.button
                    className="px-10 py-4 bg-secondary backdrop-blur-sm border border-border text-secondary-foreground rounded-full font-semibold text-lg hover:bg-secondary/80 transition-all duration-300"
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    View New Arrivals
                  </motion.button>
                </Link>
              </div>

              <motion.p
                className="text-muted-foreground text-sm mt-8"
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