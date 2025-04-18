"use client";

import { useEffect, useState } from "react";
import { fetchOrdersByUser } from "@/src/api/order";
import { useUserStore } from "@/src/store/userStore";
import { Toaster, toast } from "react-hot-toast";
import { motion } from "framer-motion";
import Header from "@/src/components/header";

export default function OrderHistoryPage() {
  const user = useUserStore((state) => state.user);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Lấy danh sách đơn hàng khi component được mount
  useEffect(() => {
    const loadOrders = async () => {
      if (!user) {
        toast.error("Bạn cần đăng nhập để xem lịch sử đơn hàng.");
        return;
      }

      try {
        const userOrders = await fetchOrdersByUser();
        console.log("Fetched orders:", userOrders);
        setOrders(userOrders);
      } catch (error: any) {
        console.error("Error fetching user orders:", error.message);
        toast.error("Không thể tải lịch sử đơn hàng.");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [user]);

  if (!user) {
    return <p className="text-center mt-8">Bạn cần đăng nhập để xem lịch sử đơn hàng.</p>;
  }

  if (loading) {
    return <p className="text-center mt-8">Đang tải lịch sử đơn hàng...</p>;
  }

  if (orders.length === 0) {
    return <p className="text-center mt-8">Bạn chưa có đơn hàng nào.</p>;
  }

  return (
    <>
      <Header />
      <div className="container mx-auto p-6">
        <Toaster position="top-right" />
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-center mb-8 text-blue-800"
        >
          Lịch Sử Đơn Hàng
        </motion.h1>

        <div className="space-y-6">
          {orders.map((order) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg shadow-lg hover:shadow-xl"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-blue-800">
                  Mã đơn hàng: {order.orderCode}
                </h2>
                <span className="text-sm text-gray-500">
                  Ngày đặt: {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                </span>
              </div>
              <p className="text-gray-700 mt-2">
                Trạng thái:{" "}
                <strong className="text-blue-600">{order.state}</strong>
              </p>
              <p className="text-gray-700">
                Tổng tiền:{" "}
                <strong className="text-green-600">
                  {order.totalAmount.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </strong>
              </p>

              <div className="mt-4">
                <h3 className="text-lg font-semibold text-blue-800">Sản phẩm:</h3>
                <ul className="mt-2 space-y-2">
                  {order.orders_details.map((product) => (
                    <motion.li
                      key={product.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      whileHover={{ scale: 1.03 }}
                      transition={{ duration: 0.3 }}
                      className="flex justify-between bg-white p-4 rounded-md shadow-sm hover:shadow-md"
                    >
                      <span className="text-gray-800">
                        {product.product.name}{" "}
                        <span className="text-gray-500">
                          ({product.quantity} ×{" "}
                          {product.price.toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })}
                          )
                        </span>
                      </span>
                      <span className="text-green-600 font-semibold">
                        {(product.quantity * product.price).toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}