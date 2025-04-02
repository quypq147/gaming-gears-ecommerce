"use client";

import { useCartStore } from "@/src/store/cartStore";
import Header from "@/src/components/header";
import { Button } from "@/src/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { createOrder } from "@/src/api/order";

export default function CheckoutPage() {
  const { cart, clearCart } = useCartStore();
  const router = useRouter();

  // Trạng thái của form thanh toán
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone_number, setPhonenumber] = useState("");
  const [email, setEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Tính toán tổng tiền
  const subtotal = cart.reduce((acc, product) => acc + product.price * product.quantity, 0);
  const salesTax = Math.round(subtotal * 0.1);
  const grandTotal = subtotal + salesTax;

  // Tạo mã đơn hàng
  const generateOrderCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  // Xử lý gửi đơn hàng
  const handleOrderSubmit = async () => {
    if (!name || !address) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    setIsSubmitting(true);

    const orderData = {
      orderCode: generateOrderCode(),
      customerName: name,
      address,
      phone_number,
      email,
      paymentMethod,
      totalAmount: grandTotal,
      products: cart.map((product) => ({
        id: product.id,
        quantity: product.quantity,
        price: product.price,
      })),
    };

    try {
      const response = await createOrder(orderData);
      console.log("Order created successfully:", response);

      alert("Đặt hàng thành công!");
      clearCart();
      router.push("/order-success");
    } catch (error: any) {
      console.error("Error creating order:", error.message);
      alert("Lỗi khi đặt hàng. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto p-6">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-center mb-8"
        >
          Thanh Toán
        </motion.h1>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Phần tóm tắt đơn hàng */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <h2 className="text-xl font-bold mb-4">Tổng Giỏ Hàng</h2>

            {/* Chi tiết giỏ hàng */}
            <div className="space-y-2 border-b pb-4">
              {cart.map((product) => (
                <div key={product.id} className="flex justify-between">
                  <span>
                    {product.name} ({product.quantity} × {product.price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })})
                  </span>
                  <span className="font-medium">
                    {(product.quantity * product.price).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                  </span>
                </div>
              ))}
            </div>

            {/* Tổng tiền */}
            <div className="space-y-2 mt-4">
              <div className="flex justify-between">
                <span>Tổng phụ:</span>
                <span>{subtotal.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</span>
              </div>
              <div className="flex justify-between">
                <span>Thuế:</span>
                <span>{salesTax.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-lg">Tổng cộng:</span>
                <span className="font-bold text-lg">{grandTotal.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</span>
              </div>
            </div>
          </motion.div>

          {/* Form thanh toán */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <h2 className="text-xl font-bold mb-4">Thông Tin Thanh Toán & Giao Hàng</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Họ và tên</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-md focus:outline-none"
                placeholder="Nhập họ và tên của bạn"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-md focus:outline-none"
                placeholder="Nhập Số điện thoại của bạn"
                value={phone_number}
                onChange={(e) => setPhonenumber(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 border rounded-md focus:outline-none"
                placeholder="Nhập email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Địa chỉ giao hàng</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-md focus:outline-none"
                placeholder="Nhập địa chỉ của bạn"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Phương thức thanh toán</label>
              <select
                className="w-full px-4 py-2 border rounded-md"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="cod">Thanh toán khi nhận hàng (COD)</option>
                <option value="credit_card">Thẻ tín dụng</option>
                <option value="paypal">PayPal</option>
              </select>
            </div>

            {/* Nút đặt hàng */}
            <Button className="w-full" onClick={handleOrderSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Đang xử lý..." : "Đặt hàng"}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}


