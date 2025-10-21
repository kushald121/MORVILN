"use client";
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Marquee from "react-fast-marquee";
import Image from 'next/image';


// stagger motion animation
const containerMotion = {
  visible: { transition: { staggerChildren: 0.2 } },
};

// animation parameters for TEXT
const textMotion = {
  //movement = FADE-IN
  hidden: { opacity: 0, y: -10}, // INITIAL STAGE
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 }}, // ANIMATION STAGE
};

const Brands = () => {
  const brandsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Enhanced marquee animations
      gsap.to(".brand-logo", {
        rotationY: 360,
        duration: 8,
        ease: "none",
        stagger: {
          each: 2,
          repeat: -1,
        },
      });

      // Hover effect for brand logos
      const brandLogos = document.querySelectorAll('.brand-logo');
      brandLogos.forEach((logo) => {
        logo.addEventListener('mouseenter', () => {
          gsap.to(logo, {
            scale: 1.1,
            filter: "brightness(1.2)",
            duration: 0.3,
            ease: "power2.out"
          });
        });

        logo.addEventListener('mouseleave', () => {
          gsap.to(logo, {
            scale: 1,
            filter: "brightness(1)",
            duration: 0.3,
            ease: "power2.out"
          });
        });
      });
    }, brandsRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
    <motion.div
      ref={brandsRef}
      className="py-10 relative overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{once: true, amount: 0.5}}
      variants={containerMotion}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-cyan-400/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        {/* INTRODUCTION TEXT */}
        <motion.div className='flex items-center justify-center flex-wrap gap-2' variants={textMotion}>
          <motion.h2
            className="text-center text-lg font-semibold leading-8 text-foreground"
            animate={{
              textShadow: [
                "0 0 0px rgba(255,255,255,0)",
                "0 0 10px rgba(255,255,255,0.3)",
                "0 0 0px rgba(255,255,255,0)"
              ]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            Collaboration with
          </motion.h2>
          <motion.h2
            className="text-center text-lg font-semibold leading-8 text-transparent bg-clip-text bg-gradient-to-l from-primary to-purple-500"
            animate={{
              backgroundPosition: ["0%", "100%", "0%"],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              backgroundSize: "200% 100%",
            }}
          >
            brands you love
          </motion.h2>
          <motion.h2
            className="text-center text-lg font-semibold leading-8 text-foreground"
            animate={{
              textShadow: [
                "0 0 0px rgba(255,255,255,0)",
                "0 0 10px rgba(255,255,255,0.3)",
                "0 0 0px rgba(255,255,255,0)"
              ]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          >
            around the world
          </motion.h2>
        </motion.div>

        {/* ROTATING BRAND MARQUEE */}
        <motion.div
          className="flex items-center justify-center mx-auto mt-10 max-w-none"
          variants={textMotion}
          whileHover={{ scale: 1.02 }}
        >
          <Marquee pauseOnHover={true} speed={35} gradient={true} gradientWidth={25}>
            <a href="https://www.urbanoutfitters.com/">
              <Image
                className="brand-logo max-h-12 w-full object-contain mr-16 transition-all duration-300"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Urban_Outfitters_logo.svg/640px-Urban_Outfitters_logo.svg.png"
                alt="Urban Outfitters"
                width={120}
                height={48}
                unoptimized
              />
            </a>
            <a href="https://www2.hm.com/en_us/index.html">
              <Image
                className="brand-logo max-h-12 w-full object-contain mr-16 transition-all duration-300"
                src="https://www.nicepng.com/png/full/382-3821785_free-hbo-logo-transparent-h-m-logo-black.png"
                alt="H&M"
                width={120}
                height={48}
                unoptimized
              />
            </a>
            <a href='https://www.patagonia.com/home/'>
              <Image
                className="brand-logo max-h-12 w-full object-contain mr-16 transition-all duration-300"
                src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Patagonia_%28Unternehmen%29_logo.svg"
                alt="Patagonia"
                width={120}
                height={48}
                unoptimized
              />
            </a>
            <a href='https://www.suspiciousantwerp.com/'>
              <Image
                className="brand-logo max-h-12 w-full object-contain mr-16 transition-all duration-300"
                src="https://cdn.shopify.com/s/files/1/1610/4725/files/sspcs_new_main-01_9d2ef6b5-6965-455b-829d-2792245f8c39.png?v=1632727014"
                alt="Suspicious Antwerp"
                width={120}
                height={48}
                unoptimized
              />
            </a>
            <a href="https://www.pantaloons.com/">
              <Image
                className="brand-logo max-h-12 w-full object-contain mr-16 transition-all duration-300"
                src="https://couponzania.com/wp-content/uploads/2024/07/Pantaloons-Logo-e1735879958373.webp"
                alt="Pantaloons"
                width={120}
                height={48}
                unoptimized
              />
            </a>
            <a href="https://bananarepublic.gap.com/">
              <Image
                className="brand-logo max-h-12 w-full object-contain mr-16 transition-all duration-300"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Banana_Republic.svg/2560px-Banana_Republic.svg.png"
                alt="Banana Republic"
                width={120}
                height={48}
                unoptimized
              />
            </a>
            <a href="https://www.prettylittlething.us/">
              <Image
                className="brand-logo max-h-12 w-full object-contain sm:col-start-2 mr-16 transition-all duration-300"
                src="https://www.creativebrief.com/user_files/25520/5ece1d423dbed_prettylittlething-prettybigthing-full-width-image.png"
                alt="PrettyLittleThing"
                width={120}
                height={48}
                unoptimized
              />
            </a>
            <a href='https://www.zara.com/us/'>
              <Image
                className="brand-logo max-h-12 w-full object-contain mr-16 transition-all duration-300"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Zara_Logo.svg/1024px-Zara_Logo.svg.png"
                alt="ZARA"
                width={120}
                height={48}
                unoptimized
              />
            </a>
            <a href="https://www.tommybahama.com/">
              <Image
                className="brand-logo max-h-12 w-full object-contain mr-16 transition-all duration-300"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Tommy_Bahama_logo.svg/2560px-Tommy_Bahama_logo.svg.png"
                alt="Tommy Bahama"
                width={120}
                height={48}
                unoptimized
              />
            </a>
          </Marquee>
        </motion.div>
        
      </div>
    </motion.div>
    </>
  )
}

export default Brands
