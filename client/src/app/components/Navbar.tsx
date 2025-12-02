"use client"
import React, { useState, useEffect, useRef } from 'react';
import { Search, ShoppingBag, User, Menu, X, ChevronRight, LogOut } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import CartSidebar from './CartSidebar';
import { ProductService, Product } from '../services/productService';

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
// USER MENU COMPONENT (Desktop)
// -------------------------------------------------------

const UserMenu: React.FC<{
  isAuthenticated: boolean;
  user: any;
  onLogout: () => void;
  router: any;
}> = ({ isAuthenticated, user, onLogout, router }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isAuthenticated) {
    return (
      <a
        href="/login"
        className="hidden md:block hover:opacity-70 transition-opacity hover:scale-110 duration-200"
        aria-label="Login"
      >
        <User size={26} strokeWidth={1.5} />
      </a>
    );
  }

  return (
    <div className="relative hidden md:block" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:opacity-70 transition-opacity hover:scale-105 duration-200"
      >
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-[26px] h-[26px] rounded-full object-cover border border-gray-600"
          />
        ) : (
          <User size={26} strokeWidth={1.5} />
        )}
      </button>

      {/* Dropdown */}
      <div
        className={`
          absolute right-0 top-full pt-4 w-48
          transition-all duration-200 ease-out transform origin-top-right
          ${isOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'}
        `}
      >
        <div className="bg-black/95 backdrop-blur-md border border-gray-800 rounded-sm shadow-2xl py-2">
          <div className="px-4 py-3 border-b border-gray-800">
            <p className="text-sm text-white font-medium truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>

          <a
            href="/profile"
            className="block px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
          >
            My Profile
          </a>

          <button
            onClick={() => {
              onLogout();
              setIsOpen(false);
            }}
            className="w-full text-left px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-white/5 transition-colors flex items-center gap-2"
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------
// MOBILE MENU COMPONENT
// -------------------------------------------------------

