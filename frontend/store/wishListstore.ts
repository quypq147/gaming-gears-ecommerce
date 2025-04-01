import { create } from "zustand";

interface Product {
  id: string;
  name: string;
  slug: string;
  brand: { brand_name: string };
  price: number;
  image: { url: string }[];
  quantity?: number;
}

interface WishlistState {
  wishlist: Product[];
  cart: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (id: string) => void;
}

export const useWishlistCartStore = create<WishlistState>((set, get) => ({
  wishlist: [],
  cart: [],

  addToWishlist: (product) => {
    const { wishlist } = get();
    if (!wishlist.some((item) => item.id === product.id)) {
      set({ wishlist: [...wishlist, product] });
    }
  },

  removeFromWishlist: (id) => {
    set((state) => ({
      wishlist: state.wishlist.filter((item) => item.id !== id),
    }));
  },
}));
