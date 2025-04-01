import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_STRAPI_BASE_URL;

export const signIn = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}/api/auth/local`, {
    identifier: email,
    password,
  });
  return response.data;
};

export const signUp = async (username: string, email: string, password: string) => {
  const response = await axios.post(`${API_URL}/api/auth/local/register`, {
    username,
    email,
    password,
  });
  return response.data;
};