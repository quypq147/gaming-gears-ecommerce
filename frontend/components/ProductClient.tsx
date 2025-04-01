"use client";

import {
  useState,
  useEffect,
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
} from "react";
import Image from "next/image";
import { Toaster, toast } from "react-hot-toast";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import placeholderImg from "@/assets/placeholder.png";
import { useWishlistCart } from "@/context/WishlistCartContext";
import { motion } from "framer-motion";
import { useUserStore } from "@/store/userStore";


export default function ProductClient({ product }: { product: any }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { wishlist, addToWishlist, removeFromWishlist, addToCart } =
    useWishlistCart();
  const [reviews, setReviews] = useState<any[]>([]);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const user = useUserStore((state) => state.user);

  const imageUrl =
    product?.image && product?.image.length > 0
      ? `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${product.image[0].url}`
      : placeholderImg;

  

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/rating-products?filters[product][id][$eq]=${product.id}&populate=user`
        );
        const data = await res.json();
        setReviews(data.data);
      } catch (error) {
        console.error("Failed to fetch reviews", error);
      }
    }
    fetchReviews();
  }, [product.id]);

  const handleLoginRedirect = () => {
    router.push(`/sign-in?redirect=/product/${product.slug}`);
  };

  const submitReview = async () => {
    if (!user) {
      toast.error("Bạn cần đăng nhập để bình luận.");
      return;
    }

    if (!comment.trim()) {
      toast.error("Vui lòng nhập nội dung bình luận.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại.");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/rating-products`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            data: {
              review: comment,
              rating: rating,
              product: product.id,
              user: user.id,
            },
          }),
        }
      );

      if (res.ok) {
        toast.success("Bình luận đã được gửi!");
        setComment("");
        setRating(5);
        const newReview = await res.json();
        setReviews([...reviews, newReview.data]);
      } else {
        toast.error("Lỗi khi gửi bình luận.");
      }
    } catch (error) {
      console.error("Lỗi khi gửi bình luận", error);
      toast.error("Đã xảy ra lỗi.");
    }
  };

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

  const handleAddToCart = () => {
    addToCart(product);
    toast.success("Đã thêm vào giỏ hàng");
  };

  return (
    <>
      <Header />
      <Toaster position="top-right" />
      <main className="container min-h-screen p-6">
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
              {product.description?.length > 0 ? (
                product.description.map(
                  (
                    block: { type: string; children: any[] },
                    index: Key | null | undefined
                  ) =>
                    block.type === "heading" ? (
                      <h2 key={index} className="text-xl font-bold mt-4">
                        {block.children
                          .map((child: { text: any }) => child.text)
                          .join(" ")}
                      </h2>
                    ) : (
                      <p key={index} className="leading-relaxed">
                        {block.children.map(
                          (
                            child: {
                              bold: any;
                              text:
                                | string
                                | number
                                | bigint
                                | boolean
                                | ReactElement<
                                    unknown,
                                    string | JSXElementConstructor<any>
                                  >
                                | Iterable<ReactNode>
                                | ReactPortal
                                | Promise<
                                    | string
                                    | number
                                    | bigint
                                    | boolean
                                    | ReactPortal
                                    | ReactElement<
                                        unknown,
                                        string | JSXElementConstructor<any>
                                      >
                                    | Iterable<ReactNode>
                                    | null
                                    | undefined
                                  >
                                | null
                                | undefined;
                            },
                            i: Key | null | undefined
                          ) =>
                            child.bold ? (
                              <strong key={i}>{child.text}</strong>
                            ) : (
                              child.text
                            )
                        )}
                      </p>
                    )
                )
              ) : (
                <p className="text-gray-500">Chưa có mô tả.</p>
              )}
            </div>
          </motion.div>
        </section>

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
                    {review.attributes.user?.username || "Ẩn danh"}
                  </p>
                  <div className="flex items-center gap-1 text-yellow-500">
                    {Array.from({ length: review.attributes.rating }).map(
                      (_, i) => (
                        <Star key={i} size={16} />
                      )
                    )}
                  </div>
                  <p className="text-gray-700">{review.attributes.review}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-600">Chưa có bình luận nào.</p>
            )}
          </motion.div>
        </section>

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
                  onClick={submitReview}
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
                <Button onClick={handleLoginRedirect} className="mt-2">
                  Đăng nhập
                </Button>
              </div>
            )}
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}
