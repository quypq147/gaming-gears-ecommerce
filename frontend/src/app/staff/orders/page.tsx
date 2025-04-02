"use client";

import { useEffect, useState } from "react";
import getOrders from "@/app/api/getOrders";
import updateOrder from "@/app/api/updateOrder";
import { Button } from "@/components/ui/button";
import { Select, SelectItem } from "@nextui-org/react";
import { toast } from "react-hot-toast";

export default function StaffOrders() {
  const { user } = useUser();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        const data = await getOrders();
        setOrders(data.data); // Strapi trả về data trong object { data: [...] }
      } catch (error) {
        toast.error("Không thể tải đơn hàng!");
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  // Kiểm tra quyền truy cập
  if (!user || user.publicMetadata.role !== "staff") {
    return (
      <p className="text-center text-red-500 mt-10">
        Bạn không có quyền truy cập trang này.
      </p>
    );
  }

  // Cập nhật phương thức thanh toán hoặc trạng thái đơn hàng
  const handleUpdateOrder = async (orderId: string, updateData: object) => {
    try {
      await updateOrder(orderId, updateData);
      setOrders(
        orders.map((order) =>
          order.id === orderId
            ? { ...order, attributes: { ...order.attributes, ...updateData } }
            : order
        )
      );
      toast.success("Cập nhật thành công!");
    } catch (error) {
      toast.error("Cập nhật thất bại!");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">📦 Quản lý đơn hàng</h1>

      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-4">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="p-2">#</th>
                <th className="p-2">Khách hàng</th>
                <th className="p-2">Địa chỉ</th>
                <th className="p-2">Tổng tiền</th>
                <th className="p-2">Phương thức thanh toán</th>
                <th className="p-2">Sản phẩm</th>
                <th className="p-2">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => {
                const {
                  customerName,
                  address,
                  totalAmount,
                  paymentMethod,
                  products,
                } = order.attributes;

                return (
                  <tr key={order.id} className="border-b">
                    <td className="p-2">{index + 1}</td>
                    <td className="p-2">{customerName}</td>
                    <td className="p-2">{address}</td>
                    <td className="p-2">
                      {totalAmount.toLocaleString("vi-VN")} VND
                    </td>
                    <td className="p-2">
                      <Select
                        defaultValue={paymentMethod}
                        onValueChange={(value) =>
                          handleUpdateOrder(order.id, { paymentMethod: value })
                        }
                      >
                        <SelectItem value="COD">💰 COD</SelectItem>
                        <SelectItem value="Momo">📱 Momo</SelectItem>
                        <SelectItem value="Bank">🏦 Bank Transfer</SelectItem>
                      </Select>
                    </td>
                    <td className="p-2">
                      {products.data.map((product) => (
                        <span key={product.id} className="block">
                          {product.attributes.name} -{" "}
                          {product.attributes.price.toLocaleString("vi-VN")} VND
                        </span>
                      ))}
                    </td>
                    <td className="p-2">
                      <Button
                        onClick={() =>
                          handleUpdateOrder(order.id, { status: "Completed" })
                        }
                      >
                        ✅ Hoàn thành
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
