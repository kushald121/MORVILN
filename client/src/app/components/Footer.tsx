"use client"
import React, { useRef } from 'react';
import { Truck, RotateCcw, MessageSquare, Smile, Star, ChevronLeft, ChevronRight, Check } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    title: "Not for taller people",
    text: "Not for taller people but does the job well enough.",
    author: "Rithwik chander",
    rating: 5,
    productImg: "bg-zinc-800"
  },
  {
    id: 2,
    title: "Stars",
    text: "Stars. Absolutely amazing quality.",
    author: "Anonymous",
    rating: 5,
    productImg: "bg-zinc-700"
  },
  {
    id: 3,
    title: "It was nice soo far",
    text: "It was nice soo far soo good. Loved the fit.",
    author: "Anonymous",
    rating: 5,
    productImg: "bg-zinc-600"
  },
  {
    id: 4,
    title: "Amazing",
    text: "Amazing fit and finish. Will buy again.",
    author: "Vaish",
    rating: 5,
    productImg: "bg-zinc-800"
  },
  {
    id: 5,
    title: "Great quality",
    text: "Great quality must buy. Highly recommended.",
    author: "Anonymous",
    rating: 5,
    productImg: "bg-zinc-700"
  },
  {
    id: 6,
    title: "Perfect Style",
    text: "Exactly what I was looking for. Streetwear vibe.",
    author: "Arjun K.",
    rating: 5,
    productImg: "bg-zinc-600"
  },
  {
    id: 7,
    title: "Comfortable",
    text: "Fabric is soft and breathable. 10/10.",
    author: "Sarah M.",
    rating: 4,
    productImg: "bg-zinc-800"
  }
];

