"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import Image from "next/image";
import { Button } from "./ui/button";
import placeholderImg from "@/src/assets/placeholder.png";
import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { useWishlistStore } from "@/src/store/wishListstore";
import { useCartStore } from "../store/cartStore";
import { toast } from "react-hot-toast";
import { useMemo } from "react";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    brand: { brand_name: string };
    price: number;
    discountPercent?: number | null; // Can be null
    image: { url: string }[];
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { wishlist, addToWishlist, removeFromWishlist } =
    useWishlistStore();
  const { addToCart } = useCartStore();

  const isWishlisted = useMemo(
    () => wishlist.some((item) => item.id === product.id),
    [wishlist, product.id]
  );

  const imageUrl =
    product.image?.length > 0
      ? `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${product.image[0].url}`
      : placeholderImg;

  // Ensure discountPercent is handled correctly
  const discountPercent = product.discountPercent ?? 0;
  const hasDiscount = discountPercent > 0;
  const finalPrice = hasDiscount
    ? product.price - (product.price * discountPercent) / 100
    : product.price;

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
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="w-full"
    >
      <Card key={product.id} className="w-full relative">
        <CardHeader className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg font-semibold text-black">
              {product.name}
            </CardTitle>
            <p className="text-gray-600 font-bold">
              {product.brand.brand_name}
            </p>
          </div>

          {/* Wishlist Button */}
          <button onClick={toggleWishlist} className="text-red-500">
            <Heart fill={isWishlisted ? "red" : "none"} className="w-6 h-6" />
          </button>
        </CardHeader>

        {/* Image Section */}
        <div className="relative">
          <Image
            src={imageUrl}
            alt={product.name}
            width={300}
            height={200}
            className="w-full h-48 object-cover rounded"
            priority
          />
          {hasDiscount && (
            <Badge variant="destructive" className="absolute top-2 left-2">
              -{discountPercent}%
            </Badge>
          )}
        </div>

        <CardContent>
          <div className="flex items-center gap-2">
            {hasDiscount ? (
              <>
                <p className="text-gray-500 line-through text-sm">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(product.price)}
                </p>
                <p className="text-xl font-bold text-red-500">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(finalPrice)}
                </p>
              </>
            ) : (
              <p className="text-xl font-bold text-black">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(product.price)}
              </p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Link href={`/product/${product.slug}`}>
            <Button variant="outline">Xem chi tiết</Button>
          </Link>
          <Button onClick={handleAddToCart} variant="default">
            <ShoppingCart className="w-5 h-5 mr-2" /> Thêm vào giỏ
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
