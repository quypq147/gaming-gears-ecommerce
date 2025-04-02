import { axiosInstance } from '@/src/lib/axios';

export const fetchWishlistByUser = async () => {
  const response = await axiosInstance.get('/wishlist');
  return response.data;
};

export const updateWishlistOnServer = async (wishlist) => {
    try {
      await axiosInstance.put(
        '/wishlists',
        { products: wishlist },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Gửi token trong header
          },
        }
      );
    } catch (error: any) {
      console.error('Error updating wishlist:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to update wishlist');
    }
  };
  export const createWishlist = async (wishlist) => {
    try {
      const response = await axiosInstance.post(
        '/wishlists',
        { products: wishlist },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Gửi token trong header
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('Error creating cart:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to create cart');
    }
  };
