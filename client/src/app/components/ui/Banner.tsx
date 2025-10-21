"use client";
import { motion } from 'framer-motion';
// import SplashCursor from './splash-cursor';

// Sparkle animation
const sparkleMotion = {
  hidden: { opacity: 0, scale: 0 },
  visible: { 
    opacity: [0, 1, 0], 
    scale: [0, 1, 0],
    transition: { 
      duration: 2,
      repeat: Infinity,
      repeatDelay: 3
    }
  }
};

const Banner = () => {
  return (
    <>
    {/* <SplashCursor /> */}
    <div className="relative w-full h-96 overflow-hidden">
      {/* Background sparkles */}
      <div className="absolute inset-0">
        {/* Top sparkles */}
        <motion.div
          className="absolute top-8 left-16 text-blue-400 text-2xl"
          variants={sparkleMotion}
          initial="hidden"
          animate="visible"
        >
          ✦
        </motion.div>
        <motion.div
          className="absolute top-20 right-24 text-cyan-400 text-xl"
          variants={sparkleMotion}
          initial="hidden"
          animate="visible"
          style={{ animationDelay: "1s" }}
        >
          ✦
        </motion.div>
        <motion.div
          className="absolute top-32 left-1/4 text-blue-300 text-lg"
          variants={sparkleMotion}
          initial="hidden"
          animate="visible"
          style={{ animationDelay: "2s" }}
        >
          ✦
        </motion.div>

        {/* Bottom sparkles */}
        <motion.div
          className="absolute bottom-16 right-16 text-cyan-400 text-xl"
          variants={sparkleMotion}
          initial="hidden"
          animate="visible"
          style={{ animationDelay: "0.5s" }}
        >
          ✦
        </motion.div>
        <motion.div
          className="absolute bottom-24 left-32 text-blue-300 text-lg"
          variants={sparkleMotion}
          initial="hidden"
          animate="visible"
          style={{ animationDelay: "1.5s" }}
        >
          ✦
        </motion.div>
        <motion.div
          className="absolute bottom-8 left-1/2 text-blue-400 text-2xl"
          variants={sparkleMotion}
          initial="hidden"
          animate="visible"
          style={{ animationDelay: "2.5s" }}
        >
          ✦
        </motion.div>
      </div>

      {/* Diagonal strips with text */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* First diagonal strip - moves from left to right */}
        <motion.div
          className="absolute w-full h-16 bg-gradient-to-r from-blue-600 to-blue-400 -rotate-12 flex items-center justify-center"
          initial={{ opacity: 0, x: "-100%" }}
          animate={{
            opacity: [0, 1, 1, 0],
            x: ["-100%", "0%", "0%", "-100%"]
          }}
          transition={{
            duration: 4,
            ease: "easeInOut",
            delay: 0.5,
            repeat: Infinity,
            repeatType: "loop",
            times: [0, 0.25, 0.75, 1]
          }}
          style={{ top: "20%" }}
        >
          <div className="flex items-center space-x-8">
            {Array.from({ length: 5 }, (_, i) => (
              <span key={i} className="text-white font-bold text-xl tracking-wider drop-shadow-lg">
                DISCOVER YOUR STYLE
              </span>
            ))}
          </div>
        </motion.div>

        {/* Second diagonal strip - moves from right to left */}
        <motion.div
          className="absolute w-full h-16 bg-gray-500 -rotate-12 flex items-center justify-center opacity-70"
          initial={{ opacity: 0, x: "100%" }}
          animate={{
            opacity: [0, 1, 1, 0],
            x: ["100%", "0%", "0%", "100%"]
          }}
          transition={{
            duration: 4,
            ease: "easeInOut",
            delay: 1.5,
            repeat: Infinity,
            repeatType: "loop",
            times: [0, 0.25, 0.75, 1]
          }}
          style={{ top: "45%" }}
        >
          <div className="flex items-center space-x-8">
            {Array.from({ length: 5 }, (_, i) => (
              <span key={i} className="text-white font-bold text-xl tracking-wider">
                DISCOVER YOUR STYLE
              </span>
            ))}
          </div>
        </motion.div>

        {/* Third diagonal strip - moves from left to right */}
        <motion.div
          className="absolute w-full h-16 bg-gradient-to-r from-blue-600 to-blue-400 -rotate-12 flex items-center justify-center opacity-50"
          initial={{ opacity: 0, x: "-100%" }}
          animate={{
            opacity: [0, 1, 1, 0],
            x: ["-100%", "0%", "0%", "-100%"]
          }}
          transition={{
            duration: 4,
            ease: "easeInOut",
            delay: 2.5,
            repeat: Infinity,
            repeatType: "loop",
            times: [0, 0.25, 0.75, 1]
          }}
          style={{ top: "70%" }}
        >
          <div className="flex items-center space-x-8">
            {Array.from({ length: 5 }, (_, i) => (
              <span key={i} className="text-white font-bold text-xl tracking-wider">
                DISCOVER YOUR STYLE
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
    </>
  )
}

export default Banner;
