# Cart Components Guide

## Overview
This guide covers all cart-related components and their usage in the application.

## Components

### 1. CartSidebar
**File:** `client/src/app/components/CartSidebar.tsx`

The main cart sidebar that slides in from the right when the cart icon is clicked.

**Features:**
- Slide-in animation from right
- Full cart item list with images
- Quantity controls (+/-)
- Remove item button
- Cart total calculation
- Checkout button
- Continue shopping button
- Empty cart state
- Backdrop overlay

**Usage:**
```tsx
import CartSidebar from '@/app/components/CartSidebar';

// Already included in Navbar component
// No need to add separately
```

**Controlled by CartContext:**
- Opens when `openCart()` is called
- Closes when `closeCart()` is called
- Toggle with `toggleCart()`

---

### 2. AddToCartButton
**File:** `client/src/app/components/AddToCartButton.tsx`

A reusable button component for adding products to cart with visual feedback.

**Features:**
- Loading state while adding
- Success state (green checkmark)
- "In Cart" state for already added items
- Automatically opens cart sidebar after adding (optional)
- Smooth animations

**Props:**
```tsx
interface AddToCartButtonProps {
  productId: string;           // Required: Product ID
  productName: string;          // Required: Product name
  productPrice: number;         // Required: Product price
  productImage: string;         // Required: Product image URL
  selectedSize?: string;        // Optional: Selected size (default: 'M')
  selectedColor?: string;       // Optional: Selected color (default: 'Default')
  className?: string;           // Optional: Additional CSS classes
  openCartAfterAdd?: boolean;   // Optional: Open cart after adding (default: true)
}
```

**Usage Example:**
```tsx
import AddToCartButton from '@/app/components/AddToCartButton';

function ProductCard({ product }) {
  return (
    <div>
      <h3>{product.name}</h3>
      <AddToCartButton
        productId={product.id}
        productName={product.name}
        productPrice={product.base_price}
        productImage={product.image}
        selectedSize="L"
        selectedColor="Blue"
        openCartAfterAdd={true}
      />
    </div>
  );
}
```

---

### 3. MiniCartPreview
**File:** `client/src/app/components/MiniCartPreview.tsx`

A compact cart preview component that shows item count and total.

**Features:**
- Shows item count badge
- Displays cart total
- Clicking opens full cart sidebar
- Auto-hides when cart is empty
- Smooth animations

**Props:**
```tsx
interface MiniCartPreviewProps {
  className?: string;  // Optional: Additional CSS classes
}
```

**Usage Example:**
```tsx
import MiniCartPreview from '@/app/components/MiniCartPreview';

function CheckoutPage() {
  return (
    <div>
      <h1>Checkout</h1>
      {/* Shows mini cart preview in corner */}
      <MiniCartPreview className="fixed bottom-4 right-4" />
    </div>
  );
}
```

---

### 4. Updated Navbar
**File:** `client/src/app/components/Navbar.tsx`

The main navigation bar with integrated cart functionality.

**Cart Features:**
- Cart icon button (not a link)
- Item count badge
- Opens cart sidebar on click
- Real-time count updates

**Changes Made:**
- Changed cart icon from `<a href="/cart">` to `<button onClick={toggleCart}>`
- Added item count badge with number
- Integrated CartSidebar component
- Uses CartContext for state management

---

## CartContext API

### State
```tsx
const { state } = useCart();
// state.items: CartItem[]
// state.favorites: FavoriteItem[]
// state.isLoading: boolean
// state.error: string | null
```

### Cart Methods
```tsx
const {
  addToCart,           // Add item to cart
  removeFromCart,      // Remove item from cart
  updateCartQuantity,  // Update item quantity
  clearCart,           // Clear entire cart
  isInCart,            // Check if item is in cart
  getCartTotal,        // Get total price
  getCartItemCount,    // Get total item count
} = useCart();
```

### Sidebar Control Methods
```tsx
const {
  isCartOpen,    // Boolean: Is cart sidebar open?
  openCart,      // Function: Open cart sidebar
  closeCart,     // Function: Close cart sidebar
  toggleCart,    // Function: Toggle cart sidebar
} = useCart();
```

### Favorites Methods
```tsx
const {
  addToFavorites,      // Add item to favorites
  removeFromFavorites, // Remove item from favorites
  isInFavorites,       // Check if item is in favorites
} = useCart();
```

---

## Usage Examples

