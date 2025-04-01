"use client";

import { useWishlistCartStore } from "@/store/useWishlistCartStore";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/header";
import placeholderImg from "@/assets/placeholder.png";
import ToastNotification, { showToast } from "@/components/ToastNotification";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, addToCart } = useWishlistCartStore();

  const handleAddToCart = (product: any) => {
    addToCart(product);
    const imageUrl =
      product.image?.length > 0
        ? `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${product.image[0].url}`
        : placeholderImg.src;
    showToast(`${product.name} đã được thêm vào giỏ hàng!`, "success", imageUrl);
  };

  const handleRemoveFromWishlist = (product: any) => {
    removeFromWishlist(product.id);
    const imageUrl =
      product.image?.length > 0
        ? `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${product.image[0].url}`
        : placeholderImg.src;
    showToast(`${product.name} đã được xóa khỏi danh sách yêu thích!`, "error", imageUrl);
  };

  return (
    <>
      <Header />
      <ToastNotification /> {/* ✅ Ensure Toast Notifications are globally available */}
      <div className="container mx-auto p-6">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-center mb-6"
        >
          ❤️ Danh Sách Yêu Thích Của Tôi
        </motion.h1>

        {wishlist.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center text-gray-500"
          >
            Không có sản phẩm nào trong danh sách yêu thích.
          </motion.p>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="overflow-x-auto items-center"
          >
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-4 border">Sản Phẩm</th>
                  <th className="p-4 border">Giá</th>
                  <th className="p-4 border">Tình Trạng</th>
                  <th className="p-4 border">Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {wishlist.map((product) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="border"
                  >
                    {/* ✅ Image & Name */}
                    <td className="p-4 flex items-center space-x-4">
                      <Image
                        src={
                          product.image?.length > 0
                            ? `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${product.image[0].url}`
                            : placeholderImg
                        }
                        alt={product.name}
                        width={50}
                        height={50}
                        className="rounded-md"
                      />
                      <Link href={`/product/${product.slug}`} className="hover:underline">
                        {product.name}
                      </Link>
                    </td>

                    {/* ✅ Price with Discount (if available) */}
                    <td className="p-4">
                      {product.discountPrice ? (
                        <>
                          <span className="text-gray-500 line-through">
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(product.price)}
                          </span>{" "}
                          <span className="text-green-600 font-semibold">
                            {product.discountPrice.toLocaleString("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            })}
                          </span>
                        </>
                      ) : (
                        <span className="font-semibold">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(product.price)}
                        </span>
                      )}
                    </td>

                    {/* ✅ Stock Status */}
                    <td className="p-4 text-green-600">Còn Hàng</td>

                    {/* ✅ Actions: Add to Cart & Remove */}
                    <td className="p-4 flex items-center space-x-4">
                      <Button
                        onClick={() => handleAddToCart(product)}
                        className="bg-teal-600 cursor-pointer text-white px-4 py-2 rounded-md hover:bg-teal-700 transition"
                        as={motion.button}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Thêm vào giỏ hàng
                      </Button>
                      <Button
                        onClick={() => handleRemoveFromWishlist(product)}
                        className="text-red-500 hover:text-red-700 transition cursor-pointer"
                        as={motion.button}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        🗑
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </div>
    </>
  );
}

