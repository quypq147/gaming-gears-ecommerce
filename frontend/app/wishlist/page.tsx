"use client";

import { useWishlistCartStore } from "@/app/store/useWishlistCartStore";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/header";
import placeholderImg from "@/assets/placeholder.png";
import ToastNotification, { showToast } from "@/components/ToastNotification";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, addToCart } = useWishlistCartStore();

  const handleAddToCart = (product: any) => {
    addToCart(product);
    const imageUrl =
      product.image?.length > 0
        ? `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${product.image[0].url}`
        : placeholderImg.src;
    showToast(`${product.name} added to cart!`, "success", imageUrl);
  };

  const handleRemoveFromWishlist = (product : any) => {
    removeFromWishlist(product.id);
    const imageUrl =
      product.image?.length > 0
        ? `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${product.image[0].url}`
        : placeholderImg.src;
    showToast(`${product.name} removed from wishlist!`, "error", imageUrl);
  };

  return (
    <>
      <Header />
      <ToastNotification /> {/* ✅ Ensure Toast Notifications are globally available */}
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold text-center mb-6">❤️ My Wishlist</h1>

        {wishlist.length === 0 ? (
          <p className="text-center text-gray-500">No items in wishlist.</p>
        ) : (
          <div className="overflow-x-auto items-center">
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-4 border">Product</th>
                  <th className="p-4 border">Price</th>
                  <th className="p-4 border">Stock</th>
                  <th className="p-4 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {wishlist.map((product) => (
                  <tr key={product.id} className="border">
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
                    <td className="p-4 text-green-600">In Stock</td>

                    {/* ✅ Actions: Add to Cart & Remove */}
                    <td className="p-4 flex items-center space-x-4">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="bg-teal-600 cursor-pointer text-white px-4 py-2 rounded-md hover:bg-teal-700 transition"
                      >
                        Add to cart
                      </button>
                      <button
                        onClick={() => handleRemoveFromWishlist(product)}
                        className="text-red-500 hover:text-red-700 transition cursor-pointer"
                      >
                        🗑
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

