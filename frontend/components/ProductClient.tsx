"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Toaster, toast } from "react-hot-toast";
import { Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/header";
import Footer from "@/components/footer";
import placeholderImg from "@/assets/placeholder.png";

export default function ProductClient({ product }: { product: any }) {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cart, setCart] = useState<any[]>([]);

  const imageUrl =
    product.image?.length > 0
      ? `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${product.image[0].url}`
      : placeholderImg;

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        setWishlist(JSON.parse(localStorage.getItem("wishlist") || "[]"));
        setCart(JSON.parse(localStorage.getItem("cart") || "[]"));
      }
    } catch (error) {
      console.error("Error loading data from localStorage", error);
    }
  }, []);

  /** ✅ Toggle Wishlist */
  const toggleWishlist = () => {
    let updatedWishlist;
    if (wishlist.includes(product.slug)) {
      updatedWishlist = wishlist.filter((id) => id !== product.slug);
      toast.success("Removed from Wishlist");
    } else {
      updatedWishlist = [...wishlist, product.slug];
      toast.success("Added to Wishlist ❤️");
    }

    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
  };

  /** ✅ Add to Cart */
  const addToCart = () => {
    const existingProduct = cart.find((item) => item.slug === product.slug);
    let updatedCart;

    if (existingProduct) {
      updatedCart = cart.map((item) =>
        item.slug === product.slug ? { ...item, quantity: item.quantity + 1 } : item
      );
      toast.success("Quantity Updated 🛒");
    } else {
      updatedCart = [...cart, { ...product, quantity: 1 }];
      toast.success("Added to Cart 🛍️");
    }

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  /** ✅ Render Product Specifications */
  const renderSpecifications = () => {
    const specTypes: Record<string, string[]> = {
      cpu_spec: ["cores", "threads", "socket", "cache", "base_clock"],
      vga_spec: ["memory", "clock_speed", "cuda_cores", "interface"],
      keyboard_spec: ["switch_type", "backlight", "connectivity"],
      mouse_spec: ["dpi", "sensor", "weight"],
      headphone_spec: ["driver_size", "frequency_range", "noise_cancellation"],
    };

    return Object.keys(specTypes).map((specKey) => {
      const specData = product[specKey];
      if (!specData) return null;

      return (
        <div key={specKey} className="mt-4 bg-gray-100 p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-bold capitalize text-gray-900">
            {specKey.replace("_", " ")}:
          </h3>
          <ul className="grid grid-cols-2 gap-2 mt-2 text-gray-700">
            {specTypes[specKey].map((key) =>
              specData[key] ? (
                <li key={key} className="flex justify-between">
                  <span className="font-medium capitalize">{key.replace("_", " ")}:</span>
                  <span className="text-gray-900">{String(specData[key])}</span>
                </li>
              ) : null
            )}
          </ul>
        </div>
      );
    });
  };

  return (
    <>
      <Header />
      <Toaster position="top-right" />
      <main className="container min-h-screen p-6">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* ✅ Product Image */}
          <div className="relative w-full">
            <Image
              src={imageUrl}
              alt={product.name}
              width={500}
              height={500}
              className="rounded-lg object-cover shadow-md"
              priority
            />
            <button
              onClick={toggleWishlist}
              aria-label="Toggle Wishlist"
              className={`absolute top-4 right-4 p-2 rounded-full transition-all bg-white shadow-md ${
                wishlist.includes(product.slug) ? "text-red-500" : "text-gray-500"
              }`}
            >
              <Heart size={24} />
            </button>
          </div>

          {/* ✅ Product Details */}
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-gray-600 font-medium text-lg capitalize mt-2">
              {product.brand?.brand_name?.toUpperCase() || "Unknown Brand"}
            </p>

            <div className="mt-4 flex gap-4">
              <Button onClick={addToCart} className="flex items-center gap-2">
                <ShoppingCart size={20} />
                Add To Cart
              </Button>
            </div>

            {/* ✅ Product Specifications */}
            <div className="mt-6">{renderSpecifications()}</div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}






