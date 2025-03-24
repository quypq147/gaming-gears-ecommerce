"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Toaster, toast } from "react-hot-toast";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation"; // Cập nhật để lấy search params
import Header from "@/components/header";
import Footer from "@/components/footer";
import placeholderImg from "@/assets/placeholder.png";

export default function ProductClient({ product }: { product: any }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [user, setUser] = useState<any>(null);

  const imageUrl =
    product?.image && product?.image.length > 0
      ? `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${product.image[0].url}`
      : placeholderImg;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch(`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setUser(data))
        .catch(() => setUser(null));
    }
  }, []);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/reviews?filters[product][id][$eq]=${product.id}&populate=user`
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
      setUser(null);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/reviews`, {
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
      });

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

  return (
    <>
      <Header />
      <Toaster position="top-right" />
      <main className="container min-h-screen p-6">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative w-full">
            <Image
              src={imageUrl}
              alt={product.name}
              width={500}
              height={500}
              className="rounded-lg object-cover shadow-md"
              priority
            />
          </div>

          <div className="flex flex-col">
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-lg font-bold text-gray-800 mt-4">{product.price} VND</p>
            <p className="text-gray-700 mt-2">{product.description}</p>
            
            <div className="mt-4 flex gap-4">
              <Button onClick={() => toast.success("Thêm vào giỏ hàng 🛒")} className="flex items-center gap-2">
                <ShoppingCart size={20} />
                Thêm vào giỏ hàng
              </Button>
            </div>
            
            <div className="mt-6 bg-gray-100 p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-bold text-gray-900">Đánh giá của khách hàng</h3>

              {reviews?.length > 0 ? (
                reviews.map((review) => (
                  <div key={review.id} className="mt-3 p-3 bg-white shadow rounded-lg">
                    <p className="text-gray-900 font-bold">{review.attributes.user?.username || "Ẩn danh"}</p>
                    <div className="flex items-center gap-1 text-yellow-500">
                      {Array.from({ length: review.attributes.rating }).map((_, i) => (
                        <Star key={i} size={16} />
                      ))}
                    </div>
                    <p className="text-gray-700">{review.attributes.review}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">Chưa có bình luận nào.</p>
              )}
              
              <div className="mt-4">
                {user ? (
                  <>
                    <textarea value={comment} onChange={(e) => setComment(e.target.value)} className="w-full p-2 border rounded" placeholder="Viết đánh giá..." />
                    <Button onClick={submitReview} className="mt-2">Gửi bình luận</Button>
                  </>
                ) : (
                  <Button onClick={handleLoginRedirect} className="mt-2 w-full bg-blue-500 hover:bg-blue-600">Đăng nhập để bình luận</Button>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}








