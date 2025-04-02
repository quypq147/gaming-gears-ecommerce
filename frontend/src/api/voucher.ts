import { axiosInstance } from "@/src/lib/axios";


export const getVoucher = async () => {
  const response = await axiosInstance.get("/vouchers");
  return response.data;
};