### Example 1: Product Page with Add to Cart
```tsx
"use client";
import { useState } from 'react';
import { useCart } from '@/app/contexts/CartContext';
import AddToCartButton from '@/app/components/AddToCartButton';

export default function ProductPage({ product }) {
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Black');

  return (
    <div>
      <h1>{product.name}</h1>
      <p>₹{product.price}</p>
      
      {/* Size selector */}
      <select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)}>
        <option value="S">Small</option>
        <option value="M">Medium</option>
        <option value="L">Large</option>
      </select>

      {/* Add to cart button */}
      <AddToCartButton
        productId={product.id}
        productName={product.name}
        productPrice={product.price}
        productImage={product.image}
        selectedSize={selectedSize}
        selectedColor={selectedColor}
      />
    </div>
  );
}
```

### Example 2: Custom Add to Cart with Manual Control
```tsx
"use client";
import { useCart } from '@/app/contexts/CartContext';

export default function CustomProductCard({ product }) {
  const { addToCart, openCart } = useCart();

  const handleQuickAdd = () => {
    // Add to cart
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: 'M',
      color: 'Default',
    });

    // Open cart sidebar after 300ms
    setTimeout(() => {
      openCart();
    }, 300);
  };

  return (
    <div>
      <h3>{product.name}</h3>
      <button onClick={handleQuickAdd}>
        Quick Add to Cart
      </button>
    </div>
  );
}
```

### Example 3: Checkout Page with Mini Cart
```tsx
"use client";
import MiniCartPreview from '@/app/components/MiniCartPreview';
import { useCart } from '@/app/contexts/CartContext';

export default function CheckoutPage() {
  const { state, getCartTotal } = useCart();

  return (
    <div>
      <h1>Checkout</h1>
      
      {/* Show mini cart in corner */}
      <MiniCartPreview className="fixed bottom-4 right-4 z-40" />

      {/* Checkout form */}
      <div>
        <h2>Order Summary</h2>
        {state.items.map(item => (
          <div key={item.id}>
            {item.name} - ₹{item.price} x {item.quantity}
          </div>
        ))}
        <p>Total: ₹{getCartTotal()}</p>
      </div>
    </div>
  );
}
```

### Example 4: Opening Cart from Anywhere
```tsx
"use client";
import { useCart } from '@/app/contexts/CartContext';

export default function SuccessMessage() {
  const { openCart } = useCart();

  return (
    <div>
      <h2>Item Added Successfully!</h2>
      <button onClick={openCart}>
        View Cart
      </button>
    </div>
  );
}
```

---

## Styling

All components use Tailwind CSS with theme variables:

- `bg-background` - Main background
- `bg-card` - Card background
- `bg-primary` - Primary color
- `text-foreground` - Main text color
- `text-muted-foreground` - Muted text
- `border-border` - Border color

Components are fully responsive and support light/dark themes.

---

## Best Practices

1. **Always use AddToCartButton** for consistent UX
2. **Open cart after adding** to show immediate feedback
3. **Use MiniCartPreview** on checkout/payment pages
4. **Check isInCart()** before showing "Add to Cart" vs "In Cart"
5. **Handle loading states** when adding items
6. **Show success feedback** after adding to cart
7. **Validate size/color** before adding to cart
8. **Use CartContext** for all cart operations

---

## Testing Checklist

- [ ] Cart icon shows correct item count
- [ ] Clicking cart icon opens sidebar
- [ ] Adding item updates count immediately
- [ ] Quantity controls work correctly
- [ ] Remove item works
- [ ] Cart total calculates correctly
- [ ] Checkout button navigates properly
- [ ] Continue shopping closes sidebar
- [ ] Clicking backdrop closes sidebar
- [ ] Empty cart shows proper message
- [ ] Cart persists on page reload
- [ ] Mobile responsive design works
- [ ] Animations are smooth
- [ ] No console errors

---

## Troubleshooting

### Cart not opening?
- Ensure CartProvider wraps your app
- Check if CartSidebar is included in layout
- Verify CartContext is imported correctly

### Item count not updating?
- Check if addToCart is being called
- Verify localStorage is working
- Check browser console for errors

### Styling issues?
- Ensure Tailwind CSS is configured
- Check theme variables are defined
- Verify z-index values don't conflict

---

## Future Enhancements

- [ ] Add cart animations for item additions
- [ ] Implement cart sync with backend API
- [ ] Add product recommendations in cart
- [ ] Show estimated delivery time
- [ ] Add promo code functionality
- [ ] Implement saved carts
- [ ] Add cart sharing feature
- [ ] Show low stock warnings
- [ ] Add gift wrapping options
- [ ] Implement cart abandonment recovery