const Footer = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="w-full bg-black text-white font-sans">
      {/* ================= TESTIMONIALS SECTION ================= */}
  <div className="py-16 px-6 bg-black">
        <div className="max-w-screen-xl mx-auto text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight">Let MORVILN speak for us</h2>
          <div className="flex flex-col items-center gap-2">
            <div className="flex text-green-500 gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>
            <p className="text-gray-400 font-medium flex items-center gap-2">
              from 2152 reviews 
              <span className="bg-blue-500/20 text-blue-400 p-0.5 rounded-full">
                <Check className="w-3 h-3" />
              </span>
            </p>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-screen-xl mx-auto group">
          
          {/* Left Arrow */}
          <button 
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-zinc-800 hover:bg-zinc-700 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Scrollable Area */}
          <div 
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {testimonials.map((item) => (
              <div 
                key={item.id} 
                className="min-w-[280px] md:min-w-[250px] flex flex-col items-center text-center snap-center shrink-0"
              >
                <div className="flex text-green-500 gap-0.5 mb-2">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <h4 className="font-bold text-lg mb-1 line-clamp-1">{item.title}</h4>
                <p className="text-gray-300 text-sm mb-3 min-h-[40px] line-clamp-2 px-2">
                  {item.text}
                </p>
                <p className="text-gray-500 text-xs font-medium mb-4">{item.author}</p>
                
                {/* Mock Product Image */}
                <div className={`w-12 h-16 rounded-md ${item.productImg} opacity-80`} />
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button 
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-zinc-800 hover:bg-zinc-700 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>


      {/* ================= FOOTER CONTENT ================= */}
      <footer className="w-full text-base font-medium">
        
        {/* 1. TOP FEATURES BAR */}
        <div className="w-full py-12 px-6">
          <div className="max-w-screen-xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 text-center">
            
            {/* Feature 1 */}
            <div className="flex flex-col items-center space-y-4">
              <Truck className="w-8 h-8 text-white" />
              <h3 className="uppercase tracking-widest font-bold text-sm text-gray-200">Free Delivery</h3>
              <p className="text-gray-400 text-sm leading-relaxed max-w-[220px]">
                Dispatched in 48 hours,<br />delivered in just 3–5 working days*
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center space-y-4">
              <RotateCcw className="w-8 h-8 text-white" />
              <h3 className="uppercase tracking-widest font-bold text-sm text-gray-200">Easy Exchanges</h3>
              <p className="text-gray-400 text-sm leading-relaxed max-w-[220px]">
                72-hour window for quick size or product exchanges.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center space-y-4">
              <MessageSquare className="w-8 h-8 text-white" />
              <h3 className="uppercase tracking-widest font-bold text-sm text-gray-200">Robust Support</h3>
              <p className="text-gray-400 text-sm leading-relaxed max-w-[220px]">
                Reach us anytime: <a href="mailto:morviln@gmail.com" className="hover:text-white hover:underline transition-colors text-gray-300">morviln@gmail.com</a>
                <br />
                <span className="block mt-1">+91 8928096047</span>
              </p>
            </div>

            {/* Feature 4 */}
            <div className="flex flex-col items-center space-y-4">
              <Smile className="w-8 h-8 text-white" />
              <h3 className="uppercase tracking-widest font-bold text-sm text-gray-200">Happy Customers</h3>
              <p className="text-gray-400 text-sm leading-relaxed max-w-[220px]">
                Join our growing family of happy customers based in Mumbai.
              </p>
            </div>

          </div>
        </div>

        {/* 2. MAIN FOOTER LINKS */}
        <div className="max-w-screen-xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-8">
            
            {/* LEFT COLUMN: Socials & Copyright */}
            <div className="flex flex-col justify-between h-full order-3 lg:order-1">
               <div className="hidden lg:block flex-grow"></div>
              
              <div className="mt-auto">
                {/* Social Media Icons */}
                <ul className="flex gap-8 mb-8 justify-center lg:justify-start">
                  {/* Facebook */}
                  <li>
                    <a href="https://www.facebook.com/" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white hover:scale-110 transform transition duration-300">
                      <span className="sr-only">Facebook</span>
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                      </svg>
                    </a>
                  </li>
                  {/* Instagram */}
                  <li>
                    <a href="https://www.instagram.com/damnn_aymn/" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white hover:scale-110 transform transition duration-300">
                      <span className="sr-only">Instagram</span>
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.153 1.772c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                      </svg>
                    </a>
                  </li>
                  {/* Twitter */}
                  <li>
                    <a href="https://twitter.com/" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white hover:scale-110 transform transition duration-300">
                      <span className="sr-only">Twitter</span>
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </a>
                  </li>
                  {/* Github */}
                  <li>
                    <a href="https://github.com/aymnsk" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white hover:scale-110 transform transition duration-300">
                      <span className="sr-only">GitHub</span>
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                      </svg>
                    </a>
                  </li>
                </ul>
                
                <p className="text-gray-500 text-sm text-center lg:text-left">
                  &copy; 2025 MORVILN
                </p>
              </div>
            </div>

            {/* CENTER COLUMN: Links */}
            <div className="flex flex-col items-center order-2">
              <h4 className="uppercase tracking-widest text-sm font-bold text-gray-400 mb-8">
                Footer
              </h4>
              
              <nav className="flex flex-col space-y-4 text-center">
                <a href="/about/" className="text-gray-300 hover:text-white hover:underline transition text-lg">
                  About Morviln
                </a>
                <a href="/" className="text-gray-300 hover:text-white hover:underline transition text-lg">
                  Careers
                </a>
                <a href="/sign-in/" className="text-gray-300 hover:text-white hover:underline transition text-lg">
                  My Account
                </a>
                <a href="/refundpolicy" className="text-gray-300 hover:text-white hover:underline transition text-lg">
                  Refund Policy
                </a>
                <a href="/privacypolicy" className="text-gray-300 hover:text-white hover:underline transition text-lg">
                  Privacy Policy
                </a>
                <a href="/termsandcondition/" className="text-gray-300 hover:text-white hover:underline transition text-lg">
                  Terms of Service
                </a>
                <a href="/contactus" className="text-gray-300 hover:text-white hover:underline transition text-lg">
                  Contact Us
                </a>
              </nav>
            </div>

            {/* RIGHT COLUMN: Info */}
            <div className="flex flex-col items-center lg:items-end text-center lg:text-right order-1 lg:order-3">
               <h4 className="uppercase tracking-widest text-sm font-bold text-gray-400 mb-6">
                Proudly Homegrown in India
              </h4>
              
              <div className="space-y-2">
                <h1 className="font-amperserif text-3xl font-bold text-white tracking-wide">MORVILN</h1>
                <p className="text-gray-400 text-sm">Based in Mumbai</p>
                <p className="text-gray-400 text-sm">Est. 2025</p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. BOTTOM DIRECTORY STRIP */}
        <div className="border-t border-zinc-800 py-8 px-6 bg-zinc-900">
          <div className="max-w-screen-xl mx-auto flex flex-col items-center">
            <h5 className="uppercase text-xs tracking-widest text-gray-500 mb-4 font-semibold">
              Morviln Directory
            </h5>
            
            <nav className="flex flex-wrap justify-center gap-x-2 gap-y-3 text-xs uppercase text-gray-400 font-bold tracking-wider">
               <a href="/allproducts/" className="hover:text-white underline-offset-4 hover:underline transition">
                 Collections
               </a>
               <span className="text-zinc-700">|</span>
               
               <a href="/allproducts/" className="hover:text-white underline-offset-4 hover:underline transition">
                 New Arrivals
               </a>
               <span className="text-zinc-700">|</span>

               <a href="/allproducts/" className="hover:text-white underline-offset-4 hover:underline transition">
                 Accessories
               </a>
               <span className="text-zinc-700">|</span>

               <a href="/allproducts/" className="hover:text-white underline-offset-4 hover:underline transition">
                 Brands
               </a>
               <span className="text-zinc-700">|</span>

               <a href="/" className="hover:text-white underline-offset-4 hover:underline transition">
                 Investors
               </a>
               <span className="text-zinc-700">|</span>

               <a href="/" className="hover:text-white underline-offset-4 hover:underline transition">
                 Sustainability
               </a>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;