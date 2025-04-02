"use client";

import { useCartStore } from "@/src/store/cartStore";
import Header from "@/src/components/header";
import ProductDetails from "@/src/components/product-details";
import { getVoucher } from "@/src/api/voucher";
import { Button } from "@/src/components/ui/button";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function CartPage() {
  const { cart, removeFromCart, updateCartQuantity } = useCartStore();
  const [couponCode, setCouponCode] = useState("");
  const [vouchers, setVouchers] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [errors, setErrors] = useState([]);

  const router = useRouter();
  // Tính toán tổng tiền với làm tròn để tránh lỗi số thực
  const subtotal = cart.reduce((acc, product) => acc + product.price * product.quantity, 0);
  const salesTax = Math.round(subtotal * 0.1);
  const grandTotal = subtotal + salesTax;

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
          Giỏ Hàng Của Bạn ({cart.length} sản phẩm)
        </motion.h1>

        {cart.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center text-gray-500"
          >
            Không có sản phẩm nào trong giỏ hàng.
          </motion.p>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Phần sản phẩm trong giỏ hàng */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md"
            >
              <div className="space-y-6">
                {cart.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-4"
                  >
                    {/* Chi tiết sản phẩm */}
                    <ProductDetails product={product} />

                    {/* Điều khiển số lượng */}
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateCartQuantity(product.id, Math.max(product.quantity - 1, 1))}
                        disabled={product.quantity === 1}
                      >
                        ➖
                      </Button>
                      <span className="w-8 text-center">{product.quantity}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateCartQuantity(product.id, product.quantity + 1)}
                      >
                        ➕
                      </Button>
                    </div>

                    {/* Xóa sản phẩm */}
                    <Button
                      variant="destructive"
                      size="icon"
                      className="ml-4"
                      onClick={() => removeFromCart(product.id)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Phần tóm tắt đơn hàng */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-6 rounded-lg shadow-md h-fit"
            >
              <h2 className="text-xl font-bold mb-4">Tóm Tắt Đơn Hàng</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Tổng phụ:</span>
                  <span>{subtotal.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</span>
                </div>
                <div className="flex justify-between">
                  <span>Thuế:</span>
                  <span>{salesTax.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tổng cộng:</span>
                  <span className="font-bold text-lg">{grandTotal.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</span>
                </div>
              </div>

              {/* Nhập mã giảm giá */}
              <div className="mt-4">
                <input
                  type="text"
                  placeholder="Nhập mã giảm giá"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <Button className="w-full mt-2" disabled={!couponCode.trim()}>Áp dụng mã giảm giá</Button>
              </div>

              
              {/* Nút thanh toán */}
              <Button
                className="w-full mt-6"
                onClick={() => router.push("/checkout")}
                as={motion.button}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Tiến hành thanh toán
              </Button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}




