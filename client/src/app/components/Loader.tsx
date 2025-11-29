"use client"
import React from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { useEffect, useRef, useState } from 'react';
import {CustomEase} from 'gsap/CustomEase';
import SplitType from "split-type";
import { projectsData } from '@/utils/projects';
import Link from 'next/link';
import { ShoppingBag, User, ArrowRight, Search } from 'lucide-react';


gsap.registerPlugin(CustomEase);
CustomEase.create("hop","0.9,0,0.1,1");

export default function Loader() {
  const [images, setImages] = useState([
    "/Images1/image1.jpg",
    "/Images1/image2.jpg",
    "/Images1/image3.jpg",
    "/Images1/image4.jpg",
    "/Images1/image5.jpg",
    "/Images1/image6.jpg",
    "/Images1/image7.jpg",
    "/Images1/image8.jpg",
    "/Images1/image9.jpg",
  ]);

   const allImagesPool = [
    "/Images1/image1.jpg",
    "/Images1/image2.jpg",
    "/Images1/image3.jpg",
    "/Images1/image4.jpg",
    "/Images1/image5.jpg",
    "/Images1/image6.jpg",
    "/Images1/image7.jpg",
    "/Images1/image8.jpg",
    "/Images1/image9.jpg",
    "/Images1/image10.jpg",
    "/Images1/image11.jpg",
    "/Images1/image12.jpg",
    "/Images1/image13.jpg",
    "/Images1/image14.jpg",
    "/Images1/image15.jpg",
    "/Images1/image16.jpg",
    "/Images1/image17.jpg",
    "/Images1/image18.jpg",
    "/Images1/image19.jpg",
    "/Images1/image20.jpg",
    "/Images1/image21.jpg",
    "/Images1/image22.jpg",
    "/Images1/image23.jpg",
    "/Images1/image24.jpg",
    "/Images1/image25.jpg",
    "/Images1/image26.jpg",
    "/Images1/image27.jpg",
    "/Images1/image28.jpg",
    "/Images1/image29.jpg",
    "/Images1/image30.jpg",
    "/Images1/image31.jpg",
    "/Images1/image32.jpg",
    "/Images1/image33.jpg",
    "/Images1/image34.jpg",
    "/Images1/image35.jpg",
  ];

  const projectsRef = useRef<HTMLDivElement | null>(null);
const locationsRef = useRef<HTMLDivElement | null>(null);
const imagesRef = useRef<HTMLDivElement[]>([]);


  useEffect(() => {
  const projectsContainer = projectsRef.current;
    const locationsContainer = locationsRef.current;
   const gridImages = gsap.utils.toArray<HTMLElement>(imagesRef.current);

   

   const getRandomImageSet = () => {
    return Array.from({ length: 9 }, () => {
      const index = Math.floor(Math.random() * allImagesPool.length);
      return allImagesPool[index];
    });
  };
const heroIndex = 4; 

  const startImageRotation = () => {
    const totalCycles = 20;

    for (let cycle = 0; cycle < totalCycles; cycle++) {
      const randomImages = getRandomImageSet();

      gsap.to({}, {
        duration: 0,
        delay: cycle * 0.15,
        onComplete: () => {
          let updatedImages = [...randomImages];

        // 🌟 YOUR CONDITION IMPLEMENTED PROPERLY
        if (cycle === totalCycles - 1) {
          updatedImages[heroIndex] = "/Images1/image5.jpg";
        }

        setImages(updatedImages); 
        },
      });
    }
  };
  function init() {
        createAnimationTimeline();
  }
  init();

  function createAnimationTimeline(){
    const overlayTimeline = gsap.timeline();

     overlayTimeline.to(".logo-line", {
      backgroundPosition: "0% 0%",
      color: "#fff",
      duration:1,
      ease:"none",
      delay:0.5,
    

  });
  overlayTimeline.to([".projects-header",".project-item"],{
    opacity:1,
    duration:0.15,
    stagger:0.075,
    delay:1,
  })  

  overlayTimeline.to([".locations-header",".location-item"],{
    opacity:1,
    duration:0.15,
    stagger:0.075,
  },
"<"
);
overlayTimeline.to(imagesRef.current, {
  clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
  duration: 0.6,
  stagger: 0.05,
  onStart: () => {
    startImageRotation();
    gsap.to(".loader", { opacity: 0, duration: 0.3 });
  }
},"<");

overlayTimeline.to(".project-item",{
  color:"#fff",
  duration:0.15,
  stagger:0.075,
})

overlayTimeline.to(".location-item",{
  color:"#fff",
  duration:0.15,
  stagger:0.075,
},"<");
overlayTimeline.to([".project-item"],{
    opacity:0,
    duration:0.15,
    stagger:0.075,
  })
   overlayTimeline.to([".location-item"],{
    opacity:0,
    duration:0.15,
    stagger:0.075,
  },
"<");
overlayTimeline.to(imagesRef.current, {
  clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
  duration: 0.8,
  stagger: 0.03,
  delay:0.4,
   
  ease: "hop"
},"<");
overlayTimeline.to(".overlay", {
  yPercent: -100,
  duration: 1.2,
  ease: "hop"
});

  }
 
}, []);
  return (
    <div >
      <div className='overlay fixed top-0 left-0 w-full h-full flex p-2 bg-black text-white flex gap-2 overflow-hidden'>
      <div className='projects flex-1 flex flex-col gap-2 justify-center pl-10'
      ref={projectsRef}>
        <div className='projects-header flex gap-2 flex-col font-stretch-ultra-condensed opacity-0'>
           {projectsData.map((project, index) => (
        <div
          key={index}
          className="project-item flex-1 flex gap-20 opacity-0 text-sm text-[#4f4f4f]"
        >
          <p className="projectsName">{project.name}</p>
          <p className="directorName ">{project.director}</p>
        </div>
      ))}
        </div>
        
      </div>
      <div className='loader flex-1 flex flex-col gap-2 justify-center align-items-center gap-0'>
        <h1 className='logo-line text-center uppercase font-extrabold text-[3rem] italic leading-[0.9] text-transparent bg-clip-text bg-[linear-gradient(0deg,#3a3a3a,#3a3a3a_50%,#fff_0)] bg-[length:100%_200%] bg-[0%_100%] text-[#3a3a3a]'>MORVILIN</h1>
      </div>
      <div className='locations flex-1 flex flex-col gap-2 justify-center align-items-center pl-10'
      ref={locationsRef}>
        <div className='locations-header flex gap-2 flex-col opacity-0 '>
            {projectsData.map((project, index) => (
        <div
          key={index}
          className="location-item flex-1 flex gap-2 opacity-0 text-[#4f4f4f] font-stretch-ultra-condensed text-sm"
        >
          <p className="locationName">{project.location}</p>
        </div>
      ))}
        </div>
      </div>
    </div>
    <div className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[350px] md:w-[400px] z-[2]'>
        <div className='grid grid-cols-3 gap-2 w-full'>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
                <div 
                    key={index}
                    className={`relative w-full aspect-square overflow-hidden ${index === 4 ? 'hero-img' : ''}`}
                    style={{
                        clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
                        width: '100%',
                        height: '100%'
                    }}
                    ref={(el: HTMLDivElement | null) => {
                        if (el && !imagesRef.current.includes(el)) imagesRef.current.push(el);
                    }}
                >
                    <div className='w-full h-full'>
                        <Image 
                            src={images[index]} 
                            alt={`${index + 1}`} 
                            width={150} 
                            height={150}
                            className='w-full h-full object-cover'
                            priority={index === 4}
                        />
                    </div>
                </div>
            ))}
        </div>

    </div>

