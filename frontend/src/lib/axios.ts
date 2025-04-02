import axios from 'axios';

const apiURL = process.env.NEXT_PUBLIC_STRAPI_BASE_URL
  ? `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api`
  : 'http://localhost:1337/api'; // Fallback URL for development

export const axiosInstance = axios.create({
  baseURL: apiURL,
});