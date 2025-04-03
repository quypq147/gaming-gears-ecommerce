import { axiosInstance } from "@/src/lib/axios";
import { useUserStore } from "@/src/store/userStore";

export const fetchUserById = async (userId: string) => {
  try {
    const token = useUserStore.getState().token;
    const headers: Record<string, string> = {};

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await axiosInstance.get(`/users/${userId}`, { headers });
    console.log("User data:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching user:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch user data");
  }
};
export const updateUser = async (userId : string , userData: any) => {
  try {
    const token = useUserStore.getState().token;
    const headers: Record<string, string> = {};

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await axiosInstance.put(`/users/${userId}`, userData, { headers });
    return response.data;
  } catch (error: any) {
    console.log("Data to update:", userData);
    console.error("Error updating user:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to update user data");
  }
}
export const signIn = async ( email: string, password: string) => {
  try {
    const response = await axiosInstance.post("/auth/local", {
      identifier: email,
      password,
    });
    return response.data;
  } catch (error: any) {
    console.error("Error signing in:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to sign in");
  }
};
export const signUp = async (username: string, email: string, password: string) => {
  try {
    const response = await axiosInstance.post("/auth/local/register", {
      username,
      email,
      password,
    });
    return response.data;
  } catch (error: any) {
    console.error("Error signing up:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to sign up");
  }
};

