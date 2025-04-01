import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_STRAPI_BASE_URL;

export const getVoucher = async () => {
  const response = await axios.post(`${API_URL}/api/`, {
   
  });
  return response.data;
};