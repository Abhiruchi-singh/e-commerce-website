import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { CartItem } from '../types';

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, size?: string, color?: string) => void;
  updateQuantity: (productId: string, quantity: number, size?: string, color?: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | null>(null);

const getKey = (product: string, size?: string, color?: string) =>
  `${product}-${size || ''}-${color || ''}`;

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const stored = localStorage.getItem('ecommerce_cart');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('ecommerce_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (item: CartItem) => {
    setItems((prev) => {
      const idx = prev.findIndex(
        (i) => getKey(i.product, i.size, i.color) === getKey(item.product, item.size, item.color)
      );
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx].quantity = Math.min(updated[idx].quantity + item.quantity, item.stock);
        return updated;
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (productId: string, size?: string, color?: string) => {
    setItems((prev) =>
      prev.filter((i) => getKey(i.product, i.size, i.color) !== getKey(productId, size, color))
    );
  };

  const updateQuantity = (productId: string, quantity: number, size?: string, color?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, size, color);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        getKey(i.product, i.size, i.color) === getKey(productId, size, color)
          ? { ...i, quantity: Math.min(quantity, i.stock) }
          : i
      )
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
