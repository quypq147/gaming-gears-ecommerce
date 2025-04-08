import { axiosInstance } from '@/src/lib/axios';

export const fetchCartByUser = async () => {
  const response = await axiosInstance.get('/carts');
  return response.data;
};

export const updateCartOnServer = async (cart) => {
  try {
    await axiosInstance.put(
      '/carts',
      { products: cart },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Gửi token trong header
        },
      }
    );
  } catch (error: any) {
    console.error('Error updating cart:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to update cart');
  }
};
export const createCart = async (cart) => {
  try {
    const response = await axiosInstance.post(
      '/carts',
      { products: cart },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, 
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error('Error creating cart:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to create cart');
  }
};
