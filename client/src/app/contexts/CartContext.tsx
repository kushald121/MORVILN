"use client";

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

// Types
export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
  variantId?: string;
}

export interface FavoriteItem {
  productId: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  stock: number;
}

interface CartState {
  items: CartItem[];
  favorites: FavoriteItem[];
  isLoading: boolean;
  error: string | null;
}

// Actions
type CartAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_TO_CART'; payload: CartItem }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_CART_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'ADD_TO_FAVORITES'; payload: FavoriteItem }
  | { type: 'REMOVE_FROM_FAVORITES'; payload: string }
  | { type: 'LOAD_FROM_STORAGE'; payload: { cart: CartItem[]; favorites: FavoriteItem[] } };

// Initial state
const initialState: CartState = {
  items: [],
  favorites: [],
  isLoading: false,
  error: null,
};

// Reducer
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };

    case 'ADD_TO_CART': {
      const existingItemIndex = state.items.findIndex(
        item => item.id === action.payload.id &&
                item.size === action.payload.size &&
                item.color === action.payload.color
      );

      if (existingItemIndex > -1) {
        // Update quantity if item already exists
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += action.payload.quantity;
        return { ...state, items: updatedItems };
      }

      return { ...state, items: [...state.items, action.payload] };
    }

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };

    case 'UPDATE_CART_QUANTITY': {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => item.id !== id)
        };
      }

      return {
        ...state,
        items: state.items.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      };
    }

    case 'CLEAR_CART':
      return { ...state, items: [] };

    case 'ADD_TO_FAVORITES': {
      const exists = state.favorites.some(item => item.productId === action.payload.productId);
      if (exists) return state;

      return {
        ...state,
        favorites: [...state.favorites, action.payload]
      };
    }

    case 'REMOVE_FROM_FAVORITES':
      return {
        ...state,
        favorites: state.favorites.filter(item => item.productId !== action.payload)
      };

    case 'LOAD_FROM_STORAGE':
      return {
        ...state,
        items: action.payload.cart,
        favorites: action.payload.favorites,
        isLoading: false
      };

    default:
      return state;
  }
};

// Context
interface CartContextType {
  state: CartState;
  addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeFromCart: (id: string) => void;
  updateCartQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  addToFavorites: (item: FavoriteItem) => void;
  removeFromFavorites: (productId: string) => void;
  isInCart: (id: string) => boolean;
  isInFavorites: (productId: string) => boolean;
  getCartTotal: () => number;
  getCartItemCount: () => number;
  // UI controls for cart sidebar
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider component
interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load from localStorage on mount
  useEffect(() => {
    const loadFromStorage = () => {
      try {
        const cartData = localStorage.getItem('morviln-cart');
        const favoritesData = localStorage.getItem('morviln-favorites');

        const cart: CartItem[] = cartData ? JSON.parse(cartData) : [];
        const favorites: FavoriteItem[] = favoritesData ? JSON.parse(favoritesData) : [];

        dispatch({ type: 'LOAD_FROM_STORAGE', payload: { cart, favorites } });
      } catch (error) {
        console.error('Error loading from localStorage:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load saved data' });
      }
    };

    loadFromStorage();
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem('morviln-cart', JSON.stringify(state.items));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [state.items]);

  useEffect(() => {
    try {
      localStorage.setItem('morviln-favorites', JSON.stringify(state.favorites));
    } catch (error) {
      console.error('Error saving favorites to localStorage:', error);
    }
  }, [state.favorites]);

  // Context methods
  const addToCart = (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    const cartItem: CartItem = {
      ...item,
      quantity: item.quantity || 1,
    };

    dispatch({ type: 'ADD_TO_CART', payload: cartItem });
  };

  const removeFromCart = (id: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
  };

  const updateCartQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const addToFavorites = (item: FavoriteItem) => {
    dispatch({ type: 'ADD_TO_FAVORITES', payload: item });
  };

  const removeFromFavorites = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_FAVORITES', payload: productId });
  };

  const isInCart = (id: string): boolean => {
    return state.items.some(item => item.id === id);
  };

  const isInFavorites = (productId: string): boolean => {
    return state.favorites.some(item => item.productId === productId);
  };

  const getCartTotal = (): number => {
    return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemCount = (): number => {
    return state.items.reduce((count, item) => count + item.quantity, 0);
  };

  // UI state for cart sidebar (open/close)
  const [isCartOpen, setIsCartOpen] = React.useState(false);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((v) => !v);

  // Derived cart total
  const cartTotal = getCartTotal();

  const contextValue: CartContextType = {
    state,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    addToFavorites,
    removeFromFavorites,
    isInCart,
    isInFavorites,
    getCartTotal,
    getCartItemCount,
    isCartOpen,
    openCart,
    closeCart,
    toggleCart,
    cartTotal,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
