import { create } from "zustand";
import { getSession } from "next-auth/react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  image?:string;
}

interface UserState {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  fetchUser: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user }),
  fetchUser: async () => {
    set({ loading: true });
    const session = await getSession();
    if (session?.user) {
      set({
        user: {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          role: session.user.role,
          image: session.user.image,
        },
        loading: false,
      });
    } else {
      set({ user: null, loading: false });
    }
  },
}));
