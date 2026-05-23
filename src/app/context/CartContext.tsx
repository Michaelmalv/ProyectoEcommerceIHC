import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  size: string;
  color: string;
  gender: "hombre" | "mujer" | "unisex";
  stock: number;
  image: string;
  images?: string[];
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, size: string, quantity: number) => void;
  removeFromCart: (id: number, size: string) => void;
  updateQuantity: (id: number, size: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "crowstore-cart";

function loadCartItemsFromStorage(): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  const savedCart = window.localStorage.getItem(CART_STORAGE_KEY);
  if (!savedCart) {
    return [];
  }

  try {
    const parsedCart = JSON.parse(savedCart);
    if (!Array.isArray(parsedCart)) {
      return [];
    }

    return parsedCart.filter((item) => {
      return (
        item &&
        typeof item.id === "number" &&
        typeof item.name === "string" &&
        typeof item.price === "number" &&
        typeof item.quantity === "number" &&
        typeof item.selectedSize === "string"
      );
    });
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>(loadCartItemsFromStorage);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: Product, size: string, quantity: number) => {
    setCartItems((prev) => {
      const existingItem = prev.find(
        (item) => item.id === product.id && item.selectedSize === size
      );

      if (existingItem) {
        const newQuantity = Math.min(
          existingItem.quantity + quantity,
          product.stock
        );
        return prev.map((item) =>
          item.id === product.id && item.selectedSize === size
            ? { ...item, quantity: newQuantity }
            : item
        );
      }

      const newQuantity = Math.min(quantity, product.stock);
      return [...prev, { ...product, selectedSize: size, quantity: newQuantity }];
    });
  };

  const removeFromCart = (id: number, size: string) => {
    setCartItems((prev) =>
      prev.filter((item) => !(item.id === id && item.selectedSize === size))
    );
  };

  const updateQuantity = (id: number, size: string, quantity: number) => {
    if (quantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === id && item.selectedSize === size) {
          const maxQuantity = item.stock || 1;
          const validQuantity = Math.min(quantity, maxQuantity);
          return { ...item, quantity: validQuantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de CartProvider");
  }
  return context;
}
