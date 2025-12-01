"use client"
import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, User, Menu, X, ChevronRight } from 'lucide-react';

// --- Type Definitions ---

interface NavLink {
  id: string;
  label: string;
  href: string;
  highlight?: boolean;
  children?: NavLink[];
}

// --- Data Structure ---

const NAV_LINKS: NavLink[] = [
  { id: 'new', label: 'COLLECTIONS', href: '/allproducts' },
  { id: 'aboutus', label: 'ABOUT US', href: '/about' },
  {
    id: 'bottoms',
    label: 'BOTTOMS',
    href: '/bottoms',
    children: [
      { id: 'pants', label: 'PANTS', href: '/bottoms/pants' },
      { id: 'jeans', label: 'JEANS', href: '/bottoms/jeans' },
      { id: 'shorts', label: 'SHORTS', href: '/bottoms/shorts' },
      { id: 'jorts', label: 'JORTS', href: '/bottoms/jorts' },
    ]
  },
  { id: 'sale', label: 'BLACK FRIDAY', href: '/sale', highlight: true },
];

// -------------------------------------------------------
// DROPDOWN COMPONENT (Desktop)
// -------------------------------------------------------

const DropdownMenu: React.FC<{ items: NavLink[]; visible: boolean }> = ({ items, visible }) => {
  return (
    <div
      className={`
        absolute left-1/2 -translate-x-1/2 top-full pt-4
        transition-all duration-300 ease-out transform
        ${visible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'}
      `}
    >
      <div className="bg-black/95 backdrop-blur-md border border-gray-800 rounded-sm shadow-2xl p-6 min-w-[200px] space-y-4">
        {items.map((child) => (
          <a
            key={child.id}
            href={child.href}
            className="block text-sm text-gray-400 hover:text-white transition-colors tracking-widest font-medium group flex items-center justify-between"
          >
            {child.label}
            <span className="opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-5px] group-hover:translate-x-0">
               <ChevronRight size={12} />
            </span>
          </a>
        ))}
      </div>
    </div>
  );
};

// -------------------------------------------------------
// MOBILE MENU COMPONENT
// -------------------------------------------------------

const MobileMenu: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <div 
      className={`
        fixed inset-0 bg-black z-50 flex flex-col pt-24 px-8 
        transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        md:hidden
      `}
    >
      <button onClick={onClose} className="absolute top-8 right-6 text-white hover:opacity-70 transition-opacity">
        <X size={32} />
      </button>

      <nav className="flex flex-col space-y-6">
        {NAV_LINKS.map((link) => (
          <div key={link.id} className="border-b border-gray-800 pb-4">
            <a 
              href={link.href} 
              onClick={onClose}
              className={`text-2xl font-serif tracking-widest block mb-2 ${link.highlight ? 'text-purple-400' : 'text-white'}`}
            >
              {link.label}
            </a>
            {link.children && (
              <div className="mt-2 pl-4 flex flex-col space-y-3 border-l border-gray-700 ml-1">
                {link.children.map(child => (
                  <a 
                    key={child.id} 
                    href={child.href}
                    onClick={onClose}
                    className="text-gray-400 hover:text-white text-sm tracking-widest block"
                  >
                    {child.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

// -------------------------------------------------------
// MAIN NAVBAR COMPONENT
// -------------------------------------------------------

const Navbar: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Wrapper handlers for the entire header
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setActiveMenu(null);
  };

  // Determine if we should show the solid black background
  // Show if: Hovered OR Mobile Menu Open
  const showBackground = isHovered || isMobileMenuOpen;

  return (
    <>
      <header 
        className={`
          fixed top-0 left-0 w-full z-40
          flex justify-between items-start 
          px-6 lg:px-12 
          pt-6 pb-4 md:pt-8 md:pb-6
          text-white 
          transition-colors duration-500 ease-in-out
          ${showBackground ? 'bg-black shadow-xl' : 'bg-transparent'}
        `}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* LEFT LOGO */}
        <a
          href="/"
          className="group relative z-20 flex items-center h-10 w-[280px] overflow-hidden"
        >
          {/* The M Icon */}
          <span className="font-serif text-5xl md:text-6xl leading-none z-10 pr-6 drop-shadow-lg relative">
            𝕸
          </span>

          {/* Sliding Text Reveal */}
          <div
            className={`
              absolute pl-[50px] md:pl-[60px] z-0 py-2 
              transition-all duration-500 ease-out
              ${isHovered ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'}
            `}
          >
            <span className="text-2xl md:text-3xl font-bold tracking-[0.2em] whitespace-nowrap font-serif uppercase inline-block text-white">
              ORVILN
            </span>
          </div>
        </a>

        {/* CENTER NAVLINKS (Desktop) */}
        {/* Increased text size and tracking */}
        <nav className="hidden md:flex items-center space-x-10 lg:space-x-16 pt-2">
          {NAV_LINKS.map((link) => (
            <div
              key={link.id}
              className="relative group h-full"
              onMouseEnter={() => setActiveMenu(link.id)}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <a
                href={link.href}
                className={`
                  relative text-sm lg:text-base font-bold tracking-[0.15em] py-4 block transition-colors duration-300
                  ${link.highlight 
                    ? 'bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent' 
                    : 'text-white hover:text-gray-300'
                  }
                `}
              >
                {link.label}
                {!link.highlight && (
                  <span className="absolute bottom-2 left-0 h-[1px] bg-white w-0 group-hover:w-full transition-all duration-300 ease-out" />
                )}
              </a>

              {link.children && (
                 <DropdownMenu
                    items={link.children}
                    visible={activeMenu === link.id}
                  />
              )}
            </div>
          ))}
        </nav>

        {/* RIGHT ICONS */}
        <div className="flex items-center space-x-6 md:space-x-8 pt-2">
          <a href="/profile" className="hidden md:block hover:opacity-70 transition-opacity hover:scale-110 duration-200">
            <User size={26} strokeWidth={1.5} />
          </a>

          <a href="/search" className="hover:opacity-70 transition-opacity hover:scale-110 duration-200">
            <Search size={26} strokeWidth={1.5} />
          </a>

          <a href="/cart" className="relative hover:opacity-70 transition-opacity hover:scale-110 duration-200">
            <ShoppingBag size={26} strokeWidth={1.5} />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-600 rounded-full border border-black"></span>
          </a>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden ml-2 hover:opacity-70 z-50"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={28} strokeWidth={1.5} />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
    </>
  );
};

export default Navbar;