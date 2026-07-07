'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
}

export interface ToastType {
  message: string;
  type: 'success' | 'error' | 'warning';
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => boolean;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCartSubtotal: () => number;
  getCartCount: () => number;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (isOpen: boolean) => void;
  toast: ToastType | null;
  showToast: (message: string, type: 'success' | 'error' | 'warning') => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const MAIN_CATEGORIES = ['SOUPS', 'SAUCES & STEWS', 'PASTA DISHES', 'RICES DISHES', 'AVENOOKS SPECIALS', 'BREAKFAST PACKAGES'];
const SECONDARY_CATEGORIES = ['DRINKS & SHAKES', 'PARFAITS', 'ADD-ONS'];

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [toast, setToast] = useState<ToastType | null>(null);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('avenooks_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Error parsing cart from localStorage', e);
      }
    }
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    localStorage.setItem('avenooks_cart', JSON.stringify(cart));
  }, [cart]);

  const showToast = (message: string, type: 'success' | 'error' | 'warning') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    const isSecondary = SECONDARY_CATEGORIES.includes(item.category);
    
    // Check if there is already a main dish in the cart
    const hasMainDish = cart.some(cartItem => !SECONDARY_CATEGORIES.includes(cartItem.category));

    // Rule validation: Cannot add secondary items (drinks, parfaits, add-ons) if no main dish exists in cart
    if (isSecondary && !hasMainDish) {
      showToast('Please add a Main Dish (Rice, Pasta, Soup, Sauce, Specials, or Breakfast) to your cart first!', 'warning');
      return false;
    }

    setCart((prevCart) => {
      const existingItem = prevCart.find((i) => i.id === item.id);
      if (existingItem) {
        return prevCart.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });

    showToast(`"${item.name}" added to cart!`, 'success');
    setIsDrawerOpen(true);
    return true;
  };

  const removeFromCart = (id: string) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((item) => item.id !== id);
      
      // If we removed the last main dish, clean out secondary items as well to maintain the rule?
      // Or just warn the user. Let's keep it simple: if no main dish left, we can alert them or let them manage.
      const hasMainDishLeft = updatedCart.some(cartItem => !SECONDARY_CATEGORIES.includes(cartItem.category));
      if (updatedCart.length > 0 && !hasMainDishLeft) {
        showToast('Note: You have removed all Main Dishes. Please add one to validate your order.', 'warning');
      }
      
      return updatedCart;
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartSubtotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartSubtotal,
        getCartCount,
        isDrawerOpen,
        setIsDrawerOpen,
        toast,
        showToast
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
