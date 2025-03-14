"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import placeholderImg from "@/assets/placeholder.png";
import { Button } from "@/components/ui/button";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Toaster, toast } from "react-hot-toast";

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

  /** ✅ Render Product Description */
  const renderDescription = () => {
    if (!product.description?.length) return <p>No description available.</p>;

    return product.description.map((block: any, index: number) => {
      if (block.type === "heading") {
        return (
          <h2 key={index} className="text-xl font-semibold mt-4">
            {block.children.map((child: any) => child.text).join(" ")}
          </h2>
        );
      }
      return (
        <p key={index} className="text-gray-700">
          {block.children.map((child: any) =>
            child.bold ? <strong key={child.text}>{child.text} </strong> : child.text
          )}
        </p>
      );
    });
  };

  /** ✅ Render Product Specifications */
  const renderSpecifications = () => {
    const specCategories = [
      "vga_spec",
      "mouse_spec",
      "mouse_pad_spec",
      "keyboard_spec",
      "cpu_spec",
      "headphone_spec",
    ];

    return specCategories.map((specKey) => {
      const specData = product[specKey];
      if (!specData) return null;

      return (
        <div key={specKey} className="mt-4">
          <h3 className="text-lg font-bold capitalize">{specKey.replace("_", " ")}:</h3>
          <ul className="list-disc pl-5 text-gray-700">
            {Object.entries(specData).map(([key, value]) => (
              <li key={key}>
                <span className="font-semibold capitalize">{key.replace("_", " ")}:</span> {String(value)}
              </li>
            ))}
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
        <section className="flex flex-col md:flex-row gap-6 relative">
          {/* ✅ Product Image */}
          <div className="w-full md:w-1/2 relative">
            <Image
              src={imageUrl}
              alt={product.name}
              width={500}
              height={500}
              className="rounded-lg object-cover"
              priority
            />
            <button
              onClick={toggleWishlist}
              aria-label="Toggle Wishlist"
              className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
                wishlist.includes(product.slug) ? "text-red-500" : "text-gray-500"
              }`}
            >
              ❤️
            </button>
          </div>

          {/* ✅ Product Details */}
          <div className="w-full md:w-1/2">
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-gray-600 mb-4 capitalize font-bold">
              {product.brand?.brand_name?.toUpperCase() || "Unknown Brand"}
            </p>
            <Button onClick={addToCart} className="w-full md:w-auto">
              Add To Cart
            </Button>

            {/* ✅ Product Specifications */}
            {renderSpecifications()}

            {/* ✅ Product Description */}
            <div className="mt-6">
              <h2 className="text-xl font-bold mb-2">Product Description:</h2>
              {renderDescription()}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}





