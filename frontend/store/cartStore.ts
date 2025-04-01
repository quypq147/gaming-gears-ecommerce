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

interface cartState {
    cart: [],
    addToCart: (product: Product) => void;
    removeFromCart: (id: string) => void;
    updateCartQuantity: (id: string, quantity: number) => void;
}

export const useCartStore = create<cartState>((set, get) => ({
    cart: [],
  
    addToCart: (product) => {
        const { cart } = get();
        const existingProduct = cart.find((item) => item.id === product.id);
    
        if (existingProduct) {
          set({
            cart: cart.map((item) =>
              item.id === product.id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
            ),
          });
        } else {
          set({ cart: [...cart, { ...product, quantity: 1 }] });
        }
      },
  
    removeFromCart: (id) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== id),
        }));
      },

    updateCartQuantity: (id, quantity) => {
        if (quantity < 1) return; // Prevent negative quantity
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        }));
    }
  }));