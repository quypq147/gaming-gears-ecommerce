import { axiosInstance } from '@/lib/axios';
import { useUserStore } from '@/store/userStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import { fetchCartByUser, updateCartOnServer } from '@/api/cart';
import { fetchWishlistByUser, updateWishlistOnServer } from '@/api/wishlist';

interface AuthResponse {
  jwt: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
}

// Đăng ký người dùng mới
export const signUp = async (username: string, email: string, password: string): Promise<AuthResponse> => {
  const response = await axiosInstance.post('/auth/local/register', {
    username,
    email,
    password,
  });

  const { jwt, user } = response.data;

  // Lưu JWT vào localStorage và cập nhật trạng thái người dùng
  localStorage.setItem('token', jwt);
  const setUser = useUserStore.getState().setUser;
  setUser({ ...user, jwt });

  return response.data;
};

// Đăng nhập người dùng
export const signIn = async (identifier: string, password: string) => {
  try {
    const response = await axiosInstance.post('/auth/local', {
      identifier,
      password,
    });

    const { jwt, user } = response.data;

    // Lưu JWT vào localStorage và cập nhật trạng thái người dùng
    localStorage.setItem('token', jwt);
    const setUser = useUserStore.getState().setUser;
    setUser({ ...user, jwt });

    // Đồng bộ giỏ hàng và danh sách yêu thích
    await syncUserData();

    return user;
  } catch (error: any) {
    console.error('Error logging in:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to log in');
  }
};

// Đồng bộ dữ liệu giỏ hàng và danh sách yêu thích
const syncUserData = async () => {
  const syncCart = useCartStore.getState().syncCartWithServer;
  const syncWishlist = useWishlistStore.getState().syncWishlistWithServer;

  try {
    // Đồng bộ giỏ hàng
    const serverCart = await fetchCartByUser();
    syncCart(serverCart);

    // Đồng bộ danh sách yêu thích
    const serverWishlist = await fetchWishlistByUser();
    syncWishlist(serverWishlist);
  } catch (error: any) {
    console.error('Error syncing user data:', error.message);
  }
};

// Đăng xuất người dùng
export const logout = () => {
  localStorage.removeItem('token'); // Xóa JWT khỏi localStorage
  const logoutUser = useUserStore.getState().logout;
  const clearCart = useCartStore.getState().clearCart;
  const clearWishlist = useWishlistStore.getState().clearWishlist;

  // Xóa trạng thái người dùng, giỏ hàng và danh sách yêu thích
  logoutUser();
  clearCart();
  clearWishlist();
};