"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function OrderSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/");
    }, 5000); // Chuyển hướng sau 5 giây

    return () => clearTimeout(timer); // Xóa timer khi component bị unmount
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex flex-col justify-center items-center bg-gray-100 p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 rounded-lg shadow-lg text-center"
        >
          <h1 className="text-3xl font-bold text-green-600 mb-4">
            🎉 Đặt hàng thành công!
          </h1>
          <p className="text-gray-700 mb-6">
            Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đã được xử lý thành công.
          </p>
          <p className="text-gray-700 mb-6">
            Bạn sẽ được chuyển hướng về trang chủ sau vài giây...
          </p>
          <Button onClick={() => router.push("/")}>Quay lại trang chủ</Button>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}