<div className="absolute min-h-screen w-screen bg-gray-900 text-white top-0 left-0 z-[-2]">
      {/* 1. Background Video Placeholder (Unchanged) */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="w-full h-full bg-gray-800 opacity-70">
            {/* Your video element goes here */}
        </div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* Header/Navigation */}
        <header className="flex justify-between items-center p-6 md:p-8">
          <Link href="/" className="text-xl font-bold tracking-wider hover:opacity-80 transition duration-150">
            Morvilin.
          </Link>
          <nav className="hidden md:flex space-x-8 text-sm font-medium tracking-widest uppercase">
            {/* 2. Using Link components for navigation */}
            <Link href="/shop" className="hover:opacity-75 transition duration-150">
              Collections
            </Link>
            <Link href="/philosophy" className="hover:opacity-75 transition duration-150">
              About Us
            </Link>
            <Link href="/gallery" className="hover:opacity-75 transition duration-150">
              Wishlist
            </Link>
          </nav>
         <div className='flex items-center bg-white rounded-xl px-4 mx-2 border-none'>
            <input type='text' className='w-[400px] bg-white h-[38px] rounded-full text-black border-none' placeholder='Search your items here...'/>
            <Search size={6} strokeWidth={2} className='text-black cursor-pointer rounded-full h-[30px] w-[30px] ' />
         </div>
          <div className="flex space-x-4">
            <Link href="/account" aria-label="Account" className="p-2 border border-white rounded-full hover:bg-white/10 transition">
              <User size={18} />
            </Link>
            <Link href="/cart" aria-label="Cart" className="p-2 border border-white rounded-full hover:bg-white/10 transition">
              <ShoppingBag size={18} />
            </Link>
          </div>
        </header>

        {/* Main Hero Content */}
        <main className="flex-grow flex flex-col justify-center items-center text-center p-4">
          
          <div className="max-w-4xl mx-auto">
            {/* Main Headline (Unchanged) */}
            <h1 className="text-6xl md:text-8xl font-serif italic font-light leading-tight tracking-tighter">
              <span className="block mb-[-0.5rem] md:mb-[-1rem]">True to Oneself</span>
              <span className="block">kind to Nature</span>
            </h1>

            {/* Sub-text (Unchanged) */}
            <p className="mt-8 text-lg font-light max-w-xl mx-auto">
              Unreservedly honest products that truly work, be kind to skin and the planet - no exceptions!
            </p>
          </div>
          
          {/* Call-to-Action Button */}
          <div className="mt-20">
            {/* 3. Using Link for the primary CTA */}
            <Link 
              href="/shop" // Link to the shop page
              className="flex items-center justify-between bg-white text-gray-900 py-3 px-10 rounded-full text-base font-medium uppercase tracking-widest shadow-xl group transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] w-[750px]"
            >
              <span className="mr-6">Explore All Products</span>
              <div className='p-2 bg-black rounded-full'><ArrowRight 
                size={20} 
                className="transition-transform duration-300  text-white rounded-full group-hover:translate-x-1" 
              /></div>
            </Link>
          </div>

        </main>
        
        {/* Optional: Footer or other elements if needed */}
        <footer>
            {/* You can add a discreet footer here if necessary */}
        </footer>
        
      </div>
    </div>
</div>
  );
};
