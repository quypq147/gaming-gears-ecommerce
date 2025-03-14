"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface Product {
  id: string;
  name: string;
  slug: string;
  brand: { brand_name: string };
  price: number;
  image: { url: string }[];
}

interface WishlistCartContextProps {
  wishlist: Product[];
  cart: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (id: string) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
}

const WishlistCartContext = createContext<WishlistCartContextProps | undefined>(
  undefined
);

export function WishlistCartProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [cart, setCart] = useState<Product[]>([]);

  const addToWishlist = (product: Product) => {
    setWishlist((prev) => [...prev, product]);
  };

  const removeFromWishlist = (id: string) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  };

  const addToCart = (product: Product) => {
    setCart((prev) => [...prev, product]);
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <WishlistCartContext.Provider
      value={{ wishlist, cart, addToWishlist, removeFromWishlist, addToCart, removeFromCart }}
    >
      {children}
    </WishlistCartContext.Provider>
  );
}

export function useWishlistCart() {
  const context = useContext(WishlistCartContext);
  if (!context) {
    throw new Error("useWishlistCart must be used within WishlistCartProvider");
  }
  return context;
}

