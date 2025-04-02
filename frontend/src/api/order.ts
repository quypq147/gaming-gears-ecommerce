import { axiosInstance } from "@/src/lib/axios";

// Tạo hóa đơn mới
export const createOrder = async (orderData: {
  products: any[];
  totalAmount: number;
  customerName: string;
  address: string;
  paymentMethod: string;
  phone_number: string;
  orderCode: string;
}) => {
  console.log("Order Data:", orderData);
  try {
    const token = localStorage.getItem("token"); // Lấy token từ localStorage nếu có
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`; // Thêm token vào header nếu có
    }

    const response = await axiosInstance.post(
      "/orders",
      orderData,
      {
        headers,
      }
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error creating order:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Failed to create order");
  }
};

// Lấy lịch sử đơn hàng của người dùng đã đăng nhập
export const fetchOrdersByUser = async () => {
  try {
    const response = await axiosInstance.get("/orders", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Gửi token trong header
      },
    });
    console.log("Fetched orders:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching orders:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Failed to fetch orders");
  }
};