const MobileMenu: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
  user: any;
  onLogout: () => void;
}> = ({ isOpen, onClose, isAuthenticated, user, onLogout }) => {
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
        {/* Auth Section for Mobile */}
        <div className="border-b border-gray-800 pb-6 mb-2">
          {isAuthenticated ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover border border-gray-600"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                    <User size={20} />
                  </div>
                )}
                <div>
                  <p className="text-white font-medium">{user?.name}</p>
                  <p className="text-xs text-gray-400">{user?.email}</p>
                </div>
              </div>
              <a
                href="/profile"
                onClick={onClose}
                className="block text-sm text-gray-300 hover:text-white tracking-widest"
              >
                MY PROFILE
              </a>
              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 tracking-widest"
              >
                <LogOut size={14} />
                LOGOUT
              </button>
            </div>
          ) : (
            <a
              href="/login"
              onClick={onClose}
              className="flex items-center gap-2 text-xl font-serif tracking-widest text-white"
            >
              <User size={24} />
              LOGIN / SIGNUP
            </a>
          )}
        </div>

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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const router = useRouter();
  const pathname = usePathname();
  const { toggleCart, getCartItemCount } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const cartItemCount = getCartItemCount();

  // Wrapper handlers for the entire header
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setActiveMenu(null);
  };

  // Detect if we're on the hero/home page
  const isHomePage = pathname === "/";

  // Determine if we should show the solid black background
  // Home page: always transparent (over hero), solid only when mobile menu is open
  // Other pages: always solid for stability and readability
  const showBackground = !isHomePage || isMobileMenuOpen;

  // Search handler with debounce-like behavior (simple)
  useEffect(() => {
    if (!isSearchOpen || searchQuery.trim().length < 2) {
      setSearchResults([]);
      setSearchError(null);
      return;
    }

    let cancelled = false;

    const performSearch = async () => {
      try {
        setIsSearching(true);
        setSearchError(null);
        const results = await ProductService.searchProducts(searchQuery.trim(), 8);
        if (!cancelled) {
          setSearchResults(results);
        }
      } catch (err: any) {
        if (!cancelled) {
          setSearchError(err.message || "Failed to search products");
          setSearchResults([]);
        }
      } finally {
        if (!cancelled) {
          setIsSearching(false);
        }
      }
    };

    const timeoutId = setTimeout(performSearch, 250);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [isSearchOpen, searchQuery]);

  return (
    <>
      <header
        className={`
          fixed top-0 left-0 w-full z-40 relative
          flex items-center justify-start
          px-6 lg:px-12 
          pt-6 pb-4 md:pt-8 md:pb-6
          text-white 
          transition-colors duration-500 ease-in-out
          ${showBackground
            ? 'bg-black/95 shadow-xl'
            : 'bg-transparent'
          }
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
        {/* Slightly larger text, aligned closer to the logo */}
        <nav className="hidden md:flex items-center space-x-8 lg:space-x-12 pt-1 ml-6">
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
        <div className="ml-auto flex items-center space-x-6 md:space-x-8 pt-2">

          {/* User Menu (Desktop) */}
          <UserMenu
            isAuthenticated={isAuthenticated}
            user={user}
            onLogout={logout}
            router={router}
          />

          <button
            type="button"
            onClick={() => setIsSearchOpen((prev) => !prev)}
            className="hover:opacity-70 transition-opacity hover:scale-110 duration-200"
            aria-label="Search products"
          >
            <Search size={26} strokeWidth={1.5} />
          </button>

          <button
            onClick={toggleCart}
            className="relative hover:opacity-70 transition-opacity hover:scale-110 duration-200"
            aria-label="Open shopping cart"
          >
            <ShoppingBag size={26} strokeWidth={1.5} />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-red-600 rounded-full border border-black flex items-center justify-center px-1">
                <span className="text-white text-xs font-bold">{cartItemCount}</span>
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden ml-2 hover:opacity-70 z-50"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={28} strokeWidth={1.5} />
          </button>
        </div>

        {/* Search bar overlay attached to navbar */}
        {isSearchOpen && (
          <div className="absolute left-0 top-full w-full z-30 bg-black/95 border-b border-gray-800">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-4 flex items-center gap-4">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                autoFocus
                placeholder="SEARCH FOR..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm tracking-[0.25em] uppercase text-white placeholder:text-gray-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-gray-400 hover:text-white text-sm tracking-[0.25em] uppercase"
                >
                  X
                </button>
              )}
            </div>

            {/* Suggestions dropdown */}
            {(searchQuery.trim().length >= 2 || isSearching || searchError) && (
              <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pb-4">
                <div className="border-t border-gray-800 pt-3">
                  {isSearching && (
                    <p className="text-xs text-gray-500 tracking-[0.2em] uppercase">Searching...</p>
                  )}
                  {searchError && (
                    <p className="text-xs text-red-500 tracking-[0.2em] uppercase">{searchError}</p>
                  )}
                  {!isSearching && !searchError && searchResults.length === 0 && searchQuery.trim().length >= 2 && (
                    <p className="text-xs text-gray-500 tracking-[0.2em] uppercase">No products found</p>
                  )}
                  {!isSearching && searchResults.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2 pb-3">
                      {searchResults.map((product) => (
                        <button
                          key={product.id}
                          type="button"
                          onClick={() => {
                            setIsSearchOpen(false);
                            setSearchQuery("");
                            router.push(`/productpage?id=${product.id}`);
                          }}
                          className="flex flex-col items-start text-left hover:bg-gray-900/60 px-3 py-2 transition-colors"
                        >
                          <span className="text-xs text-gray-400 tracking-[0.25em] uppercase">
                            Product
                          </span>
                          <span className="text-sm text-white tracking-[0.12em] uppercase line-clamp-1">
                            {product.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Mobile Menu Overlay */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        isAuthenticated={isAuthenticated}
        user={user}
        onLogout={logout}
      />

      {/* Cart Sidebar */}
      <CartSidebar />
    </>
  );
};

export default Navbar;