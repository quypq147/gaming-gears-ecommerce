import { create } from "zustand";
import { fetchUserById } from "@/src/api/user";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string;
  gender?: string;
  phone?: string;
  address?: string;
  brithdate?: string;
}

interface UserState {
  user: User | null;
  loading: boolean;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  fetchUser: (userId: string) => Promise<void>;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  loading: false,
  token: null,
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  fetchUser: async (userId: string) => {
    set({ loading: true });
    try {
      const user = await fetchUserById(userId);
      set({ user, loading: false });
    } catch (error) {
      console.error("Error fetching user:", error);
      set({ user: null, loading: false });
    }
  },
  logout: () => set({ user: null, token: null}),
}));
