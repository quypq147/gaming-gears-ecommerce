"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Toaster, toast } from "react-hot-toast";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useUserStore } from "@/src/store/userStore";
import { useCartStore } from "@/src/store/cartStore";
import { useWishlistStore } from "@/src/store/wishListstore";
import { fetchReviews, submitReview } from "@/src/api/review";
import placeholderImg from "@/src/assets/placeholder.png";
import Header from "./header";


export default function ProductClient({ product }: { product: any }) {

  const router = useRouter();
  const { addToCart } = useCartStore();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlistStore();
  const [reviews, setReviews] = useState<any[]>([]);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const user = useUserStore((state) => state.user);

  const imageUrl =
    product?.image && product?.image.length > 0
      ? `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${product.image[0].url}`
      : placeholderImg;

  // Lấy danh sách đánh giá
  useEffect(() => {
    const loadReviews = async () => {
      try {
        const fetchedReviews = await fetchReviews(product.id);
        console.log("Reviews in Component:", fetchedReviews);
        setReviews(fetchedReviews);
      } catch (error: any) {
        console.error("Error fetching reviews:", error.message);
      } finally {
        setLoadingReviews(false); // Kết thúc trạng thái tải
      }
    };

    loadReviews();
  }, [product.id]);

  // Xử lý thêm vào giỏ hàng
  const handleAddToCart = () => {
    addToCart(product);
    toast.success("Đã thêm vào giỏ hàng");
  };

  // Xử lý thêm/xóa khỏi Wishlist
  const isWishlisted = wishlist.some((item) => item.id === product.id);
  const toggleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
      toast("Đã gỡ bỏ khỏi Wishlist", { icon: "❌" });
    } else {
      addToWishlist(product);
      toast.success("Đã thêm vào Wishlist");
    }
  };

  
  // Xử lý gửi bình luận
  const handleSubmitReview = async () => {
    if (!user) {
      toast.error("Bạn cần đăng nhập để bình luận.");
      return;
    }

    if (!comment.trim()) {
      toast.error("Vui lòng nhập nội dung bình luận.");
      return;
    }

    if (rating < 1 || rating > 5) {
      toast.error("Vui lòng chọn số sao từ 1 đến 5.");
      return;
    }

    try {
      const newReview = await submitReview(product.id, {
        review: comment,
        rating,
      });
      setReviews([...reviews, newReview]); // Thêm bình luận mới vào danh sách
      setComment("");
      setRating(5);
      toast.success("Bình luận đã được gửi!");
    } catch (error: any) {
      console.error("Lỗi khi gửi bình luận:", error.message);
      toast.error(error.message || "Không thể gửi bình luận.");
    }
  };

  return (
    <>
      <Header />
      <Toaster position="top-right" />
      <main className="container min-h-screen p-6">
        {/* Thông tin sản phẩm */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="relative w-full"
          >
            <Image
              src={imageUrl}
              alt={product.name}
              width={500}
              height={500}
              className="rounded-lg object-cover shadow-md"
              priority
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col"
          >
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <div className="mt-4 flex gap-4 items-center">
              <Button
                onClick={handleAddToCart}
                className="flex items-center gap-2"
                as={motion.button}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ShoppingCart size={20} />
                Thêm vào giỏ hàng
              </Button>
              <Button
                onClick={toggleWishlist}
                className={`flex items-center gap-2 ${
                  isWishlisted ? "text-red-500" : ""
                }`}
                as={motion.button}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Heart size={20} fill={isWishlisted ? "red" : "none"} />
                {isWishlisted ? "Đã yêu thích" : "Yêu thích"}
              </Button>
            </div>
            <p className="text-lg font-bold text-gray-800 mt-4">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(product.price)}
            </p>
            <div className="text-gray-700 mt-2 space-y-4">
              {product.description && product.description.length > 0 ? (
                product.description.map((block: any, index: number) => {
                  if (block.type === "heading") {
                    return (
                      <h3
                        key={index}
                        className={`text-${block.level}xl font-bold`}
                      >
                        {block.children
                          .map((child: any, childIndex: number) => child.text)
                          .join("")}
                      </h3>
                    );
                  } else if (block.type === "paragraph") {
                    return (
                      <p key={index} className="leading-relaxed">
                        {block.children.map(
                          (child: any, childIndex: number) => {
                            if (child.type === "link") {
                              return (
                                <a
                                  key={childIndex}
                                  href={child.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500 underline"
                                >
                                  {child.children
                                    ?.map((linkChild: any) => linkChild.text)
                                    .join("")}
                                </a>
                              );
                            }
                            return child.text;
                          }
                        )}
                      </p>
                    );
                  }
                  return null;
                })
              ) : (
                <p className="text-gray-500">Chưa có mô tả.</p>
              )}
            </div>
          </motion.div>
        </section>

        {/* Đánh giá của khách hàng */}
        <section className="mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-100 p-4 rounded-lg shadow-sm"
          >
            <h3 className="text-lg font-bold text-gray-900">
              Đánh giá của khách hàng
            </h3>
            {reviews?.length > 0 ? (
              reviews.map((review) => (
                <div
                  key={review.id}
                  className="mt-3 p-3 bg-white shadow rounded-lg"
                >
                  <p className="text-gray-900 font-bold">
                    {review.users_permissions_user?.username || "Ẩn danh"}
                  </p>
                  <div className="flex items-center gap-1 text-yellow-500">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} size={16} />
                    ))}
                  </div>
                  <p className="text-gray-700">{review.review}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-600">Chưa có bình luận nào.</p>
            )}
          </motion.div>
        </section>

        {/* Viết đánh giá */}
        <section className="mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-4 rounded-lg shadow-sm"
          >
            <h3 className="text-lg font-bold text-gray-900">
              Viết đánh giá của bạn
            </h3>
            {user ? (
              <div className="mt-4">
                <textarea
                  className="w-full p-2 border rounded-md"
                  rows={4}
                  placeholder="Viết bình luận của bạn..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <div className="flex items-center mt-2">
                  <span className="mr-2">Đánh giá:</span>
                  <select
                    className="p-2 border rounded-md"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                  >
                    {[1, 2, 3, 4, 5].map((star) => (
                      <option key={star} value={star}>
                        {star} sao
                      </option>
                    ))}
                  </select>
                </div>
                <Button
                  onClick={handleSubmitReview}
                  className="mt-4"
                  disabled={!comment.trim()}
                >
                  Gửi bình luận
                </Button>
              </div>
            ) : (
              <div className="mt-4">
                <p className="text-gray-700">
                  Bạn cần đăng nhập để viết bình luận.
                </p>
                <Button
                  onClick={() =>
                    router.push(
                      `/auth/sign-in?redirect=/product/${product.slug}`
                    )
                  }
                  className="mt-2"
                >
                  Đăng nhập
                </Button>
              </div>
            )}
            
          </motion.div>
        </section>
      </main>
    </>
  );
}
