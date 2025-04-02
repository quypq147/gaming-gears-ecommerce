import {axiosInstance } from '@/src/lib/axios';

/**
 * Fetch all brands from the API.
 * @returns {Promise<any>} The list of brands.
 */
export const fetchBrands = async () => {
  try {
    const response = await axiosInstance.get('/brands', {
      params: {
        populate: '*', // Include all related data
      },
    });
    console.log('Fetched brands:', response.data); // Log the fetched brands
    return response.data.data;
  } catch (error) {
    console.error('Error fetching brands:', error);
    throw error;
  }
};