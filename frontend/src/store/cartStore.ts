import { create } from "zustand";

interface Product {
  id: string;
  name: string;
  slug: string;
  brand: { brand_name: string };
  price: number;
  image: { url: string }[];
  stock: number;
  quantity?: number;
}

interface CartState {
  cart: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  updateCartQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: [],

  addToCart: (product) => {
    const { cart } = get();
    const existingProduct = cart.find((item) => item.id === product.id);
    if (existingProduct) {
      // Kiểm tra nếu số lượng hiện tại + 1 vượt quá tồn kho
      if (existingProduct.quantity + 1 > product.stock) {
        alert("Sản phẩm đã hết hàng!");
        return;
      }

      // Cập nhật số lượng sản phẩm trong giỏ hàng
      set({
        cart: cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      });
    } else {
      // Kiểm tra nếu sản phẩm còn tồn kho
      if (product.stock <= 0) {
        alert("Sản phẩm đã hết hàng!");
        return;
      }
      set({ cart: [...cart, { ...product, quantity: 1 }] });
    }
  },

  removeFromCart: (id) => {
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== id),
    }));
  },

  updateCartQuantity: (id, quantity) => {
    if (quantity < 1) return; // Ngăn số lượng âm
    set((state) => ({
      cart: state.cart.map((item) =>
        item.id === id ? { ...item, quantity } : item
      ),
    }));
  },

  clearCart: () => set({ cart: [] }),
}));